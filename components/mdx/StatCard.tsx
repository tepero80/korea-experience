'use client';

/**
 * StatCard Component
 * GEO 최적화: 통계 및 수치 하이라이트
 * Deep Research 전략: "팩트 밀도 강화" - AI가 구체적 수치 인용
 */

interface StatItem {
  /** 숫자 값 */
  value: string;
  /** 라벨 */
  label: string;
  /** 부가 설명 */
  description?: string;
  /** 아이콘 (이모지) */
  icon?: string;
  /** 변화율 (예: +15%, -3%) */
  change?: string;
  /** 변화 방향 */
  trend?: 'up' | 'down' | 'neutral';
}

interface StatCardProps {
  /** 제목 (선택) */
  title?: string;
  /** 통계 배열 */
  stats: StatItem[];
  /** 스타일 변형 */
  variant?: 'default' | 'gradient' | 'minimal' | 'hero';
  /** 열 수 */
  columns?: 2 | 3 | 4;
  /** 출처 */
  source?: string;
  /** 기준일 */
  asOf?: string;
}

export default function StatCard({ 
  title, 
  stats, 
  variant = 'default',
  columns = 3,
  source,
  asOf
}: StatCardProps) {
  const gridCols = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-2 lg:grid-cols-4',
  };

  const trendIcon = (trend?: 'up' | 'down' | 'neutral') => {
    switch (trend) {
      case 'up': return <span className="text-green-500">↑</span>;
      case 'down': return <span className="text-red-500">↓</span>;
      default: return <span className="text-gray-400">→</span>;
    }
  };

  // Hero variant - 대형 단일 통계
  if (variant === 'hero' && stats.length > 0) {
    const mainStat = stats[0];
    return (
      <div className="my-8 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 rounded-2xl p-8 text-white text-center shadow-xl">
        {mainStat.icon && <div className="text-5xl mb-4">{mainStat.icon}</div>}
        <div className="text-6xl md:text-7xl font-black mb-2">{mainStat.value}</div>
        <div className="text-xl text-blue-200 font-medium">{mainStat.label}</div>
        {mainStat.description && (
          <p className="text-blue-100 mt-4 max-w-md mx-auto">{mainStat.description}</p>
        )}
        {(source || asOf) && (
          <div className="text-xs text-blue-200/60 mt-6">
            {source && <span>Source: {source}</span>}
            {source && asOf && <span> • </span>}
            {asOf && <span>As of {asOf}</span>}
          </div>
        )}
      </div>
    );
  }

  // Gradient variant
  if (variant === 'gradient') {
    return (
      <div className="my-8">
        {title && (
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span>📊</span> {title}
          </h3>
        )}
        <div className={`grid ${gridCols[columns]} gap-4`}>
          {stats.map((stat, index) => {
            const gradients = [
              'from-blue-500 to-indigo-600',
              'from-emerald-500 to-teal-600',
              'from-purple-500 to-pink-600',
              'from-amber-500 to-orange-600',
            ];
            const gradient = gradients[index % gradients.length];
            
            return (
              <div 
                key={index}
                className={`bg-gradient-to-br ${gradient} rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    {stat.icon && <div className="text-3xl mb-2 opacity-80">{stat.icon}</div>}
                    <div className="text-4xl font-bold mb-1">{stat.value}</div>
                    <div className="text-sm opacity-90">{stat.label}</div>
                    {stat.change && (
                      <div className="mt-2 text-sm font-medium bg-white/20 inline-flex items-center gap-1 px-2 py-1 rounded-full">
                        {trendIcon(stat.trend)} {stat.change}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {(source || asOf) && (
          <div className="text-xs text-gray-500 mt-4 text-right">
            {source && <span>Source: {source}</span>}
            {source && asOf && <span> • </span>}
            {asOf && <span>As of {asOf}</span>}
          </div>
        )}
      </div>
    );
  }

  // Minimal variant
  if (variant === 'minimal') {
    return (
      <div className="my-6 flex flex-wrap gap-6 justify-center">
        {stats.map((stat, index) => (
          <div key={index} className="text-center">
            <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
            <div className="text-sm text-gray-500">{stat.label}</div>
          </div>
        ))}
      </div>
    );
  }

  // Default variant
  return (
    <div className="my-8 bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
      {title && (
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-6 py-4">
          <h3 className="text-xl font-bold text-white m-0 p-0 border-none flex items-center gap-2">
            <span>📊</span> {title}
          </h3>
        </div>
      )}
      
      <div className={`grid ${gridCols[columns]} divide-x divide-y divide-gray-100`}>
        {stats.map((stat, index) => (
          <div 
            key={index}
            className="p-6 hover:bg-gray-50 transition-colors text-center"
          >
            {stat.icon && (
              <div className="text-4xl mb-3">{stat.icon}</div>
            )}
            <div className="text-4xl font-bold text-gray-900 mb-1">
              {stat.value}
            </div>
            <div className="text-sm font-medium text-gray-600 mb-1">
              {stat.label}
            </div>
            {stat.change && (
              <div className={`text-sm font-medium inline-flex items-center gap-1 px-2 py-1 rounded-full ${
                stat.trend === 'up' ? 'bg-green-100 text-green-700' :
                stat.trend === 'down' ? 'bg-red-100 text-red-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {trendIcon(stat.trend)} {stat.change}
              </div>
            )}
            {stat.description && (
              <p className="text-xs text-gray-500 mt-2">{stat.description}</p>
            )}
          </div>
        ))}
      </div>
      
      {(source || asOf) && (
        <div className="bg-gray-50 border-t border-gray-100 px-6 py-3 text-xs text-gray-500">
          {source && <span>Source: {source}</span>}
          {source && asOf && <span> • </span>}
          {asOf && <span>As of {asOf}</span>}
        </div>
      )}
    </div>
  );
}
