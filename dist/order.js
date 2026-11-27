(() => {
  'use strict';
  const $ = selector => document.querySelector(selector);
  const $$ = selector => [...document.querySelectorAll(selector)];
  const products = {
    ru: {banner:'Печать баннера',banner_frame:'Баннер с рейкой / каркасом',sign:'Табличка',badge:'Бейджик',custom:'Индивидуальный проект'},
    uz: {banner:'Banner chop etish',banner_frame:'Reykali / karkasli banner',sign:'Lavha',badge:'Beyjik',custom:'Shaxsiy loyiha'},
    en: {banner:'Banner printing',banner_frame:'Banner with rail / frame',sign:'Sign',badge:'Name badge',custom:'Custom project'}
  };
  const copy = {
    ru: {orderEyebrow:'COLOURWAY / ИНДИВИДУАЛЬНЫЙ ЗАКАЗ',orderTitle:'<span>Соберите</span><span>свой <em>заказ.</em></span>',orderStart:'Начать проект',ribbonDesign:'ДИЗАЙН',ribbonProduction:'ПРОИЗВОДСТВО',ribbonInstallation:'МОНТАЖ',orderStepsLabel:'ВАШ ПРОЕКТ / 3 ШАГА',orderStepsTitle:'От идеи к воплощению.',orderIntro:'Оставьте контакты, чтобы обсудить заказ. При желании добавьте изделие или опишите проект.',skipMockup:'Оставить заявку без макета ↗',contactOnlyIntro:'Для заявки достаточно имени и телефона или Telegram. Изделие и макет добавлять необязательно.',productHeading:'Изделие или проект (необязательно)',productChoice:'Не выбрано',customTitleLabel:'Что хотите изготовить *',customTitlePlaceholder:'Например, неоновая вывеска или выставочный стенд',customTitleError:'Опишите изделие для индивидуального проекта.',dimensionUnitLabel:'Единицы измерения',metersOption:'Метры (м)',centimetersOption:'Сантиметры (см)',widthLabel:'Ширина',heightLabel:'Высота',sizeLabel:'Размер',quantityLabel:'Количество, шт',addOrderItem:'Добавить ещё изделие',liveDraft:'В проекте',freeDraft:'Свободный макет',editorTitle:'Конструктор макета',designerFullscreenOpen:'На весь экран',designerFullscreenClose:'Выйти из полноэкранного режима',continueToContact:'Перейти к контактам',contactHeading:'Расскажите о себе',nameLabel:'Ваше имя *',contactLabel:'Телефон или @Telegram *',noteLabel:'Пожелания к заказу',notePlaceholder:'Расскажите, что вам нужно. Можно указать размеры, сроки и бюджет.',photoLabel:'Фото или пример проекта',photoHint:'JPG, PNG или WebP · до 5 МБ',orderPrivacy:'Отправляя заказ, вы передаёте контакт и фото менеджеру ColourWay через Telegram.',summaryEyebrow:'ВАШ ПРОЕКТ',summaryHeading:'Состав заказа',emptyOrder:'Для заявки достаточно имени и контакта.',estimateLabel:'Предварительная стоимость',estimateFrom:'от',estimateOnRequest:'По согласованию',estimateCustom:'Индивидуальный проект рассчитывается отдельно.',priceNote:'Материалы и итоговую стоимость согласуем с вами после получения заявки.',sendOrder:'Отправить заявку',sentButton:'Заявка отправлена',telegramFallback:'Или напишите нам в Telegram ↗',removeItem:'Удалить',photoRemove:'Убрать фото',itemInvalid:'Проверьте размеры и количество.',itemLimit:'Можно добавить до пяти позиций.',chooseProductError:'Выберите изделие или проект, чтобы добавить его в заказ.',contactError:'Укажите имя и телефон или @Telegram.',photoInvalid:'Выберите JPG, PNG или WebP размером до 5 МБ.',sending:'Отправляем заказ…',sent:'Заказ отправлен менеджеру. Мы свяжемся с вами по указанному контакту.',failed:'Не удалось отправить заказ. Попробуйте ещё раз или напишите нам в Telegram.',rateLimit:'Слишком много заявок. Попробуйте позже.',productPanelHeading:'Изделия и макет',designerIntro:'Добавляйте текст, фото, фигуры и рисунки на свободный холст или на макет изделия.',designerItemLabel:'Основа макета',designerBackground:'Цвет фона',designerText:'Текст на макете',designerTextPlaceholder:'Ваш текст',designerTextColor:'Цвет элемента',designerTextSize:'Размер элемента',designerAddText:'Добавить ещё текст',designerEditText:'Изменить текст',designerAddRect:'Прямоугольник',designerAddCircle:'Круг',designerLayers:'Элементы макета',designerLayersEmpty:'Добавьте текст, изображения, фигуры или рисунок',designerAddImage:'Добавить своё фото',designerDelete:'Удалить элемент',designerCanvas:'Интерактивный холст макета',designerHint:'Добавляйте элементы по одному. Выберите слой в списке, чтобы редактировать его, или перетащите прямо на макете.',designerClear:'Очистить макет',designerSourceNote:'Это эскиз для согласования. Исходное фото для производства прикрепите ниже к заявке.',designPartial:'Макет и заказ отправлены. Исходное фото не доставлено — отправьте его менеджеру через Telegram.',designExportError:'Не удалось подготовить макет. Попробуйте уменьшить изображение.',
      orderReferencesHeading:'Примеры работ', referenceWideFormat:'Широкоформатная печать', referenceOutdoorPrint:'Печать для улицы',
      referenceFacadeBanner:'Баннер на фасаде', referenceStoreBanner:'Баннер для торговой точки', referenceDoorSign:'Табличка для кабинета',
      referenceWayfinding:'Навигационные таблички', referenceNameBadges:'Именные бейджи', referenceExhibition:'Выставочный стенд',
      referenceNeon:'Неоновая вывеска'},
    uz: {orderEyebrow:'COLOURWAY / SHAXSIY BUYURTMA',orderTitle:'<span>Buyurtmangizni</span><span><em>tuzing.</em></span>',orderStart:'Loyihani boshlash',ribbonDesign:'DIZAYN',ribbonProduction:'ISHLAB CHIQARISH',ribbonInstallation:'MONTAJ',orderStepsLabel:'LOYIHANGIZ / 3 QADAM',orderStepsTitle:'G‘oyadan natijagacha.',orderIntro:'Buyurtmani muhokama qilish uchun aloqa ma’lumotlaringizni qoldiring. Xohlasangiz, mahsulot qo‘shing yoki loyihangizni tasvirlang.',skipMockup:'Maketsiz so‘rov qoldirish ↗',contactOnlyIntro:'So‘rov uchun ism va telefon yoki Telegram yetarli. Mahsulot va maket ixtiyoriy.',productHeading:'Mahsulot yoki loyiha (ixtiyoriy)',productChoice:'Tanlanmagan',customTitleLabel:'Nima tayyorlamoqchisiz? *',customTitlePlaceholder:'Masalan, neon peshlavha yoki ko‘rgazma stendi',customTitleError:'Shaxsiy loyiha uchun mahsulotni tasvirlab bering.',dimensionUnitLabel:'O‘lchov birligi',metersOption:'Metr (m)',centimetersOption:'Santimetr (sm)',widthLabel:'Eni',heightLabel:'Bo‘yi',sizeLabel:'O‘lcham',quantityLabel:'Miqdori, dona',addOrderItem:'Yana mahsulot qo‘shish',liveDraft:'Loyihada',freeDraft:'Erkin maket',editorTitle:'Maket konstruktori',designerFullscreenOpen:'To‘liq ekran',designerFullscreenClose:'To‘liq ekrandan chiqish',continueToContact:'Aloqa ma’lumotlariga o‘tish',contactHeading:'O‘zingiz haqingizda',nameLabel:'Ismingiz *',contactLabel:'Telefon yoki @Telegram *',noteLabel:'Buyurtma bo‘yicha istaklar',notePlaceholder:'Sizga nima kerakligini yozing. O‘lchamlar, muddat va byudjetni ham ko‘rsatishingiz mumkin.',photoLabel:'Loyiha rasmi yoki namunasi',photoHint:'JPG, PNG yoki WebP · 5 MB gacha',orderPrivacy:'Buyurtmani yuborib, aloqa ma’lumotlari va rasmni ColourWay menejeriga Telegram orqali yuborasiz.',summaryEyebrow:'LOYIHANGIZ',summaryHeading:'Buyurtma tarkibi',emptyOrder:'Ariza uchun ism va aloqa ma’lumotlari yetarli.',estimateLabel:'Taxminiy narx',estimateFrom:'Kamida',estimateOnRequest:'Kelishiladi',estimateCustom:'Shaxsiy loyiha narxi alohida hisoblanadi.',priceNote:'Ariza kelgach, materiallar va yakuniy narxni siz bilan kelishamiz.',sendOrder:'So‘rov yuborish',sentButton:'So‘rov yuborildi',telegramFallback:'Yoki Telegram orqali yozing ↗',removeItem:'Olib tashlash',photoRemove:'Rasmni olib tashlash',itemInvalid:'O‘lcham va miqdorni tekshiring.',itemLimit:'Beshtagacha mahsulot qo‘shish mumkin.',chooseProductError:'Buyurtmaga qo‘shish uchun mahsulot yoki loyihani tanlang.',contactError:'Ism va telefon yoki @Telegramni kiriting.',photoInvalid:'5 MB gacha JPG, PNG yoki WebP tanlang.',sending:'Buyurtma yuborilmoqda…',sent:'Buyurtma menejerga yuborildi. Siz bilan bog‘lanamiz.',failed:'Buyurtmani yuborib bo‘lmadi. Qayta urinib ko‘ring yoki Telegramga yozing.',rateLimit:'Juda ko‘p so‘rov. Keyinroq urinib ko‘ring.',productPanelHeading:'Mahsulotlar va maket',designerIntro:'Erkin kanvasga yoki mahsulot maketiga matn, rasm, shakl va chizmalar qo‘shing.',designerItemLabel:'Maket asosi',designerBackground:'Fon rangi',designerText:'Maketdagi matn',designerTextPlaceholder:'Matningiz',designerTextColor:'Element rangi',designerTextSize:'Element o‘lchami',designerAddText:'Yana matn qo‘shish',designerEditText:'Matnni o‘zgartirish',designerAddRect:'To‘rtburchak',designerAddCircle:'Doira',designerLayers:'Maket elementlari',designerLayersEmpty:'Matn, rasm, shakl yoki chizma qo‘shing',designerAddImage:'Rasm qo‘shish',designerDelete:'Elementni o‘chirish',designerCanvas:'Interaktiv maket kanvasi',designerHint:'Elementlarni bittadan qo‘shing. Tahrirlash uchun qatlamni tanlang yoki maketning o‘zida suring.',designerClear:'Maketni tozalash',designerSourceNote:'Bu kelishish uchun eskiz. Ishlab chiqarish uchun asl rasmni quyida biriktiring.',designPartial:'Maket va buyurtma yuborildi. Asl rasm yetib bormadi — uni Telegram orqali yuboring.',designExportError:'Maketni tayyorlab bo‘lmadi. Rasm hajmini kamaytiring.',
      orderReferencesHeading:'Ish namunalari', referenceWideFormat:'Keng formatli bosma', referenceOutdoorPrint:'Ko‘cha uchun bosma',
      referenceFacadeBanner:'Fasaddagi banner', referenceStoreBanner:'Savdo nuqtasi uchun banner', referenceDoorSign:'Xona uchun lavha',
      referenceWayfinding:'Yo‘nalish ko‘rsatuvchi lavhalar', referenceNameBadges:'Ism yozilgan beyjiklar', referenceExhibition:'Ko‘rgazma stendi',
      referenceNeon:'Neon peshlavha'}
  };
  copy.en = window.CW_ORDER_EN;
  let language = (() => { try { const saved = localStorage.getItem('colourway-language'); return ['ru','uz','en'].includes(saved) ? saved : 'ru'; } catch (_) { return 'ru'; } })();
  const items = [];
  let photoUrl = null;
  let requestId = null;
  const t = key => copy[language][key] || window.CW_DATA?.[language]?.[key] || '';
  const locale = () => ({ru:'ru-RU',uz:'uz-UZ',en:'en-US'})[language];
  const estimateRates = {banner: 40000, banner_frame: 80000, sign: 50000, badge: 40000};
  const productReferences = {
    banner: [
      ['order-wide-format-print.webp', 'referenceWideFormat'],
      ['order-outdoor-print.webp', 'referenceOutdoorPrint']
    ],
    banner_frame: [
      ['order-facade-banner.webp', 'referenceFacadeBanner'],
      ['order-store-banner.webp', 'referenceStoreBanner']
    ],
    sign: [
      ['order-door-sign.webp', 'referenceDoorSign'],
      ['print-office-signs-preview.webp', 'referenceWayfinding']
    ],
    badge: [['order-name-badges.webp', 'referenceNameBadges']],
    custom: [
      ['exhibition-preview.webp', 'referenceExhibition'],
      ['neon-bear-preview.webp', 'referenceNeon']
    ]
  };
  const isBanner = type => type === 'banner' || type === 'banner_frame';
  const productSelect = $('#order-product');
  const unitSelect = $('#order-dimension-unit');
  const dimensionInputs = [$('#order-width'), $('#order-height')];
  const dimensionUnits = {
    m: {scale: 100, min: 0.1, max: 20, step: 0.01},
    cm: {scale: 1, min: 10, max: 2000, step: 1}
  };
  let dimensionUnit = unitSelect.value;

  const unitSymbol = unit => ({ru: {m: 'м', cm: 'см'}, uz: {m: 'm', cm: 'sm'}, en: {m: 'm', cm: 'cm'}})[language][unit];

  function updateDimensionUnit() {
    const next = unitSelect.value;
    const {scale, min, max, step} = dimensionUnits[next];
    const conversion = dimensionUnits[dimensionUnit].scale / scale;
    for (const input of dimensionInputs) {
      if (next !== dimensionUnit && Number.isFinite(input.valueAsNumber)) {
        input.value = String(Number((input.valueAsNumber * conversion).toPrecision(12)));
      }
      input.min = min;
      input.max = max;
      input.step = step;
      input.inputMode = next === 'cm' ? 'numeric' : 'decimal';
    }
    dimensionUnit = next;
    $('#item-error').textContent = '';
  }

  function updateConfig() {
    const type = productSelect.value;
    const selectedIndex = Number.parseInt($('#designer-item').value,10);
    const selectedItem = Number.isInteger(selectedIndex) ? items[selectedIndex] : null;
    $('#order-product-current').textContent = type ? products[language][type] : selectedItem ? products[language][selectedItem.type] : t('productChoice');
    $('#add-order-item').disabled = !type;
    $('#banner-fields').hidden = !isBanner(type);
    $('#sign-fields').hidden = type !== 'sign';
    $('#custom-fields').hidden = type !== 'custom';
    $('#quantity-fields').hidden = !type;
    $('#item-error').textContent = '';
    const references = productReferences[type] || [];
    $('#order-product-references').hidden = !references.length;
    $('#order-reference-images').replaceChildren(...references.map(([filename, label]) => {
      const figure = document.createElement('figure');
      const image = document.createElement('img');
      image.alt = '';
      image.decoding = 'async';
      image.src = `assets/${filename}`;
      const caption = document.createElement('figcaption');
      caption.textContent = t(label);
      figure.append(image, caption);
      return figure;
    }));
  }

  function formatDimensions(item) {
    if (isBanner(item.type)) {
      const format = new Intl.NumberFormat(locale(), {useGrouping: false, maximumFractionDigits: 2});
      return `${format.format(item.width)} × ${format.format(item.height)} ${unitSymbol(item.unit)}`;
    }
    return item.size ? `${item.size.replace('x', ' × ')} ${unitSymbol('cm')}` : '';
  }

  function detail(item) {
    const pieces = language === 'en' ? 'pcs' : language === 'uz' ? 'dona' : 'шт';
    const description = item.type === 'custom' ? item.title : formatDimensions(item);
    return [description, `${item.quantity} ${pieces}`].filter(Boolean).join(' · ');
  }

  function currentDraftItem() {
    const type = productSelect.value;
    if (!type) return null;
    const quantity = Number($('#order-quantity').value);
    const item = {type, quantity: Number.isInteger(quantity) && quantity > 0 ? quantity : 1};
    if (isBanner(type)) {
      const width = Number($('#order-width').value), height = Number($('#order-height').value);
      if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) return null;
      Object.assign(item,{width,height,unit:dimensionUnit});
    } else if (type === 'sign') item.size = $('#order-size').value;
    else if (type === 'custom') item.title = $('#order-custom-title').value.trim();
    return item;
  }

  function otherDraftItems() {
    return window.CW_DESIGNER.projectDrafts().filter(draft => draft.template && draft.type !== productSelect.value).map(draft => {
      const details = draft.orderDetails || {};
      const item = {type:draft.type,quantity:details.quantity || 1};
      if (isBanner(draft.type)) Object.assign(item,{width:details.width ?? draft.width,height:details.height ?? draft.height,unit:details.unit || 'm'});
      else if (draft.type === 'sign') item.size = details.size || draft.size;
      else if (draft.type === 'custom') item.title = details.title || products[language].custom;
      return {item,draft};
    });
  }

  function projectItems() {
    const current = currentDraftItem();
    return [...items,...otherDraftItems().map(({item}) => item),...(current ? [current] : [])];
  }

  function projectRow(item, draft = null, removable = false) {
    const li = document.createElement('li');
    const top = document.createElement('div'); top.className = 'order-item-top';
    const title = document.createElement('strong'); title.textContent = products[language][item.type];
    top.append(title);
    if (removable) {
      const index = items.indexOf(item);
      const remove = document.createElement('button'); remove.type = 'button'; remove.textContent = '×'; remove.setAttribute('aria-label', `${t('removeItem')}: ${title.textContent}`);
      remove.addEventListener('click', () => {
        items.splice(index, 1); requestId = null; renderItems();
        if (!items.length) productSelect.focus();
        else $('#order-items').querySelectorAll('button')[Math.min(index, items.length - 1)]?.focus();
      });
      top.append(remove);
    } else {
      const state = document.createElement('span'); state.className = 'order-item-draft'; state.textContent = t('liveDraft'); top.append(state);
    }
    li.append(top);
    const meta = document.createElement('span'); meta.className = 'order-item-meta'; meta.textContent = detail(item);
    li.append(meta);
    if (draft) {
      const thumbnail = document.createElement('canvas'); thumbnail.className = 'order-design-thumbnail';
      if (window.CW_DESIGNER.drawThumbnail(draft,thumbnail)) li.append(thumbnail);
    }
    return li;
  }

  function renderProject() {
    const list = $('#order-items');
    list.replaceChildren(...items.map(item => projectRow(item,item,true)));
    const current = currentDraftItem();
    if (current) list.append(projectRow(current,window.CW_DESIGNER.templateDraft(current.type)));
    for (const {item,draft} of otherDraftItems()) list.append(projectRow(item,draft));
    const free = window.CW_DESIGNER.projectDrafts().find(draft => !draft.template);
    if (free) {
      const li = document.createElement('li'); li.className = 'order-free-design';
      const title = document.createElement('strong'); title.textContent = t('freeDraft'); li.append(title);
      const thumbnail = document.createElement('canvas'); thumbnail.className = 'order-design-thumbnail';
      window.CW_DESIGNER.drawThumbnail(free,thumbnail); li.append(thumbnail); list.append(li);
    }
    $('#order-empty').hidden = list.childElementCount > 0;
    renderEstimate();
  }

  function renderEstimate() {
    const allItems = projectItems();
    const priced = allItems.filter(item => item.type !== 'custom');
    const hasCustom = priced.length !== allItems.length;
    const total = priced.reduce((sum, item) => {
      const rate = estimateRates[item.type];
      if (!isBanner(item.type)) return sum + rate * item.quantity;
      const scale = dimensionUnits[item.unit].scale;
      const area = Math.round(item.width * scale) * Math.round(item.height * scale) / 10000;
      return sum + Math.round(area * rate) * item.quantity;
    }, 0);
    const amount = $('#order-estimate-value');
    if (!allItems.length) amount.textContent = '—';
    else if (!priced.length) amount.textContent = t('estimateOnRequest');
    else {
      const currency = {ru: 'сум', uz: 'so‘m', en: 'UZS'}[language];
      const prefix = priced.some(item => item.type === 'sign') ? `${t('estimateFrom')} ` : '';
      amount.textContent = `${prefix}${new Intl.NumberFormat(locale()).format(total)} ${currency}`;
    }
    $('#order-estimate-custom').hidden = !hasCustom || !priced.length;
  }

  function renderItems(chooseLast = false) {
    $('#order-error').textContent = '';
    window.CW_DESIGNER.setItems(items, language, products[language], formatDimensions, chooseLast);
    updateConfig();
    renderProject();
  }
  function addItem() {
    if (items.length >= 5) {
      $('#item-error').textContent = t('itemLimit');
      $('#add-order-item').focus();
      return false;
    }
    const type = productSelect.value;
    if (!Object.hasOwn(products[language], type)) {
      $('#item-error').textContent = t('chooseProductError');
      productSelect.focus();
      return false;
    }
    const quantityInput = $('#order-quantity');
    const quantity = Number(quantityInput.value);
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 100) {
      $('#item-error').textContent = t('itemInvalid');
      quantityInput.focus();
      return false;
    }
    const item = {type, quantity};
    if (isBanner(type)) {
      const invalidInput = dimensionInputs.find(input => !input.validity.valid || !Number.isFinite(input.valueAsNumber));
      if (invalidInput) {
        $('#item-error').textContent = t('itemInvalid');
        invalidInput.focus();
        return false;
      }
      [item.width, item.height] = dimensionInputs.map(input => input.valueAsNumber);
      item.unit = dimensionUnit;
    } else if (type === 'custom') {
      item.title = $('#order-custom-title').value.trim();
      if (item.title.length < 2 || item.title.length > 120) { $('#item-error').textContent = t('customTitleError'); $('#order-custom-title').focus(); return false; }
    } else if (type === 'sign') {
      item.size = $('#order-size').value;
    }
    window.CW_DESIGNER.attachTemplateDesign(item);
    items.push(item);
    requestId = null;
    productSelect.value = '';
    quantityInput.value = '1';
    $('#order-custom-title').value = '';
    $('#order-size').selectedIndex = 0;
    dimensionInputs.forEach((input, index) => { input.value = String((index === 0 ? 300 : 150) / dimensionUnits[dimensionUnit].scale); });
    updateConfig();
    renderItems(true);
    return true;
  }
  function validContact(value) {
    if (/^@[a-zA-Z0-9_]{5,32}$/.test(value)) return true;
    const digits = value.replace(/\D/g, '');
    return /^[+\d()\s.-]+$/.test(value) && digits.length >= 9 && digits.length <= 15;
  }
  function photoValid(file) { return !file || (['image/jpeg','image/png','image/webp'].includes(file.type) && file.size > 0 && file.size <= 5_000_000); }
  function showPhoto() {
    const file = $('#order-photo').files?.[0];
    const box = $('#photo-preview'); box.replaceChildren();
    if (photoUrl) { URL.revokeObjectURL(photoUrl); photoUrl = null; }
    if (!file) { box.hidden = true; return; }
    if (!photoValid(file)) { $('#order-error').textContent = t('photoInvalid'); $('#order-photo').value = ''; box.hidden = true; return; }
    photoUrl = URL.createObjectURL(file);
    const image = document.createElement('img'); image.src = photoUrl; image.alt = '';
    const name = document.createElement('span'); name.textContent = file.name;
    const remove = document.createElement('button'); remove.type = 'button'; remove.textContent = t('photoRemove');
    remove.addEventListener('click', () => { $('#order-photo').value = ''; showPhoto(); });
    box.append(image, name, remove); box.hidden = false;
    $('#order-error').textContent = '';
  }
  function translate(next) {
    language = next; document.documentElement.lang = next;
    document.title = {ru:'Заказ по каталогу — ColourWay Design',uz:'Buyurtma — ColourWay Design',en:'Custom orders — ColourWay Design'}[next];
    $$('[data-i18n]').forEach(node => { const value = t(node.dataset.i18n); if (value) node.innerHTML = value; });
    $$('[data-aria-i18n]').forEach(node => { const value = t(node.dataset.ariaI18n); if (value) node.setAttribute('aria-label', value); });
    $$('[data-alt-i18n]').forEach(node => { const value = t(node.dataset.altI18n); if (value) node.alt = value; });
    $$('[data-placeholder-i18n]').forEach(node => { const value = t(node.dataset.placeholderI18n); if (value) node.placeholder = value; });
    $$('[data-lang]').forEach(button => { const active = button.dataset.lang === next; button.classList.toggle('active', active); button.setAttribute('aria-pressed', String(active)); });
    $$('#order-product option').forEach(option => { if (option.value) option.textContent = products[next][option.value]; });
    $$('#order-size option').forEach(option => { option.textContent = formatDimensions({size: option.value}); });
    try { localStorage.setItem('colourway-language', next); } catch (_) { /* optional */ }
    const photoRemove = $('#photo-preview button'); if (photoRemove) photoRemove.textContent = t('photoRemove');
    updateConfig(); renderItems();
  }
  const mobileMenu = $('#mobile-nav');
  const menuToggle = $('.menu-toggle');
  function setMobileMenu(open) {
    mobileMenu.hidden = !open;
    menuToggle.setAttribute('aria-expanded', String(open));
  }
  menuToggle.addEventListener('click', () => setMobileMenu(mobileMenu.hidden));
  mobileMenu.addEventListener('click', event => {
    if (event.target.closest('a')) setMobileMenu(false);
  });
  window.matchMedia('(width > 1040px)').addEventListener('change', event => {
    if (event.matches) setMobileMenu(false);
  });
  $$('[data-lang]').forEach(button => button.addEventListener('click', () => translate(button.dataset.lang)));
  updateDimensionUnit();
  function storeCurrentDraftDetails() {
    const item = currentDraftItem();
    if (item) window.CW_DESIGNER.templateDraft(item.type).orderDetails = {...item};
    renderProject();
  }
  unitSelect.addEventListener('change', () => {updateDimensionUnit(); storeCurrentDraftDetails();});
  productSelect.addEventListener('change', event => {
    updateConfig();
    if (!event.detail?.skipDesigner) {
      window.CW_DESIGNER.selectTemplate(productSelect.value);
      updateConfig();
    }
    storeCurrentDraftDetails();
  });
  ['#order-width','#order-height','#order-size','#order-quantity','#order-custom-title'].forEach(selector => $(selector).addEventListener('input',storeCurrentDraftDetails));
  let projectRenderPending = false;
  document.addEventListener('colourway:designer-change', () => {
    if (projectRenderPending) return;
    projectRenderPending = true;
    requestAnimationFrame(() => {projectRenderPending = false; renderProject();});
  });
  $('#add-order-item').addEventListener('click', addItem);
  $('#order-photo').addEventListener('change', showPhoto);

  const fullscreenDialog = $('#designer-fullscreen-dialog');
  const fullscreenView = $('#designer-fullscreen-view');
  const fullscreenOpen = $('#designer-fullscreen-open');
  const fullscreenClose = $('#designer-fullscreen-close');
  const designPanel = $('.order-design-panel');
  let designerPageScroll = 0;
  let returnToContacts = false;

  fullscreenOpen.hidden = typeof fullscreenDialog.showModal !== 'function';
  fullscreenOpen.addEventListener('click', async () => {
    if (fullscreenDialog.open) return;
    designerPageScroll = window.scrollY;
    fullscreenDialog.showModal();
    fullscreenView.append(designPanel);
    fullscreenView.scrollTop = 0;
    fullscreenClose.focus({preventScroll: true});
    if (document.fullscreenEnabled && fullscreenView.requestFullscreen) {
      try { await fullscreenView.requestFullscreen(); } catch (_) { /* The dialog already fills the viewport. */ }
    }
  });

  async function closeDesignerFullscreen(toContacts = false) {
    if (!fullscreenDialog.open) return;
    returnToContacts ||= toContacts;
    if (document.fullscreenElement === fullscreenView) {
      try { await document.exitFullscreen(); } catch (_) { /* Close the dialog even if fullscreen is already ending. */ }
    }
    fullscreenDialog.close();
  }

  fullscreenClose.addEventListener('click', () => closeDesignerFullscreen());
  fullscreenDialog.addEventListener('cancel', event => {
    event.preventDefault();
    closeDesignerFullscreen();
  });
  fullscreenView.addEventListener('fullscreenchange', () => {
    if (document.fullscreenElement !== fullscreenView) fullscreenDialog.close();
    else if (!fullscreenDialog.open) document.exitFullscreen().catch(() => {});
  });
  fullscreenDialog.addEventListener('close', () => {
    fullscreenDialog.before(designPanel);
    if (returnToContacts) {
      const heading = $('#contact-heading');
      heading.focus({preventScroll: true});
      heading.scrollIntoView();
    } else {
      window.scrollTo({top: designerPageScroll, behavior: 'instant'});
      fullscreenOpen.focus({preventScroll: true});
    }
    returnToContacts = false;
  });
  $('#designer-contacts-link').addEventListener('click', event => {
    if (!fullscreenDialog.open) return;
    event.preventDefault();
    closeDesignerFullscreen(true);
  });

  function showOrderStatus(state, message, scroll = false) {
    const status = $('#order-status');
    status.hidden = false;
    status.dataset.state = state;
    status.textContent = message;
    if (scroll) status.scrollIntoView({block:'center',behavior:'smooth'});
  }

  $('#custom-order-form').addEventListener('submit', async event => {
    event.preventDefault();
    const button = $('#order-send');
    if (button.disabled || fullscreenDialog.open) return;
    if (productSelect.value && !addItem()) {showOrderStatus('error',$('#item-error').textContent); return;}
    const submittedItems = [...items,...otherDraftItems().map(({item}) => item)];
    if (submittedItems.length > 5) {$('#item-error').textContent = t('itemLimit'); showOrderStatus('error',t('itemLimit'),true); return;}
    const name = $('#order-name').value.trim(); const contact = $('#order-contact').value.trim();
    if (name.length < 2 || !validContact(contact)) { $('#order-error').textContent = t('contactError'); showOrderStatus('error',t('contactError')); (name.length < 2 ? $('#order-name') : $('#order-contact')).focus(); return; }
    const photo = $('#order-photo').files?.[0];
    if (!photoValid(photo)) { $('#order-error').textContent = t('photoInvalid'); showOrderStatus('error',t('photoInvalid')); $('#order-photo').focus(); return; }
    requestId ||= crypto.randomUUID();
    const form = new FormData($('#custom-order-form'));
    form.set('id', requestId); form.set('language', language); form.set('items', JSON.stringify(submittedItems.map(({design, ...item}) => item)));
    if (!photo) form.delete('photo');
    button.disabled = true; button.dataset.sending = 'true'; button.querySelector('span').textContent = t('sending');
    showOrderStatus('sending',t('sending'));
    try {
      const design = await window.CW_DESIGNER.exportDesign();
      if (design) form.set('design', design.blob, 'colourway-maket.jpg');
      const response = await fetch('/api/custom-orders', {method:'POST', body:form});
      const result = await response.json();
      if (!response.ok || !result.ok) throw new Error(response.status === 429 ? 'rate_limit' : 'delivery');
      const partial = result.photoSent === false;
      showOrderStatus(partial ? 'warning' : 'success',t(partial ? 'designPartial' : 'sent'),true);
      button.dataset.sending = 'false'; button.querySelector('span').textContent = t('sentButton');
      document.dispatchEvent(new CustomEvent('colourway:lead-sent'));
    } catch (error) {
      button.disabled = false; button.dataset.sending = 'false'; button.querySelector('span').textContent = t('sendOrder');
      if (error.message === 'design_too_large' || error.message === 'canvas_unavailable' || error.message === 'image_load') window.CW_DESIGNER.showError();
      showOrderStatus('error',t(error.message === 'rate_limit' ? 'rateLimit' : error.message === 'design_too_large' || error.message === 'canvas_unavailable' || error.message === 'image_load' ? 'designExportError' : 'failed'),true);
    }
  });
  $('#year').textContent = String(new Date().getFullYear());
  const orderParams = new URLSearchParams(location.search);
  const requestedService = window.CW_DATA?.services?.find(service => service.id === orderParams.get('service'));
  const requestedProject = window.CW_DATA?.projects?.find(project => project.id === orderParams.get('project'));
  if (requestedService || requestedProject) {
    productSelect.value = 'custom';
    $('#order-custom-title').value = requestedProject
      ? `${{ru:'Похожий проект',uz:'Shunga o‘xshash loyiha',en:'Similar project'}[language]}: ${typeof requestedProject.name === 'string' ? requestedProject.name : requestedProject.name[language]}`
      : typeof requestedService.title === 'string' ? requestedService.title : requestedService.title[language];
  }
  translate(language);
  if (productSelect.value) {
    window.CW_DESIGNER.selectTemplate(productSelect.value);
    updateConfig();
  }
})();
