import { useEffect, useRef, useState } from 'react';

import { my } from 'data/content.mjs';
import { PAGE_ROWS, rowsBelow } from 'lib/stickerBook.mjs';

import styles from './Album.module.css';

/* One page's sheet of cells. A page with more rows than PAGE_ROWS shows
   that many and scrolls the rest inside the book, so a page that grows
   (a secret or two on top of its catalogue) never makes the whole book
   grow with it; under the cap, a fade over the foot of the sheet and a
   cue naming the rows still below, both gone once the reader reaches the
   end.

   The cap is measured, not set: cells grow with their titles, so the
   sheet stops where the first cell of the next row starts, read off the
   laid-out grid at the width it is drawn. A ResizeObserver reads it
   again whenever the sheet changes size. The column count is the grid's
   own, so the same page caps at two rows of two on a phone and two rows
   of three from tablet. A page at or under the cap is left exactly as
   it was: no height, no overflow, no cue.

   A sticker earned just now (lib/justEarned.mjs) that sits below the cap
   is scrolled into the sheet, once per set, so its slap-on is seen. */
const PageSheet = ({ justEarned, children }) => {
  const listRef = useRef(null);
  const [sheet, setSheet] = useState({ cap: null, below: 0 });
  const [atEnd, setAtEnd] = useState(false);
  const [revealedFor, setRevealedFor] = useState(null);

  useEffect(() => {
    const list = listRef.current;
    if (!list || typeof ResizeObserver === 'undefined') return undefined;
    const measure = () => {
      const columns = getComputedStyle(list)
        .gridTemplateColumns.split(' ')
        .filter(Boolean).length;
      const below = rowsBelow(list.children.length, columns);
      const next = below > 0 ? list.children[columns * PAGE_ROWS] : null;
      /* The top of the next row's first cell, from the top of the
         sheet's own content: the rows above it and their rules. */
      const cap = next
        ? next.getBoundingClientRect().top -
          list.getBoundingClientRect().top -
          parseFloat(getComputedStyle(list).borderTopWidth) +
          list.scrollTop
        : null;
      setSheet((current) =>
        current.cap === cap && current.below === below
          ? current
          : { cap, below },
      );
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(list);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const list = listRef.current;
    if (!list || !sheet.cap || !justEarned || justEarned.size === 0) return;
    if (revealedFor === justEarned) return;
    setRevealedFor(justEarned);
    const cell = list.querySelector('[data-just-earned="true"]');
    if (!cell) return;
    const bottom = cell.offsetTop + cell.offsetHeight;
    if (bottom > list.scrollTop + sheet.cap)
      list.scrollTop = bottom - sheet.cap;
  }, [justEarned, sheet.cap]);

  const onScroll = (event) => {
    const list = event.currentTarget;
    setAtEnd(list.scrollTop + list.clientHeight >= list.scrollHeight - 2);
  };

  const capped = sheet.cap !== null;
  const more = capped && !atEnd;

  return (
    <div className={styles.sheet} data-more={more ? 'true' : undefined}>
      <ul
        ref={listRef}
        className={styles.cells}
        style={capped ? { maxHeight: `${sheet.cap}px` } : undefined}
        data-capped={capped ? 'true' : undefined}
        onScroll={capped ? onScroll : undefined}
      >
        {children}
      </ul>
      {more && (
        <span className={styles.more} aria-hidden="true">
          {my.album.moreRows(sheet.below)}
          <svg viewBox="0 0 24 24" focusable="false">
            <path d="M12 5v14" />
            <path d="M6 13l6 6l6 -6" />
          </svg>
        </span>
      )}
    </div>
  );
};

export default PageSheet;
