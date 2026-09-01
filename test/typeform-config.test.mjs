import assert from 'node:assert/strict';
import test from 'node:test';

import * as typeforms from '../src/data/typeforms.mjs';

const { SPONSOR_HERO_FORM, SPONSOR_PARTNERSHIP_FORM, WAYS_ONLINE_FORM } =
  typeforms;

const campaign = (content) => ({
  utm_source: 'hacktoberfest.com',
  utm_medium: 'website',
  utm_campaign: 'hacktoberfest-2026',
  utm_content: content,
});

test('configures the one surviving interest popup with placement attribution', () => {
  // Every host ask left this form long ago — 'nav-host', 'host-apply',
  // 'hero-host', 'faq-host' and 'get-involved-host' are all links now.
  // The attendee asks followed when the Fests directory opened:
  // 'hero-attend', 'faq-updates' and 'ways-in-person' go to /fests/,
  // asserted in typeform-pages.test.mjs. The online card is the last
  // placement standing, because the online event has no page to link at.
  assert.deepEqual(WAYS_ONLINE_FORM, {
    id: 'JIRQyVOq',
    tracking: campaign('ways-online'),
    hidden: { organizer_interest: 'false' },
  });
});

/* The retired configs, pinned as absent. Deleting a placement is the whole
   point of the change; a config quietly reappearing would put an interest
   form back in front of people the directory can already answer. */
test('exports no attendee interest popup', () => {
  ['HERO_ATTEND_FORM', 'FAQ_UPDATES_FORM', 'WAYS_IN_PERSON_FORM'].forEach(
    (name) =>
      assert.equal(
        typeforms[name],
        undefined,
        `${name} is retired: the attendee ask links to /fests/ now`,
      ),
  );
});

test('configures the sponsor popups with their own form and placements', () => {
  /* 'get-involved-sponsor' retired when the Get Involved card became a
     link to /sponsor/ — the conversation now starts on the sponsor page,
     which carries the form in two placements of its own. */
  assert.deepEqual(SPONSOR_HERO_FORM, {
    id: 'kShwvA2e',
    tracking: campaign('sponsor-hero-info'),
  });
  assert.deepEqual(SPONSOR_PARTNERSHIP_FORM, {
    id: 'kShwvA2e',
    tracking: campaign('sponsor-partnership-info'),
  });
});
