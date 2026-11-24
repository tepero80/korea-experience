import type { Place } from '@/lib/content-types';
import { googleMapsSearch } from '@/lib/google-maps';

export default function PlaceDirections({ place }: { place: Place }) {
  const name = encodeURIComponent(place.nameKo);
  const naverQuery = encodeURIComponent(place.naverMapQuery ?? place.nameKo);
  const coordinates = `${place.latitude},${place.longitude}`;
  const links = [
    { label: 'Naver Map', url: `https://map.naver.com/p/search/${naverQuery}` },
    { label: 'Kakao Map', url: `https://map.kakao.com/link/map/${name},${coordinates}` },
    { label: 'Google Maps', url: googleMapsSearch(coordinates) },
  ];

  return links.map(({ label, url }) => (
    <a
      key={label}
      href={url}
      aria-label={`${label} for ${place.name}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      {label} <span aria-hidden="true">↗</span>
    </a>
  ));
}
