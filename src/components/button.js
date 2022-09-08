import { forwardRef } from 'react';
import styled, { keyframes } from 'styled-components';

const shimmerAnimation = () => keyframes`
  to {
    background-size: 100% 100%;
  }
`;

export const StyledButton = styled.button`
  margin-top: ${(props) => props.spacing_top};
  margin: ${(props) => props.spacing_all};
  display: inline-block;
  max-width: 100%;

  &.wrapper_special {
    filter: ${(props) => props.theme.glowLiteDS};
  }
  
  .btn {
    background: ${(props) =>
      props.theme[props.color_bg] || props.color_bg || props.theme.text};
    border: none;
    border-radius: 2px;
    clip-path: polygon(12px 0, 100% 0, 100% 72%, calc(100% - 12px) 100%, 0 100%, 0 12px);
    color: ${(props) =>
      props.theme[props.color_text] || props.color_text || props.theme.body};
    cursor: pointer;
    font-family: 'JetBrains Mono', sans-serif;
    font-size: 16px;
    font-weight: 500;
    line-height: 24px;
    display: inline-block;
    overflow: hidden;
    padding: 8px 18px;
    text-decoration: none;
    transition: 0.2s;

    &:active {
      transform: scale(0.95);
    }
  }

  .special {
    filter: ${(props) => props.theme.glowLiteDS};
      animation: 1.5s ease infinite alternate running ${shimmerAnimation};
      background: linear-gradient(90deg, ${(props) => props.theme.spark} 0%, ${(
  props
) => props.theme.surf} 30%, ${(props) => props.theme.psybeam} 85%);
      background-size: 200% 100%;
      color: #170F1E;

      svg {
        left: -24px;
        opacity: 0.3;
        position: absolute;
        top: -2px;
        transition: 0.4s cubic-bezier(.5,-0.5,.5,1.5);
      }

      &:hover {
        transform: rotate(2deg);
      }
    
      &:active {
        transform: scale(0.95) rotate(2deg);
      }
    
      &:hover svg {
        opacity: 0.8;
        transform: translateX(50px) scale(2);
      }
    } 
  }
`;

const Button = forwardRef((props, ref) => {
  if (props.special) {
    return (
      <StyledButton
        className="wrapper_special"
        {...props}
        spacing_top={props.spacing_top}
        spacing_all={props.spacing_all}
        ref={ref}
      >
        <div className="btn special">
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
        </div>
      </StyledButton>
    );
  } else {
    return (
      <StyledButton
        color_bg={props.color_bg}
        color_text={props.color_text}
        spacing_top={props.spacing_top}
        spacing_all={props.spacing_all}
        {...props}
        ref={ref}
      >
        <div className="btn">{props.children}</div>
      </StyledButton>
    );
  }
});

export default Button;
