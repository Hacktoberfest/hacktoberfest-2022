import { my } from 'data/content.mjs';
import { countryCodeFor } from 'lib/countryFlag.mjs';
import { festTimeRange, formatFestDate } from 'lib/fests.mjs';

import styles from './FestsBand.module.css';

/* One fest. The badge is the participation status the API sends — yellow
   "Registered" until the organizer scans you in, green "Checked in" after —
   with one derived exception: grey "Did not attend" when a fest ended
   twelve-plus hours ago and the status still reads registered (the band
   computes that via lib's festDidNotAttend and passes it down). Organized
   events have no participation status, so their badge falls back to the
   role, past-tensed via `past`.
   That badge is the card's only tell: every card sits on the same
   background whatever its date, because dimming past cards made dated
   cards read as a different surface next to undated ones. A malformed
   date renders no date line at all rather than garbage. */

const ClockIcon = () => (
  <svg
    className={styles.badgeIcon}
    viewBox="0 0 24 24"
    aria-hidden="true"
    focusable="false"
  >
    <circle
      cx="12"
      cy="12"
      r="8.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
    />
    <path
      d="M12 7.5V12l3.5 2.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="square"
    />
  </svg>
);

const CheckIcon = () => (
  <svg
    className={styles.badgeIcon}
    viewBox="0 0 24 24"
    aria-hidden="true"
    focusable="false"
  >
    <path
      d="M4 12.5 9.5 18 20 6.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="square"
    />
  </svg>
);

/* A pencil — the application is still being written. Deliberately not the
   clock, which already means Registered's "waiting on the organizer".
   Filled silhouette, like the star: stroked detail turns to mush at 11px. */
const PencilIcon = () => (
  <svg
    className={styles.badgeIcon}
    viewBox="0 0 24 24"
    aria-hidden="true"
    focusable="false"
  >
    <path d="M4 20l1.2-4.4L16 4.8 19.2 8 8.4 18.8 4 20z" fill="currentColor" />
  </svg>
);

/* A paper plane — the application is sent, out of the organizer's hands.
   Not the clock for the same reason the pencil isn't: that glyph already
   means Registered's kind of waiting. Filled silhouette like the rest. */
const PlaneIcon = () => (
  <svg
    className={styles.badgeIcon}
    viewBox="0 0 24 24"
    aria-hidden="true"
    focusable="false"
  >
    <path
      d="M22 3 2 10.6l6.6 2.3.8 6.5 3.2-4.5 5.2 4.1L22 3z"
      fill="currentColor"
    />
  </svg>
);

/* Filled, not stroked like the clock and check: a 5-point star outline
   turns to mush at 11px. Drawn about (12,13) rather than the box center —
   a star's ink stops well short of its circumscribed circle at the bottom,
   so true geometric centering reads as floating high. */
const StarIcon = () => (
  <svg
    className={styles.badgeIcon}
    viewBox="0 0 24 24"
    aria-hidden="true"
    focusable="false"
  >
    <path
      d="M12 3 L14.65 9.36 L21.51 9.91 L16.28 14.39 L17.88 21.09 L12 17.5 L6.12 21.09 L7.72 14.39 L2.49 9.91 L9.35 9.36 Z"
      fill="currentColor"
    />
  </svg>
);

const CrossIcon = () => (
  <svg
    className={styles.badgeIcon}
    viewBox="0 0 24 24"
    aria-hidden="true"
    focusable="false"
  >
    <path
      d="M6 6l12 12M18 6 6 18"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="square"
    />
  </svg>
);

const badgeFor = (fest, past, didNotAttend) => {
  /* An event application in flight: the badge names the application's rung
     rather than the role, because "Hosting" would overpromise a Fest
     that MLH hasn't approved yet. Light-orange-with-pencil for a draft —
     the Hosting family's tint, still being written — a plain badge while
     MLH reviews, green-with-check once approved. An unknown rung falls
     through to the role badge rather than rendering an empty label. */
  if (fest.applicationStatus === 'draft') {
    return {
      label: my.fests.applicationBadges.draft,
      className: `${styles.badge} ${styles.badgeApplication}`,
      icon: <PencilIcon />,
    };
  }
  if (fest.applicationStatus === 'submitted') {
    return {
      label: my.fests.applicationBadges.submitted,
      className: styles.badge,
      icon: <PlaneIcon />,
    };
  }
  if (fest.applicationStatus === 'approved') {
    return {
      label: my.fests.applicationBadges.approved,
      className: `${styles.badge} ${styles.badgeCheckedIn}`,
      icon: <CheckIcon />,
    };
  }
  if (fest.role === 'organizing') {
    return {
      label: past
        ? my.fests.roleBadges.organized
        : my.fests.roleBadges.organizing,
      className: `${styles.badge} ${styles.badgeHosting}`,
      icon: <StarIcon />,
    };
  }
  if (fest.status === 'checked_in') {
    return {
      label: my.fests.statusBadges.checkedIn,
      className: `${styles.badge} ${styles.badgeCheckedIn}`,
      icon: <CheckIcon />,
    };
  }
  if (didNotAttend) {
    return {
      label: my.fests.statusBadges.didNotAttend,
      className: `${styles.badge} ${styles.badgeDidNotAttend}`,
      icon: <CrossIcon />,
    };
  }
  return {
    label: my.fests.statusBadges.registered,
    className: `${styles.badge} ${styles.badgeRegistered}`,
    icon: <ClockIcon />,
  };
};

/* The card's one link. An application card sends the organizer back to
   MLH's form — "Finish your application" while it's a draft, "View
   application" after — and every other card keeps the registration link.
   Application cards never carry a registrationUrl, so this is a straight
   either/or rather than a precedence fight. */
const linkFor = (fest) => {
  if (fest.manageUrl && fest.applicationStatus) {
    return {
      href: fest.manageUrl,
      label:
        my.fests.applicationCtas[fest.applicationStatus] ||
        my.fests.applicationCtas.submitted,
    };
  }
  if (fest.registrationUrl) {
    return { href: fest.registrationUrl, label: my.fests.viewFestCta };
  }
  return null;
};

const FestCard = ({ fest, past, didNotAttend }) => {
  const badge = badgeFor(fest, past, didNotAttend);
  const link = linkFor(fest);
  const location = [fest.city, fest.country].filter(Boolean).join(', ');
  const date = formatFestDate(fest.date);
  const time = festTimeRange(fest);
  /* Same flag treatment as the /fests directory cards: unrecognized
     country name -> no flag, and aria-hidden because the country is
     already read out in the location line. */
  const flagCode = countryCodeFor(fest.country);

  return (
    <article className={styles.card}>
      <div className={styles.cardBody}>
        {flagCode && (
          <span
            className={`fi fis fi-${flagCode} ${styles.cardFlag}`}
            aria-hidden="true"
          />
        )}
        <span className={badge.className}>
          {badge.icon}
          {badge.label}
        </span>
        <h4 className={styles.cardTitle}>{fest.name}</h4>
        {location && <p className={styles.cardMeta}>{location}</p>}
        {date && (
          <p className={styles.cardMeta}>
            {date}
            {time && <span className={styles.cardTime}> · {time}</span>}
          </p>
        )}
      </div>
      {/* The card's one link is its footer: a full-width action bar under
         an ink rule, so every linked card ends in the same tap target
         wherever its meta lines stop. Cards with no link simply end at
         the body. */}
      {link && (
        <a
          className={styles.cardAction}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
        >
          {link.label}
          <span aria-hidden="true">→</span>
        </a>
      )}
    </article>
  );
};

export default FestCard;
