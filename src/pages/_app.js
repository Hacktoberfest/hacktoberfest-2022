/* Square (1x1) country flags for the /fests directory cards. Global for
   the same reason leaflet.css is: third-party CSS has to enter through
   _app in the pages router. */
import 'flag-icons/css/flag-icons.min.css';
import 'leaflet/dist/leaflet.css';

import Head from 'next/head';
import { createGlobalStyle } from 'styled-components';

import { colors, fonts } from 'styles/tokens';

const GlobalStyle = createGlobalStyle`
  html {
    scroll-behavior: smooth;
    /* Sticky header height (incl. border): anchors land below it, and the
       wordmark's #top link lands at true page top. */
    scroll-padding-top: 74px;
    background: ${colors.forestDeep};

    @media (min-width: 768px) {
      scroll-padding-top: 84px;
    }
  }

  body {
    position: relative;
    margin: 0;
    color: ${colors.ink};
    background: ${colors.paper};
    font-family: ${fonts.sans};
    line-height: 1.55;
    isolation: isolate;
  }

  body::after {
    position: fixed;
    z-index: 1000;
    inset: 0;
    background-image: radial-gradient(circle, rgba(24, 37, 34, 0.6) 0 0.45px, transparent 0.65px),
      radial-gradient(circle, rgba(247, 247, 242, 0.6) 0 0.35px, transparent 0.55px);
    background-position: 0 0, 4px 5px;
    background-size: 7px 7px, 11px 11px;
    content: '';
    opacity: 0.075;
    pointer-events: none;
    mix-blend-mode: multiply;
  }

  a {
    color: inherit;
  }

  ::selection {
    color: ${colors.ink};
    background: ${colors.pink};
  }

  :focus-visible {
    outline: 3px solid ${colors.white};
    outline-offset: 2px;
    box-shadow: 0 0 0 5px ${colors.ink};
  }

  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  @media (prefers-reduced-motion: reduce) {
    html {
      scroll-behavior: auto;
    }
  }
`;

const App = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <title>Hacktoberfest</title>
      </Head>

      <GlobalStyle />

      <Component {...pageProps} />

      <mlh-universal-footer theme="light"></mlh-universal-footer>
    </>
  );
};

export default App;
