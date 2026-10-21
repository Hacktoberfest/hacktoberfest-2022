import Head from 'next/head';

import Header from 'components/Header';
import MessagePage from 'components/MessagePage';
import { my } from 'data/content.mjs';

/* Every /my page while BRB mode is on (data/myBrb.mjs). Each page swaps
   itself for this at its default export, so none of its effects run: no
   sign-in check, no redirect to /login/, no fetch, and the exported HTML
   is this screen as it stands. MessagePage, the outage screen's surface
   (components/MyStatus), whose styles every /my page already ships. */
const MyBrb = () => (
  <>
    <Head>
      <title>{my.title}</title>
      <meta name="robots" content="noindex" />
      <meta name="theme-color" content="#3d5f58" />
    </Head>
    <Header standalone />
    <main id="main">
      <MessagePage
        eyebrow={my.brb.eyebrow}
        heading={my.brb.title}
        accent={my.brb.accent}
      >
        {my.brb.body}
      </MessagePage>
    </main>
  </>
);

export default MyBrb;
