import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {runInNewContext} from 'node:vm';
import {core,offerings,origin} from './build-seo.mjs';

const dist=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../dist');
const legacyWorks=JSON.parse(readFileSync(path.join(dist,'../data/legacy-works.json'),'utf8')).groups;
const data={window:{}};
runInNewContext(readFileSync(path.join(dist,'data.js'),'utf8'),data);
runInNewContext(readFileSync(path.join(dist,'en.js'),'utf8'),data);
const catalog=data.window.CW_DATA;
const source=readFileSync(path.join(dist,'ziynat-i18n.js'),'utf8');
const start=source.indexOf('const manual=')+'const manual='.length;
const end=source.indexOf('\n  };',start)+4;
const manual=runInNewContext(`(${source.slice(start,end)})`);
const translations=new Map(Object.entries(manual));
const add=(ru,en,uz)=>{if(ru&&en&&uz)translations.set(ru,[en,uz]);};
for(const category of catalog.categories)add(category.ru,category.en,category.uz);
for(const project of catalog.projects){add(project.subtitle?.ru,project.subtitle?.en,project.subtitle?.uz);add(project.description?.ru,project.description?.en,project.description?.uz);for(const photo of project.gallery||[])add(photo.description?.ru,photo.description?.en,photo.description?.uz);}
for(const service of catalog.services){add(service.title?.ru,service.title?.en,service.title?.uz);add(service.description?.ru,service.description?.en,service.description?.uz);(service.tags.ru||[]).forEach((tag,i)=>add(tag,service.tags.en?.[i],service.tags.uz?.[i]));}
for(let number=1;number<=8;number++){const index=String(number).padStart(2,'0');add(`${index} / УСЛУГА`,`${index} / SERVICE`,`${index} / XIZMAT`);}
const extra={
  'Вывески и неон':['Signs and neon','Peshlavhalar va neon'],
  'POSM и ритейл':['POSM and retail','POSM va savdo'],
  'Пространства':['Spaces','Makonlar'],
  'Транспорт':['Transport','Transport'],
  'Главная':['Home','Bosh sahifa'],
  'Услуги':['Services','Xizmatlar'],
  'Проекты':['Projects','Loyihalar'],
  'От идеи до монтажа':['From idea to installation','G‘oyadan montajgacha'],
  'Что влияет на расчёт':['What affects the quote','Narxga nima ta’sir qiladi'],
  'Уточняем задачу и место размещения, готовим визуальное решение, согласовываем материалы, производим и монтируем изделие.':['We discuss the brief and location, prepare a visual concept, agree on materials, produce the item and install it.','Vazifa va joylashuvni aniqlaymiz, vizual yechim tayyorlaymiz, materiallarni kelishamiz, mahsulotni ishlab chiqarib o‘rnatamiz.'],
  'Стоимость зависит от размеров, конструкции, материалов и особенностей монтажа. Точные параметры согласуем после получения заявки.':['Cost depends on size, construction, materials and installation conditions. We agree on the details after receiving your request.','Narx o‘lcham, konstruksiya, material va montaj sharoitlariga bog‘liq. Tafsilotlarni so‘rovingizdan keyin kelishamiz.'],
  'Создать макет и отправить заявку':['Create a mockup and send a request','Maket yarating va so‘rov yuboring'],
  'Смежные услуги':['Related services','O‘xshash xizmatlar'],
  'Примеры работ':['Examples of our work','Ish namunalari'],
  'Все работы':['All work','Barcha ishlar'],
  'Другие':['Other','Boshqalar'],
  'по направлениям.':['by category.','yo‘nalishlar bo‘yicha.'],
  'Откройте направление, чтобы посмотреть все фотографии.':['Open a category to see every photo.','Barcha suratlarni ko‘rish uchun yo‘nalishni oching.'],
  'Смотреть работы':['View work','Ishlarni ko‘rish'],
  'Откройте фотографию, чтобы рассмотреть работу целиком.':['Open a photo to see the full work.','Ishni to‘liq ko‘rish uchun suratni oching.'],
  'Фотография работы':['Work photo','Ish fotosurati'],
  'Назад':['Previous','Oldingi'],
  'Далее':['Next','Keyingi'],
  'Референсы':['References','Namunalar'],
  'Меню для ресторана':['Restaurant menu','Restoran menyusi'],
  'Иллюстративный макет':['Illustrative mockup','Illyustrativ maket'],
  'Печать для уличного ограждения':['Printing for an outdoor fence','Ko‘cha to‘sig‘i uchun bosma'],
  'Баннер на фасаде':['Facade banner','Fasaddagi banner'],
  'Рекламный баннер для магазина':['Shop advertising banner','Do‘kon uchun reklama banneri'],
  'Оформление интерьера':['Interior branding','Interyerni bezash'],
  'Подробнее о проекте':['View project','Loyihani ko‘rish'],
  'Оформление офиса':['Office branding','Ofisni bezash'],
  'Таблички для помещений':['Interior signs','Xona tablichkalari'],
  'Широкоформатная печать':['Large format printing','Keng formatli chop etish'],
  'Интерьерные таблички, навигация и печатные материалы для офисов и торговых пространств.':['Interior signs, wayfinding and printed materials for offices and retail spaces.','Ofis va savdo joylari uchun interyer tablichkalari, yo‘naltirish belgilari va bosma materiallar.'],
  'Баннеры для фасадов, магазинов и уличных конструкций. Подготовим изображение и напечатаем его под нужный размер.':['Banners for facades, shops and outdoor structures. We prepare the artwork and print it to the required size.','Fasadlar, do‘konlar va tashqi konstruksiyalar uchun bannerlar. Tasvirni tayyorlab, kerakli o‘lchamda chop etamiz.'],
  'Таблички':['Signs','Tablichkalar'],
  'Навигация':['Wayfinding','Yo‘naltirish belgilari'],
  'Полиграфия':['Printing','Poligrafiya'],
  'Баннеры':['Banners','Bannerlar'],
  'Фасады':['Facades','Fasadlar'],
  'Уличная реклама':['Outdoor advertising','Ko‘cha reklamasi'],
  'Объёмные буквы на фасаде':['Dimensional letters on a facade','Fasaddagi hajmli harflar'],
  'Световая вывеска':['Illuminated sign','Yoritilgan peshlavha'],
  'Стойка ресепшн':['Reception desk','Resepshn peshtaxtasi'],
  'Обсудить проект':['Discuss a project','Loyihani muhokama qilish'],
  'РЕАЛЬНЫЙ ПРОЕКТ · COLOURWAY DESIGN':['REAL PROJECT · COLOURWAY DESIGN','HAQIQIY LOYIHA · COLOURWAY DESIGN'],
  'Бренды:':['Brands:','Brendlar:'],
  'ColourWay Design · Ташкент':['ColourWay Design · Tashkent','ColourWay Design · Toshkent'],
  'Услуга по этому направлению':['Related service','Tegishli xizmat'],
  'Обсудить похожий проект':['Discuss a similar project','O‘xshash loyihani muhokama qilish'],
  'COLOURWAY DESIGN · ТАШКЕНТ':['COLOURWAY DESIGN · TASHKENT','COLOURWAY DESIGN · TOSHKENT']
  ,'Лазерный станок в производственном цехе':['Laser cutting machine in the production workshop','Ishlab chiqarish sexidagi lazer kesish stanogi']
  ,'Свидетельство о государственной регистрации ColourWay Design':['ColourWay Design registration certificate','ColourWay Design davlat ro‘yxatidan o‘tganlik guvohnomasi']
  ,'Фасадная вывеска ресторана':['Restaurant facade sign','Restoran fasadidagi peshlavha']
  ,'Брендирование автомобиля Vitros':['Vitros vehicle branding','Vitros avtomobil brendingi']
  ,'Оформление фасада Durable':['Durable facade branding','Durable fasadini bezash']
  ,'Световая вывеска CHODIR UZBEKISTAN':['CHODIR UZBEKISTAN illuminated sign','CHODIR UZBEKISTAN nurli peshlavhasi']
  ,'Рекламная конструкция Coca-Cola':['Coca-Cola advertising display','Coca-Cola reklama konstruksiyasi']
  ,'Неоновый световой проект':['Neon lighting project','Neon yoritish loyihasi']
  ,'Офис и производство ColourWay Design в Ташкенте':['ColourWay Design office and production in Tashkent','Toshkentdagi ColourWay Design ofisi va ishlab chiqarishi']
  ,'Офис ColourWay Design в Ташкенте':['ColourWay Design office in Tashkent','Toshkentdagi ColourWay Design ofisi']
  ,'Брендированное торговое оборудование':['Branded retail display','Brendlangan savdo uskunasi']
  ,'Праздничная инсталляция':['Festive installation','Bayram installyatsiyasi']
  ,'Стойка для выкладки продукции':['Product display stand','Mahsulot namoyish stendi']
  ,'Объёмная бренд-инсталляция':['3D brand installation','Hajmli brend installyatsiyasi']
  ,'Мебель для коммерческого интерьера':['Furniture for a commercial interior','Tijorat interyeri uchun mebel']
  ,'Интерьерные таблички':['Interior signs','Interyer tablichkalari']
  ,'Выставочный стенд':['Exhibition stand','Ko‘rgazma stendi']
};
for(const [ru,other] of Object.entries(extra))translations.set(ru,other);
const labels={
  'outdoor-advertising':['Outdoor advertising','Tashqi reklama'],
  'signboards':['Signs and plaques','Peshlavhalar va tablichkalar'],
  'illuminated-letters':['Illuminated letters','Nurli harflar'],
  '3d-letters':['3D letters and neon','Hajmli harflar va neon'],
  'advertising-stands':['Exhibition stands','Ko‘rgazma stendlari'],
  'pos-materials':['POSM and retail displays','POSM va savdo jihozlari'],
  'large-format-printing':['Large format printing','Keng formatli chop etish'],
  'printing':['Printing and graphic production','Chop etish va poligrafiya'],
  'vehicle-branding':['Vehicle branding','Transportni brendlash'],
  'advertising-structures':['Advertising structures','Reklama konstruksiyalari'],
  'interior-branding':['Complete space branding','Kompleks bezatish'],
  'lightboxes':['Lightboxes','Laytbokslar'],
  'furniture-and-metalwork':['Furniture and metalwork','Mebel va metall konstruksiyalar']
};
for(const [slug,label,h1,intro,group] of offerings){
  const [en,uz]=labels[slug];const service=catalog.services.find(s=>s.id===group);
  add(label,en,uz);add(h1,en,uz);
  if(slug==='3d-letters')add(intro,'3D letters, illuminated logos and neon for facades and interiors.','Fasad va interyerlar uchun hajmli harflar, yoritilgan logotiplar va neon.');
  else add(intro,service.description.en,service.description.uz);
}
for(const group of legacyWorks)add(group.title.ru,group.title.en,group.title.uz);
const enc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const langPath=(route,lang)=>lang==='ru'?route:`/${lang}${route==='/'?'/':route.endsWith('/')?route:`${route}/`}`;
const languages=route=>`<link rel="alternate" hreflang="ru-UZ" href="${origin}${langPath(route,'ru')}"><link rel="alternate" hreflang="uz-UZ" href="${origin}${langPath(route,'uz')}"><link rel="alternate" hreflang="en" href="${origin}${langPath(route,'en')}"><link rel="alternate" hreflang="x-default" href="${origin}${langPath(route,'ru')}">`;
const pages=[...core.filter(p=>!p.robots).map(p=>({route:p.path,file:path.join(dist,p.file),title:p.title,description:p.description})),
  ...offerings.map(([slug,label,h1,intro,group])=>({route:`/services/${slug}/`,file:path.join(dist,'services',slug,'index.html'),title:slug==='outdoor-advertising'?'Производство наружной рекламы в Ташкенте — ColourWay Design':`${label} в Ташкенте — ColourWay Design`,description:`${intro} ${catalog.services.find(s=>s.id===group).description.ru} Обсудите изготовление с ColourWay Design в Ташкенте.`,label:slug,group})),
  ...catalog.projects.filter(p=>p.id&&p.description?.ru&&p.image).map(p=>({route:`/projects/${p.id}/`,file:path.join(dist,'projects',p.id,'index.html'),title:`${p.subtitle.ru} — проект ColourWay Design`,description:`${p.description.ru} Посмотрите фотографии выполненной работы ColourWay Design.`,project:p}))];
