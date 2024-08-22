import { useCallback, useEffect, useState } from 'react';
import { StyledAccordion } from './Accordion.styles';

const Accordion = (props) => {
  const { isDark = false, title, subtitle, collapsed, children } = props;

  const [open, setOpen] = useState(!collapsed);
  useEffect(() => setOpen(!collapsed), [collapsed]);
  const toggle = useCallback((evt) => setOpen(evt.target.open), []);

  return (
    <StyledAccordion open={open} onToggle={toggle} $isDark={isDark}>
      <summary>
        {subtitle && <strong>[{subtitle}] </strong>}
        {title}
      </summary>
      <div>{children}</div>
    </StyledAccordion>
  );
};

export default Accordion;
