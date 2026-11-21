const fs = require('node:fs');
const assert = require('node:assert/strict');
const path = require('node:path');
const vm = require('node:vm');
const words = require('../../words');
const WordLibrary = require('../../library');
const LearningFlow = require('../../learning-flow');
const CoursePreferences = require('../../course-preferences');
const WordEntry = require('../../word-entry');
const PracticeOptions = require('../../practice-options');
const MemoryScheduler = require('../../memory-scheduler');
const CourseKnowledge = require('../../course-knowledge');

// Run the real app model and answer handlers with inert rendering/storage surfaces.
// This exercises persisted progress, not a second implementation of the scheduler.
function app(settings = { target: 'da', base: 'en', pack: 'top', dir: 'rec', diff: 1 }, options = {}) {
  const elements = new Map();
  const storage = new Map([['topwords.v2', options.rawState ?? JSON.stringify(options.initialState ?? { settings, sound: false })]]);
  const location = { hash: options.hash || '', pathname: '/', search: options.search || '' };
  const navigate = (url) => { const next = new URL(url, 'http://app.test'); Object.assign(location, { hash: next.hash, pathname: next.pathname, search: next.search }); };
  const events = new Map();
  const clock = { now: options.now ?? Date.now() };
  const ClockDate = class extends Date { constructor(...args) { super(...(args.length ? args : [clock.now])); } static now() { return clock.now; } };
  const context = vm.createContext({
    ...words, WordLibrary, LearningFlow, CoursePreferences, WordEntry, PracticeOptions, MemoryScheduler, CourseKnowledge, StarterPaths: require('../../starter-paths'), AggregateTransport: require('../../aggregate-transport'), ActivationMeter: {create:()=>require('../../activation-meter').create(options.sendActivation)}, EXTRA_LOCALES: require('../../locales'), Date: ClockDate,
    COURSE_CATALOG: require('../../catalog'),
    localStorage: { getItem: (key) => storage.get(key) ?? null, setItem: (key, value) => storage.set(key, value) },
    navigator: { language: 'en' }, location, URLSearchParams,
    history: { pushState(_state, _title, url) { navigate(url); }, replaceState(_state, _title, url) { navigate(url); } },
    window: { addEventListener(name, callback) { events.set(name, callback); }, scrollTo() {} },
    document: { addEventListener(name, callback) { events.set('document:' + name, callback); }, querySelector() { return null; }, getElementById(id) { if (!elements.has(id)) elements.set(id, { querySelectorAll: () => [], focus() {}, showModal() { this.open = true; }, close() { this.open = false; } }); return elements.get(id); } },
    clearTimeout() {}, setTimeout() { return 0; }, console,
  });
  vm.runInContext(fs.readFileSync(path.join(__dirname, '../../packs/index.js'), 'utf8'), context);
  vm.runInContext(fs.readFileSync(path.join(__dirname, '../../library-ui.js'), 'utf8'), context);
  const source = fs.readFileSync(path.join(__dirname, '../../app.js'), 'utf8');
  assert.match(source, /\nrender\(\);\s*$/);
  vm.runInContext(source.replace(/\nrender\(\);\s*$/, ''), context);
  vm.runInContext('renderPlayView = () => {}; updateScore = () => {};', context);
  if (options.stubSpeech !== false) vm.runInContext('speakTarget = () => {};', context);
  return { context, storage, events, clock, run: (code) => vm.runInContext(code, context) };
}
module.exports = app;
