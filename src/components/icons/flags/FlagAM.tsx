import { forwardRef } from 'react';

import { type IconProps } from '../Icon.types';

const FlagAM = forwardRef<SVGSVGElement, IconProps>(({ size = 32 }, ref) => (
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
        fill="#0052b4"
        d="m0 166.9 253-26.7L512 167v178l-261.1 26L0 344.8z"
      />
      <path fill="#d80027" d="M0 0h512v166.9H0z" />
      <path fill="#ff9811" d="M0 344.9h512V512H0z" />
    </g>
  </svg>
));

FlagAM.displayName = '@do/kraken/icons/flags/FlagAM (flag)';

export default FlagAM;
