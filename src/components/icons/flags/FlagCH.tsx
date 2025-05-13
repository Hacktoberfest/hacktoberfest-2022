import { forwardRef } from 'react';

import { type IconProps } from '../Icon.types';

const FlagCH = forwardRef<SVGSVGElement, IconProps>(({ size = 32 }, ref) => (
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
      <path fill="#d80027" d="M0 0h512v512H0z" />
      <path
        fill="#eee"
        d="M389.6 211.5h-89v-89h-89.1v89h-89v89h89v89h89v-89h89z"
      />
    </g>
  </svg>
));

FlagCH.displayName = '@do/kraken/icons/flags/FlagCH (flag)';

export default FlagCH;
