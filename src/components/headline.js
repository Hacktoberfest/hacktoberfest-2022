import styled from 'styled-components';

const StyledDiv = styled.div`
  width: 100%;
  margin-top: 128px;

  a {
    margin: 40px 0 8px 0;
    width: max-content;
  }

  h2 {
    text-shadow: ${(props) => props.theme.textShadow};
    margin-bottom: 40px;
  }

  h3 {
    max-width: 1200px;
    text-shadow: ${(props) => props.theme.smallTextShadow};
  }

  .btn {
    display: inline-block;
    margin-top: 40px;
    width: max-content;
  }

  &.right {
    text-align: right;

    h3 {
      margin-left: auto;
      margin-right: 0;
    }

    .btn {
      margin-right: 0;
      width: max-content;
    }

    a {
      margin-right: 0;
      margin-left: auto;
    }
  }

  &.center {
    text-align: center;
    margin: 128px auto 0 auto;

    h3 {
      margin: 0 auto;
    }

    .btn {
      margin: 40px auto 0 auto;
    }

    a {
      width: 100%;
      justify-content: center;
    }
  }
`;

const Headline = (props) => {
  console.log('ok');
  return <StyledDiv className={props.style}>{props.children}</StyledDiv>;
};

export default Headline;
