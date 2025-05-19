import { forwardRef } from 'react';

import { type IconProps } from '../Icon.types';

const FlagIE = forwardRef<SVGSVGElement, IconProps>(({ size = 32 }, ref) => (
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
      <path fill="#eee" d="M167 0h178l25.9 252.3L345 512H167l-29.8-253.4z" />
      <path fill="#6da544" d="M0 0h167v512H0z" />
      <path fill="#ff9811" d="M345 0h167v512H345z" />
    </g>
  </svg>
));

FlagIE.displayName = '@do/kraken/icons/flags/FlagIE (flag)';

export default FlagIE;
