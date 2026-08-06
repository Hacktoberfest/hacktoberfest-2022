import { writeFile } from 'fs/promises';

const BASE_URL = (process.env.BASE_URL || '').replace(/\/*$/, '');

/* Answer-engine crawlers, listed so the policy is a deliberate choice rather
   than a side effect of the catch-all group. Naming a bot here means it reads
   only this group and ignores "*", so each one repeats the same Allow.

   These are the crawlers behind AI answers and AI training. Allowing them is
   the same intent as publishing llms.txt: the site wants to be quotable.
   Flip an Allow to Disallow to opt that one back out. */
const ANSWER_ENGINE_AGENTS = [
  'GPTBot', // OpenAI, training
  'OAI-SearchBot', // OpenAI, ChatGPT search index
  'ChatGPT-User', // OpenAI, fetches a page a user linked
  'ClaudeBot', // Anthropic, training
  'Claude-User', // Anthropic, fetches a page a user linked
  'PerplexityBot', // Perplexity, search index
  'Google-Extended', // Google, Gemini training + grounding
  'Applebot-Extended', // Apple, Apple Intelligence training
  'CCBot', // Common Crawl, feeds many open datasets
];

const robots = async () => {
  const groups = [
    'User-agent: *\nAllow: /',
    ...ANSWER_ENGINE_AGENTS.map((agent) => `User-agent: ${agent}\nAllow: /`),
  ];

  await writeFile(
    new URL('../../public/robots.txt', import.meta.url),
    `${groups.join('\n\n')}\n\nSitemap: ${BASE_URL}/sitemap.xml\n`,
  );
};

export default robots;
