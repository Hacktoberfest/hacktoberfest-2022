import Link from 'next/link';

import { currentHacktoberfest, registrationStart } from 'lib/config';

import {
  StyledHeader,
  StyledHeaderContainer,
  StyledHeaderLogo,
  StyledHeaderNav,
  StyledHeaderToggle,
} from './Header.styles';

import hacktoberfestLogo from 'assets/img/logo-hacktoberfest-12--nav.svg';
import CustomLink from '../CustomLink';
import ButtonMain from '../ButtonMain';
import useCountdown from '../../hooks/useCountdown';
import { useMemo } from 'react';

const Header = () => {
  const hasRegistrationStarted = useMemo(
    () => new Date() >= new Date(registrationStart),
    [],
  );

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

        {/*<StyledHeaderNav $isOpen={open}>*/}
        <StyledHeaderNav>
          <div>
            <CustomLink isTopNav href="/participation">
              Participation
            </CustomLink>
            <CustomLink isTopNav href="/events">
              Events
            </CustomLink>
            <CustomLink isTopNav href="/donate">
              Donate
            </CustomLink>
            <CustomLink isTopNav href="/about">
              About
            </CustomLink>
            <CustomLink
              isTopNav
              href="https://discord.gg/hacktoberfest"
              target="_blank"
              rel="noreferrer noopener"
            >
              Discord
            </CustomLink>
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
        </StyledHeaderNav>

        {/*<StyledHeaderToggle $isOpen={open} onClick={toggle}>*/}
        <StyledHeaderToggle>
          <ButtonMain as="button" size="xs" onClick={() => {}}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 10"
              fill="none"
            >
              <path d="M16 10H0V9H16V10ZM16 1H0V0H16V1Z" fill="white" />
            </svg>
          </ButtonMain>
        </StyledHeaderToggle>
      </StyledHeaderContainer>
    </StyledHeader>
  );
};

export default Header;
