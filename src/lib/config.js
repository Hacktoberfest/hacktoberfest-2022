/**
 * Used for:
 *   - Calculating PR/MR countdown on profile
 */
export const prWaitingTime = 7 * 24 * 60 * 60 * 1000;

/**
 * Used for:
 *   - Homepage countdown + year
 *   - Displaying profile access in nav
 *   - Controlling access to auth hook
 *   - Controlling access to registration page
 *   - Controlling access to report page
 *   - Participation page information
 */
export const registrationStart =
  process.env.REGISTRATION_START || '2025-09-23T12:00:00Z';

/**
 * Used for:
 *   - Displaying the current hacktoberfest year
 */
export const currentHacktoberfest =
  new Date(registrationStart).getFullYear() - 2013;

/**
 * Used for:
 *   - Controlling access to registration page
 *   - Toggling copy for profile access in nav
 *   - Participation page information
 */
export const registrationEnd =
  process.env.REGISTRATION_END || '2025-11-01T12:00:00Z';

/**
 * Used for:
 *   - Toggling no PR/MR messaging on profile
 *   - Participation page information
 */
export const trackingStart =
  process.env.TRACKING_START || '2025-09-30T10:00:00Z';

/**
 * Used for:
 *   - Participation page information
 */
export const trackingEnd = process.env.TRACKING_END || '2025-11-01T12:00:00Z';

/**
 * Used for:
 *   - Controlling access to report page
 *   - Controlling access to profile edit page
 */
export const trackingEndExtended =
  process.env.TRACKING_END_EXTENDED || '2025-11-08T12:00:00Z';

/**
 * Used for:
 *   - Displaying profile access in nav
 *   - Controlling access to auth hook
 */
export const profileEnd = process.env.PROFILE_END || '2025-12-15T12:00:00Z';

/**
 * Used for:
 *   - Displaying progress to registration date
 */
export const launchDate = process.env.LAUNCH_DATE || '2025-09-01T12:00:00Z';

/**
 * Used for:
 *   - Displaying nice names for PR/MR providers
 *   - Showing the correct reference character on profile page
 *   - Showing the correct name for PR/MR on the profile page
 *   - Provider selection on report page
 *   - Providers in profile link/unlinking
 */
export const providerMap = Object.freeze({
  github: { name: 'GitHub', referenceCharacter: '#', prName: 'PR' },
  gitlab: { name: 'GitLab', referenceCharacter: '!', prName: 'MR' },
});
