import foundersDigitalOcean from 'assets/img/founders/digitalocean.svg';
import foundersHeroDigitalOcean from 'assets/img/founders/digitalocean-hero.svg';

import advocatesTwilio from 'assets/img/advocates/twilio.svg';
import advocatesHeroTwilio from 'assets/img/advocates/twilio-hero.svg';
import advocatesCloudflare from 'assets/img/advocates/cloudflare.svg';
import advocatesHeroCloudflare from 'assets/img/advocates/cloudflare-hero.svg';

import sustainersQuira from 'assets/img/sustainers/quira.svg';
import sustainersHeroQuira from 'assets/img/sustainers/quira-hero.svg';

import partnersMLH from 'assets/img/partners/mlh.png';
import partnersMLHHero from 'assets/img/partners/mlh-hero.svg';
import partnersHolographic from 'assets/img/partners/holographic.png';
import partnersHolographicHero from 'assets/img/partners/holographic-hero.svg';
import partnersGitlab from 'assets/img/partners/gitlab.png';
import partnersGitlabHero from 'assets/img/partners/gitlab-hero.svg';
import partnersGithub from 'assets/img/partners/github.png';
import partnersGithubHero from 'assets/img/partners/github-hero.svg';
import partnersGithubEducation from 'assets/img/partners/github_education.png';
import partnersGithubEducationHero from 'assets/img/partners/github_education-hero.svg';

export const founders = [
  {
    image: foundersDigitalOcean.src,
    title: 'DigitalOcean',
    content:
      'DigitalOcean simplifies cloud computing so businesses can spend more time creating software that changes the world. With its mission-critical infrastructure and fully managed offerings, DigitalOcean helps developers at startups and small and medium-sized businesses (SMBs) rapidly build, deploy and scale, whether creating a digital presence or building digital products. DigitalOcean combines the power of simplicity, security, community, and customer support so customers can spend less time managing their infrastructure and more time building innovative applications that drive business growth. For more information, visit [digitalocean.com](https://www.digitalocean.com).',
    link: {
      target: '_blank',
      rel: 'noreferrer noopener',
      href: 'https://www.digitalocean.com',
      title: 'Visit DigitalOcean',
    },
    hero: {
      image: foundersHeroDigitalOcean.src,
    },
  },
];

export const advocate = [
  {
    image: advocatesTwilio.src,
    title: 'Twilio',
    content: 'Need content',
    link: {
      target: '_blank',
      rel: 'noreferrer noopener',
      href: 'https://www.twilio.com',
      title: 'Visit Twilio',
    },
    hero: {
      image: advocatesHeroTwilio.src,
    },
  },
  {
    image: advocatesCloudflare.src,
    title: 'Cloudflare',
    content:
      "Cloudflare, Inc. is the leading connectivity cloud company on a mission to help build a better Internet. It empowers organizations to create an application modernization and AI strategy to consume, build, protect, and defend at scale. Cloudflare's developer platform gives you a rich ecosystem of foundational technology built on open source and open standards. Your architecture choices shouldn't be tied to a single vendor ecosystem. When you have the freedom to choose, you're freed from costly cloud bills, sys-admin challenges, and configuration hassles freeing you to build the next big thing.",
    link: {
      target: '_blank',
      rel: 'noreferrer noopener',
      href: 'https://www.cloudflare.com/developer-platform/products/',
      title: 'Visit Cloudflare',
    },
    hero: {
      image: advocatesHeroCloudflare.src,
    },
  },
];

export const sustainer = [
  {
    image: sustainersQuira.src,
    title: 'Quira',
    content:
      'Quira designs asynchronous online challenges that reward you for contributing to open source. Want to take your Hacktoberfest experience to the next level? Visit [https://quira.sh/](https://quira.sh/) and join our community of over fifty thousand contributors, creators, and tinkerers, who are learning new skills and earning rewards by playing with the dev-tools of the future.',
    link: {
      target: '_blank',
      rel: 'noreferrer noopener',
      href: 'https://quira.sh/',
      title: 'Visit Quira',
    },
    hero: {
      image: sustainersHeroQuira.src,
    },
  },
];

export const sponsors = [...founders, ...advocate, ...sustainer];

