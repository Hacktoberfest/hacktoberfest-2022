import styled from 'styled-components';

export const StyledCorners = styled.div`
  --corner-size: ${({ size }) => size || 5}px;
  --border-width: ${({ width }) => width || 1}px;
  --full-width: calc(var(--corner-size) + var(--border-width));

  position: absolute;
  inset: -2px;
  background-color: currentColor;
  clip-path: polygon(
    0px var(--full-width),
    var(--border-width) var(--full-width),
    var(--border-width) var(--border-width),
    var(--full-width) var(--border-width),
    var(--full-width) 0px,
    0px 0px,
    0px 100%,
    100% 100%,
    100% 0px,
    calc(100% - var(--full-width)) 0px,
    calc(100% - var(--full-width)) var(--border-width),
    calc(100% - var(--border-width)) var(--border-width),
    calc(100% - var(--border-width)) var(--full-width),
    100% var(--full-width),
    100% calc(100% - var(--full-width)),
    calc(100% - var(--border-width)) calc(100% - var(--full-width)),
    calc(100% - var(--border-width)) calc(100% - var(--border-width)),
    calc(100% - var(--full-width)) calc(100% - var(--border-width)),
    calc(100% - var(--full-width)) 100%,
    var(--full-width) 100%,
    var(--full-width) calc(100% - var(--border-width)),
    var(--border-width) calc(100% - var(--border-width)),
    var(--border-width) calc(100% - var(--full-width)),
    0px calc(100% - var(--full-width)),
    0px var(--full-width)
  );
  transition:
    inset 300ms ease-in-out,
    clip-path 300ms ease-in-out,
    color 300ms ease-in-out;
`;
