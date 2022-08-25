import styled, { keyframes } from 'styled-components';
import { useEffect } from 'react';

const StyledDiv = styled.div``;

const textAnimation = () => keyframes`
  25% {
    content: "101010 010101 101010 010101 101010";
  }
  50% {
    content: "010101 101010 010101 101010 010101";
  }
  75% {
    content: "101010 010101 101010 010101 101010";
  }
  100% {
    content: "010101 101010 010101 101010 010101";
  }
`;

const MainWrapper = styled(StyledDiv)`
  background: linear-gradient(
    180deg,
    ${(props) => props.theme.psybeam} 0%,
    ${(props) => props.theme.surf} 100%
  );
  border: 4px solid ${(props) => props.theme.surf};
  border-radius: 24px;
  box-shadow: 0px 0px 12px ${(props) => props.theme.surf};
  height: 354px;
  padding: 36px 44px 44px 44px;
  position: relative;
  transition: 0.4s cubic-bezier(0.8, -1, 0.2, 1.5);
  width: 304px;

  &:hover {
    box-shadow: 0px 0px 25px ${(props) => props.theme.surf},
      0px 0px 8px 2px ${(props) => props.theme.surf};
    transform: translateY(-20px);

    .binary:after {
      animation: ${textAnimation} 1s linear infinite;
    }
  }

  .binary {
    color: ${(props) => props.theme.surf};
    font-size: 12px;
    position: absolute;
    text-align: center;
    width: 100%;

    &.top {
      left: 0;
      top: 10px;
    }

    &.bottom {
      bottom: 10px;
      color: ${(props) => props.theme.psybeam};
      left: 0;
      transform: rotate(180deg);
    }

    &.side {
      height: 100%;
      text-align: center;
      top: 0;
      width: max-content;
      writing-mode: vertical-rl;

      &.right {
        right: 10px;
      }

      &.left {
        left: 10px;
        transform: rotate(180deg);
      }
    }

    &:after {
      content: '010110 010100 010110 010100 010110';
    }
  }
`;

const Card = () => {
  console.log('run');
  return (
    <MainWrapper>
      <p className="binary top" />
      <p className="binary side right" />
      <p className="binary bottom" />
      <p className="binary side left" />
    </MainWrapper>
  );
};

export default Card;
