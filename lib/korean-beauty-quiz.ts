// Korean Beauty Routine Quiz

export interface QuizQuestion {
  id: number;
  question: string;
  options: {
    text: string;
    skinType: string;
    points: number;
  }[];
}

export interface BeautyRoutineResult {
  skinType: string;
  description: string;
  icon: string;
  characteristics: string[];
  morningRoutine: RoutineStep[];
  eveningRoutine: RoutineStep[];
  productRecommendations: ProductCategory[];
  koreanTips: string[];
}

export interface RoutineStep {
  step: number;
  name: string;
  description: string;
  products: string[];
}

export interface ProductCategory {
  category: string;
  products: string[];
  koreanBrands: string[];
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "How does your skin feel in the morning?",
    options: [
      { text: "Tight and flaky", skinType: "dry", points: 3 },
      { text: "Oily all over", skinType: "oily", points: 3 },
      { text: "Oily T-zone, dry cheeks", skinType: "combination", points: 3 },
      { text: "Comfortable and balanced", skinType: "normal", points: 3 },
      { text: "Red and irritated", skinType: "sensitive", points: 3 },
    ],
  },
  {
    id: 2,
    question: "How does your skin react to new products?",
    options: [
      { text: "Gets irritated easily", skinType: "sensitive", points: 2 },
      { text: "Breaks out frequently", skinType: "oily", points: 2 },
      { text: "Rarely has issues", skinType: "normal", points: 2 },
      { text: "Becomes flaky or tight", skinType: "dry", points: 2 },
      { text: "Mixed reactions in different areas", skinType: "combination", points: 2 },
    ],
  },
  {
    id: 3,
    question: "What's your main skin concern?",
    options: [
      { text: "Dryness and dullness", skinType: "dry", points: 3 },
      { text: "Excess oil and large pores", skinType: "oily", points: 3 },
      { text: "Uneven texture", skinType: "combination", points: 3 },
      { text: "Redness and sensitivity", skinType: "sensitive", points: 3 },
      { text: "Maintaining healthy skin", skinType: "normal", points: 3 },
    ],
  },
  {
    id: 4,
    question: "How often do you need to moisturize?",
    options: [
      { text: "Constantly, my skin drinks it up", skinType: "dry", points: 2 },
      { text: "Rarely, it makes me greasy", skinType: "oily", points: 2 },
      { text: "Only on certain areas", skinType: "combination", points: 2 },
      { text: "Regular amount works fine", skinType: "normal", points: 2 },
      { text: "Carefully, only gentle products", skinType: "sensitive", points: 2 },
    ],
  },
  {
    id: 5,
    question: "How does your skin look by midday?",
    options: [
      { text: "Shiny and oily", skinType: "oily", points: 3 },
      { text: "Dry patches appear", skinType: "dry", points: 3 },
      { text: "Oily T-zone, dry elsewhere", skinType: "combination", points: 3 },
      { text: "Still looks fresh", skinType: "normal", points: 3 },
      { text: "Slightly red or irritated", skinType: "sensitive", points: 3 },
    ],
  },
];

