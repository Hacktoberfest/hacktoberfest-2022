import styled, { css } from 'styled-components';

const StyledNotification = styled.div`
  width: 100%;
  margin: 24px 0;
  padding: 24px 32px;
  transition: 0.2s ease;
  background: linear-gradient(
    180deg,
    rgba(124, 127, 255, 0) 0%,
    ${(props) => props.theme[props.color]} 300%
  );
  border: 1px solid ${(props) => props.theme[props.color]};
  box-shadow: 0px 0px 8px ${(props) => props.theme[props.color]};
  border-radius: 24px;

  h5 {
    margin: 0 0 8px;
  }
  
  p {
    margin: 0 0 4px;
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
  <StyledNotification color={color} linkColor={linkColor}>
    <h5>[ {title} ]</h5>
    {children}
  </StyledNotification>
);

export default Notification;
