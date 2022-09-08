import { useCallback, useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const rotateAnimation = () => keyframes`
  0% {
    transform: scale(1) rotate(0deg);
  }

  50% {
    transform: scale(1.2) rotate(-90deg);
  }
  
  100% {
    transform: scale(1) rotate(-180deg);
  }
`;

const StyledDetails = styled.details`
  margin-bottom: 40px;
  
  summary {
    display: flex;
    align-items: center;
    list-style: none;
    cursor: pointer;

    @media (max-width: 600px) {
      align-items: flex-start;
    }

    &::-webkit-details-marker {
      display: none;
    }

    &::marker {
      display: none;
    }

    &::before {
      font-size: 16px;
      font-weight: normal;
      font-family: 'JetBrains Mono', monospace;
      text-shadow: ${(props) => props.theme.glowLite};
      text-align: center;
      width: 48px;
      flex: 0 0 48px;
      letter-spacing: 1px;
      text-indent: 1px;
      content: '${(props) => (props.open ? '[-]' : '[+]')}';
      transition: letter-spacing 0.2s ease 0.2s, text-indent 0.2s ease 0.2s,
        color 0.4s ease;

      @media (max-width: 600px) {
        margin-top: 4px;
      }
    }

    &:hover {
      &::before {
        color: ${(props) => props.theme.surf};
        letter-spacing: 4px;
        text-indent: 4px;
        animation: ${rotateAnimation()} 0.2s linear;

        @media (prefers-reduced-motion) {
          animation-play-state: paused;
        }
      }
    }

    h4 {
      margin: 0 !important;
    }
  }

  &[open] {
    summary {
      &::before {
        letter-spacing: 4px;
        text-indent: 4px;
        transition-delay: 0s;
      }

      &:hover {
        &::before {
          color: ${(props) => props.theme.psybeam};
          letter-spacing: 1px;
          text-indent: 1px;
          animation: none;
        }
      }
    }
  }

  > div {
    margin-left: 48px;
    padding-bottom: 24px;
    box-shadow: 0px 1px 0px rgba(229, 225, 230, 0.25);

    p {
      margin-top: 12px !important;
      opacity: 0.75;
      text-shadow: none;
      text-transform: none;
    }
  }
`;

const StyledFakeDetails = styled.div`
  margin-bottom: 40px;
  
  > :nth-child(1) {
    display: flex;
    align-items: center;

    @media (max-width: 600px) {
      align-items: flex-start;
    }

    &::before {
      font-size: 16px;
      font-weight: normal;
      font-family: 'JetBrains Mono', monospace;
      text-shadow: ${(props) => props.theme.glowLite};
      text-align: center;
      width: 48px;
      flex: 0 0 48px;
      letter-spacing: 1px;
      text-indent: 1px;
      content: '[ ]';

      @media (max-width: 600px) {
        margin-top: 4px;
      }
    }
  }

  > :nth-child(2) {
    margin-left: 48px;
  }
`;

export const FakeCollapse = ({ title, children }) => (
  <StyledFakeDetails>
    <div>{title}</div>
    <div>{children}</div>
  </StyledFakeDetails>
);

const Collapse = ({ title, collapsed, children }) => {
  const [open, setOpen] = useState(!collapsed);
  useEffect(() => setOpen(!collapsed), [collapsed]);
  const toggle = useCallback((evt) => setOpen(evt.target.open), []);

  return (
    <StyledDetails open={open} onToggle={toggle}>
      <summary>{title}</summary>
      <div>{children}</div>
    </StyledDetails>
  );
};

export default Collapse;
