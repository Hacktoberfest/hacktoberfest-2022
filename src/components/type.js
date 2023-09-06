import { useMemo } from 'react';
import { keyframes, css } from 'styled-components';

const typingAnim = () => keyframes`
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
`;

const typingPseudoAnim = () => keyframes`
  from {
    content: '_';
  }

  to {
    content: '';
  }
`;

const Type = ({ text }) => {
  const chars = useMemo(() => text.split(''), [text]);

  const styles = useMemo(() => css`
    > span {
      ${chars.map((_, i) => css`
        &:nth-child(${i + 1}) {
          > span {
            opacity: 0;
            animation: ${typingAnim} 0.5s ${i * 0.1}s forwards steps(1);
          }

          &::after {
            content: '';
            animation: ${typingPseudoAnim} 0.1s ${(i * 0.1) + 0.5}s forwards steps(1);
          }
        }
      `)}
    }

    &::after {
      content: '';
      animation: ${typingPseudoAnim} 1s ${(chars.length * 0.1) + 0.5}s forwards steps(1);
    }
  `, [chars]);

  return (
    <span css={styles}>
      {chars.map((char, i) => (
        <span key={i}>
          <span>{char}</span>
        </span>
      ))}
    </span>
  );
};

export default Type;
