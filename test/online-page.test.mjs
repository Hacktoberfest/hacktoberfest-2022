import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import {
  activitiesPage,
  faq,
  my,
  online,
  schedule,
} from '../src/data/content.mjs';
import { ACTIVITIES, REQUIRED_STICKERS } from '../src/data/eligibility.mjs';

const readOutput = (path) =>
  readFile(new URL(`../out/${path}`, import.meta.url), 'utf8');

const escapeRegExp = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/* The page escapes apostrophes as entities; the copy does not. */
const decode = (html) =>
  html.replace(/&#x27;|&#39;|&apos;/g, '’').replace(/&amp;/g, '&');

test('/online builds, indexed, with its hero, both CTAs and the pile', async () => {
  const html = decode(await readOutput('online/index.html'));
  assert.match(
    html,
    new RegExp(`<title[^>]*>${escapeRegExp(online.title)}</title>`),
  );
  assert.match(html, /name="robots" content="index, follow"/);
  assert.ok(html.includes(online.eyebrow));
  assert.ok(html.includes(online.heading.accent));
  assert.ok(html.includes(online.intro));
  assert.match(
    html,
    new RegExp(`<a[^>]*href="/login/"[^>]*>${escapeRegExp(online.cta)}</a>`),
  );
  assert.match(
    html,
    new RegExp(
      `<a[^>]*href="/activities/"[^>]*>${escapeRegExp(online.secondaryCta)}</a>`,
    ),
  );
  /* The pile: every sticker on it, by file. */
  online.pile.forEach((id) =>
    assert.ok(html.includes(`/stickers/${id}.svg`), id),
  );
  /* The sign-in: once, in the hero. No steps band follows it. */
  const signIns = html.match(/<a[^>]*href="\/login\/"[^>]*>/g);
  assert.equal(signIns && signIns.length, 1);
  assert.ok(!html.includes('id="how-it-works"'), 'no steps band');
});

test('/online tells the milestones, then the collection', async () => {
  const html = decode(await readOutput('online/index.html'));
  assert.ok(html.includes(online.milestones.eyebrow));
  online.milestones.cards.forEach((card) => {
    assert.ok(html.includes(card.title), `missing milestone: ${card.id}`);
    assert.ok(html.includes(card.at), `missing count: ${card.id}`);
    assert.ok(html.includes(card.copy), `missing copy: ${card.id}`);
    assert.ok(
      html.includes(`/stickers/${card.art}.svg`),
      `missing art: ${card.id}`,
    );
  });
  assert.ok(html.includes(online.milestones.disclaimer), 'the disclaimer');
  assert.ok(
    html.indexOf(online.heading.accent) <
      html.indexOf(online.milestones.cards[0].title) &&
      html.indexOf(online.milestones.cards[0].title) <
        html.indexOf(online.collection.heading.accent),
    'the hero, then the milestones, then the collection',
  );
  /* Every sticker a page holds is on the page, by file and by name. */
  online.collection.pages.forEach((type) => {
    assert.ok(html.includes(activitiesPage.list.types[type]), type);
    assert.ok(html.includes(my.album.pages[type]), `${type} line`);
    const stickers =
      type === 'required'
        ? REQUIRED_STICKERS
        : ACTIVITIES.filter((activity) => activity.type === type);
    stickers.forEach((sticker) => {
      assert.ok(html.includes(`/stickers/${sticker.id}.svg`), sticker.id);
      assert.ok(html.includes(`alt="${sticker.label}"`), sticker.label);
    });
  });
  /* The last row: the in-person page's two stickers, no button. Every
     sticker on the band carries its name for the pointer. */
  assert.ok(html.includes(online.collection.inPerson.copy));
  ACTIVITIES.filter((activity) => activity.type === 'inperson').forEach(
    (sticker) => {
      assert.ok(html.includes(`/stickers/${sticker.id}.svg`), sticker.id);
      assert.ok(html.includes(`data-label="${sticker.label}"`), sticker.id);
    },
  );
  /* Nothing from the old story survives on the page. */
  assert.ok(!html.includes('What happens online'), 'no what-happens band');
  assert.ok(!html.includes('DEV badges'), 'no DEV badges reward');
  assert.ok(!html.includes('Done this before?'), 'no then-and-now band');
  assert.ok(!html.includes('1 of 8 activities'), 'no old milestone card');
});

test('/online carries its FAQ slice and the way to the rest', async () => {
  const html = decode(await readOutput('online/index.html'));
  online.faq.ids.forEach((id) => {
    const item = faq.items.find((entry) => entry.id === id);
    assert.ok(html.includes(item.question), `missing question: ${id}`);
  });
  assert.match(
    html,
    new RegExp(
      `<a[^>]*href="${escapeRegExp(online.faq.cta.href)}"[^>]*>${escapeRegExp(online.faq.cta.label)}</a>`,
    ),
  );
  /* It ends with the book callout: the way to /my for someone already
     collecting, with a fan of framed stickers, and not the room callout
     /schedule closes with. */
  assert.ok(html.includes(online.bookCallout.title));
  assert.ok(html.includes(online.bookCallout.body));
  assert.match(
    html,
    new RegExp(
      `<a[^>]*href="/my/"[^>]*>${escapeRegExp(online.bookCallout.cta)}</a>`,
    ),
  );
  online.bookCallout.stickers.forEach((slug) =>
    assert.ok(html.includes(`/stickers/${slug}.svg`), slug),
  );
  assert.ok(!html.includes(schedule.festsCallout.title));
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
  assert.match(nav[0], /href="\/online\/"/);
  assert.match(sitemap, /\/online\//);
  assert.match(llms, /\.\/online\//);
  assert.ok(llmsFull.includes(online.intro));
});
