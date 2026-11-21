const test=require('node:test');
const assert=require('node:assert/strict');
const Meter=require('../activation-meter');
const app=require('./helpers/app.cjs');
const fs=require('node:fs');

test('one run emits only its three milestones and ignores duplicate grading and rerenders',()=>{
  const events=[],m=Meter.create(event=>events.push(event));
  m.start('course');m.start('course');
  const task={};m.answer(task);m.answer(task);
  for(let i=0;i<30;i++)m.answer({});
  assert.deepEqual(events,['course_started','first_answer','ten_answers']);
  m.start('other');m.answer({});
  assert.deepEqual(events.slice(3),['course_started','first_answer']);
  m.reset();m.start('other');
  assert.equal(events.at(-1),'course_started');
});

test('a failing collector never throws into the exercise handler',async()=>{
  const a=Meter.create(()=>{throw Error('offline')});
  assert.doesNotThrow(()=>{a.start('course');a.answer({})});
  const b=Meter.create(()=>Promise.reject(Error('offline')));
  b.start('course');b.answer({});
  await new Promise(resolve=>setImmediate(resolve));
});

test('real native introductions and renders are not answers, while ten real tasks are counted once',()=>{
  const events=[];
  const a=app({target:'ru',base:'ru',pack:'top',dir:'rec',diff:1},{sendActivation:event=>events.push(event)});
  a.run(fs.readFileSync(require.resolve('../images/words/manifest.js'),'utf8')+';Object.assign(IMG,IMAGES);renderPlay();renderPlay();advance();');
  assert.deepEqual(events,['course_started']);
  for(let i=0;i<10;i++) {
    a.run('if(current.kind==="intro")advance();choose(current.options.findIndex(x=>x.id===current.concept.id));');
  }
  assert.deepEqual(events,['course_started','first_answer','ten_answers']);
});
