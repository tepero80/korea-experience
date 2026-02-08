const fs = require('fs');
const path = require('path');

function scanDir(dir, label) {
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.md'));
  let titleOver = 0, excerptOver = 0, excerptMissing = 0;
  const titleIssues = [];
  const excerptIssues = [];
  
  for (const f of files) {
    const content = fs.readFileSync(path.join(dir, f), 'utf8').replace(/\r\n/g, '\n');
    const frontmatter = content.match(/^---\n([\s\S]*?)\n---/);
    if (!frontmatter) { continue; }
    
    const fm = frontmatter[1];
    const titleMatch = fm.match(/title:\s*"([^"]+)"/);
    const excerptMatch = fm.match(/excerpt:\s*"([^"]+)"/);
    
    const title = titleMatch ? titleMatch[1] : '';
    const excerpt = excerptMatch ? excerptMatch[1] : '';
    
    if (title.length > 70) {
      titleOver++;
      titleIssues.push({ file: f, len: title.length });
    }
    if (!excerpt) {
      excerptMissing++;
    } else if (excerpt.length > 160) {
      excerptOver++;
      excerptIssues.push({ file: f, len: excerpt.length });
    }
  }
  
  console.log(`\n=== ${label} (${files.length} files) ===`);
  console.log(`Title > 70 chars: ${titleOver}`);
  console.log(`Excerpt > 160 chars: ${excerptOver}`);
  console.log(`Excerpt missing: ${excerptMissing}`);
  
  if (titleIssues.length > 0) {
    console.log(`\n[TITLE ISSUES]`);
    titleIssues.forEach(t => console.log(`  ${t.len} chars | ${t.file}`));
  }
  if (excerptIssues.length > 0) {
    console.log(`\n[EXCERPT ISSUES]`);
    excerptIssues.forEach(e => console.log(`  ${e.len} chars | ${e.file}`));
  }
}

scanDir('content/deep-dive', 'Deep Dive');
scanDir('content/posts', 'AI Posts');
