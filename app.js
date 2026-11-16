'use strict';

// ---------------------------------------------------------------------------
// Læringsmodel
//
// Hvert ord (pr. sprogpar og retning) har et niveau L. Intervallet til næste
// gentagelse er base^L – både i antal opgaver og i tid:
//
//   opgave-interval = taskUnit    * base^L      (fx 1, 2, 4, 8 ... opgaver)
//   tids-interval   = timeUnitMin * base^L      (fx 10 min, 20 min, 40 min ...)
//
// "Forfald" lægger de to sammen, så både øvning og tid trækker ordet frem:
//
//   forfald = opgaver siden sidst / opgave-interval + tid siden sidst / tids-interval
//
// Ordet er klar til gentagelse, når forfald >= 1. Det mest forfaldne ord vises
// først. Er intet ord forfaldent, introduceres næste ord på hyppighedslisten.
//
// Rigtigt svar: L + 1 (intervallet ganges med base).
// Forkert svar: L - 1 (intervallet divideres med base), dog mindst 0.
// Scoren er antal ord, hvor sidste svar var rigtigt og L >= learnedLevel.
// ---------------------------------------------------------------------------
const CONFIG = {
  base: 2,
  taskUnit: 1,
  timeUnitMin: 10,
  learnedLevel: 2,
};

const STORE = 'topwords.v2';

