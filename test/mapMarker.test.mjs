import assert from 'node:assert/strict';
import test from 'node:test';

import {
  CLUSTER_SIZE,
  MARKER_ANCHOR,
  MARKER_SIZE,
  RAISED_ANCHOR_SHIFT,
  RAISED_MARKER_SIZE,
  circleMarker,
  clusterMarker,
  raisedSquareMarker,
  squareMarker,
} from '../src/lib/mapMarker.mjs';

const decoded = (uri) => {
  assert.ok(
    uri.startsWith('data:image/svg+xml;charset=UTF-8,'),
    `not an svg data uri: ${uri.slice(0, 40)}`,
  );
  return decodeURIComponent(
    uri.slice('data:image/svg+xml;charset=UTF-8,'.length),
  );
};

/* The '#' in a hex colour ends a URI's path and starts its fragment, so an
   unencoded marker would lose every colour on it and render as a black
   box. This is the whole reason the encoding step exists. */
test('encodes the hash in a colour rather than truncating on it', () => {
  const uri = squareMarker('#e53927', '#10201d');

  assert.ok(!uri.includes('#'), 'a raw # survived into the data uri');
  assert.match(decoded(uri), /fill="#e53927"/);
  assert.match(decoded(uri), /stroke="#10201d"/);
});

/* A stroke straddles its edge, half either side, so a rect drawn at 0 with
   a 2px stroke loses its outer pixel to the viewBox. Insetting by half the
   stroke is what keeps the whole square visible. */
test('insets the square so its stroke is not clipped', () => {
  const svg = decoded(squareMarker('#e53927', '#10201d'));

  assert.match(svg, /x="1"/);
  assert.match(svg, /y="1"/);
  assert.match(svg, /width="16"/);
  assert.match(svg, /height="16"/);
  assert.match(svg, /stroke-width="2"/);
});

/* Same arithmetic, round: r + half the stroke has to reach the edge and no
   further. */
test('fits the circle inside the same box', () => {
  const svg = decoded(circleMarker('#8bb2de', '#10201d'));

  assert.match(svg, /cx="9"/);
  assert.match(svg, /cy="9"/);
  assert.match(svg, /r="8"/);
});

/* Both markers declare the same overall size, because the anchor below is
   shared between them and is only correct if they do. */
test('draws both markers at the declared size', () => {
  for (const uri of [
    squareMarker('#e53927', '#10201d'),
    circleMarker('#8bb2de', '#10201d'),
  ]) {
    const svg = decoded(uri);
    assert.match(svg, new RegExp(`width="${MARKER_SIZE}"`));
    assert.match(svg, new RegExp(`height="${MARKER_SIZE}"`));
    assert.match(
      svg,
      new RegExp(`viewBox="0 0 ${MARKER_SIZE} ${MARKER_SIZE}"`),
    );
  }
});

/* Google anchors an image marker at the bottom centre unless told
   otherwise, which would hang every square below the place it marks. These
   are squares rather than pins, so the anchor is the middle — and the old
   Leaflet icons got this subtly wrong, anchoring a 14px box around an 18px
   mark. */
test('anchors at the middle of the marker, not its foot', () => {
  assert.equal(MARKER_ANCHOR, MARKER_SIZE / 2);
});

/* The raised pin bakes the press into the artwork: shadow square at the
   site's 3px offset, pin drawn over it, and an anchor shift that keeps
   the PIN centred on the geography while the drawing grew. */
test('the raised pin carries its own shadow and anchor shift', () => {
  const svg = decoded(raisedSquareMarker('#e53927', '#10201d', '#671912'));

  assert.equal(RAISED_MARKER_SIZE, MARKER_SIZE + 3);
  assert.match(svg, new RegExp(`width="${RAISED_MARKER_SIZE}"`));
  /* Shadow first (painted under), full pin size, at the press offset. */
  assert.match(
    svg,
    /<rect x="3" y="3" width="18" height="18" fill="#671912"\/>/,
  );
  /* The pin itself still at the origin, so only the shadow moved. */
  assert.match(svg, /x="1" y="1" width="16" height="16" fill="#e53927"/);
  /* Centre of pin minus centre of artwork: (9) - (10.5). */
  assert.equal(RAISED_ANCHOR_SHIFT, -1.5);
});

test('the cluster blob is a bigger square in the same language', () => {
  const svg = decoded(clusterMarker('#10201d', '#f7f7f2'));

  assert.match(svg, new RegExp(`width="${CLUSTER_SIZE}"`));
  assert.ok(CLUSTER_SIZE > MARKER_SIZE, 'cluster must outsize a pin');
  assert.match(svg, /fill="#10201d" stroke="#f7f7f2"/);
});
