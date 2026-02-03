'use client';

interface TourCardProps {
  name: string;
  description: string;
  priceFrom: number;
  duration: string;
  rating: number;
  reviewCount: number;
  klookUrl: string;
  imageUrl?: string;
  highlights?: string[];
}

export function TourCard({ 
  name, 
  description,
  priceFrom, 
  duration,
  rating, 
  reviewCount,
  klookUrl,
  imageUrl,
  highlights
}: TourCardProps) {
  const handleClick = () => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'affiliate_click', {
        event_category: 'Affiliate',
        event_label: 'Klook',
        tour_name: name,
        link_url: klookUrl,
      });
    }
  };

  return (
    <div className="tour-card border rounded-xl p-5 hover:shadow-xl transition-all duration-300 bg-white">
      {imageUrl && (
        <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden">
          <img 
            src={imageUrl} 
            alt={name} 
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" 
          />
          <div className="absolute top-3 right-3 bg-white px-3 py-1 rounded-full shadow-md">
            <div className="flex items-center gap-1">
              <span className="text-yellow-500">⭐</span>
              <span className="font-bold text-sm">{rating}</span>
              <span className="text-gray-500 text-xs">({reviewCount.toLocaleString()})</span>
            </div>
          </div>
        </div>
      )}
      
      <div className="space-y-3">
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">{name}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>

        {highlights && highlights.length > 0 && (
          <ul className="space-y-1">
            {highlights.slice(0, 3).map((highlight, index) => (
              <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
        )}

        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-gray-900">${priceFrom}</span>
              <span className="text-sm text-gray-500">per person</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">⏱ {duration}</p>
          </div>
        </div>

        <a
          href={klookUrl}
          onClick={handleClick}
          target="_blank"
          rel="noopener noreferrer nofollow sponsored"
          className="block w-full bg-gradient-to-r from-orange-500 to-red-500 text-white text-center py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-md hover:shadow-lg"
        >
          Book Now on Klook →
        </a>

        <p className="text-xs text-gray-500 text-center mt-2">
          💡 <strong>Affiliate Disclosure:</strong> We earn a small commission from bookings at no extra cost to you
        </p>
      </div>
    </div>
  );
}