const UI = {
  da: {
    lang: { da: 'Dansk', en: 'Engelsk', ru: 'Russisk' },
    title: 'Lær de mest brugte ord',
    lead: 'Ét ord ad gangen, i den rækkefølge de bruges mest. Din score er hvor mange af de mest brugte ord du kan.',
    learnQ: 'Hvilket sprog vil du lære?',
    baseQ: 'Hvilket sprog forstår du bedst?',
    nativeB: 'Det er mit modersmål',
    nativeS: 'Lær at læse – med billeder',
    otherS: 'Vis oversættelser',
    modeQ: 'Hvad vil du øve?',
    recB: 'Forstå ordet', recS: 'Se {T}, vælg {B}',
    prodB: 'Find ordet', prodS: 'Se {B}, vælg {T}',
    recNB: 'Find billedet', recNS: 'Se ordet, vælg billedet',
    prodNB: 'Læs ordet', prodNS: 'Se billedet, vælg ordet',
    diffQ: 'Sværhedsgrad',
    diff: ['', 'Let', 'Mellem', 'Svær'],
    nWords: '{n} ord',
    start: 'Start',
    sound: 'Læs ordene højt',
    learned: 'ord lært',
    newWord: 'Nyt ord',
    repeat: 'Gentagelse',
    next: 'Videre',
    correct: 'Rigtigt!',
    wrong: 'Ikke helt – det rigtige svar er grønt',
    qRec: 'Hvad betyder ordet?',
    qProd: 'Hvad hedder det på {T}?',
    qRecN: 'Hvilket billede passer til ordet?',
    qProdN: 'Hvilket ord passer til billedet?',
    rank: 'Ord nr. {n} på listen',
    seen: '{n} ord mødt',
    due: '{n} klar til gentagelse',
    empty: 'Der er ingen ord, der passer til de valgte indstillinger.',
    stats: 'Statistik',
    back: 'Tilbage',
    reset: 'Nulstil fremskridt',
    resetQ: 'Nulstil al fremskridt for denne kombination af sprog og øvelse?',
    cols: ['#', 'Ord', 'Pr. mio.', 'Betydning', 'Niveau', 'Interval', 'Status', 'Forfald'],
    learnedS: 'lært', notYet: 'ikke endnu', wrongS: 'svaret forkert',
    tasks: 'opg.',
    noStats: 'Du har ikke mødt nogen ord endnu.',
    explain:
      'Hvert ord har et niveau <code>L</code>. Næste gentagelse kommer efter <code>{tu}·{b}<sup>L</sup></code> opgaver ' +
      'og <code>{mu} min·{b}<sup>L</sup></code> – de to lægges sammen som <b>forfald</b>, og ordet er klar ved 100 %. ' +
      'Rigtigt svar: <code>L+1</code>. Forkert svar: <code>L−1</code>. Et ord tæller som lært fra niveau {ll}, hvis sidste svar var rigtigt.',
  },
  en: {
    lang: { da: 'Danish', en: 'English', ru: 'Russian' },
    title: 'Learn the most used words',
    lead: 'One word at a time, in order of how often they are used. Your score is how many of the most used words you know.',
    learnQ: 'Which language do you want to learn?',
    baseQ: 'Which language do you understand best?',
    nativeB: 'It is my first language',
    nativeS: 'Learn to read – with pictures',
    otherS: 'Show translations',
    modeQ: 'What do you want to practise?',
    recB: 'Understand the word', recS: 'See {T}, pick {B}',
    prodB: 'Find the word', prodS: 'See {B}, pick {T}',
    recNB: 'Find the picture', recNS: 'See the word, pick the picture',
    prodNB: 'Read the word', prodNS: 'See the picture, pick the word',
    diffQ: 'Difficulty',
    diff: ['', 'Easy', 'Medium', 'Hard'],
    nWords: '{n} words',
    start: 'Start',
    sound: 'Read words aloud',
    learned: 'words learned',
    newWord: 'New word',
    repeat: 'Review',
    next: 'Continue',
    correct: 'Correct!',
    wrong: 'Not quite – the right answer is green',
    qRec: 'What does the word mean?',
    qProd: 'What is it in {T}?',
    qRecN: 'Which picture matches the word?',
    qProdN: 'Which word matches the picture?',
    rank: 'Word no. {n} on the list',
    seen: '{n} words seen',
    due: '{n} ready for review',
    empty: 'No words match the chosen settings.',
    stats: 'Statistics',
    back: 'Back',
    reset: 'Reset progress',
    resetQ: 'Reset all progress for this language pair and exercise?',
    cols: ['#', 'Word', 'Per mil.', 'Meaning', 'Level', 'Interval', 'Status', 'Due'],
    learnedS: 'learned', notYet: 'not yet', wrongS: 'answered wrong',
    tasks: 'tasks',
    noStats: 'You have not met any words yet.',
    explain:
      'Each word has a level <code>L</code>. The next review comes after <code>{tu}·{b}<sup>L</sup></code> tasks ' +
      'and <code>{mu} min·{b}<sup>L</sup></code> – the two are added up as <b>due</b>, and the word is ready at 100 %. ' +
      'Correct: <code>L+1</code>. Wrong: <code>L−1</code>. A word counts as learned from level {ll} if the last answer was correct.',
  },
  ru: {
    lang: { da: 'Датский', en: 'Английский', ru: 'Русский' },
    title: 'Учите самые частые слова',
    lead: 'По одному слову, в порядке частоты употребления. Ваш счёт — сколько самых частых слов вы знаете.',
    learnQ: 'Какой язык вы хотите учить?',
    baseQ: 'Какой язык вы понимаете лучше всего?',
    nativeB: 'Это мой родной язык',
    nativeS: 'Учимся читать – с картинками',
    otherS: 'Показывать перевод',
    modeQ: 'Что будем тренировать?',
    recB: 'Понять слово', recS: 'Видите {T}, выбираете {B}',
    prodB: 'Найти слово', prodS: 'Видите {B}, выбираете {T}',
    recNB: 'Найти картинку', recNS: 'Видите слово, выбираете картинку',
    prodNB: 'Прочитать слово', prodNS: 'Видите картинку, выбираете слово',
    diffQ: 'Сложность',
    diff: ['', 'Лёгкая', 'Средняя', 'Сложная'],
    nWords: 'слов: {n}',
    start: 'Начать',
    sound: 'Читать слова вслух',
    learned: 'слов выучено',
    newWord: 'Новое слово',
    repeat: 'Повторение',
    next: 'Дальше',
    correct: 'Правильно!',
    wrong: 'Не совсем – правильный ответ зелёный',
    qRec: 'Что означает это слово?',
    qProd: 'Как это будет на языке: {T}?',
    qRecN: 'Какая картинка подходит к слову?',
    qProdN: 'Какое слово подходит к картинке?',
    rank: 'Слово № {n} в списке',
    seen: 'встречено слов: {n}',
    due: 'к повторению: {n}',
    empty: 'Нет слов для выбранных настроек.',
    stats: 'Статистика',
    back: 'Назад',
    reset: 'Сбросить прогресс',
    resetQ: 'Сбросить весь прогресс для этой пары языков и упражнения?',
    cols: ['№', 'Слово', 'На млн', 'Значение', 'Уровень', 'Интервал', 'Статус', 'Срок'],
    learnedS: 'выучено', notYet: 'ещё нет', wrongS: 'ошибка',
    tasks: 'зад.',
    noStats: 'Вы ещё не встретили ни одного слова.',
    explain:
      'У каждого слова есть уровень <code>L</code>. Следующее повторение — через <code>{tu}·{b}<sup>L</sup></code> заданий ' +
      'и <code>{mu} мин·{b}<sup>L</sup></code>; оба значения складываются в <b>срок</b>, и слово готово к повторению при 100 %. ' +
      'Верно: <code>L+1</code>. Неверно: <code>L−1</code>. Слово считается выученным с уровня {ll}, если последний ответ был верным.',
  },
};

