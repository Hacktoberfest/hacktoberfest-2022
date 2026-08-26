import assert from 'node:assert/strict';
import test from 'node:test';

import { festFormatFromName } from '../src/lib/festFormat.mjs';

test('reads the two Fest formats out of a name', () => {
  assert.equal(festFormatFromName('Hacktoberfest Berlin Hack Day'), 'hackDay');
  assert.equal(festFormatFromName('Hacktoberfest London Meet Up'), 'meetUp');
});

/* The shape MLH actually uses: format immediately after "Hacktoberfest",
   then the city, then a partner after an "x". */
test('reads the real name shape, partner and all', () => {
  assert.equal(
    festFormatFromName('Hacktoberfest Meet Up Toronto x Hack the 6ix'),
    'meetUp',
  );
  assert.equal(
    festFormatFromName('Hacktoberfest Hack Day New York x IBM'),
    'hackDay',
  );
});

/* The partner half of the name is a second place words live, and a partner
   can be called anything. Under the loose whole-name match a Meet Up
   partnered with a "Hack Day" something reads as both formats and resolves
   to neither, silently losing a badge it should have. The anchored pass
   settles it before the loose one ever runs. */
test("the name's own format outranks a partner that mentions the other", () => {
  assert.equal(
    festFormatFromName('Hacktoberfest Meet Up Berlin x Hack Day Collective'),
    'meetUp',
  );
  assert.equal(
    festFormatFromName('Hacktoberfest Hack Day Lagos x The Meet Up Co'),
    'hackDay',
  );
});

/* "Hacktober Fest" as two words is how this repo's own fixtures used to
   write it, and a name is not worth failing over a space. */
test('tolerates "Hacktober Fest" written as two words', () => {
  assert.equal(festFormatFromName('Hacktober Fest Hack Day Sydney'), 'hackDay');
});

test('is case-insensitive and tolerates the usual spellings', () => {
  ['Hack Day', 'hack day', 'HACK DAY', 'Hackday', 'Hack-Day'].forEach(
    (spelling) => {
      assert.equal(
        festFormatFromName(`Hacktoberfest Lagos ${spelling}`),
        'hackDay',
        spelling,
      );
    },
  );

  ['Meet Up', 'meet up', 'Meetup', 'meet-up', 'MEETUP'].forEach((spelling) => {
    assert.equal(
      festFormatFromName(`Hacktoberfest Lima ${spelling}`),
      'meetUp',
      spelling,
    );
  });
});

/* The live payload carries "Quinn's non-hack day hacktoberfest test". A
   plain substring match calls that a Hack Day, which is the exact opposite
   of what the name says, so the negative guard is the whole reason this
   reads names rather than trusting `includes`. */
test('"non-hack day" is not a Hack Day', () => {
  assert.equal(
    festFormatFromName("Quinn's non-hack day hacktoberfest test"),
    null,
  );
  assert.equal(festFormatFromName('Hacktoberfest Non Hack Day Sydney'), null);
  assert.equal(festFormatFromName('Non-Hack Day Hacktoberfest Toronto'), null);
});

/* Off-convention and claiming to be both is a name to trust for neither.
   This is the loose path: with nothing anchoring which half of the name is
   making the claim, there is no basis for picking one. */
test('an off-convention name carrying both formats resolves to neither', () => {
  assert.equal(festFormatFromName('Berlin Hack Day and Meet Up'), null);
});

/* On-convention, the front of the name has already answered, so a second
   format later in it changes nothing. Same rule that lets a partner name
   mention the other format harmlessly. */
test('an on-convention name is not confused by a second format later', () => {
  assert.equal(
    festFormatFromName('Hacktoberfest Hack Day and Meet Up'),
    'hackDay',
  );
});

/* No badge is the right answer for a name off-convention, which is what
   every event in the live payload looks like today. */
test('a name with neither format returns null', () => {
  assert.equal(festFormatFromName('Stephen Test Hacktoberfest'), null);
  assert.equal(festFormatFromName('SharkHacks3 at Hacktoberfest'), null);
  assert.equal(festFormatFromName('Hacktober Fest Manila'), null);
});

/* "hacks day" is not "hack day", and "Hacktoberfest" is not either. The
   word boundaries are what keep the site's own name from badging itself. */
test('near-misses do not match', () => {
  assert.equal(festFormatFromName('SharkHacks Day One'), null);
  assert.equal(festFormatFromName('Hacktoberfest'), null);
  assert.equal(festFormatFromName('Hackathon Day'), null);
  assert.equal(festFormatFromName('Meeting Upstairs'), null);
});

test('junk input returns null rather than throwing', () => {
  assert.equal(festFormatFromName(null), null);
  assert.equal(festFormatFromName(undefined), null);
  assert.equal(festFormatFromName(''), null);
  assert.equal(festFormatFromName(42), null);
});
