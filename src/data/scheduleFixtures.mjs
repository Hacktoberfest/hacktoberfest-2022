/* Mock schedule for the mocked build (API_BASE_URL unset), in the API's own
   payload shape rather than the flat shape the page renders — getSchedule maps
   fixtures through scheduleEventFrom exactly as it maps a live response, so
   the mocked build exercises the normaliser instead of bypassing it.

   `example.invalid` throughout: the reserved-TLD convention the Fest fixtures
   already use, so a placeholder URL can never resolve and is never mistaken
   for a broken real link.

   Three types, which is the whole taxonomy: a workshop, a ceremony and a
   showcase are all `livestream`; the DEV rounds are `challenge`; Global Hack
   Week is the one `event`. The unknown-type fallback is exercised by
   test/schedule-types.test.mjs directly rather than by a fixture pretending to
   a type the schedule does not have.

   The set mirrors the real shape of October 2026 as it has been described:

     - one `feature`, Global Hack Week, running Fri 9 to Thu 15. The sessions
       inside those dates belong to it, and nothing else is scheduled then.
     - four `round`s, the DEV challenge's weekly submission windows, opening
       each Monday. Round 2's dates overlap Global Hack Week and it still sits
       in the open stream — a challenge is never Hack Week programming, and
       the overlap is kept so that rule stays exercised.
     - `session`s either side: the two ceremonies and a handful of streams and
       workshops.

   test/schedule-content.test.mjs asserts that coverage, so removing an entry
   fails there rather than quietly deleting a state nobody can reach again. */
