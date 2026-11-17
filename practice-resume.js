'use strict';
// Small shared reader: catalogue pages never load courses or the dictionary.
var PracticeResume = {
  read(storage) {
    try { return JSON.parse(storage.getItem('topwords.v2')); } catch { return null; }
  },
  describe(state, names) {
    const s = state?.settings;
    const languages = { da: 'Dansk', en: 'English', ru: 'Русский', uk: 'Українська' };
    if (!s || !Object.hasOwn(languages, s.target) || !Object.hasOwn(languages, s.base) || !['rec', 'prod', 'write', 'path'].includes(s.dir)) return null;
    const pack = s.pack || 'top';
    let title;
    if (typeof pack !== 'string') return null;
    if (pack.startsWith('list:')) {
      const id = pack.slice(5);
      if (id === 'favorites') {
        if (!Array.isArray(state.library?.favorites) || !state.library.favorites.length) return null;
        title = names.favorites;
      } else {
        const list = Array.isArray(state.library?.lists) && state.library.lists.find((entry) => entry?.id === id);
        if (!list || typeof list.name !== 'string' || !list.name.trim() || !Array.isArray(list.items) || !list.items.length) return null;
        title = list.name;
      }
    } else title = Object.hasOwn(names, pack) ? names[pack] : null;
    return typeof title === 'string' && title ? { title, pair: `${languages[s.target]} ← ${languages[s.base]}` } : null;
  }
};
if (typeof module !== 'undefined') module.exports = PracticeResume;
