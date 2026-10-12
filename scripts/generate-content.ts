/**
 * AI Content Draft Generator
 * 생성물은 편집자 검수 전까지 공개 콘텐츠로 저장하지 않습니다.
 */

import { config } from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as fs from 'fs';
import * as path from 'path';

// .env.local 파일 로드
config({ path: '.env.local' });

// ========== 기존 포스트 슬러그 동적 로딩 ==========
function getExistingSlugs(): { all: string[]; byCategory: Record<string, string[]> } {
  const postsDir = path.join(process.cwd(), 'content', 'posts');
  const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.md'));
  const all: string[] = [];
  const byCategory: Record<string, string[]> = {};

  for (const file of files) {
    const slug = file.replace(/\.md$/, '');
    all.push(slug);
    try {
      const head = fs.readFileSync(path.join(postsDir, file), 'utf-8').substring(0, 500);
      const catMatch = head.match(/^category:\s*(.+)$/m);
      if (catMatch) {
        const cat = catMatch[1].trim();
        if (!byCategory[cat]) byCategory[cat] = [];
        byCategory[cat].push(slug);
      }
    } catch { /* skip unreadable */ }
  }
  return { all, byCategory };
}

// API 키 확인
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error('❌ GEMINI_API_KEY가 .env.local에 설정되지 않았습니다.');
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-3-pro-preview' });
// 블로그 포스트 생성 프롬프트 템플릿
const createPrompt = (keyword: string, category: string, existingDate?: string) => `
You are an expert content writer specializing in Korea-related content for international audiences.
You are writing for KoreaExperience, a premium travel and lifestyle blog that differentiates itself through visual quality and GEO (Generative Engine Optimization).

Write a useful, accurate editorial draft about: "${keyword}"

Requirements:
- Category: ${category}
- Language: English
- Length: As long as needed to answer the reader's question; do not pad for a word-count target
- Tone: Clear, informative, and appropriately cautious. Do not claim first-hand experience.
- Target audience: International travelers/expats interested in Korea
- Accuracy takes priority over SEO, length, and visual formatting.
- Never invent or estimate prices, dates, legal/medical rules, statistics, addresses, opening hours, phone numbers, ratings, experts, quotes, or personal experiences.
- Do not state time-sensitive facts as current unless supported by a directly relevant source URL and a verification date.
- When reliable evidence is unavailable, say what could not be verified or omit the claim.
- End with a "## Sources" section containing at least 3 unique, directly relevant source URLs; use official/primary sources for legal, medical, safety, and other time-sensitive claims. These URLs are unverified until a human editor checks them.
- Any sample values in component syntax below are placeholders, not facts. Replace them with verified source-backed information or omit the component; never publish placeholder text.

Structure:
1. Frontmatter (YAML format) - IMPORTANT formatting rules:
   ---
   title: "[Natural sentence-case title with main keyword, MUST be ≤70 chars]"
   date: ${existingDate || new Date().toISOString().split('T')[0]}
    excerpt: "[Accurate summary of the article, MUST be ≤160 chars]"
   category: ${category}
    author: Korea Experience Editorial Team
   tags:
     - "[Relevant tag 1, e.g. Korean Food, K-Beauty, Seoul, Shopping, Medical Tourism, Travel Tips, K-Pop]"
     - "[Relevant tag 2]"
     - "[Relevant tag 3]"
   readTime: "[Estimated read time, e.g. 8 min read]"
   featured: false
   ---
   
   TITLE RULES (CRITICAL):
   - MUST be 70 characters or less (titles over 70 chars get truncated in Bing/Google search results)
   - Use natural sentence case, NOT mechanical Title Case
   - CORRECT: "Best Korean BBQ restaurants in Seoul 2026" (41 chars ✓)
   - CORRECT: "How to get a Korean driving license as a foreigner" (50 chars ✓)
   - WRONG: "Best Korean BBQ Restaurants In Seoul 2026" (mechanical Title Case)
   - WRONG: "The Complete Ultimate Guide to Every Korean BBQ Restaurant in Seoul and Surrounding Areas 2026" (too long!)
   - Only capitalize: first word, proper nouns (Korea, Seoul, BTS, K-Pop), and acronyms
   - Include the main keyword naturally
   
   EXCERPT RULES (CRITICAL):
   - MUST be 160 characters or less (this becomes the meta description tag)
    - Do not add numerical details unless supported by a cited source
   - Make it compelling enough to click from search results
   - Do NOT use colons (:) inside the excerpt
   
   CRITICAL YAML RULES:
   - ALWAYS wrap title in double quotes "like this"
   - ALWAYS wrap excerpt in double quotes "like this"
   - Do NOT use colons (:) inside title or excerpt
   - Do NOT wrap frontmatter in code blocks
   - Start directly with --- for frontmatter

2. Content Structure with Visual Components:

   ANSWER-FIRST STRUCTURE (MANDATORY):
   - The FIRST paragraph must contain a direct answer to what the reader is searching for
   - After the first paragraph, add a bold "**The short answer:**" line with a 1-2 sentence summary
  - Keep the example specific to the topic and include numbers only when cited sources support them.
   - Do NOT start with background history or general statements like "Korea has undergone a transformation..."
   - Start with the specific, actionable information the reader came for

   A. IMMEDIATELY after the intro paragraph, add KeyTakeaways:
   <KeyTakeaways 
     points={[
       "First key insight (max 25 words)",
        "Second key insight supported by the article",
       "Third practical takeaway"
     ]}
     readTime={8}
   />

   B. Use InfoBox for important tips throughout:
   <InfoBox type="tip" title="Pro Tip">
     Your helpful tip content here.
   </InfoBox>
   
   Available types: tip, warning, success, info, danger, note, arc-free

   C. Add QuickFacts for data-heavy sections:
   <QuickFacts
     title="Quick Facts"
     facts={[
         { label: "Verified fact", value: "Use only sourced values", icon: "ℹ️" }
     ]}
     columns={3}
   />

   D. Use StepGuide for how-to content:
   <StepGuide
     title="How to [Action]"
    totalTime="Only include a verified duration when a reliable source supports it"
     difficulty="easy"
     steps={[
       { title: "Step Title", description: "Detailed instructions...", tip: "Pro tip..." },
       { title: "Step 2", description: "Next step..." }
     ]}
   />

   E. Use PriceTable for cost comparisons (especially Dualism content):
   <PriceTable
     title="Price Comparison"
     variant="dualism"
     items={[
      { name: "Option from a cited source", price: "Verified price and date", tag: "source-backed", description: "Explain what the cited price includes" }
     ]}
   />

   F. Use LocationCard for venue/restaurant info:
   <LocationCard
      name="Verified venue name"
      type="Venue type"
      address="Only include when verified from an official source"
      hours="Only include when verified from an official source"
      highlights={["Only verified details"]}
   />

   G. Use ProsCons for balanced analysis:
   <ProsCons
     title="Pros and Cons"
     pros={["First advantage", "Second advantage"]}
     cons={["First drawback", "Second consideration"]}
     variant="cards"
   />

   H. ExpertTip is OPTIONAL. Omit it unless the real expert, role, and advice are directly supported by a source URL. Never invent names, credentials, quotations, or experience.

   I. Use StatCard for key statistics:
   <StatCard
     title="Key Statistics"
     variant="gradient"
     stats={[
        { value: "Verified value", label: "Source-backed statistic", icon: "📊" }
     ]}
     source="Official Data 2026"
   />

   J. Use ComparisonTable for feature comparisons:
   <ComparisonTable
     title="Service Comparison"
     headers={["Feature", "Option A", "Option B", "Option C"]}
     rows={[
       { feature: "English Support", option1: true, option2: true, option3: false },
       { feature: "Foreign Card", option1: true, option2: false, option3: true },
       { feature: "Price", option1: "$$", option2: "$", option3: "$$$" }
     ]}
   />

   K. Use Timeline for processes or journeys:
   <Timeline
     title="Process Timeline"
     items={[
      { time: "Verified stage", title: "Process step", description: "Describe only steps supported by a reliable source", icon: "📌" }
     ]}
   />

    L. FAQAccordion is OPTIONAL; use only for questions that add useful, supported information:
   <FAQAccordion
     title="Frequently Asked Questions"
     items={[
       { question: "Common question 1?", answer: "Detailed answer..." },
       { question: "Common question 2?", answer: "Another detailed answer..." }
     ]}
   />

   ${category === 'Travel & Tourism' ? `
   M. For travel routes, use DualismRoute:
   <DualismRoute
     title="24 Hours in [Area]: Luxury Meets Budget"
     area="Seongsu-dong"
    totalBudget={{ luxury: "Verified estimate", budget: "Verified estimate" }}
    totalTime="Only when supported by a source"
     stops={[
      { name: "Verified stop", type: "luxury", description: "Use verified details", cost: "Verified cost", icon: "💎" }
     ]}
     recommendation="This route balances premium experiences with authentic local discoveries."
   />
   ` : ''}

3. SEO & GEO Optimization:
   - Use the main keyword in title, first paragraph, and H2 headings
   - Include related long-tail keywords naturally
    - Include numbers only when a cited source supports them
   - Write descriptive, keyword-rich subheadings
   - Ensure Answer-First structure: Start each section with a direct answer

4. Special Requirements:
  ${category === 'Medical Tourism' ? '- Add a medical disclaimer. Include emergency numbers only after checking a current official source; do not assume 1339 is still a separate service.' : ''}
   ${category.includes('ARC-Free') || keyword.toLowerCase().includes('arc') ? '- Use <InfoBox type="arc-free"> for ARC-free solutions' : ''}
   - Use Korean terms with English explanations where appropriate
    - Do not create first-person anecdotes or imply human experience that was not supplied.

5. Visual Component Guidelines:
    - Use visual components only when they improve comprehension; never invent data to fill a component.
   - Place KeyTakeaways immediately after intro (MANDATORY)
   - Add QuickFacts in data-heavy sections
    - Use InfoBox sparingly and only for useful, supported information
   - Include at least one ComparisonTable or ProsCons
    - ExpertTip is optional and must be source-backed
   - Use StepGuide for how-to sections
    - FAQAccordion is optional; do not add repetitive or speculative questions

6. Internal Links (MANDATORY - DO NOT SKIP):
   - Include 3-5 internal links to related articles throughout the content
   - Use markdown format: [descriptive anchor text](/blog/slug-of-related-post)
   - Spread links naturally within the body text, not clustered together
   - CRITICAL: You MUST ONLY use slugs from the list below. Do NOT invent or guess slugs.
   - Pick 3-5 slugs that are most relevant to the current article topic.

   AVAILABLE SLUGS (use ONLY these):
${(() => {
    const { all, byCategory } = getExistingSlugs();
    // Build category-grouped slug list for the prompt
    const lines: string[] = [];
    const currentSlug = keyword.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    for (const [cat, slugs] of Object.entries(byCategory)) {
      // Show up to 15 slugs per category, excluding current post
      const filtered = slugs.filter(s => s !== currentSlug).slice(0, 15);
      if (filtered.length > 0) {
        lines.push(`     [${cat}]`);
        filtered.forEach(s => lines.push(`       /blog/${s}`));
      }
    }
    return lines.join('\n');
  })()}

   - Example: "Check out our [guide to Korean BBQ](/blog/best-korean-bbq-restaurants-in-seoul-2026) for recommendations."
   - WARNING: Any slug NOT in the above list will be automatically removed during post-processing.

CRITICAL JSX SYNTAX RULES (MUST follow exactly):
- Output ONLY the markdown content with embedded JSX components
- Do NOT wrap the content in code blocks
- Start directly with --- for frontmatter
- DO NOT include any Korean characters in the content - use English only

CURRENCY AND PRICE RULES (CRITICAL):
- ALWAYS use the ₩ symbol BEFORE the number for Korean Won prices: ₩50,000 (CORRECT)
- NEVER write "50,000 KRW" or "50,000 won" - always use ₩ prefix format
- CORRECT: "₩15,000", "₩3,500", "₩1,200,000"
- WRONG: "15,000 KRW", "15,000 won", "15000 KRW"
- Use USD only when comparing: "₩50,000 (approximately $37 USD)"

PHONE NUMBER AND CONTACT RULES:
- NEVER use placeholder phone numbers like +82-2-1234-5678 or 02-1234-5678
- If you don't know the real phone number, write "(check official website for contact details)" instead
- Only include verifiable, real contact information

STRICT JSX RULES - VIOLATIONS WILL BREAK THE BUILD:
1. Array props MUST be wrapped in curly braces:
   CORRECT: highlights={["Item 1", "Item 2"]}
   WRONG:   highlights=["Item 1", "Item 2"]
   CORRECT: points={["Point 1", "Point 2"]}
   WRONG:   points=["Point 1", "Point 2"]

2. Closing tags must EXACTLY match opening tags. Only these 12 component names are valid:
   KeyTakeaways, FAQAccordion, ExpertTip, InfoBox, StepGuide, ProsCons,
   PriceTable, StatCard, QuickFacts, ComparisonTable, LocationCard, Timeline
   NEVER write: </ExpertExpertTip>, </InfoBoxBox>, </StatCards>, </ExpertTipTip>
   ALWAYS write: </ExpertTip>, </InfoBox>, </StatCard>

3. Boolean and string values in JSX:
   CORRECT: option1: true, option2: false, option3: "Yes"
   WRONG:   option1: true (if applicable), option2: false (for most)
   - Boolean values must be exactly true or false with NO extra text
   - If you need to add context, use a string: option1: "Yes (if applicable)"

4. difficulty prop must be lowercase:
   CORRECT: difficulty="easy" | difficulty="medium" | difficulty="hard"
   WRONG:   difficulty="Easy" | difficulty="Hard" | difficulty="Medium"

5. Attribute names must be pure ASCII letters only:
   NEVER include dots, special characters, or non-English characters in attribute names
   CORRECT: highlights={[...]}  rating={4.5}  phone="+82-2-1234"
   WRONG:   highlights.={[...]}  highlights_={[...]}

6. All JSX components must be properly closed (self-closing with /> or matching </Tag>)

7. HEADING RULES (CRITICAL):
   - ALWAYS use ## (H2) for main section headings
   - Use ### (H3) only as sub-headings UNDER an H2
   - NEVER use ### (H3) as the top-level section heading
   - Every article must have at least 4-6 ## H2 headings
`;

