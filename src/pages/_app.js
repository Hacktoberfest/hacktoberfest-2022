import '../styles/globals.css';
import Head from 'next/head';
import { Theme } from 'components/theme';
import GlobalStyle from 'themes/themes';

const App = ({ Component, pageProps }) => (
    <>
        <Head>
            <title>Hacktoberfest 2022</title>
            <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            <meta name="description" content="Hacktoberfest 2022" />
            <link rel="icon" href="/favicon.svg" />
        </Head>
        <Theme>
            <GlobalStyle />
            <Component {...pageProps} />
        </Theme>
    </>
);

export default App;
