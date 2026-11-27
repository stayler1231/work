const SERVICE_IDS = new Set(['outdoor', 'letters', 'transport', 'posm', 'print', 'exhibition', 'complex', 'furniture', 'consultation']);
const recentSubmissions = new Map();
const recentIPs = new Map();
const ORDER_PRODUCTS = {
  banner: 'Печать баннера',
  banner_frame: 'Баннер с рейкой / каркасом',
  sign: 'Табличка',
  badge: 'Бейджик',
  custom: 'Индивидуальный проект'
};
const SIGN_SIZES = new Set(['30x12', '30x15']);
const LEGACY_SIGN_TYPES = new Set(['sign_dual', 'sign_acrylic']);
const ORDER_ESTIMATE_RATES = {banner: 40000, banner_frame: 80000, sign: 50000, badge: 40000};
const orderDimensionFormat = new Intl.NumberFormat('ru-RU', {useGrouping: false, maximumFractionDigits: 2});

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff'}
  });
}

function clean(value, limit) {
  return typeof value === 'string'
    ? value.replace(/[\u0000-\u001f\u007f]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, limit)
    : '';
}

function validContact(value) {
  if (/^@[a-zA-Z0-9_]{5,32}$/.test(value)) return true;
  const digits = value.replace(/\D/g, '');
  return /^[+\d()\s.-]+$/.test(value) && digits.length >= 9 && digits.length <= 15;
}

function configured(env) {
  return Boolean(env.TELEGRAM_BOT_TOKEN && /^-?\d+$/.test(env.TELEGRAM_CHAT_ID || ''));
}

async function telegram(env, method, payload) {
  const response = await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/${method}`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(9000)
  });
  if (!response.ok) return false;
  const body = await response.json();
  return body.ok === true;
}

async function telegramPhoto(env, caption, id, photo, replyMarkup) {
  const form = new FormData();
  form.set('chat_id', env.TELEGRAM_CHAT_ID);
  form.set('caption', caption);
  if (replyMarkup) form.set('reply_markup', JSON.stringify(replyMarkup));
  const ext = photo.type === 'image/png' ? 'png' : photo.type === 'image/webp' ? 'webp' : 'jpg';
  const method = photo.type === 'image/webp' ? 'sendDocument' : 'sendPhoto';
  form.set(method === 'sendDocument' ? 'document' : 'photo', photo, `colourway-order-${id.slice(0, 8)}.${ext}`);
  const response = await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/${method}`, {
    method: 'POST', body: form, signal: AbortSignal.timeout(15000)
  });
  if (!response.ok) return false;
  return (await response.json()).ok === true;
}

function normalizeOrderItems(value) {
  if (!Array.isArray(value) || value.length > 5) return null;
  const items = [];
  for (const raw of value) {
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null;
    const type = LEGACY_SIGN_TYPES.has(raw.type) ? 'sign' : raw.type;
    if (typeof type !== 'string' || !Object.hasOwn(ORDER_PRODUCTS, type)) return null;
    const quantity = Number(raw.quantity);
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 100) return null;
    let detail = '';
    let estimate = ORDER_ESTIMATE_RATES[type] ?? 0;
    if (type === 'custom') {
      if (typeof raw.title !== 'string' || raw.title.length > 120) return null;
      detail = clean(raw.title, 120);
      if (detail.length < 2) return null;
    } else if (type === 'banner' || type === 'banner_frame') {
      const unit = raw.unit === undefined ? 'm' : raw.unit;
      if (unit !== 'm' && unit !== 'cm') return null;
      if (![raw.width, raw.height].every(value => typeof value === 'number' || typeof value === 'string')) return null;
      const width = Number(raw.width);
      const height = Number(raw.height);
      const scale = unit === 'm' ? 100 : 1;
      if (![width * scale, height * scale].every(cm => {
        const rounded = Math.round(cm);
        return rounded >= 10 && rounded <= 2000 && Math.abs(cm - rounded) < 1e-8;
      })) return null;
      detail = `${orderDimensionFormat.format(width)} × ${orderDimensionFormat.format(height)} ${unit === 'm' ? 'м' : 'см'}`;
      const area = Math.round(width * scale) * Math.round(height * scale) / 10000;
      estimate = Math.round(area * estimate);
    } else if (type === 'sign') {
      if (!SIGN_SIZES.has(raw.size)) return null;
      detail = `${raw.size.replace('x', '×')} см`;
    }
    items.push({type, label: ORDER_PRODUCTS[type], quantity, detail, estimate: estimate * quantity});
  }
  return items;
}

