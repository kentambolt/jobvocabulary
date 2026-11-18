'use strict';
var PracticeOptions = {
  allowed(settings) { return settings.pack === 'pics' || settings.target === settings.base ? ['path', 'rec', 'prod', 'write'] : ['rec', 'prod', 'write']; },
  modes(settings) {
    const allowed = this.allowed(settings);
    const selected = Array.isArray(settings.modes) ? allowed.filter((mode) => settings.modes.includes(mode)) : [];
    return selected.length ? selected : [allowed.includes(settings.dir) ? settings.dir : allowed[0]];
  },
  apply(settings) {
    const modes = this.modes(settings);
    return { ...settings, modes, dir: modes.includes(settings.dir) ? settings.dir : modes[0], repeatLearned: settings.repeatLearned !== false };
  },
  toggle(settings, mode) {
    const modes = this.modes(settings);
    if (!this.allowed(settings).includes(mode)) return this.apply(settings);
    const next = modes.includes(mode) ? modes.length > 1 ? modes.filter((item) => item !== mode) : modes : [...modes, mode];
    return this.apply({ ...settings, modes: next });
  },
  key(settings) { return JSON.stringify([settings.pack || 'top', settings.target, settings.base, this.modes(settings)]); }
};
if (typeof module !== 'undefined') module.exports = PracticeOptions;
