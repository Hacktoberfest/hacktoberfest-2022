import {
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { fests as festsCopy, mapHero } from 'data/content.mjs';
import { festDateParts, todayIso } from 'lib/festDate.mjs';
import {
  countrySuggestions,
  festTitle,
  foldText,
  matchRange,
  nearestFests,
  searchFests,
} from 'lib/festSearch.mjs';

import styles from './FestSearch.module.css';

/* The homepage search: one field whose list answers as you type.

   Built to the WAI-ARIA combobox pattern for list autocomplete with
   manual selection (the research round of 2026-09-28): focus stays in the
   field, the arrow keys move a highlight through the options by
   aria-activedescendant, nothing is chosen until Enter or a click, and
   the result count is announced politely a beat after typing stops (the
   GOV.UK accessible-autocomplete finding). It is a real GET form to
   /fests/ with the query as `q`, the same address the directory reads
   (lib/festsUrl), so Enter with nothing highlighted, or with JavaScript
   off, lands on the directory already filtered.

   What the list shows is lib/festSearch: before typing, location on
   request, the countries with the most Fests (the visitor's own, by time
   zone, first) and the ways onward; while typing, places first, then
   Fests, then "See all" when there are more; with no match, the other
   ways in rather than an empty box. Every row is plain text on two lines
   at most, with the typed characters in bold.

   On phones the form opens as a full-screen sheet while it has focus, so
   the keyboard, the field and the results have the whole screen.

   CSS Modules, since the list only ever renders on the client. */

const DESKTOP_ROWS = 6;
const PHONE_ROWS = 5;
const ANNOUNCE_DELAY = 1000;
const SHEET_QUERY = '(max-width: 599px)';
const NARROW_QUERY = '(max-width: 479px)';

const Bold = ({ text, range }) =>
  range ? (
    <>
      {text.slice(0, range[0])}
      <strong>{text.slice(range[0], range[1])}</strong>
      {text.slice(range[1])}
    </>
  ) : (
    text
  );

const Icon = ({ kind }) => {
  const paths = {
    place: (
      <>
        <path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z" />
        <circle cx="12" cy="9.5" r="2.5" />
      </>
    ),
    locate: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
      </>
    ),
    online: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
      </>
    ),
    link: <path d="M5 12h14M13 6l6 6-6 6" />,
    host: <path d="M5 21V4h11l-2 4 2 4H5" />,
  };
  const d = paths[kind];
  return d ? (
    <svg
      className={styles.optionIcon}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      {d}
    </svg>
  ) : (
    <span className={styles.optionIcon} aria-hidden="true" />
  );
};

const festLine = (fest, km) => {
  const parts = festDateParts(fest.date);
  return [
    [fest.city && fest.city.trim(), fest.country].filter(Boolean).join(', '),
    parts && `${parts.weekday} ${parts.day} ${parts.month}`,
    fest.format && festsCopy.formatBadges[fest.format],
    typeof km === 'number' && mapHero.search.distance(km),
  ]
    .filter(Boolean)
    .join(' · ');
};

const directoryFor = (query) => `/fests/?q=${encodeURIComponent(query)}`;

/* The option list for the current state, as groups of options. Each
   option carries what it shows and what choosing it does. */
