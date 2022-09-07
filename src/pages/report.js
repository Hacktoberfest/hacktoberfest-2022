import Head from 'next/head';

import Anchor from 'components/anchor';
import Divider from 'components/divider';
import Section from 'components/section';

const Report = () => {
  return (
    <>
      <Head>
        <title>Report | Hacktoberfest 2022</title>
        <meta name="twitter:title" key="twitterTitle" content="Report | Hacktoberfest 2022" />
        <meta property="og:title" key="opengraphTitle" content="Report | Hacktoberfest 2022" />
      </Head>

      <Section type="sub_hero">
        <h1>Report</h1>
        <h4>Found a repository that doesn't follow the values of Hacktoberfest? Let us know and we'll review it.</h4>
      </Section>

      <Section type="sub_content">
        <Divider />
        <Anchor href="#" />
        <p>
          Coming soon: The ability to report repositories will be available when registration opens.
        </p>
      </Section>
    </>
  );
};

export default Report;
