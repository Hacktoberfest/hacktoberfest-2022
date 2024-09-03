import { Space_Grotesk } from 'next/font/google';
import { createGlobalStyle } from 'styled-components';

const SpaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  fallback: ['sans-serif'],
  adjustFontFallback: false,
});

export const mainTheme = {
  colors: {
    darkGreen: '#183717',
    green: '#50DA4C',
    lightGreen: '#D8FFD8',
    paleGreen: '#ADEDAD',
    pink: '#FF8BFF',
    deepPink: '#A600A0',
    lightPink: '#FFDBFF',
    black: '#1C1C1C',
    light: '#FEFDF8',
    cream: '#F3F0E0',
    typography: '#F3F0E0',
    error: '#EC4237',
    success: '#B4FF39',
  },
};

const GlobalStyle = createGlobalStyle`
  *,
  html,
  body {
    box-sizing: border-box;
    font-family: ${SpaceGrotesk.style.fontFamily}, sans-serif;
    margin: 0;
    padding: 0;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    scroll-behavior: smooth;
  }

  body {
    background: ${({ theme }) => theme.colors.cream};
    color: ${({ theme }) => theme.colors.dark};
  }

  ::selection {
    background: #b4ff39;
    color: #170f1e;
  }

  a {
    color: inherit;
    width: max-content;
    text-decoration: underline;
    transition: color 0.2s ease;

    &:hover,
    &:focus-visible {
      text-decoration: none;
    }
  }

  ul {
    list-style: none outside none;
  }

  li {
    margin: 0;
  }

  button {
    background: transparent;
    border: 0;
    cursor: pointer;
    outline: none;
    font-size: 16px;
    line-height: 24px;
  }

  h1, h2, h3, h4, h5, h6, p, label {
    word-wrap: break-word;
  }

  h1 {
    font-size: 144px;
    line-height: 100%;
  }

  h2 {
    font-size: 88px;
    line-height: 96px;
  }

  h3 {
    font-size: 72px;
    line-height: 72px;
  }

  h4 {
    font-size: 32px;
    line-height: 40px;
  }

  h5 {
    font-size: 20px;
    font-weight: 500;
    line-height: 28px;
  }

  h6 {
    font-size: 14px;
    font-weight: 500;
    line-height: 20px;
  }

  p {
    font-size: 16px;
    font-weight: 400;
    line-height: 26px;
  }

  @media (max-width: 600px) {
    h1 {
      font-size: 88px;
      line-height: 96px;
    }

    h2 {
      font-size: 72px;
      line-height: 72px;
    }

    h3 {
      font-size: 32px;
      line-height: 40px;
    }

    h4 {
      font-size: 20px;
      line-height: 28px;
    }
  }

  .sr-only {
    border: 0;
    clip: rect(0 0 0 0);
    clip-path: inset(50%);
    height: 1px;
    margin: -1px;
    overflow: hidden;
    padding: 0;
    position: absolute;
    white-space: nowrap;
    width: 1px;
  }
`;

export default GlobalStyle;
