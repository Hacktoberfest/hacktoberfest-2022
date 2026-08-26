/* The map markers, as SVG data URIs.

   Leaflet's divIcon took arbitrary HTML, so these used to be a styled
   <span>. Google's classic marker takes an image, so the same squares are
   drawn as SVG instead. Same shapes, same palette, same 18px overall —
   this is a change of encoding and not of design.

   18 rather than the 14 the old markup named: those were 14px boxes with
   a 2px border and the default content-box sizing, so what actually
   rendered was 18px across. The old iconAnchor of [7, 7] was therefore
   centring a 14px box and leaving the visible mark a pixel off centre.
   Anchoring at the middle of 18 puts the pin where its Fest is.

   A path stroke straddles its edge, half either side, so insetting by
   half the stroke width is what keeps it inside the box rather than
   clipped by it. */

const SIZE = 18;
const STROKE = 2;
const INSET = STROKE / 2;

/* encodeURIComponent rather than base64: it survives the '#' in every
   colour here, which is the one character that would otherwise truncate
   the URI, and it leaves the markup readable in devtools. */
const dataUri = (svg) =>
  `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;

const wrap = (shape) =>
  dataUri(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}" viewBox="0 0 ${SIZE} ${SIZE}">${shape}</svg>`,
  );

/* Fests. The same square PageHero renders, which is where it comes from. */
export const squareMarker = (fill, stroke) =>
  wrap(
    `<rect x="${INSET}" y="${INSET}" width="${SIZE - STROKE}" height="${SIZE - STROKE}" fill="${fill}" stroke="${stroke}" stroke-width="${STROKE}"/>`,
  );

/* The reader's own location, and round so that it cannot be mistaken for
   a Fest at a glance. Shape carries that distinction rather than colour,
   because the map is already using colour to say past or upcoming. */
export const circleMarker = (fill, stroke) =>
  wrap(
    `<circle cx="${SIZE / 2}" cy="${SIZE / 2}" r="${SIZE / 2 - INSET}" fill="${fill}" stroke="${stroke}" stroke-width="${STROKE}"/>`,
  );

/* The selected pin, with its press baked in. On the canvas a pin is an
   image, not an element, so the raised state cannot be a CSS translate
   and shadow the way the DOM pins did it — the whole gesture is drawn:
   the square sits up-left of centre and a solid accent square lies under
   it at the site's own 3px offset. The drawing grows by the press, so the
   anchor shift below is what keeps the PIN, not the artwork, centred on
   the geography. */
const PRESS = 3;

export const raisedSquareMarker = (fill, stroke, shadow) => {
  const total = SIZE + PRESS;
  return dataUri(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${total}" height="${total}" viewBox="0 0 ${total} ${total}"><rect x="${PRESS}" y="${PRESS}" width="${SIZE}" height="${SIZE}" fill="${shadow}"/><rect x="${INSET}" y="${INSET}" width="${SIZE - STROKE}" height="${SIZE - STROKE}" fill="${fill}" stroke="${stroke}" stroke-width="${STROKE}"/></svg>`,
  );
};

export const RAISED_MARKER_SIZE = SIZE + PRESS;
/* Centre of the pin minus centre of the artwork: applied as icon-offset
   so the raised pin stays where its resting self was. */
export const RAISED_ANCHOR_SHIFT = -PRESS / 2;

/* The cluster blob: several Fests sharing one spot at this zoom. A bigger
   square in ink — the one colour that claims no format, because a cluster
   can hold any mix — with the count drawn over it by the map. White
   stroke so it reads against the tinted basemap the way the past pin's
   white-stroked square already does. */
export const CLUSTER_SIZE = 26;

export const clusterMarker = (fill, stroke) =>
  dataUri(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${CLUSTER_SIZE}" height="${CLUSTER_SIZE}" viewBox="0 0 ${CLUSTER_SIZE} ${CLUSTER_SIZE}"><rect x="${INSET}" y="${INSET}" width="${CLUSTER_SIZE - STROKE}" height="${CLUSTER_SIZE - STROKE}" fill="${fill}" stroke="${stroke}" stroke-width="${STROKE}"/></svg>`,
  );

/* Sizes and anchors, exported for the layers that place these. */
export const MARKER_SIZE = SIZE;
export const MARKER_ANCHOR = SIZE / 2;
