import { forwardRef } from 'react';
import styled, { useTheme } from 'styled-components';

import Notification from './notification';

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 32px;

  > div {
    width: 100%;
  }
`;

const Form = forwardRef(({ children, success, error, ...props }, ref) => {
  const theme = useTheme();
  return (
    <StyledForm ref={ref} {...props}>
      {success && (
        <Notification title="Success" color="#B4FF39">
          {success.length > 0 && <p>{success}</p>}
        </Notification>
      )}

      {error && (
        <Notification title="Error" color={theme.colors.error}>
          {error.length > 0 && <p>{error}</p>}
        </Notification>
      )}

      {children}
    </StyledForm>
  );
});

export default Form;
