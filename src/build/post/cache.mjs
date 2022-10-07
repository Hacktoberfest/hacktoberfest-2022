import fetch from 'cross-fetch';

const cache = async () => {
  // Check we have the env vars we need
  if (!process.env.CLOUDFLARE_API_TOKEN) {
    console.warn('CLOUDFLARE_API_TOKEN not set, cannot clear Cloudflare cache');
    return;
  }
  if (!process.env.CLOUDFLARE_ZONE_ID) {
    console.warn('CLOUDFLARE_ZONE_ID not set, cannot clear Cloudflare cache');
    return;
  }

  // Wait 30s to give the site time to deploy
  await new Promise((resolve) => setTimeout(resolve, 30000));

  // Do the purge
  const resp = await fetch(
    `https://api.cloudflare.com/client/v4/zones/${encodeURIComponent(process.env.CLOUDFLARE_ZONE_ID)}/purge_cache`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
      },
      body: JSON.stringify({
        purge_everything: true,
      }),
    },
  );

  // Check the response
  if (!resp.ok) throw new Error(`Cloudflare API error: ${resp.status} ${resp.statusText}: ${await resp.text().catch(() => '')}`);
};

export default cache;
