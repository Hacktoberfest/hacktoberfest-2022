import { forwardRef } from 'react';

import { type IconProps } from '../Icon.types';

const FlagMC = forwardRef<SVGSVGElement, IconProps>(({ size = 32 }, ref) => (
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
      <path fill="#eee" d="m0 256 258.2-43.3L512 256v256H0z" />
      <path fill="#d80027" d="M0 0h512v256H0z" />
    </g>
  </svg>
));

FlagMC.displayName = '@do/kraken/icons/flags/FlagMC (flag)';

export default FlagMC;
