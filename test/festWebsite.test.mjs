import assert from 'node:assert/strict';
import test from 'node:test';

import { websiteHost } from '../src/lib/festWebsite.mjs';

/* The modal's button says "Visit bigredhacks.com": the host, without the
   www. and without the path, which is how people say a website out loud. */
test('websiteHost strips scheme, www and path', () => {
  assert.equal(websiteHost('https://www.bigredhacks.com/'), 'bigredhacks.com');
  assert.equal(
    websiteHost('https://2026.knighthacks.org/'),
    '2026.knighthacks.org',
  );
  assert.equal(websiteHost('http://hackpsu.org'), 'hackpsu.org');
  assert.equal(
    websiteHost('https://ai.lahacks.com/apply?x=1'),
    'ai.lahacks.com',
  );
});

test('websiteHost is null for junk', () => {
  assert.equal(websiteHost(null), null);
  assert.equal(websiteHost(''), null);
  assert.equal(websiteHost('not a url'), null);
  assert.equal(websiteHost(42), null);
  assert.equal(websiteHost('mailto:x@y.com'), null);
});
