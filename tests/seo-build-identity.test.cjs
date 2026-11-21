const test=require('node:test');
const assert=require('node:assert/strict');
const courseRoutes=require('../data/course-routes');
const {pageDigest,updateRecord}=require('../data/build-sitemap');
const slugify=value=>value.toLowerCase().replaceAll(' ','-');

test('correcting a course title preserves published language URLs and adds only missing routes',()=>{
  const previous={hotel:{da:'/da/hotel-og-housekeeping/',en:'/en/hotel-and-housekeeping/'}};
  const snapshot=JSON.stringify(previous);
  const result=courseRoutes([{id:'hotel',name:{da:'Et bedre kursusnavn',en:'A better course title',pl:'Hotel'}}],['da','en','pl'],previous,slugify);
  assert.equal(result.hotel.da,previous.hotel.da);
  assert.equal(result.hotel.en,previous.hotel.en);
  assert.equal(result.hotel.pl,'/pl/hotel/');
  assert.equal(JSON.stringify(previous),snapshot);
});

test('retired paths stay reserved and cannot be silently claimed by a new course',()=>{
  assert.throws(()=>courseRoutes([{id:'newhotel',name:{en:'Old hotel'}}],['en'],{retired:{en:'/en/old-hotel/'}},slugify),/collision/);
});

test('course routes reject paths outside their language namespace',()=>{
  for(const url of ['/en/../../private/','https://example.com/course/','/da/hotel/','/en/hotel/?x=1'])assert.throws(()=>courseRoutes([],['en'],{hotel:{en:url}},slugify),/Invalid course URL/);
});

test('a repeat build or stylesheet cache refresh retains the real page update date',()=>{
  const original='<link rel="stylesheet" href="/style.css?v=abc123"><h1>Learn Danish</h1>';
  const first=updateRecord(null,original,'2026-11-21','2026-11-20');
  assert.equal(first.lastmod,'2026-11-20');
  assert.deepEqual(updateRecord(first,original.replace('abc123','def456'),'2026-11-22'),first);
  assert.equal(pageDigest(original),pageDigest(original.replace('abc123','def456')));
});

test('content, links and application logic changes advance the recorded update date',()=>{
  for(const [old,next]of [['<h1>Danish</h1>','<h1>Danish for work</h1>'],['<a href="/en/">Courses</a>','<a href="/pl/">Courses</a>'],['<script src="app.js?v=one"></script>','<script src="app.js?v=two"></script>']]){
    const first=updateRecord(null,old,'2026-11-21','2026-11-20');
    assert.equal(updateRecord(first,next,'2026-11-22').lastmod,'2026-11-22');
  }
});

test('unknown historical dates are omitted and invalid or future dates are rejected',()=>{
  assert.equal(updateRecord(null,'<h1>Danish</h1>','2026-11-21').lastmod,undefined);
  for(const date of ['2026-02-31','2026-11-22','not-a-date'])assert.throws(()=>updateRecord(null,'text','2026-11-21',date),/Invalid sitemap date/);
});
