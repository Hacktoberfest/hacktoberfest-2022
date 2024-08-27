import styled from 'styled-components';
import {
  breakpoints as bp,
  determineMediaQuery as mQ,
} from 'themes/breakpoints';
import { body16, body24, headline90 } from 'themes/typography';

export const StyledCountdownWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

export const StyledCountdownHeader = styled.div`
  ${body24}
  color: ${({ theme }) => theme.colors.green};
  text-align: center;
`;

export const StyledCountdown = styled.div`
  border-radius: 25px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  background-color: ${({ theme }) => theme.colors.green};

  ${mQ(bp.desktop)} {
    border-radius: 50px;
  }
`;

export const StyledCountdownItem = styled.div`
  color: ${({ theme }) => theme.colors.darkGreen};
  padding: 20px 0 28px;
  text-align: center;
  position: relative;

  ${mQ(bp.desktop)} {
    padding: 41px 0;
  }

  &:not(:last-child)::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 1px;
    background-color: ${({ theme }) => theme.colors.darkGreen};
    height: 100%;
  }

  p {
    ${body16};

    span {
      ${headline90};
      display: block;
    }
  }
`;
