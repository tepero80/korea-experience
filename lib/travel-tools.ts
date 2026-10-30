export const TRANSPORT_SOURCE = {
  url: 'https://world.seoul.go.kr/policy/transportation/climate-card/',
  title: 'Seoul Metropolitan Government — Climate Card',
  checkedAt: '2026-10-30',
};
export const SHORT_PASSES = [
  { days: 1, won: 5000 },
  { days: 2, won: 8000 },
  { days: 3, won: 10000 },
  { days: 5, won: 15000 },
  { days: 7, won: 20000 },
] as const;
export function numberInRange(value: number, min: number, max: number, label: string) {
  if (!Number.isFinite(value) || value < min || value > max)
    throw new RangeError(`${label} must be between ${min} and ${max}.`);
  return value;
}
export interface PassInput {
  days: number;
  journeys: number;
  averageFare: number;
  needsCard: boolean;
  uncoveredCost: number;
  /** Each traveler takes this many journeys. Prices are per traveler. */
  travelers?: number;
  regularCardCost?: number;
}
export function comparePass(input: PassInput) {
  const travelers = input.travelers ?? 1;
  const regularCardCost = input.regularCardCost ?? 0;
  numberInRange(travelers, 1, 30, 'Travelers');
  numberInRange(regularCardCost, 0, 100000, 'Pay-as-you-go card purchase cost');
  numberInRange(input.days, 1, 7, 'Days');
  numberInRange(input.journeys, 0, 150, 'Journeys');
  numberInRange(input.averageFare, 1, 100000, 'Average fare');
  numberInRange(input.uncoveredCost, 0, 10000000, 'Uncovered transport');
  if (
    !Number.isInteger(input.days) ||
    !Number.isInteger(input.journeys) ||
    !Number.isInteger(travelers)
  )
    throw new RangeError('Days, journeys and travelers must be whole numbers.');
  const pass = SHORT_PASSES.find((p) => p.days >= input.days)!;
  const passCost = pass.won + (input.needsCard ? 3000 : 0);
  const regularFareCost = input.journeys * input.averageFare;
  const regularCost = regularFareCost + regularCardCost;
  return {
    assumptions: { ...input, travelers, regularCardCost },
    pass,
    passCost,
    regularCost,
    regularFareCost,
    passTripTotal: passCost + input.uncoveredCost,
    regularTripTotal: regularCost + input.uncoveredCost,
    saving: regularCost - passCost,
    groupPassTripTotal: (passCost + input.uncoveredCost) * travelers,
    groupRegularTripTotal: (regularCost + input.uncoveredCost) * travelers,
    groupSaving: (regularCost - passCost) * travelers,
    newCards: input.needsCard ? travelers : 0,
    breakEvenJourneys: Math.max(0, Math.ceil((passCost - regularCardCost) / input.averageFare)),
  };
}
export interface BudgetInput {
  days: number;
  nights: number;
  travelers: number;
  rooms: number;
  roomNight: number;
  foodDay: number;
  transportDay: number;
  activitiesDay: number;
  oneOff: number;
  bufferPercent: number;
}
export function calculateBudget(input: BudgetInput) {
  numberInRange(input.days, 1, 90, 'Days');
  numberInRange(input.nights, 0, 90, 'Nights');
  numberInRange(input.travelers, 1, 30, 'Travelers');
  numberInRange(input.rooms, 1, 30, 'Rooms');
  for (const k of ['days', 'nights', 'travelers', 'rooms'] as const)
    if (!Number.isInteger(input[k])) throw new RangeError(`${k} must be a whole number.`);
  for (const k of ['roomNight', 'foodDay', 'transportDay', 'activitiesDay', 'oneOff'] as const)
    numberInRange(input[k], 0, 10000000, k);
  numberInRange(input.bufferPercent, 0, 100, 'Buffer');
  const accommodation = input.nights * input.rooms * input.roomNight;
  const food = input.days * input.travelers * input.foodDay;
  const transport = input.days * input.travelers * input.transportDay;
  const activities = input.days * input.travelers * input.activitiesDay;
  const oneOff = input.travelers * input.oneOff;
  const subtotal = accommodation + food + transport + activities + oneOff;
  const buffer = Math.ceil((subtotal * input.bufferPercent) / 100);
  const total = subtotal + buffer;
  return {
    assumptions: { ...input },
    accommodation,
    food,
    transport,
    activities,
    oneOff,
    subtotal,
    buffer,
    total,
    perPerson: Math.ceil(total / input.travelers),
  };
}
export interface AirportInput {
  terminal: 'T1' | 'T2';
  readyTime: string;
  area: 'central' | 'hongdae' | 'gangnam' | 'other';
  people: number;
  bags: number;
  stepFree: boolean;
}
export function airportOptions(input: AirportInput) {
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(input.readyTime))
    throw new RangeError('Enter a valid ready-to-leave time.');
  numberInRange(input.people, 1, 15, 'Travelers');
  numberInRange(input.bags, 0, 30, 'Large bags');
  const hour = Number(input.readyTime.slice(0, 2));
  const late = hour >= 21 || hour < 6;
  const capacity = input.people > 3 || input.bags > 2;
  const notes: string[] = [
    `Confirm the exact ${input.terminal} stop, boarding point and departure for your travel date.`,
    `Use the hotel’s Korean address and verify the final walk, entrance and late check-in.`,
  ];
  if (late)
    notes.push(
      'This is a timetable-check window, not a claim that all rail services have ended. Verify both airport and onward connections.',
    );
  if (capacity)
    notes.push(
      'Confirm vehicle capacity for the whole party and luggage; one standard taxi may not fit.',
    );
  if (input.stepFree)
    notes.push(
      'Check lifts, platform access, bus boarding and vehicle accessibility directly. A route suggestion does not guarantee step-free access.',
    );
  const options = [
    {
      id: 'rail',
      title:
        input.area === 'hongdae'
          ? 'Check an airport rail connection to Hongik University'
          : 'Check airport rail plus the final connection',
      fit:
        input.area === 'hongdae'
          ? 'Potentially fewer changes for a Hongdae-area base.'
          : 'Useful if the onward station and hotel walk are straightforward.',
      verify: 'Exact service, last departure, onward connection, station exit and lifts.',
    },
    {
      id: 'bus',
      title: 'Check a limousine bus serving your hotel area',
      fit: 'A nearby stop can avoid subway changes and long bag-carrying walks.',
      verify:
        'Terminal-specific route, traffic uncertainty, stop location, last service and luggage rules.',
    },
    {
      id: 'taxi',
      title: capacity ? 'Compare an authorized larger taxi category' : 'Compare an authorized taxi',
      fit:
        late || input.stepFree
          ? 'A possible fallback for difficult timings or the final mile.'
          : 'Useful when the extra cost solves a real luggage or final-mile problem.',
      verify: 'Passenger/bag capacity, tariff, tolls and time-of-night conditions before boarding.',
    },
  ];
  if (late) options.sort((a, b) => Number(b.id === 'taxi') - Number(a.id === 'taxi'));
  else if (input.area === 'gangnam' || input.stepFree)
    options.sort((a, b) => Number(b.id === 'bus') - Number(a.id === 'bus'));
  return { assumptions: { ...input }, late, capacity, options, notes };
}
export function seasonFor(month: number) {
  numberInRange(month, 1, 12, 'Month');
  if ([12, 1, 2].includes(month)) return 'winter';
  if ([6, 7, 8].includes(month)) return 'summer';
  return 'shoulder';
}
export function preparationChecklist(
  month: number,
  needs: { children: boolean; dietary: boolean; accessibility: boolean },
) {
  const season = seasonFor(month);
  const list = [
    {
      id: 'entry',
      group: 'Before departure',
      text: 'Check visa/authorization and arrival-declaration requirements for your passport and date.',
    },
    {
      id: 'hotel',
      group: 'Before departure',
      text: 'Save the hotel’s Korean address, entrance instructions and late check-in contact offline.',
    },
    {
      id: 'arrival',
      group: 'Arrival',
      text: 'Check terminal-specific transport and an independent late-arrival fallback.',
    },
    {
      id: 'payment',
      group: 'Arrival',
      text: 'Prepare an independent second payment method and a connectivity fallback.',
    },
    {
      id: 'booking',
      group: 'Reservations',
      text: 'Confirm actual event dates, ticket identity, cancellation and last admission.',
    },
    {
      id: 'weather',
      group: 'Weather',
      text: 'Check the trip-date forecast near departure; climate averages are not a forecast.',
    },
    {
      id: 'return',
      group: 'Departure',
      text: 'Recheck airport travel, baggage, liquids, tax-refund and destination customs conditions.',
    },
  ];
  if (season === 'winter')
    list.push({
      id: 'winter',
      group: 'Seasonal packing',
      text: 'Pack layers, gloves, a scarf, grippy footwear and room for indoor/outdoor temperature changes.',
    });
  if (season === 'summer')
    list.push({
      id: 'summer',
      group: 'Seasonal packing',
      text: 'Prepare for humidity and rain: breathable layers, rain protection and an indoor alternative.',
    });
  if (season === 'shoulder')
    list.push({
      id: 'shoulder',
      group: 'Seasonal packing',
      text: 'Bring flexible layers for cool mornings/evenings and plan around actual daylight and weather.',
    });
  if (month === 11 || month === 3)
    list.push({
      id: 'cold-shoulder',
      group: 'Seasonal packing',
      text: 'Allow for cold mornings and evenings; the calendar season does not guarantee mild temperatures.',
    });
  if (needs.children)
    list.push({
      id: 'children',
      group: 'Your needs',
      text: 'Confirm room occupancy, child ages, beds, stroller access and the final hotel walk.',
    });
  if (needs.dietary)
    list.push({
      id: 'dietary',
      group: 'Your needs',
      text: 'Prepare precise Korean dietary/allergy phrases and confirm ingredients and cross-contact directly.',
    });
  if (needs.accessibility)
    list.push({
      id: 'accessibility',
      group: 'Your needs',
      text: 'Verify exact entrances, lifts, accessible toilets and assistance booking with operators.',
    });
  return { season, items: list };
}
export const KRW = new Intl.NumberFormat('en', {
  style: 'currency',
  currency: 'KRW',
  maximumFractionDigits: 0,
});
