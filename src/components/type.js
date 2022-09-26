import styled, { keyframes } from 'styled-components';

const typingAnim = () => keyframes`
  from {
    width: 0;
  }
`;

const StyledType = styled.p`
  display: flex;
  flex-flow: row wrap;
  gap: 1ch;
  max-width: 100%;

  span {
    white-space: nowrap;
    overflow: hidden;
    width: ${(props) => props.width}ch;
    animation: ${typingAnim} 1.5s steps(${(props) => props.width});
    max-width: 100%;
  }

  &:after {
    content: '_';
  }
`;

const Type = ({ text, prefix = '' }) => (
  <StyledType width={text.length}>
    {prefix}
    <span>{text}</span>
  </StyledType>
);

export default Type;
