import styled from 'styled-components';
import { body20 } from 'themes/typography';

const StyledCode = styled.p`
  border: 1px solid ${({theme}) => theme.colors.neutral.manga400};
  box-shadow: 0px 0px 2px ${({theme}) => theme.colors.bavarian.gold200};
  border-radius: 8px;
  padding: 16px 24px;
  margin: 32px 0;
  position: relative;
  text-transform: none;
  transition: box-shadow 0.2s ease;
  ${body20};

  &:not(:hover, :focus) {
    font-size: 0;
  }

  &:hover,
  &:focus {
    box-shadow: 0px 0px 8px ${({theme}) => theme.colors.bavarian.gold200};

    &::before {
      font-size: 0;
    }
  }

  &::before {
    padding: inherit;
    position: absolute;
    top: 1px;
    ${body20};
    left: 1px;
    content: '${(props) => '*'.repeat(props.length)}';
  }
`;

const StyledWarning = styled.div`
  margin: 0 0 32px;

  p {
    ${body20};
  }

  strong,
  small {
    color: ${({theme}) => theme.colors.bavarian.gold200};
  }

  a {
    color: ${({theme}) => theme.colors.bavarian.blue200};
  }
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
        <p><small>Hover over or click on the box to reveal your redemption code.</small></p>

        <p>
          <strong>Remember:</strong> This code is unique to you and can only be used once. Don't share it with anyone, and don't include it in any screenshots you post online.
        </p>
      </StyledWarning>
    </>
  );
};

export default GiftCode;
