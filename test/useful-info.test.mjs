import assert from 'node:assert/strict';
import test from 'node:test';

import { PARTNERS, usefulInfo } from '../src/lib/usefulInfo.mjs';

/* The spec's "What the host sees" table, one row per case. The format
   decides first and a Meetup never shows a partner or a prize; a Hack Day
   always has the Open-Source AI line and at most one partner, Gemma first,
   then GitHub, Snowflake, Solana. Partner lists are written out of
   precedence order on purpose: the order MLH lists them in must never
   matter. */

const ALL_FOUR = ['solana', 'snowflake', 'github', 'gemma'];

const GENERIC = { deck: 'hackDay', lines: ['openSourceAi'] };
const MEETUP = { deck: 'meetUp', lines: [] };
const partnered = (key) => ({ deck: key, lines: ['openSourceAi', key] });

const CASES = [
  // A Meetup, whatever partners MLH lists.
  ['a Meetup with no partner', { format: 'meetUp', partners: [] }, MEETUP],
  ['a Meetup with Gemma', { format: 'meetUp', partners: ['gemma'] }, MEETUP],
  [
    'a Meetup with all four partners',
    { format: 'meetUp', partners: ALL_FOUR },
    MEETUP,
  ],

  // A Hack Day with Gemma, alone or with others.
  [
    'a Hack Day with Gemma alone',
    { format: 'hackDay', partners: ['gemma'] },
    partnered('gemma'),
  ],
  [
    'Gemma wins over GitHub',
    { format: 'hackDay', partners: ['github', 'gemma'] },
    partnered('gemma'),
  ],
  [
    'Gemma wins over Snowflake',
    { format: 'hackDay', partners: ['snowflake', 'gemma'] },
    partnered('gemma'),
  ],
  [
    'Gemma wins over Solana',
    { format: 'hackDay', partners: ['solana', 'gemma'] },
    partnered('gemma'),
  ],
  [
    'Gemma wins over all three others',
    { format: 'hackDay', partners: ALL_FOUR },
    partnered('gemma'),
  ],

  // A Hack Day whose one partner is someone else.
  [
    'a Hack Day whose one partner is Snowflake',
    { format: 'hackDay', partners: ['snowflake'] },
    partnered('snowflake'),
  ],
  [
    'a Hack Day whose one partner is GitHub',
    { format: 'hackDay', partners: ['github'] },
    partnered('github'),
  ],
  [
    'a Hack Day whose one partner is Solana',
    { format: 'hackDay', partners: ['solana'] },
    partnered('solana'),
  ],

  // Without Gemma: GitHub, then Snowflake, then Solana.
  [
    'without Gemma, GitHub wins over Snowflake',
    { format: 'hackDay', partners: ['snowflake', 'github'] },
    partnered('github'),
  ],
  [
    'without Gemma, GitHub wins over Solana',
    { format: 'hackDay', partners: ['solana', 'github'] },
    partnered('github'),
  ],
  [
    'without Gemma, Snowflake wins over Solana',
    { format: 'hackDay', partners: ['solana', 'snowflake'] },
    partnered('snowflake'),
  ],
  [
    'without Gemma, GitHub wins over Snowflake and Solana',
    { format: 'hackDay', partners: ['solana', 'snowflake', 'github'] },
    partnered('github'),
  ],

  // A Hack Day with no partner.
  ['a Hack Day with no partner', { format: 'hackDay', partners: [] }, GENERIC],

  // Anything that is not one of the four keys is not a partner.
  [
    'unknown partner strings are ignored',
    { format: 'hackDay', partners: ['digitalocean', 'hacktoberfest', 'Gemma'] },
    GENERIC,
  ],
  [
    'an unknown string beside a known partner is ignored',
    { format: 'hackDay', partners: ['digitalocean', 'solana'] },
    partnered('solana'),
  ],
  [
    'entries that are not strings are ignored',
    { format: 'hackDay', partners: [null, 42, {}, 'github'] },
    partnered('github'),
  ],
  [
    'a partner listed twice is still one partner',
    { format: 'hackDay', partners: ['gemma', 'gemma'] },
    partnered('gemma'),
  ],
];

for (const [name, input, expected] of CASES) {
  test(`usefulInfo: ${name}`, () => {
    assert.deepEqual(usefulInfo(input), expected);
  });
}

/* Format unknown, or an API from before partners: no card. */
const HIDDEN = [
  ['the format is unknown', { format: null, partners: [] }],
  [
    'the format is unknown, with partners',
    { format: null, partners: ['gemma'] },
  ],
  ['the format key is absent', { partners: ['gemma'] }],
  ['the format is not one of the two', { format: 'hackathon', partners: [] }],
  ['the format is the wrong case', { format: 'HackDay', partners: [] }],
  ['the partners key is absent on a Hack Day', { format: 'hackDay' }],
  ['the partners key is absent on a Meetup', { format: 'meetUp' }],
  ['partners is a string', { format: 'hackDay', partners: 'gemma' }],
  ['partners is null', { format: 'meetUp', partners: null }],
  ['neither key is there', {}],
];

for (const [name, input] of HIDDEN) {
  test(`usefulInfo: no card when ${name}`, () => {
    assert.equal(usefulInfo(input), null);
  });
}

test('usefulInfo: no card when there is no dashboard at all', () => {
  assert.equal(usefulInfo(null), null);
  assert.equal(usefulInfo(undefined), null);
});

test('the partner keys are the four, in precedence order', () => {
  assert.deepEqual(PARTNERS, ['gemma', 'github', 'snowflake', 'solana']);
});
