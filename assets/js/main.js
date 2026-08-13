// Pilotech Toshiba — interactions
(function () {
  "use strict";

  /* Galerie produit : vignettes + flèches + compteur */
  function initGallery() {
    var main = document.getElementById('gallery-main');
    var wrap = document.querySelector('[data-gallery]');
    if (!main || !wrap) return;
    var thumbs = Array.prototype.slice.call(wrap.querySelectorAll('[data-gallery-thumb]'));
    if (!thumbs.length) return;
    var counter = document.querySelector('[data-gallery-counter]');
    var current = 0;

    function show(i) {
      current = (i + thumbs.length) % thumbs.length;
      var img = thumbs[current].querySelector('img');
      if (!img) return;
      main.style.opacity = '0';
      window.setTimeout(function () {
        main.src = img.src;
        main.alt = img.alt;
        main.style.opacity = '1';
      }, 120);
      thumbs.forEach(function (t, k) {
        t.classList.toggle('border-primary', k === current);
        t.classList.toggle('border-gray-200', k !== current);
        t.classList.toggle('opacity-60', k !== current);
      });
      if (counter) counter.textContent = (current + 1) + ' / ' + thumbs.length;
      thumbs[current].scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' });
    }

    main.style.transition = 'opacity .12s ease';
    thumbs.forEach(function (btn, i) { btn.addEventListener('click', function () { show(i); }); });

    var prev = document.querySelector('[data-gallery-prev]');
    var next = document.querySelector('[data-gallery-next]');
    if (prev) prev.addEventListener('click', function () { show(current - 1); });
    if (next) next.addEventListener('click', function () { show(current + 1); });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') show(current - 1);
      if (e.key === 'ArrowRight') show(current + 1);
    });

    /* Balayage tactile sur l'image principale */
    var x0 = null;
    main.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    main.addEventListener('touchend', function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 45) show(dx < 0 ? current + 1 : current - 1);
      x0 = null;
    }, { passive: true });
  }

  /* Carrousel « autres gammes » */
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
        if (prev) { prev.disabled = track.scrollLeft <= 0; prev.classList.toggle('opacity-40', prev.disabled); }
        if (next) { next.disabled = track.scrollLeft >= max; next.classList.toggle('opacity-40', next.disabled); }
      }
      if (prev) prev.addEventListener('click', function () { track.scrollBy({ left: -step() * 2, behavior: 'smooth' }); });
      if (next) next.addEventListener('click', function () { track.scrollBy({ left: step() * 2, behavior: 'smooth' }); });
      track.addEventListener('scroll', refresh);
      window.addEventListener('resize', refresh);
      refresh();
    });
  }

  /* Menu déroulant desktop — ouverture au survol (CSS) + accès clavier */
  function initDropdown() {
    document.querySelectorAll('[data-dropdown]').forEach(function (dd) {
      var trigger = dd.querySelector('a[aria-haspopup]');
      if (!trigger) return;
      function open(v) {
        dd.classList.toggle('is-open', v);
        trigger.setAttribute('aria-expanded', v ? 'true' : 'false');
      }
      dd.addEventListener('mouseenter', function () { open(true); });
      dd.addEventListener('mouseleave', function () { open(false); });
      dd.addEventListener('focusin', function () { open(true); });
      dd.addEventListener('focusout', function (e) {
        if (!dd.contains(e.relatedTarget)) open(false);
      });
      document.addEventListener('keydown', function (e) { if (e.key === 'Escape') open(false); });
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
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') hide(); });
  }

  /* Apparition en fondu montant à l'arrivée dans l'écran */
  function initReveal() {
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var targets = [];
    document.querySelectorAll('main > section, main section > .container, footer .container').forEach(function (el) {
      if (el.closest('[data-reveal]')) return;
      targets.push(el);
    });
    if (reduce || !('IntersectionObserver' in window)) {
      targets.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }
    targets.forEach(function (el, i) {
      el.setAttribute('data-reveal', '');
      el.setAttribute('data-reveal-delay', String(i % 4));
    });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    targets.forEach(function (el) { io.observe(el); });

    /* Le premier écran s'affiche tout de suite */
    window.setTimeout(function () {
      targets.forEach(function (el) {
        if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add('is-visible');
      });
    }, 40);
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


  /* Frise d'étapes : progression du trait rouge selon le défilement */
  function initTimeline() {
    var lines = document.querySelectorAll('[data-timeline]');
    if (!lines.length) return;
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    lines.forEach(function (line) {
      var steps = Array.prototype.slice.call(line.querySelectorAll('[data-step]'));
      if (!steps.length) return;
      var horizontal = line.classList.contains('timeline-h');

      function update() {
        var trigger = window.innerHeight * 0.62;
        var reached = 0;
        steps.forEach(function (s, i) {
          var top = s.getBoundingClientRect().top;
          var on = top < trigger;
          s.classList.toggle('is-active', on);
          if (on) reached = i + 1;
        });
        /* le trait s'arrête au centre de la dernière pastille atteinte */
        var pct = 0;
        if (reached > 0) {
          var lineBox = line.getBoundingClientRect();
          var last = steps[reached - 1].getBoundingClientRect();
          if (horizontal) {
            pct = ((last.left + last.width / 2) - lineBox.left) / lineBox.width * 100;
          } else {
            pct = ((last.top + 28) - lineBox.top) / lineBox.height * 100;
          }
          pct = Math.max(0, Math.min(100, pct));
        }
        line.style.setProperty('--timeline-progress', pct + '%');
      }

      if (reduce) {
        steps.forEach(function (s) { s.classList.add('is-active'); });
        line.style.setProperty('--timeline-progress', '100%');
        return;
      }

      var ticking = false;
      function onScroll() {
        if (ticking) return;
        ticking = true;
        window.requestAnimationFrame(function () { update(); ticking = false; });
      }
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onScroll);
      update();
    });
  }


  /* Carrousel d'avis : défilement auto toutes les 3 s + flèches */
  function initReviews() {
    document.querySelectorAll('[data-reviews]').forEach(function (root) {
      var track = root.querySelector('[data-reviews-track]');
      if (!track) return;
      var slides = Array.prototype.slice.call(track.children);
      if (!slides.length) return;

      var section = root.closest('section') || document;
      var prev = section.querySelector('[data-reviews-prev]');
      var next = section.querySelector('[data-reviews-next]');
      var dotsBox = root.querySelector('[data-reviews-dots]');
      var delay = parseInt(root.getAttribute('data-reviews-interval'), 10) || 3000;
      var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      var index = 0, timer = null;

      function perView() {
        return Math.max(1, Math.round(root.clientWidth / slides[0].getBoundingClientRect().width));
      }
      function maxIndex() { return Math.max(0, slides.length - perView()); }

      function render() {
        var w = slides[0].getBoundingClientRect().width;
        track.style.transform = 'translateX(' + (-index * w) + 'px)';
        if (dotsBox) {
          Array.prototype.slice.call(dotsBox.children).forEach(function (d, i) {
            d.setAttribute('aria-current', i === index ? 'true' : 'false');
          });
        }
      }
      function go(i) {
        var m = maxIndex();
        index = i > m ? 0 : (i < 0 ? m : i);
        render();
      }
      function buildDots() {
        if (!dotsBox) return;
        dotsBox.innerHTML = '';
        for (var i = 0; i <= maxIndex(); i++) {
          var b = document.createElement('button');
          b.type = 'button';
          b.className = 'reviews-dot';
          b.setAttribute('aria-label', 'Avis ' + (i + 1));
          (function (k) { b.addEventListener('click', function () { go(k); restart(); }); })(i);
          dotsBox.appendChild(b);
        }
      }
      function start() {
        if (reduce || timer) return;
        timer = window.setInterval(function () { go(index + 1); }, delay);
      }
      function stop() { window.clearInterval(timer); timer = null; }
      function restart() { stop(); start(); }

      if (prev) prev.addEventListener('click', function () { go(index - 1); restart(); });
      if (next) next.addEventListener('click', function () { go(index + 1); restart(); });

      /* la lecture s'arrête au survol et quand l'onglet est en arrière-plan */
      root.addEventListener('mouseenter', stop);
      root.addEventListener('mouseleave', start);
      root.addEventListener('focusin', stop);
      root.addEventListener('focusout', start);
      document.addEventListener('visibilitychange', function () {
        document.hidden ? stop() : start();
      });

      /* balayage tactile */
      var x0 = null;
      track.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; stop(); }, { passive: true });
      track.addEventListener('touchend', function (e) {
        if (x0 !== null) {
          var dx = e.changedTouches[0].clientX - x0;
          if (Math.abs(dx) > 45) go(dx < 0 ? index + 1 : index - 1);
          x0 = null;
        }
        start();
      }, { passive: true });

      window.addEventListener('resize', function () { buildDots(); go(Math.min(index, maxIndex())); });
      root.setAttribute('data-reviews-ready','');
      buildDots(); render(); start();
    });
  }

  function init() {
    initGallery(); initCarousel(); initDropdown(); initDrawer(); initTabs();
    initReveal(); initTimeline(); initReviews();
  }
  if (document.readyState !== 'loading') init();
  else document.addEventListener('DOMContentLoaded', init);
})();
