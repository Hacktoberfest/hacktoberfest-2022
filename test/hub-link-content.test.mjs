import assert from 'node:assert/strict';
import test from 'node:test';

import { my } from '../src/data/content.mjs';

const strings = (copy) => [
  copy.badge,
  copy.body(1),
  copy.body(3),
  ...(copy.applicationsBody
    ? [copy.applicationsBody(1), copy.applicationsBody(3)]
    : []),
  copy.cta,
];

test('the hub link band points each hub at the other', () => {
  assert.equal(my.hubLink.hosting.href, '/my/hosting/');
  assert.equal(my.hubLink.attending.href, '/my/');
  assert.equal(my.hubLink.hosting.badge, 'Hosting');
  assert.equal(my.hubLink.attending.badge, 'Attending');
});

test('the hosting link counts Fests, singular and plural', () => {
  assert.match(my.hubLink.hosting.body(1), /hosting a Fest/);
  assert.match(my.hubLink.hosting.body(3), /hosting 3 Fests/);
  assert.doesNotMatch(my.hubLink.hosting.body(1), /1 Fests?/);
});

/* Someone with only applications is not hosting anything yet, and their
   host resources are still locked: the line says neither. */
test('the applications-only hosting link counts applications and never says hosting', () => {
  assert.match(my.hubLink.hosting.applicationsBody(1), /a Fest application\./);
  assert.match(my.hubLink.hosting.applicationsBody(3), /3 Fest applications\./);
  assert.doesNotMatch(my.hubLink.hosting.applicationsBody(1), /1 Fest/);
  [1, 3].forEach((count) => {
    const line = my.hubLink.hosting.applicationsBody(count);
    assert.doesNotMatch(line, /hosting (a|\d+) Fest/, line);
    assert.doesNotMatch(line, /resources/, line);
  });
});

test('the attending link ignores the count', () => {
  assert.equal(my.hubLink.attending.body(0), my.hubLink.attending.body(5));
});

test('the copy says hosts, never organizers, and carries no em dashes', () => {
  [...strings(my.hubLink.hosting), ...strings(my.hubLink.attending)].forEach(
    (value) => {
      assert.doesNotMatch(value, /organi[sz]er/i, value);
      assert.doesNotMatch(value, /—/, value);
    },
  );
});

test('the hosting hub has its own title and hero line', () => {
  assert.match(my.hosting.title, /Hacktoberfest 2026$/);
  assert.match(my.hosting.title, /^Hosting/);
  assert.ok(my.hosting.welcomeAccent.length > 0);
  assert.doesNotMatch(my.hosting.welcomeAccent, /—/);
});

/* /my/promos/ has its own card at the foot of /my (ResourcesBand), not a
   strip in this band's place. */
test('the hub link band links only between the hubs', () => {
  assert.deepEqual(
    Object.keys(my.hubLink)
      .filter((key) => key !== 'label')
      .sort(),
    ['attending', 'hosting'],
  );
});
