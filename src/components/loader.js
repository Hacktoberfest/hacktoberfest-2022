import { useEffect, useMemo, useState } from 'react';
import styled, { css } from 'styled-components';

const StyledLoader = styled.p`
  font-family: 'JetBrains Mono', monospace;
  font-variant-ligatures: none;
  margin: 0;

  ${({ animated }) => animated && css`
    margin: 16px 0 0;
  
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
    <>
      <StyledLoader>{message}</StyledLoader>
      <StyledLoader animated>{frames[frame]}</StyledLoader>
    </>
  );
};

export default Loader;
