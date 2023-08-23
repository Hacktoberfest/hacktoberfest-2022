import styled, { css } from 'styled-components';
import { body24, headline32 } from 'themes/typography';

const StyledNotification = styled.div`
  width: 100%;
  padding: 48px;
  transition: 0.2s ease;
  background: ${({theme}) => theme.card.bg};
  border: 1px solid ${({$color}) => $color};
  border-radius: 24px;

  h2 {
    margin: 0 0 16px;
    ${headline32};
  }

  p {
    margin: 0 0 4px;
    ${body24};

    &:last-child {
      margin-bottom: 0;
    }
  }

  ${(props) => props.linkColor && props.theme[props.linkColor] && css`
    a {
      color: ${(props) => props.theme[props.linkColor]};
      text-decoration: none;

      &:hover,
      &:focus {
        color: ${(props) => props.theme[props.linkColor]};
        text-decoration: underline;
      }
    }
  `}
`;

const Notification = ({ title, children, color, linkColor = null }) => (
  <StyledNotification $color={color} linkColor={linkColor}>
    <h2>{title}</h2>
    {children}
  </StyledNotification>
);

export default Notification;
