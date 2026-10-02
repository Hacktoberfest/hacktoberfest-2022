import { activitiesPage } from 'data/content.mjs';
import { startDigitalOceanConnect } from 'lib/digitalocean.mjs';
import { stickerImageSrc } from 'lib/stickerImage.mjs';
import { openPreSurvey } from 'lib/survey.mjs';

import styles from './ActivityCard.module.css';

/* What an activity's `action` does on click: a button, never an href. */
const ACTIONS = {
  digitalocean: startDigitalOceanConnect,
  survey: openPreSurvey,
};

/* One activity as a card, the same card wherever an activity is shown:
   the catalogue on /activities/ and the "Pick an activity" band on /my.
   The sticker sits in a die-cut slot at the left, centred on the card's
   height, and the words at the right. Signed in and earned, the sticker
   sits square on its slot with the book's tick on its corner, the way
   the album on /my marks one; the CTA stays, because a done Fest still
   has a next Fest to find. Unearned cards are
   untouched: nothing is dimmed for not being done yet.

   The shadow is the type's deep partner (sky for online, orange for in
   person, ochre for DEV, forest for tools), so a row of cards is
   colour-coded the way the fest cards and the schedule rows are.

   `devLinked` is /my's: an activity that can only be detected through a
   linked DEV account says so until the account is linked. No activity
   needs it this season; the field is honoured so the day one does, the
   card already knows what to say. */
const ActivityCard = ({ activity, signedIn, devLinked = true }) => {
  const earned = Boolean(signedIn && activity.completed);
  const external = /^https?:\/\//.test(activity.href || '');
  const typeClass = styles[`type_${activity.type}`] || '';
  const showDevHint =
    Boolean(activity.requiresDevLink) && !devLinked && !activity.completed;

  return (
    <li
      className={`${styles.card} ${typeClass}`}
      data-earned={earned ? 'true' : undefined}
    >
      <div className={styles.slot}>
        <div className={styles.sticker}>
          <img
            className={styles.stickerImage}
            src={stickerImageSrc(activity.id)}
            alt=""
            draggable="false"
          />
        </div>
        {earned && (
          <span
            className={styles.tick}
            role="img"
            aria-label={activitiesPage.list.earned}
          >
            ✓
          </span>
        )}
      </div>
      <div className={styles.body}>
        <span className={`${styles.type} ${typeClass}`}>
          {activitiesPage.list.types[activity.type]}
        </span>
        <h3 className={styles.cardTitle}>{activity.label}</h3>
        <p className={styles.cardDetail}>{activity.detail}</p>
        {showDevHint && (
          <p className={styles.cardHint}>{activitiesPage.list.devHint}</p>
        )}
        {/* An action rather than a destination: the button starts the
            API's connect flow, or opens the personal survey link. Signed out, the same words lead to /my,
            where signing in comes first. Earned, no button: nothing to do. */}
        {ACTIONS[activity.action] &&
          !earned &&
          (signedIn ? (
            <button
              type="button"
              className={`hf-button hf-button--small ${styles.cardCta}`}
              onClick={() => ACTIONS[activity.action]()}
            >
              {activity.ctaLabel}
            </button>
          ) : (
            <a
              className={`hf-button hf-button--small ${styles.cardCta}`}
              href="/my/"
            >
              {activity.ctaLabel}
            </a>
          ))}
        {/* No destination yet: skip the CTA rather than ship a dead link.
            The site's button at its card size (src/styles/buttons.css). */}
        {activity.href && (
          <a
            className={`hf-button hf-button--small ${styles.cardCta}`}
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

export default ActivityCard;
