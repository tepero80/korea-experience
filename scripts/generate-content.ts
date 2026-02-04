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
const createPrompt = (keyword: string, category: string) => `
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
   title: "[Title with main keyword, max 60 characters]"
   date: ${new Date().toISOString().split('T')[0]}
   excerpt: "[Compelling summary, 150-155 characters]"
   category: ${category}
   author: Korea Experience Team
   ---
   
   CRITICAL YAML RULES:
   - ALWAYS wrap title in double quotes "like this"
   - ALWAYS wrap excerpt in double quotes "like this"
   - Do NOT use colons (:) inside title or excerpt
   - Do NOT wrap frontmatter in code blocks
   - Start directly with --- for frontmatter

2. Content Structure with Visual Components:

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

CRITICAL: 
- Output ONLY the markdown content with embedded JSX components
- Do NOT wrap the content in code blocks
- Start directly with --- for frontmatter
- All component props must use valid JSX syntax
- DO NOT include any Korean characters in the content - use English only
- Ensure all JSX components are properly closed
`;

// 블로그 포스트 생성 함수
async function generateBlogPost(keyword: string, category: string): Promise<string> {
  console.log(`\n🤖 AI 콘텐츠 생성 중: "${keyword}"...`);
  
  const prompt = createPrompt(keyword, category);
  
  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    
    console.log('✅ 콘텐츠 생성 완료!');
    return text;
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
    
    const content = await generateBlogPost(keyword, category);
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
