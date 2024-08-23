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
