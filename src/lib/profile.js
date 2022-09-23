export const pullRequestStates = {
  excluded: 'Your PR/MR was submitted to a repository that has been excluded from Hacktoberfest as it does not follow the values of the event. It will not count towards your participation.',
  spam: 'Your PR/MR has been identified as spam, either by automated logic, or by a maintainer adding a `spam` label to it. It will not count towards your participation. Two or more spam PR/MRs will result in permanent disqualification.',
  'not-participating': 'Your PR/MR was submitted to a repository that is not participating in Hacktoberfest. Maintainers need to add the `hacktoberfest` topic to the repository, or add the `hacktoberfest-accepted` label to your PR/MR.',
  invalid: 'Your PR/MR has been labeled as `invalid`, and will not count towards your participation in Hacktoberfest.',
  'not-accepted': 'Your PR/MR has not yet been accepted by a maintainer of the repository. To be accepted, a maintainer either needs to merge your PR/MR, add the `hacktoberfest-accepted` label, or leave an overall approving review.',
  waiting: 'Awesome! Your PR/MR has been accepted by a maintainer and is now in a seven-day review period. No action is needed, and assuming your PR/MR is still accepted after seven days it will count towards your participation in Hacktoberfest!',
  accepted: 'Congratulations! Your PR/MR has been accepted for Hacktoberfest, and now counts towards your participation. :party:',
};

export const pullRequestValidation = 'For more information about how exactly we validate PR/MRs for contributors, check the [details on our participation page](/participation#pr-mr-details).';
