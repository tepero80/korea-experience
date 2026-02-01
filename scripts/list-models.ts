import { config } from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

config({ path: '.env.local' });

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error('❌ API 키가 없습니다.');
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

async function listModels() {
  try {
    console.log('🔍 사용 가능한 모델 확인 중...\n');
    
    // 몇 가지 일반적인 모델 이름 시도
    const modelsToTry = [
      'gemini-pro',
      'gemini-1.5-pro',
      'gemini-1.5-flash',
      'gemini-1.0-pro',
      'models/gemini-pro',
      'models/gemini-1.5-flash',
    ];
    
    for (const modelName of modelsToTry) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent('Hello');
        const text = result.response.text();
        console.log(`✅ ${modelName} - 작동함!`);
        console.log(`   응답: ${text.substring(0, 50)}...\n`);
        return modelName;
      } catch (error: any) {
        console.log(`❌ ${modelName} - 실패 (${error.message?.substring(0, 80)}...)`);
      }
    }
    
    console.log('\n⚠️  모든 모델 시도 실패');
  } catch (error) {
    console.error('오류:', error);
  }
}

listModels();
