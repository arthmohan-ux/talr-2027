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

/* Site forms: every main-site form posts to ONE Google Apps Script web app (backend/Site.gs), bound to one Google Sheet
   with a tab per form: Join Requests, Partner Enquiries, Newsletter, Downloads. TALR keeps its own sheet (talr-forms.js).
   Paste the web app's /exec URL into URL below once it's deployed. While it's blank, forms say so instead of pretending.
   Every payload carries `form` (which tab), `page`, `placement` and the utm_* tags. */
(function () {
  var URL = 'https://script.google.com/macros/s/AKfycbxtWN2elgD98TfWYWuWkbqeL1QYA9ibahslffiNAEMCh9NNE8oCguxWkk4MvSYmM5RI/exec';
  function utm() {
    var o = {}, q = new URLSearchParams(location.search);
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'].forEach(function (k) { if (q.get(k)) o[k] = q.get(k).slice(0, 120); });
    return o;
  }
  window.TAD_FORMS = {
    url: URL,
    /* send(payload): resolves { success: true } or rejects. text/plain keeps it a simple request (no preflight);
       if the response can't be read, a no-cors resend counts as sent */
    send: function (p) {
      if (!URL) return Promise.reject(new Error('not-connected'));
      p = Object.assign({ page: location.pathname, referrer: document.referrer || '', sentAt: new Date().toISOString() }, utm(), p);
      var body = JSON.stringify(p);
      return fetch(URL, { method: 'POST', mode: 'cors', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: body })
        .then(function (r) { return r.json().catch(function () { return { success: true }; }); })
        .catch(function () {
          return fetch(URL, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: body }).then(function () { return { success: true }; });
        })
        .then(function (d) { if (d && d.success === false) throw new Error(d.message || 'rejected'); return d; });
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

  /* A photo path without an extension exists at -800.jpg and -1600.jpg */
  function pic(p, big) { return !p ? '' : /\.\w{3,4}$/.test(p) ? p : p + (big ? '-1600.jpg' : '-800.jpg'); }
  /* "YYYY-MM-DD" shows the day big, "YYYY-MM" the month, "YYYY" the year */
  function edDate(e) {
    var parts = e.date.split('-'), d = new Date(parts[0], (parts[1] || 1) - 1, parts[2] || 1);
    var mon = d.toLocaleString('en-GB', { month: 'short' });
    if (parts.length === 3) return { big: d.getDate(), small: mon + ' ' + parts[0], long: d.getDate() + ' ' + d.toLocaleString('en-GB', { month: 'long' }) + ' ' + parts[0], yr: false };
    if (parts.length === 2) return { big: mon, small: parts[0], long: d.toLocaleString('en-GB', { month: 'long' }) + ' ' + parts[0], yr: true };
    return { big: parts[0], small: e.edition || '', long: parts[0], yr: true };
  }

  /* An edition card. With `url` it's a link; otherwise it opens the edition modal */
  function editionRow(e, i) {
    var dt = edDate(e), title = e.title || (e.format + (e.city ? ' ' + e.city : ''));
    var k = editions.indexOf(e);
    var open = e.url ? '<a class="ed" href="' + esc(e.url) + '"' : '<article class="ed ed-open" role="button" tabindex="0" data-ed="' + k + '" aria-haspopup="dialog" aria-label="' + esc(title + ', ' + dt.long + '. Open photos') + '"';
    var img = e.image ? '<img src="' + esc(pic(e.image)) + '" alt="' + esc(e.format + ' ' + e.date.slice(0, 4) + ', ' + title) + '" loading="lazy" decoding="async">' : '';
    var n = (e.gallery || []).length;
    return open + ' data-reveal style="--d:' + ((i % 3) * 90) + 'ms">' +
      '<div class="ed-date"><time datetime="' + esc(e.date) + '"><span class="d' + (dt.yr ? ' d-yr' : '') + '">' + esc(dt.big) + '</span><span class="m">' + esc(dt.small) + '</span></time></div>' +
      '<div class="ed-photo"><div class="ed-img ph ph-' + ((i % 6) + 1) + '">' + (img || '<b class="ed-ph-t">' + esc(e.city || e.format) + '</b>') + (n > 1 ? '<span class="ed-n">' + n + ' photos</span>' : '') + '</div></div>' +
      '<div class="ed-body"><div class="ed-meta">' +
        '<span class="fmt fmt-' + (FORMAT_CLASS[e.format] || 'round') + '">' + esc(e.format) + '</span>' +
        (e.city ? '<span class="ed-city">' + esc(e.city) + '</span>' : '') +
        (e.edition && !dt.yr ? '<span class="ed-city">' + esc(e.edition) + '</span>' : '') +
      '</div><h3>' + esc(title) + '</h3>' + (e.theme ? '<p>' + esc(e.theme) + '</p>' : '') + '</div>' +
      '<span class="ed-arrow" aria-hidden="true">' + (e.url ? ARROW : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>') + '</span>' +
      (e.url ? '</a>' : '</article>');
  }

  /* The edition modal: the card's photo, the theme, then the edition's gallery. Escape, a click outside or the cross closes it */
  var edm = null, edLast = null;
  function closeEd() {
    if (!edm || edm.hidden) return;
    edm.classList.add('out');
    setTimeout(function () { edm.hidden = true; edm.classList.remove('out'); }, 220);
    document.body.style.overflow = '';
    if (edLast && edLast.focus) edLast.focus();
  }
  function openEd(e) {
    edLast = document.activeElement;
    if (!edm) {
      edm = document.createElement('div');
      edm.className = 'edm'; edm.hidden = true;
      edm.setAttribute('role', 'dialog'); edm.setAttribute('aria-modal', 'true'); edm.setAttribute('aria-labelledby', 'edm-title');
      document.body.appendChild(edm);
      edm.addEventListener('mousedown', function (ev) { if (ev.target === edm) closeEd(); });
      edm.addEventListener('keydown', function (ev) {
        if (ev.key === 'Escape') closeEd();
        if (ev.key === 'Tab') {
          var f = $$('button, a[href]', edm).filter(function (x) { return x.offsetParent; });
          if (!f.length) return;
          if (ev.shiftKey && document.activeElement === f[0]) { ev.preventDefault(); f[f.length - 1].focus(); }
          else if (!ev.shiftKey && document.activeElement === f[f.length - 1]) { ev.preventDefault(); f[0].focus(); }
        }
      });
    }
    var dt = edDate(e), title = e.title || e.format, gal = e.gallery || (e.image ? [e.image] : []);
    var facts = [e.venue, e.partner].filter(Boolean);
    edm.innerHTML = '<div class="edm-box"><button class="edm-x" type="button" aria-label="Close"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button>' +
      (gal.length ? '<figure class="edm-main"><img src="' + esc(pic(gal[0], true)) + '" alt="' + esc(title) + '"></figure>' : '') +
      '<div class="edm-body"><p class="edm-meta"><span class="fmt fmt-' + (FORMAT_CLASS[e.format] || 'round') + '">' + esc(e.format) + '</span>' +
        (e.edition ? '<span>' + esc(e.edition) + '</span>' : '') + '<span>' + esc(dt.long) + '</span>' + (e.city ? '<span>' + esc(e.city) + '</span>' : '') + '</p>' +
        '<h2 id="edm-title">' + esc(title) + '</h2>' + (e.theme ? '<p class="edm-theme">' + esc(e.theme) + '</p>' : '') +
        (facts.length ? '<p class="edm-facts">' + facts.map(esc).join('<i aria-hidden="true"></i>') + '</p>' : '') + '</div>' +
      (gal.length > 1 ? '<div class="edm-gal" role="list" aria-label="Photos from this edition">' + gal.map(function (g, j) {
        return '<button type="button" role="listitem" class="edm-t" data-i="' + j + '"' + (j ? '' : ' aria-current="true"') + ' aria-label="Show photo ' + (j + 1) + ' of ' + gal.length + '"><img src="' + esc(pic(g)) + '" alt="" loading="lazy" decoding="async"></button>';
      }).join('') + '</div>' : '') + '</div>';
    $('.edm-x', edm).addEventListener('click', closeEd);
    var main = $('.edm-main img', edm);
    $$('.edm-t', edm).forEach(function (t) {
      t.addEventListener('click', function () {
        main.src = pic(gal[+t.dataset.i], true);
        $$('.edm-t', edm).forEach(function (o) { o.removeAttribute('aria-current'); });
        t.setAttribute('aria-current', 'true');
        $('.edm-main', edm).scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      });
    });
    edm.hidden = false;
    document.body.style.overflow = 'hidden';
    $('.edm-box', edm).scrollTop = 0;
    setTimeout(function () { $('.edm-x', edm).focus({ preventScroll: true }); }, 30);
  }
  document.addEventListener('click', function (ev) {
    var c = ev.target.closest('[data-ed]');
    if (c && editions[+c.dataset.ed]) openEd(editions[+c.dataset.ed]);
  });
  document.addEventListener('keydown', function (ev) {
    var c = ev.target.closest && ev.target.closest('[data-ed]');
    if (c && (ev.key === 'Enter' || ev.key === ' ')) { ev.preventDefault(); openEd(editions[+c.dataset.ed]); }
  });

  /* [data-editions]: the latest N (data-limit, "all" for every one), optionally one format (data-format) */
  $$('[data-editions]').forEach(function (box) {
    var f = box.dataset.format, lim = box.dataset.limit === 'all' ? 999 : (+box.dataset.limit || 3);
    box.innerHTML = editions.filter(function (e) { return !f || e.format === f; }).slice(0, lim).map(editionRow).join('');
  });

  var all = $('[data-editions-all]');
  if (all) {
    var current = 'All';
    /* A format with no editions yet loses its chip; with one format left, the filter row goes */
    var chips = $$('[data-filter]').filter(function (c) {
      var keep = c.dataset.filter === 'All' || editions.some(function (e) { return e.format === c.dataset.filter; });
      if (!keep) c.remove();
      return keep;
    });
    if (chips.length <= 2 && chips[0] && chips[0].parentNode) chips[0].parentNode.hidden = true;
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

  /* Testimonials (data/voices.js): written quotes and short videos in three columns, filled in order,
     so the mix stays as set in the data. One player everywhere ([data-voices]: home, Community, TALR delegate page).
     Videos play muted while on screen. Click (or tap) for sound at 60%; hover shows the controls. Only one has sound at a time.
     Full screen shows the whole frame (letterboxed, never cropped) with the same controls. */
  var vg = $('[data-voices]');
  if (vg && window.TAD_VOICES && window.TAD_VOICES.length) {
    var I = function (d) { return '<svg viewBox="0 0 24 24" aria-hidden="true">' + d + '</svg>'; };
    var PLAY = I('<path fill="currentColor" d="M8 5v14l11-7z"/>');
    var PAUSE = I('<path fill="currentColor" d="M7 5h4v14H7zm6 0h4v14h-4z"/>');
    var VOL = I('<path fill="currentColor" d="M4 9v6h4l5 4V5L8 9H4z"/><path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>');
    var MUTE = I('<path fill="currentColor" d="M4 9v6h4l5 4V5L8 9H4z"/><path d="m16 9 5 6m0-6-5 6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>');
    var FULL = I('<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>');
    var SHRINK = I('<path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>');
    var MARK = '<svg class="vc-mark" viewBox="0 0 34 24" aria-hidden="true"><path d="M0 24V14.5C0 6.6 4.3 1.6 12.4 0l1.3 4.1C9 5.4 6.9 8.2 6.7 12H13v12zm19.6 0V14.5c0-7.9 4.3-12.9 12.4-14.5l1.3 4.1c-4.7 1.3-6.8 4.1-7 7.9h6.3v12z"/></svg>';
    var clock = function (s) { s = Math.max(0, Math.floor(s || 0)); return Math.floor(s / 60) + ':' + ('0' + s % 60).slice(-2); };
    var fsEl = function () { return document.fullscreenElement || document.webkitFullscreenElement || null; };
    var vcards = window.TAD_VOICES.map(function (v, i) {
      var d = ' data-reveal style="--d:' + ((i % 3) * 80) + 'ms"';
      if (v.type === 'video') {
        return '<figure class="vc vc-video vlive"' + d + '><div class="vc-frame">' +
          '<video muted loop playsinline preload="metadata" poster="' + esc(v.poster) + '" aria-label="' + esc(v.label || 'Testimonial video') + '"><source src="' + esc(v.src) + '" type="video/mp4"></video>' +
          '<div class="vp" aria-label="Video controls"><div class="vp-bar"><input type="range" min="0" max="1000" value="0" step="1" aria-label="Seek"><i></i></div>' +
          '<div class="vp-row"><button type="button" class="vp-play" aria-label="Pause">' + PAUSE + '</button><span class="vp-time">0:00 / 0:00</span>' +
          '<span class="vp-sp"></span><button type="button" class="vp-mute" aria-label="Unmute">' + MUTE + '</button><button type="button" class="vp-full" aria-label="Full screen">' + FULL + '</button></div></div>' +
          '<span class="vp-hint" aria-hidden="true">' + VOL + '<em>Click for sound</em></span></div>' +
          (v.label ? '<figcaption>' + esc(v.label) + '</figcaption>' : '') + '</figure>';
      }
      return '<figure class="vc vc-quote"' + d + '>' + MARK + '<blockquote>' + esc(v.quote) + '</blockquote>' +
        '<figcaption><b>' + esc(v.title) + '</b>' + (v.label ? '<span>' + esc(v.label) + '</span>' : '') + '</figcaption></figure>';
    });
    var vper = Math.ceil(vcards.length / 3);
    vg.innerHTML = [0, 1, 2].map(function (c) { return '<div class="vcol">' + vcards.slice(c * vper, c * vper + vper).join('') + '</div>'; }).join('');
    var vall = $$('.vlive', vg);
    var setSound = function (v, onOff) {
      if (onOff) {
        vall.forEach(function (o) { var ov = $('video', o); if (ov !== v) ov.muted = true; });
        v.volume = 0.6; v.muted = false;
        if (v.paused) v.play().catch(function () {});
      } else v.muted = true;
    };
    vall.forEach(function (f) {
      var v = $('video', f), frame = $('.vc-frame', f), bar = $('.vp-bar input', f), fill = $('.vp-bar i', f), time = $('.vp-time', f);
      var bPlay = $('.vp-play', f), bMute = $('.vp-mute', f), bFull = $('.vp-full', f), hint = $('.vp-hint em', f), seeking = false;
      var isFull = function () { return fsEl() === frame; };
      var sync = function () {
        bPlay.innerHTML = v.paused ? PLAY : PAUSE; bPlay.setAttribute('aria-label', v.paused ? 'Play' : 'Pause');
        bMute.innerHTML = v.muted ? MUTE : VOL; bMute.setAttribute('aria-label', v.muted ? 'Unmute' : 'Mute');
        bFull.innerHTML = isFull() ? SHRINK : FULL; bFull.setAttribute('aria-label', isFull() ? 'Exit full screen' : 'Full screen');
        f.classList.toggle('sound', !v.muted);
      };
      v.addEventListener('timeupdate', function () {
        var k = v.duration ? v.currentTime / v.duration : 0;
        if (!seeking) bar.value = Math.round(k * 1000);
        fill.style.transform = 'scaleX(' + k + ')';
        time.textContent = clock(v.currentTime) + ' / ' + clock(v.duration);
      });
      ['play', 'pause', 'volumechange'].forEach(function (e) { v.addEventListener(e, sync); });
      bar.addEventListener('input', function () { seeking = true; if (v.duration) v.currentTime = bar.value / 1000 * v.duration; });
      bar.addEventListener('change', function () { seeking = false; });
      bPlay.addEventListener('click', function () { if (v.paused) v.play(); else v.pause(); });
      bMute.addEventListener('click', function () { setSound(v, v.muted); });
      /* Full screen: the frame goes full screen (so our controls come with it) and the video switches to contain.
         iPhone Safari only allows the video itself, which opens its own player. Full screen means you want to watch: sound on */
      bFull.addEventListener('click', function () {
        if (isFull()) { (document.exitFullscreen || document.webkitExitFullscreen).call(document); return; }
        f.classList.add('live');
        if (frame.requestFullscreen) frame.requestFullscreen().catch(function () {});
        else if (frame.webkitRequestFullscreen) frame.webkitRequestFullscreen();
        else if (v.webkitEnterFullscreen) v.webkitEnterFullscreen();
        setSound(v, true);
      });
      var onFs = function () { sync(); if (!isFull() && !f.matches(':hover')) f.classList.remove('live'); };
      document.addEventListener('fullscreenchange', onFs);
      document.addEventListener('webkitfullscreenchange', onFs);
      /* Sound is always a click (a tap on phones), never a hover. Hover only brings up the controls.
         Click again for silence. Sound stays on until then, another video gets it, or the video scrolls away */
      if (window.matchMedia('(hover: hover)').matches) {
        f.addEventListener('mouseenter', function () { f.classList.add('live'); });
        f.addEventListener('mouseleave', function () { if (!isFull()) f.classList.remove('live'); });
      } else hint.textContent = 'Tap for sound';
      frame.addEventListener('click', function (e) {
        if (e.target.closest('.vp')) return;
        if (isFull()) { if (v.paused) v.play(); else v.pause(); return; }
        f.classList.add('live'); setSound(v, v.muted);
      });
      frame.addEventListener('dblclick', function (e) { if (!e.target.closest('.vp')) bFull.click(); });
      sync();
    });
    /* Play only while on screen */
    if ('IntersectionObserver' in window) {
      var vio = new IntersectionObserver(function (es) {
        es.forEach(function (en) {
          var v = $('video', en.target);
          if (fsEl() && en.target.contains(fsEl())) return;
          if (en.isIntersecting && !reduce) v.play().catch(function () {}); else { v.pause(); v.muted = true; }
        });
      }, { threshold: 0.35 });
      vall.forEach(function (f) { vio.observe(f); });
    }
  }

  /* Roundtables, Six cities: hover (or focus) a city in the list or near its dot on the map; the dot lights up and a small
     card beside it lists what has happened there. Nothing is a link. */
  $$('[data-city-map]').forEach(function (box) {
    var pop = $('[data-pop]', box), wrap = pop.parentNode, svg = $('svg', wrap), hideT = null, fmt = box.dataset.format;
    var list = function (c) { return editions.filter(function (e) { return e.city === c && (!fmt || e.format === fmt); }); };
    $$('.rtc-list [data-city]', box).forEach(function (li) {
      var n = list(li.dataset.city).length;
      $('[data-city-n]', li).textContent = n ? n + (n === 1 ? ' edition' : ' editions') : 'No editions on record yet';
    });
    var show = function (c) {
      clearTimeout(hideT);
      $$('[data-city]', box).forEach(function (el) { el.classList.toggle('on', el.dataset.city === c); });
      var g = $('g[data-city="' + c + '"]', svg), dot = g && $('.mp-dot', g);
      if (!dot) return;
      var items = list(c);
      pop.innerHTML = '<b>' + esc(c) + '</b>' + (items.length ? '<ul>' + items.slice(0, 6).map(function (e) {
        var dt = edDate(e);
        return '<li><span>' + esc(e.format) + ' · ' + esc(dt.long) + '</span>' + esc(e.title || e.format) + '</li>';
      }).join('') + '</ul>' + (items.length > 6 ? '<p>And ' + (items.length - 6) + ' more.</p>' : '') : '<p>No editions on record here yet.</p>');
      var r = dot.getBoundingClientRect(), w = wrap.getBoundingClientRect();
      var x = r.left + r.width / 2 - w.left, y = r.top + r.height / 2 - w.top;
      pop.hidden = false;
      var left = x + 26, right = x - 26 - pop.offsetWidth;
      pop.style.left = (left + pop.offsetWidth < w.width || right < 0 ? left : right) + 'px';
      pop.style.top = Math.max(0, Math.min(w.height - pop.offsetHeight, y - pop.offsetHeight / 2)) + 'px';
    };
    var hide = function () { hideT = setTimeout(function () { pop.hidden = true; $$('[data-city]', box).forEach(function (el) { el.classList.remove('on'); }); }, 120); };
    $$('[data-city]', box).forEach(function (el) {
      el.addEventListener('mouseenter', function () { show(el.dataset.city); });
      el.addEventListener('mouseleave', hide);
      el.addEventListener('focus', function () { show(el.dataset.city); });
      el.addEventListener('blur', hide);
      el.addEventListener('click', function () { show(el.dataset.city); });
    });
  });

  /* About us, the six principles: hover, focus or click a letter to open it */
  $$('[data-tenets]').forEach(function (box) {
    var items = $$('.tenet', box);
    var open = function (it) { items.forEach(function (x) { var on = x === it; x.classList.toggle('is-open', on); $('.tenet-head', x).setAttribute('aria-expanded', String(on)); }); };
    items.forEach(function (it) {
      var h = $('.tenet-head', it);
      h.addEventListener('click', function () { open(it); });
      h.addEventListener('focus', function () { open(it); });
      it.addEventListener('mouseenter', function () { if (window.matchMedia('(hover: hover) and (min-width: 1001px)').matches) open(it); });
    });
  });

  /* Tabs ([data-tabs]): role tabs on the homepage. Arrow keys move between tabs; the orange ink slides under the active one */
  $$('[data-tabs]').forEach(function (box) {
    var tabs = $$('[role="tab"]', box), ink = $('.role-ink', box);
    var place = function (t) {
      if (!ink) return;
      ink.style.setProperty('--x', t.offsetLeft + 'px');
      ink.style.setProperty('--w', t.offsetWidth + 'px');
    };
    var pick = function (t, focus) {
      tabs.forEach(function (o) {
        var on = o === t;
        o.setAttribute('aria-selected', String(on));
        o.tabIndex = on ? 0 : -1;
        document.getElementById(o.getAttribute('aria-controls')).hidden = !on;
      });
      place(t);
      if (focus) t.focus();
    };
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { pick(t); });
      t.addEventListener('keydown', function (e) {
        var d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
        if (d) { e.preventDefault(); pick(tabs[(i + d + tabs.length) % tabs.length], true); }
      });
    });
    var current = function () { return tabs.filter(function (t) { return t.getAttribute('aria-selected') === 'true'; })[0] || tabs[0]; };
    place(current());
    window.addEventListener('resize', function () { place(current()); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { place(current()); });
  });

  /* Arriving with a #section link (e.g. /#enquire from the popup): the browser jumps before the
     JS-built sections and images are in place, so jump again once the page has settled */
  if (location.hash.length > 1) {
    var hashGo = function () {
      var t = null;
      try { t = document.querySelector(decodeURIComponent(location.hash)); } catch (e) {}
      if (t) t.scrollIntoView({ behavior: 'auto' });
    };
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    requestAnimationFrame(hashGo);
    window.addEventListener('load', function () { setTimeout(hashGo, 60); });
  }

  /* TALR 2027 popup. Pages opt in with <body data-talr-popup="<link to the attend form>">.
     On: /, /events, /events/past-editions, /events/talr-2027. Off: the partner page, the standalone form pages, privacy.
     Shows once, 15 seconds into a visit, then stays away for 3 days (or for good once someone clicks through).
     Skipped if the form is on screen or being filled, and after the event date. */
  (function () {
    var target = document.body.getAttribute('data-talr-popup');
    if (!target) return;
    var KEY = 'tadTalrPopup', WAIT = 15000, QUIET = 3 * 864e5, EVENT_END = Date.UTC(2027, 1, 26, 18, 30);
    if (Date.now() > EVENT_END) return;
    var get = function () { try { return JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) { return null; } };
    var set = function (v) { try { localStorage.setItem(KEY, JSON.stringify(v)); } catch (e) {} };
    var seen = get();
    if (seen && (seen.went || Date.now() - seen.at < QUIET)) return;
    var samePage = target.charAt(0) === '#';
    var formBusy = function () {
      if (!samePage) return false;
      var f = document.querySelector(target);
      if (!f) return false;
      if (f.contains(document.activeElement)) return true;
      var r = f.getBoundingClientRect();
      return r.top < innerHeight * .8 && r.bottom > innerHeight * .2;
    };
    var X = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>';
    var open = function () {
      if (formBusy() || document.querySelector('.dlg, .tpop')) { setTimeout(open, 8000); return; }
      if (!document.querySelector('link[href*="Cormorant"]')) {
        var fl = document.createElement('link');
        fl.rel = 'stylesheet';
        fl.href = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;1,600&display=swap';
        document.head.appendChild(fl);
      }
      set({ at: Date.now() });
      var last = document.activeElement;
      var d = document.createElement('div');
      d.className = 'tpop';
      d.setAttribute('role', 'dialog');
      d.setAttribute('aria-modal', 'true');
      d.setAttribute('aria-labelledby', 'tpop-t');
      d.innerHTML = '<div class="tpop-box">' +
        '<button class="tpop-x" type="button" aria-label="Close">' + X + '</button>' +
        '<div class="tpop-art" aria-hidden="true">' +
          '<svg class="tpop-wedge" viewBox="0 0 100 100" preserveAspectRatio="none"><defs><linearGradient id="tpop-wg" x1="1" y1="0" x2=".35" y2=".65"><stop offset="0" stop-color="#F9E7DA" stop-opacity=".14"/><stop offset="1" stop-color="#F9E7DA" stop-opacity="0"/></linearGradient></defs><polygon points="0,0 100,0 100,100" fill="url(#tpop-wg)"/><line x1="0" y1="16" x2="84" y2="100" stroke="#E46A13" stroke-opacity=".45" stroke-width="1" vector-effect="non-scaling-stroke"/></svg>' +
          '<span class="seal10"><img class="s-base" src="/assets/img/talr/brand/seal-base.webp" alt="" width="720" height="720"><img class="s-ring" src="/assets/img/talr/brand/seal-ring.webp" alt="" width="720" height="720"></span>' +
        '</div>' +
        '<div class="tpop-body">' +
          '<div class="tpop-lockup" role="img" aria-label="TA Dialogues presents TA Leadership Retreat 2027, 10th Edition"><img class="lk-tad" src="/assets/img/talr/brand/talr-presents-tad.webp" alt="" width="447" height="97"><span class="lk-p">Presents</span><img class="lk-talr" src="/assets/img/talr/brand/talr-presents-lockup.webp" alt="" width="1311" height="322"></div>' +
          '<h2 id="tpop-t">The Talent Orbit: <em>Signal. Sync. Steer.</em></h2>' +
          '<p>26 February 2027. 300+ TA leaders and the C-suite they hire for, in one room. Seats are offered by invitation.</p>' +
          '<div class="tpop-actions"><a class="btn tpop-go" href="' + esc(target) + '">Register your interest ' + ARROW + '</a><button class="tpop-no" type="button">Not now</button></div>' +
        '</div></div>';
      document.body.appendChild(d);
      var close = function () {
        d.classList.add('out');
        setTimeout(function () { d.remove(); }, 300);
        document.removeEventListener('keydown', onKey);
        if (last && last.focus) last.focus();
      };
      var onKey = function (e) {
        if (e.key === 'Escape') close();
        if (e.key === 'Tab') {
          var f = $$('a[href], button', d), first = f[0], end = f[f.length - 1];
          if (e.shiftKey && document.activeElement === first) { e.preventDefault(); end.focus(); }
          else if (!e.shiftKey && document.activeElement === end) { e.preventDefault(); first.focus(); }
        }
      };
      document.addEventListener('keydown', onKey);
      $('.tpop-x', d).addEventListener('click', close);
      $('.tpop-no', d).addEventListener('click', close);
      d.addEventListener('click', function (e) { if (e.target === d) close(); });
      $('.tpop-go', d).addEventListener('click', function (e) {
        set({ at: Date.now(), went: true });
        if (samePage) {
          var f = document.querySelector(target);
          if (f) { e.preventDefault(); close(); f.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' }); history.replaceState(null, '', target); }
        }
      });
      $('.tpop-go', d).focus();
    };
    setTimeout(open, WAIT);
  })();

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

  /* Header photos (home, /events, Community, TA Tech, Roundtables, TALR; moved here from pages.js so TALR gets it too): every 1.75 seconds a random few tiles turn to a random photo
     that isn't already showing. Only tiles on screen turn, and nothing runs while the header is out of view */
  $$('[data-collage-flip]').forEach(function (flip) {
    var pool = (flip.dataset.pool || '').split('|').filter(Boolean);
    var tiles = $$('.cf', flip), max = +flip.dataset.max || 5, seen = true;
    if (reduce || !tiles.length || pool.length <= tiles.length) return;
    if ('IntersectionObserver' in window) new IntersectionObserver(function (en) { seen = en[0].isIntersecting; }).observe(flip);
    var front = function (t) { return $(t.classList.contains('turned') ? '.cf-b img' : '.cf-a img', t); };
    var busy = false;
    setInterval(function () {
      if (busy || !seen || document.hidden) return;
      var live = tiles.filter(function (t) { return t.offsetWidth > 0; });
      if (!live.length) return;
      busy = true;
      var showing = live.map(function (t) { return front(t).getAttribute('src'); });
      var spare = pool.filter(function (src) { return showing.indexOf(src) < 0; }).sort(function () { return Math.random() - .5; });
      var count = 1 + Math.floor(Math.random() * Math.min(max, live.length));
      live.sort(function () { return Math.random() - .5; }).slice(0, count).forEach(function (t, i) {
        var src = spare[i];
        if (!src) return;
        setTimeout(function () {
          var back = $(t.classList.contains('turned') ? '.cf-a img' : '.cf-b img', t);
          var go = function () { back.onload = back.onerror = null; t.classList.toggle('turned'); };
          if (back.getAttribute('src') === src && back.complete) { go(); return; }
          back.onload = go; back.onerror = go;
          back.src = src;
        }, i * 160);
      });
      setTimeout(function () { busy = false; }, 1200);
    }, 1750);
  });

  /* Background videos ([data-bgvideo]: the /events header). The 720p file on phones and small screens, 1080p otherwise;
     plays muted while on screen, pauses off screen; reduced motion keeps the poster. [data-bgvideo-toggle] pauses and plays */
  $$('[data-bgvideo]').forEach(function (v) {
    var small = window.matchMedia('(max-width: 900px)').matches || (navigator.connection && navigator.connection.saveData);
    var tog = v.parentNode.querySelector('[data-bgvideo-toggle]'), held = reduce;
    var PAUSE_I = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M7 5h4v14H7zm6 0h4v14h-4z"/></svg>';
    var PLAY_I = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M8 5v14l11-7z"/></svg>';
    var sync = function () { if (!tog) return; var on = !v.paused; tog.innerHTML = on ? PAUSE_I : PLAY_I; tog.setAttribute('aria-label', on ? 'Pause the video' : 'Play the video'); };
    v.addEventListener('play', sync); v.addEventListener('pause', sync);
    var start = function () {
      if (held) return;
      if (!v.getAttribute('src')) { v.src = small && v.dataset.srcSm ? v.dataset.srcSm : v.dataset.src; }
      v.play().catch(function () {});
    };
    if (tog) tog.addEventListener('click', function () { if (v.paused) { held = false; start(); } else { held = true; v.pause(); } });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) { if (es[0].isIntersecting) start(); else v.pause(); }, { threshold: 0.2 }).observe(v);
    } else start();
    sync();
  });

  /* Downloads ask for an email first ([data-gate] links: every report PDF). The email is kept on this device, so the
     next download starts straight away (and is still logged). Each download is a row in the Downloads tab. */
  var GATE_KEY = 'tadGateEmail';
  var gateGet = function () { try { return localStorage.getItem(GATE_KEY) || ''; } catch (e) { return ''; } };
  var gateSet = function (v) { try { localStorage.setItem(GATE_KEY, v); } catch (e) {} };
  var gateLog = function (email, a) {
    if (window.TAD_FORMS) window.TAD_FORMS.send({ form: 'download', email: email, file: a.getAttribute('data-gate') || a.getAttribute('href'), title: a.getAttribute('data-title') || '', placement: 'gate' }).catch(function () {});
  };
  var gateGo = function (a) {
    var t = document.createElement('a');
    t.href = a.getAttribute('href'); t.download = ''; t.rel = 'noopener';
    document.body.appendChild(t); t.click(); t.remove();
  };
  var gm = null, gLast = null, gLink = null;
  function gateClose() { if (!gm || gm.hidden) return; gm.hidden = true; document.body.style.overflow = ''; if (gLast && gLast.focus) gLast.focus(); }
  function gateOpen(a) {
    gLast = document.activeElement; gLink = a;
    if (!gm) {
      gm = document.createElement('div');
      gm.className = 'gate'; gm.hidden = true;
      gm.setAttribute('role', 'dialog'); gm.setAttribute('aria-modal', 'true'); gm.setAttribute('aria-labelledby', 'gate-title');
      gm.innerHTML = '<form class="gate-box" novalidate><button class="gate-x" type="button" aria-label="Close"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button>' +
        '<h2 id="gate-title">Where should we <span class="hl">send updates?</span></h2>' +
        '<p class="gate-what"></p>' +
        '<label for="gate-email">Work email</label><input id="gate-email" type="email" autocomplete="email" placeholder="name@company.com" required>' +
        '<input class="hp" type="text" name="website_url" tabindex="-1" autocomplete="off" aria-hidden="true">' +
        '<p class="gate-msg" role="alert"></p>' +
        '<button class="btn btn-primary" type="submit">Download the report</button>' +
        '<p class="gate-small">We use your email to share new TA Dialogues research. No spam; unsubscribe any time. <a href="/privacy-policy" target="_blank" rel="noopener">Privacy policy</a>.</p></form>';
      document.body.appendChild(gm);
      $('.gate-x', gm).addEventListener('click', gateClose);
      gm.addEventListener('mousedown', function (e) { if (e.target === gm) gateClose(); });
      gm.addEventListener('keydown', function (e) { if (e.key === 'Escape') gateClose(); });
      $('form', gm).addEventListener('submit', function (e) {
        e.preventDefault();
        var inp = $('#gate-email', gm), msg = $('.gate-msg', gm), v = inp.value.trim();
        if ($('.hp', gm).value) { gateClose(); return; }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) { msg.textContent = 'Enter a valid email address.'; inp.focus(); return; }
        gateSet(v); gateLog(v, gLink); gateClose(); gateGo(gLink);
      });
    }
    $('.gate-what', gm).textContent = (a.getAttribute('data-title') ? a.getAttribute('data-title').replace(/[.?!]+$/, '') + '. ' : '') + 'Free. Tell us where to reach you and the download starts.';
    $('.gate-msg', gm).textContent = '';
    gm.hidden = false; document.body.style.overflow = 'hidden';
    setTimeout(function () { $('#gate-email', gm).focus(); }, 30);
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[data-gate]');
    if (!a) return;
    e.preventDefault();
    var known = gateGet();
    if (known) { gateLog(known, a); gateGo(a); return; }
    gateOpen(a);
  });

  /* Newsletter: posts to the site's forms sheet (TAD_FORMS, Newsletter tab).
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
      if (!window.TAD_FORMS || !window.TAD_FORMS.url) {
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
      window.TAD_FORMS.send({ form: 'newsletter', email: input.value, placement: form.classList.contains('rail-form') ? 'rail' : 'band', cfToken: token }).then(function () {
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

/* Side tabs: the orange tab on the right edge of the screen. It slides in once the header has scrolled away
   and slides out while a form is on screen (the form is right there; the tab would only repeat it).
   Main pages: join-form.js makes the "Join the community" tab and hands it to TAD_SIDETAB.
   TALR pages: <body data-talr-tab="Label|#form-section|icon"> makes a tab that takes you to the page's form. */
