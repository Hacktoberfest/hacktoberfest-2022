import styled from 'styled-components';
import { useThemeToggle } from 'components/theme';
import Button from 'components/button';
import Card from 'components/card';
import Logo, { Globe, Bug } from 'components/logo';
import Navigation from 'components/navigation';
import Marquee from 'components/marquee';

const Section = styled.section`
  width: 100vw;
  margin-top: 64px;

  .wrapper {
    margin: 0 auto;
    max-width: 1440px;
    padding: 0 64px;

    .wrapperJr {
      border: 1px solid ${(props) => props.theme.text};
      border-radius: 16px;
      display: flex;
      flex-wrap: wrap;
      gap: 40px;
      margin: 40px 0;
      padding: 24px 24px;
    }
  }
`;

const Library = () => {
  const themeToggle = useThemeToggle();
  return (
    <>
      <Navigation />
      <Section>
        <div className="wrapper">
          <h1>Components library</h1>
          <div className="wrapperJr">
            <Logo />
            {/* <Bug /> */}
            {/* <Globe /> */}
          </div>
          <div className="wrapperJr">
            <Button onClick={themeToggle}>toggle page theme</Button>
            <Button special onClick={themeToggle}>
              toggle page theme
            </Button>
          </div>
          <div className="wrapperJr">
            <Card
              primary="spark"
              secondary="psybeam"
              title="days"
              number="26"
              delay="0s"
            />
            <Card
              primary="psybeam"
              secondary="surf"
              title="hours"
              number="08"
              delay="0.5s"
            />
            <Card
              primary="surf"
              secondary="spark"
              title="minutes"
              number="33"
              delay="1.3s"
            />
          </div>
          <div className="wrapperJr">
            <Marquee p2="outline" p3="fill psybeam" direction="forwards" />
            <Marquee
              p1="outline"
              p2="fill giga"
              p3="fill surf"
              direction="reverse"
            />
          </div>
        </div>
      </Section>
    </>
  );
};

export default Library;
