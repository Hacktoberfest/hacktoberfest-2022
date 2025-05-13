import { forwardRef } from 'react';

import { type IconProps } from '../Icon.types';

const FlagBG = forwardRef<SVGSVGElement, IconProps>(({ size = 32 }, ref) => (
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
        fill="#496e2d"
        d="m0 166.9 258-31.7 254 31.7v178l-251.4 41.3L0 344.9z"
      />
      <path fill="#eee" d="M0 0h512v166.9H0z" />
      <path fill="#d80027" d="M0 344.9h512V512H0z" />
    </g>
  </svg>
));

FlagBG.displayName = '@do/kraken/icons/flags/FlagBG (flag)';

export default FlagBG;
