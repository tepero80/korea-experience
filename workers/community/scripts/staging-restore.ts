import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { DatabaseSync } from 'node:sqlite';
import { unstable_readConfig } from 'wrangler';
import { verifyAuthSchema } from './verify-backup';

// This drill touches only disposable fixtures in the dedicated staging database.
const stage = unstable_readConfig({ config: 'wrangler.jsonc', env: 'staging' });
const name = 'korea-experience-community-staging';
if (
  stage.name !== name ||
  stage.routes?.length ||
  stage.d1_databases?.[0]?.database_name !== name ||
  stage.d1_databases?.[0]?.database_id !== '0a448aa2-0840-42ef-a2c3-7594a8abe9f3'
)
  throw Error('Refusing to run outside the dedicated staging database.');
const reports = path.resolve('../../.private/reports');
fs.mkdirSync(reports, { recursive: true });
const marker = 'restore-' + crypto.randomUUID();
const backup = path.join(reports, marker + '.sql');
const cli = (args: string[]) =>
  execFileSync(process.execPath, ['node_modules/wrangler/bin/wrangler.js', ...args], {
    encoding: 'utf8',
    maxBuffer: 8_000_000,
    env: { ...process.env, NO_COLOR: '1' },
  });
const execute = (sql: string) =>
  cli(['d1', 'execute', name, '--env', 'staging', '--remote', '--command', sql, '--json']);
let cleanupPassed = false;
try {
  execute(`INSERT INTO profile(id,name) VALUES ('${marker}','Disposable restore marker');
    INSERT INTO plan(id,profile_id,title,data) VALUES ('${marker}-plan','${marker}','Disposable restore plan','{"notes":"restore proof only"}');
    INSERT INTO contribution(id,profile_id,kind,title,body,status,author_type) VALUES ('${marker}-post','${marker}','question','Disposable restore fixture','Never publish this restore fixture.','pending','editorial');`);
  cli(['d1', 'export', name, '--env', 'staging', '--remote', '--output', backup]);
} finally {
  execute(
    `DELETE FROM contribution WHERE id='${marker}-post'; DELETE FROM profile WHERE id='${marker}';`,
  );
  cleanupPassed = true;
}
const restored = new DatabaseSync(':memory:');
try {
  restored.exec(fs.readFileSync(backup, 'utf8'));
  await verifyAuthSchema(restored);
  const row = restored
    .prepare(
      'SELECT p.name,pl.title,c.status,c.author_type FROM profile p JOIN plan pl ON pl.profile_id=p.id JOIN contribution c ON c.profile_id=p.id WHERE p.id=?',
    )
    .get(marker);
  const migrations = restored.prepare('SELECT name FROM d1_migrations ORDER BY name').all();
  const integrity = restored.prepare('PRAGMA integrity_check').get();
  const foreignKeys = restored.prepare('PRAGMA foreign_key_check').all();
  if (
    !row ||
    row.name !== 'Disposable restore marker' ||
    row.status !== 'pending' ||
    row.author_type !== 'editorial' ||
    migrations.length !== 3 ||
    integrity?.integrity_check !== 'ok' ||
    foreignKeys.length
  )
    throw Error('The isolated restoration failed validation.');
  const proof = {
    at: new Date().toISOString(),
    database: name,
    backup,
    restoredInto: 'isolated in-memory SQLite',
    marker,
    migrations,
    integrity,
    relatedFixtureRestored: true,
    foreignKeyViolations: foreignKeys.length,
    cleanupPassed,
    authSchemaMatches: true,
    passed: true,
    scope: 'Remote staging export and isolated restore; no production database modified.',
  };
  fs.writeFileSync(
    path.join(reports, 'staging-restore-latest.json'),
    JSON.stringify(proof, null, 2),
  );
  console.log(JSON.stringify(proof, null, 2));
} finally {
  restored.close();
}
