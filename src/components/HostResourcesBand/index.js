import { my } from 'data/content.mjs';
import {
  HOST_BRAND_KIT_URL,
  HOST_DISCORD_URL,
  HOST_EMAIL_URL,
  HOST_HANDBOOK_URL,
} from 'data/links';

import styles from './HostResourcesBand.module.css';

/* Your host resources, under Your Applications. The host handbook and
   the team's inbox are open to everyone — reading one and writing to the
   other is how someone decides to apply. Every other row is gated on
   `approved` (isHost in the page: an approved application or a real
   organized event; draft and submitted don't count), and a gated row is
   still shown while locked — title, copy, and a padlocked "Approved
   hosts" badge where its link would be — so the band doubles as a
   preview of what approval unlocks. */

/* Destinations live here rather than in the copy: my.hostResources is
   words only, and the URLs are constants with their own guards in
   preptember.test.mjs. */
const ITEM_LINKS = {
  handbook: { href: HOST_HANDBOOK_URL, external: true },
  /* Dormant, like the brand kit below: the Discord row is hidden from
     my.hostResources.items for now — see the note there. The wiring waits
     here so restoring the row is one content edit. */
  discord: { href: HOST_DISCORD_URL, external: true },
  /* Not external: a mailto handed target="_blank" leaves a blank tab
     behind once the mail client takes over. */
  email: { href: HOST_EMAIL_URL, external: false },
  /* Dormant: the brand kit row is hidden from my.hostResources.items until
     its URL is real — see the note there. The wiring waits here so
     restoring the row is one content edit. */
  brandKit: { href: HOST_BRAND_KIT_URL, external: true },
};

/* A filled padlock, like the other 11px badge glyphs — stroked detail
   turns to mush at this size. */
const LockIcon = () => (
  <svg
    className={styles.lockIcon}
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

/* `closing`: the band ends the page (October, under Your Fests), so it
   swaps its top padding for the page-closing gutter — the band above
   already carries the gap. Preptember leaves it unset: there the
   why-host chapter below owns the separation. */
const HostResourcesBand = ({ approved, closing }) => (
  <section
    className={closing ? `${styles.band} ${styles.bandClosing}` : styles.band}
    aria-labelledby="host-resources-heading"
  >
    <h2 id="host-resources-heading" className={styles.heading}>
      {my.hostResources.heading.lead} <em>{my.hostResources.heading.accent}</em>
    </h2>
    <p className={styles.lede}>{my.hostResources.lede}</p>

    <div className={styles.card}>
      <ul className={styles.items}>
        {my.hostResources.items.map((item) => {
          const { href, external } = ITEM_LINKS[item.id];
          const locked = item.locked && !approved;
          return (
            <li
              key={item.id}
              className={
                locked ? `${styles.item} ${styles.itemLocked}` : styles.item
              }
            >
              <span className={styles.itemText}>
                <span className={styles.itemTitle}>{item.title}</span>
                <span className={styles.itemCopy}>{item.copy}</span>
              </span>
              {locked ? (
                <span className={styles.lockedBadge}>
                  <LockIcon />
                  {my.hostResources.lockedBadge}
                </span>
              ) : (
                <a
                  className={styles.itemCta}
                  href={href}
                  {...(external
                    ? { target: '_blank', rel: 'noopener noreferrer' }
                    : {})}
                >
                  {item.cta}
                </a>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  </section>
);

export default HostResourcesBand;
