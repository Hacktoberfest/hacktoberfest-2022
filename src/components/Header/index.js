import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useMemo, useState } from 'react';

import {
  currentHacktoberfest,
  profileEnd,
  registrationEnd,
  registrationStart,
} from 'lib/config';

import {
  StyledHeader,
  StyledHeaderContainer,
  StyledHeaderLogo,
  StyledHeaderNav,
  StyledHeaderLink,
  StyledHeaderToggle,
} from './Header.styles';

import hacktoberfestLogoGreen from 'assets/img/logo-hacktoberfest-11--green.svg';
import hacktoberfestLogoBeige from 'assets/img/logo-hacktoberfest-11--beige.svg';
import ButtonMain from 'components/ButtonMain';

const Header = () => {
  const [open, setOpen] = useState(false);
  const toggle = useCallback(() => setOpen((state) => !state), []);

  const router = useRouter();

  const path = useMemo(
    () => new URL(router.asPath, 'http://localhost').pathname,
    [router.asPath],
  );

  useEffect(() => {
    setOpen(false);
  }, [router.pathname]);

  const hasProfile = useMemo(
    () =>
      new Date() >= new Date(registrationStart) &&
      new Date() < new Date(profileEnd),
    [],
  );

  const hasRegistrationEnded = useMemo(
    () => new Date() >= new Date(registrationEnd),
    [],
  );

  const isHome = path === '/';

  return (
    <StyledHeader $isHome={isHome} $isOpen={open}>
      <StyledHeaderContainer>
        <StyledHeaderLogo>
          <Link href="/">
            <img
              src={
                isHome && !open
                  ? hacktoberfestLogoGreen.src
                  : hacktoberfestLogoBeige.src
              }
              alt={`Hacktoberfest ${currentHacktoberfest}`}
              width="198"
              height={80}
            />
          </Link>
        </StyledHeaderLogo>

        <StyledHeaderNav $isOpen={open}>
          <StyledHeaderLink href="/participation">
            Participation
          </StyledHeaderLink>
          <StyledHeaderLink href="/events">Events</StyledHeaderLink>
          <StyledHeaderLink href="/donate">Donate</StyledHeaderLink>
          <StyledHeaderLink href="/about">About</StyledHeaderLink>
          <StyledHeaderLink
            href="https://discord.gg/hacktoberfest"
            target="_blank"
            rel="noreferrer noopener"
          >
            Join Discord
          </StyledHeaderLink>
          {hasProfile && (
            <ButtonMain
              href="/auth"
              passHref
              variant={isHome ? 'primary-black' : 'secondary-pink'}
            >
              {hasRegistrationEnded ? 'View Profile' : 'Start Hacking'}
            </ButtonMain>
          )}
        </StyledHeaderNav>

        <StyledHeaderToggle $isHome={isHome} $isOpen={open} onClick={toggle}>
          Menu
        </StyledHeaderToggle>
      </StyledHeaderContainer>
    </StyledHeader>
  );
};

export default Header;
