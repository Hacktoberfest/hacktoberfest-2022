import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import { homeCeremony } from '../src/data/content.mjs';
import { youtubeWatchUrl } from '../src/lib/youtube.mjs';

const readOutput = (path) =>
  readFile(new URL(`../out/${path}`, import.meta.url), 'utf8');

const section = (html) => {
  const match = html.match(
    /<section[^>]*aria-labelledby="home-ceremony-title"[\s\S]*?<\/section>/,
  );
  assert.ok(match, 'the closing ceremony band is missing');
  return match[0];
};

/* The exported homepage carries the poster, never the player: the player
   is YouTube's, and nothing of YouTube's loads until someone presses play
   (components/HomeBands HomeCeremonyBand). Without script the link under
   it still reaches the video. */
test('the homepage ships the ceremony poster, not the player', async () => {
  const html = await readOutput('index.html');
  const band = section(html);

  assert.match(
    band,
    new RegExp(`<button[^>]*aria-label="${homeCeremony.video.play}"`),
  );
  assert.match(
    band,
    new RegExp(`<img[^>]*src="${homeCeremony.video.thumbnail}"`),
  );
  assert.match(
    band,
    new RegExp(
      `<a[^>]*href="${youtubeWatchUrl(homeCeremony.video.youtubeId).replace(/[?.]/g, '\\$&')}"`,
    ),
  );
  assert.doesNotMatch(html, /<iframe\b/);
  assert.doesNotMatch(html, /youtube-nocookie\.com|ytimg\.com/);
});

test('the ceremony follows the thank-you band', async () => {
  const html = await readOutput('index.html');
  const thanks = html.indexOf('aria-labelledby="home-thanks-title"');
  const ceremony = html.indexOf('aria-labelledby="home-ceremony-title"');
  assert.ok(thanks > -1 && ceremony > thanks);
});
