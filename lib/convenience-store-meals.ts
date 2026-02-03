// Korean Convenience Store Meal Builder - Logic and Data

export interface StoreItem {
  id: string;
  name: string;
  nameKo: string;
  category: 'instant' | 'rice' | 'snack' | 'drink' | 'dessert' | 'side';
  price: number;
  calories: number;
  stores: ('GS25' | 'CU' | '7-Eleven')[];
}

export interface MealCombo {
  id: string;
  name: string;
  nameKo: string;
  purpose: 'meal' | 'latenight' | 'drink' | 'dessert';
  items: string[]; // item IDs
  totalPrice: number;
  totalCalories: number;
  tips: string;
  emoji: string;
}

export interface GeneratedMeal {
  combo: {
    name: string;
    nameKo: string;
    emoji: string;
  };
  items: StoreItem[];
  totalPrice: number;
  totalCalories: number;
  tips: string;
  stores: string[];
}

// Popular convenience store items
export const STORE_ITEMS: StoreItem[] = [
  // Instant Noodles
  { id: 'shin-ramyun', name: 'Shin Ramyun', nameKo: '신라면', category: 'instant', price: 1200, calories: 500, stores: ['GS25', 'CU', '7-Eleven'] },
  { id: 'jjapaguri', name: 'Jjapaguri', nameKo: '짜파구리', category: 'instant', price: 2800, calories: 550, stores: ['GS25', 'CU', '7-Eleven'] },
  { id: 'buldak', name: 'Buldak Bokkeummyeon', nameKo: '불닭볶음면', category: 'instant', price: 1500, calories: 530, stores: ['GS25', 'CU', '7-Eleven'] },
  { id: 'cheese-ramyun', name: 'Cheese Ramyun', nameKo: '치즈라면', category: 'instant', price: 1800, calories: 580, stores: ['GS25', 'CU'] },
  { id: 'yukgaejang', name: 'Yukgaejang Cup', nameKo: '육개장컵', category: 'instant', price: 1400, calories: 320, stores: ['GS25', 'CU', '7-Eleven'] },
  
  // Rice & Meal
  { id: 'triangle-kimbap', name: 'Triangle Kimbap', nameKo: '삼각김밥', category: 'rice', price: 1500, calories: 250, stores: ['GS25', 'CU', '7-Eleven'] },
  { id: 'dosirak', name: 'Dosirak Lunchbox', nameKo: '도시락', category: 'rice', price: 4500, calories: 650, stores: ['GS25', 'CU', '7-Eleven'] },
  { id: 'gimbap', name: 'Gimbap Roll', nameKo: '김밥', category: 'rice', price: 3000, calories: 400, stores: ['GS25', 'CU', '7-Eleven'] },
  { id: 'tuna-mayo', name: 'Tuna Mayo Rice Ball', nameKo: '참치마요 주먹밥', category: 'rice', price: 2000, calories: 280, stores: ['GS25', 'CU'] },
  { id: 'bibimbap', name: 'Instant Bibimbap', nameKo: '컵비빔밥', category: 'rice', price: 3500, calories: 450, stores: ['GS25', 'CU', '7-Eleven'] },
  
  // Side Dishes
  { id: 'tteokbokki', name: 'Instant Tteokbokki', nameKo: '즉석 떡볶이', category: 'side', price: 2500, calories: 350, stores: ['GS25', 'CU', '7-Eleven'] },
  { id: 'cheese-stick', name: 'Cheese Stick', nameKo: '치즈스틱', category: 'side', price: 1000, calories: 180, stores: ['GS25', 'CU', '7-Eleven'] },
  { id: 'fried-chicken', name: 'Fried Chicken', nameKo: '프라이드치킨', category: 'side', price: 3000, calories: 450, stores: ['GS25', 'CU'] },
  { id: 'fish-cake', name: 'Fish Cake Skewer', nameKo: '어묵', category: 'side', price: 1200, calories: 150, stores: ['GS25', 'CU', '7-Eleven'] },
  { id: 'corn-dog', name: 'Corn Dog', nameKo: '핫도그', category: 'side', price: 1800, calories: 300, stores: ['GS25', 'CU', '7-Eleven'] },
  
  // Snacks
  { id: 'honey-butter-chip', name: 'Honey Butter Chip', nameKo: '허니버터칩', category: 'snack', price: 2000, calories: 280, stores: ['GS25', 'CU', '7-Eleven'] },
  { id: 'new-potato-chip', name: 'New Potato Chip', nameKo: '새우깡', category: 'snack', price: 1500, calories: 250, stores: ['GS25', 'CU', '7-Eleven'] },
  { id: 'choco-pie', name: 'Choco Pie', nameKo: '초코파이', category: 'snack', price: 1200, calories: 200, stores: ['GS25', 'CU', '7-Eleven'] },
  { id: 'pepero', name: 'Pepero', nameKo: '빼빼로', category: 'snack', price: 1500, calories: 180, stores: ['GS25', 'CU', '7-Eleven'] },
  
  // Drinks
  { id: 'banana-milk', name: 'Banana Milk', nameKo: '바나나우유', category: 'drink', price: 1500, calories: 130, stores: ['GS25', 'CU', '7-Eleven'] },
  { id: 'soju', name: 'Soju (Chamisul)', nameKo: '소주', category: 'drink', price: 1800, calories: 350, stores: ['GS25', 'CU', '7-Eleven'] },
  { id: 'beer', name: 'Beer (Cass/Hite)', nameKo: '맥주', category: 'drink', price: 2500, calories: 150, stores: ['GS25', 'CU', '7-Eleven'] },
  { id: 'milkis', name: 'Milkis', nameKo: '밀키스', category: 'drink', price: 1200, calories: 100, stores: ['GS25', 'CU', '7-Eleven'] },
  { id: 'coffee', name: 'Iced Americano', nameKo: '아이스아메리카노', category: 'drink', price: 1500, calories: 10, stores: ['GS25', 'CU', '7-Eleven'] },
  { id: 'coke', name: 'Coca Cola', nameKo: '코카콜라', category: 'drink', price: 1500, calories: 140, stores: ['GS25', 'CU', '7-Eleven'] },
  
  // Desserts
  { id: 'ice-cream', name: 'Melona Ice Cream', nameKo: '메로나', category: 'dessert', price: 1200, calories: 150, stores: ['GS25', 'CU', '7-Eleven'] },
  { id: 'cake', name: 'Roll Cake', nameKo: '롤케이크', category: 'dessert', price: 2500, calories: 300, stores: ['GS25', 'CU', '7-Eleven'] },
  { id: 'yogurt', name: 'Greek Yogurt', nameKo: '그릭요거트', category: 'dessert', price: 2000, calories: 120, stores: ['GS25', 'CU'] },
  { id: 'tiramisu', name: 'Tiramisu Cup', nameKo: '티라미수컵', category: 'dessert', price: 3000, calories: 250, stores: ['GS25', 'CU'] },
];

