import dynamic from 'next/dynamic';
import { useCallback, useEffect, useRef, useState } from 'react';

import { fests as festsContent } from 'data/content.mjs';
import { partitionPast, sortByDateAsc, todayIso } from 'lib/festDate.mjs';
import { getFestsDirectory } from 'lib/festsDirectory.mjs';
import { basemapIsAvailable } from 'lib/basemapSource.mjs';
import { distanceKm, sortByDistance } from 'lib/geo.mjs';
import { filterFests } from 'lib/festsSearch.mjs';
import {
  filterByFormat,
  formatCounts,
  normalizeFormatFilter,
} from 'lib/festsFilter.mjs';
import {
  FEST_PARAM,
  festsDirectoryUrl,
  FORMAT_PARAM,
  QUERY_PARAM,
  VIEW_PARAM,
} from 'lib/festsUrl.mjs';

import FestCard from './FestCard';
import FestModal from './FestModal';
import styles from './FestsDirectory.module.css';

const FestsMap = dynamic(() => import('./FestsMap'), {
  ssr: false,
  loading: () => <div className={styles.mapSkeleton} aria-hidden="true" />,
});

/* ?view=map is honoured only when a map can actually be drawn. Without a
   Google Maps key the parameter names a view that does not exist, and an
   old link carrying it would land someone on a blank rectangle with no
   toggle to get back — the button that would have done it is gone for the
   same reason. Both readers of the parameter go through here so there is
   one answer rather than two that can drift. */
/* The map view's launch switch. False hides the List/Map toggle and makes
   ?view=map read as the list — the map code all stays, and flipping this
   back to true is the whole relaunch. Off temporarily for launch. */
const MAP_VIEW_ENABLED = false;

const viewFromParams = (params) =>
  params.get(VIEW_PARAM) === 'map' && MAP_VIEW_ENABLED && basemapIsAvailable()
    ? 'map'
    : 'list';

/* How long typing has to stop before the next keystroke earns its own
   history entry. Long enough that a word typed at speed is one entry
   rather than six, short enough that the pause between two searches is a
   place Back can return to. */
const HISTORY_COALESCE_MS = 500;

/* Every entry this component writes carries a truthy state object with no
   `__N` on it, and that is load-bearing rather than decorative. Next's own
   popstate handler (shared/lib/router/router.js) branches three ways on
   `event.state`: a falsy state makes it replace the URL with whatever the
   router currently thinks the route is, which would silently strip these
   params on the way Back; `__NA` makes it reload the page; and anything
   else without `__N` it returns from untouched. That last branch is the
   one worth being in. */
const HISTORY_STATE = { festsDirectory: true };

/* Fetches on mount, same loading/ready/error shape /my uses for its
   personalized data — this repo's static export has no server, so any
   fetch has to happen in the browser after hydration. Search and the
   near-me sort are plain client-side derivations over whatever landed. */
