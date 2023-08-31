import styled from 'styled-components';

export const StyledWistia = styled.div`
  display: flex;
  justify-content: center;
  margin: 64px 0 0;
  line-height: 0;
  position: relative;

  &::after {
    content: '';
    display: block;
    padding-bottom: 56.25%;
  }
`;

export const StyledWistiaWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

export const StyledWistiaVideo = styled.div``;
