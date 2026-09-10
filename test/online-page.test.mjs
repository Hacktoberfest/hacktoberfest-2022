import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import { faq, online, schedule } from '../src/data/content.mjs';

const readOutput = (path) =>
  readFile(new URL(`../out/${path}`, import.meta.url), 'utf8');

const escapeRegExp = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/* The page escapes apostrophes as entities; the copy does not. */
const decode = (html) =>
  html.replace(/&#x27;|&#39;|&apos;/g, '’').replace(/&amp;/g, '&');

test('/online builds, indexed, with its hero and both CTAs', async () => {
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
    new RegExp(`<a[^>]*href="/schedule/"[^>]*>${escapeRegExp(online.cta)}</a>`),
  );
  assert.match(
    html,
    new RegExp(
      `<a[^>]*href="#how-it-works"[^>]*>${escapeRegExp(online.secondaryCta)}</a>`,
    ),
  );
  online.facts.forEach((fact) => assert.ok(html.includes(fact), fact));
  /* The sign-in: in How it works (which the hero's anchor lands on),
     never in the hero. */
  assert.match(html, /id="how-it-works"/);
  const signIns = html.match(
    new RegExp(
      `<a[^>]*href="/login/"[^>]*>${escapeRegExp(online.earn.signIn.cta)}</a>`,
      'g',
    ),
  );
  assert.equal(signIns && signIns.length, 1);
});

test('/online shows what happens online, then and now after completion', async () => {
  const html = decode(await readOutput('online/index.html'));
  online.happens.items.forEach((item) => {
    assert.ok(html.includes(item.title), item.id);
    assert.ok(html.includes(item.time), `${item.id} time`);
    assert.ok(html.includes(item.earns), `${item.id} earns`);
  });
  assert.ok(html.includes(online.happens.more.title), 'the fourth card');
  assert.ok(!html.includes('What you will learn'), 'no learn band');
  /* Then and now comes after completion now. */
  assert.ok(
    html.indexOf(online.complete.body) <
      html.indexOf(online.thenNow.cards[1].title),
    'then and now should follow completion',
  );
});

test('the rewards band names every reward, with its where chip', async () => {
  const html = decode(await readOutput('online/index.html'));
  online.rewards.items.forEach((item) => {
    assert.ok(html.includes(item.title), `missing reward: ${item.id}`);
    assert.ok(html.includes(item.where), `missing where: ${item.id}`);
  });
  /* The ghost box: the T-shirt, and the way to the in-person page. */
  assert.ok(html.includes(online.rewards.ghost.title));
  assert.match(
    html,
    new RegExp(
      `<a[^>]*href="/in-person/"[^>]*>${escapeRegExp(online.rewards.ghost.cta)}</a>`,
    ),
  );
});

test('/online tells the then-and-now story and the three steps', async () => {
  const html = decode(await readOutput('online/index.html'));
  online.thenNow.cards.forEach((card) => {
    assert.ok(html.includes(card.tag), `missing card tag: ${card.id}`);
    assert.ok(html.includes(card.title), `missing card title: ${card.id}`);
    card.points.forEach((point) => assert.ok(html.includes(point), point));
  });
  assert.ok(html.includes(online.thenNow.quote.accent));
  online.earn.steps.forEach((step) => {
    assert.ok(html.includes(step.title), step.title);
    assert.ok(html.includes(step.copy), step.copy);
  });
  assert.match(
    html,
    new RegExp(
      `<a[^>]*href="/activities/"[^>]*>${escapeRegExp(online.earn.cta)}</a>`,
    ),
  );
  /* The pace line sits under the steps now; the band has no /my button. */
  assert.ok(html.includes(online.complete.body));
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
  /* It ends the way /schedule does, with the room callout, but the button
     lands on the in-person landing page rather than the directory. */
  assert.ok(html.includes(schedule.festsCallout.title));
  assert.match(
    html,
    new RegExp(
      `<a[^>]*href="/in-person/"[^>]*>${escapeRegExp(schedule.festsCallout.inPersonCta)}</a>`,
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
  assert.match(nav[0], /href="\/online\/"/);
  assert.match(sitemap, /\/online\//);
  assert.match(llms, /\.\/online\//);
  assert.ok(llmsFull.includes(online.intro));
});
