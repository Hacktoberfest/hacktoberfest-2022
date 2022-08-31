export const values = {
  title: 'Values',
  sections: [
    {
      title: 'Everyone is welcome',
      content: 'Participants in Hacktoberfest come from all over the world and represent thousands of unique skill sets. We welcome everyone who\'s already part of the open-source software community, and anyone who is interested in diving in.',
    },
    {
      title: 'Quantity is fun, quality is key',
      content: 'Participating in Hacktoberfest leads to personal growth, professional opportunities, and community building. But it all begins with meaningful contributions to open-source software. We’re committed to prioritizing quality contributions as outlined in our participation rules.',
    },
    {
      title: 'Short-term action, long-term impact',
      content: 'In the open-source community, we stand on the shoulders of project maintainers and those who came before us. Your participation has a lasting effect on people and technology long after October. Your participation helps build the future of the internet.',
    },
  ],
};

export const contributors = {
  title: 'Contributors',
  sections: [
    {
      title: 'Here’s what you need to know to join Hacktoberfest:',
      items: [
        'Register anytime between September 26 and October 31',
        'Pull requests can be made in any [GitHub](https://github.com/topics/hacktoberfest) or [GitLab](https://gitlab.com/explore/projects/topics/hacktoberfest) hosted project that’s participating in Hacktoberfest (look for the “hacktoberfest” topic)',
        'Project maintainers must accept your pull/merge requests for them to count toward your total',
        'Have 4 pull/merge requests accepted between October 1 and October 31 to complete Hacktoberfest',
        'The first 50,000 participants who complete Hacktoberfest can elect to receive one of two prizes: a tree planted in their name, or the Hacktoberfest 2022 t-shirt.',
      ],
    },
  ],
};

export const resources = {
  title: 'Resources for Beginners',
  sections: [
    {
      title: 'Intro to open source',
      items: [
        'DigitalOcean: [Introduction to GitHub and Open-Source Projects](https://www.digitalocean.com/community/tutorial_series/an-introduction-to-open-source)',
        'GitHub: [How to Contribute to Open Source](https://opensource.guide/how-to-contribute/)',
      ],
    },
    {
      title: 'Start contributing',
      items: [
        'List of beginner repositories: [up-for-grabs.net](https://up-for-grabs.net/#/)',
        'GitHub repository: [first-contributions](https://github.com/firstcontributions/first-contributions)',
        'GitHub repository: [awesome-for-beginners](https://github.com/mungell/awesome-for-beginners)',
      ],
    },
    {
      title: 'Sharpen your skills',
      items: [
        '[GitHub Training Kit](https://github.github.com/training-kit/)',
        '[Understanding the GitHub Flow](https://guides.github.com/introduction/flow/)',
        '[Getting Started With GitLab](https://about.gitlab.com/get-started/)',
        '[An Introduction to Open Source](https://www.digitalocean.com/community/tutorial_series/an-introduction-to-open-source)',
        '[How open source contributions can boost your career](https://opensource.com/article/19/5/how-get-job-doing-open-source)',
        '[How to write the perfect pull request](https://github.blog/2015-01-21-how-to-write-the-perfect-pull-request/)',
        '[How to write a good commit message](https://dev.to/chrissiemhrk/git-commit-message-5e21)',
        '[Github Desktop](https://desktop.github.com/)',
        '[Community help in our Hacktoberfest Discord server](https://discord.gg/hacktoberfest)',
      ],
    }
  ],
};

export const prMrDetails = {
  title: 'Pull/Merge Request Details',
  content: 'Here’s how we validate contributor PR/MRs for Hacktoberfest',
  sections: [
    {
      title: 'Your PR/MRs must be within the bounds of Hacktoberfest.',
      subtitle: 'out-of-bounds',
      items: [
        {
          content: 'Your PR/MRs must be created between October 1 and October 31 (in any time zone, UTC-12 thru UTC+14).',
        },
        {
          content: 'Your PR/MRs must be made to a public, unarchived repository.',
        },
      ],
    },
    {
      title: 'Repos that go against Hacktoberfest’s values will be excluded from qualification and PR/MRs made to those repos won’t count.',
      subtitle: 'excluded',
      items: [
        {
          content: 'Found a repository that goes against the values of Hacktoberfest? [Let us know and we’ll take a look.](/report)',
        },
      ],
    },
    {
      title: 'Your PR/MRs must not be spammy.',
      subtitle: 'spam',
      items: [
        {
          content: 'PR/MRs that are labeled with a label containing the word “spam” by maintainers will not be counted.',
          items: [
            'Specifically, we use the Node.js 16 RegEx engine with `/\\bspam\\b/i` to look for spam labels.',
          ],
        },
        {
          content: 'PR/MRs that our system detects as spammy will also not be counted.',
        },
        {
          content: 'Any user with two or more spammy PR/MRs will be disqualified.',
        },
      ],
    },
    {
      title: 'Your PR/MRs must be in a repo tagged with the “hacktoberfest” topic, or be labeled “hacktoberfest-accepted.”',
      subtitle: 'participating',
      items: [
        {
          content: 'Hacktoberfest is now opt-in for maintainers, so only contribute to projects that indicate they’re looking for Hacktoberfest PR/MRs.',
        },
        {
          content: 'Once your PR/MR has passed this check, we won’t check this again (unless your PR/MR fails a check before this, such as it being marked as spammy).',
        },
      ],
    },
    {
      title: 'Your PR/MRs must not be labeled as “invalid”.',
      subtitle: 'invalid',
      items: [
        {
          content: 'PR/MRs that have a label containing the word “invalid” won’t be counted, unless they also have the “hacktoberfest-accepted” label.',
          items: [
            'Specifically, we use the Node.js 16 RegEx engine with `/\\binvalid\\b/i` to look for spam labels.',
          ],
        },
      ],
    },
    {
      title: 'Your PR/MRs must be merged, have the “hacktoberfest-accepted” label, or have an overall approving review.',
      subtitle: 'accepted',
      items: [
        {
          content: 'Your PR/MR must not be a draft to be considered accepted.',
        },
        {
          content: 'If your PR/MR is being accepted for Hacktoberfest via an overall approving review it must also not be closed.',
        },
      ],
    },
    {
      title: 'Once your PR/MRs pass all the checks above, it will be accepted for Hacktoberfest after the 7-day review period.',
      items: [
        {
          content: 'We continually evaluate all of the checks except the **[participating]** check. If it fails any of these checks during this time, the 7-day timer will reset. ',
        },
        {
          content: 'After the 7-day review period completes, your PR/MR will be automatically accepted for Hacktoberfest assuming it still passes all the checks. Once accepted for Hacktoberfest, we stop checking. :party:',
        },
      ],
    },
  ],
};

