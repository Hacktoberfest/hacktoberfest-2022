import { useEffect, useState } from 'react';

import Close from 'components/icons/Close';
import { banner } from 'data/content.mjs';
import { bannerDismissed, dismissBanner } from 'lib/banner.mjs';

import {
  Arrow,
  BannerLink,
  BannerRoot,
  BannerRow,
  CloseButton,
  Collapse,
} from './Banner.styles';

/* The Preptember strip, rendered by Header so every page carries it
   without each page having to remember to.

   It always renders on the server, and the effect below is what takes it
   away again for someone who has closed it before. Deciding at render
   time instead would mean either a hydration mismatch or a banner that
   pops in a frame late and shoves the page down on every load; CSS hides
   the closed state before first paint (see lib/banner.mjs) and this
   removes it from the document a tick later, so the keyboard and the
   screen reader never reach a banner the reader has dismissed. */
const Banner = () => {
  const [closing, setClosing] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (bannerDismissed()) setDismissed(true);
  }, []);

  /* The close click collapses the strip (see BannerRoot) and this timer
     unmounts it once the collapse is done. A timer rather than a
     transitionend listener, deliberately: a browser that cannot animate
     the grid track snaps shut without ever firing the event, and a
     banner stuck invisible-but-mounted would still be in the tab order.
     A beat longer than the 200ms transition so the animation always
     finishes on screen first. */
  useEffect(() => {
    if (!closing) return undefined;
    const timer = setTimeout(() => setDismissed(true), 260);
    return () => clearTimeout(timer);
  }, [closing]);

  if (dismissed) return null;

  const close = () => {
    dismissBanner();
    setClosing(true);
  };

  return (
    <BannerRoot data-closing={closing ? 'true' : 'false'}>
      <Collapse>
        <BannerRow>
          {/* The no-break space glues the arrow to the last word, so a
              narrow screen never wraps the arrow onto a line of its own. */}
          <BannerLink href="/host/">
            {banner.message}
            {'\u00A0'}
            <Arrow aria-hidden="true">→</Arrow>
          </BannerLink>
          <CloseButton type="button" onClick={close} aria-label={banner.close}>
            <Close />
          </CloseButton>
        </BannerRow>
      </Collapse>
    </BannerRoot>
  );
};

export default Banner;
