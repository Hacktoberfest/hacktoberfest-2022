export const pullRequestStates = {
  excluded: {
    title: 'Repository Excluded',
    description:
      'Your ${pr} was submitted to a repository that has been excluded from Hacktoberfest as it does not follow the values of the event. It will not count towards your participation.',
  },
  spam: {
    title: 'Marked as Spam',
    description:
      'Your ${pr} has been identified as spam, either by automated logic, or by a maintainer adding a `spam` label to it. It will not count towards your participation. Two or more spam ${pr}s will result in permanent disqualification.',
  },
  'not-participating': {
    title: 'Repository Not Participating',
    description:
      'Your ${pr} was submitted to a repository that is not participating in Hacktoberfest. Maintainers need to add the `hacktoberfest` topic to the repository, or add the `hacktoberfest-accepted` label to your ${pr}.',
  },
  invalid: {
    title: 'Marked as Invalid',
    description:
      'Your ${pr} has been labeled as `invalid`, and will not count towards your participation in Hacktoberfest.',
  },
  'not-accepted': {
    title: 'Not Accepted',
    description:
      'Your ${pr} has not yet been accepted by a maintainer of the repository. To be accepted, a maintainer either needs to merge your ${pr}, add the `hacktoberfest-accepted` label, or leave an overall approving review.',
  },
  waiting: {
    title: 'Accepted (In Review: ${timer})',
    description:
      "Awesome! Your ${pr} has been accepted by a maintainer and is now in a seven-day review period. No action is needed, we'll take a look at your ${pr} and assuming it is still accepted after seven days it will count towards your participation in Hacktoberfest!",
  },
  accepted: {
    title: 'Accepted',
    description:
      'Congratulations! Your ${pr} has been accepted for Hacktoberfest, and now counts towards your participation. :party:',
  },
};

export const pullRequestValidation =
  'For more information about how exactly we validate ${pr}s for contributors, check the [details on our participation page](/participation#pr-mr-details).';

export const employmentRoles = [
  'Back-end Developer',
  'Full-stack Developer',
  'Front-end Developer',
  'Founder, Owner or C-suite Executive (CEO, CTO, etc.)',
  'Mobile Developer',
  'Desktop Applications Developer',
  'Systems Architect',
  'System Administrator (SysAdmin)',
  'Systems Reliability Engineer',
  'Database Administrator',
  'Designer',
  'DevOps Specialist',
  'QA or Test Developer',
  'Software Development Consultant',
  'Engineering Manager',
  'Embedded Applications or Devices Developer',
  'Game or Graphics Developer',
  'Product Manager',
  'Data Scientist or Analyst',
  'Open Source Contributor',
  'Freelance Consultant',
  'Educator or Academic Researcher',
  'Marketing or Sales Professional',
  'Other',
];
