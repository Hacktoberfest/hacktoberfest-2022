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

const Details = styled.details`
  summary {
    display: flex;
    align-items: center;
    list-style: none;
    cursor: pointer;

    &::-webkit-details-marker {
      display: none;
    }

    &::marker {
      display: none;
    }

    &::before {
      font-family: 'JetBrains Mono', monospace;
      text-align: center;
      width: 64px;
      flex: 0 0 64px;
      letter-spacing: 1px;
      text-indent: 1px;
      content: "${props => props.open ? '[-]' : '[+]'}";
      transition: letter-spacing 0.2s ease 0.2s, text-indent 0.2s ease 0.2s, color 0.4s ease;
    }

    &:hover {
      &::before {
        color: ${props => props.theme.surf};
        letter-spacing: 4px;
        text-indent: 4px;
        animation: ${rotateAnimation()} 0.2s linear;
      }
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
          color: ${props => props.theme.psybeam};
          letter-spacing: 1px;
          text-indent: 1px;
          animation: none;
        }
      }
    }
  }
`;

const Collapse = ({ title, collapsed, children }) => {
  const [ open, setOpen ] = useState(!collapsed);
  useEffect(() => setOpen(!collapsed), [ collapsed ]);
  const toggle = useCallback(evt => setOpen(evt.target.open), []);

  return (
    <Details open={open} onToggle={toggle}>
      <summary>{title}</summary>
      {children}
    </Details>
  );
};

export default Collapse;
