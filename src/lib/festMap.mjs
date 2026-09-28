/* The homepage's Fest map as data: every Fest in the directory dropped
   into a cell of the coarse world grid in data/worldGrid.mjs, so the map
   is drawn from the same list the directory shows and can never claim a
   Fest the directory does not have.

   Pure, and handed the Fests rather than fetching them, the way the rest
   of lib/ is: components/FestMap owns the request, these own the maths,
   and the tests pin the maths without a network. */
import { WORLD_GRID } from '../data/worldGrid.mjs';
import { festsDirectoryUrl } from './festsUrl.mjs';

/* A coordinate -> its cell, or null when it falls outside the grid's band
   (nothing north of 76N or south of 46S hosts a Fest, and a null keeps a
   stray coordinate from landing on the edge). Longitudes west of the
   grid's western edge wrap round to the far side, because the grid runs
   from 170W east all the way round rather than from the antimeridian. */
export const gridCell = (lat, lng, grid = WORLD_GRID) => {
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;

  const lon = lng < grid.west ? lng + 360 : lng;
  const col = Math.floor(
    ((lon - grid.west) / (grid.east - grid.west)) * grid.cols,
  );
  const row = Math.floor(
    ((grid.north - lat) / (grid.north - grid.south)) * grid.rows,
  );

  if (col < 0 || col >= grid.cols || row < 0 || row >= grid.rows) return null;
  return { row, col };
};

/* The land cells, coarsened by `factor` for small screens: a coarse cell
   is land when any of the fine cells it covers is, so islands and thin
   coasts survive the merge instead of vanishing. */
export const landCells = (grid = WORLD_GRID, factor = 1) => {
  const cells = [];
  for (let row = 0; row * factor < grid.rows; row += 1) {
    for (let col = 0; col * factor < grid.cols; col += 1) {
      let land = false;
      for (let dr = 0; dr < factor && !land; dr += 1) {
        const line = grid.land[row * factor + dr] || '';
        for (let dc = 0; dc < factor && !land; dc += 1) {
          land = line[col * factor + dc] === '#';
        }
      }
      if (land) cells.push({ row, col });
    }
  }
  return cells;
};

/* How a cell is coloured, by how many Fests it holds. Three steps rather
   than a gradient: a reader can tell three colours apart at a glance, and
   the legend can name each one. */
export const festTone = (count) => {
  if (count >= 4) return 'many';
  if (count >= 2) return 'few';
  return 'one';
};

const withCells = (fests, grid, factor) =>
  (Array.isArray(fests) ? fests : [])
    .map((fest) => {
      const cell = fest && gridCell(fest.lat, fest.lng, grid);
      return cell
        ? {
            fest,
            row: Math.floor(cell.row / factor),
            col: Math.floor(cell.col / factor),
          }
        : null;
    })
    .filter(Boolean);

/* One entry per occupied cell, busiest last so the brightest squares are
   drawn on top where neighbours overlap. Each carries the ids of the
   Fests it holds, so the search can light the cells that match. */
export const festCells = (fests, grid = WORLD_GRID, factor = 1) => {
  const byCell = new Map();
  withCells(fests, grid, factor).forEach(({ fest, row, col }) => {
    const key = `${row},${col}`;
    const cell = byCell.get(key) || { row, col, count: 0, ids: [] };
    cell.count += 1;
    if (fest.id != null) cell.ids.push(fest.id);
    byCell.set(key, cell);
  });

  return [...byCell.values()]
    .map((cell) => ({ ...cell, tone: festTone(cell.count) }))
    .sort((a, b) => a.count - b.count || a.row - b.row || a.col - b.col);
};

/* The line under the map, counted from what was plotted: Fests with a
   location, and the countries they are in. */
export const festMapSummary = (fests) => {
  const placed = withCells(fests, WORLD_GRID, 1).map(({ fest }) => fest);
  const countries = new Set(placed.map((fest) => fest.country).filter(Boolean));
  return { fests: placed.length, countries: countries.size };
};

