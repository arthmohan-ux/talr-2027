/* Cloudflare Turnstile, one loader for every form on the site. The site key lives here only.
   Its secret pair is the TURNSTILE_SECRET script property in the Apps Script project (never in this file).
   Widgets render as "interaction-only": invisible unless Cloudflare needs the person to click. */
(function () {
  var KEY = '0x4AAAAAAF8uyKU04-HS0N6S';
  var queue = [], state = 'idle';
  function load() {
    if (state !== 'idle') return;
    state = 'loading';
    window.tadTurnstileReady = function () { state = 'ready'; queue.splice(0).forEach(function (fn) { fn(); }); };
    var s = document.createElement('script');
    s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&onload=tadTurnstileReady';
    s.async = true; s.defer = true;
    s.onerror = function () { state = 'failed'; queue.splice(0).forEach(function (fn) { fn(); }); };
    document.head.appendChild(s);
  }
  window.TAD_TURNSTILE = {
    key: KEY,
    failed: function () { return state === 'failed'; },
    /* render(el, onToken): calls onToken(token) on success and onToken('') when the token expires */
    render: function (el, onToken) {
      if (!KEY || !el) return null;
      var handle = { id: null, reset: function () { onToken(''); if (handle.id !== null && window.turnstile) window.turnstile.reset(handle.id); } };
      queue.push(function () {
        if (state !== 'ready' || !window.turnstile) return;
        handle.id = window.turnstile.render(el, {
          sitekey: KEY, appearance: 'interaction-only',
          callback: function (t) { onToken(t); },
          'expired-callback': function () { onToken(''); },
          'error-callback': function () { onToken(''); }
        });
      });
      load();
      if (state === 'ready') queue.splice(0).forEach(function (fn) { fn(); });
      return handle;
    }
  };
})();

