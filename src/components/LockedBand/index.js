import { my } from 'data/content.mjs';

import styles from './LockedBand.module.css';

/* A filled padlock, the host resources band's: stroked detail turns to
   mush at badge size. */
const LockIcon = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    aria-hidden="true"
    focusable="false"
  >
    <path
      d="M7 10V8a5 5 0 0 1 10 0v2h1.5v11h-13V10H7zm2.5 0h5V8a2.5 2.5 0 0 0-5 0v2z"
      fill="currentColor"
    />
  </svg>
);

/* A /my band closed until October 1st (data/stickerBookLock.mjs): the
   band's own heading and intro, then one panel where its body would be.
   The panel is the sticker book's empty die-cut slot with a padlock in it,
   a line on what the band will hold, and the badge the host resources band
   wears on a locked row, so it reads as "not yet" rather than broken. The
   sticker book, the milestones and the rewards locker each render through
   this while the lock is on, under their own heading ids.

   `action`: the panel's one way onward, under its line, when it has one:
   { label, href }, drawn as the book spine's link, or as a small button
   with `button`, and in a new tab with `external`. `closing`: the last
   band on the page, which carries the page's bottom gutter as the rewards
   locker does. */
const LockedBand = ({ id, heading, intro, title, copy, action, closing }) => (
  <section
    className={closing ? `${styles.band} ${styles.bandClosing}` : styles.band}
    aria-labelledby={id}
  >
    <h2 id={id} className={styles.heading}>
      {heading.lead} <em>{heading.accent}</em>
    </h2>
    <p className={styles.intro}>{intro}</p>
    <div className={styles.panel}>
      <span className={styles.slot} aria-hidden="true">
        <LockIcon className={styles.slotLock} />
      </span>
      <div className={styles.body}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.copy}>{copy}</p>
        {action ? (
          <div className={styles.action}>
            <a
              className={
                action.button ? 'hf-button hf-button--small' : styles.link
              }
              href={action.href}
              {...(action.external
                ? { target: '_blank', rel: 'noopener noreferrer' }
                : {})}
            >
              {action.label}
            </a>
          </div>
        ) : null}
      </div>
      <p className={styles.badge}>
        <LockIcon className={styles.badgeLock} />
        {my.locked.badge}
      </p>
    </div>
  </section>
);

export default LockedBand;
