import styled from 'styled-components';
import { breakpoints as bp, determineMediaQuery as mQ } from 'themes/breakpoints';
import footerBg from 'assets/img/bg-footer.svg';

export const StyledFooter = styled.footer`
  padding: 40px 0;

  ${mQ(bp.desktop)} {
    background: url(${footerBg.src}) no-repeat;
    background-size: 100% auto;
    padding: 56px 0 80px;
  }
`;

export const StyledFooterContainer = styled.div`
  padding: 64px 24px;
  display: grid;
  gap: 40px;
  position: relative;
  isolation: isolate;

  ${mQ(bp.desktop)} {
    gap: 64px;
    grid-template-columns: 274px 1fr;
    padding: 64px;
  }
`;

export const StyledFooterLogo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;

  .badge {
    margin: 0 0 32px;
  }

  p {
    font-size: 16px;
    font-style: normal;
    font-weight: 600;
    line-height: 26px; /* 162.5% */
    text-transform: uppercase;
    color: ${({ theme }) => theme.colors.neutral.manga300};
  }
`;

export const StyledFooterContent = styled.div`
  ${mQ(bp.desktop)} {
    padding: 32px 0 0;
  }
`;

export const StyledFooterLinks = styled.nav`
  display: grid;
  gap: 40px;
  grid-template-columns: minmax(0, 1fr);

  ${mQ(bp.desktop)} {
    gap: 64px;
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
`;

export const StyledFooterLinksColumn = styled.div`
  ul {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  a {
    display: inline-block;
    font-size: 16px;
    font-style: normal;
    font-weight: 600;
    line-height: 26px; /* 162.5% */
    text-transform: uppercase;
    position: relative;
    color: ${({ theme }) => theme.colors.neutral.manga300};
    transition: color 300ms ease-in-out, text-shadow 300ms ease-in-out;

    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 1px;
      background: ${({ theme }) => theme.colors.neutral.manga200};
      transform: scaleX(0);
      transition: transform 300ms ease-in-out;
    }

    &:hover {
      text-shadow: 1px 1px 10px rgba(236, 66, 55, 0.50), -1px -1px 10px rgba(255, 251, 164, 0.50);
      color: ${({ theme }) => theme.colors.neutral.manga200};

      &::after {
        transform: scaleX(1);
      }
    }
  }
`;

export const StyledFooterLinksTitle = styled.h3`
  margin: 0 0 16px;
  padding: 0 0 16px;
  font-size: 20px;
  font-style: normal;
  position: relative;
  font-weight: 800;
  line-height: 1.2;
  text-transform: uppercase;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background-image: linear-gradient(90deg, ${({ theme }) => theme.colors.neutral.manga400}, ${({ theme }) => theme.colors.neutral.manga400} 50%, transparent 50%, transparent 100%);
    background-size: 12px 2px;
  }
