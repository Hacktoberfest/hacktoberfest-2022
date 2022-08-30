import styled from 'styled-components';
import { useThemeToggle } from 'components/theme';
import Button from 'components/button';
import Card from 'components/card';
import Logo, { Globe, Bug } from 'components/logo';
import Marquee from 'components/marquee';
import Divider from 'components/divider';
import Headline from 'components/headline';
import Anchor from 'components/anchor';

const Section = styled.section`
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
          <div className="wrapperJr">
            <Divider />
            <Divider style="reverse" />
          </div>
          <div className="wrapperJr">
            <Headline style="right">
              <Divider style="reverse" />
              <Anchor href="#prepare-to-hack" />
              <h2>Prepare to Hack Right</h2>
              <h3>
                Hacktoberfest is for everyone. Whether it’s your first time —or
                your ninth, it’s almost time to hack out four pristine
                pull/merge requests and complete your mission for open source.
                Join other members of the open source community on the
                Hacktoberfest Discord.
              </h3>
              <Button as="a" href="#" special>
                Join the hacktoberfest discord
              </Button>
            </Headline>
            <Headline>
              <Divider />
              <Anchor href="#prepare-to-hack" />
              <h2>Prepare to Hack</h2>
              <h3>
                Hacktoberfest is for everyone. Whether it’s your first time —or
                your ninth, it’s almost time to hack out four pristine
                pull/merge requests and complete your mission for open source.
                Join other members of the open source community on the
                Hacktoberfest Discord.
              </h3>
              <Button as="a" href="#" special>
                Join the hacktoberfest discord
              </Button>
            </Headline>
            <Headline style="center">
              <h2>Prepare to Hack</h2>
              <h3>
                Hacktoberfest is for everyone. Whether it’s your first time —or
                your ninth, it’s almost time to hack out four pristine
                pull/merge requests and complete your mission for open source.
                Join other members of the open source community on the
                Hacktoberfest Discord.
              </h3>
              <Button as="a" href="#" special>
                Join the hacktoberfest discord
              </Button>
            </Headline>
          </div>
        </div>
      </Section>
    </>
  );
};

export default Library;
