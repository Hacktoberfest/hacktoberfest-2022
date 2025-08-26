import foundersDigitalOcean from 'assets/img/founders/digitalocean.svg';
import foundersMlh from 'assets/img/founders/mlh.svg';

import amd from 'assets/img/sponsors/amd-white.svg';
import auth0 from 'assets/img/sponsors/auth0-white.svg';

import partnersGitlab from 'assets/img/partners/gitlab-white.svg';
import partnersGithub from 'assets/img/partners/github-white.svg';
import partnersGithubEducation from 'assets/img/partners/github_education-white.svg';
import partnersCNCF from 'assets/img/partners/cloud-native-white.svg';
import partnersOSI from 'assets/img/partners/osi-white.svg';
import partnersDEV from 'assets/img/partners/dev-white.svg';
import partnersHolopin from 'assets/img/partners/holopin-white.svg';

export const founders = [
  {
    image: foundersDigitalOcean,
    title: 'DigitalOcean',
    content:
      'DigitalOcean simplifies cloud computing so businesses can spend more time creating software that changes the world. With its mission-critical infrastructure and fully managed offerings, DigitalOcean helps developers at startups and small and medium-sized businesses (SMBs) rapidly build, deploy and scale, whether creating a digital presence or building digital products. DigitalOcean combines the power of simplicity, security, community, and customer support so customers can spend less time managing their infrastructure and more time building innovative applications that drive business growth. For more information, visit [digitalocean.com](https://www.digitalocean.com).',
  },
  {
    image: foundersMlh,
    title: 'MLH',
    content:
      'Founded in 2013, Major League Hacking (MLH) is the global student hacker community and a Public Benefit Corporation that empowers the next generation of technology creators with programs that help them build real world skills and learn about leading developer platforms and APIs in a community oriented environment. Each year, MLH facilitates hundreds of weekend-long invention competitions called hackathons, supports campus clubs and meetups, trains developers on in-depth skills in the MLH Fellowship, and hosts thousands of developers from around the world in the monthly series of Global Hack Week events. These programs serve more than 150,000 developers a year across 90 countries.',
    list: [
      'Have a question about MLH? Head over to [our FAQ](mlh.io/faq) to find some answers to common questions.',
      'Global Hack Week website: [https://mlh.link/mlh-hacktoberfest](https://mlh.link/mlh-hacktoberfest)',
      'Global Hack Week Open Source landing page: [https://mlh.link/ghw-opensource](https://mlh.link/ghw-opensource)',
      'Global Hack Week Open Source registration page: [https://mlh.link/ghw-opensource-registration](https://mlh.link/ghw-opensource-registration)',
    ],
  },
];

export const advocate = [
  {
    image: auth0,
    title: 'Auth0',
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  },
  {
    image: amd,
    title: 'AMD',
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  },
];

export const sponsors = [...founders, ...advocate];

export const partners = [
  {
    image: partnersGithub,
    title: 'GitHub',
    content:
      'GitHub is the world’s leading AI-powered developer platform to build, scale, and deliver secure software. Over 100 million people, including more than 90% of the Fortune 100 companies, use GitHub to collaborate and experiment across 420+ million repositories.',
  },
  {
    image: partnersGithubEducation,
    title: 'GitHub Education',
    content:
      "At GitHub Education our mission is to empower learners and educators with tools and resources to accelerate learning and develop the next generation of software professionals. From individual student developers to large educational institutions, we offer tailored programs and services, including access to real-world tools, free learning resources, and opportunities to connect with a global community of developers. With GitHub Education, we're equipping a generation of future innovators to build the future.\n" +
      ' - Join GitHub Global Campus! [https://education.github.com/](https://education.github.com/)',
  },
  {
    image: partnersGitlab,
    title: 'GitLab',
    content:
      'GitLab is the most comprehensive AI-powered DevSecOps platform for software innovation. GitLab enables organizations to increase developer productivity, improve operational efficiency, reduce security and compliance risk, and accelerate digital transformation. More than 30 million registered users and more than 50% of the Fortune 100 trust GitLab to ship better, more secure software faster. Join 4,000+ contributors in GitLab’s open source community.\n' +
      ' - Contribute to GitLab [https://about.gitlab.com/community/contribute/](https://about.gitlab.com/community/contribute/)\n' +
      ' - Browse the GitLab project [https://gitlab.com/gitlab-org/gitlab](https://gitlab.com/gitlab-org/gitlab)',
  },
  {
    image: partnersCNCF,
    title: 'CNCF',
    content:
      'CNCF is the open source, vendor-neutral hub of cloud native computing, hosting projects like Kubernetes and Prometheus to make cloud native universal and sustainable.\n' +
      ' - Contribute to [CLOTributor](https://clotributor.dev/)',
  },
  {
    image: partnersOSI,
    title: 'Open Source Initiative',
    content:
      'Founded in 1998, the [Open Source Initiative](https://opensource.org/) (OSI) is a non-profit corporation with global scope formed to educate about and advocate for the benefits of Open Source and to build bridges among different constituencies in the Open Source community. It is the steward of the Open Source Definition, setting the foundation for the global Open Source ecosystem. Join and support the OSI mission today at [https://opensource.org/join](https://opensource.org/join).',
  },
  {
    image: partnersDEV,
    title: 'DEV',
    content:
      'DEV is a community of software developers getting together to help one another out. The software industry relies on collaboration and networked learning, and DEV provides a place for that to happen.\n' +
      ' - Participate in the [Hacktoberfest Writing Challenge](https://dev.to/challenges/hacktoberfest)',
  },
  {
    image: partnersHolopin,
    title: 'Holopin',
    content:
      'Display, share, and issue digital badges for achievements. Showcase on GitHub, LinkedIn, and your favorite socials.',
  },
];
