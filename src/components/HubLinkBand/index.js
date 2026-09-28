import { my } from 'data/content.mjs';
import { writeLastHub } from 'lib/myView.mjs';

import styles from './HubLinkBand.module.css';

/* One dashed strip under the account strip, on both hubs, for people who
   have two: a badge naming the other hub, one sentence on what is there,
   and the link. `to` is the hub the band points at.

   The click writes the memory before the navigation: /my/ sends hosts on
   to /my/hosting/ unless their last choice was attending, and the moment
   of choosing is this click, not the render of the page it lands on. A
   host following the attending link would otherwise arrive at /my/ with
   "hosting" still remembered and bounce straight back.

   Middle-click fires auxclick rather than click, so it gets the same
   write; the context menu's "Open in new tab" is the one path no handler
   sees, and that tab lands on whichever hub the memory says. */
const HubLinkBand = ({ to, festCount = 0 }) => {
  const copy = my.hubLink[to];
  return (
    <nav className={styles.band} aria-label={my.hubLink.label}>
      <div className={styles.strip}>
        <span
          className={
            to === 'hosting'
              ? `${styles.badge} ${styles.badgeHosting}`
              : `${styles.badge} ${styles.badgeAttending}`
          }
        >
          {copy.badge}
        </span>
        <span className={styles.body}>{copy.body(festCount)}</span>
        <a
          className={styles.cta}
          href={copy.href}
          onClick={() => writeLastHub(to)}
          onAuxClick={(event) => {
            if (event.button === 1) writeLastHub(to);
          }}
        >
          {copy.cta}
        </a>
      </div>
    </nav>
  );
};

export default HubLinkBand;
