'use client';

/**
 * PriceTable Component
 * GEO 최적화: 가격 정보의 구조화된 표시
 * Deep Research 전략: "이원적 가치 소비(Dualism)" - 럭셔리 vs 실속 비교
 */

interface PriceItem {
  /** 항목명 */
  name: string;
  /** 가격 (문자열로 표시) */
  price: string;
  /** 원래 가격 (할인 표시용) */
  originalPrice?: string;
  /** 설명 */
  description?: string;
  /** 태그 (예: Popular, Best Value) */
  tag?: string;
  /** 추천 여부 */
  recommended?: boolean;
  /** 세부 항목 */
  features?: string[];
}

interface PriceTableProps {
  /** 제목 */
  title: string;
  /** 통화 기호 */
  currency?: string;
  /** 가격 항목들 */
  items: PriceItem[];
  /** 스타일 변형 */
  variant?: 'default' | 'dualism' | 'cards';
  /** 설명 */
  description?: string;
  /** 럭셔리 레이블 (dualism용) */
  luxuryLabel?: string;
  /** 실속 레이블 (dualism용) */
  budgetLabel?: string;
}

export default function PriceTable({ 
  title, 
  currency = '₩',
  items, 
  variant = 'default',
  description,
  luxuryLabel = '💎 Luxury Option',
  budgetLabel = '💰 Budget-Friendly'
}: PriceTableProps) {
  // Dualism variant - 이원적 가치 비교
  if (variant === 'dualism') {
    const luxuryItems = items.filter(item => item.tag?.toLowerCase().includes('luxury') || item.tag?.toLowerCase().includes('premium'));
    const budgetItems = items.filter(item => item.tag?.toLowerCase().includes('budget') || item.tag?.toLowerCase().includes('value'));
    
    return (
      <div className="my-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <span>💵</span> {title}
        </h3>
        {description && <p className="text-gray-600 mb-6">{description}</p>}
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Luxury Column */}
          <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl border-2 border-amber-200 overflow-hidden">
            <div className="bg-gradient-to-r from-amber-500 to-yellow-500 px-5 py-3 text-white font-bold text-lg">
              {luxuryLabel}
            </div>
            <div className="p-5 space-y-4">
              {luxuryItems.length > 0 ? luxuryItems.map((item, idx) => (
                <div key={idx} className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-semibold text-gray-900">{item.name}</span>
                    <span className="text-amber-600 font-bold">{item.price}</span>
                  </div>
                  {item.description && (
                    <p className="text-sm text-gray-600">{item.description}</p>
                  )}
                </div>
              )) : (
                <p className="text-gray-500 italic">Add items with tag "luxury" or "premium"</p>
              )}
            </div>
          </div>

          {/* Budget Column */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border-2 border-green-200 overflow-hidden">
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 px-5 py-3 text-white font-bold text-lg">
              {budgetLabel}
            </div>
            <div className="p-5 space-y-4">
              {budgetItems.length > 0 ? budgetItems.map((item, idx) => (
                <div key={idx} className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-semibold text-gray-900">{item.name}</span>
                    <span className="text-green-600 font-bold">{item.price}</span>
                  </div>
                  {item.description && (
                    <p className="text-sm text-gray-600">{item.description}</p>
                  )}
                </div>
              )) : (
                <p className="text-gray-500 italic">Add items with tag "budget" or "value"</p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Cards variant
  if (variant === 'cards') {
    return (
      <div className="my-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <span>💵</span> {title}
        </h3>
        {description && <p className="text-gray-600 mb-6">{description}</p>}
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, index) => (
            <div 
              key={index}
              className={`relative rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow ${
                item.recommended 
                  ? 'border-2 border-blue-500 ring-4 ring-blue-100' 
                  : 'border border-gray-200'
              }`}
            >
              {item.tag && (
                <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold ${
                  item.recommended 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  {item.tag}
                </div>
              )}
              
              <div className="p-6">
                <h4 className="text-xl font-bold text-gray-900 mb-2 pr-20">{item.name}</h4>
                {item.description && (
                  <p className="text-gray-600 text-sm mb-4">{item.description}</p>
                )}
                
                <div className="mb-4">
                  <span className="text-3xl font-bold text-gray-900">{item.price}</span>
                  {item.originalPrice && (
                    <span className="ml-2 text-lg text-gray-400 line-through">{item.originalPrice}</span>
                  )}
                </div>
                
                {item.features && item.features.length > 0 && (
                  <ul className="space-y-2">
                    {item.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="text-green-500">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Default table variant
  return (
    <div className="my-8">
      <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
        <span>💵</span> {title}
      </h3>
      {description && <p className="text-gray-600 mb-6">{description}</p>}
      
      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-white rounded-xl overflow-hidden shadow-lg">
          <thead>
            <tr className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
              <th className="px-6 py-4 text-left font-bold">Item</th>
              <th className="px-6 py-4 text-right font-bold">Price</th>
              <th className="px-6 py-4 text-left font-bold hidden md:table-cell">Notes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {items.map((item, index) => (
              <tr 
                key={index}
                className={`hover:bg-blue-50 transition-colors ${item.recommended ? 'bg-blue-50' : ''}`}
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-gray-900">{item.name}</span>
                    {item.tag && (
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        item.recommended 
                          ? 'bg-blue-500 text-white' 
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {item.tag}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="font-bold text-gray-900">{item.price}</span>
                  {item.originalPrice && (
                    <span className="ml-2 text-sm text-gray-400 line-through">{item.originalPrice}</span>
                  )}
                </td>
                <td className="px-6 py-4 text-gray-600 text-sm hidden md:table-cell">
                  {item.description}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
