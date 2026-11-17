'use strict';

// ---------------------------------------------------------------------------
// Læringsmodel
//
// Hvert ord/sætning (pr. sprogpar, emne og retning) har et niveau L. Intervallet til
// næste gentagelse er base^L – både i antal opgaver og i tid:
//
//   opgave-interval = taskUnit    * base^L      (fx 1, 2, 4, 8 ... opgaver)
//   tids-interval   = timeUnitMin * base^L      (fx 10 min, 20 min, 40 min ...)
//
//   forfald = opgaver siden sidst / opgave-interval + tid siden sidst / tids-interval
//
// Ordet er klar til gentagelse, når forfald >= 1. Det mest forfaldne vises først.
// Er intet forfaldent, kommer næste nye ord på listen.
//
// Rigtigt svar: L + 1. Forkert svar: L - 1 (dog mindst 0).
// Scoren er antal ord, hvor sidste svar var rigtigt og L >= learnedLevel.
//
// Hurtig start for dem, der allerede kan noget:
//  - Nye ord vises først som en opgave ("kender du det?") med en "Ved ikke"-knap.
//    Svarer man rigtigt, starter ordet på knownStartLevel i stedet for 0.
//  - Niveautest: blokke af ord længere og længere nede ad listen. Klarer man en blok,
//    regnes alle ord før den som kendte (placedLevel) og kommer spredt forbi til kontrol.
//  - Ord, der er sprunget over, er "til kontrol": svarer man forkert første gang de
//    kommer igen, starter de forfra (L = 0) i stedet for blot L - 1.
// ---------------------------------------------------------------------------
const CONFIG = {
  base: 2,
  taskUnit: 1,
  timeUnitMin: 10,
  learnedLevel: 2,
  knownStartLevel: 3,
  placedLevel: 4,
  buildFromLevel: 2,
};
const PLACEMENT_BOUNDS = [10, 25, 50, 100, 175, 275, 400, 600];
const STORE = 'topwords.v2';
const TOP = 'top';

