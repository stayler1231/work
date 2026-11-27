import test from 'node:test';
import assert from 'node:assert/strict';
import worker from '../server/lead-worker.mjs';

const base = 'https://colourway.example';
const env = {TELEGRAM_BOT_TOKEN:'test-token',TELEGRAM_CHAT_ID:'123456789',TELEGRAM_WEBHOOK_SECRET:'test-secret'};
const baseItems = [
  {type:'banner_frame',width:2,height:1.5,unit:'m',quantity:2},
  {type:'sign',size:'30x12',quantity:3}
];
function order(fields = {}, ip = '198.51.100.70') {
  const form = new FormData();
  const defaults = {id:'77777777-2222-4333-8444-555555555555',name:'Алина',contact:'+998 90 123 45 67',note:'Матовый пластик, бюджет до 600 000 сум',language:'ru',items:JSON.stringify(baseItems)};
  for (const [key,value] of Object.entries({...defaults,...fields})) {
    if (value != null) form.set(key,value);
  }
  return new Request(`${base}/api/custom-orders`,{method:'POST',headers:{Origin:base,'CF-Connecting-IP':ip},body:form});
}

test('sends a preliminary total, dimensions and customer preferences', async () => {
  const sent=[];const old=globalThis.fetch;
  globalThis.fetch=async (url,options)=>{sent.push({url,payload:JSON.parse(options.body)});return new Response(JSON.stringify({ok:true}),{status:200});};
  try {
    const response=await worker.fetch(order(),env);
    assert.equal(response.status,200);
    assert.equal((await response.json()).total, 630000);
    assert.match(sent[0].payload.text,/2 × 1,5 м/);
    assert.match(sent[0].payload.text,/Табличка \(30×12 см\) × 3/);
    assert.match(sent[0].payload.text,/Пожелания: Матовый пластик, бюджет до 600 000 сум/);
    assert.match(sent[0].payload.text,/Материалы и стоимость: согласовать с клиентом/);
    assert.match(sent[0].payload.text,/Предварительная стоимость: от 630\s000 сум/);
    assert.doesNotMatch(sent[0].payload.text,/× 3 —/);
    assert.match(sent[0].url,/sendMessage$/);
    const duplicate=await worker.fetch(order(),env);
    assert.equal((await duplicate.json()).duplicate,true);
    assert.equal(sent.length,1);
  } finally {globalThis.fetch=old;}
});

test('delivers requests without products using name and contact details', async () => {
  const sent = [];
  const oldFetch = globalThis.fetch;
  globalThis.fetch = async (url, {body}) => {
    sent.push({url, body});
    return Response.json({ok: true});
  };
  try {
    const response = await worker.fetch(order({id: '65555555-2222-4333-8444-555555555555', items: '[]', note: null}), env);
    assert.equal(response.status, 200);
    assert.equal((await response.json()).total, 0);
    assert.match(sent[0].url, /sendMessage$/);
    const message = JSON.parse(sent[0].body).text;
    assert.match(message, /^Новая заявка ColourWay/);
    assert.match(message, /Имя: Алина/);
    assert.match(message, /Контакт: \+998 90 123 45 67/);
    assert.match(message, /Изделия не выбраны/);
    assert.doesNotMatch(message, /Предварительная стоимость/);

    const photo = new Blob([new Uint8Array([0xff, 0xd8, 0xff, 0xe0])], {type: 'image/jpeg'});
    const withPhoto = await worker.fetch(order({
      id: '75555555-2222-4333-8444-555555555555', items: null, photo,
      note: 'Нужна консультация по оформлению',
    }), env);
    assert.equal(withPhoto.status, 200);
    assert.match(sent[1].url, /sendPhoto$/);
    assert.match(sent[1].body.get('caption'), /Пожелания: Нужна консультация по оформлению/);

    const withoutContact = await worker.fetch(order({items: '[]', contact: null}), env);
    assert.equal(withoutContact.status, 400);
    const malformed = await worker.fetch(order({items: '{}'}), env);
    assert.equal(malformed.status, 400);
    assert.equal(sent.length, 2);
  } finally {
    globalThis.fetch = oldFetch;
  }
});

