import {
  StyledPixelHearts,
} from './PixelHearts.styles';

const PixelHearts = ({ count = 3, offset = 0 }) => {
  return (
    <StyledPixelHearts $count={count} $offset={offset}>
      {[...Array(count)].map((_, i) => (
        <svg key={i} width="132" height="132" viewBox="0 0 132 132" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M41 11H31V21H21V31H11V41V51V61H21V71H31V81H41V91H51V101H61V111H71V121H81V111H91V101H101V91H111V81H121V71H131V61H141V51V41V31H131V21H121V11H111H101V21H91V31H81V41H71V31H61V21H51V11H41ZM51 21V31H61V41H71V51H81V41H91V31H101V21H111H121V31H131V41V51V61H121V71H111V81H101V91H91V101H81V111H71V101H61V91H51V81H41V71H31V61H21V51V41V31H31V21H41H51Z" />
        </svg>
      ))}
    </StyledPixelHearts>
  );
};

export default PixelHearts;
