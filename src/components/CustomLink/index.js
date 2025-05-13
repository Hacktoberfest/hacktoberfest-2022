import { StyledCustomLink } from './CustomLink.styles';

const CustomLink = ({ children, href, icon, target, ...props }) => (
  <StyledCustomLink
    $isExternal={target === '_blank'}
    target={target}
    href={href}
    {...props}
  >
    {icon}
    {children}
  </StyledCustomLink>
);

export default CustomLink;
