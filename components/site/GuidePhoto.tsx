import { mediaFor } from '@/lib/media';
import PhotoCredit from './PhotoCredit';
export default function GuidePhoto({ id, caption }: { id: string; caption: string }) {
  const m = mediaFor(id);
  if (!m) throw new Error(`Unknown editorial image: ${id}`);
  return (
    <figure className="guide-photo">
      <img
        src={m.src}
        srcSet={m.srcSet}
        sizes="(max-width: 760px) calc(100vw - 40px), 720px"
        width={m.width}
        height={m.height}
        alt={m.alt}
        loading="lazy"
        decoding="async"
      />
      <figcaption>
        <p>{caption}</p>
        <PhotoCredit credit={m.credit} />
      </figcaption>
    </figure>
  );
}
