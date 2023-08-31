import lisa from 'assets/img/council/lisa.jpeg';
import marlene from 'assets/img/council/marlene.jpg';
import joe from 'assets/img/council/joe.jpeg';
import duane from 'assets/img/council/duane.jpg';
import mason from 'assets/img/council/mason.jpeg';

export const intro = {
  title: 'Video [Yancey Welcome]',
  content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc faucibus vehicula ex. Ut ultrices viverra sagittis.'
}

export const lore = {
  title: 'Hacktoberfest Lore',
  content: 'Hacktoberfest is DigitalOcean’s annual event that encourages people to contribute to open source throughout October. Much of modern tech infrastructure—including some of DigitalOcean’s own products—relies on open-source projects built and maintained by passionate people who often don’t have the staff or budgets to do much more than keep the project alive. Hacktoberfest is all about giving back to those projects, sharpening skills, and celebrating all things open source, especially the people that make open source so special.\n\n' +
  'For the past 10 years, thousands of people—coders and non-coders alike—have participated in Hacktoberfest to support the projects they use and love, learn and practice skills that will enhance their careers, and meet new people who love open source as much as they do.'
}

export const digitalRewards = {
  title: 'Going Digital for Rewards',
  content: 'This year, there will be no physical reward kit for completing Hacktoberfest – no t-shirt and stickers. Instead, we’re pivoting to an all-digital reward kit in partnership with Holopin and our sponsors. Let’s talk about why.\n\n' +
  'Although we know Hacktoberfest t-shirts are loved by the community, producing over 50,000 t-shirts and shipping them around the world has become logistically challenging. Even with the support of external sponsors, almost all of the program’s operating budget in past years has been allocated towards these physical rewards. Furthermore, we’ve run into challenges in many countries with participants being required to pay customs taxes and import duty fees which often exceed the value of the gift itself.\n\n' +
  'Our commitment remains unwavering towards Hacktoberfest\'s primary mission of supporting open source projects. After carefully considering various options for this year and the future, we are excited to introduce an exclusive digital reward kit in partnership with Holopin. We believe that even without t-shirt rewards, the developer community will continue to come together in the same spirit of Hacktoberfest that they’ve always shown.\n\n' +
  'The new digital reward kit will include a customizable badge that evolves with each pull/merge request accepted by maintainers, representing the participant\'s journey in open-source and Hacktoberfest. Additionally, winners will receive unique badges featuring a delightful surprise and gifts from sponsors. To celebrate their success, participants will also be able to share their winner’s badge on the Holopin Hacktoberfest Badge Board of Fame.'
}

export const advisoryCouncil = {
  title: 'Advisory Council',
  content: 'Each year, we bring together a talented group of open-source superfans who help ensure that Hacktoberfest is accessible, inclusive, and enriching for both contributors and maintainers.'
}

export const lowNonCode = [
  {
    title: 'Writing',
    low: [
      'Technical documentation',
    ],
    non: [
      'Translating',
      'Copy editing',
    ],
  },
  {
    title: 'Design',
    low: [
      'Testing',
    ],
    non: [
      'User experience testing',
      'Graphic design',
      'Video production',
    ],
  },
  {
    title: 'Advocacy**',
    low: [
      'Talks or presentations',
      'Technical blog posts',
      'Podcasts',
      'Case studies',
    ],
    non: [
      'Social media',
      'Blog posts',
    ],
  },
];

export const council = [
  {
    name: 'Lisa Tagliaferri',
    image: lisa.src,
    role: 'Head of Developer Education at Chainguard',
    skills: 'Software Security, Python, Digital Humanities',
    bio: 'Lisa Tagliaferri is Head of Developer Education at Chainguard. Working at the intersection of teaching, research, and development, Lisa is committed to lowering barriers of entry into technology and open source. Lisa has written popular open access books and tutorials on Python, machine learning and other technical topics, and is a maintainer and builder of open source software.',
    links: [
      {
        title: 'Sigstore',
        url: 'https://github.com/sigstore',
      },
      {
        title: 'Cloud Haiku',
        url: 'https://github.com/do-community/cloud_haiku',
      },
      {
        title: 'chainguard.dev',
        url: 'http://chainguard.dev',
      },
    ],
  },
  {
    name: 'Marlene Mhangami',
    image: marlene.src,
    role: 'Developer Advocate at Voltron Data',
    skills: 'Python',
    bio: 'Marlene is the Vice-Chair and a director at the Python Software Foundation, the non-profit organization behind Python. She is also the co-founder of ZimboPy, a Zimbabwean non-profit that empowers women to pursue careers in technology. She is based in Harare, Zimbabwe, and was the chair of the inaugural Pycon Africa, the annual pan-African gathering of the Python community. Marlene is interested in seeing technology used for social good and to unite communities across borders globally. She is currently interning as a Software Engineer with the RAPIDS team at Nvidia, working on an Open Source Python GPU DataFrame library.',
    links: [
      {
        title: 'Portfolio',
        url: 'https://marlenemhangami.com/',
      },
    ],
  },
  {
    name: 'Joe Nash',
    image: joe.src,
    role: 'Developer Educator at Twilio',
    skills: 'Developer relations, developer education, community',
    bio: 'Joe is a developer educator at Twilio, where he helps people teach and learn with TwilioQuest. Joe helps companies with their developer relations and communities strategies as a consult, via Interhacktive.co.',
    links: [],
  },
  {
    name: 'Duane O\'Brien',
    image: duane.src,
    role: 'Head of Open Source at Indeed, Inc.',
    skills: 'Open Source Programs Offices, Open Source Sustainability',
    bio: 'Duane leads the vision for open source at Indeed. He manages the people, policies, and ideas to grow open source participation within the company. He loves telling the story of open source through collaboration and conversation. Duane is a force of chaotic good using his high stats in intelligence and charisma to advocate for the open source community. If you encounter him in forested areas, he will share his fire, drink, and philosophy.',
    links: [
      {
        title: 'FOSS Contributor Fund',
        url: 'https://github.com/indeedeng/FOSS-Contributor-Fund',
      },
    ],
  },
  {
    name: 'Mason Egger',
    image: mason.src,
    role: 'Lead Developer Advocate at Gretel.ai',
    skills: 'Python, Synthetic Data, Data Privacy, Cloud Computing',
    bio: 'Mason is currently the Lead Developer Advocate at Gretel where he specializes in synthetic data, data privacy, and Python. Prior to his role at Gretel, he was a Developer Advocate at DigitalOcean and an SRE helping build and maintain a highly available hybrid multi-cloud PaaS. He is an avid programmer, speaker, educator, and writer. He is an organizer of PyTexas, President of the PyTexas Foundation, and actively contributes to open source projects. In his spare time, he enjoys reading, camping, kayaking, and exploring new places.',
    links: [
      {
        title: 'Website',
        url: 'https://mason.dev/about/',
      },
    ],
  },
];
