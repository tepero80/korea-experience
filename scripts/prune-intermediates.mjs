import fs from 'node:fs';
import path from 'node:path';
const workspace = fs.realpathSync('.'),
  publicRoot = fs.realpathSync('public/images'),
  recovery = 'C:/Projects/korea-experience-recovery-2026-10-30/media-intermediates';
const references = [];
function read(dir) {
  for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, f.name);
    if (f.isDirectory()) read(p);
    else if (/\.(md|tsx?|css|json|mjs)$/.test(p)) references.push(fs.readFileSync(p, 'utf8'));
  }
}
for (const d of ['app', 'components', 'content', 'lib', 'hooks', 'data']) read(d);
const haystack = references.join('\n');
const files = fs
  .readdirSync(publicRoot)
  .filter((f) => /-raw\.(webp|png|jpe?g)$/.test(f) && !haystack.includes(f));
console.log(
  JSON.stringify(
    {
      unreferencedIntermediates: files,
      mode: process.argv.includes('--apply') ? 'preserve-outside-public' : 'report-only',
    },
    null,
    2,
  ),
);
if (process.argv.includes('--apply')) {
  if (publicRoot !== path.join(workspace, 'public', 'images'))
    throw Error('Unexpected image root.');
  fs.mkdirSync(recovery, { recursive: true });
  for (const name of files) {
    if (path.basename(name) !== name) throw Error('Unexpected filename.');
    const source = path.join(publicRoot, name),
      target = path.join(recovery, name);
    if (fs.existsSync(target)) throw Error('Recovery copy already exists; review manually.');
    fs.renameSync(source, target);
  }
}
