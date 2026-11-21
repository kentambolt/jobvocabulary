const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),app=require('./helpers/app.cjs');
const source=fs.readFileSync(require.resolve('../app.js'),'utf8');
const renderer=source.slice(source.indexOf('function renderPlayView()'),source.indexOf('// Registrér et svar på en kendt kortet'));
test('incorrect multiple-choice feedback names the right answer in its own language for assistive readers',()=>{
 for(const ui of ['da','en','ru','uk','pl','ro','lt','bg'])for(const dir of ['rec','prod']){
  const a=app({pack:'top',target:'ru',base:'en',dir,diff:1},{search:'?ui='+ui});
  a.run(renderer);a.run('fitAnswerText=()=>{};const c=ctx(),x=c.pool[0];current={kind:"new",concept:x,qdir:state.settings.dir,options:makeOptions(c,x,state.settings.dir)};choose(current.options.findIndex(option=>option.id!==x.id));');
  const html=a.context.document.getElementById('app').innerHTML,lang=dir==='rec'?'en':'ru';
  assert.match(html,/<div class="msg bad"><span aria-hidden="true">/);
  assert.ok(html.includes('<span class="sr-only">'+a.run("esc(t('wrongBuild'))")+' <span lang="'+lang+'">'+a.run('esc(lexicalForm(current.concept,'+JSON.stringify(lang)+'))')+'</span></span>'));
  assert.ok(html.includes('id="nextBtn"'));
 }
});
