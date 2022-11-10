import Notification from '../notification';

const EmailWarning = ({ email, hasHolopin = false }) => {
  if (email.endsWith('@users.noreply.github.com')) {
    return (
      <Notification title="Warning: No-reply Email" color="spark">
        <p>
          We noticed that your selected email address is a GitHub-provided no-reply address.
          If you'd like to receive email notifications,
          {hasHolopin && (<> including your Holopin badges,</>)}
          {' '}
          please select a different email address for your Hacktoberfest registration.
        </p>
      </Notification>
    );
  }

  return null;
};

export default EmailWarning;