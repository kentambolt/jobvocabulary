const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),app=require('./helpers/app.cjs');
test('failed practice loading has a localized retry and keeps saved progress',async()=>{
 for(const lang of ['da','en','ru','uk','pl','ro','lt','bg']){
  const a=app(undefined,{search:'?ui='+lang});a.context.renderCount=0;
  a.run('view="play";render=()=>{renderCount++};state.progress.test={cards:{example:{right:7,wrong:0,lvl:7}}};');
  const before=a.run('JSON.stringify(state.progress)');
  await a.run('awaitPracticeContent(()=>Promise.reject(new Error("offline")))');
  const html=a.context.document.getElementById('app').innerHTML;
  assert.ok(html.includes('role="alert"'));assert.ok(html.includes('id="retryContent"'));
  const text=a.run('t("retryLoad")');assert.ok(text&&text!=='undefined');assert.ok(html.includes(text));
  a.context.document.getElementById('retryContent').onclick();assert.equal(a.context.renderCount,1);
  assert.equal(a.run('JSON.stringify(state.progress)'),before);
 }
});
test('late loading failures and successes do not replace a different view or changed settings',async()=>{
 for(const outcome of ['resolve','reject'])for(const change of ['view','settings']){
  const a=app();a.context.renderCount=0;
  a.run('view="play";render=()=>{renderCount++};let finish;const pending=new Promise((resolve,reject)=>{finish='+outcome+'});const settled=awaitPracticeContent(()=>pending);');
  a.run(change==='view'?'view="home";':'state.settings={...state.settings,target:"ru"};');
  a.context.document.getElementById('app').innerHTML='newer content';
  await a.run('finish(new Error("late"));settled');
  assert.equal(a.context.document.getElementById('app').innerHTML,'newer content');assert.equal(a.context.renderCount,0);
 }
});
test('an empty course payload rejects cleanly and can be retried with the real payload',async()=>{
 const a=app(),scripts=[];let removed=0;
 a.context.document.createElement=()=>({remove(){removed++;}});a.context.document.head={appendChild(el){scripts.push(el);}};
 const first=a.run('loadPack("laundry")');scripts[0].onload();await assert.rejects(first,/pack laundry/);
 assert.equal(removed,1);assert.equal(a.run('packLoads.laundry'),undefined);
 a.run(fs.readFileSync(require.resolve('../packs/laundry.js'),'utf8'));
 const second=a.run('loadPack("laundry")');assert.equal(scripts.length,2);scripts[1].onload();await second;
 assert.equal(a.run('PACK_ITEMS.laundry.length'),108);
});
test('a failed course request releases its cached promise for a new request',async()=>{
 const a=app(),scripts=[];a.context.document.createElement=()=>({remove(){}});a.context.document.head={appendChild(el){scripts.push(el);}};
 const first=a.run('loadPack("retail")');scripts[0].onerror();await assert.rejects(first,/pack retail/);
 const second=a.run('loadPack("retail")');assert.equal(scripts.length,2);scripts[1].onerror();await assert.rejects(second,/pack retail/);
});
