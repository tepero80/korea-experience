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
import { PLACES, placesFor } from '../lib/editorial';
import { getPostBySlug, getRelatedPosts } from '../lib/posts';
import { generatedArchiveCoverHash } from '../lib/media';
import { guidePreviewImage, guideSchema } from '../lib/seo';

test('identified archive illustrations are not used as article preview photographs', () => {
  const slug = '24-hours-in-seongsu-dong-luxury-dior-pop-up-vs-5-market-food-a-dualism-route';
  const archive = getPostBySlug(slug)!;
  assert.ok(generatedArchiveCoverHash(archive.slug, archive.image));
  assert.equal(guidePreviewImage(archive), '/images/cards/korea-experience.jpg');
  assert.equal(guideSchema(archive).image, undefined);

  const verified = getPostBySlug('incheon-winter-flight-disruption-checklist')!;
  assert.equal(generatedArchiveCoverHash(verified.slug, verified.image), undefined);
  assert.equal(guidePreviewImage(verified), `/images/cards/${verified.slug}.jpg`);
  assert.ok(guideSchema(verified).image?.endsWith(verified.image!));
  assert.equal(generatedArchiveCoverHash(slug, verified.image), undefined);
});

test('automatic next steps do not jump between unrelated destination guides', () => {
  const related = getRelatedPosts('namhae-sangju-silver-sand-beach-walk');
  assert.ok(related.some((post) => post.editorial?.regions.includes('namhae')));
  assert.ok(!related.some((post) => post.slug === 'dadaepo-beach-from-busan-metro'));
  assert.ok(!related.some((post) => post.slug === 'seoul-grand-park-zoo-sky-lift-elephant-train'));
});

test('an automatic recommendation cannot infer a trip across a province from a city guide', () => {
  const related = getRelatedPosts('wonju-history-museum-visit');
  assert.ok(related.some((post) => post.editorial?.regions.includes('wonju')));
  assert.ok(!related.some((post) => post.slug === 'jeongdongjin-2027-new-year-sunrise-festival-plan'));
});

test('an explicit onward journey keeps its recommendation across different regions', () => {
  const related = getRelatedPosts('gwangju-airport-to-songjeong-station');
  assert.ok(related.some((post) => post.slug === 'ktx-seat-and-luggage-guide-for-international-travelers'));
});

test('automatic recommendations need a specific shared interest', () => {
  const laundry = getRelatedPosts('247-coin-laundromats-guide-2026');
  assert.ok(!laundry.some((post) => post.slug === '24-hour-english-pharmacies-in-seoul-2026'));
  const water = getRelatedPosts('finding-seoul-outdoor-drinking-water-fountains-arisu-map');
  assert.equal(water[0]?.slug, 'finding-public-restrooms-in-korea-station-mall-and-accessible-facilities');
  assert.ok(!water.some((post) => post.slug === '24-hour-english-pharmacies-in-seoul-2026'));
});

test('separate-ticket transfer guidance follows an Incheon terminal check', () => {
  const slug = 'incheon-separate-ticket-connections';
  assert.ok(getRelatedPosts('incheon-terminal-flight-check').some((post) => post.slug === slug));
  assert.ok(!getRelatedPosts('dongdaegu-station-to-central-daegu').some((post) => post.slug === slug));
  assert.ok(!getRelatedPosts('yeosu-expo-station-to-odongdo').some((post) => post.slug === slug));
});

test('guide maps keep itinerary order while ignoring unavailable and repeated places', () => {
  const first = PLACES[0].id;
  const second = PLACES[1].id;
  assert.deepEqual(
    placesFor([second, 'unavailable-place-fixture', first, second]).map((place) => place.id),
    [second, first],
  );
});

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
