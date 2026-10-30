import type { Metadata } from 'next';
import media from '@/data/media.json';
import PhotoCredit from '@/components/site/PhotoCredit';
import type { MediaCredit } from '@/lib/content-types';
export const metadata: Metadata = {
  title: 'Photography & image credits',
  description: 'Photograph sources, authors, licenses and adaptations used by Korea Experience.',
  alternates: { canonical: 'https://koreaexperience.com/image-credits' },
};
export default function Credits() {
  return (
    <div className="wrap document-page">
      <p className="eyebrow">The images behind the guides</p>
      <h1 className="section-title">Photography & image credits</h1>
      <p>
        These real photographs are used under their stated licenses. They illustrate places, not
        current opening conditions, crowds or bookable services. Rights in the photographs do not
        automatically grant rights in depicted people or brands.
      </p>
      <p>
        Social preview cards crop the corresponding guide photograph and identify its author and
        license. Cards adapted from share-alike photographs follow that license. Follow the original
        source and license links below when reusing them. Text-only downloadable trip cards are
        created in your browser.
      </p>
      {(media as { id: string; src: string; alt: string; credit: MediaCredit }[]).map((m) => (
        <section key={m.id} id={m.id} className="credit-entry">
          <h2>{m.alt}</h2>
          <img src={m.src} alt={m.alt} width="600" height="400" loading="lazy" />
          <PhotoCredit credit={m.credit} />
        </section>
      ))}
    </div>
  );
}
