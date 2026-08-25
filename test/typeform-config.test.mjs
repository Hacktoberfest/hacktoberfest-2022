import assert from 'node:assert/strict';
import test from 'node:test';

import {
  FAQ_UPDATES_FORM,
  HERO_ATTEND_FORM,
  SPONSOR_HERO_FORM,
  SPONSOR_PARTNERSHIP_FORM,
  WAYS_IN_PERSON_FORM,
  WAYS_ONLINE_FORM,
} from '../src/data/typeforms.mjs';

const campaign = (content) => ({
  utm_source: 'hacktoberfest.com',
  utm_medium: 'website',
  utm_campaign: 'hacktoberfest-2026',
  utm_content: content,
});

test('configures every interest popup with placement attribution', () => {
  // 'nav-host' retired with the nav popup — the header CTA links to /host/
  // now. 'host-apply' retired too: that CTA is an internal link to /my
  // now, asserted in host-page.test.mjs. 'hero-host', 'faq-host' and
  // 'get-involved-host' went the same way when applications opened — all
  // three link to /host/ now, asserted in typeform-pages.test.mjs. What
  // is left presets organizer_interest false or nothing at all: no host
  // ask on the site opens a form any more.
  assert.deepEqual(HERO_ATTEND_FORM, {
    id: 'JIRQyVOq',
    tracking: campaign('hero-attend'),
    hidden: { organizer_interest: 'false' },
  });
  assert.deepEqual(WAYS_IN_PERSON_FORM, {
    id: 'JIRQyVOq',
    tracking: campaign('ways-in-person'),
    hidden: { organizer_interest: 'false' },
  });
  assert.deepEqual(WAYS_ONLINE_FORM, {
    id: 'JIRQyVOq',
    tracking: campaign('ways-online'),
    hidden: { organizer_interest: 'false' },
  });
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

test('configures the inline FAQ popup', () => {
  // The PR question is a contributor's, so it presets nothing.
  assert.deepEqual(FAQ_UPDATES_FORM, {
    id: 'JIRQyVOq',
    tracking: campaign('faq-updates'),
  });
});