export const spam = {
  title: 'Measures to Reduce Spam',
  content: 'Hacktoberfest is best without spam. To reduce the number of spammy requests contributors make, we empower maintainers to label pull/merge requests as “spam” at their own discretion, all pull/merge requests you submit must be approved by project maintainer, and repos that try to game the system will be excluded from Hacktoberfest.',
  sections: [
    {
      title: 'Spammy pull/merge requests will be labeled as “spam.”',
      content: 'Maintainers: label spammy requests “spam” and close them. PR/MRs labeled “spam” won’t count toward Hacktoberfest. Contributors with 2+ spammy PR/MRs are disqualified.',
    },
    {
      title: 'Pull/merge requests must be approved by a maintainer.',
      content: 'Maintainers accept PR/MRs by merging them, labeling them “hacktoberfest-accepted,” or giving them an overall approving review. Accepted PR/MRs enter a 7-day review window, during which approval can be revoked by the maintainer or by our team.',
    },
    {
      title: 'Bad repositories will be excluded.',
      content: 'PR/MRs should be useful to maintainers. Repos that encourage simplistic PR/MRs (like adding a name or profile to a list or arbitrarily curating content) will be excluded from Hacktoberfest. Remember: quantity is fun, quality is key.\n' +
        '\n' +
        'Found a repository that you think doesn’t follow our values? [Report it to us and we’ll take a look](/report).',
    },
    {
      title: 'Avoid submitting low-quality pull/merge requests.',
      content: 'Hacktoberfest is about contributing meaningfully to open-source projects. Here are some examples of low-quality pull/merge requests that won’t count towards Hacktoberfest.\n' +
        '\n' +
        ' - Automated pull/merge requests: scripted opening pull requests to remove whitespace, fix typos or optimize images.\n' +
        ' - Disruptive pull/merge requests: taking someone else\'s branch/commits and making a pull request.\n' +
        ' - Anything that a project maintainer flags as spam.\n' +
        ' - Anything that looks like an attempt to duplicate your pull request count for October.\n' +
        '\n' +
        'Multiple pull/merge requests for the same issue that are unnecessary -for example five PR/MRs to remove a stray whitespace is not.\n',
    },
  ],
};

export const maintainers = {
  title: 'Maintainers',
  sections: [
    {
      content: 'Prepare your project for contributions by following these best practices: \n',
      items: [
        'Add the “hacktoberfest” topic to your repository to **opt-in to Hacktoberfest** and indicate you’re looking for contributions.',
        'Apply the “hacktoberfest” label to issues you want contributors to help with in your GitHub or GitLab project.',
        'Add a CONTRIBUTING.md file with contribution guidelines to your repository.',
        'Choose issues that have a well-defined scope and are self-contained.',
        'Adopt a code of conduct to create a greater sense of inclusion and community for contributors.',
        'Be ready to review pull/merge requests, accepting those that are valid by merging them, leaving an overall approving review, or by adding the “hacktoberfest-accepted” label.',
        'Reject any spammy requests you receive by labeling them as “spam,” and any other invalid contributions by closing them or labeling them as “invalid.”',
      ],
    },
    {
      title: 'Reward for Maintainers',
      content: 'Your hard work is the reason Hacktoberfest exists, so we want you to have your very own Hacktoberfest 2022 reward. All you have to do is complete 4 or more maintainer actions on unique PR/MRs in repos participating in Hacktoberfest. Here are the actions we look for:\n' +
        '\n' +
        ' - Merge unique PR/MRs\n' +
        ' - Provide an approving review of a PR/MR\n' +
        ' - Add the “hacktoberfest-accepted” label\n' +
        ' - Add any label with the word “invalid” or “spam” \n' +
        '\n' +
        'Reward kits are limited to the first 1000 qualifying maintainers, if you are also participating as a contributor you may only receive one reward kit. \n'
    },
  ],
};
