import { ART } from 'components/ActivityCard/stickerArt';
import { online } from 'data/content.mjs';

import {
  Pack,
  PackCard,
  PackLabel,
  PackStage,
  PackSticker,
} from './WorldLanding.styles';

/* The sticker pack as an object: a tilted paper card carrying the four
   stickers at the scale they are printed, overlapping the way a sheet of
   stickers does. The online hero's centrepiece, and the picture the
   in-person page's closing callout uses for "join from home". Decorative
   wherever it appears: the copy beside it says what it is, and four
   unlabeled circles read aloud would say it worse. The stickers are the
   catalogue's placeholder glyphs until the illustrated set exists; they
   come from the same file the activity cards draw, so the two change
   together. */
const STICKERS = [
  { art: 'play', ground: 'sky', x: 30, y: 0, size: 150, rotate: -9 },
  { art: 'bolt', ground: 'sky', x: 176, y: 22, size: 160, rotate: 6 },
  { art: 'plug', ground: 'rule', x: 96, y: 138, size: 130, rotate: -4 },
  { art: 'pin', ground: 'pink', x: 250, y: 176, size: 120, rotate: 8 },
];

const PackObject = () => (
  <PackStage aria-hidden="true">
    <PackCard>
      <PackLabel>{online.pack.label}</PackLabel>
    </PackCard>
    <Pack>
      {STICKERS.map((sticker) => (
        <PackSticker
          key={sticker.art}
          $ground={sticker.ground}
          style={{
            left: sticker.x,
            top: sticker.y,
            width: sticker.size,
            height: sticker.size,
            transform: `rotate(${sticker.rotate}deg)`,
          }}
        >
          {ART[sticker.art]}
        </PackSticker>
      ))}
    </Pack>
  </PackStage>
);

export default PackObject;
