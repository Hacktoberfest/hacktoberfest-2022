import styled, { keyframes } from 'styled-components';

const textAnimation = () => keyframes`
  25% {
    content: "01001111 00111010"; // O:
  }
  50% {
    content: "00111011 00101001"; // ;)
  }
  75% {
    content: "01000111 01001100"; // GL
  }
  100% {
    content: "01001000 01000110"; // HF
  }
`;

const StyledA = styled.a`
  color: ${(props) => props.theme.text};
  display: flex;
  gap: 16px;
  opacity: 0.5;
  font-family: 'JetBrains Mono', monospace;
  font-size: 16px;
  line-height: 24px;
  transition: 0.2s ease;

  &:after {
    content: '00111010 00101001'; // :)
  }

  &:hover {
    opacity: 1;
    filter: ${(props) => props.theme.glowLiteDS};

    &:after {
      animation: ${textAnimation} 1s linear infinite;

      @media (prefers-reduced-motion) {
        animation-play-state: paused;
      }
    }
  }
`;

const Anchor = (props) => {
  return (
    <StyledA href={props.href} id={props.id}>
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0.5 2C0.5 1.17157 1.17157 0.5 2 0.5H22C22.8284 0.5 23.5 1.17157 23.5 2V22C23.5 22.8284 22.8284 23.5 22 23.5H8.82843C8.4306 23.5 8.04907 23.342 7.76777 23.0607L0.939339 16.2322C0.658035 15.9509 0.5 15.5694 0.5 15.1716V2Z"
          stroke="currentColor"
        />
      </svg>
    </StyledA>
  );
};

export default Anchor;
