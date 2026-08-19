import assert from 'node:assert/strict';
import test from 'node:test';

import { answerLinks, answerText, faq } from '../src/data/content.mjs';

test('every FAQ item has a stable id, a question and a non-empty answer', () => {
  assert.equal(faq.items.length, 5);

  const ids = faq.items.map((item) => item.id);
  assert.equal(new Set(ids).size, ids.length, 'ids must be unique');

  faq.items.forEach((item) => {
    assert.ok(item.question.length > 0, `${item.id} needs a question`);
    assert.ok(item.answer.length > 0, `${item.id} needs an answer`);
    item.answer.forEach((segment) =>
      assert.ok(segment.text.length > 0, `${item.id} has an empty segment`),
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

test('the organize answer sends the reader to the hosting page', () => {
  const organize = faq.items.find((item) => item.id === 'organize');

  assert.ok(organize, 'the organize question should still exist');
  assert.match(answerText(organize.answer), /applications are open/i);
  assert.deepEqual(answerLinks(organize.answer), ['/host/']);
});
