import styled from 'styled-components';

export const StyledDivider = styled.div`
  position: relative;

  ${({ $type, theme }) => $type === 'doubledashed' && `
    height: 10px;

    &::before,
    &::after {
      background-image: linear-gradient(90deg, ${theme.colors.neutral.manga400}, ${theme.colors.neutral.manga400} 50%, transparent 50%, transparent 100%);
      background-size: 15px 2px;
      background-position: -50%;
      content: '';
      position: absolute;
      left: 0;
      height: 2px;
      width: 100%;
    }

    &::before {
      top: 0;
    }

    &::after {
      bottom: 0;
    }
  `};

  ${({ $type, theme }) => $type === 'dashed' && `
    height: 2px;

    &::before {
      background-image: linear-gradient(90deg, ${theme.colors.neutral.manga400}, ${theme.colors.neutral.manga400} 50%, transparent 50%, transparent 100%);
      background-size: 15px 2px;
      background-position: -50%;
      content: '';
      position: absolute;
      left: 0;
      height: 2px;
      width: 100%;
      top: 0;
    }
  `};

  ${({ $type, theme }) => $type === 'pixel' && `
    height: 30px;
    background: url('data:image/svg+xml, <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none"><path d="M10 20H0V30H10V20Z" fill="%233D2E10"/><path d="M20 10H10V20H20V10Z" fill="%233D2E10"/><path d="M30 0H20V10H30V0Z" fill="%233D2E10"/></svg>');
    background-repeat: space;
    background-size: 40px 100%;
  `};
`;