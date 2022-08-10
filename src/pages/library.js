import Head from 'next/Head';
import GlobalStyle, { liteTheme, darkTheme } from 'themes/themes';
import styled, { ThemeProvider } from 'styled-components';
import { useState } from 'react';
import Logo, { Globe, Bug } from 'components/logo';
import Button from 'components/button';

const Section = styled.section`
  width: 100vw;
  margin-top: 64px;

  .wrapper {
    margin: 0 auto;
    max-width: 1440px;
    padding: 0 64px;

    .wrapperJr {
      border: 1px solid ${(props) => props.theme.text};
      border-radius: 16px;
      display: flex;
      gap: 40px;
      margin: 40px 0;
      padding: 24px 24px;
    }
  }
`;

const Library = () => {
  const [theme, setTheme] = useState('dark');
  const themeToggler = () => {
    theme === 'dark' ? setTheme('lite') : setTheme('dark');
  };

  return (
    <>
      <Head>
        <title>Hacktoberfest 2022 • Components</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="description" content="CSS-Tricks sandbox." />
        <link rel="icon" href="/favicon.svg" />
      </Head>
      <ThemeProvider theme={theme === 'dark' ? darkTheme : liteTheme}>
        <GlobalStyle />
        <Section>
          <div className="wrapper">
            <h1>Components library</h1>
            <div className="wrapperJr">
              <Logo />
              <Bug />
              <Globe />
            </div>
            <div className="wrapperJr">
              <Button onClick={themeToggler}>toggle page theme</Button>
            </div>
          </div>
        </Section>
      </ThemeProvider>
    </>
  );
};

export default Library;
