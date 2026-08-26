/* The /fests directory's state as an address: what the search box holds and
   which of the two views is showing, so a filtered directory is a link
   someone can send.

   Pure, and taking pathname and search rather than reading `location`, for
   the reason every other lib here is: this is the part of the URL wiring
   worth pinning in a test, and the rest of that wiring — when to push a
   history entry versus replace one — cannot be tested without a DOM.

   What is deliberately NOT here: coordinates. Where someone is standing is
   not ours to put in a link they might paste, and a "near me" URL would
   mean something different for whoever opened it. Granting location is a
   thing you do on the page, not a thing the page remembers for you. */

export const QUERY_PARAM = 'q';
export const VIEW_PARAM = 'view';
export const FEST_PARAM = 'fest';
export const FORMAT_PARAM = 'format';

export const festsDirectoryUrl = ({
  pathname,
  search,
  query,
  view,
  fest,
  format,
}) => {
  /* Built from the search that is already there, so params this page does
     not own survive: campaign tags arrive on exactly the links most worth
     measuring, and dropping them on the first keystroke would lose the
     attribution for the visit. */
  const params = new URLSearchParams(search);

  /* An empty query and the list view are the defaults, spelled by their
     absence — the shortest URL that reproduces what you are looking at is
     the one worth pasting. */
  if (query) params.set(QUERY_PARAM, query);
  else params.delete(QUERY_PARAM);

  if (view === 'map') params.set(VIEW_PARAM, view);
  else params.delete(VIEW_PARAM);

  /* The format filter. 'all' is the default and drops out, same rule as
     the rest: absence spells the default. */
  if (format === 'hackDay' || format === 'meetUp')
    params.set(FORMAT_PARAM, format);
  else params.delete(FORMAT_PARAM);

  /* The open detail modal. No open modal is the default and drops out, the
     same as the other two. */
  if (fest) params.set(FEST_PARAM, fest);
  else params.delete(FEST_PARAM);

  const next = params.toString();
  return `${pathname}${next ? `?${next}` : ''}`;
};
