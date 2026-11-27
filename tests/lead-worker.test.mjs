import test from 'node:test';
import assert from 'node:assert/strict';
import worker from '../server/lead-worker.mjs';

const base = 'https://colourway.example';
const env = {
  TELEGRAM_BOT_TOKEN: 'test-token', TELEGRAM_CHAT_ID: '123456789',
  ASSETS: {fetch: async () => new Response('site asset')}
};
const lead = {
  id: '11111111-2222-4333-8444-555555555555',
  services: ['letters'], name: 'Алина', contact: '+998 90 123 45 67',
  company: 'Тест', task: 'Объёмные буквы', language: 'ru', website: ''
};
function request(body, ip = '198.51.100.1') {
  return new Request(`${base}/api/leads`, {
    method: 'POST', headers: {'Origin': base, 'Content-Type': 'application/json', 'CF-Connecting-IP': ip},
    body: JSON.stringify(body)
  });
}

test('status reports readiness and static assets remain available', async () => {
  const disabled = await worker.fetch(new Request(`${base}/api/lead-config`), {...env, TELEGRAM_CHAT_ID: ''});
  assert.deepEqual(await disabled.json(), {enabled: false});
  const enabled = await worker.fetch(new Request(`${base}/api/lead-config`), env);
  assert.deepEqual(await enabled.json(), {enabled: true});
  const page = await worker.fetch(new Request(`${base}/`), env);
  assert.equal(await page.text(), 'site asset');
});

test('SEO routes serve canonical assets, redirect HTML aliases and keep unknown pages at 404', async () => {
  const fetched=[];
  const assets={fetch:async request=>{
    const pathname=new URL(request.url).pathname;fetched.push(pathname);
    if(pathname==='/404.html')return new Response('<h1>Not found</h1>',{headers:{'content-type':'text/html'}});
    return pathname==='/missing/'?new Response('missing',{status:404}):new Response(pathname);
  }};
  const siteEnv={...env,ASSETS:assets};
  const alias=await worker.fetch(new Request(`${base}/services.html`),siteEnv);
  assert.equal(alias.status,301);
  assert.equal(alias.headers.get('location'),`${base}/services`);
  assert.equal(await (await worker.fetch(new Request(`${base}/services`),siteEnv)).text(),'/services.html');
  assert.equal(await (await worker.fetch(new Request(`${base}/services/signboards/`),siteEnv)).text(),'/services/signboards/index.html');
  assert.equal(await (await worker.fetch(new Request(`${base}/en/services/signboards/`),siteEnv)).text(),'/en/services/signboards/index.html');
  const missing=await worker.fetch(new Request(`${base}/missing/`,{headers:{accept:'text/html'}}),siteEnv);
  assert.equal(missing.status,404);
  assert.match(await missing.text(),/Not found/);
  assert.ok(fetched.includes('/404.html'));
  const analytics=await worker.fetch(new Request(`${base}/api/analytics-config`),{...siteEnv,GA4_MEASUREMENT_ID:'G-ABC123',GTM_CONTAINER_ID:'invalid',YANDEX_METRIKA_ID:'12345678'});
  assert.deepEqual(await analytics.json(),{ga4:'G-ABC123',gtm:'',yandex:'12345678'});
  const previewRobots=await worker.fetch(new Request(`${base}/robots.txt`),siteEnv);
  assert.match(await previewRobots.text(),/Disallow: \/\n/);
});

test('rejects invalid fields and cross-origin requests', async () => {
  const invalid = await worker.fetch(request({...lead, contact: 'bad'}), env);
  assert.equal(invalid.status, 400);
  const cross = await worker.fetch(new Request(`${base}/api/leads`, {
    method: 'POST', headers: {'Origin': 'https://elsewhere.example', 'Content-Type': 'application/json'},
    body: JSON.stringify(lead)
  }), env);
  assert.equal(cross.status, 403);
  const unavailable = await worker.fetch(request(lead), {...env, TELEGRAM_BOT_TOKEN: ''});
  assert.equal(unavailable.status, 503);
});

test('sends a lead once with its contact and reports Telegram failures', async () => {
  const sent = [];
  const previousFetch = globalThis.fetch;
  globalThis.fetch = async (_url, options) => {
    sent.push(JSON.parse(options.body));
    return new Response(JSON.stringify({ok: true}), {status: 200});
  };
  try {
    const result = await worker.fetch(request(lead, '198.51.100.2'), env);
    assert.equal(result.status, 200);
    assert.equal((await result.json()).id, lead.id);
    assert.equal(sent[0].chat_id, env.TELEGRAM_CHAT_ID);
    assert.match(sent[0].text, /Алина/);
    assert.match(sent[0].text, /\+998 90 123 45 67/);
    const duplicate = await worker.fetch(request(lead, '198.51.100.2'), env);
    assert.equal((await duplicate.json()).duplicate, true);
    assert.equal(sent.length, 1);
    globalThis.fetch = async () => new Response(JSON.stringify({ok: false}), {status: 502});
    const failed = await worker.fetch(request({...lead, id:'aaaaaaaa-bbbb-4ccc-8ddd-eeeeeeeeeeee'}, '198.51.100.3'), env);
    assert.equal(failed.status, 502);
  } finally { globalThis.fetch = previousFetch; }
});

test('webhook requires a secret and the manager chat', async () => {
  const callback = {callback_query: {id: '123', data: `cw:${lead.id}:working`,
    message: {chat: {id: 123456789}, message_id: 1, text: 'Новая заявка\nСтатус: Новая'}}};
  const webhookEnv = {...env, TELEGRAM_WEBHOOK_SECRET: 'test-secret'};
  const blocked = await worker.fetch(new Request(`${base}/api/telegram/webhook`, {
    method: 'POST', body: JSON.stringify(callback)
  }), webhookEnv);
  assert.equal(blocked.status, 403);
  const sent = [];
  const previousFetch = globalThis.fetch;
  globalThis.fetch = async (url, options) => {
    sent.push({url, body: JSON.parse(options.body)});
    return new Response(JSON.stringify({ok: true}), {status: 200});
  };
  try {
    const accepted = await worker.fetch(new Request(`${base}/api/telegram/webhook`, {
      method: 'POST', headers: {'X-Telegram-Bot-Api-Secret-Token': 'test-secret'}, body: JSON.stringify(callback)
    }), webhookEnv);
    assert.equal(accepted.status, 200);
    assert.match(sent[0].body.text, /Статус: В работе/);
  } finally { globalThis.fetch = previousFetch; }
});
