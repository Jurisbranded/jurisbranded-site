import rss from '@astrojs/rss';
import { SITE } from '../site.config.mjs';
// Blog posts join this feed when the blog collection is added.
export function GET(context) {
  return rss({ title: SITE.name, description: SITE.tagline, site: context.site, items: [] });
}
