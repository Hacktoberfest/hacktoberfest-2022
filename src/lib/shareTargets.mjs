/* Where a finished share card goes: the four networks' own composers, as
   plain web addresses. No SDK, no script from anyone else, no popup
   library. The modal opens the address it gets back in a new tab and the
   network's own page does the posting.

   Only LinkedIn refuses to be handed words: its composer takes an address
   and reads the page's own meta tags for the rest, so `carriesText` is
   what the modal asks before it offers to copy the post text instead.

   Relative imports and no JSX: Node's test runner reads this. */

export const SHARE_NETWORKS = Object.freeze([
  'x',
  'linkedin',
  'bluesky',
  'threads',
]);

export const carriesText = (network) => network !== 'linkedin';

const COMPOSERS = Object.freeze({
  x: 'https://twitter.com/intent/tweet',
  linkedin: 'https://www.linkedin.com/sharing/share-offsite/',
  bluesky: 'https://bsky.app/intent/compose',
  threads: 'https://www.threads.net/intent/post',
});

/* Built with URL and URLSearchParams, never by joining strings: the post
   text carries a hash, curly quotes and an address of its own, and every
   one of them has to reach the composer encoded. */
export const composerUrl = (network, { text, url } = {}) => {
  if (!SHARE_NETWORKS.includes(network))
    throw new RangeError(`${String(network)} is not a share network`);

  const composer = new URL(COMPOSERS[network]);
  const params = new URLSearchParams();

  if (carriesText(network)) {
    if (typeof text !== 'string' || !text)
      throw new TypeError(`${network} needs the post text`);
    params.set('text', text);
  } else {
    if (typeof url !== 'string' || !url)
      throw new TypeError(`${network} needs the address to share`);
    params.set('url', url);
  }

  composer.search = params.toString();
  return composer.toString();
};