const coreMeta={
  '/':['Outdoor advertising in Tashkent — ColourWay Design','Toshkentda tashqi reklama — ColourWay Design'],
  '/services':['Advertising production and services — ColourWay','Reklama ishlab chiqarish va xizmatlar — ColourWay'],
  '/projects':['Advertising projects — ColourWay Design','Reklama loyihalari — ColourWay Design'],
  '/about':['About ColourWay Design — advertising production','ColourWay Design haqida — reklama ishlab chiqarish'],
  '/contact':['Contact ColourWay Design — Tashkent','ColourWay Design aloqasi — Toshkent']
};
const coreDescriptions={
  '/':['ColourWay Design designs and produces signs, illuminated letters, retail displays and outdoor advertising in Tashkent. Discuss your project with our team.','ColourWay Design Toshkentda peshlavhalar, nurli harflar, savdo stendlari va tashqi reklamani loyihalab ishlab chiqaradi. Loyihangizni muhokama qiling.'],
  '/services':['Signs, 3D letters, printing, POS materials, branded spaces and vehicles. Explore ColourWay Design services and discuss your project.','Peshlavhalar, hajmli harflar, bosma, POS materiallar, makon va transport brendingi. ColourWay Design xizmatlarini ko‘ring.'],
  '/projects':['Explore real ColourWay Design projects: signs, retail displays, branded spaces and vehicles in Tashkent.','ColourWay Designning haqiqiy ishlari: Toshkentdagi peshlavhalar, savdo stendlari, makon va transport bezagi.'],
  '/about':['Meet the ColourWay Design team and learn about our in-house production, design and installation work in Tashkent.','ColourWay Design jamoasi, Toshkentdagi o‘z ishlab chiqarish sexi, loyihalash va montaj ishlari bilan tanishing.'],
  '/contact':['Contact ColourWay Design in Tashkent: +998 78 555 02 03, info@colourway.uz, TTZ-2, block 2, building 2.','Toshkentdagi ColourWay Design bilan bog‘laning: +998 78 555 02 03, info@colourway.uz, TTZ-2, 2-kvartal, 2-uy.']
};
function translateText(html,lang){
  const index=lang==='en'?0:1;
  return html.replace(/>([^<>]+)</g,(whole,text)=>{
    const phrase=text.trim();const translated=translations.get(phrase)?.[index];
    if(translated)return `>${text.replace(phrase,enc(translated))}<`;
    if(phrase.startsWith('Бренды: '))return `>${text.replace('Бренды:',enc(translations.get('Бренды:')[index]))}<`;
    return whole;
  }).replace(/\b(alt|aria-label|title)="([^"]*)"/g,(whole,attr,value)=>{
    const translated=translations.get(value)?.[index];
    if(translated)return `${attr}="${enc(translated)}"`;
    if(attr==='alt'&&value.includes(' — ')){
      const [subject,suffix]=value.split(' — ',2);
      const localizedSubject=translations.get(subject)?.[index]||subject;
      if(suffix.startsWith('фото '))return `${attr}="${enc(localizedSubject+' — '+(index===0?'photo ':'surat ')+suffix.slice(5))}"`;
      if(suffix==='пример работы ColourWay Design')return `${attr}="${enc(localizedSubject+' — '+(index===0?'ColourWay Design work example':'ColourWay Design ish namunasi'))}"`;
    }
    return whole;
  });
}
function localizeStructuredData(html,lang,route){
  const index=lang==='en'?0:1;
  return html.replace(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g,(whole,payload)=>{
    const entries=JSON.parse(payload);
    const update=entry=>{
      if(entry['@type']==='Service'){
        entry.name=translations.get(entry.name)?.[index]||entry.name;
        entry.description=translations.get(entry.description)?.[index]||entry.description;
        entry.url=origin+langPath(route,lang);
        entry['@id']=entry.url+'#service';
      }
      if(entry['@type']==='BreadcrumbList')for(const crumb of entry.itemListElement){
        crumb.name=translations.get(crumb.name)?.[index]||crumb.name;
        const oldRoute=crumb.item.slice(origin.length);
        crumb.item=origin+langPath(oldRoute,lang);
      }
      return entry;
    };
    return `<script type="application/ld+json">${JSON.stringify(Array.isArray(entries)?entries.map(update):update(entries)).replace(/</g,'\\u003c')}</script>`;
  });
}
function localLinks(html,lang,currentRoute){
  const coreRoutes={'index.html':'/','services.html':'/services','projects.html':'/projects','about.html':'/about','contact.html':'/contact'};
  return html.replace(/\b(href|src|poster)="([^"]+)"/g,(whole,attr,value)=>{
    const clean=value.replace(/^(?:\.\.\/)+/,'');
    if(clean.startsWith('assets/'))return `${attr}="/${clean}"`;
    if(/\.(?:css|js)(?:\?|$)/.test(clean)&&!clean.includes('/'))return `${attr}="/${clean}"`;
    if(attr!=='href')return whole;
    if(value==='./'||clean==='')return `href="${langPath('/',lang)}"`;
    const [pathname,hash='']=clean.split('#');
    if(coreRoutes[pathname])return `href="${langPath(coreRoutes[pathname],lang)}${hash?'#'+hash:''}"`;
    if(['projects','services','about','contact'].includes(pathname))return `href="${langPath('/'+pathname,lang)}${hash?'#'+hash:''}"`;
    if(value.startsWith('../')&&!value.startsWith('../../')&&/^\/[a-z0-9-]+\/$/.test('/'+pathname)&&currentRoute.startsWith('/services/'))return `href="${langPath('/services/'+pathname,lang)}${hash?'#'+hash:''}"`;
    if(/^\/?(?:services|projects)\/[a-z0-9-]+\/$/.test(pathname))return `href="${langPath('/'+pathname.replace(/^\//,''),lang)}${hash?'#'+hash:''}"`;
    if(pathname==='order.html'||pathname==='order')return `href="/order${hash?'#'+hash:''}"`;
    return whole;
  }).replace(/\bsrcset="([^"]+)"/g,(whole,value)=>`srcset="${value.replace(/(?:\.\.\/)*assets\//g,'/assets/')}"`);
}
let localized=0;
for(const page of pages){
  let ru=readFileSync(page.file,'utf8');
  if(!ru.includes('hreflang="ru-UZ"')){
    ru=ru.replace('</head>',languages(page.route)+'</head>');writeFileSync(page.file,ru);
  }
  for(const lang of ['en','uz']){
    const index=lang==='en'?0:1;
    const title=page.label?(page.label==='outdoor-advertising'?(lang==='en'?'Outdoor advertising production in Tashkent — ColourWay Design':'Toshkentda tashqi reklama ishlab chiqarish — ColourWay Design'):`${labels[page.label][index]} ${lang==='en'?'in Tashkent':'Toshkentda'} — ColourWay Design`):page.project?`${page.project.subtitle[lang]||page.project.subtitle.ru} — ColourWay Design`:coreMeta[page.route][index];
    const description=page.label?`${catalog.services.find(s=>s.id===page.group).description[lang]} ColourWay Design, Tashkent.`:page.project?`${page.project.description[lang]||page.project.description.ru} ColourWay Design.`:coreDescriptions[page.route][index];
    let html=ru.replace('<html lang="ru">',`<html lang="${lang}">`);
    html=html.replace(/<title>[\s\S]*?<\/title>/,`<title>${enc(title)}</title>`)
      .replace(/<meta name="description" content="[^"]*">/,`<meta name="description" content="${enc(description)}">`);
    html=html.replace(/<link rel="canonical" href="[^"]*">/,`<link rel="canonical" href="${origin}${langPath(page.route,lang)}">`)
      .replace(/<meta property="og:title" content="[^"]*">/,`<meta property="og:title" content="${enc(title)}">`)
      .replace(/<meta property="og:description" content="[^"]*">/,`<meta property="og:description" content="${enc(description)}">`)
      .replace(/<meta property="og:url" content="[^"]*">/,`<meta property="og:url" content="${origin}${langPath(page.route,lang)}">`)
      .replace(/<meta property="og:locale" content="[^"]*">/,`<meta property="og:locale" content="${lang==='en'?'en_US':'uz_UZ'}">`)
      .replace(/<meta name="twitter:title" content="[^"]*">/,`<meta name="twitter:title" content="${enc(title)}">`)
      .replace(/<meta name="twitter:description" content="[^"]*">/,`<meta name="twitter:description" content="${enc(description)}">`);
    html=html.replace(/<script src="(?:ziynat-i18n|sw-register)\.js[^>]*><\/script>/g,'');
    html=translateText(html,lang);
    html=localizeStructuredData(html,lang,page.route);
    html=localLinks(html,lang,page.route);
    const selector=`<div class="variant-language" role="group" aria-label="Language"><a href="${langPath(page.route,'ru')}" lang="ru">RU</a><a href="${langPath(page.route,'uz')}" lang="uz"${lang==='uz'?' aria-current="page"':''}>UZ</a><a href="${langPath(page.route,'en')}" lang="en"${lang==='en'?' aria-current="page"':''}>EN</a></div>`;
    html=html.replace(/(<a class="header-order")/,selector+'$1');
    html=html.replace('</nav></header>',selector+'</nav></header>');
    const map=Object.fromEntries([...translations].filter(([,values])=>values[index]).map(([ru,values])=>[ru,values[index]]));
    html=html.replace('</head>',`<script>window.CW_CURRENT_LANG=${JSON.stringify(lang)};window.CW_VARIANT_T=phrase=>(${JSON.stringify(map)})[phrase]||phrase;</script></head>`);
    const target=path.join(dist,lang,page.route.replace(/^\//,''),'index.html');mkdirSync(path.dirname(target),{recursive:true});writeFileSync(target,html);
    localized++;
  }
}
let sitemap=readFileSync(path.join(dist,'sitemap.xml'),'utf8');
const more=pages.flatMap(page=>['en','uz'].map(lang=>`  <url><loc>${origin}${langPath(page.route,lang)}</loc></url>`)).join('\n');
sitemap=sitemap.replace('</urlset>',`${more}\n</urlset>`);writeFileSync(path.join(dist,'sitemap.xml'),sitemap);
console.log(`Locales: ${localized} static pages (en, uz)`);
