import { WAYS_ONLINE_FORM } from 'data/typeforms.mjs';

import {
  Eyebrow,
  WaysButton,
  WaysCard,
  WaysCardCopy,
  WaysCardTitle,
  WaysGrid,
  WaysHeading,
  WaysIntro,
  WaysIntroCopy,
  WaysLink,
  WaysReward,
  WaysRoot,
  WaysTag,
} from './WaysInSection.styles';

const WAYS = [
  {
    tag: 'In person',
    title: 'Join a Fest near you.',
    copy: 'Build for a day with your local community and demo what you made.',
    reward:
      'Earn the limited-edition Hacktoberfest 2026 t-shirt, only available by attending in person.',
    cta: 'Find a Fest near you',
    href: '/fests/',
  },
  {
    tag: 'Online',
    title: 'Join from anywhere.',
    copy: 'Take on build challenges throughout October and join community events like Global Hack Week.',
    reward: 'Earn the 2026 sticker pack, mailed anywhere in the world.',
    cta: 'Join online',
    form: WAYS_ONLINE_FORM,
  },
];

const WaysInSection = () => (
  <WaysRoot id="take-part">
    <WaysIntro>
      <div>
        <Eyebrow>How to take part</Eyebrow>
        <WaysHeading>
          Two ways in. <em>Pick yours.</em>
        </WaysHeading>
      </div>
      <WaysIntroCopy>
        Browse the Fests happening near you, or sign up to hear about the online
        event.
      </WaysIntroCopy>
    </WaysIntro>

    <WaysGrid>
      {WAYS.map((way) => (
        <WaysCard key={way.tag}>
          <WaysTag>{way.tag}</WaysTag>
          <WaysCardTitle>{way.title}</WaysCardTitle>
          <WaysCardCopy>{way.copy}</WaysCardCopy>
          <WaysReward>{way.reward}</WaysReward>
          {way.href ? (
            <WaysLink href={way.href}>{way.cta}</WaysLink>
          ) : (
            <WaysButton form={way.form}>{way.cta}</WaysButton>
          )}
        </WaysCard>
      ))}
    </WaysGrid>
  </WaysRoot>
);

export default WaysInSection;
