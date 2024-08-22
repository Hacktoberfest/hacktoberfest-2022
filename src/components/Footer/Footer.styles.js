import styled from 'styled-components';
import {
  breakpoints as bp,
  determineMediaQuery as mQ,
} from 'themes/breakpoints';

export const StyledFooter = styled.footer`
  background-color: ${({ theme }) => theme.colors.darkGreen};
  color: ${({ theme }) => theme.colors.cream};
  display: grid;
  grid-template-columns: 1fr;
  padding-bottom: 70px;

  ${mQ(bp.tablet)} {
    grid-template-rows: max-content max-content;
    grid-template-columns: calc((1028 / 1440) * 100%) 1fr;
  }

  ${mQ(bp.desktop)} {
    padding-bottom: 0;
  }
`;

export const StyledFooterContainer = styled.div`
  padding: 43px 24px 64px;

  ${mQ(bp.tablet)} {
    grid-column: 1/-1;
  }

  ${mQ(bp.desktop)} {
    padding: 50px calc((199.86 / 1440) * 100%) 76px calc((451.69 / 1440) * 100%);
  }
`;

export const StyledFooterLogo = styled.div`
  width: 100%;
  transform: translateY(-1px);
  position: relative;
  width: calc((340 / 375) * 100%);

  ${mQ(bp.tablet)} {
    width: 100%;
  }

  img {
    width: 100%;
  }
`;

export const StyledFooterContent = styled.div`
  padding: 0 24px;
  order: 3;

  ${mQ(bp.desktop)} {
    place-content: flex-end;
    padding: 0 0 calc((90 / 412) * 100%);
    order: unset;
  }

  p {
    text-transform: uppercase;
  }
`;

export const StyledFooterLinks = styled.nav`
  display: grid;
  gap: 64px;
  grid-template-columns: minmax(0, 1fr);

  ${mQ(bp.tablet)} {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
`;

export const StyledFooterLinksColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;

  ul {
    display: flex;
    flex-direction: column;
  }

  a {
    display: inline-block;
    font-size: 20px;
    position: relative;
    font-weight: 700;
    line-height: 1.5;
    text-transform: uppercase;
    position: relative;
    color: ${({ theme }) => theme.colors.cream};
    text-decoration: none;
    transition: color 300ms ease-in-out;

    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 1px;
      background: ${({ theme }) => theme.colors.cream};
      transform: scaleX(0);
      transition: transform 300ms ease-in-out;
    }

    &:hover {
      &::after {
        transform: scaleX(1);
      }
    }
  }
`;

export const StyledFooterLinksTitle = styled.h3`
  display: flex;
  flex-direction: column;
  gap: 16px;
  font-size: 20px;
  position: relative;
  font-weight: 700;
  line-height: 1.5;
  text-transform: uppercase;

  &::after {
    content: '';
    width: 100%;
    height: 2px;
    background-image: linear-gradient(
      90deg,
      currentColor,
      currentColor 25%,
      transparent 25%,
      transparent 100%
    );
    background-size: 8px 2px;
  }
`;
