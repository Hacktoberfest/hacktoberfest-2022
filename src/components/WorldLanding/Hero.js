import { ColumnsSkyline, StairsLeft } from 'components/Hero/HeroGeometry';
import DevLogo from 'components/icons/DevLogo';
import DigitalOceanLogo from 'components/icons/DigitalOceanLogo';
import MlhLogo from 'components/icons/MlhLogo';
import { hero } from 'data/content.mjs';
import { DEV_URL, DIGITALOCEAN_URL, MLH_URL } from 'data/links';

import PackObject from './PackObject';
import {
  HeroActions,
  HeroButton,
  HeroCopy,
  HeroDeco,
  HeroDeck,
  HeroDeckShort,
  HeroEyebrow,
  HeroFacts,
  HeroHeading,
  HeroInner,
  HeroPartnerChip,
  HeroPartnerGroup,
  HeroPartnerLabel,
  HeroPartnerLink,
  HeroPartnerTimes,
  HeroPartners,
  HeroRoot,
  HeroSecondaryButton,
  HeroSquares,
  Print,
  Prints,
} from './WorldLanding.styles';

/* A world landing page's hero: PageHero's grammar (forest, the squares,
   the eyebrow, the two-line heading, the corner geometry) split into two
   columns from desktop up, with the thing the page is selling on the
   right. The online page's object is the sticker pack; the in-person
   page's is a pair of prints from past Fests. `world.hero.object` picks.
   The partner lockups sit under the actions the way they do on the
   homepage, so both pages carry the trust marks the front door does.
   Static copy, server-rendered, so styled-components is safe here. */
const PrintsObject = ({ photos }) => (
  <Prints>
    {photos.map((photo, index) => (
      <Print
        key={photo.src}
        src={photo.src}
        alt={photo.alt}
        width="640"
        height="427"
        $index={index}
      />
    ))}
  </Prints>
);

const Hero = ({ world }) => (
  <HeroRoot>
    <HeroDeco $corner="topLeft" aria-hidden="true">
      <StairsLeft />
    </HeroDeco>
    <HeroDeco $corner="bottomRight" aria-hidden="true">
      <ColumnsSkyline />
    </HeroDeco>
    <HeroInner>
      <HeroCopy>
        <HeroSquares aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
        </HeroSquares>
        <HeroEyebrow>{world.eyebrow}</HeroEyebrow>
        <HeroHeading $accent={world.hero.accent}>
          {world.heading.lead} <em>{world.heading.accent}</em>
        </HeroHeading>
        {/* Two intros, one shown per width: the phone's is shorter so the
            first screen there still reaches the buttons. display:none
            keeps the hidden one out of the accessibility tree. */}
        <HeroDeck>{world.intro}</HeroDeck>
        {world.introShort && <HeroDeckShort>{world.introShort}</HeroDeckShort>}
        <HeroActions>
          <HeroButton href={world.ctaHref}>{world.cta}</HeroButton>
          {/* The second ask is optional: the in-person page makes one. */}
          {world.secondaryCta && (
            <HeroSecondaryButton href={world.secondaryHref}>
              {world.secondaryCta}
            </HeroSecondaryButton>
          )}
        </HeroActions>
        {/* The facts a stranger wants before reading on. */}
        {world.facts && (
          <HeroFacts>
            {world.facts.map((fact) => (
              <li key={fact}>{fact}</li>
            ))}
          </HeroFacts>
        )}
        <HeroPartners>
          <HeroPartnerGroup>
            <HeroPartnerLabel>{hero.poweredByLabel}</HeroPartnerLabel>
            <HeroPartnerChip>
              <HeroPartnerLink href={MLH_URL} aria-label="Major League Hacking">
                <MlhLogo />
              </HeroPartnerLink>
              <HeroPartnerTimes aria-hidden="true">&times;</HeroPartnerTimes>
              <HeroPartnerLink href={DEV_URL} aria-label="DEV">
                <DevLogo />
              </HeroPartnerLink>
            </HeroPartnerChip>
          </HeroPartnerGroup>
          <HeroPartnerGroup>
            <HeroPartnerLabel>{hero.presentingLabel}</HeroPartnerLabel>
            <HeroPartnerChip>
              <HeroPartnerLink
                href={DIGITALOCEAN_URL}
                aria-label="DigitalOcean"
              >
                <DigitalOceanLogo />
              </HeroPartnerLink>
            </HeroPartnerChip>
          </HeroPartnerGroup>
        </HeroPartners>
      </HeroCopy>
      {world.hero.object === 'prints' ? (
        <PrintsObject photos={world.hero.photos} />
      ) : (
        <PackObject />
      )}
    </HeroInner>
  </HeroRoot>
);

export default Hero;
