const CAMPAIGN = {
  utm_source: 'hacktoberfest.com',
  utm_medium: 'website',
  utm_campaign: 'hacktoberfest-2026',
};

export const campaignFor = (content) => ({
  ...CAMPAIGN,
  utm_content: content,
});
