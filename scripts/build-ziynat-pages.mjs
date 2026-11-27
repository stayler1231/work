import {existsSync, readFileSync, writeFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
import {fileURLToPath} from 'node:url';
import path from 'node:path';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const dist=path.join(root,'dist');
const sandbox={window:{}};
runInNewContext(readFileSync(path.join(dist,'data.js'),'utf8'),sandbox);
const {projects,services}=sandbox.window.CW_DATA;
const legacyWorks=JSON.parse(readFileSync(path.join(root,'data/legacy-works.json'),'utf8')).groups;
const escape=value=>String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const local=value=>typeof value==='string'?value:value.ru;
const preview=image=>{const file=image.replace(/\.webp$/,'-preview.webp');return existsSync(path.join(dist,'assets',file))?file:image;};
const nav=[['projects','Проекты'],['services','Услуги'],['about','О нас'],['contact','Контакты']];
const navLinks=active=>nav.map(([id,label])=>`<a href="ziynat-${id}.html"${id===active?' aria-current="page"':''}>${label}</a>`).join('');
const header=active=>`<div class="concept-bar"><span>КОНЦЕПЦИЯ 04 <i></i> ФОТОГРАФИЯ / ПРОИЗВОДСТВО</span><a href="designs.html">← Все варианты</a></div><header class="site-header" id="top"><div class="wrap header-inner"><a class="brand" href="ziynat-variant.html" aria-label="ColourWay Design — главная"><img src="assets/colourway-wordmark.svg" alt="ColourWay Design" width="249" height="78"></a><nav class="site-nav" aria-label="Основная навигация">${navLinks(active)}</nav><a class="header-order" href="order.html#order-builder">Создать проект <span aria-hidden="true">↗</span></a><a class="header-phone" href="tel:+998785550203">+998 78 555 02 03</a><button class="menu-toggle" type="button" aria-label="Открыть меню" aria-expanded="false" aria-controls="variant-mobile-nav"><span></span><span></span></button></div><nav class="mobile-nav" id="variant-mobile-nav" aria-label="Мобильная навигация" hidden>${navLinks(active)}<a href="order.html#order-builder">Создать проект ↗</a></nav></header>`;
const footer=`<footer class="site-footer"><div class="wrap footer-inner"><a class="brand" href="ziynat-variant.html" aria-label="ColourWay Design — главная"><img src="assets/colourway-wordmark.svg" alt="ColourWay Design" width="249" height="78"></a><div class="footer-contact"><a href="tel:+998785550203">+998 78 555 02 03</a><a href="mailto:info@colourway.uz">info@colourway.uz</a></div><p>Ташкент, Мирзо-Улугбекский район,<br>ТТЗ-2, квартал 2, дом 2</p><a href="designs.html">Все варианты дизайна ↗</a></div></footer>`;
const cta=`<section class="final-cta"><div class="wrap final-inner"><div><span class="eyebrow light"><span class="eyebrow-line"></span> ПОРА НАЧАТЬ</span><h2>Ваш проект может<br>стать следующим.</h2></div><a class="button button-white" href="order.html#order-builder">Собрать проект <span aria-hidden="true">↗</span></a></div></section>`;
function page(id,title,description,heroImage,kicker,heading,lead,body,extra=''){
 const heroPhoto=preview(heroImage)===heroImage
  ? `<img src="assets/${heroImage}" alt="" fetchpriority="high">`
  : `<picture><source media="(max-width:760px)" srcset="assets/${preview(heroImage)}"><img src="assets/${heroImage}" alt="" fetchpriority="high"></picture>`;
 const html=`<!doctype html><html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#991427"><meta name="description" content="${escape(description)}"><title>${escape(title)} — ColourWay Design · Концепция 04</title><link rel="icon" href="assets/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="ziynat-variant.css"><link rel="stylesheet" href="ziynat-pages.css"><script src="data.js" defer></script><script src="en.js" defer></script><script src="ziynat-i18n.js" defer></script><script src="ziynat-variant.js" defer></script><script src="sw-register.js" defer></script>${extra}</head><body>${header(id)}<main id="main"><section class="subhero">${heroPhoto}<div class="wrap subhero-content"><span class="eyebrow light"><span class="eyebrow-line"></span> ${kicker}</span><h1>${heading}</h1><p>${lead}</p></div></section>${body}${cta}</main>${footer}</body></html>`;
 writeFileSync(path.join(dist,`ziynat-${id}.html`),html.replaceAll('href="order.html#order-builder"','href="ziynat-order.html#order-builder"'));
}

const categoryNames={outdoor:'Вывески и неон',retail:'POSM и ритейл',spaces:'Пространства',transport:'Транспорт'};
const filters=`<div class="portfolio-filters" role="group" aria-label="Фильтр проектов"><button type="button" data-filter="all" aria-pressed="true">Все проекты</button>${Object.entries(categoryNames).map(([id,name])=>`<button type="button" data-filter="${id}" aria-pressed="false">${name}</button>`).join('')}</div>`;
const cards = projects.map(project => {
  const titleId = escape(`portfolio-title-${project.id}`);
  const brandsId = escape(`portfolio-brands-${project.id}`);
  const brands = [...new Set([
    ...(project.brands ?? []),
    ...(project.gallery ?? []).flatMap(photo => photo.brands ?? [])
  ])].join(' · ');
  return `
  <a class="portfolio-card" id="${escape(project.id)}" href="projects/${escape(project.id)}/" data-project="${escape(project.id)}" data-category="${escape(project.category)}" aria-haspopup="dialog" aria-controls="project-dialog" aria-labelledby="${titleId}"${brands ? ` aria-describedby="${brandsId}"` : ''}>
    <div class="portfolio-photo">
      <img src="assets/${escape(preview(project.image))}" alt="${escape(local(project.subtitle))}" loading="lazy" decoding="async">
      <span class="portfolio-category">${escape(categoryNames[project.category])}</span>
    </div>
    <div class="portfolio-info">
      <div>
        <h2 id="${titleId}">${escape(local(project.subtitle))}</h2>${brands ? `
        <p id="${brandsId}">${escape(brands)}</p>` : ''}
      </div>
      <b aria-hidden="true">↗</b>
    </div>
  </a>`;
}).join('');
const photoControls = `<div class="gallery-controls">
    <button type="button" data-gallery-previous aria-label="Предыдущее фото">←</button>
    <span aria-live="polite" aria-atomic="true" data-gallery-count></span>
    <button type="button" data-gallery-next aria-label="Следующее фото">→</button>
  </div>`;

const projectDialog = `<dialog class="variant-dialog portfolio-dialog" id="project-dialog" aria-labelledby="dialog-title" aria-describedby="dialog-brand dialog-description">
  <button class="dialog-close" type="button" data-close-dialog aria-label="Закрыть" autofocus>×</button>
  <div class="portfolio-dialog-media">
    <div class="portfolio-dialog-stage"><img id="dialog-image" alt=""></div>
    <div class="portfolio-dialog-toolbar">
      <p id="dialog-photo-caption" class="portfolio-dialog-caption" hidden></p>
      ${photoControls}
    </div>
  </div>
  <div class="dialog-copy">
    <span class="eyebrow" id="dialog-category"></span>
    <h2 id="dialog-title"></h2>
    <p id="dialog-brand" class="dialog-brands" hidden></p>
    <p id="dialog-description"></p>
    <a class="button button-wine" href="order.html#order-builder">Хочу похожий проект ↗</a>
  </div>
</dialog>`;

const archiveCards=legacyWorks.map(group=>{
  const previewImage=(group.cover||group.images[0].file).replace(/\.webp$/,'-preview.webp');
  return `<a class="archive-overview-card" href="services/${escape(group.route)}/#archive-${escape(group.key)}"><img src="assets/${escape(previewImage)}" alt="${escape(group.title.ru)}" width="640" height="640" loading="lazy"><div><strong>${escape(group.title.ru)}</strong><span>Смотреть работы</span></div></a>`;
}).join('');
const archiveOverview=`<section class="section archive-overview"><div class="wrap"><div class="section-heading"><div><h2>Все работы <em>по направлениям.</em></h2></div><p>Откройте направление, чтобы посмотреть все фотографии.</p></div><div class="archive-overview-grid">${archiveCards}</div></div></section>`;

page('projects','Проекты','Реализованные проекты ColourWay: вывески, POSM, пространства и транспорт.','baraka-original.webp','01 / ПРОЕКТЫ','Результат, который<br><em>видно.</em>','Реальные работы ColourWay — от отдельных букв до оформления целого пространства.',`<section class="section portfolio-section"><div class="wrap"><div class="section-heading"><div><span class="eyebrow"><span class="eyebrow-line"></span> ВЫБРАННЫЕ РАБОТЫ</span><h2>Идеи в <em>городе.</em></h2></div><p>Выберите направление и посмотрите, как решения работают на разных объектах.</p></div>${filters}<div class="portfolio-grid">${cards}</div><p class="portfolio-empty" hidden>В этом разделе пока нет проектов.</p></div></section>${archiveOverview}${projectDialog}`);

const serviceExamples = {
  outdoor: ['intermed.webp', 'hotel-original.webp'],
  letters: ['aker.webp', 'neon-pnx.webp'],
  transport: ['transport-vitros-front.webp', 'transport-home-cleaning.webp'],
  posm: ['doshirak.webp', 'mountain-dew.webp'],
  print: ['print-office-signs.webp', 'print-door-labels.webp'],
  'wide-format': ['order-facade-banner.webp', 'order-store-banner.webp'],
  exhibition: ['exhibition-side-view.webp'],
  complex: ['complex-interior.webp', 'pepsi.webp'],
  furniture: ['furniture-vitros-reception.webp', 'furniture-workspace.webp']
};
const serviceRoutes={outdoor:'outdoor-advertising',letters:'3d-letters',transport:'vehicle-branding',posm:'pos-materials',print:'printing','wide-format':'large-format-printing',exhibition:'advertising-stands',complex:'interior-branding',furniture:'furniture-and-metalwork'};

const displayedServices=services.flatMap(service=>service.id==='print'?[
  {...service,description:{ru:'Интерьерные таблички, навигация и печатные материалы для офисов и торговых пространств.'},tags:{ru:['Таблички','Навигация','Полиграфия']}},
  {id:'wide-format',title:{ru:'Широкоформатная печать'},description:{ru:'Баннеры для фасадов, магазинов и уличных конструкций. Подготовим изображение и напечатаем его под нужный размер.'},image:'order-outdoor-print.webp',tags:{ru:['Баннеры','Фасады','Уличная реклама']}}
]:[service]);

const serviceCards = displayedServices.map((service, index) => {
  const title = escape(service.title.ru);
  const photos = [service.image, ...(serviceExamples[service.id] ?? [])].map((image, photoIndex) => `
    <a class="service-gallery-photo${photoIndex === 0 ? ' service-gallery-cover' : ''}" href="assets/${escape(image)}" data-service-photo aria-haspopup="dialog" aria-controls="service-gallery-dialog" aria-label="Открыть фото ${photoIndex + 1} — ${title}">
      <img src="assets/${escape(preview(image))}" alt="" loading="lazy" decoding="async">${photoIndex === 0 ? '\n      <span class="service-gallery-expand" aria-hidden="true">↗</span>' : ''}
    </a>`);

  return `<article class="detail-service" id="${escape(service.id)}">
    <div class="detail-service-gallery" data-service-gallery>${photos[0]}${photos.length > 1 ? `
      <div class="service-gallery-thumbs">${photos.slice(1).join('')}</div>` : ''}
    </div>
    <div class="detail-service-copy">
      <span class="eyebrow"><span class="eyebrow-line"></span> ${String(index + 1).padStart(2, '0')} / УСЛУГА</span>
      <h2><a href="services/${serviceRoutes[service.id]}/">${title}</a></h2>
      <p>${escape(service.description.ru)}</p>
      <div class="service-tags">${service.tags.ru.map(tag => `<span>${escape(tag)}</span>`).join('')}</div>
      <a class="text-link" href="order.html#order-builder">Обсудить проект <span aria-hidden="true">↗</span></a>
    </div>
  </article>`;
}).join('');

const serviceGalleryDialog = `<dialog class="variant-dialog service-gallery-dialog" id="service-gallery-dialog" aria-labelledby="service-gallery-title">
  <button class="dialog-close" type="button" data-close-dialog aria-label="Закрыть" autofocus>×</button>
  <div class="service-gallery-stage"><img alt="" data-gallery-image></div>
  <div class="service-gallery-toolbar">
    <h2 id="service-gallery-title">Примеры работ</h2>
    ${photoControls}
  </div>
</dialog>`;

page('services','Услуги','Услуги ColourWay: наружная реклама, печать, POSM, неон, выставочные стенды и оформление.','samarkand.webp','02 / УСЛУГИ','От идеи<br><em>до реализации.</em>','Проектируем, производим и монтируем решения под формат вашего бренда.',`<section class="section detail-services"><div class="wrap"><div class="section-heading"><div><span class="eyebrow"><span class="eyebrow-line"></span> ВОЗМОЖНОСТИ COLOURWAY</span><h2>Что мы <em>делаем.</em></h2></div><p>От небольшой таблички до комплексного оформления. Подбираем материалы и конструкцию под вашу задачу.</p></div><div class="detail-service-list">${serviceCards}</div></div></section>${serviceGalleryDialog}`);

const team=[
  ['sales-director.webp', 'Хакимов Сардор', 'Директор', 'Sardor_CWD'],
  ['project-manager.webp', 'Рахимов Музаффар', 'Менеджер проектов', 'Muzaffar_CWD'],
  ['project-manager2.webp', 'Рахимов Ахрор', 'Менеджер проектов', 'Axror_CWD'],
  ['project-manager3.webp', 'Мирзуқулов Мирзиёд', 'Менеджер проектов', 'colour_way_manager'],
  ['project-manager4.webp', 'Сагдуллаева Гүлмира', 'Кассир'],
  ['designer.webp', 'Мухаммадиева Райхона', '3D-дизайнер'],
  ['designer3.webp', 'Мустакимиов Тимур', 'Дизайнер'],
  ['crm.webp', 'Қурлова Шодия', 'CRM-специалист']
].map(([image, name, role, telegram]) => ({
  photo: `assets/team/${image}`,
  dialogId: `person-${path.parse(image).name}`,
  name,
  role,
  telegram
}));

const people=team.map(({photo, dialogId, name, role}) => `
  <a class="person" href="${escape(photo)}" data-person aria-haspopup="dialog" aria-controls="${dialogId}">
    <span class="person-photo">
      <img src="${escape(photo)}" alt="" loading="lazy" decoding="async" width="400" height="600">
    </span>
    <span class="person-caption">
      <span><strong>${escape(name)}</strong><small>${escape(role)}</small></span>
      <span class="person-arrow" aria-hidden="true">↗</span>
    </span>
  </a>`).join('');

const personDialogs=team.map(({photo, dialogId, name, role, telegram}) => `
  <dialog class="variant-dialog person-dialog" id="${dialogId}" aria-labelledby="${dialogId}-title">
    <button class="dialog-close" type="button" data-close-dialog aria-label="Закрыть" autofocus>×</button>
    <img class="person-dialog-photo" src="${escape(photo)}" alt="${escape(name)}" loading="lazy" decoding="async" width="400" height="600">
    <div class="dialog-copy">
      <h2 id="${dialogId}-title">${escape(name)}</h2>
      <p>${escape(role)}</p>${telegram ? `
      <a class="person-telegram button button-wine" href="https://t.me/${escape(telegram)}" target="_blank" rel="noopener noreferrer">
        Написать в Telegram <span aria-hidden="true">↗</span>
      </a><small class="person-handle">@${escape(telegram)}</small>` : ''}
    </div>
  </dialog>`).join('');
page('about','О нас','Команда, производство и история ColourWay Design в Ташкенте.','office.webp','03 / О КОМПАНИИ','Идею создают<br><em>люди.</em>','С 2015 года объединяем дизайн, производство и монтаж в одной команде.',`<section class="section about-intro"><div class="wrap about-intro-grid"><div><span class="eyebrow"><span class="eyebrow-line"></span> КТО МЫ</span><h2>Одна команда.<br><em>Полный цикл.</em></h2></div><div><p>ColourWay Design помогает брендам стать заметными в реальном пространстве. Мы начинаем с задачи, проектируем решение, изготавливаем его и доводим до установки.</p><p>Собственное производство позволяет команде сопровождать проект на каждом этапе и отвечать за детали.</p><a class="text-link" href="ziynat-projects.html">Смотреть наши работы <span aria-hidden="true">↗</span></a></div></div></section><section class="section team-section"><div class="wrap"><div class="section-heading"><div><span class="eyebrow"><span class="eyebrow-line"></span> ЛЮДИ COLOURWAY</span><h2>Знакомьтесь,<br><em>команда.</em></h2></div><p>От первого разговора до монтажа — рядом специалисты, которые знают своё дело.</p></div><div class="people-grid">${people}</div></div></section><section class="section document-section"><div class="wrap document-grid"><a class="document-image" href="assets/certificate-colourway.webp" data-certificate aria-label="Посмотреть свидетельство о регистрации ColourWay"><img src="assets/certificate-colourway.webp" alt="Свидетельство о государственной регистрации ColourWay Design" loading="lazy" width="749" height="1080"></a><div><span class="eyebrow"><span class="eyebrow-line"></span> ДОКУМЕНТЫ / COLOURWAY</span><h2>Свидетельство<br><em>о регистрации.</em></h2><p>ColourWay Design официально зарегистрирована в Узбекистане с 2015 года.</p><a class="text-link" href="assets/certificate-colourway.webp" data-certificate>Посмотреть документ <span aria-hidden="true">↗</span></a></div></div></section><dialog class="certificate-dialog" id="certificate-dialog" aria-label="Свидетельство о регистрации"><button class="dialog-close" type="button" data-close-dialog aria-label="Закрыть">×</button><img src="assets/certificate-colourway.webp" alt="Свидетельство о государственной регистрации ColourWay Design"></dialog>${personDialogs}`);

page('contact','Контакты','Связаться с ColourWay Design в Ташкенте: телефон, Telegram, адрес и время работы.','silkway.webp','04 / КОНТАКТЫ','Поговорим<br><em>о вашей идее.</em>','Расскажите о задаче. Подскажем материал, формат и следующий шаг.',`<section class="section contact-section"><div class="wrap contact-grid"><div class="contact-main"><span class="eyebrow"><span class="eyebrow-line"></span> НА СВЯЗИ</span><h2>Начнём<br><em>разговор.</em></h2><a class="contact-phone" href="tel:+998785550203">+998 78 555 02 03 ↗</a><a class="contact-mail" href="mailto:info@colourway.uz">info@colourway.uz ↗</a><div class="contact-social"><a href="https://t.me/colourway_CRM" target="_blank" rel="noopener noreferrer">Telegram ↗</a><a href="https://www.instagram.com/colourway_uz/" target="_blank" rel="noopener noreferrer">Instagram ↗</a></div></div><div class="contact-visit"><img src="assets/office-preview.webp" alt="Офис ColourWay Design в Ташкенте" loading="lazy" width="960" height="960"><div><span class="eyebrow"><span class="eyebrow-line"></span> ПРИХОДИТЕ В ГОСТИ</span><h3>Ташкент.</h3><p>Мирзо-Улугбекский район,<br>ТТЗ-2, квартал 2, дом 2</p><p>Пн–Пт: 09:00–18:00<br>Сб: 09:00–16:00</p><a class="text-link" href="https://www.google.com/maps/search/?api=1&query=ColourWay+Design+Tashkent" target="_blank" rel="noopener noreferrer">Показать на карте <span aria-hidden="true">↗</span></a></div></div></div></section><section class="contact-order"><div class="wrap contact-order-inner"><div><span class="eyebrow"><span class="eyebrow-line"></span> УЖЕ ЕСТЬ ИДЕЯ?</span><h2>Соберите заказ<br>прямо на сайте.</h2><p>Выберите изделие, создайте макет и отправьте его менеджеру.</p></div><a class="button button-wine" href="order.html#order-builder">Создать макет <span aria-hidden="true">↗</span></a></div></section>`);

let orderPage=readFileSync(path.join(root,'templates','order-base.html'),'utf8');
for(const [id] of nav)orderPage=orderPage.replaceAll(`href="${id}.html"`,`href="ziynat-${id}.html"`);
orderPage=orderPage.replaceAll('href="./"','href="ziynat-variant.html"');
orderPage=orderPage.replace('<link rel="stylesheet" href="v2-bridge.css">','<link rel="stylesheet" href="v2-bridge.css">\n  <link rel="stylesheet" href="ziynat-order.css">');
orderPage=orderPage.replace('<body class="about-page order-page">','<body class="about-page order-page ziynat-order-page">\n  <div class="concept-bar"><span>КОНЦЕПЦИЯ 04 <i></i> ФОТОГРАФИЯ / ПРОИЗВОДСТВО</span><a href="designs.html">← Все варианты</a></div>');
writeFileSync(path.join(dist,'ziynat-order.html'),orderPage);
