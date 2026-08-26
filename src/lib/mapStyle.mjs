import { layers, namedFlavor } from '@protomaps/basemaps';

/* The basemap's look, as a MapLibre style.

   Third attempt at the same idea, and the first one that is not a hack.
   Under Leaflet the per-format tint was a CSS filter chain over
   `.leaflet-tile-pane`; under Google it was their styles array, aimed at
   feature types. Here the basemap is vector and Protomaps hands over the
   entire palette — 72 named colours, one per map feature — so the tint is
   simply that palette, recoloured. Nothing is filtered, nothing is
   approximated, and no marker or control can be caught by it, because the
   colours are only ever the map's own.

   Protomaps' basemap also carries no POI or transit labels at all: no
   shops, no bus stops. The layer that suppressed them under Google is
   gone rather than ported, because there is nothing there to suppress. */

/* Weak on purpose, and this is the number that decides it. A map tinted at
   full strength stops being a map and becomes a coloured rectangle with
   street names on it.

   A DAMPING FACTOR, not a target: the accent's own saturation is what it
   scales. That is right for the format accents, which are saturated
   enough that a third of them still reads — but it means a muted accent
   all but disappears, so callers can raise it. See FestsMap, where the
   brand green is already desaturated and 0.35 of it is indistinguishable
   from grey. */
const TINT_STRENGTH = 0.35;

/* Protomaps hosts the label fonts and the road-shield sprites. External,
   and worth knowing about when the tiles move to Cloudflare: moving the
   tiles does not move these, and a self-hosted basemap still reaching out
   to protomaps.github.io for its glyphs is a surprise best found now. */
const GLYPHS =
  'https://protomaps.github.io/basemaps-assets/fonts/{fontstack}/{range}.pbf';
const SPRITE = 'https://protomaps.github.io/basemaps-assets/sprites/v4/light';

const SOURCE = 'protomaps';

/* Hex to HSL and back. Only needed because the tint has to preserve
   lightness exactly — see tintHex. */
export const hexToHsl = (hex) => {
  const int = parseInt(hex.slice(1), 16);
  const r = ((int >> 16) & 255) / 255;
  const g = ((int >> 8) & 255) / 255;
  const b = (int & 255) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  const d = max - min;

  if (!d) return { h: 0, s: 0, l };

  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  const h =
    max === r
      ? ((g - b) / d + (g < b ? 6 : 0)) * 60
      : max === g
        ? ((b - r) / d + 2) * 60
        : ((r - g) / d + 4) * 60;

  return { h, s, l };
};

export const hslToHex = ({ h, s, l }) => {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  const [r, g, b] = (
    h < 60
      ? [c, x, 0]
      : h < 120
        ? [x, c, 0]
        : h < 180
          ? [0, c, x]
          : h < 240
            ? [0, x, c]
            : h < 300
              ? [x, 0, c]
              : [c, 0, x]
  ).map((v) => Math.round((v + m) * 255));

  return `#${[r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('')}`;
};

/* One colour of the palette, tinted.

   The grey's LIGHTNESS is kept and only hue and saturation come from the
   accent. That is the whole trick, and it is why this reads as a map
   rather than as a wash: a basemap's legibility lives entirely in its
   luminance steps — water against land, a road against the block it runs
   through — and those steps survive untouched. The CSS filter chain this
   replaces could not make that promise, which is why its first version
   bleached the map and had to be corrected by eye. */
export const tintHex = (hex, accent, strength = TINT_STRENGTH) => {
  if (typeof accent !== 'string' || !accent) return hex;

  const { h, s } = hexToHsl(accent);
  const { l } = hexToHsl(hex);

  return hslToHex({ h, s: s * strength, l });
};

export const tintFlavor = (flavor, accent, strength = TINT_STRENGTH) =>
  Object.fromEntries(
    Object.entries(flavor).map(([name, hex]) => [
      name,
      tintHex(hex, accent, strength),
    ]),
  );

/* Greyscale is the base for every map here, tinted or not: the directory
   map holds every format at once so it has no accent to take, a past Fest
   is meant to be colourless, and a tint reads truest applied to grey
   rather than fighting Protomaps' own greens and blues. */
export const basemapStyle = ({
  source,
  accent = null,
  strength = TINT_STRENGTH,
  lang = 'en',
}) => {
  const flavor = accent
    ? tintFlavor(namedFlavor('grayscale'), accent, strength)
    : namedFlavor('grayscale');

  return {
    version: 8,
    glyphs: GLYPHS,
    sprite: SPRITE,
    sources: { [SOURCE]: source },
    layers: layers(SOURCE, flavor, { lang }),
  };
};
