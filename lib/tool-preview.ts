import { PRACTICAL_TOOLS } from './constants';
const facts: Record<string, [string, string]> = {
  'airport-transfer': [
    'Start with terminal-exit time and your hotel area.',
    'Confirm the last connection and an overnight fallback.',
  ],
  'transit-pass': [
    'Compare covered journeys for each traveler.',
    'Check exclusions and current operator fares.',
  ],
  'trip-budget': [
    'Separate room/night and per-person costs.',
    'Edit the assumptions; this is a planning estimate.',
  ],
  itinerary: [
    'Arrange stops, times and travel buffers.',
    'Keep notes private; review before sharing.',
  ],
  'packing-checklist': [
    'Adapt your list to month and travel needs.',
    'Keep progress locally and print a backup.',
  ],
  'rainy-day': [
    'Choose one indoor anchor near your base.',
    'Check reservations, access and the outdoor approach.',
  ],
};
export const TOOLKIT_PREVIEW = {
  slug: 'travel-toolkit',
  href: '/tools',
  title: 'Practical Korea Travel Tools',
  description: 'Compare transport, build an editable budget, and keep a day-by-day Korea plan.',
  facts: [
    'Make a travel decision with clear assumptions.',
    'Start without an account. Confirm operator details.',
  ] as [string, string],
};
export const TOOL_PREVIEWS = [
  TOOLKIT_PREVIEW,
  ...PRACTICAL_TOOLS.map((tool) => {
    const slug = tool.href.split('/').pop()!;
    return {
      slug,
      href: tool.href,
      title: tool.title,
      description: tool.description,
      facts: facts[slug],
    };
  }),
];
export type ToolPreview = (typeof TOOL_PREVIEWS)[number];
export const toolPreviewFor = (slug: string) => TOOL_PREVIEWS.find((tool) => tool.slug === slug);
export const toolPreviewImage = (tool: ToolPreview) => `/images/cards/tool-${tool.slug}.jpg`;
