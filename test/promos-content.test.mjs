import assert from 'node:assert/strict';
import test from 'node:test';

import { my } from '../src/data/content.mjs';
import { MLH_DISCORD_URL } from '../src/data/links.js';

const copy = my.promos;

const strings = [
  copy.title,
  copy.eyebrow,
  copy.heading.lead,
  copy.heading.accent,
  copy.intro,
  copy.back,
  copy.count.none,
  copy.count.one,
  copy.count.many(3),
  copy.claimCta,
  copy.claiming,
  copy.claimFailed,
  copy.claimUnavailable,
  copy.challenge.dev,
  copy.challenge.other,
  ...Object.values(copy.requirements).flatMap(Object.values),
  copy.checkRequirement,
  copy.more.title,
  copy.more.body,
  copy.empty.title,
  copy.empty.body,
  copy.empty.cta,
  copy.error.title,
  copy.error.body,
  copy.error.cta,
];

test('every promos string is present', () => {
  strings.forEach((value) => {
    assert.equal(typeof value, 'string');
    assert.ok(value.trim().length > 0);
  });
});

test('the page is titled like the other /my pages', () => {
  assert.match(copy.title, /\| Hacktoberfest 2026$/);
  assert.match(copy.title, /^Codes and offers /);
});

test('the intro says what the codes and offers are for', () => {
  assert.equal(
    copy.intro,
    'Tools to help you build with open-source and open-weight models throughout Hacktoberfest.',
  );
});

test('the heading reads "Your Hacktoberfest codes and offers."', () => {
  assert.deepEqual(copy.heading, {
    lead: 'Your Hacktoberfest',
    accent: 'codes and offers.',
  });
});

test('the back link returns to the attending hub', () => {
  assert.equal(copy.backHref, '/my/');
  assert.match(copy.back, /My Hacktoberfest/);
});

test('the empty state sends people to find a Fest', () => {
  assert.equal(copy.empty.href, '/fests/');
});

test('the empty state says codes are still coming, and what unlocks more', () => {
  assert.equal(copy.empty.title, 'We don’t have any codes for you yet.');
  assert.equal(
    copy.empty.body,
    'We’ll be adding codes throughout Hacktoberfest. Attending an in-person Fest unlocks additional codes.',
  );
});

test('the count reads naturally for one code and for several', () => {
  assert.equal(copy.count.one, 'Your code');
  assert.equal(copy.count.many(2), '2 codes');
});

test('a DEV challenge link says it is on DEV', () => {
  assert.notEqual(copy.challenge.dev, copy.challenge.other);
  assert.match(copy.challenge.dev, /DEV/);
});

test('a native challenge link says it runs at the Hack Day', () => {
  assert.equal(copy.challenge.other, 'Challenge at your Hack Day:');
});

/* Sponsors keep adding pools through October, so the list says more are
   coming rather than reading as final. */
test('the list says more codes and offers are coming', () => {
  assert.equal(copy.more.title, 'More codes and offers are on the way!');
  assert.equal(
    copy.more.body,
    'Keep checking back here throughout Hacktoberfest for new offers to redeem.',
  );
});

test('the copy says hosts, never organizers, and carries no em dashes', () => {
  strings.forEach((value) => {
    assert.doesNotMatch(value, /organi[sz]er/i, value);
    assert.doesNotMatch(value, /—/, value);
  });
});

/* /my's error copy speaks for the whole Hacktoberfest ("your stickers are
   safe"). A promos page that failed to load has no progress to reassure
   anyone about. */
test('the error state speaks for this page', () => {
  assert.ok(copy.error, 'my.promos.error is missing');
  assert.notEqual(copy.error.title, my.error.title);
  assert.doesNotMatch(copy.error.body, /progress/i);
  assert.match(copy.error.cta, /try again/i);
});

test('a stale offer does not ask for a retry', () => {
  assert.notEqual(copy.claimUnavailable, copy.claimFailed);
  assert.doesNotMatch(copy.claimUnavailable, /try again/i);
});

/* A code's row names a missing step and says where to do it; a done step
   shows nothing, so each kind needs only what it needs and how to act. */
test('every account requirement says what it needs on MyMLH and how to act', () => {
  assert.deepEqual(Object.keys(copy.requirements), [
    'verified_phone',
    'github_oauth',
    'checked_in',
  ]);
  [copy.requirements.verified_phone, copy.requirements.github_oauth].forEach(
    (kind) => {
      assert.deepEqual(Object.keys(kind), ['needs', 'act']);
      assert.match(kind.needs, /^Needs .* on MyMLH\.$/);
    },
  );
});

/* A check-in happens at the Fest, not on MyMLH, so it has nothing to act on. */
test('the check-in requirement says only what unlocks the code', () => {
  assert.deepEqual(copy.requirements.checked_in, {
    needs: 'Unlocks once you check in at your Fest.',
  });
});

/* The band at the foot of /my that leads here: /my's heading grammar
   ("Your Fests.", "Your rewards."), and two cards, this page's and MLH's
   Community Discord's, each a chip, a title, a line and a button. */
test('the /my resources band leads here and to the Discord', () => {
  const band = my.resourcesBand;

  assert.deepEqual(band.heading, { lead: 'Your', accent: 'resources.' });
  assert.equal(
    band.lede,
    'Credits for your projects, and people to build them with.',
  );
  assert.equal(band.promos.href, '/my/promos/');
  assert.equal(band.promos.title, 'Perks from Hacktoberfest’s sponsors.');
  assert.equal(
    band.promos.body,
    'The companies supporting Hacktoberfest are giving out credits for your projects. New offers are added all month.',
  );
  assert.equal(band.discord.title, 'Join MLH’s Community Discord.');
  assert.equal(band.discord.cta, 'Join the Discord');
  /* Untagged, like the host resources invite: utm params on an invite
     link are attribution noise. */
  assert.equal(MLH_DISCORD_URL, 'https://discord.com/invite/mlh');
  [band.lede, band.promos, band.discord]
    .flatMap((value) =>
      typeof value === 'string'
        ? [value]
        : [value.chip, value.title, value.body, value.cta],
    )
    .forEach((value) => {
      assert.equal(typeof value, 'string');
      assert.ok(value.trim().length > 0);
      assert.doesNotMatch(value, /organi[sz]er/i, value);
      assert.doesNotMatch(value, /—/, value);
    });
});
