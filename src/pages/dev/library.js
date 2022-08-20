import styled from 'styled-components';
import { useThemeToggle } from 'components/theme';
import Logo, { Globe, Bug } from 'components/logo';
import Button from 'components/button';

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
      gap: 40px;
      margin: 40px 0;
      padding: 24px 24px;
    }
  }
`;

const Library = () => {
  const themeToggle = useThemeToggle();
  return (
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
        </div>
      </div>
    </Section>
  );
};

export default Library;