const buildGroups = ({
  fests,
  query,
  origin,
  today,
  locating,
  locationFailed,
  canLocate,
  rows,
}) => {
  const copy = mapHero.search;
  const total = Array.isArray(fests) ? fests.length : null;
  const browse = {
    kind: 'link',
    id: 'all',
    main: copy.browseAll(total),
    href: '/fests/',
  };
  const online = {
    kind: 'online',
    id: 'online',
    main: copy.online.title,
    sub: copy.online.hint,
    href: mapHero.online.href,
  };
  const locate =
    canLocate && !origin
      ? {
          kind: 'locate',
          id: 'locate',
          main: locating ? copy.locate.finding : copy.locate.title,
          sub: locationFailed ? copy.locate.denied : copy.locate.hint,
          action: 'locate',
        }
      : null;
  const festOption = ({ fest, km }) => {
    const title = festTitle(fest);
    const sub = festLine(fest, km);
    const titleRange = query ? matchRange(title, query) : null;
    return {
      kind: 'fest',
      id: `fest-${fest.id}`,
      main: title,
      mainRange: titleRange,
      sub,
      subRange: query && !titleRange ? matchRange(sub, query) : null,
      href: `/fests/?fest=${encodeURIComponent(fest.id)}`,
      fest,
    };
  };

  if (!query) {
    if (origin && Array.isArray(fests)) {
      return {
        mode: 'suggestions',
        groups: [
          {
            id: 'nearest',
            label: copy.groups.nearest,
            options: nearestFests(fests, origin, {
              count: rows - 1,
              today,
            }).map(festOption),
          },
          { id: 'onward', options: [browse, online] },
        ],
      };
    }
    const countries = Array.isArray(fests)
      ? countrySuggestions(fests, { count: 3 }).map((country) => ({
          kind: 'place',
          id: `country-${country.name}`,
          main: country.name,
          right: copy.count(country.count),
          href: directoryFor(country.name),
          place: country,
        }))
      : [];
    return {
      mode: 'suggestions',
      groups: [
        locate && { id: 'locate', options: [locate] },
        countries.length && {
          id: 'countries',
          label: copy.groups.countries,
          options: countries,
        },
        { id: 'onward', options: [browse, online] },
      ].filter(Boolean),
    };
  }

  const result = Array.isArray(fests)
    ? searchFests(fests, query, { origin, today })
    : null;
  if (!result || (result.total === 0 && result.places.length === 0)) {
    return {
      mode: 'none',
      groups: [
        {
          id: 'none',
          label: copy.noMatch(query.trim()),
          options: [
            locate,
            browse,
            online,
            {
              kind: 'host',
              id: 'host',
              main: copy.host.title,
              sub: copy.host.hint,
              href: '/host/',
            },
          ].filter(Boolean),
        },
      ],
      result,
    };
  }

  const places = result.places.map((place) => {
    const main =
      place.kind === 'city'
        ? [place.name, place.region, place.country].filter(Boolean).join(', ')
        : place.name;
    return {
      kind: 'place',
      id: `${place.kind}-${place.name}-${place.country || ''}`,
      main,
      mainRange: matchRange(main, query),
      right: copy.count(place.count),
      href: directoryFor(place.name),
      place,
    };
  });
  const room = Math.max(1, rows - places.length);
  const shown = result.fests.slice(0, room).map(festOption);
  const more =
    result.total > shown.length
      ? [
          {
            kind: 'link',
            id: 'see-all',
            main: copy.seeAll(result.total, query.trim()),
            href: directoryFor(query.trim()),
          },
        ]
      : [];
  return {
    mode: 'results',
    groups: [
      { id: 'results', options: [...places, ...shown, ...more] },
      { id: 'onward', options: [online] },
    ],
    result,
  };
};

