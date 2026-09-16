/* "bigredhacks.com" out of "https://www.bigredhacks.com/": the way a
   website is said out loud, for the modal's Visit button. The URL parser
   does the work so a path, a port or a query never leaks into a label;
   junk is null and the button falls back to a plain verb. */
export const websiteHost = (url) => {
  if (typeof url !== 'string' || url.trim().length === 0) return null;

  try {
    const host = new URL(url).hostname.replace(/^www\./i, '');
    return host.length > 0 ? host : null;
  } catch (_) {
    return null;
  }
};
