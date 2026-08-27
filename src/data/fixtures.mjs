/* Mock eligibility states, used only in the mocked build — the explicit
   NEXT_PUBLIC_API_BASE_URL=mocked opt-out (see lib/apiBase.mjs).

   These double as test data, which is why they live in src/ rather than in
   test/: a fixture that drifts from the real shape fails the unit suite before
   anyone sees it in a browser. */

/* avatarUrl is always null in these fixtures — there is no real MyMLH avatar
   to point at — but it must still be present so WelcomeBand's fallback path
   (initials, not a missing prop) is what every scenario actually exercises. */
const USER = {
  name: 'Ada Lovelace',
  email: 'ada@example.invalid',
  avatarUrl: null,
};

/* Fest dates: entries meant to read as "attended" are dated 2026-08-01 —
   before any plausible review date — so the past group is visible from a
   share link all campaign long, not only after mid-October. Upcoming
   entries sit late in October for the same reason. */
export const SCENARIOS = Object.freeze({
  'no-address': {
    user: { ...USER, devLinked: false },
    addressValidated: false,
    activities: [
      { id: 'dev-challenge', completed: true, completedAt: '2026-10-12' },
    ],
    fests: [
      {
        id: 'fest-brooklyn',
        name: 'Hacktober Fest Brooklyn',
        city: 'Brooklyn',
        country: 'United States',
        date: '2026-10-24',
        startTime: '10:00 AM',
        endTime: '6:00 PM',
        endsAt: '2026-10-24T22:00:00.000Z',
        status: 'registered',
        role: 'attending',
        registrationUrl: null,
        websiteUrl: null,
        applicationStatus: null,
        manageUrl: null,
        mlhPublished: null,
        hacktoberfestPublished: null,
        acknowledgedAt: null,
        latitude: null,
        longitude: null,
        venueAddress: null,
        publicationChecks: null,
      },
    ],
  },
  eligible: {
    user: { ...USER, devLinked: true },
    addressValidated: true,
    activities: [{ id: 'fest', completed: true, completedAt: '2026-08-01' }],
    fests: [
      {
        id: 'fest-london',
        name: 'Hacktober Fest London',
        city: 'London',
        country: 'United Kingdom',
        date: '2026-08-01',
        startTime: '9:30 AM',
        endTime: '5:00 PM',
        endsAt: '2026-08-01T16:00:00.000Z',
        status: 'checked_in',
        role: 'attending',
        registrationUrl: null,
        websiteUrl: null,
        applicationStatus: null,
        manageUrl: null,
        mlhPublished: null,
        hacktoberfestPublished: null,
        acknowledgedAt: null,
        latitude: null,
        longitude: null,
        venueAddress: null,
        publicationChecks: null,
      },
    ],
  },
  'nothing-done': {
    user: { ...USER, devLinked: false },
    addressValidated: false,
    activities: [{ id: 'dev-challenge', completed: false }],
    fests: [],
  },
  /* Milestone 2 (Hacktoberfest complete): three activities done, same
     address gate as every other eligible scenario. Exists so that state has
     a shareable review link too, matching every other scenario here. */
  complete: {
    user: { ...USER, devLinked: true },
    addressValidated: true,
    activities: [
      { id: 'fest', completed: true, completedAt: '2026-08-01' },
      { id: 'livestream', completed: true, completedAt: '2026-10-05' },
      { id: 'dev-relay', completed: true, completedAt: '2026-10-02' },
    ],
    fests: [
      {
        id: 'fest-london',
        name: 'Hacktober Fest London',
        city: 'London',
        country: 'United Kingdom',
        date: '2026-08-01',
        startTime: '9:30 AM',
        endTime: '5:00 PM',
        endsAt: '2026-08-01T16:00:00.000Z',
        status: 'checked_in',
        role: 'attending',
        registrationUrl: null,
        websiteUrl: null,
        applicationStatus: null,
        manageUrl: null,
        mlhPublished: null,
        hacktoberfestPublished: null,
        acknowledgedAt: null,
        latitude: null,
        longitude: null,
        venueAddress: null,
        publicationChecks: null,
      },
    ],
  },
  organizer: {
    user: { ...USER, devLinked: true },
    addressValidated: true,
    activities: [{ id: 'fest', completed: true, completedAt: '2026-08-01' }],
    fests: [
      {
        id: 'fest-tokyo',
        name: 'Hacktober Fest Tokyo',
        city: 'Tokyo',
        country: 'Japan',
        date: '2026-10-17',
        startTime: '10:00 AM',
        endTime: '7:00 PM',
        endsAt: '2026-10-17T10:00:00.000Z',
        status: null,
        role: 'organizing',
        registrationUrl: 'https://example.invalid/fests/tokyo',
        websiteUrl: 'https://example.invalid/events/tokyo',
        applicationStatus: null,
        manageUrl: null,
        mlhPublished: true,
        hacktoberfestPublished: true,
        acknowledgedAt: '2026-08-20T14:00:00.000Z',
        latitude: 35.6595,
        longitude: 139.7005,
        venueAddress: '1-2-3 Shibuya, Shibuya City, Tokyo, 150-0002, Japan',
        publicationChecks: [
          { id: 'coordinates', passed: true },
          { id: 'name', passed: true },
          { id: 'duration', passed: true },
          { id: 'description', passed: true },
        ],
      },
      /* A hosted Fest already behind us: same "Hosting" role, past-tensed
         to "Hosted" by the date, so the past-tense badge is reviewable all
         campaign long. */
      {
        id: 'fest-melbourne',
        name: 'Hacktober Fest Melbourne',
        city: 'Melbourne',
        country: 'Australia',
        date: '2026-08-01',
        startTime: '10:00 AM',
        endTime: '5:00 PM',
        endsAt: '2026-08-01T07:00:00.000Z',
        status: null,
        role: 'organizing',
        registrationUrl: 'https://example.invalid/fests/melbourne',
        websiteUrl: 'https://example.invalid/events/melbourne',
        applicationStatus: null,
        manageUrl: null,
        mlhPublished: true,
        hacktoberfestPublished: true,
        acknowledgedAt: '2026-08-20T14:00:00.000Z',
        latitude: -37.8102,
        longitude: 144.9628,
        venueAddress: '120 Spencer Street, Melbourne, VIC, 3000, Australia',
        publicationChecks: [
          { id: 'coordinates', passed: true },
          { id: 'name', passed: true },
          { id: 'duration', passed: true },
          { id: 'description', passed: true },
        ],
      },
      /* Published in MLH but not here yet: the acknowledgements ask. The
         "One step left" badge and the modal are reviewable from a share
         link on this card. Its description check misses on purpose - this
         is the fixture that demos the advisory nudge, the pane pausing on
         Continue instead of blocking. */
      {
        id: 'fest-azores',
        name: 'Hacktober Fest Azores',
        city: 'Ponta Delgada',
        country: 'Portugal',
        date: '2026-10-12',
        startTime: '10:00 AM',
        endTime: '6:00 PM',
        endsAt: '2026-10-12T18:00:00.000Z',
        status: null,
        role: 'organizing',
        registrationUrl: 'https://example.invalid/fests/azores',
        websiteUrl: 'https://example.invalid/events/azores',
        applicationStatus: null,
        manageUrl: 'https://example.invalid/events/14690-hacktober-fest-azores',
        mlhPublished: true,
        hacktoberfestPublished: false,
        acknowledgedAt: null,
        latitude: 37.7412,
        longitude: -25.6756,
        venueAddress: '12 Rua do Mercado, Ponta Delgada, 9500-326, Portugal',
        publicationChecks: [
          { id: 'coordinates', passed: true },
          { id: 'name', passed: true },
          { id: 'duration', passed: true },
          { id: 'description', passed: false },
        ],
      },
      /* Published in MLH but failing an automated check: the checks pane
         blocks the acknowledgements and shows the warning. Reviewable
         from a share link like every other state. */
      {
        id: 'fest-horta',
        name: 'Horta Hacktober Bash',
        city: 'Horta',
        country: 'Portugal',
        date: '2026-10-15',
        startTime: '10:00 AM',
        endTime: '6:00 PM',
        endsAt: '2026-10-15T18:00:00.000Z',
        status: null,
        role: 'organizing',
        registrationUrl: 'https://example.invalid/fests/horta',
        websiteUrl: 'https://example.invalid/events/horta',
        applicationStatus: null,
        manageUrl: 'https://example.invalid/events/14693-horta-hacktober-bash',
        mlhPublished: true,
        hacktoberfestPublished: false,
        acknowledgedAt: null,
        latitude: 38.5347,
        longitude: -28.6346,
        venueAddress: '7 Rua Vasco da Gama, Horta, 9900-017, Portugal',
        publicationChecks: [
          { id: 'coordinates', passed: true },
          { id: 'name', passed: false },
          { id: 'duration', passed: true },
          { id: 'description', passed: true },
        ],
      },
      /* Acknowledged, waiting on FestNet's checks - the quiet rung
         between the host's last act and the directory. */
      {
        id: 'fest-braga',
        name: 'Hacktober Fest Braga',
        city: 'Braga',
        country: 'Portugal',
        date: '2026-10-20',
        startTime: '9:00 AM',
        endTime: '5:00 PM',
        endsAt: '2026-10-20T16:00:00.000Z',
        status: null,
        role: 'organizing',
        registrationUrl: 'https://example.invalid/fests/braga',
        websiteUrl: 'https://example.invalid/events/braga',
        applicationStatus: null,
        manageUrl: 'https://example.invalid/events/14691-hacktober-fest-braga',
        mlhPublished: true,
        hacktoberfestPublished: false,
        acknowledgedAt: '2026-08-24T09:30:00.000Z',
        latitude: 41.5454,
        longitude: -8.4265,
        venueAddress: '45 Rua do Souto, Braga, 4700-329, Portugal',
        publicationChecks: [
          { id: 'coordinates', passed: true },
          { id: 'name', passed: true },
          { id: 'duration', passed: true },
          { id: 'description', passed: true },
        ],
      },
      /* The event exists but the host has not published it in MLH - the
         approved rung, told apart from the Porto application card by its
         source: this one is a real Event row. */
      {
        id: 'fest-coimbra',
        name: 'Hacktober Fest Coimbra',
        city: 'Coimbra',
        country: 'Portugal',
        date: '2026-10-27',
        startTime: '10:00 AM',
        endTime: '4:00 PM',
        endsAt: '2026-10-27T16:00:00.000Z',
        status: null,
        role: 'organizing',
        registrationUrl: null,
        websiteUrl: null,
        applicationStatus: null,
        manageUrl:
          'https://example.invalid/events/14692-hacktober-fest-coimbra',
        mlhPublished: false,
        hacktoberfestPublished: false,
        acknowledgedAt: null,
        latitude: 40.2033,
        longitude: -8.4103,
        venueAddress: '3 Largo da Portagem, Coimbra, 3000-337, Portugal',
        publicationChecks: [
          { id: 'coordinates', passed: true },
          { id: 'name', passed: true },
          { id: 'duration', passed: true },
          { id: 'description', passed: true },
        ],
      },
      /* An event application in flight: the Fest-to-be exists only as the
         organizer's draft on MLH's form. No venue, no registration link —
         the CTA sends them back to finish the application. */
      {
        id: 'application-reykjavik',
        name: 'Hacktober Fest Reykjavík',
        city: null,
        country: null,
        date: '2026-10-10',
        startTime: '10:00 AM',
        endTime: '6:00 PM',
        endsAt: '2026-10-10T18:00:00.000Z',
        status: null,
        role: 'organizing',
        registrationUrl: null,
        websiteUrl: null,
        applicationStatus: 'draft',
        manageUrl: 'https://example.invalid/applications/47507',
        mlhPublished: null,
        hacktoberfestPublished: null,
        acknowledgedAt: null,
        latitude: null,
        longitude: null,
        venueAddress: null,
        publicationChecks: null,
      },
      /* The next rung: submitted, waiting on MLH's review. Exists so the
         submitted badge and its view-application CTA are reviewable from
         a share link like every other variant. */
      {
        id: 'application-lisbon',
        name: 'Hacktober Fest Lisbon',
        city: null,
        country: null,
        date: '2026-10-31',
        startTime: '10:00 AM',
        endTime: '6:00 PM',
        endsAt: '2026-10-31T18:00:00.000Z',
        status: null,
        role: 'organizing',
        registrationUrl: null,
        websiteUrl: null,
        applicationStatus: 'submitted',
        manageUrl: 'https://example.invalid/applications/47812',
        mlhPublished: null,
        hacktoberfestPublished: null,
        acknowledgedAt: null,
        latitude: null,
        longitude: null,
        venueAddress: null,
        publicationChecks: null,
      },
      /* Sent back for changes: MLH's `rejected`, which OHQ uses when the
         reviewers request revisions. The revise CTA returns the host to
         the same MLH form the draft rung links. */
      {
        id: 'application-madeira',
        name: 'Hacktober Fest Madeira',
        city: null,
        country: null,
        date: '2026-10-18',
        startTime: '10:00 AM',
        endTime: '6:00 PM',
        endsAt: '2026-10-18T18:00:00.000Z',
        status: null,
        role: 'organizing',
        registrationUrl: null,
        websiteUrl: null,
        applicationStatus: 'rejected',
        manageUrl: 'https://example.invalid/applications/47901',
        mlhPublished: null,
        hacktoberfestPublished: null,
        acknowledgedAt: null,
        latitude: null,
        longitude: null,
        venueAddress: null,
        publicationChecks: null,
      },
      /* The top rung: approved, but the event not yet public — the gap
         where the approved application card renders. Its manageUrl is the
         Organizer HQ event page (the API swaps the link at this rung),
         mirroring the live {ohqId}-{slug} path shape, so the "Manage
         event" CTA is reviewable from a share link too. */
      {
        id: 'application-porto',
        name: 'Hacktober Fest Porto',
        city: null,
        country: null,
        date: '2026-10-25',
        startTime: '9:00 AM',
        endTime: '5:00 PM',
        endsAt: '2026-10-25T16:00:00.000Z',
        status: null,
        role: 'organizing',
        registrationUrl: null,
        websiteUrl: null,
        applicationStatus: 'approved',
        manageUrl: 'https://example.invalid/events/14683-hacktober-fest-porto',
        mlhPublished: null,
        hacktoberfestPublished: null,
        acknowledgedAt: null,
        latitude: null,
        longitude: null,
        venueAddress: null,
        publicationChecks: null,
      },
      {
        id: 'fest-berlin',
        name: 'Hacktober Fest Berlin',
        city: 'Berlin',
        country: 'Germany',
        date: '2026-10-24',
        startTime: '11:00 AM',
        endTime: '8:00 PM',
        endsAt: '2026-10-24T18:00:00.000Z',
        status: 'registered',
        role: 'attending',
        registrationUrl: 'https://example.invalid/fests/berlin',
        websiteUrl: 'https://example.invalid/events/berlin',
        applicationStatus: null,
        manageUrl: null,
        mlhPublished: null,
        hacktoberfestPublished: null,
        acknowledgedAt: null,
        latitude: null,
        longitude: null,
        venueAddress: null,
        publicationChecks: null,
      },
      {
        id: 'fest-lagos',
        name: 'Hacktober Fest Lagos',
        city: 'Lagos',
        country: 'Nigeria',
        date: '2026-08-01',
        startTime: '9:30 AM',
        endTime: '5:00 PM',
        endsAt: '2026-08-01T16:00:00.000Z',
        status: 'checked_in',
        role: 'attending',
        registrationUrl: null,
        websiteUrl: null,
        applicationStatus: null,
        manageUrl: null,
        mlhPublished: null,
        hacktoberfestPublished: null,
        acknowledgedAt: null,
        latitude: null,
        longitude: null,
        venueAddress: null,
        publicationChecks: null,
      },
      /* Still 'registered' with an endsAt twelve-plus hours gone: renders
         the derived grey "Did not attend" badge all campaign long. */
      {
        id: 'fest-oslo',
        name: 'Hacktober Fest Oslo',
        city: 'Oslo',
        country: 'Norway',
        date: '2026-08-01',
        startTime: '10:00 AM',
        endTime: '4:00 PM',
        endsAt: '2026-08-01T14:00:00.000Z',
        status: 'registered',
        role: 'attending',
        registrationUrl: null,
        websiteUrl: null,
        applicationStatus: null,
        manageUrl: null,
        mlhPublished: null,
        hacktoberfestPublished: null,
        acknowledgedAt: null,
        latitude: null,
        longitude: null,
        venueAddress: null,
        publicationChecks: null,
      },
    ],
  },
});

export const DEFAULT_SCENARIO = 'no-address';

/* `error` is deliberately not in SCENARIOS: it is the one value that is not a
   data shape. It makes getExperience reject, so the error state can be
   reviewed from a link like any other. */
export const ERROR_SCENARIO = 'error';

/* Same reasoning, same convention, for /my's fourth state. `mlh-down` is not
   a data shape either: it makes getExperience reject with an error carrying
   status 502, exactly as apiFetch does when the API reports MLH unreachable,
   so the outage surface can be reviewed from a link like every other state.
   Without it that surface is unreachable in the mocked build — the only
   build designers, QA and CI ever see — and a dead API is no substitute,
   since fetch reports that as a bare TypeError with no status, which lands
   on the generic error screen instead. */
export const MLH_DOWN_SCENARIO = 'mlh-down';

export const selectScenario = (raw) => {
  if (typeof raw !== 'string') return DEFAULT_SCENARIO;
  if (raw === ERROR_SCENARIO) return ERROR_SCENARIO;
  if (raw === MLH_DOWN_SCENARIO) return MLH_DOWN_SCENARIO;
  return Object.prototype.hasOwnProperty.call(SCENARIOS, raw)
    ? raw
    : DEFAULT_SCENARIO;
};
