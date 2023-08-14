import styled from 'styled-components';

export const StyledSpotCard = styled.div`
  position: relative;
`;

export const StyledSpotCardImage = styled.div`
  width: 104px;
  height: 104px;
  position: relative;
  margin: 0 0 24px;

  img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;