import { useEffect, useId, useMemo, useRef, useState } from 'react';

import { mapHero } from 'data/content.mjs';
import { WORLD_GRID } from 'data/worldGrid.mjs';
import {
  festCellPlace,
  festCells,
  festMapCountries,
  festMapSummary,
  gridCell,
  labelSide,
  landCells,
  nearestFestCell,
  nextMapLabel,
  placeTotals,
} from 'lib/festMap.mjs';

import styles from './FestMap.module.css';

/* The homepage's map: a square for every cell of the world grid that
   holds a Fest, over the land in the hero's own pixel-block style.

   The land is static (data/worldGrid.mjs), so it is drawn on the server
   and in the export, and the map has its shape on first paint; the Fests
   come from the same endpoint as the directory and fill in after
   hydration. CSS Modules rather than styled-components, the rule every
   client-rendered surface here follows, because a styled-component first
   rendered on the client ships no CSS on this static export.

   Two drawings of the same data: the full grid from tablet up, and one
   coarsened by two for phones, where a 128-column grid would be squares
   three pixels wide. CSS shows one and hides the other, so neither waits
   on JavaScript to pick.

   The hero owns the Fests and hands them in, with what the search beside
   the map is doing (components/FestSearch): while its list is open the
   names stop drifting, the Fests that do not match dim, the ones that do
   are ringed, and the one the list has highlighted is named.

   Under a mouse the map answers the pointer: a soft light follows it
   across the land, the drifting names wait, and the Fest square nearest
   the pointer is ringed and named for its city, a click away from that
   city in the directory. The search stays the way in for everyone else;
   this is only ever a shortcut. */
const CELL = 10;
const SQUARE = 8;
/* The light's radius, in the full drawing's units (about thirteen cells). */
const SPOT = 130;

/* One path for all the land, not a rect per cell: two thousand squares
   as rects would put over a hundred kilobytes of markup into the
   homepage's HTML. */
const landPath = (cells) =>
  cells
    .map(
      ({ row, col }) =>
        `M${col * CELL} ${row * CELL}h${SQUARE}v${SQUARE}h-${SQUARE}z`,
    )
    .join('');

/* The country names drift across the map one at a time (the research
   round of 2026-09-28: one callout, never a crowd): one arrives every
   STAGGER ms at its country's busiest cell as the last leaves, and the
   walk goes on through every country with a Fest, busiest first
   (lib/festMap nextMapLabel keeps a newcomer clear of the one leaving).
   Nothing ticks while the tab is hidden, or while `paused`, and the walk
   picks up where it left off after a pause. Under prefers-reduced-motion
   nothing moves at all: the busiest country is simply labelled, and
   stays. */
const STAGGER = 2600;
/* The press-out's length (FestMap.module.css label-out), and a frame. */
const EXIT = 130;
const CASCADE = 320;

const useCyclingLabels = (ranked, slots, gap, paused) => {
  const [labels, setLabels] = useState([]);
  const cursorRef = useRef(0);

  useEffect(() => {
    if (!ranked.length || paused) {
      setLabels([]);
      return undefined;
    }

    const reduced =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduced) {
      const still = [];
      while (still.length < slots) {
        const next = nextMapLabel(ranked, 0, still, gap);
        if (!next) break;
        still.push(next.label);
      }
      setLabels(
        still.map((label) => ({ ...label, key: label.name, phase: 'still' })),
      );
      return undefined;
    }

    let live = [];
    let serial = 0;
    const timers = new Set();
    const later = (fn, ms) => {
      const timer = setTimeout(() => {
        timers.delete(timer);
        fn();
      }, ms);
      timers.add(timer);
    };

    const tick = () => {
      if (document.visibilityState === 'hidden') return;
      const staying = live.filter((label) => label.phase !== 'out');
      if (staying.length >= slots) {
        const leaving = staying[0].key;
        live = live.map((label) =>
          label.key === leaving ? { ...label, phase: 'out' } : label,
        );
        later(() => {
          live = live.filter((label) => label.key !== leaving);
          setLabels(live);
        }, EXIT);
      }
      /* Spaced against everything still on the map, the one fading out
         included, so a newcomer never lands on top of a leaver. */
      const next = nextMapLabel(ranked, cursorRef.current, live, gap);
      if (next) {
        cursorRef.current = next.cursor;
        serial += 1;
        live = [...live, { ...next.label, key: serial, phase: 'in' }];
      }
      setLabels(live);
    };

    for (let i = 0; i < slots; i += 1) later(tick, i * CASCADE);
    let interval = null;
    later(() => {
      interval = setInterval(tick, STAGGER);
    }, slots * CASCADE);

    return () => {
      timers.forEach(clearTimeout);
      if (interval) clearInterval(interval);
    };
  }, [ranked, slots, gap, paused]);

  return labels;
};

