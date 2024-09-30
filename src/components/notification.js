import styled, { css } from 'styled-components';
import { body24, headline32 } from 'themes/typography';

const StyledNotification = styled.div`
  width: 100%;
  padding: 40px;
  transition: 0.2s ease;
  border: 1px solid ${({ $color }) => $color};
  color: currentColor;

  > h2 {
    margin: 0 0 16px;
    ${headline32}
  }

  > *:last-child {
    margin-bottom: 0;
  }

  a {
    color: ${({ theme }) => theme.colors.deepPink};
    text-decoration: underline;

    &:hover,
    &:focus {
      text-decoration: none;
    }
  }

  b {
    font-weight: 500;
  }

  ${({ $paragraphs }) =>
    $paragraphs &&
    css`
      > p {
        margin: 0 0 16px;
        ${body24}
      }
    `}
`;

const Notification = ({ title, children, color, className }) => {
  // Check if all the children are paragraphs
  const paragraphs =
    children &&
    (children.type === 'p' ||
      (Array.isArray(children) &&
        children.every((child) => child.type === 'p')));

  return (
    <StyledNotification
      $color={color}
      $paragraphs={paragraphs}
      className={className}
    >
      <h2>{title}</h2>
      {children}
    </StyledNotification>
  );
};

export default Notification;
