import { forwardRef } from 'react';

import { type IconProps } from '../Icon.types';

const FlagPE = forwardRef<SVGSVGElement, IconProps>(({ size = 32 }, ref) => (
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
        fill="#d80027"
        d="M0 0h167l86 41.2L345 0h167v512H345l-87.9-41.4L167 512H0z"
      />
      <path fill="#eee" d="M167 0h178v512H167z" />
    </g>
  </svg>
));

FlagPE.displayName = '@do/kraken/icons/flags/FlagPE (flag)';

export default FlagPE;
