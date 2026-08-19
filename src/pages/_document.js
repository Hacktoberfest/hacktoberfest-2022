import Document, { Head, Html, Main, NextScript } from 'next/document';
import { ServerStyleSheet } from 'styled-components';

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
