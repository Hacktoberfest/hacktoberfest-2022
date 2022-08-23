export const values = {
    title: 'Values',
    sections: [
        {
            title: 'Everyone is Welcome',
            content: 'Participants in Hacktoberfest come from all over the world and represent thousands of unique skill sets. This program welcomes everyone who\'s already part of the open source software community, and anyone who is interested in “diving in”.',
        },
        {
            title: 'Quantity is fun, quality is key',
            content: 'Participating in Hacktoberfest leads to personal growth, professional opportunities, and community building. However, it all begins with meaningful contributions to open source software. We are committed to prioritizing quality contributions as outlined in our participation rules.',
        },
        {
            title: 'Short-term action, long-term impact',
            content: 'In the open source software community, we are standing on the shoulders of project maintainers and those who came before us. Your participation has a lasting effect on people and technology long after October.',
        },
    ],
};

export const quality = {
    title: 'Quality Standards',
    sections: [
        {
            title: 'In line with Hacktoberfest value #2 (Quantity is fun, quality is key), we have provided examples of the pull requests that we consider to be low quality contributions (which we discourage and may be marked as spam by maintainers).',
            content: 'Examples of low quality contributions:',
            items: [
                'Pull requests that are automated e.g. scripted opening pull requests to remove whitespace / fix typos / optimize images.',
                'Pull requests that are disruptive e.g. taking someone else\'s branch/commits and making a pull request.',
                'Pull requests that are regarded by a project maintainer as a hindrance vs. helping.',
                'Something that\'s clearly an attempt to simply +1 your pull request count for October.',
                'Last but not least, one pull request to fix a typo is fine, but 5 pull requests to remove a stray whitespace is not.',
            ],
        },
    ],
};

export const spam = {
    title: 'Reducing Spam',
    sections: [
        {
            title: 'Spammy pull requests can be labeled as “spam”.',
            content: 'Maintainers are faced with the majority of spam that occurs during Hacktoberfest, and we dislike spam just as much as you.',
            items: [
                'If you\'re a maintainer, please label any spammy pull requests submitted to the repositories you maintain as ‘spam’, and close them.',
                'Pull requests with a label containing the word ‘spam’ won\'t count toward Hacktoberfest.',
                'Users with two or more PRs/MRs that have been identified as spam will be disqualified from Hacktoberfest.',
            ],
        },
        {
            title: 'Pull requests must be approved by a maintainer.',
            content: 'Once a participant has submitted a pull request that is ready-to-review to a participating project, it must be approved by a maintainer of that project before it will count toward Hacktoberfest.\n' +
                '\n' +
                'PRs can be accepted either by being merged, having an overall approving review, or having the ‘hacktoberfest-accepted’ label. *\n' +
                '\n' +
                'After a PR is approved it enters a seven-day review window where our team can take action against any participants we believe to be contributing in bad faith, and maintainers can revoke their approval if they decide that a PR isn’t actually a legitimate contribution.\n' +
                '\n' +
                'After the seven-day window has passed, the PR becomes eligible for Hacktoberfest and this cannot be reversed.\n' +
                '\n' +
                '* For more information on the specifics of what qualifies a pull request, see the ‘[Pull/merge request details](#pr-mr-details)’ section of this page.',
        },
        {
            title: 'Bad repositories will be excluded.',
            content: 'We\'ve seen many repositories that encourage participants to make simple pull requests – to quickly gain a pull request towards winning. While these projects may be a valuable learning tool for new contributors, they often aren\'t valuable and high quality contributions to open source projects, and go against one of our core values for Hacktoberfest.\n' +
                '\n' +
                'Some examples of projects that don’t follow the values of Hacktoberfest include:',
            items: [
                'Projects asking contributors to add their name or profile information to a list',
                'Projects asking contributors to submit assorted data structures and algorithms (DSA)',
                'Projects asking contributors to curate arbitrary lists of quotes, interview questions, etc.',
            ],
        },
    ],
    motto: 'The quality of pull requests is paramount; quantity comes second.',
    report: 'We’ve implemented a system that blocks the tracking of contributions to such repositories. Found a repository that you think doesn’t follow our values? [Report it to us and we’ll take a look.](/report)',
};

