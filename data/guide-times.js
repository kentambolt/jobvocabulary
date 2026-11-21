'use strict';
const crypto=require('node:crypto');
// Hash the article's own copy, excluding dates, navigation and related-link lists.
function articleDigest(html){
 const article=html.match(/<article>([\s\S]*?)<\/article>/)?.[1];
 if(!article)return null;
 const heading=article.match(/<h1>[\s\S]*?<\/h1>/)?.[0]||'';
 const intro=article.match(/<p class="lead">[\s\S]*?<\/p>/)?.[0]||'';
 const sections=[...article.matchAll(/<section(?:\s[^>]*)?>[\s\S]*?<\/section>/g)].map(m=>m[0]);
 if(!heading||!intro||sections.length<3)throw Error('Unrecognized guide article structure');
 const copy=[heading,intro,...sections.slice(0,-2)].join('').replace(/>\s+</g,'><').replace(/\s+/g,' ').trim();
 return crypto.createHash('sha256').update(copy).digest('hex');
}
function validTime(value){return typeof value==='string'&&/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:Z|[+-]\d\d:\d\d)$/.test(value)&&Number.isFinite(Date.parse(value));}
function applyArticleTimes(html,record){
 const digest=articleDigest(html);if(!digest)return html;
 if(record&&(!validTime(record.publishedAt)||!validTime(record.modifiedAt)||Date.parse(record.modifiedAt)<Date.parse(record.publishedAt)))throw Error('Invalid documented guide timestamps');
 const changed=record?.articleHash!==digest;
 html=html.replace(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g,(tag,json)=>{
  const schema=JSON.parse(json);if(schema['@type']!=='Article')return tag;
  delete schema.datePublished;delete schema.dateModified;
  if(record){schema.datePublished=record.publishedAt;if(!changed)schema.dateModified=record.modifiedAt;}
  return '<script type="application/ld+json">'+JSON.stringify(schema).replace(/</g,'\\u003c')+'</script>';
 });
 if(record){const day=record.publishedAt.slice(0,10);html=html.replace(/<time datetime="[^"]+">[^<]+<\/time>/,`<time datetime="${record.publishedAt}">${day.split('-').reverse().join('.')}</time>`);}
 return html;
}
module.exports={articleDigest,applyArticleTimes,validTime};
