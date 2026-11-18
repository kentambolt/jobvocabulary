'use strict';
// Scheduling changes never rewrite existing word levels or learning histories.
var LearningFlow = {
  nextDifficulty(difficulty, pool, cards, poolAt, learned) {
    if (!pool.length || !pool.every((word) => cards[word.id] && learned(cards[word.id]))) return null;
    const ids = new Set(pool.map((word) => word.id));
    for (let diff = difficulty + 1; diff <= 3; diff++) {
      const expanded = poolAt(diff);
      if (expanded.some((word) => !ids.has(word.id))) return { diff, pool: expanded };
    }
    return null;
  },
  select(pool, progress, learned, due, now, repeatLearned = true) {
    if (!pool.length) return null;
    const introduced = pool.filter((word) => progress.cards[word.id]);
    const active = introduced.filter((word) => !learned(progress.cards[word.id]));
    const fresh = pool.find((word) => !progress.cards[word.id]);
    const candidates = introduced.filter((word) => word.id !== progress.lastId || pool.length === 1);
    const mostDue = (words) => words.reduce((best, word) => {
      const urgency = due(progress.cards[word.id], progress, now);
      return !best || urgency > best.urgency ? { word, urgency } : best;
    }, null);
    const struggling = mostDue(candidates.filter((word) => !learned(progress.cards[word.id])));
    if (struggling && struggling.urgency >= 1) return { word: struggling.word, review: true, maintenance: false };
    const known = repeatLearned ? mostDue(candidates.filter((word) => learned(progress.cards[word.id]))) : null;
    const workRemaining = !!fresh || active.length > 0;
    // A backlog of familiar words must not block new vocabulary or cause a reset-like run.
    const sinceCheck = progress.task - (progress.lastLearnedReviewTask ?? progress.task);
    if (known && known.urgency >= 1 && (!workRemaining || sinceCheck >= 6)) return { word: known.word, review: true, maintenance: true };
    if (fresh) return { word: fresh, review: false, maintenance: false };
    if (active.length) return { word: struggling?.word || active[0], review: true, maintenance: false };
    const remaining = repeatLearned ? known?.word || introduced[0] : null;
    return remaining ? { word: remaining, review: true, maintenance: true } : null;
  }
};
if (typeof module !== 'undefined') module.exports = LearningFlow;
