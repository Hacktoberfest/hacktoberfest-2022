import { my } from 'data/content.mjs';
import { formatEarnedDate } from 'lib/earnedDate.mjs';
import { stickerImageSrc } from 'lib/stickerImage.mjs';

import styles from './Inventory.module.css';

/* The right page of the locker: the thing picked, set the way the
   sticker book sets a page. A head and a note, then the thing as one
   entry, its picture beside the kind, the date and the name, the variant
   under it for a thing earned more than once (the Fest a certificate is
   for, and its day), then the two facts every thing has (earned by, gets
   to you), its one call to action, all as the API serves them. A thing on DEV with no DEV account linked
   carries the welcome band's Connect DEV account button instead of its
   own. With nothing in the catalogue at all, the page says so. */
const external = (url) => /^https?:\/\//.test(url);

const formatFestDate = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
};

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
  const date = item.earnedAt ? formatEarnedDate(item.earnedAt) : null;
  /* The Fest's own day, not floored to October 1 as an earned date is: a
     certificate for a September Fest says September. */
  const variantDate =
    item.variant && item.variant.date
      ? formatFestDate(item.variant.date)
      : null;

  const action = item.needsDev
    ? { label: my.identity.devConnectCta, url: my.identity.devConnectHref }
    : item.cta;

  return (
    <div className={`${styles.page} ${styles.rightPage}`} aria-live="polite">
      <PageHead />
      <div className={styles.entry}>
        <span
          className={`${styles.slot} ${styles.entrySlot}`}
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
          <span className={styles.tick} aria-hidden="true">
            ✓
          </span>
        </span>
        <div className={styles.entryBody}>
          <div className={styles.entryTop}>
            <span className={styles.tag} data-kind={item.kind}>
              {my.inventory.kinds[item.kind]}
            </span>
            <span className={styles.stamp} data-earned="true">
              {date ? my.inventory.drawer.earned(date) : ''}
            </span>
          </div>
          <h4 className={styles.entryTitle}>{item.name}</h4>
          {item.variant && (
            <p className={styles.entryVariant}>
              {item.variant.title}
              {variantDate ? ` · ${variantDate}` : ''}
            </p>
          )}
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
