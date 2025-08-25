import { currentHacktoberfest, registrationStart } from './config';

export const reportTitle =
  "Found a repository that doesn't follow the values of Hacktoberfest?";
export const reportContent = "Let us know and we'll review it.";

export const reportEnded =
  `We are no longer accepting new repository reports, as Hacktoberfest #${
    currentHacktoberfest
  } ${new Date(registrationStart).getFullYear()} has now ended.\n` +
  `We look forward to seeing you for Hacktoberfest ${
    new Date(registrationStart).getFullYear() + 1
  }!`;
