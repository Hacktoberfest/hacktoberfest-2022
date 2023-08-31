import styled, { keyframes } from 'styled-components';
import { useRouter } from 'next/router';
import { useState, useCallback, useEffect, useRef } from 'react';
import { body16 } from 'themes/typography';
import { breakpoints as bp, determineMediaQuery as mQ } from 'themes/breakpoints';

const loadAnimation = (x) => keyframes`
  from {
    transform: translateY(${x}px);
  }
  to {
    transform: translateY(0);
  }
`;

const flickerAnimation = () => keyframes`
  0% {
    opacity: 1;
  }
  18% {
    opacity: 1;
  }
  19% {
    opacity: 0;
  }
  20% {
    opacity: 1;
  }
  96% {
    opacity: 1;
  }
  97% {
    opacity: 0;
  }
  98% {
    opacity: 1;
  }
`;

const textAnimation = () => keyframes`
  25% {
    content: "";
  }
  50% {
    content: ".";
  }
  75% {
    content: "..";
  }
  100% {
    content: "...";
  }
`;

const StyledInit = styled.p`
  font-family: 'JetBrains Mono', monospace;
  font-variant-ligatures: none;
  width: 68px;
  user-select: none;
  text-transform: uppercase;
  font-weight: 600;

  &:after {
    content: '...';
    animation: ${textAnimation} 2s linear infinite;
  }
`;

const StyledNav = styled.nav`
  display: none;
  visibility: hidden;
  width: 100%;
  height: 0;
  gap: 8px;
  justify-content: center;
  flex-flow: row wrap;
  flex-direction: column;
  opacity: 0;
  transition: all 0.2s ease;
  transition-property: opacity, visibility, height;

  ${mQ(bp.desktop)} {
    gap: 24px;
    flex-direction: row;
  }

  &[aria-selected='true'] {
    opacity: 0 !important;
    visibility: hidden !important;
    height: 0 !important;
    display: none !important;
  }

  a {
    ${body16};
    font-weight: 600;
    color: ${({theme}) => theme.colors.neutral.manga300};
    text-transform: uppercase;
    width: auto;

    &:hover,
    &:focus {
      color: ${({theme}) => theme.colors.neutral.manga200};
    }
  }
`;

const StyledIsland = styled.div`
  background: ${({theme}) => theme.colors.neutral.void200};
  width: 200px;
  max-width: 1280px;
  border-radius: 100px;
  box-shadow: inset 0 0 0 2px ${({theme}) => theme.colors.neutral.manga400};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 4px 4px 12px;
  pointer-events: all;
  transition: all 0.2s ease;

  .shutter-wrapper {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    width: 40px;
    height: 100%;
    gap: 16px;
    justify-content: space-between;

    &[aria-selected='true'] {
      width: 100%;
      flex-direction: reverse;
    }

    &:after {
      transform: rotate(-45deg);
    }
  }
`;

const StyledButton = styled.button`
  align-items: center;
  align-self: flex-end;
  border: 1px solid ${({theme}) => theme.colors.neutral.manga400};
  border-radius: 6px;
  display: none;
  height: 40px;
  justify-content: center;
  margin-left: auto;
  opacity: 0;
  position: relative;
  transition: 0.1s ease;
  visibility: hidden;
  width: 40px;

  &:hover {
    transform: scale(0.9);
  }

  &:before,
  &:after {
    position: absolute;
    content: '';
    width: 60%;
    height: 2px;
    background: ${({theme}) => theme.colors.neutral.manga300};
    z-index: 2;
    transition: 200ms ease;
  }

  &:before {
    transform: rotate(45deg);
  }
  &:after {
    transform: rotate(-45deg);
  }

  &[aria-selected='true'] {
    :after,
    :before {
      transform: rotate(0deg);
    }
    :before {
      margin-top: 8px;
    }
    :after {
      margin-bottom: 8px;
    }
  }
`;

