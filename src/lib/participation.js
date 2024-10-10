import {
  profileEnd,
  registrationEnd,
  registrationStart,
  trackingEnd,
  trackingEndExtended,
  trackingStart,
} from './config';

const registrationStartDate = new Date(registrationStart).toLocaleString(
  'en-US',
  { month: 'long', day: 'numeric', timeZone: 'UTC' },
);
const registrationEndDate = new Date(
  new Date(registrationEnd).setMinutes(-1),
).toLocaleString('en-US', {
  month: 'long',
  day: 'numeric',
  timeZone: 'Etc/GMT+12',
}); // TZ sign is flipped for some reason, offset by 1 minute as this is an exclusive end date
export const trackingStartDate = new Date(trackingStart).toLocaleString(
  'en-US',
  {
    month: 'long',
    day: 'numeric',
    timeZone: 'Etc/GMT-14',
  },
); // TZ sign is flipped for some reason
const trackingStartTime = new Date(trackingStart).toLocaleString('en-US', {
  month: 'long',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  timeZone: 'UTC',
  timeZoneName: 'short',
});
const trackingEndDate = new Date(
  new Date(trackingEnd).setMinutes(-1),
).toLocaleString('en-US', {
  month: 'long',
  day: 'numeric',
  timeZone: 'Etc/GMT+12',
}); // TZ sign is flipped for some reason, offset by 1 minute as this is an exclusive end date
const trackingEndExtendedMonth = new Date(trackingEndExtended).toLocaleString(
  'en-US',
  { month: 'long', timeZone: 'UTC' },
);
const profileEndDate = new Date(profileEnd).toLocaleString('en-US', {
  month: 'long',
  day: 'numeric',
  timeZone: 'UTC',
});
const year = new Date(registrationStart).getFullYear();

export const values = [
  {
    title: 'Everyone is welcome',
    content:
      "Participants in Hacktoberfest come from all over the world and represent thousands of unique skill sets. We welcome anyone who is interested in diving in, and everyone who's already part of the open-source software community.",
  },
  {
    title: 'Quantity is fun, quality is key',
    content:
      'Participating in Hacktoberfest leads to personal growth, professional opportunities, and community building. But it all begins with meaningful contributions to open-source software. We’re committed to prioritizing quality contributions as outlined in our participation rules.',
  },
  {
    title: 'Short-term action, long-term impact',
    content:
      'In the open-source community, we stand on the shoulders of project maintainers and those who came before us. Your participation has a lasting effect on people and technology long after October. Your participation helps build the future of the internet.',
  },
];

export const contributors = {
  title: 'Participating in Hacktoberfest',
  sections: [
    {
      content:
        'Here’s what you need to know to participate and complete Hacktoberfest:',
      items: [
        `Register anytime between **${registrationStartDate}** and **${registrationEndDate}**`,
        'Pull/merge requests can be made in any [GitHub](https://github.com/topics/hacktoberfest) or [GitLab](https://go.gitlab.com/ubCLKL) hosted project that’s participating in Hacktoberfest (look for the “hacktoberfest” topic)',
        `Aim to submit four high-quality pull/merge requests between ${trackingStartDate} and ${trackingEndDate}, with project maintainers accepting your pull/merge requests for them to count toward your total`,
        'You’ll unlock a digital badge when you register for Hacktoberfest, and level it up with each of your four pull/merge requests accepted during Hacktoberfest',
      ],
    },
    {
      content:
        'Join the [Hacktoberfest Discord server](https://discord.gg/hacktoberfest) to meet other participants and [share your Hacktoberfest love](/about#love) with a blog or post on socials.',
    },
  ],
};