(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function $(s, c) { return (c || document).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  var ARROW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';

  /* Scroll reveals. Anything already on screen when armed is shown at once,
     so nothing visible ever waits on an observer. */
  var revealIO = null;
  if (!reduce && 'IntersectionObserver' in window) {
    revealIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); revealIO.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  }
  function armReveals(root) {
    $$('[data-reveal]', root).forEach(function (el) {
      if (el.dataset.armed) return;
      el.dataset.armed = '1';
      if (!revealIO) { el.classList.add('in'); return; }
      var r = el.getBoundingClientRect();
      if (r.top < window.innerHeight * 0.95) el.classList.add('in');
      else revealIO.observe(el);
    });
  }

  /* Nav: mobile menu */
  var nav = $('#nav');
  var toggle = $('.nav-toggle');
  function closeMenu() {
    if (!nav || !toggle) return;
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open menu');
  }
  if (nav && toggle) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      if (open) nav.classList.remove('hidden');
    });
    $$('.nav-links a').forEach(function (a) { a.addEventListener('click', closeMenu); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('open')) closeMenu();
    });
    nav.addEventListener('focusin', function () { nav.classList.remove('hidden'); });
  }

  /* Nav: hide on scroll down, show on scroll up */
  var lastNavY = window.scrollY;
  var ticking = false;
  function onScroll() {
    var y = window.scrollY;
    if (nav) {
      var delta = y - lastNavY;
      nav.classList.toggle('scrolled', y > 10);
      if (nav.classList.contains('open') || y < 120) nav.classList.remove('hidden');
      else if (delta > 6) nav.classList.add('hidden');
      else if (delta < -6) nav.classList.remove('hidden');
      if (Math.abs(delta) > 6) lastNavY = y;
    }
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  onScroll();

  /* Count-up numbers (final values are already in the HTML) */
  function countUp(el) {
    var target = +el.dataset.count;
    var suffix = el.dataset.suffix || '';
    var start = performance.now();
    var dur = 1600;
    function step(now) {
      var k = Math.min((now - start) / dur, 1);
      var e = 1 - Math.pow(1 - k, 4);
      el.textContent = Math.round(target * e).toLocaleString('en-US') + suffix;
      if (k < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if (!reduce && 'IntersectionObserver' in window) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { countUp(en.target); cio.unobserve(en.target); }
      });
    }, { threshold: 0 });
    $$('[data-count]').forEach(function (el) { cio.observe(el); });
  }

  /* Editions */
  var FORMAT_CLASS = { 'TALR': 'talr', 'TA Tech': 'tech', 'Roundtable': 'round', "Leaders' Roundtable": 'leaders' };
  var editions = (window.TAD_EDITIONS || []).slice().sort(function (a, b) {
    return a.date < b.date ? 1 : a.date > b.date ? -1 : 0;
  });

  function editionRow(e, i) {
    var d = new Date(e.date + 'T00:00:00');
    var day = d.getDate();
    var mon = d.toLocaleString('en-GB', { month: 'short' });
    var title = e.title || (e.format + (e.city ? ' ' + e.city : ''));
    var tag = e.url ? 'a' : 'article';
    var href = e.url ? ' href="' + esc(e.url) + '"' : '';
    var img = e.image ? '<img src="' + esc(e.image) + '" alt="' + esc(title) + '" loading="lazy">' : '';
    return '<' + tag + ' class="ed"' + href + ' data-reveal style="--d:' + ((i % 3) * 90) + 'ms">' +
      '<div class="ed-date"><time datetime="' + esc(e.date) + '"><span class="d">' + day + '</span><span class="m">' + mon + ' ' + d.getFullYear() + '</span></time></div>' +
      '<div class="ed-photo"><div class="ed-img ph ph-' + ((i % 6) + 1) + '">' + img + '</div></div>' +
      '<div class="ed-body"><div class="ed-meta">' +
        '<span class="fmt fmt-' + (FORMAT_CLASS[e.format] || 'round') + '">' + esc(e.format) + '</span>' +
        (e.city ? '<span class="ed-city">' + esc(e.city) + '</span>' : '') +
        (e.sample ? '<span class="fmt fmt-sample">Sample</span>' : '') +
      '</div><h3>' + esc(title) + '</h3>' + (e.blurb ? '<p>' + esc(e.blurb) + '</p>' : '') + '</div>' +
      (e.url ? '<span class="ed-arrow" aria-hidden="true">' + ARROW + '</span>' : '<span></span>') +
      '</' + tag + '>';
  }

  var latest = $('[data-editions]');
  if (latest) {
    var limit = +latest.dataset.limit || 3;
    latest.innerHTML = editions.slice(0, limit).map(editionRow).join('');
  }

  var all = $('[data-editions-all]');
  if (all) {
    var current = 'All';
    var chips = $$('[data-filter]');
    var render = function () {
      var list = editions.filter(function (e) { return current === 'All' || e.format === current; });
      if (!list.length) { all.innerHTML = '<p class="empty">No editions in this format yet.</p>'; return; }
      var years = {};
      list.forEach(function (e) { var y = e.date.slice(0, 4); (years[y] = years[y] || []).push(e); });
      var n = 0;
      all.innerHTML = Object.keys(years).sort().reverse().map(function (y) {
        return '<section class="year" aria-label="' + y + '"><h2>' + y + '</h2><div class="ed-list">' +
          years[y].map(function (e) { return editionRow(e, n++); }).join('') + '</div></section>';
      }).join('');
      armReveals(all);
    };
    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        current = chip.dataset.filter;
        chips.forEach(function (c) { c.setAttribute('aria-pressed', String(c === chip)); });
        render();
      });
    });
    render();
  }

  /* Arm reveals once the page's content is in place, then switch hiding on */
  armReveals(document);
  if (revealIO) document.documentElement.classList.add('reveal-on');

  /* Photo wall: filled from the photo library (assets/js/photos.js) */
  var galleryRows = $$('[data-gallery-row]');
  if (galleryRows.length && window.TAD_GALLERY && window.TAD_PHOTO) {
    var picks = window.TAD_GALLERY.map(function (g) {
      var ph = window.TAD_PHOTO(g[0], g[1]);
      return ph ? { ph: ph, title: window.TAD_PHOTOS[g[0]].title } : null;
    }).filter(Boolean);
    var per = Math.ceil(picks.length / galleryRows.length);
    galleryRows.forEach(function (row, r) {
      row.innerHTML = picks.slice(r * per, r * per + per).map(function (it) {
        return '<figure class="g-card"><img src="' + esc(it.ph.src) + '" alt="' + esc(it.title) + '" width="800" height="' +
          Math.round(800 * it.ph.h / it.ph.w) + '" loading="lazy" decoding="async"><figcaption>' + esc(it.title) + '</figcaption></figure>';
      }).join('');
    });
  }

  /* Logo walls: filled from assets/js/logos.js, dealt round-robin across rows */
  if (window.TAD_LOGOS) {
    $$('[data-logo-group]').forEach(function (track) {
      var list = window.TAD_LOGOS[track.dataset.logoGroup] || [];
      var row = +track.dataset.row || 0, rows = +track.dataset.rows || 1;
      var mine = list.filter(function (_, i) { return i % rows === row; });
      track.innerHTML = mine.map(function (l) {
        return '<div class="logo"><img src="' + esc(l.src) + '" alt="' + esc(l.name) + '" width="' + l.w + '" height="' + l.h + '" loading="lazy" decoding="async"></div>';
      }).join('');
    });
  }

  /* Testimonials: one at a time, auto-advance, pause on hover or focus */
  var qWrap = $('[data-quotes]');
  if (qWrap && window.TAD_TESTIMONIALS && window.TAD_TESTIMONIALS.length) {
    var Q = window.TAD_TESTIMONIALS, qi = 0, qTimer = null, DUR = 8000;
    var stage = $('.q-stage', qWrap), count = $('.q-count', qWrap), bar = $('.q-bar i', qWrap);
    var drawQuote = function () {
      var q = Q[qi];
      var who = esc(q.name) + (q.sample ? ' <span class="fmt fmt-sample">Sample</span>' : '');
      var meta = [q.role, q.company].filter(Boolean).map(esc).join(', ');
      stage.innerHTML = '<figure class="q' + (q.reported ? ' reported' : '') + '">' +
        '<blockquote>' + esc(q.quote) + '</blockquote>' +
        '<figcaption>' + (q.photo ? '<img src="' + esc(q.photo) + '" alt="" width="56" height="56">' : '<span class="q-mono" aria-hidden="true">' + esc((q.company || q.name).charAt(0)) + '</span>') +
        '<span><strong>' + who + '</strong><span>' + meta + (q.event ? ' · ' + esc(q.event) : '') + '</span></span></figcaption></figure>';
      count.textContent = String(qi + 1).padStart(2, '0') + ' / ' + String(Q.length).padStart(2, '0');
      if (bar) { bar.style.transition = 'none'; bar.style.transform = 'scaleX(0)'; void bar.offsetWidth; }
    };
    var schedule = function () {
      clearTimeout(qTimer);
      if (reduce || Q.length < 2) return;
      if (bar) { bar.style.transition = 'transform ' + DUR + 'ms linear'; bar.style.transform = 'scaleX(1)'; }
      qTimer = setTimeout(function () { go(1); }, DUR);
    };
    var go = function (d) { qi = (qi + d + Q.length) % Q.length; drawQuote(); schedule(); };
    $$('[data-q]', qWrap).forEach(function (b) {
      b.addEventListener('click', function () { go(b.dataset.q === 'next' ? 1 : -1); });
    });
    var pause = function () { clearTimeout(qTimer); if (bar) { var m = getComputedStyle(bar).transform; bar.style.transition = 'none'; bar.style.transform = m; } };
    qWrap.addEventListener('mouseenter', pause);
    qWrap.addEventListener('mouseleave', schedule);
    qWrap.addEventListener('focusin', pause);
    qWrap.addEventListener('focusout', schedule);
    drawQuote();
    if ('IntersectionObserver' in window) {
      var qio = new IntersectionObserver(function (en) {
        if (en[0].isIntersecting) schedule(); else clearTimeout(qTimer);
      }, { threshold: 0.4 });
      qio.observe(qWrap);
    } else schedule();
  }

  /* Marquees: always moving, a little faster while the page scrolls */
  var rows = $$('[data-marquee]').map(function (el) {
    var track = $('.track', el);
    var count = track.children.length;
    track.insertAdjacentHTML('beforeend', track.innerHTML);
    Array.prototype.slice.call(track.children, count).forEach(function (c) { c.setAttribute('aria-hidden', 'true'); });
    return {
      el: el, track: track,
      dir: +el.dataset.dir || -1,
      speed: +el.dataset.speed || 0.4,
      boost: el.hasAttribute('data-boost'),
      x: 0, w: 0, visible: true
    };
  });

  if (rows.length && !reduce) {
    /* Every row starts with its first item just inside the soft edge, so the first logos (the best-known
       names, see logos.js) are fully visible the moment the wall comes into view. */
    var measure = function () {
      rows.forEach(function (r) {
        r.w = r.track.scrollWidth / 2;
        if (!r.w) return;
        if (!r.started) { r.started = true; r.x = -r.w + r.el.clientWidth * .09; }
        while (r.x > 0) r.x -= r.w;
        while (r.x < -r.w) r.x += r.w;
      });
    };
    measure();
    window.addEventListener('resize', measure);
    window.addEventListener('load', measure);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);
    $$('.track img').forEach(function (img) { if (!img.complete) img.addEventListener('load', measure, { once: true }); });

    if ('IntersectionObserver' in window) {
      var mio = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          rows.forEach(function (r) { if (r.el === en.target) r.visible = en.isIntersecting; });
        });
      }, { rootMargin: '120px 0px' });
      rows.forEach(function (r) { mio.observe(r.el); });
    }

    var lastY = window.scrollY, vel = 0, boost = 0;
    window.addEventListener('scroll', function () {
      vel += Math.abs(window.scrollY - lastY);
      lastY = window.scrollY;
    }, { passive: true });

    var frame = function () {
      boost = Math.min(boost * 0.92 + vel * 0.012, 2.6);
      vel = 0;
      rows.forEach(function (r) {
        if (!r.visible || !r.w) return;
        r.x += r.dir * r.speed * (1 + (r.boost ? boost : boost * 0.35));
        if (r.dir < 0 && r.x <= -r.w) r.x += r.w;
        if (r.dir > 0 && r.x >= 0) r.x -= r.w;
        r.track.style.transform = 'translate3d(' + r.x.toFixed(2) + 'px,0,0)';
      });
      requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }

  /* Newsletter. Set data-endpoint on the form (Brevo or your own handler) to go live.
     Turnstile loads on the first tap into the field and its token goes with the email as cfToken. */
  $$('[data-newsletter]').forEach(function (form) {
    var msg = form.parentElement.querySelector('.nl-msg');
    var input = $('input[type="email"]', form);
    var token = '', ts = null, tsBox = document.createElement('div');
    tsBox.className = 'ts-box nl-ts';
    form.parentElement.insertBefore(tsBox, msg);
    input.addEventListener('focus', function () {
      if (!ts && window.TAD_TURNSTILE) ts = window.TAD_TURNSTILE.render(tsBox, function (t) { token = t; });
    });
    input.addEventListener('input', function () { msg.textContent = ''; });
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      if (!input.value || !input.checkValidity()) {
        msg.textContent = 'Enter a valid email address.';
        input.focus();
        return;
      }
      var endpoint = form.dataset.endpoint;
      if (!endpoint) {
        msg.textContent = 'Signups open soon. This form isn’t connected yet.';
        return;
      }
      if (window.TAD_TURNSTILE && !token) {
        msg.textContent = window.TAD_TURNSTILE.failed()
          ? 'Our spam check didn’t load. Turn off any blocker for this site and try again.'
          : 'One moment, we’re checking you’re not a bot. Try again in a second.';
        if (!ts) ts = window.TAD_TURNSTILE.render(tsBox, function (t) { token = t; });
        return;
      }
      msg.textContent = 'Subscribing…';
      fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: input.value, cfToken: token })
      }).then(function (res) {
        if (!res.ok) throw new Error('bad status');
        msg.textContent = 'You’re in. Look out for the next issue.';
        form.reset();
        if (ts) ts.reset();
      }).catch(function () {
        msg.textContent = 'That didn’t go through. Try again in a minute.';
        if (ts) ts.reset();
      });
    });
  });
})();

