import { useEffect, useState } from 'react';

import { my } from 'data/content.mjs';
import { apiFetchBlob } from 'lib/apiClient.mjs';
import { formatEarnedDate } from 'lib/earnedDate.mjs';
import { certificatePath } from 'lib/inventory.mjs';
import { API_BASE_URL } from 'lib/session.mjs';
import { downloadBlob } from 'lib/shareImage.mjs';
import { stickerImageSrc } from 'lib/stickerImage.mjs';

import styles from './Inventory.module.css';

/* The right page of the locker: the thing picked, set the way the
   sticker book sets a page. A head and a note, then the thing as one
   entry, its picture beside the kind, the date and the name, the variant
   under it for a thing earned more than once (the Fest a certificate is
   for, and its day), then the two facts every thing has (earned by, gets
   to you), its one call to action, all as the API serves them; a
   certificate offers its two downloads instead, rendered by the API on
   the click. A thing on DEV with no DEV account linked
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

/* A certificate's two downloads. The API renders the file on the click
   and hands it straight back, nothing stored, so the button says it is
   making it while it waits and the line under says if it could not. The
   mocked build has no API to ask, so it shows nothing here. */
const CertificateDownloads = ({ item }) => {
  const [busy, setBusy] = useState(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    setBusy(null);
    setFailed(false);
  }, [item.slot]);
  if (!API_BASE_URL) return null;

  const fetchFile = async (format) => {
    setBusy(format);
    setFailed(false);
    try {
      const blob = await apiFetchBlob(certificatePath(item, format));
      downloadBlob(blob, `hacktoberfest-2026-${item.id}-${item.key}.${format}`);
    } catch (_) {
      setFailed(true);
    } finally {
      setBusy(null);
    }
  };

  const label = (format, text) =>
    busy === format ? my.inventory.downloads.working : text;

  return (
    <>
      <div className={styles.actions}>
        <button
          type="button"
          className={`hf-button hf-button--small ${styles.action}`}
          disabled={busy !== null}
          onClick={() => fetchFile('pdf')}
        >
          {label('pdf', my.inventory.downloads.pdf)}
        </button>
        <button
          type="button"
          className={`hf-button hf-button--small ${styles.actionQuiet}`}
          disabled={busy !== null}
          onClick={() => fetchFile('png')}
        >
          {label('png', my.inventory.downloads.png)}
        </button>
      </div>
      {failed && (
        <p className={styles.fine} role="alert">
          {my.inventory.downloads.failed}
        </p>
      )}
    </>
  );
};

const PageHead = () => (
  <div className={styles.pageHead}>
    <h3 className={styles.pageTitle}>{my.inventory.pages.picked.title}</h3>
  </div>
);

/* Nothing earned: the ghost the cells show, as an entry. Its picture
   greyed, "Up next" where the kind would be, its two facts, and no
   button: nothing to do about it yet but earn a sticker. */
const GhostEntry = ({ ghost }) => (
  <div className={`${styles.page} ${styles.rightPage}`}>
    <PageHead />
    <div className={`${styles.entry} ${styles.ghost}`}>
      <span
        className={`${styles.slot} ${styles.entrySlot}`}
        data-shape={ghost.sticker ? 'sticker' : 'thing'}
      >
        <span className={styles.sticker}>
          <img
            className={styles.stickerImage}
            src={stickerImageSrc(ghost.art)}
            alt=""
            draggable="false"
          />
        </span>
      </span>
      <div className={styles.entryBody}>
        <div className={styles.entryTop}>
          <span className={styles.tag}>{my.inventory.upNext}</span>
        </div>
        <h4 className={styles.entryTitle}>{ghost.name}</h4>
      </div>
    </div>
    <dl className={styles.facts}>
      <dt>{my.inventory.drawer.earnedBy}</dt>
      <dd>{ghost.earnedBy}</dd>
      <dt>{my.inventory.drawer.how}</dt>
      <dd>{ghost.getsToYou}</dd>
    </dl>
  </div>
);

const Drawer = ({ item, ghost }) => {
  if (!item && ghost) return <GhostEntry ghost={ghost} />;
  if (!item) {
    return (
      <div className={`${styles.page} ${styles.rightPage}`}>
        <PageHead />
        <p className={styles.entryLine}>{my.inventory.intro}</p>
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
      {item.certificate && !item.needsDev && (
        <CertificateDownloads item={item} />
      )}
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
