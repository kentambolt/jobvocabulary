const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const app=require('./helpers/app.cjs');
function practice(modes=['rec','write']){
  const a=app({pack:'salon',target:'pl',base:'lt',modes,dir:modes[0],diff:1});
  a.run(fs.readFileSync(require.resolve('../packs/salon.js'),'utf8')+';registerPack(PACKS.salon);ctx().prog.offered=true;renderPlay();');
  return a;
}
const read=a=>JSON.parse(a.run('JSON.stringify(practiceProgress(state.settings,ctx().pool))'));

test('the first real correct mixed-mode answer advances the bar without claiming a fully learned word',()=>{
  const a=practice();
  assert.equal(read(a).percent,0);
  a.run('const firstWord=current.concept;choose(current.options.findIndex(word=>word.id===firstWord.id));');
  const progress=read(a);
  assert.equal(progress.completedModes,1);assert.equal(progress.learnedWords,0);
  assert.equal(progress.totalModes,a.run('ctx().pool.length')*2);
  assert.ok(progress.percent>0);
  assert.equal(a.run('state.settings.diff'),1);
  const html=a.run('metaHTML(ctx(),current.concept)');
  assert.match(html,/role="progressbar"/);assert.doesNotMatch(html,/aria-valuenow="0"/);
  assert.match(html,/Išmokta 0 iš 58/);
});

test('a word needs every selected mode for full mastery and one later error affects only its own part',()=>{
  const a=practice();
  a.run('const firstWord=ctx().pool[0];const rec=ctx({...state.settings,dir:"rec"});rec.prog.cards[firstWord.id]=newCard(rec,3,true);const write=ctx({...state.settings,dir:"write"});write.prog.cards[firstWord.id]=newCard(write,3,true);');
  const complete=read(a);assert.equal(complete.learnedWords,1);assert.equal(complete.completedModes,2);
  a.run('grade(write,firstWord,false);');
  const after=read(a);assert.equal(after.learnedWords,0);assert.equal(after.completedModes,1);
  assert.equal(a.run('rec.prog.cards[firstWord.id].wrong'),0);
  assert.equal(a.run('write.prog.cards[firstWord.id].wrong'),1);
});

test('single-mode progress keeps its existing word-based percentage and an empty scope remains finite',()=>{
  const a=practice(['rec']);
  a.run('choose(current.options.findIndex(word=>word.id===current.concept.id));');
  const progress=read(a);
  assert.equal(progress.learnedWords,1);assert.equal(progress.completedModes,1);assert.equal(progress.mixed,false);
  assert.equal(progress.percent,100/a.run('ctx().pool.length'));
  const empty=JSON.parse(a.run('JSON.stringify(practiceProgress(state.settings,[]))'));
  assert.equal(empty.percent,0);assert.equal(empty.totalModes,0);
});
