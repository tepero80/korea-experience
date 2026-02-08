const fs = require('fs');
const path = require('path');

const toolsDir = path.join(__dirname, '..', 'app', 'tools');
const dirs = fs.readdirSync(toolsDir).filter(d => {
  const fullPath = path.join(toolsDir, d);
  return fs.statSync(fullPath).isDirectory() && d !== '[slug]';
});

let updated = 0;
let skipped = 0;

for (const dir of dirs) {
  const layoutPath = path.join(toolsDir, dir, 'layout.tsx');
  if (!fs.existsSync(layoutPath)) {
    console.log(`⚠️  No layout.tsx in ${dir}`);
    continue;
  }

  let content = fs.readFileSync(layoutPath, 'utf-8');

  // Skip if already has JSON-LD
  if (content.includes('application/ld+json') || content.includes('generateWebApplicationSchema')) {
    console.log(`⏭️  ${dir} — already has JSON-LD`);
    skipped++;
    continue;
  }

  // Extract description
  const descMatch = content.match(/^\s*description:\s*['"`]([^'"`]+)['"`]/m);
  const desc = descMatch ? descMatch[1] : '';

  // Extract OG title for a clean tool name
  const ogTitleMatch = content.match(/openGraph:\s*\{[^]*?title:\s*['"`]([^'"`]+)['"`]/);
  // Fallback: extract from absolute title
  const absTitleMatch = content.match(/absolute:\s*['"`]([^'"`]+)['"`]/);
  let toolName = '';
  if (ogTitleMatch) {
    toolName = ogTitleMatch[1]
      .replace(/\s*\|\s*Korea Experience/g, '')
      .replace(/\s*-\s*Korea Experience/g, '')
      .trim();
  } else if (absTitleMatch) {
    toolName = absTitleMatch[1]
      .replace(/\s*\|\s*Korea Experience/g, '')
      .replace(/\s*-\s*Korea Experience/g, '')
      .trim();
  } else {
    toolName = dir.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ');
  }

  const slug = dir;

  // Add imports
  if (!content.includes('generateWebApplicationSchema')) {
    content = content.replace(
      "import { Metadata } from 'next';",
      "import { Metadata } from 'next';\nimport { generateWebApplicationSchema, generateBreadcrumbSchema } from '@/lib/schema';\nimport { SITE_CONFIG } from '@/lib/constants';"
    );
  }

  // Find and replace the layout function body
  // The pattern is: export default function XxxLayout({ children }: ...) { return children; }
  // Various formatting possibilities
  const layoutFuncRegex = /(export default function \w+\(\{[\s\S]*?children[\s\S]*?\}\)\s*\{)\s*\n?\s*return children;\s*\n?\}/;

  const match = content.match(layoutFuncRegex);
  if (!match) {
    console.log(`⚠️  ${dir} — could not match layout function pattern`);
    continue;
  }

  const escapedName = toolName.replace(/'/g, "\\'");
  const escapedDesc = desc.replace(/'/g, "\\'");

  const newFuncBody = `${match[1]}
  const toolSchema = generateWebApplicationSchema({
    name: '${escapedName}',
    description: '${escapedDesc}',
    url: \`\${SITE_CONFIG.url}/tools/${slug}\`,
    imageUrl: \`\${SITE_CONFIG.url}/tools/${slug}/opengraph-image\`,
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', item: SITE_CONFIG.url },
    { name: 'Tools', item: \`\${SITE_CONFIG.url}/tools\` },
    { name: '${escapedName}', item: \`\${SITE_CONFIG.url}/tools/${slug}\` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(toolSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {children}
    </>
  );
}`;

  content = content.replace(layoutFuncRegex, newFuncBody);

  fs.writeFileSync(layoutPath, content);
  console.log(`✅ ${dir} — JSON-LD added (name: "${toolName}")`);
  updated++;
}

console.log(`\n📊 Summary: ${updated} updated, ${skipped} skipped, ${dirs.length} total`);
