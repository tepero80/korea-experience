'use client';
import { illustrativePlace, legacyPhoneLink } from '@/lib/archive-integrity';

// Legacy location text, pending individual operator-source review. Do not emit
// LocalBusiness/ratings schema from author-entered display fields.

interface LocationCardProps {
  /** 장소명 */
  name: string;
  /** 한국어 이름 (선택) */
  nameKo?: string;
  /** 장소 유형 */
  type?: string;
  /** 주소 */
  address: string;
  /** 운영 시간 */
  hours?: string;
  /** 전화번호 */
  phone?: string;
  /** 웹사이트 */
  website?: string;
  /** 가격대 */
  priceRange?: '$' | '$$' | '$$$' | '$$$$';
  /** 평점 (1-5) */
  rating?: number;
  /** 리뷰 수 */
  reviewCount?: number;
  /** 대중교통 정보 */
  transit?: string;
  /** 추천 메뉴/서비스 */
  highlights?: string[];
  /** 예약 필요 여부 */
  reservationRequired?: boolean;
  /** 이미지 URL */
  image?: string;
  /** Google Maps URL */
  mapUrl?: string;
  /** 태그 */
  tags?: string[];
  /** 팁 */
  tip?: string;
}

export default function LocationCard({
  name,
  nameKo,
  type,
  address,
  hours,
  phone,
  website,
  priceRange,
  transit,
  highlights,
  reservationRequired,
  image,
  mapUrl,
  tags,
  tip,
}: LocationCardProps) {
  // A fictional example is not a real facility. Bare JSX ratings are not a
  // review source; none of the archive ratings has a reviewed retrieval record.
  if (illustrativePlace(name)) return null;
  const telephone = legacyPhoneLink(phone);

  return (
    <div className="my-8 bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow">
      {/* Image */}
      {image && (
        <div className="relative h-48 md:h-56 overflow-hidden">
          <img src={image} alt={name} className="w-full h-full object-cover" />
          {tags && tags.length > 0 && (
            <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
              {tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-gray-800"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            {type && (
              <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">
                {type}
              </span>
            )}
            <h3 className="text-xl font-bold text-gray-900 m-0 p-0 border-none">
              {name}
              {nameKo && <span className="ml-2 text-lg font-normal text-gray-500">({nameKo})</span>}
            </h3>
          </div>

          {/* Rating & Price */}
          <div className="flex flex-col items-end gap-1">
            {priceRange && <span className="text-lg font-bold text-green-800">{priceRange}</span>}
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid sm:grid-cols-2 gap-4 text-sm">
          {/* Address */}
          <div className="flex items-start gap-3">
            <span className="text-xl">📍</span>
            <div>
              <div className="font-medium text-gray-500">Address</div>
              <div className="text-gray-800">{address}</div>
            </div>
          </div>

          {/* Hours */}
          {hours && (
            <div className="flex items-start gap-3">
              <span className="text-xl">🕐</span>
              <div>
                <div className="font-medium text-gray-500">Hours</div>
                <div className="text-gray-800">{hours}</div>
              </div>
            </div>
          )}

          {/* Phone */}
          {telephone && (
            <div className="flex items-start gap-3">
              <span className="text-xl">📞</span>
              <div>
                <div className="font-medium text-gray-500">Phone</div>
                <a href={`tel:${telephone}`} className="text-blue-600 hover:underline">
                  {phone}
                </a>
              </div>
            </div>
          )}

          {/* Transit */}
          {transit && (
            <div className="flex items-start gap-3">
              <span className="text-xl">🚇</span>
              <div>
                <div className="font-medium text-gray-500">Getting There</div>
                <div className="text-gray-800">{transit}</div>
              </div>
            </div>
          )}
        </div>

        {/* Highlights */}
        {highlights && highlights.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="font-medium text-gray-700 mb-2">✨ Highlights</div>
            <div className="flex flex-wrap gap-2">
              {highlights.map((item, idx) => (
                <span key={idx} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Tip */}
        {tip && (
          <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-4">
            <span className="font-semibold text-amber-700">Planning note: </span>
            <span className="text-amber-800">{tip}</span>
          </div>
        )}

        {/* Footer */}
        <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap items-center gap-4">
          {reservationRequired && (
            <span className="flex items-center gap-1 text-sm text-red-600 font-medium">
              📅 Reservation Required
            </span>
          )}

          {website && (
            <a
              href={website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:underline font-medium"
            >
              🌐 Visit Website →
            </a>
          )}

          {mapUrl && (
            <a
              href={mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:underline font-medium"
            >
              🗺️ View on Map →
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