test('forwards a valid photo and rejects invalid order details', async () => {
  const sent=[];const old=globalThis.fetch;
  globalThis.fetch=async (url,options)=>{sent.push({url,body:options.body});return new Response(JSON.stringify({ok:true}),{status:200});};
  try {
    const photo=new Blob([new Uint8Array([0xff,0xd8,0xff,0xe0,1,2,3])],{type:'image/jpeg'});
    const response=await worker.fetch(order({id:'88888888-2222-4333-8444-555555555555',photo},'198.51.100.71'),env);
    assert.equal(response.status,200);
    assert.match(sent[0].url,/sendPhoto$/);
    assert.equal(sent[0].body.get('photo').type,'image/jpeg');
    assert.match(sent[0].body.get('caption'),/Материалы и стоимость: согласовать с клиентом/);
    assert.equal((await worker.fetch(order({id:'99999999-2222-4333-8444-555555555555',items:JSON.stringify([{type:'banner',width:0,height:1,quantity:1}])},'198.51.100.72'),env)).status,400);
    for (const dimensions of [{width: 101.5, height: 100, unit: 'cm'}, {width: 100, height: 100, unit: 'mm'}]) {
      const items = JSON.stringify([{type: 'banner', quantity: 1, ...dimensions}]);
      assert.equal((await worker.fetch(order({items},'198.51.100.72'),env)).status, 400);
    }
    assert.equal((await worker.fetch(order({id:'aaaaaaaa-2222-4333-8444-555555555555',photo:new Blob(['not an image'],{type:'image/jpeg'})},'198.51.100.73'),env)).status,400);
    assert.equal(sent.length,1);
  } finally {globalThis.fetch=old;}
});

test('status buttons update a photo caption', async () => {
  const sent=[];const old=globalThis.fetch;
  globalThis.fetch=async (url,options)=>{sent.push({url,payload:JSON.parse(options.body)});return new Response(JSON.stringify({ok:true}),{status:200});};
  try {
    const callback={callback_query:{id:'cb1',data:'cw:88888888-2222-4333-8444-555555555555:working',message:{chat:{id:123456789},message_id:42,photo:[{file_id:'photo'}],caption:'Новый заказ\nСтатус: Новая'}}};
    const response=await worker.fetch(new Request(`${base}/api/telegram/webhook`,{method:'POST',headers:{'X-Telegram-Bot-Api-Secret-Token':'test-secret'},body:JSON.stringify(callback)}),env);
    assert.equal(response.status,200);
    assert.match(sent[0].url,/editMessageCaption$/);
    assert.match(sent[0].payload.caption,/Статус: В работе/);
  } finally {globalThis.fetch=old;}
});

test('sends WebP references as documents so Telegram accepts the format', async () => {
  const sent=[];const old=globalThis.fetch;
  globalThis.fetch=async (url,options)=>{sent.push({url,body:options.body});return new Response(JSON.stringify({ok:true}),{status:200});};
  try {
    const webp=new Blob([new Uint8Array([82,73,70,70,0,0,0,0,87,69,66,80])],{type:'image/webp'});
    const response=await worker.fetch(order({id:'bbbbbbbb-2222-4333-8444-555555555555',photo:webp},'198.51.100.74'),env);
    assert.equal(response.status,200);
    assert.match(sent[0].url,/sendDocument$/);
    assert.equal(sent[0].body.get('document').type,'image/webp');
  } finally {globalThis.fetch=old;}
});

