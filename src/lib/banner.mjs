/* The site banner's dismissal, shared by the three places that touch it:
   the component that renders the strip, the click handler that writes the
   flag, and the inline script in _document that reads it before first
   paint.

   Dismissal is per-browser rather than per-page-view because this is a
   static export: every nav link is a full document load, so a banner that
   forgot on navigation would be a close button that does nothing the
   moment you go anywhere.

   The pre-paint attribute is what keeps the closed state from flashing.
   The strip is in the server-rendered HTML of every page — it has to be,
   or it would pop in and shove the page down on every load — so the
   script sets the attribute on <html> before anything paints, CSS hides
   it, and the component's mount effect then takes it out of the DOM
   entirely so a closed banner is not left behind for the keyboard and
   the screen reader to find. */
export const BANNER_STORAGE_KEY = 'hacktoberfest-banner-preptember';
export const BANNER_DISMISSED_VALUE = 'dismissed';
export const BANNER_DISMISSED_ATTRIBUTE = 'data-banner-dismissed';

/* Safari in private mode throws on storage access rather than returning
   null, and the getters can throw on their own, so every touch is wrapped
   — the same treatment lib/session.mjs gives the session. A browser that
   will not give us storage simply gets the banner back next load, which
   is the harmless end of the two failure modes. */
export const bannerDismissed = () => {
  try {
    return (
      globalThis.localStorage?.getItem(BANNER_STORAGE_KEY) ===
      BANNER_DISMISSED_VALUE
    );
  } catch (_) {
    return false;
  }
};

export const dismissBanner = () => {
  try {
    globalThis.localStorage?.setItem(
      BANNER_STORAGE_KEY,
      BANNER_DISMISSED_VALUE,
    );
  } catch (_) {
    // A browser that refuses storage still gets the close click itself.
  }
};

/* The body of the inline <script> in _document, built from the same
   constants the component uses so the two can never drift apart. */
export const bannerPrePaintScript = `(function () {
  try {
    if (window.localStorage.getItem(${JSON.stringify(BANNER_STORAGE_KEY)}) === ${JSON.stringify(BANNER_DISMISSED_VALUE)}) {
      document.documentElement.setAttribute(${JSON.stringify(BANNER_DISMISSED_ATTRIBUTE)}, 'true');
    }
  } catch (_) {}
})();`;
