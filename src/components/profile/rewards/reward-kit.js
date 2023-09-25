import { useMemo } from 'react';
import { useTheme } from 'styled-components';

import Notification from 'components/notification';

const RewardKit = ({ code }) => {
  const theme = useTheme();

  // Attempt to extract the claim ID from the payload
  const id = useMemo(() => {
    try {
      return JSON.parse(code.code).data.id;
    } catch {
      return null;
    }
  }, [code]);

  if (!id) return null;

  return (
    <Notification title="Rewards: Digital Reward Kit" color={theme.colors.bavarian.gold200}>
      <p>
        Congratulations on completing Hacktoberfest!
        You've <b>unlocked a digital reward kit</b> from the sponsors of Hacktoberfest.
      </p>

      <p>
        Thank you for your contributions to open source.
        We hope you'll continue to contribute to more projects, and we hope to see you next year!
      </p>

      <p>
        <a
          href={`https://www.holopin.io/claim/rewardpack/${id}`}
          target="_blank"
          rel="noreferrer noopener"
        >
          Claim your reward kit
        </a>
        {' '}
        via Holopin.
      </p>
    </Notification>
  );
};

export default RewardKit;
