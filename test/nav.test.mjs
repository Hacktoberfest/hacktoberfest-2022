import assert from 'node:assert/strict';
import test from 'node:test';

import { routeIsClosed } from '../src/data/closedRoutes.mjs';
import { NAV, navGroups, navRoutes } from '../src/data/nav.mjs';
import { SITE_PAGES } from '../src/build/sitemap.mjs';

test('the nav is Home, two verbs, and FAQs, in that order', () => {
  assert.deepEqual(
    NAV.map((entry) => entry.label),
    ['Home', 'Attend online', 'Attend in-person', 'FAQs'],
  );
});

test('each verb holds exactly the two agreed destinations', () => {
  const groups = Object.fromEntries(
    navGroups(NAV).map((group) => [
      group.label,
      group.items.map((item) => item.label),
    ]),
  );
  assert.deepEqual(groups, {
    'Attend online': ['Schedule', 'Activities'],
    'Attend in-person': ['Find a Fest', 'Host a Fest'],
  });
});

test('every destination is a page the site exports and has not closed', () => {
  for (const href of navRoutes(NAV)) {
    assert.ok(
      SITE_PAGES.includes(href),
      `${href} is not in SITE_PAGES (src/build/sitemap.mjs)`,
    );
    assert.equal(
      routeIsClosed(href),
      false,
      `${href} is closed in data/closedRoutes.mjs; a nav must not point at a 404`,
    );
  }
});

test('labels are sentence case', () => {
  const labels = [
    ...NAV.map((entry) => entry.label),
    ...navGroups(NAV).flatMap((group) => group.items.map((item) => item.label)),
  ];
  for (const label of labels) {
    // First word capitalised; the rest may be lower or a proper noun (Fest,
    // FAQs), so only shout-case is refused.
    assert.notEqual(label, label.toUpperCase(), `${label} is all caps`);
    assert.match(label, /^[A-Z]/, `${label} does not start with a capital`);
  }
});
