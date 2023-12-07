import styled from 'styled-components';
import { body32 } from 'themes/typography';
import { breakpoints as bp, determineMediaQuery as mQ } from 'themes/breakpoints';

export const StyledHeartCallout = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  padding: 64px 0 0;
  gap: 40px;
  align-items: center;

  ${mQ(bp.desktop)} {
    gap: 16px;
    grid-template-columns: 1fr ${((742 / 1280) * 100)}% 1fr;
  }

  p {
    ${body32};
    font-weight: 700;
    color: ${({ theme }) => theme.colors.neutral.manga200};
  }

  strong {
    color: ${({ theme }) => theme.colors.bavarian.gold200};
  }
`;

export const StyledHeartCalloutImage = styled.div`
  img {
    display: block;
    margin: 0 auto;
    max-width: 130px;
    filter: drop-shadow(1px 1px 10px rgba(236, 66, 55, 0.50)) drop-shadow(-1px -1px 10px rgba(255, 251, 164, 0.50));
  }
`;
