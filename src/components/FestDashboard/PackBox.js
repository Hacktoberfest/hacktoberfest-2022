import { my } from 'data/content.mjs';

import styles from './FestDashboard.module.css';

/* What MLH packed in this Fest's event pack, from its shipping sheet: one
   chip per item the sheet marks TRUE, then the estimate note, because the
   sheet is MLH's plan and the box is the truth. An empty list is a Fest the
   sheet has no row for yet, which gets a line saying the list is coming and
   no note, since there is nothing to estimate.

   The icons are drawn on a 24px grid at the stroke weight of Tabler's
   outline set, in the ink the chip's frame uses. */
const ICONS = {
  arduino: (
    <>
      <rect x="5" y="5" width="14" height="14" rx="1" />
      <path d="M9 9h6v6H9z" />
      <path d="M3 10h2M3 14h2M10 3v2M14 3v2M21 10h-2M21 14h-2M14 21v-2M10 21v-2" />
    </>
  ),
  tshirts: (
    <path d="M15 4l6 2v5h-3v8a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-8H3V6l6-2a3 3 0 0 0 6 0" />
  ),
  beltBags: (
    <>
      <path d="M2 10.5h2.5M19.5 10.5H22" />
      <path d="M7.5 7.5h9a3 3 0 0 1 3 3v2.5a4.5 4.5 0 0 1-4.5 4.5H9a4.5 4.5 0 0 1-4.5-4.5v-2.5a3 3 0 0 1 3-3z" />
      <path d="M8.5 11.5h7" />
    </>
  ),
  infoCards: (
    <>
      <path d="M8 3.5h11.5a1 1 0 0 1 1 1V16" />
      <rect x="3.5" y="7.5" width="13" height="13" rx="1" />
      <path d="M10 11.5v.01M10 14v3.5" />
    </>
  ),
  stickers: (
    <>
      <path d="M20 12l-2 .5A6 6 0 0 1 11.5 6l.5-2 8 8" />
      <path d="M20 12a8 8 0 1 1-8-8" />
    </>
  ),
};

const PackBox = ({ items }) => {
  const copy = my.dashboard.pack.box;

  return (
    <div className={styles.box}>
      <p className={styles.trackingLabel} id="pack-box-label">
        {copy.label}
      </p>
      {items.length > 0 ? (
        <>
          <ul className={styles.items} aria-labelledby="pack-box-label">
            {items.map((item) => (
              <li key={item} className={styles.item}>
                <span className={styles.itemIcon} aria-hidden="true">
                  <svg viewBox="0 0 24 24" focusable="false">
                    {ICONS[item]}
                  </svg>
                </span>
                {copy.items[item]}
              </li>
            ))}
          </ul>
          <p className={styles.estimate}>
            <strong>{copy.estimateLead}</strong> {copy.estimateBody}{' '}
            <a href={`mailto:${copy.email}`}>{copy.email}</a>.
          </p>
        </>
      ) : (
        <p className={styles.packHint}>{copy.pending}</p>
      )}
    </div>
  );
};

export default PackBox;
