import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

interface ContentPlan {
  batches: Array<{
    name: string;
    category: string;
    posts: string[];
  }>;
}

const PLAN_FILE = path.join(process.cwd(), 'scripts', 'content-plan.json');
const PROGRESS_FILE = path.join(process.cwd(), 'scripts', 'generation-progress.json');
const LOG_FILE = path.join(process.cwd(), 'scripts', 'generation-log.txt');

function log(msg: string) {
  const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);
  const line = `[${timestamp}] ${msg}`;
  console.log(line);
  fs.appendFileSync(LOG_FILE, line + '\n');
}

// 진행상황 로드
function loadProgress(): Record<string, boolean> {
  if (fs.existsSync(PROGRESS_FILE)) {
    return JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf-8'));
  }
  return {};
}

// 진행상황 저장
function saveProgress(progress: Record<string, boolean>) {
  fs.writeFileSync(PROGRESS_FILE, JSON.stringify(progress, null, 2));
}

// 배치 실행
async function runBatch(batchIndex?: number) {
  const plan: ContentPlan = JSON.parse(fs.readFileSync(PLAN_FILE, 'utf-8'));
  const progress = loadProgress();
  
  if (batchIndex !== undefined) {
    // 특정 배치만 실행
    if (batchIndex < 0 || batchIndex >= plan.batches.length) {
      console.error(`❌ 잘못된 배치 번호: ${batchIndex} (0-${plan.batches.length - 1})`);
      process.exit(1);
    }
    
    const batch = plan.batches[batchIndex];
    console.log(`\n🚀 배치 ${batchIndex + 1}: ${batch.name}\n`);
    
    await processBatch(batch, progress);
  } else {
    // 모든 배치 실행
    console.log('\n🚀 전체 콘텐츠 생성 시작\n');
    
    for (let i = 0; i < plan.batches.length; i++) {
      const batch = plan.batches[i];
      console.log(`\n📦 배치 ${i + 1}/${plan.batches.length}: ${batch.name}\n`);
      
      const didWork = await processBatch(batch, progress);
      
      // 일일 할당량 초과 시 전체 중단
      if (dailyQuotaExhausted) {
        log(`\n🛑 일일 할당량 초과로 전체 프로세스를 종료합니다.`);
        break;
      }
      
      if (didWork && i < plan.batches.length - 1) {
        log('\n⏳ 다음 배치까지 10초 대기...\n');
        await sleep(10000);
      }
    }
  }
  
  // 최종 요약
  const summary = `\n${'='.repeat(60)}\n🏁 재생성 완료!\n  ✅ 성공: ${totalSuccess}\n  ❌ 실패: ${totalFailed}\n${'='.repeat(60)}`;
  log(summary);
  
  if (failedPosts.length > 0) {
    log('\n실패한 포스트:');
    failedPosts.forEach(p => log(`  - ${p}`));
  }
  
  showProgress(plan, progress);
}

// 배치 처리 (리트라이 + 지수 백오프)
const MAX_RETRIES = 3;
const RETRY_DELAYS = [15000, 45000, 90000]; // 15s, 45s, 90s
const POST_DELAY = 8000; // 8s between posts (rate limit 방지)
const CONSECUTIVE_FAIL_LIMIT = 3; // 연속 실패 N회 시 일일 할당량 초과로 판단

let totalSuccess = 0;
let totalFailed = 0;
let consecutiveFailures = 0; // 연속 실패 카운터
let dailyQuotaExhausted = false;
const failedPosts: string[] = [];

function isDailyQuotaError(errorMsg: string): boolean {
  return errorMsg.includes('generate_requests_per_model_per_day') ||
         errorMsg.includes('429') && errorMsg.includes('quota');
}

