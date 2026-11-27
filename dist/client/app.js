'use strict';
(() => {
  if (window.location.hash === '#about') {
    window.location.replace('about.html');
    return;
  }
  const data = window.CW_DATA;
  const motion = window.CW_MOTION;
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const initialStrings = {};
  $$('[data-i18n]').forEach(el => { initialStrings[el.dataset.i18n] = el.innerHTML; });
  $$('[data-placeholder-i18n]').forEach(el => { initialStrings[el.dataset.placeholderI18n] = el.placeholder; });
  $$('[data-aria-i18n]').forEach(el => { initialStrings[el.dataset.ariaI18n] = el.getAttribute('aria-label'); });
  $$('[data-alt-i18n]').forEach(el => { initialStrings[el.dataset.altI18n] = el.alt; });
  $$('[data-roledescription-i18n]').forEach(el => { initialStrings[el.dataset.roledescriptionI18n] = el.getAttribute('aria-roledescription'); });
  let language = 'ru';
  try { const saved = localStorage.getItem('colourway-language'); language = ['ru','uz','en'].includes(saved) ? saved : 'ru'; } catch (_) { /* Storage may be unavailable in private mode. */ }
  let currentFilter = 'all';
  let visibleCount = 6;
  let currentProject = null;
  let projectSequence = [];
  let activeService = 'outdoor';
  let carouselIndex = 0;
  let carouselAnimation = null;
  let carouselDuration = 0;
  let carouselStep = 0;
  let carouselVisible = false;
  let carouselUserPaused = false;
  let carouselStatusTimer = null;
  const carouselSpeed = 48;
  const carouselReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let suppressProjectClickUntil = 0;
  const dialogOpeners = new WeakMap();
  const projectDialog = $('#project-dialog');
  const localize = value => typeof value === 'string' ? value : value[language];
  const t = key => data[language][key] || initialStrings[key] || key;
  const icon = name => `<svg aria-hidden="true"><use href="#${name}"/></svg>`;
  const previewImage = name => name.replace(/\.webp$/, '-preview.webp');
  const escapeHTML = text => String(text).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const getFiltered = () => data.projects.filter(project => currentFilter === 'all' || project.category === currentFilter);
  function renderFilters() {
    $('.filters').innerHTML = data.categories.map(category => {
      const count = data.projects.filter(project => category.id === 'all' || project.category === category.id).length;
      return `<button type="button" class="filter${currentFilter === category.id ? ' active' : ''}" data-filter="${category.id}" aria-pressed="${currentFilter === category.id}">${category[language]}<sup>${count}</sup></button>`;
    }).join('');
  }
  function renderProjects({animate = false, addedFrom = null} = {}) {
    const grid = $('#project-grid');
    const previousHeight = grid.getBoundingClientRect().height;
    motion.stop(grid);
    const all = getFiltered();
    const shown = all.slice(0, visibleCount);
    $('#project-grid').innerHTML = shown.map(project => {
      const index = data.projects.indexOf(project) + 1;
      const category = data.categories.find(item => item.id === project.category);
      return `<article class="project-card" data-id="${project.id}"><button type="button" class="project-open" data-project="${project.id}" aria-label="${escapeHTML(localize(project.name) + ' — ' + localize(project.subtitle))}"><div class="project-image"><img src="assets/${previewImage(project.image)}" alt="${escapeHTML(localize(project.subtitle) + ' — ' + localize(project.name))}" width="960" height="660" loading="lazy" decoding="async"><span class="project-image-number">${String(index).padStart(2,'0')} / CW</span><span class="project-image-arrow">${icon('arrow-up-right')}</span></div><div class="project-info"><div><h3>${localize(project.name)}</h3><p>${localize(project.subtitle)}</p></div><span class="project-tag">${category[language]}</span></div></button></article>`;
    }).join('');
    $('#load-more').hidden = shown.length >= all.length;
    $('#remaining-count').textContent = `(${all.length - shown.length})`;
    $('#project-result').textContent = t('shown').replace('{count}', shown.length).replace('{total}', all.length);
    if (animate) {
      motion.resizeContent(grid, previousHeight, {fade:addedFrom === null});
      if (addedFrom !== null && typeof IntersectionObserver === 'undefined') $$('.project-card', grid).slice(addedFrom).forEach(card => motion.enter(card));
    }
    motion.observeProjectCards();
  }
  function carouselVisibleCount() { return window.innerWidth >= 961 ? 3 : window.innerWidth >= 701 ? 2 : 1; }
  function carouselProgress() {
    if (!carouselAnimation || !carouselDuration) return carouselIndex / data.projects.length;
    return (((carouselAnimation.currentTime || 0) % carouselDuration) + carouselDuration) % carouselDuration / carouselDuration;
  }
  function updateCarouselStatus() {
    const count = data.projects.length;
    carouselIndex = Math.floor(carouselProgress() * count + .0001) % count;
    $('#carousel-viewport').dataset.carouselIndex = String(carouselIndex);
    $('#carousel-count').textContent = `${String(carouselIndex + 1).padStart(2,'0')} / ${String(count).padStart(2,'0')}`;
    $('#carousel-prev').disabled = count < 2;
    $('#carousel-next').disabled = count < 2;
    if (carouselVisible) {
      const slides = $$('.carousel-slide', $('#carousel-track'));
      slides.slice(carouselIndex, carouselIndex + carouselVisibleCount() + 2).forEach(slide => { $('img', slide).loading = 'eager'; });
    }
  }
  function updateCarouselToggle() {
    const paused = carouselUserPaused || carouselReducedMotion.matches;
    const button = $('#carousel-toggle');
    button.setAttribute('aria-pressed', String(paused));
    const labels = {
      ru: ['Автопрокрутка отключена', 'Продолжить карусель', 'Остановить карусель'],
      uz: ['Avtomatik aylantirish oʻchirilgan', 'Karuselni davom ettirish', 'Karuselni toʻxtatish'],
      en: ['Autoplay is off', 'Resume carousel', 'Pause carousel']
    }[language];
    button.setAttribute('aria-label', labels[carouselReducedMotion.matches ? 0 : paused ? 1 : 2]);
    button.disabled = carouselReducedMotion.matches;
    $('.icon-pause', button).hidden = paused;
    $('.icon-play', button).hidden = !paused;
  }
  function syncCarouselAutoplay() {
    if (carouselStatusTimer !== null) { window.clearInterval(carouselStatusTimer); carouselStatusTimer = null; }
    const focusedCard = document.activeElement?.closest?.('.carousel-slide');
    const playing = carouselVisible && !carouselUserPaused && !carouselReducedMotion.matches &&
      !document.hidden && !focusedCard && !projectDialog.open;
    if (carouselAnimation) {
      if (playing) carouselAnimation.play();
      else carouselAnimation.pause();
    }
    if (playing && carouselAnimation) carouselStatusTimer = window.setInterval(updateCarouselStatus, 350);
    updateCarouselToggle();
  }
  function updateCarousel() {
    const track = $('#carousel-track');
    const card = $('.carousel-slide', track);
    if (!card) return;
    const progress = carouselProgress();
    carouselAnimation?.cancel();
    carouselAnimation = null;
    const gap = parseFloat(getComputedStyle(track).gap) || 22;
    const fallbackWidth = (window.innerWidth - gap * (carouselVisibleCount() - 1)) / carouselVisibleCount();
    carouselStep = (card.getBoundingClientRect().width || fallbackWidth) + gap;
    const distance = carouselStep * data.projects.length;
    carouselDuration = distance / carouselSpeed * 1000;
    track.style.removeProperty('transform');
    if (!carouselReducedMotion.matches && typeof track.animate === 'function') {
      const animation = track.animate([
        {transform:'translate3d(0,0,0)'},
        {transform:`translate3d(-${distance}px,0,0)`}
      ], {duration:carouselDuration, iterations:Infinity, easing:'linear'});
      animation.finished?.catch?.(() => {});
      if (typeof animation.pause === 'function' && typeof animation.play === 'function') {
        carouselAnimation = animation;
        animation.pause();
        animation.currentTime = progress * carouselDuration;
      } else animation.cancel?.();
    }
    if (!carouselAnimation) {
      carouselIndex = Math.floor(progress * data.projects.length) % data.projects.length;
      track.style.transform = `translate3d(-${carouselIndex * carouselStep}px,0,0)`;
    }
    updateCarouselStatus();
    syncCarouselAutoplay();
  }
  function renderCarousel() {
    const slides = data.projects.map(project => {
      const name = localize(project.name);
      return `<article class="carousel-slide"><button type="button" class="carousel-open" data-project="${project.id}" aria-label="${escapeHTML(name + ' — ' + localize(project.subtitle))}"><img src="assets/${previewImage(project.image)}" alt="${escapeHTML(localize(project.subtitle) + ' — ' + name)}" width="960" height="720" loading="lazy" decoding="async"><span class="carousel-card-copy"><span class="carousel-card-name">${escapeHTML(name)}</span><span class="carousel-card-arrow" aria-hidden="true">${icon('arrow-up-right')}</span></span></button></article>`;
    }).join('');
    $('#carousel-track').innerHTML = slides + slides;
    $$('.carousel-slide', $('#carousel-track')).slice(data.projects.length).forEach(slide => {
      slide.setAttribute('aria-hidden', 'true');
      $('.carousel-open', slide).tabIndex = -1;
    });
    updateCarousel();
  }
  function moveCarousel(direction) {
    carouselUserPaused = true;
    if (carouselAnimation) {
      const stepTime = carouselStep / carouselSpeed * 1000;
      carouselAnimation.currentTime = (((carouselAnimation.currentTime || 0) + direction * stepTime) % carouselDuration + carouselDuration) % carouselDuration;
    } else {
      carouselIndex = (carouselIndex + direction + data.projects.length) % data.projects.length;
      $('#carousel-track').style.transform = `translate3d(-${carouselIndex * carouselStep}px,0,0)`;
    }
    updateCarouselStatus();
    syncCarouselAutoplay();
  }
  function renderServices() {
    const list = $('#service-list');
    $$('.service-item', list).forEach(detail => { motion.stop(detail); motion.stop($('.service-body', detail)); });
    list.innerHTML = data.services.map((service, index) => `<details class="service-item" data-service-id="${service.id}" data-expanded="${activeService === service.id}"${activeService === service.id ? ' open' : ''}><summary><span class="service-number">${String(index + 1).padStart(2,'0')}</span><h3>${localize(service.title)}</h3></summary><div class="service-body"><p>${localize(service.description)}</p><div class="service-tags">${service.tags[language].map(tag => `<span>${tag}</span>`).join('')}</div><a class="text-link" href="order.html?service=${encodeURIComponent(service.id)}#order-builder"><span>${t('serviceCTA')}</span>${icon('arrow-up-right')}</a></div></details>`).join('');
    $$('.service-item').forEach(detail => {
      $('summary', detail).addEventListener('click', event => {
        event.preventDefault();
        setServiceExpanded(detail, detail.dataset.expanded !== 'true');
      });
      detail.addEventListener('toggle', () => {
        if (!detail.isConnected || detail.dataset.closing === 'true') return;
        if (detail.open !== (detail.dataset.expanded === 'true')) setServiceExpanded(detail, detail.open);
      });
    });
    updateServiceImage();
  }
  function setServiceExpanded(detail, open) {
    const body = $('.service-body', detail);
    const height = detail.getBoundingClientRect().height;
    const opacity = detail.open ? getComputedStyle(body).opacity : 0;
    motion.stop(detail); motion.stop(body);
    detail.dataset.expanded = String(open);
    detail.dataset.closing = String(!open);
    if (open) {
      detail.open = true;
      activeService = detail.dataset.serviceId;
      $$('.service-item').forEach(other => { if (other !== detail && other.dataset.expanded === 'true') setServiceExpanded(other, false); });
      updateServiceImage(true);
    }
    const style = getComputedStyle(detail);
    const border = (parseFloat(style.borderTopWidth) || 0) + (parseFloat(style.borderBottomWidth) || 0);
    const target = open ? detail.getBoundingClientRect().height : $('summary', detail).getBoundingClientRect().height + border;
    detail.style.overflow = 'hidden';
    body.inert = !open;
    motion.play(body, [{opacity},{opacity:open ? 1 : 0}]);
    motion.play(detail, [{height:`${height}px`},{height:`${target}px`}], () => {
      if (detail.dataset.expanded !== String(open)) return;
      detail.open = open;
      delete detail.dataset.closing;
      detail.style.removeProperty('overflow');
    });
  }
  function updateServiceImage(animate = false) {
    const service = data.services.find(item => item.id === activeService);
    $('#service-image').src = `assets/${previewImage(service.image)}`;
    $('#service-image').alt = localize(service.title);
    $('#service-image-caption').textContent = localize(service.title);
    if (animate) { motion.enter($('#service-image')); motion.enter($('#service-image-caption'), {distance:0}); }
  }
  function setLanguage(nextLanguage, animate = true) {
    language = nextLanguage;
    document.documentElement.lang = language;
    document.title = location.pathname.endsWith('/projects.html')
      ? {ru:'Проекты — ColourWay Design',uz:'Loyihalar — ColourWay Design',en:'Projects — ColourWay Design'}[language]
      : {ru:'ColourWay — делаем бренды заметными',uz:'ColourWay — brendingizni yorqin qilamiz',en:'ColourWay — making brands stand out'}[language];
    $$('[data-i18n]').forEach(el => { el.innerHTML = t(el.dataset.i18n); });
    $$('[data-placeholder-i18n]').forEach(el => { el.placeholder = t(el.dataset.placeholderI18n); });
    $$('[data-aria-i18n]').forEach(el => { el.setAttribute('aria-label', t(el.dataset.ariaI18n)); });
    $$('[data-alt-i18n]').forEach(el => { el.alt = t(el.dataset.altI18n); });
    $$('[data-roledescription-i18n]').forEach(el => { el.setAttribute('aria-roledescription', t(el.dataset.roledescriptionI18n)); });
    $$('[data-lang]').forEach(button => { const active = button.dataset.lang === language; button.classList.toggle('active', active); button.setAttribute('aria-pressed', String(active)); });
    renderCarousel(); renderFilters(); renderProjects();
    if ($('#service-list')) renderServices();
    if (currentProject) updateProjectDialog();
    try { localStorage.setItem('colourway-language', language); } catch (_) { /* Language still works without persistence. */ }
    if (animate) ['main','.footer','.desktop-nav','.header-actions'].forEach(selector => { const node = $(selector); if (node) motion.enter(node, {distance:0, opacity:.3}); });
  }
  function setMenu(open) {
    const menu = $('#mobile-nav');
    if (menu.hidden && !open) return;
    if ($('.menu-toggle').getAttribute('aria-expanded') === String(open)) return;
    const wasHidden = menu.hidden;
    const opacity = wasHidden ? 0 : getComputedStyle(menu).opacity;
    const transform = wasHidden ? 'translateY(-12px)' : getComputedStyle(menu).transform;
    $('.menu-toggle').setAttribute('aria-expanded', String(open));
    menu.hidden = false;
    menu.inert = !open;
    motion.play(menu, [{opacity, transform},{opacity:open ? 1 : 0, transform:open ? 'translateY(0)' : 'translateY(-12px)'}], () => {
      if ($('.menu-toggle').getAttribute('aria-expanded') === String(open)) menu.hidden = !open;
    });
  }
  function openDialog(dialog, opener) {
    dialogOpeners.set(dialog, opener || document.activeElement);
    motion.stopScroll();
    motion.stop(dialog);
    dialog.classList.remove('is-closing');
    setMenu(false);
    document.body.classList.add('modal-open');
    if (!dialog.open) dialog.showModal();
    syncCarouselAutoplay();
    $('.dialog-close', dialog).focus({preventScroll:true});
    motion.play(dialog, [{opacity:0, transform:'translateY(22px) scale(.98)'},{opacity:1, transform:'translateY(0) scale(1)'}]);
  }
  function closeDialog(dialog) {
    if (!dialog.open || dialog.classList.contains('is-closing')) return;
    const style = getComputedStyle(dialog);
    const start = {opacity:style.opacity, transform:style.transform};
    dialog.classList.add('is-closing');
    motion.play(dialog, [start,{opacity:0, transform:'translateY(22px) scale(.98)'}], () => {
      dialog.classList.remove('is-closing');
      dialog.close();
    });
  }
  function updateProjectDialog(direction = 0) {
    const project = data.projects.find(item => item.id === currentProject);
    if (!project) return;
    const category = data.categories.find(item => item.id === project.category);
    $('#project-dialog-image').src = `assets/${project.image}`;
    $('#project-dialog-image').alt = `${localize(project.name)} — ${localize(project.subtitle)}`;
    $('#project-dialog-title').textContent = localize(project.name);
    $('#project-dialog-category').textContent = category[language];
    $('#project-dialog-description').textContent = localize(project.description);
    $('#similar-project').href = `order.html?project=${encodeURIComponent(project.id)}#order-builder`;
    $('#project-position').textContent = `${projectSequence.indexOf(currentProject) + 1} / ${projectSequence.length}`;
    $('#project-prev').disabled = projectSequence.length < 2;
    $('#project-next').disabled = projectSequence.length < 2;
    if (direction) {
      motion.enter($('#project-dialog-image'), {axis:'x', distance:24 * direction});
      motion.enter($('.project-dialog-info'), {axis:'x', distance:16 * direction});
    }
  }
  function showProject(id, opener) {
    currentProject = id;
    const fromPortfolio = !!opener.closest('#project-grid');
    projectSequence = (fromPortfolio ? getFiltered() : data.projects).map(project => project.id);
    updateProjectDialog();
    openDialog(projectDialog, opener);
  }
  function navigateProject(direction) {
    if (projectDialog.classList.contains('is-closing') || projectSequence.length < 2) return;
    const index = projectSequence.indexOf(currentProject);
    currentProject = projectSequence[(index + direction + projectSequence.length) % projectSequence.length];
    updateProjectDialog(direction);
  }
  document.addEventListener('click', event => {
    const langButton = event.target.closest('[data-lang]');
    if (langButton && langButton.dataset.lang !== language) setLanguage(langButton.dataset.lang);
    const filterButton = event.target.closest('[data-filter]');
    if (filterButton) {
      currentFilter = filterButton.dataset.filter; visibleCount = 6;
      renderFilters(); renderProjects({animate:true});
      $(`[data-filter="${currentFilter}"]`).focus({preventScroll:true});
    }
    const projectButton = event.target.closest('[data-project]');
    if (projectButton?.closest('.work-carousel')) { carouselUserPaused = true; syncCarouselAutoplay(); }
    if (projectButton && performance.now() >= suppressProjectClickUntil) showProject(projectButton.dataset.project, projectButton);
    const closeButton = event.target.closest('[data-close-dialog]');
    if (closeButton) closeDialog(closeButton.closest('dialog'));
    if (event.target.closest('#mobile-nav a')) setMenu(false);
  });
  $('#load-more').addEventListener('click', () => {
    const previousCount = Math.min(visibleCount, getFiltered().length);
    visibleCount += 6; renderProjects({animate:true, addedFrom:previousCount});
    const nextCard = $$('.project-open')[previousCount];
    if (nextCard) nextCard.focus({preventScroll:true});
  });
  $('#carousel-prev').addEventListener('click', () => moveCarousel(-1));
  $('#carousel-next').addEventListener('click', () => moveCarousel(1));
  $('#carousel-toggle').addEventListener('click', () => { carouselUserPaused = !carouselUserPaused; syncCarouselAutoplay(); });
  const carouselViewport = $('#carousel-viewport');
  const carouselSection = $('.work-carousel');
  if (typeof IntersectionObserver === 'function') {
    const carouselObserver = new IntersectionObserver(entries => {
      carouselVisible = entries[0].isIntersecting;
      if (carouselVisible) updateCarouselStatus();
      syncCarouselAutoplay();
    }, {threshold:.2});
    carouselObserver.observe(carouselSection);
  } else { carouselVisible = true; syncCarouselAutoplay(); }
  carouselSection.addEventListener('focusin', syncCarouselAutoplay);
  carouselSection.addEventListener('focusout', () => window.queueMicrotask(syncCarouselAutoplay));
  document.addEventListener('visibilitychange', syncCarouselAutoplay);
  carouselReducedMotion.addEventListener('change', syncCarouselAutoplay);
  let carouselPointerX = null;
  carouselViewport.addEventListener('pointerdown', event => { carouselPointerX = event.clientX; carouselUserPaused = true; syncCarouselAutoplay(); });
  carouselViewport.addEventListener('pointerup', event => {
    if (carouselPointerX === null) return;
    const distance = event.clientX - carouselPointerX;
    carouselPointerX = null;
    if (Math.abs(distance) < 45) return;
    suppressProjectClickUntil = performance.now() + 500;
    moveCarousel(distance < 0 ? 1 : -1);
  });
  carouselViewport.addEventListener('pointercancel', () => { carouselPointerX = null; });
  carouselViewport.addEventListener('keydown', event => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault(); event.stopPropagation();
      moveCarousel(event.key === 'ArrowRight' ? 1 : -1);
    }
  });
  window.addEventListener('resize', updateCarousel);
  $('.menu-toggle').addEventListener('click', () => { setMenu($('.menu-toggle').getAttribute('aria-expanded') !== 'true'); });
  window.matchMedia('(min-width:961px)').addEventListener('change', event => { if (event.matches) setMenu(false); });
  $('#project-prev').addEventListener('click', () => navigateProject(-1));
  $('#project-next').addEventListener('click', () => navigateProject(1));
  document.addEventListener('keydown', event => {
    if (projectDialog.open && (event.key === 'ArrowRight' || event.key === 'ArrowLeft')) { event.preventDefault(); navigateProject(event.key === 'ArrowRight' ? 1 : -1); }
    if (event.key === 'Escape') setMenu(false);
  });
  [projectDialog].forEach(dialog => {
    dialog.addEventListener('click', event => { if (event.target === dialog) { const rect = dialog.getBoundingClientRect(); if(event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) closeDialog(dialog); } });
    dialog.addEventListener('cancel', event => { event.preventDefault(); closeDialog(dialog); });
    dialog.addEventListener('close', () => { motion.stop(dialog); dialog.classList.remove('is-closing'); if (!projectDialog.open) document.body.classList.remove('modal-open'); const opener = dialogOpeners.get(dialog); if(opener && opener.isConnected && !projectDialog.open) opener.focus({preventScroll:true}); syncCarouselAutoplay(); });
  });
  setLanguage(language, false);
  motion.observeSections();
})();
