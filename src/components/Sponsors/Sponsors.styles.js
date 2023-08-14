import styled from 'styled-components';
import { body20 } from 'themes/typography';
import { breakpoints as bp, determineMediaQuery as mQ } from 'themes/breakpoints';

export const StyledSponsors = styled.div`
  position: relative;
`;

export const StyledSponsorsTitle = styled.div`
  margin: 0 0 16px;
  ${body20};
  font-weight: 600;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.bavarian.red200};
`;

export const StyledSponsorsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 16px;
  justify-content: center;

  ${mQ(bp.desktop)} {
    justify-content: flex-start;
    gap: 32px;
  }

  a {
    line-height: 0;
  }

  img {
    height: 20px;
    width: auto;

    ${mQ(bp.desktop)} {
      height: 32px;
    }
  }
`;