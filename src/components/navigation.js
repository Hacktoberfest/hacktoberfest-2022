import styled from 'styled-components';
import Logo from './logo';

const Wrapper = styled.header``;

const Navigation = () => {
  console.log('ok');
  return (
    <Wrapper>
      <nav>
        <a href="#" target="_blank">
          <Logo />
        </a>
      </nav>
    </Wrapper>
  );
};

export default Navigation;
