import styled from 'styled-components';
import { body18 } from 'themes/typography';
import {
  breakpoints as bp,
  determineMediaQuery as mQ,
} from 'themes/breakpoints';

export const StyledSponsors = styled.div`
  position: relative;
  ${({ $centered }) => $centered && 'text-align: center;'}
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const StyledSponsorsTitle = styled.div`
  ${body18}
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 3.6px;
  color: ${({ theme }) => theme.colors.darkGreen};
`;

export const StyledSponsorsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 16px;
  justify-content: center;

  ${mQ(bp.desktop)} {
    gap: 32px;
    ${({ $centered }) => !$centered && 'justify-content: flex-start;'}
  }

  a {
    line-height: 0;
    min-width: ${({ $large }) => ($large ? '100%' : 'calc(50% - 16px)')};

    ${mQ(bp.largePhone)} {
      min-width: initial;
    }

    background-color: white;
    border-radius: 30px;
    padding: 14px 24px;

    img {
      height: ${({ $large }) => ($large ? '30px' : '20px')};
      width: auto;
      filter: brightness(0);

      ${mQ(bp.desktop)} {
        height: ${({ $large }) => ($large ? '48px' : '32px')};
      }
    }
  }
`;