export const contributors = {
    title: 'Contributors',
    sections: [
        {
            title: 'Sign up any time between October 1 and October 31 on the [official Hacktoberfest website](/).',
            content: 'Pull requests can be made in any [GitHub](https://github.com/topics/hacktoberfest) or [GitLab](https://gitlab.com/explore/projects/topics/hacktoberfest) hosted project that’s participating in Hacktoberfest (find participating projects in the ‘hacktoberfest’ topic) and must be approved by a maintainer of the project to count toward your completed pull requests.',
            items: [
                'Pull/merge requests can be submitted to any opted-in repository on GitHub or GitLab.',
                'The pull/merge request must contain commits you made yourself.',
                'If a maintainer reports your pull request as spam, it will not be counted toward your participation in Hacktoberfest. Users that have two or more spam PRs/MRs will be disqualified.',
                'If a maintainer reports behavior that’s not in line with the project’s code of conduct, you will be ineligible to participate.',
                'To get a prize, you must make four approved pull/merge requests (PRs/MRs) on opted-in projects between October 1st and 31st in any time zone.',
                'This year, the first 50,000 participants that complete Hacktoberfest can earn a prize: a tree planted in their name, or the Hacktoberfest T-shirt.',
            ],
        },
    ],
};

export const maintainers = {
    title: 'Maintainers',
    sections: [
        {
            title: 'Add the \'Hacktoberfest\' topic to your repository/project so that folks know you\'re participating in Hacktoberfest.',
            items: [
                'Apply the \'Hacktoberfest\' label to issues in your GitHub or GitLab project that are ready for contributors to work on.',
                'Add a CONTRIBUTING.md file with contribution guidelines to your repository.',
                'Choose issues that have a well-defined scope and are self-contained.',
                'Adopt a code of conduct to foster a greater sense of inclusion and community.',
                'Be ready to review pull requests, approving those that are valid, and flagging those that are not as \'invalid\' or \'spam\'.',
            ],
        },
        {
            content: 'A pull request can be approved either by giving it an overall approving review from maintainers, or by merging the pull request, or adding the \'hacktoberfest-accepted\' label. For more information on the specifics of what qualifies a pull request, see the Participation section of the Resources page.\n' +
                '\n' +
                'Use a label containing the word ‘invalid’ to discount a PR/MR from Hacktoberfest (PRs/MRs that aren’t merged or approved also won’t be counted), and use a label containing the word ‘spam’ to flag the PR/MR as spam (as well as discounting it).\n' +
                '\n' +
                'Enable making the first contribution to your project easier. [DeepSource Discover](https://deepsource.io/discover/) helps you list easy-to-fix but valuable code quality issues for new contributors.'
        },
    ],
};