(function () {
  var ICONS = {
    seat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4.5" width="18" height="16" rx="1"/><path d="M3 9.5h18M8 2.5v4M16 2.5v4M12 12.5v5M9.5 15h5"/></svg>',
    partner: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="7" width="18" height="13" rx="1"/><path d="M9 7V4.5h6V7M3 12.5h18"/></svg>'
  };
  function arm(tab) {
    var head = document.querySelector('.hh, .cm-head, .thero, .pgh, .page-head, .abh, .rth, .smh, .tth, .evh, .tlh');
    var forms = Array.prototype.slice.call(document.querySelectorAll('#join, .enq, [data-join-form], [data-talr-form], [data-contact-form]'));
    var past = !head, near = [];
    function set() {
      var on = past && !near.some(Boolean);
      tab.classList.toggle('is-on', on);
      tab.tabIndex = on ? 0 : -1;
      tab.setAttribute('aria-hidden', String(!on));
    }
    if (!('IntersectionObserver' in window)) { past = true; set(); return; }
    /* The header counts as gone once its bottom edge passes under the nav */
    if (head) new IntersectionObserver(function (en) { past = !en[0].isIntersecting; set(); }, { rootMargin: '-90px 0px 0px 0px' }).observe(head);
    forms.forEach(function (f, i) {
      near[i] = false;
      new IntersectionObserver(function (en) { near[i] = en[0].isIntersecting; set(); }, { rootMargin: '0px 0px -12% 0px' }).observe(f);
    });
    set();
  }
  window.TAD_SIDETAB = arm;

  var cfg = document.body.getAttribute('data-talr-tab');
  if (cfg) {
    var p = cfg.split('|');
    var tab = document.createElement('a');
    tab.className = 'jtab';
    tab.href = p[1];
    tab.innerHTML = (ICONS[p[2]] || ICONS.seat) + '<span>' + p[0] + '</span>';
    document.body.appendChild(tab);
    arm(tab);
  }
})();
