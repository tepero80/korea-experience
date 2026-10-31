import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import StatCard from '../components/mdx/StatCard';
import LocationCard from '../components/mdx/LocationCard';
import { factualRiskTitle, legacyPhoneLink } from '../lib/archive-integrity';

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
