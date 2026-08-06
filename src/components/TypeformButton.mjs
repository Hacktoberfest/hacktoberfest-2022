import { createElement } from 'react';
import typeformEmbedReact from '@typeform/embed-react';

const { PopupButton } = typeformEmbedReact;

const TypeformButton = ({ children, form, buttonProps, ...popupProps }) =>
  createElement(
    PopupButton,
    {
      ...form,
      ...popupProps,
      buttonProps: { ...buttonProps, type: 'button' },
    },
    children,
  );

export default TypeformButton;
