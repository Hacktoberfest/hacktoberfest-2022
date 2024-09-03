import { forwardRef } from 'react';
import styled, { useTheme } from 'styled-components';

import Notification from './notification';

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 32px;
  padding: 32px 0 0;

  > div {
    width: 100%;
  }
`;

const Form = forwardRef(({ children, success, error, ...props }, ref) => {
  const theme = useTheme();
  return (
    <StyledForm ref={ref} {...props}>
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
    </StyledForm>
  );
});

export default Form;
