/* Which opening ceremony deck, and which prize lines, a host sees in the
   Useful info card on /my/fest/.

   The API sends facts: the Fest's format ('hackDay', 'meetUp', or null when
   neither the host's application nor the name could place it) and every
   partner MLH lists on the event. The rules that turn those facts into a
   deck live here and only here, next to the copy they pick from
   (my.dashboard.usefulInfo in data/content.mjs):

   - A Meetup gets the Meetup deck and nothing else, whatever partners MLH
     lists. The API already blanks partners for anything that is not a Hack
     Day; this holds the rule again so a wrong payload cannot put prizes in
     front of a Meetup.
   - A Hack Day always has the Best Open-Source AI Project challenge, and at
     most one partner: Gemma if it is there, otherwise GitHub, then
     Snowflake, then Solana. The deck follows the partner, or is the generic
     Hack Day deck without one.
   - Anything else is null, and the card is not shown: an unknown format,
     or an API from before partners, which sends no `format` or `partners`
     at all. The wrong deck on a projector costs a host more than no card. */

/* The partner keys, in precedence order. The same four keys FestNet
   mirrors off MLH's sponsorships; anything else in the list is ignored. */
export const PARTNERS = Object.freeze([
  'gemma',
  'github',
  'snowflake',
  'solana',
]);

export const usefulInfo = (input) => {
  const { format, partners } = input || {};

  if (!Array.isArray(partners)) return null;
  if (format === 'meetUp') return { deck: 'meetUp', lines: [] };
  if (format !== 'hackDay') return null;

  const partner = PARTNERS.find((key) => partners.includes(key));

  return partner
    ? { deck: partner, lines: ['openSourceAi', partner] }
    : { deck: 'hackDay', lines: ['openSourceAi'] };
};
