import assert from 'node:assert/strict';
import test from 'node:test';

import { SCENARIOS } from '../src/data/fixtures.mjs';
import { firstName, initials } from '../src/lib/profile.mjs';

test('every fixture user carries the new profile fields', () => {
  Object.values(SCENARIOS).forEach((fixture) => {
    assert.equal(typeof fixture.user.devLinked, 'boolean');
    assert.ok(
      'avatarUrl' in fixture.user,
      'avatarUrl must be present, even if null',
    );
  });
});

test('initials takes the first letter of the first and last words', () => {
  assert.equal(initials('Ada Lovelace'), 'AL');
  assert.equal(initials('Ada Byron King Lovelace'), 'AL');
  assert.equal(initials('Prince'), 'P');
});

test('initials degrades rather than throwing on junk', () => {
  assert.equal(initials(''), '');
  assert.equal(initials(null), '');
  assert.equal(initials(undefined), '');
  assert.equal(initials('   '), '');
});

test('firstName takes the first word of the name', () => {
  assert.equal(firstName('Ada Lovelace'), 'Ada');
  assert.equal(firstName('Ada Byron King Lovelace'), 'Ada');
  assert.equal(firstName('Prince'), 'Prince');
  assert.equal(firstName('  Ada  Lovelace '), 'Ada');
});

test('firstName degrades to empty rather than throwing on junk', () => {
  assert.equal(firstName(''), '');
  assert.equal(firstName(null), '');
  assert.equal(firstName(undefined), '');
  assert.equal(firstName('   '), '');
});
