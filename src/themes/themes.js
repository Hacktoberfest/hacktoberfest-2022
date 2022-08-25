import { createGlobalStyle } from 'styled-components';

export const darkTheme = {
  body: '#170F1E',
  text: '#E5E1E6',
  spark: '#FFD74D',
  surf: '#40DDFF',
  psybeam: '#7C7FFF',
  giga: '#B4FF39',
  holoShadow: 'rgba(60, 0, 206, 0.5)',
  blendMode: 'darken',
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
};

const GlobalStyle = createGlobalStyle`
  body {
    background: ${(props) => props.theme.body};
    color: ${(props) => props.theme.text};
  }
`;

export default GlobalStyle;
