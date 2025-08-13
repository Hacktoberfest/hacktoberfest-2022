import { StyledCustomLink, StyledCustomLinkContent } from './CustomLink.styles';
import Corners from '../Corners';

const CustomLink = ({
  children,
  href,
  icon,
  target,
  size,
  $isTopNav,
  ...props
}) => (
  <StyledCustomLink
    $isTopNav={$isTopNav}
    target={target}
    href={href}
    $size={size}
    {...props}
  >
    <StyledCustomLinkContent $isExternal={target === '_blank'}>
      {icon}
      {children}
    </StyledCustomLinkContent>
    {$isTopNav && <Corners />}
  </StyledCustomLink>
);

export default CustomLink;
