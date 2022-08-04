import styled, { keyframes } from 'styled-components';

const spinAnimation = (x) => keyframes`
to {
  width: ${x}px;
}
`;

const StyledDiv = styled.div``;

const Wrapper = styled(StyledDiv)`
  width: 64px;
  height: 64px;
  position: relative;
  background: ${(props) => props.theme.body};
  border-radius: 100%;
  transition: 0.2s ease;
  transform: rotate(30deg);

  svg {
    filter: drop-shadow(-2px 0px 1px rgba(255, 227, 126, 0.3))
      drop-shadow(2px 0px 1px rgba(144, 148, 255, 0.4));
  }

  &:after {
    content: '';
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background: ${(props) => props.theme.holo};
    border-radius: 100%;
    mix-blend-mode: ${(props) => props.theme.overlay};
  }

  &:hover {
    transform: scale(0.9) rotate(45deg);
  }
`;

const Spinner = styled(StyledDiv)`
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;

  div {
    width: 32px;
    height: 64px;
    margin: 0 auto;
    border: 2px solid ${(props) => props.theme.text};
    border-radius: 100%;
    filter: drop-shadow(-2px 0px 1px rgba(255, 227, 126, 0.3))
      drop-shadow(2px 0px 1px rgba(144, 148, 255, 0.4));
    animation: ${(props) => spinAnimation(props.spin)} 1s linear infinite
      alternate;
  }
`;

const Logo = (props) => (
  <Wrapper {...props}>
    <svg
      width="64"
      height="64"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3.6342 17.1745C8.98085 6.96576 19.677 0.000121937 32 0.000121853C49.6731 0.000121733 64 14.327 64 32.0001C64 49.6732 49.6731 64.0001 32 64.0001C17.6715 64.0001 5.54256 54.5828 1.46494 41.6C1.465 41.6001 1.46488 41.6 1.46494 41.6C0.945868 39.9473 0.557068 38.2365 0.311035 36.4802C0.105943 35.0163 2.27894e-07 33.5206 2.17557e-07 32.0001C1.86135e-07 27.3783 0.979842 22.9853 2.74313 19.0176C2.74315 19.0176 2.74311 19.0175 2.74313 19.0176C3.02096 18.3924 3.31822 17.7777 3.6342 17.1745C3.63419 17.1745 3.63422 17.1745 3.6342 17.1745ZM59.5777 43.8294C54.9878 54.5159 44.3679 62.0001 32 62.0001C19.6322 62.0001 9.01235 54.516 4.42236 43.8295C5.75912 44.6325 7.30536 45.3629 9.01727 46.0134C14.948 48.2671 23.0739 49.6402 31.9999 49.6402C40.9259 49.6402 49.0518 48.2671 54.9825 46.0134C56.6946 45.3628 58.2409 44.6324 59.5777 43.8294ZM60.7775 40.5048C59.2825 41.835 57.0763 43.0782 54.2721 44.1438C48.6212 46.2912 40.747 47.6402 31.9999 47.6402C23.2528 47.6402 15.3787 46.2912 9.72772 44.1439C6.92362 43.0783 4.71752 41.8351 3.22262 40.505C2.42699 37.8087 2 34.9543 2 32.0001C2 27.7929 2.86605 23.788 4.42961 20.1539C5.76471 20.9551 7.30846 21.6841 9.01727 22.3334C14.948 24.5871 23.0739 25.9602 31.9999 25.9602C40.9259 25.9602 49.0518 24.5871 54.9825 22.3334C56.6914 21.6841 58.2352 20.9551 59.5704 20.1538C61.1339 23.7879 62 27.7929 62 32.0001C62 34.9542 61.573 37.8085 60.7775 40.5048ZM58.7137 18.3342C57.4733 19.0965 55.9841 19.8133 54.2721 20.4639C48.6212 22.6112 40.747 23.9602 31.9999 23.9602C23.2528 23.9602 15.3787 22.6112 9.72772 20.4639C8.01574 19.8133 6.52667 19.0966 5.28625 18.3342C10.2572 8.63663 20.3536 2.00012 32 2.00012C43.6464 2.00012 53.7427 8.63659 58.7137 18.3342Z"
        fill="currentColor"
      />
    </svg>
    <Spinner spin="64">
      <div />
    </Spinner>
    <Spinner spin="0">
      <div />
    </Spinner>
  </Wrapper>
);

export default Logo;
