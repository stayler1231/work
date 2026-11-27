'use strict';
(() => {
  const data = window.CW_DATA;
  const $ = selector => document.querySelector(selector);
  const $$ = selector => [...document.querySelectorAll(selector)];
  const page = document.body.className.match(/v2-(home|services|contact)/)?.[1] || 'home';
  const initial = Object.fromEntries($$('[data-i18n]').map(node => [node.dataset.i18n,node.innerHTML]));
  const titles = {
    home:{ru:'ColourWay — делаем бренды заметными',uz:'ColourWay — brendingiz ko‘zga tashlansin',en:'ColourWay — make it visible'},
    services:{ru:'Услуги — ColourWay Design',uz:'Xizmatlar — ColourWay Design',en:'Services — ColourWay Design'},
    contact:{ru:'Контакты — ColourWay Design',uz:'Aloqa — ColourWay Design',en:'Contact — ColourWay Design'}
  };
  let language = 'ru';
  try {const saved = localStorage.getItem('colourway-language');if(['ru','uz','en'].includes(saved))language=saved;} catch (_) {}
  const localize = value => typeof value === 'string' ? value : value?.[language] || value?.ru || '';
  const escapeHTML = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const t = key => data[language]?.[key] || initial[key] || key;

  function renderServices() {
    const list = $('#v2-service-list');
    if (!list) return;
    list.innerHTML = data.services.map((service,index) => {
      const title = escapeHTML(localize(service.title));
      const description = escapeHTML(localize(service.description));
      const tags = (service.tags[language] || service.tags.ru).map(tag => `<span>${escapeHTML(tag)}</span>`).join('');
      const image = service.image.replace(/\.webp$/, '-preview.webp');
      return `<details class="v2-service" id="${service.id}" ${index===0?'open':''}><summary><span class="v2-service-number">${String(index+1).padStart(2,'0')}</span><h2>${title}</h2><span class="v2-service-symbol" aria-hidden="true">+</span></summary><div class="v2-service-body"><img src="assets/${image}" alt="${title}" width="640" height="420" loading="lazy" decoding="async"><div><p>${description}</p><div class="v2-service-tags">${tags}</div><a href="order.html?service=${encodeURIComponent(service.id)}#order-builder">${escapeHTML(t('v2StartProject'))} ↗</a></div></div></details>`;
    }).join('');
  }
  function translate(next) {
    language = next;
    document.documentElement.lang = next;
    document.title = titles[page][next];
    $$('[data-i18n]').forEach(node => {node.innerHTML = t(node.dataset.i18n);});
    $$('[data-alt-i18n]').forEach(node => {node.alt = t(node.dataset.altI18n);});
    $$('[data-lang]').forEach(button => {const active = button.dataset.lang === next;button.classList.toggle('active',active);button.setAttribute('aria-pressed',String(active));});
    renderServices();
    try {localStorage.setItem('colourway-language',next);} catch (_) {}
  }

  const menu = $('#v2-mobile-nav');
  const toggle = $('.v2-menu-toggle');
  function setMenu(open) {menu.hidden = !open;toggle.setAttribute('aria-expanded',String(open));}
  toggle.addEventListener('click',()=>setMenu(menu.hidden));
  menu.addEventListener('click',event=>{if(event.target.closest('a'))setMenu(false);});
  window.matchMedia('(min-width:961px)').addEventListener('change',event=>{if(event.matches)setMenu(false);});
  document.addEventListener('keydown',event=>{if(event.key==='Escape')setMenu(false);});
  $$('[data-lang]').forEach(button=>button.addEventListener('click',()=>translate(button.dataset.lang)));
  $$('[data-year]').forEach(node=>node.textContent=String(new Date().getFullYear()));
  translate(language);
  if (page === 'services' && location.hash) {
    requestAnimationFrame(() => document.getElementById(decodeURIComponent(location.hash.slice(1)))?.scrollIntoView());
  }
  if (typeof IntersectionObserver === 'function' && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.classList.add('has-motion');
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) entry.target.classList.toggle('is-visible', entry.isIntersecting);
    }, {rootMargin:'-5% 0px -8% 0px',threshold:.08});
    $$('.v2-photo-story article').forEach(card=>observer.observe(card));
  }
})();
