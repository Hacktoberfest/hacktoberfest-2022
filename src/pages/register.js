import Head from 'next/head';

import Anchor from 'components/anchor';
import Divider from 'components/divider';
import Section from 'components/section';
import Loader from 'components/loader';
import Settings from 'components/profile/settings';
import Type from 'components/type';

import useAuth from 'hooks/useAuth';
import { FauxHero } from 'components/hero';
import { StyledHeader } from './auth';

const Register = () => {
  const auth = useAuth();

  return (
    <>
      <Head>
        <title>Register | Hacktoberfest 2022</title>
        <meta
          name="twitter:title"
          key="twitterTitle"
          content="Register | Hacktoberfest 2022"
        />
        <meta
          property="og:title"
          key="opengraphTitle"
          content="Register | Hacktoberfest 2022"
        />
      </Head>

      {auth.loading ? (
        <FauxHero
          h="220"
          s="8"
          b="0.4"
          gradientLeft="#E800FF"
          gradientRight="#0F00FF"
          height="600px"
        >
          <StyledHeader>
            <Loader message=">> Authorization in progress..." />
          </StyledHeader>
        </FauxHero>
      ) : (
        <FauxHero
          h="220"
          s="8"
          b="0.4"
          gradientLeft="#E800FF"
          gradientRight="#0F00FF"
          height="600px"
        >
          <StyledHeader>
            <Type
              text={`Hello, ${auth.user.name}`}
              prefix=">> Boot Registration:"
            />
          </StyledHeader>
          <Section>
            <Settings auth={auth} />
          </Section>
        </FauxHero>
      )}
    </>
  );
};

export default Register;
