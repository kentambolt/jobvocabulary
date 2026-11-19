const test = require('node:test');
const assert = require('node:assert/strict');
const app = require('./helpers/app.cjs');

test('a first visit from a language page keeps that interface in My words and after reload', () => {
  for (const lang of ['da', 'en', 'ru', 'uk']) {
    const initialState = { progress: { existing: { task: 12, cards: {} } }, library: { favorites: ['lex:saved'] } };
    const a = app(undefined, { initialState, search: '?ui=' + lang + '&campaign=example', hash: '#mine-ord' });
    assert.equal(a.run('view'), 'library');
    assert.equal(a.run('uiLang()'), lang);
    assert.equal(a.context.location.search, '?campaign=example');
    assert.equal(a.context.location.hash, '#mine-ord');
    const saved = JSON.parse(a.storage.get('topwords.v2'));
    assert.deepEqual(saved.progress, initialState.progress);
    assert.deepEqual(saved.library.favorites, ['lex:saved']);
    assert.equal(app(undefined, { rawState: a.storage.get('topwords.v2') }).run('uiLang()'), lang);
  }
});

test('explicit interface choices do not alter an existing learning pair or exercise mode', () => {
  const settings = { target: 'da', base: 'en', pack: 'top', dir: 'write', diff: 3, cats: ['chosen'] };
  const a = app(settings, { search: '?ui=uk' });
  assert.equal(a.run('uiLang()'), 'uk');
  assert.deepEqual(JSON.parse(a.run('JSON.stringify(state.settings)')), settings);
  a.run("render = () => {}; view = 'setup'; draft = { target: 'da', base: 'ru', pack: 'top', dir: 'rec', diff: 1 }; renderSetup();");
  assert.equal(a.run('uiLang()'), 'ru');
  a.context.document.getElementById('startBtn').onclick();
  assert.equal(a.run('state.uiLang'), 'ru');
  assert.equal(a.run('uiLang()'), 'ru');
});

test('course links retain their language before a course starts and invalid UI hints are ignored', () => {
  const a = app(undefined, { initialState: {}, hash: '#start=top&base=uk' });
  assert.equal(a.run('uiLang()'), 'uk');
  assert.equal(JSON.parse(a.storage.get('topwords.v2')).uiLang, 'uk');
  for (const hint of ['invalid', '__proto__', 'constructor']) {
    const invalid = app(undefined, { search: '?ui=' + hint });
    assert.equal(invalid.run('uiLang()'), 'en');
    assert.equal(invalid.run('state.uiLang'), undefined);
  }
  const corrupt = app(undefined, { rawState: '[]', hash: '#mine-ord', search: '?ui=uk' });
  assert.equal(corrupt.run('uiLang()'), 'uk');
  assert.equal(corrupt.run('Array.isArray(state)'), false);
});

test('a preselected job course can start from the first setup panel without losing its language', () => {
  const a = app(undefined, { initialState: {}, hash: '#start=warehouse&base=uk' });
  assert.equal(a.context.location.hash, '#start=warehouse&base=uk', 'keep the selected course recoverable before starting');
  a.run('render = () => {}; renderSetup();');
  assert.match(a.context.document.getElementById('app').innerHTML, /id="startBtn"/);
  a.context.document.getElementById('startBtn').onclick();
  assert.equal(a.run('state.settings.pack'), 'warehouse');
  assert.equal(a.run('state.settings.target'), 'da');
  assert.equal(a.run('state.settings.base'), 'uk');
  assert.equal(a.run('state.uiLang'), 'uk');
  assert.equal(a.run('view'), 'play');
  assert.equal(a.context.location.hash, '', 'consume the course hint once practice actually starts');
});

test('manual pronunciation works with automatic audio off without changing the preference', () => {
  const a = app(undefined, { stubSpeech: false });
  const spoken = [];
  const synthesis = { getVoices: () => [], cancel() {}, speak: (utterance) => spoken.push(utterance) };
  a.context.window.speechSynthesis = synthesis;
  a.context.speechSynthesis = synthesis;
  a.context.SpeechSynthesisUtterance = class { constructor(text) { this.text = text; } };
  a.run('speakTarget(ITEM[ORDER.da[0]]);');
  assert.equal(spoken.length, 0);
  a.run('speakTarget(ITEM[ORDER.da[0]], true);');
  assert.equal(spoken.length, 1);
  assert.equal(spoken[0].text, a.run('ITEM[ORDER.da[0]].words.da'));
  assert.equal(a.run('state.sound'), false);
});

test('first-time language selection keeps the learner on the setup form instead of the marketing introduction', () => {
  const a = app(undefined, { initialState: {} });
  a.run("draft = { target: 'da', base: null, pack: 'top', dir: 'rec', diff: 1 }; view = 'setup'; renderIntro('en'); renderSetup();");
  assert.equal(a.context.document.getElementById('intro').hidden, true);
  assert.match(a.context.document.getElementById('app').innerHTML, /<h1>Get started<\/h1>/);
  assert.doesNotMatch(a.context.document.getElementById('app').innerHTML, /id="quickStartBtn"/);
});
