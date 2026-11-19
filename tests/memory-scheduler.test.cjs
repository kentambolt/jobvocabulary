const test = require('node:test');
const assert = require('node:assert/strict');
const M = require('../memory-scheduler');
const Flow = require('../learning-flow');
const app = require('./helpers/app.cjs');
const { seeded, START, learned, run } = require('../data/simulate-learning.cjs');

function history(pattern, days = [0, 1, 3, 8, 20, 60, 120], word = { diff: 1 }) {
  const card = { lvl: 3, ok: true, right: 0, wrong: 0, time: START, task: 0 };
  pattern.forEach((correct, index) => {
    card.ok = !!correct; card[correct ? 'right' : 'wrong']++;
    M.review(card, !!correct, START + days[index] * M.DAY, { learned: !!correct, word, rng: () => 0.5 });
  });
  return card;
}

test('FSRS separates 7/7 recall from 3/7 and failed recall, and values recall over real time', () => {
  const strong = history([1,1,1,1,1,1,1]);
  const weak = history([0,0,1,0,1,0,1]);
  const failed = history([0,0,0,0,0,0,0]);
  const crammed = history([1,1,1,1,1,1,1], [0,1,2,3,4,5,6].map(min => min / 1440));
  assert.ok(strong.memory.due - strong.memory.last > 30 * M.DAY);
  assert.ok(strong.memory.s > weak.memory.s * 5);
  assert.ok(strong.memory.s > crammed.memory.s * 3);
  assert.equal(failed.memory.retry - failed.memory.last, 90000);
  assert.equal(strong.memory.log.length, 7);
  assert.equal(strong.right, 7);
  assert.equal(weak.right, 3);
  assert.equal(failed.wrong, 7);
  const ordinary = history([1,1,1,1,1,1,1], undefined, { diff: 3 });
  assert.ok(strong.memory.due <= ordinary.memory.due, 'common words use a modestly higher retention target');
  assert.ok(strong.memory.due - strong.memory.last <= 365 * M.DAY);
});

test('rapid task counts cannot make a confident word due, and random intervals remain bounded', () => {
  const card = history([1], [0]);
  const word = { id: 'known', diff: 1 };
  const progress = { task: 1000000, cards: { known: card } };
  assert.equal(Flow.select([word], progress, learned, START + 60000), null);
  assert.equal(Flow.nextAt([word], progress, learned, START + 60000), card.memory.due);
  const first = { lvl: 3, ok: true }, second = { lvl: 3, ok: true };
  M.review(first, true, START, { rng: () => 0 }); M.review(second, true, START, { rng: () => 1 });
  assert.ok(first.memory.due < second.memory.due);
  assert.ok(Math.abs((second.memory.due - START) / (first.memory.due - START) - 1.15 / 0.85) < 1e-12);
});

test('legacy migration preserves counters, logs no invented answers, and survives serialization', () => {
  const card = { lvl: 7, right: 7, wrong: 0, ok: true, verify: true, task: 91, time: START - M.DAY };
  const before = { ...card };
  const m = M.ensure(card, START);
  assert.deepEqual({ ...card, memory: undefined }, { ...before, memory: undefined });
  assert.equal(m.estimated, true);
  assert.ok(m.due - m.last <= 30 * M.DAY, 'unknown legacy spacing cannot seed a many-month interval');
  assert.deepEqual(m.log, []);
  const restored = JSON.parse(JSON.stringify(card));
  assert.equal(M.ensure(restored, START + M.DAY).due, m.due);
  restored.memory.due = 'invalid';
  assert.equal(M.valid(M.ensure(restored, START)), true);
});

test('a storage-quota retry trims optional traces without dropping memory or answer counters', () => {
  const a = app(undefined, { now: START });
  const card = history([1,1,1,1,1,1,1]);
  a.context.savedCard = card;
  a.run('ctx().prog.cards.example = savedCard; saveState();');
  const limit = a.storage.get('topwords.v2').length - 20;
  const original = a.context.localStorage.setItem;
  a.context.localStorage.setItem = (key, value) => {
    if (value.length > limit) throw Object.assign(new Error('quota'), { name: 'QuotaExceededError' });
    original(key, value);
  };
  a.run('saveState();');
  const saved = JSON.parse(a.storage.get('topwords.v2')).progress['da|en|rec'].cards.example;
  assert.equal(saved.memory.log.length, 2);
  assert.equal(saved.memory.due, card.memory.due);
  assert.equal(saved.right, 7);
  assert.ok(M.valid(saved.memory));
});

