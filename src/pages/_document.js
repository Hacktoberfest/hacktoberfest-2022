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
