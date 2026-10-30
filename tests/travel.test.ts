import test from 'node:test';
import assert from 'node:assert/strict';
import {
  comparePass,
  calculateBudget,
  airportOptions,
  preparationChecklist,
} from '../lib/travel-tools';
import { assessRetirement, type RetirementEvidence } from '../lib/retirement';
import { internalGuideLinks } from '../lib/content-links';
test('link audit distinguishes relative guide links from another site’s blog path', () => {
  assert.deepEqual(
    internalGuideLinks(
      '[one](/blog/good-guide#section) [external](https://example.com/blog/missing-guide) <a href="https://koreaexperience.com/blog/another-guide">next</a>',
    ),
    ['good-guide', 'another-guide'],
  );
});
test('pass comparison rounds to an available service-day product and adds the new card exactly once', () => {
  const r = comparePass({
    days: 4,
    journeys: 12,
    averageFare: 1550,
    needsCard: true,
    uncoveredCost: 9000,
  });
  assert.equal(r.pass.days, 5);
  assert.equal(r.passCost, 18000);
  assert.equal(r.passTripTotal, 27000);
  assert.equal(r.regularTripTotal, 27600);
  assert.equal(r.saving, 600);
  assert.equal(r.breakEvenJourneys, 12);
  assert.throws(() =>
    comparePass({ days: 8, journeys: 1, averageFare: 1, needsCard: false, uncoveredCost: 0 }),
  );
});
test('budget separates room nights from people days and rounds contingency upward', () => {
  const r = calculateBudget({
    days: 7,
    nights: 6,
    travelers: 2,
    rooms: 1,
    roomNight: 120000,
    foodDay: 35000,
    transportDay: 10000,
    activitiesDay: 20000,
    oneOff: 100000,
    bufferPercent: 15,
  });
  assert.equal(r.accommodation, 720000);
  assert.equal(r.food, 490000);
  assert.equal(r.subtotal, 1830000);
  assert.equal(r.total, 2104500);
  assert.equal(r.perPerson, 1052250);
  assert.throws(() => calculateBudget({ days: NaN } as any));
});
test('late airport planning prioritizes a fallback without asserting a service has ended', () => {
  const r = airportOptions({
    terminal: 'T2',
    readyTime: '23:10',
    area: 'hongdae',
    people: 4,
    bags: 4,
    stepFree: true,
  });
  assert.equal(r.options[0].id, 'taxi');
  assert.equal(r.capacity, true);
  assert.match(r.notes.join(' '), /not a claim/);
  assert.match(r.notes.join(' '), /does not guarantee/);
});
test('month and accessibility conditions add relevant checklist tasks', () => {
  const r = preparationChecklist(12, { children: true, dietary: false, accessibility: true });
  assert.equal(r.season, 'winter');
  assert.ok(r.items.some((x) => x.id === 'winter'));
  assert.ok(r.items.some((x) => x.id === 'accessibility'));
  assert.ok(!r.items.some((x) => x.id === 'dietary'));
});
const unindexed: RetirementEvidence = {
  ageDays: 130,
  indexed: false,
  intentionalNoindex: false,
  seasonalValue: false,
  technicalIssue: false,
  recentClicks: 0,
  saves: 0,
  backlinks: 0,
  journeyRole: false,
  useful: true,
};
test('unknown evidence protects content; a useful guide gets one improvement cycle', () => {
  assert.equal(assessRetirement({ ...unindexed, backlinks: null }).action, 'hold');
  assert.equal(assessRetirement(unindexed).action, 'improve');
  assert.equal(assessRetirement({ ...unindexed, improvedAtDaysAgo: 15 }).action, 'observe');
  assert.equal(assessRetirement({ ...unindexed, improvedAtDaysAgo: 29 }).action, 'retire');
  assert.equal(assessRetirement({ ...unindexed, seasonalValue: true }).action, 'keep');
  assert.equal(assessRetirement({ ...unindexed, duplicateTarget: 'equivalent' }).action, 'merge');
});
