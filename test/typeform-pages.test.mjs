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

/* The homepage's host ask, graduated from an interest popup to the
   hosting page. Pinned as an anchor so it cannot quietly fall back to a
   form.

   The FAQ's organize answer used to be one — it linked to /host/ — but
   the FAQ restructure retired it. Its successor, how-to-apply-to-host,
   links straight out to the MLH host portal instead (see
   test/faq-content.test.mjs). The Get involved card was the other, and it
   left the homepage with the October redesign, which leaves the
   in-person world's own nav entry, "Host a Fest", as the homepage's host
   ask. */
test('every homepage host ask links to /host/', async () => {
  const html = await readOutput('index.html');

  assert.match(
    html,
    /<a[^>]*href="\/host\/"[^>]*>(?:(?!<\/a>).)*Host a Fest/,
    '"Host a Fest" should link to /host/',
  );
  // An internal destination stays in the tab.
  assert.doesNotMatch(html, /<a[^>]*href="\/host\/"[^>]*target="_blank"/);
});

/* The online asks: the hero's line for anyone with no Fest nearby, and
   the online band's button, both to the online world's overview, and the
   band's cards to the schedule. */
test('the homepage online asks link to /online/ and /schedule/', async () => {
  const html = await readOutput('index.html');

  assert.match(
    html,
    linkTo(
      '/online/',
      'Join online from anywhere and get swag shipped to your door',
    ),
    'the hero online link should lead to /online/',
  );
  assert.match(
    html,
    linkTo('/online/', 'Attend online'),
    'the online band CTA should lead to /online/',
  );
  assert.match(html, linkTo('/schedule/', 'See the schedule'));
  assert.doesNotMatch(
    html,
    /<a[^>]*href="\/(?:online|schedule)\/"[^>]*target="_blank"/,
  );
});

/* The attendee ask, the last popup on the page, is the hero's search in
   October: a real GET form to the directory with the query as `q`, the
   parameter /fests/ reads, so it works before any JavaScript does. Pinned
   so nothing can quietly fall back to a popup, with the soonest Fests'
   own link to the directory beside it. */
test('the homepage attendee ask searches /fests/', async () => {
  const html = await readOutput('index.html');

  const form = html.match(/<form\b[^>]*role="search"[^>]*>/);
  assert.ok(form, 'the hero search form is missing');
  assert.match(form[0], /action="\/fests\/"/);
  assert.match(form[0], /method="get"/);
  assert.match(html, /<input\b[^>]*name="q"/);
  assert.match(
    html,
    buttonFor('<span[^>]*>Find a Fest</span><span[^>]*>Find</span>'),
  );
  assert.doesNotMatch(html, /<a[^>]*href="\/fests\/"[^>]*target="_blank"/);
});

/* The header's CTA graduated twice: from a Typeform popup to a /host/
   link, then to "Apply to Host" during Preptember. Preptember is over on
   this branch, so the chip reads "My Hacktoberfest" and leads to the
   signed-in hub; "Host a Fest" (behind the Attend in-person dropdown)
   stands as the in-person world's second destination, after Find a Fest.
   These pages still carry no Typeform button at all — the sweep for
   outbound Typeform anchors is what remains. */
test('the header carries Find a Fest, Host a Fest and the My Hacktoberfest CTA', async () => {
  const pages = await Promise.all([
    readOutput('404.html'),
    readOutput('subscribed/index.html'),
    readOutput('host/index.html'),
  ]);

  pages.forEach((html) => {
    /* The label is the anchor's first span; the description follows it. */
    assert.match(
      html,
      /<a[^>]*href="\/fests\/"[^>]*>(?:<span[^>]*>)?Find a Fest<\/span>/,
    );
    assert.match(
      html,
      /<a[^>]*href="\/host\/"[^>]*>(?:<span[^>]*>)?Host a Fest<\/span>/,
    );
    assert.match(html, /<a[^>]*href="\/my\/"[^>]*>\s*My Hacktoberfest\s*<\/a>/);
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
