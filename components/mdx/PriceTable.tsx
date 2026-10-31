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
  budgetLabel = '💰 Budget-Friendly',
}: PriceTableProps) {
  // Dualism variant - 이원적 가치 비교
  if (variant === 'dualism') {
    let luxuryItems = items.filter(
      (item) =>
        item.tag?.toLowerCase().includes('luxury') || item.tag?.toLowerCase().includes('premium'),
    );
    let budgetItems = items.filter(
      (item) =>
        item.tag?.toLowerCase().includes('budget') || item.tag?.toLowerCase().includes('value'),
    );

    // 태그 자동 감지: luxury/budget 매칭 실패 시 고유 태그 기반으로 자동 분류
    let leftLabel = luxuryLabel;
    let rightLabel = budgetLabel;

    if (luxuryItems.length === 0 && budgetItems.length === 0 && items.length > 0) {
      const uniqueTags = [...new Set(items.map((item) => item.tag).filter(Boolean))] as string[];
      if (uniqueTags.length >= 2) {
        luxuryItems = items.filter((item) => item.tag === uniqueTags[0]);
        budgetItems = items.filter((item) => item.tag === uniqueTags[1]);
        leftLabel = `${uniqueTags[0]}`;
        rightLabel = `${uniqueTags[1]}`;
      } else {
        // 태그가 1개이거나 없으면 절반으로 분할
        const mid = Math.ceil(items.length / 2);
        luxuryItems = items.slice(0, mid);
        budgetItems = items.slice(mid);
        leftLabel = luxuryItems[0]?.tag || 'Option A';
        rightLabel = budgetItems[0]?.tag || 'Option B';
      }
    }

    // 컬럼 색상: 기본 amber/green, 자동감지 시 blue/violet
    const isAutoDetect = leftLabel !== luxuryLabel;
    const leftColors = isAutoDetect
      ? {
          bg: 'from-amber-50 to-orange-50',
          border: 'border-amber-200',
          header: 'from-amber-500 to-orange-500',
          price: 'text-amber-800',
        }
      : {
          bg: 'from-amber-50 to-yellow-50',
          border: 'border-amber-200',
          header: 'from-amber-500 to-yellow-500',
          price: 'text-amber-800',
        };
    const rightColors = isAutoDetect
      ? {
          bg: 'from-orange-50 to-amber-50',
          border: 'border-orange-200',
          header: 'from-orange-500 to-amber-600',
          price: 'text-orange-800',
        }
      : {
          bg: 'from-green-50 to-emerald-50',
          border: 'border-green-200',
          header: 'from-green-500 to-emerald-500',
          price: 'text-green-800',
        };

    return (
      <div className="my-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <span>💵</span> {title}
        </h3>
        {description && <p className="text-gray-600 mb-6">{description}</p>}

        <div className="grid md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div
            className={`bg-gradient-to-br ${leftColors.bg} rounded-2xl border-2 ${leftColors.border} overflow-hidden`}
          >
            <div
              className={`bg-gradient-to-r ${leftColors.header} px-5 py-3 text-white font-bold text-lg`}
            >
              {leftLabel}
            </div>
            <div className="p-5 space-y-4">
              {luxuryItems.map((item, idx) => (
                <div key={idx} className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-semibold text-gray-900">{item.name}</span>
                    <span className={`${leftColors.price} font-bold`}>{item.price}</span>
                  </div>
                  {item.description && <p className="text-sm text-gray-600">{item.description}</p>}
                </div>
              ))}
            </div>
          </div>

          {/* Right Column */}
          <div
            className={`bg-gradient-to-br ${rightColors.bg} rounded-2xl border-2 ${rightColors.border} overflow-hidden`}
          >
            <div
              className={`bg-gradient-to-r ${rightColors.header} px-5 py-3 text-white font-bold text-lg`}
            >
              {rightLabel}
            </div>
            <div className="p-5 space-y-4">
              {budgetItems.map((item, idx) => (
                <div key={idx} className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-semibold text-gray-900">{item.name}</span>
                    <span className={`${rightColors.price} font-bold`}>{item.price}</span>
                  </div>
                  {item.description && <p className="text-sm text-gray-600">{item.description}</p>}
                </div>
              ))}
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
                  ? 'border-2 border-amber-500 ring-4 ring-amber-100'
                  : 'border border-gray-200'
              }`}
            >
              {item.tag && (
                <div
                  className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold ${
                    item.recommended ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-700'
                  }`}
                >
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
                    <span className="ml-2 text-lg text-gray-400 line-through">
                      {item.originalPrice}
                    </span>
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
            <tr className="bg-stone-800 text-white">
              <th className="px-6 py-4 text-left font-bold">Item</th>
              <th className="px-6 py-4 text-right font-bold">Price</th>
              <th className="px-6 py-4 text-left font-bold hidden md:table-cell">Notes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {items.map((item, index) => (
              <tr
                key={index}
                className={`hover:bg-amber-50 transition-colors ${item.recommended ? 'bg-amber-50' : ''}`}
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-gray-900">{item.name}</span>
                    {item.tag && (
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          item.recommended ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {item.tag}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="font-bold text-gray-900">{item.price}</span>
                  {item.originalPrice && (
                    <span className="ml-2 text-sm text-gray-400 line-through">
                      {item.originalPrice}
                    </span>
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
