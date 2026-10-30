import { DatabaseSync } from 'node:sqlite';
import { getMigrations } from 'better-auth/db/migration';
import { writeFileSync, mkdirSync, readFileSync } from 'node:fs';
import { authOptions } from '../src/auth';
const sqlite = new DatabaseSync(':memory:');
const options = authOptions({
  DB: sqlite as any,
  SITE_URL: 'http://localhost:8787',
  BETTER_AUTH_SECRET: 'schema-generation-only-32-characters-minimum',
  COMMUNITY_ENABLED: 'false',
  MAIL_DAILY_LIMIT: '90',
  MAIL_MONTHLY_LIMIT: '2700',
});
const plan = await getMigrations({ ...options, database: sqlite });
if (plan.unsafeChanges.length || plan.schemaProblems.length) throw Error(JSON.stringify(plan));
mkdirSync('migrations', { recursive: true });
const expected =
  '-- Generated from better-auth 1.7.14 and src/auth.ts. Do not hand edit.\n' +
  (await plan.compileMigrations());
if (process.argv.includes('--check')) {
  if (
    readFileSync('migrations/0001_auth.sql', 'utf8').replaceAll('\r\n', '\n') !==
    expected.replaceAll('\r\n', '\n')
  )
    throw Error(
      'Authentication options differ from the committed schema. Review a migration before deployment.',
    );
} else writeFileSync('migrations/0001_auth.sql', expected);
sqlite.close();
console.log(
  process.argv.includes('--check')
    ? 'Pinned authentication schema matches.'
    : 'Generated pinned authentication schema.',
);
