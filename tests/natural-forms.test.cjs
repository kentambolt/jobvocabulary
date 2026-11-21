const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const WordEntry=require('../word-entry'),app=require('./helpers/app.cjs');
test('reviewed gender alternatives become complete natural forms and keep unrelated punctuation',()=>{
 const cases=[['ru','Я прошёл(а) курс.','Я прошёл курс.','Я прошла курс.'],['ru','Я порезался(лась).','Я порезался.','Я порезалась.'],['uk','Я знайшов(ла) це.','Я знайшов це.','Я знайшла це.'],['uk','Готовий(а)','Готовий','Готова'],['uk','Я втомився(лася).','Я втомився.','Я втомилася.'],['pl','Chciał(a)bym pomóc.','Chciałbym pomóc.','Chciałabym pomóc.'],['pl','Czy miał(a) Pan/Pani kontakt?','Czy miał Pan kontakt?','Czy miała Pani kontakt?'],['pl','Jestem tu z Panem/Panią.','Jestem tu z Panem.','Jestem tu z Panią.'],['pl','Odprowadzę Pana/Panią.','Odprowadzę Pana.','Odprowadzę Panią.'],['pl','Czy zrobił Pan/zrobiła Pani check-in?','Czy zrobił Pan check-in?','Czy zrobiła Pani check-in?'],['ro','Sunt meticulos(oasă).','Sunt meticulos.','Sunt meticuloasă.'],['bg','Болен(а) съм.','Болен съм.','Болна съм.'],['bg','Уморен(а) съм.','Уморен съм.','Уморена съм.']];
 for(const [lang,raw,m,f]of cases){assert.equal(WordEntry.form(raw,lang,false),m);assert.equal(WordEntry.form(raw,lang,true),f);}
 for(const lang of ['pl','ru','uk','ro','bg','da','en','lt'])assert.equal(WordEntry.form('Try f(a), CPR/MitID and (a note).',lang,true),'Try f(a), CPR/MitID and (a note).');
});
test('the bundled forms match the reviewed source table and preserve original lookup data',()=>{
 const source=require('../data/exercise-forms.json');assert.deepEqual(WordEntry.exerciseForms,source);
 const x={words:{ro:'bolnav(ă)'},phrase:false};assert.equal(WordEntry.exerciseParts(x,'ro',true).text,'bolnavă');assert.equal(x.words.ro,'bolnav(ă)');assert.equal(WordEntry.parts(x,'ro').text,'bolnav(ă)');
});
test('every published compact gender notation resolves for either exercise form',()=>{
 const c={};for(const file of fs.readdirSync(require('path').join(__dirname,'../packs')).filter(f=>f.endsWith('.js')&&f!=='index.js'))vm.runInNewContext(fs.readFileSync(require.resolve('../packs/'+file),'utf8'),c);
 const langs=['da','en','ru','uk','pl','ro','lt','bg'];let checked=0;
 for(const p of Object.values(c.PACKS))for(const category of p.categories)for(const row of category.rows)for(let i=0;i<langs.length;i++){
  const raw=row[i+1];if(!/[\p{L}]\s*\(-?[\p{L}]+\)[\p{L}]?/u.test(raw.replace(/ \((?!-)[^)]+\)/gu,''))&&!raw.includes('Pan/Pani'))continue;
  for(const form of [false,true]){const value=WordEntry.form(raw,langs[i],form);assert.doesNotMatch(value,/[\p{L}]\(-?[\p{L}]+\)[\p{L}]?|[\p{L}]\s+\(-[\p{L}]+\)|Pan\/Pani/u,p.id+':'+row[1]);checked++;}
 }
 assert.ok(checked>1200);
});
test('actual phrase builds grade either complete form and reveal keeps the selected form',()=>{
 for(const feminine of [false,true]){
  const a=app({pack:'agriculture',target:'ru',base:'en',dir:'write',diff:3});a.context.feminine=feminine;
  a.run(fs.readFileSync(require.resolve('../packs/agriculture.js'),'utf8')+';registerPack(PACKS.agriculture);');
  a.run(`const x=ITEM['agriculture:Jeg har arbejdet med grise før.'];current={kind:'build',concept:x,qdir:'prod',isNew:true,feminine};current.spec=buildSpec(ctx(),x);current.tiles=makeTiles(ctx(),x,current.spec);current.picked=[];`);
  assert.equal(a.run('lexicalForm(current.concept,"ru")'),feminine?'Я уже работала со свиньями.':'Я уже работал со свиньями.');
  a.run(`const task=current,unused=new Set(task.tiles.map((_,i)=>i));task.picked=task.spec.answer.map(t=>{const i=[...unused].find(i=>task.tiles[i].tk===t);unused.delete(i);return i;});checkBuild();`);
  assert.equal(a.run(`ctx().prog.cards['agriculture:Jeg har arbejdet med grise før.'].right`),1);
  a.run(`delete ctx().prog.cards[x.id];current={kind:'new',concept:x,qdir:'prod',isNew:true,answered:null,feminine};dontKnow();`);
  assert.equal(a.run('current.feminine'),feminine);assert.equal(a.run('lexicalForm(current.concept,"ru")').includes('('),false);
 }
});

