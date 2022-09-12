import styled from 'styled-components';
import grid from 'assets/img/grid.svg';

const StyledSection = styled.section`
  width: 100%;
  padding: 0 64px;

  &:before {
    position: absolute;
    margin: 0 auto;
    left: 0;
    top: 0;
    content: '';
    background: url(${grid.src}) no-repeat center center;
    background-size: cover;
    width: 100%;
    height: 600px;
    z-index: -1;
  }

  .hero {
    margin: 0 auto;
    display: flex;
    height: 456px;
    justify-content: flex-start;
    align-items: flex-end;
    max-width: 1312px;
    position: relative;

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
  console.log('ok');

  return (
    <StyledSection>
      {/* <div className="background"></div> */}
      <div className="hero">
        <h1>Participation</h1>
      </div>
    </StyledSection>
  );
};

export default Hero;
