const test = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const path = require('node:path');
const WordLibrary = require('../library');
const WordEntry = require('../word-entry');

function button(id) {
  return { dataset: { favoriteSource: id, previous: 'true', wordLabel: id }, attributes: {}, disabled: false, setAttribute(key, value) { this.attributes[key] = value; } };
}
function fixture() {
  const library = new WordLibrary();
  const elements = [];
  const context = vm.createContext({ WordEntry, wordLibrary: library, uiLang: () => 'en', t: (key) => key, saveState() {}, document: { querySelectorAll: () => elements } });
  vm.runInContext(fs.readFileSync(path.join(__dirname, '../library-ui.js'), 'utf8'), context);
  return { context, library, elements };
}

test('saving a previous answer retains the clicked source while the next task changes', async () => {
  const { context, library, elements } = fixture();
  let resolve;
  context.ready = new Promise((done) => { resolve = done; });
  vm.runInContext("loadDictionary = async () => { await ready; dictionaryData = { aliases: { 'source:previous': 'lex:previous' } }; };", context);
  const clicked = button('source:previous');
  context.clicked = clicked;
  vm.runInContext('bindFavoriteButton(clicked, clicked.dataset.favoriteSource, null)', context);
  const pending = clicked.onclick({ currentTarget: clicked });
  assert.equal(clicked.disabled, true);
  // Answering another task replaces both the receipt and current word controls.
  const latest = button('source:latest');
  elements.push(latest);
  resolve(); await pending;
  assert.deepEqual(library.data.favorites, ['lex:previous']);
  assert.equal(latest.textContent, undefined);
  assert.equal(clicked.disabled, false);
});

test('favourite controls for the same word stay in sync and failed loads can be retried', async () => {
  const { context, library, elements } = fixture();
  const previous = button('lex:word');
  const current = button('lex:word'); delete current.dataset.previous;
  elements.push(previous, current);
  const status = { isConnected: true, textContent: '' };
  Object.assign(context, { previous, status });
  vm.runInContext('loadDictionary = async () => { throw Error("offline"); }; bindFavoriteButton(previous, previous.dataset.favoriteSource, status);', context);
  await previous.onclick({ currentTarget: previous });
  assert.equal(previous.disabled, false);
  assert.equal(status.textContent, 'loadFail');
  assert.deepEqual(library.data.favorites, []);
  vm.runInContext('loadDictionary = async () => {};', context);
  await previous.onclick({ currentTarget: previous });
  assert.equal(previous.attributes['aria-pressed'], 'true');
  assert.equal(status.textContent, '');
  assert.equal(current.attributes['aria-pressed'], 'true');
  await previous.onclick({ currentTarget: previous });
  assert.equal(previous.attributes['aria-pressed'], 'false');
  assert.equal(current.attributes['aria-pressed'], 'false');
  assert.deepEqual(library.data.favorites, []);
});
