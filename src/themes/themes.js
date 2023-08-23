import { createGlobalStyle } from 'styled-components';
import grainDark from 'assets/img/grain-dark.png';
import grainLite from 'assets/img/grain-lite.png';
import vanguardHeavyEot from 'assets/fonts/vanguardcf-heavy.eot';
import vanguardHeavyWoff from 'assets/fonts/vanguardcf-heavy.woff';
import vanguardHeavyWoff2 from 'assets/fonts/vanguardcf-heavy.woff2';
import vanguardHeavyObliqueEot from 'assets/fonts/vanguardcf-heavyoblique.eot';
import vanguardHeavyObliqueWoff from 'assets/fonts/vanguardcf-heavyoblique.woff';
import vanguardHeavyObliqueWoff2 from 'assets/fonts/vanguardcf-heavyoblique.woff2';

export const darkTheme = {
  body: '#170F1E',
  text: '#E5E1E6',
  spark: '#FFD74D',
  surf: '#40DDFF',
  psybeam: '#7C7FFF',
  giga: '#B4FF39',
  holoShadow: 'rgba(60, 0, 206, 1)',
  blendMode: 'darken',
  bgGrain: `url(${grainDark.src})`,
  glowLite:
    '-1px -1px 6px rgba(255, 215, 77, 0.6), 1px 1px 6px rgba(124, 127, 255, 0.6)',
  glowLiteDS:
    'drop-shadow(-1px -1px 2px rgba(255, 215, 77, 0.6)) drop-shadow(1px 1px 2px rgba(124, 127, 255, 0.6))',
};

export const liteTheme = {
  body: '#E5E1E6',
  text: '#170F1E',
  spark: '#FFC700',
  surf: '#32DAFF',
  psybeam: '#5759FF',
  giga: '#B4FF39',
  holoShadow: 'rgba(60, 0, 206, 0.3)',
  blendMode: 'lighten',
  bgGrain: `url(${grainLite.src})`,
};

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
    /* background-image: ${(props) => props.theme.bgGrain}; */
    color: ${(props) => props.theme.text};
  }

  h1, h2, h3, h4, h5, h6, p, label {
    word-wrap: break-word;
  }

  a {
    color: ${(props) => props.theme.surf};
    transition: color 0.2s ease;

    &:hover,
    &:focus-visible {
      color: ${(props) => props.theme.psybeam};
    }
  }

  @font-face {
    font-display: swap;
    font-family: 'Vanguard';
    font-style: normal;
    font-weight: 900;
    src:
      url(${vanguardHeavyEot}) format('embedded-opentype'),
      url(${vanguardHeavyWoff2}) format('woff2'),
      url(${vanguardHeavyWoff}) format('woff');
  }

  @font-face {
    font-display: swap;
    font-family: 'Vanguard';
    font-style: italic;
    font-weight: 900;
    src:
      url(${vanguardHeavyObliqueEot}) format('embedded-opentype'),
      url(${vanguardHeavyObliqueWoff2}) format('woff2'),
      url(${vanguardHeavyObliqueWoff}) format('woff');
  }
`;

export default GlobalStyle;
