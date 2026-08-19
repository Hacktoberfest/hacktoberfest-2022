import assert from 'node:assert/strict';
import test from 'node:test';

import { answerLinks, answerText, faq } from '../src/data/content.mjs';

test('every FAQ item has a stable id, a question and a non-empty answer', () => {
  // 24 items across 6 sections, up from the homepage's original 5 — see
  // the /faq page design doc for the full set.
  assert.equal(faq.items.length, 24);

  const ids = faq.items.map((item) => item.id);
  assert.equal(new Set(ids).size, ids.length, 'ids must be unique');

  faq.items.forEach((item) => {
    assert.ok(item.question.length > 0, `${item.id} needs a question`);
    assert.ok(item.answer.length > 0, `${item.id} needs an answer`);
    item.answer.forEach((segment) => {
      // A markdown segment carries its prose in `markdown`, not `text`.
      const prose = segment.markdown ?? segment.text;
      assert.ok(prose.length > 0, `${item.id} has an empty segment`);
    });
  });
});

test('every item section resolves to a declared section', () => {
  const sectionIds = new Set(faq.sections.map((section) => section.id));

  faq.items.forEach((item) => {
    assert.ok(
      sectionIds.has(item.section),
      `${item.id} names an undeclared section: ${item.section}`,
    );
  });
});

test('every homepage id resolves to a real item', () => {
  faq.homepage.ids.forEach((id) => {
    assert.ok(
      faq.items.some((item) => item.id === id),
      `homepage.ids names an item that doesn't exist: ${id}`,
    );
  });
});

test('answerText joins the prose without leaking URLs into it', () => {
  const answer = [
    { text: 'Read the ' },
    { text: 'policy', href: 'https://example.com/policy' },
    { text: ' first.' },
  ];

  assert.equal(answerText(answer), 'Read the policy first.');
});

test('answerText on a markdown segment leaks no markup', () => {
  // fest-formats is the one answer that uses the markdown segment kind —
  // a numbered list with bold lead-ins — so it's the real-content case
  // that has to come out as plain prose for llms-full.txt and the content
  // tests to compare against the rendered page.
  const item = faq.items.find((entry) => entry.id === 'fest-formats');
  assert.ok(item, 'fest-formats should still exist');

  const text = answerText(item.answer);
  assert.doesNotMatch(text, /\*\*/);
  assert.doesNotMatch(text, /\]\(/);
  assert.doesNotMatch(text, /http/);
});

test('answerLinks collects link destinations in order', () => {
  const answer = [
    { text: 'One ' },
    { text: 'a', href: 'https://example.com/a' },
    { text: ' and ' },
    { text: 'b', href: 'https://example.com/b' },
  ];

  assert.deepEqual(answerLinks(answer), [
    'https://example.com/a',
    'https://example.com/b',
  ]);
});

test('answerLinks extracts the href from a markdown link', () => {
  const answer = [
    { markdown: 'See [the guide](https://example.com/guide) for more.' },
  ];

  assert.deepEqual(answerLinks(answer), ['https://example.com/guide']);
});

test('no answer reaches a Typeform through an href', () => {
  const segments = faq.items.flatMap((item) => item.answer);

  /* The organize answer traded its mailing-list popup for a link to
     /host/ when applications opened, so no answer names a form today.
     The rule this test exists for still holds whenever one comes back: a
     Typeform URL in an href would render as an anchor and fail the
     no-outbound-anchor rule in test/typeform-pages.test.mjs. */
  segments
    .filter((segment) => segment.href)
    .forEach((segment) =>
      assert.doesNotMatch(segment.href, /typeform\.com/i, segment.text),
    );
});

test('the hosting-application answer sends the reader to the MLH host portal', () => {
  // organize was retired in the FAQ restructure; how-to-apply-to-host is
  // its successor, and it links straight out to the host portal rather
  // than to /host/.
  const item = faq.items.find((entry) => entry.id === 'how-to-apply-to-host');

  assert.ok(item, 'the how-to-apply-to-host question should still exist');
  assert.match(answerText(item.answer), /host portal/i);
  assert.ok(
    answerLinks(item.answer).some((href) =>
      href.startsWith('https://organize.mlh.com/host/'),
    ),
    'the answer should link to the MLH host portal',
  );
});
