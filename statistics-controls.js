'use strict';
// Same controls and origin in the normal browser and Android TWA.
(() => {
  if (window.JobVocabularyMetrics) return;
  const source = document.currentScript;
  const preview = ['http://127.0.0.1:8775','http://localhost:8775'].includes(location.origin) && source?.dataset.preview === 'true';
  const staging = ['http://127.0.0.1:8775','http://localhost:8775'].includes(location.origin) && source?.dataset.staging === 'true';
  const enabled = TrafficMetrics.enabled;
  const metrics = TrafficMetrics.create({enabled:enabled && !preview,allowStaging:staging});
  let page = source?.dataset.page || 'home', fingerprint = '';
  const permanent = document.getElementById('statisticsControls');
  const notice = permanent || document.createElement('aside');
  notice.classList.add('statistics-choice');
  notice.dataset.statisticsControl = 'true';
  if (!permanent) {
    notice.classList.add('statistics-notice');
    notice.hidden = true;
    const anchor = document.querySelector('body > main') || document.getElementById('intro');
    if (anchor) { if (source?.dataset.app === 'true') anchor.after(notice); else anchor.before(notice); }
    else document.body.append(notice);
  }
  function language() { return StatisticsCopy[document.documentElement.lang] ? document.documentElement.lang : 'en'; }
  function render() {
    const lang = language(), text = StatisticsCopy[lang], choice = MeasurementPolicy.choice(window);
    const blocked = !preview && MeasurementPolicy.blocked(window);
    const eligible = !!MeasurementPolicy.project(window,staging) || preview;
    notice.hidden = !permanent && (!enabled || !eligible || blocked || choice !== null || (source?.dataset.app === 'true' && page !== 'home'));
    const next = JSON.stringify([lang,choice,blocked,enabled]);
    if (fingerprint === next) return;
    fingerprint = next;
    const focused = notice.contains(document.activeElement) ? document.activeElement.dataset.choice : null;
    notice.replaceChildren();
    const description = document.createElement('div');description.className = 'statistics-description';
    const title = document.createElement('h2');title.id = 'statisticsChoiceTitle';title.textContent = text.title;notice.setAttribute('aria-labelledby',title.id);description.append(title);
    const body = document.createElement('p');body.textContent = text.ask;description.append(body);
    if (permanent) {
      const status = document.createElement('p');status.className = 'statistics-state';status.setAttribute('role','status');
      status.textContent = !enabled ? text.off : blocked ? text.blocked : choice === 'granted' ? text.allowed : choice === 'denied' ? text.denied : text.unknown;
      const hint = document.createElement('p');hint.textContent = text.change;description.append(status,hint);
    } else {
      const link = document.createElement('a');link.href = '/' + lang + '/privacy/';link.textContent = text.details;description.append(link);
    }
    const buttons = document.createElement('div');buttons.className = 'statistics-actions';
    for (const [value,label] of [['denied',text.decline],['granted',text.accept]]) {
      const button = document.createElement('button');button.type = 'button';button.dataset.choice = value;button.textContent = label;button.disabled = blocked || !enabled;
      button.addEventListener('click',() => { MeasurementPolicy.choose(value,window); metrics.refresh(); render(); });buttons.append(button);
    }
    notice.append(description,buttons);
    if (focused) {
      const target = !notice.hidden ? notice.querySelector('[data-choice="' + focused + '"]') : document.querySelector('#app button, body > main a');
      target?.focus({preventScroll:true});
    }
  }
  window.JobVocabularyMetrics = Object.freeze({
    staging,
    page(next) { page = next; metrics.page(next); render(); }
  });
  document.addEventListener('pointerdown',event => {
    if (event.isTrusted && !event.target.closest?.('[data-statistics-control]')) metrics.used();
  },{passive:true});
  document.addEventListener('keydown',event => {
    if (event.isTrusted && !event.target.closest?.('[data-statistics-control]') && !['Tab','Shift','Control','Alt','Meta','Escape'].includes(event.key)) metrics.used();
  });
  window.addEventListener('storage',event => { if (event.key === MeasurementPolicy.key) { metrics.refresh(); render(); } });
  new MutationObserver(render).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
  if (source?.dataset.app !== 'true') metrics.page(page);
  render();
})();
