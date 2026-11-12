/* TALR 2027 forms: "attend" (seat interest) and "partner" (partnership enquiry).
   One implementation, mounted wherever the page has a container:
     <div data-talr-form="attend" data-placement="embedded"></div>
     <div data-talr-form="partner" data-placement="standalone"></div>
   The TALR pages embed them; /register and /partner-enquiry carry them standalone.
   Every copy posts to the same Google Apps Script web app. The payload's "form" key says which form it was,
   "placement" and the utm_* keys say where it came from.

   Built to the TA Dialogues form floor (form-stack handover v2): comboboxes with a hidden value as the truth,
   email typo and disposable checks, honeypots, minimum fill time, Cloudflare Turnstile, a confirmation modal
   with the invite-only terms and reply time, and a submit path that never double-writes on a timeout. */
(function () {
  'use strict';

  /* ===== Settings. The first five must match the Google Sheet (_Settings and _Fields) ===== */
  var APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzqseMu4lBoEjIw-AaDCzc3Q6hAOho56kiYlqwDeEdHm5CMkAZVM0dmil8GiF3nvsyR/exec'; /* web app /exec URL (TALR 2027: Forms sheet) */
  var MIN_FILL_SECONDS = 4;                       /* = _Settings > Min Fill Seconds */
  var HONEYPOTS = ['website_url', 'company_fax']; /* = _Settings > Honeypot Fields */
  var TS = window.TAD_TURNSTILE || null;          /* Cloudflare Turnstile, loaded by script.js. Key set there */
  var TURNSTILE_SITE_KEY = TS ? TS.key : '';
  var MAXLEN = {                                  /* = _Fields > Max Length */
    fullName: 80, email: 120, whatsapp: 10, city: 80, company: 120, industry: 60,
    designation: 80, experience: 2, linkedin: 200, message: 1000
  };
  var USE_LIVE_LOOKUP = true;                     /* company suggestions from an outside directory; disclosed under the field */
  var POST_TIMEOUT_MS = 9000;

  var T = window.TALR || {};
  var F = T.forms || {};
  var PP = T.partnerPage || {};
  var K = T.contact || {};
  var D = window.TAD_FORM_DATA || { IND: [], COMPANIES: [], CITIES: [], ST: {} };
  var UI = window.TALR_UI || {};
  var EVENT = F.eventKey || 'TALR 2027';

  function $(s, c) { return (c || document).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  var ARR = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  var CARET = '<svg class="caret" viewBox="0 0 12 8" aria-hidden="true"><path d="M1 1.5l5 5 5-5" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>';
  var DIA = '<span class="dia" aria-hidden="true"></span>';

  /* ===== Reference lists ===== */
  var FREE = ['gmail.com', 'googlemail.com', 'yahoo.com', 'yahoo.co.in', 'yahoo.in', 'ymail.com', 'rocketmail.com', 'rediffmail.com', 'rediff.com', 'hotmail.com', 'hotmail.co.in', 'outlook.com', 'outlook.in', 'live.com', 'live.in', 'msn.com', 'icloud.com', 'me.com', 'mac.com', 'aol.com', 'protonmail.com', 'proton.me', 'zohomail.com', 'zohomail.in', 'gmx.com', 'gmx.net', 'mail.com', 'yandex.com', 'yandex.ru', 'tutanota.com', 'fastmail.com', 'hey.com'];
  var TYPO_TARGETS = ['gmail.com', 'outlook.com', 'yahoo.com', 'yahoo.co.in', 'hotmail.com', 'icloud.com', 'rediffmail.com'];
  var DISPOSABLE = ['mailinator.com', 'guerrillamail.com', 'guerrillamail.net', 'sharklasers.com', '10minutemail.com', '10minutemail.net', 'tempmail.com', 'temp-mail.org', 'tempmail.net', 'yopmail.com', 'yopmail.net', 'trashmail.com', 'getnada.com', 'nada.email', 'dispostable.com', 'maildrop.cc', 'mintemail.com', 'throwawaymail.com', 'fakeinbox.com', 'mailnesia.com', 'mohmal.com', 'emailondeck.com', 'tempail.com', 'moakt.com', 'burnermail.io', 'spamgourmet.com', 'mytemp.email', 'tempr.email', 'discard.email', 'mailcatch.com', 'inboxkitten.com', 'getairmail.com', 'trashmail.de', 'byom.de', 'tmail.ws', 'tmpmail.org', 'tmpmail.net'];
  var EMAIL_RE = /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?)+$/;
  var NAME_RE = /^[\p{L}][\p{L}\p{M} .'’-]*$/u;
  var LI_PROFILE = /^https:\/\/(www\.)?linkedin\.com\/in\/[^/?#\s]+\/?$/i;
  var LI_PRE = 'https://www.linkedin.com/in/';

  /* ===== Small helpers ===== */
  function lev(a, b) {
    var m = a.length, n = b.length, d = [], i, j;
    for (i = 0; i <= m; i++) { d[i] = [i]; }
    for (j = 0; j <= n; j++) { d[0][j] = j; }
    for (i = 1; i <= m; i++) for (j = 1; j <= n; j++) {
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a.charAt(i - 1) === b.charAt(j - 1) ? 0 : 1));
    }
    return d[m][n];
  }
  function clean(v, keepLines) {
    v = String(v == null ? '' : v);
    v = keepLines ? v.replace(/[\u0000-\u0009\u000B-\u001F\u007F]/g, '').replace(/[ \t]+/g, ' ').replace(/\n{3,}/g, '\n\n')
      : v.replace(/[\u0000-\u001F\u007F]/g, ' ').replace(/\s+/g, ' ');
    v = v.trim();
    return /^[=+\-@\t\r]/.test(v) ? "'" + v : v;
  }
  function words(s) { return s.toLowerCase().split(/[\s/&(),.'-]+/).filter(Boolean); }
  /* Match cost: 0 name prefix, 1 word or alias prefix, 3 name contains, 4 alias contains, -1 no match */
  function cost(q, label, aliases) {
    if (!q) return 0;
    var l = label.toLowerCase();
    if (l.indexOf(q) === 0) return 0;
    if (words(label).some(function (w) { return w.indexOf(q) === 0; })) return 1;
    if (aliases && aliases.some(function (a) { return a.toLowerCase().indexOf(q) === 0; })) return 1;
    if (l.indexOf(q) > -1) return 3;
    if (aliases && aliases.some(function (a) { return a.toLowerCase().indexOf(q) > -1; })) return 4;
    return -1;
  }
  function hl(s, q) {
    if (!q) return esc(s);
    var i = s.toLowerCase().indexOf(q);
    return i < 0 ? esc(s) : esc(s.slice(0, i)) + '<mark>' + esc(s.slice(i, i + q.length)) + '</mark>' + esc(s.slice(i + q.length));
  }
  function utm() {
    var out = {}, keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'], stored = {};
    try { stored = JSON.parse(sessionStorage.getItem('tad_utm') || '{}'); } catch (e) { stored = {}; }
    var qs = new URLSearchParams(location.search), fresh = false;
    keys.forEach(function (k) { if (qs.get(k)) { out[k] = qs.get(k); fresh = true; } });
    if (fresh) { try { sessionStorage.setItem('tad_utm', JSON.stringify(out)); } catch (e) {} return out; }
    keys.forEach(function (k) { if (stored[k]) out[k] = stored[k]; });
    return out;
  }
  utm();

  /* ===== Confirmation modal (one per page) ===== */
  var scrim = null, scrimResolve = null, scrimReturn = null;
  function ensureScrim() {
    if (scrim) return scrim;
    scrim = document.createElement('div');
    scrim.id = 'scrim';
    scrim.className = 'scrim';
    scrim.hidden = true;
    scrim.innerHTML = '<div class="modal" role="dialog" aria-modal="true" aria-labelledby="scrim-title">' +
      '<h3 id="scrim-title">Before we send this</h3><p class="m-terms"></p><p class="m-sla"></p>' +
      '<div class="m-actions"><button type="button" class="btn btn-plum" data-m="ok">Confirm and submit ' + ARR + '</button>' +
      '<button type="button" class="btn btn-outline" data-m="back">Go back and edit</button></div></div>';
    document.body.appendChild(scrim);
    var close = function (ok) {
      scrim.hidden = true;
      document.body.style.overflow = '';
      if (scrimReturn && scrimReturn.focus) scrimReturn.focus();
      if (scrimResolve) { var r = scrimResolve; scrimResolve = null; r(ok); }
    };
    $('[data-m="ok"]', scrim).addEventListener('click', function () { close(true); });
    $('[data-m="back"]', scrim).addEventListener('click', function () { close(false); });
    scrim.addEventListener('click', function (e) { if (e.target === scrim) close(false); });
    scrim.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') close(false);
      if (e.key === 'Tab') {
        var b = $$('button', scrim);
        if (e.shiftKey && document.activeElement === b[0]) { e.preventDefault(); b[b.length - 1].focus(); }
        else if (!e.shiftKey && document.activeElement === b[b.length - 1]) { e.preventDefault(); b[0].focus(); }
      }
    });
    return scrim;
  }
  function confirmSend(kind) {
    ensureScrim();
    var c = F[kind] || {};
    $('.m-terms', scrim).textContent = c.terms || '';
    $('.m-sla', scrim).innerHTML = (kind === 'partner' ? 'Our partnerships team replies ' : 'Our team reviews every request personally and replies ') + '<b>' + esc(c.sla || 'soon') + '</b>.';
    scrimReturn = document.activeElement;
    scrim.hidden = false;
    document.body.style.overflow = 'hidden';
    $('[data-m="ok"]', scrim).focus();
    return new Promise(function (res) { scrimResolve = res; });
  }


  /* ===== Field markup ===== */
  function wrap(id, label, inner, note) {
    return '<div class="fld" id="w-' + id + '"><label for="' + id + '">' + label + '</label>' + inner +
      (note ? '<p class="fnote">' + note + '</p>' : '') +
      '<span class="msg" id="' + id + '-msg" aria-live="polite"></span></div>';
  }
  function input(id, type, max, ph, ac, extra) {
    return '<input id="' + id + '" name="' + id + '" type="' + type + '"' + (max ? ' maxlength="' + max + '"' : '') +
      ' placeholder="' + esc(ph || '') + '" autocomplete="' + (ac || 'off') + '" aria-describedby="' + id + '-msg"' + (extra || '') + '>';
  }
  function comboInput(id, max, ph, caret) {
    return '<div class="combo' + (caret ? ' has-caret' : '') + '">' +
      '<input id="' + id + '" type="text" maxlength="' + max + '" placeholder="' + esc(ph) + '" autocomplete="off" spellcheck="false" role="combobox" aria-autocomplete="list" aria-expanded="false" aria-controls="' + id + '-list" aria-describedby="' + id + '-msg">' +
      (caret ? CARET : '') + '<ul id="' + id + '-list" role="listbox" hidden></ul>' +
      '<input type="hidden" id="' + id + 'Value"></div>';
  }
  function tel(id, label) {
    return wrap(id, label, '<div class="tel"><span class="cc" aria-hidden="true">+91</span>' +
      input(id, 'tel', 10, '10 digit mobile number', 'tel-national', ' inputmode="numeric" pattern="[0-9]*"') + '</div>');
  }
  function honeypots() {
    return '<div class="hp" aria-hidden="true">' + HONEYPOTS.map(function (n) {
      return '<label>' + n + '<input type="text" name="' + n + '" tabindex="-1" autocomplete="off" value=""></label>';
    }).join('') + '</div>';
  }

  /* ===== Message states: error (red), warn (amber), ok (green) ===== */
  function setMsg(id, state, html) {
    var w = $('#w-' + id), m = $('#' + id + '-msg'), el = $('#' + id);
    if (!w || !m) return;
    w.classList.toggle('bad', state === 'error');
    w.classList.toggle('warn', state === 'warn');
    w.classList.toggle('good', state === 'ok');
    m.className = 'msg' + (state ? ' ' + state : '');
    m.innerHTML = html || '';
    if (el) el.setAttribute('aria-invalid', String(state === 'error'));
  }

  /* ===== Combobox: one pattern, every instance =====
     o.id         visible input id; the hidden input is o.id + 'Value' and is what submits
     o.items(q)   returns [{ label, value, display, sub, cost, rank, src, data }]
     o.free       accept free text on blur when nothing resolves
     o.onPick, o.onFree, o.onClear, o.onType */
  function combo(o) {
    var inp = $('#' + o.id), box = $('#' + o.id + '-list'), hid = $('#' + o.id + 'Value');
    var act = -1, list = [], picked = null, lastQ = '';
    var state = { source: '' };
    var render = function () {
      var q = inp.value.trim().toLowerCase();
      lastQ = q;
      list = o.items(q).slice(0, o.max || 60);
      act = -1;
      if (!list.length) {
        box.innerHTML = '<li class="none" role="option" aria-disabled="true">' +
          (q ? (o.free ? 'No match. We’ll use “' + esc(inp.value.trim()) + '”.' : 'No match. Pick one from the list.') : (o.emptyHint || 'Start typing to search')) + '</li>';
      } else {
        box.innerHTML = list.map(function (it, i) {
          return '<li role="option" id="' + o.id + '-o' + i + '" aria-selected="false" data-i="' + i + '"><span class="lbl">' + hl(it.label, q) + '</span>' +
            (it.sub ? '<span class="sec">' + esc(it.sub) + '</span>' : '') + '</li>';
        }).join('');
      }
      box.hidden = false;
      inp.setAttribute('aria-expanded', 'true');
      inp.removeAttribute('aria-activedescendant');
      box.scrollTop = 0;
    };
    var close = function () { box.hidden = true; inp.setAttribute('aria-expanded', 'false'); inp.removeAttribute('aria-activedescendant'); act = -1; };
    var mark = function (i) {
      act = i;
      $$('li', box).forEach(function (li, j) { li.setAttribute('aria-selected', String(j === i)); });
      var li = $('#' + o.id + '-o' + i);
      if (li) { inp.setAttribute('aria-activedescendant', li.id); li.scrollIntoView({ block: 'nearest' }); }
    };
    var pick = function (it) {
      picked = it;
      inp.value = it.display || it.label;
      hid.value = it.value;
      state.source = it.src || 'curated';
      close();
      if (o.onPick) o.onPick(it);
    };
    var resolve = function () {
      var raw = inp.value.trim(), q = raw.toLowerCase();
      if (!raw) { picked = null; hid.value = ''; state.source = ''; if (o.onClear) o.onClear(); return; }
      if (picked && raw === (picked.display || picked.label)) return;
      var all = o.items(q);
      var exact = all.filter(function (it) { return it.label.toLowerCase() === q || (it.display || '').toLowerCase() === q || (it.exact && it.exact(q)); })[0];
      if (exact) { pick(exact); return; }
      var partial = all.filter(function (it) { return it.cost <= 3; });
      if (partial.length === 1) { pick(partial[0]); return; }
      if (o.coerce) { var c = o.coerce(raw); if (c) { pick(c); return; } }
      if (o.free) { picked = null; hid.value = raw; state.source = 'freetext'; if (o.onFree) o.onFree(raw); return; }
      if (picked) { inp.value = picked.display || picked.label; hid.value = picked.value; return; }
      hid.value = ''; state.source = '';
    };
    inp.addEventListener('focus', render);
    inp.addEventListener('click', function () { if (box.hidden) render(); });
    inp.addEventListener('input', function () {
      picked = null; hid.value = ''; state.source = '';
      if (o.onType) o.onType(inp.value);
      render();
    });
    inp.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown') { e.preventDefault(); if (box.hidden) render(); if (list.length) mark(Math.min(list.length - 1, act + 1)); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); if (list.length) mark(Math.max(0, act - 1)); }
      else if (e.key === 'Enter') { e.preventDefault(); if (!box.hidden && act >= 0) pick(list[act]); else { resolve(); close(); } }
      else if (e.key === 'Escape') { close(); }
      else if (e.key === 'Tab') { if (!box.hidden && act >= 0) pick(list[act]); close(); }
    });
    box.addEventListener('mousedown', function (e) { e.preventDefault(); });
    box.addEventListener('click', function (e) { var li = e.target.closest('li[data-i]'); if (li) pick(list[+li.dataset.i]); });
    inp.addEventListener('blur', function () { resolve(); close(); if (o.onBlur) o.onBlur(); });
    return {
      state: state,
      refresh: function () { if (!box.hidden && inp.value.trim().toLowerCase() === lastQ) render(); },
      set: function (it) { pick(it); },
      clear: function () { inp.value = ''; picked = null; hid.value = ''; state.source = ''; },
      value: function () { return hid.value; }
    };
  }

  /* ===== Item sources ===== */
  var IND_ITEMS = D.IND.map(function (n) { return n; }).concat(['Other']);
  function industryItems(q) {
    return IND_ITEMS.map(function (n, i) { return { label: n, value: n, cost: cost(q, n), rank: i }; })
      .filter(function (it) { return it.cost >= 0; })
      .sort(function (a, b) { return a.cost - b.cost || a.rank - b.rank; });
  }
  function experienceItems(q) {
    var out = [];
    for (var n = 0; n <= 45; n++) {
      var s = String(n), c = !q ? 0 : (s.indexOf(q.replace(/\D/g, '')) === 0 && q.replace(/\D/g, '') ? 0 : -1);
      if (c >= 0) out.push({ label: s, value: s, display: s + (n === 1 ? ' year' : ' years'), sub: n === 1 ? 'year' : 'years', cost: c, rank: n,
        exact: (function (num) { return function (qq) { return parseInt(qq, 10) === num && /^\d+\s*(years?|yrs?)?$/.test(qq); }; })(n) });
    }
    return out;
  }
  function experienceCoerce(raw) {
    var m = raw.match(/^(\d{1,2})\s*(years?|yrs?)?$/i);
    if (!m) return null;
    var n = parseInt(m[1], 10);
    if (n > 60) return null;
    return { label: String(n), value: String(n), display: n + (n === 1 ? ' year' : ' years'), cost: 0 };
  }
  var cityCount = {};
  D.CITIES.forEach(function (c) { cityCount[c.name] = (cityCount[c.name] || 0) + 1; });
  function cityItems(q) {
    var out = [];
    D.CITIES.forEach(function (c, i) {
      var k = cost(q, c.name, c.alias);
      if (k < 0) return;
      var st = D.ST[c.st] || '';
      var score = k - (c.hub > -1 ? 1.5 : 0);
      out.push({ label: c.name, value: c.name, display: cityCount[c.name] > 1 ? c.name + ', ' + st : c.name, sub: st, cost: k, score: score,
        rank: c.hub > -1 ? c.hub : 100 + i, data: { state: st },
        exact: (function (cc) { return function (qq) { return cc.alias.some(function (a) { return a.toLowerCase() === qq; }); }; })(c) });
    });
    if (!q) out = out.filter(function (it) { return it.rank < 100; });
    return out.sort(function (a, b) { return a.score - b.score || a.rank - b.rank; });
  }
  function designationItems(list) {
    var all = list.filter(function (n) { return n !== 'Other'; }).concat(['Other']);
    return function (q) {
      return all.map(function (n, i) { return { label: n, value: n, cost: n === 'Other' ? (q ? -1 : 999) : cost(q, n), rank: i }; })
        .filter(function (it) { return it.cost >= 0 || it.value === 'Other'; })
        .sort(function (a, b) { return (a.value === 'Other') - (b.value === 'Other') || a.cost - b.cost || a.rank - b.rank; });
    };
  }

  /* Live company directory: debounced, cached per query, silent on failure */
  var liveCache = {}, liveTimer = null;
  function liveLookup(q, done) {
    if (!USE_LIVE_LOOKUP || q.length < 2) return;
    if (liveCache[q]) { done(); return; }
    clearTimeout(liveTimer);
    liveTimer = setTimeout(function () {
      fetch('https://autocomplete.clearbit.com/v1/companies/suggest?query=' + encodeURIComponent(q))
        .then(function (r) { return r.ok ? r.json() : []; })
        .then(function (rows) { liveCache[q] = Array.isArray(rows) ? rows.slice(0, 6) : []; done(); })
        .catch(function () { liveCache[q] = []; });
    }, 220);
  }
  var curatedNames = {};
  D.COMPANIES.forEach(function (c) { curatedNames[c.name.toLowerCase()] = 1; });
  function companyItems(q) {
    var out = [];
    D.COMPANIES.forEach(function (c, i) {
      var k = cost(q, c.name);
      if (k < 0) return;
      out.push({ label: c.name, value: c.name, sub: D.IND[c.ind - 1] || '', cost: k, rank: i, src: 'curated', data: { ind: c.ind } });
    });
    if (!q) out = out.slice(0, 40);
    out.sort(function (a, b) { return a.cost - b.cost || a.label.length - b.label.length || a.rank - b.rank; });
    (liveCache[q] || []).forEach(function (r, i) {
      if (!r || !r.name || curatedNames[r.name.toLowerCase()]) return;
      out.push({ label: r.name, value: r.name, sub: r.domain || '', cost: 2, rank: 5000 + i, src: 'directory', data: { domain: r.domain || '' } });
    });
    return out;
  }

  /* ===== Validators. Client rules are UX; the sheet repeats every one ===== */
  var personalFor = {};
  function checkName(v) {
    v = v.trim();
    if (!v) return ['error', 'Please enter your full name.'];
    if (/\d/.test(v)) return ['error', 'Numbers aren’t allowed in a name.'];
    if (v.length < 2 || !NAME_RE.test(v)) return ['error', 'Please enter your full name, in letters.'];
    return ['', ''];
  }
  function checkEmail(v, companyDomain) {
    v = v.trim();
    if (!v) return ['error', 'Please enter your work email.'];
    if (v.length > MAXLEN.email || !EMAIL_RE.test(v) || v.indexOf('..') > -1) return ['error', 'Please enter a valid email address.'];
    var parts = v.split('@'), dom = parts[1].toLowerCase();
    if (DISPOSABLE.some(function (d) { return dom === d || dom.slice(-d.length - 1) === '.' + d; })) {
      return ['error', 'Disposable email addresses aren’t accepted. Please use your work email.'];
    }
    if (FREE.indexOf(dom) < 0 && dom.length >= 6) {
      var near = TYPO_TARGETS.filter(function (t) { return lev(dom, t) <= 2; })[0];
      if (near) {
        return ['warn', 'Did you mean <b>' + esc(parts[0] + '@' + near) + '</b>? <button type="button" class="fixit" data-fix="' + esc(parts[0] + '@' + near) + '">Fix it</button>'];
      }
    }
    if (FREE.indexOf(dom) > -1) {
      return ['warn', 'That looks like a personal address. Your work email' + (companyDomain ? ' (name@' + esc(companyDomain) + ')' : '') + ' helps us verify you faster. You can still continue.'];
    }
    return ['', ''];
  }
  function checkPhone(v, optional) {
    if (!v) return optional ? ['', ''] : ['error', 'Please enter your 10 digit mobile number.'];
    return /^[6-9]\d{9}$/.test(v) ? ['', ''] : ['error', 'Please enter a valid 10 digit Indian mobile number, starting with 6, 7, 8 or 9.'];
  }
  function normLinkedIn(v) {
    v = v.trim();
    if (!v || v === LI_PRE) return '';
    var at = v.toLowerCase().lastIndexOf('linkedin.com/');
    if (at > -1) v = 'https://www.' + v.slice(at);
    v = v.replace(/^http:\/\//i, 'https://').replace(/^https:\/\/([a-z]{2})\.linkedin\.com/i, 'https://www.linkedin.com').replace(/^https:\/\/linkedin\.com/i, 'https://www.linkedin.com');
    v = v.replace(/[?#].*$/, '');
    return v;
  }
  function checkLinkedIn(v) {
    v = normLinkedIn(v);
    if (!v) return ['error', 'Please enter your LinkedIn profile URL.'];
    if (/\s/.test(v)) return ['error', 'A URL can’t contain spaces.'];
    if (/linkedin\.com\/(company|school|showcase)\//i.test(v)) return ['error', 'That’s a company page. Please share your personal profile, which looks like linkedin.com/in/yourname.'];
    if (v.length > MAXLEN.linkedin || !LI_PROFILE.test(v)) return ['error', 'Please enter a LinkedIn profile URL, like https://www.linkedin.com/in/yourname'];
    return ['ok', '✓ LinkedIn profile looks right'];
  }
  function req(label, max) {
    return function (v) {
      v = v.trim();
      if (!v) return ['error', 'Please enter your ' + label + '.'];
      if (v.length > max) return ['error', 'Please keep this under ' + max + ' characters.'];
      return ['', ''];
    };
  }
  function digitsOnly(el) {
    el.addEventListener('input', function () {
      var v = el.value.replace(/\D/g, '');
      if (v.length > 10 && /^(91|0)/.test(v)) v = v.replace(/^(91|0)/, '');
      if (v !== el.value) el.value = v.slice(0, 10);
    });
  }

  /* ===== One form ===== */
  function mount(root) {
    var kind = root.getAttribute('data-talr-form');
    var placement = root.getAttribute('data-placement') || 'embedded';
    var P = kind === 'partner' ? 'p_' : 'a_';
    var id = function (k) { return P + k; };
    var copy = F[kind] || {};
    var contact = PP.partnershipsContact || {};
    var altHref = root.getAttribute('data-alt') || (kind === 'partner' ? '/#enquire' : '/partners#p-enquire');

    var side, body;
    if (kind === 'attend') {
      side = '<div class="side"><h3>A seat at the right table</h3><ul>' +
        ['TALR is by invitation. Seats are offered on the relevance of a leader’s experience, role and contribution to the conversation.',
          'Our team reviews every expression of interest personally.',
          'Submitting your interest does not confirm a seat. If your profile is a fit, we will reach out to confirm eligibility and next steps.']
          .map(function (x) { return '<li>' + DIA + '<span>' + esc(x) + '</span></li>'; }).join('') +
        '</ul><p class="alt">Representing a solution provider?<br><a href="' + esc(altHref) + '">Partner with TALR ' + ARR + '</a></p></div>';
      body =
        '<div class="row">' + wrap(id('fullName'), 'Full name *', input(id('fullName'), 'text', MAXLEN.fullName, '', 'name')) +
          wrap(id('email'), 'Work email *', input(id('email'), 'email', MAXLEN.email, 'name@company.com', 'email')) + '</div>' +
        '<div class="row">' + tel(id('whatsapp'), 'Mobile number (WhatsApp) *') +
          wrap(id('city'), 'City *', comboInput(id('city'), MAXLEN.city, 'Start typing your city')) + '</div>' +
        '<div class="row">' + wrap(id('company'), 'Company *', comboInput(id('company'), MAXLEN.company, 'Start typing your company'),
            USE_LIVE_LOOKUP ? 'Suggestions also come from an outside company directory as you type.' : '') +
          '<div>' + wrap(id('industry'), 'Industry *', comboInput(id('industry'), MAXLEN.industry, 'Select or type to search', true)) +
          '<div class="fld other" id="w-' + id('industryOther') + '" hidden><label for="' + id('industryOther') + '">Your industry *</label>' +
            input(id('industryOther'), 'text', MAXLEN.industry, 'e.g. Aerospace', 'off') + '<span class="msg" id="' + id('industryOther') + '-msg" aria-live="polite"></span></div></div></div>' +
        '<div class="row">' + '<div>' + wrap(id('designation'), 'Designation *', comboInput(id('designation'), MAXLEN.designation, 'Select or type your title', true)) +
          '<div class="fld other" id="w-' + id('designationOther') + '" hidden><label for="' + id('designationOther') + '">Your designation *</label>' +
            input(id('designationOther'), 'text', MAXLEN.designation, 'e.g. Head of Talent Strategy', 'organization-title') + '<span class="msg" id="' + id('designationOther') + '-msg" aria-live="polite"></span></div></div>' +
          wrap(id('experience'), 'Years of experience *', comboInput(id('experience'), 8, 'Type or select, e.g. 15', true)) + '</div>' +
        '<div class="row one">' + wrap(id('linkedin'), 'LinkedIn profile URL *', input(id('linkedin'), 'url', MAXLEN.linkedin, 'https://www.linkedin.com/in/yourname', 'url', ' inputmode="url" spellcheck="false" autocapitalize="off"')) + '</div>' +
        '<fieldset class="gset radios" id="w-' + id('featured') + '"><legend>' + esc(F.featuredQuestion || 'Would you be open to being featured in our marketing?') + ' *</legend>' +
          '<div class="rcards"><label class="rcard"><input type="radio" name="' + id('featured') + '" value="Yes"><span>Yes, happy to be featured</span></label>' +
          '<label class="rcard"><input type="radio" name="' + id('featured') + '" value="No"><span>No, please do not</span></label></div>' +
          '<span class="msg" id="' + id('featured') + '-msg" aria-live="polite"></span></fieldset>' +
        '<label class="consent" id="w-' + id('consent') + '"><input type="checkbox" id="' + id('consent') + '"><span>I am 18 or older and I agree to TA Dialogues storing these details and contacting me about TALR 2027. If I attend, my name, organisation, designation, email and phone number will be shared with the event’s sponsors. <a href="/privacy-policy" target="_blank" rel="noopener">Read the privacy policy</a>.</span></label>' +
        '<span class="msg" id="' + id('consent') + '-msg" aria-live="polite"></span>' +
        '<label class="consent opt"><input type="checkbox" id="' + id('mkt') + '"><span><b>Keep me in the loop.</b> I’m happy for TA Dialogues to send me updates, invitations and news about TALR and its other events. I can unsubscribe at any time.</span></label>';
    } else {
      side = '<div class="side"><h3>Shape the room with us</h3><ul>' +
        (contact.email || contact.phone ? '<li>' + DIA + '<span>Contact the team directly' +
          (contact.email ? ' at <a href="mailto:' + esc(contact.email) + '">' + esc(contact.email) + '</a>' : '') +
          (contact.phone ? (contact.email ? ' or ' : ' on ') + '<a href="tel:' + esc(contact.phone.replace(/\s/g, '')) + '">' + esc(contact.phone) + '</a>' : '') + '.</span></li>' : '') +
        '</ul><p class="alt">Joining as a leader instead?<br><a href="' + esc(altHref) + '">Express interest in a seat ' + ARR + '</a></p></div>';
      body =
        '<div class="row">' + wrap(id('fullName'), 'Full name *', input(id('fullName'), 'text', MAXLEN.fullName, '', 'name')) +
          wrap(id('email'), 'Work email *', input(id('email'), 'email', MAXLEN.email, 'name@company.com', 'email')) + '</div>' +
        '<div class="row">' + wrap(id('company'), 'Company *', comboInput(id('company'), MAXLEN.company, 'Start typing your company'),
            USE_LIVE_LOOKUP ? 'Suggestions also come from an outside company directory as you type.' : '') +
          '<div>' + wrap(id('designation'), 'Designation *', comboInput(id('designation'), MAXLEN.designation, 'Select or type your title', true)) +
          '<div class="fld other" id="w-' + id('designationOther') + '" hidden><label for="' + id('designationOther') + '">Your designation *</label>' +
            input(id('designationOther'), 'text', MAXLEN.designation, 'e.g. Head of Talent Strategy', 'organization-title') + '<span class="msg" id="' + id('designationOther') + '-msg" aria-live="polite"></span></div></div>' + '</div>' +
        '<div class="row">' + tel(id('whatsapp'), 'Mobile number *') + '</div>' +
        '<div class="row one">' + wrap(id('message'), 'Message (optional)', '<textarea id="' + id('message') + '" rows="5" maxlength="' + MAXLEN.message + '" placeholder="Anything we should know before we talk?" aria-describedby="' + id('message') + '-msg"></textarea>') + '</div>' +
        '<label class="consent" id="w-' + id('consent') + '"><input type="checkbox" id="' + id('consent') + '"><span>I am 18 or older and I agree to TA Dialogues storing these details and contacting me about partnering with TALR 2027. <a href="/privacy-policy" target="_blank" rel="noopener">Read the privacy policy</a>.</span></label>' +
        '<span class="msg" id="' + id('consent') + '-msg" aria-live="polite"></span>';
    }
    root.innerHTML = side +
      '<div class="fcol"><form novalidate id="' + id('form') + '" data-kind="' + kind + '">' + body + honeypots() +
      (TURNSTILE_SITE_KEY ? '<div class="ts-box" id="' + id('ts') + '"></div>' : '') +
      '<div class="fact"><button class="btn btn-plum" type="submit">' + (kind === 'partner' ? 'Start the conversation' : 'Submit your interest') + ' ' + ARR + '</button>' +
      '<span class="small">All fields marked * are required.</span></div>' +
      '<p class="form-msg msg" role="alert"></p><div class="fallback" id="' + id('fb') + '"></div></form>' +
      '<div class="done" id="' + id('done') + '" hidden tabindex="-1"></div></div>';

    var form = $('#' + id('form'), root);
    var startedAt = Date.now();
    var isSubmitting = false;
    var tsToken = '';
    var companyDomain = '';
    var industryAuto = false;
    var ctl = {};

    /* Enter never submits from a field; only the button does */
    form.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA' && !(e.target.tagName === 'BUTTON' && e.target.type === 'submit')) e.preventDefault();
    });

    /* Company, with industry filled from curated picks */
    ctl.company = combo({
      id: id('company'), items: companyItems, free: true, emptyHint: 'Start typing your company',
      onType: function (v) {
        companyDomain = '';
        if (kind === 'attend') { if (industryAuto) setMsg(id('industry'), '', ''); }
        liveLookup(v.trim().toLowerCase(), function () { ctl.company.refresh(); });
      },
      onPick: function (it) {
        companyDomain = (it.data && it.data.domain) || '';
        setMsg(id('company'), '', '');
        if (kind !== 'attend') return;
        var cur = ctl.industry.value();
        if (it.src === 'curated' && it.data && it.data.ind) {
          if (!cur || industryAuto) {
            var name = D.IND[it.data.ind - 1];
            ctl.industry.set({ label: name, value: name, src: 'company' });
            industryAuto = true;
            showOther(false);
            setMsg(id('industry'), 'ok', 'Filled from ' + esc(it.label) + '. Change it if it’s not right.');
          }
        } else if (!cur || industryAuto) {
          if (industryAuto) { ctl.industry.clear(); industryAuto = false; }
          setMsg(id('industry'), 'warn', 'We couldn’t match an industry for ' + esc(it.label) + '. Please choose one.');
        }
        revalidateEmail();
      },
      onFree: function () { if (kind === 'attend' && industryAuto) { ctl.industry.clear(); industryAuto = false; setMsg(id('industry'), '', ''); } },
      onClear: function () { companyDomain = ''; if (kind === 'attend' && industryAuto) { ctl.industry.clear(); industryAuto = false; setMsg(id('industry'), '', ''); } }
    });

    function showOther(on) {
      var w = $('#w-' + id('industryOther'));
      if (w) w.hidden = !on;
    }
    if (kind === 'attend') {
      ctl.industry = combo({
        id: id('industry'), items: industryItems, free: false,
        onPick: function (it) {
          if (it.src !== 'company') { industryAuto = false; setMsg(id('industry'), '', ''); }
          showOther(it.value === 'Other');
          if (it.value === 'Other') { var o = $('#' + id('industryOther')); setTimeout(function () { o.focus(); }, 0); }
        },
        onType: function () { industryAuto = false; }
      });
      ctl.city = combo({ id: id('city'), items: cityItems, free: true, emptyHint: 'Start typing your city',
        onPick: function () { setMsg(id('city'), '', ''); } });
      ctl.experience = combo({ id: id('experience'), items: experienceItems, free: false, coerce: experienceCoerce, max: 46 });
    }
    function showDesOther(on) {
      var w = $('#w-' + id('designationOther'));
      if (w) w.hidden = !on;
      if (on) { var o = $('#' + id('designationOther')); setTimeout(function () { o.focus(); }, 0); }
    }
    ctl.designation = combo({
      id: id('designation'), items: designationItems((kind === 'attend' ? F.attendDesignations : F.partnerDesignations) || []), free: true,
      onPick: function (it) { showDesOther(it.value === 'Other'); },
      onType: function () { showDesOther(false); }
    });

    /* Field rules */
    var rules = {};
    rules.fullName = function () { return checkName($('#' + id('fullName')).value); };
    rules.email = function () { return checkEmail($('#' + id('email')).value, companyDomain); };
    rules.whatsapp = function () { return checkPhone($('#' + id('whatsapp')).value, false); };
    rules.company = function () { return req('company name', MAXLEN.company)(ctl.company.value()); };
    rules.designation = function () { return req('designation', MAXLEN.designation)(ctl.designation.value()); };
    rules.designationOther = function () {
      if (ctl.designation.value() !== 'Other') return ['', ''];
      return req('designation', MAXLEN.designation)($('#' + id('designationOther')).value);
    };
    if (kind === 'attend') {
      rules.linkedin = function () { return checkLinkedIn($('#' + id('linkedin')).value); };
      rules.city = function () { return req('city', MAXLEN.city)(ctl.city.value()); };
      rules.industry = function () {
        var v = ctl.industry.value();
        if (!v) return ['error', 'Please choose your industry from the list, or pick Other.'];
        return industryAuto ? ['ok', $('#' + id('industry') + '-msg').innerHTML] : ['', ''];
      };
      rules.industryOther = function () {
        if (ctl.industry.value() !== 'Other') return ['', ''];
        return req('industry', MAXLEN.industry)($('#' + id('industryOther')).value);
      };
      rules.experience = function () {
        var v = ctl.experience.value();
        return /^(?:[0-9]|[1-5][0-9]|60)$/.test(v) ? ['', ''] : ['error', 'Please enter your years of experience, as a whole number.'];
      };
      rules.featured = function () {
        return $('input[name="' + id('featured') + '"]:checked', form) ? ['', ''] : ['error', 'Please choose one.'];
      };
    } else {
      rules.message = function () {
        return $('#' + id('message')).value.length > MAXLEN.message ? ['error', 'Please keep this under ' + MAXLEN.message + ' characters.'] : ['', ''];
      };
    }
    rules.consent = function () { return $('#' + id('consent')).checked ? ['', ''] : ['error', 'Please confirm your consent to continue.']; };

    function run(k) { var r = rules[k](); setMsg(id(k), r[0], r[1]); return r[0] !== 'error'; }
    function revalidateEmail() { if ($('#' + id('email')).value.trim()) run('email'); }

    /* Validate on blur, and live once a field has shown an error */
    ['fullName', 'email', 'whatsapp', 'linkedin', 'industryOther', 'designationOther', 'message'].forEach(function (k) {
      var el = $('#' + id(k));
      if (!el || !rules[k]) return;
      el.addEventListener('blur', function () {
        if (k === 'linkedin') { var n = normLinkedIn(el.value); el.value = n; }
        if (el.value.trim() || (k !== 'industryOther' && k !== 'designationOther')) run(k);
      });
      el.addEventListener('input', function () { var w = $('#w-' + id(k)); if (w && (w.classList.contains('bad') || w.classList.contains('warn'))) run(k); });
    });
    ['company', 'designation', 'city', 'industry', 'experience'].forEach(function (k) {
      var el = $('#' + id(k));
      if (!el) return;
      el.addEventListener('blur', function () { setTimeout(function () { if (el.value.trim()) run(k); else if ($('#w-' + id(k)).classList.contains('bad')) run(k); }, 0); });
    });
    var li = $('#' + id('linkedin'));
    if (li) li.addEventListener('focus', function () { if (!li.value.trim()) { li.value = LI_PRE; setTimeout(function () { try { li.setSelectionRange(LI_PRE.length, LI_PRE.length); } catch (e) {} }, 0); } });
    if (li) li.addEventListener('paste', function (e) {
      var s = (e.clipboardData || window.clipboardData); s = s ? s.getData('text') : '';
      if (/linkedin\.com\//i.test(s)) { e.preventDefault(); li.value = normLinkedIn(s); run('linkedin'); }
    });
    digitsOnly($('#' + id('whatsapp')));
    form.addEventListener('click', function (e) {
      var fx = e.target.closest('.fixit');
      if (fx) { var em = $('#' + id('email')); em.value = fx.dataset.fix; run('email'); em.focus(); }
    });
    $$('input[name="' + id('featured') + '"]', form).forEach(function (r) { r.addEventListener('change', function () { run('featured'); }); });
    $('#' + id('consent')).addEventListener('change', function () { run('consent'); });

    var tsHandle = TURNSTILE_SITE_KEY ? TS.render($('#' + id('ts'), root), function (t) { tsToken = t; }) : null;
    function tsReset() { if (tsHandle) tsHandle.reset(); }

    /* Payload */
    function val(k) { var el = $('#' + id(k)); return el ? el.value : ''; }
    function payload() {
      var p = {
        event: EVENT, form: kind, placement: placement, page: location.pathname,
        fullName: val('fullName'), email: val('email'), whatsapp: val('whatsapp'),
        company: ctl.company.value(), companySource: ctl.company.state.source,
        designation: ctl.designation.value() === 'Other' ? val('designationOther') : ctl.designation.value(),
        designationSource: ctl.designation.value() === 'Other' ? 'freetext' : ctl.designation.state.source,
        consent: 'Yes', formStartedAt: startedAt, referrer: document.referrer || ''
      };
      if (companyDomain) p.companyDomain = companyDomain;
      if (kind === 'attend') {
        var ind = ctl.industry.value();
        var cityIt = ctl.city.value();
        var cityEl = $('#' + id('city'));
        var st = '';
        if (ctl.city.state.source === 'curated') {
          var m = cityEl.value.split(', ');
          var match = D.CITIES.filter(function (c) { return c.name === cityIt && (m.length < 2 || D.ST[c.st] === m[1]); })[0];
          st = match ? D.ST[match.st] : '';
        }
        p.city = cityIt; p.state = st; p.citySource = ctl.city.state.source;
        p.industry = ind === 'Other' ? val('industryOther') : ind;
        p.industrySource = ind === 'Other' ? 'freetext' : (industryAuto ? 'company' : 'curated');
        p.linkedin = normLinkedIn(val('linkedin'));
        p.experience = ctl.experience.value();
        p.featured = ($('input[name="' + id('featured') + '"]:checked', form) || {}).value || '';
        p.marketingOptIn = $('#' + id('mkt')).checked ? 'Yes' : 'No';
      } else {
        p.message = val('message');
        var picked = D.COMPANIES.filter(function (c) { return c.name === p.company; })[0];
        if (picked && ctl.company.state.source === 'curated') { p.industry = D.IND[picked.ind - 1]; p.industrySource = 'company'; }
      }
      var u = utm(); Object.keys(u).forEach(function (k) { p[k] = u[k]; });
      HONEYPOTS.forEach(function (n) { p[n] = (form.querySelector('[name="' + n + '"]') || {}).value || ''; });
      if (TURNSTILE_SITE_KEY) p.cfToken = tsToken;
      Object.keys(p).forEach(function (k) { if (typeof p[k] === 'string') p[k] = clean(p[k], k === 'message'); });
      return p;
    }

    /* States after a send */
    var btn = $('button[type="submit"]', form), btnHTML = btn.innerHTML, formMsg = $('.form-msg', form);
    function busy(on) { btn.disabled = on; btn.innerHTML = on ? 'Sending…' : btnHTML; }
    function showDone(name) {
      var first = String(name || '').trim().split(/\s+/)[0];
      var done = $('#' + id('done'));
      done.innerHTML = '<span class="done-mark" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></span>' +
        '<h3>Thank you' + (first ? ', ' + esc(first) : '') + '.</h3>' +
        '<p>' + (kind === 'partner' ? 'Your enquiry is with us. ' : 'Your interest is in. ') + esc(copy.done || '') + '</p>' +
        '<p class="sla">You’ll hear from us <b>' + esc(copy.sla || 'soon') + '</b>.</p>' +
        (placement === 'standalone' ? '<a class="btn btn-outline" href="/">Explore TALR 2027 ' + ARR + '</a>' : '');
      form.hidden = true;
      done.hidden = false;
      done.focus({ preventScroll: true });
      done.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    function silentSuccess() { showDone(val('fullName')); }
    function copyFallback(p) {
      var lines = Object.keys(p).filter(function (k) { return HONEYPOTS.indexOf(k) < 0 && k !== 'formStartedAt' && k !== 'cfToken' && p[k] !== ''; })
        .map(function (k) { return k + ': ' + p[k]; }).join('\n');
      $('#' + id('fb')).innerHTML = '<div class="fb" role="status"><b>Online submission isn’t switched on yet.</b>' +
        '<p>Your details have not been sent. Your form is complete, so you can email the same details to our team.</p>' +
        '<span class="addr">' + esc(K.email) + '</span>' +
        '<div style="display:flex;flex-wrap:wrap;gap:12px;margin-top:14px"><button type="button" class="btn btn-outline" data-copy>Copy my details</button></div>' +
        '<p class="small cpm" style="margin-top:8px"></p></div>';
      $('[data-copy]', root).onclick = function () {
        var m = $('.cpm', root);
        if (!navigator.clipboard) { m.textContent = 'Copy is blocked here. Select the address above and email your details.'; return; }
        navigator.clipboard.writeText(lines).then(function () { m.textContent = 'Copied. Paste into an email to ' + K.email + '.'; })
          .catch(function () { m.textContent = 'Copy is blocked here. Select the address above and email your details.'; });
      };
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (isSubmitting) return;
      isSubmitting = true;
      formMsg.className = 'form-msg msg';
      formMsg.textContent = '';

      /* 1. Honeypots: a filled one is a bot with certainty. Show success, send nothing. */
      if (HONEYPOTS.some(function (n) { var el = form.querySelector('[name="' + n + '"]'); return el && el.value; })) { silentSuccess(); return; }

      /* 2. Validation */
      var order = Object.keys(rules), firstBad = null;
      order.forEach(function (k) { if (!run(k) && !firstBad) firstBad = k; });
      if (firstBad) {
        isSubmitting = false;
        var w = $('#w-' + id(firstBad));
        var target = w && (w.querySelector('input:not([type="hidden"]), textarea, button'));
        if (w) w.scrollIntoView({ behavior: 'smooth', block: 'center' });
        if (target) setTimeout(function () { target.focus({ preventScroll: true }); }, 350);
        return;
      }

      /* 3. Minimum fill time: too fast for a person. Show success, send nothing. */
      if (Date.now() - startedAt < MIN_FILL_SECONDS * 1000) { silentSuccess(); return; }

      /* 4. Turnstile, when switched on */
      if (TURNSTILE_SITE_KEY && !tsToken) {
        isSubmitting = false;
        formMsg.className = 'form-msg msg warn';
        formMsg.textContent = TS.failed()
          ? 'Our spam check didn’t load. Turn off any blocker for this site and try again, or email ' + K.email + '.'
          : 'One moment, we’re checking you’re not a bot. Try again in a second.';
        return;
      }

      /* 5. Confirm the terms, then send */
      confirmSend(kind).then(function (ok) {
        if (!ok) { isSubmitting = false; return; }
        var p = payload();
        if (!APPS_SCRIPT_URL) { isSubmitting = false; copyFallback(p); return; }
        busy(true);
        var body = JSON.stringify(p);
        var ctrl = 'AbortController' in window ? new AbortController() : null;
        var timer = ctrl ? setTimeout(function () { ctrl.abort(); }, POST_TIMEOUT_MS) : null;
        fetch(APPS_SCRIPT_URL, { method: 'POST', mode: 'cors', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: body, signal: ctrl ? ctrl.signal : undefined })
          .then(function (res) { return res.json().catch(function () { return { success: true }; }); })
          .then(function (data) {
            clearTimeout(timer);
            if (data && data.success === false) {
              isSubmitting = false; busy(false); tsReset();
              formMsg.className = 'form-msg msg error';
              formMsg.textContent = data.message || 'That didn’t go through. Please check your details and try again.';
              return;
            }
            showDone(p.fullName);
          })
          .catch(function (err) {
            clearTimeout(timer);
            /* Timed out: Apps Script writes on the first request even when the browser stops listening.
               Treat it as received. Never retry here, or the row is written twice. */
            if (err && err.name === 'AbortError') { showDone(p.fullName); return; }
            /* Failed fast (blocked or offline): one retry without CORS, then confirm. Check the sheet if in doubt. */
            fetch(APPS_SCRIPT_URL, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: body })
              .then(function () { showDone(p.fullName); })
              .catch(function () {
                isSubmitting = false; busy(false); tsReset();
                formMsg.className = 'form-msg msg error';
                formMsg.innerHTML = 'We couldn’t reach our server. Check your connection and try again, or email ' + esc(K.email) + '.';
              });
          });
      });
    });
  }

  $$('[data-talr-form]').forEach(mount);
})();
