const purge = async () => {
  // Do the purge
  const resp = await fetch(
    `https://api.cloudflare.com/client/v4/zones/${encodeURIComponent(
      process.env.CLOUDFLARE_ZONE_ID,
    )}/purge_cache`,
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
  const body = await resp.text().catch(() => '');
  if (!resp.ok)
    throw new Error(
      `Cloudflare API error: ${resp.status} ${resp.statusText}: ${body}`,
    );
  console.log(
    `Cloudflare API response: ${resp.status} ${resp.statusText}: ${body}`,
  );
};

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

  // Do a purge after waiting 30s to give the site time to deploy
  await new Promise((resolve) => setTimeout(resolve, 30000));
  await purge();

  // Wait 30s for the initial purge to complete, and then purge again to be safe
  await new Promise((resolve) => setTimeout(resolve, 30000));
  await purge();
};

export default cache;
