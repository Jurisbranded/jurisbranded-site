// make-worker.mjs — run AFTER make-redirects. Inlines every functions/api/<name>.js (no imports allowed) into a
// dependency-free dist/_worker.js routed at /api/<name>; everything else -> env.ASSETS.fetch.
// Handler keys are upper-cased (onRequestPost -> POST) so they match request.method.
// Reason: dashboard zip upload does not compile /functions but honours _worker.js.
import fs from 'node:fs';
import path from 'node:path';
const DIR = 'functions/api';
if (!fs.existsSync(DIR)) { console.log('no functions/api: no worker'); process.exit(0); }
const names = fs.readdirSync(DIR).filter((f) => f.endsWith('.js')).map((f) => f.replace(/\.js$/, ''));
let out = '';
for (const n of names) {
  let src = fs.readFileSync(path.join(DIR, n + '.js'), 'utf8');
  if (/^\s*import\s/m.test(src)) throw new Error(`${n}.js has imports; API functions must be dependency-free`);
  src = src.replace(/export\s+(async\s+)?function\s+onRequest(\w*)/g, (m, a, method) => `${a || ''}function __${n}_onRequest${method}`)
           .replace(/export\s+const\s+onRequest(\w*)\s*=/g, (m, method) => `const __${n}_onRequest${method} =`);
  out += `// ---- /api/${n} ----\n${src}\n`;
  const methods = [...src.matchAll(new RegExp(`__${n}_onRequest(\\w*)`, 'g'))].map((m) => m[1]);
  out += `const __${n}_handlers = { ${[...new Set(methods)].map((m) => `${m ? m.toUpperCase() : 'ANY'}: __${n}_onRequest${m}`).join(', ')} };\n`;
}
out += `
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const m = url.pathname.match(/^\\/api\\/([a-z0-9-]+)\\/?$/);
    const routes = { ${names.map((n) => `'${n}': __${n}_handlers`).join(', ')} };
    if (m && routes[m[1]]) {
      const h = routes[m[1]];
      const fn = h[request.method.toUpperCase()] || h.ANY;
      if (!fn) return new Response('Method not allowed', { status: 405 });
      return fn({ request, env, ctx, waitUntil: ctx.waitUntil.bind(ctx) });
    }
    return env.ASSETS.fetch(request);
  }
};
`;
fs.writeFileSync('dist/_worker.js', out);
fs.writeFileSync('dist/_routes.json', JSON.stringify({ version: 1, include: ['/api/*'], exclude: [] }));
console.log(`_worker.js: ${names.join(', ')}`);
