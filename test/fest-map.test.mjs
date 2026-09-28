import assert from 'node:assert/strict';
import test from 'node:test';

import { WORLD_GRID } from '../src/data/worldGrid.mjs';
import {
  festCellPlace,
  festCells,
  festMapCountries,
  festMapLabels,
  festMapSummary,
  festTone,
  gridCell,
  labelSide,
  landCells,
  nearestFestCell,
  nextMapLabel,
  placeTotals,
} from '../src/lib/festMap.mjs';

/* The homepage map is drawn from the directory's own Fests (lib/festMap),
   over the land in data/worldGrid. These pin the projection, so a Fest
   lands in the country it is in, and the rules the drawing leans on. */

const fest = (name, country, lat, lng) => ({
  id: name,
  name,
  country,
  lat,
  lng,
});

test('the grid is the shape its header says, one row of cells per line', () => {
  assert.equal(WORLD_GRID.land.length, WORLD_GRID.rows);
  WORLD_GRID.land.forEach((line) => {
    assert.equal(line.length, WORLD_GRID.cols);
    assert.match(line, /^[#.]+$/);
  });
});

test('a coordinate lands in its cell, and known land is land', () => {
  const london = gridCell(51.5, -0.12);
  const toronto = gridCell(43.65, -79.38);
  assert.ok(london && toronto);
  // London is north of Toronto, and east of it.
  assert.ok(london.row < toronto.row);
  assert.ok(london.col > toronto.col);
  assert.equal(WORLD_GRID.land[london.row][london.col], '#');
  assert.equal(WORLD_GRID.land[toronto.row][toronto.col], '#');
  // The middle of the Atlantic is not.
  const atlantic = gridCell(0, -30);
  assert.equal(WORLD_GRID.land[atlantic.row][atlantic.col], '.');
});

test('west of 170W wraps round to the far edge instead of falling off', () => {
  const west = gridCell(20, -175);
  assert.ok(west);
  assert.ok(west.col > WORLD_GRID.cols - 5);
});

test('outside the band, or no coordinates at all, is no cell', () => {
  assert.equal(gridCell(80, 10), null);
  assert.equal(gridCell(-60, 10), null);
  assert.equal(gridCell(null, 10), null);
  assert.equal(gridCell(10, undefined), null);
  assert.equal(gridCell(Number.NaN, 10), null);
});

test('the land, fine and coarsened by two', () => {
  const fine = landCells();
  const hashes = WORLD_GRID.land.join('').split('#').length - 1;
  assert.equal(fine.length, hashes);

  const coarse = landCells(WORLD_GRID, 2);
  // Coarser, but no land is lost: every fine land cell's parent survives.
  const parents = new Set(coarse.map(({ row, col }) => `${row},${col}`));
  fine.forEach(({ row, col }) => {
    assert.ok(parents.has(`${Math.floor(row / 2)},${Math.floor(col / 2)}`));
  });
  assert.ok(coarse.length < fine.length);
});

test('three tones, named by the legend', () => {
  assert.equal(festTone(1), 'one');
  assert.equal(festTone(2), 'few');
  assert.equal(festTone(3), 'few');
  assert.equal(festTone(4), 'many');
  assert.equal(festTone(40), 'many');
});

test('Fests are counted per cell, busiest drawn last, strays dropped', () => {
  const fests = [
    fest('Hacktoberfest Hack Day Toronto', 'Canada', 43.65, -79.38),
    fest('Hacktoberfest Meetup Toronto', 'Canada', 43.66, -79.39),
    fest('Hacktoberfest Hack Day London', 'United Kingdom', 51.5, -0.12),
    fest('No location', 'Canada', null, null),
    null,
  ];
  const cells = festCells(fests);
  assert.equal(cells.length, 2);
  assert.deepEqual(
    cells.map((cell) => [cell.count, cell.tone]),
    [
      [1, 'one'],
      [2, 'few'],
    ],
  );

  assert.deepEqual(
    cells.map((cell) => cell.ids.length),
    [1, 2],
  );

  const coarse = festCells(fests, WORLD_GRID, 2);
  assert.equal(coarse.length, 2);
  const toronto = gridCell(43.65, -79.38);
  assert.ok(
    coarse.some(
      (cell) =>
        cell.row === Math.floor(toronto.row / 2) &&
        cell.col === Math.floor(toronto.col / 2),
    ),
  );
});

test('the summary counts what was plotted, and the countries it is in', () => {
  assert.deepEqual(
    festMapSummary([
      fest('A', 'Canada', 43.65, -79.38),
      fest('B', 'Canada', 45.5, -73.57),
      fest('C', 'Kenya', -1.29, 36.82),
      fest('D', 'Kenya', null, null),
    ]),
    { fests: 3, countries: 2 },
  );
  assert.deepEqual(festMapSummary([]), { fests: 0, countries: 0 });
  assert.deepEqual(festMapSummary(null), { fests: 0, countries: 0 });
});

test('labels name the busiest countries, pinned apart, with their counts', () => {
  const fests = [
    ...Array.from({ length: 5 }, (_, i) => fest(`D${i}`, 'India', 28.6, 77.2)),
    fest('N1', 'India', 19.07, 72.87),
    fest('K1', 'Kenya', -1.29, 36.82),
    fest('K2', 'Kenya', -1.3, 36.8),
    // Next door to the Delhi cell, so it may not take a label beside it.
    fest('P1', 'Pakistan', 31.5, 74.3),
    fest('P2', 'Pakistan', 31.5, 74.3),
    fest('P3', 'Pakistan', 31.5, 74.3),
  ];
  const labels = festMapLabels(fests, { count: 3 });
  assert.deepEqual(
    labels.map((label) => [label.name, label.count]),
    [
      ['India', 6],
      ['Kenya', 2],
    ],
  );
  const delhi = gridCell(28.6, 77.2);
  assert.equal(labels[0].row, delhi.row);
  assert.equal(labels[0].col, delhi.col);
  assert.deepEqual(festMapLabels([]), []);
});

test('every country is ranked by its Fests, pinned to its busiest cell', () => {
  const fests = [
    fest('A', 'Kenya', -1.29, 36.82),
    fest('B', 'India', 28.6, 77.2),
    fest('C', 'India', 28.6, 77.2),
    fest('D', 'India', 19.07, 72.87),
    fest('E', 'Canada', 43.65, -79.38),
    fest('F', null, 10, 10),
  ];
  const ranked = festMapCountries(fests);
  assert.deepEqual(
    ranked.map((label) => [label.name, label.count]),
    [
      ['India', 3],
      ['Canada', 1],
      ['Kenya', 1],
    ],
  );
  const delhi = gridCell(28.6, 77.2);
  assert.deepEqual([ranked[0].row, ranked[0].col], [delhi.row, delhi.col]);

  // The phone drawing's cells are the fine ones halved.
  const coarse = festMapCountries(fests, { factor: 2 });
  assert.deepEqual(
    [coarse[0].row, coarse[0].col],
    [Math.floor(delhi.row / 2), Math.floor(delhi.col / 2)],
  );
});

test('the next animated name skips what is showing and what would crowd it', () => {
  const ranked = [
    { name: 'India', count: 9, row: 16, col: 87 },
    { name: 'Pakistan', count: 5, row: 15, col: 84 },
    { name: 'Kenya', count: 4, row: 27, col: 73 },
    { name: 'Canada', count: 2, row: 12, col: 30 },
  ];
  const gap = { rows: 4, cols: 18 };

  const first = nextMapLabel(ranked, 0, [], gap);
  assert.equal(first.label.name, 'India');
  assert.equal(first.cursor, 1);

  // Pakistan sits beside India, so the walk moves on to Kenya.
  const second = nextMapLabel(ranked, first.cursor, [first.label], gap);
  assert.equal(second.label.name, 'Kenya');
  assert.equal(second.cursor, 3);

  // It wraps round the list, and never repeats a name on the map.
  const third = nextMapLabel(ranked, 3, [ranked[3], ranked[0], ranked[2]], gap);
  assert.equal(third, null);
  const wrapped = nextMapLabel(ranked, 3, [ranked[2]], gap);
  assert.equal(wrapped.label.name, 'Canada');
  assert.equal(wrapped.cursor, 0);

  assert.equal(nextMapLabel([], 0, [], gap), null);
});

test('names in the east hang to the left, and are spaced by where they hang', () => {
  assert.equal(labelSide({ col: 87 }, 128), 'right');
  assert.equal(labelSide({ col: 110 }, 128), 'left');

  const gap = { rows: 4, cols: 18, gridCols: 128 };
  // India hangs right from 87, Taiwan hangs left from 106: their spans
  // meet on the same rows, so Taiwan waits.
  const india = { name: 'India', count: 9, row: 16, col: 87 };
  const taiwan = { name: 'Taiwan', count: 2, row: 17, col: 106 };
  assert.equal(nextMapLabel([india, taiwan], 1, [india], gap), null);
  // Further east, it clears.
  const japan = { name: 'Japan', count: 1, row: 15, col: 124 };
  assert.equal(
    nextMapLabel([india, japan], 1, [india], gap).label.name,
    'Japan',
  );
});

test('the pointer finds the nearest Fest square, forgiving a near miss', () => {
  const cells = [
    { row: 10, col: 20, ids: ['a'] },
    { row: 10, col: 22, ids: ['b'] },
  ];
  // Over the first square, and just off its edge.
  assert.equal(nearestFestCell(cells, 10.4, 20.4).ids[0], 'a');
  assert.equal(nearestFestCell(cells, 10.4, 21.2).ids[0], 'a');
  // Nearer the second.
  assert.equal(nearestFestCell(cells, 10.4, 21.9).ids[0], 'b');
  // Open sea.
  assert.equal(nearestFestCell(cells, 30, 60), null);
  assert.equal(nearestFestCell(null, 10, 20), null);
});

test('a hovered square is named for its busiest city and links to it', () => {
  const list = [
    { id: 'b1', city: 'Bengaluru ', country: 'India' },
    { id: 'b2', city: 'BENGALURU', country: 'India' },
    { id: 'b3', city: 'Bengaluru', country: 'India' },
    { id: 'm1', city: 'Mysuru', country: 'India' },
    { id: 'k1', city: 'Karkala', country: 'India' },
    { id: 'v1', city: 'vidisha', country: 'India' },
    { id: 'x1', city: null, country: 'Kenya' },
  ];
  const byId = new Map(list.map((f) => [f.id, f]));
  const totals = placeTotals(list);
  assert.equal(totals.get('bengaluru'), 3);

  // Spellings fold together; the rest of the square is "nearby".
  assert.deepEqual(festCellPlace({ ids: ['b1', 'm1', 'b2'] }, byId, totals), {
    name: 'Bengaluru',
    count: 2,
    nearby: 1,
    href: '/fests/?q=Bengaluru',
  });
  // A tie goes to the city with more Fests anywhere.
  assert.equal(
    festCellPlace({ ids: ['k1', 'b3'] }, byId, totals).name,
    'Bengaluru',
  );
  // One case throughout is title-cased for the label.
  assert.equal(
    festCellPlace({ ids: ['v1', 'm1'] }, byId, totals).name,
    'Mysuru',
  );
  assert.equal(festCellPlace({ ids: ['v1'] }, byId, totals).name, 'Vidisha');
  // One Fest opens its own card; no city falls back to the country.
  assert.deepEqual(festCellPlace({ ids: ['x1'] }, byId), {
    name: 'Kenya',
    count: 1,
    nearby: 0,
    href: '/fests/?fest=x1',
  });
  assert.equal(festCellPlace({ ids: ['gone'] }, byId), null);
});