const FestsDirectory = () => {
  const [status, setStatus] = useState('loading');
  const [fests, setFests] = useState([]);
  const [query, setQuery] = useState('');
  const [origin, setOrigin] = useState(null);
  const [geoStatus, setGeoStatus] = useState('idle');
  const [view, setView] = useState('list');
  const [formatFilter, setFormatFilter] = useState('all');
  /* The id of the Fest whose modal is open, or null. An id rather than the
     Fest itself: the URL carries an id, so a deep link and a click have to
     arrive at the same state, and holding the object would give the two
     paths different shapes. */
  const [openFestId, setOpenFestId] = useState(null);

  const load = useCallback(() => {
    setStatus('loading');
    getFestsDirectory()
      .then((result) => {
        setFests(Array.isArray(result) ? result : []);
        setStatus('ready');
      })
      .catch(() => {
        setStatus('error');
      });
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  /* location.search rather than useRouter().query, the stance /my and
     /auth/callback both carry: an exported page's router query is empty on
     first render, and the router itself has been wedged in production by a
     stale _buildManifest.js. The address bar is the authority on what is
     in the address bar.

     Read once on mount, which lands well before the fetch above resolves,
     so the toolbar's first paint already carries the query — it is never
     part of the hydrated markup, which is the loading state alone. */
  useEffect(() => {
    const params = new URLSearchParams(globalThis.location.search);
    const initialQuery = params.get(QUERY_PARAM);
    if (initialQuery) setQuery(initialQuery);
    if (viewFromParams(params) === 'map') setView('map');
    setFormatFilter(normalizeFormatFilter(params.get(FORMAT_PARAM)));

    const initialFest = params.get(FEST_PARAM);
    if (initialFest) {
      setOpenFestId(initialFest);
      /* Landed straight on an open modal, so there is no entry of ours
         behind it. See closeFest: this is what stops the close button from
         walking the reader off the site. */
      noEntryBehind.current = true;
    }
  }, []);

  /* Written on the interaction that changes it rather than from an effect,
     so nothing writes the URL before the read above has run. What goes in
     it, and what deliberately does not, is festsUrl.mjs. */
  const urlFor = useCallback(
    (nextQuery, nextView, nextFest, nextFormat) =>
      festsDirectoryUrl({
        pathname: globalThis.location.pathname,
        search: globalThis.location.search,
        query: nextQuery,
        view: nextView,
        fest: nextFest,
        format: nextFormat,
      }),
    [],
  );

  const writeUrl = useCallback((url, mode) => {
    try {
      if (mode === 'push') globalThis.history.pushState(HISTORY_STATE, '', url);
      else globalThis.history.replaceState(HISTORY_STATE, '', url);
      return true;
    } catch (_) {
      /* Safari rate-limits both of these, and a held-down key is exactly
         the shape of input that trips it. The URL falling behind the page
         is a worse link to paste, not a broken directory, so this stays a
         cosmetic loss rather than an exception through the render.

         Not always only cosmetic, though, which is why it reports back: a
         push that did not happen leaves no entry for closeFest to return
         to. */
      return false;
    }
  }, []);

  /* Non-null while a run of keystrokes is still open. It is the whole
     mechanism for making Back undo a search rather than a letter: the
     first keystroke after a pause pushes a new entry, every keystroke that
     follows within HISTORY_COALESCE_MS replaces it. Typing "berlin" in one
     go leaves one entry behind, not six, and Back returns to whatever was
     in the box before the word started. */
  const typingBurst = useRef(null);

  /* True while there is no history entry of ours behind the open modal, so
     closing it must not go back. Two ways to get here: a reader who arrived
     straight on /fests/?fest=<id>, and a pushState the browser refused.
     Both mean the entry behind the modal belongs to wherever they came
     from. See closeFest. */
  const noEntryBehind = useRef(false);

  /* closeFest is reachable three ways (see FestModal) and history.back() is
     asynchronous, so without this a double call goes back twice and takes
     the reader off the page behind the directory. Cleared whenever a modal
     opens or the URL restores one. */
  const closing = useRef(false);

  const endBurst = useCallback(() => {
    if (typingBurst.current === null) return;
    clearTimeout(typingBurst.current);
    typingBurst.current = null;
  }, []);

  useEffect(() => endBurst, [endBurst]);

  const changeQuery = useCallback(
    (value) => {
      setQuery(value);

      const continuing = typingBurst.current !== null;
      writeUrl(
        urlFor(value, view, openFestId, formatFilter),
        continuing ? 'replace' : 'push',
      );

      if (continuing) clearTimeout(typingBurst.current);
      typingBurst.current = setTimeout(() => {
        typingBurst.current = null;
      }, HISTORY_COALESCE_MS);
    },
    [formatFilter, openFestId, urlFor, view, writeUrl],
  );

  /* Always its own entry, and it closes any open typing burst: a click is a
     separate act from the word being typed, and the entry it pushes should
     not then be overwritten by the next keystroke. */
  const selectView = useCallback(
    (next) => {
      if (next === view) return;
      setView(next);
      endBurst();
      writeUrl(urlFor(query, next, openFestId, formatFilter), 'push');
    },
    [endBurst, formatFilter, openFestId, query, urlFor, view, writeUrl],
  );

  /* Same shape as selectView: a chip click is a deliberate act, its own
     history entry, and it closes any open typing burst. */
  const selectFormat = useCallback(
    (next) => {
      if (next === formatFilter) return;
      setFormatFilter(next);
      endBurst();
      writeUrl(urlFor(query, view, openFestId, next), 'push');
    },
    [endBurst, formatFilter, openFestId, query, urlFor, view, writeUrl],
  );

  /* Back and Forward move the address bar; this is what moves the page to
     match. Sets state directly rather than going through the two callbacks
     above, which would write the history it is reading from. Geolocation is
     deliberately not restored — it is not in the URL, and Back is not a
     reason to ask for someone's position again. */
  useEffect(() => {
    const restoreFromUrl = () => {
      const params = new URLSearchParams(globalThis.location.search);
      setQuery(params.get(QUERY_PARAM) || '');
      setView(viewFromParams(params));
      /* The modal follows the address bar like everything else, so Back
         closes it and Forward reopens it. */
      setOpenFestId(params.get(FEST_PARAM) || null);
      setFormatFilter(normalizeFormatFilter(params.get(FORMAT_PARAM)));
      closing.current = false;
      /* A restored entry is not the tail of a burst: the next keystroke
         starts a new one and earns its own entry. */
      endBurst();
    };

    globalThis.addEventListener('popstate', restoreFromUrl);
    return () => globalThis.removeEventListener('popstate', restoreFromUrl);
  }, [endBurst]);

  const openFest = useCallback(
    (fest) => {
      setOpenFestId(fest.id);
      endBurst();
      closing.current = false;
      /* Opening earns a history entry, the same rule the view toggle
         follows, so Back closes the modal — which is what a phone's back
         gesture is for — and the URL is a link to one Fest. */
      noEntryBehind.current = !writeUrl(
        urlFor(query, view, fest.id, formatFilter),
        'push',
      );
    },
    [endBurst, formatFilter, query, urlFor, view, writeUrl],
  );

  /* Every way out lands here: the close button and Escape both go through
     the dialog's close event, and Back arrives through popstate instead.

     Going back is the right close when we pushed the entry, because it
     leaves no dead forward entry and keeps one history path. It is the
     wrong close whenever there is no entry of ours behind the modal — a
     deep link, or a push the browser refused — because the entry behind it
     then belongs to wherever the reader came from. Those cases strip the
     param in place instead.

     Getting this wrong is not subtle from the reader's side: they press
     Close and land on their new tab page. */
  const closeFest = useCallback(() => {
    if (closing.current) return;
    closing.current = true;

    if (noEntryBehind.current) {
      noEntryBehind.current = false;
      setOpenFestId(null);
      writeUrl(urlFor(query, view, null, formatFilter), 'replace');
      return;
    }

    globalThis.history.back();
  }, [formatFilter, query, urlFor, view, writeUrl]);

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setGeoStatus('unavailable');
      return;
    }
    setGeoStatus('pending');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setOrigin({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setGeoStatus('granted');
      },
      () => setGeoStatus('unavailable'),
    );
  }, []);

  /* Granting location is otherwise a one-way door: it swaps the sort to
     distance and puts a "km away" on every card with nothing that undoes
     either. Clearing drops back to date order and takes the distances and
     the map's origin pin with it. */
  const clearLocation = useCallback(() => {
    setOrigin(null);
    setGeoStatus('idle');
  }, []);

  if (status === 'loading') {
    /* role="status" so a retry out of the error surface below is announced.
       Silent on first paint, which is correct — a live region does not
       announce the content it mounts with, and this state is what the page
       exports. */
    return (
      <div className={styles.page}>
        <div className={styles.loading} role="status">
          <p className={styles.emptyTitle}>{festsContent.loading}</p>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    /* role="status" on the surface rather than aria-live on one paragraph,
       matching MyError: the heading and body only make sense read
       together. */
    return (
      <div className={styles.page}>
        <div className={styles.error} role="status">
          <h2 className={styles.errorTitle}>{festsContent.error.title}</h2>
          <p className={styles.errorBody}>{festsContent.error.body}</p>
          <button type="button" className={styles.retryButton} onClick={load}>
            {festsContent.error.retryCta}
          </button>
        </div>
      </div>
    );
  }

  const today = todayIso();
  /* Search first, then the chips count what the search found, then the
     format filter narrows what is shown. Counting before the format
     filter is what keeps a chip's number meaningful while another chip is
     active — it says what you would get, not what you are looking at. */
  const searched = filterFests(fests, query);
  const counts = formatCounts(searched);
  const { upcoming, past } = partitionPast(
    filterByFormat(searched, formatFilter),
    today,
  );

  const arrange = (list) =>
    origin ? sortByDistance(list, origin) : sortByDateAsc(list);

  /* Upcoming in the active order, then everything that has already
     happened. Under the date sort the past half runs backwards, so both
     halves lead with whatever is nearest to now — the Fest that ran last
     week is worth more than the one that ran a month ago, and ascending
     order would bury it. Under the distance sort both halves are simply
     nearest-first, where reversing would mean "the furthest past Fest
     first" and that answers no question anyone has.

     Dateless Fests are not past (see festDate.mjs) so they ride along at
     the tail of the upcoming half, which is where sortByDateAsc already
     put them. */
  const sorted = [
    ...arrange(upcoming),
    ...(origin ? arrange(past) : sortByDateAsc(past).reverse()),
  ];
  const count = sorted.length;
  const locating = geoStatus === 'pending';

  /* Resolved against everything loaded, not the filtered list: a link to
     one Fest has to open it whatever the reader's own search happens to
     be, and a modal that vanished because the query behind it did not
     match would be the link silently failing.

     An id matching nothing — a stale link, a Fest since delisted — leaves
     this null and simply renders no modal. No error surface: a link that
     has aged out should land on a working directory, not an apology. */
  const festInModal = openFestId
    ? fests.find((fest) => fest.id === openFestId) || null
    : null;

  return (
    <div className={styles.page}>
      <div className={styles.toolbar}>
        {/* One instrument rather than a field and a button floating apart:
            glyph chip, the field itself, and the location segment share a
            border and a shadow, the same bar/body/chip grammar as the map
            strip. The glyph is decoration; the input keeps the whole
            middle as its hit area and carries the accessible name. */}
        <div className={styles.searchBar}>
          <span className={styles.searchGlyph} aria-hidden="true">
            {'\u2315'}
          </span>
          <input
            type="search"
            className={styles.searchInput}
            placeholder={festsContent.searchPlaceholder}
            aria-label={festsContent.searchLabel}
            value={query}
            onChange={(event) => changeQuery(event.target.value)}
          />
          {/* One button, three labels, and no aria-pressed: the accessible
              name says which of the two things it will do, and a name that
              changes is already announced. Keyed on `origin` rather than
              geoStatus because origin is what actually drives the sort.
              The dot is the map's own "you are here" marker, restated. */}
          <button
            type="button"
            className={styles.locationButton}
            onClick={origin ? clearLocation : requestLocation}
            disabled={locating}
          >
            {locating
              ? festsContent.locationPending
              : origin
                ? festsContent.locationClearCta
                : festsContent.locationCta}
          </button>
        </div>
        {geoStatus === 'unavailable' && (
          <p className={styles.locationHint} role="status">
            {festsContent.locationUnavailable}
          </p>
        )}
      </div>
      <div className={styles.resultsRow}>
        {/* The chips say what the search found, per format, and narrow to
            one kind. Counted before the format filter, so an inactive
            chip's number says what it would show. The visually hidden
            line keeps the announcement the old count made: without a live
            region, typing silently rewrites the list below and a screen
            reader hears nothing at all. */}
        <p className={styles.visuallyHidden} aria-live="polite">
          {count}{' '}
          {count === 1
            ? festsContent.resultsCountSingular
            : festsContent.resultsCountPlural}
        </p>
        <div
          className={styles.filterChips}
          role="group"
          aria-label={festsContent.formatFilter.label}
        >
          {['all', 'hackDay', 'meetUp'].map((filter) => (
            <button
              key={filter}
              type="button"
              className={
                formatFilter === filter
                  ? `${styles.filterChip} ${styles.filterChipActive}`
                  : styles.filterChip
              }
              data-filter={filter}
              aria-pressed={formatFilter === filter}
              onClick={() => selectFormat(filter)}
            >
              {filter !== 'all' && (
                <span className={styles.filterSwatch} aria-hidden="true" />
              )}
              {festsContent.formatFilter[filter]}
              <span className={styles.filterCount}>{counts[filter]}</span>
            </button>
          ))}
        </div>
        {MAP_VIEW_ENABLED && (
          <div
            className={styles.viewToggle}
            role="group"
            aria-label={festsContent.viewToggle.label}
          >
            <button
              type="button"
              className={
                view === 'list'
                  ? `${styles.viewButton} ${styles.viewButtonActive}`
                  : styles.viewButton
              }
              aria-pressed={view === 'list'}
              onClick={() => selectView('list')}
            >
              {festsContent.viewToggle.list}
            </button>
            {/* Only offered when a map can actually be drawn. Without a
              Google Maps key this button leads to a blank rectangle, and a
              control that goes nowhere is worse than one absent — the
              reader cannot tell a broken map from an empty one. */}
            {basemapIsAvailable() && (
              <button
                type="button"
                className={
                  view === 'map'
                    ? `${styles.viewButton} ${styles.viewButtonActive}`
                    : styles.viewButton
                }
                aria-pressed={view === 'map'}
                onClick={() => selectView('map')}
              >
                {festsContent.viewToggle.map}
              </button>
            )}
          </div>
        )}
      </div>

      {count === 0 ? (
        /* No role="status" here deliberately: the count above already
           announces "0 Fests found" on the same keystroke, and a second
           live region would read the empty state out on top of it. */
        <div className={styles.empty}>
          <h2 className={styles.emptyTitle}>{festsContent.emptyTitle}</h2>
          <p className={styles.emptyBody}>{festsContent.emptyBody}</p>
        </div>
      ) : view === 'list' ? (
        <div className={styles.list}>
          {sorted.map((fest) => (
            <FestCard
              key={fest.id}
              fest={fest}
              distanceKm={origin ? distanceKm(origin, fest) : null}
              today={today}
              onOpen={openFest}
            />
          ))}
        </div>
      ) : (
        <div className={styles.mapWrapper}>
          <FestsMap
            fests={sorted}
            origin={origin}
            today={today}
            onOpen={openFest}
          />
        </div>
      )}

      {/* Always mounted, never keyed. Unmounting it on close would take
          the dialog out of the DOM before a frame of its exit animation
          could run, and a key would remount it every time a different Fest
          opened. It holds its own last-shown Fest for exactly that reason
          — see FestModal. */}
      <FestModal
        fest={festInModal}
        distanceKm={
          origin && festInModal ? distanceKm(origin, festInModal) : null
        }
        today={today}
        onClose={closeFest}
      />
    </div>
  );
};

export default FestsDirectory;