export const SCHEDULE_FIXTURES = [
  {
    id: 'opening-ceremony',
    name: 'Opening Ceremony',
    description:
      'Hacktoberfest 2026 officially begins. What the month looks like, and how to take part.',
    type: 'livestream',
    kind: 'session',
    startsAt: '2026-10-01T15:00:00Z',
    endsAt: '2026-10-01T16:00:00Z',
    allDay: false,
    logoUrl: 'https://example.invalid/hacktoberfest/logos/hacktoberfest.png',
    url: 'https://example.invalid/hacktoberfest/opening',
    host: 'MLH x DEV',
  },
  {
    id: 'intro-open-source',
    name: 'Intro to Open Source',
    description:
      'A beginner session on finding a project, reading a contributing guide, and opening a first pull request.',
    type: 'livestream',
    kind: 'session',
    startsAt: '2026-10-02T17:00:00Z',
    endsAt: '2026-10-02T18:30:00Z',
    allDay: false,
    logoUrl: 'https://example.invalid/hacktoberfest/logos/dev.png',
    url: 'https://example.invalid/hacktoberfest/intro-open-source',
    host: 'DEV',
  },
  /* Round 1: the first submission window, opening the first Monday. Oct 1-4
     sits before it, which is why the ceremony above belongs to no round. */
  {
    id: 'dev-round-1',
    name: 'DEV Challenges',
    description:
      'Build something with open source AI and write it up on DEV. Submit by Sunday to be judged in this round.',
    type: 'challenge',
    kind: 'round',
    startsAt: '2026-10-05T00:00:00Z',
    endsAt: '2026-10-11T23:59:00Z',
    allDay: true,
    /* The challenge itself carries no sponsor mark — sponsorship rides on
       individual livestreams, not on the rounds. */
    logoUrl: null,
    url: 'https://example.invalid/hacktoberfest/challenge/1',
    host: 'DEV',
  },
  {
    id: 'maintainer-stream',
    name: 'Maintainers Live',
    description:
      'Maintainers review incoming pull requests on stream and talk through what makes a good one.',
    type: 'livestream',
    kind: 'session',
    startsAt: '2026-10-07T19:00:00Z',
    endsAt: '2026-10-07T20:00:00Z',
    allDay: false,
    /* No logo: the cards and the modal both have to hold their shape without
       one, and fall back to the host's initials. */
    logoUrl: null,
    url: 'https://example.invalid/hacktoberfest/maintainers-live',
    host: 'MLH',
  },
  /* The feature. Everything dated inside it below belongs to it. */
  {
    id: 'global-hack-week',
    name: 'Global Hack Week',
    description:
      'A week of building with open source AI: daily sessions, workshops, and a project to ship by the end of it.',
    type: 'event',
    kind: 'feature',
    startsAt: '2026-10-09T13:00:00Z',
    endsAt: '2026-10-15T22:00:00Z',
    allDay: false,
    /* The real lockup, not a placeholder: Global Hack Week is a fixed, known
       headline rather than a Fest whose branding arrives from an API, and it
       is the one logo whose shape the layout has to survive — 9.6:1, with the
       event's own name set into it. In production the API supplies this the
       same as any other logoUrl; shipping the asset means the mocked build
       shows the real thing. */
    logoUrl: '/schedule/global-hack-week.png',
    /* The event's own name as artwork, not a sponsor credit: the image already
       sets "GLOBAL HACK WEEK", so it replaces the wordmark rather than sitting
       beside it. */
    logoKind: 'name',
    url: 'https://example.invalid/hacktoberfest/ghw',
    host: 'MLH',
  },
  {
    id: 'ghw-kickoff',
    name: 'Hack Week Kickoff',
    description: 'What the week holds, and how to pick something to build.',
    type: 'livestream',
    kind: 'session',
    startsAt: '2026-10-09T15:00:00Z',
    endsAt: '2026-10-09T16:00:00Z',
    allDay: false,
    logoUrl: 'https://example.invalid/hacktoberfest/logos/mlh.png',
    url: 'https://example.invalid/hacktoberfest/ghw/kickoff',
    host: 'MLH',
  },
  /* Overlaps the feature and is deliberately NOT claimed by it — see the
     claiming rule in lib/scheduleAgenda.mjs. */
  {
    id: 'dev-round-2',
    name: 'DEV Challenges',
    description:
      'Build something with open source AI and write it up on DEV. Submit by Sunday to be judged in this round.',
    type: 'challenge',
    kind: 'round',
    startsAt: '2026-10-12T00:00:00Z',
    endsAt: '2026-10-18T23:59:00Z',
    allDay: true,
    /* The challenge itself carries no sponsor mark — sponsorship rides on
       individual livestreams, not on the rounds. */
    logoUrl: null,
    url: 'https://example.invalid/hacktoberfest/challenge/2',
    host: 'DEV',
  },
  {
    id: 'open-models-workshop',
    name: 'Building with Open Models',
    description:
      'Hands on with open-weight models: running one locally, then wiring it into something small.',
    type: 'livestream',
    kind: 'session',
    startsAt: '2026-10-12T16:00:00Z',
    endsAt: '2026-10-12T18:00:00Z',
    allDay: false,
    /* A sponsored livestream: individual sessions can be backed, and the
       credit slot is theirs. This one sits inside Global Hack Week, so the
       mocked build shows a credit on both grounds. */
    logoUrl: '/sponsors/snowflake.svg',
    url: 'https://example.invalid/hacktoberfest/open-models',
    host: 'DEV',
  },
  {
    id: 'agents-workshop',
    name: 'Agents, End to End',
    description:
      'Building a small agent with open tooling, from first prompt to something that runs on its own.',
    type: 'livestream',
    kind: 'session',
    startsAt: '2026-10-14T18:00:00Z',
    endsAt: '2026-10-14T19:30:00Z',
    allDay: false,
    logoUrl: 'https://example.invalid/hacktoberfest/logos/mlh.png',
    url: 'https://example.invalid/hacktoberfest/agents',
    host: 'MLH',
  },
  {
    id: 'ghw-showcase',
    name: 'Hack Week Showcase',
    description: 'What got built this week, demoed by the people who built it.',
    type: 'livestream',
    kind: 'session',
    startsAt: '2026-10-15T20:00:00Z',
    endsAt: '2026-10-15T21:30:00Z',
    allDay: false,
    logoUrl: 'https://example.invalid/hacktoberfest/logos/ghw.png',
    url: 'https://example.invalid/hacktoberfest/ghw/showcase',
    host: 'MLH x DEV',
  },
  {
    id: 'dev-round-3',
    name: 'DEV Challenges',
    description:
      'Build something with open source AI and write it up on DEV. Submit by Sunday to be judged in this round.',
    type: 'challenge',
    kind: 'round',
    startsAt: '2026-10-19T00:00:00Z',
    endsAt: '2026-10-25T23:59:00Z',
    allDay: true,
    /* The challenge itself carries no sponsor mark — sponsorship rides on
       individual livestreams, not on the rounds. */
    logoUrl: null,
    url: 'https://example.invalid/hacktoberfest/challenge/3',
    host: 'DEV',
  },
  {
    id: 'maintainer-office-hours',
    name: 'Maintainer Office Hours',
    description:
      'Drop in with a stuck pull request or a project you cannot get moving.',
    type: 'livestream',
    kind: 'session',
    startsAt: '2026-10-20T15:00:00Z',
    endsAt: '2026-10-20T16:00:00Z',
    allDay: false,
    /* A sponsored livestream in the open stream, the counterpart to the one
       inside Global Hack Week. */
    logoUrl: '/sponsors/mongodb.svg',
    url: null,
    host: 'MLH',
  },
  {
    id: 'dev-round-4',
    name: 'DEV Challenges',
    description:
      'The last round. Build something with open source AI and write it up on DEV before the month closes.',
    type: 'challenge',
    kind: 'round',
    startsAt: '2026-10-26T00:00:00Z',
    endsAt: '2026-11-01T23:59:00Z',
    allDay: true,
    /* The challenge itself carries no sponsor mark — sponsorship rides on
       individual livestreams, not on the rounds. */
    logoUrl: null,
    url: 'https://example.invalid/hacktoberfest/challenge/4',
    host: 'DEV',
  },
  {
    id: 'closing-ceremony',
    name: 'Closing Ceremony',
    description:
      'Wrapping up October: what got built, what got merged, and what happens next.',
    type: 'livestream',
    kind: 'session',
    startsAt: '2026-10-30T16:00:00Z',
    endsAt: '2026-10-30T17:00:00Z',
    allDay: false,
    logoUrl: 'https://example.invalid/hacktoberfest/logos/hacktoberfest.png',
    url: 'https://example.invalid/hacktoberfest/closing',
    host: 'MLH x DEV',
  },
];
