import { forwardRef } from 'react';

import { type IconProps } from '../Icon.types';

const FlagCG = forwardRef<SVGSVGElement, IconProps>(({ size = 32 }, ref) => (
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
      <path fill="#ffda44" d="M384 0h128v128L352 352 128 512H0V384l160-224Z" />
      <path fill="#6da544" d="M0 384 384 0H0Z" />
      <path fill="#d80027" d="M512 128 128 512h384z" />
    </g>
  </svg>
));

FlagCG.displayName = '@do/kraken/icons/flags/FlagCG (flag)';

export default FlagCG;