// ========== MDX 자동 검증/수정 ==========
const VALID_COMPONENTS = [
  'KeyTakeaways', 'FAQAccordion', 'ExpertTip', 'InfoBox', 'StepGuide',
  'ProsCons', 'PriceTable', 'StatCard', 'QuickFacts', 'ComparisonTable',
  'LocationCard', 'Timeline', 'DualismRoute'
];

const ARRAY_PROPS = [
  'highlights', 'points', 'pros', 'cons', 'items', 'facts',
  'stats', 'steps', 'rows', 'headers', 'stops'
];

function sanitizeMDX(content: string): { content: string; fixes: string[] } {
  const fixes: string[] = [];
  let result = content;

  // 0. 코드블록으로 감싸진 경우 제거
  if (result.startsWith('```markdown') || result.startsWith('```mdx') || result.startsWith('```')) {
    result = result.replace(/^```(?:markdown|mdx)?\n/, '').replace(/\n```\s*$/, '');
    fixes.push('Removed code block wrapper');
  }

  // 1. 배열 props에 {} 누락: highlights=["..."] → highlights={["..."]}
  const arrayPropPattern = new RegExp(
    `((?:${ARRAY_PROPS.join('|')})\\s*)=\\s*\\[`,
    'g'
  );
  result = result.replace(arrayPropPattern, (match, attr) => {
    fixes.push(`${attr.trim()}=[] → ${attr.trim()}={[]}`);
    return `${attr}={[`;
  });
  // 대응하는 닫는 ] 뒤에 } 추가 (배열이 {[ 로 시작했으면 ]} 로 끝나야 함)
  // 이전 수정에서 {[ 로 변경된 배열을 찾아서 대응하는 ] 뒤에 } 추가
  const lines = result.split('\n');
  let insideArrayProp = false;
  let bracketDepth = 0;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!insideArrayProp) {
      // 배열 prop 시작 감지: attr={[ 가 있고 같은 줄에 ]} 가 없으면
      const startMatch = new RegExp(`(?:${ARRAY_PROPS.join('|')})\\s*=\\s*\\{\\[`).exec(line);
      if (startMatch) {
        // 같은 줄에 ]} 로 끝나는지 체크
        const afterStart = line.substring(startMatch.index);
        if (/\]\}/.test(afterStart)) {
          continue; // 한 줄에 완결됨
        }
        if (/\](?!\})/.test(afterStart) && !afterStart.includes(']}')) {
          // ] 는 있지만 ]} 가 아닌 경우 → 같은 줄에서 수정
          lines[i] = line.replace(/\](\s*)$/, ']}$1').replace(/\](\s*\/>)/, ']}$1').replace(/\](\s+"|\s*\n)/, ']}$1');
        } else {
          insideArrayProp = true;
          bracketDepth = (afterStart.match(/\[/g) || []).length - (afterStart.match(/\]/g) || []).length;
        }
      }
    } else {
      bracketDepth += (line.match(/\[/g) || []).length;
      bracketDepth -= (line.match(/\]/g) || []).length;
      if (bracketDepth <= 0) {
        insideArrayProp = false;
        // 이 줄에서 ] 뒤에 }가 없으면 추가
        if (/\]\s*$/.test(line.trimEnd()) && !line.trimEnd().endsWith(']}')) {
          lines[i] = line.replace(/\](\s*)$/, ']}$1');
          fixes.push('Added missing } after array closing ]');
        }
      }
    }
  }
  result = lines.join('\n');

  // 2. 잘못된 닫는 태그 수정 (e.g., </ExpertExpertTip> → </ExpertTip>)
  result = result.replace(/<\/([A-Z][a-zA-Z]+)>/g, (match, tag) => {
    if (VALID_COMPONENTS.includes(tag)) return match;
    for (const valid of VALID_COMPONENTS) {
      if (tag.includes(valid) || tag.toLowerCase() === valid.toLowerCase()) {
        fixes.push(`</${tag}> → </${valid}>`);
        return `</${valid}>`;
      }
    }
    return match;
  });

  // 3. difficulty 대소문자 수정
  result = result.replace(
    /difficulty="(Easy|Medium|Hard|EASY|MEDIUM|HARD)"/gi,
    (match, val) => {
      const lower = val.toLowerCase();
      if (lower !== val) {
        fixes.push(`difficulty="${val}" → difficulty="${lower}"`);
        return `difficulty="${lower}"`;
      }
      return match;
    }
  );

  // 4. boolean 뒤에 괄호 텍스트 제거 (e.g., true (if MD) → "Yes (if MD)")
  result = result.replace(
    /:\s*(true|false)\s*\(([^)]+)\)/g,
    (match, bool, extra) => {
      const strVal = bool === 'true' ? 'Yes' : 'No';
      fixes.push(`${bool} (${extra}) → "${strVal} (${extra})"`);
      return `: "${strVal} (${extra})"`;
    }
  );

  // 5. 속성명의 비ASCII 문자 제거 (e.g., highlightsțiunea → highlights)
  const knownAttrs = [
    'highlights', 'rating', 'phone', 'type', 'title', 'name', 'address',
    'hours', 'transit', 'tip', 'priceRange', 'nameKo', 'variant', 'source',
    'author', 'role', 'verified', 'columns', 'readTime', 'lastUpdated',
    'totalTime', 'difficulty', 'estimatedCost', 'tag', 'description'
  ];
  result = result.replace(
    /^(\s+)(\w+)[^\x00-\x7F]+\w*\s*=/gm,
    (match, indent, attrBase) => {
      const matched = knownAttrs.find(a => attrBase.length >= 3 && a.startsWith(attrBase.substring(0, Math.min(4, attrBase.length))));
      if (matched) {
        fixes.push(`Garbled attribute → "${matched}"`);
        return `${indent}${matched}=`;
      }
      return match;
    }
  );

  // 6. 속성명에 점(.) 포함 제거 (e.g., highlights.= → highlights=)
  result = result.replace(
    /^(\s+)(\w+)\.\s*=/gm,
    (match, indent, attr) => {
      fixes.push(`${attr}.= → ${attr}=`);
      return `${indent}${attr}=`;
    }
  );

  // 7. 내부 링크 검증 — 존재하지 않는 슬러그 제거
  const { all: existingSlugs } = getExistingSlugs();
  const slugSet = new Set(existingSlugs);
  result = result.replace(
    /\[([^\]]+)\]\(\/blog\/([a-z0-9-]+)\)/g,
    (match, anchorText, slug) => {
      if (slugSet.has(slug)) return match; // 유효한 링크
      // 유사 슬러그 찾기 (Levenshtein 대신 간단한 포함 매칭)
      const similar = existingSlugs.find(s => {
        const slugWords = slug.split('-').filter((w: string) => w.length > 3);
        const matchCount = slugWords.filter((w: string) => s.includes(w)).length;
        return slugWords.length >= 2 && matchCount >= Math.ceil(slugWords.length * 0.75);
      });
      if (similar) {
        fixes.push(`Link fixed: /blog/${slug} → /blog/${similar}`);
        return `[${anchorText}](/blog/${similar})`;
      }
      // 유사한 것도 없으면 링크 제거하고 텍스트만 남김
      fixes.push(`Link removed (no match): /blog/${slug}`);
      return anchorText;
    }
  );

  // 8. Self-closing 태그 자동 수정 — /> 누락된 컴포넌트 수정
  const SELF_CLOSING_COMPONENTS = [
    'KeyTakeaways', 'QuickFacts', 'StepGuide', 'PriceTable',
    'ComparisonTable', 'LocationCard', 'StatCard', 'Timeline',
    'ProsCons', 'FAQAccordion', 'DualismRoute'
  ];
  // These components use self-closing /> (no children)
  // ExpertTip and InfoBox use </ExpertTip> and </InfoBox> (have children)
  for (const comp of SELF_CLOSING_COMPONENTS) {
    // Find opening tags that are NOT self-closing and NOT followed by a closing tag
    const tagRegex = new RegExp(
      `(<${comp}\\b[\\s\\S]*?)(?:\\n\\s*\\]\\}\\s*\\n)(\\s*\\n)(?!\\s*/>)`,
      'g'
    );
    // Simpler approach: find the component block and ensure it ends with />
    const openRegex = new RegExp(`<${comp}\\b`, 'g');
    let openMatch;
    while ((openMatch = openRegex.exec(result)) !== null) {
      const startIdx = openMatch.index;
      // Find the end of this component's props
      let depth = 0;
      let inString = false;
      let stringChar = '';
      let endIdx = -1;
      for (let ci = startIdx; ci < result.length; ci++) {
        const ch = result[ci];
        if (inString) {
          if (ch === stringChar && result[ci - 1] !== '\\') inString = false;
          continue;
        }
        if (ch === '"' || ch === "'") { inString = true; stringChar = ch; continue; }
        if (ch === '{') depth++;
        if (ch === '}') depth--;
        if (ch === '>' && depth <= 0) {
          endIdx = ci;
          break;
        }
        if (ch === '/' && result[ci + 1] === '>' && depth <= 0) {
          endIdx = ci + 1; // Already self-closing
          break;
        }
      }
      if (endIdx === -1) {
        // Tag never closed — find last ]} before next component or heading
        const afterTag = result.substring(startIdx);
        const closingPattern = /\]\}\s*\n/g;
        let lastBracket = -1;
        let bm;
        while ((bm = closingPattern.exec(afterTag)) !== null) {
          // Check if still within this component's scope
          const nextComp = afterTag.substring(bm.index + bm[0].length).match(/^\s*(<[A-Z]|##|\n##|---)/m);
          if (nextComp) {
            lastBracket = startIdx + bm.index + bm[0].length;
            break;
          }
          lastBracket = startIdx + bm.index + bm[0].length;
        }
        if (lastBracket > 0) {
          // Insert /> after the last ]}
          result = result.substring(0, lastBracket) + '/>' + '\n' + result.substring(lastBracket);
          fixes.push(`Auto-closed <${comp} /> (missing self-closing tag)`);
          openRegex.lastIndex = lastBracket + 3; // Skip past insertion
        }
      }
    }
  }

  // Sources 섹션 자동 추가 로직 제거됨 (2026-02-07)
  // AI 생성 sources는 품질이 낮고 반복적이어서 제거하기로 결정

  return { content: result, fixes };
}

