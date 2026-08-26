import { apiFetch } from './apiClient.mjs';
import { API_BASE_URL } from './session.mjs';

/* The mocked build has no backend to write to, but Confirm still deserves
   its confetti: resolve the same shape the endpoint answers with, after a
   beat long enough that the submitting state is reviewable too. */
const mockAcknowledgement = () =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        acknowledgedAt: new Date().toISOString(),
        acknowledgedBy: 'mock-host',
      });
    }, 600);
  });

/* The one writer of Event.acknowledgedAt: the host confirming the final
   acknowledgements for their Fest. Idempotent server-side - a re-confirm
   returns the original timestamp rather than moving it. Same mock-vs-live
   seam as every call in lib/experience.mjs: empty API_BASE_URL is the
   mocked build. */
export const acknowledgeFest = (eventId) => {
  if (!API_BASE_URL) return mockAcknowledgement();
  return apiFetch(
    `/api/me/fests/${encodeURIComponent(eventId)}/acknowledgements`,
    { method: 'POST' },
  );
};
