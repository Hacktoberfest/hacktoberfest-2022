import { campaignFor } from './campaign.mjs';

const INTEREST_FORM_ID = 'JIRQyVOq';
const SPONSOR_FORM_ID = 'kShwvA2e';

const popup = (id, content, hidden) => ({
  id,
  tracking: campaignFor(content),
  ...(hidden === undefined ? {} : { hidden }),
});

export const NAV_HOST_FORM = popup(INTEREST_FORM_ID, 'nav-host', {
  organizer_interest: 'true',
});
export const HERO_HOST_FORM = popup(INTEREST_FORM_ID, 'hero-host', {
  organizer_interest: 'true',
});
/* Back in use as the hero's "Notify me about local Fests" secondary CTA —
   kept through the single-CTA period precisely so its return wouldn't mint a
   new utm_content. */
export const HERO_ATTEND_FORM = popup(INTEREST_FORM_ID, 'hero-attend', {
  organizer_interest: 'false',
});
export const HOST_A_FEST_FORM = popup(INTEREST_FORM_ID, 'get-involved-host', {
  organizer_interest: 'true',
});

/* The two inline links in the FAQ answers. Own utm_content values, like every
   other placement, so their traffic stays distinguishable. */
export const FAQ_HOST_FORM = popup(INTEREST_FORM_ID, 'faq-host', {
  organizer_interest: 'true',
});
export const FAQ_UPDATES_FORM = popup(INTEREST_FORM_ID, 'faq-updates');
export const SPONSOR_FORM = popup(SPONSOR_FORM_ID, 'get-involved-sponsor');
export const WAYS_IN_PERSON_FORM = popup(INTEREST_FORM_ID, 'ways-in-person', {
  organizer_interest: 'false',
});
export const WAYS_ONLINE_FORM = popup(INTEREST_FORM_ID, 'ways-online', {
  organizer_interest: 'false',
});
