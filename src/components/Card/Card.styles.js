import styled from 'styled-components';
import { headline32 } from 'themes/typography';
import {
  breakpoints as bp,
  determineMediaQuery as mQ,
} from 'themes/breakpoints';

export const StyledCard = styled.div`
  display: flex;
  padding: 40px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 56px;
  border: 1px solid ${({ theme }) => theme.colors.typography};
  position: relative;
  backdrop-filter: blur(5px);
`;

export const StyledCardImage = styled.div`
  max-width: 200px;
  margin: 0 auto;
  position: relative;
  width: 100%;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: calc(100% + 20px);
    height: calc(100% + 20px);
    background-color: ${({ theme }) => theme.colors.green};
    clip-path: polygon(
      0 0,
      calc(100% - 20px) 0,
      100% 20px,
      100% 100%,
      20px 100%,
      0 calc(100% - 20px)
    );
  }

  &::after {
    content: '';
    display: block;
    padding-bottom: 100%;
  }

  img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    border: 1px solid ${({ theme }) => theme.colors.typography};
  }
`;

export const StyledCardContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 48px;
  align-self: stretch;

  a {
    width: 100%;
  }
`;

export const StyledCardTitle = styled.h2`
  ${headline32}
  color: ${({ theme }) => theme.colors.typography};
`;
