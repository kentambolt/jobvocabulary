const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const app=require('./helpers/app.cjs');
function start(modes=['write']){
 const a=app({pack:'office',target:'da',base:'en',diff:1,dir:modes[0],modes,cats:['phone']});
 a.run(fs.readFileSync(require.resolve('../packs/office.js'),'utf8')+';registerPack(PACKS.office);ctx().prog.offered=true;renderPlay();');
 return a;
}
const arrange=`(()=>{const unused=new Set(current.tiles.map((_,i)=>i));current.picked=current.spec.answer.map(token=>{const i=[...unused].find(i=>current.tiles[i].tk===token);if(i===undefined)throw Error('Missing tile '+token);unused.delete(i);return i;});})()`;
test('a fresh phrase starts as a build task when writing is selected, with no premature learned card',()=>{
 const a=start();assert.equal(a.run('current.kind'),'build');assert.equal(a.run('current.isNew'),true);
 assert.equal(a.run('ctx().prog.cards[current.concept.id]'),undefined);
 assert.equal(a.run('current.options'),undefined);
 const id=a.run('current.concept.id');a.run(arrange);a.run('checkBuild();');a.context.answeredId=id;
 assert.equal(a.run('ctx().prog.cards[answeredId].right'),1);
 assert.equal(a.run('ctx().prog.cards[answeredId].wrong'),0);
 assert.equal(a.run('ctx().prog.cards[answeredId].memory.log.length'),1);
 assert.equal(a.run('ctx().prog.cards[answeredId].memory.log[0][2]'),3);
 assert.equal(a.run('isLearned(ctx().prog.cards[answeredId])'),true);
});
test('an incorrect first sentence build records a real error and waits for the learner',()=>{
 const a=start();a.run('current.picked=[0];');const id=a.run('current.concept.id');a.run('checkBuild();');a.context.answeredId=id;
 assert.equal(a.run('current.concept.id'),id);assert.equal(a.run('current.answered'),'bad');
 assert.equal(a.run('ctx().prog.cards[answeredId].right'),0);assert.equal(a.run('ctx().prog.cards[answeredId].wrong'),1);
 assert.equal(a.run('isLearned(ctx().prog.cards[answeredId])'),false);
 a.run('checkBuild();');assert.equal(a.run('ctx().prog.cards[answeredId].wrong'),1);
});
test('revealing a fresh sentence records exposure without counting a guessed answer',()=>{
 const a=start();const id=a.run('current.concept.id');a.run('dontKnow();');a.context.answeredId=id;
 assert.equal(a.run('current.kind'),'intro');assert.equal(a.run('current.exposureRecorded'),true);
 assert.equal(a.run('ctx().prog.cards[answeredId].right'),0);assert.equal(a.run('ctx().prog.cards[answeredId].wrong'),0);
 assert.equal(a.run('ctx().prog.task'),1);a.run('advance();');assert.equal(a.run('ctx().prog.task'),1);
});
test('mixed recognition and writing start different real task types with independent answer records',()=>{
 const a=start(['rec','write']);assert.equal(a.run('current.kind'),'new');
 a.run('choose(current.options.findIndex(word=>word.id===current.concept.id));');
 assert.equal(a.run('state.settings.dir'),'write');assert.equal(a.run('current.kind'),'build');
 a.run(arrange);a.run('checkBuild();');
 assert.equal(a.run('state.progress[progKey({...state.settings,dir:"rec"})].task'),1);
 assert.equal(a.run('state.progress[progKey({...state.settings,dir:"write"})].task'),1);
 assert.equal(a.run('state.settings.dir'),'rec');
});
