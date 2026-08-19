/* Haversine distance in km. Pure, no I/O — the browser's Geolocation API is
   the only thing that ever touches a device; everything downstream of the
   coordinates it returns is plain math, so no reverse-geocoding service is
   needed to answer "how far is this Fest from me." */

const EARTH_RADIUS_KM = 6371;

const toRadians = (degrees) => (degrees * Math.PI) / 180;

export const distanceKm = (a, b) => {
  if (typeof b.lat !== 'number' || typeof b.lng !== 'number') return null;

  const dLat = toRadians(b.lat - a.lat);
  const dLng = toRadians(b.lng - a.lng);
  const lat1 = toRadians(a.lat);
  const lat2 = toRadians(b.lat);

  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;

  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(h));
};

export const sortByDistance = (fests, origin) =>
  [...fests].sort((a, b) => {
    const distA = distanceKm(origin, a);
    const distB = distanceKm(origin, b);
    if (distA === null) return 1;
    if (distB === null) return -1;
    return distA - distB;
  });
