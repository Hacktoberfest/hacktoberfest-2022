import assert from 'node:assert/strict';
import { access } from 'node:fs/promises';
import test from 'node:test';

import { SCHEDULE_FIXTURES } from '../src/data/scheduleFixtures.mjs';
import { scheduleEventFrom } from '../src/lib/schedule.mjs';
import { agendaEntries } from '../src/lib/scheduleAgenda.mjs';
import { scheduleType } from '../src/lib/scheduleTypes.mjs';

/* The fixtures are what the mocked build renders and what anyone working on
   the page sees, so their job is to make every awkward state reachable without
   a live API. This file holds them to that: each case the fixture file claims
   to cover is asserted here, so deleting an entry fails a test rather than
   quietly removing a state nobody can get back to.

   Normalised in UTC rather than the machine's zone, so a contributor in Sydney
   and CI in a container agree about which day anything falls on. */
const events = SCHEDULE_FIXTURES.map((event) =>
  scheduleEventFrom(event, 'UTC'),
);
const entries = agendaEntries(events);

test('every fixture survives normalisation', () => {
  events.forEach((event, index) => {
    assert.ok(
      event,
      `fixture ${index} (${SCHEDULE_FIXTURES[index]?.id}) was dropped`,
    );
  });
});

test('fixture ids are unique', () => {
  const ids = events.map((event) => event.id);
  assert.equal(new Set(ids).size, ids.length);
});

/* Outbound links stay on the reserved TLD so a placeholder can never resolve
   and is never mistaken for a real destination. Logos are different: one of
   them is a real asset this repo ships, so a local path is expected there and
   only a remote logo has to be a placeholder. */
test('placeholder links can never resolve', () => {
  events.forEach((event) => {
    if (!event.url) return;
    assert.match(
      event.url,
      /^https:\/\/example\.invalid\//,
      `${event.id}: ${event.url}`,
    );
  });
});

test('a remote logo is a placeholder; a local one ships with the repo', async () => {
  await Promise.all(
    events
      .filter((event) => event.logoUrl)
      .map(async (event) => {
        if (event.logoUrl.startsWith('/')) {
          await access(
            new URL(`../public${event.logoUrl}`, import.meta.url),
          ).catch(() => {
            assert.fail(`${event.id}: ${event.logoUrl} is not in public/`);
          });
          return;
        }

        assert.match(
          event.logoUrl,
          /^https:\/\/example\.invalid\//,
          `${event.id}: ${event.logoUrl}`,
        );
      }),
  );
});

// -- the coverage the fixture file promises -------------------------------

test('there is exactly one feature, and it holds things', () => {
  const features = entries.filter((entry) => entry.kind === 'feature');

  assert.equal(features.length, 1, 'October has one Global Hack Week');
  assert.ok(
    features[0].contains.length >= 3,
    `the feature holds ${features[0].contains.length} things; an empty container proves nothing`,
  );
});

/* The case that makes containers workable at all: a session on the feature's
   first day and one on its last must both be inside it, not orphaned either
   side by an off-by-one. */
test('the feature claims its own first and last day', () => {
  const [feature] = entries.filter((entry) => entry.kind === 'feature');
  const held = feature.contains.map((entry) => entry.event.startDate);

  assert.ok(
    held.includes(feature.event.startDate),
    'nothing on the opening day, so that boundary is untested',
  );
  assert.ok(
    held.includes(feature.event.endDate),
    'nothing on the closing day, so that boundary is untested',
  );
});

/* Round 2's dates fall inside Global Hack Week, and it must still sit in the
   open stream: a challenge is never Hack Week programming. The overlap is kept
   in the fixtures precisely so this stays exercised. */
test('every round sits in the open stream, even the one overlapping the feature', () => {
  const nested = entries
    .filter((entry) => entry.kind === 'feature')
    .flatMap((entry) => entry.contains)
    .filter((entry) => entry.kind === 'round');

  assert.equal(nested.length, 0, 'a round was claimed by the feature');
  assert.equal(entries.filter((entry) => entry.kind === 'round').length, 4);
});

test('the rounds run weekly, each opening on a Monday', () => {
  const rounds = events.filter((event) => event.kind === 'round');

  assert.ok(rounds.length >= 4, `only ${rounds.length} rounds`);
  rounds.forEach((round) => {
    const [y, m, d] = round.startDate.split('-').map(Number);
    assert.equal(
      new Date(Date.UTC(y, m - 1, d)).getUTCDay(),
      1,
      `${round.id} opens on ${round.startDate}, which is not a Monday`,
    );
  });
});

test('one event has no logo', () => {
  assert.ok(
    events.some((event) => event.logoUrl === null),
    'every fixture has a logo, so the initials fallback is unreachable',
  );
});

/* Three types and no more: a fixture inventing a fourth would be testing a
   state the schedule does not have. The fallback for an unrecognised type is
   covered directly in schedule-types.test.mjs. */
test('every fixture uses one of the three real types', () => {
  events.forEach((event) => {
    assert.ok(
      scheduleType(event.type).known,
      `${event.id}: ${event.type} is not one of the three`,
    );
  });

  assert.deepEqual(
    [...new Set(events.map((event) => event.type))].sort(),
    ['challenge', 'event', 'livestream'],
    'the fixtures should exercise all three',
  );
});

test('an all-day event spans more than one day', () => {
  assert.ok(events.some((event) => event.allDay && event.multiDay));
});

/* Nothing may be listed twice — once in the open stream and again inside the
   feature would double-count the whole week. The one sanctioned echo is the
   round's close stub, which is the same event shown at its other end; each
   multi-day round has exactly one. */
test('every event appears exactly once, plus one close stub per round', () => {
  const rendered = entries
    .filter((entry) => entry.kind !== 'roundClose')
    .flatMap((entry) => [
      entry.event.id,
      ...(entry.contains || []).map((child) => child.event.id),
    ]);

  assert.equal(
    new Set(rendered).size,
    rendered.length,
    'something is rendered twice',
  );
  assert.equal(
    rendered.length,
    events.length,
    'the agenda renders a different number of events than exist',
  );

  const closes = entries.filter((entry) => entry.kind === 'roundClose');
  const rounds = events.filter(
    (event) => event.kind === 'round' && event.endDate > event.startDate,
  );
  assert.deepEqual(
    closes.map((entry) => entry.event.id).sort(),
    rounds.map((event) => event.id).sort(),
    'one stub per multi-day round, no more',
  );
});
