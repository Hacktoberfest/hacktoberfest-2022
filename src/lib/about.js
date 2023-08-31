import lisa from 'assets/img/council/lisa.jpg';
import eddie from 'assets/img/council/eddie.jpg';
import duane from 'assets/img/council/duane.jpg';
import mason from 'assets/img/council/mason.jpg';

import foundersIlla from 'assets/img/founders/illa.png';
import foundersAppwrite from 'assets/img/founders/appwrite.png';

import contributorsAmplication from 'assets/img/contributors/amplication.png';

import sustainersRunme from 'assets/img/sustainers/runme.png';
import sustainersOpensauced from 'assets/img/sustainers/opensauced.png';

import partnersTreeNation from 'assets/img/partners/tree_nation.png';
import partnersMLH from 'assets/img/partners/mlh.png';
import partnersHuggingFace from 'assets/img/partners/hugging_face.png';
import partnersHolographic from 'assets/img/partners/holographic.png';
import partnersGitlab from 'assets/img/partners/gitlab.png';
import partnersGithub from 'assets/img/partners/github.png';
import partnersGithubEducation from 'assets/img/partners/github_education.png';
import partnersDev from 'assets/img/partners/dev.png';
import partnersDagshub from 'assets/img/partners/dagshub.png';

export const intro = {
  title: 'Video [10th Anniversary]',
  content: 'Check out [previous years Hacktoberfest videos](https://www.youtube.com/@DigitalOcean/search?query=hacktoberfest)'
}

export const lore = {
  title: 'Hacktoberfest Lore',
  content: 'Hacktoberfest is DigitalOcean’s annual event that encourages people to contribute to open source throughout October. Much of modern tech infrastructure—including some of DigitalOcean’s own products—relies on open-source projects built and maintained by passionate people who often don’t have the staff or budgets to do much more than keep the project alive. Hacktoberfest is all about giving back to those projects, sharpening skills, and celebrating all things open source, especially the people that make open source so special.\n\n' +
  'For the past 10 years, thousands of people—coders and non-coders alike—have participated in Hacktoberfest to support the projects they use and love, learn and practice skills that will enhance their careers, and meet new people who love open source as much as they do.'
}

export const digitalRewards = {
  title: 'Going Digital for Rewards',
  content: 'In its tenth year, we\'re making important changes to Hacktoberfest to help ensure its sustainability for the next decade. Most notably, we will be moving away from the t-shirt rewards we have previously provided to a digital reward kit.\n\n' +
  'Although we know Hacktoberfest t-shirts are loved by the community, producing over 50,000 t-shirts and shipping them around the world has become logistically challenging. Even with the support of external sponsors, almost all of the program’s operating budget in past years has been allocated towards these physical rewards. Furthermore, we’ve run into challenges in many countries with participants being required to pay customs taxes and import duty fees which often exceed the value of the gift itself.\n\n' +
  'Our commitment remains unwavering towards Hacktoberfest\'s primary mission of supporting open source projects. After carefully considering various options for this year and the future, we are excited to introduce an exclusive digital reward kit in partnership with Holopin. We believe that even without t-shirt rewards, the developer community will continue to come together in the same spirit of Hacktoberfest that they’ve always shown.\n\n' +
  'The new digital reward kit will include a customizable badge that evolves with each pull/merge request accepted by maintainers, representing the participant\'s journey in open-source and Hacktoberfest. Additionally, winners will receive unique badges featuring a delightful surprise and gifts from sponsors. To celebrate their success, participants will also be able to share their winner’s badge on the Holopin Hacktoberfest Badge Board of Fame.\n\n' +
  'In previous years we have given participants who completed 4 PR/MRs the option to plant a tree through our partner Tree Nation instead of redeeming a t-shirt. This year we’re excited to share that we’ll be purchasing a tree for the first 50,000 participants that complete their first PR/MR.'
}

