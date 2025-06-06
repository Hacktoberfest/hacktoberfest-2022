import { forwardRef } from 'react';

import { type IconProps } from '../Icon.types';

const FlagLT = forwardRef<SVGSVGElement, IconProps>(({ size = 32 }, ref) => (
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
      <path
        fill="#6da544"
        d="m0 167 253.8-19.3L512 167v178l-254.9 32.3L0 345z"
      />
      <path fill="#ffda44" d="M0 0h512v167H0z" />
      <path fill="#d80027" d="M0 345h512v167H0z" />
    </g>
  </svg>
));

FlagLT.displayName = '@do/kraken/icons/flags/FlagLT (flag)';

export default FlagLT;
