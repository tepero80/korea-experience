export const TOOL_REVIEWS = {
  'medical-cost-estimator': {
    title: 'Medical cost estimator paused',
    explanation:
      'The previous estimates did not account reliably for an individual treatment plan, recovery or aftercare. The calculator is unavailable while its information is reviewed.',
    action: 'Find registered providers and patient information at Medical Korea',
    source: 'https://www.medicalkorea.or.kr/en/index',
  },
  'military-service': {
    title: 'Military service calculator paused',
    explanation:
      'Age and a short questionnaire cannot establish a person’s military obligations. The calculator is unavailable. Obtain guidance for your nationality and circumstances from the responsible authority or your Korean consulate.',
    action: 'Read the Korean embassy’s overseas-travel guidance and authority contacts',
    source: 'https://overseas.mofa.go.kr/ie-en/brd/m_23773/view.do?seq=761933',
  },
  'korean-beauty-quiz': {
    title: 'Skin routine quiz paused',
    explanation:
      'The previous quiz could not establish your skin type or a suitable personal routine. Its diagnosis and product results are unavailable while the tool is reviewed.',
    action: 'Read general skin-care information from the American Academy of Dermatology',
    source: 'https://www.aad.org/public/everyday-care/skin-care-basics',
  },
} as const;
export type ReviewedToolSlug = keyof typeof TOOL_REVIEWS;