export const advisoryCouncil = {
  title: 'Advisory Council',
  content: 'Each year, we bring together a talented group of open-source superfans who help ensure that Hacktoberfest is accessible, inclusive, and enriching for both contributors and maintainers.'
}

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
    name: 'Duane O\’Brien',
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
    skills: 'Open Source fullstack and DevRel, Javascript, Typescript, SQL, NoSQL, automation testing, DevOps',
    bio: 'Eddie is an Open Source fullstack and DevRel expert, with experience in Javascript, Typescript, SQL, NoSQL, automation testing and DevOps.\n\n' +
    'The foundation of Eddie\'s tech ethos is Open Source, as there is something in it for everyone. Eddie founded the EddieHub community to foster collaboration, communication and career development.\n\n' +
    'Eddie received the GitHub Star of the Year 2020 Award, GitHub Community Growth Award 2021 and GitHub Teacher of the Year Award 2022.',
    links: [
      {
        title: 'linkfree.io/eddiejaoude',
        url: 'https://linkfree.io/eddiejaoude'
      }
    ],
  },
  {
    name: 'Mason Egger',
    image: mason.src,
    role: 'Sr. Technical Curriculum Developer at Temporal',
    skills: 'Community-building, developer-focused educational content, distributed systems, Python',
    bio: 'Mason is currently Sr. Technical Curriculum Developer at [Temporal.io](http://temporal.io/) who specializes building community, developer-focused educational content, distributed systems, and Python. Prior to his work at Temporal he launched Developer Relations at Gretel.ai as the Lead Developer Advocate, and was a Developer Advocate at DigitalOcean specializing in Infrastructure-as-a-Service technologies. His engineering experience includes time as an SRE helping build and maintain a highly available hybrid multi-cloud PaaS. He\'s an avid programmer, speaker, educator, and writer/blogger. He is an organizer of PyTexas, President of the PyTexas Foundation, and actively contributes to open source projects. In his spare time, he enjoys reading, camping, kayaking, and exploring new places.',
    links: [
      {
        title: 'Website',
        url: 'https://mason.dev/about/',
      },
    ],
  },
];

export const founders = [
  {
    image: foundersIlla.src,
    title: 'DigitalOcean',
    content: 'DigitalOcean simplifies cloud computing so businesses can spend more time creating software that changes the world. With its mission-critical infrastructure and fully managed offerings, DigitalOcean helps developers at startups and small and medium-sized businesses (SMBs) rapidly build, deploy and scale, whether creating a digital presence or building digital products. DigitalOcean combines the power of simplicity, security, community and customer support so customers can spend less time managing their infrastructure and more time building innovative applications that drive business growth. For more information, visit [digitalocean.com](http://digitalocean.com/).',
    link: {
      href: 'http://digitalocean.com',
      title: 'Visit DigitalOcean'
    },
  },
  {
    image: foundersIlla.src,
    title: 'ILLA Cloud',
    content: 'ILLA Cloud is an open source low-code developer tool with AI Agent features.',
    link: {
      href: 'https://bit.ly/3rN5YuG',
      title: 'Visit ILLA Cloud'
    },
  }, {
    image: foundersAppwrite.src,
    title: 'Appwrite',
    content: 'Appwrite is a backend platform for developing Web, Mobile, and Flutter applications. Built with the open source community and optimized for developer experience in the coding languages you love.',
    link: {
      href: 'http://hacktoberfest.appwrite.io',
      title: 'Visit Appwrite'
    },
  }
];

export const contributors = [
  {
    image: contributorsAmplication.src,
    title: 'Amplication',
    content: 'Amplication is the most flexible open-source backend development platform that saves engineers from repetitive coding tasks and long development cycles. Amplication accelerates development of any application, generating fully-functioning backend in minutes while solving production delaying issues.',
    link: {
      href: 'http://www.amplication.com/',
      title: 'Visit Amplication'
    },
  },
];

export const sustainer = [
  {
    image: sustainersRunme.src,
    title: 'Runme',
    content: 'Runme is an open source project that enables devs to run markdown documentation as an interactive runbook, either in VS Code or the terminal. You can also avoid bit-rot by testing your markdown in CI/CD and enjoy a number of integrations to get better UX for the services and infrastructure your repo interfaces with.',
    link: {
      href: 'https://runme.dev/',
      title: 'Visit Runme'
    },
  }, {
    image: sustainersOpensauced.src,
    title: 'OpenSauced',
    content: 'OpenSauced provides a path to your next contribution. Join the global community of open source developers sharing highlights of their contributions and receiving recommendations for projects to work on.',
    link: {
      href: 'https://opensauced.pizza/',
      title: 'Visit OpenSauced'
    },
  },
]

