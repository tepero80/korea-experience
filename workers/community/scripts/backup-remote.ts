import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { unstable_readConfig } from 'wrangler';

const target = process.argv[2];
if (!['staging', 'production'].includes(target)) throw Error('Choose staging or production.');
const config = unstable_readConfig({ config: 'wrangler.jsonc', env: target });
const name =
  target === 'staging' ? 'korea-experience-community-staging' : 'korea-experience-community';
if (
  config.name !== name ||
  config.d1_databases.length !== 1 ||
  config.d1_databases[0].database_name !== name
)
  throw Error('Unexpected database configuration.');
const directory = path.resolve('../../.private/reports');
fs.mkdirSync(directory, { recursive: true });
const file = path.join(
  directory,
  `${name}-${new Date().toISOString().replace(/[:.]/g, '-')}-${crypto.randomUUID()}.sql`,
);
const exported = spawnSync(
  process.execPath,
  [
    'node_modules/wrangler/bin/wrangler.js',
    'd1',
    'export',
    name,
    '--env',
    target,
    '--remote',
    '--output',
    file,
  ],
  { encoding: 'utf8', maxBuffer: 4 * 1024 * 1024 },
);
// Wrangler prints a temporary signed download URL. Never forward it to chat or CI logs.
if (exported.status !== 0)
  throw Error('Remote backup failed; no restore or database write was attempted.');
const verified = spawnSync(
  process.execPath,
  ['--import', 'tsx', 'scripts/verify-backup.ts', file],
  { encoding: 'utf8', maxBuffer: 4 * 1024 * 1024 },
);
if (verified.status !== 0)
  throw Error('Private export retained, but isolated restore verification failed.');
console.log(verified.stdout.trim());
