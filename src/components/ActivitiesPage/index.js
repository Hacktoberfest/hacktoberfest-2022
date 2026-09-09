import Milestones from 'components/Milestones';
import { activitiesPage } from 'data/content.mjs';

import ActivityRow from './ActivityRow';
import styles from './ActivitiesPage.module.css';

/* The three bands under the hero.

   `activities`/`thresholds` are always renderable — the public catalogue
   when there is nothing more specific to show, the signed-in experience's
   own once it has resolved — so the list band never waits on a fetch that
   might fail.

   `milestone` says what the how-it-works band's milestone slot shows,
   decided by the page (src/lib/activitiesPageState.mjs): 'signIn' (no
   session), 'placeholder' (signed in, the fetch is still in flight —
   nothing renders here, deliberately never the sign-in link), 'milestones'
   (the shared card, once `experience` has resolved), or 'error' (the fetch
   failed on anything other than a dead session — a notice with a retry).
   'error' also puts a matching notice above the rows band: every row
   there renders undone in that state (see src/pages/activities.js), and
   without a line saying the completion state failed to load, that reads
   as "you've done none of these" rather than "we don't know yet". */
const ActivitiesPage = ({
  activities,
  thresholds,
  signedIn,
  milestone,
  experience,
  onRetry,
}) => (
  <>
    <section className={styles.band} aria-labelledby="how-heading">
      <h2 id="how-heading" className={styles.heading}>
        {activitiesPage.how.heading.lead}{' '}
        <em>{activitiesPage.how.heading.accent}</em>
      </h2>
      <ol className={styles.steps}>
        {activitiesPage.how.steps(thresholds.complete).map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>
      {milestone === 'milestones' && experience && (
        <Milestones experience={experience} />
      )}
      {milestone === 'signIn' && (
        <a className={styles.signIn} href="/login/">
          {activitiesPage.how.signIn}
        </a>
      )}
      {milestone === 'error' && (
        <div className={styles.milestoneError} role="status">
          <p className={styles.milestoneErrorBody}>
            {activitiesPage.how.error.body}
          </p>
          <button
            type="button"
            className={styles.milestoneErrorRetry}
            onClick={onRetry}
          >
            {activitiesPage.how.error.cta}
          </button>
        </div>
      )}
      {/* milestone === 'placeholder': nothing renders. The signed-in fetch
          is still in flight, and rendering nothing here — rather than the
          sign-in link — is the fix for the flash that used to show. */}
    </section>

    <section className={styles.band} aria-labelledby="list-heading">
      <h2 id="list-heading" className={styles.heading}>
        {activitiesPage.list.heading.lead}{' '}
        <em>{activitiesPage.list.heading.accent}</em>
      </h2>
      {milestone === 'error' && (
        <div className={styles.milestoneError} role="status">
          <p className={styles.milestoneErrorBody}>
            {activitiesPage.list.unknown}
          </p>
          <button
            type="button"
            className={styles.milestoneErrorRetry}
            onClick={onRetry}
          >
            {activitiesPage.how.error.cta}
          </button>
        </div>
      )}
      <ul className={styles.rows}>
        {activities.map((activity) => (
          <ActivityRow
            key={activity.id}
            activity={activity}
            signedIn={signedIn}
          />
        ))}
      </ul>
    </section>

    <section className={styles.band} aria-labelledby="get-heading">
      <h2 id="get-heading" className={styles.heading}>
        {activitiesPage.get.heading.lead}{' '}
        <em>{activitiesPage.get.heading.accent}</em>
      </h2>
      <p className={styles.intro}>{activitiesPage.get.body}</p>
      <a className={styles.signIn} href="/questions/">
        {activitiesPage.get.faqCta}
      </a>
    </section>
  </>
);

export default ActivitiesPage;
