import maplibregl from 'maplibre-gl';
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';

import { basemapSource } from 'lib/basemapSource.mjs';
import { MARKER_SIZE, squareMarker } from 'lib/mapMarker.mjs';
import { basemapStyle } from 'lib/mapStyle.mjs';
import { colors } from 'styles/tokens';

import styles from './FestsDirectory.module.css';

/* The one Fest's location, in the modal. Separate from FestsDirectory's
   FestsMap rather than a mode of it: that map is a world view of many
   markers with popups a reader clicks through, and this is a single pin at
   street zoom with nothing to click — the modal around it already is the
   detail those popups would carry. */

/* 12 rather than the street-level 15 this started at: the modal's map
   answers "roughly where in the city is this", and at 15 a reader saw
   four blocks with no landmark to hang them on. At 12 the district and
   its water/parks are in frame and the address below still gives the
   exact door. */
const ZOOM = 12;

/* Ink on paper rather than the directory map's orange. This map is tinted
   toward the Fest's accent, and for a Hack Day that accent is the same hue
   as the orange marker, so it would have dissolved into its own
   background. Ink has luminance on its side instead of hue, and reads on
   any tint the palette produces. */
const FEST_ICON = squareMarker(colors.ink, colors.white);
const PAST_FEST_ICON = squareMarker(colors.muted, colors.white);

/* Past outranks format here as it does everywhere else on this page, and
   colourless is the point of it. */
const ACCENTS = {
  hackDay: colors.maroon,
  meetUp: colors.skyDeep,
};

const markerElement = (isPast) => {
  const el = document.createElement('img');
  el.src = isPast ? PAST_FEST_ICON : FEST_ICON;
  el.width = MARKER_SIZE;
  el.height = MARKER_SIZE;
  /* Decorative: the address sits beside this map in words. */
  el.alt = '';
  return el;
};

const FestLocationMap = ({ lat, lng, format, isPast }) => {
  const container = useRef(null);
  const map = useRef(null);
  const marker = useRef(null);

  /* Whether the map is showing the Fest it was asked for. False from
     mount, and re-falsed whenever the Fest or its tint changes, because
     the one map is reused across Fests: reopening the modal on Sydney
     would otherwise show London for as long as the jump and its tiles
     take, which reads as the wrong Fest's map rather than as loading.
     While false, the veil below covers the canvas in the skeleton's own
     paper; MapLibre's 'idle' — everything jumped, restyled and every
     visible tile in — is what lifts it. */
  const [settled, setSettled] = useState(false);

  const style = useMemo(
    () =>
      basemapStyle({
        source: basemapSource(),
        accent: isPast ? null : ACCENTS[format] || null,
      }),
    [format, isPast],
  );

  /* Built once and then reused. The map is NOT rebuilt per Fest, which is
     a deliberate change from how this worked on its first two providers:
     tearing a map down and standing a new one up refetches every tile it
     draws, and tile requests are what the basemap is metered on. Opening
     ten Fests should cost one map, not ten. */
  useEffect(() => {
    if (!container.current || !style.sources.protomaps) return undefined;

    map.current = new maplibregl.Map({
      container: container.current,
      style,
      center: [lng, lat],
      zoom: ZOOM,
      /* A wheel that zoomed would trap a reader trying to scroll past a
         modal. Cooperative lets a plain scroll through to the page and
         asks for ctrl-scroll, or two fingers on touch, to zoom. */
      cooperativeGestures: true,
      /* One pin, already centred, at a zoom chosen for it. The controls
         are clutter in a box this size; the directory map is where a map
         is the point. */
      attributionControl: { compact: true },
    });

    marker.current = new maplibregl.Marker({
      element: markerElement(isPast),
      anchor: 'center',
    })
      .setLngLat([lng, lat])
      .addTo(map.current);

    map.current.once('idle', () => setSettled(true));

    return () => {
      map.current.remove();
      map.current = null;
      marker.current = null;
    };
    // Mount only. Every prop below is handled by its own effect, so that
    // changing one moves the existing map rather than building another.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* MapLibre measures its container on construction, and a container
     inside a dialog that is mid-transition measures wrong — the classic
     grey-map bug, and guaranteed here rather than merely possible because
     the dialog animates and stays mounted while closed.

     Twice on purpose: once on the next frame, which is enough when the
     transition is short or motion is reduced, and once after the entry
     animation has certainly finished. Both are cheap and idempotent. */
  useEffect(() => {
    const settle = () => map.current && map.current.resize();

    const frame = requestAnimationFrame(settle);
    const settled = setTimeout(settle, 300);

    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(settled);
    };
  }, []);

  /* Move rather than rebuild. jumpTo, not flyTo: the modal has just faded
     in over a different Fest and an animated pan across a continent would
     read as the map losing its place.

     A LAYOUT effect, and that is the veil's timing guarantee: useEffect
     runs after paint, which put one painted frame of the previous Fest's
     map on screen before the veil covered it — visible as the old city
     fading out under the opening modal. Layout effects run before the
     browser paints, so the veil is opaque on the reopened modal's very
     first frame. */
  useLayoutEffect(() => {
    if (!map.current || !marker.current) return;

    setSettled(false);
    map.current.jumpTo({ center: [lng, lat], zoom: ZOOM });
    marker.current.setLngLat([lng, lat]);
    map.current.once('idle', () => setSettled(true));
  }, [lat, lng]);

  /* The tint follows the Fest. Skipped on the first run, and that guard
     is load-bearing rather than an optimisation: the constructor above was
     handed this exact style object, so calling setStyle with it again
     immediately would tear down a style still in the middle of loading —
     MapLibre says so ("Unable to perform style diff: Style is not done
     loading") and rebuilds from scratch, cancelling every tile request
     already in flight. The map then sits on its background colour looking
     for all the world like a basemap that will not load. */
  const applied = useRef(style);

  /* Layout effect for the same before-paint reason as the jump above. */
  useLayoutEffect(() => {
    if (!map.current || applied.current === style) return;

    applied.current = style;
    setSettled(false);
    map.current.setStyle(style);
    map.current.once('idle', () => setSettled(true));
  }, [style]);

  /* The marker changes colour when the Fest is past. Its element is
     swapped in place rather than the Marker being rebuilt, so nothing has
     to be removed from and re-added to the map to recolour a square. */
  useEffect(() => {
    if (!marker.current) return;

    marker.current.getElement().src = isPast ? PAST_FEST_ICON : FEST_ICON;
  }, [isPast]);

  /* MapLibre owns the children of its container, so the veil is a
     sibling, not a child — React and MapLibre never edit the same node's
     children. */
  return (
    <div className={styles.modalMap}>
      <div className={styles.modalMapCanvas} ref={container} />
      <div
        className={styles.modalMapVeil}
        data-settled={settled || undefined}
        aria-hidden="true"
      />
    </div>
  );
};

export default FestLocationMap;
