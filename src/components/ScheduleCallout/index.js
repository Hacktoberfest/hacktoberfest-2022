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

const Cta = styled(Button)`
  margin-top: 22px;
`;

/* The print laid on the box, the treatment HostCallout gives /fests: a
   white mount inside the ink keyline, the maroon press-down shadow (the
   box's own is skyDeep, so the two never merge), a couple of degrees of
   tilt. Unlike HostCallout's, this one stays on phones, smaller and above
   the words: a room full of people is the argument, and the phone is
   where most people will read it. */
const Photo = styled.img`
  display: block;
  width: min(100%, 300px);
  height: auto;
  aspect-ratio: 3 / 2;
  padding: 8px;
  border: 2px solid ${colors.ink};
  background: ${colors.white};
  object-fit: cover;
  box-shadow: 7px 7px 0 ${colors.maroon};
  transform: rotate(-2deg);
  /* First on phones, so the picture opens the box; the grid puts it in
     the right-hand column from desktop up. */
  order: -1;

  @media (min-width: ${breakpoints.desktop}) {
    width: 100%;
    max-width: 380px;
    padding: 10px;
    order: 0;
    justify-self: end;
  }
`;

/* `to` is where the button lands: the directory from /schedule, whose
   reader already knows what a Fest is, and the in-person landing page
   from /online, whose reader does not. */
const ScheduleCallout = ({ to = 'fests' }) => (
  <CalloutRoot aria-labelledby="schedule-fests-callout">
    <CalloutBox>
      <div>
        <Title id="schedule-fests-callout">{schedule.festsCallout.title}</Title>
        <Body>{schedule.festsCallout.body}</Body>
        {to === 'in-person' ? (
          <Cta href="/in-person/">{schedule.festsCallout.inPersonCta}</Cta>
        ) : (
          <Cta href="/fests/">{schedule.festsCallout.cta}</Cta>
        )}
      </div>
      <Photo
        src={schedule.festsCallout.photo}
        alt={schedule.festsCallout.photoAlt}
        loading="lazy"
        width="640"
        height="427"
      />
    </CalloutBox>
  </CalloutRoot>
);

export default ScheduleCallout;