// Pre-made popular combinations
export const MEAL_COMBOS: MealCombo[] = [
  // Meal (간단한 식사)
  {
    id: 'quick-lunch',
    name: 'Quick Office Lunch',
    nameKo: '직장인 점심 세트',
    purpose: 'meal',
    items: ['triangle-kimbap', 'banana-milk', 'cheese-stick'],
    totalPrice: 4000,
    totalCalories: 560,
    tips: 'Perfect for a quick lunch break! Warm the cheese stick in microwave for 30 seconds.',
    emoji: '🍱'
  },
  {
    id: 'ramen-upgrade',
    name: 'Ultimate Ramen Combo',
    nameKo: '라면 풀코스',
    purpose: 'meal',
    items: ['shin-ramyun', 'triangle-kimbap', 'fish-cake'],
    totalPrice: 3900,
    totalCalories: 900,
    tips: 'Add egg and cheese to ramyun for extra flavor. Eat kimbap as side dish.',
    emoji: '🍜'
  },
  {
    id: 'healthy-meal',
    name: 'Light & Healthy',
    nameKo: '가볍게 한끼',
    purpose: 'meal',
    items: ['gimbap', 'yogurt', 'coffee'],
    totalPrice: 6500,
    totalCalories: 530,
    tips: 'Perfect balance of carbs and protein. Great post-workout meal!',
    emoji: '🥗'
  },
  {
    id: 'student-budget',
    name: 'Student Budget Meal',
    nameKo: '학생 가성비 세트',
    purpose: 'meal',
    items: ['tuna-mayo', 'corn-dog', 'milkis'],
    totalPrice: 5000,
    totalCalories: 680,
    tips: 'Maximum satisfaction with minimum cost! Heat corn dog for better taste.',
    emoji: '🎓'
  },
  
  // Late Night (야식)
  {
    id: 'midnight-feast',
    name: 'Midnight Feast',
    nameKo: '심야식당 풀코스',
    purpose: 'latenight',
    items: ['buldak', 'fried-chicken', 'coke'],
    totalPrice: 6000,
    totalCalories: 1120,
    tips: 'Warning: Extremely spicy! Keep milk nearby. Perfect for late-night study sessions.',
    emoji: '🌙'
  },
  {
    id: 'cozy-night',
    name: 'Cozy Night Snack',
    nameKo: '혼밤 야식',
    purpose: 'latenight',
    items: ['cheese-ramyun', 'tteokbokki', 'banana-milk'],
    totalPrice: 5800,
    totalCalories: 1060,
    tips: 'Extra cheesy goodness! Mix tteokbokki sauce into ramyun for ultimate comfort food.',
    emoji: '🧀'
  },
  {
    id: 'drama-watching',
    name: 'K-Drama Marathon Set',
    nameKo: '드라마 정주행 세트',
    purpose: 'latenight',
    items: ['honey-butter-chip', 'choco-pie', 'coffee'],
    totalPrice: 4700,
    totalCalories: 590,
    tips: 'Perfect for binge-watching! Sweet and salty combo keeps you awake.',
    emoji: '📺'
  },
  
  // Drinking (술안주)
  {
    id: 'soju-party',
    name: 'Classic Soju Party',
    nameKo: '소주 한잔 세트',
    purpose: 'drink',
    items: ['soju', 'fried-chicken', 'tteokbokki'],
    totalPrice: 7300,
    totalCalories: 1150,
    tips: 'The ultimate Korean drinking combo! Alternate between chicken and tteokbokki.',
    emoji: '🍶'
  },
  {
    id: 'beer-time',
    name: 'Beer & Snacks',
    nameKo: '맥주 안주 세트',
    purpose: 'drink',
    items: ['beer', 'corn-dog', 'new-potato-chip'],
    totalPrice: 5800,
    totalCalories: 700,
    tips: 'Light drinking snacks. Perfect for casual Friday night.',
    emoji: '🍺'
  },
  {
    id: 'solo-drink',
    name: 'Solo Drinking Set',
    nameKo: '혼술 세트',
    purpose: 'drink',
    items: ['soju', 'triangle-kimbap', 'fish-cake'],
    totalPrice: 4500,
    totalCalories: 750,
    tips: 'Simple but satisfying. Drink responsibly! Great for unwinding after work.',
    emoji: '🥃'
  },
  
  // Dessert (디저트)
  {
    id: 'sweet-tooth',
    name: 'Sweet Paradise',
    nameKo: '달달 세트',
    purpose: 'dessert',
    items: ['tiramisu', 'ice-cream', 'banana-milk'],
    totalPrice: 5700,
    totalCalories: 530,
    tips: 'Eat ice cream first before it melts! Save tiramisu for last.',
    emoji: '🍰'
  },
  {
    id: 'cafe-vibes',
    name: 'Cafe at Home',
    nameKo: '편의점 카페',
    purpose: 'dessert',
    items: ['cake', 'coffee', 'yogurt'],
    totalPrice: 6000,
    totalCalories: 430,
    tips: 'Instagram-worthy combo! Perfect for afternoon study break.',
    emoji: '☕'
  },
  {
    id: 'choco-heaven',
    name: 'Chocolate Heaven',
    nameKo: '초코 러버 세트',
    purpose: 'dessert',
    items: ['choco-pie', 'pepero', 'banana-milk'],
    totalPrice: 4200,
    totalCalories: 510,
    tips: 'For serious chocolate lovers! Dip pepero in milk for extra goodness.',
    emoji: '🍫'
  },
];

