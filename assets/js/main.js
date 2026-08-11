// Pilotech Toshiba — interactions
(function () {
  "use strict";

  /* Galerie produit : clic sur une vignette = image principale */
  function initGallery() {
    var main = document.getElementById('gallery-main');
    var wrap = document.querySelector('[data-gallery]');
    if (!main || !wrap) return;
    var thumbs = wrap.querySelectorAll('[data-gallery-thumb]');
    thumbs.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var img = btn.querySelector('img');
        if (!img) return;
        main.src = img.src;
        main.alt = img.alt;
        thumbs.forEach(function (t) {
          t.classList.remove('border-primary');
          t.classList.add('border-gray-200', 'opacity-60');
        });
        btn.classList.add('border-primary');
        btn.classList.remove('border-gray-200', 'opacity-60');
      });
    });
  }

  /* Carrousel « autres gammes » : flèches gauche / droite */
  function initCarousel() {
    document.querySelectorAll('[data-carousel]').forEach(function (track) {
      var section = track.closest('section') || document;
      var prev = section.querySelector('[data-carousel-prev]');
      var next = section.querySelector('[data-carousel-next]');
      function step() {
        var card = track.querySelector('a');
        return card ? card.offsetWidth + 20 : 260;
      }
      function refresh() {
        var max = track.scrollWidth - track.clientWidth - 2;
        if (prev) prev.disabled = track.scrollLeft <= 0;
        if (next) next.disabled = track.scrollLeft >= max;
        [prev, next].forEach(function (b) {
          if (b) b.classList.toggle('opacity-40', b.disabled);
        });
      }
      if (prev) prev.addEventListener('click', function () {
        track.scrollBy({ left: -step() * 2, behavior: 'smooth' });
      });
      if (next) next.addEventListener('click', function () {
        track.scrollBy({ left: step() * 2, behavior: 'smooth' });
      });
      track.addEventListener('scroll', refresh);
      window.addEventListener('resize', refresh);
      refresh();
    });
  }

  /* Menu mobile */
  function initDrawer() {
    var open = document.getElementById('open-drawer');
    var drawer = document.getElementById('mobile-drawer');
    var close = document.getElementById('close-drawer');
    var backdrop = document.getElementById('drawer-backdrop');
    if (!open || !drawer) return;
    function show() {
      drawer.classList.remove('translate-x-full');
      if (backdrop) backdrop.classList.remove('hidden');
      document.body.classList.add('overflow-hidden');
    }
    function hide() {
      drawer.classList.add('translate-x-full');
      if (backdrop) backdrop.classList.add('hidden');
      document.body.classList.remove('overflow-hidden');
    }
    open.addEventListener('click', show);
    if (close) close.addEventListener('click', hide);
    if (backdrop) backdrop.addEventListener('click', hide);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') hide();
    });
  }

  /* Onglets produit */
  function initTabs() {
    document.querySelectorAll('[data-tab-group]').forEach(function (group) {
      var tabs = group.querySelectorAll('[data-tab]');
      tabs.forEach(function (tab) {
        tab.addEventListener('click', function () {
          tabs.forEach(function (t) { t.classList.remove('tab-active'); });
          tab.classList.add('tab-active');
          var name = tab.getAttribute('data-tab');
          document.querySelectorAll('[data-tab-content]').forEach(function (p) {
            p.classList.toggle('hidden', p.getAttribute('data-tab-content') !== name);
          });
        });
      });
    });
  }

  function init() { initGallery(); initCarousel(); initDrawer(); initTabs(); }
  if (document.readyState !== 'loading') init();
  else document.addEventListener('DOMContentLoaded', init);
})();
