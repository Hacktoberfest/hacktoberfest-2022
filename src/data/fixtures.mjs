/* Mock eligibility states, used only when API_BASE_URL is unset.

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
        applicationStatus: null,
        manageUrl: null,
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
        applicationStatus: null,
        manageUrl: null,
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
        applicationStatus: null,
        manageUrl: null,
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
        applicationStatus: null,
        manageUrl: null,
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
        applicationStatus: null,
        manageUrl: null,
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
        applicationStatus: 'draft',
        manageUrl: 'https://example.invalid/applications/47507',
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
        applicationStatus: 'submitted',
        manageUrl: 'https://example.invalid/applications/47812',
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
        applicationStatus: 'approved',
        manageUrl: 'https://example.invalid/events/14683-hacktober-fest-porto',
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
        applicationStatus: null,
        manageUrl: null,
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
        applicationStatus: null,
        manageUrl: null,
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
        applicationStatus: null,
        manageUrl: null,
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
