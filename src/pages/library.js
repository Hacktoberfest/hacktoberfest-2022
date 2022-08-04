import Head from 'next/Head';
import GlobalStyle, { liteTheme, darkTheme } from 'themes/themes';
import styled, { ThemeProvider } from 'styled-components';
import { useState } from 'react';
import Logo from 'components/logo';

const Section = styled.section`
  width: 100vw;

  .wrapper {
    margin: 0 auto;
    padding: 0 64px;
    max-width: 1440px;

    .wrapperJr {
      // background: gray;
      margin: 40px 0;
      padding: 24px 0;
    }
  }
`;

const Library = () => {
  const [theme, setTheme] = useState('light');
  const themeToggler = () => {
    theme === 'light' ? setTheme('dark') : setTheme('light');
  };

  return (
    <>
      <Head>
        <title>Hacktoberfest 2022 • Components</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="description" content="CSS-Tricks sandbox." />
        <link rel="icon" href="/favicon.svg" />
      </Head>
      <ThemeProvider theme={theme === 'light' ? liteTheme : darkTheme}>
        <GlobalStyle />
        <button onClick={themeToggler}>toggle theme</button>
        <Section>
          <div className="wrapper">
            <div className="wrapperJr">
              <h1>Components</h1>
            </div>
            <div className="wrapperJr">
              <Logo />
            </div>
          </div>
        </Section>
      </ThemeProvider>
    </>
  );
};

export default Library;
