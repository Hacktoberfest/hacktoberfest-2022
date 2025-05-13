import { forwardRef } from 'react';

import { type IconProps } from '../Icon.types';

const FlagGH = forwardRef<SVGSVGElement, IconProps>(({ size = 32 }, ref) => (
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
      <path fill="#ffda44" d="m0 167 256-32 256 32v178l-256 32L0 345Z" />
      <path fill="#d80027" d="M0 0h512v167H0Z" />
      <path fill="#496e2d" d="M0 345h512v167H0Z" />
      <path fill="#333" d="m198 345 151-109H163l151 109-58-178Z" />
    </g>
  </svg>
));

FlagGH.displayName = '@do/kraken/icons/flags/FlagGH (flag)';

export default FlagGH;
