import {readFileSync, writeFileSync, mkdirSync, existsSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const dist=path.join(root,'dist');
const origin=(process.env.COLOURWAY_SITE_ORIGIN||'https://colourway.uz').replace(/\/$/,'');
const indexable=process.env.COLOURWAY_INDEXABLE==='1';
const encode=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const data={window:{}};
runInNewContext(readFileSync(path.join(dist,'data.js'),'utf8'),data);
const services=data.window.CW_DATA.services;
const projects=data.window.CW_DATA.projects;
const legacyWorks=JSON.parse(readFileSync(path.join(root,'data/legacy-works.json'),'utf8')).groups;
const byId=Object.fromEntries(services.map(s=>[s.id,s]));
const siteId=`${origin}/#organization`;
const websiteId=`${origin}/#website`;
const logo=`${origin}/assets/colourway-wordmark.svg`;
const image=`${origin}/assets/exhibition.webp`;
const company={
  '@context':'https://schema.org','@type':'LocalBusiness','@id':siteId,
  name:'ColourWay Design',url:origin,logo,image,
  telephone:'+998785550203',email:'info@colourway.uz',
  address:{'@type':'PostalAddress',streetAddress:'ТТЗ-2, квартал 2, дом 2',addressLocality:'Ташкент',addressCountry:'UZ'},
  areaServed:{'@type':'Country',name:'Uzbekistan'},
  sameAs:['https://t.me/colourway_CRM','https://www.instagram.com/colourway_uz/']
};
const schema=items=>`<script type="application/ld+json">${JSON.stringify(items).replace(/</g,'\\u003c')}</script>`;
const meta=(page)=>{
  const url=`${origin}${page.path}`;
  const tags=[
    `<link rel="canonical" href="${encode(url)}">`,
    `<meta property="og:type" content="website">`,
    `<meta property="og:site_name" content="ColourWay Design">`,
    `<meta property="og:locale" content="ru_UZ">`,
    `<meta property="og:title" content="${encode(page.title)}">`,
    `<meta property="og:description" content="${encode(page.description)}">`,
    `<meta property="og:url" content="${encode(url)}">`,
    `<meta property="og:image" content="${encode(page.image||image)}">`,
    `<meta name="twitter:card" content="summary_large_image">`,
    `<meta name="twitter:title" content="${encode(page.title)}">`,
    `<meta name="twitter:description" content="${encode(page.description)}">`,
    `<meta name="twitter:image" content="${encode(page.image||image)}">`,
    `<script src="/seo-analytics.js" defer></script>`
  ];
  if(page.robots) tags.push(`<meta name="robots" content="${page.robots}">`);
  else if(!indexable) tags.push('<meta name="robots" content="noindex,follow">');
  if(page.schema) tags.push(schema(page.schema));
  return tags.join('');
};

const core=[
  {file:'index.html',path:'/',title:'Наружная реклама в Ташкенте — ColourWay Design',description:'ColourWay Design проектирует и производит наружную рекламу, вывески, световые буквы, рекламные стенды и POS-материалы в Ташкенте. Обсудите ваш проект.',schema:[company,{'@context':'https://schema.org','@type':'WebSite','@id':websiteId,name:'ColourWay Design',url:origin,publisher:{'@id':siteId}}]},
  {file:'services.html',path:'/services',title:'Рекламное производство и услуги в Ташкенте — ColourWay',description:'Вывески, объёмные буквы, печать, POSM, оформление пространств и брендирование транспорта. Посмотрите услуги ColourWay Design и обсудите проект.'},
  {file:'projects.html',path:'/projects',title:'Портфолио рекламных работ — ColourWay Design',description:'Реальные работы ColourWay Design: вывески, рекламные конструкции, торговое оборудование, оформление пространств и транспорта в Ташкенте.'},
  {file:'about.html',path:'/about',title:'О компании ColourWay Design — рекламное производство',description:'Познакомьтесь с ColourWay Design: команда, собственное производство, проектирование и монтаж рекламных конструкций в Ташкенте.'},
  {file:'contact.html',path:'/contact',title:'Контакты ColourWay Design — Ташкент',description:'Свяжитесь с ColourWay Design в Ташкенте: +998 78 555 02 03, info@colourway.uz, ТТЗ-2, квартал 2, дом 2. Обсудите рекламный проект.'},
  {file:'order.html',path:'/order',title:'Создать макет и отправить заказ — ColourWay Design',description:'Соберите проект в конструкторе ColourWay, добавьте референсы и отправьте заявку на изготовление менеджеру.',robots:'noindex,follow'}
];
for(const page of core){
  let html=readFileSync(path.join(dist,page.file),'utf8');
  html=html.replace(/<title>[\s\S]*?<\/title>/,`<title>${encode(page.title)}</title>`)
    .replace(/<meta name="description" content="[^"]*">/,`<meta name="description" content="${encode(page.description)}">`);
  html=html.replace(/<meta property="og:[^>]+>|<meta name="twitter:[^>]+>|<meta name="robots" content="[^"]*">/g,'');
  html=html.replace('</head>',meta(page)+'</head>');
  html=html.replace(/^[\t ]+$/gm,'');
  writeFileSync(path.join(dist,page.file),html);
}
for(const file of ['designs.html','ziynat-variant.html','ziynat-services.html','ziynat-projects.html','ziynat-about.html','ziynat-contact.html','ziynat-order.html']){
  const p=path.join(dist,file);let html=readFileSync(p,'utf8');
  if(!html.includes('name="robots"'))html=html.replace('</head>','<meta name="robots" content="noindex,follow"></head>');
  writeFileSync(p,html);
}

// Each page has a distinct purpose; all claims below are grounded in the existing service catalog.
const offerings=[
  ['outdoor-advertising','Наружная реклама','Наружная реклама','Вывески и рекламные конструкции для фасадов и городских объектов.','outdoor'],
  ['signboards','Вывески и таблички','Вывески и таблички','Вывески и таблички для фасадов, офисов и торговых точек с учётом места размещения.','outdoor'],
  ['illuminated-letters','Световые буквы','Световые буквы','Буквы и логотипы со светом для заметного оформления фасада или интерьера.','letters'],
  ['3d-letters','Объёмные буквы и неон','Объёмные буквы и неон','Объёмные буквы, световые логотипы и неон для фасадов и интерьеров.','letters'],
  ['advertising-stands','Выставочные стенды','Выставочные стенды','Стенды для выставок и презентаций с продуманной конструкцией и графикой.','exhibition'],
  ['pos-materials','POSM и торговое оборудование','POSM и торговое оборудование','Стойки, дисплеи и промозоны для оформления мест продаж.','posm'],
  ['large-format-printing','Широкоформатная печать','Широкоформатная печать','Баннеры и графика для рекламных конструкций и оформления объектов.','print'],
  ['printing','Печать и полиграфия','Печать и полиграфия','Печатные материалы для бизнеса: каталоги, меню и фирменная продукция.','print'],
  ['vehicle-branding','Брендирование транспорта','Брендирование транспорта','Полная и частичная оклейка корпоративного транспорта.','transport'],
  ['advertising-structures','Рекламные конструкции','Рекламные конструкции','Световые короба и конструкции для наружной рекламы.','outdoor'],
  ['interior-branding','Комплексное оформление','Комплексное оформление','Витрины, интерьерная реклама и навигация в едином стиле.','complex'],
  ['lightboxes','Лайтбоксы','Лайтбоксы','Световые короба для рекламных вывесок и оформления объектов.','outdoor'],
  ['furniture-and-metalwork','Мебель и металлоконструкции','Мебель и металлоконструкции','Стойки ресепшн, витрины и конструкции для торговых и рабочих пространств.','furniture']
];
const servicePages=[];
for(const [slug,label,h1,intro,group] of offerings){
  const service=byId[group];const route=`/services/${slug}/`;const url=`${origin}${route}`;
  const title=slug==='outdoor-advertising'?'Производство наружной рекламы в Ташкенте — ColourWay Design':`${label} в Ташкенте — ColourWay Design`;
  const description=`${intro} ${service.description.ru} Обсудите изготовление с ColourWay Design в Ташкенте.`;
  const related=offerings.filter(x=>x[4]===group&&x[0]!==slug).slice(0,3);
  const serviceImage=slug==='large-format-printing'?'order-facade-banner.webp':slug==='printing'?'order-wide-format-print.webp':service.image;
  const photoUrl=`${origin}/assets/${serviceImage}`;
  const examples=projects.filter(project=>project.service===group||(slug==='printing'&&project.id==='wayfinding'));
  const references=examples.flatMap(project=>[
    {image:project.image,caption:project.subtitle.ru,brand:(project.brands||[]).join(', '),projectId:project.id},
    ...(project.gallery||[]).filter(photo=>photo.image).map(photo=>({
      image:photo.image,caption:photo.description?.ru||project.subtitle.ru,
      brand:(photo.brands||(!photo.related&&project.brands)||[]).join(', '),
      projectId:photo.related?null:project.id
    }))
  ]);
  if(slug==='large-format-printing')references.push(
    {image:'order-outdoor-print.webp',caption:'Печать для уличного ограждения'},
    {image:'order-facade-banner.webp',caption:'Баннер на фасаде'},
    {image:'order-store-banner.webp',caption:'Рекламный баннер для магазина'}
  );
  if(slug==='printing')references.push(
    {image:'menu-print-reference.webp',caption:'Меню для ресторана',note:'Иллюстративный макет'},
    {image:'order-facade-banner.webp',caption:'Баннер на фасаде'},
    {image:'order-store-banner.webp',caption:'Рекламный баннер для магазина'}
  );
  if(group==='outdoor')references.push(
    {image:'samarkand.webp',caption:'Объёмные буквы на фасаде',brand:'SAMAR Developers'},
    {image:'savdogar-bank-sign.webp',caption:'Световая вывеска',brand:'Savdogar Bank'}
  );
  if(group==='furniture')references.push(
    {image:'furniture-vitros-reception.webp',caption:'Стойка ресепшн',brand:'Vitros'}
  );
  if(slug==='interior-branding')references.push(
    {image:'complex-interior.webp',caption:'Оформление интерьера'}
  );
  const allowedImages={
    '3d-letters':['chodir.webp','samarkand.webp','silkway.webp','neon-bear.webp','neon-pnx.webp','aker.webp','savdogar-bank-sign.webp','sparkle-sign.webp'],
    'interior-branding':['complex-interior.webp'],
    'lightboxes':[],
    'printing':['wayfinding.webp','print-office-signs.webp','print-door-labels.webp','menu-print-reference.webp','order-facade-banner.webp','order-store-banner.webp']
  };
  const allowed=allowedImages[slug];
  const uniqueReferences=[...new Map(references.filter(reference=>!allowed||allowed.includes(reference.image)).map(reference=>[reference.image,reference])).values()].slice(0,6);
  const workGroups=legacyWorks.filter(group=>group.route===slug);
  const serviceSchema={'@context':'https://schema.org','@type':'Service','@id':`${url}#service`,name:h1,description:intro,provider:{'@id':siteId},areaServed:{'@type':'Place',name:'Ташкент, Узбекистан'},url};
  const crumbs={'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:[
    {'@type':'ListItem',position:1,name:'Главная',item:origin+'/'},
    {'@type':'ListItem',position:2,name:'Услуги',item:origin+'/services'},
    {'@type':'ListItem',position:3,name:label,item:url}
  ]};
  const html=`<!doctype html><html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#991427"><title>${encode(title)}</title><meta name="description" content="${encode(description)}"><link rel="icon" href="../../assets/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="../../ziynat-variant.css"><link rel="stylesheet" href="../../ziynat-pages.css"><link rel="stylesheet" href="../../seo.css">${meta({path:route,title,description,image:photoUrl,schema:[serviceSchema,crumbs]})}</head><body class="seo-service-page"><header class="site-header"><div class="wrap header-inner"><a class="brand" href="../../" aria-label="ColourWay Design — главная"><img src="../../assets/colourway-wordmark.svg" width="249" height="78" alt="ColourWay Design"></a><nav class="site-nav" aria-label="Основная навигация"><a href="../../projects">Проекты</a><a href="../../services" aria-current="page">Услуги</a><a href="../../about">О нас</a><a href="../../contact">Контакты</a></nav><a class="header-order" href="../../order#order-builder">Создать проект</a><a class="header-phone" href="tel:+998785550203">+998 78 555 02 03</a></div></header><main><div class="wrap seo-breadcrumbs"><a href="../../">Главная</a><span>/</span><a href="../../services">Услуги</a><span>/</span><span>${encode(label)}</span></div><section class="wrap seo-service"><div class="seo-service-copy"><p class="seo-kicker">COLOURWAY DESIGN · ТАШКЕНТ</p><h1>${encode(h1)}</h1><p class="seo-lead">${encode(intro)}</p><p>${encode(service.description.ru)}</p><a class="button button-wine" href="../../order#order-builder">Обсудить проект</a></div><div class="seo-service-photo"><img src="../../assets/${encode(serviceImage)}" alt="${encode(label)} — пример работы ColourWay Design" width="1200" height="900" fetchpriority="high"></div></section><section class="wrap seo-details"><div><h2>От идеи до монтажа</h2><p>Уточняем задачу и место размещения, готовим визуальное решение, согласовываем материалы, производим и монтируем изделие.</p></div><div><h2>Что влияет на расчёт</h2><p>Стоимость зависит от размеров, конструкции, материалов и особенностей монтажа. Точные параметры согласуем после получения заявки.</p><a href="../../order#order-builder">Создать макет и отправить заявку</a></div></section><section class="wrap seo-related"><h2>Смежные услуги</h2><div>${(related.length?related:offerings.filter(x=>x[0]!==slug).slice(0,3)).map(x=>`<a href="../${x[0]}/">${encode(x[1])}</a>`).join('')}</div></section></main><footer class="site-footer"><div class="wrap seo-footer"><span>ColourWay Design · Ташкент</span><a href="tel:+998785550203">+998 78 555 02 03</a><a href="mailto:info@colourway.uz">info@colourway.uz</a></div></footer></body></html>`;
  const projectLinks=uniqueReferences.length?`<section class="wrap seo-examples"><h2>${['large-format-printing','printing'].includes(slug)?'Референсы':'Примеры работ'}</h2><div class="seo-examples-grid">${uniqueReferences.map(reference=>{
    const preview=reference.image.replace(/\.webp$/, '-preview.webp');
    const photo=existsSync(path.join(dist,'assets',preview))?preview:reference.image;
    return `<article class="seo-example"><a class="seo-example-photo" href="../../assets/${encode(reference.image)}" target="_blank" rel="noopener"><img src="../../assets/${encode(photo)}" alt="${encode(reference.caption)}" width="600" height="600" loading="lazy"></a><div class="seo-example-caption"><p>${encode(reference.caption)}</p>${reference.brand?`<small>${encode(reference.brand)}</small>`:''}${reference.note?`<small>${encode(reference.note)}</small>`:''}${reference.projectId?`<a href="../../projects/${encode(reference.projectId)}/">Подробнее о проекте</a>`:''}</div></article>`;
  }).join('')}</div></section>`:'';
  const workArchive=workGroups.length?`<section class="wrap seo-archive" id="works"><h2>Другие</h2><p class="seo-archive-intro">Откройте фотографию, чтобы рассмотреть работу целиком.</p>${workGroups.map(group=>`<section class="seo-archive-group" id="archive-${encode(group.key)}"><h3>${encode(group.title.ru)}</h3><div class="seo-archive-grid">${group.images.map((photo,index)=>`<a href="../../assets/${encode(photo.file)}" data-work-photo target="_blank" rel="noopener"><img src="../../assets/${encode(photo.file.replace(/\.webp$/,'-preview.webp'))}" alt="${encode(group.title.ru)} — фото ${index+1}" width="640" height="640" loading="lazy" decoding="async"></a>`).join('')}</div></section>`).join('')}<dialog class="seo-archive-dialog" aria-label="Фотография работы"><button class="seo-archive-close" type="button" data-work-close aria-label="Закрыть">×</button><img data-work-large alt=""><div class="seo-archive-controls"><button type="button" data-work-prev>Назад</button><span data-work-count aria-live="polite"></span><button type="button" data-work-next>Далее</button></div></dialog></section>`:'';
  const withArchiveScript=workGroups.length?html.replace('</head>','<script src="/legacy-gallery.js" defer></script></head>'):html;
  const dir=path.join(dist,'services',slug);mkdirSync(dir,{recursive:true});writeFileSync(path.join(dir,'index.html'),withArchiveScript.replace('</main>',projectLinks+workArchive+'</main>'));
  servicePages.push(route);
}
const projectPages=[];
const projectServices={outdoor:'outdoor-advertising',letters:'3d-letters',transport:'vehicle-branding',posm:'pos-materials',print:'large-format-printing',exhibition:'advertising-stands',complex:'interior-branding',furniture:'furniture-and-metalwork'};
for(const project of projects){
  if(!project.id||!project.description?.ru||!project.image)continue;
  const route=`/projects/${project.id}/`;const url=origin+route;
  const work=project.subtitle.ru;const title=`${work} — проект ColourWay Design`;
  const description=`${project.description.ru} Посмотрите фотографии выполненной работы ColourWay Design.`;
  const images=[project.image,...(project.gallery||[]).filter(photo=>!photo.related).map(photo=>photo.image)].filter(Boolean);
  const serviceRoute=projectServices[project.service];
  const brands=[...new Set([...(project.brands||[]),...(project.gallery||[]).flatMap(photo=>photo.brands||[])])];
  const crumbs={'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:[
    {'@type':'ListItem',position:1,name:'Главная',item:origin+'/'},
    {'@type':'ListItem',position:2,name:'Проекты',item:origin+'/projects'},
    {'@type':'ListItem',position:3,name:work,item:url}
  ]};
  const gallery=images.map((name,index)=>`<img src="../../assets/${encode(name)}" alt="${encode(index===0?work:`${work} — фото ${index+1}`)}" ${index?'loading="lazy"':''} width="1200" height="900">`).join('');
  const html=`<!doctype html><html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#991427"><title>${encode(title)}</title><meta name="description" content="${encode(description)}"><link rel="icon" href="../../assets/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="../../ziynat-variant.css"><link rel="stylesheet" href="../../ziynat-pages.css"><link rel="stylesheet" href="../../seo.css">${meta({path:route,title,description,image:`${origin}/assets/${project.image}`,schema:[crumbs]})}</head><body class="seo-service-page"><header class="site-header"><div class="wrap header-inner"><a class="brand" href="../../" aria-label="ColourWay Design — главная"><img src="../../assets/colourway-wordmark.svg" width="249" height="78" alt="ColourWay Design"></a><nav class="site-nav" aria-label="Основная навигация"><a href="../../projects" aria-current="page">Проекты</a><a href="../../services">Услуги</a><a href="../../about">О нас</a><a href="../../contact">Контакты</a></nav><a class="header-order" href="../../order#order-builder">Создать проект</a><a class="header-phone" href="tel:+998785550203">+998 78 555 02 03</a></div></header><main><div class="wrap seo-breadcrumbs"><a href="../../">Главная</a><span>/</span><a href="../../projects">Проекты</a><span>/</span><span>${encode(work)}</span></div><section class="wrap seo-service"><div class="seo-service-copy"><p class="seo-kicker">РЕАЛЬНЫЙ ПРОЕКТ · COLOURWAY DESIGN</p><h1>${encode(work)}</h1><p class="seo-lead">${encode(project.description.ru)}</p>${brands.length?`<p>Бренды: ${encode(brands.join(', '))}</p>`:''}${serviceRoute?`<p><a href="../../services/${serviceRoute}/">Услуга по этому направлению</a></p>`:''}<a class="button button-wine" href="../../order#order-builder">Обсудить похожий проект</a></div><div class="seo-project-gallery">${gallery}</div></section></main><footer class="site-footer"><div class="wrap seo-footer"><span>ColourWay Design · Ташкент</span><a href="tel:+998785550203">+998 78 555 02 03</a><a href="mailto:info@colourway.uz">info@colourway.uz</a></div></footer></body></html>`;
  const dir=path.join(dist,'projects',project.id);mkdirSync(dir,{recursive:true});writeFileSync(path.join(dir,'index.html'),html);
  projectPages.push(route);
}
writeFileSync(path.join(dist,'robots.txt'),indexable?`User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`:'User-agent: *\nDisallow: /\n');
const urls=[...core.filter(p=>!p.robots).map(p=>p.path),...servicePages,...projectPages];
writeFileSync(path.join(dist,'sitemap.xml'),`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(p=>`  <url><loc>${encode(origin+p)}</loc></url>`).join('\n')}\n</urlset>\n`);
writeFileSync(path.join(dist,'404.html'),`<!doctype html><html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Страница не найдена — ColourWay Design</title><link rel="stylesheet" href="/seo.css"></head><body class="seo-not-found"><main><h1>Страница не найдена</h1><p>Проверьте адрес или вернитесь на главную страницу.</p><a href="/">На главную</a></main></body></html>`);
console.log(`SEO: ${core.length} core pages, ${servicePages.length} service pages, ${projectPages.length} project pages, sitemap.xml`);
export {core,offerings,origin,siteId};
