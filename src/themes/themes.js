import { createGlobalStyle } from 'styled-components';

export const mainTheme = {
  colors: {
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
    }
  },
  gradients: {
    metal: {
      blueDark: '',
      blueLight: 'linear-gradient(180deg, #B2E3F0 0%, #EFEDEF 48.44%, #0C3640 48.45%, #33B6D8 100%)',
      wordmarkGold: '',
      logomarkGoldLight: '',
      logomarkGoldDark: '',
      wordmarkVoid: '',
      wordmarkManga: ''
    }
  },
  card: {
    stroke: '',
    bg: 'linear-gradient(156deg, rgba(239, 237, 239, 0.04) 0%, rgba(0, 0, 0, 0.04) 92.30%)',
  },
  border: {
    active: '',
    cards: '',
  }
};

const GlobalStyle = createGlobalStyle`
  body {
    background: ${({ theme }) => theme.colors.neutral.void200};
    color: ${({theme}) => theme.colors.neutral.manga200};
  }

  h1, h2, h3, h4, h5, h6, p, label {
    word-wrap: break-word;
  }

  a {
    color: ${({theme}) => theme.colors.bavarian.blue200};
    transition: color 0.2s ease;

    &:hover,
    &:focus-visible {
      color: ${({theme}) => theme.colors.bavarian.blue300};
    }
  }
`;

export default GlobalStyle;