// ---------- State ----------
const state = loadState();
let view = state.settings ? 'play' : 'setup';
let draft = null;
let current = null;
let timer = null;

function loadState() {
  let s = null;
  try { s = JSON.parse(localStorage.getItem(STORE)); } catch (e) { /* ingen lagring */ }
  if (!s || typeof s !== 'object') s = {};
  s.progress = s.progress || {};
  s.sound = s.sound !== false;
  return s;
}
function saveState() {
  try { localStorage.setItem(STORE, JSON.stringify(state)); } catch (e) { /* ignorer */ }
}

// ---------- Helpers ----------
const $ = (id) => document.getElementById(id);
const esc = (s) => String(s).replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
const fill = (str, vars) => str.replace(/\{(\w+)\}/g, (_, k) => (k in vars ? vars[k] : `{${k}}`));
function browserLang() {
  const l = (navigator.language || 'da').toLowerCase().slice(0, 2);
  return UI[l] ? l : 'en';
}
// Appens sprog er altid det sprog, brugeren forstår bedst – aldrig det sprog, der skal læres.
// Indtil det er valgt, bruges det tidligere valg eller browserens sprog.
function uiLang() {
  if (view === 'setup' && draft && draft.base) return draft.base;
  return (state.settings && state.settings.base) || browserLang();
}
function t(key, vars) {
  const v = UI[uiLang()][key];
  return vars && typeof v === 'string' ? fill(v, vars) : v;
}
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// ---------- Model ----------
function buildPool(s) {
  const native = s.base === s.target;
  return ORDER[s.target].map((id) => BY_ID[id])
    .filter((c) => c.diff <= s.diff && c.words[s.target] && (native ? c.emoji : c.words[s.base]));
}
function ctx() {
  const s = state.settings;
  const native = s.base === s.target;
  const key = `${s.target}|${s.base}|${s.dir}`;
  const prog = (state.progress[key] = state.progress[key] || { task: 0, cards: {}, lastId: null });
  return { s, native, key, prog, pool: buildPool(s) };
}
const intervalFactor = (lvl) => Math.pow(CONFIG.base, lvl);
function dueness(card, prog, now) {
  const f = intervalFactor(card.lvl);
  return (prog.task - card.task) / (CONFIG.taskUnit * f) + (now - card.time) / (CONFIG.timeUnitMin * 60000 * f);
}
function isLearned(card) { return card.ok && card.lvl >= CONFIG.learnedLevel; }
function scoreOf(prog) { return Object.values(prog.cards).filter(isLearned).length; }
function rankOf(target, id) { return ORDER[target].indexOf(id) + 1; }

