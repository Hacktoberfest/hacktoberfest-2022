import LogoMark from 'assets/img/logo-hacktoberfest--mark.svg';

import { MarqueeWrapper } from './Marquee.styles';

const Marquee = ({ text1, text2, direction, ...props }) => {
  return (
    <MarqueeWrapper {...props} $direction={direction}>
      <ul className="marquee_content">
        <li>{text1}</li>
        <li>
          <img src={LogoMark.src} alt="" />
        </li>
        <li>{text2}</li>
        <li>
          <img src={LogoMark.src} alt="" />
        </li>
        <li>{text1}</li>
        <li>
          <img src={LogoMark.src} alt="" />
        </li>
        <li>{text2}</li>
        <li>
          <img src={LogoMark.src} alt="" />
        </li>
      </ul>

      <ul className="marquee_content" aria-hidden="true">
        <li>{text1}</li>
        <li>
          <img src={LogoMark.src} alt="" />
        </li>
        <li>{text2}</li>
        <li>
          <img src={LogoMark.src} alt="" />
        </li>
        <li>{text1}</li>
        <li>
          <img src={LogoMark.src} alt="" />
        </li>
        <li>{text2}</li>
        <li>
          <img src={LogoMark.src} alt="" />
        </li>
      </ul>
    </MarqueeWrapper>
  );
};

export default Marquee;
