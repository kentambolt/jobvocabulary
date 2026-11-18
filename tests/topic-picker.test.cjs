const test = require('node:test');
const assert = require('node:assert/strict');
const app = require('./helpers/app.cjs');

test('topic multi-select retains multiple choices, stays open and never changes active progress before start', () => {
  const a = app({ pack: 'warehouse', target: 'da', base: 'en', dir: 'rec', diff: 1, cats: null });
  a.run('draft = { ...state.settings }; render = renderSetup;');
  const categories = JSON.parse(a.run('JSON.stringify(packOf(draft).categories)'));
  const controls = categories.slice(0, 2).map(cat => ({ id: 'topic-' + cat.key, dataset: { cat: cat.key } }));
  a.context.document.getElementById('app').querySelectorAll = selector => selector === '[data-cat]' ? controls : [];
  const before = a.run('JSON.stringify(state)');
  a.run('renderSetup();');
  assert.match(a.context.document.getElementById('app').innerHTML, /<details class="topic-picker" id="topicPicker">/);
  controls[0].onchange();
  controls[1].onchange();
  assert.deepEqual(JSON.parse(a.run('JSON.stringify(draft.cats)')), categories.slice(2).map(cat => cat.key));
  assert.equal(a.context.document.getElementById('topicPicker').open, true);
  assert.equal(a.run('JSON.stringify(state)'), before);
  a.context.document.getElementById('selectAllTopics').onclick();
  assert.equal(a.run('draft.cats'), null);
  a.context.document.getElementById('clearTopics').onclick();
  assert.deepEqual(JSON.parse(a.run('JSON.stringify(draft.cats)')), []);
  assert.match(a.context.document.getElementById('app').innerHTML, /id="startBtn" disabled/);
  assert.equal(a.run('countPool(draft)'), 0);
});

test('an existing topic subset survives setup and course start without adding unselected topics', () => {
  const settings = { pack: 'warehouse', target: 'da', base: 'uk', dir: 'write', diff: 2, cats: ['places', 'equipment'] };
  const a = app(settings);
  a.run('render = () => {}; renderSetup();');
  const html = a.context.document.getElementById('app').innerHTML;
  assert.match(html, /type="checkbox" data-cat="places" id="topic-places" checked/);
  assert.match(html, /type="checkbox" data-cat="equipment" id="topic-equipment" checked/);
  assert.equal((html.match(/id="topic-[^"]+" checked/g) || []).length, 2);
  a.context.document.getElementById('startBtn').onclick();
  assert.deepEqual(JSON.parse(a.run('JSON.stringify(state.settings.cats)')), settings.cats);
});
