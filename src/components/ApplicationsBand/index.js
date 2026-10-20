import { useCallback, useRef, useState } from 'react';

import AcknowledgementsModal from 'components/AcknowledgementsModal';
import PublicationChecksModal from 'components/PublicationChecksModal';
import { my } from 'data/content.mjs';
import { HACK_DAYS_URLS } from 'data/links';
import {
  AlertIcon,
  CheckIcon,
  ClosedIcon,
  HourglassIcon,
  PlaneIcon,
  StarIcon,
} from 'components/icons/badges';
import { countryCodeFor } from 'lib/countryFlag.mjs';
import {
  eventCardState,
  festTimeRange,
  formatFestDate,
  hasFestDashboard,
  organizingFests,
} from 'lib/fests.mjs';

import styles from './ApplicationsBand.module.css';

/* Your Applications: Preptember's stand-in for the fests grid, showing
   only the signed-in user's own organizing entries — applications in
   flight and confirmed events — as full-width cards, one per row. Badges,
   CTAs, and their copy are the fests band's (my.fests), deliberately: an
   application card here must read identically to the same card in Your
   Fests when the flag flips. The ghost closes the list; with Fest
   applications closed, it points at MLH Hack Days rather than the
   application, and anything not yet published shows as closed. */

/* The application badge ladder — the fests band's application rungs,
   with a published event as the top rung. That fallback says
   "Event Published", not the fests band's "Hosting"/"Hosted": this list
   is about where applications stand, and a public event is simply an
   application that made it all the way — which is also why nothing here
   past-tenses by date the way Your Fests does.

   Colour splits the ladder by whose move it is: the rungs waiting on the
   host wear the hosting orange, and the rungs waiting on us (our checks
   running, and the published Fest they end at) wear the green. The two are told apart by the API's shape —
   an approved application whose event MLH has published arrives as an
   event card (no applicationStatus), while one still unpublished falls
   back to an application card and keeps the "Ready to publish" rung
   above.

   Participation badges don't exist here: organizing entries carry no
   status. */
/* Fest applications are closed, and so is the road to publishing: any
   card not yet published (a draft, an application at any rung, or an
   MLH event still short of acknowledgements or checks) wears the closed
   badge and loses its link. Only a published Fest, the top rung, keeps
   its card as it was. The rungs below stay in place, dormant, so the
   ladder comes back with this one line if publishing ever reopens. */
const isClosed = (fest) => eventCardState(fest) !== 'published';

const badgeFor = (fest) => {
  if (isClosed(fest)) {
    return {
      label: my.applications.closedBadge,
      className: `${styles.badge} ${styles.badgeClosed}`,
      icon: <ClosedIcon className={styles.badgeIcon} />,
    };
  }
  if (fest.applicationStatus === 'submitted') {
    return {
      label: my.fests.applicationBadges.submitted,
      className: styles.badge,
      icon: <PlaneIcon className={styles.badgeIcon} />,
    };
  }
  if (fest.applicationStatus === 'approved') {
    return {
      label: my.fests.applicationBadges.approved,
      className: `${styles.badge} ${styles.badgeHostsMove}`,
      icon: <CheckIcon className={styles.badgeIcon} />,
    };
  }
  /* MLH sent the application back for changes. Red, inverted: the one
     rung where the next move is the host's, and the card should say so
     before the title does. */
  if (fest.applicationStatus === 'rejected') {
    return {
      label: my.fests.applicationBadges.rejected,
      className: `${styles.badge} ${styles.badgeRejected}`,
      icon: <AlertIcon className={styles.badgeIcon} />,
    };
  }
  /* Past the application rungs the card is a real event, and the badge
     names which of the two worlds it has reached: MLH's, or ours too. */
  const state = eventCardState(fest);
  if (state === 'needs-acknowledgements') {
    return {
      label: my.fests.eventBadges.needsAcknowledgements,
      className: `${styles.badge} ${styles.badgeHostsMove}`,
      icon: <AlertIcon className={styles.badgeIcon} />,
    };
  }
  /* Orange, and an alert rather than an hourglass: a failing check is the
     host's to fix, and the badge that used to sit here told them to wait. */
  if (state === 'checks-failed') {
    return {
      label: my.fests.eventBadges.checksFailed,
      className: `${styles.badge} ${styles.badgeHostsMove}`,
      icon: <AlertIcon className={styles.badgeIcon} />,
    };
  }
  if (state === 'checks-underway') {
    return {
      label: my.fests.eventBadges.checksUnderway,
      className: `${styles.badge} ${styles.badgeOurMove}`,
      icon: <HourglassIcon className={styles.badgeIcon} />,
    };
  }
  if (state === 'approved-private') {
    return {
      label: my.fests.applicationBadges.approved,
      className: `${styles.badge} ${styles.badgeHostsMove}`,
      icon: <CheckIcon className={styles.badgeIcon} />,
    };
  }
  return {
    label: my.applications.publishedBadge,
    className: `${styles.badge} ${styles.badgeOurMove}`,
    icon: <StarIcon className={styles.badgeIcon} />,
  };
};

