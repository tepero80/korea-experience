'use client';

/**
 * StepGuide Component
 * GEO 최적화: HowTo 스키마와 연동되는 단계별 가이드
 * Deep Research 전략: AI가 HowTo 스키마 인식하여 Featured Snippet 생성
 */

interface Step {
  /** 단계 제목 */
  title: string;
  /** 상세 설명 */
  description: string;
  /** 이미지 URL (선택) */
  image?: string;
  /** 소요 시간 (선택) */
  duration?: string;
  /** 팁 (선택) */
  tip?: string;
  /** 아이콘 (이모지) */
  icon?: string;
}

interface StepGuideProps {
  /** 가이드 제목 */
  title: string;
  /** 단계 배열 */
  steps: Step[];
  /** 총 소요 시간 */
  totalTime?: string;
  /** 예상 비용 */
  estimatedCost?: string;
  /** 난이도 */
  difficulty?: 'easy' | 'medium' | 'hard';
  /** 스타일 변형 */
  variant?: 'default' | 'numbered' | 'timeline';
}

const difficultyConfig = {
  easy: { label: 'Easy', color: 'bg-green-100 text-green-700', icon: '🟢' },
  medium: { label: 'Medium', color: 'bg-yellow-100 text-yellow-700', icon: '🟡' },
  hard: { label: 'Hard', color: 'bg-red-100 text-red-700', icon: '🔴' },
};

export default function StepGuide({ 
  title, 
  steps, 
  totalTime,
  estimatedCost,
  difficulty,
  variant = 'default'
}: StepGuideProps) {
  return (
    <div 
      className="my-10"
      itemScope 
      itemType="https://schema.org/HowTo"
    >
      {/* Header */}
      <div className="mb-6">
        <h3 
          className="text-2xl font-bold text-gray-900 mb-4"
          itemProp="name"
        >
          📖 {title}
        </h3>
        
        {/* Meta Info */}
        <div className="flex flex-wrap gap-4 text-sm">
          {totalTime && (
            <span 
              className="flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full font-medium"
              itemProp="totalTime"
              content={totalTime}
            >
              ⏱️ {totalTime}
            </span>
          )}
          {estimatedCost && (
            <span 
              className="flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1.5 rounded-full font-medium"
              itemProp="estimatedCost"
              content={estimatedCost}
            >
              💰 {estimatedCost}
            </span>
          )}
          {difficulty && (
            <span className={`flex items-center gap-2 px-3 py-1.5 rounded-full font-medium ${difficultyConfig[difficulty].color}`}>
              {difficultyConfig[difficulty].icon} {difficultyConfig[difficulty].label}
            </span>
          )}
          <span className="flex items-center gap-2 bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full font-medium">
            📝 {steps.length} Steps
          </span>
        </div>
      </div>

      {/* Steps */}
      <div className="relative">
        {variant !== 'numbered' && (
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500" />
        )}
        
        <div className="space-y-6">
          {steps.map((step, index) => (
            <div 
              key={index}
              className={`relative ${variant === 'numbered' ? '' : 'pl-16'}`}
              itemScope
              itemProp="step"
              itemType="https://schema.org/HowToStep"
            >
              {/* Step Number */}
              {variant !== 'numbered' ? (
                <div className="absolute left-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg z-10">
                  {step.icon || index + 1}
                </div>
              ) : null}
              
              {/* Step Content */}
              <div 
                className={`bg-white rounded-xl border-2 border-gray-200 p-6 shadow-md hover:shadow-lg transition-shadow ${variant === 'numbered' ? 'flex gap-4' : ''}`}
              >
                {variant === 'numbered' && (
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                    {step.icon || index + 1}
                  </div>
                )}
                
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <h4 
                      className="text-lg font-bold text-gray-900 m-0 p-0 border-none"
                      itemProp="name"
                    >
                      Step {index + 1}: {step.title}
                    </h4>
                    {step.duration && (
                      <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full whitespace-nowrap">
                        ⏱️ {step.duration}
                      </span>
                    )}
                  </div>
                  
                  <p 
                    className="text-gray-600 leading-relaxed m-0"
                    itemProp="text"
                  >
                    {step.description}
                  </p>
                  
                  {step.tip && (
                    <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm">
                      <span className="font-semibold text-amber-700">💡 Tip: </span>
                      <span className="text-amber-800">{step.tip}</span>
                    </div>
                  )}
                  
                  {step.image && (
                    <div className="mt-4">
                      <img 
                        src={step.image} 
                        alt={step.title}
                        className="rounded-lg shadow-md w-full max-h-64 object-cover"
                        itemProp="image"
                      />
                    </div>
                  )}
                </div>
              </div>
              
              <meta itemProp="position" content={String(index + 1)} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