export const resources = {
  title: 'Resources for Beginners',
  sections: [
    {
      title: 'Intro to open source',
      items: [
        '[Introduction to GitHub and Open-Source Projects](https://www.digitalocean.com/community/tutorial_series/an-introduction-to-open-source)',
        '[How to Contribute to Open Source](https://opensource.guide/how-to-contribute/)',
        '[What is Open Source](https://www.digitalocean.com/community/tutorials/what-is-open-source)',
        '[How to use Git](https://www.digitalocean.com/community/cheatsheets/how-to-use-git-a-reference-guide)',
      ],
    },
    {
      title: 'Start contributing',
      items: [
        '[GitHub] [Participating Hacktoberfest projects](https://github.com/topics/hacktoberfest)',
        '[GitLab] [Participating Hacktoberfest projects](https://go.gitlab.com/ubCLKL)',
        '[GitHub] [Explore projects with issues on up-for-grabs.net](https://up-for-grabs.net/)',
        '[GitHub] [Explore projects with issues on goodfirstissue.dev](https://goodfirstissue.dev/)',
        '[GitHub] [Explore Hacktoberfest projects on hacktoberfest-projects.vercel.app](https://hacktoberfest-projects.vercel.app)',
        '[GitHub] [Explore Hacktoberfest projects on ContribHub.com](https://contribhub.com)',
      ],
    },
    {
      title: 'Sharpen your skills',
      items: [
        '[GitHub] [GitHub Training Manual](https://github.github.com/training-kit/)',
        '[GitHub] [Understanding the GitHub Flow](https://guides.github.com/introduction/flow/)',
        '[GitLab] [Learn GitLab with tutorials](https://about.gitlab.com/get-started/)',
        '[General] [How open source contributions can boost your career](https://opensource.com/article/19/5/how-get-job-doing-open-source)',
        '[General] [How to write the perfect pull request](https://github.blog/2015-01-21-how-to-write-the-perfect-pull-request/)',
        '[General] [How to write a good commit message](https://dev.to/chrissiemhrk/git-commit-message-5e21)',
        '[General] [How to start a great OSS project](https://go.gitlab.com/Hm4BNB)',
        '[General] [5 things for your first time contributing](https://go.gitlab.com/nlPKcN)',
      ],
    },
  ],
};

export const prMrDetails = {
  title: 'Pull/Merge Request Details',
  content:
    'Here’s how we validate contributor pull/merge requests (“**PR/MRs**”) for Hacktoberfest',
  sections: [
    {
      title: 'Your PR/MRs must be within the bounds of Hacktoberfest.',
      subtitle: 'out-of-bounds',
      items: [
        {
          content:
            `Your PR/MRs must be created between **${trackingStartDate}** and **${trackingEndDate}** (in any time zone, UTC-12 thru UTC+14).\n\n` +
            'Your PR/MRs must be made to a public, unarchived repository.\n\n' +
            `Pull/merge requests created before ${trackingStartDate} but merged or marked as ready for review after **do not count**.`,
        },
      ],
    },
    {
      title:
        'Repos that go against Hacktoberfest’s values will be excluded from qualification and PR/MRs made to those repos won’t count.',
      subtitle: 'excluded',
      items: [
        {
          content:
            'Found a repository that goes against the values of Hacktoberfest? [Let us know and we’ll take a look.](/report)',
        },
      ],
    },
    {
      title: 'Your PR/MRs must not be spammy.',
      subtitle: 'spam',
      items: [
        {
          content:
            'PR/MRs that are labeled with a label containing the word “**spam**” by maintainers will not be counted.\n\n' +
            ' - We use the Node.js RegEx engine with **`/\\bspam\\b/i`** to look for spam labels.\n' +
            ' - PR/MRs that also have the “hacktoberfest-accepted” label cannot be marked as spammy via a label.\n' +
            ' - PR/MRs that have been merged and do not have a label containing the word “invalid” cannot be marked as spammy via a label.\n\n' +
            '&nbsp;\n\n' +
            'PR/MRs that our system detects as spammy will also not be counted.\n\n' +
            'Any user with two or more spammy PR/MRs will be disqualified.',
        },
      ],
    },
    {
      title:
        'Your PR/MRs must be in a repo tagged with the “hacktoberfest” topic, or have the “hacktoberfest-accepted” label.',
      subtitle: 'participating',
      items: [
        {
          content:
            'Hacktoberfest is now opt-in for maintainers, so only contribute to projects that indicate they’re looking for Hacktoberfest PR/MRs.\n\n' +
            'Once your PR/MR has passed this check, we won’t check this again (unless your PR/MR fails a check before this, such as it being marked as spammy).\n\n' +
            `Your PR/MR must match criteria to be considered participating before Hacktoberfest ends on **${trackingEndDate}** (in any time zone, UTC-12 thru UTC+14) to be counted.`,
        },
      ],
    },
    {
      title: 'Your PR/MRs must not be labeled as “invalid”.',
      subtitle: 'invalid',
      items: [
        {
          content:
            'PR/MRs that have a label containing the word “invalid” won’t be counted, unless they also have the “hacktoberfest-accepted” label.\n\n' +
            'Specifically, we use the Node.js RegEx engine with **`/\\binvalid\\b/i`** to look for invalid labels.',
        },
      ],
    },
    {
      title:
        'Your PR/MRs must be merged, have the “hacktoberfest-accepted” label, or have an overall approving review.',
      subtitle: 'accepted',
      items: [
        {
          content:
            'Your PR/MR must not be a draft to be considered accepted.\n\n' +
            'If your PR/MR is being accepted for Hacktoberfest via an overall approving review it must also not be closed.\n\n' +
            `Your PR/MR must be accepted by a maintainer before Hacktoberfest ends on **${trackingEndDate}** (in any time zone, UTC-12 thru UTC+14) to be counted.`,
        },
      ],
    },
    {
      title:
        'Once your PR/MRs pass all the checks above, it will be accepted for Hacktoberfest after the seven day review period.',
      items: [
        {
          content:
            'We continually evaluate all of the checks until your PR/MR completes the seven-day review period, except the **[participating]** check which is a one-time check. If it fails any of these checks during this time, the seven day timer will reset.\n\n' +
            'After the seven day review period completes, your PR/MR will be automatically accepted for Hacktoberfest assuming it still passes all the checks. **Once accepted for Hacktoberfest, we stop checking. :party:**\n\n' +
            `PR/MRs that are passing all checks and are still in the review period on ${trackingEndDate} can continue the seven-day review period into ${trackingEndExtendedMonth}.`,
        },
      ],
    },
  ],
};