// Helper: Get item by ID
export function getItemById(id: string): StoreItem | undefined {
  return STORE_ITEMS.find(item => item.id === id);
}

// Helper: Get items by IDs
export function getItemsByIds(ids: string[]): StoreItem[] {
  return ids.map(id => getItemById(id)).filter(item => item !== undefined) as StoreItem[];
}

// Helper: Calculate total price
export function calculateTotalPrice(items: StoreItem[]): number {
  return items.reduce((sum, item) => sum + item.price, 0);
}

// Helper: Calculate total calories
export function calculateTotalCalories(items: StoreItem[]): number {
  return items.reduce((sum, item) => sum + item.calories, 0);
}

// Helper: Get common stores
export function getCommonStores(items: StoreItem[]): string[] {
  if (items.length === 0) return [];
  
  // Find stores that have ALL items
  const firstItemStores = items[0].stores;
  const commonStores = firstItemStores.filter(store => 
    items.every(item => item.stores.includes(store))
  );
  
  if (commonStores.length > 0) return commonStores;
  
  // If no common store, return all unique stores
  const allStores = new Set<string>();
  items.forEach(item => item.stores.forEach(store => allStores.add(store)));
  return Array.from(allStores);
}

// Main: Generate meal by purpose and budget
export function generateMeal(purpose: string, budget: number): GeneratedMeal | null {
  // Filter combos by purpose
  const purposeCombos = MEAL_COMBOS.filter(combo => combo.purpose === purpose);
  if (purposeCombos.length === 0) return null;
  
  // Filter by budget (±2000 won tolerance)
  const budgetCombos = purposeCombos.filter(
    combo => combo.totalPrice >= budget - 2000 && combo.totalPrice <= budget + 2000
  );
  
  // If no match, use any combo from same purpose
  const validCombos = budgetCombos.length > 0 ? budgetCombos : purposeCombos;
  
  // Select random combo
  const selectedCombo = validCombos[Math.floor(Math.random() * validCombos.length)];
  const items = getItemsByIds(selectedCombo.items);
  
  return {
    combo: {
      name: selectedCombo.name,
      nameKo: selectedCombo.nameKo,
      emoji: selectedCombo.emoji,
    },
    items,
    totalPrice: calculateTotalPrice(items),
    totalCalories: calculateTotalCalories(items),
    tips: selectedCombo.tips,
    stores: getCommonStores(items),
  };
}

// Generate share text
export function generateShareText(meal: GeneratedMeal): string {
  return `My Korean Convenience Store Combo: ${meal.combo.emoji} ${meal.combo.name} - ${meal.items.length} items for ₩${meal.totalPrice.toLocaleString()}! 🏪`;
}

// Format price
export function formatPrice(krw: number): { krw: string; usd: string } {
  const usd = (krw / 1300).toFixed(2); // Approximate exchange rate
  return {
    krw: `₩${krw.toLocaleString()}`,
    usd: `$${usd}`,
  };
}
