import Link from 'next/link';

import { currentHacktoberfest, registrationStart } from 'lib/config';

import {
  StyledDesktopHeaderNav,
  StyledHeader,
  StyledHeaderContainer,
  StyledHeaderLogo,
  StyledHeaderToggle,
  StyledMobileHeaderNav,
  StyledDivider,
} from './Header.styles';

import hacktoberfestLogo from 'assets/img/logo-hacktoberfest-12--nav.svg';
import CustomLink from '../CustomLink';
import ButtonMain from '../ButtonMain';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';

const Nav = ({ hasRegistrationStarted, isMobile = false }) => {
  return (
    <>
      <div>
        <CustomLink isTopNav href="/participation">
          Participation
        </CustomLink>
        {isMobile && <StyledDivider />}
        <CustomLink isTopNav href="/events">
          Events
        </CustomLink>
        {isMobile && <StyledDivider />}
        <CustomLink isTopNav href="/donate">
          Donate
        </CustomLink>
        {isMobile && <StyledDivider />}
        <CustomLink isTopNav href="/about">
          About
        </CustomLink>
        {isMobile && <StyledDivider />}
        <CustomLink
          isTopNav
          href="https://discord.com/invite/digitalocean"
          target="_blank"
          rel="noreferrer noopener"
        >
          Discord
        </CustomLink>
        {isMobile && <StyledDivider />}
      </div>
      {/*{hasProfile && (*/}
      {/*  <ButtonMain*/}
      {/*    href="/auth"*/}
      {/*    passHref*/}
      {/*    variant="primary"*/}
      {/*  >*/}
      {/*    {hasRegistrationEnded ? 'View Profile' : 'Start Hacking'}*/}
      {/*  </ButtonMain>*/}
      {/*)}*/}
      {hasRegistrationStarted && (
        <ButtonMain href="/auth" passHref variant="primary">
          Start Hacking
        </ButtonMain>
      )}
    </>
  );
};

const Header = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const hasRegistrationStarted = useMemo(
    () => new Date() >= new Date(registrationStart),
    [],
  );

  useEffect(() => {
    const handleRouteChangeStart = () => {
      setOpen(false);
    };

    router.events.on('routeChangeStart', handleRouteChangeStart);

    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart);
    };
  }, [router]);

  return (
    <StyledHeader $isOpen={open}>
      <StyledHeaderContainer $isOpen={open}>
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

        <StyledDesktopHeaderNav>
          <Nav hasRegistrationStarted={hasRegistrationStarted} />
        </StyledDesktopHeaderNav>

        <StyledHeaderToggle $isOpen={open}>
          <ButtonMain
            as="button"
            size="xs"
            onClick={() => setOpen((prev) => !prev)}
          >
            {open ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="13"
                height="13"
                viewBox="0 0 13 13"
                fill="none"
              >
                <path
                  d="M13.0088 1.41699L7.70508 6.71973L13.0098 12.0234L12.3018 12.7305L6.99805 7.42676L1.69531 12.7305L0.988281 12.0234L6.29102 6.71973L0.988281 1.41699L1.69531 0.709961L6.99805 6.0127L12.3018 0.709961L13.0088 1.41699Z"
                  fill="white"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 10"
                fill="none"
              >
                <path d="M16 10H0V9H16V10ZM16 1H0V0H16V1Z" fill="white" />
              </svg>
            )}
          </ButtonMain>
        </StyledHeaderToggle>
      </StyledHeaderContainer>

      <StyledMobileHeaderNav $isOpen={open}>
        <Nav hasRegistrationStarted={hasRegistrationStarted} isMobile />
      </StyledMobileHeaderNav>
    </StyledHeader>
  );
};

export default Header;
