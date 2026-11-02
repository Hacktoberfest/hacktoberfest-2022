import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import test from 'node:test';

import { homePhotos } from '../src/data/content.mjs';

const readOutput = (path) =>
  readFile(new URL(`../out/${path}`, import.meta.url), 'utf8');

/* Fests in pictures (components/HomeBands HomePhotosBand): every photo
   exported with the page, described, sized so the grid does not jump as
   they arrive, and left to load as it nears the screen, since the band is
   well below the fold. */
test('the homepage ships every Fest photo, described and lazy', async () => {
  const html = await readOutput('index.html');
  const band = html.match(
    /<section[^>]*aria-labelledby="home-photos-title"[\s\S]*?<\/section>/,
  );
  assert.ok(band, 'the photo band is missing');

  const images = [...band[0].matchAll(/<img\b[^>]*>/g)].map((m) => m[0]);
  assert.equal(images.length, homePhotos.photos.length);
  for (const [index, photo] of homePhotos.photos.entries()) {
    const tag = images[index];
    assert.match(tag, new RegExp(`src="${photo.src}"`));
    assert.match(tag, /alt="[^"]{20,}"/);
    assert.match(tag, /loading="lazy"/);
    assert.match(tag, new RegExp(`width="${photo.width}"`));
    assert.ok(band[0].includes(`>${photo.place}</figcaption>`));
    await access(new URL(`../out${photo.src}`, import.meta.url));
  }
});

test('the photos follow the ceremony and lead into the sponsor wall', async () => {
  const html = await readOutput('index.html');
  const at = (id) => html.indexOf(`aria-labelledby="${id}"`);
  assert.ok(at('home-ceremony-title') > -1);
  assert.ok(at('home-photos-title') > at('home-ceremony-title'));
  assert.ok(at('home-wall-title') > at('home-photos-title'));
});
