import { useEffect, useMemo, useState } from 'react';
import styled, { css } from 'styled-components';

const StyledLoaderWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 24px;
  height: 40px;
`;

const StyledLoader = styled.p`
  font-family: 'JetBrains Mono', monospace;
  font-variant-ligatures: none;
  margin: 0;

  ${({ $animated }) =>
    $animated &&
    css`
      margin: 0;

      @media (prefers-reduced-motion) {
        display: none;
      }
    `}
`;

const Loader = ({ message }) => {
  const frames = useMemo(
    () =>
      [
        '[    ]',
        '[=   ]',
        '[==  ]',
        '[=== ]',
        '[ ===]',
        '[  ==]',
        '[   =]',
        '[    ]',
        '[   =]',
        '[  ==]',
        '[ ===]',
        '[====]',
        '[=== ]',
        '[==  ]',
        '[=   ]',
      ].map((item) => item.replace(/ /g, '\u00A0')),
    []
  );
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setFrame((prev) => (prev + 1) % frames.length);
    }, 100);
    return () => clearInterval(interval);
  }, [frames]);

  return (
    // <div style={{ display: 'block' }}>
    <StyledLoaderWrapper>
      <StyledLoader>{message}</StyledLoader>
      <StyledLoader $animated>{frames[frame]}</StyledLoader>
    </StyledLoaderWrapper>
  );
};

export default Loader;
