import mariatta from 'img/council/mariatta.png';
import lisa from 'img/council/lisa.jpeg';
import alison from 'img/council/alison.jpg';
import marlene from 'img/council/marlene.jpg';
import joe from 'img/council/joe.jpeg';
import duane from 'img/council/duane.jpg';

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
    role: 'Staff Software Engineer at Uplight Inc.',
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
    role: 'Director of Developer Education at Sourcegraph',
    skills: 'Python, Technical Education, Digital Humanities',
    bio: 'Lisa Tagliaferri is Director of Developer Education at Sourcegraph. Working at the intersection of teaching, research, and development, Lisa is committed to lowering barriers of entry into technology and open source. Lisa has written popular open access books and tutorials on Python, machine learning and other technical topics, and is a maintainer and builder of open source software.',
    links: [
      {
        title: 'Sourcegraph Learn',
        url: 'https://github.com/sourcegraph/learn',
      },
      {
        title: 'Cloud Haiku',
        url: 'https://github.com/do-community/cloud_haiku',
      },
      {
        title: 'Computation History',
        url: 'https://github.com/dhmit/computation_hist',
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
    role: 'Software Engineer at NVIDIA',
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
    bio: 'Duane leads the vision for open source at Indeed. He manages the people, policies, and ideas to grow open source participation within the company. He loves telling the story of open source through collaboration and conversation. Duane is a force of chaotic good using his high stats in intelligence and charisma to advocate for the open source community. If you encounter him in forested areas, he will share his fire, drink, and philosophy. ',
    links: [
      {
        title: 'FOSS Contributor Fund',
        url: 'https://github.com/indeedeng/FOSS-Contributor-Fund',
      },
    ],
  },
];
