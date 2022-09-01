import styled from 'styled-components';

const StyledSection = styled.section`
  margin-top: 128px;
  width: 100%;
`;

const StyledDiv = styled.div`
  margin: 0 auto;
  max-width: 1312px;
  padding: 0 64px;

  a {
    margin: 40px 0 8px 0;
    width: max-content;

    .btn {
      margin-bottom: 64px;
    }
  }

  h2 {
    text-shadow: ${(props) => props.theme.textShadow};
    margin-bottom: 40px;
    word-wrap: break-word;
  }

  h3 {
    max-width: 1200px;
    text-shadow: ${(props) => props.theme.smallTextShadow};
    word-wrap: break-word;
  }

  .btn {
    display: inline-block;
    margin-top: 40px;
    width: max-content;
    max-width: 100%;
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
      max-width: 100%;
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
      max-width: 1088px;
    }

    .btn {
      margin: 40px auto 64px auto;
    }

    a {
      width: 100%;
      justify-content: center;
    }
  }
`;

const Section = (props) => {
  return (
    <StyledSection>
      <StyledDiv className={props.style}>{props.children}</StyledDiv>
    </StyledSection>
  );
};

export default Section;
