import { StyledCustomLink, StyledCustomLinkContent } from './CustomLink.styles';
import Corners from '../Corners';

const CustomLink = ({
  children,
  href,
  icon,
  iconSize,
  target,
  isTopNav,
  showExternal = true,
  ...props
}) => (
  <StyledCustomLink
    $isTopNav={isTopNav}
    $iconSize={iconSize}
    target={target}
    href={href}
    {...props}
  >
    <StyledCustomLinkContent $isExternal={showExternal && target === '_blank'}>
      {icon}
      {children}
    </StyledCustomLinkContent>
    {isTopNav && <Corners />}
  </StyledCustomLink>
);

export default CustomLink;
