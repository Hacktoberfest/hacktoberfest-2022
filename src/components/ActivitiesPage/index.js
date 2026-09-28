import { useEffect, useState } from 'react';

import ActivityCard from 'components/ActivityCard';
import { activitiesPage } from 'data/content.mjs';
import { chipsFor, filterActivities } from 'lib/activityFilters.mjs';
import { stickerImageSrc } from 'lib/stickerImage.mjs';

import ActivityFilters from './ActivityFilters';
import styles from './ActivitiesPage.module.css';

/* The bands under the hero.

   `activities` is always renderable — the public catalogue
   when there is nothing more specific to show, the signed-in experience's
   own once it has resolved — so the cards never wait on a fetch that
   might fail.

   `slot` is what the page decided (src/lib/activitiesPageState.mjs):
   'signIn' (no session; the how-it-works band ends with the sign-in link),
   'placeholder' (signed in, fetch in flight; nothing extra renders),
   'strip' (signed in and resolved; the cards read earned and Still to do
   is offered, and nothing else renders), or 'error' (the fetch
   failed on anything but a dead session; a notice with a retry sits above
   the cards, and Still to do is not offered because every card reads
   undone in that state).

   The filter is client state and nothing more. It resets to All when
   Still to do stops being offered, so a chip that no longer exists is
   never the pressed one. */
const ActivitiesPage = ({ activities, signedIn, slot, onRetry }) => {
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
          <h2 id="how-heading" className={styles.heading}>
            {activitiesPage.how.heading.lead}{' '}
            <em>{activitiesPage.how.heading.accent}</em>
          </h2>
          <p className={styles.intro}>{activitiesPage.how.intro}</p>
          {/* The three stickers to the pack, as cards: the two required
              ones drawn in the book's frame, the third slot empty, since
              it is any card below. In order, because they add up. */}
          <ol className={styles.steps}>
            {activitiesPage.how.steps.map((step) => (
              <li key={step.title} className={styles.step}>
                {step.art ? (
                  <div className={styles.stepSticker} aria-hidden="true">
                    <img
                      className={styles.stepStickerImage}
                      src={stickerImageSrc(step.art)}
                      alt=""
                      draggable="false"
                    />
                  </div>
                ) : (
                  <div
                    className={`${styles.stepSticker} ${styles.stepAny}`}
                    aria-hidden="true"
                  >
                    <span>{step.mark}</span>
                  </div>
                )}
                <div>
                  <p className={styles.stepTag}>{step.tag}</p>
                  <h3 className={styles.stepTitle}>{step.title}</h3>
                  <p className={styles.stepCopy}>{step.copy}</p>
                </div>
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
    </>
  );
};

export default ActivitiesPage;