async function validPhoto(file) {
  if (!file || !['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size < 1 || file.size > 5_000_000) return false;
  const bytes = new Uint8Array(await file.slice(0, 12).arrayBuffer());
  if (file.type === 'image/jpeg') return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  if (file.type === 'image/png') return bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47;
  return String.fromCharCode(...bytes.slice(0, 4)) === 'RIFF' && String.fromCharCode(...bytes.slice(8, 12)) === 'WEBP';
}

async function submitCustomOrder(request, env) {
  if (!configured(env)) return json({ok: false, code: 'not_configured'}, 503);
  const origin = request.headers.get('Origin');
  if (origin && origin !== new URL(request.url).origin) return json({ok: false, code: 'origin'}, 403);
  if (!request.headers.get('Content-Type')?.startsWith('multipart/form-data')) return json({ok: false, code: 'type'}, 415);
  if (Number(request.headers.get('Content-Length') || 0) > 10_500_000) return json({ok: false, code: 'too_large'}, 413);
  let form;
  try { form = await request.formData(); } catch (_) { return json({ok: false, code: 'invalid'}, 400); }
  if (form.get('website')) return json({ok: true, id: null});
  const id = clean(form.get('id'), 36);
  const name = clean(form.get('name'), 80);
  const contact = clean(form.get('contact'), 80);
  const note = clean(form.get('note'), 300);
  const language = ['ru','uz','en'].includes(form.get('language')) ? form.get('language') : 'ru';
  const itemsField = String(form.get('items') ?? '[]');
  let rawItems;
  try { rawItems = JSON.parse(itemsField); } catch (_) { return json({ok: false, code: 'validation'}, 400); }
  const items = normalizeOrderItems(rawItems);
  const photo = form.get('photo');
  const design = form.get('design');
  if (!/^[0-9a-f-]{36}$/i.test(id) || name.length < 2 || !validContact(contact) || !items ||
      String(form.get('name') || '').length > 80 || String(form.get('contact') || '').length > 80 ||
      String(form.get('note') || '').length > 300 || itemsField.length > 3000 ||
      (photo && !await validPhoto(photo)) || (design && !await validPhoto(design))) return json({ok: false, code: 'validation'}, 400);
  if (recentSubmissions.has(id)) return json({ok: true, id, duplicate: true});
  const now = Date.now();
  const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
  const hits = (recentIPs.get(ip) || []).filter(time => now - time < 10 * 60 * 1000);
  if (hits.length >= 5) return json({ok: false, code: 'rate_limit'}, 429);
  hits.push(now); recentIPs.set(ip, hits);
  if (recentIPs.size > 1000) recentIPs.clear();
  const total = items.reduce((sum, item) => sum + item.estimate, 0);
  const prefix = items.some(item => item.type === 'sign') ? 'от ' : '';
  const estimate = total ? `${prefix}${total.toLocaleString('ru-RU')} сум` : 'по согласованию';
  const customNote = total && items.some(item => item.type === 'custom') ? ' + индивидуальный проект по согласованию' : '';
  const hasItems = items.length > 0;
  const title = hasItems ? 'Новый заказ' : 'Новая заявка';
  const lines = [`${title} ColourWay · ${id.slice(0, 8).toUpperCase()}`, `Имя: ${name}`, `Контакт: ${contact}`,
    ...items.map((item, index) => `${index + 1}. ${item.label}${item.detail ? ` (${item.detail})` : ''} × ${item.quantity}`),
    hasItems ? `Предварительная стоимость: ${estimate}${customNote}` : 'Изделия не выбраны',
    design ? 'Макет клиента: приложен' : null, note ? `Пожелания: ${note}` : null,
    hasItems ? 'Материалы и стоимость: согласовать с клиентом' : null,
    `Язык сайта: ${language.toUpperCase()}`, 'Статус: Новая'].filter(Boolean);
  const caption = lines.join('\n');
  if (caption.length > 1024) return json({ok: false, code: 'validation'}, 400);
  const replyMarkup = env.TELEGRAM_WEBHOOK_SECRET ? {inline_keyboard: [[
    {text: 'Взять в работу', callback_data: `cw:${id}:working`},
    {text: 'Закрыть', callback_data: `cw:${id}:closed`}
  ]]} : null;
  try {
    const delivered = design || photo
      ? await telegramPhoto(env, caption, id, design || photo, replyMarkup)
      : await telegram(env, 'sendMessage', {chat_id: env.TELEGRAM_CHAT_ID, text: caption, disable_web_page_preview: true, ...(replyMarkup ? {reply_markup: replyMarkup} : {})});
    if (!delivered) return json({ok: false, code: 'delivery_failed'}, 502);
  } catch (_) { return json({ok: false, code: 'delivery_failed'}, 502); }
  recentSubmissions.set(id, now);
  if (recentSubmissions.size > 1000) recentSubmissions.clear();
  if (design && photo) {
    try {
      const photoSent = await telegramPhoto(env, `Исходное фото к заказу ${id.slice(0, 8).toUpperCase()}`, id, photo, null);
      return json({ok: true, id, total, photoSent});
    } catch (_) { return json({ok: true, id, total, photoSent: false}); }
  }
  return json({ok: true, id, total, photoSent: true});
}

function leadText(lead) {
  const date = new Intl.DateTimeFormat('ru-RU', {
    timeZone: 'Asia/Tashkent', day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  }).format(new Date());
  const services = lead.services.map(id => id === 'consultation' ? 'Нужна консультация' : id).join(', ');
  return [
    `Новая заявка ColourWay · ${lead.id.slice(0, 8).toUpperCase()}`,
    `Имя: ${lead.name}`,
    `Контакт: ${lead.contact}`,
    `Услуги: ${services}`,
    lead.company ? `Компания: ${lead.company}` : null,
    lead.task ? `Задача: ${lead.task}` : null,
    `Язык сайта: ${lead.language.toUpperCase()}`,
    `Время: ${date} (Ташкент)`,
    'Статус: Новая'
  ].filter(Boolean).join('\n');
}

async function submitLead(request, env) {
  if (!configured(env)) return json({ok: false, code: 'not_configured'}, 503);
  const origin = request.headers.get('Origin');
  if (origin && origin !== new URL(request.url).origin) return json({ok: false, code: 'origin'}, 403);
  if (!request.headers.get('Content-Type')?.startsWith('application/json')) return json({ok: false, code: 'type'}, 415);
  if (Number(request.headers.get('Content-Length') || 0) > 6000) return json({ok: false, code: 'too_large'}, 413);
  let body;
  try {
    const raw = await request.text();
    if (raw.length > 6000) return json({ok: false, code: 'too_large'}, 413);
    body = JSON.parse(raw);
  } catch (_) { return json({ok: false, code: 'invalid_json'}, 400); }
  if (!body || typeof body !== 'object' || Array.isArray(body)) return json({ok: false, code: 'invalid'}, 400);
  if (body.website) return json({ok: true, id: null}); // Hidden field catches simple form spam.

  const id = clean(body.id, 36);
  const name = clean(body.name, 80);
  const contact = clean(body.contact, 80);
  const company = clean(body.company, 120);
  const task = clean(body.task, 2000);
  const language = ['ru','uz','en'].includes(body.language) ? body.language : 'ru';
  const services = Array.isArray(body.services) ? [...new Set(body.services)] : [];
  if (!/^[0-9a-f-]{36}$/i.test(id) || name.length < 2 || !validContact(contact) ||
      !services.length || services.length > SERVICE_IDS.size || services.some(item => !SERVICE_IDS.has(item)) ||
      (typeof body.name === 'string' && body.name.length > 80) ||
      (typeof body.contact === 'string' && body.contact.length > 80) ||
      (typeof body.company === 'string' && body.company.length > 120) ||
      (typeof body.task === 'string' && body.task.length > 2000)) {
    return json({ok: false, code: 'validation'}, 400);
  }
  if (recentSubmissions.has(id)) return json({ok: true, id, duplicate: true});

  const now = Date.now();
  const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
  const hits = (recentIPs.get(ip) || []).filter(time => now - time < 10 * 60 * 1000);
  if (hits.length >= 5) return json({ok: false, code: 'rate_limit'}, 429);
  hits.push(now); recentIPs.set(ip, hits);
  if (recentIPs.size > 1000) recentIPs.clear();

  const lead = {id, name, contact, company, task, language, services};
  const payload = {chat_id: env.TELEGRAM_CHAT_ID, text: leadText(lead), disable_web_page_preview: true};
  if (env.TELEGRAM_WEBHOOK_SECRET) {
    payload.reply_markup = {inline_keyboard: [[
      {text: 'Взять в работу', callback_data: `cw:${id}:working`},
      {text: 'Закрыть', callback_data: `cw:${id}:closed`}
    ]]};
  }
  try {
    if (!await telegram(env, 'sendMessage', payload)) return json({ok: false, code: 'delivery_failed'}, 502);
  } catch (_) { return json({ok: false, code: 'delivery_failed'}, 502); }
  recentSubmissions.set(id, now);
  if (recentSubmissions.size > 1000) recentSubmissions.clear();
  return json({ok: true, id});
}

async function telegramWebhook(request, env) {
  if (!env.TELEGRAM_WEBHOOK_SECRET || request.headers.get('X-Telegram-Bot-Api-Secret-Token') !== env.TELEGRAM_WEBHOOK_SECRET) {
    return json({ok: false}, 403);
  }
  let update;
  try { update = await request.json(); } catch (_) { return json({ok: false}, 400); }
  const callback = update.callback_query;
  if (!callback) return json({ok: true});
  const message = callback.message;
  if (String(message?.chat?.id) !== String(env.TELEGRAM_CHAT_ID)) return json({ok: true});
  const match = /^cw:([0-9a-f-]{36}):(working|closed)$/i.exec(callback.data || '');
  if (!match) return json({ok: true});
  const status = match[2] === 'working' ? 'В работе' : 'Закрыта';
  const isPhoto = Boolean(message.photo?.length || message.document);
  const text = String(message.text || message.caption || '').replace(/\nСтатус: .*$/s, '') + `\nСтатус: ${status}`;
  try {
    await telegram(env, isPhoto ? 'editMessageCaption' : 'editMessageText', {
      chat_id: message.chat.id, message_id: message.message_id, [isPhoto ? 'caption' : 'text']: text,
      reply_markup: {inline_keyboard: [[
        {text: 'Взять в работу', callback_data: `cw:${match[1]}:working`},
        {text: 'Закрыть', callback_data: `cw:${match[1]}:closed`}
      ]]}
    });
    await telegram(env, 'answerCallbackQuery', {callback_query_id: callback.id, text: status});
  } catch (_) { /* Telegram will retry the webhook. */ }
  return json({ok: true});
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const canonicalPages={
      '/index.html':'/',
      '/projects.html':'/projects',
      '/services.html':'/services',
      '/about.html':'/about',
      '/contact.html':'/contact',
      '/order.html':'/order'
    };
    if (request.method === 'GET' && canonicalPages[url.pathname]) {
      url.pathname=canonicalPages[url.pathname];
      return Response.redirect(url,301);
    }
    if (url.pathname === '/api/analytics-config' && request.method === 'GET') {
      const publicId=(value,pattern)=>typeof value==='string'&&pattern.test(value)?value:'';
      return new Response(JSON.stringify({
        ga4:publicId(env.GA4_MEASUREMENT_ID,/^G-[A-Z0-9]+$/),
        gtm:publicId(env.GTM_CONTAINER_ID,/^GTM-[A-Z0-9]+$/),
        yandex:publicId(env.YANDEX_METRIKA_ID,/^[0-9]{5,12}$/)
      }),{headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store'}});
    }
    if (url.pathname === '/api/lead-config' && request.method === 'GET') {
      return json({enabled: configured(env)});
    }
    if (url.pathname === '/api/leads' && request.method === 'POST') return submitLead(request, env);
    if (url.pathname === '/api/custom-orders' && request.method === 'POST') return submitCustomOrder(request, env);
    if (url.pathname === '/api/telegram/webhook' && request.method === 'POST') return telegramWebhook(request, env);
    if (url.pathname.startsWith('/api/')) return json({ok: false, code: 'not_found'}, 404);
    if (env.ASSETS?.fetch) {
      const canonicalHost=new URL(env.SEO_CANONICAL_ORIGIN||'https://colourway.uz').host;
      const previewHost=url.host!==canonicalHost;
      if(previewHost&&url.pathname==='/robots.txt')return new Response('User-agent: *\nDisallow: /\n',{headers:{'content-type':'text/plain; charset=utf-8'}});
      const directoryPage = request.method === 'GET' && (/^\/(?:services|projects)\/[a-z0-9-]+\/$/.test(url.pathname) || /^\/(?:en|uz)\/.*\/$/.test(url.pathname));
      const rootPage = request.method === 'GET' && ['/projects','/services','/about','/contact','/order'].includes(url.pathname);
      const staticPath = rootPage ? `${url.pathname}.html` : directoryPage ? `${url.pathname}index.html` : '';
      const assetRequest = staticPath ? new Request(new URL(staticPath, url), request) : request;
      const response = await env.ASSETS.fetch(assetRequest);
      if (response.status === 404 && request.method === 'GET' && request.headers.get('accept')?.includes('text/html')) {
        const fallback = await env.ASSETS.fetch(new Request(new URL('/404.html', request.url)));
        if (fallback.ok) return new Response(fallback.body, {status: 404, headers: {'content-type': 'text/html; charset=utf-8'}});
      }
      if(previewHost&&response.headers.get('content-type')?.includes('text/html')){
        const headers=new Headers(response.headers);headers.set('x-robots-tag','noindex, nofollow');
        return new Response(response.body,{status:response.status,statusText:response.statusText,headers});
      }
      return response;
    }
    return new Response('Static assets unavailable', {status: 503});
  }
};
