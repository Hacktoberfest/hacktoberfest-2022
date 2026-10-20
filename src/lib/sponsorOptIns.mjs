import { apiFetch } from './apiClient.mjs';
import { API_BASE_URL } from './session.mjs';

/* The sponsors a participant can opt in to hearing from, on /my's
   "Your resources." band. Ticking one asks MLH to share their name and
   email with that sponsor after Hacktoberfest. The slugs are the API's
   (services/sponsorOptIns.service.ts, the SponsorOptIn.sponsor values) and
   the sponsor wall's logo files. */
export const SPONSOR_OPT_INS = [
  { slug: 'digitalocean', name: 'DigitalOcean' },
  { slug: 'temporal', name: 'Temporal' },
  { slug: 'prior-labs', name: 'Prior Labs' },
];

/* A mocked review link: on /my/?scenario=opt-ins-error every save fails,
   so the card's failure line can be reviewed without a backend. */
export const OPT_INS_ERROR_SCENARIO = 'opt-ins-error';

/* The profile's sponsorOptIns as the card reads it: every sponsor above,
   ticked only where the API says true. Absent or malformed reads as all
   unticked, the one state nobody has to have chosen. */
export const optInsFrom = (raw) =>
  Object.fromEntries(
    SPONSOR_OPT_INS.map(({ slug }) => [
      slug,
      Boolean(raw && typeof raw === 'object' && raw[slug] === true),
    ]),
  );

/* The mocked build has no backend to write to: it remembers this page's
   answers and resolves them after a beat, long enough that the saving
   state is reviewable too. */
let mockAnswers = {};

const mockSave = (slug, optedIn) =>
  new Promise((resolve, reject) => {
    const scenario = new URLSearchParams(
      (globalThis.location && globalThis.location.search) || '',
    ).get('scenario');
    setTimeout(() => {
      if (scenario === OPT_INS_ERROR_SCENARIO) {
        const error = new Error(
          'Mock opt-in failure (?scenario=opt-ins-error)',
        );
        error.status = 500;
        reject(error);
        return;
      }
      mockAnswers = { ...mockAnswers, [slug]: optedIn };
      resolve(optInsFrom(mockAnswers));
    }, 400);
  });

/* One answer, saved the moment its box changes: PUT
   /api/me/sponsor-opt-ins/:slug answers the participant's whole map, read
   here as the profile's is. Failures reject with apiFetch's status. Same
   mock-vs-live seam as every write: empty API_BASE_URL is the mocked
   build. */
export const saveSponsorOptIn = async (slug, optedIn) => {
  if (!API_BASE_URL) return mockSave(slug, optedIn);

  const body = await apiFetch(
    `/api/me/sponsor-opt-ins/${encodeURIComponent(slug)}`,
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ optedIn }),
    },
  );

  return optInsFrom(body && body.sponsorOptIns);
};
