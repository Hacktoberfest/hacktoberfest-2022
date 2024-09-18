import { forwardRef } from 'react';
import { useTheme } from 'styled-components';

import Notification from './notification';

const Form = forwardRef(({ children, success, error, ...props }, ref) => {
  const theme = useTheme();
  return (
    <form ref={ref} {...props}>
      {success && (
        <Notification title="Success" color={theme.colors.success}>
          <p>{success}</p>
        </Notification>
      )}

      {error && (
        <Notification title="Error" color={theme.colors.error}>
          <p>{error}</p>
        </Notification>
      )}

      {children}
    </form>
  );
});

export default Form;
