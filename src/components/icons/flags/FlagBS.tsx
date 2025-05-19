import { forwardRef } from 'react';

import { type IconProps } from '../Icon.types';

const FlagBS = forwardRef<SVGSVGElement, IconProps>(({ size = 32 }, ref) => (
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
      <path fill="#338af3" d="M0 0h512v167l-37.4 89 37.4 89v167H0l49.6-252z" />
      <path fill="#ffda44" d="M108.3 167H512v178H108.3z" />
      <path fill="#333" d="M0 0v512l256-256L0 0z" />
    </g>
  </svg>
));

FlagBS.displayName = '@do/kraken/icons/flags/FlagBS (flag)';

export default FlagBS;
