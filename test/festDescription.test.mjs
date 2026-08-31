import assert from 'node:assert/strict';
import test from 'node:test';

import { parseFestDescription } from '../src/lib/festDescription.mjs';

const textOf = (parts) => parts.map((part) => part.text).join('');

test('plain prose is one paragraph', () => {
  assert.deepEqual(parseFestDescription('Come and hack with us.'), [
    { type: 'paragraph', parts: [{ text: 'Come and hack with us.' }] },
  ]);
});

test('a blank line opens a new paragraph, CRLF included', () => {
  // Every host description in the live payload uses CRLF: Organizer HQ is a
  // Rails textarea.
  const blocks = parseFestDescription('First para.\r\n\r\nSecond para.');

  assert.equal(blocks.length, 2);
  assert.equal(textOf(blocks[0].parts), 'First para.');
  assert.equal(textOf(blocks[1].parts), 'Second para.');
});

test('a wrapped line is one paragraph, as markdown reads it', () => {
  const blocks = parseFestDescription('We meet at nine\nby the main gate.');

  assert.equal(blocks.length, 1);
  assert.equal(textOf(blocks[0].parts), 'We meet at nine by the main gate.');
});

test('nothing at all is no blocks, so the format blurb can stand in', () => {
  assert.deepEqual(parseFestDescription(''), []);
  assert.deepEqual(parseFestDescription('   \r\n  '), []);
  assert.deepEqual(parseFestDescription(null), []);
  assert.deepEqual(parseFestDescription(undefined), []);
});

// --- inline markup --------------------------------------------------------

test('**bold** and *italic* become parts, not asterisks', () => {
  const [block] = parseFestDescription(
    'Doors at **9am**, talks are *optional*.',
  );

  assert.deepEqual(block.parts, [
    { text: 'Doors at ' },
    { text: '9am', bold: true },
    { text: ', talks are ' },
    { text: 'optional', italic: true },
    { text: '.' },
  ]);
});

test('bold wins over italic, so ** is never read as two lone asterisks', () => {
  const [block] = parseFestDescription('**Saturday** only');

  assert.deepEqual(block.parts, [
    { text: 'Saturday', bold: true },
    { text: ' only' },
  ]);
});

test('underscores are prose, not italics', () => {
  // Nobody writes _italics_ and everybody writes file_names_like_this.
  const [block] = parseFestDescription('Fork the repo_starter_kit today.');

  assert.deepEqual(block.parts, [{ text: 'Fork the repo_starter_kit today.' }]);
});

test('a link becomes a link', () => {
  const [block] = parseFestDescription(
    'See [the schedule](https://example.org/s).',
  );

  assert.deepEqual(block.parts, [
    { text: 'See ' },
    { text: 'the schedule', href: 'https://example.org/s' },
    { text: '.' },
  ]);
});

test('mailto links are followed too', () => {
  const [block] = parseFestDescription('Ask [us](mailto:hi@example.org).');

  assert.equal(block.parts[1].href, 'mailto:hi@example.org');
});

// --- the part that matters: this text belongs to a stranger ---------------

test('a link we would not follow stays prose, whole', () => {
  // The href is the one part of a description a browser acts on rather than
  // displays, and this text arrives from a host through two APIs.
  for (const href of [
    'javascript:alert(1)',
    'JavaScript:alert(1)',
    'data:text/html;base64,PHNjcmlwdD4=',
    'vbscript:msgbox(1)',
    '/my/account',
  ]) {
    const [block] = parseFestDescription(`Click [here](${href}) now`);

    assert.equal(
      textOf(block.parts),
      `Click [here](${href}) now`,
      `${href} should not become a link`,
    );
    assert.ok(
      block.parts.every((part) => part.href === undefined),
      `${href} should not become a link`,
    );
  }
});

test('html a host writes is text, because nothing here builds html', () => {
  const raw = 'Hack with us <script>alert(1)</script> <img src=x onerror=y>';
  const [block] = parseFestDescription(raw);

  assert.deepEqual(block.parts, [{ text: raw }]);
});

// --- lists ---------------------------------------------------------------

test('a hyphen run becomes a bullet list', () => {
  const blocks = parseFestDescription(
    'The day:\r\n- Git basics\r\n- Your first PR\r\n- Pizza',
  );

  assert.equal(blocks.length, 2);
  assert.equal(blocks[0].type, 'paragraph');
  assert.equal(blocks[1].type, 'bulletList');
  assert.deepEqual(
    blocks[1].items.map((item) => textOf(item.parts)),
    ['Git basics', 'Your first PR', 'Pizza'],
  );
});

test('asterisk and plus bullets count too', () => {
  for (const marker of ['*', '+']) {
    const blocks = parseFestDescription(`${marker} One\n${marker} Two`);
    assert.equal(blocks[0].type, 'bulletList', `${marker} should open a list`);
    assert.equal(blocks[0].items.length, 2);
  }
});

test('a numbered run becomes an ordered list, either punctuation', () => {
  for (const source of ['1. One\n2. Two', '1) One\n2) Two']) {
    const [block] = parseFestDescription(source);
    assert.equal(block.type, 'orderedList');
    assert.deepEqual(
      block.items.map((item) => textOf(item.parts)),
      ['One', 'Two'],
    );
  }
});

test('list items carry their own inline markup', () => {
  const [block] = parseFestDescription('- **Bring** a [laptop](https://x.org)');

  assert.deepEqual(block.items[0].parts, [
    { text: 'Bring', bold: true },
    { text: ' a ' },
    { text: 'laptop', href: 'https://x.org' },
  ]);
});

test('prose after a list starts a paragraph again', () => {
  const blocks = parseFestDescription('- One\n- Two\n\nSee you there.');

  assert.deepEqual(
    blocks.map((block) => block.type),
    ['bulletList', 'paragraph'],
  );
});

test('a heading loses its hashes and reads as a bold line', () => {
  const [block] = parseFestDescription('## Schedule');

  assert.deepEqual(block, {
    type: 'paragraph',
    parts: [{ text: 'Schedule', bold: true }],
  });
});

// --- the real thing ------------------------------------------------------

test('a live host description survives intact', () => {
  // Kampala x MUBS, verbatim from MLH's API on 2026-08-31, trimmed.
  const blocks = parseFestDescription(
    'Hacktoberfest Hack Day Kampala x MUBS is a one-day open source hack day.\r\n\r\nWhat to bring:\r\n- A laptop\r\n- A GitHub account\r\n\r\nNo experience needed.',
  );

  assert.deepEqual(
    blocks.map((block) => block.type),
    ['paragraph', 'paragraph', 'bulletList', 'paragraph'],
  );
  assert.deepEqual(
    blocks[2].items.map((item) => textOf(item.parts)),
    ['A laptop', 'A GitHub account'],
  );
});
