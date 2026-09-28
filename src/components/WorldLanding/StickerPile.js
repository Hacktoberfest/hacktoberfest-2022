import { online } from 'data/content.mjs';
import { stickerImageSrc } from 'lib/stickerImage.mjs';

import { Hex, PileSticker, PileStage } from './WorldLanding.styles';

/* A pile of stickers as an object: a handful of the book's own stickers
   put down on the forest, each framed the way the album frames an earned
   one, at the sizes they are printed, overlapping the way a handful of
   stickers does. The online hero's centrepiece, and the picture the
   in-person page's closing callout uses for "join from home". Decorative
   wherever it appears: the copy beside it says what they are, and ten
   unlabeled pictures read aloud would say it worse. Which stickers is
   online.pile, in the order they are put down (the last lands on top);
   where each lands is here, one place per slot on a 560 by 440 stage.
   The pile is tipped: the big ones sit low and to the right, away from
   the heading, and the top left stays light (Jacklyn's pick of seven
   arrangements, 2026-09-22). */
const SLOTS = [
  { x: 300, y: 20, size: 140, rotate: -10 },
  { x: 420, y: 80, size: 150, rotate: 8 },
  { x: 170, y: 60, size: 160, rotate: 14 },
  { x: 60, y: 140, size: 130, rotate: -6 },
  { x: 220, y: 180, size: 200, rotate: -4 },
  { x: 400, y: 230, size: 170, rotate: 12 },
  { x: 120, y: 270, size: 150, rotate: 7 },
  { x: 10, y: 300, size: 110, rotate: -14 },
  { x: 300, y: 340, size: 110, rotate: -9 },
  { x: 450, y: 370, size: 80, rotate: 16 },
];

const StickerPile = () => (
  <PileStage aria-hidden="true">
    {online.pile.map((id, index) => {
      const slot = SLOTS[index % SLOTS.length];
      return (
        <PileSticker
          key={id}
          style={{
            left: slot.x,
            top: slot.y,
            transform: `rotate(${slot.rotate}deg)`,
          }}
        >
          <Hex $size={slot.size}>
            <img src={stickerImageSrc(id)} alt="" draggable="false" />
          </Hex>
        </PileSticker>
      );
    })}
  </PileStage>
);

export default StickerPile;