const UI = {
  da: {
    lang: { da: 'Dansk', en: 'Engelsk', ru: 'Russisk', uk: 'Ukrainsk' },
    title: 'Lær de ord du har brug for',
    lead: 'Ét ord ad gangen. Din score er hvor mange ord du kan.',
    learnQ: 'Hvilket sprog vil du lære?',
    baseQ: 'Hvilket sprog forstår du bedst?',
    nativeB: 'Det er mit modersmål',
    nativeS: 'Lær at læse – med billeder',
    otherS: 'Vis oversættelser',
    whatQ: 'Hvad vil du lære?',
    topB: 'De mest brugte ord', topS: 'I rækkefølge efter hvor meget de bruges',
    catsQ: 'Emner',
    modeQ: 'Hvad vil du øve?',
    recB: 'Forstå', recS: 'Se {T}, vælg {B}',
    prodB: 'Sig det selv', prodS: 'Se {B}, find og byg det på {T}',
    recNB: 'Find billedet', recNS: 'Se ordet, vælg billedet',
    prodNB: 'Læs ordet', prodNS: 'Se billedet, vælg og stav ordet',
    diffQ: 'Sværhedsgrad',
    diff: ['', 'Let', 'Mellem', 'Svær'],
    packDiff: ['', 'Det vigtigste', 'Vigtigt', 'Alt'],
    nWords: '{n} ord',
    start: 'Start',
    sound: 'Læs højt',
    learned: 'ord lært',
    learnedPack: 'lært',
    newWord: 'Nyt ord',
    newQ: 'Nyt – kender du det?',
    repeat: 'Gentagelse',
    check: 'Kontrol',
    next: 'Videre',
    correct: 'Rigtigt!',
    wrong: 'Ikke helt – det rigtige svar er grønt',
    wrongBuild: 'Ikke helt. Rigtigt svar:',
    dontKnow: 'Ved ikke – vis mig',
    qRec: 'Hvad betyder ordet?',
    qProd: 'Hvad hedder det på {T}?',
    qRecP: 'Hvad betyder det?',
    qProdP: 'Hvordan siger man det på {T}?',
    qRecN: 'Hvilket billede passer til ordet?',
    qProdN: 'Hvilket ord passer til billedet?',
    qBuild: 'Byg det på {T}',
    qSpell: 'Stav det på {T}',
    checkBtn: 'Tjek',
    rank: 'Nr. {n} på listen',
    seen: '{n} mødt',
    due: '{n} klar til gentagelse',
    empty: 'Der er intet, der passer til de valgte indstillinger.',
    stats: 'Statistik',
    back: 'Tilbage',
    reset: 'Nulstil fremskridt',
    resetQ: 'Nulstil al fremskridt for denne kombination?',
    cols: ['#', 'Ord', 'Pr. mio.', 'Betydning', 'Niveau', 'Interval', 'Status', 'Forfald'],
    learnedS: 'lært', notYet: 'ikke endnu', wrongS: 'svaret forkert', checkS: 'til kontrol',
    tasks: 'opg.',
    noStats: 'Du har ikke mødt noget endnu.',
    explain:
      'Hvert ord har et niveau <code>L</code>. Næste gentagelse kommer efter <code>{tu}·{b}<sup>L</sup></code> opgaver ' +
      'og <code>{mu} min·{b}<sup>L</sup></code> – de to lægges sammen som <b>forfald</b>, og ordet er klar ved 100 %. ' +
      'Rigtigt svar: <code>L+1</code>. Forkert svar: <code>L−1</code>. Et ord tæller som lært fra niveau {ll}, hvis sidste svar var rigtigt.',
    placeTitle: 'Kan du allerede noget?',
    placeLead: 'Tag en kort test, så springer du over det, du allerede kan. Den tager et par minutter og bliver sværere og sværere.',
    placeStart: 'Tag testen',
    placeSkip: 'Start fra begyndelsen',
    placeBadge: 'Niveautest',
    placeDone: 'Du kan cirka de første {n} på listen.',
    placeDone2: 'Vi fortsætter derfra. Det du sprang over, dukker op en gang imellem som en hurtig kontrol.',
    placeNone: 'Vi starter fra begyndelsen – så lærer du det hele i den rigtige rækkefølge.',
    placeAgain: 'Test mit niveau',
  },
  en: {
    lang: { da: 'Danish', en: 'English', ru: 'Russian', uk: 'Ukrainian' },
    title: 'Learn the words you need',
    lead: 'One word at a time. Your score is how many words you know.',
    learnQ: 'Which language do you want to learn?',
    baseQ: 'Which language do you understand best?',
    nativeB: 'It is my first language',
    nativeS: 'Learn to read – with pictures',
    otherS: 'Show translations',
    whatQ: 'What do you want to learn?',
    topB: 'The most used words', topS: 'In order of how often they are used',
    catsQ: 'Topics',
    modeQ: 'What do you want to practise?',
    recB: 'Understand', recS: 'See {T}, pick {B}',
    prodB: 'Say it yourself', prodS: 'See {B}, find and build it in {T}',
    recNB: 'Find the picture', recNS: 'See the word, pick the picture',
    prodNB: 'Read the word', prodNS: 'See the picture, pick and spell the word',
    diffQ: 'Difficulty',
    diff: ['', 'Easy', 'Medium', 'Hard'],
    packDiff: ['', 'Essentials', 'Important', 'Everything'],
    nWords: '{n} words',
    start: 'Start',
    sound: 'Read aloud',
    learned: 'words learned',
    learnedPack: 'learned',
    newWord: 'New word',
    newQ: 'New – do you know it?',
    repeat: 'Review',
    check: 'Check',
    next: 'Continue',
    correct: 'Correct!',
    wrong: 'Not quite – the right answer is green',
    wrongBuild: 'Not quite. Correct answer:',
    dontKnow: "Don't know – show me",
    qRec: 'What does the word mean?',
    qProd: 'What is it in {T}?',
    qRecP: 'What does it mean?',
    qProdP: 'How do you say it in {T}?',
    qRecN: 'Which picture matches the word?',
    qProdN: 'Which word matches the picture?',
    qBuild: 'Build it in {T}',
    qSpell: 'Spell it in {T}',
    checkBtn: 'Check',
    rank: 'No. {n} on the list',
    seen: '{n} seen',
    due: '{n} ready for review',
    empty: 'Nothing matches the chosen settings.',
    stats: 'Statistics',
    back: 'Back',
    reset: 'Reset progress',
    resetQ: 'Reset all progress for this combination?',
    cols: ['#', 'Word', 'Per mil.', 'Meaning', 'Level', 'Interval', 'Status', 'Due'],
    learnedS: 'learned', notYet: 'not yet', wrongS: 'answered wrong', checkS: 'to be checked',
    tasks: 'tasks',
    noStats: 'You have not met anything yet.',
    explain:
      'Each word has a level <code>L</code>. The next review comes after <code>{tu}·{b}<sup>L</sup></code> tasks ' +
      'and <code>{mu} min·{b}<sup>L</sup></code> – the two are added up as <b>due</b>, and the word is ready at 100 %. ' +
      'Correct: <code>L+1</code>. Wrong: <code>L−1</code>. A word counts as learned from level {ll} if the last answer was correct.',
    placeTitle: 'Do you already know some?',
    placeLead: 'Take a short test and skip what you already know. It takes a few minutes and gets harder as you go.',
    placeStart: 'Take the test',
    placeSkip: 'Start from the beginning',
    placeBadge: 'Level test',
    placeDone: 'You know roughly the first {n} on the list.',
    placeDone2: 'We continue from there. What you skipped will come up now and then as a quick check.',
    placeNone: 'We start from the beginning – so you learn everything in the right order.',
    placeAgain: 'Test my level',
  },
  ru: {
    lang: { da: 'Датский', en: 'Английский', ru: 'Русский', uk: 'Украинский' },
    title: 'Учите нужные вам слова',
    lead: 'По одному слову за раз. Ваш счёт — сколько слов вы знаете.',
    learnQ: 'Какой язык вы хотите учить?',
    baseQ: 'Какой язык вы понимаете лучше всего?',
    nativeB: 'Это мой родной язык',
    nativeS: 'Учимся читать – с картинками',
    otherS: 'Показывать перевод',
    whatQ: 'Что вы хотите выучить?',
    topB: 'Самые частые слова', topS: 'В порядке частоты употребления',
    catsQ: 'Темы',
    modeQ: 'Что будем тренировать?',
    recB: 'Понимать', recS: 'Видите {T}, выбираете {B}',
    prodB: 'Сказать самому', prodS: 'Видите {B}, находите и собираете на языке: {T}',
    recNB: 'Найти картинку', recNS: 'Видите слово, выбираете картинку',
    prodNB: 'Прочитать слово', prodNS: 'Видите картинку, выбираете и пишете слово',
    diffQ: 'Сложность',
    diff: ['', 'Лёгкая', 'Средняя', 'Сложная'],
    packDiff: ['', 'Самое важное', 'Важное', 'Всё'],
    nWords: 'слов: {n}',
    start: 'Начать',
    sound: 'Читать вслух',
    learned: 'слов выучено',
    learnedPack: 'выучено',
    newWord: 'Новое слово',
    newQ: 'Новое – вы это знаете?',
    repeat: 'Повторение',
    check: 'Проверка',
    next: 'Дальше',
    correct: 'Правильно!',
    wrong: 'Не совсем – правильный ответ зелёный',
    wrongBuild: 'Не совсем. Правильный ответ:',
    dontKnow: 'Не знаю – покажите',
    qRec: 'Что означает это слово?',
    qProd: 'Как это будет на языке: {T}?',
    qRecP: 'Что это значит?',
    qProdP: 'Как это сказать на языке: {T}?',
    qRecN: 'Какая картинка подходит к слову?',
    qProdN: 'Какое слово подходит к картинке?',
    qBuild: 'Соберите на языке: {T}',
    qSpell: 'Напишите на языке: {T}',
    checkBtn: 'Проверить',
    rank: '№ {n} в списке',
    seen: 'встречено: {n}',
    due: 'к повторению: {n}',
    empty: 'Нет ничего для выбранных настроек.',
    stats: 'Статистика',
    back: 'Назад',
    reset: 'Сбросить прогресс',
    resetQ: 'Сбросить весь прогресс для этой комбинации?',
    cols: ['№', 'Слово', 'На млн', 'Значение', 'Уровень', 'Интервал', 'Статус', 'Срок'],
    learnedS: 'выучено', notYet: 'ещё нет', wrongS: 'ошибка', checkS: 'на проверке',
    tasks: 'зад.',
    noStats: 'Вы ещё ничего не встретили.',
    explain:
      'У каждого слова есть уровень <code>L</code>. Следующее повторение — через <code>{tu}·{b}<sup>L</sup></code> заданий ' +
      'и <code>{mu} мин·{b}<sup>L</sup></code>; оба значения складываются в <b>срок</b>, и слово готово к повторению при 100 %. ' +
      'Верно: <code>L+1</code>. Неверно: <code>L−1</code>. Слово считается выученным с уровня {ll}, если последний ответ был верным.',
    placeTitle: 'Вы уже что-то знаете?',
    placeLead: 'Пройдите короткий тест и пропустите то, что уже знаете. Это займёт пару минут, задания постепенно усложняются.',
    placeStart: 'Пройти тест',
    placeSkip: 'Начать с начала',
    placeBadge: 'Тест уровня',
    placeDone: 'Вы знаете примерно первые {n} в списке.',
    placeDone2: 'Продолжим оттуда. Пропущенное будет иногда появляться для быстрой проверки.',
    placeNone: 'Начнём с начала – так вы выучите всё в правильном порядке.',
    placeAgain: 'Проверить мой уровень',
  },
  uk: {
    lang: { da: 'Данська', en: 'Англійська', ru: 'Російська', uk: 'Українська' },
    title: 'Вивчайте потрібні вам слова',
    lead: 'По одному слову за раз. Ваш рахунок — скільки слів ви знаєте.',
    learnQ: 'Яку мову ви хочете вивчати?',
    baseQ: 'Яку мову ви розумієте найкраще?',
    nativeB: 'Це моя рідна мова',
    nativeS: 'Вчимося читати – з картинками',
    otherS: 'Показувати переклад',
    whatQ: 'Що ви хочете вивчити?',
    topB: 'Найуживаніші слова', topS: 'У порядку частоти вживання',
    catsQ: 'Теми',
    modeQ: 'Що будемо тренувати?',
    recB: 'Розуміти', recS: 'Бачите {T}, обираєте {B}',
    prodB: 'Сказати самому', prodS: 'Бачите {B}, знаходите і складаєте мовою: {T}',
    recNB: 'Знайти картинку', recNS: 'Бачите слово, обираєте картинку',
    prodNB: 'Прочитати слово', prodNS: 'Бачите картинку, обираєте і пишете слово',
    diffQ: 'Складність',
    diff: ['', 'Легка', 'Середня', 'Складна'],
    packDiff: ['', 'Найважливіше', 'Важливе', 'Усе'],
    nWords: 'слів: {n}',
    start: 'Почати',
    sound: 'Читати вголос',
    learned: 'слів вивчено',
    learnedPack: 'вивчено',
    newWord: 'Нове слово',
    newQ: 'Нове – ви це знаєте?',
    repeat: 'Повторення',
    check: 'Перевірка',
    next: 'Далі',
    correct: 'Правильно!',
    wrong: 'Не зовсім – правильна відповідь зелена',
    wrongBuild: 'Не зовсім. Правильна відповідь:',
    dontKnow: 'Не знаю – покажіть',
    qRec: 'Що означає це слово?',
    qProd: 'Як це буде мовою: {T}?',
    qRecP: 'Що це означає?',
    qProdP: 'Як це сказати мовою: {T}?',
    qRecN: 'Яка картинка підходить до слова?',
    qProdN: 'Яке слово підходить до картинки?',
    qBuild: 'Складіть мовою: {T}',
    qSpell: 'Напишіть мовою: {T}',
    checkBtn: 'Перевірити',
    rank: '№ {n} у списку',
    seen: 'зустрінуто: {n}',
    due: 'до повторення: {n}',
    empty: 'Немає нічого для вибраних налаштувань.',
    stats: 'Статистика',
    back: 'Назад',
    reset: 'Скинути прогрес',
    resetQ: 'Скинути весь прогрес для цієї комбінації?',
    cols: ['№', 'Слово', 'На млн', 'Значення', 'Рівень', 'Інтервал', 'Статус', 'Строк'],
    learnedS: 'вивчено', notYet: 'ще ні', wrongS: 'помилка', checkS: 'на перевірці',
    tasks: 'завд.',
    noStats: 'Ви ще нічого не зустріли.',
    explain:
      'Кожне слово має рівень <code>L</code>. Наступне повторення — через <code>{tu}·{b}<sup>L</sup></code> завдань ' +
      'і <code>{mu} хв·{b}<sup>L</sup></code>; обидва значення додаються в <b>строк</b>, і слово готове до повторення при 100 %. ' +
      'Правильно: <code>L+1</code>. Неправильно: <code>L−1</code>. Слово вважається вивченим з рівня {ll}, якщо остання відповідь була правильною.',
    placeTitle: 'Ви вже щось знаєте?',
    placeLead: 'Пройдіть короткий тест і пропустіть те, що вже знаєте. Це займе кілька хвилин, завдання поступово ускладнюються.',
    placeStart: 'Пройти тест',
    placeSkip: 'Почати з початку',
    placeBadge: 'Тест рівня',
    placeDone: 'Ви знаєте приблизно перші {n} у списку.',
    placeDone2: 'Продовжимо звідти. Пропущене іноді з’являтиметься для швидкої перевірки.',
    placeNone: 'Почнемо з початку – так ви вивчите все в правильному порядку.',
    placeAgain: 'Перевірити мій рівень',
  },
};