export const spam = {
  title: 'Measures to Reduce Spam',
  content:
    'To ensure quality contributions to Hacktoberfest, we empower maintainers to label pull/merge requests as “spam” at their own discretion, all pull/merge requests you submit must be approved by the project maintainer, and repos that try to game the system will be excluded from Hacktoberfest.',
  sections: [
    {
      title: 'Spammy pull/merge requests will be labeled as “spam.”',
      items: [
        {
          content:
            'Maintainers: label spammy requests “spam” and close them. PR/MRs labeled “spam” won’t count toward Hacktoberfest. Contributors with 2+ spammy PR/MRs are disqualified.',
        },
      ],
    },
    {
      title: 'Pull/merge requests must be approved by a maintainer.',
      items: [
        {
          content:
            'Maintainers accept PR/MRs by merging them, labeling them “hacktoberfest-accepted,” or giving them an overall approving review. Accepted PR/MRs enter a seven day review window, during which approval can be revoked by the maintainer or by our team.',
        },
      ],
    },
    {
      title: 'Bad repositories will be excluded.',
      items: [
        {
          content:
            'PR/MRs should be useful to maintainers and be meaningful contributions to open-source software. Repositories that are created specifically for Hacktoberfest that do not benefit the wider open-source community, or repositories that encourage overly simplistic and inconsequential contributions such as adding a name or profile to a list or adding random content to a repo such as algorithms, will be excluded from Hacktoberfest. Remember: quantity is fun, quality is key.\n\n' +
            'Found a repository that you think doesn’t follow our values? [Report it to us and we’ll take a look](/report).',
        },
      ],
    },
    {
      title: 'Avoid submitting low-quality pull/merge requests.',
      items: [
        {
          content:
            'Hacktoberfest is about contributing meaningfully to open-source projects. Here are some examples of low-quality pull/merge requests that won’t count towards Hacktoberfest.\n\n' +
            ' - Automated pull/merge requests: scripted opening pull requests to remove whitespace, fix typos or optimize images.\n' +
            " - Disruptive pull/merge requests: taking someone else's branch/commits and making a pull request.\n" +
            ' - Anything that a project maintainer flags as spam.\n' +
            ' - Anything that looks like an attempt to duplicate your pull request count for October.\n' +
            ' - Multiple pull/merge requests for the same issue that are unnecessary, for example four PR/MRs to remove a stray whitespace.',
        },
      ],
    },
  ],
};

