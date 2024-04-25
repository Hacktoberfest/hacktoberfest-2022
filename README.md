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

The website uses a [`config.js`](src/lib/config.js) file to store common
configuration values. When developing, you may need to change these values to
view different states of the website. These can be changed in the file itself
or by setting the equivalent environment variables.

Primarily, these variables control the "state" of the site, such as whether
registration is open. Hacktoberfest follows a timeline of events, impacting the
state of the site:

- Pre-registration:
  The site can be accessed but the registration/profile flow is unavailable.

- Registration start:
  The registration/profile flow is available, but PR/MRs are not tracked.

- Tracking start:
  New PR/MRs are tracked. This is the core state of Hacktoberfest.

- Registration end:
  New registrations are not accepted but existing profiles can be accessed.

- Tracking end:
  New PR/MRs are not tracked but changes to existing ones are still tracked.

- Tracking end extended:
  All PR/MRs are no longer tracked but the profile flow is still available.

- Profile end:
  The profile flow is no longer available but the site can still be accessed.

## Profile API

The website uses the closed-source hackathon-tracker API maintained by
DigitalOcean to handle all functionality relating to user profiles
(authentication, registration, PR statues, etc.).

If you wish to test any functionality using the API,
some environment variables will need to be set:

- `BASE_URL` needs to be set to the base URL of the website
  (e.g., `http://localhost:3000`).

- `API_BASE_URL` needs to be set to the base URL of the API
  (e.g., `https://hackathon-tracker.digitalocean.com`).

- `API_EVENT_ID` needs to be set to an event ID that the API will recognize
  (more below).

To be able to load registration and anything beyond, you'll need a valid event
ID. To see what events are available to you, you can start the development
server without the ID set. Once started, complete the authentication flow, and
grab your API token from your browser's local storage. You can then use this
token to manually call the `/events` endpoint to see what events are available.

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
