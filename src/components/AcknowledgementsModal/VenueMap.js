import maplibregl from 'maplibre-gl';
import { useEffect, useRef } from 'react';

import { basemapSource, basemapIsAvailable } from 'lib/basemapSource.mjs';
import { MARKER_SIZE, squareMarker } from 'lib/mapMarker.mjs';
import { basemapStyle } from 'lib/mapStyle.mjs';
import { colors } from 'styles/tokens';

/* The venue pin for the acknowledgements' address slide — the /fests
   directory map's grammar at street zoom: the same MapLibre + Protomaps
   basemap and the same square brand marker. This file arrived from main
   written on Leaflet, which this branch had already removed in the
   provider migration; the merge compiled the import against a dependency
   that no longer existed, so it is ported rather than re-adding a second
   map stack for one pin. */

const venueElement = () => {
  const el = document.createElement('img');
  el.src = squareMarker(colors.orange, colors.ink);
  el.width = MARKER_SIZE;
  el.height = MARKER_SIZE;
  /* Decorative: the address is printed directly above this map. */
  el.alt = '';
  return el;
};

/* Street level: close enough to tell the right block from the wrong one,
   wide enough to keep a landmark or two for orientation. */
const VENUE_ZOOM = 16;

const VenueMap = ({ latitude, longitude }) => {
  const container = useRef(null);

  useEffect(() => {
    const style = basemapStyle({ source: basemapSource(), accent: null });
    if (!container.current || !style.sources.protomaps) return undefined;

    const map = new maplibregl.Map({
      container: container.current,
      style,
      center: [longitude, latitude],
      zoom: VENUE_ZOOM,
      /* One pin the host is checking, not a map to wander: a wheel that
         zoomed would trap them inside the modal they are trying to
         scroll. */
      cooperativeGestures: true,
      attributionControl: { compact: true },
    });

    new maplibregl.Marker({ element: venueElement(), anchor: 'center' })
      .setLngLat([longitude, latitude])
      .addTo(map);

    /* The container sits inside a dialog slide that may still be
       animating when this mounts, so the first measure can be wrong —
       the same hazard, and the same two-beat settle, as the /fests
       modal's map. */
    const settle = () => map.resize();
    const frame = requestAnimationFrame(settle);
    const settled = setTimeout(settle, 300);

    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(settled);
      map.remove();
    };
    /* Mounted per open slide; a coordinate change remounts via key
       upstream or a fresh open, so effects need not track props. */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* Without a tile key there is no map to draw; the slide's no-pin copy
     covers the absence upstream, so render nothing rather than a grey
     box. */
  if (!basemapIsAvailable()) return null;

  return <div ref={container} style={{ height: '100%', width: '100%' }} />;
};

export default VenueMap;