function getDraftReviewWarnings(content: string): string[] {
  const warnings: string[] = [];
  const frontmatter = content.match(/^---\s*\r?\n([\s\S]*?)\r?\n---/);
  if (!frontmatter) {
    return ['Missing YAML frontmatter'];
  }

  for (const field of ['title', 'date', 'excerpt', 'category']) {
    if (!new RegExp(`^${field}:\\s*\\S`, 'm').test(frontmatter[1])) {
      warnings.push(`Missing required frontmatter field: ${field}`);
    }
  }

  const sources = content.match(/^## Sources\s*$([\s\S]*?)(?=^##\s|$)/im)?.[1] ?? '';
  const urls = [...new Set(sources.match(/https?:\/\/[^\s)\]>]+/g) ?? [])];
  if (urls.length < 3) {
    warnings.push(`Sources section has ${urls.length} URL(s); at least 3 are required for review`);
  }
  if (/<ExpertTip\b[^>]*verified=\{true\}/i.test(content)) {
    warnings.push('ExpertTip is marked verified; verify the real expert and source before publication');
  }

  return warnings;
}

// 블로그 포스트 초안 생성 함수
async function generateBlogPost(keyword: string, category: string, existingDate?: string): Promise<string> {
  console.log(`\n🤖 AI 콘텐츠 생성 중: "${keyword}"...`);
  if (existingDate) {
    console.log(`📅 기존 날짜 유지: ${existingDate}`);
  }
  
  const prompt = createPrompt(keyword, category, existingDate);
  
  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    
    // 자동 검증/수정
    const { content: sanitized, fixes } = sanitizeMDX(text);
    if (fixes.length > 0) {
      console.log(`🔧 자동 수정 ${fixes.length}건:`);
      fixes.forEach(f => console.log(`   • ${f}`));
    } else {
      console.log('✅ MDX 검증 통과 — 수정 불필요');
    }

    const reviewWarnings = getDraftReviewWarnings(sanitized);
    if (reviewWarnings.length > 0) {
      console.warn('⚠️ 편집자 검수 필요:');
      reviewWarnings.forEach(warning => console.warn(`   • ${warning}`));
    }
    
    console.log('✅ 콘텐츠 생성 완료!');
    return sanitized;
  } catch (error) {
    console.error('❌ 콘텐츠 생성 실패:', error);
    throw error;
  }
}

