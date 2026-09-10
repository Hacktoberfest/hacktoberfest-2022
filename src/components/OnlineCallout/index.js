import styled from 'styled-components';

import Button from 'components/Button';
import Shell from 'components/Shell';
import { inPerson } from 'data/content.mjs';
import { breakpoints, colors, fonts } from 'styles/tokens';

import PackObject from 'components/WorldLanding/PackObject';

/* The band that closes /in-person: the fork for the reader with no Fest
   nearby, attend online or host one. The mirror image of ScheduleCallout,
   which closes /schedule and /online by pointing at the Fests: the same
   sky band and the same white card on it, so the two worlds end by
   pointing at each other. Where that one carries a photo of a room, this
   one carries the pack, which is the online offer. */
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
  flex-wrap: wrap;
  gap: 14px;
  margin-top: 22px;
`;

/* The pack at two thirds, and first on phones, the way the callout's
   photo is on /online. */
const Object = styled.div`
  order: -1;
  zoom: 0.66;

  @media (min-width: ${breakpoints.desktop}) {
    order: 0;
    zoom: 0.8;
    justify-self: end;
  }
`;

const OnlineCallout = () => (
  <CalloutRoot aria-labelledby="in-person-online-callout">
    <CalloutBox>
      <div>
        <Title id="in-person-online-callout">
          {inPerson.onlineCallout.title}
        </Title>
        <Body>{inPerson.onlineCallout.body}</Body>
        {/* Two doors for the reader with no Fest nearby: the other world,
            and becoming the reason their city has one. */}
        <Actions>
          <Button href="/online/">{inPerson.onlineCallout.cta}</Button>
          <Button href="/host/" $variant="outline">
            {inPerson.onlineCallout.secondaryCta}
          </Button>
        </Actions>
      </div>
      <Object aria-hidden="true">
        <PackObject />
      </Object>
    </CalloutBox>
  </CalloutRoot>
);

export default OnlineCallout;