`;

export const StyledFooterBackground = styled.div`
  position: absolute;
  inset: 0;
  background: ${({ theme }) => theme.card.bg};
  backdrop-filter: blur(5px);
  z-index: -1;
  border-radius: 24px;
  overflow: hidden;

  ${mQ(bp.desktop)} {
    border-radius: 0;
    clip-path: polygon(43.4013px 4.25165px, 43.4013px 4.25165px, 44.3151632px 3.46837302px, 45.2796976px 2.75982976px, 46.2902604px 2.12783774px, 47.3422088px 1.57421448px, 48.4309px 1.1007775px, 49.5516912px 0.70934432px, 50.6999396px 0.40173246px, 51.8710024px 0.17975944px, 53.0602368px 0.04524278px, 54.263px 5.613940957957E-32px, calc(100% - 54.26px) 0px, calc(100% - 54.26px) 0px, calc(100% - 53.05898px) 0.04524278px, calc(100% - 51.87104px) 0.17975944px, calc(100% - 50.70086px) 0.40173246px, calc(100% - 49.55312px) 0.70934432px, calc(100% - 48.4325px) 1.1007775px, calc(100% - 47.34368px) 1.57421448px, calc(100% - 46.29134px) 2.12783774px, calc(100% - 45.28016px) 2.75982976px, calc(100% - 44.31482px) 3.46837302px, calc(100% - 43.4px) 4.25165px, calc(100% - 5.1400000000001px) 39.6268px, calc(100% - 5.1400000000001px) 39.6268px, calc(100% - 4.19904px) 40.5712526px, calc(100% - 3.3459199999998px) 41.5833408px, calc(100% - 2.5832800000001px) 42.6569002px, calc(100% - 1.9137599999999px) 43.7857664px, calc(100% - 1.3400000000001px) 44.963775px, calc(100% - 0.86464000000001px) 46.1847616px, calc(100% - 0.49031999999988px) 47.4425618px, calc(100% - 0.21968000000015px) 48.7310112px, calc(100% - 0.055359999999837px) 50.0439454px, calc(100% - 2.2737367544323E-13px) 51.3752px, calc(100% - 0px) calc(100% - 100.375px), calc(100% - 0px) calc(100% - 100.375px), calc(100% - 0.055359999999837px) calc(100% - 99.043789px), calc(100% - 0.21967999999993px) calc(100% - 97.730872px), calc(100% - 0.49032000000011px) calc(100% - 96.442423px), calc(100% - 0.86464000000001px) calc(100% - 95.184616px), calc(100% - 1.3399999999999px) calc(100% - 93.963625px), calc(100% - 1.9137599999999px) calc(100% - 92.785624px), calc(100% - 2.5832800000001px) calc(100% - 91.656787px), calc(100% - 3.3459200000002px) calc(100% - 90.583288px), calc(100% - 4.19904px) calc(100% - 89.571301px), calc(100% - 5.1400000000003px) calc(100% - 88.627px), calc(100% - 43.4px) calc(100% - 53.252px), calc(100% - 43.4px) calc(100% - 53.252px), calc(100% - 44.31482px) calc(100% - 52.468582px), calc(100% - 45.28016px) calc(100% - 51.759936px), calc(100% - 46.29134px) calc(100% - 51.127874px), calc(100% - 47.34368px) calc(100% - 50.574208px), calc(100% - 48.4325px) calc(100% - 50.10075px), calc(100% - 49.55312px) calc(100% - 49.709312px), calc(100% - 50.70086px) calc(100% - 49.401706px), calc(100% - 51.87104px) calc(100% - 49.179744px), calc(100% - 53.05898px) calc(100% - 49.045238px), calc(100% - 54.26px) calc(100% - 49px), calc(50% - -35.814px) calc(100% - 49px), calc(50% - -35.814px) calc(100% - 49px), calc(50% - -35.255932px) calc(100% - 48.990265px), calc(50% - -34.699256px) calc(100% - 48.96112px), calc(50% - -34.144464px) calc(100% - 48.912655px), calc(50% - -33.592048px) calc(100% - 48.84496px), calc(50% - -33.0425px) calc(100% - 48.758125px), calc(50% - -32.496312px) calc(100% - 48.65224px), calc(50% - -31.953976px) calc(100% - 48.527395px), calc(50% - -31.415984px) calc(100% - 48.38368px), calc(50% - -30.882828px) calc(100% - 48.221185px), calc(50% - -30.355px) calc(100% - 48.04px), calc(50% - 99.355px) calc(100% - 0.95999999999998px), calc(50% - 99.355px) calc(100% - 0.95999999999998px), calc(50% - 99.882828px) calc(100% - 0.77881499999995px), calc(50% - 100.415984px) calc(100% - 0.61631999999986px), calc(50% - 100.953976px) calc(100% - 0.47260499999999px), calc(50% - 101.496312px) calc(100% - 0.34775999999994px), calc(50% - 102.0425px) calc(100% - 0.24187499999999px), calc(50% - 102.592048px) calc(100% - 0.15504000000004px), calc(50% - 103.144464px) calc(100% - 0.087344999999914px), calc(50% - 103.699256px) calc(100% - 0.038880000000063px), calc(50% - 104.255932px) calc(100% - 0.0097349999999778px), calc(50% - 104.814px) calc(100% - 5.6843418860808E-14px), 54.263px calc(100% - 0px), 54.263px calc(100% - 0px), 53.0602368px calc(100% - 0.045237999999927px), 51.8710024px calc(100% - 0.17974399999991px), 50.6999396px calc(100% - 0.40170599999999px), 49.5516912px calc(100% - 0.70931199999995px), 48.4309px calc(100% - 1.10075px), 47.3422088px calc(100% - 1.574208px), 46.2902604px calc(100% - 2.127874px), 45.2796976px calc(100% - 2.7599359999999px), 44.3151632px calc(100% - 3.468582px), 43.4013px calc(100% - 4.2520000000001px), 5.13831px calc(100% - 39.627px), 5.13831px calc(100% - 39.627px), 4.1984325px calc(100% - 40.571301px), 3.3460416px calc(100% - 41.583288px), 2.5838337px calc(100% - 42.656787px), 1.9145052px calc(100% - 43.785624px), 1.3407525px calc(100% - 44.963625px), 0.865272px calc(100% - 46.184616px), 0.4907601px calc(100% - 47.442423px), 0.2199132px calc(100% - 48.730872px), 0.0554277px calc(100% - 50.043789px), 6.8873843261133E-32px calc(100% - 51.375px), 0px 51.3752px, 0px 51.3752px, 0.05542771px 50.0439454px, 0.21991328px 48.7310112px, 0.49076037px 47.4425618px, 0.86527264px 46.1847616px, 1.34075375px 44.963775px, 1.91450736px 43.7857664px, 2.58383713px 42.6569002px, 3.34604672px 41.5833408px, 4.19843979px 40.5712526px, 5.13832px 39.6268px, 43.4013px 4.25165px);
  }

  &::before,
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    ${mQ(bp.desktop)} {
      clip-path: polygon(calc(100% - 54.4px) 1px, calc(100% - 54.4px) 1px, calc(100% - 53.2666px) 1.0418px, calc(100% - 52.1488px) 1.1664px, calc(100% - 51.0502px) 1.3726px, calc(100% - 49.9744px) 1.6592px, calc(100% - 48.925px) 2.025px, calc(100% - 47.9056px) 2.4688px, calc(100% - 46.9198px) 2.9894px, calc(100% - 45.9712px) 3.5856px, calc(100% - 45.0634px) 4.2562px, calc(100% - 44.2px) 5px, calc(100% - 5.8999999999999px) 40.4px, calc(100% - 5.8999999999999px) 40.4px, calc(100% - 5.0122999999999px) 41.275px, calc(100% - 4.2103999999995px) 42.216px, calc(100% - 3.4960999999998px) 43.217px, calc(100% - 2.8711999999998px) 44.272px, calc(100% - 2.3375000000001px) 45.375px, calc(100% - 1.8968px) 46.52px, calc(100% - 1.5509px) 47.701px, calc(100% - 1.3016px) 48.912px, calc(100% - 1.1506999999999px) 50.147px, calc(100% - 1.1000000000001px) 51.4px, calc(100% - 1.0999999999999px) calc(100% - 100.4px), calc(100% - 1.0999999999999px) calc(100% - 100.4px), calc(100% - 1.1533999999997px) calc(100% - 99.147px), calc(100% - 1.3111999999994px) calc(100% - 97.912px), calc(100% - 1.5698px) calc(100% - 96.701px), calc(100% - 1.9255999999998px) calc(100% - 95.52px), calc(100% - 2.3749999999998px) calc(100% - 94.375px), calc(100% - 2.9143999999997px) calc(100% - 93.272px), calc(100% - 3.5401999999999px) calc(100% - 92.217px), calc(100% - 4.2487999999998px) calc(100% - 91.216px), calc(100% - 5.0365999999999px) calc(100% - 90.275px), calc(100% - 5.9000000000001px) calc(100% - 89.4px), calc(100% - 44.2px) calc(100% - 54px), calc(100% - 44.2px) calc(100% - 54px), calc(100% - 45.0634px) calc(100% - 53.2562px), calc(100% - 45.9712px) calc(100% - 52.5856px), calc(100% - 46.9198px) calc(100% - 51.9894px), calc(100% - 47.9056px) calc(100% - 51.4688px), calc(100% - 48.925px) calc(100% - 51.025px), calc(100% - 49.9744px) calc(100% - 50.6592px), calc(100% - 51.0502px) calc(100% - 50.3726px), calc(100% - 52.1488px) calc(100% - 50.1664px), calc(100% - 53.2666px) calc(100% - 50.0418px), calc(100% - 54.4px) calc(100% - 50px), calc(50% - -35.75px) calc(100% - 50px), calc(50% - -35.75px) calc(100% - 50px), calc(50% - -35.1529px) calc(100% - 49.9909px), calc(50% - -34.5612px) calc(100% - 49.9632px), calc(50% - -33.9743px) calc(100% - 49.9163px), calc(50% - -33.3916px) calc(100% - 49.8496px), calc(50% - -32.8125px) calc(100% - 49.7625px), calc(50% - -32.2364px) calc(100% - 49.6544px), calc(50% - -31.6627px) calc(100% - 49.5247px), calc(50% - -31.0908px) calc(100% - 49.3728px), calc(50% - -30.5201px) calc(100% - 49.1981px), calc(50% - -29.95px) calc(100% - 49px), calc(50% - 99.75px) calc(100% - 1.9px), calc(50% - 99.75px) calc(100% - 1.9px), calc(50% - 100.2357px) calc(100% - 1.7289999999999px), calc(50% - 100.7316px) calc(100% - 1.5759999999999px), calc(50% - 101.2359px) calc(100% - 1.441px), calc(50% - 101.7468px) calc(100% - 1.324px), calc(50% - 102.2625px) calc(100% - 1.225px), calc(50% - 102.7812px) calc(100% - 1.144px), calc(50% - 103.3011px) calc(100% - 1.081px), calc(50% - 103.8204px) calc(100% - 1.036px), calc(50% - 104.3373px) calc(100% - 1.009px), calc(50% - 104.85px) calc(100% - 1.0000000000001px), 54.3px calc(100% - 1px), 54.3px calc(100% - 1px), 53.1666px calc(100% - 1.0418px), 52.0488px calc(100% - 1.1663999999999px), 50.9502px calc(100% - 1.3726px), 49.8744px calc(100% - 1.6592px), 48.825px calc(100% - 2.025px), 47.8056px calc(100% - 2.4687999999999px), 46.8198px calc(100% - 2.9894px), 45.8712px calc(100% - 3.5856000000001px), 44.9634px calc(100% - 4.2562px), 44.1px calc(100% - 5.0000000000001px), 5.8px calc(100% - 40.4px), 5.8px calc(100% - 40.4px), 4.9123px calc(100% - 41.275px), 4.1104px calc(100% - 42.216px), 3.3961px calc(100% - 43.217px), 2.7712px calc(100% - 44.272px), 2.2375px calc(100% - 45.375px), 1.7968px calc(100% - 46.52px), 1.4509px calc(100% - 47.701px), 1.2016px calc(100% - 48.912px), 1.0507px calc(100% - 50.147px), 1px calc(100% - 51.4px), 1px 51.4px, 1px 51.4px, 1.0534px 50.147px, 1.2112px 48.912px, 1.4698px 47.701px, 1.8256px 46.52px, 2.275px 45.375px, 2.8144px 44.272px, 3.4402px 43.217px, 4.1488px 42.216px, 4.9366px 41.275px, 5.8px 40.4px, 44.1px 5px, 44.1px 5px, 44.9634px 4.2562px, 45.8712px 3.5856px, 46.8198px 2.9894px, 47.8056px 2.4688px, 48.825px 2.025px, 49.8744px 1.6592px, 50.9502px 1.3726px, 52.0488px 1.1664px, 53.1666px 1.0418px, 54.3px 1px, calc(100% - 54.4px) 1px, calc(100% - 54.4px) 0px, 54.3px 0px, 54.3px 0px, 53.1038px 0.0448px, 51.9184px 0.1784px, 50.7486px 0.3996px, 49.5992px 0.7072px, 48.475px 1.1px, 47.3808px 1.5768px, 46.3214px 2.1364px, 45.3016px 2.7776px, 44.3262px 3.4992px, 43.4px 4.3px, 5.1px 39.6px, 5.1px 39.6px, 4.1796px 40.5622px, 3.3408px 41.5856px, 2.5872px 42.6654px, 1.9224px 43.7968px, 1.35px 44.975px, 0.8736px 46.1952px, 0.4968px 47.4526px, 0.2232px 48.7424px, 0.0564px 50.0598px, 7.0257924371246E-32px 51.4px, 0px calc(100% - 51.4px), 0px calc(100% - 51.4px), 0.0564px calc(100% - 50.0599px), 0.2232px calc(100% - 48.7432px), 0.4968px calc(100% - 47.4553px), 0.8736px calc(100% - 46.2016px), 1.35px calc(100% - 44.9875px), 1.9224px calc(100% - 43.8184px), 2.5872px calc(100% - 42.6997px), 3.3408px calc(100% - 41.6368px), 4.1796px calc(100% - 40.6351px), 5.1px calc(100% - 39.7px), 43.4px calc(100% - 4.3px), 43.4px calc(100% - 4.3px), 44.3235px calc(100% - 3.5235px), 45.292px calc(100% - 2.8159999999999px), 46.3025px calc(100% - 2.1805px), 47.352px calc(100% - 1.62px), 48.4375px calc(100% - 1.1375px), 49.556px calc(100% - 0.73599999999999px), 50.7045px calc(100% - 0.41850000000005px), 51.88px calc(100% - 0.18799999999993px), 53.0795px calc(100% - 0.047500000000014px), 54.3px calc(100% - 5.6843418860808E-14px), calc(50% - 104.85px) calc(100% - 0px), calc(50% - 104.85px) calc(100% - 0px), calc(50% - 104.2829px) calc(100% - 0.0090999999999894px), calc(50% - 103.7212px) calc(100% - 0.036799999999971px), calc(50% - 103.1643px) calc(100% - 0.083699999999965px), calc(50% - 102.6116px) calc(100% - 0.15039999999999px), calc(50% - 102.0625px) calc(100% - 0.23750000000001px), calc(50% - 101.5164px) calc(100% - 0.34559999999999px), calc(50% - 100.9727px) calc(100% - 0.4753px), calc(50% - 100.4308px) calc(100% - 0.62719999999996px), calc(50% - 99.8901px) calc(100% - 0.80189999999993px), calc(50% - 99.35px) calc(100% - 1.0000000000001px), calc(50% - -30.35px) calc(100% - 48px), calc(50% - -30.35px) calc(100% - 48px), calc(50% - -30.8901px) calc(100% - 48.1738px), calc(50% - -31.4308px) calc(100% - 48.3344px), calc(50% - -31.9727px) calc(100% - 48.4806px), calc(50% - -32.5164px) calc(100% - 48.6112px), calc(50% - -33.0625px) calc(100% - 48.725px), calc(50% - -33.6116px) calc(100% - 48.8208px), calc(50% - -34.1643px) calc(100% - 48.8974px), calc(50% - -34.7212px) calc(100% - 48.9536px), calc(50% - -35.2829px) calc(100% - 48.9882px), calc(50% - -35.85px) calc(100% - 49px), calc(100% - 54.3px) calc(100% - 49px), calc(100% - 54.3px) calc(100% - 49px), calc(100% - 53.1038px) calc(100% - 49.0448px), calc(100% - 51.9184px) calc(100% - 49.1784px), calc(100% - 50.7486px) calc(100% - 49.3996px), calc(100% - 49.5992px) calc(100% - 49.7072px), calc(100% - 48.475px) calc(100% - 50.1px), calc(100% - 47.3808px) calc(100% - 50.5768px), calc(100% - 46.3214px) calc(100% - 51.1364px), calc(100% - 45.3016px) calc(100% - 51.7776px), calc(100% - 44.3262px) calc(100% - 52.4992px), calc(100% - 43.4px) calc(100% - 53.3px), calc(100% - 5.0999999999999px) calc(100% - 88.7px), calc(100% - 5.0999999999999px) calc(100% - 88.7px), calc(100% - 4.1552999999999px) calc(100% - 89.6378px), calc(100% - 3.3023999999996px) calc(100% - 90.6464px), calc(100% - 2.5431000000001px) calc(100% - 91.7186px), calc(100% - 1.8791999999999px) calc(100% - 92.8472px), calc(100% - 1.3125px) calc(100% - 94.025px), calc(100% - 0.84479999999985px) calc(100% - 95.2448px), calc(100% - 0.47790000000009px) calc(100% - 96.4994px), calc(100% - 0.21360000000004px) calc(100% - 97.7816px), calc(100% - 0.053700000000163px) calc(100% - 99.0842px), calc(100% - 2.2737367544323E-13px) calc(100% - 100.4px), calc(100% - 0px) 51.4px, calc(100% - 0px) 51.4px, calc(100% - 0.056399999999712px) 50.0599px, calc(100% - 0.22319999999945px) 48.7432px, calc(100% - 0.49680000000012px) 47.4553px, calc(100% - 0.87360000000012px) 46.2016px, calc(100% - 1.3499999999999px) 44.9875px, calc(100% - 1.9223999999999px) 43.8184px, calc(100% - 2.5871999999999px) 42.6997px, calc(100% - 3.3407999999999px) 41.6368px, calc(100% - 4.1795999999997px) 40.6351px, calc(100% - 5.1000000000001px) 39.7px, calc(100% - 43.4px) 4.3px, calc(100% - 43.4px) 4.3px, calc(100% - 44.3506px) 3.4992px, calc(100% - 45.3408px) 2.7776px, calc(100% - 46.3682px) 2.1364px, calc(100% - 47.4304px) 1.5768px, calc(100% - 48.525px) 1.1px, calc(100% - 49.6496px) 0.7072px, calc(100% - 50.8018px) 0.3996px, calc(100% - 51.9792px) 0.1784px, calc(100% - 53.1794px) 0.0448px, calc(100% - 54.4px) 5.5466782398352E-32px, calc(100% - 54.4px) 0px);
    }

    ${mQ(bp.desktop - 1, 'max')} {
      mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
      -webkit-mask-composite: destination-out; /* stylelint-disable-line property-no-vendor-prefix */
      mask-composite: exclude;
      padding: 1px;
      border-radius: inherit;
    }
  }

  &::before {
    background: linear-gradient(77.9deg, #EC4237 0%, #33B6D8 100%);
  }

  &::after {
    background: linear-gradient(230deg, #FFFBA4 0%, rgba(255, 251, 164, 0) 100%);
    opacity: .3;
  }
`;