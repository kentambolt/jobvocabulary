const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const aliases = require('../data/course-search-aliases.json');

function catalogue(initialQuery='',hash='') {
  const input = {value:initialQuery, addEventListener(type, fn) { this[type] = fn; }};
  const empty = {hidden:true};
  const cards = Object.entries(aliases).map(([id, search]) => ({id, textContent:id, dataset:{search}, hidden:false}));
  const groups=require('../catalog').groups.map(group=>({id:group.id,hidden:false,querySelectorAll:()=>cards.filter(card=>group.packs.includes(card.id))}));
  const subcategories=require('../catalog').subcategories.map(category=>({id:'category-'+category.id,hidden:false,open:false,count:{textContent:String(category.packs.length)},preview:{hidden:false},querySelectorAll:()=>cards.filter(card=>category.packs.includes(card.id)),querySelector(selector){return selector==='.subcategory-count'?this.count:this.preview;}}));
  const links=groups.map(group=>({hidden:false,attributes:{href:'#'+group.id},getAttribute(name){return this.attributes[name];},setAttribute(name,value){this.attributes[name]=value;},removeAttribute(name){delete this.attributes[name];}}));
  const listeners={},window={location:{hash},addEventListener(name,fn){listeners[name]=fn;}};
  const document = {
    getElementById:id=>id==='courseSearch'?input:id==='courseEmpty'?empty:null,
    querySelectorAll:selector=>selector==='[data-course-group]'?groups:selector==='.category-nav a'?links:selector==='[data-course-subcategory]'?subcategories:[]
  };
  vm.runInNewContext(fs.readFileSync(require.resolve('../catalog-search.js'),'utf8'),{document,window});
  return {groups,subcategories,links,empty,navigate(hash){window.location.hash=hash;listeners.hashchange();},search(query) {input.value=query; input.input(); return cards.filter(card=>!card.hidden).map(card=>card.id);}};
}

test('category links follow the selected fragment and never point to hidden empty results',()=>{
  const page=catalogue('','#everyday');
  assert.equal(page.links[1].attributes['aria-current'],'location');
  assert.equal(page.links[0].attributes['aria-current'],undefined);
  page.search('rengoring');
  assert.equal(page.links[0].hidden,false);
  assert.equal(page.links[1].hidden,true);
  assert.equal(page.links[1].attributes['aria-current'],undefined);
  page.navigate('#work');
  assert.equal(page.links[0].attributes['aria-current'],'location');
  page.search('');
  assert.ok(page.links.every(link=>!link.hidden));
  assert.equal(page.links[0].attributes['aria-current'],'location');
});

test('catalogue search finds job synonyms across the eight supported languages',()=>{
  const page=catalogue();
  for(const [query,id]of [['truck','trucking'],['rengoring','cleaning'],['sprzatanie','cleaning'],['zlobek','childcare'],['curatenie','cleaning'],['valytojas','cleaning'],['уборщица','cleaning'],['прибиральниця','cleaning'],['чистачка','cleaning']]) {
    assert.ok(page.search(query).includes(id),query);
  }
});

test('multiple search words match in either order and ignore punctuation and case',()=>{
  const page=catalogue();
  assert.deepEqual(page.search(' HOTEL   cleaning '),['hotel']);
  assert.deepEqual(page.search('cleaning-hotel'),['hotel']);
  assert.deepEqual(page.search('DRIVER TRUCK'),['trucking']);
});

test('job acronyms match whole terms while ordinary partial queries still work',()=>{
  const page=catalogue();
  assert.deepEqual(page.search('IT'),['itsupport']);
  assert.deepEqual(page.search('cv'),['jobsearch']);
  assert.ok(page.search('ho').includes('hotel'));
  assert.ok(page.search('уб').includes('cleaning'));
});

test('no results hides empty groups and clearing restores all courses',()=>{
  const page=catalogue();
  assert.deepEqual(page.search('zzzznomatchingcourse'),[]);
  assert.equal(page.empty.hidden,false);
  assert.ok(page.groups.every(group=>group.hidden));
  assert.equal(page.search('').length,Object.keys(aliases).length);
  assert.equal(page.empty.hidden,true);
  assert.ok(page.groups.every(group=>!group.hidden));
});

