const fs = require('fs');
const path = require('path');

function scanDir(dir, label) {
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.md'));
  const results = [];
  
  for (const f of files) {
    const content = fs.readFileSync(path.join(dir, f), 'utf8').replace(/\r\n/g, '\n');
    const fmMatch = content.match(/^---\n([\s\S]*?)\n---/);
    if (!fmMatch) continue;
    const fm = fmMatch[1];
    const titleMatch = fm.match(/title:\s*"([^"]+)"/);
    const excerptMatch = fm.match(/excerpt:\s*"([^"]+)"/);
    const title = titleMatch ? titleMatch[1] : '';
    const excerpt = excerptMatch ? excerptMatch[1] : '';
    
    // Flag short/meaningless titles (< 35 chars might be too generic)
    if (title.length < 40 || title.length > 70) {
      results.push({ file: f, titleLen: title.length, title, excerptLen: excerpt.length });
    }
  }
  
  if (results.length > 0) {
    console.log(`\n=== ${label}: Titles that may need review (< 40 chars or > 70 chars) ===`);
    results.sort((a, b) => a.titleLen - b.titleLen);
    results.forEach(r => {
      console.log(`  ${r.titleLen} chars | ${r.file}`);
      console.log(`    "${r.title}"`);
    });
  }
}

scanDir('content/deep-dive', 'Deep Dive');
scanDir('content/posts', 'AI Posts');
