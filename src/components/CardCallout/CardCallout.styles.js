import styled from 'styled-components';
import {
  breakpoints as bp,
  determineMediaQuery as mQ,
} from 'themes/breakpoints';
import { body20 } from 'themes/typography';

export const StyledCardCallout = styled.div`
  padding: 48px 24px;
  position: relative;
  color: ${({ theme }) => theme.colors.neutral.manga300};
  min-height: 186px;
  isolation: isolate;

  ${mQ(bp.desktop)} {
    padding: 24px;
  }
`;

export const StyledCardCalloutContainer = styled.div`
  position: relative;
  z-index: 5;
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;

  ${mQ(bp.desktop)} {
    grid-template-columns: 80px minmax(0, 1fr);
    gap: 0 56px;
    align-items: flex-end;
  }
`;

export const StyledCardCalloutImage = styled.div`
  position: relative;
  line-height: 0;
  max-width: 80px;

  ${mQ(bp.desktop)} {
    max-width: 100%;
  }

  &::after {
    content: '';
    display: block;
    padding-bottom: 100%;
  }

  img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const StyledCardCalloutContent = styled.div``;

export const StyledCardCalloutTitle = styled.h2`
  margin: 0 0 24px;
  ${body20};
`;

export const StyledCardBackground = styled.div`
  position: absolute;
  inset: 0;
  background: ${({ theme }) => theme.card.bg};
  backdrop-filter: blur(5px);
  border-radius: 24px;
  z-index: -1;

  ${mQ(bp.desktop)} {
    border-radius: 0;
    clip-path: polygon(
      131.364px 7.90849px,
      131.364px 7.90849px,
      132.295074px 6.49664874px,
      133.357272px 5.20487552px,
      134.538858px 4.03989418px,
      135.828096px 3.00842856px,
      137.21325px 2.1172025px,
      138.682584px 1.37293984px,
      140.224362px 0.78236442px,
      141.826848px 0.35220008px,
      143.478306px 0.08917066px,
      145.167px 1.112926197681e-31px,
      calc(100% - 30.223px) 0px,
      calc(100% - 30.223px) 0px,
      calc(100% - 29.02724px) 0.04472065px,
      calc(100% - 27.8448px) 0.177698px,
      calc(100% - 26.68024px) 0.39715515px,
      calc(100% - 25.53812px) 0.7013152px,
      calc(100% - 24.423px) 1.08840125px,
      calc(100% - 23.33944px) 1.5566364px,
      calc(100% - 22.292px) 2.10424375px,
      calc(100% - 21.28524px) 2.7294464px,
      calc(100% - 20.32372px) 3.43046745px,
      calc(100% - 19.412px) 4.20553px,
      calc(100% - 5.188px) 17.244px,
      calc(100% - 5.188px) 17.244px,
      calc(100% - 4.239378px) 18.1895624px,
      calc(100% - 3.3789439999997px) 19.2037792px,
      calc(100% - 2.6094459999999px) 20.2803948px,
      calc(100% - 1.933632px) 21.4131536px,
      calc(100% - 1.35425px) 22.5958px,
      calc(100% - 0.87404800000002px) 23.8220784px,
      calc(100% - 0.4957740000001px) 25.0857332px,
      calc(100% - 0.22217599999988px) 26.3805088px,
      calc(100% - 0.056001999999921px) 27.7001496px,
      calc(100% - 1.1368683772162e-13px) 29.0384px,
      calc(100% - 0px) calc(100% - 29.038px),
      calc(100% - 0px) calc(100% - 29.038px),
      calc(100% - 0.056001999999921px) calc(100% - 27.699993px),
      calc(100% - 0.22217599999988px) calc(100% - 26.380544px),
      calc(100% - 0.49577399999998px) calc(100% - 25.085911px),
      calc(100% - 0.8740479999999px) calc(100% - 23.822352px),
      calc(100% - 1.35425px) calc(100% - 22.596125px),
      calc(100% - 1.933632px) calc(100% - 21.413488px),
      calc(100% - 2.6094459999999px) calc(100% - 20.280699px),
      calc(100% - 3.3789439999999px) calc(100% - 19.204016px),
      calc(100% - 4.239378px) calc(100% - 18.189697px),
      calc(100% - 5.1880000000001px) calc(100% - 17.244px),
      calc(100% - 19.412px) calc(100% - 4.206px),
      calc(100% - 19.412px) calc(100% - 4.206px),
      calc(100% - 20.32372px) calc(100% - 3.430917px),
      calc(100% - 21.28524px) calc(100% - 2.729856px),
      calc(100% - 22.292px) calc(100% - 2.104599px),
      calc(100% - 23.33944px) calc(100% - 1.556928px),
      calc(100% - 24.423px) calc(100% - 1.088625px),
      calc(100% - 25.53812px) calc(100% - 0.701472px),
      calc(100% - 26.68024px) calc(100% - 0.39725099999998px),
      calc(100% - 27.8448px) calc(100% - 0.17774400000002px),
      calc(100% - 29.02724px) calc(100% - 0.044733000000008px),
      calc(100% - 30.223px) calc(100% - 2.8421709430404e-14px),
      16px calc(100% - 0px),
      16px calc(100% - 0px),
      13.40471592px calc(100% - 0.20940099999999px),
      10.94276096px calc(100% - 0.81564799999992px),
      8.64707704px calc(100% - 1.785807px),
      6.55060608px calc(100% - 3.086944px),
      4.68629px calc(100% - 4.686125px),
      3.08707072px calc(100% - 6.550416px),
      1.78589016px calc(100% - 8.646883px),
      0.81569024px calc(100% - 10.942592px),
      0.20941288px calc(100% - 13.404609px),
      2.6488864513577e-31px calc(100% - 16px),
      0px 74px,
      0px 74px,
      0.20941288px 71.4047062px,
      0.81569024px 68.9427456px,
      1.78589016px 66.6470594px,
      3.08707072px 64.5505888px,
      4.68629px 62.686275px,
      6.55060608px 61.0870592px,
      8.64707704px 59.7858826px,
      10.94276096px 58.8156864px,
      13.40471592px 58.2094118px,
      16px 58px,
      92.8328px 58px,
      92.8328px 58px,
      94.5216211px 57.9108296px,
      96.1731648px 57.6478008px,
      97.7757017px 57.2176372px,
      99.3175024px 56.6270624px,
      100.7868375px 55.8828px,
      102.1719776px 54.9915736px,
      103.4611933px 53.9601068px,
      104.6427552px 52.7951232px,
      105.7049339px 51.5033464px,
      106.636px 50.0915px,
      131.364px 7.90849px
    );
  }

  &::before,
  &::after {
    content: '';
    position: absolute;
    inset: 0;

    ${mQ(bp.desktop)} {
      clip-path: polygon(
        calc(100% - 30.2px) 1px,
        calc(100% - 30.2px) 1px,
        calc(100% - 29.0667px) 1.0417px,
        calc(100% - 27.9496px) 1.1656px,
        calc(100% - 26.8529px) 1.3699px,
        calc(100% - 25.7808px) 1.6528px,
        calc(100% - 24.7375px) 2.0125px,
        calc(100% - 23.7272px) 2.4472px,
        calc(100% - 22.7541px) 2.9551px,
        calc(100% - 21.8224px) 3.5344px,
        calc(100% - 20.9363px) 4.1833px,
        calc(100% - 20.1px) 4.9px,
        calc(100% - 5.9px) 17.9px,
        calc(100% - 5.9px) 17.9px,
        calc(100% - 5.0094999999999px) 18.7778px,
        calc(100% - 4.1999999999997px) 19.7264px,
        calc(100% - 3.4744999999999px) 20.7386px,
        calc(100% - 2.836px) 21.8072px,
        calc(100% - 2.2874999999999px) 22.925px,
        calc(100% - 1.832px) 24.0848px,
        calc(100% - 1.4725000000001px) 25.2794px,
        calc(100% - 1.212px) 26.5016px,
        calc(100% - 1.0535px) 27.7442px,
        calc(100% - 1.0000000000001px) 29px,
        calc(100% - 1px) calc(100% - 29px),
        calc(100% - 1px) calc(100% - 29px),
        calc(100% - 1.0535px) calc(100% - 27.7469px),
        calc(100% - 1.212px) calc(100% - 26.5112px),
        calc(100% - 1.4725px) calc(100% - 25.2983px),
        calc(100% - 1.8319999999999px) calc(100% - 24.1136px),
        calc(100% - 2.2874999999999px) calc(100% - 22.9625px),
        calc(100% - 2.8359999999999px) calc(100% - 21.8504px),
        calc(100% - 3.4744999999999px) calc(100% - 20.7827px),
        calc(100% - 4.1999999999999px) calc(100% - 19.7648px),
        calc(100% - 5.0094999999999px) calc(100% - 18.8021px),
        calc(100% - 5.9000000000001px) calc(100% - 17.9px),
        calc(100% - 20.1px) calc(100% - 4.9px),
        calc(100% - 20.1px) calc(100% - 4.9px),
        calc(100% - 20.9633px) calc(100% - 4.1833px),
        calc(100% - 21.8704px) calc(100% - 3.5344px),
        calc(100% - 22.8171px) calc(100% - 2.9551px),
        calc(100% - 23.7992px) calc(100% - 2.4472px),
        calc(100% - 24.8125px) calc(100% - 2.0125px),
        calc(100% - 25.8528px) calc(100% - 1.6528px),
        calc(100% - 26.9159px) calc(100% - 1.3699px),
        calc(100% - 27.9976px) calc(100% - 1.1656px),
        calc(100% - 29.0937px) calc(100% - 1.0417px),
        calc(100% - 30.2px) calc(100% - 1px),
        16px calc(100% - 1px),
        16px calc(100% - 1px),
        13.5631px calc(100% - 1.1959px),
        11.2528px calc(100% - 1.7631999999999px),
        9.0997px calc(100% - 2.6713px),
        7.1344px calc(100% - 3.8896px),
        5.3875px calc(100% - 5.3875px),
        3.8896px calc(100% - 7.1344px),
        2.6713px calc(100% - 9.0997px),
        1.7632px calc(100% - 11.2528px),
        1.1959px calc(100% - 13.5631px),
        1px calc(100% - 16px),
        1px 74px,
        1px 74px,
        1.1959px 71.5631px,
        1.7632px 69.2528px,
        2.6713px 67.0997px,
        3.8896px 65.1344px,
        5.3875px 63.3875px,
        7.1344px 61.8896px,
        9.0997px 60.6713px,
        11.2528px 59.7632px,
        13.5631px 59.1959px,
        16px 59px,
        92.8px 59px,
        92.8px 59px,
        94.5859px 58.9052px,
        96.3352px 58.6256px,
        98.0353px 58.1684px,
        99.6736px 57.5408px,
        101.2375px 56.75px,
        102.7144px 55.8032px,
        104.0917px 54.7076px,
        105.3568px 53.4704px,
        106.4971px 52.0988px,
        107.5px 50.6px,
        132.2px 8.4px,
        132.2px 8.4px,
        133.0742px 7.075px,
        134.0696px 5.864px,
        135.1754px 4.773px,
        136.3808px 3.808px,
        137.675px 2.975px,
        139.0472px 2.28px,
        140.4866px 1.729px,
        141.9824px 1.328px,
        143.5238px 1.083px,
        145.1px 1px,
        calc(100% - 30.2px) 1px,
        calc(100% - 30.2px) 0px,
        145.2px 0px,
        145.2px 0px,
        143.5068px 0.0889px,
        141.8544px 0.3512px,
        140.2536px 0.7803px,
        138.7152px 1.3696px,
        137.25px 2.1125px,
        135.8688px 3.0024px,
        134.5824px 4.0327px,
        133.4016px 5.1968px,
        132.3372px 6.4881px,
        131.4px 7.9px,
        106.7px 50.1px,
        106.7px 50.1px,
        105.76px 51.5119px,
        104.688px 52.8032px,
        103.496px 53.9673px,
        102.196px 54.9976px,
        100.8px 55.8875px,
        99.32px 56.6304px,
        97.768px 57.2197px,
        96.156px 57.6488px,
        94.496px 57.9111px,
        92.8px 58px,
        16px 58px,
        16px 58px,
        13.4136px 58.2104px,
        10.9568px 58.8192px,
        8.6632px 59.7928px,
        6.5664px 61.0976px,
        4.7px 62.7px,
        3.0976px 64.5664px,
        1.7928px 66.6632px,
        0.8192px 68.9568px,
        0.2104px 71.4136px,
        2.6624055551209e-31px 74px,
        0px calc(100% - 16px),
        0px calc(100% - 16px),
        0.2104px calc(100% - 13.4136px),
        0.8192px calc(100% - 10.9568px),
        1.7928px calc(100% - 8.6632px),
        3.0976px calc(100% - 6.5664px),
        4.7px calc(100% - 4.7px),
        6.5664px calc(100% - 3.0976px),
        8.6632px calc(100% - 1.7928px),
        10.9568px calc(100% - 0.81920000000002px),
        13.4136px calc(100% - 0.21039999999999px),
        16px calc(100% - 2.8421709430404e-14px),
        calc(100% - 30.2px) calc(100% - 0px),
        calc(100% - 30.2px) calc(100% - 0px),
        calc(100% - 29.0039px) calc(100% - 0.044699999999949px),
        calc(100% - 27.8192px) calc(100% - 0.17759999999996px),
        calc(100% - 26.6513px) calc(100% - 0.39689999999999px),
        calc(100% - 25.5056px) calc(100% - 0.70079999999999px),
        calc(100% - 24.3875px) calc(100% - 1.0875px),
        calc(100% - 23.3024px) calc(100% - 1.5552px),
        calc(100% - 22.2557px) calc(100% - 2.1021px),
        calc(100% - 21.2528px) calc(100% - 2.7264px),
        calc(100% - 20.2991px) calc(100% - 3.4263px),
        calc(100% - 19.4px) calc(100% - 4.2px),
        calc(100% - 5.2px) calc(100% - 17.2px),
        calc(100% - 5.2px) calc(100% - 17.2px),
        calc(100% - 4.2524999999999px) calc(100% - 18.1379px),
        calc(100% - 3.3919999999998px) calc(100% - 19.1472px),
        calc(100% - 2.6215000000001px) calc(100% - 20.2213px),
        calc(100% - 1.9440000000001px) calc(100% - 21.3536px),
        calc(100% - 1.3625000000001px) calc(100% - 22.5375px),
        calc(100% - 0.88px) calc(100% - 23.7664px),
        calc(100% - 0.49950000000001px) calc(100% - 25.0337px),
        calc(100% - 0.22399999999993px) calc(100% - 26.3328px),
        calc(100% - 0.056500000000028px) calc(100% - 27.6571px),
        calc(100% - 1.1368683772162e-13px) calc(100% - 29px),
        calc(100% - 0px) 29px,
        calc(100% - 0px) 29px,
        calc(100% - 0.056499999999915px) 27.6571px,
        calc(100% - 0.22399999999993px) 26.3328px,
        calc(100% - 0.49950000000001px) 25.0337px,
        calc(100% - 0.87999999999988px) 23.7664px,
        calc(100% - 1.3625px) 22.5375px,
        calc(100% - 1.944px) 21.3536px,
        calc(100% - 2.6215px) 20.2213px,
        calc(100% - 3.3920000000001px) 19.1472px,
        calc(100% - 4.2525000000001px) 18.1379px,
        calc(100% - 5.2000000000002px) 17.2px,
        calc(100% - 19.4px) 4.2px,
        calc(100% - 19.4px) 4.2px,
        calc(100% - 20.3234px) 3.4263px,
        calc(100% - 21.2912px) 2.7264px,
        calc(100% - 22.2998px) 2.1021px,
        calc(100% - 23.3456px) 1.5552px,
        calc(100% - 24.425px) 1.0875px,
        calc(100% - 25.5344px) 0.7008px,
        calc(100% - 26.6702px) 0.3969px,
        calc(100% - 27.8288px) 0.1776px,
        calc(100% - 29.0066px) 0.0447px,
        calc(100% - 30.2px) 5.5466782398352e-32px,
        calc(100% - 30.2px) 0px
      );
    }

    ${mQ(bp.desktop - 1, 'max')} {
      mask:
        linear-gradient(#fff 0 0) content-box,
        linear-gradient(#fff 0 0);
      -webkit-mask-composite: destination-out; /* stylelint-disable-line property-no-vendor-prefix */
      mask-composite: exclude;
      padding: 1px;
      border-radius: inherit;
    }
  }

  &::before {
    background: linear-gradient(77.9deg, #ec4237 0%, #33b6d8 100%);
  }

  &::after {
    background: linear-gradient(
      230deg,
      #fffba4 0%,
      rgba(255, 251, 164, 0) 100%
    );
    opacity: 0.3;
  }
`;
