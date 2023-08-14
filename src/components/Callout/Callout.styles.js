import styled from 'styled-components';
import { body32 } from 'themes/typography';

export const StyledCallout = styled.div`
  text-align: center;
  color: ${({ theme }) => theme.colors.neutral.manga200};

  p {
    margin: 0 0 48px;
    ${body32}

    &:last-child {
      margin-bottom: 0;
    }
  }
`;