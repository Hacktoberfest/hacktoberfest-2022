import Button from './button';
import Logo, { LogoWrapper } from './logo';
import styled from 'styled-components';

const Wrapper = styled.header`
  padding: 72px 64px 0px 64px;
  width: 100%;

  div {
    align-items: center;
    display: flex;
    justify-content: space-between;
    margin: 0 auto;
    max-width: 1312px;

    ${LogoWrapper} {
      transform: scale(2) rotate(-8deg);
    }

    nav {
      display: flex;
      gap: 16px;

      &.condensed {
        display: none;
      }

      @media (max-width: 1180px) {
        &.expanded {
          display: none;
        }
        &.condensed {
          display: flex;
        }
      }
    }
  }
  @media (max-width: 600px) {
    padding: 40px 24px;
    div {
      ${LogoWrapper} {
        transform: scale(1) rotate(0deg);
      }
    }
  }
  @media (max-width: 375px) {
    div {
      ${LogoWrapper} {
        transform-origin: center left;
        transform: scale(0.8);
      }
    }
  }
`;

const Navigation = () => {
  return (
    <Wrapper>
      <div>
        <Logo link="#" />
        <nav className="expanded">
          <Button as="a" href="#">
            Participation
          </Button>
          <Button as="a" href="#">
            Events
          </Button>
          <Button as="a" href="#">
            Donate
          </Button>
          <Button as="a" href="#">
            About
          </Button>
          <Button as="a" special>
            Join the Discord
          </Button>
        </nav>
        <nav className="condensed">
          <Button>Menu</Button>
        </nav>
      </div>
    </Wrapper>
  );
};

export default Navigation;
