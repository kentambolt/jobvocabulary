'use strict';
var LearningFlow = (() => {
  const memory = typeof MemoryScheduler !== 'undefined' ? MemoryScheduler : require('./memory-scheduler');
  const random = rng => Math.min(0.999999999, Math.max(0, rng()));
  const draw = (items, weight, rng) => {
    const weights = items.map(weight), total = weights.reduce((a, b) => a + b, 0);
    let point = random(rng) * total;
    for (let i = 0; i < items.length; i++) { point -= weights[i]; if (point <= 0) return items[i]; }
    return items[items.length - 1];
  };
  const shuffle = (items, rng) => {
    for (let i = items.length - 1; i > 0; i--) { const j = Math.floor(random(rng) * (i + 1)); [items[i], items[j]] = [items[j], items[i]]; }
    return items;
  };
  return {
    nextDifficulty(difficulty, pool, cards, poolAt, learned) {
      if (!pool.length || !pool.every(word => cards[word.id] && learned(cards[word.id]))) return null;
      const ids = new Set(pool.map(word => word.id));
      for (let diff = difficulty + 1; diff <= 3; diff++) {
        const expanded = poolAt(diff);
        if (expanded.some(word => !ids.has(word.id))) return { diff, pool: expanded };
      }
      return null;
    },
    nextAt(pool, progress, learned, now, options = {}) {
      return pool.reduce((at, word) => Math.min(at, memory.availableAt(word, progress.cards[word.id], learned, now, { ...options, poolSize: pool.length })), Infinity);
    },
    select(pool, progress, learned, now, options = {}) {
      if (!pool.length) return null;
      const rng = options.rng || Math.random;
      const scope = progress.reviewScope || '';
      if (!progress.mix || progress.mix.scope !== scope || !Array.isArray(progress.mix.bag) || !Array.isArray(progress.mix.history)) progress.mix = { scope, bag: [], history: [], newCount: 0, reviewCount: 0, struggleCount: 0 };
      const mix = progress.mix, groups = { fresh: [], struggling: [], review: [] };
      for (const word of pool) {
        const card = progress.cards[word.id];
        if (memory.availableAt(word, card, learned, now, { ...options, poolSize: pool.length }) > now) continue;
        groups[!card ? 'fresh' : learned(card) ? 'review' : 'struggling'].push(word);
      }
      if (!Object.values(groups).some(items => items.length)) return null;
      if (!mix.bag.length) mix.bag = shuffle(['fresh', 'fresh', 'fresh', 'fresh', 'fresh', 'fresh', 'fresh', 'struggling', 'struggling', 'review'], rng);
      let group = mix.bag.pop();
      if (groups.fresh.length && group !== 'fresh' && mix.history.slice(-2).length === 2 && mix.history.slice(-2).every(type => type !== 'fresh')) group = 'fresh';
      if (!groups[group].length) group = groups.fresh.length ? 'fresh' : groups.struggling.length ? 'struggling' : 'review';
      let word;
      if (group === 'fresh') {
        // Every tenth introduction advances the oldest unseen word in the window.
        word = mix.newCount++ % 10 === 0 ? groups.fresh[0] : draw(groups.fresh.slice(0, 20), (_word, index) => 1 / Math.sqrt(index + 2), rng);
      } else {
        const candidates = groups[group];
        const due = word => memory.dueAt(progress.cards[word.id], learned(progress.cards[word.id]), now);
        const counter = group === 'review' ? 'reviewCount' : 'struggleCount';
        mix[counter] = mix[counter] || 0;
        word = mix[counter]++ % 3 === 0 ? candidates.reduce((oldest, item) => due(item) < due(oldest) ? item : oldest) : draw(candidates, item => {
          const card = progress.cards[item.id], m = memory.ensure(card, now);
          const overdue = Math.max(0, now - due(item)) / Math.max(memory.MINUTE, m.due - (m.last || now));
          return (1 + Math.min(20, overdue)) * (1 + Math.min(2, (card.wrong || 0) / ((card.right || 0) + 1))) * (item.diff === 1 ? 1.15 : 1);
        }, rng);
      }
      mix.history = [...mix.history, group].slice(-10);
      return { word, review: group !== 'fresh', maintenance: group === 'review', group };
    }
  };
})();
if (typeof module !== 'undefined') module.exports = LearningFlow;
