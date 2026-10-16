// node tools/screenshots.mjs BASE OUTDIR /path/ /path2/ ...  (desktop 1440 + mobile 390, full page, lazy images scrolled in)
import { chromium } from 'playwright-core';
import fs from 'node:fs';
const [base, out, ...paths] = process.argv.slice(2);
fs.mkdirSync(out, { recursive: true });
const exe = ['/opt/pw-browsers/chromium', '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'].find((p) => fs.existsSync(p) && fs.statSync(p).isFile())
  || fs.readdirSync('/opt/pw-browsers').filter((d) => /^chromium-\d+$/.test(d)).map((d) => `/opt/pw-browsers/${d}/chrome-linux/chrome`).find((p) => fs.existsSync(p));
const b = await chromium.launch({ executablePath: exe, args: ['--no-sandbox'] });
for (const [name, vp] of [['desktop', { width: 1440, height: 900 }], ['mobile', { width: 390, height: 844 }]]) {
  const ctx = await b.newContext({ viewport: vp, deviceScaleFactor: 1, ignoreHTTPSErrors: true });
  for (const p of paths) {
    const page = await ctx.newPage();
    const errs = [];
    page.on('console', (m) => m.type() === 'error' && errs.push(m.text()));
    page.on('pageerror', (e) => errs.push(String(e)));
    await page.route(/^https?:\/\/(www\.)?(googletagmanager|google-analytics|googleapis|gstatic)\.com\//, (r) => r.abort());   // third-party tags hang under the sandbox proxy
    await page.goto(base + p, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(1500);
    await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 500) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 200)); } window.scrollTo(0, 0); });
    await page.addStyleTag({ content: '.site-header{position:static!important}' });
    // lazy images inside hidden blocks (inactive review slides) never load: do not wait for them forever
    await page.evaluate(() => Promise.race([new Promise((r) => setTimeout(r, 4000)), Promise.all([...document.images].filter((i) => !i.complete && i.offsetParent !== null).map((i) => new Promise((r) => { i.onload = i.onerror = r; })))]));
    await page.waitForTimeout(600);
    const file = `${out}/${name}${p.replace(/\//g, '_') || '_'}.png`;
    await page.screenshot({ path: file, fullPage: true });
    console.log(file, errs.length ? 'CONSOLE ERRORS: ' + errs.join(' | ') : 'clean');
    await page.close();
  }
  await ctx.close();
}
await b.close();