/* Every country on the map, most Fests first, each pinned to its own
   busiest cell (in the drawing's cells, so coarsened by `factor` for the
   phone drawing) and carrying its count. Countries rather than cities,
   deliberately: the busiest cell is often a suburb or a campus town
   nobody abroad would recognise, while a country is both recognisable
   and exactly what the count means. */
export const festMapCountries = (
  fests,
  { grid = WORLD_GRID, factor = 1 } = {},
) => {
  const countries = new Map();
  withCells(fests, grid, factor).forEach(({ fest, row, col }) => {
    if (!fest.country) return;
    const entry = countries.get(fest.country) || {
      name: fest.country,
      total: 0,
      cells: new Map(),
    };
    const key = `${row},${col}`;
    entry.total += 1;
    entry.cells.set(key, {
      row,
      col,
      n: (entry.cells.get(key)?.n || 0) + 1,
    });
    countries.set(fest.country, entry);
  });

  return [...countries.values()]
    .map((entry) => {
      const busiest = [...entry.cells.values()].sort(
        (a, b) => b.n - a.n || a.row - b.row || a.col - b.col,
      )[0];
      return {
        name: entry.name,
        count: entry.total,
        row: busiest.row,
        col: busiest.col,
      };
    })
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
};

/* Which side of its square a label hangs: the right, except for the
   countries in the map's eastern quarter, where a name would run off the
   edge and hangs to the left instead. The component places labels by this
   same rule, so the spacing below measures what is actually drawn. */
export const labelSide = (label, gridCols) =>
  label.col / gridCols > 0.76 ? 'left' : 'right';

/* The columns a label covers, `gap.cols` being roughly a name's width. */
const span = (label, gap) => {
  const gridCols = gap.gridCols || WORLD_GRID.cols;
  return labelSide(label, gridCols) === 'left'
    ? [label.col - gap.cols, label.col]
    : [label.col, label.col + gap.cols];
};

/* Whether two labels can share the map: far enough apart in rows, or
   side by side without their spans meeting. A label is a wide, short
   box, so rows and columns are measured differently. */
const apart = (a, b, gap) => {
  if (Math.abs(a.row - b.row) >= gap.rows) return true;
  const [a0, a1] = span(a, gap);
  const [b0, b1] = span(b, gap);
  return a1 < b0 || b1 < a0;
};

const DEFAULT_GAP = Object.freeze({
  rows: 4,
  cols: 18,
  gridCols: WORLD_GRID.cols,
});

/* The names to show when nothing moves (prefers-reduced-motion): the
   busiest countries, taken greedily so no two crowd each other. */
export const festMapLabels = (
  fests,
  { grid = WORLD_GRID, count = 6, gap = DEFAULT_GAP } = {},
) => {
  const picked = [];
  festMapCountries(fests, { grid }).forEach((label) => {
    if (picked.length >= count) return;
    if (picked.every((other) => apart(other, label, gap))) picked.push(label);
  });
  return picked;
};

/* The next name to animate onto the map. Walks the ranked countries on
   from `cursor` and takes the first that is not already showing and
   would sit clear of every label that is, so the names travel the whole
   list, busiest first, and never pile up. Wraps round once; null when
   every candidate would crowd a visible label, and the caller waits a
   beat for one to leave. The returned cursor is where the next walk
   starts. */
export const nextMapLabel = (ranked, cursor, visible, gap = DEFAULT_GAP) => {
  if (!Array.isArray(ranked) || ranked.length === 0) return null;
  const showing = new Set(visible.map((label) => label.name));
  for (let step = 0; step < ranked.length; step += 1) {
    const index = (cursor + step) % ranked.length;
    const label = ranked[index];
    if (
      !showing.has(label.name) &&
      visible.every((other) => apart(other, label, gap))
    ) {
      return { label, cursor: (index + 1) % ranked.length };
    }
  }
  return null;
};

