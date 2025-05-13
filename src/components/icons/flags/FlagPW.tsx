import { forwardRef } from 'react';

import { type IconProps } from '../Icon.types';

const FlagPW = forwardRef<SVGSVGElement, IconProps>(({ size = 32 }, ref) => (
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
      <path fill="#338af3" d="M0 0h512v512H0z" />
      <circle cx="200.3" cy="256" r="111.3" fill="#ffda44" />
    </g>
  </svg>
));

FlagPW.displayName = '@do/kraken/icons/flags/FlagPW (flag)';

export default FlagPW;
