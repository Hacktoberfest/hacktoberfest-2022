import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import { faq } from '../src/data/content.mjs';
import { absoluteUrl } from '../src/data/meta.js';

/* A dedicated file, matching host-page.test.mjs rather than folding this
   into typeform-pages.test.mjs or llms-content.test.mjs: those two guard
   different concerns (outbound Typeform anchors, and llms-file/page copy
   parity) that /questions doesn't touch. /questions's own concern — that the page
   exports, is indexable, and carries its canonical URL — is exactly the
   shape host-page.test.mjs already established for /host. */

const readOutput = (path) =>
  readFile(new URL(`../out/${path}`, import.meta.url), 'utf8');

const escapeRegExp = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

test('/questions builds with its title and hero copy', async () => {
  const html = await readOutput('questions/index.html');
  const titlePattern = new RegExp(
    `<title[^>]*>${escapeRegExp(faq.page.title)}</title>`,
  );
  assert.match(html, titlePattern);
  assert.ok(html.includes(faq.page.eyebrow));
  assert.ok(html.includes(faq.page.intro));
});

test('/questions is indexable and carries its canonical URL', async () => {
  const html = await readOutput('questions/index.html');

  assert.match(html, /<meta name="robots" content="index, follow"/);

  const questionsUrl = absoluteUrl('/questions/');
  assert.match(
    html,
    new RegExp(`<link rel="canonical" href="${escapeRegExp(questionsUrl)}"`),
  );
});

test('/questions groups every item under its section heading', async () => {
  const html = await readOutput('questions/index.html');
  // React escapes text content on the way to static HTML — "&" in section
  // titles like "General & Mission Overview", quotes in questions like
  // `What is a "Fest"?` and apostrophes like "don't" — so both have to be
  // compared in their escaped form. Order matters: "&" first, so the
  // entities the other two replacements add aren't re-escaped.
  const rendered = (text) =>
    text.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;');

  faq.sections.forEach((section) => {
    assert.ok(
      html.includes(rendered(section.title)),
      `missing section: ${section.id}`,
    );
  });

  faq.items.forEach((item) => {
    assert.ok(
      html.includes(rendered(item.question)),
      `missing question: ${item.id}`,
    );
  });
});

test('the nav links to /questions/ as FAQs', async () => {
  const html = await readOutput('index.html');
  assert.match(html, /<a[^>]*href="\/questions\/"[^>]*>FAQs<\/a>/);
});
