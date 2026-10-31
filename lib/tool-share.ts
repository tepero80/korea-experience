import {
  calculateBudget,
  comparePass,
  preparationChecklist,
  type BudgetInput,
  type PassInput,
  type AirportInput,
  airportOptions,
} from './travel-tools';
const passKeys = [
  'days',
  'journeys',
  'averageFare',
  'needsCard',
  'uncoveredCost',
  'travelers',
  'regularCardCost',
] as const;
const budgetKeys = [
  'days',
  'nights',
  'travelers',
  'rooms',
  'roomNight',
  'foodDay',
  'transportDay',
  'activitiesDay',
  'oneOff',
  'bufferPercent',
] as const;
const base = 'https://koreaexperience.com/tools/';
function url(
  slug: string,
  values: Record<string, number | boolean | string>,
  keys: readonly string[],
) {
  const params = new URLSearchParams({ v: '1' });
  for (const key of keys) params.set(key, String(values[key]));
  return base + slug + '?' + params.toString();
}
export function passShareUrl(input: PassInput) {
  const checked = comparePass(input).assumptions;
  return url('transit-pass', checked, passKeys);
}
export function budgetShareUrl(input: BudgetInput) {
  calculateBudget(input);
  return url('trip-budget', { ...input }, budgetKeys);
}
function query(search: string, keys: readonly string[]) {
  const p = new URLSearchParams(search);
  if (!p.has('v')) return null;
  if (p.get('v') !== '1' || keys.some((k) => !p.has(k) || p.get(k) === ''))
    throw Error('Shared inputs are incomplete or from an unsupported version.');
  return p;
}
export function readPassShare(search: string): PassInput | null {
  const p = query(search, passKeys);
  if (!p) return null;
  if (!['true', 'false'].includes(p.get('needsCard')!)) throw Error('Invalid card condition.');
  const input: PassInput = {
    days: Number(p.get('days')),
    journeys: Number(p.get('journeys')),
    averageFare: Number(p.get('averageFare')),
    needsCard: p.get('needsCard') === 'true',
    uncoveredCost: Number(p.get('uncoveredCost')),
    travelers: Number(p.get('travelers')),
    regularCardCost: Number(p.get('regularCardCost')),
  };
  comparePass(input);
  return input;
}
export function readBudgetShare(search: string): BudgetInput | null {
  const p = query(search, budgetKeys);
  if (!p) return null;
  const input = Object.fromEntries(
    budgetKeys.map((k) => [k, Number(p.get(k))]),
  ) as unknown as BudgetInput;
  calculateBudget(input);
  return input;
}
export interface ChecklistInput {
  month: number;
  children: boolean;
  dietary: boolean;
  accessibility: boolean;
}
const checklistKeys = ['month', 'children', 'dietary', 'accessibility'] as const;
export function checklistShareUrl(input: ChecklistInput) {
  preparationChecklist(input.month, input);
  if (!Number.isInteger(input.month)) throw Error('Visit month must be a whole number.');
  return url('packing-checklist', { ...input }, checklistKeys);
}
export function readChecklistShare(search: string): ChecklistInput | null {
  const p = query(search, checklistKeys);
  if (!p) return null;
  if (!checklistKeys.slice(1).every((key) => ['true', 'false'].includes(p.get(key)!)))
    throw Error('Invalid checklist condition.');
  const input = {
    month: Number(p.get('month')),
    children: p.get('children') === 'true',
    dietary: p.get('dietary') === 'true',
    accessibility: p.get('accessibility') === 'true',
  };
  checklistShareUrl(input);
  return input;
}
const airportKeys = ['terminal', 'readyTime', 'area', 'people', 'bags', 'stepFree'] as const;
export function airportShareUrl(input: AirportInput) {
  airportOptions(input);
  return url('airport-transfer', { ...input }, airportKeys);
}
export function readAirportShare(search: string): AirportInput | null {
  const p = query(search, airportKeys);
  if (!p) return null;
  if (
    !['T1', 'T2'].includes(p.get('terminal')!) ||
    !['central', 'hongdae', 'gangnam', 'other'].includes(p.get('area')!) ||
    !['true', 'false'].includes(p.get('stepFree')!)
  )
    throw Error('Invalid shared arrival conditions.');
  const input: AirportInput = {
    terminal: p.get('terminal') as AirportInput['terminal'],
    readyTime: p.get('readyTime')!,
    area: p.get('area') as AirportInput['area'],
    people: Number(p.get('people')),
    bags: Number(p.get('bags')),
    stepFree: p.get('stepFree') === 'true',
  };
  airportOptions(input);
  return input;
}
export interface RainInput {
  region: 'central' | 'other';
  interest: 'museum' | 'market';
}
const rainKeys = ['region', 'interest'] as const;
export function rainShareUrl(input: RainInput) {
  if (
    !['central', 'other'].includes(input.region) ||
    !['museum', 'market'].includes(input.interest)
  )
    throw Error('Invalid shared weather plan.');
  return url('rainy-day', { ...input }, rainKeys);
}
export function readRainShare(search: string): RainInput | null {
  const p = query(search, rainKeys);
  if (!p) return null;
  const input = { region: p.get('region'), interest: p.get('interest') } as RainInput;
  rainShareUrl(input);
  return input;
}
