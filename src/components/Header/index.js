import Link from 'next/link';

import { currentHacktoberfest, trackingStart } from 'lib/config';

import {
  StyledHeader,
  StyledHeaderContainer,
  StyledHeaderDate,
  StyledHeaderLogo,
} from './Header.styles';

import hacktoberfestLogo from 'assets/img/logo-hacktoberfest-12--nav.svg';

const Header = () => {
  return (
    <StyledHeader>
      <StyledHeaderContainer>
        <StyledHeaderLogo>
          <Link href="/">
            <img
              src={hacktoberfestLogo.src}
              alt={`Hacktoberfest ${currentHacktoberfest}`}
              width={261}
              height={33}
            />
          </Link>
        </StyledHeaderLogo>

        {/* <StyledHeaderNav $isOpen={open}>
          <CustomLink href="/participation">
            Participation
          </CustomLink>
          <CustomLink href="/events">Events</CustomLink>
          <CustomLink href="/donate">Donate</CustomLink>
          <CustomLink href="/about">About</CustomLink>
          <CustomLink
            href="https://discord.gg/hacktoberfest"
            target="_blank"
            rel="noreferrer noopener"
          >
            Discord
          </CustomLink>
          {hasProfile && (
            <ButtonMain
              href="/auth"
              passHref
              variant="primary"
            >
              {hasRegistrationEnded ? 'View Profile' : 'Start Hacking'}
            </ButtonMain>
          )}
        </StyledHeaderNav> */}

        <StyledHeaderDate>
          [Oct 1-31, {new Date(trackingStart).getFullYear()}]
        </StyledHeaderDate>

        {/* <StyledHeaderToggle $isOpen={open} onClick={toggle}>
          Menu
        </StyledHeaderToggle> */}
      </StyledHeaderContainer>
    </StyledHeader>
  );
};

export default Header;
