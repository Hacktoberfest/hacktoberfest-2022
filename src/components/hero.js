import styled from 'styled-components';
import grid from 'assets/img/grid-square.svg';

const StyledSection = styled.section`
  width: 100%;
  padding: 0 64px;
  position: relative;
  min-height: ${(props) => props.height || '456px'};
  margin-top: ${(props) => props.spacing_top || 0};
  margin-bottom: ${(props) => props.spacing_btm || '128px'};
  display: flex;

  &:before {
    content: '';
    position: absolute;
    margin: 0 auto;
    left: 0;
    top: -10%;
    filter: brightness(${(props) => props.b}) sepia(1)
      hue-rotate(${(props) => props.h}deg) saturate(${(props) => props.s});
    background-image: url(${grid.src});
    opacity: 0.2;
    mask-image: radial-gradient(
      ellipse 70% 80% at 50% 50%,
      black 40%,
      transparent 70%
    );
    width: 100%;
    height: 120%;
    z-index: -1;
  }

  &:after {
    position: absolute;
    top: 0;
    left: 0;
    content: '';
    width: 100%;
    height: 100%;
    background: linear-gradient(
      45deg,
      ${(props) => props.gradientLeft} 0%,
      ${(props) => props.gradientRight} 100%
    );
    opacity: 0.2;
    z-index: -2;
    mask-image: radial-gradient(
      ellipse 70% 80% at 50% 50%,
      black -40%,
      transparent 60%
    );
  }

  @media (max-width: 600px) {
    padding: 0 24px;
  }
`;

const StyledHeroContent = styled.div`
  margin: 0 auto;
  display: flex;
  justify-content: flex-start;
  align-items: flex-end;
  max-width: 1312px;
  width: 100%;
  position: relative;

  #icon {
    transform-origin: top right;
    position: absolute;
    top: 40px;
    right: 40px;
    transform: scale(2);
  }

  h1 {
    display: inline-block;
    max-width: 100%;
  }
`;

const StyledContent = styled.div`
  display: flex;
  margin: 0 auto;
  max-width: 1312px;
  width: 100%;
  justify-content: center;
  align-items: center;
  flex-flow: row wrap;
  position: inherit;
`;

export const FauxHero = (props) => {
  return (
    <StyledSection
      h={props.h}
      s={props.s}
      b={props.b}
      gradientLeft={props.gradientLeft}
      gradientRight={props.gradientRight}
      height={props.height}
      spacing_top={props.spacing_top}
      spacing_btm={props.spacing_btm}
    >
      <StyledContent>{props.children}</StyledContent>
    </StyledSection>
  );
};

const Hero = (props) => {
  return (
    <StyledSection
      h={props.h}
      s={props.s}
      b={props.b}
      gradientLeft={props.gradientLeft}
      gradientRight={props.gradientRight}
      height={props.height}
      spacing_top={props.spacing_top}
      spacing_btm={props.spacing_btm}
    >
      <StyledHeroContent>
        <h1>{props.title}</h1>
        {props.children}
      </StyledHeroContent>
    </StyledSection>
  );
};

export default Hero;
