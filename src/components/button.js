import styled, { keyframes } from 'styled-components';

const shimmerAnimation = () => keyframes`
  to {
    background-size: 100% 100%;
    box-shadow: -2px -2px 6px rgba(255, 227, 126, 0.5), 2px 2px 6px rgba(144, 148, 255, 0.5);
`;

const StyledButton = styled.button`
  animation: 1.5s ease infinite alternate running ${shimmerAnimation};
  background: linear-gradient(90deg, #FFE27D 0%, #64E3FF 30%, #9192FF 85%);
  background-size: 200% 100%;
  border: none;
	border-radius: 4px;
  box-shadow: -2px -2px 10px rgba(255, 227, 126, 0.5), 2px 2px 10px rgba(144, 148, 255, 0.5);
  color: #170F1E;
  cursor: pointer;
	font-family: 'JetBrains Mono', sans-serif;
  font-size: 16px;
	font-weight: 500;
  line-height: 24px;
  overflow: hidden;
  padding: 8px 16px;
  position: relative;
  text-decoration: none;
  text-transform: uppercase;
  transition: 0.2s;
  
  svg {
    left: -20px;
    opacity: 0.5;
    position: absolute;
    top: -2px;
    transition: 0.5s cubic-bezier(.5,-0.5,.5,1.5);
  }
  
  &:hover svg {
    opacity: 0.8;
    transform: translateX(50px) scale(1.5);
  }
  
  &:hover {
    transform: rotate(2deg);
  }
  
  &:active {
    transform: scale(0.95) rotate(2deg);
  }

}`;

const Button = (props) => (
  <StyledButton onClick={props.onClick}>
    {props.children}
    <svg
      width="79"
      height="46"
      viewBox="0 0 79 46"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g filter="url(#filter0_f_618_1123)">
        <path
          d="M42.9 2H76.5L34.5 44H2L42.9 2Z"
          fill="url(#paint0_linear_618_1123)"
        />
      </g>
      <defs>
        <filter
          id="filter0_f_618_1123"
          x="0"
          y="0"
          width="78.5"
          height="46"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur
            stdDeviation="1"
            result="effect1_foregroundBlur_618_1123"
          />
        </filter>
        <linearGradient
          id="paint0_linear_618_1123"
          x1="76.5"
          y1="2.00002"
          x2="34.5"
          y2="44"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" stopOpacity="0.6" />
          <stop offset="1" stopColor="white" stopOpacity="0.05" />
        </linearGradient>
      </defs>
    </svg>
  </StyledButton>
);

export default Button;
