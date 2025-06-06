import { forwardRef } from 'react';

import { type IconProps } from '../Icon.types';

const FlagTR = forwardRef<SVGSVGElement, IconProps>(({ size = 32 }, ref) => (
  <svg
    ref={ref}
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 512 512"
  >
    <mask id="a">
      <circle cx="256" cy="256" r="256" fill="#fff" />
    </mask>
    <g mask="url(#a)">
      <path fill="#d80027" d="M0 0h512v512H0z" />
      <g fill="#eee">
        <path d="m350 182 33 46 54-18-33 46 33 46-54-18-33 46v-57l-54-17 54-18v-56Z" />
        <path d="M260 370a114 114 0 1 1 54-215 141 141 0 1 0 0 202c-17 9-35 13-54 13Z" />
      </g>
    </g>
  </svg>
));

FlagTR.displayName = '@do/kraken/icons/flags/FlagTR (flag)';

export default FlagTR;
