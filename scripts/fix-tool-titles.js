const fs = require('fs');
const path = require('path');

// Tools that need title shortening (> 70 chars)
const titleFixes = {
  'couple-name': "Korean Couple Name Combiner - Cute Nicknames | Korea Experience",
  'korean-beauty-quiz': "Korean Beauty Routine Quiz | K-Beauty Skincare | Korea Experience",
  'love-compatibility': "Korean Love Compatibility - Zodiac & Blood Type | Korea Experience",
  'military-service': "Korean Military Service Calculator | Korea Experience",
  'kdrama-romance-trope': "Your K-Drama Romance Trope | Love Story Quiz | Korea Experience",
  'korean-age': "Korean Age & Zodiac Sign Calculator | Korea Experience",
  'guess-korean-food': "Guess Korean Food Quiz | Test K-Food Knowledge | Korea Experience",
  'emoji-name': "Korean Emoji Name Generator | Transform Your Name | Korea Experience",
  'korean-zodiac-fortune': "Korean Zodiac Fortune | Daily Horoscope by 띠 | Korea Experience",
  'kpop-stage-name': "K-Pop Stage Name Generator - Your Idol Name | Korea Experience",
  'korean-name': "Korean Name Generator | Get Your Korean Name | Korea Experience",
};

const toolsDir = path.join(process.cwd(), 'app', 'tools');
let fixed = 0;
let errors = [];

const toolDirs = fs.readdirSync(toolsDir, { withFileTypes: true })
  .filter(d => d.isDirectory())
  .map(d => d.name);

for (const toolName of toolDirs) {
  const layoutPath = path.join(toolsDir, toolName, 'layout.tsx');
  if (!fs.existsSync(layoutPath)) continue;
  
  let content = fs.readFileSync(layoutPath, 'utf8');
  
  // Find current title
  const titleMatch = content.match(/title:\s*'([^']+)'/);
  if (!titleMatch) continue;
  
  const currentTitle = titleMatch[1];
  
  // If this tool needs a title fix
  if (titleFixes[toolName]) {
    const newTitle = titleFixes[toolName];
    if (newTitle.length > 70) {
      errors.push(`STILL OVER 70: ${toolName} -> "${newTitle}" (${newTitle.length})`);
      continue;
    }
    // Replace first occurrence of title (metadata.title)
    content = content.replace(`title: '${currentTitle}'`, `title: '${newTitle}'`);
    console.log(`✓ TITLE ${currentTitle.length} -> ${newTitle.length} | ${toolName}`);
    console.log(`  "${currentTitle}" → "${newTitle}"`);
  }
  
  // For ALL tools: check if openGraph.title also needs updating
  const ogMatch = content.match(/openGraph:\s*\{[^}]*title:\s*'([^']+)'/s);
  if (ogMatch && ogMatch[1].length > 70) {
    // Shorten OG title too (can be same as main title or shorter)
    const ogOld = ogMatch[1];
    // OG titles can include emojis and be slightly different, just check length
    console.log(`  ⚠️ OG title also long (${ogOld.length}): ${toolName}`);
  }
  
  fs.writeFileSync(layoutPath, content, 'utf8');
  if (titleFixes[toolName]) fixed++;
}

console.log(`\n=== DONE: ${fixed} tool titles fixed ===`);
if (errors.length > 0) {
  console.log('ERRORS:');
  errors.forEach(e => console.log(`  ${e}`));
}

// Verify all titles
console.log('\n=== Verification ===');
for (const toolName of toolDirs) {
  const layoutPath = path.join(toolsDir, toolName, 'layout.tsx');
  if (!fs.existsSync(layoutPath)) continue;
  const content = fs.readFileSync(layoutPath, 'utf8');
  const m = content.match(/title:\s*'([^']+)'/);
  if (m) {
    const len = m[1].length;
    const flag = len > 70 ? '❌' : '✓';
    if (len > 70) console.log(`${flag} ${len} | ${toolName}: ${m[1]}`);
  }
}
console.log('All tool titles verified.');
