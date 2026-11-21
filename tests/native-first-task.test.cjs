const test=require('node:test');
const assert=require('node:assert/strict');
const app=require('./helpers/app.cjs');
const fs=require('node:fs');
const langs=['da','en','ru','uk','pl','ro','lt','bg'];

test('each native language and task type reaches a real task after one introduction',()=>{
  for(const target of langs) for(const dir of ['path','rec','prod','write']) {
    const a=app({target,base:target,pack:'top',dir,diff:1});
    a.run(fs.readFileSync(require.resolve('../images/words/manifest.js'),'utf8')+';Object.assign(IMG,IMAGES);renderPlay();');
    assert.equal(a.run('current.kind'),'intro',target+'/'+dir);
    const id=a.run('current.concept.id');
    a.run('advance();');
    assert.notEqual(a.run('current.kind'),'intro');
    assert.equal(a.run('current.concept.id'),id);
    assert.equal(a.run('ctx().prog.cards[current.concept.id].right'),0);
    assert.equal(a.run('ctx().prog.cards[current.concept.id].wrong'),0);
    assert.equal(a.run('isLearned(ctx().prog.cards[current.concept.id])'),false);
    assert.equal(a.run('modeTurn(state.settings)'),0);
  }
});

test('changing native task type shares introductions without transferring mastery',()=>{
  const a=app({target:'ru',base:'ru',pack:'top',dir:'rec',diff:1,modes:['rec','prod']});
  a.run(fs.readFileSync(require.resolve('../images/words/manifest.js'),'utf8')+';Object.assign(IMG,IMAGES);renderPlay();advance();');
  const id=a.run('current.concept.id');
  a.run('choose(current.options.findIndex(x=>x.id===current.concept.id));');
  assert.equal(a.run('modeTurn(state.settings)'),1);
  a.context.wordId=id;
  a.run('const other=ctx({...state.settings,dir:"prod"});other.pool=[ITEM[wordId]];current=pickNext(other);');
  assert.notEqual(a.run('current.kind'),'intro');
  assert.equal(a.run('state.progress["ru|ru|prod"].cards[wordId].right'),0);
  assert.equal(a.run('isLearned(state.progress["ru|ru|prod"].cards[wordId])'),false);
});
