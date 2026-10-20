/* Cyber Journey catch-up add-on.
   Adds: a Catch-up card, reschedule buttons on tasks, pause and extend the plan,
   and a timetable you can browse week by week. Loads after the main script. */
(function () {
  'use strict';
  var CJ = window.CJ;
  if (!CJ || !CJ.VIEWS || window.__cuLoaded) return;
  window.__cuLoaded = true;

  var st = document.createElement('style');
  st.textContent =
    '.cu-card{border-color:var(--warn)}' +
    '.cu-list{display:flex;flex-direction:column;gap:6px;margin-block:10px;font-size:14px}' +
    '.cu-list li{display:flex;justify-content:space-between;gap:10px}' +
    '.cu-list li span:first-child{min-width:0;overflow-wrap:anywhere}' +
    '.cu-mv{margin-top:2px}.cu-mv summary{color:var(--ink-2);font-size:12.5px}' +
    '.cu-row{display:flex;flex-wrap:wrap;gap:6px;margin-top:6px}' +
    '.cu-b{padding:6px 10px;border:1px solid var(--line);border-radius:8px;font:500 12.5px/1.2 var(--f-body);background:var(--bg);color:var(--ink);min-height:34px;cursor:pointer}' +
    '.cu-b:hover{border-color:var(--ink-2)}';
  document.head.appendChild(st);

  var esc = CJ.esc, order = {}, wkOff = 0;
  CJ.TASKS.forEach(function (t, i) { order[t.id] = i; t.w0 = t.w; });

  function S() { return CJ.S; }
  function moved() {
    var s = S();
    if (!s.moved || typeof s.moved !== 'object' || Array.isArray(s.moved)) s.moved = {};
    return s.moved;
  }
  /* Put every task in the week the viewer chose (or its original week), then keep the list in week order. */
  function applyMoves() {
    var m = moved();
    CJ.TASKS.forEach(function (t) { var w = m[t.id]; t.w = (w >= 1 && w <= 13) ? w : t.w0; });
    CJ.TASKS.sort(function (a, b) { return a.w - b.w || order[a.id] - order[b.id]; });
  }
  function behind() {
    var w = CJ.curWeek();
    if (w < 2) return [];
    return CJ.TASKS.filter(function (t) { return !CJ.isDone(t.id) && t.w <= 13 && t.w < w; });
  }
  function commit(msg) { CJ.save(); applyMoves(); CJ.render(); if (msg) CJ.toast(msg); }

  /* ----- Today: catch-up, get-ahead and plan control cards ----- */
  function behindCard(b, w) {
    var h = CJ.sumH(b), n = w > 13 ? 1 : Math.min(3, Math.max(1, 14 - w)), per = Math.ceil(h / n);
    var rows = b.slice(0, 4).map(function (t) {
      return '<li><span>' + esc(t.title) + '</span><span class="mut small mono">Week ' + t.w + '</span></li>';
    }).join('') + (b.length > 4 ? '<li class="mut small">and ' + (b.length - 4) + ' more</li>' : '');
    var btns = '';
    if (w <= 13) {
      btns += '<button class="btn pri" type="button" data-cu="spread">Spread over ' + n + (n > 1 ? ' weeks' : ' week') + ' (about ' + per + ' h extra a week)</button>' +
              '<button class="btn" type="button" data-cu="pack">Move all to this week</button>';
    }
    btns += '<button class="btn" type="button" data-cu="extend" data-n="1">Extend plan 1 week</button>' +
            '<button class="btn" type="button" data-tab="tasks">Open checklist</button>';
    return '<section class="card cu-card"><div class="sh"><h2>Catch-up</h2><span class="mut small mono">' + b.length + (b.length === 1 ? ' task' : ' tasks') + ' · ' + h + ' h behind</span></div>' +
      '<p>' + (w > 13 ? 'Your 90 days are over and these are still open.' : 'You are in week ' + w + '. These are from earlier weeks.') + '</p>' +
      '<ul class="cu-list">' + rows + '</ul><div class="row">' + btns + '</div></section>';
  }
  function aheadTasks(w) {
    return CJ.TASKS.filter(function (t) { return t.w === w + 1 && !CJ.isDone(t.id); });
  }
  function aheadCard(w) {
    var next = aheadTasks(w);
    if (!next.length) return '';
    return '<section class="card"><div class="sh"><h2>On track</h2><span class="mut small mono">week ' + w + '</span></div>' +
      '<p>Want to get ahead? Pull next week’s tasks into this week.</p><div class="row"><button class="btn" type="button" data-cu="pull">Pull ' + next.length + (next.length === 1 ? ' task' : ' tasks') + ' forward (' + CJ.sumH(next) + ' h)</button></div></section>';
  }
  function planCard() {
    var d = CJ.dayNum();
    var btns = '';
    if (d >= 1) btns += '<button class="btn" type="button" data-cu="pause">Pause plan</button>';
    btns += '<button class="btn" type="button" data-cu="extend" data-n="1">Extend 1 week</button><button class="btn" type="button" data-cu="extend" data-n="2">Extend 2 weeks</button>';
    return '<section class="card"><div class="sh"><h2>Plan control</h2></div>' +
      '<p class="mut small" style="margin-bottom:10px">Exams, travel or sick? Pause the plan, or extend it so every week moves later. Your ticks stay.</p><div class="row">' + btns + '</div></section>';
  }
  function todayX(html) {
    var s = S(), w = CJ.curWeek(), card = '';
    if (s.pause && s.pause.since) {
      var days = Math.max(0, CJ.daysBetween(s.pause.since, CJ.TODAY()));
      card = '<section class="card cu-card"><div class="sh"><h2>Plan paused</h2><span class="mut small mono">since ' + esc(CJ.fmt(s.pause.since)) + ' · ' + days + ' d</span></div>' +
        '<p>Take your break. The day counter keeps running until you resume. Then the plan shifts by the days you paused, so you lose nothing.</p>' +
        '<div class="row"><button class="btn pri" type="button" data-cu="resume">Resume and shift plan by ' + days + ' days</button></div></section>';
      return html.replace('</section>', '</section>' + card);
    }
    var b = behind();
    card = b.length ? behindCard(b, w) : (w >= 1 && w <= 12 ? aheadCard(w) : '');
    return html.replace('</section>', '</section>' + card) + planCard();
  }

  /* ----- Timetable: browse any week ----- */
  function weekX() {
    var dow = (new Date().getDay() + 6) % 7, today = CJ.TODAY();
    var mon = CJ.addDays(today, -dow + wkOff * 7), sel = CJ.selDay, date = CJ.addDays(mon, sel);
    var days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(function (d, i) {
      var dt = CJ.addDays(mon, i);
      return '<button class="day' + (dt === today ? ' today' : '') + '" type="button" data-day="' + i + '" aria-pressed="' + (i === sel) + '">' + d + '<b>' + Number(dt.slice(8)) + '</b></button>';
    }).join('');
    var keys = Object.keys(CJ.SUBJ), pl = {}, dn = {}, tt = S().tt || {};
    keys.forEach(function (k) { pl[k] = 0; dn[k] = 0; });
    CJ.WEEK.forEach(function (bl, i) {
      bl.forEach(function (b) { var h = CJ.hrs(b); pl[b.sub] += h; if (tt[CJ.addDays(mon, i) + '|' + b.id]) dn[b.sub] += h; });
    });
    var tp = 0, td = 0; keys.forEach(function (k) { tp += pl[k]; td += dn[k]; });
    var bars = keys.map(function (k) {
      return '<div class="hb" style="--sc:var(' + CJ.SUBJ[k].c + ')"><span>' + esc(CJ.SUBJ[k].n) + '</span><div class="bar" aria-hidden="true"><i style="width:' + (pl[k] ? Math.round(100 * dn[k] / pl[k]) : 0) + '%"></i></div><em>' + dn[k] + '/' + pl[k] + ' h</em></div>';
    }).join('');
    var label = wkOff === 0 ? 'This week' : wkOff < 0 ? (wkOff === -1 ? 'Last week' : Math.abs(wkOff) + ' weeks ago') : (wkOff === 1 ? 'Next week' : 'In ' + wkOff + ' weeks');
    return '<section><div class="sh"><h2>Weekly timetable</h2><span class="mut small mono">' + td + ' of ' + tp + ' h</span></div>' +
      '<div class="row" style="align-items:center;margin-bottom:10px"><button class="btn" type="button" data-cuwk="-1">Previous</button><button class="btn" type="button" data-cuwk="0">This week</button><button class="btn" type="button" data-cuwk="1">Next</button>' +
      '<span class="mut small mono">' + label + ' · ' + esc(CJ.fmt(mon)) + ' to ' + esc(CJ.fmt(CJ.addDays(mon, 6))) + '</span></div><div class="days">' + days + '</div></section>' +
      '<section><div class="sh"><h3>' + esc(CJ.fmtLong(date)) + '</h3></div><ul class="list">' + CJ.WEEK[sel].map(function (b) { return CJ.blockRow(b, date); }).join('') + '</ul></section>' +
      '<section class="card"><div class="sh"><h3>Hours this week</h3><span class="mut small mono">Plan: about ' + Math.round(tp) + ' h</span></div><div class="list" style="gap:10px">' + bars + '</div></section>' +
      '<section class="card"><h3>Study rhythm</h3><ul class="imp" style="margin-top:8px"><li>Study 50 minutes, rest 10. Stop on time so tomorrow is easy to start.</li><li>After every lab, write three lines: what you did, what broke, what you learned.</li><li>Missed a block? Tick it on the day you actually did it, or move the task to next week.</li></ul></section>';
  }

  /* wrap every view so the add-on runs first */
  Object.keys(CJ.VIEWS).forEach(function (k) {
    var orig = CJ.VIEWS[k];
    if (k === 'week') CJ.VIEWS[k] = function () { applyMoves(); return weekX(); };
    else if (k === 'today') CJ.VIEWS[k] = function () { applyMoves(); return todayX(orig()); };
    else CJ.VIEWS[k] = function () { applyMoves(); return orig(); };
  });

  /* ----- actions ----- */
  function setWeek(id, w, msg) {
    var t = CJ.TASK[id], m = moved();
    if (!t) return;
    if (w === t.w0) delete m[id]; else m[id] = w;
    commit(msg);
  }
  function spread() {
    var w = Math.max(CJ.curWeek(), 1), list = behind();
    if (!list.length || w > 13) return;
    var n = Math.min(3, 14 - w), cap = Math.ceil(CJ.sumH(list) / n), m = moved(), wk = w, used = 0;
    list.forEach(function (t) {
      if (used + t.h > cap && wk < w + n - 1 && wk < 13) { wk++; used = 0; }
      m[t.id] = wk; used += t.h;
    });
    commit('Spread ' + list.length + ' tasks over ' + n + (n > 1 ? ' weeks' : ' week'));
  }
  function packAll() {
    var w = CJ.curWeek(), list = behind();
    if (!list.length || w < 1 || w > 13) return;
    var m = moved(); list.forEach(function (t) { m[t.id] = w; });
    commit('Moved ' + list.length + ' tasks to week ' + w);
  }
  function pull() {
    var w = CJ.curWeek(), next = aheadTasks(w), m = moved();
    if (!next.length) return;
    next.forEach(function (t) { m[t.id] = w; });
    commit('Pulled ' + next.length + ' tasks into week ' + w);
  }
  function extend(n) {
    var s = S(), ns = CJ.addDays(s.start, 7 * n), tdy = CJ.TODAY();
    if (CJ.daysBetween(ns, tdy) < 0) ns = tdy;
    s.start = ns;
    commit('Plan extended by ' + n + (n > 1 ? ' weeks' : ' week'));
  }
  function pause() { S().pause = { since: CJ.TODAY() }; commit('Plan paused'); }
  function resume() {
    var s = S(), days = s.pause ? Math.max(0, CJ.daysBetween(s.pause.since, CJ.TODAY())) : 0;
    if (days) s.start = CJ.addDays(s.start, days);
    delete s.pause;
    commit('Plan shifted by ' + days + ' days');
  }

  document.addEventListener('click', function (e) {
    var t = e.target && e.target.closest ? e.target : null;
    if (!t) return;
    var wk = t.closest('[data-cuwk]');
    if (wk) {
      var v = Number(wk.getAttribute('data-cuwk'));
      wkOff = v === 0 ? 0 : Math.max(-26, Math.min(4, wkOff + v));
      CJ.render(); return;
    }
    var el = t.closest('[data-cu]');
    if (!el) return;
    var a = el.getAttribute('data-cu'), id = el.getAttribute('data-id'), task = id ? CJ.TASK[id] : null;
    if (a === 'next' && task) setWeek(id, Math.min(13, task.w + 1), 'Moved to week ' + Math.min(13, task.w + 1));
    else if (a === 'now' && task) setWeek(id, Math.max(1, Math.min(13, CJ.curWeek())), 'Moved to this week');
    else if (a === 'back' && task) setWeek(id, task.w0, 'Back in week ' + task.w0);
    else if (a === 'spread') spread();
    else if (a === 'pack') packAll();
    else if (a === 'pull') pull();
    else if (a === 'extend') extend(Number(el.getAttribute('data-n')) || 1);
    else if (a === 'pause') pause();
    else if (a === 'resume') resume();
  });

  /* ----- add a Reschedule control to every open task row ----- */
  var pending = false;
  function decorate() {
    pending = false;
    var rows = document.querySelectorAll('#main .task[data-id]:not([data-cu-done])');
    Array.prototype.forEach.call(rows, function (r) {
      r.setAttribute('data-cu-done', '1');
      var id = r.getAttribute('data-id'), t = CJ.TASK[id], tb = r.querySelector('.tb');
      if (!t || !tb || CJ.isDone(id)) return;
      var w = CJ.curWeek(), btns = '';
      if (t.w < 13) btns += '<button class="cu-b" type="button" data-cu="next" data-id="' + id + '">Move to next week</button>';
      if (w >= 1 && w <= 13 && t.w > w) btns += '<button class="cu-b" type="button" data-cu="now" data-id="' + id + '">Do it this week</button>';
      if (moved()[id]) btns += '<button class="cu-b" type="button" data-cu="back" data-id="' + id + '">Back to week ' + t.w0 + '</button>';
      if (!btns) return;
      var d = document.createElement('details');
      d.className = 'cu-mv';
      d.innerHTML = '<summary>Reschedule</summary><div class="cu-row">' + btns + '</div>';
      tb.appendChild(d);
    });
  }
  var main = document.getElementById('main');
  if (main && window.MutationObserver) {
    new MutationObserver(function () { if (!pending) { pending = true; requestAnimationFrame(decorate); } })
      .observe(main, { childList: true, subtree: true });
  }

  applyMoves();
  CJ.render();
})();
