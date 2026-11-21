'use strict';
// Small shared reader: catalogue pages never load courses or the dictionary.
var PracticeResume = {
  languages: { da: 'Dansk', en: 'English', ru: 'Русский', uk: 'Українська', pl: 'Polski', ro: 'Română', lt:'Lietuvių', bg:'Български' },
  switchContext(search) {
    const params=new URLSearchParams(search);
    const target=params.get('target'),base=params.get('base');
    return Object.hasOwn(this.languages,target)&&Object.hasOwn(this.languages,base)?{target,base}:null;
  },
  startLink(context,pack,names) {
    if(!context||!names||typeof names!=='object'||!Object.hasOwn(this.languages,context.target)||!Object.hasOwn(this.languages,context.base)
      ||!Object.hasOwn(names,pack)||pack==='favorites'||!/^[a-z][a-z0-9]*$/.test(pack))return null;
    return '/?ui='+context.base+'#'+new URLSearchParams({start:pack,target:context.target,base:context.base});
  },
  read(storage) {
    try { return JSON.parse(storage.getItem('topwords.v2')); } catch { return null; }
  },
  describe(state, names) {
    const s = state?.settings;
    const languages = this.languages;
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
    } else title = s.starterPath === pack+'-first-steps' && Object.hasOwn(names,s.starterPath) ? names[s.starterPath] : Object.hasOwn(names, pack) ? names[pack] : null;
    return typeof title === 'string' && title ? { title, pair: `${languages[s.target]} / ${languages[s.base]}` } : null;
  }
};
if (typeof module !== 'undefined') module.exports = PracticeResume;
