/* The data seam for /my.

   getExperience returns the whole personalized payload: user, address,
   activities, fests. Live by default — API_BASE_URL is still the single
   switch, but it now resolves to the production origin when nothing is set
   (lib/apiBase.mjs says why), so the build with no configuration shows real
   data. The mocked build is the explicit NEXT_PUBLIC_API_BASE_URL=mocked
   opt-out. */
import {
  DEFAULT_SCENARIO,
  ERROR_SCENARIO,
  MLH_DOWN_SCENARIO,
  SCENARIOS,
  selectScenario,
} from '../data/fixtures.mjs';
import { apiFetch } from './apiClient.mjs';
import { API_BASE_URL, displayName } from './session.mjs';

/* The data a scenario name stands for. Never throws: an unknown name, and
   the two names that are not data shapes at all, all land on the default
   fixture here. */
const fixtureFor = (scenario) => {
  const name = selectScenario(scenario);
  return SCENARIOS[name] || SCENARIOS[DEFAULT_SCENARIO];
};

/* `error` and `mlh-down` are review links rather than data: they make
   getExperience reject so the generic error surface and the whole-page outage
   surface can be reached from a URL like every other state.

   Mocked mode only, and structurally so — this function is called from the
   `!API_BASE_URL` branch and nowhere else. A synthetic failure in a live
   build would be a shareable URL that fabricates a failure for a signed-in
   participant, and `mlh-down` fabricates one about a named third party: a
   full-page "MyMLH is unreachable" while MLH is perfectly fine. `error`
   leaked the same way for longer and is fixed here with it, because leaving
   one behind is an invitation to reintroduce the other. There is nothing to
   review in production; the scenarios exist for the mocked build that
   designers and QA ask for by name. */
const mockFailure = (scenario) => {
  const name = selectScenario(scenario);

  if (name === ERROR_SCENARIO) {
    return new Error('Mock experience failure (?scenario=error)');
  }

  if (name === MLH_DOWN_SCENARIO) {
    /* Shaped like apiClient's failure(502) rather than thrown as a plain
       Error: pageStateForError branches on the status, so an error without
       one would land on the generic error screen and this scenario would
       show the wrong state. */
    const error = new Error('Mock MLH outage (?scenario=mlh-down)');
    error.status = 502;
    return error;
  }

  return null;
};

const mockExperience = async (scenario) => {
  const failure = mockFailure(scenario);
  if (failure) throw failure;

  return fixtureFor(scenario);
};

/* The experience-shaped user: the still-mocked fields first, the live
   profile's fields winning — rather than replacing user wholesale, which is
   what keeps any still-mocked fields from silently going undefined. Do not
   "tidy" this spread away. Shared by the early onProfile surface and the
   final merge below so the two can never drift. */
const userFromProfile = (mockedUser, profile) => ({
  ...mockedUser,
  name: displayName(profile),
  email: profile.email,
  /* Same deploy-order stance as hasAddress below: Boolean() maps an absent
     devLinked to false, so a frontend shipped ahead of the API half reads
     every account as unlinked. Ship the API half first. */
  devLinked: Boolean(profile.devLinked),
  /* The API's allowlist deliberately omits an avatar URL, so the account
     strip renders initials. Widening it is a decision about exposing more
     MyMLH data, not something to paper over here. */
  avatarUrl: null,
});

export const getExperience = async (session, options) => {
  const scenario = options && options.scenario;
  const onProfile = options && options.onProfile;

  if (!API_BASE_URL) return mockExperience(scenario);

  /* fixtureFor, not mockExperience: the live path takes the still-mocked
     fields and nothing else. Routing this through mockExperience is what let
     ?scenario=mlh-down fire in a live build — see the note on mockFailure. */
  const mocked = fixtureFor(scenario);

  /* Two endpoints, deliberately: the profile is a milliseconds DB read and
     the fests half is MLH round trips. Fetched in parallel, and the profile
     also surfaces early through onProfile so /my can put the participant's
     name on screen while the slow half is still in flight. Ship the API
     half first (both endpoints), as with every seam in this file. */
  const profilePromise = apiFetch('/api/me/profile');
  if (onProfile) {
    profilePromise
      .then((profile) => onProfile(userFromProfile(mocked.user, profile)))
      /* The Promise.all below owns failures; this leg only ever narrates
         success early. Without this catch a profile failure would surface
         twice, once as an unhandled rejection. */
      .catch(() => {});
  }

  const [profile, festsBody] = await Promise.all([
    profilePromise,
    apiFetch('/api/me/fests'),
  ]);

  return {
    ...mocked,
    /* Live: registered/checked-in participations plus organized events,
       already card-shaped by the API. The Array.isArray guard is the
       deploy-order seam — an API answering without the fests field degrades
       to the empty state rather than crashing or passing fixture fests off
       as the user's. */
    fests: Array.isArray(festsBody.fests) ? festsBody.fests : [],
    /* Live. Activities and stickers are still mocked and become real in
       their own phase; /my never has to know which is which. The API sends
       only a boolean; the address itself never reaches this app, by design
       on both sides.

       Deploy-order hazard, recorded rather than defended against: Boolean()
       maps an absent hasAddress to false, exactly as it maps a real false, so
       shipping this frontend ahead of the API half marks every participant
       address-missing and drops progressLevel to 0 with nothing to signal it.
       Deliberately not detected at runtime -- the spec is explicit that there
       is no unknown address state, and inventing one here would be designing
       a third state in the wrong file. Ship the API half first. */
    addressValidated: Boolean(festsBody.hasAddress),
    user: userFromProfile(mocked.user, profile),
  };
};
