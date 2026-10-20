import Document, { Head, Html, Main, NextScript } from 'next/document';
import { ServerStyleSheet } from 'styled-components';

import { TODAY_STRIP } from '../data/todayStrip.mjs';
import { assetHoldStyle, assetRetryScript } from '../lib/assetRetry.mjs';
import { bannerPrePaintScript } from '../lib/banner.mjs';
import { API_BASE_URL } from '../lib/session.mjs';
import {
  TODAY_STRIP_OFF_ATTRIBUTE,
  todayStripPrePaintScript,
} from '../lib/todayStrip.mjs';

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const styledComponentsSheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage;

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) =>
            styledComponentsSheet.collectStyles(<App {...props} />),
        });
      const initialProps = await Document.getInitialProps(ctx);
      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {styledComponentsSheet.getStyleElement()}
          </>
        ),
      };
    } finally {
      styledComponentsSheet.seal();
    }
  }

  render() {
    return (
      /* With the strip switched off, <html> says so from the start, the way
         the pre-paint script says it on a day outside October, so what
         measures the page's top before paint (the homepage hero's
         --hero-guess) counts no strip. */
      <Html
        lang="en"
        {...(TODAY_STRIP ? {} : { [TODAY_STRIP_OFF_ATTRIBUTE]: 'true' })}
      >
        <Head>
          {/* Retries any /_next/ asset the origin refuses to serve, and
              holds the page behind the /my loader's squares while a
              stylesheet is being retried, so it never paints unstyled. The
              why of both is in lib/assetRetry.mjs.

              Inline, and first, because it is the only code that still runs
              when a chunk 404s: everything else on the page is in a file
              that can be the thing that went missing. The hold's style is
              inline for the same reason. */}
          <script dangerouslySetInnerHTML={{ __html: assetRetryScript }} />
          <style dangerouslySetInnerHTML={{ __html: assetHoldStyle }} />
          {/* Marks <html> for someone who has already closed the site
              banner, before anything paints. The strip is in every page's
              server-rendered HTML — it has to be, or it would pop in and
              shove the page down a frame after load — so hiding the closed
              state is CSS's job, and CSS needs the answer before the first
              frame rather than after hydration. Inline and in the head for
              that reason; components/Banner then unmounts the strip
              outright once React is running. */}
          <script dangerouslySetInnerHTML={{ __html: bannerPrePaintScript }} />
          {/* The same move for the Today strip, which every page's HTML
              carries but only October shows: on any other day this marks
              <html> and the strip's stylesheet hides it before first
              paint, where waiting for React would flash a band and then
              pull the page up 52px. The mocked build honours ?now= here
              too, so a preview is judged by the day it is previewing. */}
          {TODAY_STRIP && (
            <script
              dangerouslySetInnerHTML={{
                __html: todayStripPrePaintScript(!API_BASE_URL),
              }}
            />
          )}
          <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/favicon-32.png"
          />
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/apple-touch-icon.png"
          />
          {/* Both font hosts are preconnected: googleapis.com serves the
              stylesheet, gstatic.com the font files. The gstatic hint needs
              crossOrigin because fonts are fetched anonymously — without it
              the warmed connection can't be reused. */}
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="anonymous"
          />
          {/* One request for all three families: three separate stylesheets
              were three render-blocking round trips. */}
          <link
            href="https://fonts.googleapis.com/css2?family=Barlow+Semi+Condensed:wght@700;800&family=Inter:wght@400;700;800&family=Martian+Mono:wght@400..800&display=swap"
            rel="stylesheet"
          />
        </Head>
        <body>
          {/* Dev only, and gone from the export. `next dev` (pages router)
              hides the page behind `<style data-next-hide-fouc>` and awaits a
              requestAnimationFrame before it will call hydrateRoot — see
              displayContent() in next/dist/client/dev/fouc.js. A tab that
              never paints (headless preview panes, background tabs) never
              fires rAF, so hydration silently never starts and any page that
              depends on an effect — /my — sits on its loading state forever.
              The static export has no such gate, which is why `npm start`
              never showed this.

              Until that gate has resolved, race every rAF against a short
              timeout so the callback runs even without a frame; the wrapper
              uninstalls itself the moment the fouc styles are gone. */}
          {process.env.NODE_ENV === 'development' && (
            <script
              dangerouslySetInnerHTML={{
                __html: `(function () {
  var nativeRaf = window.requestAnimationFrame.bind(window);
  var nativeCancel = window.cancelAnimationFrame.bind(window);
  var cancels = {};
  var installed = true;
  function maybeUninstall() {
    if (installed && !document.querySelector('[data-next-hide-fouc]')) {
      installed = false;
      window.requestAnimationFrame = nativeRaf;
      window.cancelAnimationFrame = nativeCancel;
    }
  }
  window.requestAnimationFrame = function (callback) {
    var settled = false;
    var rafId;
    var timerId;
    function run(timestamp) {
      if (settled) return;
      settled = true;
      clearTimeout(timerId);
      delete cancels[rafId];
      callback(timestamp);
      maybeUninstall();
    }
    rafId = nativeRaf(run);
    timerId = setTimeout(function () {
      run(performance.now());
    }, 150);
    cancels[rafId] = function () {
      settled = true;
      clearTimeout(timerId);
    };
    return rafId;
  };
  window.cancelAnimationFrame = function (id) {
    if (cancels[id]) {
      cancels[id]();
      delete cancels[id];
    }
    nativeCancel(id);
  };
})();`,
              }}
            />
          )}
          <Main />
          <NextScript />
          <script
            async
            src="https://static.mlh.io/lib/mlh-universal-nav.js/mlh-universal-nav.min.js"
          ></script>
        </body>
      </Html>
    );
  }
}

export default MyDocument;
