export interface MedicalProcedure {
  id: string;
  name: string;
  nameKo: string;
  category: 'plastic_surgery' | 'dermatology' | 'dental' | 'ophthalmology';
  priceRange: {
    budget: { min: number; max: number };
    standard: { min: number; max: number };
    premium: { min: number; max: number };
  };
  recoveryDays: number;
  description: string;
  whatToExpect: string[];
  popularClinics: string[];
  tips: string[];
}

export interface CostEstimate {
  procedure: MedicalProcedure;
  clinicTier: 'budget' | 'standard' | 'premium';
  estimatedCost: {
    usd: number;
    krw: number;
  };
  recoveryDays: number;
  totalTripDays: number;
  additionalCosts: {
    accommodation: number;
    meals: number;
    transportation: number;
    medications: number;
  };
  grandTotal: {
    usd: number;
    krw: number;
  };
}

export const EXCHANGE_RATE = 1300; // 1 USD = 1,300 KRW

export const medicalProcedures: MedicalProcedure[] = [
  // Plastic Surgery
  {
    id: 'rhinoplasty',
    name: 'Rhinoplasty (Nose Job)',
    nameKo: '코 성형',
    category: 'plastic_surgery',
    priceRange: {
      budget: { min: 3000, max: 4500 },
      standard: { min: 4500, max: 7000 },
      premium: { min: 7000, max: 12000 }
    },
    recoveryDays: 10,
    description: 'Surgical procedure to reshape the nose for aesthetic or functional improvement.',
    whatToExpect: [
      'Initial consultation and 3D simulation',
      '2-3 hours surgery under general anesthesia',
      'Cast/splint for 7-10 days',
      'Swelling peaks at 2-3 days, subsides in 2 weeks',
      'Final results visible after 6-12 months'
    ],
    popularClinics: ['ID Hospital', 'View Plastic Surgery', 'JW Plastic Surgery'],
    tips: [
      'Book at least 2-3 months in advance',
      'Plan to stay 10-14 days in Korea',
      'Avoid blood thinners 2 weeks before surgery',
      'Bring before photos for consultation'
    ]
  },
  {
    id: 'double_eyelid',
    name: 'Double Eyelid Surgery',
    nameKo: '쌍꺼풀 수술',
    category: 'plastic_surgery',
    priceRange: {
      budget: { min: 1500, max: 2500 },
      standard: { min: 2500, max: 4000 },
      premium: { min: 4000, max: 6000 }
    },
    recoveryDays: 7,
    description: 'Creates a crease in the upper eyelid for larger, more defined eyes.',
    whatToExpect: [
      'Consultation with eye measurements',
      '30-60 minutes procedure (local anesthesia)',
      'Incision or non-incision method',
      'Stitches removed after 5-7 days',
      'Major swelling gone in 2 weeks'
    ],
    popularClinics: ['Dream Medical Group', 'Banobagi Plastic Surgery', 'April 31 Plastic Surgery'],
    tips: [
      'Non-incision method has faster recovery',
      'Bring sunglasses for post-op',
      'Ice packs help reduce swelling',
      'Most affordable plastic surgery in Korea'
    ]
  },
  {
    id: 'vline_surgery',
    name: 'V-Line Jaw Surgery',
    nameKo: 'V라인 성형',
    category: 'plastic_surgery',
    priceRange: {
      budget: { min: 8000, max: 12000 },
      standard: { min: 12000, max: 18000 },
      premium: { min: 18000, max: 25000 }
    },
    recoveryDays: 14,
    description: 'Jaw contouring surgery to create a slim, V-shaped facial profile.',
    whatToExpect: [
      'CT scan and 3D facial analysis',
      '3-4 hours surgery under general anesthesia',
      'Hospital stay 1-2 nights',
      'Liquid/soft diet for 2-4 weeks',
      'Swelling peaks at 3-5 days',
      'Final results after 6 months'
    ],
    popularClinics: ['Faceline Plastic Surgery', 'ID Hospital', 'DA Plastic Surgery'],
    tips: [
      'Plan 2-3 weeks stay in Korea',
      'Requires post-op check-ups',
      'Bring meal replacement shakes',
      'Most complex facial surgery'
    ]
  },
  {
    id: 'breast_augmentation',
    name: 'Breast Augmentation',
    nameKo: '가슴 확대',
    category: 'plastic_surgery',
    priceRange: {
      budget: { min: 4000, max: 6000 },
      standard: { min: 6000, max: 9000 },
      premium: { min: 9000, max: 14000 }
    },
    recoveryDays: 10,
    description: 'Breast implants to increase size and improve shape.',
    whatToExpect: [
      'Consultation with implant sizing',
      '1-2 hours surgery under general anesthesia',
      'Surgical bra worn for 4-6 weeks',
      'Pain peaks in first 3 days',
      'Return to normal activities in 2-3 weeks'
    ],
    popularClinics: ['Grand Plastic Surgery', 'Seojin Plastic Surgery', 'BK Plastic Surgery'],
    tips: [
      'Choose between saline and silicone',
      'Consider submuscular vs subglandular placement',
      'Korean clinics use latest Motiva implants',
      'Plan 7-10 days stay'
    ]
  },
  {
    id: 'liposuction',
    name: 'Liposuction',
    nameKo: '지방 흡입',
    category: 'plastic_surgery',
    priceRange: {
      budget: { min: 2000, max: 3500 },
      standard: { min: 3500, max: 6000 },
      premium: { min: 6000, max: 10000 }
    },
    recoveryDays: 7,
    description: 'Removes excess fat from specific body areas.',
    whatToExpect: [
      'Body marking and measurements',
      '1-3 hours depending on areas',
      'Compression garment for 4-6 weeks',
      'Mild pain and swelling for 1 week',
      'Results visible after swelling subsides (2-3 months)'
    ],
    popularClinics: ['Lydian Plastic Surgery', 'Model Line Clinic', 'Apple Tree Plastic Surgery'],
    tips: [
      'Price varies by number of areas',
      'Multiple areas = better value',
      'Maintain weight before/after',
      'Recovery is relatively quick'
    ]
  },

  // Dermatology
  {
    id: 'laser_skin_resurfacing',
    name: 'Laser Skin Resurfacing',
    nameKo: '레이저 피부 리서페이싱',
    category: 'dermatology',
    priceRange: {
      budget: { min: 300, max: 600 },
      standard: { min: 600, max: 1200 },
      premium: { min: 1200, max: 2500 }
    },
    recoveryDays: 3,
    description: 'Laser treatment to improve skin texture, tone, and reduce wrinkles.',
    whatToExpect: [
      'Skin analysis and test patch',
      '30-60 minutes procedure',
      'Mild redness for 2-3 days',
      '3-5 sessions recommended',
      'Results improve over 3-6 months'
    ],
    popularClinics: ['Oracle Dermatology', 'Cheongdam Oracle', 'Cinderella Dermatology'],
    tips: [
      'Multiple sessions = package discount',
      'Avoid sun exposure after treatment',
      'Best combined with other treatments',
      'Popular: CO2 fractional laser'
    ]
  },
  {
    id: 'botox',
    name: 'Botox Injections',
    nameKo: '보톡스',
    category: 'dermatology',
    priceRange: {
      budget: { min: 150, max: 300 },
      standard: { min: 300, max: 500 },
      premium: { min: 500, max: 800 }
    },
    recoveryDays: 0,
    description: 'Injectable treatment to reduce wrinkles and facial muscle activity.',
    whatToExpect: [
      'Quick 10-15 minute procedure',
      'Minimal discomfort',
      'Results visible in 3-7 days',
      'Lasts 3-6 months',
      'No downtime'
    ],
    popularClinics: ['Banobagi Dermatology', 'It\'s Skin Dermatology', 'Arumdaun Nara'],
    tips: [
      'Price per unit or per area',
      'Korean clinics use genuine Botox/Dysport',
      'Popular areas: forehead, crow\'s feet, jaw',
      'Can be done same-day'
    ]
  },
  {
    id: 'filler',
    name: 'Dermal Fillers',
    nameKo: '필러',
    category: 'dermatology',
    priceRange: {
      budget: { min: 200, max: 400 },
      standard: { min: 400, max: 700 },
      premium: { min: 700, max: 1200 }
    },
    recoveryDays: 1,
    description: 'Injectable fillers to add volume and smooth wrinkles.',
    whatToExpect: [
      '15-30 minute procedure',
      'Immediate results',
      'Slight swelling/bruising for 1-2 days',
      'Lasts 6-18 months depending on type',
      'Touch-ups may be needed'
    ],
    popularClinics: ['Hershe Dermatology', 'Ever Dermatology', 'Clear Dermatology'],
    tips: [
      'Korean clinics use premium brands (Juvederm, Restylane)',
      'Popular: nose, lips, under-eyes',
      'Price per syringe',
      'Ask for hyaluronic acid type'
    ]
  },
  {
    id: 'acne_scar_treatment',
    name: 'Acne Scar Treatment',
    nameKo: '여드름 흉터 치료',
    category: 'dermatology',
    priceRange: {
      budget: { min: 400, max: 800 },
      standard: { min: 800, max: 1500 },
      premium: { min: 1500, max: 3000 }
    },
    recoveryDays: 5,
    description: 'Combination treatments to reduce acne scarring.',
    whatToExpect: [
      'Skin assessment and treatment plan',
      'May combine laser, peels, microneedling',
      'Redness for 3-7 days',
      '5-10 sessions for best results',
      'Gradual improvement over months'
    ],
    popularClinics: ['CNP Skin Clinic', 'Cheongdam U Dermatology', 'Dr. Woo Dermatology'],
    tips: [
      'Package deals available',
      'Consistency is key',
      'Avoid active breakouts before treatment',
      'Korean clinics specialize in acne scars'
    ]
  },

  // Dental
  {
    id: 'dental_implants',
    name: 'Dental Implants',
    nameKo: '임플란트',
    category: 'dental',
    priceRange: {
      budget: { min: 800, max: 1200 },
      standard: { min: 1200, max: 1800 },
      premium: { min: 1800, max: 3000 }
    },
    recoveryDays: 5,
    description: 'Permanent tooth replacement with titanium implant and crown.',
    whatToExpect: [
      'CT scan and consultation',
      'Implant placement surgery (1-2 hours)',
      '3-6 months healing period',
      'Crown placement (second visit)',
      'Mild discomfort for 3-5 days'
    ],
    popularClinics: ['Seoul Dental Clinic', 'Yonsei Dental', 'Korea Dental'],
    tips: [
      'Requires 2 visits to Korea (or 1 long stay)',
      'Much cheaper than Western countries',
      'High success rate in Korean clinics',
      'Price per implant'
    ]
  },
  {
    id: 'teeth_whitening',
    name: 'Professional Teeth Whitening',
    nameKo: '치아 미백',
    category: 'dental',
    priceRange: {
      budget: { min: 150, max: 300 },
      standard: { min: 300, max: 500 },
      premium: { min: 500, max: 800 }
    },
    recoveryDays: 0,
    description: 'Professional whitening for brighter, whiter teeth.',
    whatToExpect: [
      'Dental cleaning first',
      '1-2 hour in-office treatment',
      'Laser or LED activation',
      'Immediate results',
      'Sensitivity for 1-2 days'
    ],
    popularClinics: ['Gangnam Dental Clinic', 'Seoul Smile Dental', 'White Dental'],
    tips: [
      'Can be done same-day',
      'Avoid staining foods for 48 hours',
      'Results last 6-12 months',
      'Very affordable in Korea'
    ]
  },
  {
    id: 'veneers',
    name: 'Porcelain Veneers',
    nameKo: '라미네이트',
    category: 'dental',
    priceRange: {
      budget: { min: 3000, max: 5000 },
      standard: { min: 5000, max: 8000 },
      premium: { min: 8000, max: 12000 }
    },
    recoveryDays: 3,
    description: 'Thin porcelain shells bonded to front teeth for perfect smile.',
    whatToExpect: [
      'Consultation and smile design',
      'Tooth preparation (minimal shaving)',
      'Temporary veneers for 1-2 weeks',
      'Final veneer placement',
      'Lasts 10-15 years with care'
    ],
    popularClinics: ['Shim Dental Clinic', 'Megagen Dental', 'Seoul National University Dental'],
    tips: [
      'Requires 2 visits (7-14 days apart)',
      'Price is for full set (8-10 teeth)',
      'Dramatic smile transformation',
      'Korean labs produce high-quality veneers'
    ]
  },

  // Ophthalmology
  {
    id: 'lasik',
    name: 'LASIK Eye Surgery',
    nameKo: '라식',
    category: 'ophthalmology',
    priceRange: {
      budget: { min: 1500, max: 2500 },
      standard: { min: 2500, max: 3500 },
      premium: { min: 3500, max: 5000 }
    },
    recoveryDays: 3,
    description: 'Laser vision correction to reduce dependence on glasses/contacts.',
    whatToExpect: [
      'Comprehensive eye exam',
      '15-20 minutes per eye',
      'No pain during procedure',
      'Vision improves within 24 hours',
      'Dry eyes for 1-3 months'
    ],
    popularClinics: ['B&VIIT Eye Center', 'Gangnam Eyemedi Vision Center', 'Dream Eye Center'],
    tips: [
      'Stop wearing contacts 1-2 weeks before',
      'Both eyes done same day',
      'Follow-up visit next day',
      'Korean technology is world-class'
    ]
  },
  {
    id: 'lasek',
    name: 'LASEK Eye Surgery',
    nameKo: '라섹',
    category: 'ophthalmology',
    priceRange: {
      budget: { min: 1800, max: 2800 },
      standard: { min: 2800, max: 4000 },
      premium: { min: 4000, max: 5500 }
    },
    recoveryDays: 5,
    description: 'Surface laser correction for patients unsuitable for LASIK.',
    whatToExpect: [
      'Eye examination and measurements',
      '20-30 minutes per eye',
      'Protective contact lenses for 3-5 days',
      'More discomfort than LASIK',
      'Vision stabilizes in 1-2 weeks'
    ],
    popularClinics: ['BGN Eye Hospital', 'Nune Eye Center', 'Seoul Eye Clinic'],
    tips: [
      'Better for thin corneas',
      'Longer recovery than LASIK',
      'Less risk of complications',
      'Stay 7-10 days for follow-ups'
    ]
  }
];

