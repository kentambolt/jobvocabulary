const test = require('node:test');
const assert = require('node:assert/strict');
const Preferences = require('../course-preferences');
const app = require('./helpers/app.cjs');

const warehouse = { pack: 'warehouse', target: 'da', base: 'uk', dir: 'write', diff: 2, cats: ['places', 'equipment'] };

test('course profiles copy choices, separate language pairs, and never inherit personal-list difficulty', () => {
  const state = { settings: structuredClone(warehouse) };
  Preferences.remember(state);
  state.settings.cats.push('later-unsaved-change');
  state.settings = { ...warehouse, base: 'en', dir: 'prod', diff: 3, cats: null };
  Preferences.remember(state);
  state.settings = { pack: 'list:user:work', target: 'da', base: 'uk', dir: 'rec', diff: 3, cats: null };
  Preferences.remember(state);
  assert.deepEqual(Preferences.resolve(state, warehouse), warehouse);
  assert.equal(Preferences.resolve(state, { ...warehouse, base: 'en' }).dir, 'prod');
  assert.equal(Preferences.resolve(state, { ...warehouse, base: 'en' }).diff, 3);
  const unseen = Preferences.resolve(state, { pack: 'cleaning', target: 'da', base: 'uk' });
  assert.deepEqual(unseen, { pack: 'cleaning', target: 'da', base: 'uk', dir: 'rec', diff: 1, cats: null });
  assert.equal(Object.keys(state.courseSettings).length, 2);
});

test('actual list-practice and return handlers preserve the former course and word histories', () => {
  const a = app(warehouse);
  a.run("render = () => {}; state.progress['warehouse|da|uk|write'] = { task: 17, cards: { 'warehouse:et lager': { lvl: 4, ok: true, right: 8, wrong: 1 } } }; state.library.custom['user:test'] = { words: { da: 'mit ord', uk: 'моє слово' } }; wordLibrary.add('user:test'); registerOwnWords(); saveState();");
  const before = a.run('JSON.stringify(state.progress)');
  a.run("startLibraryPractice('favorites', { target: 'da', base: 'uk' });");
  assert.equal(a.run('state.settings.diff'), 3);
  assert.equal(a.run('isList(state.settings)'), true);
  assert.deepEqual(JSON.parse(a.run('JSON.stringify(lastCourseSettings())')), warehouse);
  a.run('returnToCourse();');
  assert.deepEqual(JSON.parse(a.run('JSON.stringify(state.settings)')), warehouse);
  assert.equal(a.run('JSON.stringify(state.progress)'), before);
  assert.equal(a.run('view'), 'play');
});

test('course links restore their own choices after list practice or an unrelated course', () => {
  const a = app(warehouse);
  a.run("saveState(); state.settings = { pack: 'list:user:test', target: 'en', base: 'uk', dir: 'rec', diff: 3, cats: null }; saveState(); location.hash = '#start=warehouse&base=uk'; applyCourseLink();");
  assert.deepEqual(JSON.parse(a.run('JSON.stringify(state.settings)')), warehouse);
  assert.equal(a.run('view'), 'play');
  a.run("location.hash = '#start=cleaning&base=uk'; applyCourseLink();");
  assert.equal(a.run('state.settings.diff'), 1);
  assert.equal(a.run('state.settings.dir'), 'rec');
  assert.equal(a.run('state.settings.cats'), null);
  a.run("location.hash = '#start=warehouse&base=uk'; applyCourseLink();");
  assert.deepEqual(JSON.parse(a.run('JSON.stringify(state.settings)')), warehouse);
});

test('empty lists and invalid stored preferences do not displace a valid active course', () => {
  const a = app(warehouse);
  a.run("render = () => {}; startLibraryPractice('favorites', { target: 'da', base: 'uk' });");
  assert.deepEqual(JSON.parse(a.run('JSON.stringify(state.settings)')), warehouse);
  const state = { settings: { pack: 'list:favorites', target: 'da', base: 'en', dir: 'rec', diff: 3 }, courseSettings: { 'warehouse|da|uk': { ...warehouse, pack: 'cleaning' } } };
  assert.equal(Preferences.resolve(state, warehouse).diff, 1);
  for (const value of [null, {}, { ...warehouse, base: 'invalid' }, { ...warehouse, diff: 99 }, { ...warehouse, dir: 'unknown' }, { ...warehouse, pack: 'list:favorites' }]) assert.equal(Preferences.normalize(value), null);
  assert.equal(Preferences.resolve(state, { pack: 'pics', target: 'da', base: 'en' }).dir, 'path');
  a.run("saveState(); state.settings = { pack: 'list:removed', target: 'da', base: 'uk', dir: 'rec', diff: 3 }; current = null; renderPlay();");
  assert.match(a.context.document.getElementById('app').innerHTML, /id="emptySetup"/);
  assert.match(a.context.document.getElementById('app').innerHTML, /role="status"/);
});
