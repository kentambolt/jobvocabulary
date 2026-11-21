'use strict';
// Counts actions in this document's current course run, never unique learners.
// No storage, timers, device data, user identifiers or event properties.
var ActivationMeter = {
  create(send = () => {}) {
    let scope = null, answers = 0, graded = new WeakSet();
    const emit = event => {
      try { Promise.resolve(send(event)).catch(() => {}); } catch { /* Training must keep working. */ }
    };
    return {
      reset() { scope = null; answers = 0; graded = new WeakSet(); },
      start(nextScope) {
        if (scope === nextScope) return;
        scope = nextScope; answers = 0; graded = new WeakSet(); emit('course_started');
      },
      answer(task) {
        if (scope === null || !task || typeof task !== 'object' || graded.has(task)) return;
        graded.add(task); answers++;
        if (answers === 1) emit('first_answer');
        if (answers === 10) emit('ten_answers');
      }
    };
  }
};
if (typeof module !== 'undefined') module.exports = ActivationMeter;
