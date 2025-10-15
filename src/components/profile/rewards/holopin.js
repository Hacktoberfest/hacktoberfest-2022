import { useMemo } from 'react';
import styled from 'styled-components';
import {
  breakpoints as bp,
  determineMediaQuery as mQ,
} from 'themes/breakpoints';

import {
  body16,
  body24,
  textBase,
  textLg,
  textSm,
  textXl,
} from 'themes/typography';

import Avatar from 'components/Avatar';
import { StyledGlowBox } from '../../Avatar/Avatar.styles';

const StyledCode = styled.li`
  display: flex;
  flex-direction: column;
  gap: 16px;

  ${mQ(bp.desktop)} {
    align-items: center;
    flex-direction: row;
    gap: 40px;
  }

  > div:nth-of-type(2) {
    display: flex;
    flex-direction: column;
    gap: 8px;

    ${mQ(bp.desktop)} {
      gap: 16px;
    }
  }
`;

const StyledMessage = styled.div`
  ${textBase};

  ${mQ(bp.desktop)} {
    ${textLg};
  }
`;

const StyledGlowMessage = styled.div`
  ${textBase};
  font-weight: 700;
  color: ${({ theme }) => theme.colors2025.space.white};
  text-shadow: 0px 0px 10px
    rgb(from ${({ theme }) => theme.colors2025.space.dust} r g b / 0.5);

  ${mQ(bp.desktop)} {
    ${textXl};
    font-weight: 700;
  }
`;

const StyledWarning = styled.div`
  ${textSm};

  a {
    color: ${({ theme }) => theme.colors2025.lavendar};
  }
`;

const StyledAvatar = styled(Avatar)`
  width: 87px;
  height: 87px;

  ${StyledGlowBox} {
    width: 3px;
    height: 3px;

    &:nth-of-type(2) {
      left: calc(100% - 3px);
    }

    &:nth-of-type(3) {
      top: calc(100% - 3px);
    }

    &:nth-of-type(4) {
      left: calc(100% - 3px);
      top: calc(100% - 3px);
    }
  }

  ${mQ(bp.tablet)} {
    width: 189px;
    height: 189px;

    ${StyledGlowBox} {
      width: 6px;
      height: 6px;

      &:nth-of-type(2) {
        left: calc(100% - 6px);
      }

      &:nth-of-type(3) {
        top: calc(100% - 6px);
      }

      &:nth-of-type(4) {
        left: calc(100% - 6px);
        top: calc(100% - 6px);
      }
    }
  }
`;

const Holopin = ({
  code,
  reason,
  from = null,
  item = 'badge',
  action = 'been awarded',
  claim = 'https://www.holopin.io/claim',
  skipTrailingSlash = false,
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
      <StyledAvatar />

      <div>
        <StyledMessage>
          You've {action} a {item} for:
        </StyledMessage>
        <StyledGlowMessage>{reason}!</StyledGlowMessage>
        <StyledWarning>
          {claim.startsWith('http') ? (
            <>
              Lost the email to claim your {item}?{' '}
              <a
                href={`${skipTrailingSlash ? `${claim}${id}` : `${claim.replace(/\/+$/, '')}/${id}`}`}
                target="_blank"
                rel="noreferrer noopener"
              >
                Claim it directly
              </a>
              .
            </>
          ) : (
            claim
          )}
        </StyledWarning>
      </div>
    </StyledCode>
  );
};

export default Holopin;
