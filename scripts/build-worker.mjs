import {cp, mkdir, readdir, rm, readFile, writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import './build-v2-pages.mjs';
import './build-ziynat-pages.mjs';
import './promote-ziynat.mjs';
import './build-seo.mjs';
import './build-locales.mjs';
import './build-sw.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const client = path.join(dist, 'client');
const server = path.join(dist, 'server');

await rm(client, {recursive: true, force: true});
await rm(server, {recursive: true, force: true});
await mkdir(client, {recursive: true});
await mkdir(server, {recursive: true});
for (const entry of await readdir(dist, {withFileTypes: true})) {
  if (entry.name === 'client' || entry.name === 'server') continue;
  await cp(path.join(dist, entry.name), path.join(client, entry.name), {recursive: true});
}
await cp(path.join(root, 'server/lead-worker.mjs'), path.join(server, 'index.js'));
await mkdir(path.join(client, 'docs'), {recursive: true});
for (const [file, slug, title] of [
  ['SEO_REPORT.md', 'seo-report', 'SEO-отчёт'],
  ['SEO_SETUP.md', 'seo-setup', 'Инструкция по SEO']
]) {
  const content = await readFile(path.join(root, file), 'utf8');
  const escape = value => value.replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const html = `<!doctype html><html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>${title} — ColourWay Design</title><style>body{margin:0;background:#fafafa;color:#222326;font:16px/1.7 Arial,sans-serif}header{background:#75101f;color:#fff;padding:22px max(24px,calc((100vw - 1000px)/2))}header a{color:#fff}main{max-width:1000px;margin:0 auto;padding:36px 24px 90px}pre{white-space:pre-wrap;overflow-wrap:anywhere;font:inherit}a{color:#991427}</style></head><body><header><a href="/">ColourWay Design</a></header><main><pre>${escape(content)}</pre></main></body></html>`;
  await writeFile(path.join(client, 'docs', `${slug}.html`), html);
}
console.log('Prepared dist/client static assets and dist/server/index.js');