export const maintainers = {
  title: 'Maintainers',
  content:
    'Prepare your project for contributions by following these best practices:',
  sections: [
    {
      items: [
        'Add the “**hacktoberfest**” topic to your repository to **opt-in to Hacktoberfest** and indicate you’re looking for contributions.',
        'Apply the “**hacktoberfest**” label to issues you want contributors to help with in your GitHub or GitLab project.',
        'Add a **CONTRIBUTING.md** file with contribution guidelines to your repository.',
        'Choose issues that have a well-defined scope and are self-contained.',
        'Adopt a code of conduct to create a greater sense of inclusion and community for contributors.',
        'Be ready to review pull/merge requests, accepting those that are valid by merging them, leaving an overall approving review, or by adding the “**hacktoberfest-accepted**” label.',
        'Reject any spammy requests you receive by labeling them as “**spam,**” and any other invalid contributions by closing them or labeling them as “**invalid.**”',
      ],
    },
  ],
};

export const lowNoCode = {
  title: 'Low or Non Code Contributions',
  content:
    "At its core, Hacktoberfest aims to encourage more people to participate in open source and collaborate to enhance the software driving our world today. Open source projects can benefit greatly from community contributions, and there are a multitude of ways to get involved that don't involve coding skills. Whether you possess technical expertise or not, you can leverage your professional skills to support open-source projects. In line with last year's effort, we're committed to promoting contributions that don't require technical knowledge. Visit GitHub’s [The ReadMe Project](https://github.com/readme/featured/open-source-non-code-contributions) to learn more",
  sections: [
    {
      title: 'Low or Non Code Contributions',
      content:
        '[Low-code and non-code contributions](https://opensource.com/article/22/8/non-code-contribution-powers-open-source) are an excellent way to get involved in supporting open source. Here are some examples of ways you can contribute to open-source projects:',
      lists: [
        'Technical documentation',
        'User experience testing',
        'Technical blog post or tutorial',
        'Case studies',
      ],
    },
    {
      title: 'Non-Code Contributions:',
      lists: [
        'Writing',
        'Translating',
        'Copy editing',
        'Talks or presentations',
        'Event organization',
        'Podcasts',
        'Social media',
        'Blog posts',
        'Video production',
        'Graphic design',
      ],
    },
  ],
};

export const note = {
  sections: [
    {
      content:
        "**Note:** If you're submitting low- or non-code content to projects, make sure to create a PR/MR to track your contribution.",
    },
    {
      content:
        'Although Hacktoberfest tracks all PR/MRs submitted for the event, maintainers may need to facilitate tracking of those contributions through an activity log or similar.\n' +
        '\n' +
        '**For Maintainers:** [How to attract low or non-code contributions](https://www.youtube.com/live/Z7ppp_DrxyM?feature=share).',
    },
  ],
};

