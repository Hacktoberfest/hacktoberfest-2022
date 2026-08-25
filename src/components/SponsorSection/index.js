import Button from 'components/Button';
import DevLogo from 'components/icons/DevLogo';
import DigitalOceanLogo from 'components/icons/DigitalOceanLogo';
import MlhLogo from 'components/icons/MlhLogo';
import { hero, sponsor } from 'data/content.mjs';
import {
  SPONSOR_PARTNER_DEV_URL,
  SPONSOR_PARTNER_DIGITALOCEAN_URL,
  SPONSOR_PARTNER_MLH_URL,
  SPONSOR_SETUP_PARTNERSHIP_URL,
  SPONSOR_SETUP_WALL_URL,
} from 'data/links';
import { sponsors } from 'data/sponsors.mjs';
import { SPONSOR_PARTNERSHIP_FORM } from 'data/typeforms.mjs';

import {
  Benefit,
  BenefitCheck,
  BenefitCopy,
  BenefitTitle,
  Card,
  CardSplit,
  Eyebrow,
  GhostTile,
  InfoButton,
  PartnershipActions,
  PartnershipCopy,
  PartnershipEyebrow,
  PartnershipGrid,
  PartnershipHeading,
  PartnershipRoot,
  PartnerTileLabel,
  PartnerTileLink,
  PresenterItem,
  PresenterTileLink,
  SectionHeading,
  SectionIntro,
  SectionIntroCopy,
  SplitCell,
  SplitCopy,
  SplitEyebrow,
  StatChip,
  StatChipRow,
  StatCopy,
  StatEyebrow,
  StatItem,
  StatsGrid,
  StatsRoot,
  StatUnit,
  StatValue,
  WallBand,
  WallBandButton,
  WallBandTitle,
  WallBandWrap,
  WallGrid,
  WallItem,
  WallLink,
  WallLogo,
  WallRoot,
} from './SponsorSection.styles';

/* The /sponsor page body: who already backs the event (partners and
   sponsors together, in the wall), the campaign's reach, and what a
   partnership carries. All static copy from data/content.mjs and
   data/sponsors.mjs; the only interactive piece is the Typeform popup,
   and the page touches no API. */
const SponsorSection = () => (
  <>
    <WallRoot aria-labelledby="sponsor-wall-heading">
      <SectionIntro>
        <div>
          <Eyebrow>{sponsor.wall.eyebrow}</Eyebrow>
          <SectionHeading id="sponsor-wall-heading">
            {sponsor.wall.heading.lead} <em>{sponsor.wall.heading.accent}</em>
          </SectionHeading>
        </div>
        <SectionIntroCopy>{sponsor.wall.intro}</SectionIntroCopy>
      </SectionIntro>
      <WallGrid as="ul" aria-label="Hacktoberfest 2026 partners and sponsors">
        <WallItem>
          <PartnerTileLink
            href={SPONSOR_PARTNER_MLH_URL}
            aria-label="Visit Major League Hacking"
          >
            <PartnerTileLabel>{hero.poweredByLabel}</PartnerTileLabel>
            <MlhLogo />
          </PartnerTileLink>
        </WallItem>
        <WallItem>
          <PartnerTileLink
            href={SPONSOR_PARTNER_DEV_URL}
            aria-label="Visit DEV"
          >
            <PartnerTileLabel>{hero.poweredByLabel}</PartnerTileLabel>
            <DevLogo />
          </PartnerTileLink>
        </WallItem>
        <PresenterItem>
          <PresenterTileLink
            href={SPONSOR_PARTNER_DIGITALOCEAN_URL}
            aria-label="Visit DigitalOcean"
          >
            <PartnerTileLabel>{hero.presentingLabel}</PartnerTileLabel>
            <DigitalOceanLogo />
          </PresenterTileLink>
        </PresenterItem>
        {sponsors.map((entry) => (
          <WallItem key={entry.slug}>
            <WallLink href={entry.url} aria-label={`Visit ${entry.name}`}>
              <WallLogo src={entry.logo} alt="" />
            </WallLink>
          </WallItem>
        ))}
        <WallItem aria-hidden="true">
          <GhostTile>{sponsor.wall.ghost}</GhostTile>
        </WallItem>
      </WallGrid>
      <WallBandWrap>
        <WallBand href={SPONSOR_SETUP_WALL_URL}>
          <WallBandTitle>{sponsor.wall.band.title}</WallBandTitle>
          <WallBandButton>
            {sponsor.wall.band.cta} <span aria-hidden="true">&nbsp;&rarr;</span>
          </WallBandButton>
        </WallBand>
      </WallBandWrap>
    </WallRoot>

    <StatsRoot aria-labelledby="sponsor-stats-heading">
      <SectionIntro>
        <div>
          <Eyebrow>{sponsor.stats.eyebrow}</Eyebrow>
          <SectionHeading id="sponsor-stats-heading">
            {sponsor.stats.heading.lead} <em>{sponsor.stats.heading.accent}</em>
          </SectionHeading>
        </div>
        <SectionIntroCopy>{sponsor.stats.intro}</SectionIntroCopy>
      </SectionIntro>
      <StatsGrid>
        {sponsor.stats.items.map((item) => (
          <StatItem key={item.id}>
            <StatChipRow>
              <StatChip $tone={item.id} aria-hidden="true" />
              <StatEyebrow>{item.eyebrow}</StatEyebrow>
            </StatChipRow>
            <StatValue>{item.value}</StatValue>
            <StatUnit>{item.unit}</StatUnit>
            <StatCopy>{item.copy}</StatCopy>
          </StatItem>
        ))}
      </StatsGrid>
    </StatsRoot>

    <PartnershipRoot aria-labelledby="sponsor-partnership-heading">
      <PartnershipGrid>
        <div>
          <PartnershipEyebrow>{sponsor.partnership.eyebrow}</PartnershipEyebrow>
          <PartnershipHeading id="sponsor-partnership-heading">
            {sponsor.partnership.heading.lead}{' '}
            <em>{sponsor.partnership.heading.accent}</em>
          </PartnershipHeading>
          <PartnershipCopy>{sponsor.partnership.intro}</PartnershipCopy>
          <PartnershipActions>
            <Button
              href={SPONSOR_SETUP_PARTNERSHIP_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              {sponsor.setupCta}
            </Button>
            <InfoButton form={SPONSOR_PARTNERSHIP_FORM} $variant="secondary">
              {sponsor.infoCta}
            </InfoButton>
          </PartnershipActions>
        </div>
        <Card>
          <CardSplit>
            {sponsor.partnership.split.map((side) => (
              <SplitCell key={side.id}>
                <SplitEyebrow>{side.eyebrow}</SplitEyebrow>
                <SplitCopy>{side.copy}</SplitCopy>
              </SplitCell>
            ))}
          </CardSplit>
          {sponsor.partnership.benefits.map((benefit) => (
            <Benefit key={benefit.id}>
              <BenefitCheck aria-hidden="true">&#10003;</BenefitCheck>
              <div>
                <BenefitTitle>{benefit.title}</BenefitTitle>
                <BenefitCopy>{benefit.copy}</BenefitCopy>
              </div>
            </Benefit>
          ))}
        </Card>
      </PartnershipGrid>
    </PartnershipRoot>
  </>
);

export default SponsorSection;
