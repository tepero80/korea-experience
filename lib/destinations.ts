import { getLaunchGuides, type PostMetadata } from './posts';
import { isInRegion, REGIONS, type Region } from './regions';

type Destination = Region & {
  posts: PostMetadata[];
  indexable: boolean;
};

let exportedDestinations: Destination[] | undefined;

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
