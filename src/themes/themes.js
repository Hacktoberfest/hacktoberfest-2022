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
  holoShadow: 'rgba(60, 0, 206, 0.5)',
  blendMode: 'darken',
  bgGrain: `url(${grainDark.src})`,
  bodyShadow: '0px 0px 6px rgba(180, 42, 202, 0.5)',
  textShadow:
    '-1px -1px 2px rgba(255, 215, 77, 1), 1px 1px 2px rgba(124, 127, 255, 1)',
  smallTextShadow:
    '-1px -1px 6px rgba(255, 215, 77, 0.3), 1px 1px 6px rgba(124, 127, 255, 0.3)',
  textDropShadow:
    'drop-shadow(-1px -1px 2px rgba(255, 215, 77, 1)) drop-shadow(1px 1px 2px rgba(124, 127, 255, 1))',

  //new things
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
  bodyShadow: '0px 0px 6px rgba(180, 42, 202, 0.5)',
  textShadow: '0px 0px 6px rgba(180, 42, 202, 0.5)',
  smallTextShadow: '0px 0px 6px rgba(180, 42, 202, 0.2)',
  textDropShadow: 'drop-shadow(0px 0px 6px rgba(180, 42, 202, 0.5))',
};

const GlobalStyle = createGlobalStyle`
  body {
    background: ${(props) => props.theme.body};
    background-image: ${(props) => props.theme.bgGrain};
    color: ${(props) => props.theme.text};
  }

  h1, h2, h3, h4, h5, h6, p {
    text-shadow: ${(props) => props.theme.glowLite};
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
