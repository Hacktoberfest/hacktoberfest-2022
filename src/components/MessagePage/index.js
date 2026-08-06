import { DecoTopLeft, DecoTopRight } from 'components/Hero/Hero.styles';
import { StairsLeft, StairsRight } from 'components/Hero/HeroGeometry';

import {
  Eyebrow,
  MessageButton,
  MessageCopy,
  MessageHeading,
  MessageInner,
  MessageRoot,
} from './MessagePage.styles';

/* Full-screen message used by standalone pages (404, form confirmation).
   `accent` is the part of the heading that takes the sky highlight. */
const MessagePage = ({ eyebrow, heading, accent, children, cta, ctaHref }) => (
  <MessageRoot>
    <DecoTopLeft aria-hidden="true">
      <StairsLeft />
    </DecoTopLeft>
    <DecoTopRight aria-hidden="true">
      <StairsRight />
    </DecoTopRight>
    <MessageInner>
      <Eyebrow>{eyebrow}</Eyebrow>
      <MessageHeading>
        {heading} <em>{accent}</em>
      </MessageHeading>
      <MessageCopy>{children}</MessageCopy>
      <MessageButton href={ctaHref}>{cta}</MessageButton>
    </MessageInner>
  </MessageRoot>
);

export default MessagePage;
