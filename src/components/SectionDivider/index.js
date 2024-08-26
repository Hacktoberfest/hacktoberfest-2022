import { StyledSectionDivider } from './SectionDivider.styles';

const SectionDivider = ({
  align = 'left',
  bgColor,
  fgColor,
  isFlipped = false,
}) => (
  <StyledSectionDivider
    $bgColor={bgColor}
    $fgColor={fgColor}
    $align={align}
    $isFlipped={isFlipped}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="523"
      height="100"
      viewBox="0 0 523 100"
      fill="none"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3.67176e-06 79L112 79L112 37L241 37L241 62L339 62L339 -1.70213e-05L523 -1.0851e-07L523 100L339 100L339 100L241 100L112 100L0 100L3.67176e-06 79Z"
        fill="currentColor"
      />
    </svg>
  </StyledSectionDivider>
);

export default SectionDivider;
