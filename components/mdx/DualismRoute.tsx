'use client';

/**
 * DualismRoute Component
 * Deep Research 전략: "이원적 가치 소비(Dualistic Consumption)" 시각화
 * 하나의 여행지에서 럭셔리와 실속을 동시에 즐기는 코스 제안
 */

interface RouteStop {
  /** 장소명 */
  name: string;
  /** 유형 (luxury/budget) */
  type: 'luxury' | 'budget';
  /** 설명 */
  description: string;
  /** 예상 비용 */
  cost?: string;
  /** 소요 시간 */
  duration?: string;
  /** 이미지 URL */
  image?: string;
  /** 팁 */
  tip?: string;
  /** 아이콘 (이모지) */
  icon?: string;
}

interface DualismRouteProps {
  /** 제목 */
  title: string;
  /** 부제목 */
  subtitle?: string;
  /** 지역 */
  area: string;
  /** 총 예상 비용 */
  totalBudget?: {
    luxury: string;
    budget: string;
  };
  /** 총 소요 시간 */
  totalTime?: string;
  /** 경로 정거장 */
  stops: RouteStop[];
  /** 추천 이유 */
  recommendation?: string;
}

export default function DualismRoute({
  title,
  subtitle,
  area,
  totalBudget,
  totalTime,
  stops,
  recommendation,
}: DualismRouteProps) {
  const luxuryStops = stops.filter(s => s.type === 'luxury');
  const budgetStops = stops.filter(s => s.type === 'budget');

  return (
    <div className="my-10">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 rounded-t-2xl p-6 text-white">
        <div className="flex items-center gap-2 text-amber-100 text-sm font-medium mb-2">
          <span>🗺️</span> {area} • Dualism Route
        </div>
        <h3 className="text-2xl md:text-3xl font-bold m-0 p-0 border-none mb-2">
          {title}
        </h3>
        {subtitle && <p className="text-amber-100 text-lg">{subtitle}</p>}
        
        {/* Quick Stats */}
        <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-white/20">
          {totalTime && (
            <span className="flex items-center gap-2 bg-white/20 px-3 py-1.5 rounded-full text-sm">
              ⏱️ {totalTime}
            </span>
          )}
          {totalBudget && (
            <>
              <span className="flex items-center gap-2 bg-amber-400/30 px-3 py-1.5 rounded-full text-sm">
                💎 Luxury: {totalBudget.luxury}
              </span>
              <span className="flex items-center gap-2 bg-green-400/30 px-3 py-1.5 rounded-full text-sm">
                💰 Budget: {totalBudget.budget}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Concept Explanation */}
      <div className="bg-gradient-to-r from-amber-50 to-rose-50 border-x-2 border-amber-200 p-4">
        <div className="flex items-center gap-3 text-sm">
          <span className="text-2xl">✨</span>
          <p className="text-gray-700 m-0">
            <strong>The Dualism Concept:</strong> Experience the best of both worlds — 
            premium luxury moments paired with authentic budget-friendly experiences in one route.
          </p>
        </div>
      </div>

      {/* Route Visualization */}
      <div className="bg-white rounded-b-2xl border-2 border-t-0 border-gray-200 overflow-hidden">
        <div className="p-6">
          {/* Timeline */}
          <div className="relative">
            {/* Connecting Line */}
            <div className="absolute left-6 top-0 bottom-0 w-1 bg-gradient-to-b from-amber-400 via-gray-300 to-green-400" />
            
            <div className="space-y-8">
              {stops.map((stop, index) => {
                const isLuxury = stop.type === 'luxury';
                const bgColor = isLuxury 
                  ? 'bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200' 
                  : 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200';
                const iconBg = isLuxury
                  ? 'bg-gradient-to-br from-amber-400 to-yellow-500'
                  : 'bg-gradient-to-br from-green-400 to-emerald-500';
                
                return (
                  <div key={index} className="relative flex gap-4 pl-14">
                    {/* Icon */}
                    <div 
                      className={`absolute left-0 w-12 h-12 ${iconBg} rounded-full flex items-center justify-center text-2xl text-white shadow-lg z-10`}
                    >
                      {stop.icon || (isLuxury ? '💎' : '💰')}
                    </div>
                    
                    {/* Content */}
                    <div className={`flex-1 ${bgColor} border-2 rounded-xl p-5 hover:shadow-md transition-shadow`}>
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div>
                          <span className={`text-xs font-bold uppercase tracking-wide ${isLuxury ? 'text-amber-600' : 'text-green-600'}`}>
                            {isLuxury ? '✨ Luxury' : '🌿 Budget-Friendly'}
                          </span>
                          <h4 className="text-lg font-bold text-gray-900 m-0 p-0 border-none">
                            {stop.name}
                          </h4>
                        </div>
                        <div className="flex flex-col items-end gap-1 text-sm">
                          {stop.duration && (
                            <span className="text-gray-500">⏱️ {stop.duration}</span>
                          )}
                          {stop.cost && (
                            <span className={`font-bold ${isLuxury ? 'text-amber-600' : 'text-green-600'}`}>
                              {stop.cost}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <p className="text-gray-600 mb-0">{stop.description}</p>
                      
                      {stop.tip && (
                        <div className={`mt-3 p-3 rounded-lg text-sm ${isLuxury ? 'bg-amber-100/50' : 'bg-green-100/50'}`}>
                          <span className="font-semibold">💡 Pro Tip: </span>
                          {stop.tip}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Summary */}
        {recommendation && (
          <div className="bg-gray-50 border-t border-gray-200 p-5">
            <div className="flex items-start gap-3">
              <span className="text-2xl">🎯</span>
              <div>
                <div className="font-semibold text-gray-800 mb-1">Why This Route Works</div>
                <p className="text-gray-600 text-sm m-0">{recommendation}</p>
              </div>
            </div>
          </div>
        )}

        {/* Balance Stats */}
        <div className="grid grid-cols-2 border-t border-gray-200">
          <div className="p-4 text-center border-r border-gray-200 bg-amber-50">
            <div className="text-3xl font-bold text-amber-600">{luxuryStops.length}</div>
            <div className="text-sm text-gray-600">Luxury Experiences</div>
          </div>
          <div className="p-4 text-center bg-green-50">
            <div className="text-3xl font-bold text-green-600">{budgetStops.length}</div>
            <div className="text-sm text-gray-600">Budget-Friendly Spots</div>
          </div>
        </div>
      </div>
    </div>
  );
}
