const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const WordLibrary = require('../library');

test('one word can be liked and saved in several lists without duplicate records', () => {
  const library = new WordLibrary();
  const a = library.createList('Work');
  const b = library.createList('Travel');
  library.add('lex:word'); library.add('lex:word');
  library.add('lex:word', a.id); library.add('lex:word', b.id);
  library.remove('lex:word', a.id);
  assert.deepEqual(library.data.favorites, ['lex:word']);
  assert.deepEqual(b.items, ['lex:word']);
  assert.deepEqual(a.items, []);
  assert.equal(library.createList(' work ').id, a.id);
  const restored = new WordLibrary(JSON.parse(JSON.stringify(library.data)));
  assert.deepEqual(restored.data, library.data);
  restored.add('retired-id');
  restored.remapReferences((id) => id === 'retired-id' ? 'lex:word' : id);
  assert.deepEqual(restored.data.favorites, ['lex:word']);
});

test('custom entries require translations and are reused across lists', () => {
  const library = new WordLibrary();
  assert.throws(() => library.addCustom({ da: 'arbejde' }));
  const id = library.addCustom({ da: ' arbejdsdag ', en: 'working day' });
  assert.equal(library.addCustom({ da: 'arbejdsdag', en: 'working day' }), id);
  assert.equal(Object.keys(library.data.custom).length, 1);
  assert.equal(library.data.custom[id].words.da, 'arbejdsdag');
});

test('renaming a list keeps saved references and rejects ambiguous names atomically', () => {
  const library = new WordLibrary();
  const work = library.createList('Work');
  const travel = library.createList('Travel');
  library.add('lex:word', work.id);
  library.renameList(work.id, ' My job ');
  assert.equal(library.list(work.id).name, 'My job');
  assert.deepEqual(library.list(work.id).items, ['lex:word']);
  assert.throws(() => library.renameList(work.id, ' travel '), /duplicate/);
  assert.throws(() => library.renameList(work.id, '  '), /name/);
  assert.throws(() => library.renameList('favorites', 'Other'), /name/);
  assert.equal(library.list(work.id).name, 'My job');
  assert.equal(library.list(travel.id).name, 'Travel');
  library.renameList(work.id, 'MY JOB');
  const restored = new WordLibrary(JSON.parse(JSON.stringify(library.data)));
  assert.equal(restored.list(work.id).name, 'MY JOB');
  assert.deepEqual(restored.list(work.id).items, ['lex:word']);
});

test('backup import merges lists and preserves locally edited custom words', () => {
  const library = new WordLibrary();
  const original = library.addCustom({ da: 'ord', en: 'word' });
  library.add(original);
  const incoming = { format: 'jobvocabulary-library', version: 1, library: { favorites: [original], lists: [{ id: 'incoming', name: 'Work', items: [original] }], custom: { [original]: { words: { da: 'nyt ord', en: 'new word' }, phrase: true } } } };
  library.mergeBackup(incoming);
  assert.equal(library.data.custom[original].words.da, 'ord');
  assert.equal(Object.keys(library.data.custom).length, 2);
  const importedId = library.data.lists[0].items[0];
  assert.notEqual(importedId, original);
  assert.equal(library.data.custom[importedId].words.da, 'nyt ord');
  const before = JSON.stringify(library.data);
  assert.throws(() => library.mergeBackup({ ...incoming, library: { ...incoming.library, custom: { 'bad-id': { words: { da: 'x', en: 'y' } } } } }));
  assert.equal(JSON.stringify(library.data), before);
});

test('dictionary IDs survive translation corrections and keep homonyms separate', () => {
  const temporaryRoot = path.join(__dirname, '.tmp');
  fs.mkdirSync(temporaryRoot, { recursive: true });
  const directory = fs.mkdtempSync(path.join(temporaryRoot, 'jobvocabulary-lexicon-'));
  try {
    fs.mkdirSync(path.join(directory, 'data'));
    fs.mkdirSync(path.join(directory, 'packs'));
    fs.copyFileSync(path.join(__dirname, '../data/build-lexicon.js'), path.join(directory, 'data/build-lexicon.js'));
    const write = (translation, id = 'bank-seat', da = 'bænk') => fs.writeFileSync(path.join(directory, 'words.js'), 'module.exports = ' + JSON.stringify({ CONCEPTS: [{ id, words: { da, en: 'bench', ru: translation, uk: 'лава' } }, { id: 'bank-finance', words: { da: 'bank', en: 'bank', ru: 'банк', uk: 'банк' } }, { id: 'bank-river', words: { da: 'bred', en: 'bank', ru: 'берег', uk: 'берег' } }] }));
    const build = () => { execFileSync(process.execPath, [path.join(directory, 'data/build-lexicon.js')]); return JSON.parse(fs.readFileSync(path.join(directory, 'lexicon.json'), 'utf8')); };
    write('скамья'); const first = build();
    write('скамейка'); const second = build();
    assert.equal(first.entries[first.aliases['bank-seat']][0], second.entries[second.aliases['bank-seat']][0]);
    assert.notEqual(second.aliases['bank-finance'], second.aliases['bank-river']);
    const bytes = fs.readFileSync(path.join(directory, 'lexicon.json'), 'utf8');
    build(); assert.equal(fs.readFileSync(path.join(directory, 'lexicon.json'), 'utf8'), bytes);
    const retiredId = second.entries[second.aliases['bank-seat']][0];
    write('скамейка', 'bench-seat', 'en bænk');
    fs.writeFileSync(path.join(directory, 'data/lexicon-migrations.json'), JSON.stringify({ 'bank-seat': 'bench-seat' }));
    const renamed = build();
    assert.equal(renamed.aliases['bank-seat'], renamed.aliases['bench-seat']);
    assert.equal(renamed.aliases[retiredId], renamed.aliases['bench-seat']);
  } finally {
    const resolved = path.resolve(directory);
    assert.equal(path.dirname(resolved), path.resolve(temporaryRoot));
    assert.ok(path.basename(resolved).startsWith('jobvocabulary-lexicon-'));
    fs.rmSync(resolved, { recursive: true });
  }
});
