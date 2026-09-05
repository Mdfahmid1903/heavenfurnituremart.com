(function () {
  'use strict';

  const body = document.body;
  const header = document.getElementById('siteHeader');
  const mega = document.getElementById('megaMenu');
  const trigger = document.getElementById('furnitureTrigger');
  const mobile = document.getElementById('mobileMenu');
  const menuButton = document.getElementById('menuButton');
  const overlay = document.getElementById('pageOverlay');
  const cart = document.getElementById('cartDrawer');
  const search = document.getElementById('searchDialog');
  const quick = document.getElementById('quickDialog');
  const toast = document.getElementById('toast');
  const loader = document.getElementById('siteLoader');
  if (loader) {
    body.classList.add('is-loading');
    const hideLoader = () => {
      setTimeout(() => {
        loader.classList.add('is-hidden');
        body.classList.remove('is-loading');
      }, 850);
    };
    if (document.readyState === 'complete') hideLoader();
    else window.addEventListener('load', hideLoader, { once: true });
    loader.addEventListener('transitionend', () => loader.remove(), { once: true });
  }
  let lastFocus = null;

  function setLocked(locked) { body.classList.toggle('is-locked', locked); }
  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('is-visible');
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => toast.classList.remove('is-visible'), 2600);
  }

  function closeMega() {
    if (!mega || !trigger) return;
    mega.classList.remove('is-open');
    mega.setAttribute('aria-hidden', 'true');
    mega.inert = true;
    trigger.setAttribute('aria-expanded', 'false');
  }
  function toggleMega() {
    const open = !mega.classList.contains('is-open');
    mega.classList.toggle('is-open', open);
    mega.setAttribute('aria-hidden', String(!open));
    mega.inert = !open;
    trigger.setAttribute('aria-expanded', String(open));
  }
  if (trigger) {
    trigger.addEventListener('click', toggleMega);
    document.addEventListener('click', event => { if (!header.contains(event.target)) closeMega(); });
  }

  function openMobile() {
    lastFocus = document.activeElement;
    mobile.inert = false;
    mobile.classList.add('is-open');
    mobile.setAttribute('aria-hidden', 'false');
    menuButton.setAttribute('aria-expanded', 'true');
    overlay.classList.add('is-active');
    setLocked(true);
    mobile.querySelector('.close-btn').focus();
  }
  function closeMobile() {
    if (!mobile) return;
    mobile.classList.remove('is-open');
    mobile.setAttribute('aria-hidden', 'true');
    mobile.inert = true;
    menuButton?.setAttribute('aria-expanded', 'false');
    overlay?.classList.remove('is-active');
    setLocked(false);
    if (lastFocus) lastFocus.focus();
  }
  if (menuButton) {
    menuButton.addEventListener('click', openMobile);
    document.querySelector('[data-close-menu]').addEventListener('click', closeMobile);
    document.querySelectorAll('[data-mobile-link]').forEach(link => link.addEventListener('click', closeMobile));
  }

  function openCart() {
    lastFocus = document.activeElement;
    cart.inert = false;
    cart.classList.add('is-open');
    cart.setAttribute('aria-hidden', 'false');
    overlay.classList.add('is-active');
    setLocked(true);
    cart.querySelector('.close-btn').focus();
  }
  function closeCart() {
    if (!cart) return;
    cart.classList.remove('is-open');
    cart.setAttribute('aria-hidden', 'true');
    cart.inert = true;
    overlay?.classList.remove('is-active');
    setLocked(false);
    if (lastFocus) lastFocus.focus();
  }
  document.getElementById('cartButton')?.addEventListener('click', openCart);
  document.querySelectorAll('[data-close-cart]').forEach(element => element.addEventListener('click', closeCart));
  overlay?.addEventListener('click', () => { closeMobile(); closeCart(); });

  document.querySelectorAll('[data-open-search]').forEach(button => button.addEventListener('click', () => {
    lastFocus = button;
    search.showModal();
    setTimeout(() => document.getElementById('siteSearch').focus(), 30);
  }));
  document.querySelector('[data-close-dialog]')?.addEventListener('click', () => search.close());
  search?.addEventListener('close', () => lastFocus?.focus());

  const input = document.getElementById('siteSearch');
  const results = document.getElementById('searchResults');
  const searchItems = [['Sofas', 'sofas/'], ['Beds', 'beds/'], ['Bedroom furniture', 'bedroom-furniture/'], ['Dining furniture', 'dining-furniture/'], ['Office furniture', 'office-furniture/'], ['Wardrobes', 'wardrobes/']];
  input?.addEventListener('input', () => {
    const query = input.value.trim().toLowerCase();
    const found = searchItems.filter(item => item[0].toLowerCase().includes(query));
    results.innerHTML = '<p>' + (query ? 'Suggestions' : 'Popular') + '</p>' + found.map(item => '<a href="' + item[1] + '">' + item[0] + '</a>').join('') + (found.length ? '' : '<span>No matching category. Try WhatsApp for a custom piece.</span>');
  });

  document.querySelectorAll('[data-save]').forEach(button => button.addEventListener('click', () => {
    button.classList.toggle('is-saved');
    button.textContent = button.classList.contains('is-saved') ? '♥' : '♡';
    button.setAttribute('aria-pressed', String(button.classList.contains('is-saved')));
    showToast(button.classList.contains('is-saved') ? 'Saved to this device' : 'Removed from saved pieces');
  }));
  document.querySelectorAll('[data-wishlist]').forEach(button => button.addEventListener('click', () => showToast('Saved pieces stay on this device until ecommerce accounts are connected.')));
  document.querySelectorAll('[data-toast]').forEach(button => button.addEventListener('click', () => showToast(button.dataset.toast)));

  document.querySelectorAll('[data-quick-view]').forEach(button => button.addEventListener('click', () => {
    document.getElementById('quickTitle').textContent = button.dataset.quickView;
    const image = document.getElementById('quickImage');
    image.src = button.dataset.image;
    image.alt = button.closest('.product-card').querySelector('img').alt;
    document.getElementById('quickWhatsApp').href = 'https://wa.me/8801960481983?text=' + encodeURIComponent('Hello Heaven Furniture Mart, I would like to discuss: ' + button.dataset.quickView);
    quick.showModal();
  }));
  document.querySelector('[data-close-quick]')?.addEventListener('click', () => quick.close());

  document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
    document.querySelectorAll('[data-filter]').forEach(item => item.classList.toggle('is-active', item === button));
    document.querySelectorAll('.product-card').forEach(card => { card.hidden = button.dataset.filter !== 'all' && card.dataset.category !== button.dataset.filter; });
  }));

  const slider = document.getElementById('heroSlider');
  if (slider) {
    const slides = Array.from(slider.querySelectorAll('.hero__slide'));
    const dots = Array.from(slider.querySelectorAll('[data-slide]'));
    const previous = slider.querySelector('[data-slide-prev]');
    const next = slider.querySelector('[data-slide-next]');
    const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let activeSlide = 0;
    let sliderTimer;

    function showSlide(index) {
      activeSlide = (index + slides.length) % slides.length;
      slides.forEach((slide, position) => {
        const active = position === activeSlide;
        slide.classList.toggle('is-active', active);
        slide.setAttribute('aria-hidden', String(!active));
        slide.inert = !active;
      });
      dots.forEach((dot, position) => {
        const active = position === activeSlide;
        dot.classList.toggle('is-active', active);
        if (active) dot.setAttribute('aria-current', 'true');
        else dot.removeAttribute('aria-current');
      });
    }
    function stopSlider() { clearInterval(sliderTimer); }
    function startSlider() {
      stopSlider();
      if (!reduceMotion) sliderTimer = setInterval(() => showSlide(activeSlide + 1), 6200);
    }
    previous?.addEventListener('click', () => { showSlide(activeSlide - 1); startSlider(); });
    next?.addEventListener('click', () => { showSlide(activeSlide + 1); startSlider(); });
    dots.forEach((dot, index) => dot.addEventListener('click', () => { showSlide(index); startSlider(); }));
    slider.addEventListener('pointerenter', stopSlider);
    slider.addEventListener('pointerleave', startSlider);
    slider.addEventListener('focusin', stopSlider);
    slider.addEventListener('focusout', startSlider);
    document.addEventListener('visibilitychange', () => document.hidden ? stopSlider() : startSlider());
    startSlider();
  }

  function onScroll() { header?.classList.toggle('is-scrolled', window.scrollY > 35); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const revealItems = document.querySelectorAll('.reveal:not(.is-visible)');
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
    revealItems.forEach(element => element.classList.add('is-visible'));
  } else {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) {
        const element = entry.target;
        element.style.transitionDelay = (element.dataset.delay || 0) + 'ms';
        element.classList.add('is-visible');
        observer.unobserve(element);
      }
    }), { threshold: .08, rootMargin: '0px 0px -5%' });
    revealItems.forEach(element => observer.observe(element));
  }

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      closeMega();
      if (mobile?.classList.contains('is-open')) closeMobile();
      if (cart?.classList.contains('is-open')) closeCart();
    }
  });
})();
