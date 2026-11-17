const test = require('node:test');
const assert = require('node:assert/strict');
const Resume = require('../practice-resume');
const names = { cleaning: 'Cleaning', top: 'Common words', pics: 'Pictures', favorites: 'Saved words' };
const settings = { target: 'da', base: 'en', pack: 'cleaning', dir: 'write', diff: 2, cats: ['tools'] };

test('resume describes the existing course without changing saved settings or progress', () => {
  const state = { settings: structuredClone(settings), progress: { course: { task: 17 } } };
  const before = JSON.stringify(state);
  assert.deepEqual(Resume.describe(state, names), { title: 'Cleaning', pair: 'Dansk ← English' });
  assert.equal(JSON.stringify(state), before);
  assert.deepEqual(Resume.describe({ settings: { ...settings, pack: undefined } }, names), { title: 'Common words', pair: 'Dansk ← English' });
});

test('personal list resume follows its stable ID after rename and hides deleted or empty lists', () => {
  const state = { settings: { ...settings, pack: 'list:user:work' }, library: { lists: [{ id: 'user:work', name: 'My workshop', items: ['lex:word'] }] } };
  assert.equal(Resume.describe(state, names).title, 'My workshop');
  state.library.lists[0].name = 'New name';
  assert.equal(Resume.describe(state, names).title, 'New name');
  state.library.lists[0].items = [];
  assert.equal(Resume.describe(state, names), null);
  state.library.lists = [];
  assert.equal(Resume.describe(state, names), null);
  state.settings.pack = 'list:favorites';
  state.library.favorites = ['lex:word'];
  assert.equal(Resume.describe(state, names).title, 'Saved words');
});

test('first visits, corrupt or unavailable storage and unsupported courses degrade to the public catalogue', () => {
  for (const state of [null, {}, { settings: { ...settings, target: 'unknown' } }, { settings: { ...settings, base: '__proto__' } }, { settings: { ...settings, pack: 'removed-pack' } }]) assert.equal(Resume.describe(state, names), null);
  assert.equal(Resume.read({ getItem() { throw Error('blocked'); } }), null);
  assert.equal(Resume.read({ getItem: () => '{bad' }), null);
  assert.equal(Resume.read({ getItem: () => null }), null);
  const state = { settings };
  assert.deepEqual(Resume.read({ getItem: (key) => { assert.equal(key, 'topwords.v2'); return JSON.stringify(state); } }), state);
});