/* The name for what the search list has highlighted: a Fest or a city at
   its own cell, a country at its busiest one. */
const focusLabel = (focus, ranked, factor) => {
  if (!focus) return null;
  if (focus.kind === 'country') {
    const country = ranked.find((entry) => entry.name === focus.name);
    return country
      ? { ...country, key: `focus-${focus.name}`, phase: 'in' }
      : null;
  }
  const cell = gridCell(focus.lat, focus.lng);
  if (!cell) return null;
  return {
    name: focus.name,
    count: focus.count,
    row: Math.floor(cell.row / factor),
    col: Math.floor(cell.col / factor),
    key: `focus-${focus.kind}-${focus.name}`,
    phase: 'in',
  };
};

/* Where a label sits, in percentages of the drawing so it stays on its
   country at any width: just right of its square, or just left of it for
   the countries near the map's right edge, where a name would run off. */
const labelPlacement = (label, cols, rows) => {
  const side = labelSide(label, cols);
  const x =
    side === 'right' ? label.col * CELL + SQUARE + 3 : label.col * CELL - 3;
  return {
    side,
    style: {
      left: `${(x / (cols * CELL)) * 100}%`,
      top: `${((label.row * CELL + SQUARE / 2) / (rows * CELL)) * 100}%`,
    },
  };
};

const Drawing = ({ factor, fests, gap, highlight, className }) => {
  const cols = Math.ceil(WORLD_GRID.cols / factor);
  const rows = Math.ceil(WORLD_GRID.rows / factor);
  const land = useMemo(() => landPath(landCells(WORLD_GRID, factor)), [factor]);
  const cells = useMemo(
    () => (fests ? festCells(fests, WORLD_GRID, factor) : []),
    [fests, factor],
  );
  const ranked = useMemo(
    () => (fests ? festMapCountries(fests, { factor }) : []),
    [fests, factor],
  );
  const festsById = useMemo(
    () => new Map((fests || []).map((fest) => [fest.id, fest])),
    [fests],
  );
  const totals = useMemo(() => placeTotals(fests), [fests]);

  const uid = useId().replace(/[^\w-]/g, '');
  const svgRef = useRef(null);
  const spotRef = useRef(null);
  const [inside, setInside] = useState(false);
  const [hover, setHover] = useState(null);

  const searching = Boolean(highlight?.open);
  const cycling = useCyclingLabels(ranked, 1, gap, searching || inside);
  const focused = searching
    ? focusLabel(highlight.focus, ranked, factor)
    : null;
  const hovered =
    !searching && hover
      ? { ...hover, key: `hover-${hover.row},${hover.col}`, phase: 'in' }
      : null;
  const labels = searching
    ? focused
      ? [focused]
      : []
    : hovered
      ? [hovered]
      : cycling;
  const matches = searching ? highlight.ids : null;

  /* A mouse or a pen only: a finger has no hover, and a tap on the map
     should scroll the page, not open the directory. The light is moved
     straight in the DOM, not through state, so a moving pointer costs no
     renders; the hovered square is state, and changes only when the
     pointer crosses to another one. */
  const onPointerMove = (event) => {
    if (event.pointerType === 'touch' || !svgRef.current) return;
    const box = svgRef.current.getBoundingClientRect();
    const x = ((event.clientX - box.left) / box.width) * cols * CELL;
    const y = ((event.clientY - box.top) / box.height) * rows * CELL;
    spotRef.current?.setAttribute('cx', x.toFixed(1));
    spotRef.current?.setAttribute('cy', y.toFixed(1));
    if (!inside) setInside(true);

    const cell = searching ? null : nearestFestCell(cells, y / CELL, x / CELL);
    setHover((current) => {
      if (!cell) return null;
      if (current && current.row === cell.row && current.col === cell.col) {
        return current;
      }
      const place = festCellPlace(cell, festsById, totals);
      return place ? { ...place, row: cell.row, col: cell.col } : null;
    });
  };
  const onPointerLeave = () => {
    setInside(false);
    setHover(null);
  };
  const onClick = () => {
    if (hovered?.href) window.location.assign(hovered.href);
  };
  const matchOf = (cell) =>
    matches
      ? cell.ids.some((id) => matches.has(id))
        ? 'yes'
        : 'no'
      : undefined;

  return (
    <div
      className={className}
      data-hovering={hovered ? 'true' : 'false'}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      onClick={onClick}
    >
      <svg
        ref={svgRef}
        className={styles.svg}
        viewBox={`0 0 ${cols * CELL} ${rows * CELL}`}
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <radialGradient id={`${uid}-glow`}>
            <stop offset="0" stopColor="#fff" stopOpacity="1" />
            <stop offset="0.55" stopColor="#fff" stopOpacity="0.45" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </radialGradient>
          <mask id={`${uid}-spot`}>
            <circle
              ref={spotRef}
              cx="-999"
              cy="-999"
              r={SPOT / factor}
              fill={`url(#${uid}-glow)`}
            />
          </mask>
        </defs>
        <path className={styles.land} d={land} />
        {/* The land again, brighter, seen only through the light. */}
        <path
          className={styles.landLit}
          data-on={inside ? 'true' : 'false'}
          d={land}
          mask={`url(#${uid}-spot)`}
        />
        {cells.map((cell) => (
          <rect
            key={`${cell.row},${cell.col}`}
            className={styles.fest}
            data-tone={cell.tone}
            data-match={matchOf(cell)}
            x={cell.col * CELL - 1}
            y={cell.row * CELL - 1}
            width={SQUARE + 2}
            height={SQUARE + 2}
          />
        ))}
        {/* A ring round every square that matches the search. */}
        {matches &&
          cells
            .filter((cell) => matchOf(cell) === 'yes')
            .map((cell) => (
              <rect
                key={`ring-${cell.row},${cell.col}`}
                className={styles.ring}
                x={cell.col * CELL - 3}
                y={cell.row * CELL - 3}
                width={SQUARE + 6}
                height={SQUARE + 6}
              />
            ))}
        {/* A ring round the square under the pointer. */}
        {hovered && (
          <rect
            key={`ring-${hovered.key}`}
            className={styles.ring}
            x={hovered.col * CELL - 3}
            y={hovered.row * CELL - 3}
            width={SQUARE + 6}
            height={SQUARE + 6}
          />
        )}
        {/* A ping on the square each drifting name points at. */}
        {labels
          .filter((label) => label !== hovered)
          .map((label) => (
            <rect
              key={`ping-${label.key}`}
              className={styles.ping}
              data-phase={label.phase}
              x={label.col * CELL - 2}
              y={label.row * CELL - 2}
              width={SQUARE + 4}
              height={SQUARE + 4}
            />
          ))}
      </svg>
      {labels.map((label) => {
        const { side, style } = labelPlacement(label, cols, rows);
        return (
          <span
            key={label.key}
            className={styles.label}
            data-side={side}
            data-phase={label.phase}
            style={style}
            aria-hidden="true"
          >
            {label.name}
            {label.count != null && (
              <span className={styles.labelCount}>{label.count}</span>
            )}
            {label.nearby > 0 && (
              <span className={styles.labelNearby}>
                {mapHero.map.nearby(label.nearby)}
              </span>
            )}
          </span>
        );
      })}
    </div>
  );
};

