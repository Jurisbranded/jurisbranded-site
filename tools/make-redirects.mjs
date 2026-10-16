// make-redirects.mjs — run AFTER astro build. Writes dist/_redirects.
// Everything with content is built at its OLD URL, so page rules only cover the /index.php and no-slash spellings,
// plus the hand-mapped dead pages in src/site.config.mjs. Refuses targets that were not built.
// Cloudflare Pages: exact path match, first match wins, 2000 static + 100 dynamic rules.
import fs from 'node:fs';
import path from 'node:path';
import { PAGE_REDIRECTS, SPLAT_REDIRECTS } from '../src/site.config.mjs';

const DIST = 'dist';
const built = (p) => fs.existsSync(path.join(DIST, p, 'index.html')) || (/\.[a-z0-9]+$/.test(p) && fs.existsSync(path.join(DIST, p)));
const rules = new Map();
const add = (from, to) => {
  if (!built(to)) throw new Error(`redirect target not built: ${from} -> ${to}`);
  const bare = from.replace(/\/$/, '');
  for (const v of new Set([from, bare, bare + '/index.php', bare + '/index.php/'])) if (v && v !== to && !rules.has(v)) rules.set(v, to);
};
// every built page: /x/index.php and /x -> /x/
const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => e.isDirectory() ? walk(path.join(dir, e.name)) : e.name === 'index.html' ? [dir] : []);
for (const d of walk(DIST)) {
  const p = '/' + path.relative(DIST, d).split(path.sep).join('/') + '/';
  if (p === '//' || p.startsWith('/404')) continue;
  add(p, p);
}
for (const [from, to] of Object.entries(PAGE_REDIRECTS)) add(from, to);
const lines = [...rules].map(([a, b]) => `${a} ${b} 301`);
// media: old upload URLs -> /images/<same file name>. Files left out of the build (over 25 MB, plugin zip) are listed in tools/left-out.txt.
lines.push('/wp-content/uploads/:year/:month/:file /images/:file 301');
lines.push('/index.php / 301', '/index.php/ / 301', '/wp-login.php / 301', '/wp-admin/* / 301', '/xmlrpc.php / 301', '/wp-json/* / 301', '/wp-content/* / 301', '/wp-includes/* / 301');
for (const [a, b] of SPLAT_REDIRECTS) { if (!built(b)) throw new Error(`redirect target not built: ${a} -> ${b}`); lines.push(`${a} ${b} 301`); }
lines.push('/index.php/* /:splat 301');   // LAST: catch-all
fs.writeFileSync(path.join(DIST, '_redirects'), lines.join('\n') + '\n');
console.log(`_redirects: ${lines.length} rules`);
// Cloudflare Pages limit: no file over 25 MB
const big = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => e.isDirectory() ? big(path.join(dir, e.name)) : fs.statSync(path.join(dir, e.name)).size > 25 * 1024 * 1024 ? [path.join(dir, e.name)] : []);
const over = big(DIST);
if (over.length) throw new Error('files over 25 MB in dist: ' + over.join(', '));
