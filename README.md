# Hacktoberfest

Front-end static website for [Hacktoberfest](https://hacktoberfest.com),
built with [Next.js](https://nextjs.org).

## Getting Started

- Install the correct version of Node.js, matching the version defined in
  [`.nvmrc`](.nvmrc) (and/or [`engines.node` in `package.json`](package.json)).
  We recommend using [nvm](https://github.com/nvm-sh/nvm), or
  [fnm](https://github.com/Schniz/fnm), to manage versions.

- Install dependencies for the project by running `npm ci` (this will match the
  exact versions defined in [`package-lock.json`](package-lock.json)).

- Start the development server by running `npm run dev`, and then open
  [http://localhost:3000](http://localhost:3000) in your browser.

### Running against the real API

`/my` is mocked until `NEXT_PUBLIC_API_BASE_URL`
is set. To run against a local backend:

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000 npm run dev -- -p 4000
```

The API listens on port 3000, so the frontend needs a different one — hence
`-p 4000`. Two variables on the API side have to agree with that choice:

- `FRONTEND_URL=http://localhost:4000` — where the API sends people after
  MyMLH, so the callback lands on this dev server rather than production
- `ALLOWED_DEV_ORIGINS` must include `http://localhost:4000` — otherwise the
  browser blocks the code exchange on CORS

Leaving `NEXT_PUBLIC_API_BASE_URL` unset keeps the mocked build, which needs
no backend at all.

#### Mocked or live is baked in at build time

`NEXT_PUBLIC_API_BASE_URL` is inlined into the client bundle by `npm run
build`, so **the mode is a property of `out/`, not of the shell you serve it
from**. Setting the variable in front of `npm start` changes nothing.

This matters more than it sounds, because **`npm test` runs `npm run build`**
(via `test:integration`). Running the suite therefore rebuilds `out/` with
whatever the environment held at the time — which will silently turn a live
build into a mocked one. The symptom is not an error: the "Sign in with
MyMLH" button stops redirecting to MyMLH and quietly writes a fixture
session instead, so you appear signed in as Ada Lovelace and every page
serves mock data.

`npm start` guards against this. The build records its mode in
`.build-mode.json` (gitignored), and `prestart` refuses to serve when that
contradicts the environment you are starting it with, naming the exact
rebuild command. It always prints which mode you are getting. Both modes are
valid — it only blocks the mismatch. If you rebuild for a different mode,
just rerun `npm start`.

`NEXT_PUBLIC_AUTH_START_URL` is an optional override for where the "Sign in
with MyMLH" button sends people. It defaults to `${NEXT_PUBLIC_API_BASE_URL}/oauth/mlh`,
which is right whenever the API serves the OAuth hand-off itself; set it only
when that hand-off lives somewhere else, such as behind a separate hostname or
a proxy. It has no effect while `NEXT_PUBLIC_API_BASE_URL` is unset, because
the mocked build never leaves the site.

## Contributing

If you're looking to contribute to the website, please take a look through the
open issues to see what needs to be done. If you've discovered something you
think needs a change that is not covered by an existing issue, please open an
issue first to discuss it with the maintainers. We generally will not accept
pull requests without an associated issue that has been discussed.

While the website is open-source, we are unable to accept all changes. We're
looking for changes that improve the user experience on the site or fix
bugs/typos. We're not looking for changes that modify the branding or change
how Hacktoberfest operates as a whole.

## Configuration

`BASE_URL` must be set to the public website URL when building the sitemap.

## Deployment

The website is deployed to [App Platform](https://do.co/apps), for both the
production and staging websites. Each environment is deployed to two separate
App Platform instances in different regions, with a load balancer in front to
handle traffic, ensuring high availability.

The production website is deployed whenever a new commit is pushed to the
`production` branch, which maintainers can do locally using
`make deploy-production`. The staging website is deployed from the `staging`
branch, for which maintainers can use `make deploy-staging`.

## License

Subject to the exceptions below and in the LICENSE, the code for the website is
released under the [Apache License 2.0](LICENSE.md).

Please note that Hacktoberfest is a registered trademark of DigitalOcean, and
the Hacktoberfest brand is not released under this license.
