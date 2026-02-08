const fs = require('fs');
const path = require('path');

// Explicit name fixes: slug -> clean name (from ALL_TOOLS)
const nameOverrides = {
  'convenience-store-meals': 'Convenience Store Meal Builder',
  'guess-korean-food': 'Guess the Korean Food Photo Quiz',
  'korea-job-quiz': 'What Would Your Job Be in Korea?',
  'korean-age': 'Korean Age Calculator',
  'korean-city-quiz': 'Which Korean City Should You Live In?',
  'korean-food-quiz': 'What Korean Food Matches You?',
  'korean-name': 'Korean Name Generator',
  'kpop-stage-name': 'K-Pop Stage Name Generator',
  'love-compatibility': 'Korean Love Compatibility Calculator',
  'trip-budget': 'Korea Trip Budget Calculator',
};

const toolsDir = path.join(__dirname, '..', 'app', 'tools');
let fixed = 0;

for (const [slug, cleanName] of Object.entries(nameOverrides)) {
  const layoutPath = path.join(toolsDir, slug, 'layout.tsx');
  if (!fs.existsSync(layoutPath)) continue;

  let content = fs.readFileSync(layoutPath, 'utf-8');

  const nameMatch = content.match(/generateWebApplicationSchema\(\{[\s\S]*?name:\s*'([^']+)'/);
  if (!nameMatch) continue;

  const currentName = nameMatch[1];
  if (currentName === cleanName) continue;

  // Replace in WebApplicationSchema
  content = content.replace(
    `name: '${currentName}',\n    description:`,
    `name: '${cleanName}',\n    description:`
  );
  // Replace in BreadcrumbSchema  
  content = content.replace(
    `{ name: '${currentName}', item:`,
    `{ name: '${cleanName}', item:`
  );

  fs.writeFileSync(layoutPath, content);
  console.log(`🔧 ${slug}: "${currentName}" → "${cleanName}"`);
  fixed++;
}

console.log(`\n📊 Fixed ${fixed} names`);