const StyledWrapper = styled.div`
  --bez: cubic-bezier(0.5, 0, 0.5, 1.5);
  --bez2: cubic-bezier(0.5, -0.5, 0.2, 1.6);
  width: 100%;
  display: flex;
  justify-content: center;
  position: fixed;
  top: 120px;
  z-index: 200;
  padding: 0 64px;
  pointer-events: none;
  transition: all 0.5s var(--bez);
  transform: translateY(-200px);

  &.top {
    animation: ${() => loadAnimation(-200)} 0.5s var(--bez2) 0.2s forwards;
  }

  &.bottom {
    animation: ${() => loadAnimation(200)} 0.5s var(--bez2) 0.2s forwards;
  }

  @media (max-width: 600px) {
    bottom: 120px;
    padding: 0 24px;
    top: auto;
    transform: translateY(200px);
  }
`;

const DorknamicIsland = (props) => {
  const [open, setOpen] = useState(false);
  const toggle = useCallback(() => setOpen((state) => !state), []);

  const router = useRouter();
  useEffect(() => {
    setOpen(false);
  }, [router.pathname]);

  const island = useRef(null);
  const init = useRef(null);
  const wrapper = useRef(null);
  const nav = useRef(null);
  const hamburger = useRef(null);

  useEffect(() => {
    const scrollTrigger = () => {
      if (!island.current) return;
      if (!init.current) return;
      if (!wrapper.current) return;
      if (!nav.current) return;
      if (!hamburger.current) return;

      if (window.scrollY > 100) {
        if (window.innerWidth > 600) {
          wrapper.current.classList.add('top');
          wrapper.current.style.top = '40px';
          wrapper.current.style.bottom = 'auto';
          hamburger.current.style.display = 'none';
          island.current.style.padding = '24px 40px';
          setOpen(false);
        } else {
          if (wrapper.current.classList.contains('top') === true) {
            wrapper.current.classList.remove('top'); //position reset
          }
          wrapper.current.classList.add('bottom');
          wrapper.current.style.top = 'auto';
          wrapper.current.style.bottom = '40px';
          hamburger.current.style.display = 'flex';
          island.current.style.padding = '16px';
          setOpen(true);
        }

        island.current.style.borderRadius = '16px';
        island.current.style.width = '100%';

        init.current.style.display = 'none';
        nav.current.style.display = 'flex';

        setTimeout(() => {
          nav.current.style.opacity = '1';
          nav.current.style.height = 'max-content';
          nav.current.style.visibility = 'visible';
          hamburger.current.style.opacity = '1';
          hamburger.current.style.visibility = 'visible';
        }, 200);
      } else {
        if (window.innerWidth > 600) {
          if (wrapper.current.classList.contains('bottom') === true) {
            wrapper.current.classList.remove('bottom'); //position reset
          }
          wrapper.current.classList.add('top');
          wrapper.current.style.top = '120px';
          wrapper.current.style.bottom = 'auto';
          island.current.style.borderRadius = '100px';
        } else {
          if (wrapper.current.classList.contains('top') === true) {
            wrapper.current.classList.remove('top'); //position reset
          }
          wrapper.current.classList.add('bottom');
          wrapper.current.style.top = 'auto';
          wrapper.current.style.bottom = '40px';
          setOpen(false);
        }
        island.current.style.borderRadius = '100px';
        island.current.style.width = '200px';
        island.current.style.padding = '12px 16px';
        init.current.style.display = 'block';
        nav.current.style.opacity = '0';
        nav.current.style.visibility = 'hidden';
        nav.current.style.display = 'none';
        nav.current.style.height = '0';
        hamburger.current.style.display = 'none';
        hamburger.current.style.opacity = '0';
        hamburger.current.style.visibility = 'hidden';
      }
    };
    scrollTrigger();

    window.addEventListener('scroll', scrollTrigger);
    window.addEventListener('resize', scrollTrigger);

    return () => {
      window.removeEventListener('scroll', scrollTrigger);
      window.removeEventListener('resize', scrollTrigger);
    };
  }, []);

  return (
    <StyledWrapper ref={wrapper}>
      <StyledIsland ref={island}>
        <StyledInit ref={init}>Init</StyledInit>
        <StyledNav ref={nav} aria-selected={open}>
          {props.children}
        </StyledNav>
        <div className="shutter-wrapper" aria-selected={open}>
          <StyledButton ref={hamburger} onClick={toggle} aria-selected={open} />
        </div>
      </StyledIsland>
    </StyledWrapper>
  );
};

export default DorknamicIsland;
