// Single source of truth for site-wide identity used across metadata,
// sitemap/robots, and structured data.
//
// The apex domain (returndesk.in) 308-redirects to www — www is the domain
// that actually serves content, so canonical/sitemap/OG URLs point there to
// avoid sending crawlers through an extra redirect hop on every URL.
export const SITE_URL = "https://www.returndesk.in";
export const SITE_NAME = "returndesk";
