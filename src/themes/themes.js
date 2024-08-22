import { createGlobalStyle } from 'styled-components';

export const mainTheme = {
  colors: {
    darkGreen: '#183717',
    green: '#50DA4C',
    lightGreen: '#D8FFD8',
    paleGreen: '#ADEDAD',

    pink: '#FF8BFF',
    deepPink: '#C401C4',
    lightPink: '#FFDBFF',

    black: '#1C1C1C',
    light: '#FEFDF8',
    cream: '#F3F0E0',
    typography: '#F3F0E0',
    error: '#EC4237',

    neutral: {
      manga200: '#EFEDEF',
      manga300: '#C3BCC3',
      manga400: '#655F67',
      void200: '#0F0913',
    },
    bavarian: {
      blue100: '#B2E3F0',
      blue200: '#33B6D8',
      blue300: '#14596B',
      blue400: '#0C3640',
      gold100: '#FFFBA4',
      gold200: '#D2B863',
      gold300: '#AD832D',
      gold400: '#3D2E10',
      red100: '#F8BDB9',
      red200: '#EC4237',
      red300: '#A3180F',
      red400: '#460A07',
    },
  },
};

const GlobalStyle = createGlobalStyle`
  body {
    background: ${({ theme }) => theme.colors.cream};
    color: ${({ theme }) => theme.colors.dark};
  }

  h1, h2, h3, h4, h5, h6, p, label {
    word-wrap: break-word;
  }

  a {
    text-decoration: underline;
    transition: color 0.2s ease;

    &:hover,
    &:focus-visible {
      text-decoration: none;
    }
  }
`;

export default GlobalStyle;
