import styled from 'styled-components';

const StyledCode = styled.p`
  border: 1px solid ${(props) => props.theme.text};
  box-shadow: 0px 0px 2px ${(props) => props.theme.text};
  border-radius: 8px;
  padding: 16px;
  margin: 16px 0 8px !important;
  font-family: 'JetBrains Mono', monospace;
  text-transform: none;
  line-height: 1;
  transition: box-shadow 0.2s ease;
  
  &:not(:hover, :focus) {
    font-size: 0;
  }
  
  &:hover,
  &:focus {
    box-shadow: 0px 0px 8px ${(props) => props.theme.text};
    
    &::before {
      font-size: 0;
    }
  }
  
  &::before {
    font-size: 1rem;
    content: '${(props) => '*'.repeat(props.length)}';
  }
`;

const StyledWarning = styled.p`
  font-size: 0.75rem;
  font-style: italic;
  opacity: 0.8;
  margin: 8px 0 16px !important;
`;

const GiftCode = ({ code }) => {
  return (
    <>
      <StyledCode
        tabIndex="-1"
        length={code.length}
      >
        {code}
      </StyledCode>
      <StyledWarning>
        Hover over or click on the box to reveal your redemption code.
        <br/>
        Remember: This code is unique to you and can only be used once.
        Don't share it with anyone, and don't include it in any screenshots you post online.
      </StyledWarning>
    </>
  );
};

export default GiftCode;
