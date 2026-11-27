'use strict';
document.addEventListener('DOMContentLoaded',()=>{
  const manual={
    'Проекты':['Projects','Loyihalar'],
    'Услуги':['Services','Xizmatlar'],
    'О нас':['About','Biz haqimizda'],
    'Контакты':['Contact','Aloqa'],
    'Закрыть':['Close','Yopish'],
    'Открыть фото':['Open photo','Suratni ochish'],
    'Предыдущее фото':['Previous photo','Oldingi surat'],
    'Следующее фото':['Next photo','Keyingi surat'],
    'Фото':['Photo','Surat'],
    'Похожая работа':['Related work','O‘xshash ish'],
    'Написать в Telegram':['Message on Telegram','Telegramda yozish'],
    'Открыть меню':['Open menu','Menyuni ochish'],
    'Закрыть меню':['Close menu','Menyuni yopish'],
    'COLOURWAY DESIGN · ТАШКЕНТ':['COLOURWAY DESIGN · TASHKENT','COLOURWAY DESIGN · TOSHKENT'],
    'Создать проект':['Start a project','Loyihani boshlash'],
    'Создать проект ↗':['Start a project ↗','Loyihani boshlash ↗'],
    'РЕКЛАМНОЕ ПРОИЗВОДСТВО · ТАШКЕНТ':['ADVERTISING PRODUCTION · TASHKENT','REKLAMA ISHLAB CHIQARISH · TOSHKENT'],
    'Создаём то,':['We create what','Biz shunday narsalar'],
    'что':['gets','yaratamizki, ular'],
    'замечают.':['noticed.','ko‘zga tashlanadi.'],
    'Разрабатываем и производим вывески, рекламные конструкции и оформление пространств. Доводим идею до монтажа.':['We design and produce signs, advertising structures and branded spaces. We take each idea through installation.','Peshlavhalar, reklama konstruksiyalari va makon bezagini loyihalab ishlab chiqaramiz. G‘oyani montajgacha yetkazamiz.'],
    'Начать проект':['Start a project','Loyihani boshlash'],
    'Смотреть работы':['View our work','Ishlarni ko‘rish'],
    '01 / ПОДХОД':['01 / APPROACH','01 / YONDASHUV'],
    'Дизайн.':['Design.','Dizayn.'],
    'Производство.':['Production.','Ishlab chiqarish.'],
    'Монтаж.':['Installation.','Montaj.'],
    'ВСЁ В ОДНОЙ КОМАНДЕ':['ALL IN ONE TEAM','BARCHASI BIR JAMOADA'],
    'COLOURWAY DESIGN / С 2015 ГОДА':['COLOURWAY DESIGN / SINCE 2015','COLOURWAY DESIGN / 2015-YILDAN BERI'],
    'ЛИСТАЙТЕ ВНИЗ ↓':['SCROLL DOWN ↓','PASTGA TUSHING ↓'],
    'год основания':['year founded','tashkil topgan yil'],
    'Свой цех':['Our workshop','O‘z seximiz'],
    'изготовление внутри команды':['production in house','ishlab chiqarish o‘zimizda'],
    'проектирование до запуска':['design before production','ishlab chiqarishdan oldin loyiha'],
    'Монтаж':['Installation','Montaj'],
    'отвечаем за результат на месте':['on-site delivery','obyektdagi natija uchun javobgarmiz'],
    'ПРОИЗВОДСТВО / ИЗНУТРИ':['PRODUCTION / BEHIND THE SCENES','ISHLAB CHIQARISH / ICHKARIDAN'],
    'Видно не только':['There is more to see','Faqat natija emas,'],
    'результат.':['than the result.','jarayon ham ko‘rinadi.'],
    'Посмотрите, как идея проходит путь от цеха до готового объекта. Здесь начинается то, что вы увидите в городе.':['See how an idea moves from our workshop to a finished installation. What you see around the city starts here.','G‘oya seximizdan tayyor obyektgacha qanday yetib borishini ko‘ring. Shaharda ko‘radigan ishlarimiz shu yerdan boshlanadi.'],
    'Больше о команде':['Meet the team','Jamoa haqida'],
    'COLOURWAY / В ПРОЦЕССЕ':['COLOURWAY / AT WORK','COLOURWAY / ISH JARAYONIDA'],
    'Включить видео ↗':['Play video ↗','Videoni yoqish ↗'],
    'Остановить видео':['Pause video','Videoni to‘xtatish'],
    '01 / НАШИ УСЛУГИ':['01 / OUR SERVICES','01 / XIZMATLARIMIZ'],
    'Идея становится':['Ideas become','G‘oya'],
    'реальностью.':['reality.','haqiqatga aylanadi.'],
    'Подбираем решение под задачу бренда и место размещения. Каждый проект можно обсудить с командой до изготовления.':['We match the solution to your brand and its location. Every project can be discussed with our team before production.','Yechimni brend vazifasi va joylashuviga moslaymiz. Har bir loyihani ishlab chiqarishdan oldin jamoa bilan muhokama qilishingiz mumkin.'],
    '01 / СНАРУЖИ':['01 / OUTDOORS','01 / TASHQARIDA'],
    'Вывески и буквы':['Signs and letters','Peshlavha va harflar'],
    'Фасады, объёмные буквы и конструкции, заметные с первого взгляда.':['Facades, dimensional letters and structures that stand out at first glance.','Fasadlar, hajmli harflar va bir qarashda ko‘zga tashlanadigan konstruksiyalar.'],
    'Подробнее об услугах':['Explore services','Xizmatlar haqida'],
    '02 / В ДВИЖЕНИИ':['02 / IN MOTION','02 / HARAKATDA'],
    'Печать и брендинг':['Print and branding','Bosma va brending'],
    'Баннеры, графика и оформление носителей для вашей коммуникации.':['Banners, graphics and branded surfaces for your message.','Xabaringiz uchun bannerlar, grafika va tashuvchilar bezagi.'],
    '03 / В ПРОСТРАНСТВЕ':['03 / IN SPACE','03 / MAKONDA'],
    'От отдельной вывески до целостного визуального образа объекта.':['From a single sign to a complete visual identity for a location.','Bitta peshlavhadan obyektning yaxlit vizual qiyofasigacha.'],
    'НАШ ПОДХОД':['OUR APPROACH','YONDASHUVIMIZ'],
    'Мы не просто делаем рекламу.':['We make more than advertising.','Biz reklama bilan cheklanmaymiz.'],
    'Мы помогаем идее':['We help ideas','G‘oyalarga'],
    'обрести форму.':['take shape.','shakl beramiz.'],
    '02 / РЕАЛЬНЫЕ ПРОЕКТЫ':['02 / REAL PROJECTS','02 / HAQIQIY LOYIHALAR'],
    'Наши работы':['Our work','Ishlarimiz'],
    'говорят за нас.':['speaks for itself.','o‘zi haqida so‘zlaydi.'],
    'Все проекты':['All projects','Barcha loyihalar'],
    '01 / ВЫВЕСКИ':['01 / SIGNS','01 / PESHLAVHALAR'],
    '02 / КОНСТРУКЦИИ':['02 / STRUCTURES','02 / KONSTRUKSIYALAR'],
    '03 / СВЕТ':['03 / LIGHT','03 / YORUG‘LIK'],
    '03 / О НАС':['03 / ABOUT US','03 / BIZ HAQIMIZDA'],
    'Одна команда.':['One team.','Bitta jamoa.'],
    'Полный цикл.':['The full cycle.','To‘liq jarayon.'],
    'С 2015 года воплощаем идеи брендов в объекты, которые работают в реальном пространстве.':['Since 2015, we have turned brand ideas into objects that work in the real world.','2015-yildan beri brend g‘oyalarini real makonda ishlaydigan obyektlarga aylantiramiz.'],
    'У нас можно пройти весь путь: обсудить задачу, увидеть макет, согласовать материалы, изготовить и смонтировать готовый проект.':['With us, you can discuss the brief, review the mockup, approve materials, then have the project made and installed.','Biz bilan vazifani muhokama qilish, maketni ko‘rish, materiallarni kelishish, ishlab chiqarish va montaj qilish mumkin.'],
    'Познакомиться с командой':['Meet the team','Jamoa bilan tanishish'],
    '04 / КАК МЫ РАБОТАЕМ':['04 / HOW WE WORK','04 / QANDAY ISHLAYMIZ'],
    'От запроса':['From brief','So‘rovdan'],
    'до установки.':['to installation.','o‘rnatishgacha.'],
    'Понятные шаги помогают заранее увидеть результат и спокойно двигаться к готовому проекту.':['Clear steps let you see the result early and move confidently toward the finished project.','Aniq bosqichlar natijani oldindan ko‘rish va tayyor loyihagacha ishonch bilan borishga yordam beradi.'],
    'Знакомимся':['Getting acquainted','Tanishamiz'],
    'Уточняем задачу, место размещения и пожелания.':['We discuss the brief, location and your preferences.','Vazifa, joylashuv va istaklaringizni aniqlaymiz.'],
    'Проектируем':['Designing','Loyihalaymiz'],
    'Готовим визуальное решение и выбираем материалы.':['We develop the visual concept and choose materials.','Vizual yechim tayyorlab, materiallarni tanlaymiz.'],
    'Производим':['Producing','Ishlab chiqaramiz'],
    'Изготавливаем согласованный проект в собственном цехе.':['We make the approved project in our own workshop.','Tasdiqlangan loyihani o‘z seximizda ishlab chiqaramiz.'],
    'Монтируем':['Installing','O‘rnatamiz'],
    'Устанавливаем на месте и проверяем детали.':['We install on site and check the details.','Obyektda o‘rnatib, tafsilotlarni tekshiramiz.'],
    'ПОРА НАЧАТЬ':['LET’S BEGIN','BOSHLASH VAQTI'],
    'Ваш проект может':['Your project could','Sizning loyihangiz'],
    'стать следующим.':['be next.','keyingisi bo‘lishi mumkin.'],
    'Собрать проект':['Build a project','Loyiha yaratish'],
    'Ташкент, Мирзо-Улугбекский район,':['Tashkent, Mirzo Ulugbek district,','Toshkent, Mirzo Ulug‘bek tumani,'],
    'ТТЗ-2, квартал 2, дом 2':['TTZ-2, block 2, building 2','TTZ-2, 2-kvartal, 2-uy'],
    '01 / ПРОЕКТЫ':['01 / PROJECTS','01 / LOYIHALAR'],
    'Результат, который':['Work that','Natija'],
    'видно.':['stands out.','ko‘zga tashlanadi.'],
    'Реальные работы ColourWay — от отдельных букв до оформления целого пространства.':['Real ColourWay projects, from individual letters to complete spaces.','ColourWay’ning haqiqiy ishlari — alohida harflardan butun makonni bezashgacha.'],
    'ВЫБРАННЫЕ РАБОТЫ':['SELECTED WORK','TANLANGAN ISHLAR'],
    'Идеи в':['Ideas in the','G‘oyalar'],
    'городе.':['city.','shaharda.'],
    'Выберите направление и посмотрите, как решения работают на разных объектах.':['Choose a category and see how our solutions work in different places.','Yo‘nalishni tanlang va yechimlar turli obyektlarda qanday ishlashini ko‘ring.'],
    'В этом разделе пока нет проектов.':['No projects in this category yet.','Bu bo‘limda hozircha loyiha yo‘q.'],
    'Хочу похожий проект ↗':['I want a similar project ↗','Shunday loyiha istayman ↗'],
    '02 / УСЛУГИ':['02 / SERVICES','02 / XIZMATLAR'],
    'От идеи':['From idea','G‘oyadan'],
    'до реализации.':['to reality.','amalga oshirishgacha.'],
    'Проектируем, производим и монтируем решения под формат вашего бренда.':['We design, produce and install solutions tailored to your brand.','Brendingizga mos yechimlarni loyihalaymiz, ishlab chiqaramiz va o‘rnatamiz.'],
    'ВОЗМОЖНОСТИ COLOURWAY':['WHAT COLOURWAY CAN DO','COLOURWAY IMKONIYATLARI'],
    'Что мы':['What we','Biz nima'],
    'делаем.':['make.','qilamiz.'],
    'От небольшой таблички до комплексного оформления. Подбираем материалы и конструкцию под вашу задачу.':['From a small sign to full-space branding. We choose materials and construction for your brief.','Kichik tablichkadan kompleks bezakkacha. Material va konstruksiyani vazifangizga mos tanlaymiz.'],
    'УСЛУГА':['SERVICE','XIZMAT'],
    'Обсудить проект':['Discuss a project','Loyihani muhokama qilish'],
    '03 / О КОМПАНИИ':['03 / ABOUT THE COMPANY','03 / KOMPANIYA HAQIDA'],
    'Идею создают':['Ideas are made by','G‘oyani'],
    'люди.':['people.','odamlar yaratadi.'],
    'С 2015 года объединяем дизайн, производство и монтаж в одной команде.':['Since 2015, we have brought design, production and installation together in one team.','2015-yildan beri dizayn, ishlab chiqarish va montajni bitta jamoada birlashtiramiz.'],
    'КТО МЫ':['WHO WE ARE','BIZ KIMMIZ'],
    'ColourWay Design помогает брендам стать заметными в реальном пространстве. Мы начинаем с задачи, проектируем решение, изготавливаем его и доводим до установки.':['ColourWay Design helps brands stand out in physical spaces. We start with the brief, design a solution, produce it and install it.','ColourWay Design brendlarga real makonda ajralib turishga yordam beradi. Vazifadan boshlaymiz, yechimni loyihalaymiz, ishlab chiqaramiz va o‘rnatamiz.'],
    'Собственное производство позволяет команде сопровождать проект на каждом этапе и отвечать за детали.':['Our own production facility lets the team guide every step and take responsibility for the details.','O‘z ishlab chiqarish bazamiz jamoaga har bir bosqichni kuzatish va tafsilotlar uchun javob berish imkonini yaratadi.'],
    'Смотреть наши работы':['View our work','Ishlarimizni ko‘rish'],
    'ЛЮДИ COLOURWAY':['THE COLOURWAY TEAM','COLOURWAY JAMOASI'],
    'Знакомьтесь,':['Meet the','Tanishib qo‘ying,'],
    'команда.':['team.','jamoamiz.'],
    'От первого разговора до монтажа — рядом специалисты, которые знают своё дело.':['From the first conversation to installation, our specialists are with you.','Birinchi suhbatdan montajgacha o‘z ishini biladigan mutaxassislar yoningizda bo‘ladi.'],
    'Директор':['Director','Direktor'],
    'Кассир':['Cashier','Kassir'],
    'Менеджер проектов':['Project manager','Loyiha menejeri'],
    '3D-дизайнер':['3D designer','3D dizayner'],
    'Дизайнер':['Designer','Dizayner'],
    'CRM-специалист':['CRM specialist','CRM mutaxassisi'],
    'ДОКУМЕНТЫ / COLOURWAY':['DOCUMENTS / COLOURWAY','HUJJATLAR / COLOURWAY'],
    'Свидетельство':['Registration','Ro‘yxatdan o‘tganlik'],
    'о регистрации.':['certificate.','guvohnomasi.'],
    'ColourWay Design официально зарегистрирована в Узбекистане с 2015 года.':['ColourWay Design has been officially registered in Uzbekistan since 2015.','ColourWay Design 2015-yildan beri O‘zbekistonda rasmiy ro‘yxatdan o‘tgan.'],
    'Посмотреть документ':['View document','Hujjatni ko‘rish'],
    '04 / КОНТАКТЫ':['04 / CONTACT','04 / ALOQA'],
    'Поговорим':['Let’s talk','Keling,'],
    'о вашей идее.':['about your idea.','g‘oyangizni muhokama qilaylik.'],
    'Расскажите о задаче. Подскажем материал, формат и следующий шаг.':['Tell us about your project. We will suggest materials, format and the next step.','Vazifangizni ayting. Material, format va keyingi qadam bo‘yicha maslahat beramiz.'],
    'НА СВЯЗИ':['GET IN TOUCH','ALOQADAMIZ'],
    'Начнём':['Let’s start a','Keling,'],
    'разговор.':['conversation.','suhbatlashamiz.'],
    'ПРИХОДИТЕ В ГОСТИ':['VISIT US','BIZGA KELING'],
    'Ташкент.':['Tashkent.','Toshkent.'],
    'Мирзо-Улугбекский район,':['Mirzo Ulugbek district,','Mirzo Ulug‘bek tumani,'],
    'Пн–Пт: 09:00–18:00':['Mon–Fri: 09:00–18:00','Du–Ju: 09:00–18:00'],
    'Сб: 09:00–16:00':['Sat: 09:00–16:00','Sha: 09:00–16:00'],
    'Показать на карте':['View on map','Xaritada ko‘rish'],
    'УЖЕ ЕСТЬ ИДЕЯ?':['ALREADY HAVE AN IDEA?','G‘OYANGIZ BORMI?'],
    'Соберите заказ':['Build your order','Buyurtma yarating'],
    'прямо на сайте.':['right here.','shu saytning o‘zida.'],
    'Выберите изделие, создайте макет и отправьте его менеджеру.':['Choose a product, create a mockup and send it to our manager.','Mahsulotni tanlang, maket yarating va menejerimizga yuboring.'],
    'Создать макет':['Create a mockup','Maket yaratish']
  };
  const translations=new Map(Object.entries(manual));
  for(let number=1;number<=8;number++){
    const index=String(number).padStart(2,'0');
    translations.set(`${index} / УСЛУГА`,[`${index} / SERVICE`,`${index} / XIZMAT`]);
  }
  const data=window.CW_DATA;
  const add=(ru,en,uz)=>{if(ru && en && uz && !translations.has(ru))translations.set(ru,[en,uz]);};
  if(data){
    for(const [key,ru] of Object.entries(data.ru||{})){
      if(typeof ru==='string' && !ru.includes('<'))add(ru,data.en?.[key],data.uz?.[key]);
    }
    for(const category of data.categories||[])add(category.ru,category.en,category.uz);
    for(const project of data.projects||[]){
      if(typeof project.name==='object')add(project.name.ru,project.name.en,project.name.uz);
      add(project.subtitle?.ru,project.subtitle?.en,project.subtitle?.uz);
      add(project.description?.ru,project.description?.en,project.description?.uz);
    }
    for(const service of data.services||[]){
      add(service.title?.ru,service.title?.en,service.title?.uz);
      add(service.description?.ru,service.description?.en,service.description?.uz);
      service.tags?.ru?.forEach((tag,index)=>add(tag,service.tags.en?.[index],service.tags.uz?.[index]));
    }
  }
  const root=document.querySelector('main');
  const nodes=[];
  for(const container of [document.querySelector('.site-header'),root,document.querySelector('.site-footer')]){
    if(!container)continue;
    const walker=document.createTreeWalker(container,NodeFilter.SHOW_TEXT);
    while(walker.nextNode()){
      const node=walker.currentNode;
      const raw=node.nodeValue;
      const phrase=raw.trim();
      if(phrase && translations.has(phrase))nodes.push({node,raw,phrase});
    }
  }
  const languageWidget=()=>{
    const group=document.createElement('div');group.className='variant-language';group.setAttribute('role','group');group.setAttribute('aria-label','Язык / Til / Language');
    for(const code of ['ru','uz','en']){
      const button=document.createElement('button');button.type='button';button.dataset.lang=code;button.textContent=code.toUpperCase();group.append(button);
    }
    return group;
  };
  const header=document.querySelector('.site-header .header-inner');
  if(header)header.insertBefore(languageWidget(),header.querySelector('.header-order'));
  document.querySelector('.site-header .mobile-nav')?.append(languageWidget());
  const switchers=[...document.querySelectorAll('.variant-language button')];
  const titleByPage={
    'index.html':['ColourWay Design — advertising production in Tashkent','ColourWay Design — Toshkentdagi reklama ishlab chiqarish'],
    'projects.html':['Projects — ColourWay Design','Loyihalar — ColourWay Design'],
    'services.html':['Services — ColourWay Design','Xizmatlar — ColourWay Design'],
    'about.html':['About — ColourWay Design','Biz haqimizda — ColourWay Design'],
    'contact.html':['Contact — ColourWay Design','Aloqa — ColourWay Design']
  };
  const originalTitle=document.title;
  let language='ru';
  function apply(next){
    language=['ru','uz','en'].includes(next)?next:'ru';
    window.CW_CURRENT_LANG=language;
    document.documentElement.lang=language;
    const page=location.pathname.split('/').pop()||'index.html';
    document.title=language==='ru'?originalTitle:titleByPage[page]?.[language==='en'?0:1]||originalTitle;
    for(const {node,raw,phrase} of nodes){
      const translated=language==='ru'?phrase:translations.get(phrase)?.[language==='en'?0:1]||phrase;
      node.nodeValue=raw.replace(phrase,translated);
    }
    switchers.forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.lang===language)));
    const menuButton=document.querySelector('.menu-toggle');
    if(menuButton)menuButton.setAttribute('aria-label',language==='ru'?(menuButton.getAttribute('aria-expanded')==='true'?'Закрыть меню':'Открыть меню'):translations.get(menuButton.getAttribute('aria-expanded')==='true'?'Закрыть меню':'Открыть меню')[language==='en'?0:1]);
    document.dispatchEvent(new CustomEvent('cw-language-change',{detail:{language}}));
  }
  const publicRoute=location.pathname.replace(/\.html$/,'').replace(/\/$/,'')||'/';
  const hasStaticLocales=['/','/projects','/services','/about','/contact'].includes(publicRoute);
  switchers.forEach(button=>button.addEventListener('click',()=>{
    if(hasStaticLocales && button.dataset.lang!=='ru'){
      location.assign(`/${button.dataset.lang}${publicRoute==='/'?'/':publicRoute+'/'}`);
      return;
    }
    apply(button.dataset.lang);
    try{localStorage.setItem('colourway-language',language);}catch(_){}
  }));
  let saved='ru';try{saved=localStorage.getItem('colourway-language')||'ru';}catch(_){}
  apply(hasStaticLocales?'ru':saved);
  window.CW_VARIANT_T=phrase=>language==='ru'?phrase:translations.get(phrase)?.[language==='en'?0:1]||phrase;
});
