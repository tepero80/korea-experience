/**
 * 전체 포스트 재생성 스크립트 (단일 프로세스, 안정적)
 * - generate-content.ts의 프롬프트를 내장
 * - execSync 대신 직접 Gemini API 호출
 * - progress.json으로 이어하기 지원
 * - 실패 시 자동 리트라이 + 지수 백오프
 */

import { config } from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as fs from 'fs';
import * as path from 'path';

config({ path: '.env.local' });

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error('❌ GEMINI_API_KEY가 .env.local에 설정되지 않았습니다.');
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: 'gemini-3-pro-preview' });

const PLAN_FILE = path.join(process.cwd(), 'scripts', 'content-plan.json');
const PROGRESS_FILE = path.join(process.cwd(), 'scripts', 'generation-progress.json');
const LOG_FILE = path.join(process.cwd(), 'scripts', 'generation-log.txt');
const POSTS_DIR = path.join(process.cwd(), 'content', 'posts');

// ─── 유틸리티 ───

function log(msg: string) {
  const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);
  const line = `[${timestamp}] ${msg}`;
  console.log(line);
  fs.appendFileSync(LOG_FILE, line + '\n');
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function loadProgress(): Record<string, boolean> {
  try {
    return JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf-8'));
  } catch {
    return {};
  }
}

function saveProgress(progress: Record<string, boolean>) {
  fs.writeFileSync(PROGRESS_FILE, JSON.stringify(progress, null, 2), 'utf-8');
}

// ─── 프롬프트 ───

function createPrompt(keyword: string, category: string, existingDate?: string): string {
  const date = existingDate || new Date().toISOString().split('T')[0];
  return `
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
   date: ${date}
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
     lastUpdated="${date}"
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

   E. Use PriceTable for cost comparisons:
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
}

// ─── 생성 + 저장 ───

async function generateAndSave(keyword: string, category: string): Promise<boolean> {
  // slug 계산
  const slug = keyword.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  const filepath = path.join(POSTS_DIR, `${slug}.md`);

  // 기존 파일에서 날짜 추출
  let existingDate: string | undefined;
  if (fs.existsSync(filepath)) {
    const existing = fs.readFileSync(filepath, 'utf-8');
    const dateMatch = existing.match(/^date:\s*(\d{4}-\d{2}-\d{2})/m);
    if (dateMatch) existingDate = dateMatch[1];
  }

  const prompt = createPrompt(keyword, category, existingDate);

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  // 기본 유효성 검사
  if (!text.includes('---') || text.length < 500) {
    throw new Error(`Invalid output (len=${text.length})`);
  }

  fs.writeFileSync(filepath, text, { encoding: 'utf-8' });
  return true;
}

// ─── 메인 루프 ───

const MAX_RETRIES = 3;
const RETRY_DELAYS = [10000, 30000, 60000]; // 10s, 30s, 60s
const POST_DELAY = 5000; // 5s 간격

async function main() {
  const plan = JSON.parse(fs.readFileSync(PLAN_FILE, 'utf-8'));
  const progress = loadProgress();

  // 전체 남은 수 계산
  let totalRemaining = 0;
  for (const batch of plan.batches) {
    for (const post of batch.posts) {
      const key = `${batch.category}:${post}`;
      if (!progress[key]) totalRemaining++;
    }
  }

  log(`\n${'='.repeat(60)}`);
  log(`🚀 재생성 시작 — 남은 포스트: ${totalRemaining}`);
  log(`${'='.repeat(60)}\n`);

  let success = 0;
  let failed = 0;
  const failedList: string[] = [];
  let globalIndex = Object.keys(progress).length;

  for (const batch of plan.batches) {
    for (const post of batch.posts) {
      const key = `${batch.category}:${post}`;

      if (progress[key]) continue; // 이미 완료

      let ok = false;
      for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
        if (attempt > 0) {
          const delay = RETRY_DELAYS[attempt - 1];
          log(`  🔄 리트라이 ${attempt}/${MAX_RETRIES} (${delay/1000}s 대기)...`);
          await sleep(delay);
        }

        try {
          log(`📝 [${globalIndex + 1}/${globalIndex + totalRemaining}] ${post}`);
          await generateAndSave(post, batch.category);
          ok = true;
          break;
        } catch (err: any) {
          const msg = err?.message?.slice(0, 120) || 'unknown error';
          log(`  ⚠️ 실패 (attempt ${attempt + 1}): ${msg}`);
          
          // Rate limit → 더 긴 대기
          if (msg.includes('429') || msg.includes('rate') || msg.includes('quota')) {
            log('  ⏳ Rate limit 감지 — 60s 대기');
            await sleep(60000);
          }
        }
      }

      if (ok) {
        globalIndex++;
        totalRemaining--;
        success++;
        progress[key] = true;
        saveProgress(progress);
        log(`✅ 완료 [${globalIndex}] — 남은: ${totalRemaining}`);
      } else {
        failed++;
        failedList.push(`[${batch.category}] ${post}`);
        log(`❌ 최종 실패: ${post}`);
      }

      // 다음 포스트까지 대기
      if (totalRemaining > 0) await sleep(POST_DELAY);
    }
  }

  // 최종 요약
  log(`\n${'='.repeat(60)}`);
  log(`🏁 완료! ✅ ${success} 성공 / ❌ ${failed} 실패`);
  log(`${'='.repeat(60)}`);

  if (failedList.length > 0) {
    log('\n실패 목록:');
    failedList.forEach(p => log(`  - ${p}`));
  }
}

main().catch(err => {
  log(`💀 치명적 오류: ${err.message}`);
  process.exit(1);
});
