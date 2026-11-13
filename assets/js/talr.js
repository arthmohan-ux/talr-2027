/* TALR 2027 page renderer. Reads assets/js/data/talr-2027.js, talr-speakers.js and platform.js
   and fills the containers marked with data-* hooks in /events/talr-2027 and /partners.
   Runs before script.js, so the site-wide marquee engine, reveals and testimonial carousel
   pick up what this file renders. */
(function () {
  'use strict';

  var T = window.TALR || {};
  var SPEAKERS = window.TALR_SPEAKERS || [];
  var PLATFORM = window.TAD_PLATFORM || [];
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function $(s, c) { return (c || document).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  var ARROW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  var CLOSE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>';

  /* Corner wedge ornament, the shape from the TALR mark.
     Markup: <span data-wedge="tr" data-tone="light|dark" data-accent="0" style="position and size"></span> */
  var wN = 0;
  function wedge(corner, style, tone, accent) {
    var id = 'wg' + (++wN), d = tone === 'dark';
    var flip = { tr: 'none', tl: 'scaleX(-1)', br: 'scaleY(-1)', bl: 'scale(-1,-1)' }[corner] || 'none';
    var c = d ? '#F9E7DA' : '#F4C7B8';
    return '<svg class="wedge" style="' + style + ';transform:' + flip + '" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">' +
      '<defs><linearGradient id="' + id + '" x1="1" y1="0" x2=".35" y2=".65"><stop offset="0" stop-color="' + c + '" stop-opacity="' + (d ? .13 : .8) + '"/><stop offset="1" stop-color="' + c + '" stop-opacity="0"/></linearGradient></defs>' +
      '<polygon points="0,0 100,0 100,100" fill="url(#' + id + ')"/>' +
      '<line x1="0" y1="16" x2="84" y2="100" stroke="#E46A13" stroke-opacity="' + (d ? .45 : .5) + '" stroke-width="1" vector-effect="non-scaling-stroke"/>' +
      (accent ? '<polygon points="83,0 100,0 100,17" fill="#E46A13"/>' : '') + '</svg>';
  }
  $$('[data-wedge]').forEach(function (el) {
    el.outerHTML = wedge(el.dataset.wedge, el.getAttribute('style') || '', el.dataset.tone, el.dataset.accent !== '0');
  });

  /* Rolling numbers. The final value is written in the HTML; JS splits it into digit columns
     that roll into place when the number scrolls into view. */
  function rollHTML(value) {
    var s = String(value), out = '', di = 0;
    for (var i = 0; i < s.length; i++) {
      var ch = s.charAt(i);
      if (/\d/.test(ch)) {
        var col = '';
        for (var k = 0; k < 20; k++) col += '<span>' + (k % 10) + '</span>';
        out += '<span class="rd"><span class="rs" data-to="' + (10 + +ch) + '" style="--rd:' + (di++ * 70) + 'ms">' + col + '</span></span>';
      } else {
        out += '<span class="' + (ch === '+' ? 'rx' : 'rc') + '">' + esc(ch) + '</span>';
      }
    }
    return '<span class="roll" aria-hidden="true">' + out + '</span>';
  }
  function armRoll(el) {
    var v = el.dataset.roll || el.textContent.trim();
    el.setAttribute('aria-label', v);
    if (reduce) return;
    el.innerHTML = rollHTML(v);
  }
  function fireRoll(el) {
    $$('.rs', el).forEach(function (s) { s.style.transform = 'translateY(' + (-s.dataset.to * 5) + '%)'; });
  }

  /* TALR numbers */
  var statsEl = $('[data-talr-stats]');
  if (statsEl && T.stats) {
    statsEl.innerHTML = T.stats.map(function (s, i) {
      return '<div class="tstat" data-reveal style="--d:' + (i * 80) + 'ms"><span class="n" data-roll="' + esc(s.value + (s.suffix || '')) + '">' + esc(s.value + (s.suffix || '')) + '</span>' +
        '<h3>' + esc(s.label) + '</h3><p>' + esc(s.note) + '</p></div>';
    }).join('');
  }

  /* Platform numbers (same source on every page) */
  $$('[data-platform]').forEach(function (el) {
    var cls = el.dataset.platform === 'cred' ? '' : 'plat-it';
    el.innerHTML = PLATFORM.map(function (p, i) {
      return '<div class="' + cls + '" data-reveal style="--d:' + (i * 60) + 'ms"><b data-roll="' + esc(p.value) + '">' + esc(p.value) + '</b><span class="l">' + esc(p.label) + '</span></div>';
    }).join('');
  });

  /* Why TALR pillars */
  var pillars = $('[data-pillars]');
  if (pillars && T.pillars) {
    pillars.innerHTML = T.pillars.map(function (p, i) {
      var pts = p.points || [];
      return '<article class="pillar" data-reveal style="--d:' + (i * 90) + 'ms"><span class="no">' + esc(p.number) + '</span><h3>' + esc(p.title) + '</h3><p>' + esc(p.body).replace(/\*([^*]+)\*/g, '<em>$1</em>') + '</p>' +
        (p.pointsLead ? '<p class="pl-lead">' + esc(p.pointsLead) + '</p>' : '') +
        (pts.length ? '<ul>' + pts.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>' : '') + '</article>';
    }).join('');
  }


  /* Moments feed the site testimonial carousel. Paraphrased lines are shown without quote marks. */
  if ($('[data-quotes]') && T.moments) {
    window.TAD_TESTIMONIALS = T.moments.map(function (m) {
      return { quote: m.quote, name: m.by, role: m.context, reported: !m.direct };
    });
  }

  /* Gallery: two rows of photos, no captions */
  var gRows = $$('[data-talr-gallery]');
  if (gRows.length && T.gallery) {
    var per = Math.ceil(T.gallery.length / gRows.length);
    gRows.forEach(function (row, r) {
      row.innerHTML = T.gallery.slice(r * per, r * per + per).map(function (g) {
        return '<figure class="g-card' + (g.aspect < 1 ? ' portrait' : '') + '"><img src="' + esc(g.image) + '" alt="' + esc(g.caption) + ', TALR ' + g.year + '" width="' + g.w + '" height="' + g.h + '" loading="lazy" decoding="async"></figure>';
      }).join('');
    });
  }


  /* Dialog (speaker profiles) */
  var lastFocus = null;
  function closeDialog(d) {
    d.remove();
    document.body.style.overflow = '';
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  function dialog(inner, label) {
    lastFocus = document.activeElement;
    var d = document.createElement('div');
    d.className = 'dlg';
    d.setAttribute('role', 'dialog');
    d.setAttribute('aria-modal', 'true');
    d.setAttribute('aria-label', label);
    d.innerHTML = '<div class="box"><button class="close" type="button" aria-label="Close">' + CLOSE + '</button>' + inner + '</div>';
    document.body.appendChild(d);
    document.body.style.overflow = 'hidden';
    $('.close', d).addEventListener('click', function () { closeDialog(d); });
    d.addEventListener('click', function (e) { if (e.target === d) closeDialog(d); });
    d.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeDialog(d);
      if (e.key === 'Tab') {
        var f = $$('button, a[href], input, select, textarea', d);
        if (!f.length) return;
        if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
        else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
      }
    });
    $('.close', d).focus();
    return d;
  }
  window.TALR_UI = { dialog: dialog, esc: esc, ARROW: ARROW };

  /* Speakers: the first 10, then View all. No filters, no event history. No photo yet: initials. */
  function initials(n) { return String(n).split(/\s+/).filter(Boolean).map(function (w) { return w[0]; }).slice(0, 2).join('').toUpperCase(); }
  function face(s) { return s.photo ? '<img src="' + esc(s.photo) + '" alt="" loading="lazy" decoding="async">' : '<span class="spk-init" aria-hidden="true">' + esc(initials(s.name)) + '</span>'; }
  var spWall = $('[data-speakers]');
  if (spWall && SPEAKERS.length) {
    var SHOW = 10, expanded = false;
    var moreBtn = $('[data-speakers-more]');
    var card = function (s) {
      var back = s.logo ? '<img src="' + esc(s.logo) + '" alt="" loading="lazy">' : '<b>' + esc(s.organisation) + '</b>';
      return '<button class="spk" type="button" data-id="' + esc(s.id) + '" aria-label="' + esc([s.name, s.designation, s.organisation].filter(Boolean).join(', ')) + '. View profile">' +
        '<span class="spk-disc"><span class="spk-flip"><span class="spk-face spk-front">' + face(s) + '</span>' +
        '<span class="spk-face spk-back">' + back + '</span></span></span>' +
        '<span class="spk-name">' + esc(s.name) + '</span>' + (s.designation ? '<span class="spk-role">' + esc(s.designation) + '</span>' : '') + '<span class="spk-org">' + esc(s.organisation) + '</span></button>';
    };
    var drawSpeakers = function () {
      spWall.innerHTML = (expanded ? SPEAKERS : SPEAKERS.slice(0, SHOW)).map(card).join('');
      if (moreBtn) {
        var showMore = !expanded && SPEAKERS.length > SHOW;
        moreBtn.parentElement.hidden = !showMore;
        moreBtn.parentElement.style.display = showMore ? '' : 'none';
        moreBtn.firstChild.nodeValue = 'View all ' + SPEAKERS.length + ' voices ';
      }
    };
    if (moreBtn) moreBtn.addEventListener('click', function () { expanded = true; drawSpeakers(); });
    spWall.addEventListener('click', function (e) {
      var b = e.target.closest('.spk');
      if (!b) return;
      var s = SPEAKERS.filter(function (x) { return x.id === b.dataset.id; })[0];
      if (!s) return;
      dialog('<div class="prof"><div><div class="prof-ph">' + (s.photo ? '<img src="' + esc(s.photo) + '" alt="' + esc(s.name) + '">' : '<span class="spk-init">' + esc(initials(s.name)) + '</span>') + '</div>' +
        (s.logo ? '<div class="prof-logo"><img src="' + esc(s.logo) + '" alt="' + esc(s.organisation) + '"></div>' : '') + '</div>' +
        '<div><h2>' + esc(s.name) + '</h2>' + (s.designation ? '<p class="d1">' + esc(s.designation) + '</p>' : '') + '<p class="d2">' + esc(s.organisation) + '</p>' +
        (s.bio ? '<h4>Background</h4><p>' + esc(s.bio) + '</p>' : '') + '</div></div>', s.name + ', speaker profile');
    });
    drawSpeakers();
  }

  /* Agenda */
  var agenda = $('[data-agenda]');
  if (agenda && T.agenda) {
    var A = T.agenda;
    var aside = '<aside class="arc" data-reveal><h3>The arc of the day</h3><ol>' + A.arc.map(function (a, i) {
      return '<li><span class="n">0' + (i + 1) + '</span><div><b>' + esc(a.code.charAt(0) + a.code.slice(1).toLowerCase()) + '</b><p>' + esc(a.line) + '</p></div></li>';
    }).join('') + '</ol><a class="btn btn-primary" href="' + esc(agenda.dataset.cta || '#enquire') + '">Be first to see the agenda' + ARROW + '</a></aside>';
    var rows = A.sessions.map(function (s, i) {
      var t = '<div class="at"><b>' + esc(s.time) + '</b>' + (s.endTime ? '<span>to ' + esc(s.endTime) + '</span>' : '') + '</div>';
      if (s.kind === 'break') return '<li class="agr k-break" data-reveal>' + t + '<div class="ab"><p class="bt">' + esc(s.title) + '</p>' + (s.desc ? '<p class="d">' + esc(s.desc) + '</p>' : '') + '</div></li>';
      var code = s.code ? '<span class="code">' + esc(s.code.charAt(0) + s.code.slice(1).toLowerCase()) + '</span>' : '';
      return '<li class="agr k-' + esc(s.kind) + '" data-reveal>' + t + '<div class="ab"><p class="al">' + code + esc(s.label || '') + '</p>' +
        '<h3>' + esc(s.title) + '</h3>' + (s.desc ? '<p class="d">' + esc(s.desc) + '</p>' : '') + (s.note ? '<p class="nt">' + esc(s.note) + '</p>' : '') + '</div></li>';
    }).join('');
    agenda.innerHTML = aside + '<div class="agt"><h3 class="agt-h">The timeline</h3><ol class="agl">' + rows + '</ol></div>';
  }

  var PP = T.partnerPage || {};

  /* Partner page: roles in orbit around the room, industries circling the outside the other way */
  var orbit = $('[data-orbit]');
  if (orbit && PP.roles) {
    var step = 360 / PP.roles.length;
    var IND = PP.industries || [];
    var indText = IND.map(function (x) { return '<tspan>' + esc(x) + '</tspan><tspan class="sep">  ◆  </tspan>'; }).join('');
    orbit.innerHTML = '<div class="glow"></div><div class="ring"></div><div class="ring in"></div>' +
      (IND.length ? '<svg class="ind-ring" viewBox="0 0 100 100" aria-hidden="true"><defs><path id="ind-path" d="M50,50 m-46.6,0 a46.6,46.6 0 1,1 93.2,0 a46.6,46.6 0 1,1 -93.2,0"/></defs>' +
        '<text><textPath href="#ind-path">' + indText + '</textPath></text></svg>' : '') +
      '<div class="spin rev">' + [20, 110, 200, 290].map(function (a) { return '<span class="odot" style="--a:' + a + 'deg"></span>'; }).join('') + '</div>' +
      '<div class="spin">' + PP.roles.map(function (r, i) {
        return '<div class="node" style="--a:' + (i * step - 90) + 'deg"><div class="cw"><span class="pill">' + esc(r) + '</span></div></div>';
      }).join('') + '</div>' +
      '<div class="core"><span class="k">In the room</span><b>' + esc(orbit.dataset.value || '300+') + '</b><span class="t">TA leaders</span></div>';
    /* Fit the industry names to exactly one lap of the ring, at a readable size */
    var ringText = $('.ind-ring text', orbit);
    var fitRing = function () {
      if (!ringText || !orbit.clientWidth) return;
      var unit = orbit.clientWidth / 100, C = 2 * Math.PI * 46.6;
      ringText.removeAttribute('textLength');
      ringText.setAttribute('font-size', '3');
      var L = ringText.getComputedTextLength();
      if (!L) return;
      var fit = 3 * C / L, cap = 13.5 / unit;
      ringText.setAttribute('font-size', Math.min(fit, cap).toFixed(3));
      ringText.setAttribute('textLength', (C - .2).toFixed(2));
      ringText.setAttribute('lengthAdjust', 'spacing');
    };
    fitRing();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitRing);
    if ('ResizeObserver' in window) new ResizeObserver(fitRing).observe(orbit);
  }

  /* Partner page: why partner */
  var why5 = $('[data-why]');
  if (why5 && PP.why) {
    why5.innerHTML = PP.why.map(function (w, i) {
      return '<article class="wcard" data-reveal style="--d:' + (i * 70) + 'ms"><h3>' + esc(w.title) + '</h3><p class="prob">' + esc(w.problem) + '</p><p class="out">' + esc(w.outcome) + '</p></article>';
    }).join('');
  }

  /* Partner page: ways to partner. Each record names its line drawing in "art": conversation, wave, golf or bars */
  function wayArt(art) {
    var svg;
    if (art === 'conversation') {
      svg = '<svg class="wg wg-conv" viewBox="0 0 96 56"><circle class="c1" cx="34" cy="28" r="20"/><circle class="c2" cx="62" cy="28" r="20"/><circle class="dot" cx="48" cy="28" r="4"/></svg>';
    } else if (art === 'bars') {
      svg = '<svg class="wg wg-bars" viewBox="0 0 96 56">' + [18, 28, 22, 38, 54].map(function (h, i) {
        return '<rect' + (i === 4 ? ' class="hi"' : '') + ' x="' + (i * 20) + '" y="' + (56 - h) + '" width="12" height="' + h + '" style="--dl:' + (i * 80) + 'ms"/>';
      }).join('') + '</svg>';
    } else if (art === 'golf') {
      svg = '<svg class="wg wg-golf" viewBox="0 0 96 56"><path class="green" d="M2 54 Q48 30 94 54"/><line class="pole" x1="56" y1="6" x2="56" y2="42"/><path class="flag" d="M56 6 L76 12 L56 18 Z"/><circle class="ball" cx="28" cy="45" r="3"/></svg>';
    } else {
      svg = '<span class="wg wg-wave" aria-hidden="true">' + [30, 62, 88, 52, 74, 40, 96, 58, 34, 70, 46].map(function (h, i) {
        return '<i style="--h:' + h + '%;--dl:-' + (i * .23).toFixed(2) + 's"></i>';
      }).join('') + '</span>';
    }
    return svg.replace('<svg ', '<svg aria-hidden="true" ');
  }

  var ways = $('[data-ways]');
  if (ways && PP.ways) {
    ways.innerHTML = PP.ways.map(function (w, i) {
      var lead = i === 0;
      return '<article class="way' + (lead ? ' lead-way' : '') + '" data-reveal style="--d:' + (i * 70) + 'ms">' +
        (lead ? '<span data-wedge="tr" data-tone="dark" style="right:0;top:0;width:46%;height:60%"></span>' : '') +
        '<div class="w-top">' + wayArt(w.art) + '<h3>' + esc(w.role) + '</h3></div>' +
        '<p class="w-body">' + esc(w.line) + '</p>' +
        '<div class="w-cta"><a class="btn ' + (lead ? 'btn-primary' : 'btn-way') + '" href="#p-enquire">' + esc(w.cta || 'Explore a partnership') + ARROW + '</a></div></article>';
    }).join('');
    $$('[data-wedge]', ways).forEach(function (el) {
      el.outerHTML = wedge(el.dataset.wedge, el.getAttribute('style') || '', el.dataset.tone, el.dataset.accent !== '0');
    });
  }

  /* Partner page: quotes strip */
  var pq = $('[data-pquotes]');
  if (pq && PP.quotes) {
    var qs = PP.quotes.map(function (q) { return '<figure class="qc"><blockquote>' + esc(q) + '</blockquote></figure>'; }).join('');
    pq.innerHTML = qs + qs.replace(/<figure class="qc">/g, '<figure class="qc" aria-hidden="true">');
  }

  /* Editions rail, same card on both TALR pages: photo, year, edition, title. 2027 also shows its date. */
  $$('[data-erail]').forEach(function (rail) {
    if (!T.journey) return;
    var nx = T.journey.next;
    var ecard = function (o) {
      return '<article class="ecard' + (o.cls ? ' ' + o.cls : '') + '">' +
        '<div class="ec-img">' + (o.img ? '<img src="' + esc(o.img) + '" alt="' + esc(o.alt) + '" loading="lazy" decoding="async">' : '') + (o.inner || '') + '</div>' +
        '<div class="ec-b"><p class="ec-y"><b>' + esc(o.year) + '</b><span>' + esc(o.ed) + '</span></p><h3>' + esc(o.title) + '</h3>' +
        (o.date ? '<p class="ec-f">' + esc(o.date) + '</p>' : '') + '</div></article>';
    };
    var cards = [ecard({ cls: 'next', year: '2027', ed: nx.edition, title: nx.title, date: nx.date,
      inner: '<span data-wedge="tr" data-tone="dark" data-accent="0" style="right:0;top:0;width:60%;height:100%"></span><span class="seal10 ec-seal" role="img" aria-label="TALR 10th edition seal"><img class="s-base" src="/assets/img/talr/brand/seal-base.webp" alt="" width="720" height="720" loading="lazy"><img class="s-ring" src="/assets/img/talr/brand/seal-ring.webp" alt="" width="720" height="720" loading="lazy"></span>' })];
    T.journey.chapters.forEach(function (c) {
      cards.push(ecard({ year: c.year, ed: c.edition, title: c.title, img: c.image, alt: 'TALR ' + c.year + ', ' + c.title,
        inner: c.image ? '' : '<span data-wedge="tr" data-tone="light" data-accent="0" style="right:0;top:0;width:60%;height:100%"></span>' }));
    });
    rail.innerHTML = cards.join('');
    var box = rail.closest('.erail-wrap') || document;
    var bar = $('.erail-bar i', box);
    var sync = function () {
      var max = rail.scrollWidth - rail.clientWidth;
      if (bar) bar.style.transform = 'scaleX(' + (max > 0 ? Math.max(.08, (rail.scrollLeft + rail.clientWidth) / rail.scrollWidth) : 1) + ')';
    };
    rail.addEventListener('scroll', sync, { passive: true });
    window.addEventListener('resize', sync);
    sync();
    $$('[data-erail-go]', box).forEach(function (b) {
      b.addEventListener('click', function () {
        var c = $('.ecard', rail);
        var stepW = c ? c.getBoundingClientRect().width + 14 : 320;
        rail.scrollBy({ left: +b.dataset.erailGo * stepW * 2, behavior: reduce ? 'auto' : 'smooth' });
      });
    });
  });

  /* Hero visual: the photo's two cuts get a gradient border with a light running round it. Drawn at the real pixel size so the line stays even. */
  $$('.hv').forEach(function (hv, n) {
    var border = document.createElement('div');
    border.className = 'hv-border';
    border.setAttribute('aria-hidden', 'true');
    hv.insertBefore(border, $('.hv-seal', hv));
    var drawn = '';
    var draw = function () {
      var w = hv.clientWidth, h = hv.clientHeight;
      if (!w || !h) return;
      var c = Math.round(w * (parseFloat(getComputedStyle(hv).getPropertyValue('--cut')) || .17));
      var key = w + 'x' + h + ':' + c;
      if (key === drawn) return;
      drawn = key;
      var pts = [c + ',0', w + ',0', w + ',' + (h - c), (w - c) + ',' + h, '0,' + h, '0,' + c].join(' ');
      var vb = 'viewBox="0 0 ' + w + ' ' + h + '"', gid = 'hvg' + n;
      border.innerHTML = '<svg ' + vb + '><defs><linearGradient id="' + gid + '" x1="0" y1="0" x2="1" y2="1">' +
        '<stop offset="0" stop-color="#E46A13"/><stop offset=".38" stop-color="#FFB25E"/><stop offset=".68" stop-color="#B24A3A"/><stop offset="1" stop-color="#E46A13"/></linearGradient></defs>' +
        '<polygon class="hb" points="' + pts + '" stroke="url(#' + gid + ')"/><polygon class="hg" points="' + pts + '" pathLength="100"/></svg>';
    };
    draw();
    if ('ResizeObserver' in window) new ResizeObserver(draw).observe(hv);
    else window.addEventListener('resize', draw);
  });

  /* Second pass for wedges rendered inside templates above */
  $$('[data-wedge]').forEach(function (el) {
    el.outerHTML = wedge(el.dataset.wedge, el.getAttribute('style') || '', el.dataset.tone, el.dataset.accent !== '0');
  });

  /* Rolling numbers: arm now, roll when they come into view */
  var rolls = $$('[data-roll]');
  rolls.forEach(armRoll);
  if (!reduce) {
    if ('IntersectionObserver' in window) {
      var rio = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { setTimeout(function () { fireRoll(en.target); }, 150); rio.unobserve(en.target); }
        });
      }, { threshold: 0.4 });
      rolls.forEach(function (el) { rio.observe(el); });
    } else rolls.forEach(fireRoll);
  }

  /* Countdown */
  var cd = $('[data-countdown]');
  if (cd && T.event && T.event.startsAtUtc) {
    var target = Date.parse(T.event.startsAtUtc);
    var units = { d: $('[data-u="d"]', cd), h: $('[data-u="h"]', cd), m: $('[data-u="m"]', cd), s: $('[data-u="s"]', cd) };
    var tick = function () {
      var left = Math.max(0, target - Date.now());
      if (!left) { cd.hidden = true; return; }
      var s = Math.floor(left / 1000);
      units.d.textContent = Math.floor(s / 86400);
      units.h.textContent = String(Math.floor(s % 86400 / 3600)).padStart(2, '0');
      units.m.textContent = String(Math.floor(s % 3600 / 60)).padStart(2, '0');
      units.s.textContent = String(s % 60).padStart(2, '0');
    };
    tick();
    setInterval(tick, 1000);
  }

  /* Hero visual: the photo eases in as the hero scrolls away */
  var hv = $('.hv');
  if (hv && !reduce) {
    var hero = hv.closest('section');
    var hvTick = false;
    var drift = function () {
      var p = Math.min(Math.max(window.scrollY / (hero.offsetHeight || 1), 0), 1);
      hv.style.setProperty('--p', p.toFixed(3));
      hvTick = false;
    };
    window.addEventListener('scroll', function () { if (!hvTick) { hvTick = true; requestAnimationFrame(drift); } }, { passive: true });
    drift();
  }

  /* Scrollspy: the nav link for the section in view gets its underline */
  var spyLinks = $$('.nav-links a[href^="#"]:not(.btn)');
  if (spyLinks.length && 'IntersectionObserver' in window) {
    var map = {};
    spyLinks.forEach(function (a) { var t = $(a.getAttribute('href')); if (t) map[t.id] = a; });
    var sio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        var a = map[en.target.id];
        if (!a) return;
        if (en.isIntersecting) {
          spyLinks.forEach(function (x) { x.classList.toggle('on', x === a); });
        } else if (a.classList.contains('on')) a.classList.remove('on');
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(map).forEach(function (id) { sio.observe(document.getElementById(id)); });
  }
})();
