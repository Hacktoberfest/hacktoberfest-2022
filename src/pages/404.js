import Head from 'next/head';

import Header from 'components/Header';
import MessagePage from 'components/MessagePage';
import { notFound } from 'data/content.mjs';

const FourOFour = () => (
  <>
    <Head>
      <title>{notFound.title}</title>
      <meta name="robots" content="noindex" />
      <meta name="theme-color" content="#3d5f58" />
    </Head>
    <Header standalone />
    <main id="main">
      <MessagePage
        eyebrow={notFound.eyebrow}
        heading={notFound.heading.lead}
        accent={notFound.heading.accent}
        cta={notFound.cta}
        ctaHref="/"
      >
        {notFound.body}
      </MessagePage>
    </main>
  </>
);

export default FourOFour;
