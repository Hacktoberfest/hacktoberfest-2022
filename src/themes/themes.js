import { createGlobalStyle } from 'styled-components';

export const liteTheme = {
  body: '#170F1E',
  text: '#E5E1E6',
  giga: '#B4FF39',
  spark: '#FFE27D',
  surf: '#64E3FF',
  psybeam: '#9092FF',
  holo: 'linear-gradient(90deg, #FFE27D 0%, #64E3FF 50%, #9192FF 100%);',
  overlay: 'darken',
};

export const darkTheme = {
  body: '#E5E1E6',
  text: '#170F1E',
  giga: '#B4FF39',
  spark: '#FFE27D',
  surf: '#64E3FF',
  psybeam: '#9092FF',
  holo: 'linear-gradient(90deg, #FFE27D 0%, #64E3FF 50%, #9192FF 100%);',
  overlay: 'lighten',
};

const GlobalStyle = createGlobalStyle`
  body {
    background: ${(props) => props.theme.body};
    color: ${(props) => props.theme.text};
  }
`;

export default GlobalStyle;
