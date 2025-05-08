import { forwardRef } from 'react';

import { type IconProps } from '../Icon.types';

const FlagJP = forwardRef<SVGSVGElement, IconProps>(({ size = 32 }, ref) => (
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
      <path fill="#eee" d="M0 0h512v512H0z" />
      <circle cx="256" cy="256" r="111.3" fill="#d80027" />
    </g>
  </svg>
));

FlagJP.displayName = '@do/kraken/icons/flags/FlagJP (flag)';

export default FlagJP;
