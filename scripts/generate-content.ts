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
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

// 블로그 포스트 생성 프롬프트 템플릿
const createPrompt = (keyword: string, category: string) => `
You are an expert content writer specializing in Korea-related content for international audiences.

Write a comprehensive, SEO-optimized blog post about: "${keyword}"

Requirements:
- Category: ${category}
- Language: English
- Length: 2,000-2,500 words
- Tone: Professional, informative, helpful
- Target audience: International travelers/expats interested in Korea

Structure:
1. Frontmatter (YAML format) - IMPORTANT: Do NOT wrap in code blocks:
   ---
   title: (60 characters max, include main keyword)
   date: ${new Date().toISOString().split('T')[0]}
   excerpt: (150-155 characters, compelling summary)
   category: ${category}
   author: Korea Experience Team
   ---

2. Content Structure:
   - Introduction (hook + problem statement + what readers will learn)
   - 5-7 main sections with H2 headings
   - Use H3 subheadings for detailed points
   - Include specific details (prices, locations, contact info when relevant)
   - Add 2-3 comparison tables using Markdown table syntax
   - Include a FAQ section with 5 questions
   - Conclusion with actionable takeaways

3. SEO Optimization:
   - Use the main keyword in title, first paragraph, and H2 headings
   - Include related long-tail keywords naturally
   - Write descriptive, keyword-rich subheadings
   - Internal linking opportunities (mention other topics we could cover)

4. Special Requirements:
   ${category === 'Medical Tourism' ? '- Add medical disclaimer section at the end\n   - Include emergency contact numbers (119 for ambulance, 1339 for medical consultation)' : ''}
   - Use Korean terms with English explanations where appropriate
   - Include practical tips and insider knowledge
   - Cite specific examples and real locations

CRITICAL: Output ONLY the markdown content. Do NOT wrap the frontmatter or content in code blocks (no \`\`\`yaml or \`\`\`markdown). Start directly with --- for frontmatter.
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
  
  // 파일 저장
  fs.writeFileSync(filepath, content, 'utf-8');
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
