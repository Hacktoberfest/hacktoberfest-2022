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

const everyLineOfCopy = [
  hero.deck,
  hero.cta,
  hero.secondaryCta,
  timeline.intro,
  ...timeline.eras.flatMap((era) => [era.title, era.copy]),
  ...mission.paragraphs.map(answerText),
  getInvolved.intro,
  ...getInvolved.cards.flatMap((card) => [card.title, ...card.copy, card.cta]),
  faq.intro,
  ...faq.items.flatMap((item) => [item.question, answerText(item.answer)]),
];

test('the rendered page carries every line of copy', async () => {
  /* Inline markup — the mission's <strong> spans, the FAQ's inline links —
     interrupts a paragraph's text in the HTML, so tags become spaces before
     comparing and normalize() collapses the doubles. That is also the right
     frame: the copy list holds each line as a reader hears it. */
  const html = loosen((await read('out/index.html')).replace(/<[^>]+>/g, ' '));

  everyLineOfCopy.forEach((line) => {
    assert.ok(
      html.includes(loosen(line)),
      `missing from the rendered page: ${line.slice(0, 60)}…`,
    );
  });
});

test('llms-full.txt carries every line of copy the page does', async () => {
  const full = loosen(await read('public/llms-full.txt'));

  everyLineOfCopy.forEach((line) => {
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

/* The schema is generated from the same array the page renders, so it cannot
   describe questions the page doesn't show. These assertions hold the shape
   of what actually ships. */
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
  assert.equal(faqPage.mainEntity.length, faq.items.length);

  faq.items.forEach((item, index) => {
    const question = faqPage.mainEntity[index];
    assert.equal(question.name, item.question);
    assert.equal(question.acceptedAnswer.text, answerText(item.answer));
  });
});

/* One answer contains a literal "<". Unescaped it would close the script tag
   early and spill JSON into the page. JSON.parse turns "<" back into
   "<", so asserting against parsed JSON (as shippedJsonLd() returns) can't
   tell the escaped and unescaped forms apart — this has to check the raw
   script contents instead. */
test('a literal < in an answer is escaped in the raw script tag', async () => {
  const html = await read('out/index.html');
  const match = html.match(
    /<script[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/,
  );
  assert.ok(match, 'no JSON-LD in the built page');
  assert.ok(
    match[1].includes('\\u003c1 week'),
    'escaped form missing from raw script content',
  );
  assert.ok(
    !match[1].includes('<1 week'),
    'literal < leaked into the script tag unescaped',
  );
});
