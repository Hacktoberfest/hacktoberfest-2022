import Head from 'next/Head';
import { useState } from 'react';
import { ThemeProvider } from 'styled-components';
import GlobalStyle, { liteTheme, darkTheme } from 'themes/themes';

const Home = () => {
  const [theme, setTheme] = useState('light');
  const themeToggler = () => {
    theme === 'light' ? setTheme('dark') : setTheme('light');
  };

  return (
    <>
      <Head>
        <title>Hacktoberfest 2022</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="description" content="CSS-Tricks sandbox." />
        <link rel="icon" href="/favicon.svg" />
      </Head>
      <ThemeProvider theme={theme === 'light' ? liteTheme : darkTheme}>
        <GlobalStyle />
        <h1>test</h1>
      </ThemeProvider>
    </>
  );
};

export default Home;
