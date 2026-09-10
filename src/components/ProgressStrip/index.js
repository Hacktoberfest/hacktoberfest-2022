import { activitiesPage } from 'data/content.mjs';
import { earnedCount } from 'lib/activityFilters.mjs';
import { stripSlots } from 'lib/progressStrip.mjs';

import styles from './ProgressStrip.module.css';

/* One line of progress in the card language: four sticker slots, the
   earned ones filled in their type's colour, the count beside them, and
   an optional way onward. /activities/ shows it under the hero with a link
   to the hub; /my shows it above the milestone card with no link, since
   the hub is where it already is. `inBand` is /my's: inside a band the
   band carries the width, so the strip gives up its own. Client-only on
   both: it renders once the signed-in fetch resolves and never in the
   export.

   The slots are aria-hidden: the count says the same thing in words, and a
   list of four unlabeled circles read aloud would say it worse. */
const ProgressStrip = ({ activities, cta = null, inBand = false }) => {
  const slots = stripSlots(activities);
  const earned = earnedCount(activities);

  return (
    <div
      className={inBand ? `${styles.strip} ${styles.inBand}` : styles.strip}
      role="status"
    >
      <span className={styles.slots} aria-hidden="true">
        {slots.map((slot) => (
          <span
            key={slot.id}
            className={`${styles.slot} ${styles[`type_${slot.type}`] || ''}`}
            data-earned={slot.earned ? 'true' : undefined}
            title={slot.label}
          />
        ))}
      </span>
      <span className={styles.count}>
        {activitiesPage.strip.count(earned, slots.length)}
      </span>
      {cta && (
        <a className={styles.link} href={cta.href}>
          {cta.label}
        </a>
      )}
    </div>
  );
};

export default ProgressStrip;
