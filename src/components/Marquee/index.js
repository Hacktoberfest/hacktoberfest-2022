import LogoMark from 'assets/img/logo-hacktoberfest--mark.svg';

import {
  MarqueeWrapper
} from './Marquee.styles';

const Marquee = (props) => {
  return (
    <MarqueeWrapper {...props} direction={props.direction}>
      <ul className="marquee_content">
        <li>{props.text1}</li>
        <li><img src={LogoMark.src} alt="" /></li>
        <li>{props.text2}</li>
        <li><img src={LogoMark.src} alt="" /></li>
        <li>{props.text1}</li>
        <li><img src={LogoMark.src} alt="" /></li>
        <li>{props.text2}</li>
        <li><img src={LogoMark.src} alt="" /></li>
      </ul>

      <ul className="marquee_content" aria-hidden="true">
        <li>{props.text1}</li>
        <li><img src={LogoMark.src} alt="" /></li>
        <li>{props.text2}</li>
        <li><img src={LogoMark.src} alt="" /></li>
        <li>{props.text1}</li>
        <li><img src={LogoMark.src} alt="" /></li>
        <li>{props.text2}</li>
        <li><img src={LogoMark.src} alt="" /></li>
      </ul>
    </MarqueeWrapper>
  );
};

export default Marquee;