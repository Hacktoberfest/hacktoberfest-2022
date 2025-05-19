import styled from 'styled-components';
import {
  breakpoints as bp,
  determineMediaQuery as mQ,
} from 'themes/breakpoints';
import { textBase, textXl } from 'themes/typography';

export const StyledFormSection = styled.div`
  padding: 24px 32px 32px;
  border-radius: 16px;
  border: 1px solid ${({ theme }) => theme.colors2025.eastBay};
  background: linear-gradient(
    180deg,
    rgb(from ${({ theme }) => theme.colors2025.void} r g b / 0) 0%,
    rgb(from ${({ theme }) => theme.colors2025.blueViolet} r g b / 0.15) 100%
  );
  display: flex;
  flex-direction: column;
  gap: 32px;

  ${mQ(bp.tablet)} {
    padding: 32px 40px 40px;
  }
`;

export const StyledFormWrapper = styled.div`
  form {
    display: flex;
    flex-direction: column;
    gap: 32px;
  }
`;

export const StyledFormContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const StyledFormThanks = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
  align-items: center;
`;

export const StyledSubmitWrapper = styled.div`
  transition: transform 300ms ease-in-out;

  ${({ $isSuccess }) =>
    $isSuccess &&
    `
    transform: scaleY(0);
  `};
`;

export const StyledFormHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;

  h3 {
    ${textXl};
    font-weight: 700;
    color: ${({ theme }) => theme.colors2025.space.white};
  }

  p {
    ${textBase};
  }
`;
