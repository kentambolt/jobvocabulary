const test = require('node:test');
const assert = require('node:assert/strict');
const app = require('./helpers/app.cjs');

test('starting from setup reaches a task without a second placement-choice screen', () => {
  const a = app(undefined, { initialState: {} });
  const soundBefore = a.run('state.sound');
  a.run("render = () => {}; view = 'setup'; draft = { target: 'da', base: 'en', pack: 'top', dir: 'rec', diff: 1 }; renderSetup();");
  a.context.document.getElementById('startBtn').onclick();
  a.run('renderPlay();');
  assert.equal(a.run('view'), 'play');
  assert.ok(a.run('current?.concept.id'));
  assert.equal(a.run('ctx().prog.offered'), true);
  assert.equal(a.run('pendingPlacement'), false);
  assert.equal(a.run('state.sound'), soundBefore);
});

test('the explicit setup test starts placement without inserting a normal task', () => {
  const a = app(undefined, { initialState: {} });
  a.run("render = () => {}; view = 'setup'; draft = { target: 'da', base: 'uk', pack: 'top', dir: 'rec', diff: 1 }; renderSetup();");
  a.context.document.getElementById('setupTestBtn').onclick();
  a.run('renderPlay();');
  assert.equal(a.run('pendingPlacement'), false);
  assert.equal(a.run('view'), 'place');
  assert.ok(a.run('placement.queue.length') > 0);
  assert.equal(a.run('ctx().prog.task'), 0);
});

test('training context identifies courses and lists without resetting their counters', () => {
  const a = app();
  a.run("state.settings = { target: 'da', base: 'en', pack: 'warehouse', diff: 2, dir: 'rec' };");
  const html = a.run("metaHTML({s:state.settings,key:'sample',prog:{task:0,cards:{}},pool:[]},null)");
  assert.match(html, /course-name[^>]*>Warehouse and production/);
  assert.match(html, /course-difficulty/);
  assert.match(html, /course-progress[^>]*>0 of 0 learned/);
  a.run("state.settings.pack = 'list:favorites';");
  assert.match(a.run("metaHTML({s:state.settings,key:'sample',prog:{task:0,cards:{}},pool:[]},null)"), /Saved words/);
});

test('the compact course selector restores that course preferences without changing active progress', () => {
  const a = app({ target: 'da', base: 'en', pack: 'warehouse', dir: 'write', diff: 2, cats: ['places'] });
  a.run("saveState(); render = () => {}; draft = { target: 'da', base: 'en', pack: 'top', dir: 'rec', diff: 1 }; view = 'setup'; renderSetup();");
  const before = a.run('JSON.stringify(state.progress)');
  a.context.document.getElementById('courseSelect').value = 'warehouse';
  a.context.document.getElementById('courseSelect').onchange();
  assert.equal(a.run('draft.pack'), 'warehouse');
  assert.equal(a.run('draft.diff'), 2);
  assert.equal(a.run('draft.dir'), 'write');
  assert.deepEqual(JSON.parse(a.run('JSON.stringify(draft.cats)')), ['places']);
  assert.equal(a.run('JSON.stringify(state.progress)'), before);
  a.context.document.getElementById('courseSelect').value = 'cleaning';
  a.context.document.getElementById('courseSelect').onchange();
  assert.equal(a.run('draft.diff'), 1);
  assert.equal(a.run('draft.cats'), null);
});