/* The card's one action. Application cards keep their ladder CTAs; event
   cards act by publication state: the acknowledgements rung renders a
   BUTTON (it opens the modal, it navigates nowhere), a private event
   links where the host manages it, and anything with a public page links
   there. */
const actionFor = (fest) => {
  // Every link left on a closed card leads back into a closed process.
  if (isClosed(fest)) return null;
  if (fest.manageUrl && fest.applicationStatus) {
    return {
      kind: 'link',
      href: fest.manageUrl,
      label:
        my.fests.applicationCtas[fest.applicationStatus] ||
        my.fests.applicationCtas.submitted,
    };
  }
  const state = eventCardState(fest);
  if (state === 'needs-acknowledgements') {
    return {
      kind: 'button',
      modal: 'acknowledgements',
      label: my.acknowledgements.cta,
    };
  }
  /* The failing rung takes the footer for the same reason the
     acknowledgements rung does: the Fest is off the website, which is the
     most time-critical thing on this card and does not get buried a click
     deeper. The dashboard keeps its quieter spot in the body. */
  if (state === 'checks-failed') {
    return {
      kind: 'button',
      modal: 'checks',
      label: my.fests.checksFailed.cta,
    };
  }
  if (state === 'approved-private' && fest.manageUrl) {
    return {
      kind: 'link',
      href: fest.manageUrl,
      label: my.fests.applicationCtas.approved,
    };
  }
  /* The dashboard is where a host's own Fest lives now: the listing and the
     Organizer HQ link both moved onto it, so the card needs one destination
     rather than three. The acknowledgements rung is the exception, handled
     above — that button is the most time-critical thing on this page and does
     not get buried a click deeper. */
  const href = dashboardHref(fest);
  if (href) {
    return { kind: 'internal', href, label: my.dashboard.openCta };
  }
  const viewUrl = fest.websiteUrl || fest.registrationUrl;
  if (viewUrl) {
    return {
      kind: 'link',
      href: viewUrl,
      label: my.fests.viewFestCta,
    };
  }
  return null;
};

/* Where this card's own dashboard lives, once it has one. Application cards
   never do: there is no event behind them yet. An event card gets one when a
   host has completed the final acknowledgements, or an admin has
   force-published it (see hasFestDashboard), so the "One step left" card
   carries its button and no dashboard link, and gains the link the moment
   the modal confirms. */
const dashboardHref = (fest) =>
  hasFestDashboard(fest) ? `/my/fest/?id=${encodeURIComponent(fest.id)}` : null;

