export const REGIONS = [
  {
    id: 'seoul',
    name: 'Seoul',
    nameKo: '서울',
    image: '/images/editorial/bukchon.webp',
    intro:
      'Choose a base first, then group your days by neighborhood. Central historic districts and the eastern café districts work better as separate outings.',
    tip: 'Leave room for the final walk: a station name alone does not describe the hotel entrance, stairs, or the correct exit.',
  },
  {
    id: 'busan',
    name: 'Busan',
    nameKo: '부산',
    image: '/images/editorial/jagalchi.webp',
    intro:
      'Busan’s waterfront and historic market districts are spread out. Choose your accommodation around your priorities and group the western markets separately from Haeundae.',
    tip: 'A car-free trip is practical when you allow travel time between districts and avoid crossing the city repeatedly.',
  },
  {
    id: 'suwon',
    name: 'Suwon',
    nameKo: '수원',
    image: '/images/editorial/suwon.webp',
    intro:
      'Make a manageable day around a section of Hwaseong’s walls, the palace area, and a meal. The full fortress circuit is optional, not a requirement.',
    tip: 'Check separate palace, activity and seasonal opening notices. A fortress walk does not guarantee a ticketed building or evening program is open.',
  },
] as const;
