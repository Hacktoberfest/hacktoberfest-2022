import styled, { css } from 'styled-components';
import { body24, headline32 } from 'themes/typography';

const StyledNotification = styled.div`
  width: 100%;
  padding: 48px;
  transition: 0.2s ease;
  background: ${({theme}) => theme.card.bg};
  border: 1px solid ${({$color}) => $color};
  border-radius: 24px;
  color: ${({theme}) => theme.colors.neutral.manga300};

  > h2 {
    margin: 0 0 32px;
    ${headline32};
  }

  a {
    color: ${({theme}) => theme.colors.bavarian.blue200};
    text-decoration: underline;

    &:hover,
    &:focus {
      color: ${({theme}) => theme.colors.bavarian.blue100};
    }
  }

  b {
    color: ${({theme}) => theme.colors.bavarian.gold200};
  }

  ${({ $paragraphs }) => $paragraphs && css`
    > p {
      margin: 0 0 16px;
      ${body24};
    }
  `}
}
`;

const Notification = ({ title, children, color }) => {
  // Check if all the children are paragraphs
  const paragraphs = children && (children.type === 'p'
    || (Array.isArray(children) && children.every(child => child.type === 'p')));

  return (
    <StyledNotification $color={color} $paragraphs={paragraphs}>
      <h2>{title}</h2>
      {children}
    </StyledNotification>
  );
};

export default Notification;