test('accepts centimetres and requests from older catalogue tabs', async () => {
  const sent=[];
  const old=globalThis.fetch;
  globalThis.fetch=async (_url, options) => {
    sent.push(JSON.parse(options.body).text);
    return new Response(JSON.stringify({ok:true}),{status:200});
  };
  try {
    const items=[
      {type:'banner',width:1.15,height:1,quantity:1},
      {type:'banner_frame',width:101,height:150,unit:'cm',quantity:1},
      {type:'sign_dual',size:'30x15',finish:'silver',quantity:1},
      {type:'sign_acrylic',size:'30x12',quantity:1},
      {type:'badge',quantity:1}
    ];
    const response=await worker.fetch(order({id:'cccccccc-2222-4333-8444-555555555555',items:JSON.stringify(items)},'198.51.100.75'),env);
    assert.equal(response.status,200);
    assert.equal((await response.json()).total, 307200);
    assert.match(sent[0], /1,15 × 1 м/);
    assert.match(sent[0], /101 × 150 см/);
    assert.match(sent[0], /Табличка \(30×15 см\)/);
    assert.match(sent[0], /Предварительная стоимость: от 307\s200 сум/);
    assert.doesNotMatch(sent[0], /серебро|акриловая/i);
  } finally {globalThis.fetch=old;}
});

test('accepts an individual project with a mockup for a quote', async () => {
  const sent=[]; const old=globalThis.fetch;
  globalThis.fetch=async (url,options)=>{sent.push({url,body:options.body});return new Response(JSON.stringify({ok:true}),{status:200});};
  try {
    const design=new Blob([new Uint8Array([0xff,0xd8,0xff,0xe0,1,2,3])],{type:'image/jpeg'});
    const items=[{type:'custom',title:'Неоновая вывеска для кафе',quantity:1}];
    const response=await worker.fetch(order({id:'edededed-2222-4333-8444-555555555555',items:JSON.stringify(items),design,language:'en'},'198.51.100.85'),env);
    assert.equal(response.status,200);
    assert.equal((await response.json()).total, 0);
    assert.match(sent[0].url,/sendPhoto$/);
    assert.match(sent[0].body.get('caption'),/Неоновая вывеска для кафе/);
    assert.match(sent[0].body.get('caption'),/Предварительная стоимость: по согласованию/);
    assert.match(sent[0].body.get('caption'),/Материалы и стоимость: согласовать с клиентом/);
    assert.match(sent[0].body.get('caption'),/Язык сайта: EN/);
    const invalid=await worker.fetch(order({id:'fdfdfdfd-2222-4333-8444-555555555555',items:JSON.stringify([{type:'custom',title:' ',quantity:1}])},'198.51.100.86'),env);
    assert.equal(invalid.status,400);
  } finally {globalThis.fetch=old;}
});

test('delivers the customer mockup and the source photo with the same order', async () => {
  const sent=[];const old=globalThis.fetch;
  globalThis.fetch=async (url,options)=>{sent.push({url,body:options.body});return new Response(JSON.stringify({ok:true}),{status:200});};
  try {
    const image=new Blob([new Uint8Array([0xff,0xd8,0xff,0xe0,1,2,3])],{type:'image/jpeg'});
    const response=await worker.fetch(order({id:'dddddddd-2222-4333-8444-555555555555',design:image,photo:image},'198.51.100.76'),env);
    assert.equal(response.status,200);
    assert.equal((await response.json()).photoSent,true);
    assert.equal(sent.length,2);
    assert.match(sent[0].body.get('caption'),/Макет клиента: приложен/);
    assert.match(sent[1].body.get('caption'),/Исходное фото к заказу/);
  } finally {globalThis.fetch=old;}
});

test('reports a partial delivery if the extra reference photo fails', async () => {
  let calls=0;const old=globalThis.fetch;
  globalThis.fetch=async () => new Response(JSON.stringify({ok:++calls===1}),{status:calls===1?200:502});
  try {
    const image=new Blob([new Uint8Array([0xff,0xd8,0xff,0xe0,1,2,3])],{type:'image/jpeg'});
    const response=await worker.fetch(order({id:'eeeeeeee-2222-4333-8444-555555555555',design:image,photo:image},'198.51.100.77'),env);
    assert.equal(response.status,200);
    assert.equal((await response.json()).photoSent,false);
    assert.equal(calls,2);
  } finally {globalThis.fetch=old;}
});
