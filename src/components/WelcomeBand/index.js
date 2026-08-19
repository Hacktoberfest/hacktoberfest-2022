import { useState } from 'react';

import DevLogo from 'components/icons/DevLogo';
import MlhLogo from 'components/icons/MlhLogo';
import PageHero from 'components/PageHero';
import { my } from 'data/content.mjs';
import { MLH_ACCOUNT_URL } from 'data/links';
import { firstName, initials } from 'lib/profile.mjs';

import styles from './WelcomeBand.module.css';

/* The page's hero greeting plus a boxed account strip under it: who you
   are, DEV link status, sign out. The greeting personalizes once the
   fetch lands — until then (and for an account with no usable name) it
   falls back to a generic "Hi there," so the line never renders wrong,
   and the two-line shape never changes, so nothing shifts.

   The DEV link is a button in both states — the pending accent and
   "Connect" while the link is still to make, a plain "Manage" once made
   — see the note on the action group below.

   `user` is null in the error state — the band only renders once the
   loading surface has yielded, so null means there is nothing left to
   wait for, and the identity area renders no strip at all. */
/* Same star as the Hosting badge in the fests band, drawn about (12,13)
   for the same optical-centering reason noted there. */
const StarIcon = () => (
  <svg
    className={styles.hostBadgeIcon}
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

/* `host`: the user has a real organized Fest — hosting or hosted, never a
   still-in-progress application. Derived in the page from the same fests
   the band below renders, so the chip and the Hosting cards can't
   disagree. */
const WelcomeBand = ({ user, host, onSignOut }) => {
  const [avatarFailed, setAvatarFailed] = useState(false);

  const name = (user && user.name) || '';
  const email = user && user.email;
  const avatarUrl = user && user.avatarUrl;
  const devLinked = Boolean(user && user.devLinked);
  const showAvatarImage = Boolean(avatarUrl) && !avatarFailed;

  const greetingName = firstName(name) || my.welcome.fallbackName;

  return (
    <div>
      {/* One greeting on both sides of the Preptember flag: the hub is
         "your Hacktoberfest" whichever month it's living in. A
         month-naming Preptember accent used to swap in here; it retired
         2026-08-18. */}
      <PageHero
        lead={my.welcome.greeting(greetingName)}
        accent={my.welcome.accent}
      />
      <div className={styles.band}>
        {user ? (
          <div className={styles.accountStrip}>
            <span className={styles.avatar}>
              {showAvatarImage ? (
                <img
                  className={styles.avatarImg}
                  src={avatarUrl}
                  alt=""
                  onError={() => setAvatarFailed(true)}
                />
              ) : (
                <span aria-hidden="true">{initials(name)}</span>
              )}
            </span>
            <span className={styles.who}>
              <span className={styles.nameRow}>
                <span className={styles.name}>{name}</span>
                {host && (
                  <span className={styles.hostBadge}>
                    <StarIcon />
                    {my.identity.hostBadge}
                  </span>
                )}
              </span>
              <span className={styles.email}>{email}</span>
            </span>
            {/* One uniform action group at the strip's end; the DEV button
             is an action like the other two, so it sits with them rather
             than floating near the identity as a differently-shaped chip.
             It renders in both states — the pending accent and "Connect"
             while the link is still to make, a plain "Manage" once made,
             mirroring the MLH button — and both land on the same DEV
             settings page, which is where the connection lives either
             way. */}
            <span className={styles.actions}>
              <a
                className={
                  devLinked
                    ? styles.actionButton
                    : `${styles.actionButton} ${styles.actionPending}`
                }
                href={my.identity.devConnectHref}
                target="_blank"
                rel="noopener noreferrer"
              >
                <DevLogo className={styles.buttonLogo} />
                {devLinked
                  ? my.identity.devManageCta
                  : my.identity.devConnectCta}
              </a>
              <a
                className={styles.actionButton}
                href={MLH_ACCOUNT_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MlhLogo className={styles.buttonLogo} />
                {my.identity.manageCta}
              </a>
              <button
                type="button"
                className={styles.actionButton}
                onClick={onSignOut}
              >
                {my.identity.signOut}
              </button>
            </span>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default WelcomeBand;
