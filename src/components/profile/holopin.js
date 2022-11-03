import { useMemo } from 'react';
import styled from 'styled-components';

const StyledCode = styled.li`
  position: relative;
  padding: 8px 0;
  box-shadow: 0px 1px 0px rgba(229, 225, 230, 0.25);
  
  &:last-of-type {
    margin: 0 0 16px;
  }
  
  p {
    margin: 4px 0 0;
  }
`;

const StyledWarning = styled.p`
  font-size: 0.75rem;
  font-style: italic;
  opacity: 0.8;
`;

const Holopin = ({ code, reason, from = null }) => {
  const id = useMemo(() => {
    try {
      return JSON.parse(code.code).data.id;
    } catch {
      return null;
    }
  }, [code]);

  return (
    <StyledCode>
      <p>
        You've been awarded a Holopin badge
        {from && ` from ${from}`}
        {' '}
        for {reason}!
      </p>
      {id && (
        <StyledWarning>
          Lost the email to claim your badge?
          {' '}
          <a
            href={`https://www.holopin.io/claim/${id}`}
            target="_blank"
            rel="noreferrer noopener"
          >
            Claim it directly
          </a>
          .
        </StyledWarning>
      )}
    </StyledCode>
  );
};

export default Holopin;
