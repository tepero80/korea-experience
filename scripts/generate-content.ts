/**
 * AI Content Generator Script
 * Gemini API를 사용하여 고품질 블로그 포스트를 자동 생성합니다.
 */

import { config } from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as fs from 'fs';
import * as path from 'path';

// .env.local 파일 로드
config({ path: '.env.local' });

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

Write a comprehensive, SEO-optimized blog post about: "${keyword}"

Requirements:
- Category: ${category}
- Language: English
- Length: 2,500-3,500 words
- Tone: Professional, informative, helpful with personal insights
- Target audience: International travelers/expats interested in Korea
- Include specific data points (prices, distances, times) every 150-200 words

Structure:
1. Frontmatter (YAML format) - IMPORTANT formatting rules:
   ---
   title: "[Natural sentence-case title with main keyword, max 60 chars]"
   date: ${existingDate || new Date().toISOString().split('T')[0]}
   excerpt: "[Compelling summary with specific data, 150-155 characters]"
   category: ${category}
   author: Korea Experience Team
   ---
   
   TITLE RULES (CRITICAL):
   - Use natural sentence case, NOT mechanical Title Case
   - CORRECT: "Best Korean BBQ restaurants in Seoul 2026"
   - CORRECT: "How to get a Korean driving license as a foreigner"
   - CORRECT: "Zero-sugar soju and healthy drinking trends in Korea 2026"
   - WRONG: "Best Korean BBQ Restaurants In Seoul 2026" (mechanical Title Case)
   - WRONG: "How To Get A Korean Driving License As A Foreigner" (every word capitalized)
   - Only capitalize: first word, proper nouns (Korea, Seoul, BTS, K-Pop), and acronyms
   - Include the main keyword naturally
   
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
   - Example: "**The short answer: Zero-sugar soju has 20-30% fewer calories than regular soju, with Saero and Jinro Zero being the two dominant brands in 2026.**"
   - Do NOT start with background history or general statements like "Korea has undergone a transformation..."
   - Start with the specific, actionable information the reader came for

   A. IMMEDIATELY after the intro paragraph, add KeyTakeaways:
   <KeyTakeaways 
     points={[
       "First key insight (max 25 words)",
       "Second key insight with specific data",
       "Third practical takeaway"
     ]}
     readTime={8}
     lastUpdated="${new Date().toISOString().split('T')[0]}"
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
       { label: "Average Cost", value: "$50-100", icon: "💰" },
       { label: "Duration", value: "2-3 hours", icon: "⏱️" },
       { label: "Best Time", value: "Spring/Fall", icon: "🗓️" }
     ]}
     columns={3}
   />

   D. Use StepGuide for how-to content:
   <StepGuide
     title="How to [Action]"
     totalTime="30 minutes"
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
       { name: "Luxury Option", price: "₩150,000", tag: "luxury", description: "Premium experience" },
       { name: "Budget Option", price: "₩25,000", tag: "budget", description: "Great value" }
     ]}
   />

   F. Use LocationCard for venue/restaurant info:
   <LocationCard
     name="Place Name"
     nameKo="한국어 이름"
     type="Restaurant"
     address="123 Street, Gangnam-gu, Seoul"
     hours="11:00-22:00"
     phone="+82-2-1234-5678"
     priceRange="$$"
     rating={4.5}
     transit="Exit 3 from Gangnam Station, 5 min walk"
     highlights={["Signature Dish", "Vegetarian Options", "English Menu"]}
     tip="Best to visit during lunch for smaller crowds."
   />

   G. Use ProsCons for balanced analysis:
   <ProsCons
     title="Pros and Cons"
     pros={["First advantage", "Second advantage"]}
     cons={["First drawback", "Second consideration"]}
     variant="cards"
   />

   H. Use ExpertTip for E-E-A-T content:
   <ExpertTip 
     author="Local Expert Name"
     role="Seoul Resident, 10+ years"
     type="local"
     verified={true}
   >
     Personal insight or local knowledge that AI cannot generate...
   </ExpertTip>

   I. Use StatCard for key statistics:
   <StatCard
     title="Key Statistics"
     variant="gradient"
     stats={[
       { value: "85%", label: "Success Rate", icon: "📊" },
       { value: "2.5M", label: "Monthly Users", icon: "👥" }
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
       { time: "Step 1", title: "Download App", description: "Get the app from store", icon: "📱" },
       { time: "Step 2", title: "Register", description: "Create account", icon: "✍️" }
     ]}
   />

   L. End with FAQAccordion (MANDATORY):
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
     totalBudget={{ luxury: "$200", budget: "$40" }}
     totalTime="8 hours"
     stops={[
       { name: "Luxury Stop", type: "luxury", description: "...", cost: "$80", icon: "💎" },
       { name: "Budget Stop", type: "budget", description: "...", cost: "$5", icon: "💰" }
     ]}
     recommendation="This route balances premium experiences with authentic local discoveries."
   />
   ` : ''}

3. SEO & GEO Optimization:
   - Use the main keyword in title, first paragraph, and H2 headings
   - Include related long-tail keywords naturally
   - Add specific numbers/statistics every 150-200 words (AI citation optimization)
   - Write descriptive, keyword-rich subheadings
   - Ensure Answer-First structure: Start each section with a direct answer

4. Special Requirements:
   ${category === 'Medical Tourism' ? '- Add medical disclaimer using <InfoBox type="warning">\n   - Include emergency contact numbers (119 for ambulance, 1339 for medical consultation)' : ''}
   ${category.includes('ARC-Free') || keyword.toLowerCase().includes('arc') ? '- Use <InfoBox type="arc-free"> for ARC-free solutions' : ''}
   - Use Korean terms with English explanations where appropriate
   - Include practical tips using <ExpertTip> components
   - Add personal insights that demonstrate E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness)

5. Visual Component Guidelines:
   - Use at least 5-7 visual components per article
   - Place KeyTakeaways immediately after intro (MANDATORY)
   - Add QuickFacts in data-heavy sections
   - Use InfoBox liberally for tips and warnings (3-5 per article)
   - Include at least one ComparisonTable or ProsCons
   - Add ExpertTip for local insights (2-3 per article)
   - Use StepGuide for how-to sections
   - End with FAQAccordion (MANDATORY - 5 questions minimum)

6. Sources Section (MANDATORY for E-E-A-T and AI citation):
   - After the FAQ, add a horizontal rule (---) and a "## Sources" section
   - List 3-5 authoritative sources with markdown links
   - Use official Korean government sites, KTO, KMA, KORAIL, or recognized industry sources
   - Format: "- [Source Name](https://url) - Brief description of what data was referenced"
   - Example:
     ## Sources
     - [Korea Tourism Organization](https://english.visitkorea.or.kr) - Official tourism data and festival schedules
     - [Korea Meteorological Administration](https://www.kma.go.kr) - Weather and climate data
   - Do NOT invent fake URLs. Use well-known, real Korean government or industry websites only.

CRITICAL JSX SYNTAX RULES (MUST follow exactly):
- Output ONLY the markdown content with embedded JSX components
- Do NOT wrap the content in code blocks
- Start directly with --- for frontmatter
- DO NOT include any Korean characters in the content - use English only

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

  return { content: result, fixes };
}

// 블로그 포스트 생성 함수
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
  const filepath = path.join(process.cwd(), 'content', 'posts', filename);
  
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
    console.log('🚀 AI 콘텐츠 생성 시작...');
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
    console.log(`📄 생성된 파일: content/posts/${filename}`);
    console.log('\n다음 단계:');
    console.log('1. 생성된 파일을 열어서 내용 확인');
    console.log('2. 필요시 수정 및 보완');
    console.log('3. npm run build로 빌드 테스트');
    console.log('4. git add, commit, push로 배포');
    
  } catch (error) {
    console.error('\n❌ 오류 발생:', error);
    process.exit(1);
  }
}

main();