export const partners = [
  {
    image: partnersHolographic.src,
    title: 'Holographic',
    content: 'Display, share, and issue digital badges for achievements. Showcase on GitHub, LinkedIn, and your favorite socials.',
    link: {
      href: 'https://blog.holopin.io/posts/announcing-hacktoberfest-2023',
      title: 'Read our blog pos'
    },
  }, {
    image: partnersMLH.src,
    title: 'Major League Hacking',
    content: 'Major League Hacking (MLH) is the official student hackathon league. Each year, we power over 300 weekend-long invention competitions that inspire innovation, cultivate communities and teach computer science skills to more than 500,000 developers around the world. MLH is an engaged and passionate maker community, consisting of the next generation of technology leaders and entrepreneurs. MLH has been a community first, mission driven organization from the beginning. We measure our success by the number of hackers we empower, and we want to keep it that way. That’s why we made it official and became a Certified B Corporation in 2016. B Corps are for-profit enterprises that are legally required to consider the impact of their decisions on their community, not just their shareholders.\n\n' +
    ' - Have a question about MLH? Head over to [our FAQ](https://mlh.io/faq) to find some answers to common questions.\n' +
    ' - GHW website: [https://hackp.ac/mlh-hacktoberfest](https://hackp.ac/mlh-hacktoberfest)\n' +
    ' - GHW Open Source landing page: [https://hackp.ac/ghw-opensource](https://hackp.ac/ghw-opensource)\n' +
    ' - GHW Open Source registration page: [https://hackp.ac/ghw-opensource-registration](https://hackp.ac/ghw-opensource-registration)',
    link: {
      href: 'https://mlh.io/',
      title: 'Visit Major League Hacking'
    },
  }, {
    image: partnersTreeNation.src,
    title: 'Tree Nation',
    content: 'Our mission is to reforest the world. Planting trees has been proven to be one of the most efficient solutions to fight Climate Change. Thanks to our reforestation and conservation projects we help to restore forests, create jobs, support local communities and protect biodiversity. Through the Tree-Nation platform we aim to bring a technological solution to the problem of Deforestation, responsible for about 17% of all Climate Change emissions. We want to use technology to make tree planting easy and provide support, advice and solutions to citizens and companies to help them transition towards a sustainable future. With 85% of all terrestrial species living in tropical forests, whose existences are intrinsically bound to the forests, their habitat, we care to restore and preserve the biodiversity to help avoid a mass extinction. To learn more, visit:\n\n' +
    ' - [https://tree-nation.com/projects](https://tree-nation.com/projects)\n' +
    ' - [https://tree-nation.com/about-us](https://tree-nation.com/about-us)\n' +
    ' - [https://tree-nation.com/why-plant-trees](https://tree-nation.com/why-plant-trees)',
    link: {
      href: 'https://tree-nation.com/',
      title: 'Visit Tree Nation'
    },
  }, {
    image: partnersGithub.src,
    title: 'GitHub',
    content: 'As the global home for all developers, GitHub is the complete developer platform to build, scale, and deliver secure software. Over 100 million people, including developers from 90 of the Fortune 100 companies, use GitHub to build amazing things together. With all the collaborative features of GitHub, it\'s never been easier for individuals and teams to write faster, better code.',
    link: {
      href: 'https://gh.io/gh-hacktoberfest',
      title: 'Visit GitHub'
    },
  }, {
    image: partnersGithubEducation.src,
    title: 'GitHub Education',
    content: 'At GitHub Education our mission is to empower learners and educators with tools and resources to accelerate learning and develop the next generation of software professionals. From individual student developers to large educational institutions, we offer tailored programs and services, including access to real-world tools, free learning resources, and opportunities to connect with a global community of developers. With GitHub Education, we\'re equipping a generation of future innovators to build the future.\n' +
    ' - [Join GitHub Global Campus!](https://education.github.com/)',
    link: {
      href: 'https://gh.io/hacktoberfest23',
      title: 'Visit GitHub Education'
    },
  }, {
    image: partnersGitlab.src,
    title: 'GitLab',
    content: 'GitLab is the most comprehensive AI-powered DevSecOps platform for software innovation. GitLab enables organizations to increase developer productivity, improve operational efficiency, reduce security and compliance risk, and accelerate digital transformation. More than 30 million registered users and more than 50% of the Fortune 100 trust GitLab to ship better, more secure software faster.\n' +
    ' - [Contribute to GitLab](https://go.gitlab.com/n5kZ02)\n' +
    ' - [Browse the GitLab project](https://go.gitlab.com/eXuRd0)',
    link: {
      href: 'https://go.gitlab.com/DEBE0y',
      title: 'Visit GitLab'
    },
  }, {
    image: partnersDev.src,
    title: 'DEV',
    content: 'DEV is an inclusive community of software developers sharing coding resources and advice. DEV is built on [Forem](https://forem.com/), an open source software we designed to empower communities.\n\n' +
    '[DEV Pro Tools](https://pro.forem.tools/?utm_source=hacktoberfest&utm_medium=hf&utm_campaign=hf2023) unlocks advanced functionality for DEV Organization pages. Organizations can get advanced analytics, exclusive advertising access, and adjustable CTAs on your articles. Access is currently for organizations, with plans to welcome individual accounts later in 2023.',
    link: {
      href: 'https://dev.to/?utm_source=hacktoberfest&utm_medium=hf&utm_campaign=hf2023',
      title: 'Visit DEV'
    },
  }, {
    image: partnersDagshub.src,
    title: 'DagsHub',
    content: '​​DagsHub is where people build machine learning projects. A centralized platform to host all ML project components such as code, data, models, experiments, annotations, and more with zero DevOps required. Built on top of popular open-source tools, DagsHub does the heavy lifting for you, so you can focus on creating better models.',
    link: {
      href: 'https://dagshub.com/lp/hacktoberfest-2023?utm_source=digital_ocean&utm_medium=website&utm_campaign=hacktoberfest_2023',
      title: 'Visit DagsHub'
    },
  }, {
    image: partnersHuggingFace.src,
    title: 'Hugging Face',
    content: 'Hugging Face is the ML community platform where people collaborate on sharing models, datasets, and ML apps. The community can find hundreds of thousands of models for all kinds of tasks, such as image and text generation, build their ML portfolios, and find open-source tools to train, share and deploy their own models.\n\n' +
    'Want to contribute to Hugging Face? Contributions to these repositories are always welcome:\n\n' +
    ' - [https://github.com/huggingface/transformers/](https://github.com/huggingface/transformers/)\n' +
    ' - [https://github.com/huggingface/datasets](https://github.com/huggingface/datasets)\n' +
    ' - [https://github.com/huggingface/diffusers](https://github.com/huggingface/diffusers)\n' +
    ' - [https://github.com/huggingface/peft](https://github.com/huggingface/peft)',
    link: {
      href: 'https://dagshub.com/lp/hacktoberfest-2023?utm_source=digital_ocean&utm_medium=website&utm_campaign=hacktoberfest_2023',
      title: 'Visit Hugging Face'
    },
  }, {
    image: '',
    title: 'Paperspace',
    content: 'Paperspace, a leading provider of cloud infrastructure for highly scalable GPU-accelerated applications, is [now part of DigitalOcean](https://www.digitalocean.com/blog/paperspace-joins-digitalocean). Paperspace brings a host of new compute potential to DigitalOcean’s offerings, which means you get even more reliability and a platform from which to access cloud GPU-powered machines for nearly any task. Get the power to train deep learning models, build next-gen applications, and run resource-intensive projects like Stable Diffusion or LLaMA—the future is at your fingertips with [Paperspace by DigitalOcean](http://paperspace.com/?utm_medium=referral&utm_source=hacktoberfest).',
    link: {
      href: 'https://www.paperspace.com/?utm_medium=referral&utm_source=hacktoberfest',
      title: 'Visit Paperspace'
    },
  }
]

