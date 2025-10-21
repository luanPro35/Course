/**
 * @file This file contains the route constants for the application.
 */

/**
 * An array of routes where the brand logo in the navbar should be hidden
 * and a "Back" button should be displayed instead.
 * The check is performed using `pathname.startsWith(route)`.
 */
export const ROUTES_WITH_BACK_BUTTON = ["/profile", "/blog", "/settings"];
