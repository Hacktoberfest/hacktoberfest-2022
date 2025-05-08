import { forwardRef } from 'react';

import { type IconProps } from '../Icon.types';

const FlagTO = forwardRef<SVGSVGElement, IconProps>(({ size = 32 }, ref) => (
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
      <path fill="#d80027" d="M0 256 256 0h256v512H0z" />
      <path fill="#eee" d="M0 0h256v256H0z" />
      <path
        fill="#d80027"
        d="M167 133.6v-33.4h-33.4v33.4h-33.4V167h33.4v33.3H167V167h33.3v-33.4z"
      />
    </g>
  </svg>
));

FlagTO.displayName = '@do/kraken/icons/flags/FlagTO (flag)';

export default FlagTO;
