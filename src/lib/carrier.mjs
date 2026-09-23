/* Which carrier a tracking number belongs to, read from its shape.

   MLH writes one bare tracking number per package onto the event
   (custom_fields.shipstation_tracking_numbers) and nothing else: no carrier,
   no status, no date. The number's format is the only clue, and it is a
   reliable one - every value MLH had written by 2026-09-23 matched one of
   the three patterns below. A miss is a carrier we have not met yet, and
   the card must never hide a real number because we did not know its
   shape: the unknown case still gets a link, just not a carrier's own.

   Dependency-free on purpose: tests run under --experimental-strip-types
   and execute the module graph, so a module a test reaches may import
   nothing at runtime. */

const CARRIERS = [
  {
    carrier: 'UPS',
    pattern: /^1Z[0-9A-Z]{16}$/i,
    url: (number) =>
      `https://www.ups.com/track?tracknum=${encodeURIComponent(number)}`,
  },
  {
    carrier: 'USPS',
    pattern: /^9[0-9]{19,21}$/,
    url: (number) =>
      `https://tools.usps.com/go/TrackConfirmAction?tLabels=${encodeURIComponent(number)}`,
  },
  {
    carrier: 'FedEx',
    pattern: /^(?:[0-9]{12}|[0-9]{15})$/,
    url: (number) =>
      `https://www.fedex.com/fedextrack/?trknbr=${encodeURIComponent(number)}`,
  },
];

const lookUpUrl = (number) =>
  `https://www.google.com/search?q=${encodeURIComponent(number)}`;

export const carrierFor = (number) => {
  const trimmed = typeof number === 'string' ? number.trim() : '';
  const match = CARRIERS.find(({ pattern }) => pattern.test(trimmed));

  if (match) return { carrier: match.carrier, url: match.url(trimmed) };

  return { carrier: null, url: lookUpUrl(trimmed) };
};
