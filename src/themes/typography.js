import {
  breakpoints as bp,
  determineMediaQuery as mQ,
} from 'themes/breakpoints';
import { css } from 'styled-components';

const defaultBody = css`
  :where(a) {
    text-decoration: underline;

    &:hover {
      text-decoration: none;
    }
  }

  strong {
    font-weight: 700;
  }
`;

export const headline90 = css`
  font-size: 40px;
  font-style: normal;
  font-weight: 400;
  line-height: 44px; /* 110% */

  ${mQ(bp.desktop)} {
    font-size: 90px;
    line-height: 92px; /* 102.222% */
  }
`;

export const headline56 = css`
  font-size: 36px;
  font-style: normal;
  font-weight: 400;
  line-height: 40px; /* 111.111% */

  ${mQ(bp.desktop)} {
    font-size: 56px;
    line-height: 60px; /* 107.143% */
  }
`;

export const headline48 = css`
  font-size: 32px;
  font-style: normal;
  font-weight: 500;
  line-height: 38px; /* 118.75% */

  ${mQ(bp.desktop)} {
    font-size: 48px;
    line-height: 52px; /* 108.333% */
  }
`;

export const headline32 = css`
  font-size: 24px;
  font-style: normal;
  font-weight: 500;
  line-height: 30px; /* 125% */

  ${mQ(bp.desktop)} {
    font-size: 32px;
    line-height: 36px; /* 112.5% */
  }
`;

export const headline20 = css`
  font-size: 20px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px; /* 120% */

  ${mQ(bp.desktop)} {
    font-size: 20px;
    font-weight: 500;
    line-height: 24px; /* 120% */
  }
`;

export const body32 = css`
  font-style: normal;
  font-weight: 400;
  font-size: 32px;
  line-height: 42px; /* 131.25% */
`;

export const body20 = css`
  font-size: 20px;
  font-style: normal;
  font-weight: 400;
  line-height: 30px; /* 150% */
`;

export const body24 = css`
  font-size: 24px;
  font-style: normal;
  font-weight: 400;
  line-height: 34px; /* 141.667% */
`;

export const body18 = css`
  font-size: 18px;
  font-style: normal;
  font-weight: 400;
  line-height: 28px; /* 155.556% */
`;

export const body16 = css`
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 26px; /* 162.5% */
`;
