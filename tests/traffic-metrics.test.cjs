const test=require('node:test');
const assert=require('node:assert/strict');
const Policy=require('../measurement-policy');
const Metrics=require('../traffic-metrics');
const Aggregate=require('../aggregate-transport');
function fixture(origin='https://jobvocabulary.com') {
 const calls=[],listeners={},docListeners={},intervals=[],timers=[],data=new Map();
 const environment={location:{origin,search:''},navigator:{userAgent:'a normal browser'},MeasurementPolicy:Policy,TrafficMetrics:require('../traffic-metrics'),
  document:{hidden:false,visibilityState:'visible',addEventListener:(t,f)=>docListeners[t]=f,removeEventListener:t=>delete docListeners[t]},
  addEventListener:(t,f)=>listeners[t]=f,removeEventListener:t=>delete listeners[t],
  localStorage:{getItem:k=>data.get(k)||null,setItem:(k,v)=>data.set(k,v)},crypto:require('node:crypto'),AbortController,
  setTimeout:f=>{timers.push(f);return timers.length;},clearTimeout:()=>{},
  setInterval:f=>{intervals.push(f);return intervals.length;},clearInterval:()=>{},
  fetch:(url,options)=>{calls.push({url,options,body:JSON.parse(options.body)});return Promise.resolve({status:202});}};
 return {calls,environment,listeners,docListeners,intervals,timers,data};
}
function client(f,options={}){return Metrics.create({enabled:true,environment:f.environment,...options});}
function grant(f){assert.equal(Policy.choose('granted',f.environment),true);}

