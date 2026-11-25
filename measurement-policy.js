'use strict';
// Only a versioned consent preference is stored. Never a visitor or device ID.
var MeasurementPolicy = {
  key: 'jobvocabulary.statistics.v1',
  deniedInMemory: new WeakSet(),
  listeners: new WeakMap(),
  notify(environment) { for (const listener of this.listeners.get(environment) || []) listener(); },
  subscribe(environment, listener) {
    if (!this.listeners.has(environment)) this.listeners.set(environment,new Set());
    this.listeners.get(environment).add(listener);
    const storage = event => { if (event.key === this.key) listener(); };
    environment.addEventListener?.('storage',storage);
    return () => { this.listeners.get(environment)?.delete(listener); environment.removeEventListener?.('storage',storage); };
  },
  maxAge: 180 * 86400000,
  choice(environment = globalThis) {
    if (this.deniedInMemory.has(environment)) return 'denied';
    try {
      const value = JSON.parse(environment.localStorage.getItem(this.key));
      const now = (environment.Date || Date).now();
      return value?.version === 1 && ['granted','denied'].includes(value.choice)
        && Number.isFinite(value.at) && value.at <= now && now - value.at < this.maxAge ? value.choice : null;
    } catch { return null; }
  },
  choose(choice, environment = globalThis) {
    if (!['granted','denied'].includes(choice)) return false;
    const value = {version:1,choice,at:(environment.Date || Date).now()};
    try { environment.localStorage.setItem(this.key, JSON.stringify(value)); this.deniedInMemory.delete(environment); }
    catch { this.deniedInMemory.add(environment); this.notify(environment); return false; } // Fail closed if a privacy preference cannot be remembered.
    this.notify(environment);
    return true;
  },
  blocked(environment = globalThis) {
    const nav = environment.navigator || {};
    const document = environment.document;
    if (nav.globalPrivacyControl === true || ['1','yes'].includes(nav.doNotTrack)
      || ['1','yes'].includes(environment.doNotTrack) || nav.webdriver === true
      || /bot|crawler|spider|headless|lighthouse|facebookexternalhit|slurp/i.test(nav.userAgent || '')
      || document?.prerendering || document?.visibilityState === 'prerender'
      || environment.__JOBVOCABULARY_CAPTURE__ === true) return true;
    try {
      const query = new URLSearchParams(environment.location?.search || '');
      if (['preview','capture','qa','systems_capture'].some(key => query.has(key))
        || query.get('analytics') === 'off') return true;
    } catch { return true; }
    return false;
  },
  project(environment = globalThis, allowStaging = false) {
    const origin = environment.location?.origin;
    if (origin === 'https://jobvocabulary.com') return 'jobvocabulary';
    return allowStaging && ['http://127.0.0.1:8775','http://localhost:8775'].includes(origin)
      ? 'jobvocabulary-staging' : null;
  },
  allows(environment = globalThis) {
    return !this.blocked(environment) && this.choice(environment) === 'granted';
  }
};
if (typeof module !== 'undefined') module.exports = MeasurementPolicy;
