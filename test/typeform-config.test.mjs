import assert from 'node:assert/strict';
import test from 'node:test';

import {
  FAQ_HOST_FORM,
  FAQ_UPDATES_FORM,
  HERO_ATTEND_FORM,
  HERO_HOST_FORM,
  HOST_A_FEST_FORM,
  NAV_HOST_FORM,
  SPONSOR_FORM,
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
  assert.deepEqual(NAV_HOST_FORM, {
    id: 'JIRQyVOq',
    tracking: campaign('nav-host'),
    hidden: { organizer_interest: 'true' },
  });
  assert.deepEqual(HERO_HOST_FORM, {
    id: 'JIRQyVOq',
    tracking: campaign('hero-host'),
    hidden: { organizer_interest: 'true' },
  });
  assert.deepEqual(HERO_ATTEND_FORM, {
    id: 'JIRQyVOq',
    tracking: campaign('hero-attend'),
    hidden: { organizer_interest: 'false' },
  });
  assert.deepEqual(HOST_A_FEST_FORM, {
    id: 'JIRQyVOq',
    tracking: campaign('get-involved-host'),
    hidden: { organizer_interest: 'true' },
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

test('configures the sponsor popup with its own form', () => {
  assert.deepEqual(SPONSOR_FORM, {
    id: 'kShwvA2e',
    tracking: campaign('get-involved-sponsor'),
  });
});

test('configures the two inline FAQ popups', () => {
  assert.deepEqual(FAQ_HOST_FORM, {
    id: 'JIRQyVOq',
    tracking: campaign('faq-host'),
    hidden: { organizer_interest: 'true' },
  });
  // The PR question is a contributor's, so it presets nothing.
  assert.deepEqual(FAQ_UPDATES_FORM, {
    id: 'JIRQyVOq',
    tracking: campaign('faq-updates'),
  });
});
