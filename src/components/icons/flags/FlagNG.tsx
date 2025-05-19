import { forwardRef } from 'react';

import { type IconProps } from '../Icon.types';

const FlagNG = forwardRef<SVGSVGElement, IconProps>(({ size = 32 }, ref) => (
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
        fill="#6da544"
        d="M0 0v512h160l96-64 96 64h160V0H352l-96 64-96-64Z"
      />
      <path fill="#eee" d="M160 0h192v512H160Z" />
    </g>
  </svg>
));

FlagNG.displayName = '@do/kraken/icons/flags/FlagNG (flag)';

export default FlagNG;
