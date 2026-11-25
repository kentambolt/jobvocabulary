'use strict';
// Existing Systems contract. Event IDs are disposable delivery IDs, never visitor IDs.
var TrafficMetrics = {
  enabled: true,
  create({enabled = false, allowStaging = false, environment = globalThis, policy = environment.MeasurementPolicy} = {}) {
    const project = policy?.project(environment, allowStaging);
    const pages = new Set(['home','catalog','test']);
    let page = 'home', initialized = false, transition = 0, sentTransition = -1, used = false, destroyed = false;
    const pending = new Set();
    const visible = () => !environment.document?.hidden;
    const allowed = () => enabled && initialized && !destroyed && !!project && visible() && policy?.allows(environment);
    function send(type) {
      if (!allowed()) return;
      let controller, timeout;
      try {
        const id = environment.crypto.randomUUID();
        controller = new environment.AbortController();
        pending.add(controller);
        timeout = environment.setTimeout(() => controller.abort(), 2000);
        return Promise.resolve(environment.fetch('https://munthesystems.dk/systems/v1/events?project=' + project, {
          method:'POST',headers:{'Content-Type':'application/json'},
          body:JSON.stringify({id,type,page}),mode:'cors',credentials:'omit',referrerPolicy:'no-referrer',
          keepalive:true,signal:controller.signal
        })).catch(() => {}).finally(() => { pending.delete(controller); environment.clearTimeout(timeout); });
      } catch { if (controller) pending.delete(controller); if (timeout !== undefined) environment.clearTimeout(timeout); }
    }
    function refresh() {
      if (!allowed()) { for (const controller of pending) controller.abort(); return; }
      if (sentTransition !== transition) { sentTransition = transition; send('pageview'); }
    }
    const onVisibility = () => refresh();
    const onPreference = event => { if (!event || event.key === policy?.key) refresh(); };
    environment.document?.addEventListener('visibilitychange', onVisibility);
    environment.addEventListener?.('storage', onPreference);
    const interval = enabled && project ? environment.setInterval(() => {
      if (allowed()) { refresh(); send('heartbeat'); } else refresh();
    }, 60000) : null;
    return {
      page(next) {
        if (destroyed || !pages.has(next)) return;
        initialized = true;
        if (page !== next) { page = next; transition++; }
        refresh();
      },
      used() { if (!used && allowed()) { used = true; refresh(); send('used'); } },
      refresh,
      destroy() {
        destroyed = true;
        if (interval !== null) environment.clearInterval(interval);
        for (const controller of pending) controller.abort();
        pending.clear();
        environment.document?.removeEventListener('visibilitychange', onVisibility);
        environment.removeEventListener?.('storage', onPreference);
      }
    };
  }
};
if (typeof module !== 'undefined') module.exports = TrafficMetrics;
