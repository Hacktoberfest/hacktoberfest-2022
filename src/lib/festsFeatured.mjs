/* The directory's Featured group (components/FestsDirectory): the upcoming
   Fests an admin has pinned in FestNet, set apart from the rest. Upcoming
   only, since the caller hands this the upcoming half: a pinned Fest that
   has run sinks with the other past Fests, because leading the page with
   an event nobody can go to answers no one's question.

   Order is the caller's. Both halves come back in the order they went in,
   and the directory sorts each the same way (by date, or by distance once
   the reader shares a location), so a pin never reorders the Fests it
   leads. Only `featured === true` counts: an older payload with no such
   key, or junk, is simply not featured. */
export const splitFeatured = (upcoming) => {
  const featured = [];
  const rest = [];

  (Array.isArray(upcoming) ? upcoming : []).forEach((fest) => {
    (fest && fest.featured === true ? featured : rest).push(fest);
  });

  return { featured, rest };
};