export const faqs = {
  title: 'FAQs',
  content: null,
  sections: [
    {
      title: 'Do I get a reward for participating?',
      subtitle: 'Rewards',
      collapsible: true,
      collapsed: true,
      items: [
        {
          content:
            'Aside from the knowledge you’ll gain, (and the fun you’ll have) you’ll get a digital badge through Holopin to represent your participation in Hacktoberfest. As each of your four pull/merge requests is accepted by a maintainer, you’ll unlock a new level in your badge, letting you customize it and showing to the community your achievement.',
        },
      ],
    },
    {
      title: 'How will I receive my digital badge?',
      subtitle: 'Rewards',
      collapsible: true,
      collapsed: true,
      items: [
        {
          content:
            'You will receive a notification in your Hacktoberfest profile on the Hacktoberfest website. Additionally, you will receive an email from Holopin to claim each level of your badge.',
        },
      ],
    },
    {
      title: 'When do I need to claim my badges by?',
      subtitle: 'Rewards',
      collapsible: true,
      collapsed: true,
      items: [
        {
          content: `Hacktoberfest profiles close on ${profileEndDate}. Please make sure you’ve claimed all your Holopin badges using the claim links on your profile (also sent via email).`,
        },
      ],
    },
    {
      title: 'Why isn’t there a t-shirt this year?',
      subtitle: 'Rewards',
      collapsible: true,
      collapsed: true,
      items: [
        {
          content:
            "As Hacktoberfest has grown, so have the logistical challenges associated with creating a reward. Unfortunately, it's no longer feasible for us to provide a free t-shirt. Nevertheless, we still want participants to have a memorable experience and receive a special memento marking their participation and the year.  Instead of a t-shirt reward, we're partnering with Holopin to provide a digital badge to each participant, making global delivery much simpler. We believe this shift will allow Hacktoberfest to continue supporting and raising awareness for open-source projects worldwide for years to come.",
        },
      ],
    },
    {
      title:
        'I signed up for Hacktoberfest mid-October. Will pull/merge requests that I created earlier in October count?',
      subtitle: 'Rules',
      collapsible: true,
      collapsed: true,
      items: [
        {
          content: `Yes, all pull/merge requests created between ${trackingStartDate} and ${trackingEndDate} will count, regardless of when you register for Hacktoberfest.`,
        },
      ],
    },
    {
      title: 'Do pull/merge requests made on my own repositories count?',
      subtitle: 'Rules',
      collapsible: true,
      collapsed: true,
      items: [
        {
          content:
            'Yes, but we strongly encourage you to make quality contributions to other repositories.',
        },
      ],
    },
    {
      title: 'Do multiple pull/merge requests to the same repository count?',
      subtitle: 'Rules',
      collapsible: true,
      collapsed: true,
      items: [
        {
          content: 'Yes, each pull/merge request will count separately.',
        },
      ],
    },
    {
      title: 'Do issues/commits count?',
      subtitle: 'Rules',
      collapsible: true,
      collapsed: true,
      items: [
        {
          content: 'No, only pull/merge requests count.',
        },
      ],
    },
    {
      title: 'Do issues have to be tagged as Hacktoberfest to count?',
      subtitle: 'Rules',
      collapsible: true,
      collapsed: true,
      items: [
        {
          content:
            'No, pull/merge requests for Hacktoberfest do not need to be attached to a [**hacktoberfest** issue](https://github.com/search?l=&o=desc&q=label%3Ahacktoberfest+state%3Aopen&s=updated&type=Issues).',
        },
      ],
    },
    {
      title: 'Do contributions made outside of GitHub or GitLab count?',
      subtitle: 'Rules',
      collapsible: true,
      collapsed: true,
      items: [
        {
          content:
            'Pull/merge requests must be made on either the GitHub or GitLab platform.',
        },
      ],
    },
    {
      title:
        'What should I do if I contribute to a repository that is not participating in Hacktoberfest?',
      subtitle: 'Rules',
      collapsible: true,
      collapsed: true,
      items: [
        {
          content:
            "You can politely request that the maintainer of the project you contributed to tag your contribution with the label **hacktoberfest-accepted** . Or, add the 'hacktoberfest' topic to the repository to opt the project into Hacktoberfest.\n\n" +
            'Any pull/merge request with the **hacktoberfest-accepted** label, submitted to any public GitHub/GitLab repository, with or without the hacktoberfest topic, will be considered valid for Hacktoberfest.',
        },
      ],
    },
    {
      title: 'How can I host a Hacktoberfest event?',
      subtitle: 'Events',
      collapsible: true,
      collapsed: true,
      items: [
        {
          content:
            'Please visit the [Hacktoberfest Events](/events/) page to learn how to host and register a Hacktoberfest event.',
        },
      ],
    },
    {
      title: 'Can you help me promote my Hacktoberfest event?',
      subtitle: 'Events',
      collapsible: true,
      collapsed: true,
      items: [
        {
          content:
            'Yes! We’ll use the information you provide when registering your event on the [Hacktoberfest Events](/events) page to publish your event to Major League Hacking for anyone to attend.',
        },
      ],
    },
    {
      title: 'Why organize a Hacktoberfest-themed event?',
      subtitle: 'Events',
      collapsible: true,
      collapsed: true,
      items: [
        {
          content:
            'Events are a great way to increase awareness of open source in your community, giving community members an opportunity to meet maintainers, contributors, and each other.\n\n' +
            'Events provide opportunities to learn about the open-source ecosystem—from how to start an open-source project to marketing your project, sustaining growth, and troubleshooting and maintenance.',
        },
      ],
    },
    {
      title: 'Who can organize a Hacktoberfest-themed event?',
      subtitle: 'Events',
      collapsible: true,
      collapsed: true,
      items: [
        {
          content:
            'Anyone can organize an event as long as you celebrate open source during the event. Find out more about how to host and register your event on the [Hacktoberfest Events](/events/) page.',
        },
      ],
    },
    {
      title: 'How can I keep my event engaging?',
      subtitle: 'Events',
      collapsible: true,
      collapsed: true,
      items: [
        {
          content:
            "Whether you're meeting virtually or in person, meetups can be challenging to facilitate, but they can still be fun! Using networking tools like [Icebreaker](https://icebreaker.video/) or [Kahoot](https://kahoot.com/) for a trivia game and asking fun opener questions (such as two truths and a lie) can loosen up the crowd and get attendees ready to share their open-source knowledge.",
        },
      ],
    },
    {
      title: 'Can I host an in-person event?',
      subtitle: 'Events',
      collapsible: true,
      collapsed: true,
      items: [
        {
          content:
            'Yes! We encourage all kinds of events - whether they are virtual, in-person or a hybrid.\n\n' +
            'If you do want to hold an in-person event, there are a few things to note:\n\n' +
            ' - We will not be providing swag or event kits for in-person events held this year. Do, however, check out our [Brand Kit](/events/#brand) which includes some virtual swag such as mobile or desktop wallpapers and a Git Cheat Sheet.\n\n' +
            ' - Please follow the advisory guidelines of your state and local governments about gatherings in person.',
        },
      ],
    },
    {
      title: "My event hasn't been approved yet. How long until it goes live?",
      subtitle: 'Events',
      collapsible: true,
      collapsed: true,
      items: [
        {
          content:
            'Once you have submitted an event, the Major League Hacking events team will review your listing within 1-2 business days. If any changes need to be made, you will be alerted and the review process will start over. Please note: if you submit your event within two days of the event start and that coincides with a weekend, we cannot guarantee that the event will be approved in time.',
        },
      ],
    },
    {
      title:
        'Why aren’t my draft pull/merge requests counting toward Hacktoberfest?',
      subtitle: 'Troubleshooting',
      collapsible: true,
      collapsed: true,
      items: [
        {
          content:
            'For Hacktoberfest, pull/merge requests on GitHub/GitLab will not be counted until they are marked as **ready for review**:  Those marked as **draft** will not be counted.\n\n' +
            'Please make sure to mark any draft pull requests as **ready for review** so that project maintainers can merge them.',
        },
      ],
    },
    {
      title:
        'Why is my accepted pull/merge request showing as in review on my profile?',
      subtitle: 'Troubleshooting',
      collapsible: true,
      collapsed: true,
      items: [
        {
          content:
            'In an effort to reduce spam and help maintainers, all pull/merge requests go through a week-long approval period for Hacktoberfest. This provides a buffer window for maintainers where they can change their decision on a pull/merge request that they may have accepted, and gives our team time to review and tackle spam across the whole program. No action should be required by you, your pull/merge request will automatically count toward your Hacktoberfest progress once the seven days elapse, as long as it is still accepted by the project maintainers and follows Hacktoberfest’s rules.',
        },
      ],
    },
    {
      title:
        'My PR/MR was labeled as invalid/spam, but it isn’t. What should I do?',
      subtitle: 'Troubleshooting',
      collapsible: true,
      collapsed: true,
      items: [
        {
          content:
            'If a maintainer labels your pull/merge request as **invalid** or **spam**, but you don’t believe this is correct, please begin a conversation with the maintainer of the PR and respectfully explain your position. Understand that it is ultimately up to the maintainer whether or not they think your PR/MR is legitimate, and you should respect their decision after discussing it with them.',
        },
      ],
    },
    {
      title:
        'If I made 4 pull/merge requests before October but they were merged during October, will they count towards my goal?',
      subtitle: 'Troubleshooting',
      collapsible: true,
      collapsed: true,
      items: [
        {
          content: `No. All pull/merge requests made before the start of Hacktoberfest, ${trackingStartTime}, will not count.`,
        },
      ],
    },
    {
      title:
        'What happens if I make a pull request before the maintainer adds a hacktoberfest topic to the repository?',
      subtitle: 'Troubleshooting',
      collapsible: true,
      collapsed: true,
      items: [
        {
          content:
            'We continually check the validity of your pull/merge requests, so as soon as a maintainer opts-in the project, we’ll see this has happened and start processing your pull/merge request fully. Once we’ve seen that your PR/MR is in an opted-in project, we won’t check this again, so don’t worry if a maintainer later removes the topic again, your PR/MR will still count.',
        },
      ],
    },
    {
      title:
        'Why hasn’t my PR/MR appeared on my profile, or updated into the correct state?',
      subtitle: 'Troubleshooting',
      collapsible: true,
      collapsed: true,
      items: [
        {
          content:
            'Hacktoberfest refreshes user profiles automatically in the background every six hours, fetching the latest data for all your pull/merge requests and processing them to ensure they’re in the correct state, before then processing your account itself to ensure you’re in the correct state and have the correct rewards.\n\n' +
            'When you load your Hacktoberfest profile, we’ll also attempt to refresh your profile in the background, at a maximum rate of once every 15 minutes. Once you’ve loaded your profile to trigger this background processing, you may need to reload your profile again after a few minutes to see the updated data.\n\n' +
            'If you make changes to a PR/MR that will affect its standing for Hacktoberfest in the final six hours of the event, you will need to load your profile and ensure the changes are reflected there, as there will be no further automatic background jobs to catch the changes.',
        },
      ],
    },
    {
      title:
        'Why aren’t my contributions in an SSO-protected organization updating?',
      subtitle: 'Troubleshooting',
      collapsible: true,
      collapsed: true,
      items: [
        {
          content:
            'Due to limitations in how GitHub handles SSO-protected organizations, even if a repository is public, accessing it requires a valid SSO session if you are a member of the organization. This same restriction extends to OAuth applications, such as Hacktoberfest, so we cannot automatically fetch SSO-protected contributions for you if you do not have an active SSO session.\n\n' +
            'To ensure that your contributions to public repositories in an SSO-protected organization that you are a member of are tracked for Hacktoberfest, first ensure that you are signed into GitHub and have an active SSO session for the organization, such that you can access the PR/MR yourself. With the active SSO session in GitHub, load your Hacktoberfest profile to trigger a background refresh of your profile, which should allow us (via our OAuth app) to fetch the latest data for the PR/MRs.',
        },
      ],
    },
    {
      title: 'As a maintainer, how do I encourage contributions to my repos?',
      subtitle: 'Maintainers',
      collapsible: true,
      collapsed: true,
      items: [
        {
          content:
            'First, classify your repository with the **hacktoberfest** topic. This will let participants know that your repo is participating in Hacktoberfest. Check out this video on [how to apply the **hacktoberfest** topic to your repository](https://www.youtube.com/watch?v=znPdP0o79mU).\n\n' +
            'You can also create issues for anything you’d like contributors to help with, and you can add labels like **good first issue** and **help wanted** so they’re easier to discover.',
        },
      ],
    },
    {
      title: 'As a maintainer, how should I handle spam pull/merge requests?',
      subtitle: 'Maintainers',
      collapsible: true,
      collapsed: true,
      items: [
        {
          content:
            'We dislike seeing spam pull/merge requests just as much as you, so please give them a **spam** label and close them. Pull/merge requests that have a label containing the word **spam** won’t be counted toward Hacktoberfest, and participants with two or more PR/MRs identified as spam will be disqualified.',
        },
      ],
    },
    {
      title:
        'As a maintainer, do I earn a digital reward for participating in Hacktoberfest?',
      subtitle: 'Maintainers',
      collapsible: true,
      collapsed: true,
      items: [
        {
          content:
            'Whether you are a maintainer, contributor or event organizer, you are eligible to unlock the digital badges as your four pull/merge requests are accepted. Unfortunately, we won’t be rewarding maintainers for completing maintainer actions such as reviewing pull/merge requests this year, only for submitted accepted PR/MRs.',
        },
      ],
    },
    {
      title: 'How can I exclude my repository from Hacktoberfest?',
      subtitle: 'Maintainers',
      collapsible: true,
      collapsed: true,
      items: [
        {
          content:
            'Hacktoberfest is an opt-in system for maintainers. Repositories must have the **hacktoberfest** topic to opt-in and have PR/MRs be counted, or individual PR/MRs can be labeled with the **hacktoberfest-accepted** label. Any repository without the **hacktoberfest** topic, and not using the label, is automatically excluded, no action required.',
        },
      ],
    },
  ],
};
