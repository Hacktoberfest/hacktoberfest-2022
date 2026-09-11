import { useEffect, useState } from 'react';

import DevLogo from 'components/icons/DevLogo';
import { activitiesPage, my } from 'data/content.mjs';
import { MLH_ADDRESS_URL } from 'data/links';
import {
  bookCounts,
  bookStickers,
  bookTabs,
  filterBook,
  milestoneState,
  openingTab,
} from 'lib/stickerBook.mjs';

import styles from './Album.module.css';
import StickerCell from './StickerCell';

/* The sticker book: every sticker there is to earn this October, on a
   page per type, with the two required ones first. Tabs down the side
   (two-up across the top on a phone), the open page's cells, and along
   the bottom the spine: the book's count and the way to the public
   catalogue. What the stickers add up to is the rewards band above this
   one (components/RewardsBand).

   The pure half is lib/stickerBook.mjs: which stickers, which tabs, which
   page the book opens on. The cells are this feature's own (StickerCell):
   the page is the type, so they say less than the activity card
   /activities/ draws, and give the sticker the room.

   The open tab is client state and nothing more. It is seeded once at
   mount from progress (the page holding the next sticker) and the reader
   moves it from there; a fresh fetch remounts. Arrow keys move between
   tabs, the usual tablist behaviour, so the row is one tab stop rather
   than six. */
const ACCENTS = {
  required: 'accent_required',
  dev: 'accent_dev',
  livestreams: 'accent_livestreams',
  ghw: 'accent_ghw',
  tools: 'accent_tools',
  inperson: 'accent_inperson',
};

/* Global Hack Week's lockup, drawn for a light ground: the wordmark in
   ink, beside the one the schedule draws on its type's colour
   (/schedule/global-hack-week.png, white). It sets the event's name, so
   it stands where the label would and carries the label as its alt. */
const GHW_LOCKUP = '/schedule/global-hack-week-ink.svg';

const label = (key) => activitiesPage.list.types[key] || key;

/* A page's name at its head. Two pages wear a mark there rather than
   their name in type: DEV's logo ahead of "Challenges" (my.album.devMark),
   and Global Hack Week's lockup. The tabs down the side stay words, all
   six alike, and the words stay in the tree here too, so the page is
   named the same for assistive tech whichever way it is drawn. */
const PageTitle = ({ type }) => {
  const text = label(type);
  if (type === 'ghw') {
    return (
      <span className={styles.lockupLine}>
        <img className={styles.lockup} src={GHW_LOCKUP} alt={text} />
      </span>
    );
  }
  if (type === 'dev') {
    return (
      <>
        <DevLogo className={styles.mark} />
        <span className={styles.srOnly}>{my.album.devMark.name} </span>
        {my.album.devMark.rest}
      </>
    );
  }
  return text;
};

const Album = ({ experience, justEarned }) => {
  const stickers = bookStickers(experience, { addressHref: MLH_ADDRESS_URL });
  const tabs = bookTabs(stickers);
  const [tab, setTab] = useState(() => openingTab(stickers, justEarned));
  /* A sticker earned just now (lib/justEarned.mjs) turns the book to its
     page, once, so its moment is seen; `justEarned` arrives after mount,
     from the effect that reads the record, so the seed above only covers
     a set already known. The reader's own turns win from then on. */
  const [turnedFor, setTurnedFor] = useState(null);
  useEffect(() => {
    if (!justEarned || justEarned.size === 0 || turnedFor === justEarned)
      return;
    setTurnedFor(justEarned);
    setTab(openingTab(stickers, justEarned));
  }, [justEarned]);
  /* A tab that no longer exists (a type the catalogue dropped) falls back
     to the first page rather than an empty one. */
  const current = tabs.some((entry) => entry.key === tab) ? tab : tabs[0].key;
  const { earned, total } = bookCounts(stickers);

  const { complete } = milestoneState(experience);
  const intro = my.album.intro(total, complete);

  const onKeyDown = (event) => {
    const index = tabs.findIndex((entry) => entry.key === current);
    let next = null;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      next = tabs[(index + 1) % tabs.length];
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      next = tabs[(index - 1 + tabs.length) % tabs.length];
    } else if (event.key === 'Home') {
      next = tabs[0];
    } else if (event.key === 'End') {
      next = tabs[tabs.length - 1];
    }
    if (!next) return;
    event.preventDefault();
    setTab(next.key);
    const button = event.currentTarget.querySelector(
      `[data-tab="${next.key}"]`,
    );
    if (button) button.focus();
  };

  return (
    <section className={styles.band} aria-labelledby="album-heading">
      <h2 id="album-heading" className={styles.heading}>
        {my.album.heading.lead} <em>{my.album.heading.accent}</em>
      </h2>
      <p className={styles.intro}>{intro}</p>
      <div className={styles.album}>
        <div
          className={styles.tabs}
          role="tablist"
          aria-label={my.album.tabsLabel}
          onKeyDown={onKeyDown}
        >
          {tabs.map((entry) => (
            <button
              key={entry.key}
              type="button"
              role="tab"
              id={`album-tab-${entry.key}`}
              data-tab={entry.key}
              aria-selected={entry.key === current}
              aria-controls={`album-page-${entry.key}`}
              tabIndex={entry.key === current ? 0 : -1}
              className={`${styles.tab} ${styles[ACCENTS[entry.key]] || ''}`}
              onClick={() => setTab(entry.key)}
            >
              <span className={styles.tabLabel}>{label(entry.key)}</span>
              <span className={styles.tabCount}>
                {my.album.tabCount(entry.earned, entry.count)}
              </span>
            </button>
          ))}
        </div>
        {/* Every page renders, stacked in one grid cell with only the open
            one visible, so the book is always as tall as its tallest page
            and never jumps as the reader turns it. A closed page is
            visibility: hidden, which also takes it out of the tab order
            and the accessibility tree. */}
        <div className={styles.pages}>
          {tabs.map((entry) => (
            <div
              key={entry.key}
              className={styles.page}
              role="tabpanel"
              id={`album-page-${entry.key}`}
              aria-labelledby={`album-tab-${entry.key}`}
              data-open={entry.key === current ? 'true' : undefined}
            >
              <div className={styles.pageHead}>
                <h3 className={styles.pageTitle}>
                  <PageTitle type={entry.key} />
                </h3>
                {my.album.pages[entry.key] && (
                  <p className={styles.pageNote}>{my.album.pages[entry.key]}</p>
                )}
              </div>
              <ul className={styles.cells}>
                {filterBook(stickers, entry.key).map((sticker) => (
                  <StickerCell
                    key={sticker.id}
                    sticker={sticker}
                    justEarned={Boolean(
                      justEarned && justEarned.has(sticker.id),
                    )}
                  />
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className={styles.spine}>
          <span className={styles.spineCount}>
            {my.album.spine.count(earned, total)}
          </span>
          <a className={styles.spineLink} href="/activities/">
            {my.album.spine.detailCta}
          </a>
        </div>
      </div>
    </section>
  );
};

export default Album;
