import { activitiesPage } from 'data/content.mjs';

import styles from './ActivitiesPage.module.css';
import { ART } from './stickerArt';

/* One activity as a card: its sticker in a die-cut slot at the left,
   centred on the card's height, and the words at the right. Signed in and
   earned, the sticker peels off the slot and a done line says when and
   how; the CTA stays, because a done Fest still has a next Fest to find.
   Unearned cards are untouched — nothing on this page is dimmed for not
   being done yet. */
const formatDate = (iso) => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
};

const StickerCard = ({ activity, signedIn }) => {
  const earned = Boolean(signedIn && activity.completed);
  const external = /^https?:\/\//.test(activity.href || '');
  const date = activity.completedAt ? formatDate(activity.completedAt) : null;
  const how = activity.source
    ? activitiesPage.list.source[activity.source]
    : null;
  const typeClass = styles[`type_${activity.type}`] || '';

  return (
    <li className={styles.card} data-earned={earned ? 'true' : undefined}>
      <div className={styles.slot}>
        <div className={`${styles.sticker} ${typeClass}`}>
          {ART[activity.art] || null}
        </div>
        {earned && (
          <span className={styles.earnedTab}>{activitiesPage.list.earned}</span>
        )}
      </div>
      <div className={styles.body}>
        <span className={`${styles.type} ${typeClass}`}>
          {activitiesPage.list.types[activity.type]}
        </span>
        <h3 className={styles.cardTitle}>{activity.label}</h3>
        <p className={styles.cardDetail}>{activity.detail}</p>
        {earned && (
          <p className={styles.cardDone}>
            <span aria-hidden="true">✓ </span>
            {date ? activitiesPage.list.doneOn(date) : activitiesPage.list.done}
            {how ? `, ${how}` : ''}
          </p>
        )}
        {/* No destination yet — skip the CTA rather than ship a dead link. */}
        {activity.href && (
          <a
            className={styles.cardCta}
            href={activity.href}
            target={external ? '_blank' : undefined}
            rel={external ? 'noopener noreferrer' : undefined}
          >
            {activity.ctaLabel}
          </a>
        )}
      </div>
    </li>
  );
};

export default StickerCard;
