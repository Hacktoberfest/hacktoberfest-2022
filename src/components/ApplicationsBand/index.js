import { my } from 'data/content.mjs';
import { MY_HOST_APPLY_URL } from 'data/links';
import { countryCodeFor } from 'lib/countryFlag.mjs';
import { festTimeRange, formatFestDate, organizingFests } from 'lib/fests.mjs';

import styles from './ApplicationsBand.module.css';

/* Your Applications: Preptember's stand-in for the fests grid, showing
   only the signed-in user's own organizing entries — applications in
   flight and confirmed events — as full-width cards, one per row. Badges,
   CTAs, and their copy are the fests band's (my.fests), deliberately: an
   application card here must read identically to the same card in Your
   Fests when the flag flips. The ghost stands in when there is nothing to
   list, and its CTA is the application itself — the one ask Preptember
   exists to make. */

/* The same three badge icons the fests band draws, same geometry notes:
   filled silhouettes for the pencil and star (stroked detail turns to
   mush at 11px), the star drawn about (12,13) for optical centering. */
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

/* A paper plane — the application is sent, out of the organizer's hands.
   Filled silhouette like the pencil and star. */
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

/* The application badge ladder — the fests band's application rungs,
   with a published event as the top rung. That fallback says
   "Event Published", not the fests band's "Hosting"/"Hosted": this list
   is about where applications stand, and a public event is simply an
   application that made it all the way — which is also why nothing here
   past-tenses by date the way Your Fests does.

   It reuses the approved rung's green rather than the hosting orange:
   both are "done" states, and the publish is the same journey one step
   on, not a different colour of thing. The two are told apart by the
   API's shape — an approved application whose event MLH has published
   arrives as an event card (no applicationStatus), while one still
   unpublished falls back to an application card and keeps the
   "Application approved" rung above.

   Participation badges don't exist here: organizing entries carry no
   status. */
const badgeFor = (fest) => {
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
      className: `${styles.badge} ${styles.badgeApproved}`,
      icon: <CheckIcon />,
    };
  }
  return {
    label: my.applications.publishedBadge,
    className: `${styles.badge} ${styles.badgeApproved}`,
    icon: <StarIcon />,
  };
};

/* Same either/or as the fests band: an application links back to MLH's
   form, a live event links to its public page. Application cards never
   carry a registrationUrl, so there is no precedence fight. */
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

const ApplicationCard = ({ fest }) => {
  const badge = badgeFor(fest);
  const link = linkFor(fest);
  const location = [fest.city, fest.country].filter(Boolean).join(', ');
  const date = formatFestDate(fest.date);
  const time = festTimeRange(fest);
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
      {/* Same footer action bar as the fests cards — the card's one link
         spans its bottom edge, so every linked card ends in the same
         tap target. */}
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

const ApplicationsBand = ({ experience }) => {
  const fests = organizingFests(experience.fests);

  /* The ghost always closes the list — the application is Preptember's
     one ask, and the page never stops making it. Voice follows the list:
     the first-application sell for an empty one, the host-another
     invitation under real cards. */
  const ghost =
    fests.length > 0 ? my.applications.ghostMore : my.applications.ghost;

  return (
    <section className={styles.band} aria-labelledby="applications-heading">
      <h2 id="applications-heading" className={styles.heading}>
        {my.applications.heading.lead} <em>{my.applications.heading.accent}</em>
      </h2>
      <p className={styles.lede}>{my.applications.lede}</p>

      <div className={styles.list}>
        {fests.map((fest) => (
          <ApplicationCard key={fest.id} fest={fest} />
        ))}
        <div className={styles.ghostCard}>
          <div className={styles.ghostContent}>
            <h3 className={styles.ghostTitle}>{ghost.title}</h3>
            <p className={styles.ghostBody}>{ghost.body}</p>
          </div>
          <a
            className={styles.ghostAction}
            href={MY_HOST_APPLY_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            {ghost.cta}
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default ApplicationsBand;
