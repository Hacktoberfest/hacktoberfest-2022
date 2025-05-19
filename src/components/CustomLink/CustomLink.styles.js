import Link from 'next/link';
import styled from 'styled-components';
import { textSm } from 'themes/typography';

export const StyledCustomLink = styled(Link)`
  ${textSm};
  color: ${({ theme }) => theme.colors2025.lavendar};
  display: inline-flex;
  align-items: center;
  gap: 8px;
  position: relative;
  font-weight: 700;
  text-decoration: none;
  transition: color 300ms ease-in-out;
  text-transform: uppercase;

  ${({ $isExternal }) =>
    $isExternal &&
    `
    padding-right: 7px;

    &::after {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      width: 4px;
      height: 4px;
      border: 1px solid currentColor;
      border-left: 0;
      border-bottom: 0;
    }
  `};

  &:hover {
    color: ${({ theme }) => theme.colors2025.space.white};
    text-shadow: 0 0 5px
      rgb(from ${({ theme }) => theme.colors2025.space.white} r g b / 0.25);
  }

  svg {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
  }
`;
