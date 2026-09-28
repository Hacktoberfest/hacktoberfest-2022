import { host } from 'data/content.mjs';

import {
  PhotoReel,
  PhotoReelTrack,
  PhotoStripCaption,
  PhotoStripItem,
  PhotoStripPrint,
  PhotoStripRoot,
} from './HostSection.styles';

/* The reel of prints from past Fests. Lifted out of HostSection so the
   in-person landing page can run the same reel: the photos and their
   alt text are host.photoStrip's, so the two pages never drift. `tone`
   is the band's colour: sky on /host (the why-host band's blue), pink on
   /in-person (that world's own colour), with the print shadows following. */
const PhotoStrip = ({ tone = 'sky', caption = false }) => (
  <PhotoStripRoot aria-label={host.photoStrip.label} $tone={tone}>
    {/* The label, visible when asked for: /host's reel sits between two
        bands that already say what it is; /in-person's needs the line. */}
    {caption && (
      <PhotoStripCaption aria-hidden="true">
        {host.photoStrip.label}
      </PhotoStripCaption>
    )}
    <PhotoReel>
      <PhotoReelTrack>
        {host.photoStrip.photos.map((photo, index) => (
          <PhotoStripItem key={photo.id}>
            <PhotoStripPrint
              src={photo.src}
              alt={photo.alt}
              loading="lazy"
              width="640"
              height="427"
              $tilt={index % 2 === 0 ? -1.8 : 1.4}
              $tone={tone}
            />
          </PhotoStripItem>
        ))}
        {/* The strip again, so the reel has somewhere to wrap to. Pure
            repetition for the eyes: hidden from AT, empty alts. */}
        {host.photoStrip.photos.map((photo, index) => (
          <PhotoStripItem key={`${photo.id}-loop`} aria-hidden="true">
            <PhotoStripPrint
              src={photo.src}
              alt=""
              loading="lazy"
              width="640"
              height="427"
              $tilt={index % 2 === 0 ? -1.8 : 1.4}
              $tone={tone}
            />
          </PhotoStripItem>
        ))}
      </PhotoReelTrack>
    </PhotoReel>
  </PhotoStripRoot>
);

export default PhotoStrip;
