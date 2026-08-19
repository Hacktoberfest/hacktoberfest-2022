/* The greeting's name: just the first word. Empty on junk so the caller
   can fall back to a generic greeting rather than rendering "Hi ,". */
export const firstName = (name) => {
  if (typeof name !== 'string') return '';
  const words = name.trim().split(/\s+/).filter(Boolean);
  return words.length === 0 ? '' : words[0];
};

/* Fallback for when the MyMLH avatar is missing or fails to load. A broken
   image in a profile card looks worse than no image at all. */
export const initials = (name) => {
  if (typeof name !== 'string') return '';
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return '';
  if (words.length === 1) return words[0][0].toUpperCase();
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
};
