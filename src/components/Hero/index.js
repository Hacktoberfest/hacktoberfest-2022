import DevLogo from 'components/icons/DevLogo';
import DigitalOceanLogo from 'components/icons/DigitalOceanLogo';
import MlhLogo from 'components/icons/MlhLogo';
import { hero } from 'data/content.mjs';
import { DEV_URL, DIGITALOCEAN_URL, MLH_URL } from 'data/links';
import { HERO_ATTEND_FORM, HERO_HOST_FORM } from 'data/typeforms.mjs';
import { colors } from 'styles/tokens';

import {
  ColumnsSkyline,
  StairsLeft,
  StairsRight,
  StepsTowers,
} from './HeroGeometry';

import {
  DecoBottomLeft,
  DecoBottomRight,
  DecoTopLeft,
  DecoTopRight,
  Eyebrow,
  EyebrowLine,
  HeroActions,
  HeroButton,
  HeroDeck,
  HeroHeading,
  HeroInner,
  HeroPartnerChip,
  HeroPartnerGroup,
  HeroPartnerLabel,
  HeroPartnerLink,
  HeroPartners,
  HeroPartnerTimes,
  HeroRoot,
  HeroSecondaryButton,
  HeroSquare,
  HeroSquares,
} from './Hero.styles';

const ACCENT_COLORS = [colors.orange, colors.sky, colors.ochre, colors.pink];

const Hero = () => (
  <HeroRoot id="top" aria-labelledby="hero-title">
    <DecoTopLeft aria-hidden="true">
      <StairsLeft />
    </DecoTopLeft>
    <DecoTopRight aria-hidden="true">
      <StairsRight />
    </DecoTopRight>
    <DecoBottomLeft aria-hidden="true">
      <ColumnsSkyline />
    </DecoBottomLeft>
    <DecoBottomRight aria-hidden="true">
      <StepsTowers />
    </DecoBottomRight>
    <HeroInner>
      <HeroSquares aria-hidden="true">
        {ACCENT_COLORS.map((color) => (
          <HeroSquare key={color} $color={color} />
        ))}
      </HeroSquares>
      <Eyebrow>
        {hero.eyebrow.map((line) => (
          <EyebrowLine key={line}>{line}</EyebrowLine>
        ))}
      </Eyebrow>
      <HeroHeading id="hero-title">
        <span>{hero.heading.lead}</span> <em>{hero.heading.accent}</em>
      </HeroHeading>
      <HeroDeck>{hero.deck}</HeroDeck>
      <HeroActions>
        {/* One interest form behind both: it sorts hosts from attendees, so
            the two CTAs differ only in attribution and preselection. */}
        <HeroButton form={HERO_HOST_FORM}>{hero.cta}</HeroButton>
        <HeroSecondaryButton form={HERO_ATTEND_FORM}>
          {hero.secondaryCta}
        </HeroSecondaryButton>
      </HeroActions>
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
            <HeroPartnerLink href={DIGITALOCEAN_URL} aria-label="DigitalOcean">
              <DigitalOceanLogo />
            </HeroPartnerLink>
          </HeroPartnerChip>
        </HeroPartnerGroup>
      </HeroPartners>
    </HeroInner>
  </HeroRoot>
);

export default Hero;
