const test=require('node:test'),assert=require('node:assert/strict'),app=require('./helpers/app.cjs');
test('navigation and browser history close stale dialogs without applying unfinished choices',()=>{
 for(const id of ['appMenu','trainingDialog','saveWordDialog'])for(const action of ['go','popstate','hashchange']){
  const a=app();a.run('render=()=>{};');a.context.dialogId=id;
  const before=a.run('JSON.stringify(state.settings)');a.run('document.getElementById(dialogId).showModal();');
  if(action==='go')a.run('go("stats");');
  else if(action==='popstate'){a.run('location.hash="#statistik";');a.events.get('popstate')();}
  else {a.run('location.hash="#start=top&target=da&base=en";');a.events.get('hashchange')();}
  assert.equal(a.run('document.getElementById(dialogId).open'),false,id+'/'+action);
  if(action!=='hashchange')assert.equal(a.run('JSON.stringify(state.settings)'),before);
  assert.equal(a.run('view'),action==='hashchange'?'play':'stats');
 }
});
