/* ============================================================
   ZOE CONFERENCE 2026 — “In the Beginning…”
   Scroll journey: Lenis smooth scroll + GSAP ScrollTrigger
   ============================================================ */
(function () {
  'use strict';

  /* ------------------------------------------------------------
     CONFIG — paste the live registration link here when ready.
     Every .js-register button on the site will pick it up.
     ------------------------------------------------------------ */
  var REGISTER_URL = ''; // e.g. 'https://registrations.example.com/zoe2026'

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Scroll-scrubbed animations + browser scroll restoration fight each other;
     start each visit at the top (or at the hash target) instead. */
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  if (!window.location.hash) window.scrollTo(0, 0);

  /* ---------- Register links ---------- */
  document.querySelectorAll('.js-register').forEach(function (a) {
    if (REGISTER_URL) {
      a.setAttribute('href', REGISTER_URL);
      a.setAttribute('target', '_blank');
      a.setAttribute('rel', 'noopener');
    } else if (a.getAttribute('href') === '#') {
      // Final CTA fallback until the registration platform link is dropped in.
      a.setAttribute('href', 'mailto:zoe@thelifechurch.com?subject=Zoe%20Conference%20Registration');
    }
  });

  /* ---------- Loader ---------- */
  var loader = document.getElementById('loader');
  function dismissLoader() {
    if (loader) loader.classList.add('is-done');
  }
  if (document.readyState !== 'loading') setTimeout(dismissLoader, 400);
  else document.addEventListener('DOMContentLoaded', function () { setTimeout(dismissLoader, 400); });
  setTimeout(dismissLoader, 1500); // safety net

  /* ---------- Smooth scroll (Lenis) ---------- */
  var lenis = null;
  if (!reduceMotion && window.Lenis) {
    lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 1.0 });
    window.__lenis = lenis;
    lenis.on('scroll', function () { if (window.ScrollTrigger) ScrollTrigger.update(); });
    gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);
  }

  function scrollToTarget(target) {
    var el = typeof target === 'string' ? document.querySelector(target) : target;
    if (!el) return;
    if (lenis) lenis.scrollTo(el, { offset: 0, duration: 1.6 });
    else el.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
  }

  /* ---------- Nav ---------- */
  var nav = document.getElementById('nav');
  var burger = document.getElementById('burger');
  var mmenu = document.getElementById('mobileMenu');

  function onScrollNav() {
    if (window.scrollY > 40) nav.classList.add('nav--scrolled');
    else nav.classList.remove('nav--scrolled');
  }
  window.addEventListener('scroll', onScrollNav, { passive: true });
  onScrollNav();

  function closeMenu() {
    burger.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
    mmenu.classList.remove('is-open');
    mmenu.setAttribute('aria-hidden', 'true');
  }
  if (burger) {
    burger.addEventListener('click', function () {
      var open = burger.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', String(open));
      mmenu.classList.toggle('is-open', open);
      mmenu.setAttribute('aria-hidden', String(!open));
    });
    mmenu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', closeMenu);
    });
  }

  /* Anchor links → smooth scroll */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    var href = a.getAttribute('href');
    if (href.length < 2) return;
    a.addEventListener('click', function (e) {
      var el = document.querySelector(href);
      if (!el) return;
      e.preventDefault();
      scrollToTarget(el);
    });
  });

  /* ---------- Ambient videos: lazy load + play in view ---------- */
  var ambients = document.querySelectorAll('.js-ambient');
  if ('IntersectionObserver' in window && !reduceMotion) {
    var vio = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var v = entry.target;
        if (entry.isIntersecting) {
          if (!v.dataset.loaded) {
            v.querySelectorAll('source[data-src]').forEach(function (s) {
              s.src = s.dataset.src;
            });
            v.load();
            v.dataset.loaded = '1';
          }
          v.play().catch(function () {});
        } else if (v.dataset.loaded) {
          v.pause();
        }
      });
    }, { rootMargin: '200px 0px' });
    ambients.forEach(function (v) { vio.observe(v); });
  }
  if (reduceMotion) {
    document.querySelectorAll('video[autoplay]').forEach(function (v) {
      v.removeAttribute('autoplay');
      v.pause();
    });
  }

  /* ---------- Gold dust / fireflies canvas ---------- */
  var canvas = document.getElementById('dust');
  if (canvas && !reduceMotion) {
    var ctx = canvas.getContext('2d');
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var W = 0, H = 0, motes = [];

    function sizeCanvas() {
      W = window.innerWidth; H = window.innerHeight;
      canvas.width = W * dpr; canvas.height = H * dpr;
      canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var target = Math.min(80, Math.round((W * H) / 26000));
      while (motes.length < target) motes.push(newMote(true));
      motes.length = target;
    }

    function newMote(anywhere) {
      return {
        x: Math.random() * W,
        y: anywhere ? Math.random() * H : H + 10,
        r: 0.6 + Math.random() * 1.5,
        vy: 6 + Math.random() * 16,          // px/s upward
        sway: 10 + Math.random() * 26,
        freq: 0.15 + Math.random() * 0.5,
        phase: Math.random() * Math.PI * 2,
        a: 0.12 + Math.random() * 0.4,
        tw: 0.4 + Math.random() * 1.6,        // twinkle speed
        t: Math.random() * 100
      };
    }

    var last = performance.now();
    function tick(now) {
      var dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      ctx.clearRect(0, 0, W, H);
      for (var i = 0; i < motes.length; i++) {
        var m = motes[i];
        m.t += dt;
        m.y -= m.vy * dt;
        var x = m.x + Math.sin(m.t * m.freq * Math.PI * 2 + m.phase) * m.sway;
        var alpha = m.a * (0.55 + 0.45 * Math.sin(m.t * m.tw * Math.PI * 2));
        if (m.y < -12) { motes[i] = newMote(false); continue; }
        ctx.beginPath();
        ctx.arc(x, m.y, m.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(214,178,110,' + alpha.toFixed(3) + ')';
        ctx.shadowColor = 'rgba(214,178,110,0.8)';
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
      requestAnimationFrame(tick);
    }
    sizeCanvas();
    window.addEventListener('resize', sizeCanvas);
    requestAnimationFrame(tick);
  }

  /* ---------- GSAP scroll choreography ---------- */
  if (window.gsap && window.ScrollTrigger && !reduceMotion) {
    gsap.registerPlugin(ScrollTrigger);

    /* Hero: content drifts up + fades, video slowly pushes in */
    gsap.to('.hero__content', {
      yPercent: -28, opacity: 0, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: '75% top', scrub: true }
    });
    gsap.fromTo('.hero__video', { scale: 1 }, {
      scale: 1.14, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
    });

    /* Parallax full-bleed backgrounds */
    gsap.utils.toArray('[data-parallax] img').forEach(function (img) {
      gsap.fromTo(img, { yPercent: -8 }, {
        yPercent: 8, ease: 'none',
        scrollTrigger: { trigger: img.closest('section'), start: 'top bottom', end: 'bottom top', scrub: true }
      });
    });

    /* Journey copy */
    gsap.from('.journey__line', {
      opacity: 0, y: 70, filter: 'blur(10px)', duration: 1.6, ease: 'power3.out',
      scrollTrigger: { trigger: '.journey__line', start: 'top 78%' }
    });
    gsap.from('.journey__verse', {
      opacity: 0, scale: 0.94, y: 50, duration: 1.8, ease: 'power3.out',
      scrollTrigger: { trigger: '.journey__verse', start: 'top 80%' }
    });

    /* Generic panel reveals */
    gsap.utils.toArray('.reveal-panel').forEach(function (el) {
      gsap.from(el, {
        opacity: 0, y: 64, duration: 1.3, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 85%' }
      });
    });

    /* Section headings: soft rise */
    gsap.utils.toArray('.section-head').forEach(function (el) {
      gsap.from(el.children, {
        opacity: 0, y: 44, duration: 1.2, stagger: 0.12, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 84%' }
      });
    });

    /* Letter paper: gentle unfold */
    ScrollTrigger.create({
      trigger: '.letter__paper', start: 'top 80%',
      onEnter: function () {
        gsap.fromTo('.letter__paper',
          { rotateX: 6, transformPerspective: 900, transformOrigin: '50% 0%' },
          { rotateX: 0, duration: 1.6, ease: 'power3.out' });
      },
      once: true
    });
  }
})();
