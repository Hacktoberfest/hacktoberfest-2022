import lisa from 'assets/img/council/lisa.jpg';
import eddie from 'assets/img/council/eddie.jpg';
import duane from 'assets/img/council/duane.jpg';
import mason from 'assets/img/council/mason.jpg';

export const intro = {
  title: 'Video [10th Anniversary]',
  content:
    'Check out [previous years Hacktoberfest videos](https://www.youtube.com/@DigitalOcean/search?query=hacktoberfest)',
};

export const lore = {
  title: 'Hacktoberfest Lore',
  content:
    "Hacktoberfest is DigitalOcean's annual event that encourages people to contribute to open source throughout October. Much of modern tech infrastructure—including some of DigitalOcean's own products—relies on open-source projects built and maintained by passionate people who often don't have the staff or budgets to do much more than keep the project alive. Hacktoberfest is all about giving back to those projects, sharpening skills, and celebrating all things open source, especially the people that make open source so special.\n\n" +
    'For the past 10 years, thousands of people—coders and non-coders alike—have participated in Hacktoberfest to support the projects they use and love, learn and practice skills that will enhance their careers, and meet new people who love open source as much as they do.',
};

export const digitalRewards = {
  title: 'Going Digital for Rewards',
  content:
    "In its tenth year, we're making important changes to Hacktoberfest to help ensure its sustainability for the next decade. Most notably, we will be moving away from the t-shirt rewards we have previously provided to a digital reward kit.\n\n" +
    "Although we know Hacktoberfest t-shirts are loved by the community, producing over 50,000 t-shirts and shipping them around the world has become logistically challenging. Even with the support of external sponsors, almost all of the program's operating budget in past years has been allocated towards these physical rewards. Furthermore, we've run into challenges in many countries with participants being required to pay customs taxes and import duty fees which often exceed the value of the gift itself.\n\n" +
    "Our commitment remains unwavering towards Hacktoberfest's primary mission of supporting open source projects. After carefully considering various options for this year and the future, we are excited to introduce an exclusive digital reward kit in partnership with Holopin. We believe that even without t-shirt rewards, the developer community will continue to come together in the same spirit of Hacktoberfest that they've always shown.\n\n" +
    "The new digital reward kit will include a customizable badge that evolves with each pull/merge request accepted by maintainers, representing the participant's journey in open-source and Hacktoberfest. Additionally, winners will receive unique badges featuring a delightful surprise and gifts from sponsors. To celebrate their success, participants will also be able to share their winner's badge on the Holopin Hacktoberfest Badge Board of Fame.\n\n" +
    "In previous years we have given participants who completed 4 PR/MRs the option to plant a tree through our partner Tree Nation instead of redeeming a t-shirt. This year we're excited to share that we'll be purchasing a tree for the first 50,000 participants that complete their first PR/MR.",
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
    role: 'Head of Developer Education - Chainguard',
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
    name: "Duane O'Brien",
    image: duane.src,
    role: 'Consultant',
    skills: 'Open Source Programs Offices, Open Source Sustainability',
    bio: 'Duane is an Open Source Leader and Sustainability Specialist with nearly 25 years experience in the industry. He is an NSI Visiting Technologist Fellow, Open Source Collective Board Member, and the developer of the FOSS Contributor Fund framework. He loves telling the story of open source through collaboration and conversation. Duane is a force of chaotic good using his high stats in intelligence and charisma to advocate for the open source community. If you encounter him in forested areas, he will share his fire, drink, and philosophy.',
    links: [
      {
        title: 'duaneobrien.com',
        url: 'https://www.duaneobrien.com/',
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
        title: 'linkfree.io/eddiejaoude',
        url: 'https://linkfree.io/eddiejaoude',
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
];

export const sharing = {
  intro: 'Hacktoberfest Love',
  share: {
    title: 'Share your Hacktoberfest 🩷',
    content:
      "Hacktoberfest is an open-source celebration that brings people together from all over the world to make a positive impact on open source. If you've had an experience that started with Hacktoberfest and led to something bigger, we would love to hear and share your story. We'll pick some of the stories we receive to share with the community. Pictures, videos, and links are encouraged!\n\n" +
      'Share your Hacktoberfest story with us. We might feature you! [Story submissions](https://bit.ly/HF10-share-the-love).',
  },
  video: {
    title: 'Video',
    content:
      'To share a photo or short video, simply fill out our [video submissions](https://bit.ly/hacktoberfest-10-video) form.',
  },
  social: {
    title: 'Social Media',
    content:
      "Share your Hacktoberfest experience on social media! Use the official hashtag #hacktoberfest, #hacktoberfest10, or #hacktoberfest2023 and tell others about your favorite contributions, any swag you've received in the past (share a pic!), or a particularly memorable hack.",
  },
  blog: {
    title: 'Blog Post',
    content:
      "If you'd like to write about your experience participating in Hacktoberfest, we encourage you to create a blog post. Our partners at DEV welcome your writings, here are some [great examples](https://dev.to/search?q=hacktoberfest). You can share how you first heard about Hacktoberfest, how being part of the community has impacted your personal or professional development, and your favorite or most useful hack. Creativity is welcome! Once your blog post is live, let us know by tagging us in your social media posts about it.",
  },
  cta: "We look forward to hearing from you and seeing how you've been part of the **Hacktoberfest community**!",
};
