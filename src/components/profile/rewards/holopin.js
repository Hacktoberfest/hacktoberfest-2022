import { useMemo } from 'react';
import styled from 'styled-components';

import { body16, body24 } from 'themes/typography';

import Avatar from 'components/Avatar';

const StyledCode = styled.li`
  display: grid;
  grid-template-columns: 64px 1fr;
  gap: 24px;
  padding: 32px 0;
`;

const StyledMessage = styled.p`
  margin: 0 0 8px;
  ${body24}
`;

const StyledWarning = styled.p`
  ${body16}
`;

const Holopin = ({
  code,
  reason,
  from = null,
  item = 'a badge',
  action = 'unlocked',
  claim = 'https://www.holopin.io/claim',
}) => {
  // Attempt to extract the claim ID from the payload
  const id = useMemo(() => {
    try {
      return JSON.parse(code.code).data.id;
    } catch {
      return null;
    }
  }, [code]);

  if (!id) return null;

  return (
    <StyledCode>
      <Avatar />

      <div>
        <StyledMessage>
          You've {action} {item} on Holopin
          {from && ` from ${from}`} <b>for {reason}</b>!
        </StyledMessage>

        <StyledWarning>
          Lost the email to claim it?{' '}
          <a
            href={`${claim.replace(/\/+$/, '')}/${id}`}
            target="_blank"
            rel="noreferrer noopener"
          >
            Claim it now
          </a>
          .
        </StyledWarning>
      </div>
    </StyledCode>
  );
};

export default Holopin;
