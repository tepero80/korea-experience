import { calculateBudget, comparePass, type BudgetInput, type PassInput } from './travel-tools';
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
function url(slug: string, values: Record<string, number | boolean>, keys: readonly string[]) {
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
