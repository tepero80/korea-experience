import type { CategoryId, GuideFormat, JourneyStage, RelationType } from './taxonomy';
export interface EvidenceSource {
  id: string;
  title: string;
  url: string;
  checkedAt: string;
  note?: string;
}
export interface GuideRelation {
  slug: string;
  type: RelationType;
  label: string;
  reason: string;
}
export interface MediaCredit {
  kind: 'photograph' | 'illustration' | 'video-still';
  title?: string;
  author?: string;
  sourceUrl?: string;
  license?: string;
  licenseUrl?: string;
  note?: string;
}
export interface EditorialGuide {
  id: string;
  categoryId: CategoryId;
  format: GuideFormat;
  checkedAt: string;
  answer: string;
  quickTitle?: string;
  quickChoices?: { label: string; detail: string }[];
  forWhom: string;
  conditions: string[];
  regions: string[];
  stages: JourneyStage[];
  interests: string[];
  relations: GuideRelation[];
  tools: string[];
  placeIds: string[];
  sources: EvidenceSource[];
  shareFacts: string[];
  launchOrder: number;
  changeType: 'new' | 'rewrite';
  imageCredit?: MediaCredit;
  heroMediaId?: string;
  experienceVersion?: 2;
  gallery?: { src: string; alt: string; credit: MediaCredit }[];
}
export interface Place {
  id: string;
  name: string;
  nameKo: string;
  latitude: number;
  longitude: number;
  address: string;
  region: string;
  description: string;
  officialUrl: string;
  checkedAt: string;
  sourceNote?: string;
  nearestStation?: string;
  image?: string;
  addressSource?: string;
  visitorUrl?: string;
  accessibilityNote?: string;
  accessibilityUrl?: string;
}
export interface Retirement {
  slug: string;
  action: 'redirect' | 'removed';
  target?: string;
  reason: string;
  decidedAt: string;
  evidence: {
    publicationDate: string;
    reviewedAt: string;
    indexingStatus: string;
    usageChecked: boolean;
    linksChecked: boolean;
    seasonalChecked: boolean;
  };
}
