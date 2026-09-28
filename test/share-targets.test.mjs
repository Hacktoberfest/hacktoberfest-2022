import assert from 'node:assert/strict';
import test from 'node:test';

import {
  SHARE_NETWORKS,
  carriesText,
  composerUrl,
} from '../src/lib/shareTargets.mjs';

const POST =
  'I earned the “Fest” sticker at Hacktoberfest 2026. #Hacktoberfest https://hacktoberfest.com';

test('the four networks, and only LinkedIn refuses text', () => {
  assert.deepEqual(SHARE_NETWORKS, ['x', 'linkedin', 'bluesky', 'threads']);
  assert.equal(carriesText('x'), true);
  assert.equal(carriesText('bluesky'), true);
  assert.equal(carriesText('threads'), true);
  assert.equal(carriesText('linkedin'), false);
});

test('each composer is the network its own address, at its own path', () => {
  const bases = {
    x: ['twitter.com', '/intent/tweet'],
    linkedin: ['www.linkedin.com', '/sharing/share-offsite/'],
    bluesky: ['bsky.app', '/intent/compose'],
    threads: ['www.threads.net', '/intent/post'],
  };
  for (const network of SHARE_NETWORKS) {
    const [host, pathname] = bases[network];
    const url = new URL(
      composerUrl(network, { text: POST, url: 'https://hacktoberfest.com' }),
    );
    assert.equal(url.protocol, 'https:', network);
    assert.equal(url.host, host, network);
    assert.equal(url.pathname, pathname, network);
  }
});

test('the post text survives the trip through the query string', () => {
  for (const network of SHARE_NETWORKS.filter(carriesText)) {
    const url = new URL(
      composerUrl(network, { text: POST, url: 'https://hacktoberfest.com' }),
    );
    assert.equal(url.searchParams.get('text'), POST, network);
    assert.equal(url.searchParams.get('url'), null, network);
    /* The hash and the curly quotes are encoded, never left bare. */
    assert.ok(!url.search.includes('#'), network);
    assert.ok(!url.search.includes('“'), network);
  }
});

test('LinkedIn is handed the address alone', () => {
  const url = new URL(
    composerUrl('linkedin', {
      text: POST,
      url: 'https://hacktoberfest.com',
    }),
  );
  assert.equal(url.searchParams.get('url'), 'https://hacktoberfest.com');
  assert.equal(url.searchParams.get('text'), null);
  assert.ok(!url.search.includes('Hacktoberfest 2026'));
});

test('a composer that is handed nothing to post is a TypeError', () => {
  for (const network of SHARE_NETWORKS.filter(carriesText)) {
    assert.throws(() => composerUrl(network, {}), TypeError, network);
    assert.throws(() => composerUrl(network, { text: '' }), TypeError, network);
    assert.throws(() => composerUrl(network), TypeError, network);
  }
  assert.throws(() => composerUrl('linkedin', { text: POST }), TypeError);
  assert.throws(() => composerUrl('linkedin', { url: '' }), TypeError);
});

test('a network nobody has heard of is a RangeError', () => {
  assert.throws(() => composerUrl('mastodon', { text: POST }), RangeError);
  assert.throws(() => composerUrl(undefined, { text: POST }), RangeError);
  /* Not a way in through the prototype chain either. */
  assert.throws(() => composerUrl('toString', { text: POST }), RangeError);
});
