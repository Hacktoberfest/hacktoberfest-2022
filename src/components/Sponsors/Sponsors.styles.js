import styled from 'styled-components';
import { body20 } from 'themes/typography';
import {
  breakpoints as bp,
  determineMediaQuery as mQ,
} from 'themes/breakpoints';

export const StyledSponsors = styled.div`
  position: relative;
  ${({ $centered }) => $centered && 'text-align: center;'}
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
    gap: 32px;
    ${({ $centered }) => !$centered && 'justify-content: flex-start;'}
  }

  a {
    line-height: 0;
    min-width: ${({ $large }) => ($large ? '100%' : 'calc(50% - 16px)')};

    ${mQ(bp.largePhone)} {
      min-width: initial;
    }

    img {
      height: ${({ $large }) => ($large ? '30px' : '20px')};
      width: auto;

      ${mQ(bp.desktop)} {
        height: ${({ $large }) => ($large ? '48px' : '32px')};
      }
    }
  }
`;
