/* Fest date rules, ported from progress-page's lib/fests.mjs and trimmed to
   what a public directory needs: no role/past grouping, just "does this sort
   and format correctly." Malformed data degrades to "sorts last" / "renders
   no date", never a crash. */

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const hasValidDate = (fest) =>
  typeof fest.date === 'string' && ISO_DATE.test(fest.date);

export const sortByDateAsc = (fests) =>
  [...fests].sort((a, b) => {
    if (!hasValidDate(a)) return 1;
    if (!hasValidDate(b)) return -1;
    return a.date < b.date ? -1 : a.date > b.date ? 1 : 0;
  });

export const formatFestDate = (isoDate) => {
  if (typeof isoDate !== 'string' || !ISO_DATE.test(isoDate)) return null;
  const month = MONTHS[Number(isoDate.slice(5, 7)) - 1];
  if (!month) return null;
  return `${month} ${Number(isoDate.slice(8, 10))}`;
};
