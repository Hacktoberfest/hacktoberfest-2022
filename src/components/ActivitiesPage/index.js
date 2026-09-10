import { useEffect, useState } from 'react';

import ActivityCard from 'components/ActivityCard';
import { activitiesPage } from 'data/content.mjs';
import { chipsFor, filterActivities } from 'lib/activityFilters.mjs';

import ActivityFilters from './ActivityFilters';
import styles from './ActivitiesPage.module.css';

/* The bands under the hero.

   `activities`/`thresholds` are always renderable — the public catalogue
   when there is nothing more specific to show, the signed-in experience's
   own once it has resolved — so the cards never wait on a fetch that
   might fail.

   `slot` is what the page decided (src/lib/activitiesPageState.mjs):
   'signIn' (no session; the how-it-works band ends with the sign-in link),
   'placeholder' (signed in, fetch in flight; nothing extra renders),
   'strip' (signed in and resolved; the page's one line of progress renders
   above the bands, in src/pages/activities.js), or 'error' (the fetch
   failed on anything but a dead session; a notice with a retry sits above
   the cards, and Still to do is not offered because every card reads
   undone in that state).

   The filter is client state and nothing more. It resets to All when
   Still to do stops being offered, so a chip that no longer exists is
   never the pressed one. */
const ActivitiesPage = ({
  activities,
  thresholds,
  signedIn,
  slot,
  onRetry,
}) => {
  const [filter, setFilter] = useState('all');
  const chips = chipsFor(activities, {
    signedIn: signedIn && slot === 'strip',
  });
  const offered = chips.some((chip) => chip.key === filter);

  useEffect(() => {
    if (!offered) setFilter('all');
  }, [offered]);

  const shown = filterActivities(activities, offered ? filter : 'all');

  return (
    <>
      <section className={styles.band} aria-labelledby="how-heading">
        <div className={styles.inner}>
          <p className={styles.eyebrow}>{activitiesPage.how.eyebrow}</p>
          {/* Single colour: the two-tone heading is the activities band's,
              the page's thesis, and only that band's. */}
          <h2 id="how-heading" className={styles.headingPlain}>
            {activitiesPage.how.heading.lead}{' '}
            {activitiesPage.how.heading.accent}
          </h2>
          {/* Numbered because they happen in this order, as cards, the
              way the landing pages draw them. */}
          <ol className={styles.steps}>
            {activitiesPage.how.steps(thresholds.complete).map((step, i) => (
              <li key={step} className={styles.step}>
                <span className={styles.stepNumber} aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
          {slot === 'signIn' && (
            <a className="hf-button" href="/login/">
              {activitiesPage.how.signIn}
            </a>
          )}
        </div>
      </section>

      <section
        className={`${styles.band} ${styles.bandDeep}`}
        aria-labelledby="list-heading"
      >
        <div className={styles.inner}>
          <p className={styles.eyebrow}>{activitiesPage.list.eyebrow}</p>
          <h2 id="list-heading" className={styles.heading}>
            {activitiesPage.list.heading.lead}{' '}
            <em>{activitiesPage.list.heading.accent}</em>
          </h2>
          <ActivityFilters
            chips={chips}
            active={offered ? filter : 'all'}
            onChange={setFilter}
          />
          {slot === 'error' && (
            <div className={styles.notice} role="status">
              <p className={styles.noticeBody}>{activitiesPage.list.unknown}</p>
              <button
                type="button"
                className="hf-button hf-button--small"
                onClick={onRetry}
              >
                {activitiesPage.how.error.cta}
              </button>
            </div>
          )}
          {shown.length > 0 ? (
            <ul className={styles.cards}>
              {shown.map((activity) => (
                <ActivityCard
                  key={activity.id}
                  activity={activity}
                  signedIn={signedIn}
                />
              ))}
            </ul>
          ) : (
            <p className={styles.empty} role="status">
              {activitiesPage.list.filters.empty}
            </p>
          )}
        </div>
      </section>

      <section className={styles.band} aria-labelledby="get-heading">
        <div className={styles.inner}>
          <p className={styles.eyebrow}>{activitiesPage.get.eyebrow}</p>
          <h2 id="get-heading" className={styles.headingPlain}>
            {activitiesPage.get.heading.lead}{' '}
            {activitiesPage.get.heading.accent}
          </h2>
          <p className={styles.intro}>{activitiesPage.get.body}</p>
          {/* The long version lives on each world's landing page. */}
          <div className={styles.links}>
            {activitiesPage.get.worlds.map((world) => (
              <a
                key={world.href}
                className="hf-button hf-button--outline hf-button--small"
                href={world.href}
              >
                {world.label}
              </a>
            ))}
            <a className={styles.signIn} href="/questions/">
              {activitiesPage.get.faqCta}
            </a>
          </div>
        </div>
      </section>
    </>
  );
};

export default ActivitiesPage;
