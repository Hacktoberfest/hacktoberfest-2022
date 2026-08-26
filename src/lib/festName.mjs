/* A Fest's name splits into the Fest and whoever is hosting it.

     Hacktoberfest Meet Up Toronto x Hack the 6ix
     └──────── title ───────────┘   └─ hostedBy ┘

   MLH names Fests this way, so the partner arrives welded to the event
   name and the card would otherwise carry both in one heading. Splitting
   here rather than in the card keeps the API's naming convention where
   every other bit of its shape stops: in the data seam.

   The separator has to be a standalone word or the split would fire inside
   ordinary names — "Xochimilco" and "Essex" both carry an x, and neither
   is hosting anything. Lower and upper case both appear in the wild, and
   the multiplication sign gets in because a partnership written by a
   designer often uses it.

   First separator only. The title is the part carrying the format and the
   city; everything after the first "x" belongs to whoever is hosting,
   including a partner whose own name has another one in it. */
const SEPARATOR = /\s+[x×]\s+/i;

const clean = (value) => {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
};

export const splitFestName = (name) => {
  if (typeof name !== 'string' || name.trim().length === 0) {
    return { title: null, hostedBy: null };
  }

  const match = SEPARATOR.exec(name);
  if (!match) return { title: clean(name), hostedBy: null };

  return {
    title: clean(name.slice(0, match.index)),
    hostedBy: clean(name.slice(match.index + match[0].length)),
  };
};

/* The card's heading. Cards led with "Hacktoberfest" on every one of them,
   on hacktoberfest.com, on the Find a Fest page — and then repeated the
   format that the badge directly above already carried. Of four words in
   "Hacktoberfest Hack Day Brooklyn", one told you which Fest it was.

   So the front of the name comes off and the rest becomes the heading.
   Only the front: a name that merely mentions Hacktoberfest somewhere else
   is a name of its own, and cutting from the middle would mangle it.

   The full name is not lost. It stays on the Fest and the modal shows it,
   because that is MLH's name for the event and the one on its registration
   page. This is a display shortening, which is why it lives here and is
   called at render rather than baked into the data seam.

   If stripping would leave nothing, the name was only the parts being
   stripped, and the whole name beats an empty heading. */
const LEADING_SITE = /^hacktober\s?fest\b/i;
const LEADING_FORMAT = /^(hack\s*-?\s*day|meet\s*-?\s*up)\b/i;
/* Whatever a host put between the parts: spaces, a colon, a dash. */
const JOINER = /^[\s:–—-]+/;

export const shortFestName = (name) => {
  if (typeof name !== 'string' || name.trim().length === 0) return null;

  let rest = name.trim();
  rest = rest.replace(LEADING_SITE, '').replace(JOINER, '');
  rest = rest.replace(LEADING_FORMAT, '').replace(JOINER, '');

  return rest.trim().length > 0 ? rest.trim() : name.trim();
};
