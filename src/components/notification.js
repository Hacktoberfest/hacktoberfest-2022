import styled, { css } from 'styled-components';
import { headline32, textLg } from 'themes/typography';

const StyledNotification = styled.div`
  width: 100%;
  padding: 24px;
  transition: 0.2s ease;
  border: 1px solid ${({ $color }) => $color};
  color: currentColor;

  > h2 {
    margin: 0 0 16px;
    ${headline32}
    font-weight: 700;
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
        ${textLg}
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
