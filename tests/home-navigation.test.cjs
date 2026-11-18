const test = require('node:test');
const assert = require('node:assert/strict');
const app = require('./helpers/app.cjs');

test('the logo opens the landing page and resuming preserves the pending task and stored progress', () => {
  const a = app();
  a.run('renderPlay(); render = () => {}; saveState();');
  const current = a.run('JSON.stringify(current)');
  const stored = a.storage.get('topwords.v2');
  a.context.document.getElementById('homeBtn').onclick({ preventDefault() {} });
  assert.equal(a.run('view'), 'home');
  assert.equal(a.context.location.hash, '#forside');
  assert.equal(a.storage.get('topwords.v2'), stored);
  const reloaded = app(undefined, { rawState: stored, hash: '#forside' });
  assert.equal(reloaded.run('view'), 'home');
  a.context.document.getElementById('resumeBtn').onclick();
  assert.equal(a.run('view'), 'play');
  assert.equal(a.context.location.hash, '');
  assert.equal(a.run('JSON.stringify(current)'), current);
  assert.equal(a.storage.get('topwords.v2'), stored);
});

test('choosing a new language from the landing page creates only a setup draft until starting', () => {
  const a = app();
  const button = { dataset: { target: 'en' } };
  a.context.document.getElementById('app').querySelectorAll = () => [button];
  a.run("render = () => {}; go('home'); renderHomeStart();");
  const before = a.run('JSON.stringify(state)');
  button.onclick();
  assert.equal(a.run('view'), 'setup');
  assert.equal(a.run('draft.target'), 'en');
  assert.equal(a.run('draft.base'), null);
  assert.equal(a.run('JSON.stringify(state)'), before);
});

