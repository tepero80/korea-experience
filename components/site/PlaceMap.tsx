'use client';
import { useEffect, useRef, useState } from 'react';
import type { Place } from '@/lib/content-types';
import { track } from '@/lib/analytics';
export default function PlaceMap({ places }: { places: Place[] }) {
  const [active, setActive] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const container = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!active || !container.current || !places.length) return;
    let removed = false;
    let map: import('leaflet').Map | undefined;
    void import('leaflet')
      .then((L) => {
        if (removed || !container.current) return;
        map = L.map(container.current, { scrollWheelZoom: false });
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution:
            '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 18,
        })
          .on('tileerror', () => {
            if (!removed)
              setError(
                'Some map tiles could not load. Addresses and navigation links below still work.',
              );
          })
          .addTo(map);
        const points: import('leaflet').LatLngExpression[] = places.map((p) => [
          p.latitude,
          p.longitude,
        ]);
        map.fitBounds(L.latLngBounds(points), { padding: [35, 35], maxZoom: 14 });
        for (const p of places) {
          const label = document.createElement('span');
          label.textContent = `${p.name} · ${p.nameKo}`;
          L.circleMarker([p.latitude, p.longitude], {
            radius: 8,
            color: '#20322e',
            fillColor: '#b15a25',
            fillOpacity: 0.95,
            weight: 2,
          })
            .addTo(map)
            .bindPopup(label);
        }
      })
      .catch(() =>
        setError('The map could not load. Use the addresses and navigation links below.'),
      );
    return () => {
      removed = true;
      map?.remove();
    };
  }, [active, places]);
  if (!places.length) return null;
  async function copy(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setMessage('Place name and address copied.');
    } catch {
      setMessage('Copy is unavailable. Select the address text instead.');
    }
  }
  return (
    <section className="place-map-section" id="places-and-map">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Put it on the map</p>
          <h2>Places in this guide</h2>
        </div>
        {!active ? (
          <button
            className="button button-light no-print"
            onClick={() => {
              setActive(true);
              track('map_open', { place_count: places.length });
            }}
          >
            Load interactive map
          </button>
        ) : null}
      </div>
      {active ? (
        <div
          ref={container}
          className="place-map no-print"
          role="region"
          aria-label="Overview map of places in this guide"
        />
      ) : null}
      <p className="map-notice">
        Overview markers, not verified entrances or live routes. Check the current entrance,
        accessibility, closures and directions with the operator or a local map. Loading the map
        connects to OpenStreetMap’s tile service.
      </p>
      {error ? <p role="status">{error}</p> : null}
      <div className="place-list">
        {places.map((p, index) => (
          <div key={p.id} className="place-card">
            <span className="place-number">{index + 1}</span>
            <div>
              <h3>{p.name}</h3>
              <p lang="ko" className="korean-address">
                {p.nameKo}
              </p>
              {p.address ? <p>{p.address}</p> : null}
              <p>{p.description}</p>
              <div className="place-actions">
                <a
                  href={`https://map.naver.com/p/search/${encodeURIComponent(p.nameKo)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Naver Map ↗
                </a>
                <a
                  href={`https://map.kakao.com/link/map/${encodeURIComponent(p.nameKo)},${p.latitude},${p.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Kakao Map ↗
                </a>
                <a href={p.officialUrl} target="_blank" rel="noopener noreferrer">
                  Coordinate source ↗
                </a>
                {p.addressSource ? (
                  <a href={p.addressSource} target="_blank" rel="noopener noreferrer">
                    Address source ↗
                  </a>
                ) : null}
                <button onClick={() => copy(`${p.nameKo}${p.address ? '\n' + p.address : ''}`)}>
                  {p.address ? 'Copy address' : 'Copy map query'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <p role="status" className="photo-credit">
        {message}
      </p>
    </section>
  );
}