export const prMrDetails = {
    title: 'Pull/Merge Request Details',
    content: 'What qualifies a pull/merge request? When checking if a pull/merge request should be counted, we work through the following steps to evaluate it:',
    sections: [
        {
            title: 'Is the pull/merge request within the bounds of Hacktoberfest?',
            items: [
                {
                    title: 'The pull/merge request must be created during October.',
                    content: 'The PR/MR must be created between October 1 and 31 in any timezone (UTC-12 thru UTC+14). PRs/MRs that were opened before, or after, October will not be counted, even if they were originally a draft and then marked as ready-for-review during October. The commit dates for the changes in the PR/MR do not matter, just the date when the PR/MR was opened.',
                },
                {
                    title: 'The pull/merge request must be made to a public, unarchived repository.',
                    content: 'We will never look at contributions made to private repositories, only those that are publicly accessible. Additionally, if the PR/MR is in a repository that is archived, it will not be considered valid for Hacktoberfest.',
                },
            ],
            check: {
                type: 1,
                content: 'We continually check this step from the moment we first see the PR/MR up until it completes the 7-day review period and is marked as accepted.',
            },
        },
        {
            title: 'Is the pull/merge request excluded?',
            items: [
                {
                    title: 'The pull/merge request must not be submitted to an excluded repository.',
                    content: 'Hacktoberfest is about making quality contributions to open source. As such, we continually review reports from our community and exclude repositories that go against the values of Hacktoberfest. Any PR/MR made to one of these repositories will not count.',
                },
            ],
            check: {
                type: 1,
                content: 'We continually check this step from the moment we first see the PR/MR up until it completes the 7-day review period and is marked as accepted.',
            },
        },
        {
            title: 'Is the pull/merge request spam?',
            items: [
                {
                    title: 'The pull/merge request must not fall foul of abuse prevention checking.',
                    content: 'Unfortunately, we cannot disclose too much about what cheks take place for this as it’d let folks cheating Hacktoberfest know how to get around the detection. We’re very careful with this logic to ensure that it won’t have false positives. If you do ever run into this in error, please reach out to us!',
                },
                {
                    title: 'The pull/merge request must not be labeled as spam by a maintainer.',
                    content: 'If a PR/MR is given any label containing the word ‘spam’, then it will be treated as spam and will not be counted for Hacktoberfest. Specifically, we use the Node.js RegEx engine to look for labels that match `/\\bspam\\b/i`.\n' +
                        '\n' +
                        'If the PR/MR has the ‘hacktoberfest-accepted’ label then it cannot be marked as spam. Additionally, if the PR/MR has been merged and does NOT have a label containing the word ‘invalid’ then it cannot be marked as spam.',
                },
                {
                    title: 'PR/MRs that are identified as spam by this step count toward the disqualification of a user. The only count towards disqualification while they are actively failing this step.',
                },
            ],
            check: {
                type: 1,
                content: 'We continually check this step from the moment we first see the PR/MR up until it completes the 7-day review period and is marked as accepted.',
            },
        },
        {
            title: 'Is the pull/merge request participating in Hacktoberfest?',
            items: [
                {
                    title: 'The pull/merge request must be in a participating repository, or marked as participating itself.',
                    content: 'A repository is considered to be participating in Hacktoberfest if it has the \'hacktoberfest\' topic. If a repository isn\'t participating, an individual PR can be marked as participating by adding the \'hacktoberfest-accepted\' label to it.',
                },
            ],
            check: {
                type: 2,
                content: 'Unlike other checks, we only continually check this for the PR/MR until it is seen as participating. Once we’ve seen it as participating we set a flag and don’t check again unless the PR/MR fails a step before this (falling out of bounds, being marked as excluded or as spam).',
            },
        },
        {
            title: 'Is the pull/merge request labeled invalid?',
            items: [
                {
                    title: 'The pull/merge request must not be labeled as invalid by a maintainer.',
                    content: 'If a PR/MR is given any label containing the word invalid, then it will not be counted for Hacktoberfest. Specifically, we use the Node.js RegEx engine to look for labels that match `/\\binvalid\\b/i`.\n' +
                        '\n' +
                        'If the PR/MR has the ‘hacktoberfest-accepted’ label then it cannot be marked as invalid.',
                },
            ],
            check: {
                type: 1,
                content: 'We continually check this step from the moment we first see the PR/MR up until it completes the 7-day review period and is marked as accepted.',
            },
        },
        {
            title: 'Is the pull/merge request accepted by a maintainer?',
            items: [
                {
                    title: 'The pull/merge request must not be a draft.',
                    content: 'Any pull/merge request that is marked as a draft on GitHub or GitLab will not be considered for Hacktoberfest. Pull/merge requests must be marked as ready for review by maintainers.',
                },
                {
                    title: 'The pull/merge request must be merged, have the \'hacktoberfest-accepted\' label, or have an overall approving review and be open.',
                    content: 'Any pull/merge request that has been merged through the respective platform (GitHub/GitLab), such that the platform shows it as merged, will be considered as accepted by a maintainer for Hacktoberfest.\n' +
                        '\n' +
                        'Alternatively, any PR/MR that is open and has an overall approving review from maintainers of the repository, such that the PR/MR shows as approved, will be considered as accepted by a maintainer for Hacktoberfest. A closed PR/MR with an overall approving review will not be counted.\n' +
                        '\n' +
                        'Or, any pull/merge request that has been given the ‘hacktoberfest-accepted’ label will be considered as accepted by a maintainer for Hacktoberfest. This works for both open and closed PRs/MRs, as well as PRs/MRs in repositories that do not have the ‘hacktoberfest’ topic. This can be especially useful for projects that merge PR/MRs off-platform, or projects that only want to opt-in specific PR/MRs instead of the whole project.',
                },
            ],
            check: {
                type: 1,
                content: 'We continually check this step from the moment we first see the PR/MR up until it completes the 7-day review period and is marked as accepted.',
            },
        },
        {
            title: 'Has the pull/merge request passed the 7-day review period?',
            items: [
                {
                    title: 'Once a pull/merge request meets all the prior conditions, it then enters the 7-day review period where it can mature. During this, we continually check that it still meets all the conditions, and assuming it does, after 7 days it will be marked as accepted and locked into this state permanently.',
                },
                {
                    title: 'If the PR/MR stops meeting any of the conditions during this period, then it will no longer be considered valid until it meets them again, at which point the 7-day review period will start again.',
                },
                {
                    title: 'Any existing PR/MR that has a review period extending into November will be allowed to continue maturing and still count toward earning a prize, but no new PRs will be tracked after October 31. If an existing PR/MR fails the review period once in November, it cannot start maturing again.',
                },
                {
                    title: 'We have this review period to ensure that a maintainer can un-accept a PR/MR that they may have accidentally accepted, and it gives our team time to review spam trends across all of Hacktoberfest and take action against cheaters.',
                },
            ],
            check: {
                type: 3,
                content: 'We continually check this step from the moment we first see the PR/MR up until it completes the 7-day review period and is marked as accepted.',
            },
        },
    ],
};
