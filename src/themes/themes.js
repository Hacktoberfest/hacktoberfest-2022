import { createGlobalStyle } from 'styled-components';

export const darkTheme = {
  body: '#170F1E',
  text: '#E5E1E6',
  giga: '#B4FF39',
  spark: '#FFE27D',
  surf: '#64E3FF',
  psybeam: '#9092FF',
  holo: 'linear-gradient(90deg, #FFE27D 0%, #64E3FF 50%, #9192FF 100%)',
  visibility: 'visible',
  logoShadow:
    'drop-shadow(2px 2px 2px rgba(144, 148, 255, 0.6)) drop-shadow(-2px -2px 2px rgba(255, 227, 126, 0.6)) drop-shadow(0px 0px 5px rgba(0, 0, 0, 1))',
  holoShadow:
    'drop-shadow(-2px 0px 1px rgba(255, 227, 126, 0.3)) drop-shadow(2px 0px 1px rgba(144, 148, 255, 0.4))',
};

export const liteTheme = {
  body: '#E5E1E6',
  text: '#170F1E',
  giga: '#B4FF39',
  spark: '#FFE27D',
  surf: '#64E3FF',
  psybeam: '#9092FF',
  holo: '#170F1E',
  visibility: 'hidden',
  logoShadow: '',
  holoShadow: '',
};

const GlobalStyle = createGlobalStyle`
  body {
    background: ${(props) => props.theme.body};
    color: ${(props) => props.theme.text};
  }
`;

export default GlobalStyle;
