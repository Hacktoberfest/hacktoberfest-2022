import styled from 'styled-components';
import {
  breakpoints as bp,
  determineMediaQuery as mQ,
} from 'themes/breakpoints';
import { headline32 } from 'themes/typography';

export const StyledEvents = styled.div`
  margin-top: 80px;

  > ul {
    margin: 0 0 48px;

    ${mQ(bp.desktop)} {
      margin: 0 0 64px;
    }
  }
`;

export const StyledEventsTitle = styled.h3`
  color: ${({ theme }) => theme.colors.bavarian.gold100};
  padding: 24px 40px;
  border: 2px dashed ${({ theme }) => theme.colors.neutral.manga300};
  border-radius: 16px;
  ${headline32};
`;

export const StyledEventsLink = styled.p`
  text-align: center;
`;
