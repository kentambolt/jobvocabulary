const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const app = require('./helpers/app.cjs');
const paths = require('../starter-paths');
const preferences = require('../course-preferences');
const langs = ['da','en','ru','uk','pl','ro','lt','bg'];
function load(a,pack) { a.run(fs.readFileSync(require.resolve('../packs/'+pack+'.js'),'utf8')+';registerPack(PACKS.'+pack+');'); }

test('all three starters contain exactly twenty existing translated priority-one IDs',()=>{
  for (const pack of Object.keys(paths.paths)) for (const base of langs.filter(l=>l!=='da')) {
    const a=app(undefined,{initialState:{},hash:'#start='+pack+'&base='+base+'&path='+pack+'-first-steps'});
    load(a,pack);
    assert.equal(a.run('countPool(state.settings)'),20,pack+'/'+base);
    assert.equal(a.run('new Set(ctx().pool.map(x=>x.id)).size'),20);
    assert.equal(a.run('ctx().pool.every(x=>x.diff===1)'),true);
    a.run('renderPlay();');
    assert.ok(a.run('current'));
    assert.equal(a.run('view'),'play');
    assert.match(a.run('metaHTML(ctx(),current.concept)'),new RegExp(paths.copy[base][0]));
  }
});

test('starter links preserve helper selection and reject paths for a different course',()=>{
  const a=app(undefined,{initialState:{},hash:'#start=hotel&path=hotel-first-steps'});
  assert.equal(a.run('draft.starterPath'),'hotel-first-steps');
  assert.equal(a.run('view'),'setup');
  const b=app(undefined,{initialState:{},hash:'#start=hotel&base=en&path=cleaning-first-steps'});
  assert.equal(b.run('state.settings.starterPath'),undefined);
});

test('full-course choices and records survive starter practice and continuing',()=>{
  const full={pack:'hotel',target:'da',base:'en',dir:'write',diff:2,cats:['rooms']};
  const a=app(full);load(a,'hotel');
  a.run('saveState();location.hash="#start=hotel&base=en&path=hotel-first-steps";applyCourseLink();renderPlay();');
  assert.equal(a.run('ctx().pool.length'),20);
  a.run('choose(current.options.findIndex(x=>x.id===current.concept.id));');
  const cards=a.run('JSON.stringify(state.progress["hotel|da|en|rec"].cards)');
  a.run('render=()=>{};continueFullCourse();');
  assert.deepEqual(JSON.parse(a.run('JSON.stringify(state.settings)')),full);
  assert.equal(a.run('JSON.stringify(state.progress["hotel|da|en|rec"].cards)'),cards);
  assert.notEqual(preferences.key(full),preferences.key({...full,starterPath:'hotel-first-steps'}));
});

test('switching between a starter and its full course in setup removes the old restriction',()=>{
  const a=app({pack:'hotel',target:'da',base:'en',dir:'rec',diff:1,starterPath:'hotel-first-steps'});
  load(a,'hotel');a.run('render=()=>{};renderSetup();');
  const select=a.context.document.getElementById('courseSelect');
  select.value='hotel';select.onchange();
  assert.equal(a.run('draft.starterPath'),undefined);
  assert.ok(a.run('buildPool(draft).length')>20);
  select.value='hotel-first-steps';select.onchange();
  assert.equal(a.run('draft.starterPath'),'hotel-first-steps');
  assert.equal(a.run('buildPool(draft).length'),20);
});
