const test = require('node:test');
const assert = require('node:assert/strict');
const app = require('./helpers/app.cjs');
const LearningFlow = require('../learning-flow');

const card = () => ({ lvl: 3, ok: true, right: 3, wrong: 0, task: 0, time: Date.now() - 86400000 });

test('the real app automatically advances easy to medium to hard and retains course settings', () => {
  const a = app();
  const beforeSettings = a.run('JSON.stringify(state.settings)');
  const easy = a.run('buildPool(state.settings)');
  a.context.known = Object.fromEntries(easy.map((word) => [word.id, card()]));
  a.run('Object.assign(ctx().prog.cards, known); renderPlay();');
  assert.equal(a.run('state.settings.diff'), 2);
  assert.equal(a.run('current.concept.diff'), 2);
  assert.match(a.run('levelNotice.text'), /Easy.*Medium/);
  assert.deepEqual(JSON.parse(a.run('JSON.stringify(state.settings)')), { ...JSON.parse(beforeSettings), diff: 2 });
  const medium = a.run('buildPool(state.settings)');
  a.context.known = Object.fromEntries(medium.map((word) => [word.id, card()]));
  a.run('Object.assign(ctx().prog.cards, known); current = null; renderPlay();');
  assert.equal(a.run('state.settings.diff'), 3);
  assert.equal(a.run('current.concept.diff'), 3);
  assert.equal(JSON.parse(a.storage.get('topwords.v2')).settings.diff, 3);
  assert.equal(a.run('Object.keys(ctx().prog.cards).length'), medium.length);
});

test('one hard-word error never changes easy-word histories or creates a run of easy reviews', () => {
  const a = app({ target: 'da', base: 'en', pack: 'top', dir: 'rec', diff: 3 });
  const easy = a.run('buildPool({ ...state.settings, diff: 1 })');
  const hard = a.run('buildPool(state.settings).find((word) => word.diff === 3)');
  a.context.known = Object.fromEntries([...easy, hard].map((word) => [word.id, card()]));
  a.context.hard = hard;
  a.run('Object.assign(ctx().prog.cards, known); ctx().prog.task = 400; ctx().prog.offered = true;');
  const easyBefore = a.run('JSON.stringify(buildPool({ ...state.settings, diff: 1 }).map((word) => ctx().prog.cards[word.id]))');
  a.run("current = { kind: 'quiz', concept: hard, options: [hard, { id: 'incorrect' }], answered: null }; choose(1);");
  assert.equal(a.run('ctx().prog.cards[hard.id].wrong'), 1);
  assert.equal(a.run('JSON.stringify(buildPool({ ...state.settings, diff: 1 }).map((word) => ctx().prog.cards[word.id]))'), easyBefore);
  a.run('advance();');
  let consecutiveEasy = 0;
  let easyChecks = 0;
  const seen = [];
  for (let index = 0; index < 48; index++) {
    const task = a.run('current');
    seen.push(task.concept.id);
    if (task.concept.diff === 1) { easyChecks++; consecutiveEasy++; } else consecutiveEasy = 0;
    assert.ok(consecutiveEasy <= 1, 'learned words cannot form a consecutive backlog');
    const answer = task.options.findIndex((option) => option.id === task.concept.id);
    a.run(`choose(${answer});`);
  }
  assert.ok(easyChecks <= 8, `at most eight familiar checks in 48 tasks, got ${easyChecks}`);
  assert.ok(seen.includes(hard.id), 'the actual difficult word gets reviewed');
  assert.ok(new Set(seen).size > 30, 'new material continues to be introduced');
});

test('unfinished words prevent promotion; empty or unchanged levels never loop', () => {
  const learned = (entry) => entry.ok && entry.lvl >= 2;
  const pool = [{ id: 'one' }];
  assert.equal(LearningFlow.nextDifficulty(1, pool, { one: { ok: false, lvl: 3 } }, () => [{ id: 'two' }], learned), null);
  assert.equal(LearningFlow.nextDifficulty(1, [], {}, () => [], learned), null);
  assert.equal(LearningFlow.nextDifficulty(1, pool, { one: card() }, () => pool, learned), null);
  const next = LearningFlow.nextDifficulty(1, pool, { one: card() }, (diff) => diff === 2 ? pool : [...pool, { id: 'three' }], learned);
  assert.equal(next.diff, 3, 'skip an empty intermediate tier');
});

test('progression honours category-filtered pools and personal lists have no automatic level change', () => {
  const settings = { target: 'da', base: 'en', pack: 'top', dir: 'rec', diff: 1 };
  const a = app(settings);
  a.run("state.settings.pack = 'list:favorites'; state.library.custom['user:one'] = { words: { da: 'mit ord', en: 'my word' } }; wordLibrary.add('user:one'); registerOwnWords(); ctx().prog.cards['user:one'] = { lvl: 3, ok: true, task: 0, time: Date.now(), right: 3, wrong: 0 }; renderPlay();");
  assert.equal(a.run('state.settings.diff'), 1);
  const filtered = [{ id: 'selected', diff: 1, cat: 'selected' }];
  const next = LearningFlow.nextDifficulty(1, filtered, { selected: card() }, (diff) => diff === 2 ? filtered : [...filtered, { id: 'selected-hard', diff: 3, cat: 'selected' }], () => true);
  assert.deepEqual(next.pool.map((word) => word.cat), ['selected', 'selected']);
});

test('leaving a placement test for My words or statistics resumes the actual test', () => {
  const a = app();
  a.run("render = () => {}; placement = { key: progKey(state.settings), queue: ['next'] }; current = { kind: 'place', concept: ITEM[ORDER.da[0]], answered: null }; view = 'place'; go('library');");
  assert.equal(a.run('view'), 'library');
  a.run("go('play');");
  assert.equal(a.run('view'), 'place');
  a.run("go('stats');");
  assert.equal(a.run('view'), 'stats');
  a.context.location.hash = '';
  a.events.get('popstate')();
  assert.equal(a.run('view'), 'place');
  assert.equal(a.run('current.kind'), 'place');
  assert.equal(a.run('placement.queue.length'), 1);
});