export const SKIN_TYPE_RESULTS: { [key: string]: BeautyRoutineResult } = {
  dry: {
    skinType: "Dry Skin (건성 피부)",
    description: "Your skin needs extra hydration and nourishment. Korean skincare focuses on layering moisture-rich products.",
    icon: "💧",
    characteristics: [
      "Tight, flaky texture",
      "Dull appearance",
      "Fine lines more visible",
      "Easily irritated by harsh products",
      "Absorbs products quickly",
    ],
    morningRoutine: [
      {
        step: 1,
        name: "Gentle Cleanser",
        description: "Use a hydrating, cream-based cleanser",
        products: ["Milk cleanser", "Cream cleanser", "Oil-based cleanser"],
      },
      {
        step: 2,
        name: "Toner/Essence",
        description: "Apply hydrating toner to prep skin",
        products: ["Hydrating toner", "Essence", "Skin softener"],
      },
      {
        step: 3,
        name: "Serum",
        description: "Use hyaluronic acid or ceramide serum",
        products: ["Hyaluronic acid serum", "Ceramide serum", "Nourishing ampoule"],
      },
      {
        step: 4,
        name: "Moisturizer",
        description: "Apply rich, nourishing cream",
        products: ["Heavy cream", "Sleeping pack", "Facial oil"],
      },
      {
        step: 5,
        name: "Sunscreen",
        description: "Finish with moisturizing SPF 50+",
        products: ["Hydrating sunscreen", "Essence sunscreen", "Cream sunscreen"],
      },
    ],
    eveningRoutine: [
      {
        step: 1,
        name: "Double Cleanse",
        description: "Oil cleanser followed by gentle foam",
        products: ["Cleansing oil", "Cleansing balm", "Milk cleanser"],
      },
      {
        step: 2,
        name: "Toner",
        description: "Hydrating toner with 7-skin method",
        products: ["Hydrating toner", "Essence toner", "Moisture toner"],
      },
      {
        step: 3,
        name: "Treatment",
        description: "Hydrating serum or ampoule",
        products: ["Hyaluronic serum", "Nourishing ampoule", "Peptide serum"],
      },
      {
        step: 4,
        name: "Sheet Mask (2-3x/week)",
        description: "Use hydrating sheet masks",
        products: ["Hyaluronic mask", "Honey mask", "Ceramide mask"],
      },
      {
        step: 5,
        name: "Night Cream",
        description: "Apply rich sleeping pack",
        products: ["Sleeping pack", "Night cream", "Facial oil"],
      },
    ],
    productRecommendations: [
      {
        category: "Cleansers",
        products: ["Milk cleanser", "Cream cleanser", "Oil cleanser"],
        koreanBrands: ["Banila Co Clean It Zero", "Heimish All Clean Balm", "Klairs Gentle Black Cleansing Oil"],
      },
      {
        category: "Toners/Essences",
        products: ["Hydrating toner", "Essence", "First treatment essence"],
        koreanBrands: ["Klairs Supple Preparation Toner", "COSRX Hyaluronic Acid Essence", "Laneige Cream Skin Refiner"],
      },
      {
        category: "Serums/Ampoules",
        products: ["Hyaluronic acid", "Ceramide serum", "Nourishing ampoule"],
        koreanBrands: ["Dr. Jart+ Ceramidin Serum", "Laneige Water Bank Serum", "The Ordinary Hyaluronic Acid"],
      },
      {
        category: "Moisturizers",
        products: ["Rich cream", "Sleeping pack", "Facial oil"],
        koreanBrands: ["Laneige Water Sleeping Mask", "Belif True Cream Moisturizing Bomb", "Etude House Moistfull Collagen Cream"],
      },
    ],
    koreanTips: [
      "🌊 Use the '7-Skin Method' - apply toner 7 times for deep hydration",
      "🍯 Try honey-based products popular in K-beauty for nourishment",
      "💤 Never skip sleeping packs - they're a Korean skincare staple",
      "🧴 Layer products from thinnest to thickest consistency",
      "☁️ Look for 'cream skin' products that combine toner + moisturizer",
      "🌸 Use essence before serum for better absorption",
      "🎭 Sheet masks 2-3 times per week for intensive hydration",
    ],
  },
  oily: {
    skinType: "Oily Skin (지성 피부)",
    description: "Your skin produces excess sebum. Korean skincare emphasizes gentle hydration without heaviness.",
    icon: "✨",
    characteristics: [
      "Shiny appearance, especially T-zone",
      "Large, visible pores",
      "Prone to breakouts",
      "Makeup doesn't last long",
      "Skin feels greasy by midday",
    ],
    morningRoutine: [
      {
        step: 1,
        name: "Gel Cleanser",
        description: "Use gentle, pH-balanced foam cleanser",
        products: ["Low-pH gel cleanser", "Salicylic acid cleanser", "Tea tree cleanser"],
      },
      {
        step: 2,
        name: "Toner",
        description: "Apply lightweight, balancing toner",
        products: ["BHA toner", "Green tea toner", "Witch hazel toner"],
      },
      {
        step: 3,
        name: "Serum",
        description: "Use lightweight, oil-controlling serum",
        products: ["Niacinamide serum", "Tea tree serum", "Centella serum"],
      },
      {
        step: 4,
        name: "Moisturizer",
        description: "Apply gel or water-based moisturizer",
        products: ["Gel moisturizer", "Water cream", "Oil-free lotion"],
      },
      {
        step: 5,
        name: "Sunscreen",
        description: "Use matte-finish, non-comedogenic SPF",
        products: ["Gel sunscreen", "Water sunscreen", "Matte sunscreen"],
      },
    ],
    eveningRoutine: [
      {
        step: 1,
        name: "Double Cleanse",
        description: "Oil cleanser to remove sebum, then foam",
        products: ["Lightweight cleansing oil", "Micellar water", "Foam cleanser"],
      },
      {
        step: 2,
        name: "Exfoliation (2-3x/week)",
        description: "Use BHA or AHA for pore care",
        products: ["BHA toner", "AHA serum", "Peeling gel"],
      },
      {
        step: 3,
        name: "Treatment",
        description: "Apply pore-minimizing serum",
        products: ["Niacinamide serum", "Retinol serum", "Tea tree treatment"],
      },
      {
        step: 4,
        name: "Clay Mask (1-2x/week)",
        description: "Deep clean pores with clay",
        products: ["Clay mask", "Charcoal mask", "Pore pack"],
      },
      {
        step: 5,
        name: "Lightweight Moisturizer",
        description: "Seal with gel moisturizer",
        products: ["Gel moisturizer", "Water sleeping mask", "Oil-free cream"],
      },
    ],
    productRecommendations: [
      {
        category: "Cleansers",
        products: ["Low-pH foam cleanser", "Gel cleanser", "Salicylic cleanser"],
        koreanBrands: ["COSRX Low pH Good Morning Gel", "Innisfree Jeju Volcanic Pore Cleanser", "Etude House Baking Powder Foam"],
      },
      {
        category: "Toners",
        products: ["BHA toner", "Balancing toner", "Pore toner"],
        koreanBrands: ["COSRX BHA Blackhead Power Liquid", "Some By Mi AHA BHA PHA Toner", "Benton Aloe BHA Toner"],
      },
      {
        category: "Serums",
        products: ["Niacinamide", "Tea tree", "Centella"],
        koreanBrands: ["The Ordinary Niacinamide 10%", "COSRX Centella Blemish Serum", "Innisfree Green Tea Seed Serum"],
      },
      {
        category: "Moisturizers",
        products: ["Gel moisturizer", "Water cream", "Oil-free lotion"],
        koreanBrands: ["Belif Aqua Bomb", "Etude House Soon Jung Emulsion", "Innisfree Green Tea Balancing Cream"],
      },
    ],
    koreanTips: [
      "🧊 Use clay masks with Jeju volcanic clay - Korean favorite for oil control",
      "🍵 Green tea products are perfect for oily skin in K-beauty",
      "💧 Don't skip moisturizer - dehydrated skin produces more oil!",
      "🔬 BHA (salicylic acid) is key for pore care in Korean routines",
      "🧴 Use lightweight 'watery' textures popular in Korean skincare",
      "🌿 Centella asiatica soothes and balances oily skin",
      "📋 Pore strips and sebum patches are K-beauty essentials",
    ],
  },
  combination: {
    skinType: "Combination Skin (복합성 피부)",
    description: "Your skin has both oily and dry areas. Korean multi-masking and targeted treatments work best.",
    icon: "🌓",
    characteristics: [
      "Oily T-zone (forehead, nose, chin)",
      "Dry or normal cheeks",
      "Enlarged pores in T-zone",
      "Different needs in different areas",
      "Seasonal changes affect balance",
    ],
    morningRoutine: [
      {
        step: 1,
        name: "Gentle Cleanser",
        description: "Use balanced, pH-neutral cleanser",
        products: ["Gel cleanser", "Low-pH foam", "Mild cleanser"],
      },
      {
        step: 2,
        name: "Toner",
        description: "Apply balancing toner all over",
        products: ["Balancing toner", "Hydrating toner", "pH-adjusting toner"],
      },
      {
        step: 3,
        name: "Serum (Targeted)",
        description: "Use different serums for different zones",
        products: ["Niacinamide for T-zone", "Hyaluronic for cheeks", "Multi-purpose serum"],
      },
      {
        step: 4,
        name: "Moisturizer (Zoned)",
        description: "Light gel on T-zone, cream on cheeks",
        products: ["Gel moisturizer", "Cream moisturizer", "Balancing lotion"],
      },
      {
        step: 5,
        name: "Sunscreen",
        description: "Lightweight SPF 50+ all over",
        products: ["Essence sunscreen", "Gel sunscreen", "Hybrid sunscreen"],
      },
    ],
    eveningRoutine: [
      {
        step: 1,
        name: "Double Cleanse",
        description: "Oil cleanser then gentle foam",
        products: ["Cleansing oil", "Cleansing water", "Foam cleanser"],
      },
      {
        step: 2,
        name: "Toner",
        description: "Balancing toner for whole face",
        products: ["Balancing toner", "Essence toner", "pH toner"],
      },
      {
        step: 3,
        name: "Treatment (Targeted)",
        description: "BHA on T-zone, hydrating on cheeks",
        products: ["BHA for T-zone", "Hyaluronic for dry areas", "Niacinamide serum"],
      },
      {
        step: 4,
        name: "Multi-Masking (2-3x/week)",
        description: "Clay on T-zone, hydrating on cheeks",
        products: ["Clay mask", "Hydrating mask", "Sheet mask"],
      },
      {
        step: 5,
        name: "Moisturizer (Zoned)",
        description: "Different products for different areas",
        products: ["Gel for oily zones", "Cream for dry zones", "Sleeping pack"],
      },
    ],
    productRecommendations: [
      {
        category: "Cleansers",
        products: ["Balanced gel cleanser", "Low-pH foam", "Mild cleanser"],
        koreanBrands: ["Klairs Rich Moist Foaming Cleanser", "COSRX Low pH Good Morning Gel", "Etude House Soon Jung Whip Cleanser"],
      },
      {
        category: "Toners",
        products: ["Balancing toner", "Hydrating toner", "pH-adjusting toner"],
        koreanBrands: ["Klairs Supple Preparation Toner", "Etude House Soon Jung Relief Toner", "COSRX Centella Water Toner"],
      },
      {
        category: "Serums",
        products: ["Niacinamide", "Hyaluronic acid", "Multi-purpose serum"],
        koreanBrands: ["The Ordinary Niacinamide", "COSRX Snail Mucin Essence", "Purito Centella Serum"],
      },
      {
        category: "Moisturizers",
        products: ["Gel moisturizer", "Light cream", "Balancing lotion"],
        koreanBrands: ["Belif Aqua Bomb", "Etude House Soon Jung 2x Barrier Cream", "Cosrx Oil-Free Moisturizing Lotion"],
      },
    ],
    koreanTips: [
      "🎭 Try 'multi-masking' - different masks on different face zones!",
      "🔄 Adjust your routine seasonally - more hydration in winter",
      "🎯 Target T-zone with clay, cheeks with hydration",
      "💡 Korean 'skin fasting' once a week helps balance combination skin",
      "🌊 Use hydrating toner on dry areas, BHA toner on oily zones",
      "📍 Apply products strategically - don't treat all areas the same",
      "🧪 Korean essence-type products work great for combination skin",
    ],
  },
  normal: {
    skinType: "Normal Skin (정상 피부)",
    description: "Your skin is balanced and healthy. Focus on maintaining its natural state with gentle Korean skincare.",
    icon: "🌟",
    characteristics: [
      "Balanced oil and moisture",
      "Few breakouts or dry patches",
      "Smooth, even texture",
      "Small, barely visible pores",
      "Radiant, healthy appearance",
    ],
    morningRoutine: [
      {
        step: 1,
        name: "Gentle Cleanser",
        description: "Use mild, balanced cleanser",
        products: ["Gel cleanser", "Low-pH foam", "Water-based cleanser"],
      },
      {
        step: 2,
        name: "Toner",
        description: "Apply hydrating toner",
        products: ["Hydrating toner", "Essence toner", "Balancing toner"],
      },
      {
        step: 3,
        name: "Serum",
        description: "Use vitamin C or niacinamide for glow",
        products: ["Vitamin C serum", "Niacinamide", "Brightening serum"],
      },
      {
        step: 4,
        name: "Moisturizer",
        description: "Apply light, balanced moisturizer",
        products: ["Light cream", "Gel-cream", "Emulsion"],
      },
      {
        step: 5,
        name: "Sunscreen",
        description: "Finish with SPF 50+ daily",
        products: ["Essence sunscreen", "Cream sunscreen", "Gel sunscreen"],
      },
    ],
    eveningRoutine: [
      {
        step: 1,
        name: "Double Cleanse",
        description: "Oil cleanser then gentle foam",
        products: ["Cleansing oil", "Micellar water", "Foam cleanser"],
      },
      {
        step: 2,
        name: "Toner",
        description: "Hydrating toner to prep skin",
        products: ["Essence toner", "Hydrating toner", "First essence"],
      },
      {
        step: 3,
        name: "Treatment",
        description: "Anti-aging or brightening serum",
        products: ["Vitamin C", "Retinol", "Peptide serum"],
      },
      {
        step: 4,
        name: "Sheet Mask (2x/week)",
        description: "Maintain glow with sheet masks",
        products: ["Brightening mask", "Hydrating mask", "Anti-aging mask"],
      },
      {
        step: 5,
        name: "Night Cream",
        description: "Light sleeping pack or night cream",
        products: ["Sleeping pack", "Night cream", "Light moisturizer"],
      },
    ],
    productRecommendations: [
      {
        category: "Cleansers",
        products: ["Gentle gel cleanser", "Low-pH foam", "Oil cleanser"],
        koreanBrands: ["Klairs Gentle Black Deep Cleansing Oil", "COSRX Low pH Good Morning Gel", "Heimish All Clean Balm"],
      },
      {
        category: "Toners/Essences",
        products: ["Hydrating toner", "First essence", "Brightening toner"],
        koreanBrands: ["SK-II Facial Treatment Essence", "Missha Time Revolution Essence", "Klairs Supple Preparation Toner"],
      },
      {
        category: "Serums",
        products: ["Vitamin C", "Niacinamide", "Peptides"],
        koreanBrands: ["Klairs Freshly Juiced Vitamin C", "The Ordinary Niacinamide", "Missha Night Repair Ampoule"],
      },
      {
        category: "Moisturizers",
        products: ["Light cream", "Emulsion", "Sleeping pack"],
        koreanBrands: ["Laneige Water Bank Cream", "Etude House Moistfull Collagen Cream", "COSRX Honey Overnight Mask"],
      },
    ],
    koreanTips: [
      "🌸 Maintain your 'glass skin' with consistent hydration",
      "✨ Focus on brightening and anti-aging prevention",
      "🎯 Korean skincare philosophy: prevention > treatment",
      "💎 Try 'essence' products - the heart of K-beauty",
      "🌙 Overnight masks help maintain that dewy Korean glow",
      "🧴 Don't over-complicate - your skin is already balanced!",
      "🎭 Sheet masks 2-3x per week for that K-beauty radiance",
    ],
  },
  sensitive: {
    skinType: "Sensitive Skin (민감성 피부)",
    description: "Your skin reacts easily to products and environment. Korean skincare emphasizes gentle, soothing ingredients.",
    icon: "🌸",
    characteristics: [
      "Easily irritated or red",
      "Reacts to new products",
      "Feels tight or uncomfortable",
      "Prone to redness and inflammation",
      "Fragrance-sensitive",
    ],
    morningRoutine: [
      {
        step: 1,
        name: "Ultra-Gentle Cleanser",
        description: "Use fragrance-free, pH-balanced cleanser",
        products: ["Milk cleanser", "Micellar water", "pH 5.5 cleanser"],
      },
      {
        step: 2,
        name: "Soothing Toner",
        description: "Apply calming, alcohol-free toner",
        products: ["Centella toner", "Aloe toner", "Soothing toner"],
      },
      {
        step: 3,
        name: "Calming Serum",
        description: "Use centella or madecassoside serum",
        products: ["Centella serum", "Madecassoside", "Calming ampoule"],
      },
      {
        step: 4,
        name: "Barrier Cream",
        description: "Apply ceramide or barrier-repair cream",
        products: ["Ceramide cream", "Barrier cream", "Cica cream"],
      },
      {
        step: 5,
        name: "Mineral Sunscreen",
        description: "Use physical/mineral SPF for sensitive skin",
        products: ["Zinc oxide sunscreen", "Mineral sunscreen", "Sensitive-skin SPF"],
      },
    ],
    eveningRoutine: [
      {
        step: 1,
        name: "Gentle Cleanse",
        description: "Micellar water or milk cleanser only",
        products: ["Micellar water", "Milk cleanser", "Ultra-gentle cleanser"],
      },
      {
        step: 2,
        name: "Soothing Toner",
        description: "Calming toner with centella",
        products: ["Centella toner", "Aloe toner", "Calming toner"],
      },
      {
        step: 3,
        name: "Treatment",
        description: "Soothing, anti-redness serum",
        products: ["Centella serum", "Cica serum", "Calming ampoule"],
      },
      {
        step: 4,
        name: "Calming Mask (2x/week)",
        description: "Gentle, soothing sheet mask",
        products: ["Centella mask", "Aloe mask", "Madecassoside mask"],
      },
      {
        step: 5,
        name: "Rich Barrier Cream",
        description: "Thick, protective night cream",
        products: ["Ceramide cream", "Barrier repair", "Cica sleeping pack"],
      },
    ],
    productRecommendations: [
      {
        category: "Cleansers",
        products: ["Milk cleanser", "Micellar water", "pH 5.5 cleanser"],
        koreanBrands: ["Etude House Soon Jung Whip Cleanser", "Klairs Rich Moist Foaming Cleanser", "Purito Defense Barrier Cleanser"],
      },
      {
        category: "Toners",
        products: ["Centella toner", "Calming toner", "Soothing toner"],
        koreanBrands: ["Etude House Soon Jung Relief Toner", "Purito Centella Green Level Toner", "Dr. Jart+ Cicapair Toner"],
      },
      {
        category: "Serums",
        products: ["Centella serum", "Madecassoside", "Cica serum"],
        koreanBrands: ["Purito Centella Green Level Serum", "Dr. Jart+ Cicapair Serum", "COSRX Pure Fit Cica Serum"],
      },
      {
        category: "Moisturizers",
        products: ["Ceramide cream", "Barrier cream", "Cica cream"],
        koreanBrands: ["Etude House Soon Jung 2x Barrier Cream", "Dr. Jart+ Ceramidin Cream", "Purito Centella Recovery Cream"],
      },
    ],
    koreanTips: [
      "🌿 Centella asiatica (Cica) is the K-beauty holy grail for sensitive skin",
      "🔬 Look for 'Soon Jung' or 'Relief' lines - made for sensitive skin",
      "🚫 Avoid fragrance, alcohol, and harsh actives",
      "💚 Korean dermatologists love madecassoside for calming",
      "🛡️ Focus on barrier repair with ceramides",
      "🧪 Patch test everything - even 'gentle' products",
      "🌸 Keep routine minimal - less is more for sensitive skin",
    ],
  },
};

export function calculateSkinType(answers: { [questionId: number]: string }): string {
  const skinTypeScores: { [key: string]: number } = {
    dry: 0,
    oily: 0,
    combination: 0,
    normal: 0,
    sensitive: 0,
  };

  // Calculate scores based on answers
  Object.entries(answers).forEach(([questionId, selectedSkinType]) => {
    skinTypeScores[selectedSkinType] = (skinTypeScores[selectedSkinType] || 0) + 1;
  });

  // Find the skin type with highest score
  let maxScore = 0;
  let dominantSkinType = 'normal';

  Object.entries(skinTypeScores).forEach(([skinType, score]) => {
    if (score > maxScore) {
      maxScore = score;
      dominantSkinType = skinType;
    }
  });

  return dominantSkinType;
}

export function getSkinTypeResult(skinType: string): BeautyRoutineResult {
  return SKIN_TYPE_RESULTS[skinType] || SKIN_TYPE_RESULTS.normal;
}
