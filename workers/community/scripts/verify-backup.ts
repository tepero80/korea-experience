import fs from 'node:fs';
import path from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { createHash } from 'node:crypto';
import { getMigrations } from 'better-auth/db/migration';
import { authOptions } from '../src/auth';

export async function verifyAuthSchema(database: DatabaseSync) {
  const plan = await getMigrations({
    ...authOptions({
      DB: database as any,
      SITE_URL: 'http://localhost:8787',
      BETTER_AUTH_SECRET: 'isolated-backup-verification-fixture-only-32-bytes',
      COMMUNITY_ENABLED: 'false',
      MAIL_DAILY_LIMIT: '90',
      MAIL_MONTHLY_LIMIT: '2700',
    }),
    database,
  });
  if (
    plan.toBeCreated.length ||
    plan.toBeAdded.length ||
    plan.toBeAddedIndexes.length ||
    plan.unsafeChanges.length ||
    plan.schemaProblems.length
  )
    throw Error('Restored authentication schema differs from the pinned configuration.');
}

// Read a private export; all SQL executes only inside an isolated memory database.
if (process.argv[1]?.replaceAll('\\', '/').endsWith('/verify-backup.ts')) {
  const privateRoot = path.resolve('../../.private') + path.sep;
  const file = fs.realpathSync(path.resolve(process.argv[2] || ''));
  if (!file.toLowerCase().startsWith(privateRoot.toLowerCase()) || !file.endsWith('.sql'))
    throw Error('Choose a SQL export within this project private directory.');
  const source = fs.readFileSync(file, 'utf8');
  const database = new DatabaseSync(':memory:');
  try {
    database.exec(source);
    await verifyAuthSchema(database);
    const expected = fs
      .readdirSync('migrations')
      .filter((n) => n.endsWith('.sql'))
      .sort();
    // A pre-upgrade backup must match its explicitly selected historical schema.
    // The default remains strict: every checked-in migration must be present.
    const historyFlag = process.argv
      .slice(3)
      .find((arg) => arg.startsWith('--expected-migrations='));
    const expectedCount = historyFlag
      ? Number(historyFlag.slice('--expected-migrations='.length))
      : expected.length;
    if (!Number.isInteger(expectedCount) || expectedCount < 1 || expectedCount > expected.length)
      throw Error('Choose an existing nonempty migration-history length.');
    const applied = database
      .prepare('SELECT name FROM d1_migrations ORDER BY name')
      .all()
      .map((r) => r.name);
    const integrity = database.prepare('PRAGMA integrity_check').get()?.integrity_check;
    const violations = database.prepare('PRAGMA foreign_key_check').all().length;
    if (
      JSON.stringify(applied) !== JSON.stringify(expected.slice(0, expectedCount)) ||
      integrity !== 'ok' ||
      violations
    )
      throw Error('Backup integrity or migration history failed verification.');
    const proof = {
      at: new Date().toISOString(),
      file,
      sha256: createHash('sha256').update(source).digest('hex'),
      isolatedRestore: true,
      authSchemaMatches: true,
      migrations: applied,
      pendingMigrations: expected.slice(expectedCount),
      schemaCurrent: expectedCount === expected.length,
      integrity,
      foreignKeyViolations: violations,
      passed: true,
    };
    fs.writeFileSync(file + '.verification.json', JSON.stringify(proof, null, 2));
    console.log(JSON.stringify(proof, null, 2));
  } finally {
    database.close();
  }
}
