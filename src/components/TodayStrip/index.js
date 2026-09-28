import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { todayStrip as copy } from 'data/content.mjs';
import {
  formatDay,
  getScheduleRaw,
  normalizeSchedule,
  viewerTimeZone,
} from 'lib/schedule.mjs';
import { API_BASE_URL } from 'lib/session.mjs';
import {
  OCTOBER_DAYS,
  STICKER_BOOK_ITEM,
  TODAY_STRIP_CACHE_TTL_MS,
  festSummary,
  localDate,
  nowOverride,
  octoberDay,
  readTodayCache,
  todayStripItems,
  writeTodayCache,
} from 'lib/todayStrip.mjs';

import styles from './TodayStrip.module.css';

/* How long each item stays up, and how often the items are rebuilt from
   the clock: a stream that goes on air while the page sits open should
   say so within the minute, the way /schedule/'s chips do. */
const ROTATE_MS = 6000;
const TICK_MS = 60000;

/* The fetches wait for an idle moment, because they are for a band of
   chrome and must never compete with the page someone came for. The
   timeout stops a page that is never idle from never getting its strip;
   Safari has no requestIdleCallback at all, so it gets a plain delay. */
const IDLE_TIMEOUT_MS = 4000;
const IDLE_FALLBACK_MS = 1500;

const whenIdle = (callback) => {
  if (typeof globalThis.requestIdleCallback === 'function') {
    const handle = globalThis.requestIdleCallback(callback, {
      timeout: IDLE_TIMEOUT_MS,
    });
    return () => globalThis.cancelIdleCallback(handle);
  }
  const timer = setTimeout(callback, IDLE_FALLBACK_MS);
  return () => clearTimeout(timer);
};

const prefersReducedMotion = () => {
  try {
    return (
      typeof globalThis.matchMedia === 'function' &&
      globalThis.matchMedia('(prefers-reduced-motion: reduce)').matches
    );
  } catch (_) {
    return false;
  }
};

/* Whether focus arrived the way a keyboard brings it. A mouse click
   focuses a button too, in most browsers, and pausing on that would
   leave the strip stopped long after the pointer had gone; hovering
   already covers the mouse. A browser that cannot answer is treated as
   a keyboard, which only ever errs towards holding still. */
const keyboardFocus = (element) => {
  try {
    return element.matches(':focus-visible');
  } catch (_) {
    return true;
  }
};

/* Both fetches, settled rather than raced: either can fail without
   costing the other its item, and a failure keeps whatever was there
   before. The Fests directory is imported here rather than at the top
   so its code stays out of the bundle every page loads; only the strip's
   idle moment pays for it. The shared request, so on the homepage the
   strip and the hero ask the API for the Fests once between them.

   Stamped with the time it was attempted, success or not, so a failing
   API is asked again after the TTL rather than every minute. Only a
   complete answer is cached: a half-empty one would hide the missing
   item on every page for the next quarter of an hour. */
const loadToday = async (previous) => {
  const [schedule, fests] = await Promise.allSettled([
    getScheduleRaw(),
    import('lib/festsDirectory.mjs').then((module) =>
      module.getFestsDirectoryOnce(),
    ),
  ]);

  const next = {
    at: Date.now(),
    events:
      schedule.status === 'fulfilled' && Array.isArray(schedule.value)
        ? schedule.value
        : (previous && previous.events) || [],
    festDays:
      fests.status === 'fulfilled'
        ? festSummary(fests.value)
        : (previous && previous.festDays) || {},
  };

  if (schedule.status === 'fulfilled' && fests.status === 'fulfilled') {
    writeTodayCache(next);
  }
  return next;
};

const PauseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M9 5V19M15 5V19"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const PlayIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M8 5.5L18 12L8 18.5Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    />
  </svg>
);

const NextIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M9 5L16 12L9 19"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/* The Today strip, rendered by Header under the sticky nav on every page
   while TODAY_STRIP (data/todayStrip.mjs) is on.

   A CSS Module rather than styled-components, like PageHero: most of what
   this draws exists only after the effects below have run, and this site
   ships no styled-components CSS for content rendered only on the client.

   The server renders the band itself with the sticker book in it, the
   one item true on any day, and no date: the date is the reader's, and
   only the browser knows it. Rendering the band rather than nothing is
   what keeps the page from jumping when the rest arrives. On a day
   outside October the inline script in _document hides the band before
   first paint, and the mount effect below removes it from the document,
   so the keyboard and the screen reader never reach it either. */
const TodayStrip = () => {
  const [gone, setGone] = useState(false);
  /* The QA offset and the reader's zone, settled once on mount. Null on
     the server, and until then. */
  const [clock, setClock] = useState(null);
  const [now, setNow] = useState(null);
  const [data, setData] = useState(null);

  const [currentId, setCurrentId] = useState(STICKER_BOOK_ITEM.id);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [entering, setEntering] = useState(false);

  /* True once the reader has had an item long enough to read it, or has
     touched the controls. Until then new data may move the strip to its
     first item; after it, only the rotation moves anything. */
  const settled = useRef(false);
  const loading = useRef(false);
  const alive = useRef(true);
  const pauseButton = useRef(null);

  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);

  useEffect(() => {
    /* The mocked build only: see nowOverride. Kept as an offset from the
       real clock rather than a frozen instant, so a preview ticks on from
       the pinned moment and streams go on air in it the way they will in
       October. */
    const pinned = nowOverride(globalThis.location.search, !API_BASE_URL);
    const offset = pinned === null ? 0 : pinned - Date.now();
    const at = Date.now() + offset;

    if (octoberDay(at) === null) {
      setGone(true);
      return;
    }

    setClock({ offset, timeZone: viewerTimeZone() });
    setNow(at);
    setData(readTodayCache({ at: Date.now() }));
    /* Reduced motion starts still: the reader can press play, but a band
       that changes by itself every few seconds is exactly the motion they
       asked not to have. */
    if (prefersReducedMotion()) setPaused(true);
  }, []);

  useEffect(() => {
    if (!clock) return undefined;
    const tick = setInterval(() => setNow(Date.now() + clock.offset), TICK_MS);
    return () => clearInterval(tick);
  }, [clock]);

  /* Fetch when there is nothing fresh to show: on a first visit, and
     again whenever the minute tick finds the data older than the TTL.
     Once the idle callback has started the load it is left to finish;
     a dependency change before that only reschedules it. */
  useEffect(() => {
    if (!clock || loading.current) return undefined;
    if (data && Date.now() - data.at < TODAY_STRIP_CACHE_TTL_MS) {
      return undefined;
    }

    let started = false;
    const cancel = whenIdle(() => {
      started = true;
      loading.current = true;
      loadToday(data).then((next) => {
        loading.current = false;
        if (alive.current) setData(next);
      });
    });
    return () => {
      if (!started) cancel();
    };
  }, [clock, now, data]);

  /* Normalised per zone, from the raw events, exactly as /schedule/ does
     it: which day an event falls on depends on the zone it is read in. */
  const events = useMemo(
    () => (clock && data ? normalizeSchedule(data.events, clock.timeZone) : []),
    [clock, data],
  );

  const items = useMemo(
    () =>
      clock && now !== null
        ? todayStripItems({
            events,
            festDays: data ? data.festDays : {},
            now,
            timeZone: clock.timeZone,
          })
        : [STICKER_BOOK_ITEM],
    [clock, now, events, data],
  );

  /* The shown item is held by id, not position, so a rebuild that adds
     or drops an item does not skip the reader to a different one. An id
     that has gone falls back to the first item. */
  const found = items.findIndex((entry) => entry.id === currentId);
  const index = found === -1 ? 0 : found;
  const item = items[index];

  const itemsRef = useRef(items);
  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  /* The server's sticker book is a placeholder for today's items, so the
     first real ones replace it, but only until the reader has settled in:
     after that a rebuild never moves what they are looking at. */
  useEffect(() => {
    if (settled.current || items[0].id === currentId) return;
    setEntering(true);
    setCurrentId(items[0].id);
  }, [items, currentId]);

  const advance = useCallback(() => {
    settled.current = true;
    setEntering(true);
    setCurrentId((id) => {
      const list = itemsRef.current;
      const at = list.findIndex((entry) => entry.id === id);
      return list[((at === -1 ? 0 : at) + 1) % list.length].id;
    });
  }, []);

  /* Rotation holds still while it is being looked at (a pointer over it,
     or keyboard focus inside), while the reader has paused it, and when
     there is only the one item to show. */
  const rotating =
    Boolean(clock) && !paused && !hovered && !focused && items.length > 1;

  useEffect(() => {
    if (!rotating) return undefined;
    const timer = setTimeout(advance, ROTATE_MS);
    return () => clearTimeout(timer);
  }, [rotating, item.id, advance]);

  const day = now === null ? null : octoberDay(now);
  const date = now === null ? null : formatDay(localDate(now));

  /* Gone before October, and gone the minute October ends for a page
     left open across midnight on the 31st. */
  if (gone || (now !== null && day === null)) return null;

  const togglePause = () => {
    settled.current = true;
    setPaused((value) => !value);
  };

  /* The pause button is left out of focus-pausing: a keyboard reader who
     tabs to it and presses Resume has asked for motion, and holding the
     strip still because their focus is on the very button they pressed
     would ignore them.

     Any focus inside settles the strip, too. The link is keyed by item,
     so swapping the placeholder for the first real item would unmount
     the very element that has focus and drop the reader back at the top
     of the page. */
  const onFocus = (event) => {
    settled.current = true;
    setFocused(
      event.target !== pauseButton.current && keyboardFocus(event.target),
    );
  };

  const onBlur = (event) => {
    if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false);
  };

  return (
    <section
      className={styles.root}
      aria-label={copy.label}
      data-today-strip=""
      onFocus={onFocus}
      onBlur={onBlur}
      onPointerEnter={(event) => {
        if (event.pointerType === 'mouse') setHovered(true);
      }}
      onPointerLeave={() => setHovered(false)}
    >
      <div className={styles.inner}>
        <p className={styles.today}>
          <span className={styles.dot} aria-hidden="true" />
          <span className={styles.date} data-dated={date ? 'true' : 'false'}>
            <span className={styles.lead}>
              {copy.today}
              {date ? copy.dateSeparator : ''}
            </span>
            {date}
          </span>
        </p>
        {/* Silent while it rotates by itself, since announcing a new line
            every six seconds would talk over whatever the reader is
            doing; polite once it holds still, so a press of Next is
            read out. */}
        <div className={styles.item} aria-live={rotating ? 'off' : 'polite'}>
          <a
            key={item.id}
            className={
              entering ? `${styles.link} ${styles.entering}` : styles.link
            }
            href={item.href}
            {...(item.external
              ? { target: '_blank', rel: 'noopener noreferrer' }
              : {})}
          >
            <span className={styles.kicker}>{item.kicker}</span>
            <span className={styles.text}>{item.text}</span>
            <span className={styles.cta}>{item.cta}</span>
          </a>
        </div>
        <div className={styles.status}>
          <span className={styles.day}>
            {day ? copy.dayOf(day, OCTOBER_DAYS) : ''}
          </span>
          {/* The day count drawn, for the eye only: the words beside it
              already say it. */}
          <span className={styles.progress} aria-hidden="true">
            <span
              className={styles.fill}
              style={{ width: `${((day || 0) / OCTOBER_DAYS) * 100}%` }}
            />
          </span>
          <button
            ref={pauseButton}
            type="button"
            className={styles.control}
            aria-label={paused ? copy.resume : copy.pause}
            onClick={togglePause}
            disabled={items.length < 2}
          >
            {paused ? <PlayIcon /> : <PauseIcon />}
          </button>
          <button
            type="button"
            className={styles.control}
            aria-label={copy.next}
            onClick={advance}
            disabled={items.length < 2}
          >
            <NextIcon />
          </button>
        </div>
      </div>
    </section>
  );
};

export default TodayStrip;
