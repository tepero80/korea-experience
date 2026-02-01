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
      
      await processBatch(batch, progress);
      
      if (i < plan.batches.length - 1) {
        console.log('\n⏳ 다음 배치까지 5초 대기...\n');
        await sleep(5000);
      }
    }
  }
  
  console.log('\n✅ 생성 완료!\n');
  showProgress(plan, progress);
}

// 배치 처리
async function processBatch(batch: { name: string; category: string; posts: string[] }, progress: Record<string, boolean>) {
  for (let i = 0; i < batch.posts.length; i++) {
    const keyword = batch.posts[i];
    const key = `${batch.category}:${keyword}`;
    
    if (progress[key]) {
      console.log(`⏭️  건너뜀 (이미 생성됨): ${keyword}`);
      continue;
    }
    
    console.log(`\n📝 생성 중 (${i + 1}/${batch.posts.length}): ${keyword}`);
    
    try {
      execSync(`npm run generate "${keyword}" "${batch.category}"`, {
        stdio: 'inherit',
        cwd: process.cwd()
      });
      
      progress[key] = true;
      saveProgress(progress);
      
      console.log(`✅ 완료: ${keyword}`);
      
      if (i < batch.posts.length - 1) {
        console.log('⏳ 3초 대기...');
        await sleep(3000);
      }
    } catch (error) {
      console.error(`❌ 실패: ${keyword}`);
      console.error(error);
    }
  }
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
