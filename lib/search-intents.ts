export function searchIntent(value: string) {
  const q = value.toLowerCase();
  const groups: [string, RegExp][] = [
    ['tax-refund', /tax|refund|vat/],
    ['dietary', /allerg|vegan|vegetarian|halal|gluten/],
    ['palace-night', /starlight|moonlight|palace.*night|night.*palace/],
    ['airport-transfer', /airport|incheon|arex|icn/],
    ['transit-pass', /pass|climate|t-money|tmoney|transit/],
    ['winter-preparation', /winter|cold|snow|packing/],
    ['payment', /atm|card|cash|payment|currency/],
    ['connectivity', /esim|sim|wi-fi|wifi|internet/],
    ['accommodation', /hotel|stay|hanok|room|accommodation/],
    ['itinerary', /itinerary|route|day trip|suwon|busan/],
    ['food', /food|restaurant|bbq|barbecue|market|cafe|café/],
    ['culture', /museum|performance|concert|ticket|culture|palace/],
    ['shopping', /shop|beauty|olive|souvenir/],
    ['entry-preparation', /visa|entry|arrival card|k-eta|passport/],
  ];
  return groups.find(([, pattern]) => pattern.test(q))?.[0] || 'unclassified';
}
