const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const app=require('./helpers/app.cjs');
const source=fs.readFileSync(require.resolve('../app.js'),'utf8');
const renderer=source.slice(source.indexOf('function renderPlayView()'),source.indexOf('// Registrér et svar på en kendt kortet'));
function practice(pack='hotel',target='da',base='en') {
  const a=app({pack,target,base,diff:1,dir:'rec',modes:['rec','write']});
  a.run(fs.readFileSync(require.resolve('../packs/'+pack+'.js'),'utf8')+`;registerPack(PACKS.${pack});`);
  return a;
}

test('reading space is planned for the chosen content and stays stable across levels and modes',()=>{
  const a=practice();
  const expected=a.run('practiceReadingClass(ctx())');
  assert.equal(expected,' reading-space');
  for(const diff of [1,2,3])for(const dir of ['rec','prod','write']) {
    a.context.next={diff,dir};
    assert.equal(a.run('state.settings={...state.settings,...next};practiceReadingClass(ctx())'),expected);
  }
  a.run('state.settings.cats=["people"];');
  assert.equal(a.run('practiceReadingClass(ctx())'),'');
  const long=practice('bus','lt','en');
  assert.equal(long.run('practiceReadingClass(ctx())'),' reading-long');
});

test('new words, choice questions and spelling all render inside the same fixed stage',()=>{
  const a=practice();a.run(renderer);
  for(const kind of ['new','quiz','write']){
    a.context.kind=kind;
    a.run(`const c${kind}=ctx();current={kind,concept:c${kind}.pool[0],qdir:kind==='write'?'prod':'rec',options:makeOptions(c${kind},c${kind}.pool[0],'rec')};if(kind==='write')startWrite(c${kind},current.concept);renderPlayView();`);
    const html=a.context.document.getElementById('app').innerHTML;
    assert.match(html,/^<div class="practice-stage reading-space">/);
    assert.match(html,/class="answer-receipt"/);
    assert.match(html,/class="task-q"/);
    assert.equal((html.match(/class="feedback"/g)||[]).length,1);
  }
  a.run('state.settings.modes=["rec"];state.settings.dir="rec";current={kind:"quiz",concept:ctx().pool[0],qdir:"rec",options:makeOptions(ctx(),ctx().pool[0],"rec")};renderPlayView();');
  assert.match(a.context.document.getElementById('app').innerHTML,/^<div class="practice-stage reading-space">/);
});

test('a level change uses the existing receipt row without adding a block above the prompt',()=>{
  const a=practice();
  a.run('const c=ctx();levelNotice={key:c.key,diff:c.s.diff,task:c.prog.task,text:"Easy completed. Continue with Medium."};');
  assert.doesNotMatch(a.run('metaHTML(ctx(),null)'),/level-notice/);
  assert.match(a.run('feedbackReceiptHTML(ctx())'),/class="answer-receipt level-notice"/);
  a.run('ctx().prog.task+=3;');
  assert.doesNotMatch(a.run('feedbackReceiptHTML(ctx())'),/level-notice/);
});

test('placement questions use the same reading profile as the following course practice',()=>{
  const a=practice('bus','lt','bg');
  a.run('render=()=>{};startPlacement();renderPlace();');
  assert.match(a.context.document.getElementById('app').innerHTML,/^<div class="practice-stage reading-long">/);
  assert.match(a.context.document.getElementById('app').innerHTML,/class="answer-receipt"/);
});