test('dictionary lookup accepts complete gender forms without making new word IDs',()=>{
 const entries=[{id:'lex:known-phrase',phrase:true,words:{da:'Jeg har fundet det.',en:'I have found it.',uk:'Я знайшов(ла) це.'}}];
 const draft=new WordEntry(entries,{target:'uk',base:'en'});draft.setWord('Я знайшла це.');assert.equal(draft.translation,'I have found it.');assert.equal(draft.knownId(),'lex:known-phrase');
 assert.equal(WordEntry.search(entries,'знайшла',draft)[0].id,'lex:known-phrase');
 assert.equal(WordEntry.search(entries,'знайшов',draft)[0].id,'lex:known-phrase');
});

test('cached form lookup refreshes after a custom word is edited',()=>{
 const entry={id:'user:editable',phrase:true,words:{ru:'Я работал(а).',en:'I worked.'}};
 assert.equal(WordEntry.exact(entry,'ru','Я работала.'),true);
 entry.words.ru='Я сдал(а).';
 assert.equal(WordEntry.exact(entry,'ru','Я работала.'),false);
 assert.equal(WordEntry.exact(entry,'ru','Я сдала.'),true);
});

test('whole-sentence variants keep Romanian role agreement and preserve acronyms',()=>{
 const citizen='Ca cetățean străin, puteți cere să fiți asimilat(ă) cetățenilor danezi, ca să puteți primi SU.';
 assert.equal(WordEntry.form(citizen,'ro',true),'Ca cetățeană străină, puteți cere să fiți asimilată cetățenilor danezi, ca să puteți primi SU.');
 const suspect='Ca suspect, nu sunteți obligat(ă) să spuneți nimic în afară de nume, adresă și data nașterii.';
 assert.equal(WordEntry.form(suspect,'ro',true),'Ca suspectă, nu sunteți obligată să spuneți nimic în afară de nume, adresă și data nașterii.');
});

test('hyphenated suffixes and Lithuanian spaced endings use explicit complete words',()=>{
 const cases=[['pl','Wziąłem(-ęłam) to.','Wziąłem to.','Wzięłam to.'],['pl','Przyjąłem(-am).','Przyjąłem.','Przyjęłam.'],['pl','Przeszedłem(-am) kurs.','Przeszedłem kurs.','Przeszłam kurs.'],['pl','Chciałbym(-ałabym) pomóc.','Chciałbym pomóc.','Chciałabym pomóc.'],['ru','быть готовым(-ой)','быть готовым','быть готовой'],['uk','бути готовим(-ою)','бути готовим','бути готовою'],['lt','Aš čia naujas (-a).','Aš čia naujas.','Aš čia nauja.'],['lt','Jau esu dirbęs (-usi).','Jau esu dirbęs.','Jau esu dirbusi.'],['lt','Nesu daręs (-iusi).','Nesu daręs.','Nesu dariusi.'],['lt','narys (-ė)','narys','narė']];
 for(const [lang,raw,m,f]of cases){assert.equal(WordEntry.form(raw,lang,false),m);assert.equal(WordEntry.form(raw,lang,true),f);}
 const word={phrase:false,words:{lt:'medicinos sekretorius (-ė)'}};
 assert.equal(WordEntry.exerciseParts(word,'lt',true).text,'medicinos sekretorė');
 assert.equal(WordEntry.exact(word,'lt','medicinos sekretorė'),true);
});

test('a one-word reply stays a spelling task in writing mode and punctuation needs no key',()=>{
 const a=app({pack:'top',target:'en',base:'da',dir:'write',diff:1});
  a.run(`const reply={id:'reply:test',phrase:true,words:{en:'Thanks!',da:'Tak!'},diff:1};ITEM[reply.id]=reply;const c=ctx();current=pickNext({...c,pool:[reply]});startWrite(c,reply);`);
 assert.equal(a.run('current.kind'),'write');
  a.run(`for(const letter of current.spec.chars.filter(isLetter))pressKey(letter.toLowerCase());`);
 assert.equal(a.run(`ctx().prog.cards['reply:test'].right`),1);
 assert.equal(a.run(`ctx().prog.cards['reply:test'].wrong`),0);
});

test('gendered writing/building questions state the requested form in all interface languages',()=>{
 for(const lang of ['da','en','ru','uk','pl','ro','lt','bg']){
  const a=app(undefined,{search:'?ui='+lang});a.run(`const x={id:'gender:test',phrase:true,words:{ru:'Я работал(а).',en:'I worked.'}};const c=ctx({...state.settings,target:'ru',base:'en'});`);
  for(const kind of ['write','build']){a.context.kind=kind;a.run('current={concept:x,feminine:false};');const male=a.run('questionText(c,x,kind)');a.run('current.feminine=true;');const female=a.run('questionText(c,x,kind)');assert.equal(typeof male,'string');assert.equal(typeof female,'string');assert.notEqual(male,female);assert.doesNotMatch(male+female,/undefined|\{T\}/);}
 }
});
test('the other valid gender is not inserted as a misleading wrong build tile',()=>{
 const a=app({pack:'top',target:'ru',base:'en',dir:'write',diff:3});
 a.run(`const x={id:'gender:test',phrase:true,words:{ru:'Я работал(а).',en:'I worked.'}};const c=ctx();current={concept:x,feminine:true};const other={id:'other:test',phrase:true,words:{ru:'Я работал вчера.',en:'I worked yesterday.'}};const tiles=makeTiles({...c,pool:[x,other]},x,buildSpec(c,x));`);
 assert.equal(a.run('tiles.some(t=>t.tk==="работал")'),false);assert.equal(a.run('tiles.some(t=>t.tk==="работала")'),true);
});