function pickNext(c) {
  const now = Date.now();
  const introduced = c.pool.filter((x) => c.prog.cards[x.id]);
  let best = null;
  let bestP = -Infinity;
  for (const x of introduced) {
    if (x.id === c.prog.lastId && introduced.length > 1) continue;
    const p = dueness(c.prog.cards[x.id], c.prog, now);
    if (p > bestP) { best = x; bestP = p; }
  }
  if (best && bestP >= 1) return { kind: 'quiz', concept: best };
  const fresh = c.pool.find((x) => !c.prog.cards[x.id]);
  if (fresh) return { kind: 'intro', concept: fresh };
  return best ? { kind: 'quiz', concept: best } : null;
}

// Svarmuligheder vises i "betydnings"-sproget ved rec, i målsproget ved prod.
function optionLabel(c, x) {
  if (c.s.dir === 'rec') return c.native ? x.emoji : x.words[c.s.base].toLowerCase();
  return x.words[c.s.target].toLowerCase();
}
function pickDistractors(c, concept, n = 3) {
  const answer = optionLabel(c, concept);
  const used = new Set([answer]);
  const picked = [];
  const cand = c.pool.filter((x) => x.id !== concept.id);
  const seen = (x) => !!c.prog.cards[x.id];
  const samePos = (x) => x.pos === concept.pos;
  const near = new Set(c.pool.slice(0, Math.max(40, c.pool.indexOf(concept) + 20)).map((x) => x.id));
  const tiers = [
    cand.filter((x) => seen(x) && samePos(x)),
    cand.filter((x) => !seen(x) && samePos(x) && near.has(x.id)),
    cand.filter((x) => seen(x)),
    cand.filter((x) => near.has(x.id)),
    cand,
  ];
  for (const tier of tiers) {
    for (const x of shuffle([...tier])) {
      if (picked.length >= n) break;
      const label = optionLabel(c, x);
      if (used.has(label)) continue;
      used.add(label);
      picked.push(x);
    }
    if (picked.length >= n) break;
  }
  return picked;
}

// ---------- Speech ----------
function speak(text, lang) {
  if (!state.sound || !('speechSynthesis' in window)) return;
  try {
    const u = new SpeechSynthesisUtterance(text);
    u.lang = LANGS[lang].tts;
    const voice = speechSynthesis.getVoices().find((v) => v.lang.replace('_', '-').toLowerCase().startsWith(lang));
    if (voice) u.voice = voice;
    u.rate = 0.9;
    speechSynthesis.cancel();
    speechSynthesis.speak(u);
  } catch (e) { /* ingen tale */ }
}
function speakTarget(concept) { speak(concept.words[state.settings.target], state.settings.target); }

// ---------- Rendering ----------
function render() {
  clearTimeout(timer);
  document.documentElement.lang = uiLang();
  const inGame = !!state.settings && view !== 'setup';
  $('score').hidden = !inGame;
  $('statsBtn').hidden = !inGame;
  $('setupBtn').hidden = !state.settings;
  $('statsBtn').title = t('stats');
  if (inGame) updateScore();
  if (view === 'setup') renderSetup();
  else if (view === 'stats') renderStats();
  else renderPlay();
}

function updateScore(delta) {
  const c = ctx();
  $('scoreNum').textContent = scoreOf(c.prog);
  $('scoreLabel').textContent = t('learned');
  const d = $('scoreDelta');
  d.className = 'score-delta';
  if (delta) {
    void d.offsetWidth; // genstart animation
    d.textContent = delta > 0 ? `+${delta}` : `${delta}`;
    d.className = `score-delta ${delta > 0 ? 'up' : 'down'}`;
  }
}

