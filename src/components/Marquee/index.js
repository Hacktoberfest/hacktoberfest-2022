import { MarqueeWrapper } from './Marquee.styles';

const Marquee = ({ text1, text2, direction, ...props }) => {
  return (
    <MarqueeWrapper {...props} $direction={direction}>
      <ul className="marquee_content">
        <li>{text1}</li>
        <li>
          <span></span>
        </li>
        <li>{text2}</li>
        <li>
          <span></span>
        </li>
        <li>{text1}</li>
        <li>
          <span></span>
        </li>
        <li>{text2}</li>
        <li>
          <span></span>
        </li>
      </ul>

      <ul className="marquee_content" aria-hidden="true">
        <li>{text1}</li>
        <li>
          <span></span>
        </li>
        <li>{text2}</li>
        <li>
          <span></span>
        </li>
        <li>{text1}</li>
        <li>
          <span></span>
        </li>
        <li>{text2}</li>
        <li>
          <span></span>
        </li>
      </ul>
    </MarqueeWrapper>
  );
};

export default Marquee;
