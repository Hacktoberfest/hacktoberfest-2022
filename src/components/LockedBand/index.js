import { my } from 'data/content.mjs';

import LockedPanel from './LockedPanel';
import styles from './LockedBand.module.css';

/* A /my band closed until October 1st (data/stickerBookLock.mjs): the
   band's own heading and intro, then the padlocked panel (LockedPanel)
   where its body would be, badged with the date. The sticker book, the
   milestones and the rewards locker each render through this while the
   lock is on, under their own heading ids.

   `action`: the panel's one way onward (see LockedPanel). None of them
   closes the page: the promos band under them carries the bottom gutter. */
const LockedBand = ({ id, heading, intro, title, copy, action }) => (
  <section className={styles.band} aria-labelledby={id}>
    <h2 id={id} className={styles.heading}>
      {heading.lead} <em>{heading.accent}</em>
    </h2>
    <p className={styles.intro}>{intro}</p>
    <LockedPanel
      title={title}
      copy={copy}
      badge={my.locked.badge}
      action={action}
    />
  </section>
);

export default LockedBand;