// ---------- Data ----------
// Alle læringsenheder (ord fra hyppighedslisten + ord/sætninger fra branchepakker) slås op i ITEM.
const ITEM = {};
const PACK_ITEMS = {};
const PACK_LIST = typeof PACKS !== 'undefined' ? Object.values(PACKS) : [];
for (const c of CONCEPTS) ITEM[c.id] = { ...c, phrase: false };
for (const p of PACK_LIST) {
  const byCat = p.categories.map((cat) => cat.rows.map(([prio, da, en, ru, uk, emoji]) => ({
    id: `${p.id}:${da}`, words: { da, en, ru, uk }, emoji, pos: cat.key, cat: cat.key, diff: prio, phrase: cat.type === 'phrase',
  })));
  // Prioritet 1 først, på skift mellem kategorierne, derefter prioritet 2 osv.
  const ordered = [];
  for (const prio of [1, 2, 3]) {
    const queues = byCat.map((items) => items.filter((x) => x.diff === prio));
    while (queues.some((q) => q.length)) for (const q of queues) if (q.length) ordered.push(q.shift());
  }
  ordered.forEach((x) => (ITEM[x.id] = x));
  PACK_ITEMS[p.id] = ordered;
}
const isPack = (s) => !!s.pack && s.pack !== TOP;
const packOf = (s) => PACK_LIST.find((p) => p.id === s.pack);

