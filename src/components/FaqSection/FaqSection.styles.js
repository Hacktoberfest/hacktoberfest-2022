import styled, { css } from 'styled-components';

import Shell from 'components/Shell';
import TypeformButton from 'components/TypeformButton.mjs';
import { breakpoints, colors, fonts } from 'styles/tokens';

export const FaqRoot = styled.section`
  padding-block: clamp(80px, 9vw, 124px);
  border-bottom: 2px solid ${colors.ink};
  background: ${colors.paper};
`;

export const FaqIntro = styled(Shell)`
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

export const FaqHeading = styled.h2`
  margin: 13px 0 0;
  font-family: ${fonts.display};
  font-size: clamp(2.6rem, 4.8vw, 4.5rem);
  font-weight: 800;
  letter-spacing: -0.04em;
  line-height: 0.94;
  text-wrap: balance;

  @media (min-width: ${breakpoints.tablet}) {
    max-width: 12ch;
  }

  em {
    color: ${colors.orange};
    font-family: inherit;
    font-style: normal;
    font-weight: inherit;
  }
`;

// Same value as InvolvedIntroCopy, so the two intros read as one treatment.
export const FaqIntroCopy = styled.p`
  max-width: 48ch;
  margin: 0;
  color: #34433f;
`;

/* One panel rather than a card per question: five stacked offset shadows
   would be noisy, and a single ruled block reads as a printed index. */
export const FaqPanel = styled(Shell)`
  border: 2px solid ${colors.ink};
  background: ${colors.white};
  box-shadow: 7px 7px 0 ${colors.maroon};
`;

export const FaqItem = styled.details`
  & + & {
    border-top: 2px solid ${colors.ink};
  }

  /* Animate open/close by transitioning the built-in ::details-content
     wrapper between 0 and its natural height — interpolate-size is what
     lets "auto"-ish keywords interpolate at all. Browsers without support
     (Safari ≤ current, Firefox) ignore all of this and keep the instant
     native toggle, which is the designed fallback, not a bug. */
  @media (prefers-reduced-motion: no-preference) {
    interpolate-size: allow-keywords;

    &::details-content {
      block-size: 0;
      overflow-y: clip;
      transition:
        content-visibility 250ms allow-discrete,
        block-size 250ms ease;
    }

    &[open]::details-content {
      block-size: auto;
    }
  }
`;

export const FaqQuestion = styled.summary`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 22px 24px;
  cursor: pointer;
  /* Both lines are needed to drop the default triangle across browsers. */
  list-style: none;

  &::-webkit-details-marker {
    display: none;
  }
`;

export const FaqQuestionText = styled.h3`
  margin: 0;
  font-family: ${fonts.display};
  font-size: clamp(1.1rem, 2vw, 1.35rem);
  font-weight: 700;
  letter-spacing: -0.01em;
  line-height: 1.2;
`;

/* A "+" that turns into an "×" at 45°. It's a flex item, so it is blockified
   and the transform applies without setting display explicitly. */
export const FaqMarker = styled.span`
  flex: none;
  font-family: ${fonts.mono};
  font-size: 1.3rem;
  line-height: 1;

  &::before {
    content: '+';
  }

  details[open] & {
    transform: rotate(45deg);
  }

  @media (prefers-reduced-motion: no-preference) {
    transition: transform 150ms ease;
  }
`;

export const FaqAnswer = styled.p`
  margin: 0;
  padding: 0 24px 26px;
  color: #34433f;
  font-size: 0.95rem;
`;

/* Whenever an anchor and a popup trigger appear inline, they have to be
   indistinguishable: strip the button chrome and inherit the surrounding
   text. FaqLink has no live use in the current copy — the only link segments
   today are Typeform triggers — but stays for copy that links out. */
const inlineLink = css`
  color: inherit;
  font: inherit;
  text-decoration: underline;
  text-decoration-thickness: 2px;
  text-underline-offset: 3px;

  &:hover {
    color: ${colors.orangeDeep};
  }
`;

export const FaqLink = styled.a`
  ${inlineLink}
`;

/* The wink under the panel, tucked into the section's bottom-right corner.
   Set well clear of the panel — the offset shadow eats the first 7px, and
   this is an aside rather than part of the list. */
export const FaqLlmsNote = styled(Shell)`
  display: flex;
  justify-content: flex-end;
  margin-top: 40px;
`;

export const FaqLlmsLink = styled.a`
  color: ${colors.muted};
  font-family: ${fonts.mono};
  font-size: 0.72rem;
  font-weight: 400;
  letter-spacing: 0.04em;
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 3px;

  &:hover {
    color: ${colors.ink};
  }
`;

export const FaqFormLink = styled(TypeformButton)`
  ${inlineLink}
  appearance: none;
  padding: 0;
  border: 0;
  background: none;
  cursor: pointer;
`;
