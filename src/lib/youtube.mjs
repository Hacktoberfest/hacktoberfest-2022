/* The two addresses a YouTube video has here: the page on YouTube, for a
   plain link, and the player, for an embed. The player is the
   privacy-enhanced youtube-nocookie.com one, which sets no cookies until
   the video plays, and it is only ever loaded after someone presses play
   (components/HomeBands HomeCeremonyBand), so it starts at once and
   offers no related videos from other channels at the end. */
export const youtubeWatchUrl = (id) =>
  `https://www.youtube.com/watch?v=${encodeURIComponent(id)}`;

export const youtubeEmbedUrl = (id) =>
  `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?autoplay=1&rel=0`;
