'use strict';
// Personal lists store IDs, never duplicate the shared dictionary translations.
var WordLibrary = class WordLibrary {
  constructor(data = {}) {
    this.data = data;
    data.favorites = Array.isArray(data.favorites) ? [...new Set(data.favorites.filter((id) => typeof id === 'string'))] : [];
    data.lists = Array.isArray(data.lists) ? data.lists.filter((list) => list && typeof list.id === 'string' && typeof list.name === 'string' && Array.isArray(list.items)).map((list) => ({ id: list.id, name: list.name.slice(0, 60), items: [...new Set(list.items.filter((id) => typeof id === 'string'))] })) : [];
    data.custom = data.custom && typeof data.custom === 'object' && !Array.isArray(data.custom) ? data.custom : {};
  }
  static id() { return 'user:' + (globalThis.crypto?.randomUUID ? globalThis.crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).slice(2)); }
  static signature(words) {
    return JSON.stringify(['da', 'en', 'ru', 'uk'].filter((lang) => typeof words?.[lang] === 'string').map((lang) => [lang, words[lang].trim().normalize('NFC')]));
  }
  static isPhrase(words) {
    if (typeof words.da === 'string') return /\s/.test(words.da.trim().replace(/^(en|et|at)\s+/i, ''));
    return Object.values(words).some((value) => /\s/.test(value.trim()));
  }
  list(id) { return id === 'favorites' ? { id, name: '', items: this.data.favorites } : this.data.lists.find((list) => list.id === id); }
  createList(name) {
    const clean = name.trim().slice(0, 60);
    if (!clean) throw new Error('name');
    const existing = this.data.lists.find((list) => list.name.toLocaleLowerCase() === clean.toLocaleLowerCase());
    if (existing) return existing;
    const list = { id: WordLibrary.id(), name: clean, items: [] };
    this.data.lists.push(list);
    return list;
  }
  add(id, listId = 'favorites') {
    const list = this.list(listId);
    if (!list || !id) throw new Error('list');
    if (!list.items.includes(id)) list.items.push(id);
  }
  renameList(id, name) {
    const list = this.data.lists.find((entry) => entry.id === id);
    const clean = name.trim().slice(0, 60);
    if (!list || !clean) throw new Error('name');
    if (this.data.lists.some((entry) => entry.id !== id && entry.name.toLocaleLowerCase() === clean.toLocaleLowerCase())) throw new Error('duplicate');
    list.name = clean;
  }
  remove(id, listId = 'favorites') {
    const list = this.list(listId);
    if (list) list.items.splice(0, list.items.length, ...list.items.filter((item) => item !== id));
  }
  toggle(id) {
    if (this.data.favorites.includes(id)) { this.remove(id); return false; }
    this.add(id); return true;
  }
  remapReferences(resolve) {
    const remap = (items) => [...new Set(items.map(resolve))];
    this.data.favorites = remap(this.data.favorites);
    for (const list of this.data.lists) list.items = remap(list.items);
  }
  addCustom(words) {
    const allowed = ['da', 'en', 'ru', 'uk'];
    const clean = Object.fromEntries(allowed.filter((lang) => typeof words[lang] === 'string' && words[lang].trim()).map((lang) => [lang, words[lang].trim().slice(0, 300)]));
    if (Object.keys(clean).length < 2) throw new Error('translations');
    const existing = Object.entries(this.data.custom).find(([, item]) => WordLibrary.signature(item.words) === WordLibrary.signature(clean));
    if (existing) return existing[0];
    const id = WordLibrary.id();
    this.data.custom[id] = { words: clean, phrase: WordLibrary.isPhrase(clean) };
    return id;
  }
  mergeBackup(backup) {
    if (backup?.format !== 'jobvocabulary-library' || backup.version !== 1 || !backup.library || !Array.isArray(backup.library.favorites) || !Array.isArray(backup.library.lists)) throw new Error('format');
    const incoming = new WordLibrary(JSON.parse(JSON.stringify(backup.library)));
    // Validate the complete import before changing any existing personal data.
    if (incoming.data.lists.some((list) => !list.name.trim())) throw new Error('name');
    for (const [id, entry] of Object.entries(incoming.data.custom)) {
      if (!id.startsWith('user:') || !entry?.words || Object.entries(entry.words).length < 2 || Object.entries(entry.words).some(([lang, value]) => !['da','en','ru','uk'].includes(lang) || typeof value !== 'string' || !value.trim() || value.length > 300)) throw new Error('entry');
    }
    const idMap = new Map();
    for (const [id, entry] of Object.entries(incoming.data.custom)) {
      // A backup with a colliding ID must never overwrite a locally edited word.
      const existing = this.data.custom[id];
      const conflict = existing && Object.entries(entry.words).some(([lang, value]) => existing.words?.[lang] !== undefined && WordLibrary.signature({ [lang]: existing.words[lang] }) !== WordLibrary.signature({ [lang]: value }));
      let target;
      if (existing && !conflict) {
        existing.words = { ...entry.words, ...existing.words };
        target = id;
      } else {
        const same = Object.entries(this.data.custom).find(([, local]) => WordLibrary.signature(local.words) === WordLibrary.signature(entry.words));
        target = same?.[0] || (existing ? WordLibrary.id() : id);
        if (!this.data.custom[target]) this.data.custom[target] = entry;
      }
      idMap.set(id, target);
    }
    for (const id of incoming.data.favorites) this.add(idMap.get(id) || id);
    for (const entry of incoming.data.lists) {
      const list = this.createList(entry.name);
      for (const id of entry.items) this.add(idMap.get(id) || id, list.id);
    }
  }
};
if (typeof module !== 'undefined') module.exports = WordLibrary;