// ----- Setup -----
function renderSetup() {
  if (!draft) draft = state.settings ? { ...state.settings } : { target: null, base: null, dir: 'rec', diff: 1 };
  const d = draft;
  const L = UI[uiLang()].lang;
  const langs = Object.keys(LANGS);
  const choice = (attrs, pressed, title, sub) =>
    `<button class="choice" ${attrs} aria-pressed="${pressed}"><b>${esc(title)}</b>${sub ? `<small>${esc(sub)}</small>` : ''}</button>`;

  let html = `<section class="setup"><h1>${esc(t('title'))}</h1><p class="lead">${esc(t('lead'))}</p>`;

  html += `<div class="step"><h2>${esc(t('learnQ'))}</h2><div class="choices">`;
  for (const l of langs) html += choice(`data-target="${l}"`, d.target === l, LANGS[l].name);
  html += `</div></div>`;

  if (d.target) {
    html += `<div class="step"><h2>${esc(t('baseQ'))}</h2><div class="choices">`;
    html += choice(`data-base="${d.target}"`, d.base === d.target, L[d.target], t('nativeB') + ' · ' + t('nativeS'));
    for (const l of langs.filter((l) => l !== d.target)) html += choice(`data-base="${l}"`, d.base === l, L[l], t('otherS'));
    html += `</div></div>`;
  }

  if (d.target && d.base) {
    const native = d.base === d.target;
    const vars = { T: L[d.target].toLowerCase(), B: L[d.base].toLowerCase() };
    html += `<div class="step"><h2>${esc(t('modeQ'))}</h2><div class="choices">`;
    if (native) {
      html += choice(`data-dir="prod"`, d.dir === 'prod', t('prodNB'), t('prodNS'));
      html += choice(`data-dir="rec"`, d.dir === 'rec', t('recNB'), t('recNS'));
    } else {
      html += choice(`data-dir="rec"`, d.dir === 'rec', t('recB'), t('recS', vars));
      html += choice(`data-dir="prod"`, d.dir === 'prod', t('prodB'), t('prodS', vars));
    }
    html += `</div></div>`;

    html += `<div class="step"><h2>${esc(t('diffQ'))}</h2><div class="choices">`;
    for (const lvl of [1, 2, 3]) {
      const n = buildPool({ ...d, diff: lvl }).length;
      html += choice(`data-diff="${lvl}"`, d.diff === lvl, t('diff')[lvl], t('nWords', { n }));
    }
    html += `</div></div>`;

    html += `<div class="row">
      <button class="primary" id="startBtn">${esc(t('start'))}</button>
      <label class="toggle"><input type="checkbox" id="soundChk" ${state.sound ? 'checked' : ''}> ${esc(t('sound'))}</label>
    </div>`;
  }
  html += `</section>`;
  $('app').innerHTML = html;

  $('app').querySelectorAll('[data-target]').forEach((b) => b.onclick = () => {
    if (d.target !== b.dataset.target) { d.target = b.dataset.target; d.base = null; }
    renderAll();
  });
  $('app').querySelectorAll('[data-base]').forEach((b) => b.onclick = () => { d.base = b.dataset.base; renderAll(); });
  $('app').querySelectorAll('[data-dir]').forEach((b) => b.onclick = () => { d.dir = b.dataset.dir; renderAll(); });
  $('app').querySelectorAll('[data-diff]').forEach((b) => b.onclick = () => { d.diff = Number(b.dataset.diff); renderAll(); });
  const start = $('startBtn');
  if (start) start.onclick = () => {
    state.sound = $('soundChk').checked;
    state.settings = { ...d };
    saveState();
    draft = null;
    current = null;
    view = 'play';
    render();
  };
}
function renderAll() { render(); }

// ----- Play -----
function renderPlay() {
  if (!current) {
    const c = ctx();
    const next = pickNext(c);
    if (!next) { $('app').innerHTML = `<p class="task-q">${esc(t('empty'))}</p>`; return; }
    current = { ...next, answered: null };
    if (next.kind === 'quiz') {
      current.options = shuffle([next.concept, ...pickDistractors(c, next.concept)]);
    }
    renderPlayView();
    if (next.kind === 'intro') speakTarget(next.concept);
    else if (c.s.dir === 'rec' && !c.native) speakTarget(next.concept);
    return;
  }
  renderPlayView();
}

function meaningHTML(c, x, big) {
  if (c.native) return `<span class="emoji">${x.emoji}</span>`;
  const icon = x.emoji ? `<span class="emoji-sm">${x.emoji}</span>` : '';
  return `${icon}<span class="${big ? 'w' : 'w'}">${esc(x.words[c.s.base])}</span>`;
}
const targetHTML = (c, x) => `<span class="w">${esc(x.words[c.s.target])}</span>`;

