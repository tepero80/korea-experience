/**
 * Fix all tool layout.tsx files:
 * 1. Use title: { absolute: '...' } to prevent template duplication
 * 2. Ensure all titles include "| Korea Experience" and are ≤70 chars
 */
const fs = require('fs');
const path = require('path');

const toolsDir = path.join(__dirname, '..', 'app', 'tools');

// Map: tool folder → desired absolute title (all must be ≤70 chars and include "| Korea Experience")
const titleOverrides = {
  // 5 tools that currently lack "| Korea Experience" — add it (shorten if needed)
  'ideal-korean-partner': 'Your Ideal Korean Partner Type | Korea Experience', // 50
  'korean-city-quiz': 'Which Korean City Should You Live In? | Korea Experience', // 57
  'korean-typing-test': 'Korean Typing Speed Test | Hangul Skills | Korea Experience', // 60
  'medical-cost-estimator': 'Medical Tourism Cost Estimator | Korea Experience', // 50
  'trip-budget': 'Korea Trip Budget Calculator | Korea Experience', // 48
};

const dirs = fs.readdirSync(toolsDir).filter(d => {
  const stat = fs.statSync(path.join(toolsDir, d));
  return stat.isDirectory() && d !== '[slug]';
});

let fixed = 0;
let errors = [];

for (const d of dirs) {
  const layoutPath = path.join(toolsDir, d, 'layout.tsx');
  if (!fs.existsSync(layoutPath)) continue;

  let content = fs.readFileSync(layoutPath, 'utf8');

  // Match title: 'xxx' or title: "xxx" or title: `xxx`
  const titleMatch = content.match(/title:\s*(['"`])([^'"`]+)\1/);
  if (!titleMatch) {
    console.log(`⚠ ${d}: no simple title found, skipping`);
    continue;
  }

  const quote = titleMatch[1];
  const oldTitle = titleMatch[2];

  // Already uses absolute? Skip
  if (content.includes('title: { absolute:') || content.includes("title: {absolute:")) {
    console.log(`⊘ ${d}: already uses absolute title, skipping`);
    continue;
  }

  // Determine new title
  let newTitle;
  if (titleOverrides[d]) {
    newTitle = titleOverrides[d];
  } else {
    // Keep existing title (should already include "| Korea Experience")
    newTitle = oldTitle;
  }

  if (newTitle.length > 70) {
    errors.push(`✗ ${d}: title still >70 chars (${newTitle.length}): "${newTitle}"`);
    continue;
  }

  // Replace: title: 'xxx' → title: { absolute: 'xxx' }
  const oldPattern = `title: ${quote}${oldTitle}${quote}`;
  const newPattern = `title: { absolute: '${newTitle.replace(/'/g, "\\'")}' }`;

  // Only replace the FIRST occurrence (which is the metadata title, not OG/twitter)
  const idx = content.indexOf(oldPattern);
  if (idx === -1) {
    errors.push(`✗ ${d}: could not find title pattern`);
    continue;
  }

  content = content.substring(0, idx) + newPattern + content.substring(idx + oldPattern.length);
  fs.writeFileSync(layoutPath, content, 'utf8');

  const label = titleOverrides[d] ? '(+KE)' : '(abs)';
  console.log(`✓ ${d.padEnd(25)} ${label} ${String(newTitle.length).padStart(2)} chars | "${newTitle}"`);
  fixed++;
}

console.log(`\n=== DONE: ${fixed} tool titles made absolute ===`);
if (errors.length) {
  console.log('\nErrors:');
  errors.forEach(e => console.log(e));
}

// Verification
console.log('\n=== Verification ===');
let allOk = true;
for (const d of dirs) {
  const layoutPath = path.join(toolsDir, d, 'layout.tsx');
  if (!fs.existsSync(layoutPath)) continue;
  const content = fs.readFileSync(layoutPath, 'utf8');
  const absMatch = content.match(/title:\s*\{\s*absolute:\s*'([^']+)'\s*\}/);
  if (!absMatch) {
    console.log(`✗ ${d}: NOT using absolute title!`);
    allOk = false;
    continue;
  }
  const t = absMatch[1];
  if (t.length > 70) {
    console.log(`✗ ${d}: ${t.length} chars > 70: "${t}"`);
    allOk = false;
  } else if (!t.includes('Korea Experience')) {
    console.log(`✗ ${d}: missing "Korea Experience"`);
    allOk = false;
  }
}
if (allOk) console.log('All tool titles verified: absolute, ≤70 chars, includes "Korea Experience".');