export const categories = [
  { id: 'plastic_surgery', name: 'Plastic Surgery', nameKo: '성형외과', icon: '💉', color: 'purple' },
  { id: 'dermatology', name: 'Dermatology', nameKo: '피부과', icon: '✨', color: 'pink' },
  { id: 'dental', name: 'Dental', nameKo: '치과', icon: '🦷', color: 'blue' },
  { id: 'ophthalmology', name: 'Ophthalmology', nameKo: '안과', icon: '👁️', color: 'green' }
];

export function calculateCost(
  procedure: MedicalProcedure,
  clinicTier: 'budget' | 'standard' | 'premium'
): CostEstimate {
  // Get average cost for the tier
  const tierRange = procedure.priceRange[clinicTier];
  const avgCostUSD = (tierRange.min + tierRange.max) / 2;
  const avgCostKRW = avgCostUSD * EXCHANGE_RATE;

  // Calculate trip duration (recovery + buffer days)
  const totalTripDays = procedure.recoveryDays + 5; // 5 extra days for consultation & follow-up

  // Additional costs (per day)
  const accommodationPerDay = clinicTier === 'budget' ? 40 : clinicTier === 'standard' ? 80 : 150;
  const mealsPerDay = clinicTier === 'budget' ? 20 : clinicTier === 'standard' ? 40 : 70;
  const transportationPerDay = 10;
  const medicationsTotal = 50; // One-time cost

  const additionalCosts = {
    accommodation: accommodationPerDay * totalTripDays,
    meals: mealsPerDay * totalTripDays,
    transportation: transportationPerDay * totalTripDays,
    medications: medicationsTotal
  };

  const totalAdditional = Object.values(additionalCosts).reduce((a, b) => a + b, 0);
  const grandTotalUSD = avgCostUSD + totalAdditional;
  const grandTotalKRW = grandTotalUSD * EXCHANGE_RATE;

  return {
    procedure,
    clinicTier,
    estimatedCost: {
      usd: Math.round(avgCostUSD),
      krw: Math.round(avgCostKRW)
    },
    recoveryDays: procedure.recoveryDays,
    totalTripDays,
    additionalCosts,
    grandTotal: {
      usd: Math.round(grandTotalUSD),
      krw: Math.round(grandTotalKRW)
    }
  };
}

export function getProceduresByCategory(categoryId: string): MedicalProcedure[] {
  return medicalProcedures.filter(p => p.category === categoryId);
}
