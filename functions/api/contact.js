// POST /api/contact — Cloudflare Pages Function. SHARED across every StudioHOF static site (v2, 2026-10-08).
// No imports (tools/make-worker.mjs inlines this file into dist/_worker.js). Only the two constants below differ per site.
//
// Order of checks:
//   1. honeypot field "website" filled, or posted under 3 seconds after the page loaded -> fake success, nothing sent
//   2. Cloudflare Turnstile (invisible) token verified server-side with env.TURNSTILE_SECRET
//   3. required fields (hidden "_req" = comma list), email format, size limits
//   4. forwarded as JSON to env.N8N_WEBHOOK_URL; success is reported ONLY when n8n answers {"ok":true}
// Settings on the Pages project (never in this repo): N8N_WEBHOOK_URL, TURNSTILE_SECRET, optional FORM_TEST_MODE=1.
// Fails closed: with no TURNSTILE_SECRET or no N8N_WEBHOOK_URL the form answers "not connected yet".
const SITE = 'jurisbranded.com';  // key in the n8n handler's SITES table
const THANKS = '/contact-us/';

const MAX_FIELD = 5000;
const MAX_FIELDS = 40;
const CONTROL = ['form', 'page', 'ts', 'website', '_req', 'test', 'cf-turnstile-response', 'g-recaptcha-response'];

function reply(request, ok, status, error) {
  const accept = request.headers.get('Accept') || '';
  const type = request.headers.get('Content-Type') || '';
  if (accept.includes('application/json') || type.includes('application/json')) {
    return new Response(JSON.stringify(ok ? { ok: true } : { ok: false, error }), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });
  }
  if (ok) return new Response(null, { status: 303, headers: { Location: THANKS, 'Cache-Control': 'no-store' } });
  const safe = String(error).replace(/[<>&]/g, '');
  return new Response(`<!doctype html><meta charset="utf-8"><meta name="robots" content="noindex"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Not sent</title><body style="font:17px/1.5 sans-serif;max-width:36em;margin:4em auto;padding:0 1em;color:#111"><h1>Sorry, that did not go through</h1><p>${safe}</p><p><a href="javascript:history.back()">Go back and try again</a></p></body>`,
    { status, headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' } });
}

async function turnstileOk(env, token, ip) {
  if (!token) return false;
  const body = new URLSearchParams({ secret: String(env.TURNSTILE_SECRET).trim(), response: token });   // trim: a pasted secret can carry a stray space or line break
  if (ip) body.set('remoteip', ip);
  try {
    const r = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body });
    const j = await r.json().catch(() => null);
    if (!(j && j.success === true)) turnstileOk.last = ((j && j['error-codes']) || ['no-response']).join(',');
    return Boolean(j && j.success === true);
  } catch { turnstileOk.last = 'fetch-failed'; return false; }
}

export async function onRequestPost({ request, env }) {
  let form;
  try {
    const type = request.headers.get('Content-Type') || '';
    if (type.includes('application/json')) { const j = await request.json(); form = new Map(Object.entries(j && typeof j === 'object' ? j : {})); }
    else { const fd = await request.formData(); form = new Map(); for (const [k, v] of fd.entries()) { if (typeof v !== 'string') continue; form.set(k, form.has(k) ? form.get(k) + ', ' + v : v); } }
  } catch { return reply(request, false, 400, 'The form could not be read. Please try again.'); }

  const get = (k) => String(form.get(k) ?? '').replace(/\u0000/g, '').trim();
  const ts = Number(get('ts'));
  if (get('website') || (ts && Date.now() - ts < 3000)) return reply(request, true, 200);   // bots: pretend it worked

  if (!env.TURNSTILE_SECRET || !env.N8N_WEBHOOK_URL) return reply(request, false, 503, 'The form is not connected yet. Please call us instead.');
  const ip = request.headers.get('CF-Connecting-IP') || '';
  if (!(await turnstileOk(env, get('cf-turnstile-response'), ip))) {
    return reply(request, false, 403, 'We could not confirm you are a person. Please reload the page and try again (JavaScript must be on).');
  }

  const fields = {};
  let n = 0;
  for (const [k, v] of form) {
    if (CONTROL.includes(k)) continue;
    if (++n > MAX_FIELDS) return reply(request, false, 400, 'Too many fields.');
    const val = String(v).replace(/\u0000/g, '').trim();
    if (val.length > MAX_FIELD || k.length > 80) return reply(request, false, 400, 'One of the answers is too long.');
    if (val) fields[k] = val;
  }
  for (const r of get('_req').split(',').map((s) => s.trim()).filter(Boolean)) if (!fields[r]) return reply(request, false, 400, 'Please fill in every required field.');
  for (const [k, v] of Object.entries(fields)) if (/^e-?mail/i.test(k) && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return reply(request, false, 400, 'Please enter a valid email address.');
  if (!Object.keys(fields).length) return reply(request, false, 400, 'The form was empty.');

  const payload = {
    site: SITE, host: new URL(request.url).hostname, form: get('form').slice(0, 120) || 'contact',
    page: (get('page') || request.headers.get('Referer') || '').slice(0, 300), fields,
    ip, country: (request.cf && request.cf.country) || request.headers.get('CF-IPCountry') || '',
    userAgent: (request.headers.get('User-Agent') || '').slice(0, 300), time: new Date().toISOString(),
    test: Boolean(env.FORM_TEST_MODE) || get('test') === '1',
  };
  try {
    const r = await fetch(env.N8N_WEBHOOK_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    const j = await r.json().catch(() => null);
    if (r.ok && j && j.ok === true) return reply(request, true, 200);
  } catch { /* fall through */ }
  return reply(request, false, 502, 'Sorry, that did not go through. Please try again, or call us.');
}

export async function onRequestGet() {
  return new Response('Method not allowed', { status: 405, headers: { Allow: 'POST' } });
}
