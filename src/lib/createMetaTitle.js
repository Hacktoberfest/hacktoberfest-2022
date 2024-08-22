import { registrationStart } from './config';

/**
 * Creates a meta title for a page.
 *
 * @param {string} text - The primary text for the title.
 * @returns {string} The formatted meta title.
 */
const createMetaTitle = (text) => {
  const separator = ' | ';
  const siteTitle = `Hacktoberfest ${new Date(registrationStart).getFullYear()}`;

  // If nothing is passed return string.
  if (!text) return siteTitle;

  // Check so we don't duplicate the string twice.
  if (text.includes(separator + siteTitle)) return text;

  return text.trim() + separator + siteTitle;
};

export default createMetaTitle;
