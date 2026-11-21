'use strict';
const crypto=require('node:crypto');
// Git checks text out with different line endings on Windows and Linux.
// Cache identities must represent the content, not the checkout convention.
module.exports=function textAssetVersion(value,algorithm='sha256',length=12){
  const text=Buffer.isBuffer(value)?value.toString('utf8'):String(value);
  return crypto.createHash(algorithm).update(text.replace(/\r\n/g,'\n')).digest('hex').slice(0,length);
};
