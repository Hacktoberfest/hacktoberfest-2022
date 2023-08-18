import styled from 'styled-components';
import { headline32 } from 'themes/typography';
import { breakpoints as bp, determineMediaQuery as mQ } from 'themes/breakpoints';

export const StyledCard = styled.div`
  display: flex;
  padding: 64px 48px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 56px;
  position: relative;
  backdrop-filter: blur(5px);
`;

export const StyledCardImage = styled.div`
  max-width: 200px;
  margin: 0 auto;
  position: relative;
  width: 100%;

  ${({ $rotate }) => $rotate === 'left' ? `
    transform: rotate(-14deg);
  ` : `
    transform: rotate(14deg);
  `}

  &::before {
    background: url(${({ $bgImage }) => $bgImage}) no-repeat center center;
    background-size: cover;
    content: '';
    height: 120%;
    left: 50%;
    position: absolute;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 120%;

    ${({ $rotate }) => $rotate === 'left' ? `
      transform: translate(-50%, -50%) rotate(14deg) ;
    ` : `
      transform: translate(-50%, -50%) rotate(-14deg) ;
    `}
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
  ${headline32};
  color: ${({ theme }) => theme.colors.neutral.manga200};
`;

export const StyledCardBG = styled.div`
  position: absolute;
  inset: 0;
  background: ${({ theme }) => theme.card.bg};
  backdrop-filter: blur(5px);
  z-index: -1;
  border-radius: 32px;
  overflow: hidden;

  &::before,
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: destination-out; /* stylelint-disable-line property-no-vendor-prefix */
    mask-composite: exclude;
    padding: 1px;
    border-radius: inherit;
  }

  &::before {
    background: linear-gradient(77.9deg, #EC4237 0%, #33B6D8 100%);
  }

  &::after {
    background: linear-gradient(230deg, #FFFBA4 0%, rgba(255, 251, 164, 0) 100%);
    opacity: .3;
  }
`;