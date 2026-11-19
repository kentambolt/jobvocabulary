'use strict';
var WordEntry = class WordEntry {
  static norm(value) { return typeof value === 'string' ? value.trim().toLocaleLowerCase().normalize('NFC') : ''; }
  static parts(entry,lang) {
    const text=entry.words?.[lang] || '';
    const match=!entry.phrase && text.match(/^(.*?)\s+\(([^()]+)\)$/u);
    return match ? {text:match[1],detail:match[2]} : {text,detail:''};
  }
  static exact(entry, lang, value) {
    const word = WordEntry.norm(entry.words?.[lang]);
    const query = WordEntry.norm(value);
    if (!word || !query) return false;
    if (word === query) return true;
    const form=WordEntry.norm(WordEntry.parts(entry,lang).text);
    if (form===query) return true;
    return lang === 'da' && !entry.phrase && form.replace(/^(en|et|at)\s+(.+)$/, '$2') === query;
  }
  static search(entries, query, pair, limit = 20) {
    const q = WordEntry.norm(query);
    if (!q) return [];
    const exact = (entry) => Number(WordEntry.exact(entry, pair.target, query) || WordEntry.exact(entry, pair.base, query));
    return entries.filter((entry) => typeof entry?.id === 'string' && /^(lex:|user:)/.test(entry.id)
      && typeof entry.words?.[pair.target] === 'string' && entry.words[pair.target]
      && typeof entry.words?.[pair.base] === 'string' && entry.words[pair.base]
      && [pair.target, pair.base].some((lang) => WordEntry.norm(entry.words[lang]).includes(q)))
      .sort((a, b) => exact(b) - exact(a)).slice(0, limit);
  }
  constructor(entries, pair, editing = null) {
    this.entries = entries;
    this.target = pair.target; this.base = pair.base;
    this.editing = editing;
    this.word = editing?.words?.[this.target] || '';
    this.translation = editing?.words?.[this.base] || '';
    this.selectedId = null; this.matches = []; this.hint = '';
  }
  lookup() {
    this.selectedId = null;
    this.matches = WordEntry.search(this.entries, this.word, this, Number.MAX_SAFE_INTEGER)
      .filter((entry) => WordEntry.exact(entry, this.target, this.word));
    if (this.matches.length === 1) {
      this.selectedId = this.matches[0].id;
      this.translation = this.matches[0].words[this.base];
      this.hint = 'found';
    } else {
      this.translation = '';
      this.hint = !this.word.trim() ? '' : this.matches.length ? 'chooseMeaning' : 'notFound';
    }
  }
  setWord(value) {
    this.word = value;
    if (!this.editing) this.lookup();
  }
  setTranslation(value) {
    this.translation = value;
    const selected = this.entries.find((entry) => entry.id === this.selectedId);
    if (selected && !WordEntry.exact(selected, this.base, value)) { this.selectedId = null; this.hint = ''; }
  }
  select(id) {
    const entry = this.matches.find((candidate) => candidate.id === id);
    if (!entry) return;
    this.selectedId = id;
    this.word = entry.words[this.target];
    this.translation = entry.words[this.base];
    this.matches = []; this.hint = 'found';
  }
  setLanguage(field, lang) {
    if (!['target', 'base'].includes(field) || !['da', 'en', 'ru', 'uk', 'pl', 'ro'].includes(lang)) return;
    const before = { target: this.target, base: this.base };
    const other = field === 'target' ? 'base' : 'target';
    this[field] = lang;
    if (this[field] === this[other]) this[other] = before[field];
    if (this.editing) {
      this.word = this.editing.words[this.target] || '';
      this.translation = this.editing.words[this.base] || '';
      this.matches = []; this.hint = ''; return;
    }
    const selected = this.entries.find((entry) => entry.id === this.selectedId);
    if (selected?.words[this.target] && selected.words[this.base]) {
      this.word = selected.words[this.target]; this.translation = selected.words[this.base];
      this.matches = []; this.hint = 'found'; return;
    }
    if (this.target !== before.target) this.word = '';
    this.lookup();
  }
  knownId() {
    const matches = WordEntry.search(this.entries, this.word, this, Number.MAX_SAFE_INTEGER)
      .filter((entry) => WordEntry.exact(entry, this.target, this.word) && WordEntry.exact(entry, this.base, this.translation));
    return matches.find((entry) => entry.id === this.selectedId)?.id || (matches.length === 1 ? matches[0].id : null);
  }
};
if (typeof module !== 'undefined') module.exports = WordEntry;
