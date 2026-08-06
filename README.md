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
