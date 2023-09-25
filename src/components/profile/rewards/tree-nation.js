import { useMemo } from 'react';
import { useTheme } from 'styled-components';

import Notification from 'components/notification';

const TreeNation = ({ code }) => {
  const theme = useTheme();

  // Attempt to extract the claim/certificate links from the payload
  const [claim, certificate] = useMemo(() => {
    if (!code) return [null, null];

    try {
      const data = JSON.parse(code.code).trees[0];
      return [data.collect_url, data.certificate_url];
    } catch {
      return [null, null];
    }
  }, [code]);

  if (!claim || !certificate) return null;

  return (
    <Notification title="Rewards: Tree-Nation Tree" color={theme.colors.bavarian.gold200}>
      <p>
        Congratulations on completing your first accepted PR/MR!
        As a thank you, <b>we've planted a tree on your behalf</b> with Tree-Nation.
      </p>

      <p>
        <a
          href={claim}
          target="_blank"
          rel="noreferrer noopener"
        >
          Claim your tree
        </a>
        , or view your
        {' '}
        <a
          href={certificate}
          target="_blank"
          rel="noreferrer noopener"
        >
          tree planting certificate
        </a>
        .
      </p>
    </Notification>
  );
};

export default TreeNation;
