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

test('each verb holds exactly the agreed destinations', () => {
  const groups = Object.fromEntries(
    navGroups(NAV).map((group) => [
      group.label,
      group.items.map((item) => item.label),
    ]),
  );
  assert.deepEqual(groups, {
    'Attend online': ['Overview', 'Schedule', 'Activities'],
    'Attend in-person': ['Overview', 'Find a Fest', 'Host a Fest'],
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

/* Each dropdown link carries one line under its label so the panel says
   what the page is, not only what it is called. Sentence case, a full
   stop, and none of the house's refused punctuation. */
test('every destination carries a one-line description', () => {
  for (const group of navGroups(NAV)) {
    assert.ok(group.accent, `${group.label} has no accent`);
    for (const item of group.items) {
      assert.equal(typeof item.description, 'string', `${item.label}`);
      assert.match(item.description, /^[A-Z].*\.$/, `${item.label}`);
      assert.doesNotMatch(item.description, /—/, `${item.label}: em dash`);
      assert.ok(item.description.length <= 60, `${item.label}: too long`);
    }
  }
});