// 파일로 저장
function saveToFile(content: string, keyword: string): string {
  // 파일명 생성 (키워드를 slug로 변환)
  const slug = keyword
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  
  const filename = `${slug}.md`;
  const draftsDir = path.join(process.cwd(), 'content', 'drafts');
  fs.mkdirSync(draftsDir, { recursive: true });
  const filepath = path.join(draftsDir, filename);
  
  // UTF-8 인코딩으로 파일 저장 (BOM 없이)
  fs.writeFileSync(filepath, content, { encoding: 'utf-8' });
  console.log(`💾 파일 저장: ${filename}`);
  
  return filename;
}

// 메인 실행 함수
async function main() {
  // 명령줄 인자 확인
  const keyword = process.argv[2];
  const category = process.argv[3] || 'Medical Tourism';
  
  if (!keyword) {
    console.log(`
📝 사용법:
  npm run generate "키워드" "카테고리"

예시:
  npm run generate "Best Korean BBQ Restaurants in Seoul" "Travel & Tourism"
  npm run generate "Korean Skincare Routine for Beginners" "K-Culture"
  npm run generate "How to Get a Korean F-Visa" "Investment"

카테고리 옵션:
  - Medical Tourism
  - Travel & Tourism
  - K-Culture
  - Investment
    `);
    process.exit(0);
  }
  
  try {
    console.log('📝 AI 콘텐츠 초안 생성 시작...');
    console.log(`📌 키워드: ${keyword}`);
    console.log(`📂 카테고리: ${category}`);
    
    // 기존 파일이 있으면 날짜 보존
    const slug = keyword.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    const existingPath = path.join(process.cwd(), 'content', 'posts', `${slug}.md`);
    let existingDate: string | undefined;
    if (fs.existsSync(existingPath)) {
      const existingContent = fs.readFileSync(existingPath, 'utf-8');
      const dateMatch = existingContent.match(/^date:\s*(\d{4}-\d{2}-\d{2})/m);
      if (dateMatch) {
        existingDate = dateMatch[1];
      }
      console.log(`♻️  기존 파일 발견 → 재생성 모드 (날짜 유지: ${existingDate})`);
    }
    
    const content = await generateBlogPost(keyword, category, existingDate);
    const filename = saveToFile(content, keyword);
    
    console.log('\n✨ 완료!');
    console.log(`📄 검수 대기 초안: content/drafts/${filename}`);
    console.log('\n다음 단계:');
    console.log('1. 출처 URL이 실제로 열리고 바로 앞의 주장을 뒷받침하는지 직접 확인');
    console.log('2. 법률·의료·안전·가격·시간 등 변동 정보를 공식 출처와 대조하고 확인일 기록');
    console.log('3. 허위 전문가 인용, 추정치, 반복 문구를 제거하고 편집·팩트체크');
    console.log('4. 검수를 통과한 경우에만 content/posts 또는 content/deep-dive로 수동 승격');
    
  } catch (error) {
    console.error('\n❌ 오류 발생:', error);
    process.exit(1);
  }
}

main();
