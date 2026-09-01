import Document, { Head, Html, Main, NextScript } from 'next/document';
import { ServerStyleSheet } from 'styled-components';

import { bannerPrePaintScript } from '../lib/banner.mjs';

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
      <Html lang="en">
        <Head>
          {/* Retries any /_next/ asset the origin refuses to serve.

              Inline, and first, because it is the only code that still runs
              when a chunk 404s: everything else on the page is in a file
              that can be the thing that went missing.

              What it is for (Aug 21, 2026): DigitalOcean served the site
              from two origin nodes left on different builds, with no deploy
              running. Content-hashed filenames differ between builds, so an
              HTML document from one node asks for chunks that exist only on
              that node, and each of those requests independently lands on
              the wrong one about half the time. A 404 on a stylesheet costs
              the page its styles; a 404 on a page chunk costs it hydration
              entirely, and then nothing in the bundle can recover, because
              the recovery would have been in the bundle.

              A retry works because the query string makes it a URL
              Cloudflare has never seen, so it goes to the origin and draws
              a node again. Every attempt is a fresh coin toss, so the cap is
              set by how many assets a page has rather than by how unlucky
              one of them can be: at ten retries a single asset survives a
              fifty-fifty origin with probability 0.9995, and a page of a
              dozen assets loads about 99.4% of the time. At five retries
              that page figure is only 82%, which is not a fix.

              Bounded per URL, so a genuinely absent file 404s its ten times
              and stops, leaving the page exactly where it would have been
              anyway. Nothing is retried that did not announce its own
              failure. */}
          <script
            dangerouslySetInnerHTML={{
              __html: `(function () {
  var MAX = 10;
  var tries = {};
  function retry(el) {
    var isScript = el.tagName === 'SCRIPT';
    var attr = isScript ? 'src' : 'href';
    var value = el.getAttribute(attr);
    if (!value || value.indexOf('/_next/') === -1) return;
    var url = value.split('?')[0];
    tries[url] = (tries[url] || 0) + 1;
    if (tries[url] > MAX) return;
    var next = document.createElement(el.tagName);
    for (var i = 0; i < el.attributes.length; i++) {
      var a = el.attributes[i];
      if (a.name !== attr) next.setAttribute(a.name, a.value);
    }
    next.setAttribute(attr, url + '?__retry=' + tries[url] + '-' + Math.random().toString(36).slice(2, 8));
    /* Dynamically created scripts default to async, which would let a
       retried chunk run ahead of one still loading. Next's own tags are
       ordered defer; keep that. */
    if (isScript) next.async = false;
    (el.parentNode || document.head).insertBefore(next, el.nextSibling);
  }
  window.addEventListener('error', function (event) {
    var el = event.target;
    if (!el || !el.tagName) return;
    if (el.tagName === 'SCRIPT' || el.tagName === 'LINK') retry(el);
  }, true);
})();`,
            }}
          />
          {/* Marks <html> for someone who has already closed the site
              banner, before anything paints. The strip is in every page's
              server-rendered HTML — it has to be, or it would pop in and
              shove the page down a frame after load — so hiding the closed
              state is CSS's job, and CSS needs the answer before the first
              frame rather than after hydration. Inline and in the head for
              that reason; components/Banner then unmounts the strip
              outright once React is running. */}
          <script dangerouslySetInnerHTML={{ __html: bannerPrePaintScript }} />
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
