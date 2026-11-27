'use strict';
document.addEventListener('DOMContentLoaded',()=>{
  const translate = phrase => window.CW_VARIANT_T?.(phrase) || phrase;

  function bindGalleryControls(dialog, stepPhoto) {
    const previous = dialog.querySelector('[data-gallery-previous]');
    const next = dialog.querySelector('[data-gallery-next]');
    const count = dialog.querySelector('[data-gallery-count]');
    const updateLabels = () => {
      previous.setAttribute('aria-label', translate('Предыдущее фото'));
      next.setAttribute('aria-label', translate('Следующее фото'));
    };
    previous.addEventListener('click', () => stepPhoto(-1));
    next.addEventListener('click', () => stepPhoto(1));
    dialog.addEventListener('keydown', event => {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
      event.preventDefault();
      stepPhoto(event.key === 'ArrowLeft' ? -1 : 1);
    });
    document.addEventListener('cw-language-change', updateLabels);
    updateLabels();

    return (index, total) => {
      const position = `${index + 1} / ${total}`;
      count.textContent = position;
      previous.disabled = next.disabled = total < 2;
      return position;
    };
  }

  const menu=document.getElementById('variant-mobile-nav');
  const menuButton=document.querySelector('.menu-toggle');
  if(menu && menuButton){
    const setMenu=open=>{menu.hidden=!open;menuButton.setAttribute('aria-expanded',String(open));const label=open?'Закрыть меню':'Открыть меню';menuButton.setAttribute('aria-label',window.CW_VARIANT_T?.(label)||label);};
    menuButton.addEventListener('click',()=>setMenu(menu.hidden));
    menu.addEventListener('click',event=>{if(event.target.closest('a'))setMenu(false);});
    document.addEventListener('keydown',event=>{if(event.key==='Escape')setMenu(false);});
    window.matchMedia('(width > 1040px)').addEventListener('change',event=>{if(event.matches)setMenu(false);});
  }

  const cards=[...document.querySelectorAll('[data-project]')];
  const filters=[...document.querySelectorAll('[data-filter]')];
  for(const filter of filters){
    filter.addEventListener('click',()=>{
      const category=filter.dataset.filter;
      filters.forEach(button=>button.setAttribute('aria-pressed',String(button===filter)));
      let shown=0;
      cards.forEach(card=>{card.hidden=category!=='all' && card.dataset.category!==category;if(!card.hidden)shown++;});
      const empty=document.querySelector('.portfolio-empty');
      if(empty)empty.hidden=shown!==0;
    });
  }

  const projectDialog = document.getElementById('project-dialog');
  if (typeof projectDialog?.showModal === 'function' && window.CW_DATA?.projects) {
    const image = projectDialog.querySelector('#dialog-image');
    const caption = projectDialog.querySelector('#dialog-photo-caption');
    const title = projectDialog.querySelector('#dialog-title');
    const brand = projectDialog.querySelector('#dialog-brand');
    const description = projectDialog.querySelector('#dialog-description');
    const local = value => typeof value === 'string' ? value : value?.[window.CW_CURRENT_LANG] || value?.ru || '';
    let project;
    let photos = [];
    let activeIndex = 0;
    const updateControls = bindGalleryControls(projectDialog, step => showPhoto(activeIndex + step));

    function showPhoto(index) {
      activeIndex = (index + photos.length) % photos.length;
      const photo = photos[activeIndex];
      const position = updateControls(activeIndex, photos.length);
      const src = `assets/${photo.image}`;
      if (image.getAttribute('src') !== src) image.src = src;
      const work = local(photo.subtitle ?? project.subtitle);
      const brands = (photo.brands ?? project.brands ?? []).map(translate).join(' · ');
      title.textContent = work;
      brand.textContent = brands;
      brand.hidden = !brands;
      description.textContent = local(photo.description ?? project.description);
      const subject = brands ? `${work} · ${brands}` : work;
      image.alt = `${subject} — ${translate('Фото')} ${position}`;
      caption.hidden = !photo.related;
      caption.textContent = photo.related ? translate('Похожая работа') : '';
    }

    function renderProject() {
      const category = window.CW_DATA.categories.find(item => item.id === project.category);
      projectDialog.querySelector('#dialog-category').textContent = local(category);
      showPhoto(activeIndex);
    }

    const openProject = id => {
      const match = window.CW_DATA.projects.find(item => item.id === id);
      if (!match) return;
      project = match;
      photos = [{image: project.image}, ...(project.gallery ?? [])];
      activeIndex = 0;
      renderProject();
      projectDialog.showModal();
    };
    for (const card of cards) {
      card.addEventListener('click', event => {
        if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        card.focus({preventScroll: true});
        openProject(card.dataset.project);
      });
    }
    const linked = location.hash.slice(1);
    if (cards.some(card => encodeURIComponent(card.dataset.project) === linked)) {
      requestAnimationFrame(() => openProject(linked));
    }
    document.addEventListener('cw-language-change', () => {
      if (projectDialog.open) renderProject();
    });
  }

  const certificateDialog=document.getElementById('certificate-dialog');
  if(certificateDialog && typeof certificateDialog.showModal==='function'){
    document.querySelectorAll('[data-certificate]').forEach(link=>link.addEventListener('click',event=>{event.preventDefault();certificateDialog.showModal();}));
  }

  for (const card of document.querySelectorAll('[data-person]')) {
    const dialog = document.getElementById(card.getAttribute('aria-controls'));
    if (typeof dialog?.showModal !== 'function') continue;

    card.addEventListener('click', event => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      card.focus({preventScroll: true});
      dialog.showModal();
    });
  }

  const serviceGallery = document.getElementById('service-gallery-dialog');
  if (typeof serviceGallery?.showModal === 'function') {
    const image = serviceGallery.querySelector('[data-gallery-image]');
    const title = serviceGallery.querySelector('#service-gallery-title');
    const galleries = [...document.querySelectorAll('[data-service-gallery]')].map(group => ({
      heading: group.closest('.detail-service').querySelector('h2'),
      photos: [...group.querySelectorAll('[data-service-photo]')]
    }));
    let activeGallery;
    let activeIndex = 0;
    const updateControls = bindGalleryControls(serviceGallery, step => showPhoto(activeIndex + step));

    function showPhoto(index) {
      const {photos, heading} = activeGallery;
      activeIndex = (index + photos.length) % photos.length;
      const position = updateControls(activeIndex, photos.length);
      title.textContent = heading.textContent.trim();
      image.src = photos[activeIndex].href;
      image.alt = `${title.textContent} — ${translate('Фото')} ${position}`;
    }

    for (const gallery of galleries) {
      gallery.photos.forEach((link, index) => link.addEventListener('click', event => {
        if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        activeGallery = gallery;
        showPhoto(index);
        link.focus({preventScroll: true});
        serviceGallery.showModal();
      }));
    }

    const localizeGallery = () => {
      for (const {photos, heading} of galleries) {
        photos.forEach((link, index) => link.setAttribute('aria-label', `${translate('Открыть фото')} ${index + 1} — ${heading.textContent.trim()}`));
      }
      if (serviceGallery.open) showPhoto(activeIndex);
    };

    document.addEventListener('cw-language-change', localizeGallery);
    localizeGallery();
  }

  document.querySelectorAll('dialog').forEach(dialog=>{
    const closeButton = dialog.querySelector('[data-close-dialog]');
    if (closeButton) {
      const updateCloseLabel = () => closeButton.setAttribute('aria-label', window.CW_VARIANT_T?.('Закрыть') || 'Закрыть');
      updateCloseLabel();
      document.addEventListener('cw-language-change', updateCloseLabel);
      closeButton.addEventListener('click', () => dialog.close());
    }
    dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close();});
  });

  const video=document.getElementById('production-video');
  const videoButton=document.querySelector('.video-toggle');
  if(video && videoButton){
    const updateButton=()=>{
      const running=!video.paused;
      videoButton.textContent=window.CW_VARIANT_T?.(running?'Остановить видео':'Включить видео ↗')||'Включить видео ↗';
      videoButton.setAttribute('aria-pressed',String(running));
    };
    const play=()=>{video.play().then(updateButton).catch(updateButton);};
    videoButton.addEventListener('click',()=>{
      if(video.paused)play();
      else video.pause();
    });
    video.addEventListener('play',updateButton);
    video.addEventListener('pause',updateButton);
    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){
      video.removeAttribute('autoplay');
      video.pause();
    }else play();
    document.addEventListener('cw-language-change',updateButton);
    updateButton();
  }
});
