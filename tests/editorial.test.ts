import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import FAQAccordion from '../components/mdx/FAQAccordion';
import ExpertTip from '../components/mdx/ExpertTip';
import { renderInlineMarkdown } from '../components/mdx/utils';
import { comparePass } from '../lib/travel-tools';
import {
  passShareUrl,
  readPassShare,
  budgetShareUrl,
  readBudgetShare,
  checklistShareUrl,
  readChecklistShare,
  airportShareUrl,
  readAirportShare,
  rainShareUrl,
  readRainShare,
} from '../lib/tool-share';
import { compileGuideContent } from '../components/MDXContent';

test('an archive verified flag cannot publish an unsupported expert identity or quotation', () => {
  assert.equal(
    renderToStaticMarkup(
      React.createElement(ExpertTip, {
        name: 'Unverified Expert Fixture',
        quote: 'Unsupported advice fixture',
        verified: true,
      }),
    ),
    '',
  );
});

test('FAQ string links render as usable anchors in both variants, including long answers', () => {
  for (const variant of ['default', 'minimal'] as const) {
    const html = renderToStaticMarkup(
      React.createElement(FAQAccordion, {
        variant,
        defaultOpen: 0,
        items: [
          {
            question: 'Who can help?',
            answer:
              'Contact a [licensed coordinator](/blog/licensed-medical-coordinator-guide-2026). ' +
              'Details. '.repeat(150),
          },
        ],
      }),
    );
    assert.match(html, /href="\/blog\/licensed-medical-coordinator-guide-2026"/);
    assert.doesNotMatch(html, /\[licensed coordinator\]/);
    assert.doesNotMatch(html, /max-h-96/);
  }
});

test('inline content does not turn executable or protocol-relative URLs into links', () => {
  const html = renderToStaticMarkup(
    React.createElement(
      'p',
      null,
      renderInlineMarkdown(
        '[bad](javascript:alert) [other](//untrusted.example) [safe](https://example.com/)',
      ),
    ),
  );
  assert.doesNotMatch(html, /href="(?:javascript:|\/\/)/);
  assert.match(html, /href="https:\/\/example.com\/"/);
});

test('family transit totals count one pass/card per traveler and never pool journeys', () => {
  const r = comparePass({
    days: 3,
    journeys: 8,
    averageFare: 1550,
    needsCard: true,
    uncoveredCost: 0,
    travelers: 3,
  });
  assert.equal(r.saving, -600);
  assert.equal(r.groupSaving, -1800);
  assert.equal(r.groupPassTripTotal, 39000);
  assert.equal(r.groupRegularTripTotal, 37200);
  assert.equal(r.newCards, 3);
  const withCard = comparePass({
    days: 3,
    journeys: 8,
    averageFare: 1550,
    needsCard: true,
    uncoveredCost: 0,
    travelers: 3,
    regularCardCost: 4000,
  });
  assert.equal(withCard.groupRegularTripTotal, 49200);
  assert.equal(withCard.groupSaving, 10200);
  assert.equal(withCard.breakEvenJourneys, 6);
  assert.throws(() =>
    comparePass({
      days: 3,
      journeys: 8,
      averageFare: 1550,
      needsCard: true,
      uncoveredCost: 0,
      travelers: 1.5,
    }),
  );
});

test('calculator links reproduce validated numbers and omit unrelated private fields', () => {
  const input = {
    days: 3,
    journeys: 8,
    averageFare: 1550,
    needsCard: true,
    uncoveredCost: 8000,
    travelers: 3,
    regularCardCost: 0,
    note: 'private booking',
    email: 'private@example.com',
  };
  const u = new URL(passShareUrl(input));
  assert.ok(!u.href.includes('private'));
  const reopened = readPassShare(u.search)!;
  assert.equal(comparePass(reopened).groupPassTripTotal, 63000);
  assert.equal(comparePass(reopened).groupSaving, -1800);
  assert.throws(() => readPassShare('?v=1&days=3'));
  assert.throws(() => readPassShare(u.search.replace('travelers=3', 'travelers=Infinity')));
  assert.equal(readPassShare('?utm_source=share'), null);
  const budget = {
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
  };
  assert.deepEqual(readBudgetShare(new URL(budgetShareUrl(budget)).search), budget);
  const checklist = {
    month: 12,
    children: true,
    dietary: false,
    accessibility: true,
    done: ['entry'],
    note: 'private',
  };
  const arrival = {
    terminal: 'T2' as const,
    readyTime: '00:30',
    area: 'hongdae' as const,
    people: 4,
    bags: 3,
    stepFree: true,
  };
  const arrivalUrl = new URL(airportShareUrl(arrival));
  assert.deepEqual(readAirportShare(arrivalUrl.search), arrival);
  assert.throws(() => readAirportShare(arrivalUrl.search.replace('people=4', 'people=1.5')));
  assert.throws(() =>
    readAirportShare(arrivalUrl.search.replace('terminal=T2', 'terminal=unknown')),
  );
  const rain = { region: 'other' as const, interest: 'market' as const };
  assert.deepEqual(readRainShare(new URL(rainShareUrl(rain)).search), rain);
  assert.throws(() => readRainShare('?v=1&region=unknown&interest=museum'));
  const sharedChecklist = new URL(checklistShareUrl(checklist));
  assert.ok(!sharedChecklist.href.includes('private'));
  assert.ok(!sharedChecklist.href.includes('entry'));
  assert.deepEqual(readChecklistShare(sharedChecklist.search), {
    month: 12,
    children: true,
    dietary: false,
    accessibility: true,
  });
  assert.throws(() => readChecklistShare(sharedChecklist.search.replace('month=12', 'month=1.5')));
  assert.throws(() =>
    readChecklistShare(sharedChecklist.search.replace('children=true', 'children=maybe')),
  );
});

test('contents links use the actual MDX IDs for duplicate and formatted headings', async () => {
  const guide = await compileGuideContent(
    '## Arrival **choices**\n\nText.\n\n### Arrival choices\n\n## Arrival choices\n\n## A [useful link](https://example.com/) & `code`\n\nEnd.',
  );
  assert.deepEqual(
    guide.headings.map((h) => h.id),
    ['arrival-choices', 'arrival-choices-2', 'a-useful-link--code'],
  );
  assert.equal(guide.headings[0].text, 'Arrival choices');
  const html = renderToStaticMarkup(guide.content);
  for (const heading of guide.headings) assert.ok(html.includes(`id="${heading.id}"`));
});
