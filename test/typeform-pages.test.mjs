import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const readOutput = (path) =>
  readFile(new URL(`../out/${path}`, import.meta.url), 'utf8');
const buttonFor = (label) => new RegExp(`<button[^>]*>${label}</button>`, 'g');
const linkTo = (href, label) =>
  new RegExp(`<a[^>]*href="${href}"[^>]*>${label}</a>`);
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

test('exports every visible homepage Typeform CTA as a button', async () => {
  const html = await readOutput('index.html');
  // Every host ask left this list as applications opened — the nav, the
  // hero CTA, the FAQ's organize answer and the Get Involved host card
  // all link to /host/ now, asserted below. What remains is the attendee
  // ask and the sponsor ask.
  const labels = ['Notify me about local Fests', 'Sponsor Hacktoberfest'];

  labels.forEach((label) => assert.match(html, buttonFor(label)));
  assertNoTypeformOutboundAnchors(html);
});

/* The homepage asks that graduated from interest popups to the hosting
   page. Pinned as anchors so none can quietly fall back to a form. */
test('every homepage host ask links to /host/', async () => {
  const html = await readOutput('index.html');

  const labels = [
    'Host a Fest in your city', // the hero CTA
    'Read about hosting a Fest', // the FAQ's organize answer
    'Host a Fest', // the Get Involved host card
  ];

  labels.forEach((label) =>
    assert.match(
      html,
      linkTo('/host/', label),
      `"${label}" should link to /host/`,
    ),
  );
  // An internal destination stays in the tab.
  assert.doesNotMatch(html, /<a[^>]*href="\/host\/"[^>]*target="_blank"/);
});

/* The header's CTA graduated twice: from a Typeform popup to a /host/
   link, then to "Apply to Host" — during Preptember the nav's one ask
   is the signed-in hub, and "Learn about Hosting" stands as the first
   plain link. These pages still carry no Typeform button at all — the
   sweep for outbound Typeform anchors is what remains. */
test('the header carries the Learn about Hosting link and the Apply to Host CTA', async () => {
  const pages = await Promise.all([
    readOutput('404.html'),
    readOutput('subscribed/index.html'),
    readOutput('host/index.html'),
  ]);

  pages.forEach((html) => {
    assert.match(html, /<a[^>]*href="\/host\/"[^>]*>Learn about Hosting<\/a>/);
    assert.match(html, /<a[^>]*href="\/my\/"[^>]*>Apply to Host<\/a>/);
    assertNoTypeformOutboundAnchors(html);
  });
});

/* The homepage nav dropped its section anchors — during Preptember the
   nav is three cross-page destinations, the same on every page. The
   sections themselves still exist with their ids; only the nav links to
   them are gone. */
test('the homepage nav carries no section anchor links', async () => {
  const html = await readOutput('index.html');

  const nav = html.match(
    /<nav[^>]*aria-label="Main navigation"[\s\S]*?<\/nav>/,
  );
  assert.ok(nav, 'the main navigation is missing from the homepage');

  assert.doesNotMatch(nav[0], /href="#(?!top)/);
  assert.match(nav[0], /<a[^>]*href="\/my\/"[^>]*>Apply to Host<\/a>/);
});
