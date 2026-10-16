// EVERY per-site value lives here. jurisbranded.com (JurisBranded, CLID JB). STAGE: not yet on the real domain.
export const SITE = {
  url: 'https://jurisbranded.com',
  domain: 'jurisbranded.com',
  name: 'JurisBranded',
  legalName: 'JurisBranded',
  tagline: 'Every town has one GOAT. Might as well be you.',
  lang: 'en-US',
  logo: '',
  favicon: '/favicon.svg',
  ogImage: '/media/office_poster.jpg',
  contactPath: '/#inside',
  analyticsTags: [],           // none on the stage
  social: [],
  // Main menu. Anchors on the home page until the inner pages exist.
  nav: [
    { label: 'The secret', href: '/#secret' },
    { label: 'Where you get found', href: '/#find' },
    { label: 'Who we serve', href: '/#serve', children: [
      { label: 'Personal injury', href: '/#serve' },
      { label: "Creditors' rights & collections", href: '/#serve' },
      { label: 'Family law', href: '/#serve' },
      { label: 'Estate planning & probate', href: '/#serve' },
      { label: 'Criminal defense', href: '/#serve' },
      { label: 'Business & corporate', href: '/#serve' },
    ] },
    { label: 'The Code', href: '/#code' },
    { label: 'The founder', href: '/#founder' },
  ],
  cta: { label: 'Get the inside track', href: '/#inside' },
  // Cloudflare Turnstile: set a real sitekey before forms go live. The matching secret is TURNSTILE_SECRET on the Pages project.
  TURNSTILE_SITEKEY: '',
};
// Hand-mapped redirects (old URL -> new URL). Empty on a fresh stage.
export const PAGE_REDIRECTS = {};
export const SPLAT_REDIRECTS = [];
