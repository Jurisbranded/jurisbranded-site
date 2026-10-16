import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { SITE } from './src/site.config.mjs';

// Static output, NO adapter. Cloudflare Pages serves dist/ as plain files.
// No markdown plugins (Astro 7 trap). Same house settings as every StudioHOF Astro site.
export default defineConfig({
  site: SITE.url,
  trailingSlash: 'always',
  build: { format: 'directory', inlineStylesheets: 'always' },
  integrations: [sitemap()],
});
