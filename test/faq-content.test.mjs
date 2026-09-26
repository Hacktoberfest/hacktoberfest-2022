import assert from 'node:assert/strict';
import test from 'node:test';

import {
  answerLinks,
  answerText,
  faq,
  parseAnswerMarkdown,
} from '../src/data/content.mjs';

test('every FAQ item has a stable id, a question and a non-empty answer', () => {
  // 33 items across 5 sections: the participant FAQ's 30 (2026-09-26), plus
  // how-2026-differs and get-involved-in-open-source, the two pull-request
  // questions carried over from the host-era FAQ, and sticker-pack-arrival,
  // restored from it on request.
  assert.equal(faq.items.length, 33);

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
  // how-to-take-part is the answer that uses the markdown segment kind — a
  // paragraph, a bulleted list with bold lead-ins, and a closing line — so
  // it's the real-content case that has to come out as plain prose for
  // llms-full.txt and the content tests to compare against the rendered
  // page.
  const item = faq.items.find((entry) => entry.id === 'how-to-take-part');
  assert.ok(item, 'how-to-take-part should still exist');

  const text = answerText(item.answer);
  assert.doesNotMatch(text, /\*\*/);
  assert.doesNotMatch(text, /\]\(/);
  assert.doesNotMatch(text, /http/);
  assert.doesNotMatch(text, /(^|\s)- /, 'no bullet markers');
  assert.doesNotMatch(text, / {2}/, 'blank lines leave no double spaces');
  assert.match(text, /DEV Challenges\. In person: Find a Fest/);
});

test('parseAnswerMarkdown splits blocks on blank lines', () => {
  const blocks = parseAnswerMarkdown(
    'Intro with [a link](/my/).\n\n- **One:** first\n- Two\n\n1. Uno\n2. Dos\n\nOutro',
  );

  assert.deepEqual(
    blocks.map((block) => block.type),
    ['paragraph', 'bulletList', 'orderedList', 'paragraph'],
  );
  assert.deepEqual(blocks[0].parts, [
    { text: 'Intro with ' },
    { text: 'a link', href: '/my/' },
    { text: '.' },
  ]);
  assert.deepEqual(blocks[1].items[0].parts, [
    { text: 'One:', bold: true },
    { text: ' first' },
  ]);
  assert.equal(blocks[2].items.length, 2);
});

test('parseAnswerMarkdown keeps a single line as one paragraph', () => {
  assert.deepEqual(parseAnswerMarkdown('Just **one** line.'), [
    {
      type: 'paragraph',
      parts: [
        { text: 'Just ' },
        { text: 'one', bold: true },
        { text: ' line.' },
      ],
    },
  ]);
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

/* The FAQ is for participants now. The host-era questions (applying,
   venues, reimbursement, OrganizerHQ, deliverables, sponsorship) left with
   the 2026-09-26 rewrite, and the house term for the people running a Fest
   stays "host" throughout. */
test('the FAQ speaks to participants, and calls Fest runners hosts', () => {
  faq.items.forEach((item) => {
    const text = `${item.question} ${answerText(item.answer)}`;
    assert.doesNotMatch(text, /organi[sz]er/i, item.id);
    assert.doesNotMatch(text, /reimburse|OrganizerHQ|sponsor/i, item.id);
  });
});

test('the pull request answer says PRs no longer count, up front', () => {
  const item = faq.items.find(
    (entry) => entry.id === 'still-submit-pull-requests',
  );

  assert.ok(item);
  assert.equal(item.section, 'pull-requests');
  assert.match(
    answerText(item.answer),
    /^Pull requests and merge requests will no longer count/,
  );
  assert.ok(faq.homepage.ids.includes('still-submit-pull-requests'));
});

test('help answers route to the right MLH inbox', () => {
  const links = (id) =>
    answerLinks(faq.items.find((entry) => entry.id === id).answer);

  assert.deepEqual(links('general-help'), ['mailto:hacktoberfest@mlh.io']);
  assert.deepEqual(links('report-a-concern'), ['mailto:incidents@mlh.io']);
});
