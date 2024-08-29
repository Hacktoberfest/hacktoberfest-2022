import { registrationStart } from './config';

export const events = [
  {
    title: `From Code to Community: Hacktoberfest ${new Date(registrationStart).getFullYear()} Begins!`,
    content:
      'Join us for the first virtual event of Hacktoberfest, hosted by DigitalOcean, where developers, tech enthusiasts, open-source advocates, and AI innovators come together to celebrate a month of code, collaboration, and community. This session is packed with insightful talks and hands-on demonstrations, featuring expert speakers from various domains who will share their knowledge on the latest tech trends, AI advancements, and open-source contributions. Learn about the integration of AI with cloud technology and see how powerful tools like LLMs and GPUs are being utilized to enhance developer workflows and open-source projects.',
    location: 'Virtual',
    date: 'Oct 01',
    time: '10:00 AM Eastern Daylight Time',
    rsvp: {
      href: 'https://events.mlh.io/events/10248-official-digitalocean-hacktoberfest-10th-anniversary-kickoff?_gl=1*xu0rqo*_ga*MTAwMjM2NzI0MS4xNjg5MDEwNDQ3*_ga_E5KT6TC4TK*MTY5NTIzMDIwNy41Mi4xLjE2OTUyMzAyMTQuMC4wLjA.',
    },
  },
  {
    title: 'Hacktoberfest Bengaluru Meetup: A Day of Open Source Collaboration',
    content: `Join us for an exciting in-person meetup in Bengaluru as part of Hacktoberfest ${new Date(registrationStart).getFullYear()}, hosted by DigitalOcean! This event brings together developers, tech enthusiasts, and open-source advocates to connect, collaborate, and learn from one another in an interactive, hands-on sessions`,
    location: 'Virtual',
    date: 'Oct 10',
    time: '11:30 PM Eastern Daylight Time',
    rsvp: {
      href: 'https://events.mlh.io/events/10246-official-digitalocean-satellite-session-1-what-s-new-in-open-source-developer-tools?_gl=1*oaeziy*_ga*MTAwMjM2NzI0MS4xNjg5MDEwNDQ3*_ga_E5KT6TC4TK*MTY5NTIzMDIwNy41Mi4xLjE2OTUyMzA0MTkuMC4wLjA.',
    },
  },
  {
    title: `Closing the Hack: Hacktoberfest ${new Date(registrationStart).getFullYear()} Finale and Highlights`,
    content: `Join us on October 31st for the Hacktoberfest ${new Date(registrationStart).getFullYear()} virtual wrap-up session, where we celebrate a month of coding, collaboration, and community. This finale event brings together speakers, participants, and contributors from around the globe to reflect on the achievements, share insights, and look forward to the future of open source.`,
    location: 'Virtual',
    date: 'Oct 31',
    time: '',
    rsvp: {
      href: 'https://ghw.mlh.io/events/open-source',
      text: 'Register',
    },
  },
];
