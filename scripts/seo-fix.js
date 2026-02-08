const fs = require('fs');
const path = require('path');

function shortenTitle(title) {
  if (title.length <= 70) return title;
  
  // Try cutting at colon, then dash, then comma before 70 chars
  const cutPoints = [': ', ' - ', ' — ', ' | ', ', '];
  for (const sep of cutPoints) {
    const lastIdx = title.lastIndexOf(sep, 70);
    if (lastIdx > 20) { // Don't cut too early
      const shortened = title.substring(0, lastIdx);
      if (shortened.length <= 70) return shortened;
    }
  }
  
  // Try cutting at the first colon/dash even if it's after position 20
  for (const sep of [': ', ' - ', ' — ']) {
    const idx = title.indexOf(sep);
    if (idx > 0 && idx <= 68) {
      return title.substring(0, idx);
    }
  }
  
  // Remove common trailing patterns to shorten
  let shortened = title;
  const removals = [
    / \(.*?\)$/,          // Remove trailing parenthetical
    / in 2026$/i,
    / 2026$/,
    / Guide$/i,
    / - Complete Guide$/i,
    /: Complete Guide$/i,
  ];
  for (const pattern of removals) {
    if (shortened.length > 70) {
      shortened = shortened.replace(pattern, '');
    }
  }
  if (shortened.length <= 70) return shortened;
  
  // Last resort: cut at last space before 67 chars and add "..."
  const lastSpace = shortened.lastIndexOf(' ', 67);
  if (lastSpace > 20) {
    return shortened.substring(0, lastSpace) + '...';
  }
  return shortened.substring(0, 67) + '...';
}

function shortenExcerpt(excerpt) {
  if (excerpt.length <= 160) return excerpt;
  
  // Try to cut at sentence end (. ! ?) before 160 chars
  const sub = excerpt.substring(0, 160);
  const sentenceEnd = Math.max(
    sub.lastIndexOf('. '),
    sub.lastIndexOf('! '),
    sub.lastIndexOf('? ')
  );
  if (sentenceEnd > 60) {
    return excerpt.substring(0, sentenceEnd + 1);
  }
  
  // Try ending at the last period
  const lastPeriod = sub.lastIndexOf('.');
  if (lastPeriod > 60) {
    return excerpt.substring(0, lastPeriod + 1);
  }
  
  // Cut at last comma or space
  const lastComma = sub.lastIndexOf(', ', 155);
  if (lastComma > 60) {
    return excerpt.substring(0, lastComma) + '.';
  }
  
  const lastSpace = sub.lastIndexOf(' ', 157);
  if (lastSpace > 60) {
    return excerpt.substring(0, lastSpace) + '...';
  }
  
  return excerpt.substring(0, 157) + '...';
}

function processDir(dir, label) {
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.md'));
  let titleFixed = 0, excerptFixed = 0, errors = [];
  
  for (const f of files) {
    const filePath = path.join(dir, f);
    let content = fs.readFileSync(filePath, 'utf8');
    const original = content;
    
    // Extract frontmatter
    const normalizedForParse = content.replace(/\r\n/g, '\n');
    const fmMatch = normalizedForParse.match(/^---\n([\s\S]*?)\n---/);
    if (!fmMatch) continue;
    
    const fm = fmMatch[1];
    
    // Check title
    const titleMatch = fm.match(/title:\s*"([^"]+)"/);
    if (titleMatch && titleMatch[1].length > 70) {
      const oldTitle = titleMatch[1];
      const newTitle = shortenTitle(oldTitle);
      if (newTitle.length > 70) {
        errors.push(`TITLE STILL LONG (${newTitle.length}): ${f} -> "${newTitle}"`);
      } else {
        content = content.replace(`title: "${oldTitle}"`, `title: "${newTitle}"`);
        titleFixed++;
        console.log(`  TITLE ${oldTitle.length} -> ${newTitle.length} | ${f}`);
        console.log(`    OLD: ${oldTitle}`);
        console.log(`    NEW: ${newTitle}`);
      }
    }
    
    // Check excerpt
    const excerptMatch = fm.match(/excerpt:\s*"([^"]+)"/);
    if (excerptMatch && excerptMatch[1].length > 160) {
      const oldExcerpt = excerptMatch[1];
      const newExcerpt = shortenExcerpt(oldExcerpt);
      if (newExcerpt.length > 160) {
        errors.push(`EXCERPT STILL LONG (${newExcerpt.length}): ${f}`);
      } else {
        content = content.replace(`excerpt: "${oldExcerpt}"`, `excerpt: "${newExcerpt}"`);
        excerptFixed++;
        console.log(`  EXCERPT ${oldExcerpt.length} -> ${newExcerpt.length} | ${f}`);
      }
    }
    
    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
    }
  }
  
  console.log(`\n=== ${label} SUMMARY ===`);
  console.log(`Titles fixed: ${titleFixed}`);
  console.log(`Excerpts fixed: ${excerptFixed}`);
  if (errors.length > 0) {
    console.log(`\nERRORS (need manual fix):`);
    errors.forEach(e => console.log(`  ${e}`));
  }
}

console.log('=== Processing Deep Dive ===');
processDir('content/deep-dive', 'Deep Dive');
console.log('\n=== Processing AI Posts ===');
processDir('content/posts', 'AI Posts');
