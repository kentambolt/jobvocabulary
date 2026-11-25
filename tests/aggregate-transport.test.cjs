const test=require('node:test');
const assert=require('node:assert/strict');
const Transport=require('../aggregate-transport');
const Policy=require('../measurement-policy');
function fixture(origin='https://jobvocabulary.com') {
  const calls=[],timers=[];
  const environment={location:{origin},navigator:{},MeasurementPolicy:Policy,TrafficMetrics:require('../traffic-metrics'),localStorage:{getItem:()=>JSON.stringify({version:1,choice:'granted',at:Date.now()-1000})},AbortController,setTimeout:fn=>{timers.push(fn);return timers.length},clearTimeout:()=>{},fetch:(...args)=>{calls.push(args);return Promise.resolve({status:202})}};
  return {calls,timers,environment};
}
test('aggregate requests contain only the approved project and event, with credentials and referrer omitted',async()=>{
  const f=fixture(),send=Transport.create({enabled:true,environment:f.environment});
  await send('first_answer');
  const [url,request]=f.calls[0];
  assert.equal(url,'https://munthesystems.dk/systems/v1/aggregate');
  assert.deepEqual(JSON.parse(request.body),{project:'jobvocabulary',event:'first_answer'});
  assert.equal(request.credentials,'omit');assert.equal(request.referrerPolicy,'no-referrer');
  assert.equal(request.mode,'cors');assert.equal(request.keepalive,true);
  assert.equal(request.method,'POST');assert.deepEqual(request.headers,{'Content-Type':'application/json'});
});
test('disabled transport, other origins, unapproved events and non-opted-in local QA send nothing',()=>{
  for(const origin of ['https://www.jobvocabulary.com','https://kentambolt.github.io','http://127.0.0.1:8775','https://example.com']){
    const f=fixture(origin);Transport.create({enabled:true,environment:f.environment})('course_started');assert.equal(f.calls.length,0);
  }
  const f=fixture();Transport.create({environment:f.environment})('course_started');
  Transport.create({enabled:true,environment:f.environment})('user_custom_word');assert.equal(f.calls.length,0);
});
test('DNT and GPC suppress requests before any network call, including a changed preference',()=>{
  for(const flags of [{doNotTrack:'1'},{doNotTrack:'yes'},{globalPrivacyControl:true}]){
    const f=fixture();Object.assign(f.environment.navigator,flags);
    Transport.create({enabled:true,environment:f.environment})('course_started');assert.equal(f.calls.length,0);
  }
  const f=fixture(),send=Transport.create({enabled:true,environment:f.environment});
  f.environment.doNotTrack='1';send('first_answer');assert.equal(f.calls.length,0);
});
test('explicit local QA uses a separate project and never production counters',async()=>{
  const f=fixture('http://127.0.0.1:8775');
  await Transport.create({enabled:true,allowStaging:true,environment:f.environment})('ten_answers');
  assert.deepEqual(JSON.parse(f.calls[0][1].body),{project:'jobvocabulary-staging',event:'ten_answers'});
});
test('a failed or slow collector is aborted and never retried',async()=>{
  const f=fixture();f.environment.fetch=(...args)=>{f.calls.push(args);return Promise.reject(Error('offline'))};
  const send=Transport.create({enabled:true,environment:f.environment});await send('first_answer');
  assert.equal(f.calls.length,1);f.timers[0]();assert.equal(f.calls[0][1].signal.aborted,true);
  f.environment.fetch=()=>{throw Error('blocked')};assert.doesNotThrow(()=>send('ten_answers'));
});
