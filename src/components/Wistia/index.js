import Script from 'next/script';
import {
  StyledWistia,
  StyledWistiaWrapper,
  StyledWistiaVideo,
} from './Wistia.styles';

const Wistia = ({ id }) => (
  <>
    <Script src={`https://fast.wistia.com/embed/medias/${id}.jsonp`} />
    <Script src="https://fast.wistia.com/assets/external/E-v1.js" />
    <StyledWistia>
      <StyledWistiaWrapper className="wistia_responsive_wrapper">
        <StyledWistiaVideo
          className={`wistia_embed wistia_async_${id} videoFoam=true `}
        />
      </StyledWistiaWrapper>
    </StyledWistia>
  </>
);

export default Wistia;
