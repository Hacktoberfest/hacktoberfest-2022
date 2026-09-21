/* The designed stickers: one entry per slug the site knows (lib/stickerImage.mjs),
   naming the icon file in ./icons (a Tabler filled icon, or a partner mark
   in its own box, drawn white like the icons),
   the ground, and how the foot reads. Three kinds:

   - `tier`: a run within a set, one to five, ordinal (livestreams-1/3/5 are
     tiers 1, 2, 3). The foot carries that many pips.
   - `week`: a weekly set (the DEV challenges). The foot carries the week's
     number in Martian Mono, 1 to 4.
   - `foot`: a glyph on the foot instead of a number, named like an icon:
     launch weekend's rocket.
   - `inset`: a second icon drawn in ink inside the first, centred `at` a
     point on the 24 grid at `size` grid units: the bolt on GHW's TV.
   - `tag`: a second icon on a round ink disc at the badge's lower right
     corner, the badge drawn smaller to make room: DEV connect's link.
   - neither: a single. No foot, the icon centred.

   A slug missing here has no design yet and keeps its placeholder
   (scripts/stickers/render.mjs). Grounds are the type colours the album
   draws with (Album.module.css): DEV wears ochre so the black-and-white
   DEV mark has something to sit on, and tools wears maroon rather than
   the rule grey it launched with. */
export const GROUNDS = Object.freeze({
  required: '#3d5f58',
  dev: '#f5b726',
  livestreams: '#8bb2de',
  ghw: '#e53927',
  tools: '#671912',
  inperson: '#e97b77',
  /* The milestones are not a page of the book; the rewards band draws
     them, and they wear gradients of palette tokens rather than a flat
     colour, a ladder that cools as the milestones climb: warm for the
     pack, holo for the completed book, cool for the completionist.
     colors.ochre / orange; ochre / pink / sky; sky / forest / ink */
  pack: ['#f5b726', '#e53927'],
  complete: ['#f5b726', '#e97b77', '#8bb2de'],
  completionist: ['#8bb2de', '#3d5f58', '#10201d'],
});

export const CATALOGUE = Object.freeze([
  { slug: 'signin', icon: 'key', ground: 'required' },
  { slug: 'address', icon: 'home', ground: 'required' },
  { slug: 'livestreams-1', icon: 'device-tv', ground: 'livestreams', tier: 1 },
  { slug: 'livestreams-3', icon: 'device-tv', ground: 'livestreams', tier: 2 },
  { slug: 'livestreams-5', icon: 'device-tv', ground: 'livestreams', tier: 3 },
  { slug: 'ghw-points-5', icon: 'bolt', ground: 'ghw', tier: 1 },
  { slug: 'ghw-points-10', icon: 'bolt', ground: 'ghw', tier: 2 },
  { slug: 'ghw-points-20', icon: 'bolt', ground: 'ghw', tier: 3 },
  { slug: 'livestream-launch', icon: 'rocket', ground: 'livestreams' },
  { slug: 'discord', icon: 'brand-discord', ground: 'tools' },
  { slug: 'dev-relay', icon: 'devrelay', ground: 'tools' },
  { slug: 'dev-connect', icon: 'dev-badge', ground: 'dev', tag: 'link' },
  { slug: 'milestone-pack', icon: 'mail-opened', ground: 'pack' },
  { slug: 'milestone-complete', icon: 'hexagon', ground: 'complete' },
  { slug: 'milestone-completionist', icon: 'crown', ground: 'completionist' },
  { slug: 'ghw', icon: 'square-rounded-check', ground: 'ghw' },
  {
    slug: 'ghw-livestream',
    icon: 'device-tv',
    ground: 'ghw',
    inset: { icon: 'bolt', at: [12, 13.6], size: 9 },
  },
  { slug: 'fest', icon: 'map-pin', ground: 'inperson' },
  { slug: 'host-fest', icon: 'star', ground: 'inperson' },
  { slug: 'digitalocean', icon: 'digitalocean', ground: 'tools' },
  {
    slug: 'dev-launch-weekend',
    icon: 'dev-badge',
    ground: 'dev',
    foot: 'rocket',
  },
  { slug: 'dev-week-1', icon: 'dev-badge', ground: 'dev', week: '1' },
  { slug: 'dev-week-2', icon: 'dev-badge', ground: 'dev', week: '2' },
  { slug: 'dev-week-3', icon: 'dev-badge', ground: 'dev', week: '3' },
  { slug: 'dev-week-4', icon: 'dev-badge', ground: 'dev', week: '4' },
]);
