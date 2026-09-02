import DevLogo from 'components/icons/DevLogo';
import DigitalOceanLogo from 'components/icons/DigitalOceanLogo';
import MlhLogo from 'components/icons/MlhLogo';
import { hero, homeWall } from 'data/content.mjs';
import { HOME_WALL_DIGITALOCEAN_URL, HOME_WALL_MLH_URL } from 'data/links';
import { sponsors } from 'data/sponsors.mjs';

import {
  Eyebrow,
  PartnerPairBody,
  PartnerPairTimes,
  PartnerTileBody,
  PartnerTileLabel,
  PartnerTileLink,
  PresenterTileLink,
  WallGrid,
  WallHeading,
  WallIntro,
  WallIntroCopy,
  WallItem,
  WallLink,
  WallLogo,
  WallRoot,
} from './SponsorWallSection.styles';

/* The homepage wall: the /sponsor roster as pure credit. No ghost seat
   and no "take your place" band here; the recruitment ask stays on
   /sponsor, which the Get involved card below already points at. */
const SponsorWallSection = () => (
  <WallRoot id="sponsors" aria-labelledby="home-wall-title">
    <WallIntro>
      <div>
        <Eyebrow>{homeWall.eyebrow}</Eyebrow>
        <WallHeading id="home-wall-title">
          {homeWall.heading.lead} <em>{homeWall.heading.accent}</em>
        </WallHeading>
      </div>
      <WallIntroCopy>{homeWall.intro}</WallIntroCopy>
    </WallIntro>
    <WallGrid as="ul" aria-label="Hacktoberfest 2026 partners and sponsors">
      <WallItem $span={6} $spanMobile={2}>
        <PartnerTileLink
          href={HOME_WALL_MLH_URL}
          aria-label="Visit Major League Hacking"
        >
          <PartnerTileLabel>{hero.poweredByLabel}</PartnerTileLabel>
          <PartnerPairBody>
            <MlhLogo />
            <PartnerPairTimes aria-hidden="true">&times;</PartnerPairTimes>
            <DevLogo />
          </PartnerPairBody>
        </PartnerTileLink>
      </WallItem>
      <WallItem $span={6} $spanMobile={2}>
        <PresenterTileLink
          href={HOME_WALL_DIGITALOCEAN_URL}
          aria-label="Visit DigitalOcean"
        >
          <PartnerTileLabel $presenter>{hero.presentingLabel}</PartnerTileLabel>
          <PartnerTileBody>
            <DigitalOceanLogo />
          </PartnerTileBody>
        </PresenterTileLink>
      </WallItem>
      {sponsors.map((entry) => (
        <WallItem
          key={entry.slug}
          $span={4}
          $spanMobile={entry.slug === 'backboard' ? 2 : 1}
        >
          <WallLink href={entry.homeUrl} aria-label={`Visit ${entry.name}`}>
            <WallLogo
              src={entry.logo}
              alt=""
              $wide={entry.slug === 'backboard'}
            />
          </WallLink>
        </WallItem>
      ))}
    </WallGrid>
  </WallRoot>
);

export default SponsorWallSection;