async function processBatch(batch: { name: string; category: string; posts: string[] }, progress: Record<string, boolean>): Promise<boolean> {
  let didGenerate = false;
  for (let i = 0; i < batch.posts.length; i++) {
    const keyword = batch.posts[i];
    const key = `${batch.category}:${keyword}`;
    
    if (progress[key]) {
      continue;
    }

    // 일일 할당량 초과 감지 시 즉시 중단
    if (dailyQuotaExhausted) {
      log(`⛔ 일일 할당량 초과 — 스킵: ${keyword}`);
      continue;
    }
    
    let success = false;
    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      if (attempt > 0) {
        // 일일 할당량 에러면 리트라이 하지 않음
        if (dailyQuotaExhausted) break;
        const delay = RETRY_DELAYS[attempt - 1];
        log(`🔄 리트라이 ${attempt}/${MAX_RETRIES} (${delay/1000}s 후): ${keyword}`);
        await sleep(delay);
      }
      
      log(`📝 생성 중 (${i + 1}/${batch.posts.length}): ${keyword}`);
      
      try {
        const output = execSync(`npx tsx scripts/generate-content.ts "${keyword}" "${batch.category}"`, {
          cwd: process.cwd(),
          timeout: 120000, // 2분 타임아웃
          encoding: 'utf-8',
          stdio: ['pipe', 'pipe', 'pipe']
        });
        
        // 성공 시 stdout 출력
        if (output) console.log(output);
        
        progress[key] = true;
        saveProgress(progress);
        totalSuccess++;
        consecutiveFailures = 0; // 성공 시 연속 실패 리셋
        log(`✅ 완료 [${totalSuccess}]: ${keyword}`);
        success = true;
        didGenerate = true;
        break;
      } catch (error: any) {
        const errMsg = error.stderr?.toString() || error.stdout?.toString() || error.message || '';
        const shortErr = (error.message || 'unknown').slice(0, 100);
        log(`⚠️  시도 ${attempt + 1} 실패: ${keyword} — ${shortErr}`);
        
        // 일일 할당량 에러 감지
        if (isDailyQuotaError(errMsg)) {
          consecutiveFailures++;
          if (consecutiveFailures >= CONSECUTIVE_FAIL_LIMIT) {
            dailyQuotaExhausted = true;
            log(`\n🛑 일일 API 할당량 초과 감지 (연속 ${consecutiveFailures}회 429 에러)`);
            log(`🛑 내일 할당량 리셋 후 다시 실행하세요: npx tsx scripts/batch-generate.ts run-all`);
            log(`🛑 현재까지 완료: ${totalSuccess}개\n`);
            break;
          }
        }
      }
    }
    
    if (!success) {
      totalFailed++;
      failedPosts.push(`[${batch.category}] ${keyword}`);
      if (!dailyQuotaExhausted) {
        log(`❌ 최종 실패: ${keyword}`);
      }
    }
    
    if (success && i < batch.posts.length - 1) {
      await sleep(POST_DELAY);
    }
  }
  return didGenerate;
}

// 진행상황 표시
function showProgress(plan: ContentPlan, progress: Record<string, boolean>) {
  console.log('\n📊 전체 진행 상황\n');
  
  let totalPosts = 0;
  let completedPosts = 0;
  
  plan.batches.forEach((batch, index) => {
    const batchCompleted = batch.posts.filter(post => 
      progress[`${batch.category}:${post}`]
    ).length;
    
    totalPosts += batch.posts.length;
    completedPosts += batchCompleted;
    
    const percentage = Math.round((batchCompleted / batch.posts.length) * 100);
    const bar = '█'.repeat(Math.round(percentage / 10)) + '░'.repeat(10 - Math.round(percentage / 10));
    
    console.log(`${index + 1}. ${batch.name}`);
    console.log(`   ${bar} ${batchCompleted}/${batch.posts.length} (${percentage}%)\n`);
  });
  
  console.log(`총 진행률: ${completedPosts}/${totalPosts} (${Math.round((completedPosts / totalPosts) * 100)}%)`);
  console.log(`애드센스 목표: ${completedPosts}/30 (${Math.round((completedPosts / 30) * 100)}%)\n`);
}

// 배치 목록 표시
function listBatches() {
  const plan: ContentPlan = JSON.parse(fs.readFileSync(PLAN_FILE, 'utf-8'));
  const progress = loadProgress();
  
  console.log('\n📋 콘텐츠 생성 계획\n');
  
  plan.batches.forEach((batch, index) => {
    const completed = batch.posts.filter(post => 
      progress[`${batch.category}:${post}`]
    ).length;
    
    console.log(`${index}. ${batch.name}`);
    console.log(`   카테고리: ${batch.category}`);
    console.log(`   포스트: ${batch.posts.length}개 (완료: ${completed}개)`);
    console.log(`   상태: ${completed === batch.posts.length ? '✅ 완료' : `⏳ ${completed}/${batch.posts.length}`}\n`);
  });
  
  console.log('명령어:');
  console.log('npm run batch list           - 배치 목록');
  console.log('npm run batch progress       - 진행상황');
  console.log('npm run batch run [번호]     - 특정 배치 실행');
  console.log('npm run batch run-all        - 전체 실행\n');
}

// Sleep 함수
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// 메인
const command = process.argv[2];
const arg = process.argv[3];

(async () => {
  switch (command) {
    case 'list':
      listBatches();
      break;
      
    case 'progress':
      const plan = JSON.parse(fs.readFileSync(PLAN_FILE, 'utf-8'));
      const progress = loadProgress();
      showProgress(plan, progress);
      break;
      
    case 'run':
      if (arg === undefined) {
        console.error('❌ 배치 번호를 입력하세요: npm run batch run 0');
        process.exit(1);
      }
      await runBatch(parseInt(arg));
      break;
      
    case 'run-all':
      await runBatch();
      break;
      
    default:
      console.log('\n📖 배치 생성 명령어\n');
      console.log('npm run batch list           - 배치 목록');
      console.log('npm run batch progress       - 진행상황');
      console.log('npm run batch run [번호]     - 특정 배치 실행 (예: npm run batch run 0)');
      console.log('npm run batch run-all        - 전체 실행\n');
  }
})();
