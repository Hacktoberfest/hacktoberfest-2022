import styled from 'styled-components';

const StyledSection = styled.section`
  width: 100%;
  margin-top: ${(props) => props.spacing_top || '128px'};
  margin-bottom: ${(props) => props.spacing_btm || '0px'};
  padding: 0 64px;

  .contents {
    max-width: 1312px;
    margin: 0 auto;

    &.home_content {
      h5 {
        margin-top: 24px;
      }
    }

    &.sub_hero {
      h4 {
        margin-top: 24px;
      }

      div {
        display: flex;
        gap: 24px;
        flex-flow: row wrap;
        margin-top: 40px;
      }
    }

    &.sub_content {

      h4 {
        margin: 24px 0 16px;
      }

      p {
        margin-top: 24px;
      }

      a {
        margin-top: 40px;
      }
    }

    &.center {
      text-align: center;
      margin: 128px auto 0 auto;
    }

  }

}

@media (max-width: 600px) {
  padding 0 24px;
}
`;

const Section = (props) => {
  return (
    <StyledSection
      id={props.id}
      spacing_top={props.spacing_top}
      spacing_btm={props.spacing_btm}
    >
      <div className={`contents ${props.type || ''}`}>{props.children}</div>
    </StyledSection>
  );
};

export default Section;