test('failed-word cooldown and session cap survive reload and release after an actual break', () => {
  const state = {}, settings = { pack: 'top', target: 'ru', base: 'da' };
  const session = M.session(state, settings, START);
  const card = { lvl: 0, ok: false, right: 0, wrong: 1, time: START };
  M.review(card, false, START, { learned: false, rng: () => 0.5 });
  M.record(session, 'word', START);
  for (let i = 0; i < 8; i++) M.record(session, 'other' + i, START + (i + 1) * 4000);
  const word = { id: 'word' }, progress = { cards: { word: card } };
  assert.equal(Flow.select([word], progress, learned, START + 40000, { session }), null);
  assert.equal(Flow.select([word], progress, learned, START + 90000, { session }).word.id, 'word');
  M.record(session, 'word', START + 90000); M.record(session, 'word', START + 180000);
  const restored = JSON.parse(JSON.stringify(state));
  const active = M.session(restored, settings, START + 240000);
  assert.equal(Flow.select([word], progress, learned, START + 240000, { session: active }), null);
  assert.ok(Flow.nextAt([word], progress, learned, START + 240000, { session: active }) >= session.last + M.SESSION_IDLE);
  const next = M.session(restored, settings, session.last + M.SESSION_IDLE);
  assert.equal(Flow.select([word], progress, learned, session.last + M.SESSION_IDLE, { session: next }).word.id, 'word');
});

test('all available groups follow the approximate 70/20/10 mix without starving new words', () => {
  const pool = Array.from({ length: 2000 }, (_, i) => ({ id: 'word' + i, diff: 1 }));
  const progress = { cards: {}, task: 0 }, state = {}, settings = { target: 'ru', base: 'da' }, rng = seeded(42);
  for (let i = 0; i < 600; i++) progress.cards[pool[i].id] = { lvl: i < 300 ? 0 : 3, ok: i >= 300, right: i < 300 ? 0 : 3, wrong: i < 300 ? 1 : 0, time: START - 30 * M.DAY };
  const counts = { fresh: 0, struggling: 0, review: 0 };
  let now = START;
  for (let i = 0; i < 600; i++) {
    const session = M.session(state, settings, now);
    const selected = Flow.select(pool, progress, learned, now, { rng, session });
    assert.ok(selected);
    counts[selected.group]++;
    const card = progress.cards[selected.word.id] ||= { lvl: 3, ok: true, right: 1, wrong: 0, time: now };
    M.review(card, selected.group !== 'struggling', now, { word: selected.word, learned: learned(card), rng });
    M.record(session, selected.word.id, now); now += 4000;
  }
  assert.ok(counts.fresh >= 420 && counts.fresh <= 460, JSON.stringify(counts));
  assert.ok(counts.struggling >= 90 && counts.struggling <= 120, JSON.stringify(counts));
  assert.ok(counts.review >= 45 && counts.review <= 60, JSON.stringify(counts));
});

test('switching courses and returning does not bypass an active session repetition cap', () => {
  const state = {}, first = { pack: 'top', target: 'ru', base: 'da' };
  const session = M.session(state, first, START);
  for (let i = 0; i < 3; i++) M.record(session, 'word', START + i * 1000);
  M.session(state, { ...first, pack: 'cleaning' }, START + 5000);
  const restored = M.session(JSON.parse(JSON.stringify(state)), first, START + 10000);
  assert.equal(restored.counts.word, 3);
});