export const sharing = {
  intro: 'Hacktoberfest Love',
  share: {
    title: 'Share your Hacktoberfest 🩷',
    content: 'Hacktoberfest is an open-source celebration that brings people together from all over the world to make a positive impact on open source. If you’ve had an experience that started with Hacktoberfest and led to something bigger, we would love to hear and share your story. We’ll pick some of the stories we receive to share with the community. Pictures, videos, and links are encouraged!\n\n' +
    'Share your Hacktoberfest story with us. We might feature you! [Story submissions](https://bit.ly/HF10-share-the-love).'
  },
  video: {
    title: 'Video',
    content: 'To share a photo or short video, simply fill out our [video submissions](https://bit.ly/hacktoberfest-10-video) form.',
  },
  social: {
    title: 'Social Media',
    content: 'Share your Hacktoberfest experience on social media! Use the official hashtag #hacktoberfest, #hacktoberfest10, or #hacktoberfest2023 and tell others about your favorite contributions, any swag you\'ve received in the past (share a pic!), or a particularly memorable hack.',
  },
  blog: {
    title: 'Blog Post',
    content: 'If you\'d like to write about your experience participating in Hacktoberfest, we encourage you to create a blog post. Our partners at DEV welcome your writings, here are some [great examples](https://dev.to/search?q=hacktoberfest). You can share how you first heard about Hacktoberfest, how being part of the community has impacted your personal or professional development, and your favorite or most useful hack. Creativity is welcome! Once your blog post is live, let us know by tagging us in your social media posts about it.',
  },
  cta: 'We look forward to hearing from you and seeing how you\'ve been part of the **Hacktoberfest community**!'
}