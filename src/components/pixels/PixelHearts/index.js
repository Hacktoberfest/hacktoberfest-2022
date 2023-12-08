import { StyledPixelHearts } from './PixelHearts.styles';

const PixelHearts = ({ count = 3, offset = 0 }) => {
  return (
    <StyledPixelHearts $count={count} $offset={offset}>
      {[...Array(count)].map((_, i) => (
        <svg
          key={i}
          width="130"
          height="110"
          viewBox="0 0 130 110"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M30 0H20V10H10V20H0V30V40V50H10V60H20V70H30V80H40V90H50V100H60V110H70V100H80V90H90V80H100V70H110V60H120V50H130V40V30V20H120V10H110V0H100H90V10H80V20H70V30H60V20H50V10H40V0H30ZM40 10V20H50V30H60V40H70V30H80V20H90V10H100H110V20H120V30V40V50H110V60H100V70H90V80H80V90H70V100H60V90H50V80H40V70H30V60H20V50H10V40V30V20H20V10H30H40Z"
            fill="currentColor"
          />
        </svg>
      ))}
    </StyledPixelHearts>
  );
};

export default PixelHearts;