export const partners = [
  {
    image: partnersHolographic.src,
    title: 'Holographic',
    content:
      'Display, share, and issue digital badges for achievements. Showcase on GitHub, LinkedIn, and your favorite socials.',
    link: {
      target: '_blank',
      rel: 'noreferrer noopener',
      href: 'https://blog.holopin.io/posts/announcing-hacktoberfest-2023',
      title: 'Read our blog post',
    },
    hero: {
      image: partnersHolographicHero.src,
    },
  },
  {
    image: partnersMLH.src,
    title: 'Major League Hacking',
    content:
      'Founded in 2013, Major League Hacking (MLH) is the global student hacker community and a Public Benefit Corporation that empowers the next generation of technology creators with programs that help them build real world skills and learn about leading developer platforms and APIs in a community oriented environment. Each year, MLH facilitates hundreds of weekend-long invention competitions called hackathons, supports campus clubs and meetups, trains developers on in-depth skills in the MLH Fellowship, and hosts thousands of developers from around the world in the monthly series of Global Hack Week events. These programs serve more than 150,000 developers a year across 90 countries.\n\n' +
      ' - Have a question about MLH? Head over to [our FAQ](https://mlh.io/faq) to find some answers to common questions.\n' +
      ' - Global Hack Week website: [https://mlh.link/mlh-hacktoberfest](https://mlh.link/mlh-hacktoberfest)\n' +
      ' - Global Hack Week Open Source landing page: [https://mlh.link/ghw-opensource](https://mlh.link/ghw-opensource)\n' +
      ' - Global Hack Week Open Source registration page: [https://mlh.link/ghw-opensource-registration](https://mlh.link/ghw-opensource-registration)',
    link: {
      target: '_blank',
      rel: 'noreferrer noopener',
      href: 'https://hackp.ac/visit-mlh-hacktoberfest',
      title: 'Visit Major League Hacking',
    },
    hero: {
      image: partnersMLHHero.src,
    },
  },
  {
    image: partnersGithub.src,
    title: 'GitHub',
    content:
      "As the global home for all developers, GitHub is the complete developer platform to build, scale, and deliver secure software. Over 100 million people, including developers from 90 of the Fortune 100 companies, use GitHub to build amazing things together. With all the collaborative features of GitHub, it's never been easier for individuals and teams to write faster, better code.",
    link: {
      target: '_blank',
      rel: 'noreferrer noopener',
      href: 'https://gh.io/gh-hacktoberfest',
      title: 'Visit GitHub',
    },
    hero: {
      image: partnersGithubHero.src,
    },
  },
  {
    image: partnersGithubEducation.src,
    title: 'GitHub Education',
    content:
      "At GitHub Education our mission is to empower learners and educators with tools and resources to accelerate learning and develop the next generation of software professionals. From individual student developers to large educational institutions, we offer tailored programs and services, including access to real-world tools, free learning resources, and opportunities to connect with a global community of developers. With GitHub Education, we're equipping a generation of future innovators to build the future.\n" +
      ' - [Join GitHub Global Campus!](https://education.github.com/)',
    link: {
      target: '_blank',
      rel: 'noreferrer noopener',
      href: 'https://gh.io/hacktoberfest23',
      title: 'Visit GitHub Education',
    },
    hero: {
      image: partnersGithubEducationHero.src,
    },
  },
  {
    image: partnersGitlab.src,
    title: 'GitLab',
    content:
      'GitLab is the most comprehensive AI-powered DevSecOps platform for software innovation. GitLab enables organizations to increase developer productivity, improve operational efficiency, reduce security and compliance risk, and accelerate digital transformation. More than 30 million registered users and more than 50% of the Fortune 100 trust GitLab to ship better, more secure software faster. Join 4,000+ contributors in GitLab’s open source community.\n' +
      ' - [Contribute to GitLab](https://about.gitlab.com/community/contribute/)\n' +
      ' - [Browse the GitLab project](https://gitlab.com/gitlab-org/gitlab)',
    link: {
      target: '_blank',
      rel: 'noreferrer noopener',
      href: 'https://go.gitlab.com/DEBE0y',
      title: 'Visit GitLab',
    },
    hero: {
      image: partnersGitlabHero.src,
    },
  },
];