/* The Fest square under the pointer, forgiving a near miss on squares a
   few pixels wide: the nearest one whose centre is within `reach` cells
   of the point (`row` and `col` fractional, in the drawing's own cells),
   or null over open land and sea. */
export const nearestFestCell = (cells, row, col, reach = 1.5) => {
  let best = null;
  let bestDistance = reach;
  (Array.isArray(cells) ? cells : []).forEach((cell) => {
    /* A square fills 0.8 of its cell from the top left corner. */
    const distance = Math.hypot(cell.row + 0.4 - row, cell.col + 0.4 - col);
    if (distance <= bestDistance) {
      best = cell;
      bestDistance = distance;
    }
  });
  return best;
};

/* A Fest's place for the hover label: its city, or its country when it
   names none. Keyed by the directory's own fold (accents off, lower case),
   so "PUNE" and "Pune" are one place, as they are to the search. */
const fold = (value) =>
  String(value ?? '')
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim();

const placeOf = (fest) =>
  (typeof fest.city === 'string' && fest.city.trim()) || fest.country || '';

/* A spelling fit for a label: as the hosts wrote it, unless they wrote it
   all in one case, which is title-cased ("vidisha", "KANPUR"). */
const displayName = (name) =>
  name === name.toLowerCase() || name === name.toUpperCase()
    ? name
        .toLowerCase()
        .replace(/(^|[\s-])(\p{L})/gu, (m, sep, ch) => sep + ch.toUpperCase())
    : name;

/* How many Fests every place holds across the whole directory: the
   tie-break when a square's cities hold one Fest each, so the one people
   have heard of names it. */
export const placeTotals = (fests) => {
  const totals = new Map();
  (Array.isArray(fests) ? fests : []).forEach((fest) => {
    const key = fest && fold(placeOf(fest));
    if (key) totals.set(key, (totals.get(key) || 0) + 1);
  });
  return totals;
};

/* What a hovered square is called. A square is some 300 km across and
   usually holds more than one city, so: the city most of its Fests are
   in (ties to the one with more Fests anywhere, then alphabetical), how
   many are there, how many more are nearby in the same square, and the
   directory address that lists exactly that city's, which is the count
   the label shows. A square holding one Fest opens that Fest's card. */
export const festCellPlace = (cell, festsById, totals = new Map()) => {
  const inCell = (cell?.ids || [])
    .map((id) => festsById.get(id))
    .filter(Boolean);
  if (!inCell.length) return null;

  const places = new Map();
  inCell.forEach((fest) => {
    const raw = placeOf(fest);
    const key = fold(raw);
    if (!key) return;
    const entry = places.get(key) || { key, count: 0, spellings: new Map() };
    entry.count += 1;
    entry.spellings.set(raw, (entry.spellings.get(raw) || 0) + 1);
    places.set(key, entry);
  });
  const [top] = [...places.values()].sort(
    (a, b) =>
      b.count - a.count ||
      (totals.get(b.key) || 0) - (totals.get(a.key) || 0) ||
      a.key.localeCompare(b.key),
  );
  if (!top) return null;

  /* The spelling most of its Fests use, and of those the one in mixed
     case, since that is how a person writes a name. */
  const [spelling] = [...top.spellings.entries()].sort(
    (a, b) =>
      b[1] - a[1] ||
      Number(displayName(b[0]) === b[0]) - Number(displayName(a[0]) === a[0]),
  )[0];
  const name = displayName(spelling);
  const only = inCell.length === 1 ? inCell[0] : null;
  return {
    name,
    count: top.count,
    nearby: inCell.length - top.count,
    href: only
      ? festsDirectoryUrl({ pathname: '/fests/', fest: only.id })
      : festsDirectoryUrl({ pathname: '/fests/', query: name }),
  };
};