function renderPlayView() {
  const c = ctx();
  const x = current.concept;
  const now = Date.now();
  const introduced = Object.keys(c.prog.cards).filter((id) => c.pool.some((p) => p.id === id));
  const dueCount = introduced.filter((id) => dueness(c.prog.cards[id], c.prog, now) >= 1).length;
  const score = scoreOf(c.prog);
  const L = UI[uiLang()].lang;

  let html = `<div class="meta"><span>${esc(t('rank', { n: rankOf(c.s.target, x.id) }))}</span>
    <span>${esc(t('seen', { n: introduced.length }))} · ${esc(t('due', { n: dueCount }))}</span></div>
    <div class="progress"><div style="width:${Math.min(100, (score / Math.max(1, c.pool.length)) * 100)}%"></div></div>`;

  const speakBtn = `<button class="speak" id="speakBtn" title="🔊">🔊</button>`;

  if (current.kind === 'intro') {
    html += `<div class="prompt"><span class="badge">${esc(t('newWord'))}</span>${speakBtn}
      ${x.emoji ? `<span class="emoji">${x.emoji}</span>` : ''}
      ${targetHTML(c, x)}
      ${c.native ? '' : `<span class="sub">${esc(x.words[c.s.base])}</span>`}
    </div>
    <div class="feedback"><button class="primary" id="nextBtn">${esc(t('next'))} →</button></div>`;
  } else {
    const rec = c.s.dir === 'rec';
    const q = c.native ? (rec ? t('qRecN') : t('qProdN')) : (rec ? t('qRec') : t('qProd', { T: L[c.s.target].toLowerCase() }));
    html += `<div class="prompt"><span class="badge">${esc(t('repeat'))}</span>${speakBtn}
      ${rec ? targetHTML(c, x) : meaningHTML(c, x, true)}
    </div>
    <p class="task-q">${esc(q)}</p>
    <div class="options">`;
    current.options.forEach((o, i) => {
      let cls = 'opt';
      if (current.answered) {
        if (o.id === x.id) cls += ' good';
        else if (o.id === current.answered) cls += ' bad';
        else cls += ' dim';
      }
      html += `<button class="${cls}" data-i="${i}" ${current.answered ? 'disabled' : ''}>
        ${rec ? meaningHTML(c, o, false) : targetHTML(c, o)}
        <span class="key">${i + 1}</span></button>`;
    });
    html += `</div><div class="feedback">`;
    if (current.answered) {
      const ok = current.answered === x.id;
      html += `<div class="msg ${ok ? 'good' : 'bad'}">${esc(ok ? t('correct') : t('wrong'))}</div>`;
      if (!ok) html += `<button class="primary" id="nextBtn">${esc(t('next'))} →</button>`;
    }
    html += `</div>`;
  }
  $('app').innerHTML = html;

  $('speakBtn').onclick = () => speakTarget(x);
  const nextBtn = $('nextBtn');
  if (nextBtn) nextBtn.onclick = advance;
  $('app').querySelectorAll('.opt').forEach((b) => b.onclick = () => choose(Number(b.dataset.i)));
}

function choose(i) {
  if (!current || current.kind !== 'quiz' || current.answered) return;
  const c = ctx();
  const x = current.concept;
  const card = c.prog.cards[x.id];
  const correct = current.options[i].id === x.id;
  const before = scoreOf(c.prog);

  card.lvl = correct ? card.lvl + 1 : Math.max(0, card.lvl - 1);
  card.ok = correct;
  card[correct ? 'right' : 'wrong'] += 1;
  card.task = c.prog.task;
  card.time = Date.now();
  c.prog.task += 1;
  c.prog.lastId = x.id;
  saveState();

  current.answered = current.options[i].id;
  renderPlayView();
  updateScore(scoreOf(c.prog) - before);
  speakTarget(x);
  if (correct) timer = setTimeout(advance, 1100);
}

function advance() {
  clearTimeout(timer);
  if (current && current.kind === 'intro') {
    const c = ctx();
    c.prog.cards[current.concept.id] = { lvl: 0, task: c.prog.task, time: Date.now(), ok: false, right: 0, wrong: 0 };
    c.prog.task += 1;
    c.prog.lastId = current.concept.id;
    saveState();
  }
  current = null;
  renderPlay();
}

