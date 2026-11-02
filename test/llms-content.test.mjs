import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import {
  answerText,
  homeCeremony,
  homePhotos,
  homeThanks,
  mapHero,
  mission,
  missionPage,
  recapHero,
  siteMeta,
  timeline,
} from '../src/data/content.mjs';
import { RETIRED_ROUTES } from '../src/data/retiredRoutes.mjs';

/* The llms files once fell a whole round of revisions behind the page, and
   nothing caught it. Both are now generated from src/data/content.mjs, so
   these tests check the thing that generation is supposed to guarantee: that
   the page a reader gets and the file an answer engine gets say the same
   thing. A copy change that reaches only one of them fails here. */

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

// The page escapes apostrophes and dashes as entities; llms.txt does not.
const decode = (html) =>
  html
    .replace(/&#x27;|&#39;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&mdash;/g, '—')
    .replace(/&middot;/g, '·')
    .replace(/&nbsp;/g, ' ');

const normalize = (text) => decode(text).replace(/\s+/g, ' ');

// Straight and curly quotes are the same word to a reader; compare either.
const loosen = (text) => normalize(text).replace(/[’']/g, "'");

/* The homepage's own copy after October (the recap hero, the thank-you
   band, the closing ceremony and the photos' places), the lines both the
   page and llms-full.txt carry. The FAQ left
   with /questions/, so neither carries it now. */
const sharedCopy = [
  recapHero.eyebrow[0],
  recapHero.heading.lead,
  recapHero.heading.accent,
  ...recapHero.stats.flatMap((stat) => [stat.value, stat.label]),
  mapHero.tagline.accent,
  homeThanks.heading.lead,
  homeThanks.heading.accent,
  ...homeThanks.paragraphs,
  homeCeremony.heading.lead,
  homeCeremony.heading.accent,
  homeCeremony.intro,
  homeCeremony.video.title,
  homePhotos.eyebrow,
  homePhotos.heading.lead,
  homePhotos.heading.accent,
  homePhotos.intro,
  ...homePhotos.photos.map((photo) => photo.place),
];

/* The story so far and the mission moved off the homepage to /mission/,
   which was retired with the rest of the season's pages
   (src/data/retiredRoutes.mjs). llms-full.txt still carries them. */
const missionCopy = [
  missionPage.intro,
  timeline.intro,
  ...timeline.eras.flatMap((era) => [era.title, era.copy]),
  ...mission.paragraphs.map(answerText),
];

const homepageCopy = sharedCopy;
const fullCopy = [...sharedCopy, ...missionCopy];

test('the rendered page carries every line of copy', async () => {
  /* Inline markup — the mission's <strong> spans, the FAQ's inline links —
     interrupts a paragraph's text in the HTML, so tags become spaces before
     comparing and normalize() collapses the doubles. That is also the right
     frame: the copy list holds each line as a reader hears it. */
  // A <wbr> is a place a line may break, not a space, so it goes first.
  const html = loosen(
    (await read('out/index.html'))
      .replace(/<wbr\s*\/?>/g, '')
      .replace(/<[^>]+>/g, ' '),
  );

  homepageCopy.forEach((line) => {
    assert.ok(
      html.includes(loosen(line)),
      `missing from the rendered page: ${line.slice(0, 60)}…`,
    );
  });
});

test('the homepage no longer carries them', async () => {
  const html = loosen((await read('out/index.html')).replace(/<[^>]+>/g, ' '));
  assert.ok(!html.includes(loosen(timeline.intro)), 'the story so far');
  assert.ok(
    !html.includes(loosen(answerText(mission.paragraphs[0]))),
    'the mission',
  );
});

test('llms-full.txt carries every line of copy the page does', async () => {
  const full = loosen(await read('public/llms-full.txt'));

  fullCopy.forEach((line) => {
    assert.ok(
      full.includes(loosen(line)),
      `missing from llms-full.txt: ${line.slice(0, 60)}…`,
    );
  });
});

test('llms.txt orients a crawler without contradicting the page', async () => {
  const index = loosen(await read('public/llms.txt'));

  // The summary line and the page's meta description are the same sentence.
  assert.ok(index.includes(loosen(siteMeta.description)));

  // Every era of the timeline is accounted for. /mission/ is retired, so
  // the years are no longer links into it.
  timeline.eras.forEach((era) => {
    assert.ok(index.includes(`- ${era.year}: `), `missing era: ${era.year}`);
  });

  /* Attendance used to be the thing this file had to be honest about: no
     dates, no venues, nothing to sign up for, then where the Fests were.
     After October the honesty is that it is over: left unstated, an
     answer engine is free to keep sending people to Fests that have
     happened. The endpoint the map draws from is still the source for a
     machine. */
  assert.match(index, /Hacktoberfest 2026 is over\./);
  assert.ok(
    index.includes('https://hacktoberfest-api.mlh.com/api/events'),
    'llms.txt should hand a machine the events endpoint',
  );
});

/* A retired page redirects home (src/data/retiredRoutes.mjs), so neither
   file may send an answer engine to one, as a link or as a path in the
   prose. */
test('neither llms file points at a retired page', async () => {
  const files = [
    ['llms.txt', await read('public/llms.txt')],
    ['llms-full.txt', await read('public/llms-full.txt')],
  ];
  files.forEach(([name, text]) => {
    RETIRED_ROUTES.forEach((route) => {
      assert.ok(!text.includes(route), `${name} points at ${route}`);
    });
  });
});

/* The schema is generated from src/data/structuredData.js. These
   assertions hold the shape of what actually ships. */
const shippedJsonLd = async () => {
  const html = await read('out/index.html');
  const match = html.match(
    /<script[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/,
  );
  assert.ok(match, 'no JSON-LD in the built page');
  return JSON.parse(match[1]);
};

/* The FAQ left the homepage after October, and schema naming questions
   the page does not carry would describe content it does not have. */
test('the homepage ships no FAQPage schema', async () => {
  const graph = (await shippedJsonLd())['@graph'];
  assert.ok(graph.some((node) => node['@type'] === 'Event'));
  assert.ok(!graph.some((node) => node['@type'] === 'FAQPage'));
});

/* A literal "<" in an answer would close the script tag early and spill
   JSON into the page, so structuredData.js escapes every "<" in the
   serialized JSON-LD unconditionally (see homepageJsonLdScript). The FAQ
   item that used to exercise this (organize's "<1 week") was retired in
   the restructure, and nothing in today's homepage copy contains a "<" —
   so rather than pin the test to content that may or may not carry one,
   this asserts the invariant the escaping is supposed to guarantee: the
   raw script contents never contain an unescaped "<" at all. JSON.parse
   turns "<" back into "<", so this has to check the raw script
   contents rather than the parsed JSON shippedJsonLd() returns. */
test('the raw JSON-LD script tag never contains an unescaped <', async () => {
  const html = await read('out/index.html');
  const match = html.match(
    /<script[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/,
  );
  assert.ok(match, 'no JSON-LD in the built page');
  assert.ok(
    !match[1].includes('<'),
    'a literal < leaked into the script tag unescaped',
  );
});
