'use strict';
// Shared daily counters, deliberately separate from Umami visitor/session tracking.
var AggregateTransport = {
  enabled: true,
  create({enabled = false, allowStaging = false, environment = globalThis} = {}) {
    const events = new Set(['course_started','first_answer','ten_answers']);
    const origin = environment.location?.origin;
    const project = origin === 'https://jobvocabulary.com' ? 'jobvocabulary'
      : allowStaging && ['http://127.0.0.1:8775','http://localhost:8775'].includes(origin) ? 'jobvocabulary-staging' : null;
    const pending = new Set();
    const policy = environment.MeasurementPolicy;
    policy?.subscribe(environment, () => { if (!policy.allows(environment)) for (const controller of pending) controller.abort(); });
    return event => {
      const nav=environment.navigator;
      if (!enabled || environment.TrafficMetrics?.enabled !== true || !project || !events.has(event) || !environment.MeasurementPolicy?.allows(environment) || nav?.globalPrivacyControl === true
        || ['1','yes'].includes(nav?.doNotTrack) || ['1','yes'].includes(environment.doNotTrack)) return;
      let timeout, controller;
      try {
        controller=new environment.AbortController();
        pending.add(controller);
        timeout=environment.setTimeout(()=>controller.abort(),2000);
        return Promise.resolve(environment.fetch('https://munthesystems.dk/systems/v1/aggregate',{
          method:'POST',headers:{'Content-Type':'application/json'},
          body:JSON.stringify({project,event}),credentials:'omit',referrerPolicy:'no-referrer',
          mode:'cors',keepalive:true,signal:controller.signal
        })).catch(()=>{}).finally(()=>{ pending.delete(controller); environment.clearTimeout(timeout); });
      } catch { if (controller) pending.delete(controller); if (timeout !== undefined) environment.clearTimeout(timeout); }
    };
  }
};
if (typeof module !== 'undefined') module.exports = AggregateTransport;
