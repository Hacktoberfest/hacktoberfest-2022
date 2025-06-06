import { forwardRef } from 'react';

import { type IconProps } from '../Icon.types';

const FlagGN = forwardRef<SVGSVGElement, IconProps>(({ size = 32 }, ref) => (
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
      <path fill="#ffda44" d="M167 0h178l25.9 252.3L345 512H167l-29.8-253.4z" />
      <path fill="#d80027" d="M0 0h167v512H0z" />
      <path fill="#6da544" d="M345 0h167v512H345z" />
    </g>
  </svg>
));

FlagGN.displayName = '@do/kraken/icons/flags/FlagGN (flag)';

export default FlagGN;
