/* Secret stickers: the ones the book does not show until another sticker
   is earned. Everything particular about one (its name, its words, its
   art, the sticker that reveals it) lives in the API's database and
   reaches this site only for the person who has reached it. This file
   knows the idea of a secret and nothing about any one of them.

   GET /api/me/progress sends a secret in one of two shapes, among its
   `challenges`, flagged `secret: true`. A placeholder is the secret
   before it is earned: an id that is a position in this one response
   (`secret-1`, `secret-2`, ...), the slug of the sticker that revealed
   it, and a hint, with no name, no description and no art. An earned one
   carries its own slug, its name and description, its art as the whole
   SVG in text, and when and how it was earned. A secret the person has
   not reached is not in the payload at all.

   Pure, and no imports: lib/eligibility.mjs counts with it, so it cannot
   lean on anything that leans on that, and node --test reads it directly
   (test/secret-stickers.test.mjs). */

/* What a designer's export may open with before its root: none of it
   belongs to the drawing, and lib/shareCard.mjs inlineSticker drops the
   prolog with this same pattern. It carries no g flag, so one shared
   object is safe to use with replace. */
export const SVG_PROLOG =
  /^(\s*(<\?xml[^>]*\?>|<!DOCTYPE[^>]*>|<!--[\s\S]*?-->))+/i;

/* An earned secret's art, or null: an <svg> root with a 200-unit viewBox
   and its closing tag at the end, the shape of the site's own sticker
   files (test/sticker-image.test.mjs) and of what FestNet stores. The art
   is shown through an <img> from a data: URI and inlined into the share
   card, which needs the root and its close. An <img> draws nothing for an
   SVG that does not name its namespace, and FestNet does not insist on
   one, so it is added here when the root lacks it. The art is never put
   into the page's own DOM: an <img> runs no script and fetches nothing.
   Art that fails is dropped here, and the sticker draws the question mark
   in its place while keeping its tick and its count, so the book never
   disagrees with the API about how many stickers are earned. */
export const secretArt = (value) => {
  if (typeof value !== 'string') return null;
  const svg = value.replace(SVG_PROLOG, '').trim();
  const root = svg.match(/^<svg(?=[\s/>])[^>]*>/);
  if (!root) return null;
  if (!/\sviewBox\s*=\s*(["'])0 0 200 200\1/.test(root[0])) return null;
  if (!svg.endsWith('</svg>')) return null;
  return /\sxmlns\s*=/.test(root[0])
    ? svg
    : `<svg xmlns="http://www.w3.org/2000/svg"${svg.slice(4)}`;
};

const words = (value) =>
  typeof value === 'string' && value.trim() ? value.trim() : null;

/* The payload's secrets, in the payload's order, which is the API's own
   sort and decides the order secrets that end the same page keep
   (lib/stickerBook.mjs placeSecrets). An entry is kept only when it is
   flagged secret and its id is a string. A placeholder keeps its hint and
   nothing that could name it; an earned one keeps its words and its art,
   the art only when secretArt passes it.

   Reading its own output gives the same output, so the mocked build can
   hand its fixture's API-shaped entries to the reader the live payload
   goes through, and every reader downstream can call this again without
   asking which it was given. */
export const secretsFrom = (entries) =>
  (Array.isArray(entries) ? entries : [])
    .filter(
      (entry) => entry && entry.secret === true && typeof entry.id === 'string',
    )
    .map((entry) => {
      const completed = Boolean(entry.completed);
      return {
        id: entry.id,
        secret: true,
        completed,
        completedAt: (completed && entry.completedAt) || null,
        source: completed ? (entry.source ?? null) : null,
        revealedBy: words(entry.revealedBy),
        name: completed ? words(entry.name) : null,
        description: completed ? words(entry.description) : null,
        art: completed ? secretArt(entry.art) : null,
        hint: completed ? null : words(entry.hint),
      };
    });

/* How many secrets are earned: what lib/eligibility.mjs adds to the
   catalogue's count, as the API's completedCount counts every earned
   secret and never a placeholder. */
export const earnedSecretCount = (secrets) =>
  secretsFrom(secrets).filter((secret) => secret.completed).length;

/* The question mark a secret draws where it has no art: in the empty slot
   of a placeholder (components/Album/StickerCell), and as the picture of
   an earned secret whose art did not pass. Tabler's question mark, in its
   own 24-unit box. */
export const SECRET_MARK_PATHS = Object.freeze([
  'M8 8a3.5 3 0 0 1 3.5 -3h1a3.5 3 0 0 1 3.5 3a3 3 0 0 1 -2 3a3 4 0 0 0 -2 4',
  'M12 19l0 .01',
]);

/* The same mark as a whole sticker file, by the site's own rules for one:
   the hexagon every sticker is cut to, in paper, and the mark across half
   the square, centred, as the slot draws it across 36 of its 72 pixels, in
   the slot's rule colour. colors.paperDeep / rule */
export const SECRET_MARK_SVG = [
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">',
  '<path d="M100 0 L186.6 50 L186.6 150 L100 200 L13.4 150 L13.4 50 Z" fill="#e4e5da"/>',
  `<g transform="translate(50 50) scale(4.1667)" fill="none" stroke="#8ca59e" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">${SECRET_MARK_PATHS.map((d) => `<path d="${d}"/>`).join('')}</g>`,
  '</svg>',
].join('\n');

/* An SVG as something an <img> can show with no request, the way the
   share modal previews its card (components/ShareModal). */
export const svgDataUri = (svg) =>
  `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;

/* The SVG a share card draws for a sticker (components/ShareModal): a
   secret's own art, since no file for one exists under public/, or the
   mark where it has none; every other sticker's file, fetched by its slug
   with the fetcher given (lib/shareImage.mjs fetchStickerSvg). Only earned
   stickers are ever shared, so a placeholder never gets here. */
export const stickerSvgFor = (sticker, fetchSvg) =>
  sticker && sticker.secret
    ? Promise.resolve(sticker.art || SECRET_MARK_SVG)
    : fetchSvg(sticker.id);
