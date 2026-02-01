import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const POSTS_DIR = path.join(process.cwd(), 'content', 'posts');

interface PostInfo {
  filename: string;
  title: string;
  category: string;
  date: string;
  wordCount: number;
}

// 모든 포스트 정보 수집
function getAllPostsInfo(): PostInfo[] {
  const files = fs.readdirSync(POSTS_DIR).filter(file => file.endsWith('.md'));
  
  return files.map(filename => {
    const filePath = path.join(POSTS_DIR, filename);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { data, content } = matter(fileContent);
    const wordCount = content.split(/\s+/).length;
    
    return {
      filename,
      title: data.title || 'Untitled',
      category: data.category || 'Uncategorized',
      date: data.date || 'Unknown',
      wordCount
    };
  });
}

// 카테고리별 통계
function getCategoryStats(posts: PostInfo[]) {
  const stats: Record<string, { count: number; totalWords: number; posts: string[] }> = {};
  
  posts.forEach(post => {
    if (!stats[post.category]) {
      stats[post.category] = { count: 0, totalWords: 0, posts: [] };
    }
    stats[post.category].count++;
    stats[post.category].totalWords += post.wordCount;
    stats[post.category].posts.push(post.title);
  });
  
  return stats;
}

// 메인 명령어 처리
const command = process.argv[2];

switch (command) {
  case 'list':
    const allPosts = getAllPostsInfo();
    console.log('\n📚 전체 블로그 포스트 목록\n');
    console.log(`총 ${allPosts.length}개 포스트\n`);
    
    allPosts.forEach((post, index) => {
      console.log(`${index + 1}. ${post.title}`);
      console.log(`   카테고리: ${post.category} | 날짜: ${post.date} | 단어수: ${post.wordCount.toLocaleString()}`);
      console.log(`   파일: ${post.filename}\n`);
    });
    break;
    
  case 'stats':
    const posts = getAllPostsInfo();
    const stats = getCategoryStats(posts);
    
    console.log('\n📊 카테고리별 통계\n');
    console.log(`총 포스트: ${posts.length}개`);
    console.log(`총 단어수: ${posts.reduce((sum, p) => sum + p.wordCount, 0).toLocaleString()}개\n`);
    
    Object.entries(stats).forEach(([category, data]) => {
      console.log(`📁 ${category}`);
      console.log(`   포스트: ${data.count}개`);
      console.log(`   총 단어: ${data.totalWords.toLocaleString()}개`);
      console.log(`   평균 단어: ${Math.round(data.totalWords / data.count).toLocaleString()}개\n`);
    });
    
    console.log('\n🎯 애드센스 승인 진행률');
    console.log(`현재: ${posts.length}개 / 목표: 30개 (${Math.round(posts.length / 30 * 100)}%)`);
    console.log(`남은 포스트: ${Math.max(0, 30 - posts.length)}개\n`);
    break;
    
  case 'category':
    const categoryName = process.argv[3];
    if (!categoryName) {
      console.error('❌ 카테고리 이름을 입력하세요: npm run manage category "Medical Tourism"');
      process.exit(1);
    }
    
    const categoryPosts = getAllPostsInfo().filter(p => p.category === categoryName);
    console.log(`\n📁 ${categoryName} 카테고리 (${categoryPosts.length}개)\n`);
    
    categoryPosts.forEach((post, index) => {
      console.log(`${index + 1}. ${post.title}`);
      console.log(`   날짜: ${post.date} | 단어: ${post.wordCount.toLocaleString()}개`);
      console.log(`   파일: ${post.filename}\n`);
    });
    break;
    
  case 'missing':
    const existingPosts = getAllPostsInfo();
    const categories = ['Medical Tourism', 'Travel & Tourism', 'K-Culture', 'Investment'];
    
    console.log('\n🔍 카테고리별 부족한 포스트\n');
    
    categories.forEach(cat => {
      const count = existingPosts.filter(p => p.category === cat).length;
      const target = 8; // 카테고리당 목표
      const missing = Math.max(0, target - count);
      
      console.log(`${cat}: ${count}/${target}개 ${missing > 0 ? `(${missing}개 부족)` : '✅'}`);
    });
    console.log();
    break;
    
  default:
    console.log('\n📖 포스트 관리 명령어\n');
    console.log('npm run manage list      - 전체 포스트 목록');
    console.log('npm run manage stats     - 카테고리별 통계');
    console.log('npm run manage category "카테고리" - 특정 카테고리 포스트');
    console.log('npm run manage missing   - 부족한 포스트 확인\n');
}
