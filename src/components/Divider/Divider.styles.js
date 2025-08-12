import styled from 'styled-components';

export const StyledDivider = styled.div`
  position: relative;

  ${({ $type }) =>
    $type === 'doubledashed' &&
    `
    height: 10px;

    &::before,
    &::after {
      background-image: linear-gradient(90deg, currentColor, currentColor 25%, transparent 25%, transparent 100%);
      background-size: 12px 2px;
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

  ${({ $type }) =>
    $type === 'dashed' &&
    `
    height: 2px;

    &::before {
      background-image: linear-gradient(90deg, currentColor, currentColor 25%, transparent 25%, transparent 100%);
      background-size: 12px 2px;
      background-position: -50%;

      content: '';
      position: absolute;
      left: 0;
      height: 2px;
      width: 100%;
      top: 0;
    }
  `};

  ${({ $type }) =>
    $type === 'solid' &&
    `
    height: 1px;

    &::before {
      background-image: linear-gradient(90deg, currentColor, currentColor 100%);

      content: '';
      position: absolute;
      left: 0;
      height: 1px;
      width: 100%;
      top: 0;
    }
  `};
`;
