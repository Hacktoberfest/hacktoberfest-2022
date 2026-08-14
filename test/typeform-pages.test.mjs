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

test('exports every visible homepage Typeform CTA as a button', async () => {
  const html = await readOutput('index.html');
  // The nav and hero CTAs share the "Host a Fest" label.
  // 'Host a Fest' now labels both the nav CTA and the host card's button.
  const labels = [
    'Host a Fest',
    'Host a Fest in your city',
    'Notify me about local Fests',
    'Sponsor Hacktoberfest',
    'sign up for our mailing list',
  ];

  labels.forEach((label) => assert.match(html, buttonFor(label)));
  assertNoTypeformOutboundAnchors(html);
});

test('exports the standalone header CTA as a button', async () => {
  const pages = await Promise.all([
    readOutput('404.html'),
    readOutput('subscribed/index.html'),
  ]);

  pages.forEach((html) => {
    assert.match(html, buttonFor('Host a Fest'));
    assertNoTypeformOutboundAnchors(html);
  });
});
