import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import StatCard from '../components/mdx/StatCard';
import LocationCard from '../components/mdx/LocationCard';
import { factualRiskTitle, legacyPhoneLink } from '../lib/archive-integrity';
import { compileGuideContent } from '../components/MDXContent';

test('case variants cannot bypass withheld attribution, statistics or fictional-place components', async () => {
  const { content } = await compileGuideContent(`
<expertTip author="Unverified clinician" role="Invented expert" verified={true}>Unsupported clinical advice fixture</expertTip>

<EXPERTTIP name="Another unsupported identity" quote="Fabricated interview fixture" />

<statCard stats={[{value:"99%",label:"Unsupported safety claim"}]} />

<locationCard name="Recovery Center (Example)" address="Unverified address" rating={5} reviewCount={100} />
`);
  const html = renderToStaticMarkup(content);
  assert.doesNotMatch(
    html,
    /Unverified clinician|Unsupported clinical advice|Another unsupported identity|Fabricated interview|99%|Unverified address|experttip|statcard|locationcard/i,
  );
});

test('read-only Markdown tasks have their actual task text as an accessible name', async () => {
  const { content } = await compileGuideContent(
    '- [ ] Save the branch address\n- [x] Keep a receipt',
  );
  const html = renderToStaticMarkup(content);
  assert.match(html, /aria-label="Save the branch address \(read-only checklist\)"/);
  assert.match(html, /aria-label="Keep a receipt \(read-only checklist\)"/);
  assert.match(html, /disabled/);
});

test('archive display labels cannot re-publish unverified statistics or business ratings', () => {
  assert.equal(
    renderToStaticMarkup(
      React.createElement(StatCard, {
        source: 'Unsupported Institute2026',
        asOf: '2026',
        stats: [{ value: '99%', label: 'Safety' }],
      }),
    ),
    '',
  );
  const realNamed = renderToStaticMarkup(
    React.createElement(LocationCard, {
      name: 'A place',
      address: 'Address text',
      rating: 4.9,
      reviewCount: 300,
      phone: '+82-2-1234-5678',
    }),
  );
  assert.doesNotMatch(realNamed, /AggregateRating|LocalBusiness|ratingValue|ratingCount|tel:/);
  assert.match(realNamed, /Address text/);
  assert.equal(
    renderToStaticMarkup(
      React.createElement(LocationCard, {
        name: 'Recovery Center (Example)',
        address: 'Unverified example address',
        phone: '+82-2-555-0000',
      }),
    ),
    '',
  );
});
test('non-phone instructions and placeholders are not dialable, and tax risk does not flag taxis', () => {
  for (const value of ['N/A', 'check official website', '+82-2-1234-5678', '+82-2-555-1234'])
    assert.equal(legacyPhoneLink(value), null);
  assert.equal(legacyPhoneLink('+82-2-2077-9000'), '+82220779000');
  assert.equal(factualRiskTitle('How to book taxis in Seoul'), false);
  assert.equal(factualRiskTitle('Korea tax refunds'), true);
  assert.equal(factualRiskTitle('Visa status changes'), true);
});
