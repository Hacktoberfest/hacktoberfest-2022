import assert from 'node:assert/strict';
import test from 'node:test';

import { my } from '../src/data/content.mjs';
import { PARTNERS, usefulInfo } from '../src/lib/usefulInfo.mjs';

const copy = my.dashboard.usefulInfo;

/* The strings and links a host reads on the Useful info card, pinned to
   the spec (2026-09-28-fest-partner-useful-info-design.md, "Content").
   fest-dashboard-page.test.mjs checks none of them is baked into the static
   export. */

/* A prize line as a host reads it, and the links in it. */
const sentence = (pieces) =>
  pieces
    .map((piece) => (typeof piece === 'string' ? piece : piece.text))
    .join('');
const linksOut = (pieces) =>
  pieces.filter((piece) => typeof piece === 'object' && piece.href);
const packLinks = (pieces) =>
  pieces.filter((piece) => typeof piece === 'object' && piece.eventPack);

test('the card is called Useful info', () => {
  assert.equal(copy.title, 'Useful info');
});

test('the slides row names the deck it opens', () => {
  assert.equal(copy.slides.label, 'Slides');
  assert.equal(copy.slides.cta, 'View slides');
  assert.equal(
    copy.slides.hint(copy.decks.gemma.name),
    'Opening ceremony slides for your Gemma Hack Day.',
  );
  assert.equal(
    copy.slides.hint(copy.decks.meetUp.name),
    'Opening ceremony slides for your Meetup.',
  );
  assert.equal(
    copy.slides.hint(copy.decks.hackDay.name),
    'Opening ceremony slides for your Hack Day.',
  );
});

test('each deck is its mlh.link, untagged', () => {
  assert.deepEqual(
    Object.fromEntries(
      Object.entries(copy.decks).map(([key, deck]) => [key, deck.url]),
    ),
    {
      gemma: 'https://mlh.link/hacktoberfest-2026-gemma-slides',
      github: 'https://mlh.link/hacktoberfest-2026-github-slides',
      snowflake: 'https://mlh.link/hacktoberfest-2026-snowflake-slides',
      solana: 'https://mlh.link/hacktoberfest-2026-solana-slides',
      meetUp: 'https://mlh.link/hacktoberfest-2026-meetup-slides',
      hackDay: 'https://mlh.link/hacktoberfest-2026-hack-day-slides',
    },
  );
});

test('each deck has a name for the slides row', () => {
  assert.deepEqual(
    Object.fromEntries(
      Object.entries(copy.decks).map(([key, deck]) => [key, deck.name]),
    ),
    {
      gemma: 'Gemma Hack Day',
      github: 'GitHub Hack Day',
      snowflake: 'Snowflake Hack Day',
      solana: 'Solana Hack Day',
      meetUp: 'Meetup',
      hackDay: 'Hack Day',
    },
  );
});

test('the prizes are listed under their own label', () => {
  assert.equal(copy.prizesLabel, 'Prizes');
});

test('every prize line reads as the doc has it, except "(see Event pack)" and the challenge name', () => {
  const { lines } = copy;

  assert.equal(
    sentence(lines.openSourceAi),
    'You have a challenge as the Best Open-Source AI Project event. Award 4 Belt Bags to the winning team (see Event pack).',
  );
  assert.equal(
    sentence(lines.gemma),
    'Your event is a Gemma event. Award 4 Belt Bags to the winning team (see Event pack).',
  );
  assert.equal(
    sentence(lines.snowflake),
    'Your event is a Snowflake event. Award your Arduino Tiny Machine Learning Kits to the winning team.',
  );
  assert.equal(
    sentence(lines.github),
    'Your event is a GitHub event. Award your Wireless Headphones to the winning team (see Event pack).',
  );
  assert.equal(
    sentence(lines.solana),
    'Your event is a Solana event. Award your Ledger Nano S Plus kits to the winning team.',
  );
});

test('every prize line links its handbook page, untagged', () => {
  const links = Object.fromEntries(
    Object.entries(copy.lines).map(([key, pieces]) => [
      key,
      linksOut(pieces).map(({ text, href }) => ({ text, href })),
    ]),
  );

  assert.deepEqual(links, {
    openSourceAi: [
      {
        text: 'Best Open-Source AI Project',
        href: 'https://hacktoberfest-handbook.mlh.com/fest-planning-guide/open-source-prize-categories',
      },
    ],
    gemma: [
      {
        text: 'Your event is a Gemma event.',
        href: 'https://hacktoberfest-handbook.mlh.com/hack-days-partner-modules/partner-challenge-google-gemma',
      },
    ],
    snowflake: [
      {
        text: 'Your event is a Snowflake event.',
        href: 'https://hacktoberfest-handbook.mlh.com/hack-days-partner-modules/partner-challenge-snowflake-coco',
      },
    ],
    github: [
      {
        text: 'Your event is a GitHub event.',
        href: 'https://hacktoberfest-handbook.mlh.com/hack-days-partner-modules/partner-challenge-github-copilot',
      },
    ],
    solana: [
      {
        text: 'Your event is a Solana event.',
        href: 'https://hacktoberfest-handbook.mlh.com/hack-days-partner-modules/partner-challenge-solana',
      },
    ],
  });
});

/* "(see Event pack)" is the doc's "(see Package info)" renamed after the
   card, and it links to that card. The challenge name is "Best Open-Source
   AI Project" (the doc said "Best Use of OpenSource AI"). Snowflake's and
   Solana's prizes are not in the Event pack, so their lines have no such
   link. */
test('"Event pack" links to the card on the lines whose prizes are in it', () => {
  const withPackLink = Object.entries(copy.lines)
    .filter(([, pieces]) => packLinks(pieces).length > 0)
    .map(([key]) => key);

  assert.deepEqual(withPackLink, ['openSourceAi', 'gemma', 'github']);

  for (const key of withPackLink) {
    assert.deepEqual(packLinks(copy.lines[key]), [
      { text: 'Event pack', eventPack: true },
    ]);
  }
});

test('every deck and line the resolver can pick has copy', () => {
  const inputs = [
    { format: 'meetUp', partners: [] },
    { format: 'hackDay', partners: [] },
    ...PARTNERS.map((key) => ({ format: 'hackDay', partners: [key] })),
  ];

  for (const input of inputs) {
    const { deck, lines } = usefulInfo(input);

    assert.ok(copy.decks[deck], `no deck copy for ${deck}`);
    for (const id of lines) {
      assert.ok(copy.lines[id], `no line copy for ${id}`);
    }
  }

  // And nothing in the copy that the resolver can never pick.
  assert.deepEqual(
    Object.keys(copy.decks).sort(),
    [...PARTNERS, 'hackDay', 'meetUp'].sort(),
  );
  assert.deepEqual(
    Object.keys(copy.lines).sort(),
    [...PARTNERS, 'openSourceAi'].sort(),
  );
});

test('every link is https and carries no utm params', () => {
  const urls = [
    ...Object.values(copy.decks).map((deck) => deck.url),
    ...Object.values(copy.lines).flatMap((pieces) =>
      linksOut(pieces).map((piece) => piece.href),
    ),
  ];

  assert.equal(urls.length, 11);
  for (const url of urls) {
    assert.match(url, /^https:\/\//, url);
    assert.doesNotMatch(url, /utm_/, url);
  }
});

test('no string carries an em dash', () => {
  const strings = JSON.stringify(copy) + copy.slides.hint('Hack Day');
  assert.ok(!strings.includes('—'), 'an em dash crept into the copy');
});
