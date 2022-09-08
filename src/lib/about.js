import mariatta from 'assets/img/council/mariatta.png';
import lisa from 'assets/img/council/lisa.jpeg';
import alison from 'assets/img/council/alison.jpg';
import marlene from 'assets/img/council/marlene.jpg';
import joe from 'assets/img/council/joe.jpeg';
import duane from 'assets/img/council/duane.jpg';
import mason from 'assets/img/council/mason.jpeg';

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
    name: 'Mariatta Wijaya',
    image: mariatta.src,
    role: 'Sr Developer Relations Engineer at Google',
    skills: 'Python, Web Development, APIs, Open Source community',
    bio: 'Mariatta is a Python Core Developer, Staff Software Engineer at Uplight, and the Vancouver PyLadies co-organizer. She has over 15 years of professional experience in tech industry, with expertise in web development and APIs. For her contributions to Python and open source community, she was awarded Python Community Service Award in 2018 and Google Open Source Peer Bonus twice.',
    links: [
      {
        title: 'Python',
        url: 'https://github.com/python/cpython',
      },
    ],
  },
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
    name: 'Alison Dowdney',
    image: alison.src,
    role: 'Developer Advocate at Weaveworks',
    skills: 'Open Source, Kubernetes, GitOps',
    bio: 'Alison Dowdney is co-chair of Kubernetes SIG Contributor Experience, a CNCF Ambassador, a Flux maintainer, and a Developer Advocate at Weaveworks. Alison lives in London and tweets @AlisonDowdney',
    links: [],
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
