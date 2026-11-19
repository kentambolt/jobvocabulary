// Synthetic behaviour, not evidence of real learners' retention. No user data.
const fs = require('node:fs');
const path = require('node:path');
const Flow = require('../learning-flow');
const Memory = require('../memory-scheduler');
const Legacy = require('./baselines/learning-flow-9036583.cjs');
const app = require('../tests/helpers/app.cjs');
const START = Date.UTC(2026, 10, 18, 8);
const learned = card => card.ok && card.lvl >= 2;
function seeded(seed) {
  return () => { let value = seed += 0x6D2B79F5; value = Math.imul(value ^ value >>> 15, value | 1); value ^= value + Math.imul(value ^ value >>> 7, value | 61); return ((value ^ value >>> 14) >>> 0) / 4294967296; };
}
function outcome(seed, id, attempt) {
  let hash = seed;
  for (const char of id + ':' + attempt) hash = Math.imul(hash ^ char.charCodeAt(0), 16777619);
  return seeded(hash)();
}
const personas = {
  confident: () => 1,
  gradual: (_index, attempt) => [0.35, 0.65, 0.85][Math.min(attempt, 2)],
  uneven: (index, attempt) => index % 8 === 0 ? 0 : attempt ? 0.95 : 0.85,
  beginner: (_index, attempt) => [0.2, 0.5, 0.75, 0.9][Math.min(attempt, 3)]
};
function run({ pool, persona = 'confident', seed = 1, legacy = false, tasks = 100, days = 1, dailyTasks = tasks, secondsPerTask = 4 }) {
  const rng = seeded(seed), state = {}, settings = { pack: 'top', target: 'ru', base: 'da' };
  const progress = { cards: {}, task: 0, lastLearnedReviewTask: 0 }, attempts = {}, visits = {}, selections = [];
  const groups = { fresh: 0, struggling: 0, review: 0 };
  const indices = new Map(pool.map((word, index) => [word.id, index]));
  let maxReviewsInRow = 0, reviewsInRow = 0, pauses = 0;
  for (let day = 0; day < days; day++) {
    let now = START + day * Memory.DAY;
    reviewsInRow = 0;
    for (let turn = 0; turn < dailyTasks && selections.length < tasks; turn++) {
      const session = legacy ? null : Memory.session(state, settings, now);
      const selected = legacy ? Legacy.select(pool, progress, learned, (card, p, time) => (p.task - card.task) / Math.pow(2, card.lvl) + (time - card.time) / (600000 * Math.pow(2, card.lvl)), now) : Flow.select(pool, progress, learned, now, { session, rng });
      if (!selected) { pauses++; break; }
      const word = selected.word, id = word.id, attempt = attempts[id] || 0;
      const correct = outcome(seed, id, attempt) < personas[persona](indices.get(id), attempt);
      const group = selected.group || (!selected.review ? 'fresh' : selected.maintenance ? 'review' : 'struggling');
      groups[group]++;
      reviewsInRow = group === 'fresh' ? 0 : reviewsInRow + 1;
      maxReviewsInRow = Math.max(maxReviewsInRow, reviewsInRow);
      let card = progress.cards[id];
      if (!card) card = progress.cards[id] = { lvl: correct ? 3 : 0, ok: correct, verify: correct, right: correct ? 1 : 0, wrong: correct ? 0 : 1, task: progress.task, time: now };
      else {
        if (!legacy) Memory.ensure(card, now);
        card.lvl = card.verify ? correct ? card.lvl + 1 : 0 : correct ? card.lvl + 1 : Math.max(0, card.lvl - 1);
        card.verify = false; card.ok = correct; card[correct ? 'right' : 'wrong']++; card.task = progress.task; card.time = now;
      }
      if (!legacy) { Memory.review(card, correct, now, { word, learned: learned(card), rng }); Memory.record(session, id, now); }
      progress.task++; progress.lastId = id;
      if (selected.maintenance) progress.lastLearnedReviewTask = progress.task;
      attempts[id] = attempt + 1;
      visits[id] = [...(visits[id] || []), now];
      selections.push({ id, at: now, correct, group });
      now += secondsPerTask * 1000;
    }
  }
  return { summary: { questions: selections.length, uniqueWords: Object.keys(attempts).length, repeatQuestions: selections.length - Object.keys(attempts).length, maxWordAppearances: Math.max(0, ...Object.values(attempts)), maxReviewsInRow, groups, pauses }, selections, progress, visits, state };
}
function report() {
  const fixture = app({ pack: 'top', target: 'ru', base: 'da', dir: 'rec', diff: 1 });
  const pool = JSON.parse(fixture.run('JSON.stringify(buildPool(state.settings).slice(0, 120))'));
  const sessions = {};
  for (const persona of Object.keys(personas)) {
    const results = [];
    for (let seed = 1; seed <= 30; seed++) results.push({ seed, before: run({ pool, persona, seed, legacy: true }).summary, after: run({ pool, persona, seed }).summary });
    const average = (version, key) => +(results.reduce((total, result) => total + result[version][key], 0) / results.length).toFixed(2);
    sessions[persona] = { before: { uniqueWords: average('before', 'uniqueWords'), repeatQuestions: average('before', 'repeatQuestions'), maxWordAppearances: average('before', 'maxWordAppearances') }, after: { uniqueWords: average('after', 'uniqueWords'), repeatQuestions: average('after', 'repeatQuestions'), maxWordAppearances: average('after', 'maxWordAppearances') }, seeds: results };
  }
  const longTerm = Object.fromEntries(Object.keys(personas).map(persona => {
    const result = run({ pool, persona, seed: 42, days: 365, dailyTasks: 20, tasks: 7300 });
    return [persona, { ...result.summary, wordsReviewedAtLeastTwice: Object.values(result.visits).filter(times => times.length >= 2).length }];
  }));
  const patterns = [[1,1,1,1,1,1,1], [0,0,1,0,1,0,1], [0,0,0,0,0,0,0]];
  const intervals = patterns.map(pattern => {
    const card = { lvl: 0, right: 0, wrong: 0 };
    [0, 1, 3, 8, 20, 60, 120].forEach((day, index) => Memory.review(card, !!pattern[index], START + day * Memory.DAY, { word: { diff: 1 }, learned: !!pattern[index], rng: () => 0.5 }));
    return { answers: pattern.join(''), nextModelIntervalDays: +( (card.memory.due - card.memory.last) / Memory.DAY).toFixed(2), retryAfterSeconds: card.memory.retry ? (card.memory.retry - card.memory.last) / 1000 : null };
  });
  const output = { synthetic: true, baselineCommit: '9036583', fsrsPackage: 'ts-fsrs@5.4.2 (FSRS-6)', scope: 'First 120 actual Russian easy words; 100 answers at four seconds per question; 30 fixed seeds per persona. Outcomes are reproducible per word/attempt, independently of scheduler randomness.', inputWords: pool.map(({ id, diff }) => ({ id, diff })), sessions, longTerm, intervals };
  fs.mkdirSync(path.join(__dirname, 'reports'), { recursive: true });
  fs.writeFileSync(path.join(__dirname, 'reports/learning-simulation.json'), JSON.stringify(output, null, 2) + '\n');
  console.log(JSON.stringify({ sessions: Object.fromEntries(Object.entries(sessions).map(([name, value]) => [name, { before: value.before, after: value.after }])), longTerm, intervals }, null, 2));
  return output;
}
if (require.main === module) report();
module.exports = { run, seeded, START, learned, report };
