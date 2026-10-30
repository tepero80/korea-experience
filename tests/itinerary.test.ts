import test from 'node:test';
import assert from 'node:assert/strict';
import {
  normalizePlan,
  publicPlanData,
  accountPlanData,
  emptyPlan,
  writeLocalPlan,
  readLocalPlan,
  ITINERARY_KEY,
  dateForDay,
  timingWarnings,
  validTripDate,
} from '../lib/itinerary';

const stops = [
  {
    id: 'b',
    day: 2,
    time: '11:00',
    place: 'Museum',
    address: 'Private hotel address',
    note: 'Secret booking',
  },
  {
    id: 'a',
    day: 1,
    time: '10:00',
    place: 'Palace',
    address: 'Public address',
    note: 'Personal reminder',
  },
];
test('all published v1 plan shapes migrate without dropping stops or notes, and v2 retains edited order', () => {
  for (const v of [stops, { version: 1, items: stops }, { items: stops }])
    assert.deepEqual(
      normalizePlan(v).items.map((s) => s.id),
      ['a', 'b'],
    );
  const notes = normalizePlan({ notes: 'My old private notes' });
  assert.equal(notes.notes, 'My old private notes');
  assert.equal(notes.items.length, 0);
  const plan = normalizePlan(stops);
  plan.items.reverse();
  assert.equal(normalizePlan(plan).items[0].id, 'b');
  assert.throws(() => normalizePlan({ version: 3, items: stops }), /unsupported/);
  assert.throws(() => normalizePlan({ items: [...stops, stops[0]] }), /unique/);
});
test('public plan snapshots omit private notes, exact addresses, dates and internal IDs by default', () => {
  const plan = normalizePlan(stops);
  plan.notes = 'My passport note';
  plan.startDate = '2026-11-02';
  plan.items[0].sourceGuideId = 'private-source';
  const shared = publicPlanData(plan, {
    includeNotes: false,
    includeAddresses: false,
    includeDates: false,
  });
  const json = JSON.stringify(shared);
  assert.doesNotMatch(
    json,
    /Secret|booking|Personal|passport|Private hotel|Public address|private-source|2026-11-02/,
  );
  const selected = publicPlanData(plan, {
    includeNotes: true,
    includeAddresses: true,
    includeDates: true,
  });
  assert.equal(selected.notes, plan.notes);
  assert.equal(selected.startDate, plan.startDate);
  plan.items[0].place = 'Later private edit';
  assert.notEqual(shared.items[0].place, plan.items[0].place);
});
test('local migration preserves the v1 backup and refuses to clobber an unknown version', () => {
  const values = new Map([['ke-itinerary-v1', JSON.stringify(stops)]]);
  const store = {
    getItem: (key: string) => values.get(key) || null,
    setItem: (key: string, value: string) => {
      values.set(key, value);
    },
  };
  const plan = readLocalPlan(store);
  writeLocalPlan(store, plan);
  assert.ok(values.has('ke-itinerary-v1'));
  assert.equal(readLocalPlan(store).items.length, 2);
  values.set(ITINERARY_KEY, JSON.stringify({ version: 3, plan }));
  assert.throws(() => writeLocalPlan(store, emptyPlan()));
  assert.match(values.get(ITINERARY_KEY)!, /"version":3/);
});
test('calendar dates, manual timing conflicts and UTF-8 account limits are checked without truncation', () => {
  assert.equal(validTripDate('2026-02-29'), false);
  assert.equal(validTripDate('2028-02-29'), true);
  assert.equal(dateForDay('2026-12-31', 2), '2027-01-01');
  const plan = normalizePlan(stops);
  plan.items[1].day = 1;
  plan.items[1].time = '10:30';
  plan.items[0].durationMinutes = 60;
  plan.items[0].travelBufferMinutes = 20;
  assert.equal(timingWarnings(plan).length, 1);
  plan.notes = '한'.repeat(5000);
  assert.throws(() => accountPlanData(plan), /12,000-byte/);
  assert.equal(plan.notes.length, 5000);
});
