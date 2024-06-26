import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { profileEnd, registrationEnd, registrationStart } from 'lib/config';

import {
  StyledHeader,
  StyledHeaderContainer,
  StyledHeaderLogo,
  StyledHeaderNav,
  StyledMobileHeader,
  StyledMobileWrapper,
  StyledMobileContainer,
  StyledMobileNav,
  StyledHeaderLink,
  StyledHeaderToggle,
} from './Header.styles';

import hacktoberfestLogo from 'assets/img/logo-hacktoberfest--horizontal.svg';
import ButtonMain from 'components/ButtonMain';

const Header = () => {
  const [open, setOpen] = useState(false);
  const toggle = useCallback(() => setOpen((state) => !state), []);

  const router = useRouter();
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

  return (
    <>
      <StyledHeader>
        <StyledHeaderContainer>
          <StyledHeaderLogo>
            <Link href="/">
              <img src={hacktoberfestLogo.src} alt="Hacktoberfest" />
            </Link>
          </StyledHeaderLogo>
          <StyledHeaderNav>
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
              Discord
            </StyledHeaderLink>
            {hasProfile && (
              <ButtonMain href="/auth" passHref>
                {hasRegistrationEnded ? 'View Profile' : 'Start Hacking'}
              </ButtonMain>
            )}
            <StyledHeaderToggle onClick={toggle}>Menu</StyledHeaderToggle>
          </StyledHeaderNav>
        </StyledHeaderContainer>
      </StyledHeader>

      <StyledMobileWrapper aria-selected={open}>
        <StyledMobileContainer>
          <StyledMobileHeader>
            <StyledHeaderLogo>
              <img src={hacktoberfestLogo.src} alt="Hacktoberfest 10" />
            </StyledHeaderLogo>
            <StyledHeaderToggle onClick={toggle} $isOpen>
              Close
            </StyledHeaderToggle>
          </StyledMobileHeader>
          <StyledMobileNav>
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
              Discord
            </StyledHeaderLink>
            {hasProfile && (
              <ButtonMain href="/auth">
                {hasRegistrationEnded ? 'View Profile' : 'Start Hacking'}
              </ButtonMain>
            )}
          </StyledMobileNav>
        </StyledMobileContainer>
      </StyledMobileWrapper>
    </>
  );
};

export default Header;
