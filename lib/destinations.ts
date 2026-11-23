import { getLaunchGuides, type PostMetadata } from './posts';
import { isInRegion, REGIONS, type Region } from './regions';
import { mediaFor } from './media';
import photoReviews from '@/data/destination-guide-photos.json';

type Destination = Region & {
  posts: PostMetadata[];
  indexable: boolean;
};

let exportedDestinations: Destination[] | undefined;

const reviews: Record<string, {
  mediaId: string;
  subjectUsefulness: number;
  sceneClarity: number;
  cropPotential: number;
}> = photoReviews;

export function destinationGuidePhoto(post: PostMetadata) {
  const review = reviews[post.slug];
  const photo = mediaFor(post.editorial?.heroMediaId);
  if (
    !review || review.mediaId !== photo?.id || photo.src !== post.image ||
    photo.credit.kind !== 'photograph' || !photo.credit.author || !photo.credit.sourceUrl ||
    !photo.credit.licenseUrl ||
    review.subjectUsefulness < 2 ||
    review.subjectUsefulness + review.sceneClarity + review.cropPotential < 5
  ) return undefined;
  return photo;
}

export function getDestinations() {
  if (exportedDestinations) return exportedDestinations;

  const reviewed = getLaunchGuides().filter((guide) => guide.indexable);
  const destinations = REGIONS.map((region) => {
    const posts = reviewed.filter((guide) => isInRegion(guide.editorial?.regions, region.id));
    return { ...region, posts, indexable: posts.length >= 3 };
  }).filter((region) => region.indexable || region.keepVisible);

  if (process.env.NODE_ENV !== 'development') exportedDestinations = destinations;
  return destinations;
}
