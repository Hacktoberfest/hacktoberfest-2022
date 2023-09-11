import eventKitZip from 'assets/event-kit.zip';

export const organize = {
  title: 'How to Organize a Hacktoberfest Event',
  sections: [
    {
      title: 'Craft an event agenda.',
      collapsible: true,
      collapsed: true,
      content: 'Here’s an example agenda to inspire your own:',
      items: [
        'Here’s an example agenda to inspire your own:\n\n' +
        '_Welcome._ Set a welcoming, open, and inclusive tone. Thank everyone for attending, tell them about yourself, give an overview of the programming, and remind them of the [Code of Conduct](https://do.co/hacktoberconduct).\n\n' +
        '_Network._ Get to know your attendees. Set aside 5-10 minutes to allow people to talk among themselves. You can also use [Gatheround](https://icebreaker.video/), which offers a fun and engaging way to get to know each other.\n\n' +
        '_Introduce Hacktoberfest._ Read the Hacktoberfest values.\n\n' +
        '_Introduce open source._ Check out this [intro to GitHub and Open-Source Projects](https://www.digitalocean.com/community/tutorial_series/an-introduction-to-open-source) for inspiration.\n\n' +
        '_Workshop._ Explain how to contribute to open source. These [resources](/participation#beginner-resources) can help.\n\n' +
        '_Demos._ Introduce 3- to 5-minute demos by anyone interested in sharing their open-source projects.\n\n' +
        '_Get hacking._ Facilitate the formation of groups by interest and hack together.\n\n' +
        '_Show and Tell._ Share 2-3 minute demos by anyone interested in sharing what they learned or worked on during hack time.',
      ],
    },
    {
      title: 'Set a date and time, and confirm the availability of your co-organizers, speakers, and facilitators.',
      collapsible: true,
      collapsed: true,
      items: [
        'We recommend events are completed in the first half of October to give participants time to complete 4 pull/merge requests.\n\n' +
        'To make your virtual accessible for global participants aim for between 9–11am US Eastern Time (UTC-05:00).',
      ],
    },
    {
      title: 'Promote the event however you like and directly invite your community to attend.',
      collapsible: true,
      collapsed: true,
      items: ['Invite anyone interested in learning about, or contributing to open source. Hacktoberfest events are a way of bringing members of the open source community even closer together in a group setting, and events should be open to all!'],
    }
  ],
};

export const organizeDisclaimer = {
  content: 'Go to [Major League Hacking](https://hackp.ac/hacktoberfest-organizehq) to set up your event and share it with the community.\n\n' +
    'To view all Hacktoberfest events, visit the Major League Hacking [Hacktoberfest Events page](https://hackp.ac/hacktoberfest-ohqlandingpage)\n\n' +
    'Facilitate the event, making sure to create an open, inclusive, and welcoming atmosphere.\n\n' +
    'Share special moments on social media using #hacktoberfest or #hacktoberfest2023 and tagging [@hacktoberfest](https://twitter.com/hacktoberfest). (**Remember to ask attendees for permission to use their photos**.)'
}

export const resources = {
  eyebrow: 'Host your event online or in person',
  title: 'Event Platforms & Resources',
  content: 'Hacktoberfest is primarily online, but we encourage people to run in-person events—just be sure to abide by local health and safety regulations.',
  sections: [
    {
      title: 'Host your event online or in person',
      content: 'Hacktoberfest is primarily online, but we encourage people to run in-person events—just be sure to abide by local health and safety regulations.'
    },
    {
      title: 'Event code of conduct',
      content: 'Hacktoberfest meetups are welcoming, open, and inclusive. Include this line on your meetup page: "Please read our [Events Code of Conduct](https://do.co/hacktoberconduct) before attending. Happy hacking!"',
    },
    {
      title: 'How to promote your event',
      collapsible: true,
      collapsed: true,
      content: '- Post your event on the Major League Hacking [Hacktoberfest Events page](https://hackp.ac/hacktoberfest-organizehq).\n' +
        '- Remind your attendees to RSVP\n' +
        '- Share the event via email, social networks, and events websites. Consider posting on channels that are popular with developers and open source enthusiasts in your area, such as Meetup, Eventbrite, Twitter, etc..\n' +
        '- Tag [@hacktoberfest](https://twitter.com/hacktoberfest), #hacktoberfest, #hacktoberfest2023, #hacktoberfest10\n' +
        '- Use these example posts for inspiration:\n' +
        '  - "Happy about Hacktoberfest? So are we! Register to hack with us on [DATE]!"\n' +
        '  - "Don’t hack alone. Join us on [DATE] to meet a few community members and get help on your pull requests!"\n' +
        '  - "I just donated to the open-source community, it’s your turn!"\n' +
        '  - "Learning how to code or just interested in open source? Sign up to share your skills!"',
    },
    {
      title: 'Logos and branding',
      content: 'Logos, banners, and more! We kindly ask that you adopt [Hacktoberfest brand guidelines](/events/#brand) as you share your meetup/content.',
      links: [
        {
          id: 'download-assets-link',
          href: eventKitZip,
          children: 'Download Assets',
        }
      ]
    },
  ],
};
