import styled from 'styled-components';
import grid from 'assets/img/grid-square.svg';

const StyledSection = styled.section`
  width: 100%;
  padding: 0 64px;

  &:before {
    content: '';
    position: absolute;
    margin: 0 auto;
    left: 0;
    top: 0;
    filter: brightness(${(props) => props.b}) sepia(1)
      hue-rotate(${(props) => props.h}deg) saturate(${(props) => props.s});
    background-image: url(${grid.src});
    opacity: 0.2;
    mask-image: radial-gradient(
      ellipse 70% 70% at 50% 50%,
      black 40%,
      transparent 70%
    );
    width: 100%;
    height: 600px;
    z-index: -1;
  }

  &:after {
    position: absolute;
    top: 10%;
    left: 0;
    content: '';
    width: 100%;
    height: 40%;
    background: linear-gradient(
      45deg,
      ${(props) => props.gradientLeft} 0%,
      ${(props) => props.gradientRight} 100%
    );
    opacity: 0.2;
    z-index: -2;
    mask-image: radial-gradient(
      ellipse 70% 80% at 50% 50%,
      black 0%,
      transparent 60%
    );
  }

  .hero {
    margin: 0 auto;
    display: flex;
    height: 456px;
    justify-content: flex-start;
    align-items: flex-end;
    max-width: 1312px;
    position: relative;

    #icon {
      position: absolute;
      top: 40px;
      right: 40px;
      transform: scale(2);
    }

    h1 {
      display: inline-block;
      max-width: 100%;
    }
  }

  @media (max-width: 600px) {
    padding: 0 24px;
  }
`;

const Hero = (props) => {
  return (
    <StyledSection
      h={props.h}
      s={props.s}
      b={props.b}
      gradientLeft={props.gradientLeft}
      gradientRight={props.gradientRight}
    >
      <div className="hero">
        <h1>Participation</h1>
        {props.children}
      </div>
    </StyledSection>
  );
};

export default Hero;
