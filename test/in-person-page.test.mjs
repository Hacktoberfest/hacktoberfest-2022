import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import test from 'node:test';

import { faq, fests, host, inPerson } from '../src/data/content.mjs';

const readOutput = (path) =>
  readFile(new URL(`../out/${path}`, import.meta.url), 'utf8');

const escapeRegExp = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/* The page escapes apostrophes as entities; the copy does not. */
const decode = (html) =>
  html.replace(/&#x27;|&#39;|&apos;/g, '’').replace(/&amp;/g, '&');

test('/in-person builds, indexed, with its hero, its one CTA and both prints', async () => {
  const html = decode(await readOutput('in-person/index.html'));
  assert.match(
    html,
    new RegExp(`<title[^>]*>${escapeRegExp(inPerson.title)}</title>`),
  );
  assert.match(html, /name="robots" content="index, follow"/);
  assert.ok(html.includes(inPerson.eyebrow));
  assert.ok(html.includes(inPerson.heading.accent));
  assert.ok(html.includes(inPerson.intro));
  assert.match(
    html,
    new RegExp(`<a[^>]*href="/fests/"[^>]*>${escapeRegExp(inPerson.cta)}</a>`),
  );
  /* One ask in the hero: no Host a Fest button beside it. */
  assert.equal(inPerson.secondaryCta, null);
  for (const photo of inPerson.hero.photos) {
    assert.match(
      html,
      new RegExp(
        `<img[^>]*src="${escapeRegExp(photo.src)}"[^>]*alt="${escapeRegExp(photo.alt)}"`,
      ),
    );
    await access(new URL(`../public${photo.src}`, import.meta.url));
  }
});

test('/in-person tells what you get on the day, then the steps in two phases', async () => {
  const html = decode(await readOutput('in-person/index.html'));
  /* On the day: four cards, each with its picture, and no disclaimer. */
  inPerson.onTheDay.cards.forEach((card) => {
    assert.ok(html.includes(card.title), `missing card: ${card.id}`);
    assert.ok(html.includes(card.at), `missing tag: ${card.id}`);
    assert.ok(html.includes(card.copy), `missing copy: ${card.id}`);
    assert.ok(
      !html.includes(`/stickers/fest-${card.id}`),
      `${card.id} is not a sticker`,
    );
  });
  const virtual = inPerson.onTheDay.cards.find((card) => card.link);
  assert.match(
    html,
    new RegExp(
      `<a[^>]*href="${escapeRegExp(virtual.link.href)}"[^>]*>${escapeRegExp(virtual.link.label)}</a>`,
    ),
  );
  inPerson.earn.steps.forEach((step) => {
    assert.ok(html.includes(step.title), step.title);
    assert.ok(html.includes(step.copy), step.copy);
  });
  /* The two phase labels, and nothing under the steps. */
  assert.ok(html.includes('Before the day'));
  assert.ok(html.includes('On the day'));
  assert.ok(!html.includes('/stickers/fest.svg'), 'no strip sticker');
  assert.ok(!html.includes('Also counts online'), 'no strip');
  assert.ok(!html.includes('is on the Fests page'), 'no hint line');
  assert.ok(!html.includes('the whole thing'), 'no intro line');
  assert.ok(!html.includes('the door does the rest'), 'no doors');
  /* On the day before the steps, the steps before the nearby band.
     Read from the body: the meta description says "Find a Fest near
     you" too. */
  const body = html.slice(html.indexOf('<body'));
  assert.ok(
    body.indexOf(inPerson.onTheDay.cards[0].title) <
      body.indexOf(inPerson.earn.steps[0].title) &&
      body.indexOf(inPerson.earn.steps[0].title) <
        body.indexOf(inPerson.nearby.heading.accent),
    'on the day, then steps, then nearby',
  );
  /* Nothing from the old story survives on the page. */
  assert.ok(!html.includes('1 of 8 activities'), 'no old milestone card');
  assert.ok(!html.includes('DEV badges'), 'no DEV badges reward');
  assert.ok(!html.includes('Less alone,'), 'no then-and-now band');
  assert.ok(!html.includes('Earn 10 stickers'), 'no milestone cards');
});

test('/in-person describes the day and carries the nearby band', async () => {
  const html = decode(await readOutput('in-person/index.html'));
  inPerson.formats.cards.forEach((card) => {
    assert.ok(html.includes(card.tag), card.id);
    assert.ok(html.includes(card.title), card.id);
    card.lines.forEach((line) => assert.ok(html.includes(line), line));
  });
  assert.ok(
    !html.includes('What to bring'),
    'the aside under the cards is gone',
  );
  /* The reel came off this page: the hero's two prints carry the faces. */
  assert.ok(!html.includes(host.photoStrip.label));
  /* The nearby band’s frame is in the export; its cards arrive after the
     client-side fetch, so no Fest name is. */
  assert.ok(html.includes(inPerson.nearby.heading.accent));
  assert.ok(!html.includes('Hacktober Fest Brooklyn'));
  /* The formats come before on the day, which comes before the steps. */
  assert.ok(
    html.indexOf(inPerson.formats.cards[0].title) <
      html.indexOf(inPerson.onTheDay.cards[0].title),
  );
  assert.ok(html.includes(inPerson.nearby.intro));
});

test('/in-person carries its FAQ slice and ends pointing online', async () => {
  const html = decode(await readOutput('in-person/index.html'));
  assert.ok(
    !html.includes(fests.hostCallout.title),
    'the host callout was removed from this page',
  );
  inPerson.faq.ids.forEach((id) => {
    const item = faq.items.find((entry) => entry.id === id);
    assert.ok(html.includes(item.question), `missing question: ${id}`);
  });
  assert.ok(html.includes(inPerson.onlineCallout.title));
  assert.ok(html.includes(inPerson.onlineCallout.body));
  assert.match(
    html,
    new RegExp(
      `<a[^>]*href="/online/"[^>]*>${escapeRegExp(inPerson.onlineCallout.cta)}</a>`,
    ),
  );
  /* The fork’s second door. */
  assert.match(
    html,
    new RegExp(
      `<a[^>]*href="/host/"[^>]*>${escapeRegExp(inPerson.onlineCallout.secondaryCta)}</a>`,
    ),
  );
});

test('the nav, the sitemap and the llms files all know the page', async () => {
  const [home, sitemap, llms, llmsFull] = await Promise.all([
    readOutput('index.html'),
    readOutput('sitemap.xml'),
    readOutput('llms.txt'),
    readOutput('llms-full.txt'),
  ]);
  const nav = home.match(
    /<nav[^>]*aria-label="Main navigation"[\s\S]*?<\/nav>/,
  );
  assert.ok(nav);
  assert.match(nav[0], /href="\/in-person\/"/);
  assert.match(sitemap, /\/in-person\//);
  assert.match(llms, /\.\/in-person\//);
  assert.ok(llmsFull.includes(inPerson.intro));
});
