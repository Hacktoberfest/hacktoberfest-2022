import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const readOutput = (path) =>
  readFile(new URL(`../out/${path}`, import.meta.url), 'utf8');
const buttonFor = (label) => new RegExp(`<button[^>]*>${label}</button>`, 'g');
const typeformOutboundAnchor =
  /<a\b[^>]*\shref=["'](?:https?:)?\/\/(?:[a-z0-9-]+\.)+typeform\.(?:com|eu)\/to\/[^"']*["'][^>]*>/i;
const assertNoTypeformOutboundAnchors = (html) =>
  assert.doesNotMatch(html, typeformOutboundAnchor);

test('rejects Typeform outbound URLs only when they are anchor href values', () => {
  assert.throws(
    () =>
      assertNoTypeformOutboundAnchors(
        '<a href="https://other.typeform.eu/to/example">Open form</a>',
      ),
    assert.AssertionError,
  );
  assert.throws(
    () =>
      assertNoTypeformOutboundAnchors(
        '<a href="https://other.typeform.com/to/example">Open form</a>',
      ),
    assert.AssertionError,
  );
  assert.throws(
    () =>
      assertNoTypeformOutboundAnchors(
        '<a href="//other.typeform.com/to/example">Open form</a>',
      ),
    assert.AssertionError,
  );
  assertNoTypeformOutboundAnchors(
    '<script>https://other.typeform.com/to/example</script>',
  );
  assertNoTypeformOutboundAnchors(
    '<button href="https://other.typeform.com/to/example">Open form</button>',
  );
});

/* The homepage carries no Typeform popup at all now. Every host ask left
   as applications opened and links to /host/, asserted below. The
   attendee ask was the last one standing, and it graduated to /fests/
   when the directory opened: "Notify me about local Fests" became the
   published Fests, and in October the hero's search, not a popup
   collecting an address against Fests nobody could see. */
test('the homepage opens no Typeform popup', async () => {
  const html = await readOutput('index.html');

  assert.doesNotMatch(html, buttonFor('Notify me about local Fests'));
  assert.doesNotMatch(html, /data-tf-popup/);
  assertNoTypeformOutboundAnchors(html);
});

/* After October the hero asks nothing: the thank-you, the map and the
   numbers, with the header's My Hacktoberfest chip the way to the sticker
   book. The online asks and the hero's search to /fests/ went with the
   pages they led to (src/data/retiredRoutes.mjs); test/retired-pages
   holds the homepage to linking none of them. */
test('the homepage hero has no ask; the header leads to /my/', async () => {
  const html = await readOutput('index.html');
  const hero = html.match(
    /<section[^>]*aria-labelledby="home-hero-title"[\s\S]*?<\/section>/,
  );

  assert.ok(hero, 'the hero is missing');
  assert.doesNotMatch(hero[0], /href="\/my\/"/);
  assert.doesNotMatch(hero[0], /<form\b/);
  assert.match(html, /<a[^>]*href="\/my\/"[^>]*>\s*My Hacktoberfest\s*<\/a>/);
});

/* The header's CTA graduated twice: from a Typeform popup to a /host/
   link, then to "Apply to Host" during Preptember. Preptember is over on
   this branch, so the chip reads "My Hacktoberfest" and leads to the
   signed-in hub. Find a Fest and Host a Fest left the nav with the pages
   they pointed at (src/data/retiredRoutes.mjs). These pages still carry
   no Typeform button at all; the sweep for outbound Typeform anchors is
   what remains. */
test('the header carries the My Hacktoberfest CTA and no retired destination', async () => {
  const pages = await Promise.all([
    readOutput('404.html'),
    readOutput('signed-out/index.html'),
  ]);

  pages.forEach((html) => {
    assert.match(html, /<a[^>]*href="\/my\/"[^>]*>\s*My Hacktoberfest\s*<\/a>/);
    assert.doesNotMatch(html, /<a[^>]*href="\/(?:fests|host)\/"/);
    assertNoTypeformOutboundAnchors(html);
  });
});

/* The homepage nav dropped its section anchors — it is cross-page
   destinations only now, the same set on every page. The sections
   themselves still exist with their ids; only the nav links to them are
   gone. */
test('the homepage nav carries no section anchor links', async () => {
  const html = await readOutput('index.html');

  const nav = html.match(
    /<nav[^>]*aria-label="Main navigation"[\s\S]*?<\/nav>/,
  );
  assert.ok(nav, 'the main navigation is missing from the homepage');

  assert.doesNotMatch(nav[0], /href="#(?!top)/);
  assert.match(nav[0], /<a[^>]*href="\/my\/"[^>]*>\s*My Hacktoberfest\s*<\/a>/);
});
