import ActivityCard from 'components/ActivityCard';
import { my } from 'data/content.mjs';
import { mergeActivities } from 'lib/eligibility.mjs';

import styles from './ActivitiesBand.module.css';

/* Every activity as a card, the same card /activities/ draws
   (components/ActivityCard), in a grid rather than the carousel this band
   used to be: four cards fit two-up from tablet width, so nothing is ever
   clipped at the edge and there are no arrows to find. The fest activity
   renders here too; its `surface: 'fests'` marks which band owns the
   completion attribution (My Fests carries the fest's "counts toward your
   stickers" note, beside the fests themselves). */
const ActivitiesBand = ({ experience }) => {
  const cards = mergeActivities(experience.activities);
  const devLinked = Boolean(experience.user && experience.user.devLinked);

  return (
    <section className={styles.band} aria-labelledby="activities-heading">
      <h2 id="activities-heading" className={styles.heading}>
        {my.activities.heading.lead} <em>{my.activities.heading.accent}</em>
      </h2>
      <ul className={styles.cards}>
        {cards.map((activity) => (
          <ActivityCard
            key={activity.id}
            activity={activity}
            signedIn
            devLinked={devLinked}
          />
        ))}
      </ul>
    </section>
  );
};

export default ActivitiesBand;
