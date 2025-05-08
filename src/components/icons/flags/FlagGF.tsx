import { forwardRef } from 'react';

import { type IconProps } from '../Icon.types';

const FlagGF = forwardRef<SVGSVGElement, IconProps>(({ size = 32 }, ref) => (
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
      <path fill="#6da544" d="m0 0 216.9 301.6L512 512V0z" />
      <path fill="#ffda44" d="m0 0 512 512H0z" />
      <path fill="#d80027" d="m256 121 90 270-234-168h288L166 391z" />
    </g>
  </svg>
));

FlagGF.displayName = '@do/kraken/icons/flags/FlagGF (flag)';

export default FlagGF;
