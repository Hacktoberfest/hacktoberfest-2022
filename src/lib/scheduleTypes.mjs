/* An event type's colour and label.

   The taxonomy is authored in FestNet and is not settled, so this module is
   built around the assumption that it will meet a slug it has never seen. A
   known slug gets an explicitly chosen palette colour and a hand-written
   label; anything else is hashed deterministically onto the same palette and
   labelled from its own slug. Adding a type in FestNet therefore needs no
   frontend deploy, and no event can ever render unstyled or unlabelled.

   Colour is never the only carrier of meaning here — every bar and card also
   prints `label` as text — so the calendar stays readable without colour
   vision. The palette is the site's own (styles/tokens.js) rather than
   anything new: a schedule that introduced five fresh hues would not look
   like the rest of Hacktoberfest.

   .mjs, and importing tokens by value rather than through the styled-
   components theme, so the build scripts and the Node test runner can both
   load it. */

const INK = '#10201d';
const WHITE = '#f7f7f2';

/* Ordered, because the fallback hash indexes into it: appending is safe, but
   reordering or removing an entry re-colours every unknown type that landed on
   the moved slot. */
/* Each surface is paired with the deep partner it casts and the pale one it
   tints to — the dark end for shadows, the light end for badges, which is how
   /fests uses maroon and orangeLight for the same Fest format.

   orangeLight, skyLight and pinkLight are the site's own; the ochre and forest
   tints are new, mixed to sit at the same lightness as those three, because
   styles/tokens.js has no light end for either hue. They are the only two
   colours on this page that are not already in the palette.

   Each surface is paired with the deep partner it casts. A shadow the same
   value as its surface does not read as depth — which is why --fest-accent on
   /fests is maroon and skyDeep rather than orange and sky. The pairings below
   are free to change; what must hold is that the shadow is always the darker
   of the two, and schedule-types.test.mjs measures exactly that rather than
   pinning the pairs. */
const PALETTE = [
  { color: '#e53927', onColor: WHITE, shadow: '#b8301f', tint: '#f9c9c2' }, // orange
  { color: '#8bb2de', onColor: INK, shadow: '#1f4e6b', tint: '#d7e5f4' }, // sky
  { color: '#f5b726', onColor: INK, shadow: '#8a5d13', tint: '#fbe7bb' }, // ochre
  { color: '#e97b77', onColor: INK, shadow: '#671912', tint: '#f6c4c1' }, // pink
  { color: '#3d5f58', onColor: WHITE, shadow: '#2e4742', tint: '#cfdad7' }, // forest
  { color: '#1f4e6b', onColor: WHITE, shadow: INK, tint: '#d7e5f4' }, // skyDeep
  { color: '#671912', onColor: WHITE, shadow: INK, tint: '#f9c9c2' }, // maroon
  { color: '#b8301f', onColor: WHITE, shadow: '#671912', tint: '#f6c4c1' }, // orangeDeep
  { color: '#8a5d13', onColor: WHITE, shadow: INK, tint: '#fbe7bb' }, // ochreDeep
  { color: '#2e4742', onColor: WHITE, shadow: INK, tint: '#cfdad7' }, // forestDeep
  { color: '#284b44', onColor: WHITE, shadow: INK, tint: '#e4e5da' }, // inkSoft
];

/* The taxonomy, which is three things and not the five this once guessed at.
   A workshop, a ceremony and a showcase are all livestreams; what separates
   the three below is not subject matter but what you do with them.

   `event` is the forest green, and because a feature's header, tint and shadow
   are all drawn from its type, that is what colours the whole Global Hack Week
   container rather than the orange it was hardcoded to. */
const KNOWN = {
  livestream: { label: 'Livestream', slot: 1 }, // sky
  /* inkSoft, not the ochre it launched with: DEV's own branding is black on
     white, the round card is already the neutral white ticket, and an ink
     shadow makes the challenge the month's monochrome counterweight to the
     coloured streams. The ochre returns to the fallback pool. */
  challenge: { label: 'Challenge', slot: 10 }, // inkSoft
  event: { label: 'Event', slot: 4 }, // forest
};

export const KNOWN_SCHEDULE_TYPES = Object.keys(KNOWN);

/* 'office-hours' -> 'Office Hours'. Hyphens and underscores both separate
   words, since a slug's shape is FestNet's choice rather than ours. */
const labelFromSlug = (slug) =>
  slug
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

/* djb2, which is small, stable and has no dependencies. It only has to spread
   slugs across seven slots and give the same answer every time — the same slug
   must colour identically across reloads, across readers, and in a screenshot
   attached to a bug report. */
const hash = (value) => {
  let h = 5381;
  for (let i = 0; i < value.length; i += 1) {
    h = ((h << 5) + h + value.charCodeAt(i)) >>> 0;
  }
  return h;
};

/* Unknown types are pushed past the slots the known types already hold, so a
   new FestNet type is very unlikely to arrive wearing Global Hack Week's
   orange. It is not impossible — there are more possible slugs than colours —
   which is exactly why the label always renders alongside. */
const FALLBACK_SLOTS = PALETTE.map((_, index) => index).filter(
  (index) => !Object.values(KNOWN).some((type) => type.slot === index),
);

const UNTYPED = {
  id: null,
  label: 'Event',
  known: false,
  ...PALETTE[PALETTE.length - 1],
};

export const scheduleType = (slug) => {
  if (typeof slug !== 'string' || !slug.trim()) return UNTYPED;

  const id = slug.trim();
  const known = KNOWN[id];

  if (known) {
    return { id, label: known.label, known: true, ...PALETTE[known.slot] };
  }

  const slot = FALLBACK_SLOTS[hash(id) % FALLBACK_SLOTS.length];

  return { id, label: labelFromSlug(id), known: false, ...PALETTE[slot] };
};