test('actual app answers persist FSRS history and wait instead of repeating a finished list', () => {
  const settings = { pack: 'list:favorites', target: 'ru', base: 'da', dir: 'rec', diff: 3 };
  const a = app(settings, { now: START });
  let firstDelay;
  a.context.setTimeout = (_fn, delay) => { firstDelay = delay; return 1; };
  a.run("state.library.custom['user:one'] = { words: { ru: 'слово', da: 'et ord' } }; wordLibrary.add('user:one'); registerOwnWords(); renderPlay();");
  a.run('choose(current.options.findIndex(option => option.id === current.concept.id));');
  assert.equal(a.run('current'), null);
  assert.match(a.context.document.getElementById('app').innerHTML, /id="checkPractice"/);
  assert.ok(firstDelay > M.DAY && firstDelay <= 2147483000, 'waiting does not poll storage once per minute');
  const due = a.run("ctx().prog.cards['user:one'].memory.due");
  assert.equal(a.run("ctx().prog.cards['user:one'].memory.log[0][1]"), 3);
  const b = app(settings, { rawState: a.storage.get('topwords.v2'), now: START + 60000 });
  let wake;
  b.context.setTimeout = fn => { wake = fn; return 1; };
  b.run('registerOwnWords(); renderPlay();');
  assert.equal(b.run('current'), null);
  assert.equal(b.run("ctx().prog.cards['user:one'].memory.due"), due);
  b.clock.now = due + 1000; wake();
  assert.equal(b.run('current.concept.id'), 'user:one');
  b.run('choose(current.options.findIndex(option => option.id === current.concept.id));');
  assert.equal(b.run("ctx().prog.cards['user:one'].right"), 2);
  assert.equal(b.run("ctx().prog.cards['user:one'].memory.log.length"), 2);
});

test('simulated learners gain coverage, keep variation and respect per-session repetition limits', () => {
  const pool = Array.from({ length: 120 }, (_, i) => ({ id: 'word' + i, diff: 1 }));
  const orders = new Set();
  for (const persona of ['confident', 'gradual', 'uneven', 'beginner']) for (let seed = 1; seed <= 12; seed++) {
    const result = run({ pool, persona, seed });
    assert.equal(result.summary.questions, 100);
    assert.ok(result.summary.uniqueWords >= 70, persona + ': ' + result.summary.uniqueWords);
    assert.ok(result.summary.maxWordAppearances <= 3);
    if (persona === 'confident') {
      assert.equal(result.summary.uniqueWords, 100);
      orders.add(result.selections.slice(0, 20).map(item => item.id).join(','));
    }
  }
  assert.equal(orders.size, 12);
});

test('revealing a new word persists one exposure before Continue without double-counting it', () => {
  const a = app(undefined, { now: START });
  a.run('ctx().prog.offered = true; renderPlay();');
  const id = a.run('current.concept.id');
  a.context.wordId = id;
  a.run('dontKnow();');
  assert.equal(a.run('current.kind'), 'intro');
  assert.equal(a.run('ctx().prog.cards[wordId].memory.log[0][1]'), 0);
  const task = a.run('ctx().prog.task');
  a.run('advance();');
  assert.equal(a.run('ctx().prog.task'), task);
  assert.equal(a.run('ctx().prog.cards[wordId].memory.log.length'), 1);
  assert.notEqual(a.run('current?.concept.id'), id);
});

test('actual placement answers are logged while inferred words have no fabricated review events', () => {
  const a = app(undefined, { now: START });
  a.run('render = () => {}; startPlacement(); renderPlace();');
  const id = a.run('current.concept.id');
  a.context.testedId = id;
  a.run('choose(current.options.findIndex(option => option.id === current.concept.id));');
  assert.equal(a.run('ctx().prog.cards[testedId].memory.log[0][1]'), 3);
  a.run('placement.passedEnd = 10; finishPlacement();');
  assert.equal(a.run('Object.values(ctx().prog.cards).filter(card => card.memory?.estimated).length') > 0, true);
  assert.equal(a.run('Object.values(ctx().prog.cards).filter(card => card.memory?.estimated).every(card => card.memory.log.length === 0 && card.right === 0 && card.wrong === 0)'), true);
});

test('a year of continued practice revisits every introduced word for all simulated personas', () => {
  const pool = Array.from({ length: 120 }, (_, i) => ({ id: 'word' + i, diff: 1 }));
  for (const persona of ['confident', 'gradual', 'uneven', 'beginner']) {
    const result = run({ pool, persona, seed: 42, days: 365, dailyTasks: 20, tasks: 7300 });
    assert.equal(result.summary.uniqueWords, 120, persona);
    assert.ok(Object.values(result.visits).every(times => times.length >= 2), persona);
  }
});