// ---------- State ----------
const state = loadState();
let view = state.settings ? 'play' : 'setup';
let draft = null;
let current = null;
let timer = null;
let placement = null;

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
const norm = (s) => s.toLowerCase().replace(/[.,!?;:«»"“”]/g, '').replace(/\s+/g, ' ').trim();

// ---------- Model ----------
function buildPool(s) {
  const native = s.base === s.target;
  if (isPack(s)) {
    return (PACK_ITEMS[s.pack] || []).filter((x) => x.diff <= s.diff && x.words[s.target] && x.words[s.base]
      && (!s.cats || s.cats.includes(x.cat)));
  }
  return ORDER[s.target].map((id) => ITEM[id])
    .filter((c) => c.diff <= s.diff && c.words[s.target] && (native ? c.emoji : c.words[s.base]));
}
function progKey(s) {
  return isPack(s) ? `${s.pack}|${s.target}|${s.base}|${s.dir}` : `${s.target}|${s.base}|${s.dir}`;
}
function ctx() {
  const s = state.settings;
  const native = s.base === s.target;
  const key = progKey(s);
  const prog = (state.progress[key] = state.progress[key] || { task: 0, cards: {}, lastId: null });
  return { s, native, key, prog, pool: buildPool(s) };
}
const intervalFactor = (lvl) => Math.pow(CONFIG.base, lvl);
function dueness(card, prog, now) {
  const f = intervalFactor(card.lvl);
  return (prog.task - card.task) / (CONFIG.taskUnit * f) + (now - card.time) / (CONFIG.timeUnitMin * 60000 * f);
}
function isLearned(card) { return card.ok && card.lvl >= CONFIG.learnedLevel; }
function scoreOf(prog) { return Object.keys(prog.cards).filter((id) => ITEM[id] && isLearned(prog.cards[id])).length; }
function rankOf(s, id) {
  const list = isPack(s) ? PACK_ITEMS[s.pack].map((x) => x.id) : ORDER[s.target];
  return list.indexOf(id) + 1;
}

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
  const review = (x) => {
    const card = c.prog.cards[x.id];
    const useBuild = c.s.dir === 'prod' && !card.verify && card.lvl >= CONFIG.buildFromLevel && buildSpec(c, x);
    return { kind: useBuild ? 'build' : 'quiz', concept: x };
  };
  if (best && bestP >= 1) return review(best);
  const fresh = c.pool.find((x) => !c.prog.cards[x.id]);
  if (fresh) return { kind: c.native ? 'intro' : 'new', concept: fresh };
  return best ? review(best) : null;
}

function newCard(c, lvl, ok, extra) {
  return { lvl, ok, right: ok ? 1 : 0, wrong: ok ? 0 : 1, task: c.prog.task, time: Date.now(), ...extra };
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
  // Synonymer (fx "mug" og "skimmel") må ikke optræde som forkerte svar for hinanden.
  const sameMeaning = (x) => ['base', 'target'].some((k) => x.words[c.s[k]].toLowerCase() === concept.words[c.s[k]].toLowerCase());
  const cand = c.pool.filter((x) => x.id !== concept.id && x.phrase === concept.phrase && !sameMeaning(x));
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
function makeOptions(c, x) { return shuffle([x, ...pickDistractors(c, x)]); }

// ----- Byg / stav -----
// Sætninger bygges af ordbrikker, enkeltord staves med bogstavbrikker.
// Danske ord med "en/et/at" foran: kun selve ordet skal staves.
function buildSpec(c, x) {
  const full = x.words[c.s.target];
  let prefix = '';
  let rest = full;
  if (!x.phrase && c.s.target === 'da') {
    const m = full.match(/^(en|et|at)\s+(.+)$/);
    if (m) { prefix = m[1]; rest = m[2]; }
  }
  const words = rest.split(/\s+/).filter(Boolean);
  if (x.phrase || words.length > 1) {
    const tokens = words.map((w) => w.replace(/[.,!?;:]+$/, '')).filter(Boolean);
    if (tokens.length < 2) return null;
    // Stort begyndelsesbogstav ville afsløre det første ord.
    if (x.phrase) tokens[0] = tokens[0].charAt(0).toLowerCase() + tokens[0].slice(1);
    return { mode: 'words', prefix, answer: tokens, sep: ' ' };
  }
  const letters = Array.from(rest);
  if (letters.length < 3 || letters.length > 14) return null;
  return { mode: 'letters', prefix, answer: letters, sep: '' };
}
function makeTiles(c, x, spec) {
  const extra = [];
  const inAnswer = new Set(spec.answer.map((a) => a.toLowerCase()));
  if (spec.mode === 'words') {
    const others = shuffle(c.pool.filter((o) => o.id !== x.id && o.phrase === x.phrase).slice(0, 80));
    for (const o of others) {
      for (const w of shuffle(o.words[c.s.target].split(/\s+/).slice(1))) {
        const tok = w.replace(/[.,!?;:]+$/, '');
        if (tok && !inAnswer.has(tok.toLowerCase()) && !extra.includes(tok)) { extra.push(tok); break; }
      }
      if (extra.length >= 2) break;
    }
  } else {
    const alphabet = Array.from(new Set(c.pool.slice(0, 60).flatMap((o) => Array.from(o.words[c.s.target].toLowerCase().replace(/[^\p{L}]/gu, '')))));
    for (const ch of shuffle(alphabet)) {
      if (!inAnswer.has(ch)) extra.push(ch);
      if (extra.length >= 2) break;
    }
  }
  return shuffle([...spec.answer, ...extra].map((tk, i) => ({ tk, i })));
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
function speakTarget(x) { speak(x.words[state.settings.target], state.settings.target); }

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
  else if (view === 'offer') renderOffer();
  else if (view === 'place') renderPlace();
  else if (view === 'placeDone') renderPlaceDone();
  else renderPlay();
}

function updateScore(delta) {
  const c = ctx();
  $('scoreNum').textContent = scoreOf(c.prog);
  $('scoreLabel').textContent = isPack(c.s) ? t('learnedPack') : t('learned');
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
  if (!draft) draft = state.settings ? { pack: TOP, ...state.settings } : { target: null, base: null, pack: TOP, dir: 'rec', diff: 1 };
  const d = draft;
  const ul = uiLang();
  const L = UI[ul].lang;
  const targets = Object.keys(ORDER);
  const choice = (attrs, pressed, title, sub) =>
    `<button class="choice" ${attrs} aria-pressed="${pressed}"><b>${title}</b>${sub ? `<small>${esc(sub)}</small>` : ''}</button>`;

  let html = `<section class="setup"><h1>${esc(t('title'))}</h1><p class="lead">${esc(t('lead'))}</p>`;

  html += `<div class="step"><h2>${esc(t('learnQ'))}</h2><div class="choices">`;
  for (const l of targets) html += choice(`data-target="${l}"`, d.target === l, esc(LANGS[l].name));
  html += `</div></div>`;

  if (d.target) {
    html += `<div class="step"><h2>${esc(t('baseQ'))}</h2><div class="choices">`;
    html += choice(`data-base="${d.target}"`, d.base === d.target, esc(L[d.target]), t('nativeB') + ' · ' + t('nativeS'));
    for (const l of Object.keys(LANGS).filter((l) => l !== d.target)) html += choice(`data-base="${l}"`, d.base === l, esc(L[l]), t('otherS'));
    html += `</div></div>`;
  }

  if (d.target && d.base) {
    const native = d.base === d.target;
    if (native) d.pack = TOP;
    if (!native && PACK_LIST.length) {
      html += `<div class="step"><h2>${esc(t('whatQ'))}</h2><div class="choices">`;
      html += choice(`data-pack="${TOP}"`, d.pack === TOP, `📈 ${esc(t('topB'))}`, t('topS'));
      for (const p of PACK_LIST) html += choice(`data-pack="${p.id}"`, d.pack === p.id, `${p.emoji} ${esc(p.name[ul])}`, p.desc[ul]);
      html += `</div></div>`;
    }
    const pack = isPack(d) ? packOf(d) : null;
    if (pack) {
      html += `<div class="step"><h2>${esc(t('catsQ'))}</h2><div class="chips">`;
      for (const cat of pack.categories) {
        const on = !d.cats || d.cats.includes(cat.key);
        const n = cat.rows.filter((r) => r[0] <= d.diff).length;
        html += `<button class="chip" data-cat="${cat.key}" aria-pressed="${on}">${cat.emoji} ${esc(cat.name[ul])} <small>${n}</small></button>`;
      }
      html += `</div></div>`;
    }

    const vars = { T: L[d.target].toLowerCase(), B: L[d.base].toLowerCase() };
    html += `<div class="step"><h2>${esc(t('modeQ'))}</h2><div class="choices">`;
    if (native) {
      html += choice(`data-dir="prod"`, d.dir === 'prod', esc(t('prodNB')), t('prodNS'));
      html += choice(`data-dir="rec"`, d.dir === 'rec', esc(t('recNB')), t('recNS'));
    } else {
      html += choice(`data-dir="rec"`, d.dir === 'rec', esc(t('recB')), t('recS', vars));
      html += choice(`data-dir="prod"`, d.dir === 'prod', esc(t('prodB')), t('prodS', vars));
    }
    html += `</div></div>`;

    html += `<div class="step"><h2>${esc(t('diffQ'))}</h2><div class="choices">`;
    for (const lvl of [1, 2, 3]) {
      const n = buildPool({ ...d, diff: lvl }).length;
      html += choice(`data-diff="${lvl}"`, d.diff === lvl, esc((pack ? t('packDiff') : t('diff'))[lvl]), pack ? String(n) : t('nWords', { n }));
    }
    html += `</div></div>`;

    html += `<div class="row">
      <button class="primary" id="startBtn" ${buildPool(d).length ? '' : 'disabled'}>${esc(t('start'))}</button>
      <label class="toggle"><input type="checkbox" id="soundChk" ${state.sound ? 'checked' : ''}> ${esc(t('sound'))}</label>
    </div>`;
  }
  html += `</section>`;
  $('app').innerHTML = html;

  const on = (sel, fn) => $('app').querySelectorAll(sel).forEach((b) => (b.onclick = () => { fn(b); render(); }));
  on('[data-target]', (b) => { if (d.target !== b.dataset.target) { d.target = b.dataset.target; d.base = null; } });
  on('[data-base]', (b) => { d.base = b.dataset.base; });
  on('[data-pack]', (b) => { d.pack = b.dataset.pack; d.cats = null; });
  on('[data-dir]', (b) => { d.dir = b.dataset.dir; });
  on('[data-diff]', (b) => { d.diff = Number(b.dataset.diff); });
  on('[data-cat]', (b) => {
    const all = packOf(d).categories.map((c) => c.key);
    const cur = new Set(d.cats || all);
    if (cur.has(b.dataset.cat)) cur.delete(b.dataset.cat); else cur.add(b.dataset.cat);
    d.cats = cur.size === all.length ? null : all.filter((k) => cur.has(k));
  });
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

// ----- Play -----
function renderPlay() {
  const c = ctx();
  // Første gang: tilbyd niveautest, så man ikke skal terpe det, man allerede kan.
  if (!current && !c.native && !c.prog.offered && !Object.keys(c.prog.cards).length && c.pool.length >= 30) {
    view = 'offer';
    renderOffer();
    return;
  }
  if (!current) {
    const next = pickNext(c);
    if (!next) { $('app').innerHTML = `<p class="task-q">${esc(t('empty'))}</p>`; return; }
    current = { ...next, answered: null };
    if (next.kind === 'quiz' || next.kind === 'new') current.options = makeOptions(c, next.concept);
    if (next.kind === 'build') {
      current.spec = buildSpec(c, next.concept);
      current.tiles = makeTiles(c, next.concept, current.spec);
      current.picked = [];
    }
    renderPlayView();
    if (next.kind === 'intro' || (c.s.dir === 'rec' && !c.native)) speakTarget(next.concept);
    return;
  }
  renderPlayView();
}

function meaningHTML(c, x) {
  if (c.native) return `<span class="emoji">${x.emoji}</span>`;
  const icon = x.emoji ? `<span class="emoji-sm">${x.emoji}</span>` : '';
  return `${icon}<span class="w${x.phrase ? ' long' : ''}">${esc(x.words[c.s.base])}</span>`;
}
const targetHTML = (c, x) => `<span class="w${x.phrase ? ' long' : ''}">${esc(x.words[c.s.target])}</span>`;

function questionText(c, x, kind) {
  const L = UI[uiLang()].lang;
  const T = L[c.s.target].toLowerCase();
  if (kind === 'build') return current.spec.mode === 'letters' ? t('qSpell', { T }) : t('qBuild', { T });
  const rec = c.s.dir === 'rec';
  if (c.native) return rec ? t('qRecN') : t('qProdN');
  if (x.phrase) return rec ? t('qRecP') : t('qProdP', { T });
  return rec ? t('qRec') : t('qProd', { T });
}

function metaHTML(c, x) {
  const now = Date.now();
  const introduced = c.pool.filter((p) => c.prog.cards[p.id]);
  const dueCount = introduced.filter((p) => dueness(c.prog.cards[p.id], c.prog, now) >= 1).length;
  const score = scoreOf(c.prog);
  return `<div class="meta"><span>${esc(t('rank', { n: rankOf(c.s, x.id) }))}</span>
    <span>${esc(t('seen', { n: introduced.length }))} · ${esc(t('due', { n: dueCount }))}</span></div>
    <div class="progress"><div style="width:${Math.min(100, (score / Math.max(1, c.pool.length)) * 100)}%"></div></div>`;
}

function optionsHTML(c, x, answered) {
  const rec = c.s.dir === 'rec';
  let html = `<div class="options${x.phrase ? ' wide' : ''}">`;
  current.options.forEach((o, i) => {
    let cls = 'opt';
    if (answered) {
      if (o.id === x.id) cls += ' good';
      else if (o.id === answered) cls += ' bad';
      else cls += ' dim';
    }
    html += `<button class="${cls}" data-i="${i}" ${answered ? 'disabled' : ''}>
      ${rec ? meaningHTML(c, o) : targetHTML(c, o)}
      <span class="key">${i + 1}</span></button>`;
  });
  return html + `</div>`;
}

function renderPlayView() {
  const c = ctx();
  const x = current.concept;
  const rec = c.s.dir === 'rec';
  const speakBtn = `<button class="speak" id="speakBtn" title="🔊">🔊</button>`;
  let html = metaHTML(c, x);

  if (current.kind === 'intro') {
    html += `<div class="prompt"><span class="badge">${esc(t('newWord'))}</span>${speakBtn}
      ${x.emoji ? `<span class="emoji">${x.emoji}</span>` : ''}
      ${targetHTML(c, x)}
      ${c.native ? '' : `<span class="sub">${esc(x.words[c.s.base])}</span>`}
    </div>
    <div class="feedback"><button class="primary" id="nextBtn">${esc(t('next'))} →</button></div>`;
  } else if (current.kind === 'build') {
    const sp = current.spec;
    const built = current.picked.map((i) => current.tiles[i].tk);
    html +=`<div class="prompt"><span class="badge">${esc(t('repeat'))}</span>
      ${x.emoji ? `<span class="emoji-sm">${x.emoji}</span>` : ''}<span class="w${x.phrase ? ' long' : ''}">${esc(c.native ? '' : x.words[c.s.base])}</span>
    </div>
    <p class="task-q">${esc(questionText(c, x, 'build'))}</p>
    <div class="build ${current.answered ? (current.answered === 'ok' ? 'good' : 'bad') : ''}">
      ${sp.prefix ? `<span class="prefix">${esc(sp.prefix)}</span>` : ''}
      <span class="built ${sp.mode}">${built.map((tk, k) => `<button class="tile in" data-k="${k}" ${current.answered ? 'disabled' : ''}>${esc(tk)}</button>`).join('')}</span>
    </div>
    <div class="tiles ${sp.mode}">${current.tiles.map((tl, i) => `<button class="tile" data-i="${i}" ${current.picked.includes(i) || current.answered ? 'disabled' : ''}>${esc(tl.tk)}</button>`).join('')}</div>
    <div class="feedback">`;
    if (current.answered) {
      const ok = current.answered === 'ok';
      html += ok ? `<div class="msg good">${esc(t('correct'))}</div>`
        : `<div class="msg bad">${esc(t('wrongBuild'))} <b>${esc(x.words[c.s.target])}</b></div><button class="primary" id="nextBtn">${esc(t('next'))} →</button>`;
    } else {
      html += `<div class="row center"><button class="secondary" id="dkBtn">${esc(t('dontKnow'))}</button>
        <button class="primary" id="checkBtn" ${current.picked.length ? '' : 'disabled'}>${esc(t('checkBtn'))}</button></div>`;
    }
    html += `</div>`;
  } else {
    const card = c.prog.cards[x.id];
    const badge = current.kind === 'new' ? t('newQ') : card && card.verify ? t('check') : t('repeat');
    html += `<div class="prompt"><span class="badge">${esc(badge)}</span>${speakBtn}
      ${rec ? targetHTML(c, x) : meaningHTML(c, x)}
    </div>
    <p class="task-q">${esc(questionText(c, x, current.kind))}</p>
    ${optionsHTML(c, x, current.answered)}
    <div class="feedback">`;
    if (current.answered) {
      const ok = current.answered === x.id;
      html += `<div class="msg ${ok ? 'good' : 'bad'}">${esc(ok ? t('correct') : t('wrong'))}</div>`;
      if (!ok) html += `<button class="primary" id="nextBtn">${esc(t('next'))} →</button>`;
    } else if (current.kind === 'new') {
      html += `<button class="secondary" id="dkBtn">${esc(t('dontKnow'))}</button>`;
    }
    html += `</div>`;
  }
  $('app').innerHTML = html;

  const sb = $('speakBtn');
  if (sb) sb.onclick = () => speakTarget(x);
  const nextBtn = $('nextBtn');
  if (nextBtn) nextBtn.onclick = advance;
  const dk = $('dkBtn');
  if (dk) dk.onclick = dontKnow;
  const cb = $('checkBtn');
  if (cb) cb.onclick = checkBuild;
  $('app').querySelectorAll('.opt').forEach((b) => (b.onclick = () => choose(Number(b.dataset.i))));
  $('app').querySelectorAll('.tiles .tile').forEach((b) => (b.onclick = () => { current.picked.push(Number(b.dataset.i)); renderPlayView(); }));
  $('app').querySelectorAll('.built .tile').forEach((b) => (b.onclick = () => { current.picked.splice(Number(b.dataset.k), 1); renderPlayView(); }));
}

// Registrér et svar på en kendt kortet og opdatér niveau.
function grade(c, x, correct) {
  const card = c.prog.cards[x.id];
  if (card.verify) {
    card.lvl = correct ? card.lvl + 1 : 0;
    card.verify = false;
  } else {
    card.lvl = correct ? card.lvl + 1 : Math.max(0, card.lvl - 1);
  }
  card.ok = correct;
  card[correct ? 'right' : 'wrong'] += 1;
  card.task = c.prog.task;
  card.time = Date.now();
}
function finishTask(c, x, before) {
  c.prog.task += 1;
  c.prog.lastId = x.id;
  saveState();
  renderPlayView();
  updateScore(scoreOf(c.prog) - before);
  speakTarget(x);
}

function choose(i) {
  if (!current || current.answered) return;
  if (view === 'place') { choosePlace(i); return; }
  if (current.kind !== 'quiz' && current.kind !== 'new') return;
  const c = ctx();
  const x = current.concept;
  const correct = current.options[i].id === x.id;
  const before = scoreOf(c.prog);
  if (current.kind === 'new') {
    // Kendte man ordet uden at have set det, springes de første trin over.
    c.prog.cards[x.id] = correct
      ? newCard(c, CONFIG.knownStartLevel, true, { verify: true })
      : newCard(c, 0, false);
  } else {
    grade(c, x, correct);
  }
  current.answered = current.options[i].id;
  finishTask(c, x, before);
  if (correct) timer = setTimeout(advance, 1100);
}

function dontKnow() {
  if (!current || current.answered) return;
  const c = ctx();
  const x = current.concept;
  if (current.kind === 'new') {
    current = { kind: 'intro', concept: x, answered: null };
    renderPlayView();
    speakTarget(x);
    return;
  }
  if (current.kind === 'build') {
    const before = scoreOf(c.prog);
    grade(c, x, false);
    current.answered = 'bad';
    finishTask(c, x, before);
  }
}

function checkBuild() {
  if (!current || current.kind !== 'build' || current.answered) return;
  const c = ctx();
  const x = current.concept;
  const sp = current.spec;
  const built = current.picked.map((i) => current.tiles[i].tk).join(sp.sep);
  const correct = norm(built) === norm(sp.answer.join(sp.sep));
  const before = scoreOf(c.prog);
  grade(c, x, correct);
  current.answered = correct ? 'ok' : 'bad';
  finishTask(c, x, before);
  if (correct) timer = setTimeout(advance, 1300);
}

function advance() {
  clearTimeout(timer);
  if (view === 'place') { advancePlace(); return; }
  if (current && current.kind === 'intro') {
    const c = ctx();
    c.prog.cards[current.concept.id] = newCard(c, 0, false, { wrong: 0 });
    c.prog.task += 1;
    c.prog.lastId = current.concept.id;
    saveState();
  }
  current = null;
  renderPlay();
}

// ----- Niveautest -----
function renderOffer() {
  const c = ctx();
  c.prog.offered = true;
  saveState();
  $('app').innerHTML = `<section class="offer">
    <div class="prompt"><span class="emoji">🚀</span><span class="w long">${esc(t('placeTitle'))}</span>
      <span class="sub">${esc(t('placeLead'))}</span></div>
    <div class="row center">
      <button class="secondary" id="skipBtn">${esc(t('placeSkip'))}</button>
      <button class="primary" id="placeBtn">${esc(t('placeStart'))}</button>
    </div></section>`;
  $('skipBtn').onclick = () => { view = 'play'; current = null; render(); };
  $('placeBtn').onclick = startPlacement;
}

function startPlacement() {
  const c = ctx();
  c.prog.offered = true;
  saveState();
  const bounds = [...new Set(PLACEMENT_BOUNDS.map((b) => Math.min(b, c.pool.length)))];
  placement = { key: c.key, bounds, block: 0, passedEnd: 0, right: [], wrong: [], asked: 0, total: 0 };
  nextPlacementBlock();
}
function nextPlacementBlock() {
  const c = ctx();
  const P = placement;
  while (P.block < P.bounds.length) {
    const from = P.block ? P.bounds[P.block - 1] : 0;
    const to = P.bounds[P.block];
    const cand = c.pool.slice(from, to).filter((x) => !c.prog.cards[x.id]);
    if (!cand.length) { P.passedEnd = to; P.block++; continue; }
    P.queue = shuffle(cand).slice(0, 4);
    P.blockSize = P.queue.length;
    P.blockRight = 0;
    current = null;
    view = 'place';
    render();
    return;
  }
  finishPlacement();
}
function renderPlace() {
  const c = ctx();
  const P = placement;
  if (!P || P.key !== c.key) { view = 'play'; render(); return; }
  if (!current) {
    const x = P.queue.shift();
    current = { kind: 'place', concept: x, options: makeOptions(c, x), answered: null };
    P.total++;
  }
  const x = current.concept;
  const rec = c.s.dir === 'rec';
  let html = `<div class="meta"><span>${esc(t('placeBadge'))}</span><span>${esc(t('rank', { n: rankOf(c.s, x.id) }))}</span></div>
    <div class="progress"><div style="width:${Math.min(100, ((P.block + 1) / P.bounds.length) * 100)}%"></div></div>
    <div class="prompt"><span class="badge">${esc(t('placeBadge'))}</span>
      ${rec ? targetHTML(c, x) : meaningHTML(c, x)}</div>
    <p class="task-q">${esc(questionText(c, x, 'quiz'))}</p>
    ${optionsHTML(c, x, current.answered)}
    <div class="feedback">${current.answered ? '' : `<button class="secondary" id="dkBtn">${esc(t('dontKnow'))}</button>`}</div>`;
  $('app').innerHTML = html;
  $('app').querySelectorAll('.opt').forEach((b) => (b.onclick = () => choose(Number(b.dataset.i))));
  const dk = $('dkBtn');
  if (dk) dk.onclick = () => { if (!current.answered) { current.answered = '-'; placementAnswer(false); } };
}
function choosePlace(i) {
  const correct = current.options[i].id === current.concept.id;
  current.answered = current.options[i].id;
  renderPlace();
  placementAnswer(correct);
}
function placementAnswer(correct) {
  const P = placement;
  (correct ? P.right : P.wrong).push(current.concept.id);
  if (correct) P.blockRight++;
  timer = setTimeout(advancePlace, correct ? 450 : 900);
}
function advancePlace() {
  clearTimeout(timer);
  const P = placement;
  current = null;
  if (P.queue.length) { renderPlace(); return; }
  // Blokken er bestået ved mindst 3 af 4 rigtige.
  if (P.blockRight >= Math.ceil(P.blockSize * 0.75)) {
    P.passedEnd = P.bounds[P.block];
    P.block++;
    nextPlacementBlock();
  } else {
    finishPlacement();
  }
}
function finishPlacement() {
  const c = ctx();
  const P = placement;
  const now = Date.now();
  for (const id of P.right) {
    if (!c.prog.cards[id]) c.prog.cards[id] = newCard(c, CONFIG.knownStartLevel, true, { verify: true });
  }
  // Alt før den sidst beståede blok regnes som kendt og spredes ud til kontrol.
  let j = 0;
  for (const x of c.pool.slice(0, P.passedEnd)) {
    if (c.prog.cards[x.id] || P.wrong.includes(x.id)) continue;
    c.prog.cards[x.id] = {
      lvl: CONFIG.placedLevel, ok: true, verify: true, right: 0, wrong: 0,
      task: c.prog.task + j * 3, time: now + j * 8 * 60000,
    };
    j++;
  }
  saveState();
  P.done = P.passedEnd;
  view = 'placeDone';
  current = null;
  render();
}
function renderPlaceDone() {
  const n = placement ? placement.done : 0;
  $('app').innerHTML = `<section class="offer"><div class="prompt"><span class="emoji">${n ? '🎉' : '🌱'}</span>
    <span class="w long">${esc(n ? t('placeDone', { n }) : t('placeNone'))}</span>
    ${n ? `<span class="sub">${esc(t('placeDone2'))}</span>` : ''}</div>
    <div class="row center"><button class="primary" id="goBtn">${esc(t('next'))} →</button></div></section>`;
  $('goBtn').onclick = () => { placement = null; view = 'play'; current = null; render(); };
}

// ----- Stats -----
function fmtDuration(min) {
  const ul = uiLang();
  const dec = ul === 'en' ? '.' : ',';
  const H = { da: 't', en: 'h', ru: 'ч', uk: 'год' }[ul];
  const D = { da: 'd', en: 'd', ru: 'дн', uk: 'дн' }[ul];
  if (min < 60) return `${Math.round(min)} min`;
  if (min < 60 * 24) return `${(min / 60).toFixed(min < 600 ? 1 : 0).replace('.', dec)} ${H}`;
  return `${(min / 1440).toFixed(min < 14400 ? 1 : 0).replace('.', dec)} ${D}`;
}

function renderStats() {
  const c = ctx();
  const now = Date.now();
  const ids = Object.keys(c.prog.cards).filter((id) => ITEM[id] && c.pool.some((p) => p.id === id))
    .sort((a, b) => rankOf(c.s, a) - rankOf(c.s, b));
  const cols = t('cols');
  let html = `<section class="stats"><div class="row" style="justify-content:space-between">
      <h1>${esc(t('stats'))}</h1><button class="secondary" id="backBtn">← ${esc(t('back'))}</button></div>
    <div class="explain">${fill(t('explain'), { tu: CONFIG.taskUnit, b: CONFIG.base, mu: CONFIG.timeUnitMin, ll: CONFIG.learnedLevel })}</div>`;

  if (!ids.length) {
    html += `<p class="task-q">${esc(t('noStats'))}</p>`;
  } else {
    html += `<div class="table-wrap"><table><thead><tr>${cols.map((h) => `<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>`;
    for (const id of ids) {
      const x = ITEM[id];
      const card = c.prog.cards[id];
      const f = intervalFactor(card.lvl);
      const p = dueness(card, c.prog, now);
      const status = card.verify ? `<span class="dot"></span>${esc(t('checkS'))}`
        : isLearned(card) ? `<span class="dot ok"></span>${esc(t('learnedS'))}`
        : card.wrong && !card.ok ? `<span class="dot no"></span>${esc(t('wrongS'))}`
        : `<span class="dot"></span>${esc(t('notYet'))}`;
      const meaning = c.native ? x.emoji : `${x.emoji ? x.emoji + ' ' : ''}${esc(x.words[c.s.base])}`;
      const ipm = !isPack(c.s) && IPM[c.s.target] ? (IPM[c.s.target][id] || 0).toLocaleString(uiLang()) : '–';
      html += `<tr>
        <td class="num">${rankOf(c.s, id)}</td>
        <td class="wrap"><b>${esc(x.words[c.s.target])}</b></td>
        <td class="num">${ipm}</td>
        <td class="wrap">${meaning}</td>
        <td class="num">${card.lvl}</td>
        <td class="num">${CONFIG.taskUnit * f} ${esc(t('tasks'))} · ${fmtDuration(CONFIG.timeUnitMin * f)}</td>
        <td>${status}</td>
        <td class="num"><span class="bar ${p >= 1 ? 'due' : ''}"><div style="width:${Math.max(0, Math.min(100, p * 100))}%"></div></span> ${Math.max(0, Math.round(p * 100))} %</td>
      </tr>`;
    }
    html += `</tbody></table></div>`;
  }
  html += `<p class="row" style="margin-top:20px">
    ${c.native ? '' : `<button class="secondary" id="placeAgainBtn">🚀 ${esc(t('placeAgain'))}</button>`}
    <button class="secondary" id="resetBtn">${esc(t('reset'))}</button></p></section>`;
  $('app').innerHTML = html;

  $('backBtn').onclick = () => { view = 'play'; render(); };
  const pa = $('placeAgainBtn');
  if (pa) pa.onclick = startPlacement;
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
  if ((view !== 'play' && view !== 'place') || !current || e.ctrlKey || e.metaKey || e.altKey) return;
  if (current.options && !current.answered && /^[1-4]$/.test(e.key)) { choose(Number(e.key) - 1); e.preventDefault(); return; }
  if (e.key === 'Enter' || e.key === ' ') {
    if ($('nextBtn')) { advance(); e.preventDefault(); } else if ($('checkBtn') && !$('checkBtn').disabled) { checkBuild(); e.preventDefault(); }
  }
  if (e.key === 'Backspace' && current.kind === 'build' && !current.answered && current.picked.length) {
    current.picked.pop();
    renderPlayView();
    e.preventDefault();
  }
});
if ('speechSynthesis' in window) speechSynthesis.getVoices();

render();
