/**
 * Fix tool layout.tsx meta descriptions to ≤160 chars
 */
const fs = require('fs');
const path = require('path');

const toolsDir = path.join(__dirname, '..', 'app', 'tools');

// New descriptions: all ≤160 chars, compelling, include key info
const descFixes = {
  'business-name': 'Generate creative Korean business names for your cafe, restaurant, or startup. Get unique Korean-English name combos with brand stories.',
  'emoji-name': 'Turn your name into beautiful Korean-style emojis! Choose cute, cool, or elegant styles. Perfect for Instagram bios and social media profiles.',
  'guess-korean-food': 'Can you identify 20 Korean dishes from photos? Test your K-food knowledge with our interactive quiz and learn fun facts about each dish.',
  'ideal-korean-partner': 'Take our personality quiz to discover your ideal Korean partner type. Find out what kind of Korean partner matches your relationship style.',
  'kdrama-romance-trope': 'Which K-Drama romance trope is yours? From chaebol love to enemies-to-lovers, discover your perfect Korean drama love story match.',
  'korea-job-quiz': 'What job would you have in Korea? Take our career personality quiz to discover your ideal Korean job with salary info and career paths.',
  'korean-age': 'Calculate your Korean age instantly and discover your Chinese zodiac sign (띠) with personality traits, lucky colors, and compatibility.',
  'korean-beauty-quiz': 'Find your perfect K-Beauty skincare routine! Take our 5-question skin type quiz for personalized Korean beauty product recommendations.',
  'korean-city-quiz': 'Seoul, Busan, or Jeju? Take our lifestyle quiz to discover which Korean city matches your personality, career goals, and budget.',
  'korean-food-quiz': 'Which Korean food matches your personality? Take our fun quiz to find your K-food soulmate — from kimchi to bulgogi and beyond.',
  'korean-name': 'Get your authentic Korean name based on your English name! Choose male, female, or unisex options with cultural meanings and Hangul spelling.',
  'korean-typing-test': 'Test your Korean typing speed and accuracy! Measure your Hangul WPM with beginner, intermediate, and advanced Korean text challenges.',
  'korean-zodiac-fortune': 'Check your daily Korean zodiac fortune (띠)! Get personalized insights on love, wealth, health, career, plus your lucky color and number.',
  'kpop-stage-name': 'Generate your K-Pop idol stage name! Pick your concept — cute, cool, elegant, or powerful — and get a personalized name with Korean translation.',
  'love-compatibility': 'Check your Korean love compatibility using zodiac signs, blood types, and birth dates. Get relationship advice and your couple nickname.',
  'medical-cost-estimator': 'Estimate your medical procedure costs in Korea: plastic surgery, dental, dermatology, and more. Includes accommodation and travel costs.',
  'military-service': 'Calculate Korean military service requirements based on age and health. Find service duration, branch options, and important deadlines.',
  'trip-budget': 'Plan your Korea trip budget with cost estimates for hotels, food, activities, transport, and shopping. Customize by travel style and duration.',
};

const dirs = fs.readdirSync(toolsDir).filter(d => {
  try { return fs.statSync(path.join(toolsDir, d)).isDirectory() && d !== '[slug]'; } catch { return false; }
});

let fixed = 0;

for (const d of dirs) {
  const layoutPath = path.join(toolsDir, d, 'layout.tsx');
  if (!fs.existsSync(layoutPath)) continue;

  let content = fs.readFileSync(layoutPath, 'utf8');

  if (!descFixes[d]) {
    // Check current length
    const m = content.match(/description:\s*'([^']+)'/);
    if (m) {
      const len = m[1].length;
      if (len > 160) console.log(`⚠ ${d}: ${len} chars but no fix defined!`);
      else console.log(`✓ ${d}: ${len} chars (OK)`);
    }
    continue;
  }

  const newDesc = descFixes[d];
  if (newDesc.length > 160) {
    console.log(`✗ ${d}: new desc STILL >160 (${newDesc.length}): "${newDesc}"`);
    continue;
  }

  // Find and replace the first description in metadata (not OG/twitter)
  // Pattern: description: 'xxx' or description: "xxx"
  const descRegex = /^(\s*description:\s*)(['"])(.+?)\2/m;
  const match = content.match(descRegex);
  if (!match) {
    console.log(`⚠ ${d}: could not find description pattern`);
    continue;
  }

  const oldFull = match[0];
  const indent = match[1];
  const quote = match[2];
  const newFull = `${indent}${quote}${newDesc}${quote}`;

  // Only replace the first occurrence
  const idx = content.indexOf(oldFull);
  content = content.substring(0, idx) + newFull + content.substring(idx + oldFull.length);
  
  fs.writeFileSync(layoutPath, content, 'utf8');
  console.log(`✓ ${d.padEnd(25)} ${match[3].length} → ${newDesc.length} chars`);
  fixed++;
}

console.log(`\n=== DONE: ${fixed} descriptions fixed ===`);

// Verification
console.log('\n=== Verification ===');
let allOk = true;
for (const d of dirs) {
  const layoutPath = path.join(toolsDir, d, 'layout.tsx');
  if (!fs.existsSync(layoutPath)) continue;
  const content = fs.readFileSync(layoutPath, 'utf8');
  const m = content.match(/description:\s*['"]([^'"]+)['"]/);
  if (m && m[1].length > 160) {
    console.log(`✗ ${d}: ${m[1].length} chars > 160`);
    allOk = false;
  }
}
if (allOk) console.log('All tool descriptions verified ≤160 chars.');
