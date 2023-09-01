import Arrow from 'components/Arrow';
import {
  StyledDivider
} from './Divider.styles';
import { useTheme } from 'styled-components';

const Divider = props => {
  const theme = useTheme();
  const { type = 'dashed' } = props;
  return (
    <StyledDivider $type={type}>
      {type === 'pixelarrow' && (
        <>
          <span>
<svg width="1041" height="52" viewBox="0 0 1041 52" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M10 31H0V41H10V31Z" fill="#3D2E10"/>
  <path d="M20 21H10V31H20V21Z" fill="#3D2E10"/>
  <path d="M30 11H20V21H30V11Z" fill="#3D2E10"/>
  <path d="M50 31H40V41H50V31Z" fill="#3D2E10"/>
  <path d="M60 21H50V31H60V21Z" fill="#3D2E10"/>
  <path d="M70 11H60V21H70V11Z" fill="#3D2E10"/>
  <path d="M90 31H80V41H90V31Z" fill="#3D2E10"/>
  <path d="M100 21H90V31H100V21Z" fill="#3D2E10"/>
  <path d="M110 11H100V21H110V11Z" fill="#3D2E10"/>
  <path d="M130 31H120V41H130V31Z" fill="#3D2E10"/>
  <path d="M140 21H130V31H140V21Z" fill="#3D2E10"/>
  <path d="M150 11H140V21H150V11Z" fill="#3D2E10"/>
  <path d="M170 31H160V41H170V31Z" fill="#3D2E10"/>
  <path d="M180 21H170V31H180V21Z" fill="#3D2E10"/>
  <path d="M190 11H180V21H190V11Z" fill="#3D2E10"/>
  <path d="M210 31H200V41H210V31Z" fill="#3D2E10"/>
  <path d="M220 21H210V31H220V21Z" fill="#3D2E10"/>
  <path d="M230 11H220V21H230V11Z" fill="#3D2E10"/>
  <path d="M250 31H240V41H250V31Z" fill="#3D2E10"/>
  <path d="M260 21H250V31H260V21Z" fill="#3D2E10"/>
  <path d="M270 11H260V21H270V11Z" fill="#3D2E10"/>
  <path d="M290 31H280V41H290V31Z" fill="#3D2E10"/>
  <path d="M300 21H290V31H300V21Z" fill="#3D2E10"/>
  <path d="M310 11H300V21H310V11Z" fill="#3D2E10"/>
  <path d="M330 31H320V41H330V31Z" fill="#3D2E10"/>
  <path d="M340 21H330V31H340V21Z" fill="#3D2E10"/>
  <path d="M350 11H340V21H350V11Z" fill="#3D2E10"/>
  <path d="M370 31H360V41H370V31Z" fill="#3D2E10"/>
  <path d="M380 21H370V31H380V21Z" fill="#3D2E10"/>
  <path d="M390 11H380V21H390V11Z" fill="#3D2E10"/>
  <path d="M410 31H400V41H410V31Z" fill="#3D2E10"/>
  <path d="M420 21H410V31H420V21Z" fill="#3D2E10"/>
  <path d="M430 11H420V21H430V11Z" fill="#AD832D"/>
  <path d="M450 31H440V41H450V31Z" fill="#3D2E10"/>
  <path d="M460 21H450V31H460V21Z" fill="#3D2E10"/>
  <path d="M470 11H460V21H470V11Z" fill="#AD832D"/>
  <path d="M490 31H480V41H490V31Z" fill="#3D2E10"/>
  <path d="M500 21H490V31H500V21Z" fill="#3D2E10"/>
  <path d="M510 11H500V21H510V11Z" fill="#D2B863"/>
  <path d="M530 31H520V41H530V31Z" fill="#3D2E10"/>
  <path d="M540 21H530V31H540V21Z" fill="#AD832D"/>
  <g filter="url(#filter0_dd_2841_7952)">
    <path d="M550 11H540V21H550V11Z" fill="#FFFBA4"/>
  </g>
  <path d="M570 31H560V41H570V31Z" fill="#3D2E10"/>
  <path d="M580 21H570V31H580V21Z" fill="#AD832D"/>
  <g filter="url(#filter1_dd_2841_7952)">
    <path d="M590 11H580V21H590V11Z" fill="#FFFBA4"/>
  </g>
  <path d="M610 31H600V41H610V31Z" fill="#3D2E10"/>
  <g filter="url(#filter2_dd_2841_7952)">
    <path d="M620 21H610V31H620V21Z" fill="#FFFBA4"/>
  </g>
  <g filter="url(#filter3_dd_2841_7952)">
    <path d="M630 11H620V21H630V11Z" fill="#FFFBA4"/>
  </g>
  <path d="M650 31H640V41H650V31Z" fill="#3D2E10"/>
  <path d="M660 21H650V31H660V21Z" fill="#AD832D"/>
  <g filter="url(#filter4_dd_2841_7952)">
    <path d="M670 11H660V21H670V11Z" fill="#FFFBA4"/>
  </g>
  <path d="M690 31H680V41H690V31Z" fill="#AD832D"/>
  <path d="M700 21H690V31H700V21Z" fill="#D2B863"/>
  <g filter="url(#filter5_dd_2841_7952)">
    <path d="M710 11H700V21H710V11Z" fill="#FFFBA4"/>
  </g>
  <path d="M730 31H720V41H730V31Z" fill="#AD832D"/>
  <path d="M740 21H730V31H740V21Z" fill="#D2B863"/>
  <g filter="url(#filter6_dd_2841_7952)">
    <path d="M750 11H740V21H750V11Z" fill="#FFFBA4"/>
  </g>
  <path d="M770 31H760V41H770V31Z" fill="#AD832D"/>
  <g filter="url(#filter7_dd_2841_7952)">
    <path d="M780 21H770V31H780V21Z" fill="#FFFBA4"/>
  </g>
  <g filter="url(#filter8_dd_2841_7952)">
    <path d="M790 11H780V21H790V11Z" fill="#FFFBA4"/>
  </g>
  <path d="M810 31H800V41H810V31Z" fill="#3D2E10"/>
  <g filter="url(#filter9_dd_2841_7952)">
    <path d="M820 21H810V31H820V21Z" fill="#FFFBA4"/>
  </g>
  <g filter="url(#filter10_dd_2841_7952)">
    <path d="M830 11H820V21H830V11Z" fill="#FFFBA4"/>
  </g>
  <path d="M850 31H840V41H850V31Z" fill="#AD832D"/>
  <g filter="url(#filter11_dd_2841_7952)">
    <path d="M860 21H850V31H860V21Z" fill="#FFFBA4"/>
  </g>
  <g filter="url(#filter12_dd_2841_7952)">
    <path d="M870 11H860V21H870V11Z" fill="#FFFBA4"/>
  </g>
  <path d="M890 31H880V41H890V31Z" fill="#AD832D"/>
  <g filter="url(#filter13_dd_2841_7952)">
    <path d="M900 21H890V31H900V21Z" fill="#FFFBA4"/>
  </g>
  <g filter="url(#filter14_dd_2841_7952)">
    <path d="M910 11H900V21H910V11Z" fill="#FFFBA4"/>
  </g>
  <path d="M930 31H920V41H930V31Z" fill="#AD832D"/>
  <g filter="url(#filter15_dd_2841_7952)">
    <path d="M940 21H930V31H940V21Z" fill="#FFFBA4"/>
  </g>
  <g filter="url(#filter16_dd_2841_7952)">
    <path d="M950 11H940V21H950V11Z" fill="#FFFBA4"/>
  </g>
  <g filter="url(#filter17_dd_2841_7952)">
    <path d="M970 31H960V41H970V31Z" fill="#FFFBA4"/>
    <path d="M980 21H970V31H980V21Z" fill="#FFFBA4"/>
    <path d="M990 11H980V21H990V11Z" fill="#FFFBA4"/>
  </g>
  <g filter="url(#filter18_dd_2841_7952)">
    <path d="M1010 31H1000V41H1010V31Z" fill="#FFFBA4"/>
    <path d="M1020 21H1010V31H1020V21Z" fill="#FFFBA4"/>
    <path d="M1030 11H1020V21H1030V11Z" fill="#FFFBA4"/>
  </g>
  <defs>
    <filter id="filter0_dd_2841_7952" x="529" y="0" width="32" height="32" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
      <feFlood floodOpacity="0" result="BackgroundImageFix"/>
      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
      <feOffset dx="1" dy="1"/>
      <feGaussianBlur stdDeviation="5"/>
      <feComposite in2="hardAlpha" operator="out"/>
      <feColorMatrix type="matrix" values="0 0 0 0 0.92549 0 0 0 0 0.258824 0 0 0 0 0.215686 0 0 0 0.5 0"/>
      <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_2841_7952"/>
      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
      <feOffset dx="-1" dy="-1"/>
      <feGaussianBlur stdDeviation="5"/>
      <feComposite in2="hardAlpha" operator="out"/>
      <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 0.984314 0 0 0 0 0.643137 0 0 0 0.5 0"/>
      <feBlend mode="normal" in2="effect1_dropShadow_2841_7952" result="effect2_dropShadow_2841_7952"/>
      <feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_2841_7952" result="shape"/>
    </filter>
    <filter id="filter1_dd_2841_7952" x="569" y="0" width="32" height="32" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
      <feFlood floodOpacity="0" result="BackgroundImageFix"/>
      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
      <feOffset dx="1" dy="1"/>
      <feGaussianBlur stdDeviation="5"/>
      <feComposite in2="hardAlpha" operator="out"/>
      <feColorMatrix type="matrix" values="0 0 0 0 0.92549 0 0 0 0 0.258824 0 0 0 0 0.215686 0 0 0 0.5 0"/>
      <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_2841_7952"/>
      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
      <feOffset dx="-1" dy="-1"/>
      <feGaussianBlur stdDeviation="5"/>
      <feComposite in2="hardAlpha" operator="out"/>
      <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 0.984314 0 0 0 0 0.643137 0 0 0 0.5 0"/>
      <feBlend mode="normal" in2="effect1_dropShadow_2841_7952" result="effect2_dropShadow_2841_7952"/>
      <feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_2841_7952" result="shape"/>
    </filter>
    <filter id="filter2_dd_2841_7952" x="599" y="10" width="32" height="32" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
      <feFlood floodOpacity="0" result="BackgroundImageFix"/>
      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
      <feOffset dx="1" dy="1"/>
      <feGaussianBlur stdDeviation="5"/>
      <feComposite in2="hardAlpha" operator="out"/>
      <feColorMatrix type="matrix" values="0 0 0 0 0.92549 0 0 0 0 0.258824 0 0 0 0 0.215686 0 0 0 0.5 0"/>
      <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_2841_7952"/>
      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
      <feOffset dx="-1" dy="-1"/>
      <feGaussianBlur stdDeviation="5"/>
      <feComposite in2="hardAlpha" operator="out"/>
      <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 0.984314 0 0 0 0 0.643137 0 0 0 0.5 0"/>
      <feBlend mode="normal" in2="effect1_dropShadow_2841_7952" result="effect2_dropShadow_2841_7952"/>
      <feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_2841_7952" result="shape"/>
    </filter>
    <filter id="filter3_dd_2841_7952" x="609" y="0" width="32" height="32" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
      <feFlood floodOpacity="0" result="BackgroundImageFix"/>
      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
      <feOffset dx="1" dy="1"/>
      <feGaussianBlur stdDeviation="5"/>
      <feComposite in2="hardAlpha" operator="out"/>
      <feColorMatrix type="matrix" values="0 0 0 0 0.92549 0 0 0 0 0.258824 0 0 0 0 0.215686 0 0 0 0.5 0"/>
      <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_2841_7952"/>
      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
      <feOffset dx="-1" dy="-1"/>
      <feGaussianBlur stdDeviation="5"/>
      <feComposite in2="hardAlpha" operator="out"/>
      <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 0.984314 0 0 0 0 0.643137 0 0 0 0.5 0"/>
      <feBlend mode="normal" in2="effect1_dropShadow_2841_7952" result="effect2_dropShadow_2841_7952"/>
      <feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_2841_7952" result="shape"/>
    </filter>
    <filter id="filter4_dd_2841_7952" x="649" y="0" width="32" height="32" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
      <feFlood floodOpacity="0" result="BackgroundImageFix"/>
      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
      <feOffset dx="1" dy="1"/>
      <feGaussianBlur stdDeviation="5"/>
      <feComposite in2="hardAlpha" operator="out"/>
      <feColorMatrix type="matrix" values="0 0 0 0 0.92549 0 0 0 0 0.258824 0 0 0 0 0.215686 0 0 0 0.5 0"/>
      <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_2841_7952"/>
      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
      <feOffset dx="-1" dy="-1"/>
      <feGaussianBlur stdDeviation="5"/>
      <feComposite in2="hardAlpha" operator="out"/>
      <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 0.984314 0 0 0 0 0.643137 0 0 0 0.5 0"/>
      <feBlend mode="normal" in2="effect1_dropShadow_2841_7952" result="effect2_dropShadow_2841_7952"/>
      <feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_2841_7952" result="shape"/>
    </filter>
    <filter id="filter5_dd_2841_7952" x="689" y="0" width="32" height="32" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
      <feFlood floodOpacity="0" result="BackgroundImageFix"/>
      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
      <feOffset dx="1" dy="1"/>
      <feGaussianBlur stdDeviation="5"/>
      <feComposite in2="hardAlpha" operator="out"/>
      <feColorMatrix type="matrix" values="0 0 0 0 0.92549 0 0 0 0 0.258824 0 0 0 0 0.215686 0 0 0 0.5 0"/>
      <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_2841_7952"/>
      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
      <feOffset dx="-1" dy="-1"/>
      <feGaussianBlur stdDeviation="5"/>
      <feComposite in2="hardAlpha" operator="out"/>
      <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 0.984314 0 0 0 0 0.643137 0 0 0 0.5 0"/>
      <feBlend mode="normal" in2="effect1_dropShadow_2841_7952" result="effect2_dropShadow_2841_7952"/>
      <feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_2841_7952" result="shape"/>
    </filter>
    <filter id="filter6_dd_2841_7952" x="729" y="0" width="32" height="32" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
      <feFlood floodOpacity="0" result="BackgroundImageFix"/>
      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
      <feOffset dx="1" dy="1"/>
      <feGaussianBlur stdDeviation="5"/>
      <feComposite in2="hardAlpha" operator="out"/>
      <feColorMatrix type="matrix" values="0 0 0 0 0.92549 0 0 0 0 0.258824 0 0 0 0 0.215686 0 0 0 0.5 0"/>
      <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_2841_7952"/>
      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
      <feOffset dx="-1" dy="-1"/>
      <feGaussianBlur stdDeviation="5"/>
      <feComposite in2="hardAlpha" operator="out"/>
      <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 0.984314 0 0 0 0 0.643137 0 0 0 0.5 0"/>
      <feBlend mode="normal" in2="effect1_dropShadow_2841_7952" result="effect2_dropShadow_2841_7952"/>
      <feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_2841_7952" result="shape"/>
    </filter>
    <filter id="filter7_dd_2841_7952" x="759" y="10" width="32" height="32" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
      <feFlood floodOpacity="0" result="BackgroundImageFix"/>
      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
      <feOffset dx="1" dy="1"/>
      <feGaussianBlur stdDeviation="5"/>
      <feComposite in2="hardAlpha" operator="out"/>
      <feColorMatrix type="matrix" values="0 0 0 0 0.92549 0 0 0 0 0.258824 0 0 0 0 0.215686 0 0 0 0.5 0"/>
      <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_2841_7952"/>
      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
      <feOffset dx="-1" dy="-1"/>
      <feGaussianBlur stdDeviation="5"/>
      <feComposite in2="hardAlpha" operator="out"/>
      <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 0.984314 0 0 0 0 0.643137 0 0 0 0.5 0"/>
      <feBlend mode="normal" in2="effect1_dropShadow_2841_7952" result="effect2_dropShadow_2841_7952"/>
      <feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_2841_7952" result="shape"/>
    </filter>
    <filter id="filter8_dd_2841_7952" x="769" y="0" width="32" height="32" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
      <feFlood floodOpacity="0" result="BackgroundImageFix"/>
      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
      <feOffset dx="1" dy="1"/>
      <feGaussianBlur stdDeviation="5"/>
      <feComposite in2="hardAlpha" operator="out"/>
      <feColorMatrix type="matrix" values="0 0 0 0 0.92549 0 0 0 0 0.258824 0 0 0 0 0.215686 0 0 0 0.5 0"/>
      <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_2841_7952"/>
      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
      <feOffset dx="-1" dy="-1"/>
      <feGaussianBlur stdDeviation="5"/>
      <feComposite in2="hardAlpha" operator="out"/>
      <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 0.984314 0 0 0 0 0.643137 0 0 0 0.5 0"/>
      <feBlend mode="normal" in2="effect1_dropShadow_2841_7952" result="effect2_dropShadow_2841_7952"/>
      <feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_2841_7952" result="shape"/>
    </filter>
    <filter id="filter9_dd_2841_7952" x="799" y="10" width="32" height="32" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
      <feFlood floodOpacity="0" result="BackgroundImageFix"/>
      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
      <feOffset dx="1" dy="1"/>
      <feGaussianBlur stdDeviation="5"/>
      <feComposite in2="hardAlpha" operator="out"/>
      <feColorMatrix type="matrix" values="0 0 0 0 0.92549 0 0 0 0 0.258824 0 0 0 0 0.215686 0 0 0 0.5 0"/>
      <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_2841_7952"/>
      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
      <feOffset dx="-1" dy="-1"/>
      <feGaussianBlur stdDeviation="5"/>
      <feComposite in2="hardAlpha" operator="out"/>
      <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 0.984314 0 0 0 0 0.643137 0 0 0 0.5 0"/>
      <feBlend mode="normal" in2="effect1_dropShadow_2841_7952" result="effect2_dropShadow_2841_7952"/>
      <feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_2841_7952" result="shape"/>
    </filter>
    <filter id="filter10_dd_2841_7952" x="809" y="0" width="32" height="32" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
      <feFlood floodOpacity="0" result="BackgroundImageFix"/>
      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
      <feOffset dx="1" dy="1"/>
      <feGaussianBlur stdDeviation="5"/>
      <feComposite in2="hardAlpha" operator="out"/>
      <feColorMatrix type="matrix" values="0 0 0 0 0.92549 0 0 0 0 0.258824 0 0 0 0 0.215686 0 0 0 0.5 0"/>
      <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_2841_7952"/>
      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
      <feOffset dx="-1" dy="-1"/>
      <feGaussianBlur stdDeviation="5"/>
      <feComposite in2="hardAlpha" operator="out"/>
      <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 0.984314 0 0 0 0 0.643137 0 0 0 0.5 0"/>
      <feBlend mode="normal" in2="effect1_dropShadow_2841_7952" result="effect2_dropShadow_2841_7952"/>
      <feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_2841_7952" result="shape"/>
    </filter>
    <filter id="filter11_dd_2841_7952" x="839" y="10" width="32" height="32" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
      <feFlood floodOpacity="0" result="BackgroundImageFix"/>
      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
      <feOffset dx="1" dy="1"/>
      <feGaussianBlur stdDeviation="5"/>
      <feComposite in2="hardAlpha" operator="out"/>
      <feColorMatrix type="matrix" values="0 0 0 0 0.92549 0 0 0 0 0.258824 0 0 0 0 0.215686 0 0 0 0.5 0"/>
      <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_2841_7952"/>
      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
      <feOffset dx="-1" dy="-1"/>
      <feGaussianBlur stdDeviation="5"/>
      <feComposite in2="hardAlpha" operator="out"/>
      <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 0.984314 0 0 0 0 0.643137 0 0 0 0.5 0"/>
      <feBlend mode="normal" in2="effect1_dropShadow_2841_7952" result="effect2_dropShadow_2841_7952"/>
      <feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_2841_7952" result="shape"/>
    </filter>
    <filter id="filter12_dd_2841_7952" x="849" y="0" width="32" height="32" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
      <feFlood floodOpacity="0" result="BackgroundImageFix"/>
      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
      <feOffset dx="1" dy="1"/>
      <feGaussianBlur stdDeviation="5"/>
      <feComposite in2="hardAlpha" operator="out"/>
      <feColorMatrix type="matrix" values="0 0 0 0 0.92549 0 0 0 0 0.258824 0 0 0 0 0.215686 0 0 0 0.5 0"/>
      <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_2841_7952"/>
      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
      <feOffset dx="-1" dy="-1"/>
      <feGaussianBlur stdDeviation="5"/>
      <feComposite in2="hardAlpha" operator="out"/>
      <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 0.984314 0 0 0 0 0.643137 0 0 0 0.5 0"/>
      <feBlend mode="normal" in2="effect1_dropShadow_2841_7952" result="effect2_dropShadow_2841_7952"/>
      <feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_2841_7952" result="shape"/>
    </filter>
    <filter id="filter13_dd_2841_7952" x="879" y="10" width="32" height="32" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
      <feFlood floodOpacity="0" result="BackgroundImageFix"/>
      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
      <feOffset dx="1" dy="1"/>
      <feGaussianBlur stdDeviation="5"/>
      <feComposite in2="hardAlpha" operator="out"/>
      <feColorMatrix type="matrix" values="0 0 0 0 0.92549 0 0 0 0 0.258824 0 0 0 0 0.215686 0 0 0 0.5 0"/>
      <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_2841_7952"/>
      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
      <feOffset dx="-1" dy="-1"/>
      <feGaussianBlur stdDeviation="5"/>
      <feComposite in2="hardAlpha" operator="out"/>
      <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 0.984314 0 0 0 0 0.643137 0 0 0 0.5 0"/>
      <feBlend mode="normal" in2="effect1_dropShadow_2841_7952" result="effect2_dropShadow_2841_7952"/>
      <feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_2841_7952" result="shape"/>
    </filter>
    <filter id="filter14_dd_2841_7952" x="889" y="0" width="32" height="32" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
      <feFlood floodOpacity="0" result="BackgroundImageFix"/>
      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
      <feOffset dx="1" dy="1"/>
      <feGaussianBlur stdDeviation="5"/>
      <feComposite in2="hardAlpha" operator="out"/>
      <feColorMatrix type="matrix" values="0 0 0 0 0.92549 0 0 0 0 0.258824 0 0 0 0 0.215686 0 0 0 0.5 0"/>
      <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_2841_7952"/>
      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
      <feOffset dx="-1" dy="-1"/>
      <feGaussianBlur stdDeviation="5"/>
      <feComposite in2="hardAlpha" operator="out"/>
      <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 0.984314 0 0 0 0 0.643137 0 0 0 0.5 0"/>
      <feBlend mode="normal" in2="effect1_dropShadow_2841_7952" result="effect2_dropShadow_2841_7952"/>
      <feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_2841_7952" result="shape"/>
    </filter>
    <filter id="filter15_dd_2841_7952" x="919" y="10" width="32" height="32" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
      <feFlood floodOpacity="0" result="BackgroundImageFix"/>
      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
      <feOffset dx="1" dy="1"/>
      <feGaussianBlur stdDeviation="5"/>
      <feComposite in2="hardAlpha" operator="out"/>
      <feColorMatrix type="matrix" values="0 0 0 0 0.92549 0 0 0 0 0.258824 0 0 0 0 0.215686 0 0 0 0.5 0"/>
      <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_2841_7952"/>
      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
      <feOffset dx="-1" dy="-1"/>
      <feGaussianBlur stdDeviation="5"/>
      <feComposite in2="hardAlpha" operator="out"/>
      <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 0.984314 0 0 0 0 0.643137 0 0 0 0.5 0"/>
      <feBlend mode="normal" in2="effect1_dropShadow_2841_7952" result="effect2_dropShadow_2841_7952"/>
      <feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_2841_7952" result="shape"/>
    </filter>
    <filter id="filter16_dd_2841_7952" x="929" y="0" width="32" height="32" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
      <feFlood floodOpacity="0" result="BackgroundImageFix"/>
      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
      <feOffset dx="1" dy="1"/>
      <feGaussianBlur stdDeviation="5"/>
      <feComposite in2="hardAlpha" operator="out"/>
      <feColorMatrix type="matrix" values="0 0 0 0 0.92549 0 0 0 0 0.258824 0 0 0 0 0.215686 0 0 0 0.5 0"/>
      <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_2841_7952"/>
      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
      <feOffset dx="-1" dy="-1"/>
      <feGaussianBlur stdDeviation="5"/>
      <feComposite in2="hardAlpha" operator="out"/>
      <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 0.984314 0 0 0 0 0.643137 0 0 0 0.5 0"/>
      <feBlend mode="normal" in2="effect1_dropShadow_2841_7952" result="effect2_dropShadow_2841_7952"/>
      <feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_2841_7952" result="shape"/>
    </filter>
    <filter id="filter17_dd_2841_7952" x="949" y="0" width="52" height="52" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
      <feFlood floodOpacity="0" result="BackgroundImageFix"/>
      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
      <feOffset dx="1" dy="1"/>
      <feGaussianBlur stdDeviation="5"/>
      <feComposite in2="hardAlpha" operator="out"/>
      <feColorMatrix type="matrix" values="0 0 0 0 0.92549 0 0 0 0 0.258824 0 0 0 0 0.215686 0 0 0 0.5 0"/>
      <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_2841_7952"/>
      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
      <feOffset dx="-1" dy="-1"/>
      <feGaussianBlur stdDeviation="5"/>
      <feComposite in2="hardAlpha" operator="out"/>
      <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 0.984314 0 0 0 0 0.643137 0 0 0 0.5 0"/>
      <feBlend mode="normal" in2="effect1_dropShadow_2841_7952" result="effect2_dropShadow_2841_7952"/>
      <feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_2841_7952" result="shape"/>
    </filter>
    <filter id="filter18_dd_2841_7952" x="989" y="0" width="52" height="52" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
      <feFlood floodOpacity="0" result="BackgroundImageFix"/>
      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
      <feOffset dx="1" dy="1"/>
      <feGaussianBlur stdDeviation="5"/>
      <feComposite in2="hardAlpha" operator="out"/>
      <feColorMatrix type="matrix" values="0 0 0 0 0.92549 0 0 0 0 0.258824 0 0 0 0 0.215686 0 0 0 0.5 0"/>
      <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_2841_7952"/>
      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
      <feOffset dx="-1" dy="-1"/>
      <feGaussianBlur stdDeviation="5"/>
      <feComposite in2="hardAlpha" operator="out"/>
      <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 0.984314 0 0 0 0 0.643137 0 0 0 0.5 0"/>
      <feBlend mode="normal" in2="effect1_dropShadow_2841_7952" result="effect2_dropShadow_2841_7952"/>
      <feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_2841_7952" result="shape"/>
    </filter>
  </defs>
</svg>
          </span>
          <Arrow color={theme.colors.bavarian.gold100} />
        </>
      )}
    </StyledDivider>
  );
};

export default Divider;