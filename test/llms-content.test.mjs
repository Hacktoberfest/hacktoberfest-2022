import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import {
  answerText,
  faq,
  getInvolved,
  hero,
  mission,
  siteMeta,
  timeline,
} from '../src/data/content.mjs';

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

// The homepage callout only renders faq.homepage.ids now — the rest of
// the 22 items live on /faq — so the copy checked against the rendered
// homepage and the copy checked against llms-full.txt are different
// slices of the same FAQ set. See the /faq page design doc.
const homepageFaqItems = faq.homepage.ids.map((id) =>
  faq.items.find((item) => item.id === id),
);

const sharedCopy = [
  hero.deck,
  hero.cta,
  hero.secondaryCta,
  timeline.intro,
  ...timeline.eras.flatMap((era) => [era.title, era.copy]),
  ...mission.paragraphs.map(answerText),
  getInvolved.intro,
  ...getInvolved.cards.flatMap((card) => [card.title, ...card.copy, card.cta]),
  faq.intro,
];

const faqCopy = (items) =>
  items.flatMap((item) => [item.question, answerText(item.answer)]);

const homepageCopy = [...sharedCopy, ...faqCopy(homepageFaqItems)];
const fullCopy = [...sharedCopy, ...faqCopy(faq.items)];

test('the rendered page carries every line of copy', async () => {
  /* Inline markup — the mission's <strong> spans, the FAQ's inline links —
     interrupts a paragraph's text in the HTML, so tags become spaces before
     comparing and normalize() collapses the doubles. That is also the right
     frame: the copy list holds each line as a reader hears it. */
  const html = loosen((await read('out/index.html')).replace(/<[^>]+>/g, ' '));

  homepageCopy.forEach((line) => {
    assert.ok(
      html.includes(loosen(line)),
      `missing from the rendered page: ${line.slice(0, 60)}…`,
    );
  });
});

test('llms-full.txt carries every line of copy the page does', async () => {
  const full = loosen(await read('public/llms-full.txt'));

  // llms-full.txt iterates faq.items directly (see src/build/llms.mjs), so
  // it carries the full 22-item set even though the homepage only shows 4.
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

  // Every era of the timeline is accounted for.
  timeline.eras.forEach((era) => {
    assert.ok(index.includes(era.year), `missing era: ${era.year}`);
  });

  /* Attendance isn't open yet. If that ever stops being stated here, an
     answer engine is free to imply people can sign up to attend. */
  assert.match(index, /attendee sign-ups are not open yet/i);
});

/* The schema is generated from src/data/structuredData.js, which restricts
   the homepage FAQPage node to faq.homepage.ids — the same four items the
   homepage callout renders — rather than the full 22-item set the /faq
   page carries. These assertions hold the shape of what actually ships. */
const shippedJsonLd = async () => {
  const html = await read('out/index.html');
  const match = html.match(
    /<script[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/,
  );
  assert.ok(match, 'no JSON-LD in the built page');
  return JSON.parse(match[1]);
};

test('the FAQ ships as FAQPage schema matching the copy', async () => {
  const graph = (await shippedJsonLd())['@graph'];
  const faqPage = graph.find((node) => node['@type'] === 'FAQPage');

  assert.ok(faqPage, 'no FAQPage node in the graph');
  assert.equal(faqPage.mainEntity.length, homepageFaqItems.length);

  homepageFaqItems.forEach((item, index) => {
    const question = faqPage.mainEntity[index];
    assert.equal(question.name, item.question);
    assert.equal(question.acceptedAnswer.text, answerText(item.answer));
  });
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
