import { registrationStart } from './config';

export const events = [
  {
    title: `From Code to Community: Hacktoberfest ${new Date(registrationStart).getFullYear()} Begins!`,
    content:
      'The official kickoff of Hacktoberfest, hosted by DigitalOcean, where open-source advocates come together to celebrate a month of code, collaboration, and community. This session is packed with insightful talks and hands-on demonstrations, featuring expert speakers from various domains who will share their knowledge on the latest tech trends, AI advancements, and open-source contributions. Learn about the integration of AI with cloud technology and see how powerful tools like LLMs and GPUs are being utilized to enhance developer workflows and open-source projects.',
    location: 'Virtual',
    date: 'Oct 01',
    time: '10:00 AM Eastern Daylight Time',
  },
  {
    title: 'Hacktoberfest Bengaluru Meetup: A Day of Open Source Collaboration',
    content: `Join us for an exciting in-person meetup in Bengaluru as part of Hacktoberfest ${new Date(registrationStart).getFullYear()}, hosted by DigitalOcean! This event brings together developers, tech enthusiasts, and open-source advocates to connect, collaborate, and learn from one another in an interactive, hands-on sessions`,
    location: 'In Person',
    date: 'Oct 10',
    time: '11:30 AM India Standard Time',
  },
  {
    title: `Closing the Hack: Hacktoberfest ${new Date(registrationStart).getFullYear()} Finale and Highlights`,
    content: `Join us on October 31 for the Hacktoberfest ${new Date(registrationStart).getFullYear()} virtual wrap-up session, where we celebrate a month of coding, collaboration, and community. This finale event brings together speakers, participants, and contributors from around the globe to reflect on the achievements, share insights, and look forward to the future of open source.`,
    location: 'Virtual',
    date: 'Oct 31',
    time: '',
  },
];
