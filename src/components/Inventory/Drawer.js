import { my } from 'data/content.mjs';
import { formatEarnedDate } from 'lib/earnedDate.mjs';
import { stickerImageSrc } from 'lib/stickerImage.mjs';

import styles from './Inventory.module.css';

/* The right page of the locker: the thing picked, set the way the
   sticker book sets a page. A head and a note, then the thing as one
   entry, its picture beside the kind, the date and the name, then the two
   facts every thing has (earned by, gets to you), its one call to action,
   all as the API serves them. A thing on DEV with no DEV account linked
   carries the welcome band's Connect DEV account button instead of its
   own. With nothing in the catalogue at all, the page says so. */
const external = (url) => /^https?:\/\//.test(url);

const PageHead = () => (
  <div className={styles.pageHead}>
    <h3 className={styles.pageTitle}>{my.inventory.pages.picked.title}</h3>
    <p className={styles.pageNote}>{my.inventory.pages.picked.note}</p>
  </div>
);

const Drawer = ({ item }) => {
  if (!item) {
    return (
      <div className={`${styles.page} ${styles.rightPage}`}>
        <PageHead />
        <p className={styles.entryLine}>{my.inventory.nothing}</p>
      </div>
    );
  }

  const kind = item.earned ? item.kind : 'locked';
  const date = item.earnedAt ? formatEarnedDate(item.earnedAt) : null;
  const action = item.needsDev
    ? { label: my.identity.devConnectCta, url: my.identity.devConnectHref }
    : item.cta;

  return (
    <div className={`${styles.page} ${styles.rightPage}`} aria-live="polite">
      <PageHead />
      <div className={styles.entry}>
        <span
          className={`${styles.slot} ${styles.entrySlot} ${item.earned ? '' : styles.ghost}`}
          data-shape={item.sticker ? 'sticker' : 'thing'}
        >
          <span className={styles.sticker}>
            <img
              className={styles.stickerImage}
              src={stickerImageSrc(item.art)}
              alt=""
              draggable="false"
            />
          </span>
          {item.earned && (
            <span className={styles.tick} aria-hidden="true">
              ✓
            </span>
          )}
        </span>
        <div className={styles.entryBody}>
          <div className={styles.entryTop}>
            <span className={styles.tag} data-kind={kind}>
              {my.inventory.kinds[item.kind]}
            </span>
            <span
              className={styles.stamp}
              data-earned={date ? 'true' : undefined}
            >
              {date ? my.inventory.drawer.earned(date) : my.inventory.notYet}
            </span>
          </div>
          <h4 className={styles.entryTitle}>{item.name}</h4>
          {item.needsDev && (
            <p className={styles.notice}>{my.inventory.devUnlinkedNote}</p>
          )}
        </div>
      </div>
      <dl className={styles.facts}>
        <dt>{my.inventory.drawer.earnedBy}</dt>
        <dd>{item.earnedBy}</dd>
        <dt>{my.inventory.drawer.how}</dt>
        <dd>{item.getsToYou}</dd>
      </dl>
      {action && (
        <div className={styles.actions}>
          <a
            className={`hf-button hf-button--small ${styles.action}`}
            href={action.url}
            target={external(action.url) ? '_blank' : undefined}
            rel={external(action.url) ? 'noopener noreferrer' : undefined}
          >
            {action.label}
          </a>
        </div>
      )}
    </div>
  );
};

export default Drawer;
