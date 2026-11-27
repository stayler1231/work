'use strict';
(() => {
  const root = document.documentElement;
  const timing = getComputedStyle(root).getPropertyValue('--motion-duration').trim() || '.8s';
  const duration = parseFloat(timing) * (timing.endsWith('ms') ? 1 : 1000);
  const easing = 'cubic-bezier(.22,.61,.36,1)';
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const active = new Map();
  let scrollFrame = null;
  let revealObserver = null;
  let projectObserver = null;

  const enabled = () => !preference.matches && typeof Element.prototype.animate === 'function';
  function stop(element) {
    const record = active.get(element);
    if (!record) return;
    active.delete(element);
    record.animation.cancel();
  }
  function play(element, frames, onFinish = () => {}) {
    if (!element) return Promise.resolve(false);
    stop(element);
    if (!enabled() || !element.isConnected) {
      onFinish();
      return Promise.resolve(true);
    }
    const animation = element.animate(frames, {duration, easing, fill:'none'});
    const record = {animation, onFinish};
    active.set(element, record);
    return animation.finished.then(() => {
      if (active.get(element) !== record) return false;
      active.delete(element);
      onFinish();
      return true;
    }, () => false);
  }
  function enter(element, {axis = 'y', distance = 16, opacity = 0} = {}) {
    return play(element, [
      {opacity, transform:`translate${axis.toUpperCase()}(${distance}px)`},
      {opacity:1, transform:'translate(0, 0)'}
    ]);
  }
  function resizeContent(element, previousHeight, {fade = true} = {}) {
    stop(element);
    const height = element.getBoundingClientRect().height;
    element.style.overflow = 'clip';
    return play(element, [
      {height:`${previousHeight}px`, opacity:fade ? 0 : 1, transform:fade ? 'translateY(12px)' : 'none'},
      {height:`${height}px`, opacity:1, transform:'none'}
    ], () => { element.style.removeProperty('overflow'); });
  }
  function stopScroll() {
    if (scrollFrame !== null) window.cancelAnimationFrame(scrollFrame);
    scrollFrame = null;
  }
  function scrollToHash(hash, {record = true} = {}) {
    let target;
    try { target = document.getElementById(decodeURIComponent(hash.slice(1))); } catch (_) { return false; }
    if (!target) return false;
    stopScroll();
    const from = window.scrollY;
    const offset = (document.querySelector('.header')?.getBoundingClientRect().height || 0) + 16;
    const desired = target.id === 'top' ? 0 : target.getBoundingClientRect().top + from - offset;
    const maximum = Math.max(0, root.scrollHeight - window.innerHeight);
    const destination = Math.max(0, Math.min(maximum, desired));
    if (record && window.location.hash !== hash) window.history.pushState(null, '', hash);
    const finish = () => {
      scrollFrame = null;
      const needsTabindex = !target.hasAttribute('tabindex') && !target.matches('a, button, input, textarea, select');
      if (needsTabindex) {
        target.setAttribute('tabindex', '-1');
        target.addEventListener('blur', () => target.removeAttribute('tabindex'), {once:true});
      }
      target.focus({preventScroll:true});
    };
    if (preference.matches || Math.abs(destination - from) < 1) {
      window.scrollTo({top:destination, behavior:'instant'});
      finish();
      return true;
    }
    const started = performance.now();
    const frame = now => {
      const progress = Math.min(1, Math.max(0, (now - started) / duration));
      const eased = progress < .5 ? 4 * progress ** 3 : 1 - (-2 * progress + 2) ** 3 / 2;
      window.scrollTo({top:from + (destination - from) * eased, behavior:'instant'});
      if (progress < 1) scrollFrame = window.requestAnimationFrame(frame);
      else finish();
    };
    scrollFrame = window.requestAnimationFrame(frame);
    return true;
  }
  function observeSections() {
    if (!enabled() || typeof IntersectionObserver !== 'function') return;
    revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.remove('motion-pending');
        enter(entry.target, {distance:24});
        revealObserver.unobserve(entry.target);
      });
    }, {threshold:.06});
    document.querySelectorAll('.section-heading, .services-layout, .about-layout, .partners, .process-grid, .contact-layout, .footer-main').forEach(element => {
      if (element.getBoundingClientRect().top < window.innerHeight * .9) return;
      element.classList.add('motion-pending');
      revealObserver.observe(element);
    });
    document.addEventListener('focusin', event => {
      const pending = event.target.closest('.motion-pending');
      if (pending) {
        pending.classList.remove('motion-pending');
        revealObserver?.unobserve(pending);
        enter(pending);
      }
    });
  }
  function observeProjectCards() {
    projectObserver?.disconnect();
    if (!enabled() || typeof IntersectionObserver !== 'function') return;
    projectObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        const card = entry.target;
        if (entry.isIntersecting) {
          delete card.dataset.scrollSide;
          card.classList.add('is-visible');
        } else {
          card.dataset.scrollSide = entry.boundingClientRect.bottom < 0 ? 'above' : 'below';
          card.classList.remove('is-visible');
        }
      });
    }, {threshold:.15});
    document.querySelectorAll('#project-grid > .project-card').forEach(card => {
      const bounds = card.getBoundingClientRect();
      card.classList.add('is-scroll-managed');
      if (bounds.top < window.innerHeight * .95 && bounds.bottom > 0) card.classList.add('is-visible');
      else card.dataset.scrollSide = bounds.bottom < 0 ? 'above' : 'below';
      projectObserver.observe(card);
    });
  }
  document.addEventListener('click', event => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const anchor = event.target.closest('a[href^="#"]');
    if (anchor && anchor.hash && scrollToHash(anchor.hash)) event.preventDefault();
  });
  ['wheel','touchstart','pointerdown'].forEach(type => window.addEventListener(type, stopScroll, {passive:true}));
  window.addEventListener('keydown', event => {
    if (['Tab','PageUp','PageDown','Home','End','ArrowUp','ArrowDown','Escape',' '].includes(event.key)) stopScroll();
  });
  window.addEventListener('popstate', () => scrollToHash(window.location.hash || '#top', {record:false}));
  preference.addEventListener('change', event => {
    if (!event.matches) return;
    stopScroll();
    for (const [element, record] of [...active]) {
      try { record.animation.finish(); }
      catch (_) { stop(element); record.onFinish(); }
    }
    revealObserver?.disconnect();
    projectObserver?.disconnect();
    document.querySelectorAll('.motion-pending').forEach(element => element.classList.remove('motion-pending'));
    document.querySelectorAll('.project-card.is-scroll-managed').forEach(element => element.classList.remove('is-scroll-managed','is-visible'));
  });
  window.CW_MOTION = {duration, enabled, play, stop, enter, resizeContent, stopScroll, observeSections, observeProjectCards};
})();
