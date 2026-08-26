import maplibregl from 'maplibre-gl';
import { useEffect, useRef } from 'react';

import { fests as festsContent } from 'data/content.mjs';
import { basemapSource } from 'lib/basemapSource.mjs';
import { festDateParts, festIsPast } from 'lib/festDate.mjs';
import {
  MARKER_SIZE,
  RAISED_ANCHOR_SHIFT,
  circleMarker,
  clusterMarker,
  raisedSquareMarker,
  squareMarker,
} from 'lib/mapMarker.mjs';
import { basemapStyle } from 'lib/mapStyle.mjs';
import { colors } from 'styles/tokens';

import styles from './FestsDirectory.module.css';

/* The Fest pins live in the map now, not the DOM. They used to be one
   HTML marker each, which was fine while every Fest had its own patch of
   map — but seven Fests in one city are seven markers on one pixel, and
   grouping them is a job MapLibre only does for features in a clustered
   GeoJSON source. So the pins became map images and the markers became
   layers; same squares, same palette, drawn by the canvas instead of the
   DOM. What clustering buys: nearby Fests merge into one counted blob,
   and clicking it zooms to where they come apart.

   Red for a Hack Day and blue for a Meet Up, so the map says which kind
   of Fest a pin is before it is clicked. The bright pair rather than the
   cards' maroon and skyDeep: those are shadow colours chosen to sit
   under a white card, and at 18px on a tinted basemap both read as
   black. A Fest whose name claims neither format keeps ink; past Fests
   recede to rule grey, and past outranks format here as everywhere.

   The -sel variants are the raised state, press baked into the artwork —
   see lib/mapMarker.mjs. Shadows use the format's dark accent, the same
   colour the Fest's strip and modal carry. */
const ICONS = {
  'pin-hackday': squareMarker(colors.orange, colors.ink),
  'pin-meetup': squareMarker(colors.sky, colors.ink),
  'pin-none': squareMarker(colors.ink, colors.white),
  'pin-past': squareMarker(colors.rule, colors.muted),
  'pin-hackday-sel': raisedSquareMarker(
    colors.orange,
    colors.ink,
    colors.maroon,
  ),
  'pin-meetup-sel': raisedSquareMarker(colors.sky, colors.ink, colors.skyDeep),
  'pin-none-sel': raisedSquareMarker(colors.ink, colors.white, colors.ink),
  'pin-past-sel': raisedSquareMarker(colors.rule, colors.muted, colors.muted),
  'fest-cluster': clusterMarker(colors.ink, colors.white),
};

const iconNameFor = (fest, isPast) => {
  if (isPast) return 'pin-past';
  if (fest.format === 'hackDay') return 'pin-hackday';
  if (fest.format === 'meetUp') return 'pin-meetup';
  return 'pin-none';
};

/* Round, so the reader's own position cannot be mistaken for a Fest at a
   glance — and ochre, which is off the format palette entirely. It is
   the one marker that is not a Fest, so it takes the one accent no Fest
   can. Still a DOM marker: there is only ever one of it and it never
   clusters, so it has no reason to live in the source. */
const ORIGIN_ICON = circleMarker(colors.ochre, colors.ink);

const SOURCE = 'fests';
const CLUSTERS = 'fest-clusters';
const PINS = 'fest-pins';
const SELECTED = 'fest-pin-selected';

/* MapLibre takes [lng, lat], which is the reverse of every other pair on
   this page. Named rather than inlined so the order is stated once. */
const WORLD_CENTER = [0, 20];
const WORLD_ZOOM = 2;

/* Hacktoberfest green. The modal's map takes the colour of the one Fest
   it shows; this map holds every format at once, so it takes the site's
   own instead — which also puts a third hue under the red and blue pins
   rather than letting either of them tint the ground they stand on. */
const WORLD_STYLE = () =>
  basemapStyle({
    source: basemapSource(),
    accent: colors.forest,
    /* Undamped, unlike the modal's maps, because the brand green is
       already a muted one — 0.22 saturation against maroon's 0.69. Taking
       the usual third of it lands at 0.08, which is grey with a rumour of
       green. Passing it through whole reaches roughly the saturation the
       format tints reach after damping, so the two maps carry about the
       same weight of colour despite the different number. */
    strength: 1,
  });

const festsAsGeojson = (fests, today) => ({
  type: 'FeatureCollection',
  features: fests
    .filter(
      (fest) => typeof fest.lat === 'number' && typeof fest.lng === 'number',
    )
    .map((fest) => ({
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [fest.lng, fest.lat] },
      properties: {
        id: fest.id,
        icon: iconNameFor(fest, festIsPast(fest, today)),
      },
    })),
});

const originElement = () => {
  const el = document.createElement('img');
  el.src = ORIGIN_ICON;
  el.width = MARKER_SIZE;
  el.height = MARKER_SIZE;
  el.alt = '';
  return el;
};

