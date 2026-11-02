import Head from 'next/head';
import { useEffect } from 'react';

import { meta } from 'data/meta';

/* The page every retired route exports (data/retiredRoutes.mjs): it sends
   the visitor to the homepage.

   Two ways in, so two ways out. Arriving at the URL loads this exported
   HTML, and its zero-second refresh leaves without any script; search
   engines read a refresh of zero as a permanent redirect, and the
   canonical names where to. Following a <Link> from a live page (the
   homepage and /my still link to some of these) never loads that HTML:
   Next swaps this component in, so the effect does the leaving instead.

   location.replace rather than router.replace, so both ways in end in the
   same full load of /. On a direct visit the effect and the refresh race,
   and a client-side route to / would only be thrown away by the refresh
   landing on top of it. replace keeps the retired URL out of history, so
   Back skips the hop.

   Renders no Header and no body: there is nothing here to read, and
   nothing should paint for the moment it is on screen. */
const RedirectHome = () => {
  useEffect(() => {
    globalThis.location.replace('/');
  }, []);

  return (
    <Head>
      <title>{meta.title}</title>
      <meta httpEquiv="refresh" content="0; url=/" />
      <link rel="canonical" href={meta.url} />
    </Head>
  );
};

export default RedirectHome;
