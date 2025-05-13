import { forwardRef } from 'react';

import { type IconProps } from '../Icon.types';

const FlagAT = forwardRef<SVGSVGElement, IconProps>(({ size = 32 }, ref) => (
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
        d="M0 0h512v167l-23.2 89.7L512 345v167H0V345l29.4-89L0 167z"
      />
      <path fill="#eee" d="M0 167h512v178H0z" />
    </g>
  </svg>
));

FlagAT.displayName = '@do/kraken/icons/flags/FlagAT (flag)';

export default FlagAT;
