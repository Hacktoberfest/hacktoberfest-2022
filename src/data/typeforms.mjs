import { campaignFor } from './campaign.mjs';

const INTEREST_FORM_ID = 'JIRQyVOq';
const SPONSOR_FORM_ID = 'kShwvA2e';

const popup = (id, content, hidden) => ({
  id,
  tracking: campaignFor(content),
  ...(hidden === undefined ? {} : { hidden }),
});

/* The header's "Learn about Hosting" is a link to /host/ now, so the old nav popup
   (utm_content 'nav-host') retired with it. The /host apply CTA that
   replaced it is an internal link to /my now, so 'host-apply' retired
   too — MY_HOST_APPLY_URL in data/links.js is the only tagged apply
   link left. The hero's own host CTA followed once applications opened:
   it links to /host/ rather than collecting interest, so 'hero-host'
   retired with it, and 'get-involved-host' went the same way when the
   Get Involved host card's CTA became a link too. Every host ask on the
   site is a link now; the interest form is only for people who want to
   attend or sponsor. */
/* Back in use as the hero's "Notify me about local Fests" secondary CTA —
   kept through the single-CTA period precisely so its return wouldn't mint a
   new utm_content. */
export const HERO_ATTEND_FORM = popup(INTEREST_FORM_ID, 'hero-attend', {
  organizer_interest: 'false',
});
/* The inline links in the FAQ answers. Own utm_content values, like every
   other placement, so their traffic stays distinguishable. 'faq-host'
   retired when "How do I organize a Fest?" stopped holding the reader on
   a mailing list and started sending them to /host/ instead. */
export const FAQ_UPDATES_FORM = popup(INTEREST_FORM_ID, 'faq-updates');
/* The sponsor ask lives on /sponsor/ now. 'get-involved-sponsor' retired
   when the Get Involved card became a link to that page; the form itself
   moved with the conversation, one placement in the sponsor hero and one
   in the partnership band. */
export const SPONSOR_HERO_FORM = popup(SPONSOR_FORM_ID, 'sponsor-hero-info');
export const SPONSOR_PARTNERSHIP_FORM = popup(
  SPONSOR_FORM_ID,
  'sponsor-partnership-info',
);
export const WAYS_IN_PERSON_FORM = popup(INTEREST_FORM_ID, 'ways-in-person', {
  organizer_interest: 'false',
});
export const WAYS_ONLINE_FORM = popup(INTEREST_FORM_ID, 'ways-online', {
  organizer_interest: 'false',
});
