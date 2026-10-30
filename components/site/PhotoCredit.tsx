import type { MediaCredit } from '@/lib/content-types';
export default function PhotoCredit({ credit }: { credit?: MediaCredit }) {
  if (!credit) return null;
  if (credit.kind === 'illustration')
    return (
      <p className="photo-credit">
        Illustration. This is not a documentary photograph of a particular place or current service.
      </p>
    );
  return (
    <p className="photo-credit">
      Photo: {credit.author || 'See source'}
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
      {credit.note ? <>. {credit.note}</> : null}
    </p>
  );
}
