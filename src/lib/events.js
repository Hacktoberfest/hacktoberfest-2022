import fetch from 'cross-fetch';
import * as nextLog from 'next/dist/build/output/log';

import eventKitZip from 'assets/event-kit.zip';
import virtualSwagZip from 'assets/virtual-swag.zip';

const fetchAirtableRecords = async (key, base, table, view, offset = null) => {
    const response = await fetch(`https://api.airtable.com/v0/${encodeURIComponent(base)}/${encodeURIComponent(table)}?view=${encodeURIComponent(view)}${offset ? `&offset=${encodeURIComponent(offset)}` : ''}`, {
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${key}`,
        },
    });
    if (!response.ok) throw new Error(`Airtable API error (${base}: ${table}: ${view}): ${response.status} ${response.statusText}`);

    const data = await response.json();
    return {
        items: data.records.map(({ fields }) => fields),
        more: data.offset,
    };
};

export const fetchEvents = async () => {
    const results = [];

    if (process?.env?.AIRTABLE_TOKEN) {
        let offset = null;
        while (true) {
            const response = await fetchAirtableRecords(process.env.AIRTABLE_TOKEN, 'appWlojsJacIo10yJ', 'Events', 'Events [All]', offset);
            results.push(...response.items);
            if (!response.more) break;
            offset = response.more;
        }
    } else {
        nextLog.warn('AIRTABLE_TOKEN not set, skipping Airtable events');
    }

    return results.map(event => {
        if (!event) return;
        if (event['Status'] !== 'Accepted') return; // Hide events that aren't approved

        const date = new Date(event['Date']);
        if (Number.isNaN(date.getTime())) return; // Hide events with invalid dates
        if (date.getTime() < Date.now()) return; // Hide events that have already happened

        if (!/^(https?:)?\/\//.test(event['Event RSVP'])) event['Event RSVP'] = `https://${event['Event RSVP']}`;

        return {
            type: event['Event Type'],
            title: event['Event'],
            location: event['Event Location'],
            date: `${date.getUTCMonth() + 1}/${date.getUTCDate()}`,
            time: `${(date.getUTCHours() % 12).toString().padStart(2, '0')}:${date.getUTCMinutes().toString().padStart(2, '0')} ${date.getUTCHours() >= 12 ? 'PM' : 'AM'} ${event['Time Zone']}`,
            timestamp: date.getTime(),
            format: event['Event Format'],
            rsvp: event['Event RSVP'],
        };
    })
      .filter(event => event?.type?.length
        && event?.title
        && event?.location
        && event?.date
        && event?.time
        && event?.format?.length
        && event?.rsvp)
      .sort((a, b) => a.timestamp - b.timestamp);
};

export const fetchSpeakers = async () => {
    const results = [];

    if (process?.env?.AIRTABLE_TOKEN) {
        let offset = null;
        while (true) {
            const response = await fetchAirtableRecords(process.env.AIRTABLE_TOKEN, 'appWlojsJacIo10yJ', 'Speakers & Facilitators', 'Speakers [All]', offset);
            results.push(...response.items);
            if (!response.more) break;
            offset = response.more;
        }
    } else {
        nextLog.warn('AIRTABLE_TOKEN not set, skipping Airtable speakers');
    }

    return results.map(speaker => {
        if (!speaker) return null;
        if (!speaker['Validated']) return null; // Hide speakers that aren't approved

        return {
            name: speaker['Name'],
            pronouns: speaker['Pronouns'],
            location: speaker['Speaker Location'],
            company: speaker['Company'] || 'N/A',
            social: speaker['Social'],
            specialization: speaker['Specialization'],
        };
    }).filter(speaker => speaker?.name && speaker?.pronouns && speaker?.location && speaker?.company && speaker?.social && speaker?.specialization);
};

export const organize = {
  title: 'How to Organize a Hacktoberfest Event',
  sections: [
    {
      title: 'Craft an event agenda.',
      collapsible: true,
      collapsed: true,
      content: 'Here’s an example agenda to inspire your own:',
      items: [
        '_Welcome._ Set a welcoming, open, and inclusive tone. Thank everyone for attending, tell them about yourself, give an overview of the programming, and remind them of the [Code of Conduct](https://do.co/hacktoberconduct).',
        '_Network._ Get to know your attendees. Set aside 5-10 minutes to allow people to talk among themselves. You can also use [Gatheround](https://icebreaker.video/), which offers a fun and engaging way to get to know each other.',
        '_Introduce Hacktoberfest._ Read the Hacktoberfest values.',
        '_Introduce open source._ Check out this [intro to GitHub and Open-Source Projects](https://www.digitalocean.com/community/tutorial_series/an-introduction-to-open-source) for inspiration.',
        '_Workshop._ Explain how to contribute to open source. These [resources](/participation#beginner-resources) can help.',
        '_Demos._ Introduce 3- to 5-minute demos by anyone interested in sharing their open-source projects.',
        '_Get hacking._ Facilitate the formation of groups by interest and hack together.',
        '_Show and Tell._ Share 2-3 minute demos by anyone interested in sharing what they learned or worked on during hack time.',
      ],
    },
    {
      title: 'Set a date and time, and confirm the availability of your co-organizers, speakers, and facilitators.',
      collapsible: true,
      collapsed: true,
      items: [
        'We recommend events are completed in the first half of October to give participants time to complete 4 pull requests.',
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
  content: 'Submit the [Hacktoberfest New Event Request form](http://bit.ly/hacktoberfest-22-events).\n\n' +
    'Facilitate the event, making sure to create an open, inclusive, and welcoming atmosphere.\n\n' +
    'Share special moments on social media using #hacktoberfest or #hacktoberfest2022 and tagging @digitalocean or [@hacktoberfest](https://twitter.com/hacktoberfest). (**Remember to ask attendees for permission to use their photos**.)'
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
      content: '- Submit an [official event request](http://bit.ly/hacktoberfest-22-events).\n' +
        '- Remind your attendees to RSVP on the Hacktoberfest [events](/events) page\n' +
        '- Share the event via email, social networks, and events websites. Consider posting on channels that are popular with developers and open source enthusiasts in your area, such as Meetup, Eventbrite, Twitter, etc..\n' +
        '- Tag @digitalocean, [@hacktoberfest](https://twitter.com/hacktoberfest), #hacktoberfest, #hacktoberfest2022\n' +
        '- Use these example posts for inspiration:\n' +
        '  - "Happy about Hacktoberfest? So are we! Register to hack with us on [DATE!]"\n' +
        '  - "Don’t hack alone. Join us on [DATE] to meet a few community members and get help on your pull requests!"\n' +
        '  - "I just donated to the open-source community, it’s your turn!"\n' +
        '  - "Learning how to code or just interested in open source? Sign up to share your skills!"',
    },
    {
      title: 'Logos and branding',
      content: 'Logos, banners, posters, and more! We kindly ask that you adopt [Hacktoberfest brand guidelines](#brand) as you share your meetup/content.',
      links: [
        {
          href: eventKitZip,
          children: 'Download Assets',
        }
      ]
    },
    {
      title: 'Virtual event swag',
      content: `Everyone loves swag! Check out the [DigitalOcean Swag Store](https://store.digitalocean.com/) and download this year’s [Virtual Event Swag](${virtualSwagZip}).`,
    },
  ],
};
