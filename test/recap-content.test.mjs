import assert from 'node:assert/strict';
import { access } from 'node:fs/promises';
import test from 'node:test';

import {
  homeCeremony,
  homePhotos,
  homeThanks,
  recapHero,
} from '../src/data/content.mjs';
import { stickerImageSrc } from '../src/lib/stickerImage.mjs';
import { youtubeEmbedUrl, youtubeWatchUrl } from '../src/lib/youtube.mjs';

/* The homepage after October (components/RecapHero and HomeThanksBand):
   the canvas's direction B with direction C's headline, picked on
   2026-10-30. */

test('the headline thanks the participants', () => {
  assert.equal(recapHero.heading.lead, 'Thank you,');
  assert.equal(recapHero.heading.accent, '115,385 of you.');
});

/* The participants are the headline, so the numbers under the map lead
   with the Fests and never repeat it. */
test('the numbers lead with the Fests and skip the headline', () => {
  assert.deepEqual(
    recapHero.stats.map((stat) => stat.value),
    ['500+', '70+', '300+', '6', '50+'],
  );
  assert.equal(recapHero.stats[0].label, 'In-person Fests');
  recapHero.stats.forEach((stat) =>
    assert.ok(!recapHero.heading.accent.includes(stat.value)),
  );
});

/* 3 of the 71 places with a Fest are territories, so the count never
   says "countries" alone: always "countries/territories". */
test('the count says countries/territories', () => {
  const strings = JSON.stringify({ recapHero, homeThanks });
  assert.ok(!/countries(?!\/territories)/i.test(strings));
  assert.ok(strings.includes('70+ countries/territories'));
});

/* The hero asks nothing: the header's chip is the way to /my/. */
test('the hero carries no button', () => {
  assert.equal(recapHero.cta, undefined);
});

test('the thank-you band draws stickers that exist', async () => {
  for (const slug of homeThanks.stickers) {
    await access(new URL(`../public${stickerImageSrc(slug)}`, import.meta.url));
  }
});

/* The closing ceremony's replay: MLH's upload, through the
   privacy-enhanced player, which starts when it loads because it only
   loads once someone has pressed play. */
test('the ceremony plays MLH’s replay through the no-cookie player', () => {
  const { youtubeId } = homeCeremony.video;
  assert.match(youtubeId, /^[\w-]{11}$/);
  assert.equal(
    youtubeWatchUrl(youtubeId),
    'https://www.youtube.com/watch?v=D4oKpgJLiAA',
  );
  const embed = new URL(youtubeEmbedUrl(youtubeId));
  assert.equal(embed.hostname, 'www.youtube-nocookie.com');
  assert.equal(embed.pathname, `/embed/${youtubeId}`);
  assert.equal(embed.searchParams.get('autoplay'), '1');
});

test('the ceremony thumbnail is served from the site', async () => {
  assert.match(homeCeremony.video.thumbnail, /^\/[\w-]+\.jpg$/);
  await access(
    new URL(`../public${homeCeremony.video.thumbnail}`, import.meta.url),
  );
});

/* Fests in pictures: nine from the closing-ceremony shortlist, every one
   with words for anyone who cannot see it and the place it was taken.
   The Ho Chi Minh City photo was left out on purpose (2026-11-02). */
test('the photo band has nine described photos, each on disk', async () => {
  assert.equal(homePhotos.photos.length, 9);
  for (const photo of homePhotos.photos) {
    assert.match(photo.src, /^\/photos\/[a-z-]+\.jpg$/);
    await access(new URL(`../public${photo.src}`, import.meta.url));
    assert.ok(photo.width > 0 && photo.height > 0, `${photo.src}: size`);
    assert.match(photo.alt, /^[A-Z].{20,}\.$/, `${photo.src}: alt text`);
    assert.match(photo.place, /^[^,]+, [^,]+$/, `${photo.src}: City, Country`);
    assert.ok(!/vietnam|ho chi minh/i.test(photo.place));
  }
  assert.equal(new Set(homePhotos.photos.map((p) => p.src)).size, 9);
});

test('the recap copy keeps the house voice', () => {
  const strings = JSON.stringify({
    recapHero,
    homeThanks,
    homeCeremony,
    homePhotos,
  });
  assert.ok(!strings.includes('—'), 'no em dashes in new copy');
  assert.ok(!/organizer/i.test(strings), 'say hosts, not organizers');
});
