import '../styles/globals.css';
import Head from 'next/head';
import Link from 'next/link';
import { Theme } from 'components/theme';
import GlobalStyle from 'themes/themes';
import Navigation from 'components/navigation';

const App = ({ Component, pageProps }) => (
  <>
    <Head>
      <title>Hacktoberfest 2022</title>
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      <meta name="description" content="Hacktoberfest 2022" />
      <link rel="icon" href="/favicon.svg" />
    </Head>
    <Theme>
      <GlobalStyle />
      <Navigation />
      {/* <div>
        <Link href="/">
          <Logo />
        </Link>

        <Link href="/resources">Resources</Link>
        <Link href="/events">Events</Link>
        <Link href="/donate">Donate</Link>
        <Link href="/about">About</Link>
        <a href="https://discord.gg/hacktoberfest">Join the Discord</a>
      </div> */}

      <Component {...pageProps} />

      <div>
        {/* <Logo /> */}
        <p>&copy; 2022 DigitalOcean, LLC. All Rights Reserved.</p>

        <dl>
          <dt>Share</dt>
          <dd>
            <a href="">Twitter</a>
          </dd>
          <dd>
            <a href="">Facebook</a>
          </dd>
          <dd>
            <a href="">LinkedIn</a>
          </dd>
          <dd>
            <a href="">Hacker News</a>
          </dd>
          <dd>
            <a href="">Reddit</a>
          </dd>
        </dl>

        <dl>
          <dt>Follow</dt>
          <dd>
            <a href="https://discord.gg/hacktoberfest">Discord</a>
          </dd>
          <dd>
            <a href="https://twiter.com/hacktoberfest">Twitter</a>
          </dd>
          <dd>
            <a href="https://reddit.com/r/hacktoberfest">Reddit</a>
          </dd>
        </dl>

        <dl>
          <dt>Legal</dt>
          <dd>
            <a href="https://www.digitalocean.com/legal/terms-of-service-agreement">
              Terms
            </a>
          </dd>
          <dd>
            <a href="https://www.digitalocean.com/legal/privacy-policy">
              Privacy
            </a>
          </dd>
          <dd>
            <Link href="/events#brand">Brand Guidelines</Link>
          </dd>
        </dl>
      </div>
    </Theme>
  </>
);

export default App;
