import '../styles/globals.css';

import Head from 'next/head';

import { Theme } from 'components/theme';
import Navigation from 'components/navigation';
import Footer from 'components/footer';
import { useEffect } from 'react';

import GlobalStyle from 'themes/themes';

import { sammy } from 'lib/sammy';

import opengraph from 'assets/img/opengraph.png';
import favicon from 'assets/img/favicon.svg';

const BASE_URL = (process.env.BASE_URL || '').replace(/\/*$/, '');

const App = ({ Component, pageProps }) => {
  useEffect(() => {
    console.log(`%c${sammy}`, "font-family:'JetBrains Mono', monospace;");
  }, []);

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />

        <title>Hacktoberfest 2022</title>
        <meta name="description" key="description" content="Hacktoberfest: a month-long celebration of open-source projects, their maintainers, and the entire community of contributors." />
        <link rel="icon" href={favicon.src} type="image/svg+xml" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@hacktoberfest" />
        <meta name="twitter:title" key="twitterTitle" content="Hacktoberfest 2022" />
        <meta name="twitter:description" key="twitterDesc" content="Hacktoberfest: a month-long celebration of open-source projects, their maintainers, and the entire community of contributors." />
        <meta name="twitter:image" content={`${BASE_URL}${opengraph.src}`} />

        <meta property="og:url" content={BASE_URL} />
        <meta property="og:type" content="website" />
        <meta property="og:title" key="opengraphTitle" content="Hacktoberfest 2022" />
        <meta property="og:description" key="opengraphDesc" content="Hacktoberfest: a month-long celebration of open-source projects, their maintainers, and the entire community of contributors." />
        <meta property="og:image" content={`${BASE_URL}${opengraph.src}`} />

        <noscript dangerouslySetInnerHTML={{ __html: `<!--\n${sammy}\n-->` }} />
      </Head>
      <Theme>
        <GlobalStyle />
        <Navigation />

        <Component {...pageProps} />

        <Footer />
      </Theme>
    </>
  );
};

export default App;
