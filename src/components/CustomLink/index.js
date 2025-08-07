import { StyledCustomLink, StyledCustomLinkContent } from './CustomLink.styles';
import Corners from '../Corners';

const CustomLink = ({ children, href, icon, target, $isTopNav, ...props }) => (
  <StyledCustomLink
    $isTopNav={$isTopNav}
    target={target}
    href={href}
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
