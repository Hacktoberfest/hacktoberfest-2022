/* The pure half of the progress strip (components/ProgressStrip): one slot
   per catalogue entry, in catalogue order, so /activities/ and /my draw the
   same four stickers whatever the API sent. Takes the merged list
   (lib/eligibility.mjs mergeActivities output) and never reorders it.

   Relative import, matching every other file in lib/: Node resolves this
   file directly and never sees jsconfig's baseUrl alias. */
import { ACTIVITIES } from '../data/eligibility.mjs';

export const stripSlots = (activities) => {
  const merged = Array.isArray(activities) ? activities : [];
  const byId = new Map(merged.map((activity) => [activity.id, activity]));
  return ACTIVITIES.map((activity) => {
    const entry = byId.get(activity.id);
    return {
      id: activity.id,
      label: activity.label,
      type: activity.type,
      earned: Boolean(entry && entry.completed),
    };
  });
};
