import styled from 'styled-components';

const Shell = styled.div`
  width: min(calc(100% - 30px), 1280px);
  margin-inline: auto;

  @media (min-width: 768px) {
    width: min(calc(100% - 40px), 1280px);
  }

  /* Give the content more presence on ultrawide displays, where a 1280px
     column reads as marooned in the middle of the screen. */
  @media (min-width: 1700px) {
    width: min(calc(100% - 40px), 1440px);
  }
`;

export default Shell;
