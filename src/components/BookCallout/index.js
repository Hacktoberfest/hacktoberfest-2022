import styled from 'styled-components';

import Button from 'components/Button';
import Shell from 'components/Shell';
import { Hex } from 'components/WorldLanding/WorldLanding.styles';
import { online } from 'data/content.mjs';
import { stickerImageSrc } from 'lib/stickerImage.mjs';
import { breakpoints, colors, fonts } from 'styles/tokens';

/* The band that closes /online and /activities, sending someone who is
   already collecting to their sticker book on /my. The same full-bleed
   sky band and white box that ScheduleCallout closes /schedule with, so
   the pages end the same way; instead of that one's print, a few of the
   book's stickers in the album's frame, since the book is what the words
   are about. `copy` is the page's own words (online.bookCallout by
   default, activitiesPage.bookCallout on /activities).

   Static markup in the page, outside WorldLanding, so it is in the export
   and on screen whatever the signed-in state turns out to be: /my does
   the asking. */

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

const Cta = styled(Button)`
  margin-top: 22px;
`;

/* Three stickers fanned out, the way a few land on a table: first on
   phones, so the picture opens the box, and in the right-hand column
   from desktop up. Each turned a little, the front one straight. */
const Fan = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  order: -1;

  > * + * {
    margin-left: -18px;
  }

  > :nth-child(1) {
    transform: rotate(-9deg) translateY(6px);
  }

  > :nth-child(3) {
    transform: rotate(8deg) translateY(4px);
  }

  > :nth-child(2) {
    z-index: 1;
  }

  @media (min-width: ${breakpoints.desktop}) {
    order: 0;
    justify-self: end;
  }
`;

const BookCallout = ({ copy = online.bookCallout }) => (
  <CalloutRoot aria-labelledby="book-callout">
    <CalloutBox>
      <div>
        <Title id="book-callout">{copy.title}</Title>
        <Body>{copy.body}</Body>
        <Cta href={copy.href}>{copy.cta}</Cta>
      </div>
      <Fan aria-hidden="true">
        {copy.stickers.map((slug, index) => (
          <Hex key={slug} $size={index === 1 ? 132 : 108}>
            <img src={stickerImageSrc(slug)} alt="" draggable="false" />
          </Hex>
        ))}
      </Fan>
    </CalloutBox>
  </CalloutRoot>
);

export default BookCallout;
