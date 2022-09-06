import styled, { keyframes } from 'styled-components';

import sparkle from 'img/sparkle-5.gif';

const StyledDiv = styled.div``;

const textAnimation = () => keyframes`
  25% {
    content:
      "01001000 01100001 01100011 01101011" " "
      "01001000 01100001 01100011 01101011" " "
      "01001000 01100001 01100011 01101011"; // Hack
  }
  50% {
    content:
      "01000111 01101001 01110100 00100001" " "
      "01000111 01101001 01110100 00100001" " "
      "01000111 01101001 01110100 00100001"; // Git!
  }
  75% {
    content:
      "01000110 01100101 01110011 01110100" " "
      "01000110 01100101 01110011 01110100" " "
      "01000110 01100101 01110011 01110100"; // Fest
  }
  100% {
    content:
      "01000111 01001100 01001000 01000110" " "
      "01000111 01001100 01001000 01000110" " "
      "01000111 01001100 01001000 01000110"; // GLHF
  }
`;

const dividerAnimation = () => keyframes`
  25% {
    transform: scaleX(0.8);
  }
  50% {
    transform: scaleX(0.3);
  }
  75% {
    transform: scaleX(0.5);
  }
`;

const MainWrapper = styled(StyledDiv)`
  background: linear-gradient(
    180deg,
    ${(props) => props.theme[props.primary]} 0%,
    ${(props) => props.theme[props.secondary]} 100%
  );
  border: 4px solid ${(props) => props.theme[props.secondary]};
  border-radius: 24px;
  box-shadow: 0px 0px 12px ${(props) => props.theme[props.secondary]};
  min-height: 354px;
  min-width: 304px;
  padding: 40px 40px 48px 48px;
  position: relative;
  transition: 0.4s cubic-bezier(0.8, -1, 0.2, 1.5);

  &:hover {
    box-shadow: 0px 0px 25px ${(props) => props.theme[props.secondary]},
      0px 0px 8px 2px ${(props) => props.theme[props.secondary]};
    transform: translateY(-12px);

    .binary:after {
      animation: ${textAnimation} 1s linear infinite;
    }
  }

  &:after {
    background-image: url(${sparkle.src});
    border-radius: inherit;
    content: '';
    height: 100%;
    left: 0;
    mix-blend-mode: color-dodge;
    opacity: 0.5;
    pointer-events: none;
    position: absolute;
    top: 0;
    width: 100%;
  }

  .divider {
    background: #170f1e;
    height: 1px;
    margin: 12px 0;
    position: relative;
    width: 100%;

    &:after {
      animation: ${dividerAnimation} 4s ${(props) => props.delay} ease infinite;
      background: ${(props) => props.theme[props.secondary]};
      content: '';
      height: 1px;
      left: 0;
      position: absolute;
      top: 0;
      transform-origin: top left;
      width: 100%;
    }
  }

  h3 {
    color: #170f1e;
    text-shadow: none;
  }

  p {
    color: #170f1e;
    font-family: 'JetBrains Mono', monospace;
    text-shadow: none;

    &:not(.binary) {
      margin-top: 24px;
    }
  }

  .binary {
    color: ${(props) => props.theme[props.secondary]};
    font-size: 12px;
    pointer-events: none;
    position: absolute;
    text-align: center;
    width: 100%;
    -webkit-mask-image: linear-gradient(
      90deg,
      rgba(0, 0, 0, 0) 5%,
      rgba(0, 0, 0, 1) 20%,
      rgba(0, 0, 0, 1) 80%,
      rgba(0, 0, 0, 0) 95%
    );
    mask-image: linear-gradient(
      90deg,
      rgba(0, 0, 0, 0) 5%,
      rgba(0, 0, 0, 1) 20%,
      rgba(0, 0, 0, 1) 80%,
      rgba(0, 0, 0, 0) 95%
    );
    white-space: nowrap;
    overflow: hidden;

    &.top {
      left: 0;
      top: 10px;
    }

    &.bottom {
      bottom: 10px;
      color: ${(props) => props.theme[props.primary]};
      left: 0;
      transform: rotate(180deg);
    }

    &.side {
      height: 100%;
      text-align: center;
      top: 0;
      width: auto;
      writing-mode: vertical-rl;
      -webkit-mask-image: linear-gradient(
        0deg,
        rgba(0, 0, 0, 0) 5%,
        rgba(0, 0, 0, 1) 20%,
        rgba(0, 0, 0, 1) 80%,
        rgba(0, 0, 0, 0) 95%
      );
      mask-image: linear-gradient(
        0deg,
        rgba(0, 0, 0, 0) 5%,
        rgba(0, 0, 0, 1) 20%,
        rgba(0, 0, 0, 1) 80%,
        rgba(0, 0, 0, 0) 95%
      );

      &.right {
        right: 10px;
      }

      &.left {
        left: 10px;
        transform: rotate(180deg);
      }
    }

    &:after {
      content: '00111010 00101101 00101001 00101001' ' '
        '00111010 00101101 00101001 00101001' ' '
        '00111010 00101101 00101001 00101001'; // :-))
    }
  }
`;

export const NewCard = (props) => {
  return (
    <MainWrapper id="card" primary={props.primary} secondary={props.secondary}>
      <p className="binary top large" />
      <p className="binary side right" />
      <p className="binary bottom" />
      <p className="binary side left" />
      <div className="content">{props.children}</div>
    </MainWrapper>
  );
};

const Card = (props) => {
  return (
    <MainWrapper
      delay={props.delay}
      primary={props.primary}
      secondary={props.secondary}
    >
      <p className="binary top" />
      <p className="binary side right" />
      <p className="binary bottom" />
      <p className="binary side left" />
      <h3>{props.title}</h3>
      <div className="divider" />
      <h3>*********</h3>
      <h1>{props.number}</h1>
    </MainWrapper>
  );
};

export default Card;
