import { apiFetch } from './apiClient.mjs';

/* The one writer of Event.acknowledgedAt: the host confirming the final
   acknowledgements for their Fest. Idempotent server-side - a re-confirm
   returns the original timestamp rather than moving it. */
export const acknowledgeFest = (eventId) =>
  apiFetch(`/api/me/fests/${encodeURIComponent(eventId)}/acknowledgements`, {
    method: 'POST',
  });
