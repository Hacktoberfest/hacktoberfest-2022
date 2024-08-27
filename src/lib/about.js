import lisa from 'assets/img/council/lisa.jpg';
import eddie from 'assets/img/council/eddie.jpg';
import mason from 'assets/img/council/mason.jpg';
import bekah from 'assets/img/council/bekah.jpg';

export const lore = {
  title: 'Hacktoberfest Lore',
  content:
    'Hacktoberfest is DigitalOcean’s annual event that encourages people to contribute to open source throughout October. Much of modern tech infrastructure—including some of DigitalOcean’s own products—relies on open-source projects built and maintained by passionate people who often don’t have the staff or budgets to do much more than keep the project alive. Hacktoberfest is all about giving back to those projects, sharpening skills, and celebrating all things open source, especially the people that make open source so special.',
  contentRight:
    'Each year Hacktoberfest gets a new look, but our mission remains the same… getting as many people as possible involved in open source. Thousands of people—coders and non-coders alike—have participated in Hacktoberfest to support the projects they use and love, learn and practice skills that will enhance their careers, and meet new people who love open source as much as they do.',
  links: [
    {
      id: 'watch-hacktoberfest',
      href: 'https://www.youtube.com/playlist?list=PLseEp7p6EwiZgLPknY4ITJxfoo75wqxph',
      children: 'Watch Hacktoberfest brand videos from over the years',
    },
  ],
};

export const sharing = {
  intro: 'Hacktoberfest Love',
  share: {
    title: 'Share your Hacktoberfest 🩷',
    content:
      'Hacktoberfest is an open-source celebration that brings people together from all over the world to make a positive impact on open source. If you’ve had an experience that started with Hacktoberfest and led to something bigger, we would love to hear and share your story. We’ll pick some of the stories we receive to share with the community. Pictures, videos, and links are encouraged!',
  },
  social: {
    title: 'Social Media',
    content:
      "Share your Hacktoberfest experience on social media! Tag us @hacktoberfest and use the official hashtag #hacktoberfest to tell others about your favorite contributions, any swag you've received in the past (share a pic!), or a particularly memorable hack.",
  },
  blog: {
    title: 'Blog Post',
    content:
      "If you'd like to write about your experience participating in Hacktoberfest, we encourage you to create a blog post. Our partners at DEV welcome your writings, here are some [great examples](https://dev.to/search?q=hacktoberfest). You can share how you first heard about Hacktoberfest, how being part of the community has impacted your personal or professional development, and your favorite or most useful hack. Creativity is welcome! Once your blog post is live, let us know by tagging us in your social media posts about it.",
  },
  cta: "We look forward to hearing from you and seeing how you've been part of the **Hacktoberfest community**!",
};

export const rewards = {
  title: '2024 Participation Rewards',
  content:
    'For joining in the fun this year, participants in Hacktoberfest 2024 get a customizable digital badge from Holopin that gains new characteristics with each of your pull/merge requests. As each pull/merge request you submitted is accepted by maintainers, you’ll unlock a new level and customization for your badge, up to the four pull/merge requests to complete Hacktoberfest. As your skills evolve, so, too, will your badge!',
  contentRight:
    'Once Hacktoberfest 2024 is complete, you’ll be able to share your badge on the Holopin Hacktoberfest Badge Board of Fame to show-off your unique badge and to celebrate your hard-won victory! You can also embed your Holopin badge board, showing off all the Hacktoberfest badges you’ve collected over the years, on your GitHub or GitLab profile.',
};

export const sponsorsAndPartners = {
  title: 'Our Sponsors & Partners',
  content:
    'Hacktoberfest could not happen without the generous support of our sponsors and partners. We invite you to learn more about them!',
};

export const advisoryCouncil = {
  title: 'Advisory Council',
  content:
    'Each year, we bring together a talented group of open-source superfans who help ensure that Hacktoberfest is accessible, inclusive, and enriching for both contributors and maintainers.',
};

export const council = [
  {
    name: 'Lisa Tagliafferi',
    image: lisa.src,
    role: 'Senior Director, Developer Enablement - Chainguard',
    skills: 'Software Security, Python, Digital Humanities',
    bio: 'Lisa Tagliaferri is Head of Developer Education at Chainguard. Working at the intersection of teaching, research, and development, Lisa is committed to lowering barriers of entry into technology and open source. Lisa has written popular open access books and tutorials on Python, machine learning and other technical topics, and is a maintainer and builder of open source software.',
    links: [
      {
        id: 'sigstore-link',
        title: 'Sigstore',
        url: 'https://github.com/sigstore',
      },
      {
        id: 'cloud-haiku',
        title: 'Cloud Haiku',
        url: 'https://github.com/do-community/cloud_haiku',
      },
      {
        id: 'chainguard',
        title: 'chainguard.dev',
        url: 'http://chainguard.dev',
      },
    ],
  },
  {
    name: 'Eddie Jaoude',
    image: eddie.src,
    role: 'Open Source DevRel',
    skills:
      'Open Source fullstack and DevRel, Javascript, Typescript, SQL, NoSQL, automation testing, DevOps',
    bio:
      'Eddie is an Open Source fullstack and DevRel expert, with experience in Javascript, Typescript, SQL, NoSQL, automation testing and DevOps.\n\n' +
      "The foundation of Eddie's tech ethos is Open Source, as there is something in it for everyone. Eddie founded the EddieHub community to foster collaboration, communication and career development.\n\n" +
      'Eddie received the GitHub Star of the Year 2020 Award, GitHub Community Growth Award 2021 and GitHub Teacher of the Year Award 2022.',
    links: [
      {
        title: 'https://eddiejaoude.substack.com/p/links',
        url: 'https://eddiejaoude.substack.com/p/links',
      },
    ],
  },
  {
    name: 'Mason Egger',
    image: mason.src,
    role: 'Sr. Technical Curriculum Developer at Temporal',
    skills:
      'Community-building, developer-focused educational content, distributed systems, Python',
    bio: "Mason is currently Sr. Technical Curriculum Developer at [Temporal.io](http://temporal.io/) who specializes building community, developer-focused educational content, distributed systems, and Python. Prior to his work at Temporal he launched Developer Relations at Gretel.ai as the Lead Developer Advocate, and was a Developer Advocate at DigitalOcean specializing in Infrastructure-as-a-Service technologies. His engineering experience includes time as an SRE helping build and maintain a highly available hybrid multi-cloud PaaS. He's an avid programmer, speaker, educator, and writer/blogger. He is an organizer of PyTexas, President of the PyTexas Foundation, and actively contributes to open source projects. In his spare time, he enjoys reading, camping, kayaking, and exploring new places.",
    links: [
      {
        title: 'Website',
        url: 'https://mason.dev/about/',
      },
    ],
  },
  {
    name: 'Bekah Hawrot Weigel',
    image: bekah.src,
    role: 'Developer Experience Lead',
    skills:
      'Developer Experience, Community Building, Education, Course Creation, Front-End',
    bio: 'Bekah graduated from a coding bootcamp in May of 2019 and since then has spent time as a frontend developer, started the Virtual Coffee developer community, spent time in DevRel and has continued to mom her four kids. She currently co-hosts the Virtual Coffee and Compressed FM podcasts, works as the Developer Experience Lead at OpenSauced, and lifts heavy things in her free time.',
    links: [
      {
        title: 'Website',
        url: 'https://bekahhw.com/',
      },
    ],
  },
];
