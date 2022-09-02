import styled from 'styled-components';
import { breakpoints as bp, determineMediaQuery as mQ } from 'themes/breakpoints';

export const StyledContainer = styled.div`
  margin: 0 42px;
  padding: 0;
  
  ${mQ(bp.largeDesktop, 'min')} {
    max-width: 1440px;
    margin: 0 auto;
  }
`;

export const StyledEventHero = styled.div`
  h1 {
    margin: 48px 0 40px;
    text-shadow: -1px -1px 6px rgba(255, 227, 126, 0.5), 1px 1px 6px rgba(144, 148, 255, 0.5);
  }
  
  h3 {
    font-family: 'Elevon';
    margin-bottom: 16px;
    text-shadow: -1px -1px 6px rgba(255, 227, 126, 0.5), 1px 1px 6px rgba(144, 148, 255, 0.5);
  }
`;

export const StyledEvents = styled.div`
  margin: 128px 0 64px;
`;

export const StyledHeader = styled.div`
  display: grid;
  grid-gap: 32px;
  grid-template-columns: ${props => props.reverse ? '1fr 3fr' : '3fr 1fr'};

  ${mQ(bp.tablet, 'max')} {
    grid-template-columns: 1fr;
  }

  p {
    margin: 16px 0 0;
  }

  .special {
    margin: 40px 0 0;
  }
`;

export const StyledHeaderTitle = styled.div`
  h2 {
    text-shadow: -1px -1px 6px rgba(255, 227, 126, 0.5), 1px 1px 6px rgba(144, 148, 255, 0.5);
  }
  
  ${mQ(bp.tablet, 'max')} {
    ${props => props.reverse ? '' : 'grid-row-start: 1'};
  }
`;

export const StyledEventsListItemEyebrow = styled.div`
  color: ${props => props.theme[props.color] || props.theme.text};
`;

export const StyledList = styled.div`
  margin: 64px 0 0;
  position: relative;
`;

export const StyledListItem = styled.div`
  border-top: 1px solid rgba(229, 225, 230, 0.5);
  padding: 40px 16px;
  text-transform: uppercase;

  &::before {
    position: absolute;
    top: 0;
    left: 0;
    display: block;
    content: '';
    height: 1px;
    width: 100%;
    background: linear-gradient(90deg, ${props => props.theme.spark} 0%, ${props => props.theme.surf} 50%, ${props => props.theme.psybeam} 100%);
  }

  h3 {
    margin: 16px 0;
    font-family: 'JetBrains Mono';
    font-style: normal;
    font-weight: 500;
    font-size: 24px;
    line-height: 32px;
  }

  ul {
    li {
      display: inline-block;
      margin: 0 40px 0 0;

      span {
        font-family: 'JetBrains Mono';
        font-style: normal;
        font-weight: 500;
        font-size: 16px;
        line-height: 24px;
        opacity: 0.5;
      }
    }
  }
`;

export const StyledSpeakers = styled.div`
  margin: 126px 0 0;  
`;

export const StyledBrand = styled.div`
  margin: 126px 0 0;  
`;

export const StyledFAQ = styled.div`
  margin: 42px 0 0;

  &::after {
    position: relative;
    top: 16px;
    left: 0;
    display: block;
    content: '';
    height: 1px;
    width: 100%;
    background: linear-gradient(90deg, ${props => props.theme.spark} 0%, ${props => props.theme.surf} 50%, ${props => props.theme.psybeam} 100%);
  }

  h3 {
    margin-bottom: 20px;
    text-shadow: -1px -1px 6px rgba(255, 227, 126, 0.5), 1px 1px 6px rgba(144, 148, 255, 0.5);
  }

  details,
  div {
    margin: 16px 0;
  }

  details {
    ul {
      li {
        margin: 16px 0 16px 16px;
        list-style: disc;
      }
    }
  }
`;

export const StyledActions = styled.div`
  display: grid;
  grid-gap: 24px;
  grid-template-columns: fit-content(100%) fit-content(100%) fit-content(100%) fit-content(100%);

  ${mQ(bp.tablet, 'max')} {
    grid-template-columns: 1fr;
  }
`;


