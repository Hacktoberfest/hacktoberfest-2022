import { my } from 'data/content.mjs';

import ActivityArt from './ActivityArt';
import styles from './ActivitiesBand.module.css';

/* One big activity card. `accentIndex` cycles the homepage's square
   colors — orange, sky, ochre, pink — driving both the accent class
   (border shadow) and which art panel crowns the card. Status is a marker
   line, not a checkbox — the qualify display is expected to be reworked,
   and a one-line marker is the cheapest thing to change. */
const ACCENT_CLASSES = ['accent0', 'accent1', 'accent2', 'accent3'];

const ActivityCard = ({ activity, accentIndex, devLinked }) => {
  const showDevHint =
    activity.requiresDevLink && !devLinked && !activity.completed;
  const accent = styles[ACCENT_CLASSES[accentIndex % ACCENT_CLASSES.length]];

  return (
    <article className={`${styles.card} ${accent}`}>
      <ActivityArt variant={accentIndex} />
      {/* Overlays the art when done — and IS the card's completion text
         for assistive tech (only the check glyph is decorative), since
         the old marker line below the detail is gone. */}
      {activity.completed && (
        <span className={styles.completeBadge}>
          <span aria-hidden="true">✓ </span>
          {my.activities.done}
        </span>
      )}
      <h3 className={styles.cardTitle}>{activity.label}</h3>
      <p className={styles.cardDetail}>{activity.detail}</p>
      {showDevHint && <p className={styles.devHint}>{my.activities.devHint}</p>}
      <a
        className={styles.cardCta}
        href={activity.href}
        target="_blank"
        rel="noopener noreferrer"
      >
        {activity.ctaLabel}
      </a>
    </article>
  );
};

export default ActivityCard;
