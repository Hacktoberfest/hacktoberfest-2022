import { sortByDateAsc } from './festDate.mjs';

/* The two pins an admin can put on a Fest in FestNet, as the site reads
   them: `featured` leads the directory (components/FestsDirectory), and
   `homepagePinned` leads the homepage's six (components/NearbyFests).

   splitFeatured sets the pinned upcoming Fests apart from the rest, by
   whichever pin `key` names. Upcoming only, since the caller hands this
   the upcoming half: a pinned Fest that has run sinks with the other past
   Fests, because leading with an event nobody can go to answers no one's
   question.

   Order is the caller's. Both halves come back in the order they went in,
   and the directory sorts each the same way (by date, or by distance once
   the reader shares a location), so a pin never reorders the Fests it
   leads. Only `true` counts: an older payload with no such key, or junk,
   is simply not pinned. */
export const splitFeatured = (upcoming, key = 'featured') => {
  const featured = [];
  const rest = [];

  (Array.isArray(upcoming) ? upcoming : []).forEach((fest) => {
    (fest && fest[key] === true ? featured : rest).push(fest);
  });

  return { featured, rest };
};

/* The homepage's six: the upcoming Fests pinned to the homepage first,
   soonest first, then the soonest of the rest, `count` in all. More pinned
   than there is room for shows the soonest of the pinned, and nothing
   else. Handed the upcoming half, like splitFeatured. */
export const homepageFirst = (upcoming, count) => {
  const { featured: pinned, rest } = splitFeatured(upcoming, 'homepagePinned');
  return [...sortByDateAsc(pinned), ...sortByDateAsc(rest)].slice(0, count);
};
