import { useMemo } from 'react';
import styled from 'styled-components';

import { body16, body24 } from 'themes/typography';

import Avatar from 'components/Avatar';

const StyledCode = styled.li`
  display: grid;
  grid-template-columns: 64px 1fr;
  gap: 24px;
  padding: 8px 0;

  &:last-of-type {
    margin: 0 0 32px;
  }
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

  // Hash the content of reason/item/from to generate a color
  const color = useMemo(() => {
    const idx =
      Math.abs(
        `${reason}${item}${from}`
          .split('')
          .reduce(
            (hash, char) => ((hash << 5) - hash + char.charCodeAt(0)) | 0,
          ),
      ) % 3;
    return ['gold', 'blue', 'red'][idx];
  }, [reason, item, from]);

  if (!id) return null;

  return (
    <StyledCode>
      <Avatar color={color} />

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
