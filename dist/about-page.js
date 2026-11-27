'use strict';
(() => {
  const $ = selector => document.querySelector(selector);
  const $$ = selector => [...document.querySelectorAll(selector)];
  const motion = window.CW_MOTION;
  const strings = window.CW_DATA;
  const initial = Object.fromEntries($$('[data-i18n]').map(node => [node.dataset.i18n, node.innerHTML]));
  let language = 'ru';
  try { const saved = localStorage.getItem('colourway-language'); language = ['ru','uz','en'].includes(saved) ? saved : 'ru'; }
  catch (_) { /* Language selection still works without storage. */ }

  function translate(next, animate = true) {
    language = next;
    document.documentElement.lang = language;
    document.title = {ru:'О нас — ColourWay Design',uz:'Biz haqimizda — ColourWay Design',en:'About us — ColourWay Design'}[language];
    $$('[data-i18n]').forEach(node => { node.innerHTML = strings[language][node.dataset.i18n] || initial[node.dataset.i18n]; });
    $$('[data-aria-i18n]').forEach(node => { node.setAttribute('aria-label', strings[language][node.dataset.ariaI18n] || node.getAttribute('aria-label')); });
    $$('[data-alt-i18n]').forEach(node => { node.alt = strings[language][node.dataset.altI18n] || node.alt; });
    $$('[data-lang]').forEach(button => {
      const active = button.dataset.lang === language;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    updateCertificateZoom();
    try { localStorage.setItem('colourway-language', language); } catch (_) { /* Optional persistence. */ }
    if (animate) ['main', '.footer', '.desktop-nav'].forEach(selector => motion.enter($(selector), {distance:0, opacity:.3}));
  }

  function setMenu(open) {
    const menu = $('#mobile-nav');
    const toggle = $('.menu-toggle');
    if (menu.hidden && !open) return;
    if (toggle.getAttribute('aria-expanded') === String(open)) return;
    const wasHidden = menu.hidden;
    const opacity = wasHidden ? 0 : getComputedStyle(menu).opacity;
    const transform = wasHidden ? 'translateY(-12px)' : getComputedStyle(menu).transform;
    toggle.setAttribute('aria-expanded', String(open));
    menu.hidden = false;
    menu.inert = !open;
    motion.play(menu, [{opacity, transform}, {opacity:open ? 1 : 0, transform:open ? 'translateY(0)' : 'translateY(-12px)'}], () => {
      if (toggle.getAttribute('aria-expanded') === String(open)) menu.hidden = !open;
    });
  }

  const certificateDialog = $('#certificate-dialog');
  const certificateZoom = $('#certificate-zoom');
  let certificateOpener = null;
  function updateCertificateZoom() {
    const zoomed = certificateDialog.classList.contains('is-zoomed');
    certificateZoom.textContent = strings[language][zoomed ? 'certificateFit' : 'certificateZoom'];
    certificateZoom.setAttribute('aria-pressed', String(zoomed));
  }
  $$('[data-open-certificate]').forEach(link => link.addEventListener('click', event => {
    if (typeof certificateDialog.showModal !== 'function') return;
    event.preventDefault();
    certificateOpener = link;
    if (!certificateDialog.open) certificateDialog.showModal();
    document.body.classList.add('modal-open');
    certificateZoom.focus({preventScroll:true});
  }));
  certificateZoom.addEventListener('click', () => {
    certificateDialog.classList.toggle('is-zoomed');
    $('.certificate-viewer').scrollTo?.(0, 0);
    updateCertificateZoom();
  });
  $('.certificate-dialog-close').addEventListener('click', () => certificateDialog.close());
  certificateDialog.addEventListener('click', event => { if (event.target === certificateDialog) certificateDialog.close(); });
  certificateDialog.addEventListener('close', () => {
    certificateDialog.classList.remove('is-zoomed');
    document.body.classList.remove('modal-open');
    updateCertificateZoom();
    certificateOpener?.focus({preventScroll:true});
  });

  $('.menu-toggle').addEventListener('click', () => setMenu($('.menu-toggle').getAttribute('aria-expanded') !== 'true'));
  $('#mobile-nav').addEventListener('click', event => { if (event.target.closest('a')) setMenu(false); });
  $$('[data-lang]').forEach(button => button.addEventListener('click', () => { if (button.dataset.lang !== language) translate(button.dataset.lang); }));
  window.matchMedia('(min-width:961px)').addEventListener('change', event => { if (event.matches) setMenu(false); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape') setMenu(false); });
  $('#year').textContent = String(new Date().getFullYear());
  translate(language, false);
  motion.observeSections();
})();
