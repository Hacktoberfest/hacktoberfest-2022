import styled, { keyframes } from 'styled-components';

const typingAnim = () => keyframes`
  from {
    width: 0;
  }
`;

const StyledType = styled.span`
  white-space: nowrap;

  &,
  span {
    display: inline-block;
    max-width: 100%;
  }

  span {
    overflow: hidden;
    width: ${({ $width }) => $width}ch;
    animation: ${typingAnim} 1.5s steps(${({ $width }) => $width});
  }

  &:after {
    content: '_';
    position: relative;
    top: -.5ch;
    left: .25ch;
  }
`;

const Type = ({ text, prefix = '' }) => (
  <StyledType $width={text.length}>
    {prefix}
    <span>{text}</span>
  </StyledType>
);

export default Type;
