'use strict';
// Shared daily counters, deliberately separate from Umami visitor/session tracking.
var AggregateTransport = {
  create({enabled = false, allowStaging = false, environment = globalThis} = {}) {
    const events = new Set(['course_started','first_answer','ten_answers']);
    const origin = environment.location?.origin;
    const project = origin === 'https://jobvocabulary.com' ? 'jobvocabulary'
      : allowStaging && ['http://127.0.0.1:8775','http://localhost:8775'].includes(origin) ? 'jobvocabulary-staging' : null;
    return event => {
      const nav=environment.navigator;
      if (!enabled || !project || !events.has(event) || nav?.globalPrivacyControl === true
        || ['1','yes'].includes(nav?.doNotTrack) || ['1','yes'].includes(environment.doNotTrack)) return;
      let timeout;
      try {
        const controller=new environment.AbortController();
        timeout=environment.setTimeout(()=>controller.abort(),2000);
        return Promise.resolve(environment.fetch('https://munthesystems.dk/systems/v1/aggregate',{
          method:'POST',headers:{'Content-Type':'application/json'},
          body:JSON.stringify({project,event}),credentials:'omit',referrerPolicy:'no-referrer',
          mode:'cors',keepalive:true,signal:controller.signal
        })).catch(()=>{}).finally(()=>environment.clearTimeout(timeout));
      } catch { if (timeout !== undefined) environment.clearTimeout(timeout); }
    };
  }
};
if (typeof module !== 'undefined') module.exports = AggregateTransport;
