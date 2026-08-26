/* Where the basemap's tiles come from, decided in one place because it is
   about to change: MLH is standing up its own Protomaps deployment on
   Cloudflare, and this file is what that switch edits.

   Same shape as apiBase.mjs — a committed default with
   an env override — for the same reason as both: production cannot set
   environment variables, so the value a production build uses has to be
   the one written here.

   WHEN THE CLOUDFLARE DEPLOYMENT LANDS. If it serves tiles at z/x/y, only
   TILE_URL below changes and the key can go. If it serves a .pmtiles file
   instead, the source becomes

     { type: 'vector', url: 'pmtiles://https://…/basemap.pmtiles', … }

   which additionally needs the `pmtiles` package installed and its
   protocol registered with MapLibre once at startup:

     maplibregl.addProtocol('pmtiles', new Protocol().tile)

   Deliberately not installed now — an unused dependency rots, and the
   commit that switches the source is the honest place for it. */

/* Protomaps' hosted API. Commercial use is a $14/month GitHub sponsorship
   covering a soft limit of a million tile requests a month — soft in the
   real sense: going over gets MLH contacted about self-hosting rather
   than getting the maps switched off mid-October. */
const TILE_URL = 'https://api.protomaps.com/tiles/v4/{z}/{x}/{y}.mvt';

/* The hosted API stops at 15, and MapLibre has to be told: past a source's
   maxzoom it keeps drawing the last real tiles scaled up rather than
   asking for tiles that do not exist. Left unset it would ask, and get
   404s at every zoom past 15. */
export const MAX_ZOOM = 15;

/* Required by OpenStreetMap's licence and by Protomaps' terms. MapLibre
   renders it into the corner control itself. */
export const ATTRIBUTION =
  '<a href="https://protomaps.com">Protomaps</a> © <a href="https://openstreetmap.org">OpenStreetMap</a>';

/* TEMPORARY, and marked so because it is: MLH is standing up its own
   Protomaps deployment on Cloudflare, and this key exists to draw maps
   until it lands. CORS-locked rather than secret — like every key that
   ships in a client bundle, it is public the moment the page loads, and
   the restriction rather than the hiding is what protects it. */
export const LIVE_BASEMAP_KEY = 'ef3b3ad5a5afedc5';

export const resolveBasemapKey = (raw) =>
  typeof raw === 'string' && raw.trim() ? raw.trim() : LIVE_BASEMAP_KEY;

export const BASEMAP_KEY = resolveBasemapKey(
  process.env.NEXT_PUBLIC_PROTOMAPS_API_KEY,
);

/* The MapLibre source definition, or null when there is no key to build
   one with. Null is a supported state: every map checks for it and renders
   nothing, the same way each already renders nothing for a Fest with no
   coordinates. See basemapIsAvailable. */
export const basemapSource = (key = BASEMAP_KEY) => {
  if (!key) return null;

  return {
    type: 'vector',
    tiles: [`${TILE_URL}?key=${encodeURIComponent(key)}`],
    maxzoom: MAX_ZOOM,
    attribution: ATTRIBUTION,
  };
};

export const basemapIsAvailable = () => Boolean(BASEMAP_KEY);
