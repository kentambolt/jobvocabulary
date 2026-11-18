const test = require('node:test');
const assert = require('node:assert/strict');
const WordEntry = require('../word-entry');
const app = require('./helpers/app.cjs');
const entries = [
  { id: 'lex:brick', words: { da: 'en mursten', en: 'brick', ru: 'кирпич', uk: 'цеглина' }, phrase: false },
  { id: 'lex:run', words: { da: 'at løbe', en: 'run', uk: 'бігти' }, phrase: false },
  { id: 'lex:article', words: { da: 'en', en: 'a', uk: 'неозначений артикль' }, phrase: false },
  { id: 'lex:number', words: { da: 'en', en: 'one', uk: 'один' }, phrase: false },
  { id: 'lex:phrase', words: { da: 'en af dem', en: 'one of them', uk: 'один із них' }, phrase: true },
];

test('bare Danish words reuse the dictionary ID without stripping articles from phrases', () => {
  const draft = new WordEntry(entries, { target: 'da', base: 'en' });
  draft.setWord(' mursten ');
  assert.equal(draft.translation, 'brick');
  assert.equal(draft.knownId(), 'lex:brick');
  draft.setWord('løbe');
  assert.equal(draft.translation, 'run');
  assert.equal(draft.knownId(), 'lex:run');
  assert.equal(WordEntry.exact(entries[4], 'da', 'af dem'), false);
  assert.equal(WordEntry.exact(entries[4], 'da', 'en af dem'), true);
  assert.equal(WordEntry.search(entries, 'mursten', draft)[0].id, 'lex:brick');
});

test('changing translation languages refreshes a known word and never retains an old-language value', () => {
  const draft = new WordEntry(entries, { target: 'da', base: 'uk' });
  draft.setWord('en mursten');
  assert.equal(draft.translation, 'цеглина');
  draft.setLanguage('base', 'en');
  assert.equal(draft.translation, 'brick');
  draft.setLanguage('target', 'en');
  assert.equal(draft.target, 'en');
  assert.equal(draft.base, 'da');
  assert.equal(draft.word, 'brick');
  assert.equal(draft.translation, 'en mursten');
  draft.setWord('unknown word');
  draft.setTranslation('manual text');
  draft.setLanguage('base', 'ru');
  assert.equal(draft.translation, '');
});

test('ambiguous meanings require a choice and manual translations do not silently reuse the wrong entry', () => {
  const draft = new WordEntry(entries, { target: 'da', base: 'en' });
  draft.setWord('en');
  assert.equal(draft.matches.length, 2);
  assert.equal(draft.hint, 'chooseMeaning');
  assert.equal(draft.translation, '');
  draft.select('lex:number');
  assert.equal(draft.translation, 'one');
  assert.equal(draft.knownId(), 'lex:number');
  draft.setTranslation('my own meaning');
  assert.equal(draft.knownId(), null);
});

test('custom editing reads the selected language fields and leaves other translations intact', () => {
  const original = { id: 'user:custom', words: { da: 'et særligt ord', en: 'a special word', uk: 'особливе слово' } };
  const before = JSON.stringify(original);
  const draft = new WordEntry(entries, { target: 'da', base: 'en' }, original);
  draft.setLanguage('base', 'uk');
  assert.equal(draft.translation, 'особливе слово');
  draft.setLanguage('base', 'ru');
  assert.equal(draft.translation, '');
  draft.setWord('edited draft');
  assert.equal(JSON.stringify(original), before);
});

test('actual form submit reuses a known ID and follows the chosen pair without changing the active course', () => {
  const a = app({ pack: 'warehouse', target: 'da', base: 'uk', dir: 'prod', diff: 1, cats: ['places'] });
  a.context.brick = entries[0];
  a.run("ITEM[brick.id] = brick; renderLibrary = () => {}; bindOwnWordForm({ target: 'da', base: 'uk' });");
  const word = a.context.document.getElementById('ownWord');
  word.value = 'mursten'; word.oninput();
  assert.equal(a.context.document.getElementById('ownTranslation').value, 'цеглина');
  const base = a.context.document.getElementById('ownBase');
  base.value = 'en'; base.onchange();
  assert.equal(a.context.document.getElementById('ownTranslation').value, 'brick');
  a.context.document.getElementById('customWordForm').onsubmit({ preventDefault() {} });
  assert.equal(a.run('wordLibrary.data.favorites[0]'), 'lex:brick');
  assert.equal(a.run('Object.keys(wordLibrary.data.custom).length'), 0);
  assert.deepEqual(JSON.parse(a.run('JSON.stringify(state.libraryPair)')), { target: 'da', base: 'en' });
  assert.equal(a.run('state.settings.base'), 'uk');
  assert.equal(a.run('state.settings.dir'), 'prod');
});

test('cancelling the actual edit form creates a clean new draft rather than overwriting an old word', () => {
  const a = app();
  a.run("state.library.custom['user:custom'] = { words: { da: 'mit ord', en: 'my word' } }; registerOwnWords(); bindOwnWordForm({ target: 'da', base: 'en' }); beginOwnWordEdit('user:custom', { target: 'da', base: 'en' });");
  assert.equal(a.context.document.getElementById('saveOwnWord').textContent, 'Update');
  a.context.document.getElementById('cancelOwnEdit').onclick();
  assert.equal(a.context.document.getElementById('saveOwnWord').textContent, 'Save');
  assert.equal(a.context.document.getElementById('ownWord').value, '');
  assert.equal(a.run('wordLibrary.data.custom["user:custom"].words.da'), 'mit ord');
});
