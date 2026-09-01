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
/* The attendee asks retired when the Fests directory opened. 'hero-attend'
   was the hero's "Notify me about local Fests" secondary CTA, 'faq-updates'
   the inline FAQ link, and 'ways-in-person' the in-person card in Ways In —
   all three collected an address against Fests that had not been announced,
   and all three are links to /fests/ now. 'faq-host' had already gone the
   same way, to /host/. */
/* The sponsor ask lives on /sponsor/ now. 'get-involved-sponsor' retired
   when the Get Involved card became a link to that page; the form itself
   moved with the conversation, one placement in the sponsor hero and one
   in the partnership band. */
export const SPONSOR_HERO_FORM = popup(SPONSOR_FORM_ID, 'sponsor-hero-info');
export const SPONSOR_PARTNERSHIP_FORM = popup(
  SPONSOR_FORM_ID,
  'sponsor-partnership-info',
);
/* The last interest-form placement on the site: the online card in Ways In.
   It survives the sweep to /fests/ because the online event is not in the
   directory — there is no page to send someone to yet. */
export const WAYS_ONLINE_FORM = popup(INTEREST_FORM_ID, 'ways-online', {
  organizer_interest: 'false',
});
