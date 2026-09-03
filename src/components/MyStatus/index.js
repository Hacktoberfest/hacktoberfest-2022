import Loader from 'components/Loader';
import MessagePage from 'components/MessagePage';
import { my } from 'data/content.mjs';

import styles from './MyStatus.module.css';

/* Loading and error surfaces for /my. A static export cannot redirect on
   the server, so the loading state is unavoidable — designed, not a flash.

   The loading state is whole-page on purpose: nothing from the hub renders
   until the fetch lands, so there is no skeleton to keep honest and no
   layout to preserve. The surface itself is components/Loader — shared
   with /auth/callback/'s working state, so arriving through sign-in is one
   continuous loader until the hub's data lands.

   `inline` passes straight through to the Loader: /my renders this a
   second time once the profile half of the split fetch answers, where it
   stands in for the bands under the welcome hero rather than for the
   page, and the full-bleed forest screen belongs only to the first. */
export const MyLoading = ({ inline = false }) => (
  <Loader label={my.loading} inline={inline} />
);

/* role="status" on both surfaces below, for the same reason: MyLoading's
   aria-live paragraph is unmounted the moment one of them renders, so a
   screen-reader user who has just heard "Loading your Hacktoberfest…" gets
   silence and has to re-explore the page to find out what happened. Marking
   the replacement as a status region is what turns the swap into something
   announced.

   Not aria-live on an inner paragraph, as MyLoading does it: these surfaces
   carry a heading and body that only make sense read together. */
export const MyError = ({ onRetry }) => (
  <div className={styles.column} role="status">
    {/* h2, not h1: the welcome band above carries the page's h1 in every
       state, this one included. */}
    <h2 className={styles.errorTitle}>{my.error.title}</h2>
    <p className={styles.errorBody}>{my.error.body}</p>
    <button type="button" className={styles.retryButton} onClick={onRetry}>
      {my.error.cta}
    </button>
  </div>
);

/* Replaces the whole hub when the API reports MLH is unreachable (502).
   Takes no props and offers no CTA: see the note on my.mlhDown — the
   existing error state's retry is right for a transient fetch failure, but
   re-rendering this page cannot fix MyMLH being down. MessagePage's h1 is
   the page's only heading in this state — the welcome band, which carries
   it in the error and ready states, is not rendered at all.

   This surface always mirrored MessagePage (used by /login/ and
   /auth/callback/) and only duplicated its layout because MessagePage was
   styled-components at the time, which would have shipped this
   client-only surface unstyled. MessagePage is all CSS Module now, so the
   outage screen simply is one. */
export const MyMlhDown = () => (
  <MessagePage
    role="status"
    eyebrow={my.mlhDown.eyebrow}
    heading={my.mlhDown.title}
    accent={my.mlhDown.accent}
  >
    {my.mlhDown.body}
  </MessagePage>
);

/* The two refusals /my/fest/ can meet. Both are MessagePage for the same
   reason MyMlhDown is: they replace the whole page, they carry its only
   heading, and neither is worth a retry button — re-fetching cannot make a
   Fest yours, or make one exist. role="status" because they replace the
   loader's live region; see the note above. */
export const MyForbidden = () => (
  <MessagePage
    role="status"
    eyebrow={my.dashboard.forbidden.eyebrow}
    heading={my.dashboard.forbidden.heading.lead}
    accent={my.dashboard.forbidden.heading.accent}
    cta={my.dashboard.backCta}
    ctaHref="/my/"
  >
    {my.dashboard.forbidden.body}
  </MessagePage>
);

export const MyNotFound = () => (
  <MessagePage
    role="status"
    eyebrow={my.dashboard.notFound.eyebrow}
    heading={my.dashboard.notFound.heading.lead}
    accent={my.dashboard.notFound.heading.accent}
    cta={my.dashboard.backCta}
    ctaHref="/my/"
  >
    {my.dashboard.notFound.body}
  </MessagePage>
);