const popupContent = (fest, isPast, onOpen) => {
  const root = document.createElement('button');
  root.type = 'button';
  root.className = styles.mapTag;
  if (fest.format) root.dataset.format = fest.format;
  if (isPast) root.dataset.past = 'true';
  root.addEventListener('click', () => onOpen(fest));

  const bar = document.createElement('span');
  bar.className = styles.mapTagBar;

  const body = document.createElement('span');
  body.className = styles.mapTagBody;

  const name = document.createElement('span');
  name.className = styles.mapTagName;
  name.textContent = fest.name;

  const meta = document.createElement('span');
  meta.className = styles.mapTagMeta;

  const label = isPast
    ? festsContent.pastBadge
    : festsContent.formatBadges[fest.format];
  const parts = festDateParts(fest.date);

  const segments = [];
  if (label) {
    const strong = document.createElement('b');
    strong.textContent = label;
    segments.push(strong);
  }
  if (parts) segments.push(`${parts.weekday} ${parts.day} ${parts.month}`);
  if (fest.city) segments.push(fest.city);
  segments.forEach((segment, index) => {
    if (index) meta.append(' · ');
    meta.append(segment);
  });

  body.append(name, meta);

  const go = document.createElement('span');
  go.className = styles.mapTagGo;
  go.textContent = '→';
  go.setAttribute('aria-hidden', 'true');

  root.append(bar, body, go);
  return root;
};

/* The exit animation, which MapLibre gives no room for: remove() takes
   the popup out of the DOM in the same tick, so the strip would vanish
   before a frame of its press-in could run. Every close path funnels
   through remove(), so it is wrapped once: mark the strip exiting, hold
   the DOM open 130ms for the 110ms press-in, then really remove. A close
   that lands mid-exit is a no-op — the timer already running finishes
   the removal. Entry needs no JS: @starting-style runs on insertion. */
const animatedPopup = (content) => {
  const popup = new maplibregl.Popup({
    offset: MARKER_SIZE,
    closeButton: false,
    maxWidth: 'none',
  }).setDOMContent(content);

  const reallyRemove = popup.remove.bind(popup);
  let exiting = null;
  popup.remove = () => {
    if (exiting) return popup;
    if (!popup.isOpen()) return reallyRemove();
    content.dataset.exiting = 'true';
    exiting = setTimeout(() => {
      exiting = null;
      delete content.dataset.exiting;
      reallyRemove();
    }, 130);
    return popup;
  };

  return popup;
};

