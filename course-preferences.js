'use strict';
// Course choices are independent of the temporary settings used for personal lists.
var CoursePreferences = {
  normalize(settings) {
    const langs = ['da', 'en', 'ru', 'uk', 'pl', 'ro', 'lt', 'bg'];
    if (!settings || !langs.includes(settings.target) || !langs.includes(settings.base)) return null;
    const pack = settings.pack || 'top';
    if (typeof pack !== 'string' || !/^[a-z][a-z0-9-]*$/.test(pack)) return null;
    const directions = pack === 'pics' || settings.base === settings.target ? ['path', 'rec', 'prod', 'write'] : ['rec', 'prod', 'write'];
    if (!directions.includes(settings.dir) || ![1, 2, 3].includes(settings.diff)) return null;
    const cats = Array.isArray(settings.cats) ? [...new Set(settings.cats.filter((cat) => typeof cat === 'string'))] : null;
    const options = typeof PracticeOptions !== 'undefined' ? PracticeOptions : require('./practice-options');
    return { pack, target: settings.target, base: settings.base, dir: settings.dir, diff: settings.diff, cats,
      ...(Array.isArray(settings.modes) ? { modes: options.modes(settings) } : {}),
      ...(typeof settings.repeatLearned === 'boolean' ? { repeatLearned: settings.repeatLearned } : {}) };
  },
  key(settings) { return `${settings.pack}|${settings.target}|${settings.base}`; },
  remember(state, settings = state.settings) {
    const clean = this.normalize(settings);
    if (!clean) return;
    if (!state.courseSettings || typeof state.courseSettings !== 'object' || Array.isArray(state.courseSettings)) state.courseSettings = {};
    const key = this.key(clean);
    state.courseSettings[key] = clean;
    state.lastCourseKey = key;
  },
  resolve(state, desired) {
    const defaults = this.normalize({ pack: desired.pack, target: desired.target, base: desired.base, dir: desired.pack === 'pics' || desired.target === desired.base ? 'path' : 'rec', diff: 1, cats: null });
    if (!defaults) return null;
    const key = this.key(defaults);
    const active = this.normalize(state.settings);
    const stored = this.normalize(state.courseSettings?.[key]);
    if (active && this.key(active) === key) return active;
    return stored && this.key(stored) === key ? stored : defaults;
  },
  last(state) { return this.normalize(state.courseSettings?.[state.lastCourseKey]); }
};
if (typeof module !== 'undefined') module.exports = CoursePreferences;
