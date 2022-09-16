/**
 * Used for:
 *   - Calculating PR/MR countdown on profile
 */
export const prWaitingTime = 7 * 24 * 60 * 60 * 1000;

/**
 * Used for:
 *   - Homepage countdown
 *   - Displaying start hacking in nav
 *   - Controlling access to auth hook
 *   - Controlling access to registration page
 */
export const registrationStart = process.env.REGISTRATION_START || '2022-09-26T18:00:00Z';

/**
 * Used for:
 *   - Controlling access to registration page
 */
export const registrationEnd = process.env.REGISTRATION_END || '2022-11-01T12:00:00Z';

/**
 * Used for:
 *  - Toggling no PR/MR messaging on profile
 */
export const trackingStart = process.env.TRACKING_START || '2022-09-30T10:00:00Z';

/**
 * Used for:
 *   - Displaying start hacking in nav
 *   - Controlling access to auth hook
 */
export const profileEnd = process.env.PROFILE_END || '2022-12-15T12:00:00Z';
