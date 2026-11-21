const test = require('node:test');
const assert = require('node:assert/strict');
const app = require('./helpers/app.cjs');
const fs = require('node:fs');
const path = require('node:path');

test('a direct course start for a returning learner reaches a task without another placement offer', () => {
  const a = app({ target: 'ru', base: 'en', pack: 'top', dir: 'write', diff: 2 }, { hash: '#start=airport&base=pl' });
  a.run(fs.readFileSync(path.join(__dirname, '../packs/airport.js'), 'utf8') + ';registerPack(PACKS.airport);renderPlay();');
  assert.equal(a.run('view'), 'play');
  assert.equal(a.run('state.settings.target'), 'da');
  assert.equal(a.run('state.settings.base'), 'pl');
  assert.equal(a.run('state.settings.diff'), 1);
  assert.equal(a.run('ctx().prog.offered'), true);
  assert.ok(a.run('current?.concept.id.startsWith("airport:")'));
  assert.equal(a.run('placement'), null);
});

test('a focused guide link starts the requested topics directly and validates category keys',()=>{
  const a=app(undefined,{initialState:{},hash:'#start=office&topics=phone%2Cappointments%2Cphone%2Cunknown&base=pl'});
  assert.equal(a.run('view'),'play');
  assert.equal(a.run('state.settings.base'),'pl');
  assert.deepEqual(JSON.parse(a.run('JSON.stringify(state.settings.cats)')),['phone','appointments']);
  a.run(fs.readFileSync(path.join(__dirname,'../packs/office.js'),'utf8')+';registerPack(PACKS.office);renderPlay();');
  assert.equal(a.run('current.concept.cat'),'phone');
  assert.equal(a.run('ctx().pool.every(word=>["phone","appointments"].includes(word.cat))'),true);
  const invalid=app(undefined,{initialState:{},hash:'#start=office&base=pl&topics=unknown,__proto__'});
  assert.equal(invalid.run('state.settings.cats'),null);
});

test('a focused link retains topic choices during first-time helper selection',()=>{
  const a=app(undefined,{initialState:{},hash:'#start=office&topics=phone,appointments'});
  assert.equal(a.run('view'),'setup');
  assert.equal(a.run('draft.base'),null);
  assert.deepEqual(JSON.parse(a.run('JSON.stringify(draft.cats)')),['phone','appointments']);
});

test('course links accept only explicitly supported helper languages',()=>{
  for(const base of ['constructor','__proto__','en-extra','xx']) {
    const a=app(undefined,{initialState:{},hash:'#start=office&base='+base+'&topics=phone'});
    assert.equal(a.run('view'),'setup',base);
    assert.equal(a.run('draft.base'),null,base);
    assert.deepEqual(JSON.parse(a.run('JSON.stringify(draft.cats)')),['phone']);
  }
});

test('a focused guide changes the scope without discarding existing course cards',()=>{
  const a=app({pack:'office',target:'da',base:'en',diff:2,dir:'rec'});
  a.run(fs.readFileSync(path.join(__dirname,'../packs/office.js'),'utf8')+';registerPack(PACKS.office);ctx().prog.cards["office:en kunde"]=newCard(ctx(),2,true);');
  const before=a.run('JSON.stringify(ctx().prog.cards)');
  a.run('location.hash="#start=office&base=en&topics=phone,appointments";applyCourseLink();');
  assert.equal(a.run('JSON.stringify(ctx().prog.cards)'),before);
  assert.equal(a.run('state.settings.diff'),2);
});

test('starting from setup reaches a task without a second placement-choice screen', () => {
  const a = app(undefined, { initialState: {} });
  const soundBefore = a.run('state.sound');
  a.run("render = () => {}; view = 'setup'; draft = { target: 'da', base: 'en', pack: 'top', dir: 'rec', diff: 1 }; renderSetup();");
  a.context.document.getElementById('startBtn').onclick();
  a.run('renderPlay();');
  assert.equal(a.run('view'), 'play');
  assert.ok(a.run('current?.concept.id'));
  assert.equal(a.run('ctx().prog.offered'), true);
  assert.equal(a.run('pendingPlacement'), false);
  assert.equal(a.run('state.sound'), soundBefore);
});

test('the explicit setup test starts placement without inserting a normal task', () => {
  const a = app(undefined, { initialState: {} });
  a.run("render = () => {}; view = 'setup'; draft = { target: 'da', base: 'uk', pack: 'top', dir: 'rec', diff: 1 }; renderSetup();");
  a.context.document.getElementById('setupTestBtn').onclick();
  a.run('renderPlay();');
  assert.equal(a.run('pendingPlacement'), false);
  assert.equal(a.run('view'), 'place');
  assert.ok(a.run('placement.queue.length') > 0);
  assert.equal(a.run('ctx().prog.task'), 0);
});

test('training context identifies courses and lists without resetting their counters', () => {
  const a = app();
  a.run("state.settings = { target: 'da', base: 'en', pack: 'warehouse', diff: 2, dir: 'rec' };");
  const html = a.run("metaHTML({s:state.settings,key:'sample',prog:{task:0,cards:{}},pool:[]},null)");
  assert.match(html, /course-name[^>]*>Warehouse and production/);
  assert.match(html, /course-difficulty/);
  assert.match(html, /course-progress[^>]*>0 of 0 learned/);
  a.run("state.settings.pack = 'list:favorites';");
  assert.match(a.run("metaHTML({s:state.settings,key:'sample',prog:{task:0,cards:{}},pool:[]},null)"), /Saved words/);
});

test('the compact course selector restores that course preferences without changing active progress', () => {
  const a = app({ target: 'da', base: 'en', pack: 'warehouse', dir: 'write', diff: 2, cats: ['places'] });
  a.run("saveState(); render = () => {}; draft = { target: 'da', base: 'en', pack: 'top', dir: 'rec', diff: 1 }; view = 'setup'; renderSetup();");
  const before = a.run('JSON.stringify(state.progress)');
  a.context.document.getElementById('courseSelect').value = 'warehouse';
  a.context.document.getElementById('courseSelect').onchange();
  assert.equal(a.run('draft.pack'), 'warehouse');
  assert.equal(a.run('draft.diff'), 2);
  assert.equal(a.run('draft.dir'), 'write');
  assert.deepEqual(JSON.parse(a.run('JSON.stringify(draft.cats)')), ['places']);
  assert.equal(a.run('JSON.stringify(state.progress)'), before);
  a.context.document.getElementById('courseSelect').value = 'cleaning';
  a.context.document.getElementById('courseSelect').onchange();
  assert.equal(a.run('draft.diff'), 1);
  assert.equal(a.run('draft.cats'), null);
});
