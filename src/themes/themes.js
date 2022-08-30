import { createGlobalStyle } from 'styled-components';

export const darkTheme = {
  body: '#170F1E',
  text: '#E5E1E6',
  spark: '#FFD74D',
  surf: '#40DDFF',
  psybeam: '#7C7FFF',
  giga: '#B4FF39',
  holoShadow: 'rgba(60, 0, 206, 0.4)',
  blendMode: 'darken',
  bgGrain: `url('../../images/grain-dark.png')`,
  bodyShadow: '0px 0px 6px rgba(180, 42, 202, 0.5)',
  textShadow:
    '-1px -1px 2px rgba(255, 215, 77, 1), 1px 1px 2px rgba(124, 127, 255, 1)',
  smallTextShadow:
    '-1px -1px 6px rgba(255, 215, 77, 0.3), 1px 1px 6px rgba(124, 127, 255, 0.3)',
  textDropShadow:
    'drop-shadow(-1px -1px 2px rgba(255, 215, 77, 1)) drop-shadow(1px 1px 2px rgba(124, 127, 255, 1))',
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
  bgGrain: `url('../../images/grain-lite.png')`,
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
`;

export default GlobalStyle;
