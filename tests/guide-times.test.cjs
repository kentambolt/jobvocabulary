const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {articleDigest,applyArticleTimes,validTime}=require('../data/guide-times');
const records=require('../data/guide-times.json');
const sample=fs.readFileSync(require.resolve('../en/guides/short-customer-conversations-in-danish/index.html'),'utf8');
const record={publishedAt:'2026-11-21T08:54:36+01:00',modifiedAt:'2026-11-21T08:54:36+01:00',articleHash:articleDigest(sample)};
const schema=html=>[...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(m=>JSON.parse(m[1])).find(x=>x['@type']==='Article');
test('article dates use documented timezone-aware timestamps, with a matching visible publication date',()=>{
 const html=applyArticleTimes(sample,record),article=schema(html);
 assert.equal(article.datePublished,record.publishedAt);assert.equal(article.dateModified,record.modifiedAt);
 assert.ok(html.includes('<time datetime="'+record.publishedAt+'">21.11.2026</time>'));
 for(const value of ['2026-11-21','2026-11-21T08:54:36','not a time'])assert.equal(validTime(value),false);
 assert.throws(()=>applyArticleTimes(sample,{...record,modifiedAt:'2026-11-20T08:54:36+01:00'}),/Invalid documented/);
});
test('changing article copy suppresses stale modification time while dates and related links do not refresh it',()=>{
 const modified=sample.replace('Give the customer time to answer.','Give the customer plenty of time to answer.');
 assert.notEqual(articleDigest(modified),record.articleHash);
 assert.equal(schema(applyArticleTimes(modified,record)).dateModified,undefined);
 assert.equal(schema(applyArticleTimes(modified,record)).datePublished,record.publishedAt);
 const links=sample.replace('/en/shop-and-supermarket/','/en/hotel/').replace('21.11.2026','22.11.2026');
 assert.equal(articleDigest(links),record.articleHash);
 assert.equal(schema(applyArticleTimes(links,record)).dateModified,record.modifiedAt);
});
test('unknown publication times are omitted instead of inventing a time from a calendar date',()=>{
 const article=schema(applyArticleTimes(sample));
 assert.equal(article.datePublished,undefined);assert.equal(article.dateModified,undefined);
});
test('recorded guide times match current article copy and the generated structured data',()=>{
 for(const[rel,record]of Object.entries(records)){
  const html=fs.readFileSync(path.join(__dirname,'..',rel,'index.html'),'utf8'),article=schema(html);
  assert.ok(validTime(record.publishedAt)&&validTime(record.modifiedAt),rel);
  assert.ok(Date.parse(record.publishedAt)<=Date.parse(record.modifiedAt),rel);
  assert.ok(Date.parse(record.modifiedAt)<=Date.now(),rel);
  assert.equal(articleDigest(html),record.articleHash,rel);
  assert.equal(article.datePublished,record.publishedAt,rel);assert.equal(article.dateModified,record.modifiedAt,rel);
 }
});