const FestsMap = ({ fests, origin, today, onOpen }) => {
  const container = useRef(null);
  const map = useRef(null);
  const ready = useRef(false);
  const openPopup = useRef(null);

  /* The layers outlive any single render, so their handlers read whatever
     is current through refs rather than pinning the first render's
     props. */
  const open = useRef(onOpen);
  open.current = onOpen;
  const festsRef = useRef(fests);
  festsRef.current = fests;
  const todayRef = useRef(today);
  todayRef.current = today;

  useEffect(() => {
    const style = WORLD_STYLE();
    if (!container.current || !style.sources.protomaps) return undefined;

    const m = new maplibregl.Map({
      container: container.current,
      style,
      center: WORLD_CENTER,
      zoom: WORLD_ZOOM,
      /* As in the modal: a plain scroll belongs to the page, and this map
         is tall enough that a reader will cross it on the way past. */
      cooperativeGestures: true,
      attributionControl: { compact: true },
    });
    map.current = m;

    /* No compass — the map cannot rotate to anything but north here, so a
       control offering to put it back is answering a question nobody
       asked. */
    m.addControl(
      new maplibregl.NavigationControl({ showCompass: false }),
      'top-left',
    );

    const setSelected = (id) => {
      if (!ready.current) return;
      m.setFilter(
        SELECTED,
        id
          ? ['==', ['get', 'id'], id]
          : /* Matches nothing; a filter, not a visibility flip, so the
               selected pin needs no second bookkeeping. */
            ['==', ['get', 'id'], ''],
      );
    };

    const closeStrip = () => {
      if (openPopup.current) openPopup.current.remove();
    };

    const openStrip = (fest, coordinates) => {
      closeStrip();
      const isPast = festIsPast(fest, todayRef.current);
      const popup = animatedPopup(
        popupContent(fest, isPast, (f) => open.current(f)),
      );
      popup.setLngLat(coordinates).addTo(m);
      popup.on('close', () => {
        if (openPopup.current === popup) {
          openPopup.current = null;
          setSelected(null);
        }
      });
      openPopup.current = popup;
      setSelected(fest.id);
    };

    const setUpFests = async () => {
      /* The squares enter the style as images, awaited before the layers
         that name them exist — an <img> decode of our own data URIs, so
         nothing here touches the network. */
      const loaded = await Promise.all(
        Object.entries(ICONS).map(
          ([name, src]) =>
            new Promise((resolve, reject) => {
              const img = new Image();
              img.onload = () => resolve([name, img]);
              img.onerror = reject;
              img.src = src;
            }),
        ),
      );
      loaded.forEach(([name, img]) => m.addImage(name, img));

      m.addSource(SOURCE, {
        type: 'geojson',
        data: festsAsGeojson(festsRef.current, todayRef.current),
        cluster: true,
        /* Pixels within which pins merge. 40 comfortably catches a city's
           worth of Fests at street zooms and lets continents separate by
           the first zoom or two. */
        clusterRadius: 40,
      });

      m.addLayer({
        id: CLUSTERS,
        type: 'symbol',
        source: SOURCE,
        filter: ['has', 'point_count'],
        layout: {
          'icon-image': 'fest-cluster',
          /* One drawing, scaled by how much it holds: full past ten, a
             notch smaller for the pairs and handfuls. */
          'icon-size': ['step', ['get', 'point_count'], 0.92, 10, 1.15],
          'icon-allow-overlap': true,
          'text-field': '{point_count_abbreviated}',
          /* The basemap's own face — the style's glyph endpoint has no
             Martian Mono, and a count is cartography, not UI chrome. */
          'text-font': ['Noto Sans Medium'],
          'text-size': 12,
          'text-allow-overlap': true,
        },
        paint: { 'text-color': colors.white },
      });

      m.addLayer({
        id: PINS,
        type: 'symbol',
        source: SOURCE,
        filter: ['!', ['has', 'point_count']],
        layout: {
          'icon-image': ['get', 'icon'],
          /* Never hidden for colliding with a neighbour — collisions are
             exactly what the clustering already resolved. */
          'icon-allow-overlap': true,
        },
      });

      /* The selected pin, raised. A second layer over the first rather
         than a state on it, because icon-image is layout, not paint, and
         layout cannot read feature-state. The filter starts matching
         nothing. */
      m.addLayer({
        id: SELECTED,
        type: 'symbol',
        source: SOURCE,
        filter: ['==', ['get', 'id'], ''],
        layout: {
          'icon-image': ['concat', ['get', 'icon'], '-sel'],
          'icon-offset': [RAISED_ANCHOR_SHIFT, RAISED_ANCHOR_SHIFT],
          'icon-allow-overlap': true,
        },
      });

      ready.current = true;

      m.on('click', CLUSTERS, async (event) => {
        const feature = event.features[0];
        /* Zoom to just past where this cluster breaks apart, centred on
           it — the standard gesture, and the whole reason a blob with a
           number on it is not a dead end. */
        const zoom = await m
          .getSource(SOURCE)
          .getClusterExpansionZoom(feature.properties.cluster_id);
        m.easeTo({ center: feature.geometry.coordinates, zoom });
      });

      m.on('click', PINS, (event) => {
        const feature = event.features[0];
        const fest = festsRef.current.find(
          (each) => each.id === feature.properties.id,
        );
        if (fest) openStrip(fest, feature.geometry.coordinates);
      });

      /* The canvas has no per-feature cursor, so the layers say it. */
      for (const layer of [CLUSTERS, PINS]) {
        m.on('mouseenter', layer, () => {
          m.getCanvas().style.cursor = 'pointer';
        });
        m.on('mouseleave', layer, () => {
          m.getCanvas().style.cursor = '';
        });
      }
    };

    /* On style.load, NOT the full 'load': sources and layers only need
       the style, and 'load' additionally waits for every visible tile —
       network the pins have no reason to wait behind. The style can also
       already be loaded by the time this runs, in which case there is no
       further style.load to wait for. */
    if (m.isStyleLoaded()) setUpFests();
    else m.once('style.load', setUpFests);

    return () => {
      ready.current = false;
      openPopup.current = null;
      m.remove();
      map.current = null;
    };
    // Mount only: everything below reads live values through refs.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* The filtered list changes on every keystroke; the source swallows the
     new set and reclusters. The map underneath is what must not be
     rebuilt. */
  useEffect(() => {
    if (!map.current || !ready.current) return;
    map.current.getSource(SOURCE).setData(festsAsGeojson(fests, today));
  }, [fests, today]);

  const originMarker = useRef(null);

  useEffect(() => {
    if (!map.current) return;

    if (originMarker.current) {
      originMarker.current.remove();
      originMarker.current = null;
    }

    if (!origin) return;

    originMarker.current = new maplibregl.Marker({
      element: originElement(),
      anchor: 'center',
    })
      .setLngLat([origin.lng, origin.lat])
      .addTo(map.current);
  }, [origin]);

  return <div ref={container} style={{ height: '100%', width: '100%' }} />;
};

export default FestsMap;
