// EVERY per-site value lives here. jurisbranded.com (JurisBranded, CLID JB). STAGE: not yet on the real domain.
export const SITE = {
  url: 'https://jurisbranded.com',
  domain: 'jurisbranded.com',
  name: 'JurisBranded',
  legalName: 'JurisBranded',
  tagline: 'Legal marketing for law firms',
  lang: 'en-US',
  logo: '',
  favicon: '/favicon.svg',
  ogImage: '',
  contactPath: '/contact/',
  analyticsTags: [],           // none on the stage
  social: [],
  nav: [],
  // Cloudflare Turnstile: set a real sitekey before forms go live. The matching secret is TURNSTILE_SECRET on the Pages project.
  TURNSTILE_SITEKEY: '',
};
// Hand-mapped redirects (old URL -> new URL). Empty on a fresh stage.
export const PAGE_REDIRECTS = {};
export const SPLAT_REDIRECTS = [];