test('a restored search field is filtered immediately on load',()=>{
  const page=catalogue('zzzznomatchingcourse');
  assert.equal(page.empty.hidden,false);
  assert.ok(page.groups.every(group=>group.hidden));
});

test('search opens matching subcategories, hides empty ones and restores the previous browsing state',()=>{
  const page=catalogue(),food=page.subcategories.find(c=>c.id==='category-food'),logistics=page.subcategories.find(c=>c.id==='category-logistics');
  food.open=true;
  assert.deepEqual(page.search('driver truck'),['trucking']);
  assert.equal(logistics.open,true);assert.equal(logistics.hidden,false);assert.equal(logistics.count.textContent,'1');
  assert.equal(food.hidden,true);assert.equal(food.open,false);assert.equal(food.preview.hidden,true);
  page.search('zzzznomatchingcourse');assert.ok(page.subcategories.every(c=>c.hidden&&!c.open));
  page.search('');assert.equal(food.open,true);assert.equal(logistics.open,false);
  assert.ok(page.subcategories.every(c=>!c.hidden&&!c.preview.hidden));assert.equal(food.count.textContent,'4');
});

test('every published course has exactly one translated subcategory and stays linked without JavaScript',()=>{
  const catalog=require('../catalog'),languages=['da','en','ru','uk','pl','ro','lt','bg'];
  for(const group of catalog.groups){
    const sections=catalog.sections(group),ids=sections.flatMap(section=>section.packs);
    assert.equal(new Set(ids).size,ids.length);assert.deepEqual([...ids].sort(),[...group.packs].sort());
    for(const section of sections)for(const lang of languages)assert.ok(section.name[lang]);
  }
  for(const lang of languages){const html=fs.readFileSync(require.resolve('../'+lang+'/index.html'),'utf8');
    assert.equal((html.match(/data-course-subcategory/g)||[]).length,catalog.subcategories.length);
    assert.equal((html.match(/<details class="course-subcategory"[^>]*\bopen\b/g)||[]).length,0);
    for(const category of catalog.subcategories)assert.ok(html.includes(`id="category-${category.id}"`));
  }
});

test('the app picker uses the same subcategories without changing an existing course or language pair',()=>{
  const catalog=require('../catalog'),app=require('./helpers/app.cjs');
  for(const base of ['da','en','ru','uk','pl','ro','lt','bg']){
    const a=app({target:base==='da'?'en':'da',base,pack:'salon',dir:'write',diff:2});
    a.run("render=()=>{};view='setup';draft={...state.settings};renderSetup();");
    const html=a.context.document.getElementById('app').innerHTML;
    for(const category of catalog.subcategories)assert.ok(html.includes(`<optgroup label="${category.name[base]}">`),base+'/'+category.id);
    assert.ok(html.includes('value="salon" selected'));
    assert.equal(a.run('state.settings.pack'),'salon');assert.equal(a.run('state.settings.base'),base);
  }
});

test('generated catalogues retain static links and index all translated course names',()=>{
  const vmContext={};
  vm.createContext(vmContext);
  vm.runInContext(fs.readFileSync(require.resolve('../packs/index.js'),'utf8'),vmContext);
  const packs=Object.values(vmContext.PACK_INDEX);
  const languages=['da','en','ru','uk','pl','ro','lt','bg'];
  for(const lang of languages){
    const html=fs.readFileSync(require.resolve('../'+lang+'/index.html'),'utf8');
    assert.equal((html.match(/data-course data-search=/g)||[]).length,packs.length+2);
    for(const pack of packs){
      assert.ok(html.includes('id="course-'+pack.id+'-title"'),lang+'/'+pack.id);
      assert.ok(Object.hasOwn(aliases,pack.id),pack.id+' has search synonyms');
      const search=html.match(new RegExp('<article class="course-card" data-course data-search="([^"]*)"><a[^>]*aria-labelledby="course-'+pack.id+'-title"'))?.[1];
      assert.ok(search,lang+'/'+pack.id+' search index');
      for(const name of Object.values(pack.name)) {
        const escaped=name.replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
        assert.ok(search.includes(escaped),lang+'/'+pack.id+'/'+name);
      }
    }
  }
});
