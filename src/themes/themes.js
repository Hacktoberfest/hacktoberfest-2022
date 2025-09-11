import { Atkinson_Hyperlegible } from 'next/font/google';
import { createGlobalStyle } from 'styled-components';
import bgGrain from 'assets/img/bg-grain.png';

const AtkinsonHyperlegible = Atkinson_Hyperlegible({
  subsets: ['latin'],
  display: 'swap',
  fallback: ['sans-serif'],
  adjustFontFallback: false,
  weight: ['400', '700'],
});

export const mainTheme = {
  colors2025: {
    void: '#1C1C3F',
    space: {
      white: '#FFFFFF',
      gray: '#F2F4F7',
      dust: '#D0CCE3',
      haze: '#5E577C',
    },
    melrose: '#C2C2FF',
    lavendar: '#A0A0FF',
    blueViolet: '#5A5AB5',
    eastBay: '#403F7D',
    typography: '#D0CCE3',
    error: '#FF4C6C',
    success: '#B4FF39',
    dragonfruit: '#B458FC',
    orange: '#FF720E',
    lake1: '#4ABEFF',
    green2: '#00C483',
  },
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
  html,
  body {
    box-sizing: border-box;
    font-family: ${AtkinsonHyperlegible.style.fontFamily}, sans-serif;
    margin: 0;
    padding: 0;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    scroll-behavior: smooth;
  }

  body {
    position: relative;
    background-color: ${({ theme }) => theme.colors2025.void};
    color: ${({ theme }) => theme.colors2025.space.dust};
    overflow-x: hidden;
    
    > div {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      min-height: 100vh;
    }
  }

  body::before {
    content: '';
    position: absolute;
    height: 100%;
    width: 100%;
    background-image: url(${bgGrain.src});
    background-size: 200px 200px;
    opacity: .18;
    pointer-events: none;
    z-index: 0;
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
    line-height: 1.25;
    letter-spacing: 0.16px;
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
