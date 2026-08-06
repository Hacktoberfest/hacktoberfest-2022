import styled from 'styled-components';

import Shell from 'components/Shell';
import { breakpoints, colors, fonts } from 'styles/tokens';

export const CurriculumRoot = styled.section`
  padding-block: clamp(80px, 9vw, 124px);
  border-bottom: 2px solid ${colors.ink};
  color: ${colors.white};
  background: ${colors.forestDeep};
`;

export const CurriculumIntro = styled(Shell)`
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 45px;

  @media (min-width: ${breakpoints.tablet}) {
    flex-direction: row;
    align-items: end;
    justify-content: space-between;
  }
`;

export const Eyebrow = styled.p`
  margin: 0;
  font-family: ${fonts.mono};
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

export const CurriculumHeading = styled.h2`
  max-width: 11ch;
  margin: 13px 0 0;
  font-family: ${fonts.display};
  font-size: clamp(2.6rem, 4.8vw, 4.5rem);
  font-weight: 800;
  letter-spacing: -0.04em;
  line-height: 0.94;
  text-wrap: balance;

  em {
    color: ${colors.sky};
    font-family: inherit;
    font-style: normal;
    font-weight: inherit;
  }
`;

export const CurriculumIntroCopy = styled.p`
  max-width: 49ch;
  margin: 0;
  color: ${colors.white};
`;

export const CurriculumGrid = styled(Shell)`
  display: grid;
  grid-template-columns: 1fr;
  gap: 13px;
  margin-top: 55px;

  @media (min-width: ${breakpoints.tablet}) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

export const CurriculumCard = styled.article`
  display: grid;
  min-height: 290px;
  grid-template-rows: auto 1fr auto;
  padding: clamp(27px, 4vw, 43px);
  border: 2px solid ${colors.white};
  background: ${colors.forest};
  box-shadow: 7px 7px 0 ${colors.maroon};

  @media (min-width: ${breakpoints.tablet}) {
    min-height: 310px;
  }

  &:nth-of-type(2) {
    background: ${colors.maroon};
  }

  &:nth-of-type(3) {
    background: ${colors.skyDeep};
  }

  &:nth-of-type(4) {
    background: ${colors.ochreDeep};
  }
`;

export const CurriculumNumber = styled.span`
  color: ${colors.pinkLight};
  font-family: ${fonts.mono};
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.1em;

  ${CurriculumCard}:nth-of-type(2) & {
    color: ${colors.orangeLight};
  }

  ${CurriculumCard}:nth-of-type(3) & {
    color: ${colors.white};
  }

  ${CurriculumCard}:nth-of-type(4) & {
    color: ${colors.skyLight};
  }
`;

export const CurriculumCardTitle = styled.h3`
  max-width: 14ch;
  align-self: end;
  margin-top: 70px;
  font-family: ${fonts.display};
  font-size: clamp(1.85rem, 2.8vw, 2.7rem);
  font-weight: 700;
  letter-spacing: -0.03em;
  line-height: 0.96;
`;

export const CurriculumCardCopy = styled.p`
  max-width: 42ch;
  margin-top: 19px;
  color: ${colors.white};
  font-size: 0.93rem;
`;

export const CurriculumTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
  margin-top: 26px;
`;

export const CurriculumTag = styled.span`
  padding: 5px 9px;
  border: 1px solid ${colors.white};
  color: ${colors.white};
  font-family: ${fonts.mono};
  font-size: 0.61rem;
`;
