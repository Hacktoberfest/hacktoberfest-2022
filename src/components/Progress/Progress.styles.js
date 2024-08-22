import styled from 'styled-components';

export const StyledProgress = styled.div`
  height: 21px;
  background-color: ${({ theme }) => theme.colors.green};
  position: relative;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background-color: ${({ theme }) => theme.colors.pink};
    transform: scaleX(${({ $percentage }) => $percentage / 100});
    transform-origin: 0 0;
  }
`;