const ApplicationCard = ({ fest, onFestAcknowledged }) => {
  const badge = badgeFor(fest);
  const action = actionFor(fest);
  const location = [fest.city, fest.country].filter(Boolean).join(', ');
  const date = formatFestDate(fest.date);
  const time = festTimeRange(fest);
  const flagCode = countryCodeFor(fest.country);
  /* Which modal the footer button opens, or null when it is closed. Both
     funnel their close through here so focus returns to the button that
     opened them. */
  const [openModal, setOpenModal] = useState(null);
  const actionButtonRef = useRef(null);
  const closeModal = useCallback(() => {
    setOpenModal(null);
    actionButtonRef.current?.focus();
  }, []);

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
        {isClosed(fest) && (
          <p className={styles.cardNote}>
            {fest.applicationStatus === 'draft'
              ? my.applications.closedNote
              : my.applications.closedUnpublishedNote}
          </p>
        )}
        {/* The footer belongs to whatever the rung most needs a host to do
           next — completing acknowledgements, fixing a failing check, or
           publishing in MLH — and the dashboard takes the quieter spot in
           the body whenever the footer is already spoken for and the Fest
           has one. Of those three, only the failing check comes after the
           final step, so it is the one that shows both. */}
        {action && action.kind !== 'internal' && dashboardHref(fest) && (
          <a className={styles.cardDashboardLink} href={dashboardHref(fest)}>
            {my.dashboard.openCta}
          </a>
        )}
      </div>
      {/* Same footer action bar as the fests cards — the card's one link
         spans its bottom edge, so every linked card ends in the same
         tap target. */}
      {action && action.kind === 'link' && (
        <a
          className={styles.cardAction}
          href={action.href}
          target="_blank"
          rel="noopener noreferrer"
        >
          {action.label}
          <span aria-hidden="true">→</span>
        </a>
      )}
      {action && action.kind === 'internal' && (
        <a className={styles.cardAction} href={action.href}>
          {action.label}
          <span aria-hidden="true">→</span>
        </a>
      )}
      {action && action.kind === 'button' && (
        <button
          type="button"
          ref={actionButtonRef}
          className={`${styles.cardAction} ${styles.cardActionButton}`}
          onClick={() => setOpenModal(action.modal)}
        >
          {action.label}
          <span aria-hidden="true">→</span>
        </button>
      )}
      {openModal === 'acknowledgements' && (
        <AcknowledgementsModal
          fest={fest}
          onClose={closeModal}
          onAcknowledged={onFestAcknowledged}
        />
      )}
      {openModal === 'checks' && (
        <PublicationChecksModal fest={fest} onClose={closeModal} />
      )}
    </article>
  );
};

const ApplicationsBand = ({ experience, onFestAcknowledged }) => {
  const fests = organizingFests(experience.fests);

  /* The ghost always closes the list, and with Fest applications closed it
     sends would-be hosts to MLH Hack Days. Voice follows the list: "Fest
     applications are closed" for an empty one, "Run it again" under real
     cards. Each voice carries its own tag. */
  const hasEntries = fests.length > 0;
  const ghost = hasEntries ? my.applications.ghostMore : my.applications.ghost;
  const ghostHref = hasEntries
    ? HACK_DAYS_URLS.myHostingAgain
    : HACK_DAYS_URLS.myHostingClosed;

  return (
    <section className={styles.band} aria-labelledby="applications-heading">
      <h2 id="applications-heading" className={styles.heading}>
        {my.applications.heading.lead} <em>{my.applications.heading.accent}</em>
      </h2>
      <p className={styles.lede}>{my.applications.lede}</p>

      <div className={styles.list}>
        {fests.map((fest) => (
          <ApplicationCard
            key={fest.id}
            fest={fest}
            onFestAcknowledged={onFestAcknowledged}
          />
        ))}
        <div className={styles.ghostCard}>
          <div className={styles.ghostContent}>
            <h3 className={styles.ghostTitle}>{ghost.title}</h3>
            <p className={styles.ghostBody}>{ghost.body}</p>
          </div>
          <a
            className={styles.ghostAction}
            href={ghostHref}
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
