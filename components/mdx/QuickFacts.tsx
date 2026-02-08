'use client';

/**
 * QuickFacts Component
 * GEO 최적화: 팩트 밀도(Fact Density) 강화
 * Deep Research 전략: "150~200단어마다 통계 자료나 구체적인 수치 포함"
 */

interface Fact {
  /** 항목명 */
  label: string;
  /** 값 (숫자, 텍스트, 가격 등) */
  value: string;
  /** 아이콘 (이모지) */
  icon?: string;
  /** 부가 설명 */
  note?: string;
}

interface QuickFactsProps {
  /** 제목 */
  title?: string;
  /** 팩트 배열 */
  facts?: Fact[];
  /** 팩트 배열 (alias) */
  data?: Fact[];
  /** 열 수 (기본 2) */
  columns?: 2 | 3 | 4;
  /** 강조 스타일 */
  variant?: 'default' | 'compact' | 'highlight';
}

export default function QuickFacts({ 
  title = "Quick Facts", 
  facts,
  data,
  columns = 2,
  variant = 'default'
}: QuickFactsProps) {
  const resolvedFacts = facts ?? data ?? [];
  const gridCols = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-2 lg:grid-cols-4',
  };

  if (variant === 'compact') {
    return (
      <div className="my-8 bg-gray-50 rounded-xl border border-gray-200 p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <span>📋</span> {title}
        </h3>
        <dl className={`grid ${gridCols[columns]} gap-4`}>
          {resolvedFacts.map((fact, index) => (
            <div key={index} className="flex items-center gap-3">
              {fact.icon && <span className="text-xl">{fact.icon}</span>}
              <div>
                <dt className="text-sm text-gray-500">{fact.label}</dt>
                <dd className="font-semibold text-gray-900">{fact.value}</dd>
              </div>
            </div>
          ))}
        </dl>
      </div>
    );
  }

  if (variant === 'highlight') {
    return (
      <div className="my-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <span>📊</span> {title}
        </h3>
        <div className={`grid ${gridCols[columns]} gap-4`}>
          {resolvedFacts.map((fact, index) => (
            <div 
              key={index}
              className="bg-gradient-to-br from-stone-700 to-stone-800 rounded-xl p-5 text-white shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-stone-300 text-sm font-medium mb-1">{fact.label}</p>
                  <p className="text-2xl font-bold">{fact.value}</p>
                  {fact.note && (
                    <p className="text-stone-300 text-xs mt-2">{fact.note}</p>
                  )}
                </div>
                {fact.icon && (
                  <span className="text-3xl opacity-80">{fact.icon}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div className="my-8 bg-white rounded-2xl border-2 border-gray-200 overflow-hidden shadow-lg">
      <div className="bg-stone-800 px-6 py-4">
        <h3 className="text-xl font-bold text-white m-0 p-0 border-none flex items-center gap-2" style={{ color: 'white' }}>
          <span>📋</span> {title}
        </h3>
      </div>
      
      <div className={`grid ${gridCols[columns]} gap-0 divide-x divide-y divide-gray-100`}>
        {resolvedFacts.map((fact, index) => (
          <div 
            key={index}
            className="p-5 hover:bg-amber-50 transition-colors group"
          >
            <div className="flex items-start gap-4">
              {fact.icon && (
                <span className="text-3xl group-hover:scale-110 transition-transform">
                  {fact.icon}
                </span>
              )}
              <div className="flex-1">
                <dt className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">
                  {fact.label}
                </dt>
                <dd className="text-xl font-bold text-gray-900">
                  {fact.value}
                </dd>
                {fact.note && (
                  <p className="text-sm text-gray-500 mt-1">{fact.note}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
