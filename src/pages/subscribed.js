import Head from 'next/head';

import Header from 'components/Header';
import MessagePage from 'components/MessagePage';
import { subscribed } from 'data/content.mjs';

/* Where the interest form sends people after they submit. The form appends
   first_name/last_name to the URL; the page deliberately ignores them so it
   renders the same whether or not they were filled in. It also serves both
   the host and attend CTAs, so the wording stays general. */
const Subscribed = () => (
  <>
    <Head>
      <title>{subscribed.title}</title>
      <meta name="robots" content="noindex" />
      <meta name="theme-color" content="#3d5f58" />
    </Head>
    <Header standalone />
    <main id="main">
      <MessagePage
        eyebrow={subscribed.eyebrow}
        heading={subscribed.heading.lead}
        accent={subscribed.heading.accent}
        cta={subscribed.cta}
        ctaHref="/"
      >
        {subscribed.body}
      </MessagePage>
    </main>
  </>
);

export default Subscribed;
