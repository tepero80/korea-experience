const fs = require('fs');
const path = require('path');

const toolsDir = path.join(__dirname, '..', 'app', 'tools');
const dirs = fs.readdirSync(toolsDir).filter(d => {
  const fullPath = path.join(toolsDir, d);
  return fs.statSync(fullPath).isDirectory() && d !== '[slug]';
});

// Clean name: take part before | or -, strip emojis, trim
function cleanName(name) {
  // Split by | first, then by -
  let clean = name.split('|')[0].trim();
  // Remove emojis
  clean = clean.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{27BF}\u{2702}-\u{27B0}\u{FE00}-\u{FE0F}\u{1F900}-\u{1F9FF}\u{200D}\u{20E3}\u{FE0F}\u{E0020}-\u{E007F}\u{2764}\u{1FA70}-\u{1FAFF}✨💕💖🎭🏷️💼🏙️🍜💑👫🎤⌨️🔮🎮🎂✈️🏥🏪🏢💄🪖✨]/gu, '').trim();
  // Remove trailing - if any
  clean = clean.replace(/\s*-\s*$/, '').trim();
  return clean;
}

let fixed = 0;
for (const dir of dirs) {
  const layoutPath = path.join(toolsDir, dir, 'layout.tsx');
  if (!fs.existsSync(layoutPath)) continue;

  let content = fs.readFileSync(layoutPath, 'utf-8');

  // Find current name in generateWebApplicationSchema call
  const nameMatch = content.match(/generateWebApplicationSchema\(\{[\s\S]*?name:\s*'([^']+)'/);
  if (!nameMatch) continue;

  const currentName = nameMatch[1];
  const cleanedName = cleanName(currentName);

  if (currentName !== cleanedName) {
    // Also fix in breadcrumbSchema
    content = content.replace(
      `name: '${currentName}',\n    description:`,
      `name: '${cleanedName}',\n    description:`
    );
    // Fix breadcrumb last item
    content = content.replace(
      `{ name: '${currentName}', item:`,
      `{ name: '${cleanedName}', item:`
    );
    fs.writeFileSync(layoutPath, content);
    console.log(`🔧 ${dir}: "${currentName}" → "${cleanedName}"`);
    fixed++;
  } else {
    // console.log(`✅ ${dir}: "${currentName}" — OK`);
  }
}

console.log(`\n📊 Fixed ${fixed} tool names`);
