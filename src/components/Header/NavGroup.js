import { useEffect, useRef } from 'react';

import {
  NavGroupButton,
  NavGroupEyebrow,
  NavGroupLink,
  NavGroupPanel,
  NavGroupRoot,
} from './Header.styles';

/* Hover and click are layered, not exclusive. Hover opens for pointer
   users and is attached only where a pointer can hover — matchMedia below
   — so a touch device never needs one tap to open and a second to
   navigate; leaving the group closes it after a short delay so a diagonal
   move from the label into the panel does not shut it. Click toggles the
   same button for everyone. Keyboard users open with Enter or Space (the
   button's native activation), Tab through the links, and close with
   Escape, which the parent handles and which returns focus here. Hover
   never opens a panel for a keyboard user because focus does not hover.
   A pointer click on a label whose panel hover already opened keeps it
   open rather than toggling it shut. Hover owns the close on such devices.

   The label is a button that only opens. It is not also a link to a hub
   page — two behaviours on one target — and Schedule and Find a Fest are
   the first entries, one movement away. */
const HOVER_CLOSE_DELAY_MS = 150;

const canHover = () =>
  typeof globalThis.matchMedia === 'function' &&
  globalThis.matchMedia('(hover: hover)').matches;

const NavGroup = ({
  id,
  label,
  items,
  open,
  animate,
  onOpen,
  onClose,
  onToggle,
  onPick,
}) => {
  const closeTimer = useRef(null);
  const buttonRef = useRef(null);

  const cancelClose = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const hoverOpen = () => {
    if (!canHover()) return;
    cancelClose();
    onOpen();
  };

  const hoverClose = () => {
    if (!canHover()) return;
    cancelClose();
    closeTimer.current = setTimeout(onClose, HOVER_CLOSE_DELAY_MS);
  };

  useEffect(() => cancelClose, []);

  /* Escape is handled by the parent (one listener for the whole nav); it
     asks the group to put focus back on its button. */
  useEffect(() => {
    if (open === 'escaped' && buttonRef.current) buttonRef.current.focus();
  }, [open]);

  return (
    <NavGroupRoot
      onMouseEnter={hoverOpen}
      onMouseLeave={hoverClose}
      onBlur={(event) => {
        /* Keyboard users generate no mouseleave; when focus moves out of
           the group — to the next button, or out of the nav — the panel
           should not float open behind them. relatedTarget is null when
           focus leaves the document; treat that as leaving too. */
        if (!event.currentTarget.contains(event.relatedTarget)) onClose();
      }}
    >
      <NavGroupEyebrow>{label}</NavGroupEyebrow>
      <NavGroupButton
        ref={buttonRef}
        type="button"
        aria-expanded={open === true}
        aria-controls={id}
        onClick={(event) => {
          /* On a pointer device the hover has usually opened the panel
             before the click lands, and a toggle would shut it — the
             click meant "open". Keyboard activation arrives as a click
             with detail 0 and touch devices cannot hover; both still
             toggle, so Enter closes what Enter opened. */
          if (open === true && event.detail > 0 && canHover()) return;
          onToggle();
        }}
      >
        {label}
        <svg viewBox="0 0 10 10" aria-hidden="true">
          <path
            d="M1 3l4 4 4-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
        </svg>
      </NavGroupButton>
      <NavGroupPanel
        id={id}
        aria-label={label}
        data-open={open === true ? 'true' : 'false'}
        data-animate={animate ? 'true' : 'false'}
      >
        {items.map((item) => (
          <li key={item.href}>
            <NavGroupLink href={item.href} onClick={onPick}>
              {item.label}
            </NavGroupLink>
          </li>
        ))}
      </NavGroupPanel>
    </NavGroupRoot>
  );
};

export default NavGroup;
