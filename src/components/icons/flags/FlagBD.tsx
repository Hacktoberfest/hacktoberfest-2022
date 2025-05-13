import { forwardRef } from 'react';

import { type IconProps } from '../Icon.types';

const FlagBD = forwardRef<SVGSVGElement, IconProps>(({ size = 32 }, ref) => (
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
      <path fill="#496e2d" d="M0 0h512v512H0z" />
      <circle cx="200.3" cy="256" r="111.3" fill="#d80027" />
    </g>
  </svg>
));

FlagBD.displayName = '@do/kraken/icons/flags/FlagBD (flag)';

export default FlagBD;
