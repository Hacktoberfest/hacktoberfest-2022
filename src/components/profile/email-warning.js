import styled, { useTheme } from 'styled-components';
import CardCallout from '../CardCallout';
import { textSm } from '../../themes/typography';

const StyledCardCallout = styled(CardCallout)`
  ${textSm};
  color: ${({ $hasTitle, theme }) =>
    $hasTitle ? theme.colors2025.space.dust : theme.colors2025.error};

  > div > div {
    gap: 16px;
  }
`;

const EmailWarning = ({ email, title }) => {
  const theme = useTheme();

  if (email.endsWith('@users.noreply.github.com') || 1 == 1) {
    return (
      <StyledCardCallout $hasTitle={!!title}>
        {title}
        We noticed that your selected email address is a GitHub-provided
        no-reply address. If you'd like to receive email notifications,
        including your Holopin Email, please select a different email address
        for your Hacktoberfest registration.
      </StyledCardCallout>
    );
  }

  return null;
};

export default EmailWarning;
