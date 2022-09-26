import styled, { keyframes } from 'styled-components';

const marqueeScroll = () => keyframes`
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(calc(-100% - var(--gap)));
  }
`;

const MarqueeWrapper = styled.div`
  --gap: 40px;
  display: flex;
  gap: var(--gap);
  overflow: hidden;
  width: 100%;
  user-select: none;

  .marquee_content {
    animation: ${marqueeScroll} 60s linear infinite
      ${(props) => props.direction || 'forwards'};
    display: flex;
    flex-shrink: 0;
    gap: var(--gap);
    justify-content: space-around;
    min-width: 100%;
    margin-top: -40px;

    @media (prefers-reduced-motion) {
      animation-play-state: paused;
    }

    li {
      font-family: 'Vanguard';
      font-size: 144px;
      line-height: 120%;
      text-shadow: ${(props) => props.theme.glowLite};
    }
  }
`;

const Marquee = (props) => {
  return (
    <MarqueeWrapper {...props} direction={props.direction}>
      <ul className="marquee_content">
        <li>{props.text1}</li>
        <li>•</li>
        <li>{props.text2}</li>
        <li>•</li>
        <li>{props.text1}</li>
        <li>•</li>
        <li>{props.text2}</li>
        <li>•</li>
      </ul>

      <ul className="marquee_content" aria-hidden="true">
        <li>{props.text1}</li>
        <li>•</li>
        <li>{props.text2}</li>
        <li>•</li>
        <li>{props.text1}</li>
        <li>•</li>
        <li>{props.text2}</li>
        <li>•</li>
      </ul>
    </MarqueeWrapper>
  );
};

export default Marquee;
