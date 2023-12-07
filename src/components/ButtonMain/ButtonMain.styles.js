import Link from 'next/link';
import styled from 'styled-components';
import { breakpoints as bp, determineMediaQuery as mQ } from 'themes/breakpoints';
import { body16, body20 } from 'themes/typography';

export const StyledButtonMain = styled(Link)`
  position: relative;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  border-radius: 16px;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.neutral.manga300};
  transition: box-shadow 300ms ease-in-out;

  ${({ $size }) => $size === 'lg' && body20};
  ${({ $size }) => $size === 'lg' && `
    padding: 12px 20px;

    ${mQ(bp.desktop)} {
      padding: 18px 26px;
    }
  `};

  ${({ $size }) => $size === 'sm' && body16};
  ${({ $size }) => $size === 'sm' && `
    padding: 12px 20px;
  `};

  &::before,
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    border: 1px solid transparent;
    background-color: ${({ theme }) => theme.colors.neutral.manga400};
    -webkit-mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
  }

  &:hover {
    text-shadow: 1px 1px 10px rgba(236, 66, 55, 0.50), -1px -1px 10px rgba(255, 251, 164, 0.50);
    background: ${({theme}) => theme.card.bg};
    box-shadow: 1px 1px 10px 0px rgba(236, 66, 55, 0.50), -1px -1px 10px 0px rgba(255, 251, 164, 0.50);
    backdrop-filter: blur(5px);
    color: ${({ theme }) => theme.colors.neutral.manga200};

    &::before {
      background: linear-gradient(77.9deg, #EC4237 0%, #33B6D8 100%) border-box;
    }

    &::after {
      background: linear-gradient(230deg, #FFFBA4 0%, rgba(255, 251, 164, 0) 100%) border-box;
      opacity: .3;
    }
  }
`;

export const StyledButtonGroup = styled.div`
  display: flex;
  flex-flow: column;
  gap: 8px;
  justify-content: ${({$align}) => $align ? $align : 'flex-start'};

  ${mQ(bp.tablet)} {
    flex-direction: row;
    gap: 16px;
  }
`;
