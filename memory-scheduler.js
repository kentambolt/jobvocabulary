'use strict';
// FSRS-6 from the pinned ts-fsrs 5.4.2 distribution. All state stays local.
var MemoryScheduler = (() => {
  const engine = typeof FSRS !== 'undefined' ? FSRS : require('./vendor/ts-fsrs-5.4.2');
  const DAY = 86400000, MINUTE = 60000, SESSION_IDLE = 30 * MINUTE;
  const schedulers = new Map();
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const number = (value, fallback = 0) => Number.isFinite(value) ? value : fallback;
  const scheduler = (word) => {
    const retention = word?.diff === 1 ? 0.92 : 0.9;
    if (!schedulers.has(retention)) schedulers.set(retention, engine.fsrs({ request_retention: retention, maximum_interval: 365, enable_fuzz: false, enable_short_term: true, learning_steps: [], relearning_steps: [] }));
    return schedulers.get(retention);
  };
  function pack(card, extra = {}) {
    return { v: 1, due: +card.due, s: card.stability, d: card.difficulty, state: card.state, reps: card.reps, lapses: card.lapses, scheduled: card.scheduled_days, elapsed: card.elapsed_days, step: card.learning_steps, last: card.last_review ? +card.last_review : null, log: [], ...extra };
  }
  function valid(m) {
    return m && m.v === 1 && Number.isFinite(m.due) && Number.isFinite(m.s) && m.s >= 0 && Number.isFinite(m.d) && m.d >= 0 && m.d <= 10 && Number.isInteger(m.state) && m.state >= 0 && m.state <= 3 && Number.isFinite(m.reps) && m.reps >= 0 && (m.last === null || Number.isFinite(m.last)) && Array.isArray(m.log);
  }
  function ensure(card, now) {
    if (valid(card.memory)) return card.memory;
    const observed = number(card.right) + number(card.wrong);
    const last = clamp(number(card.time, now), 0, now);
    if (!observed && !card.verify) {
      card.memory = pack(engine.createEmptyCard(new Date(last)), { due: last + 90 * 1000, retry: last + 90 * 1000 });
    } else {
      // Legacy counters seed an estimate, never fabricated review events.
      const accuracy = (number(card.right) + 1) / (observed + 2);
      const stability = clamp(Math.pow(1.8, clamp(number(card.lvl), 0, 12)) * Math.max(0.2, accuracy), 0.2, 30);
      card.memory = { v: 1, s: stability, d: clamp(8 - 6 * accuracy, 1, 10), state: engine.State.Review, reps: observed, lapses: number(card.wrong), scheduled: Math.max(1, Math.round(stability)), elapsed: 0, step: 0, last, due: last + Math.max(1, Math.round(stability)) * DAY, log: [], estimated: true };
      if (!card.ok) card.memory.retry = last + 90 * 1000;
    }
    return card.memory;
  }
  function hydrate(m) {
    return { due: new Date(m.due), stability: m.s, difficulty: m.d, state: m.state, reps: m.reps, lapses: number(m.lapses), scheduled_days: number(m.scheduled), elapsed_days: number(m.elapsed), learning_steps: number(m.step), ...(m.last !== null ? { last_review: new Date(m.last) } : {}) };
  }
  function review(card, correct, now, { word, learned = true, evidence = 1, rng = Math.random } = {}) {
    // A new answer starts empty, not from counters incremented for that answer.
    const previous = card.memory ? ensure(card, now) : null;
    const input = previous ? hydrate(previous) : engine.createEmptyCard(new Date(now));
    if (input.last_review && +input.last_review > now) input.last_review = new Date(now);
    const rating = correct ? engine.Rating.Good : engine.Rating.Again;
    const result = scheduler(word).next(input, new Date(now), rating).card;
    const interval = clamp((+result.due - now) * (0.85 + clamp(rng(), 0, 1) * 0.3), MINUTE, 365 * DAY);
    const log = [...(previous?.log || []), [Math.floor(now / 1000), rating, evidence]].slice(-8);
    card.memory = pack(result, { due: now + interval, log, ...(previous?.estimated ? { estimated: true } : {}) });
    if (!learned) card.memory.retry = now + (correct ? 5 * MINUTE : 90 * 1000);
    return card.memory;
  }
  function expose(card, now) {
    card.memory = pack(engine.createEmptyCard(new Date(now)), { due: now + 90 * 1000, retry: now + 90 * 1000, log: [[Math.floor(now / 1000), 0, 0]] });
  }
  function dueAt(card, learned, now) {
    const m = ensure(card, now);
    return learned ? m.due : Math.min(m.due, number(m.retry, m.due));
  }
  function session(state, settings, now) {
    const key = JSON.stringify([settings.pack || 'top', settings.target, settings.base]);
    if (!state.studySessions || typeof state.studySessions !== 'object' || Array.isArray(state.studySessions)) state.studySessions = {};
    if (state.studySession?.key) { state.studySessions[state.studySession.key] ||= state.studySession; delete state.studySession; }
    for (const [scope, value] of Object.entries(state.studySessions)) if (!value || !Number.isFinite(value.last) || now - value.last >= SESSION_IDLE || now < value.last) delete state.studySessions[scope];
    let s = state.studySessions[key];
    if (!s || s.key !== key || !s.counts || typeof s.counts !== 'object' || Array.isArray(s.counts) || !Array.isArray(s.recent) || !s.recent.every(item => item && typeof item.id === 'string' && Number.isFinite(item.at))) s = state.studySessions[key] = { key, last: now, counts: {}, recent: [] };
    s.limit = Math.max(3, (Array.isArray(settings.modes) ? settings.modes.length : 1) + 1);
    return s;
  }
  function record(session, id, now) {
    session.last = now;
    session.counts[id] = (session.counts[id] || 0) + 1;
    session.recent = [...session.recent.filter(item => item.id !== id), { id, at: now }].slice(-8);
  }
  function availableAt(word, card, learned, now, { session, poolSize, repeatLearned = true } = {}) {
    if (card && learned(card) && !repeatLearned) return Infinity;
    let at = card ? dueAt(card, learned(card), now) : now;
    if (session) {
      if ((session.counts[word.id] || 0) >= session.limit) at = Math.max(at, session.last + SESSION_IDLE);
      const index = session.recent.findIndex(item => item.id === word.id);
      if (index >= 0 && session.recent.length - 1 - index < Math.min(8, Math.max(0, poolSize - 1))) at = Math.max(at, session.recent[index].at + 2 * MINUTE);
    }
    return at;
  }
  return { DAY, MINUTE, SESSION_IDLE, ensure, review, expose, dueAt, session, record, availableAt, valid };
})();
if (typeof module !== 'undefined') module.exports = MemoryScheduler;