/* How far apart two names must sit, in each drawing's own cells: a few
   rows, or roughly a name's width in columns. Stable objects, so the
   cycling effect does not restart on every render. */
const WIDE_GAP = Object.freeze({
  rows: 4,
  cols: 18,
  gridCols: WORLD_GRID.cols,
});
const NARROW_GAP = Object.freeze({
  rows: 3,
  cols: 18,
  gridCols: Math.ceil(WORLD_GRID.cols / 2),
});

/* `status` is the hero's fetch: 'loading', 'ready' or 'error'. With no
   Fests the map is still a map of the world: the land stays, and the
   label goes quiet rather than claiming a count it cannot back up. */
const FestMap = ({ fests, status, highlight }) => {
  const ready = status === 'ready' && Array.isArray(fests);
  const summary = ready && fests.length ? festMapSummary(fests) : null;
  const mode = !highlight?.open ? 'idle' : highlight.ids ? 'matching' : 'muted';

  return (
    <div className={styles.root}>
      <div
        className={styles.frame}
        role="img"
        aria-label={
          summary
            ? mapHero.map.label(summary.fests, summary.countries)
            : mapHero.map.loadingLabel
        }
        data-status={status}
        data-mode={mode}
      >
        <Drawing
          factor={1}
          fests={ready ? fests : null}
          gap={WIDE_GAP}
          highlight={highlight}
          className={styles.wide}
        />
        <Drawing
          factor={2}
          fests={ready ? fests : null}
          gap={NARROW_GAP}
          highlight={highlight}
          className={styles.narrow}
        />
      </div>
    </div>
  );
};

export default FestMap;