// ----- Stats -----
function fmtDuration(min) {
  const da = uiLang() === 'da';
  if (min < 60) return `${Math.round(min)} min`;
  if (min < 60 * 24) return `${(min / 60).toFixed(min < 600 ? 1 : 0).replace('.', da ? ',' : '.')} ${da ? 't' : 'h'}`;
  return `${(min / 1440).toFixed(min < 14400 ? 1 : 0).replace('.', da ? ',' : '.')} ${da ? 'd' : 'd'}`;
}

function renderStats() {
  const c = ctx();
  const now = Date.now();
  const ids = Object.keys(c.prog.cards).filter((id) => BY_ID[id]).sort((a, b) => rankOf(c.s.target, a) - rankOf(c.s.target, b));
  const cols = t('cols');
  let html = `<section class="stats"><div class="row" style="justify-content:space-between">
      <h1>${esc(t('stats'))}</h1><button class="secondary" id="backBtn">← ${esc(t('back'))}</button></div>
    <div class="explain">${fill(t('explain'), { tu: CONFIG.taskUnit, b: CONFIG.base, mu: CONFIG.timeUnitMin, ll: CONFIG.learnedLevel })}</div>`;

  if (!ids.length) {
    html += `<p class="task-q">${esc(t('noStats'))}</p>`;
  } else {
    html += `<div class="table-wrap"><table><thead><tr>${cols.map((h) => `<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>`;
    for (const id of ids) {
      const x = BY_ID[id];
      const card = c.prog.cards[id];
      const f = intervalFactor(card.lvl);
      const p = dueness(card, c.prog, now);
      const status = isLearned(card) ? `<span class="dot ok"></span>${esc(t('learnedS'))}`
        : card.wrong && !card.ok ? `<span class="dot no"></span>${esc(t('wrongS'))}`
        : `<span class="dot"></span>${esc(t('notYet'))}`;
      const meaning = c.native ? x.emoji : `${x.emoji ? x.emoji + ' ' : ''}${esc(x.words[c.s.base])}`;
      html += `<tr>
        <td class="num">${rankOf(c.s.target, id)}</td>
        <td><b>${esc(x.words[c.s.target])}</b></td>
        <td class="num">${(IPM[c.s.target][id] || 0).toLocaleString(uiLang())}</td>
        <td>${meaning}</td>
        <td class="num">${card.lvl}</td>
        <td class="num">${CONFIG.taskUnit * f} ${esc(t('tasks'))} · ${fmtDuration(CONFIG.timeUnitMin * f)}</td>
        <td>${status}</td>
        <td class="num"><span class="bar ${p >= 1 ? 'due' : ''}"><div style="width:${Math.min(100, p * 100)}%"></div></span> ${Math.round(p * 100)} %</td>
      </tr>`;
    }
    html += `</tbody></table></div>`;
  }
  html += `<p style="margin-top:20px"><button class="secondary" id="resetBtn">${esc(t('reset'))}</button></p></section>`;
  $('app').innerHTML = html;

  $('backBtn').onclick = () => { view = 'play'; render(); };
  $('resetBtn').onclick = () => {
    if (!confirm(t('resetQ'))) return;
    delete state.progress[c.key];
    saveState();
    current = null;
    view = 'play';
    render();
  };
}

// ---------- Global events ----------
$('homeBtn').onclick = () => { if (state.settings) { view = 'play'; render(); } };
$('statsBtn').onclick = () => { view = view === 'stats' ? 'play' : 'stats'; render(); };
$('setupBtn').onclick = () => { draft = null; view = 'setup'; render(); };
document.addEventListener('keydown', (e) => {
  if (view !== 'play' || !current || e.ctrlKey || e.metaKey || e.altKey) return;
  if (current.kind === 'quiz' && !current.answered && /^[1-4]$/.test(e.key)) { choose(Number(e.key) - 1); e.preventDefault(); return; }
  if ((e.key === 'Enter' || e.key === ' ') && $('nextBtn')) { advance(); e.preventDefault(); }
});
if ('speechSynthesis' in window) speechSynthesis.getVoices();

render();
