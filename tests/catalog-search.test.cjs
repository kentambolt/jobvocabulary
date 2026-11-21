const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const aliases = require('../data/course-search-aliases.json');

function catalogue(initialQuery='') {
  const input = {value:initialQuery, addEventListener(type, fn) { this[type] = fn; }};
  const empty = {hidden:true};
  const cards = Object.entries(aliases).map(([id, search]) => ({id, textContent:id, dataset:{search}, hidden:false}));
  const groups = [cards.slice(0,15),cards.slice(15)].map(items => ({hidden:false,querySelectorAll:()=>items}));
  const document = {
    getElementById:id=>id==='courseSearch'?input:id==='courseEmpty'?empty:null,
    querySelectorAll:()=>groups
  };
  vm.runInNewContext(fs.readFileSync(require.resolve('../catalog-search.js'),'utf8'),{document,window:{addEventListener(){}}});
  return {groups, empty, search(query) {input.value=query; input.input(); return cards.filter(card=>!card.hidden).map(card=>card.id);}};
}

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

test('no results hides empty groups and clearing restores all courses',()=>{
  const page=catalogue();
  assert.deepEqual(page.search('zzzznomatchingcourse'),[]);
  assert.equal(page.empty.hidden,false);
  assert.ok(page.groups.every(group=>group.hidden));
  assert.equal(page.search('').length,31);
  assert.equal(page.empty.hidden,true);
  assert.ok(page.groups.every(group=>!group.hidden));
});

test('a restored search field is filtered immediately on load',()=>{
  const page=catalogue('zzzznomatchingcourse');
  assert.equal(page.empty.hidden,false);
  assert.ok(page.groups.every(group=>group.hidden));
});

test('generated catalogues retain static links and index all translated course names',()=>{
  const vmContext={};
  vm.createContext(vmContext);
  vm.runInContext(fs.readFileSync(require.resolve('../packs/index.js'),'utf8'),vmContext);
  const packs=Object.values(vmContext.PACK_INDEX);
  const languages=['da','en','ru','uk','pl','ro','lt','bg'];
  for(const lang of languages){
    const html=fs.readFileSync(require.resolve('../'+lang+'/index.html'),'utf8');
    assert.equal((html.match(/data-course data-search=/g)||[]).length,31);
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
