import styled from 'styled-components';
import { StyledButton } from './button';

const StyledSection = styled.section`
  width: 100%;
  margin-top: ${(props) => props.spacing_top || '128px'};
  margin-bottom: ${(props) => props.spacing_btm || '0px'};
  padding: 0 64px;

  .contents {
    max-width: 1312px;
    margin: 0 auto;

    &.home_content {
      > h5 {
        margin-top: 24px;
      }
    }

    &.sub_hero {
      margin-top: -64px;
      
      > div {
        display: flex;
        gap: 24px;
        flex-flow: row wrap;
      }
    }

    &.sub_content {
      h2 {
        margin-bottom: 40px;
      }

      h4 {
        margin: 24px 0 16px;
      }

      p {
        margin-top: 24px;
      }

      ${StyledButton} {
        margin-top: 40px;
      }

      table {
        margin-top: 24px;
        border-spacing: 0;
        width: 100%;
        
        th, tr, td, li {
          font-family: "JetBrains Mono", monospace;
        }

        td {
          border-top: 1px solid ${(props) => props.theme.text};
          border-left: 1px solid ${(props) => props.theme.text};
          padding: 24px;
        }
      }
    }

    &.center {
      text-align: center;
      margin: 128px auto 0 auto;
    }
  }
}

@media (max-width: 600px) {
  padding: 0 24px;
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