/* Nav dropdowns (all pages with the main nav). Desktop opens on hover and keyboard focus (CSS).
   A label with a page of its own (Events) is a link; its chevron button opens the menu on touch screens.
   A label without a page (Knowledge Hub, Community) is the button itself. */
(function () {
  var dds = Array.prototype.slice.call(document.querySelectorAll('.dd'));
  if (!dds.length) return;
  function tog(dd) { return dd.querySelector('.dd-tog') || dd.querySelector('button.dd-btn'); }
  function set(dd, open) {
    dd.classList.toggle('open', open);
    tog(dd).setAttribute('aria-expanded', String(open));
  }
  function closeAll(except) { dds.forEach(function (d) { if (d !== except) set(d, false); }); }
  dds.forEach(function (dd) {
    tog(dd).addEventListener('click', function (e) {
      e.stopPropagation();
      var open = !dd.classList.contains('open');
      closeAll(dd); set(dd, open);
    });
    dd.addEventListener('focusout', function (e) {
      if (window.innerWidth > 900 && !dd.contains(e.relatedTarget)) set(dd, false);
    });
  });
  document.addEventListener('click', function (e) { if (!e.target.closest('.dd')) closeAll(); });
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    var open = dds.filter(function (d) { return d.classList.contains('open'); })[0];
    if (!open) return;
    set(open, false);
    var t = tog(open);
    (t.offsetParent ? t : open.querySelector('.dd-btn')).focus();
  });
  /* Close menus when the nav hides on scroll or the mobile menu closes */
  var nav = document.getElementById('nav');
  if (nav && 'MutationObserver' in window) {
    new MutationObserver(function () {
      if (nav.classList.contains('hidden') || (window.innerWidth <= 900 && !nav.classList.contains('open'))) closeAll();
    }).observe(nav, { attributes: true, attributeFilter: ['class'] });
  }
})();
