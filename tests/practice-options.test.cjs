const test = require('node:test');
const assert = require('node:assert/strict');
const Options = require('../practice-options');
const Flow = require('../learning-flow');
const Preferences = require('../course-preferences');
const app = require('./helpers/app.cjs');

const settings = { pack: 'top', target: 'da', base: 'en', dir: 'rec', diff: 1, modes: ['rec', 'prod', 'write'], repeatLearned: false };
const learnedCard = () => ({ lvl: 4, ok: true, right: 5, wrong: 0, task: 0, time: 0 });

test('selection keeps at least one supported mode and remembers repetition independently by course', () => {
  const single = Options.apply({ ...settings, modes: ['write', 'invalid'] });
  assert.deepEqual(Options.toggle(single, 'write').modes, ['write']);
  assert.deepEqual(Options.toggle(single, 'rec').modes, ['rec', 'write']);
  assert.equal(Options.apply({ ...settings, modes: undefined, dir: 'prod' }).dir, 'prod');
  const state = { settings };
  Preferences.remember(state);
  state.settings = null;
  assert.deepEqual(Preferences.resolve(state, settings).modes, settings.modes);
  assert.equal(Preferences.resolve(state, settings).repeatLearned, false);
  assert.equal(Preferences.resolve(state, { ...settings, base: 'uk' }).repeatLearned, undefined);
});

test('disabling learned repetitions keeps incorrect-word retries and new vocabulary', () => {
  const pool = [{ id: 'known' }, { id: 'wrong' }, { id: 'fresh' }];
  const progress = { task: 20, lastLearnedReviewTask: 0, cards: { known: learnedCard(), wrong: { lvl: 0, ok: false, wrong: 1, time: Date.now() - 86400000 } } };
  const learned = (card) => card.ok;
  assert.equal(Flow.select([pool[1]], progress, learned, Date.now(), { repeatLearned: false }).word.id, 'wrong');
  progress.cards.wrong = learnedCard();
  assert.equal(Flow.select(pool, progress, learned, Date.now(), { repeatLearned: false }).word.id, 'fresh');
  progress.cards.fresh = learnedCard();
  assert.equal(Flow.select(pool, progress, learned, Date.now(), { repeatLearned: false }), null);
  assert.equal(Flow.select(pool, progress, learned, Date.now(), { repeatLearned: true }).maintenance, true);
});

test('actual answers alternate selected task types while preserving separate histories across reload', () => {
  const a = app(settings);
  const seen = [];
  for (let i = 0; i < 9; i++) {
    a.run('current = null; renderPlay();');
    seen.push(a.run('state.settings.dir'));
    if (a.run('current.kind') === 'write') {
      a.run('current.mistakes = 0; finishWrite();');
    } else {
      const answer = a.run('current.options.findIndex(option => option.id === current.concept.id)');
      a.run(`choose(${answer});`);
    }
  }
  assert.deepEqual(seen, ['rec', 'prod', 'write', 'rec', 'prod', 'write', 'rec', 'prod', 'write']);
  for (const mode of settings.modes) assert.ok(a.run(`Object.keys(state.progress['da|en|${mode}'].cards).length`) > 0);
  const saved = a.storage.get('topwords.v2');
  const b = app(settings, { rawState: saved });
  b.run('renderPlay();');
  assert.equal(b.run('state.settings.dir'), 'rec');
  assert.equal(b.run('modeTurn(state.settings)'), 9);
});

test('mixed progression waits for every selected skill and skips completed skills when repeats are off', () => {
  const a = app({ ...settings, modes: ['rec', 'prod'] });
  a.context.known = Object.fromEntries(a.run('buildPool(state.settings)').map(word => [word.id, learnedCard()]));
  a.run("Object.assign(ctx({ ...state.settings, dir: 'rec' }).prog.cards, known); renderPlay();");
  assert.equal(a.run('state.settings.diff'), 1);
  assert.equal(a.run('state.settings.dir'), 'prod');
  a.run("Object.assign(ctx().prog.cards, known); current = null; renderPlay();");
  assert.equal(a.run('state.settings.diff'), 2);
});

test('a finished single-mode list stops without review and can explicitly enable review', () => {
  const a = app({ ...settings, pack: 'list:favorites', modes: ['rec'], diff: 3 });
  a.run("state.library.custom['user:one'] = { words: { da: 'et ord', en: 'a word' } }; wordLibrary.add('user:one'); registerOwnWords();");
  a.context.known = learnedCard();
  a.run("ctx().prog.cards['user:one'] = known; renderPlay();");
  assert.equal(a.run('current'), null);
  assert.match(a.context.document.getElementById('app').innerHTML, /id="enableReview"/);
  a.context.document.getElementById('enableReview').onclick();
  assert.equal(a.run('state.settings.repeatLearned'), true);
  assert.equal(a.run('current.concept.id'), 'user:one');
});

test('opening a dialog blocks exercise shortcuts, and cancelling options leaves the current task intact', () => {
  const a = app(settings);
  a.run('renderPlay();');
  const before = a.run('JSON.stringify(current)');
  const stored = a.storage.get('topwords.v2');
  a.context.document.querySelector = () => ({ open: true });
  a.events.get('document:keydown')({ key: '1', target: { closest() { return null; } } });
  assert.equal(a.run('JSON.stringify(current)'), before);
  assert.equal(a.storage.get('topwords.v2'), stored);
  a.run('openTrainingOptions(state.settings, () => { throw Error("cancel must not apply"); });');
  a.context.document.getElementById('cancelTraining').onclick();
  assert.equal(a.run('JSON.stringify(current)'), before);
  assert.equal(a.storage.get('topwords.v2'), stored);
});
