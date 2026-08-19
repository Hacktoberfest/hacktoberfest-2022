import styled from 'styled-components';

import Button from 'components/Button';
import Shell from 'components/Shell';
import { breakpoints, colors, fonts } from 'styles/tokens';

export const FormatsRoot = styled.section`
  padding-block: clamp(80px, 9vw, 124px);
  border-bottom: 2px solid ${colors.ink};
  background: ${colors.paper};
`;

export const SupportRoot = styled(FormatsRoot)`
  background: ${colors.paperDeep};
`;

export const SectionIntro = styled(Shell)`
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 40px;
  margin-bottom: 50px;

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

export const SectionHeading = styled.h2`
  margin: 13px 0 0;
  font-family: ${fonts.display};
  font-size: clamp(2.6rem, 4.8vw, 4.5rem);
  font-weight: 800;
  letter-spacing: -0.04em;
  line-height: 0.94;
  text-wrap: balance;

  @media (min-width: ${breakpoints.tablet}) {
    max-width: 14ch;
  }

  em {
    color: ${colors.orange};
    font-family: inherit;
    font-style: normal;
    font-weight: inherit;
  }
`;

export const SectionIntroCopy = styled.p`
  max-width: 48ch;
  margin: 0;
  color: #34433f;
`;

export const FormatGrid = styled(Shell)`
  display: grid;
  grid-template-columns: 1fr;
  gap: 18px;

  @media (min-width: ${breakpoints.tablet}) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

export const FormatCard = styled.article`
  display: flex;
  flex-direction: column;
  padding: 30px;
  border: 2px solid ${colors.ink};
  background: ${colors.white};
  box-shadow: 7px 7px 0 ${colors.maroon};
`;

export const FormatCardTag = styled.span`
  align-self: flex-start;
  padding: 5px 10px;
  color: ${colors.white};
  border-radius: 6px;
  background: ${colors.ink};
  font-family: ${fonts.mono};
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

export const FormatCardTitle = styled.h3`
  margin: 22px 0 0;
  font-family: ${fonts.display};
  font-size: clamp(2.05rem, 3vw, 3rem);
  font-weight: 700;
  letter-spacing: -0.035em;
  line-height: 0.95;
`;

export const FormatCardCopy = styled.p`
  margin: 18px 0 0;
  color: ${colors.ink};
  font-size: 0.93rem;
  text-wrap: pretty;
`;

/* The at-a-glance facts, moved inside each card: the old comparison
   table's cell vocabulary (mono values, hairline rows) without saying
   everything twice. The auto margin pins both cards' facts to a shared
   bottom edge; the padding keeps a floor under the copy when the cards
   are the same height. */
export const FormatCardFacts = styled.dl`
  margin: auto 0 0;
  padding-top: 26px;
`;

export const FormatCardFactRow = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 16px;
  padding-block: 9px;
  border-top: 1px solid rgba(16, 32, 29, 0.22);

  &:first-child {
    border-top-width: 2px;
    border-top-color: ${colors.ink};
  }

  dt {
    margin: 0;
    font-size: 0.9rem;
    font-weight: 600;
  }

  dd {
    margin: 0;
    font-family: ${fonts.mono};
    font-size: 0.85rem;
    font-weight: 650;
    text-align: right;
  }
`;

export const SupportGrid = styled(Shell)`
  display: grid;
  grid-template-columns: 1fr;
  gap: 26px 40px;

  @media (min-width: ${breakpoints.tablet}) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

export const SupportItem = styled.div`
  padding-top: 16px;
  border-top: 2px solid ${colors.ink};
`;

export const SupportItemTitle = styled.h3`
  margin: 0;
  font-family: ${fonts.mono};
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
`;

export const SupportItemCopy = styled.p`
  max-width: 52ch;
  margin: 10px 0 0;
  color: #34433f;
  font-size: 0.93rem;
  text-wrap: pretty;
`;

export const GuideBand = styled(Shell)`
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 22px;
  margin-top: 56px;
  padding: 30px;
  border: 2px solid ${colors.ink};
  background: ${colors.white};
  box-shadow: 7px 7px 0 ${colors.maroon};

  @media (min-width: ${breakpoints.tablet}) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
`;

export const GuideCopy = styled.p`
  max-width: 46ch;
  margin: 0;
  font-size: 0.95rem;
  text-wrap: pretty;
`;

/* Outline demotion: the apply CTA one screen later stays the page's
   only loud button. */
export const GuideButton = styled(Button)`
  background: transparent;
  box-shadow: none;

  &:hover {
    background: ${colors.pinkLight};
    box-shadow: none;
  }
`;

export const ApplyRoot = styled.section`
  padding-block: clamp(80px, 9vw, 124px);
  color: ${colors.white};
  border-bottom: 2px solid ${colors.ink};
  background: ${colors.forest};
`;

export const ApplyInner = styled(Shell)`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

export const ApplyEyebrow = styled(Eyebrow)`
  color: ${colors.pinkLight};
`;

export const ApplyHeading = styled.h2`
  margin: 13px 0 0;
  font-family: ${fonts.display};
  font-size: clamp(2.6rem, 4.8vw, 4.5rem);
  font-weight: 800;
  letter-spacing: -0.04em;
  line-height: 0.94;
  text-wrap: balance;

  /* Sky for the accent, matching PageHero: orange reads muddy on the
     forest ground at display sizes. */
  em {
    color: ${colors.sky};
    font-family: inherit;
    font-style: normal;
    font-weight: inherit;
  }
`;

export const ApplyBody = styled.p`
  max-width: 52ch;
  margin: 22px 0 0;
  text-wrap: pretty;
`;

/* The organizer journey inside the apply band: three numbered steps
   between the pitch and the button. */
export const StepsList = styled.ol`
  display: grid;
  width: 100%;
  max-width: 880px;
  margin: 44px 0 0;
  padding: 0;
  gap: 22px;
  list-style: none;
  text-align: left;

  @media (min-width: ${breakpoints.tablet}) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 34px;
  }
`;

export const StepItem = styled.li`
  padding-top: 14px;
  border-top: 2px solid rgba(247, 247, 242, 0.35);
`;

export const StepNumber = styled.span`
  display: block;
  color: ${colors.sky};
  font-family: ${fonts.mono};
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.08em;
`;

export const StepTitle = styled.h3`
  margin: 8px 0 0;
  font-family: ${fonts.display};
  font-size: 1.45rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1;
`;

export const StepCopy = styled.p`
  margin: 8px 0 0;
  color: rgba(247, 247, 242, 0.82);
  font-size: 0.9rem;
  text-wrap: pretty;
`;

export const ApplyButton = styled(Button)`
  margin-top: 34px;
`;
