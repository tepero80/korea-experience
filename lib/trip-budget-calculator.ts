// Korea Trip Budget Calculator Logic

export interface TripPreferences {
  days: number;
  accommodation: 'budget' | 'standard' | 'luxury';
  meals: 'budget' | 'standard' | 'foodie';
  shopping: number; // in USD
  activities: 'minimal' | 'moderate' | 'extensive';
}

export interface BudgetBreakdown {
  accommodation: number;
  meals: number;
  transportation: number;
  activities: number;
  shopping: number;
  miscellaneous: number;
  total: number;
  totalKRW: number;
}

export interface SavingTip {
  category: string;
  tip: string;
}

// Pricing data per day/night in USD
const PRICING = {
  accommodation: {
    budget: 30,      // Hostels, guesthouses
    standard: 80,    // Mid-range hotels
    luxury: 200      // 5-star hotels
  },
  meals: {
    budget: 15,      // Street food, local restaurants
    standard: 35,    // Mix of restaurants
    foodie: 70       // Fine dining, Michelin restaurants
  },
  transportation: {
    perDay: 10       // Subway, bus, occasional taxi
  },
  activities: {
    minimal: 20,     // Free attractions, basic tours
    moderate: 60,    // Museums, palaces, some paid tours
    extensive: 150   // Theme parks, premium experiences
  },
  miscellaneous: {
    perDay: 10       // SIM card, souvenirs, emergencies
  }
};

const KRW_TO_USD_RATE = 1300; // Approximate exchange rate

export function calculateBudget(preferences: TripPreferences): BudgetBreakdown {
  const { days, accommodation, meals, shopping, activities } = preferences;

  // Calculate each category
  const accommodationCost = PRICING.accommodation[accommodation] * days;
  const mealsCost = PRICING.meals[meals] * days;
  const transportationCost = PRICING.transportation.perDay * days;
  const activitiesCost = PRICING.activities[activities] * days;
  const miscellaneousCost = PRICING.miscellaneous.perDay * days;
  const shoppingCost = shopping;

  const total = 
    accommodationCost +
    mealsCost +
    transportationCost +
    activitiesCost +
    miscellaneousCost +
    shoppingCost;

  return {
    accommodation: accommodationCost,
    meals: mealsCost,
    transportation: transportationCost,
    activities: activitiesCost,
    shopping: shoppingCost,
    miscellaneous: miscellaneousCost,
    total: Math.round(total),
    totalKRW: Math.round(total * KRW_TO_USD_RATE)
  };
}

export function getBudgetLevel(totalPerDay: number): 'budget' | 'standard' | 'luxury' {
  if (totalPerDay < 100) return 'budget';
  if (totalPerDay < 250) return 'standard';
  return 'luxury';
}

export function getSavingTips(preferences: TripPreferences): SavingTip[] {
  const tips: SavingTip[] = [];

  // Accommodation tips
  if (preferences.accommodation === 'luxury') {
    tips.push({
      category: '🏨 Accommodation',
      tip: 'Consider mid-range hotels or Airbnb to save $100-150/night while maintaining comfort.'
    });
  } else if (preferences.accommodation === 'standard') {
    tips.push({
      category: '🏨 Accommodation',
      tip: 'Book guesthouses or hostels in neighborhoods like Hongdae or Itaewon to save $40-60/night.'
    });
  }

  // Food tips
  if (preferences.meals === 'foodie') {
    tips.push({
      category: '🍜 Dining',
      tip: 'Mix Michelin dining with local restaurants. Lunch sets at high-end restaurants are 50% cheaper than dinner.'
    });
  }
  tips.push({
    category: '🍜 Dining',
    tip: 'Visit convenience stores (GS25, CU) for affordable breakfast and snacks. Try kimbap shops for $3-5 meals.'
  });

  // Transportation tips
  tips.push({
    category: '🚇 Transportation',
    tip: 'Get a T-money card and use subway/bus (₩1,400 per ride). Much cheaper than taxis which start at ₩5,000.'
  });

  // Activities tips
  if (preferences.activities === 'extensive') {
    tips.push({
      category: '🎭 Activities',
      tip: 'Buy combo tickets for palaces (₩10,000 for 4 palaces vs ₩3,000 each). Many museums are free on certain days.'
    });
  }
  tips.push({
    category: '🎭 Activities',
    tip: 'Free attractions: Han River parks, Dongdaemun Design Plaza, hiking trails, temple stays (donation-based).'
  });

  // Shopping tips
  if (preferences.shopping > 200) {
    tips.push({
      category: '🛍️ Shopping',
      tip: 'Shop at duty-free stores for tax refunds. Myeongdong and Dongdaemun have better prices than Gangnam.'
    });
  }
  tips.push({
    category: '🛍️ Shopping',
    tip: 'Download "Creatrip" app for tourist discounts. Use tax refund (8-10%) at participating stores over ₩30,000.'
  });

  // General tips
  tips.push({
    category: '💡 General',
    tip: 'Travel during off-season (March-May, Sept-Nov) for 30-40% cheaper accommodation and fewer crowds.'
  });

  tips.push({
    category: '💡 General',
    tip: 'Get a Korea Tour Card (Discover Seoul Pass) for unlimited transport + free entry to 40+ attractions.'
  });

  return tips;
}

