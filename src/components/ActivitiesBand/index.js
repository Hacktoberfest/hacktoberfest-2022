import { useRef } from 'react';

import { my } from 'data/content.mjs';
import { mergeActivities } from 'lib/eligibility.mjs';

import ActivityCard from './ActivityCard';
import styles from './ActivitiesBand.module.css';

/* Every activity as a big card in a horizontal, scroll-snapping carousel.
   The fest activity renders here too — its `surface: 'fests'` no longer
   filters it out; that field now marks which band owns the completion
   attribution (My Fests carries the fest's "counts toward your stickers"
   note, beside the fests themselves).

   The carousel is native overflow scrolling with CSS scroll-snap — no
   library, nothing the static export can't do. The arrow buttons are a
   desktop convenience over that native scrolling and hide on touch-width
   screens, where swiping is the natural gesture. */
const CARD_SCROLL_RATIO = 0.8;

const ActivitiesBand = ({ experience }) => {
  const cards = mergeActivities(experience.activities);
  const devLinked = Boolean(experience.user && experience.user.devLinked);
  const scrollerRef = useRef(null);

  const scrollByCards = (direction) => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const reduced = globalThis.matchMedia
      ? globalThis.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false;
    scroller.scrollBy({
      left: direction * scroller.clientWidth * CARD_SCROLL_RATIO,
      behavior: reduced ? 'auto' : 'smooth',
    });
  };

  return (
    <section className={styles.band} aria-labelledby="activities-heading">
      <div className={styles.bandHeader}>
        <h2 id="activities-heading" className={styles.heading}>
          {my.activities.heading.lead} <em>{my.activities.heading.accent}</em>
        </h2>
        <div className={styles.arrows}>
          <button
            type="button"
            className={styles.arrowButton}
            aria-label={my.activities.previous}
            onClick={() => scrollByCards(-1)}
          >
            ←
          </button>
          <button
            type="button"
            className={styles.arrowButton}
            aria-label={my.activities.next}
            onClick={() => scrollByCards(1)}
          >
            →
          </button>
        </div>
      </div>
      <div
        ref={scrollerRef}
        className={styles.scroller}
        aria-label={my.activities.carouselLabel}
      >
        {cards.map((activity, index) => (
          <ActivityCard
            key={activity.id}
            activity={activity}
            accentIndex={index}
            devLinked={devLinked}
          />
        ))}
      </div>
    </section>
  );
};

export default ActivitiesBand;
