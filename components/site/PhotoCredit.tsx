import type { MediaCredit } from '@/lib/content-types';
export default function PhotoCredit({ credit }: { credit?: MediaCredit }) {
  if (!credit) return null;
  return (
    <div className="photo-credit">
      {credit.kind === 'video-still'
        ? 'Video still'
        : credit.kind === 'illustration'
          ? 'Illustration'
          : 'Photo'}
      : {credit.author || 'See source'}
      {credit.sourceUrl ? (
        <>
          {' '}
          ·{' '}
          <a href={credit.sourceUrl} target="_blank" rel="noopener noreferrer">
            Original
          </a>
        </>
      ) : null}
      {credit.licenseUrl ? (
        <>
          {' '}
          ·{' '}
          <a href={credit.licenseUrl} target="_blank" rel="license noopener noreferrer">
            {credit.license}
          </a>
        </>
      ) : null}
      {credit.note ? (
        <details>
          <summary>Image details & reuse</summary>
          <p>{credit.note}</p>
        </details>
      ) : null}
    </div>
  );
}
