import brandKitZip from 'assets/brand-kit.zip';
import brandGuidelines from 'assets/brand-guidelines.pdf';

export const globalEvents = {
  title: 'Global Events',
  content:
    'Hacktoberfest events are happening all month long so you can join your friends day or night, from dusk to dawn, as you work to complete your pull/merge requests. Whether you want to join an existing event or run your own, and whether you’re inclined to do so in-person or virtually, we’re here to support you!',
  cta: {
    href: 'https://hackp.ac/hacktoberfest-ohqlandingpage',
    children: 'View All Events',
  },
};

export const eventOrganizers = {
  title: 'Event Organizers',
  content:
    'If you’re looking to host a community event as part of Hacktoberfest, here are all the resources you need to plan and host it. Hacktoberfest is primarily online, but we encourage people to run both virtual and in-person events (be sure to abide by local health and safety regulations). Here are a collection of tips and tricks that will help you keep participants engaged. Make sure to let the community know that you’re running an event by registering it with Hacktoberfest and MLH using the form below.',
};

export const organize = {
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
      title: 'Have a code of conduct.',
      collapsible: true,
      collapsed: true,
      items: [
        'Hacktoberfest meetups are welcoming, open, and inclusive. Include this line on your meetup page: "Please read our [Events Code of Conduct](https://do.co/hacktoberconduct) before attending. Happy hacking!"',
      ],
    },
    {
      title: "Set a date + time and confirm folks' availability.",
      collapsible: true,
      collapsed: true,
      items: [
        '- Make sure that your co-organizers and any speakers or facilitators are available on the date and time you pick.\n\n' +
          '- We recommend events be hosted in the first half of October to give participants time to complete 4 pull/merge requests.\n\n' +
          '- To make your virtual accessible for global participants aim for between 9–11am US Eastern Time (UTC-05:00).',
      ],
    },
    {
      title: 'Register your event with Hacktoberfest and MLH.',
      collapsible: true,
      collapsed: true,
      items: [
        '- Use the form on this page to [register your event](#register) with the Hacktoberfest team. Once you’ve submitted the form, we’ll pass this information on to MLH so your event is listed alongside all the others run by the community.\n\n' +
          '- You can then share the MLH listing for your event with your community so that they can RSVP for the event.\n\n' +
          '- Registering your event also grants you permission to use the Hacktoberfest brand (following the [brand guidelines](#brand)) when promoting your event.',
      ],
    },
    {
      title: 'Promote the event and invite your community to attend.',
      collapsible: true,
      collapsed: true,
      items: [
        'Invite anyone interested in learning about, or contributing to open source. Hacktoberfest events are a way of bringing members of the open source community even closer together in a group setting, and events should be open to all!\n\n' +
          'Share your MLH event listing with your community, and don’t forget to remind your attendees to RSVP!\n\n' +
          'Share the event via email, social networks, and events websites. Consider posting on channels that are popular with developers and open source enthusiasts in your area, such as Twitter, Mastodon, Discord, etc. Tag [@hacktoberfest](https://twitter.com/hacktoberfest?lang=en), and use #hacktoberfest, on social networks.\n\n' +
          'Use these example posts for inspiration:\n\n' +
          '- "Happy about Hacktoberfest? So are we! Register to hack with us on [DATE]!\n\n' +
          '- "Don’t hack alone. Join us on [DATE] to meet a few community members and get help on your pull requests!"\n\n' +
          '- "Learning how to code or just interested in open source? Sign up to share your skills!"',
      ],
    },
  ],
};

export const organizeDisclaimer = {
  content:
    'Facilitate the event, making sure to create an open, inclusive, and welcoming atmosphere.\n\n' +
    'Share special moments on social media using #hacktoberfest and tagging [@hacktoberfest](https://twitter.com/hacktoberfest).\n\n(**Remember to ask attendees for permission to use their photos**.)',
};

export const register = {
  title: 'Register Your Event',
  content:
    'All community events that are part of Hacktoberfest should register themselves through this form. This lets us pass your event information on to Major League Hacking so they can list your event with all the other community events this year, and lets us know about your event so that we don’t come after you for using the Hacktoberfest brand.',
};

export const brand = {
  title: 'Brand Kit + Guidelines',
  content:
    'If you plan to use the Hacktoberfest brand in promotional material, for an event you’re hosting or for a project participating in Hacktoberfest, we ask that you use the Hacktoberfest branding provided in our brand kit, and that you make sure to follow our brand guidelines.',
  links: [
    {
      target: '_blank',
      rel: 'noreferrer noopener',
      href: brandKitZip,
      children: 'Download the Hacktoberfest Brand Kit',
    },
    {
      target: '_blank',
      rel: 'noreferrer noopener',
      href: brandGuidelines,
      children: 'View the Hacktoberfest Brand Guidelines',
    },
  ],
};
