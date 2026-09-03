import styled from 'styled-components';

import Button from 'components/Button';
import Shell from 'components/Shell';
import { schedule } from 'data/content.mjs';
import { breakpoints, colors, fonts } from 'styles/tokens';

/* The band that closes /schedule, sending someone who would rather be in a
   room to the Fests directory. The mirror image of HostCallout, which closes
   /fests by turning a fruitless search into an invitation to host — same
   full-bleed treatment and the same white card on it, so the two pages end
   the same way.

   Its own component rather than a reuse of HostCallout: that one's copy is
   about hosting a Fest, and parameterising it would leave both pages sharing
   strings neither wants.

   Static markup in the page, deliberately outside ScheduleDirectory, so it is
   in the export and on screen whatever the directory's client-side fetch is
   doing — loading, error, or a month with nothing published yet. Which is
   also why styled-components is fine here and not inside the directory. */

const CalloutRoot = styled.section`
  padding-block: clamp(48px, 6vw, 90px);
  border-block: 2px solid ${colors.ink};
  background: ${colors.sky};
`;

const CalloutBox = styled(Shell)`
  display: grid;
  gap: 24px;
  padding: clamp(26px, 4vw, 44px);
  border: 2px solid ${colors.ink};
  background: ${colors.white};
  /* skyDeep rather than the cards' maroon, matching HostCallout: the shadow
     colour is what marks a callout box out as a different kind of thing. */
  box-shadow: 6px 6px 0 ${colors.skyDeep};

  @media (min-width: ${breakpoints.desktop}) {
    align-items: center;
    grid-template-columns: 1.6fr 1fr;
  }
`;

const Title = styled.h2`
  margin: 0;
  font-family: ${fonts.display};
  font-size: clamp(1.8rem, 3.4vw, 2.6rem);
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1;
  text-wrap: balance;
`;

const Body = styled.p`
  max-width: 54ch;
  margin: 14px 0 0;
  color: ${colors.inkSoft};
`;

const Actions = styled.div`
  display: flex;

  @media (min-width: ${breakpoints.desktop}) {
    justify-content: end;
  }
`;

const ScheduleCallout = () => (
  <CalloutRoot aria-labelledby="schedule-fests-callout">
    <CalloutBox>
      <div>
        <Title id="schedule-fests-callout">{schedule.festsCallout.title}</Title>
        <Body>{schedule.festsCallout.body}</Body>
      </div>
      <Actions>
        <Button href="/fests/">{schedule.festsCallout.cta}</Button>
      </Actions>
    </CalloutBox>
  </CalloutRoot>
);

export default ScheduleCallout;