export function getRecommendedItinerary(budgetLevel: 'budget' | 'standard' | 'luxury', days: number): string[] {
  const itineraries = {
    budget: [
      '🏨 Stay in hostels/guesthouses in Hongdae or Itaewon',
      '🍜 Eat at local restaurants, street food, and convenience stores',
      '🚇 Use public transportation exclusively (T-money card)',
      '🎭 Visit free attractions: palaces on certain days, Han River, hiking',
      '🛍️ Shop at Dongdaemun Market and local neighborhoods',
      '☕ Try cafe culture at budget chains (Ediya, Paik\'s Coffee at ₩1,500)'
    ],
    standard: [
      '🏨 Stay in 3-star hotels or nice Airbnbs in central locations',
      '🍜 Mix of mid-range restaurants and occasional fine dining',
      '🚇 Public transport + occasional taxis for convenience',
      '🎭 Paid attractions: theme parks, DMZ tour, K-pop concerts',
      '🛍️ Shopping at Myeongdong, Gangnam, and department stores',
      '☕ Experience premium cafes and dessert culture',
      '🎭 Book at least one cultural experience (hanbok rental, cooking class)'
    ],
    luxury: [
      '🏨 Stay in 5-star hotels (Signiel, Four Seasons, Park Hyatt)',
      '🍜 Dine at Michelin restaurants and premium Korean BBQ',
      '🚗 Private car service or luxury taxis',
      '🎭 VIP experiences: private palace tours, premium K-pop tickets',
      '🛍️ High-end shopping in Cheongdam-dong and Apgujeong',
      '💆 Spa treatments and wellness experiences',
      '🎭 Exclusive experiences: temple stays, private cooking classes',
      '🍷 Visit premium bars and rooftop lounges'
    ]
  };

  return itineraries[budgetLevel];
}

export function getFlightInfo(): string {
  return 'Average round-trip flights to Seoul (ICN): $800-1,500 from US/Europe, $400-800 from Asia, $1,200-2,000 from South America/Africa. Book 2-3 months in advance for best prices. Use Google Flights or Skyscanner for deals.';
}

export function getSeasonalAdvice(days: number): string {
  const month = new Date().getMonth() + 1;
  
  if (month >= 3 && month <= 5) {
    return '🌸 Spring (Mar-May): Cherry blossoms! Perfect weather but popular. Book accommodation early. Budget +20% for festivals.';
  } else if (month >= 6 && month <= 8) {
    return '☀️ Summer (Jun-Aug): Hot and humid. Monsoon in July. Indoor activities recommended. Hotels 20% cheaper mid-week.';
  } else if (month >= 9 && month <= 11) {
    return '🍂 Fall (Sep-Nov): Best time to visit! Beautiful autumn colors. Peak season, book 2+ months ahead. Worth the premium.';
  } else {
    return '❄️ Winter (Dec-Feb): Cold but magical! Snow festivals, skiing, winter food. Hotels 30-40% cheaper. Pack warm clothes.';
  }
}
