import styled from 'styled-components';
import { headline32, headline56 } from 'themes/typography';
import {
  breakpoints as bp,
  determineMediaQuery as mQ,
} from 'themes/breakpoints';

export const StyledSponsors = styled.div`
  position: relative;
  ${({ $centered }) => $centered && 'text-align: center;'}
  display: flex;
  flex-direction: column;
  gap: 60px;
  max-width: 1125px;
  width: 100%;
  margin: 0 auto;
`;

export const StyledSponsorsTitle = styled.h2`
  ${({ $large }) => ($large ? headline56 : headline32)};
  color: white;
`;

export const StyledSponsorsList = styled.div`
  display: flex;
  justify-content: center;
  gap: 60px 40px;
  flex-wrap: wrap;

  a {
    line-height: 0;
    display: block;
    width: 100%;
    background-color: white;
    padding: 46px 24px;

    ${mQ(bp.tablet)} {
      width: calc((100% / 2) - 40px);
    }

    ${mQ(bp.desktop)} {
      width: calc((100% / 3) - 40px);
    }

    img {
      height: ${({ $large }) => ($large ? '30px' : '20px')};
      max-width: 210px;
      object-fit: contain;
      width: auto;
      filter: brightness(0);

      ${mQ(bp.desktop)} {
        height: 50px;
      }
    }
  }
`;
