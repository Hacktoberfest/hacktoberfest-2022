import { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';

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

    &::after {
      font-family: 'JetBrains Mono', monospace;
      letter-spacing: 1px;
      margin: 0 2px 0 16px;
      content: "${props => props.open ? '[-]' : '[+]'}";
      transition: 0.2s ease;
    }

    &:hover {
      &::after {
        letter-spacing: 3px;
        margin: 0 0 0 14px;
      }
    }
  }

  &[open] {
    summary {
      &::after {
        letter-spacing: 3px;
        margin: 0 0 0 14px;
      }

      &:hover {
        &::after {
          letter-spacing: 1px;
          margin: 0 2px 0 16px;
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
