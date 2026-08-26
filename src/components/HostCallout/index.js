import styled from 'styled-components';

import Button from 'components/Button';
import Shell from 'components/Shell';
import { fests } from 'data/content.mjs';
import { breakpoints, colors, fonts } from 'styles/tokens';

/* The band that closes /fests below the directory, turning a fruitless
   search into an invitation to host. A MissionSection-style full-bleed
   section — deep green, ink borders — with the callout card sitting on
   it, so the invitation reads as its own chapter rather than another
   result in the directory's column. Deliberately static markup in the
   page, not part of FestsDirectory: it belongs in the export and on
   screen whatever the directory's client-side fetch is doing — loading,
   error, or a search with no matches. */

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
  /* Same surface as the Fest cards; the skyDeep shadow (instead of their
     maroon) is what marks this box out as a different kind of thing. */
  background: ${colors.white};
  box-shadow: 6px 6px 0 ${colors.skyDeep};

  @media (min-width: ${breakpoints.desktop}) {
    grid-template-columns: 1.6fr 1fr;
    align-items: center;
    gap: clamp(28px, 4vw, 56px);
  }
`;

const CalloutTitle = styled.h2`
  margin: 0;
  font-family: ${fonts.display};
  font-size: clamp(1.5rem, 2.6vw, 2.1rem);
  font-weight: 800;
  letter-spacing: -0.02em;
  color: ${colors.ink};
`;

const CalloutBody = styled.p`
  max-width: 62ch;
  margin: 10px 0 0;
  color: ${colors.inkSoft};
  line-height: 1.55;
`;

const CalloutCta = styled(Button)`
  margin-top: 18px;
`;

const CalloutPhoto = styled.img`
  /* Decoration, not content — below the desktop breakpoint it goes away
     entirely rather than stacking under the pitch. */
  display: none;

  /* A print laid on the box rather than a bordered rectangle in it: a
     white mount inside the ink keyline, the site's press-down shadow in
     maroon (the box's own is skyDeep, so the two never merge into one
     slab), and a couple of degrees of tilt. The 3:2 frame with object-fit
     is what keeps the mount even on all four sides whatever the source
     file's ratio is. Mirrored in WhyHostBand.module.css, which is the
     same design on /my. */
  @media (min-width: ${breakpoints.desktop}) {
    display: block;
    width: 100%;
    max-width: 380px;
    /* height:auto is load-bearing — the width/height attributes on the tag
       (there so the box is reserved before the file lands) become a
       presentational height that would otherwise beat aspect-ratio and
       crop the print to a near-square. */
    height: auto;
    aspect-ratio: 3 / 2;
    padding: 10px;
    border: 2px solid ${colors.ink};
    background: ${colors.white};
    object-fit: cover;
    box-shadow: 7px 7px 0 ${colors.maroon};
    /* Rotating the print, not the mount, would need a wrapper element;
       tilting the whole thing is the same picture and one tag fewer. The
       box's padding is wider than the corners this throws out. */
    transform: rotate(-2deg);
    /* Hug the box's right edge rather than floating mid-gap when the
       column is wider than the capped photo. */
    justify-self: end;
  }
`;

const HostCallout = () => (
  <CalloutRoot aria-labelledby="host-callout-title">
    <CalloutBox>
      <div>
        <CalloutTitle id="host-callout-title">
          {fests.hostCallout.title}
        </CalloutTitle>
        <CalloutBody>{fests.hostCallout.body}</CalloutBody>
        <CalloutCta href="/host/">{fests.hostCallout.cta}</CalloutCta>
      </div>
      <CalloutPhoto
        src="/fests-why-host.jpg"
        alt={fests.hostCallout.photoAlt}
        loading="lazy"
        width="640"
        height="427"
      />
    </CalloutBox>
  </CalloutRoot>
);

export default HostCallout;
