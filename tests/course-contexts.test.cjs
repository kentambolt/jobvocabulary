const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const {contexts}=require('../data/seo-content');
const routes=require('../data/course-urls.json');
const languages=['da','en','ru','uk','pl','ro','lt','bg'];
const escape=value=>value.replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));

test('every published course has its own practical context in all eight page languages',()=>{
  assert.deepEqual(Object.keys(contexts).sort(),Object.keys(routes).sort());
  for(const [id,localized]of Object.entries(contexts)) {
    assert.deepEqual(Object.keys(localized).sort(),languages.slice().sort());
    for(const lang of languages) {
      const [heading,paragraph,actions]=localized[lang];
      const html=fs.readFileSync(require.resolve('..'+routes[id][lang]+'index.html'),'utf8');
      assert.ok(html.includes('<section class="course-context"><h2>'+escape(heading)+'</h2><p>'+escape(paragraph)+'</p>'),id+'/'+lang);
      assert.equal(actions.length,3);
      for(const action of actions)assert.ok(html.includes('<li>'+escape(action)+'</li>'),id+'/'+lang+'/'+action);
      assert.ok(html.indexOf('class="primary cta"')<html.indexOf('class="course-context"'),'Start stays before extended reading: '+id+'/'+lang);
      assert.doesNotMatch([heading,paragraph,...actions].join(' '),/[→←–—]/);
    }
  }
});
