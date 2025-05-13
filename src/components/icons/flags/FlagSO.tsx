import { forwardRef } from 'react';

import { type IconProps } from '../Icon.types';

const FlagSO = forwardRef<SVGSVGElement, IconProps>(({ size = 32 }, ref) => (
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
      <path
        fill="#eee"
        d="m256 133.6 27.6 85H373L300.7 271l27.6 85-72.3-52.5-72.3 52.6 27.6-85-72.3-52.6h89.4z"
      />
    </g>
  </svg>
));

FlagSO.displayName = '@do/kraken/icons/flags/FlagSO (flag)';

export default FlagSO;