const FestSearch = ({ fests, onHighlight }) => {
  const copy = mapHero.search;
  const uid = useId().replace(/:/g, '');
  const inputId = `${uid}-q`;
  const listId = `${uid}-list`;
  const rootRef = useRef(null);
  const inputRef = useRef(null);

  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const [origin, setOrigin] = useState(null);
  const [locating, setLocating] = useState(false);
  const [locationFailed, setLocationFailed] = useState(false);
  const [sheet, setSheet] = useState(false);
  const [announcement, setAnnouncement] = useState('');
  const [canLocate, setCanLocate] = useState(false);
  const [narrow, setNarrow] = useState(false);

  /* Location is offered only where the browser can give one, and the
     shorter placeholder only where the long one would be cut off. */
  useEffect(() => {
    setCanLocate('geolocation' in navigator);
    const media = window.matchMedia(NARROW_QUERY);
    const sync = () => setNarrow(media.matches);
    sync();
    media.addEventListener('change', sync);
    return () => media.removeEventListener('change', sync);
  }, []);

  const today = todayIso();
  const rows = sheet ? PHONE_ROWS : DESKTOP_ROWS;
  const state = useMemo(
    () =>
      buildGroups({
        fests,
        query: query.trim() ? query : '',
        origin,
        today,
        locating,
        locationFailed,
        canLocate,
        rows,
      }),
    [fests, query, origin, today, locating, locationFailed, canLocate, rows],
  );
  const options = useMemo(
    () => state.groups.flatMap((group) => group.options),
    [state],
  );
  const optionId = (index) => `${listId}-${index}`;

  /* The full-screen sheet is a phone thing: decided when the list opens,
     before it paints so the dropdown never flashes first, and again if
     the window is resized while it is open. */
  useLayoutEffect(() => {
    if (!open) {
      setSheet(false);
      return undefined;
    }
    const media = window.matchMedia(SHEET_QUERY);
    const sync = () => setSheet(media.matches);
    sync();
    media.addEventListener('change', sync);
    return () => media.removeEventListener('change', sync);
  }, [open]);

  /* The page behind the sheet should not scroll under it. */
  useEffect(() => {
    if (!sheet) return undefined;
    const previous = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.documentElement.style.overflow = previous;
    };
  }, [sheet]);

  /* Polite, and a beat after the last keystroke, so a screen reader is
     not talked over by its own typing echo or handed a stale count. */
  useEffect(() => {
    if (!open) {
      setAnnouncement('');
      return undefined;
    }
    const timer = setTimeout(() => {
      if (state.mode === 'none') setAnnouncement(copy.status.none);
      else if (state.mode === 'results')
        setAnnouncement(copy.status.results(state.result.total));
      else setAnnouncement(copy.status.suggestions(options.length));
    }, ANNOUNCE_DELAY);
    return () => clearTimeout(timer);
  }, [open, state, options.length, copy.status]);

  /* The map follows the list: which Fests match, and which one (or which
     place) the highlight is on. */
  useEffect(() => {
    if (!onHighlight) return;
    const focus = (() => {
      const option =
        options[active] || (state.mode === 'results' ? options[0] : null);
      if (!option) return null;
      if (option.kind === 'fest') {
        return {
          kind: 'fest',
          name: option.main,
          count: null,
          lat: option.fest.lat,
          lng: option.fest.lng,
        };
      }
      if (option.kind === 'place' && option.place) {
        const place = option.place;
        if (place.kind === 'country')
          return { kind: 'country', name: place.name, count: place.count };
        const match = (fests || []).find(
          (fest) =>
            fest.city &&
            foldText(fest.city.trim()) === foldText(place.name) &&
            fest.country === place.country,
        );
        return match
          ? {
              kind: 'city',
              name: place.name,
              count: place.count,
              lat: match.lat,
              lng: match.lng,
            }
          : null;
      }
      return null;
    })();
    onHighlight({
      open,
      ids:
        open && state.result
          ? new Set(state.result.fests.map(({ fest }) => fest.id))
          : null,
      focus: open ? focus : null,
    });
  }, [open, state, active, options, fests, onHighlight]);

  const close = () => {
    setOpen(false);
    setActive(-1);
  };

  const requestLocation = () => {
    if (!canLocate || locating) return;
    setLocating(true);
    setLocationFailed(false);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setOrigin({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLocating(false);
        setActive(-1);
        inputRef.current?.focus();
      },
      () => {
        setLocating(false);
        setLocationFailed(true);
        inputRef.current?.focus();
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 600000 },
    );
  };

  const choose = (option) => {
    if (!option) return;
    if (option.action === 'locate') {
      requestLocation();
      return;
    }
    if (option.href) window.location.assign(option.href);
  };

  const onKeyDown = (event) => {
    const count = options.length;
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        if (!open) {
          setOpen(true);
          setActive(0);
        } else if (count) {
          setActive((index) => (index + 1) % count);
        }
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (!open) {
          setOpen(true);
          setActive(count - 1);
        } else if (count) {
          setActive((index) => (index <= 0 ? count - 1 : index - 1));
        }
        break;
      case 'Enter':
        if (open && active >= 0 && options[active]) {
          event.preventDefault();
          choose(options[active]);
        }
        break;
      case 'Escape':
        if (open) {
          event.preventDefault();
          close();
          if (sheet) inputRef.current?.blur();
        } else if (query) {
          event.preventDefault();
          setQuery('');
        }
        break;
      case 'Tab':
        close();
        break;
      default:
    }
  };

  /* Focus leaving the form closes the list, except in the phone sheet,
     where dismissing the keyboard blurs the field but the reader is still
     looking at the results; the sheet closes by its Back button, Escape,
     or a choice. */
  const onBlur = (event) => {
    if (sheet) return;
    if (!rootRef.current?.contains(event.relatedTarget)) close();
  };

  const expanded = open && options.length > 0;
  let index = -1;

  return (
    <form
      ref={rootRef}
      className={styles.root}
      action="/fests/"
      method="get"
      role="search"
      data-sheet={sheet ? 'true' : 'false'}
      onBlur={onBlur}
    >
      <label htmlFor={inputId} className={styles.visuallyHidden}>
        {copy.label}
      </label>
      <div className={styles.bar}>
        <button
          type="button"
          className={styles.back}
          aria-label={copy.close}
          onClick={() => {
            close();
            inputRef.current?.blur();
          }}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="M19 12H5M11 6l-6 6 6 6" />
          </svg>
        </button>
        <div className={styles.field}>
          <svg
            className={styles.fieldIcon}
            viewBox="0 0 24 24"
            aria-hidden="true"
            focusable="false"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-3.5-3.5" />
          </svg>
          <input
            ref={inputRef}
            id={inputId}
            className={styles.input}
            type="text"
            name="q"
            value={query}
            placeholder={
              narrow && !sheet ? copy.placeholderShort : copy.placeholder
            }
            role="combobox"
            aria-autocomplete="list"
            aria-expanded={expanded}
            aria-controls={listId}
            aria-activedescendant={
              expanded && active >= 0 ? optionId(active) : undefined
            }
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            enterKeyHint="search"
            onChange={(event) => {
              setQuery(event.target.value);
              setOpen(true);
              setActive(-1);
            }}
            onFocus={() => setOpen(true)}
            onClick={() => setOpen(true)}
            onKeyDown={onKeyDown}
          />
          {query && (
            <button
              type="button"
              className={styles.clear}
              aria-label={copy.clear}
              onClick={() => {
                setQuery('');
                setActive(-1);
                inputRef.current?.focus();
              }}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          )}
          <button type="submit" className={styles.submit}>
            <span className={styles.submitLong}>{copy.submit}</span>
            <span className={styles.submitShort}>{copy.submitShort}</span>
          </button>
        </div>
      </div>

      {/* Directly after the field in the document, so a phone screen
          reader, which ignores aria-activedescendant, swipes straight
          into it. */}
      <div
        id={listId}
        role="listbox"
        aria-label={copy.label}
        className={styles.list}
        hidden={!expanded}
        onMouseDown={(event) => event.preventDefault()}
      >
        {expanded &&
          state.groups.map((group) => {
            const labelId = `${listId}-${group.id}-label`;
            return (
              <div
                key={group.id}
                role="group"
                className={styles.group}
                aria-labelledby={group.label ? labelId : undefined}
              >
                {group.label && (
                  <div
                    id={labelId}
                    role="presentation"
                    className={styles.groupLabel}
                    data-note={state.mode === 'none' ? 'true' : 'false'}
                  >
                    {group.label}
                  </div>
                )}
                {group.options.map((option) => {
                  index += 1;
                  const at = index;
                  return (
                    <div
                      key={option.id}
                      id={optionId(at)}
                      role="option"
                      aria-selected={active === at}
                      className={styles.option}
                      data-kind={option.kind}
                      onMouseMove={() => active !== at && setActive(at)}
                      onClick={() => choose(option)}
                    >
                      <Icon kind={option.kind} />
                      <span className={styles.optionText}>
                        <span className={styles.optionMain}>
                          <Bold text={option.main} range={option.mainRange} />
                        </span>
                        {option.sub && (
                          <span className={styles.optionSub}>
                            <Bold text={option.sub} range={option.subRange} />
                          </span>
                        )}
                      </span>
                      {option.right && (
                        <span className={styles.optionRight}>
                          {option.right}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
      </div>

      {/* Present from the start and never display:none, or it would not
          announce (Adrian Roselli's live-region testing). */}
      <div role="status" className={styles.visuallyHidden}>
        {announcement}
      </div>
    </form>
  );
};

export default FestSearch;
