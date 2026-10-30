import fs from 'node:fs';
import path from 'node:path';
const root = path.resolve('out');
if (!fs.existsSync(root)) throw Error('No clean export found.');
const files = [];
function scan(dir) {
  for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, f.name);
    if (f.isDirectory()) scan(p);
    else files.push({ path: path.relative(root, p), bytes: fs.statSync(p).size });
  }
}
scan(root);
const count = files.length,
  total = files.reduce((s, f) => s + f.bytes, 0),
  largest = [...files].sort((a, b) => b.bytes - a.bytes).slice(0, 8),
  byType = {};
for (const f of files) {
  const ext = path.extname(f.path) || '(no extension)';
  const group = (byType[ext] ||= { files: 0, bytes: 0 });
  group.files++;
  group.bytes += f.bytes;
}
const baseline = JSON.parse(fs.readFileSync('data/export-baseline.json', 'utf8'));
const report = {
  at: new Date().toISOString(),
  count,
  totalBytes: total,
  deltaFiles: count - baseline.files,
  largest,
  byType,
};
fs.mkdirSync('.private/reports', { recursive: true });
fs.writeFileSync('.private/reports/export-budget.json', JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
if (largest.some((f) => f.bytes > 25 * 1024 * 1024))
  throw Error('A deployment file exceeds 25MiB.');
if (count >= 20000 || (count >= 16000 && count > baseline.files))
  throw Error('Hosting file budget exceeded. Reduce exported files before ordinary deployment.');
if (count >= 14000) console.warn('Export warning: at least 14,000 files. Review six-month growth.');
