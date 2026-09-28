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

/* The panel that stands where something is not open yet: the sticker
   book's empty die-cut slot with a padlock in it, a line on what will be
   there, and the badge the host resources band wears on a locked row, so
   it reads as "not yet" rather than broken. LockedBand puts it under a
   /my band's heading; /schedule puts it under its own
   (components/ScheduleDirectory/ComingSoon).

   `badge`: the words on the badge, which say when. `action`: the one way
   onward, under the line, when there is one: { label, href }, drawn as the
   book spine's link, or as a small button with `button`, and in a new tab
   with `external`. */
const LockedPanel = ({ title, copy, badge, action }) => (
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
      {badge}
    </p>
  </div>
);

export default LockedPanel;
