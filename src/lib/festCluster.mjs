/* What a click on a cluster does. Zooming in is the standard gesture and
   the usual answer: the blob comes apart into pins and the reader lands
   among them. But two Fests at one venue, or at one geocode, or at the
   very same coordinates, never come apart at any zoom a map can reach —
   the old click zoomed to rooftop level and left one pin on top of the
   other, a dead end with a number on it. So a cluster that would only
   break past street level is shown as a list of what it holds instead.

   Street level: at zoom 16 the 16px cluster radius spans roughly thirty
   metres, a building's width. Pins that would only separate beyond that
   are as good as on the same spot, and the map has nothing more to say
   about where they are. */
export const LIST_ZOOM = 16;

export const clusterAction = (expansionZoom) =>
  expansionZoom > LIST_ZOOM ? 'list' : 'zoom';

/* The cluster's leaves name Fests by id; the directory's own list (already
   sorted the way the cards are) says which and in what order. The source
   hands leaves back in tree order, which is nothing a reader would
   recognise. */
export const festsInCluster = (leaves, fests) => {
  const ids = new Set(leaves.map((leaf) => leaf.properties.id));
  return fests.filter((fest) => ids.has(fest.id));
};