test('nothing is sent before explicit consent; consent does not replay earlier views or interactions',()=>{
 const f=fixture(),m=client(f);m.page('home');m.used();m.page('test');f.intervals[0]();assert.equal(f.calls.length,0);
 grant(f);m.refresh();assert.deepEqual(f.calls.map(x=>[x.body.type,x.body.page]),[['pageview','test']]);
 m.used();m.used();assert.deepEqual(f.calls.map(x=>x.body.type),['pageview','used']);
 m.refresh();Policy.choose('denied',f.environment);m.refresh();grant(f);m.refresh();assert.equal(f.calls.length,2);
 assert.deepEqual([...f.data.keys()],[Policy.key]);assert.deepEqual(Object.keys(JSON.parse(f.data.get(Policy.key))),['version','choice','at']);
});
test('only actual category changes create a new pageview; questions and repeated renders do not',()=>{
 const f=fixture();grant(f);const m=client(f);m.page('home');m.page('home');m.page('test');m.page('test');m.page('words/private/something');m.page('home');
 assert.deepEqual(f.calls.map(x=>x.body.page),['home','test','home']);
 assert.deepEqual(f.calls.map(x=>x.body.type),['pageview','pageview','pageview']);
 const ids=f.calls.map(x=>x.body.id);assert.equal(new Set(ids).size,ids.length);
 for(const c of f.calls){assert.deepEqual(Object.keys(c.body),['id','type','page']);assert.equal(c.url,'https://munthesystems.dk/systems/v1/events?project=jobvocabulary');assert.equal(c.options.credentials,'omit');assert.equal(c.options.referrerPolicy,'no-referrer');}
});
test('withdrawal immediately aborts pending requests and stops all traffic and old course counters',()=>{
 const f=fixture();grant(f);f.environment.fetch=(url,options)=>{f.calls.push({url,options,body:JSON.parse(options.body)});return new Promise(()=>{});};
 const m=client(f),aggregate=Aggregate.create({enabled:true,environment:f.environment});m.page('home');aggregate('course_started');
 Policy.choose('denied',f.environment);m.refresh();assert.equal(f.calls[0].options.signal.aborted,true);assert.equal(f.calls[1].options.signal.aborted,true);
 m.page('test');m.used();f.intervals[0]();aggregate('course_started');assert.equal(f.calls.length,2);
});
test('cross-tab withdrawal, DNT and GPC are checked at send time',()=>{
 const f=fixture();grant(f);const m=client(f);m.page('home');
 Policy.choose('denied',f.environment);f.listeners.storage({key:Policy.key});f.intervals[0]();assert.equal(f.calls.length,1);
 grant(f);f.environment.navigator.globalPrivacyControl=true;m.page('test');assert.equal(f.calls.length,1);
 delete f.environment.navigator.globalPrivacyControl;f.environment.navigator.doNotTrack='yes';m.used();assert.equal(f.calls.length,1);
});
test('untrusted origins, bots, previews, capture, prerender and disabled configurations are fail closed',()=>{
 const changes=[e=>e.navigator.webdriver=true,e=>e.navigator.userAgent='Googlebot',e=>e.navigator.globalPrivacyControl=true,e=>e.navigator.doNotTrack='1',e=>e.doNotTrack='yes',e=>e.document.prerendering=true,e=>e.__JOBVOCABULARY_CAPTURE__=true,...['preview','capture','qa','systems_capture'].map(key=>e=>e.location.search='?'+key+'=1'),e=>e.location.search='?analytics=off'];
 for(const change of changes){const f=fixture();grant(f);change(f.environment);client(f).page('home');Aggregate.create({enabled:true,environment:f.environment})('first_answer');assert.equal(f.calls.length,0);}
 for(const origin of ['https://www.jobvocabulary.com','https://kentambolt.github.io','http://127.0.0.1:8775','https://example.com']){const f=fixture(origin);grant(f);client(f).page('home');assert.equal(f.calls.length,0);}
 const f=fixture();grant(f);Metrics.create({environment:f.environment}).page('home');assert.equal(f.calls.length,0);
});
test('hidden documents defer pageviews and heartbeats, then count the visible page once',()=>{
 const f=fixture();grant(f);f.environment.document.hidden=true;const m=client(f);m.page('test');f.intervals[0]();assert.equal(f.calls.length,0);
 f.environment.document.hidden=false;f.docListeners.visibilitychange();f.docListeners.visibilitychange();assert.equal(f.calls.length,1);
 f.intervals[0]();assert.deepEqual(f.calls.map(x=>x.body.type),['pageview','heartbeat']);
 m.destroy();m.page('home');f.intervals[0]();assert.equal(f.calls.length,2);
});
test('staging is explicitly enabled and never uses production counters',()=>{
 const f=fixture('http://127.0.0.1:8775');grant(f);client(f,{allowStaging:true}).page('catalog');
 Aggregate.create({enabled:true,allowStaging:true,environment:f.environment})('course_started');
 assert.equal(f.calls[0].url,'https://munthesystems.dk/systems/v1/events?project=jobvocabulary-staging');assert.deepEqual(f.calls[1].body,{project:'jobvocabulary-staging',event:'course_started'});
});
test('malformed, expired or unreadable consent and storage failures cannot silently enable statistics',()=>{
 const f=fixture();for(const raw of ['bad',JSON.stringify({version:0,choice:'granted',at:Date.now()}),JSON.stringify({version:1,choice:'granted',at:Date.now()+100000}),JSON.stringify({version:1,choice:'granted',at:Date.now()-Policy.maxAge-1})]){f.data.set(Policy.key,raw);assert.equal(Policy.allows(f.environment),false);}
 grant(f);f.environment.localStorage.setItem=()=>{throw Error('quota');};assert.equal(Policy.choose('denied',f.environment),false);assert.equal(Policy.allows(f.environment),false);
});
test('failed and slow events are bounded and never retried',async()=>{
 const f=fixture();grant(f);f.environment.fetch=(url,options)=>{f.calls.push({url,options});return Promise.reject(Error('offline'));};client(f).page('home');await new Promise(resolve=>setImmediate(resolve));assert.equal(f.calls.length,1);f.timers[0]();assert.equal(f.calls[0].options.signal.aborted,true);
});

test('a restored exercise never emits a fictitious home pageview before the app is ready',()=>{
 const f=fixture();grant(f);const m=client(f);m.refresh();m.used();f.intervals[0]();assert.equal(f.calls.length,0);
 m.page('test');assert.deepEqual(f.calls.map(x=>[x.body.type,x.body.page]),[['pageview','test']]);
});
