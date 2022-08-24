import fetch from 'node-fetch';
import * as nextLog from 'next/dist/build/output/log';

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
        const date = new Date(event['Date']);
        if (Number.isNaN(date.getTime())) return {};

        return {
            type: event['Event Type'],
            title: event['Event'],
            location: event['Organizer\'s Location'], // TODO: Do we want to show location? Should this just be the RSVP link?
            date: `${date.getUTCMonth() + 1}/${date.getUTCDate()}`,
            time: `${(date.getUTCHours() % 12).toString().padStart(2, '0')}:${date.getUTCMinutes().toString().padStart(2, '0')} ${date.getUTCHours() >= 12 ? 'PM' : 'AM'} ${event['Timezone']}`,
            format: event['Event Format'],
        };
    }).filter(event => event.type?.length && event.title && event.location && event.date && event.time && event.format?.length)
};

// TODO: Integrate with Airtable API
export const fetchSpeakers = async () => [
    {
        name: 'Chris Sevilla',
        pronouns: 'he/him',
        location: 'Las Vegas, NV, USA',
        company: 'DigitalOcean',
        social: '@Chris__Sev',
    },
    {
        name: 'Rizel Scarlett',
        pronouns: 'she/her',
        location: 'Boston, MA, USA',
        company: 'GitHub',
        social: '@BlackGirlBytes',
    },
    {
        name: 'Chris Sevilla',
        pronouns: 'he/him',
        location: 'Las Vegas, NV, USA',
        company: 'DigitalOcean',
        social: '@Chris__Sev',
    },
];
