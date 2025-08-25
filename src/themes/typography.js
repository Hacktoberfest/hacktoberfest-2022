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
  font-size: 40px;
  font-style: normal;
  font-weight: 400;
  line-height: 50px; /* 125% */

  ${mQ(bp.desktop)} {
    font-size: 56px;
    line-height: 64px; /* 114.286% */
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

export const headline40 = css`
  font-size: 32px;
  font-style: normal;
  font-weight: 800;
  line-height: 40px; /* 125% */

  ${mQ(bp.desktop)} {
    font-size: 40px;
    line-height: 50px; /* 125% */
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

export const headline1 = css`
  font-family: 'Atkinson Hyperlegible Mono';
  font-weight: 800;
  font-size: 40px;
  line-height: 50px; /* 125% */
  letter-spacing: -1.2px;

  ${mQ(bp.desktop)} {
    font-size: 56px;
    line-height: 64px; /* 114.286% */
    letter-spacing: -2.24px;
  }
`;

export const headline2 = css`
  font-family: 'Atkinson Hyperlegible Mono';
  font-weight: 800;
  font-size: 32px;
  line-height: 40px; /* 125% */
  letter-spacing: -0.96px;

  ${mQ(bp.desktop)} {
    font-size: 48px;
    line-height: normal;
    letter-spacing: -1.44px;
  }
`;

/* H3-40 */
export const headline3 = css`
  font-family: 'Atkinson Hyperlegible Mono';
  font-weight: 800;
  font-size: 32px;
  line-height: 40px; /* 125% */
  letter-spacing: -0.96px;

  ${mQ(bp.desktop)} {
    font-size: 40px;
    line-height: 50px; /* 125% */
    letter-spacing: -1.2px;
  }
`;

/* H4-32 */
export const headline4 = css`
  font-family: 'Atkinson Hyperlegible Mono';
  font-weight: 800;
  font-size: 24px;
  line-height: 30px;
  letter-spacing: -0.72px;

  ${mQ(bp.desktop)} {
    font-size: 32px;
    line-height: 40px; /* 125% */
    letter-spacing: -0.96px;
  }
`;

/* H5-24 */
export const headline5 = css`
  font-family: 'Atkinson Hyperlegible Mono';
  font-size: 24px;
  font-weight: 800;
  line-height: 30px; /* 125% */
  letter-spacing: -0.72px;
`;

/* Text-XL/24-Regular */
export const textXl = css`
  font-family: 'Atkinson Hyperlegible';
  font-size: 24px;
  font-weight: 400;
  line-height: normal;
  letter-spacing: 0.48px;
`;

/* Text-Lg/18-Regular */
export const textLg = css`
  font-family: 'Atkinson Hyperlegible';
  font-size: 18px;
  font-weight: 400;
  line-height: normal;
  letter-spacing: 0.18px;
`;

/* Text-Base/16-Regular */
export const textBase = css`
  font-family: 'Atkinson Hyperlegible';
  font-size: 16px;
  font-weight: 400;
  line-height: 1.25;
  letter-spacing: 0.16px;
`;

/* Text-Sm/14-Regular */
export const textSm = css`
  font-family: 'Atkinson Hyperlegible';
  font-size: 14px;
  font-weight: 400;
  line-height: 1.2857142857;
  letter-spacing: 0.14px;
`;
