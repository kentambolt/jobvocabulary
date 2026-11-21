const test=require('node:test');
const assert=require('node:assert/strict');
const version=require('../data/text-asset-version');

test('Windows and Linux text assets share one cache identity while content edits invalidate it',()=>{
  const text='const title = "Українська og Română";\nconst words = ["værelse", "łóżko"];\n';
  assert.equal(version(text),version(Buffer.from(text.replaceAll('\n','\r\n'))));
  assert.equal(version(text,'md5',8),version(text.replaceAll('\n','\r\n'),'md5',8));
  assert.notEqual(version(text),version(text.replace('værelse','værelser')));
  assert.notEqual(version(text),version(text.replace('["værelse", "łóżko"]','["łóżko", "værelse"]')));
});
