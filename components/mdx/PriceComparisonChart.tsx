'use client';

interface PriceItem {
  label: string;
  korea: number;
  usa?: number;
  japan?: number;
  thailand?: number;
}

interface PriceComparisonChartProps {
  title: string;
  items: PriceItem[];
  currency?: string;
  koreaLabel?: string;
  usaLabel?: string;
  japanLabel?: string;
  thailandLabel?: string;
}

export default function PriceComparisonChart({ 
  title, 
  items, 
  currency = 'USD',
  koreaLabel = '🇰🇷 Korea',
  usaLabel = '🇺🇸 USA',
  japanLabel = '🇯🇵 Japan',
  thailandLabel = '🇹🇭 Thailand'
}: PriceComparisonChartProps) {
  const maxValue = Math.max(
    ...items.map(item => 
      Math.max(item.korea, item.usa || 0, item.japan || 0, item.thailand || 0)
    )
  );

  const formatPrice = (price: number) => {
    if (currency === 'USD') return `$${price.toLocaleString()}`;
    if (currency === 'KRW') return `₩${price.toLocaleString()}`;
    return price.toLocaleString();
  };

  return (
    <div className="my-8 p-6 bg-white rounded-lg shadow-lg border border-gray-200">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">{title}</h3>
      
      <div className="space-y-6">
        {items.map((item, index) => (
          <div key={index} className="space-y-2">
            <div className="font-semibold text-gray-800">{item.label}</div>
            
            {/* Korea */}
            <div className="flex items-center gap-3">
              <span className="w-24 text-sm text-gray-600">{koreaLabel}</span>
              <div className="flex-1 bg-gray-100 rounded-full h-8 relative overflow-hidden">
                <div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-end px-3 text-white font-semibold text-sm transition-all duration-500"
                  style={{ width: `${(item.korea / maxValue) * 100}%` }}
                >
                  {formatPrice(item.korea)}
                </div>
              </div>
            </div>

            {/* USA */}
            {item.usa && (
              <div className="flex items-center gap-3">
                <span className="w-24 text-sm text-gray-600">{usaLabel}</span>
                <div className="flex-1 bg-gray-100 rounded-full h-8 relative overflow-hidden">
                  <div
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-red-500 to-red-600 flex items-center justify-end px-3 text-white font-semibold text-sm transition-all duration-500"
                    style={{ width: `${(item.usa / maxValue) * 100}%` }}
                  >
                    {formatPrice(item.usa)}
                  </div>
                </div>
              </div>
            )}

            {/* Japan */}
            {item.japan && (
              <div className="flex items-center gap-3">
                <span className="w-24 text-sm text-gray-600">{japanLabel}</span>
                <div className="flex-1 bg-gray-100 rounded-full h-8 relative overflow-hidden">
                  <div
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-amber-500 to-amber-600 flex items-center justify-end px-3 text-white font-semibold text-sm transition-all duration-500"
                    style={{ width: `${(item.japan / maxValue) * 100}%` }}
                  >
                    {formatPrice(item.japan)}
                  </div>
                </div>
              </div>
            )}

            {/* Thailand */}
            {item.thailand && (
              <div className="flex items-center gap-3">
                <span className="w-24 text-sm text-gray-600">{thailandLabel}</span>
                <div className="flex-1 bg-gray-100 rounded-full h-8 relative overflow-hidden">
                  <div
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-end px-3 text-white font-semibold text-sm transition-all duration-500"
                    style={{ width: `${(item.thailand / maxValue) * 100}%` }}
                  >
                    {formatPrice(item.thailand)}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
