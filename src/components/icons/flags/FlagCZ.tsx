import { forwardRef } from 'react';

import { type IconProps } from '../Icon.types';

const FlagCZ = forwardRef<SVGSVGElement, IconProps>(({ size = 32 }, ref) => (
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
      <path fill="#eee" d="M0 0h512v256l-265 45.2z" />
      <path fill="#d80027" d="M210 256h302v256H0z" />
      <path fill="#0052b4" d="M0 0v512l256-256L0 0z" />
    </g>
  </svg>
));

FlagCZ.displayName = '@do/kraken/icons/flags/FlagCZ (flag)';

export default FlagCZ;
