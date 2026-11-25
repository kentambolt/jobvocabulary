'use strict';
// Disposable localhost QA. Default is a capture-only UI preview, never production.
// --staging explicitly enables only the provisioned jobvocabulary-staging profile.
const http=require('node:http'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'../..'),staging=process.argv.includes('--staging');
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json','.svg':'image/svg+xml','.webp':'image/webp','.png':'image/png','.jpg':'image/jpeg','.woff2':'font/woff2'};
const server=http.createServer((req,res)=>{
 try {
  const url=new URL(req.url,'http://127.0.0.1:8775');let part=decodeURIComponent(url.pathname);
  if(req.method!=='GET'||part.split('/').some(p=>p.startsWith('.'))||/^\/(?:android|data|tests|content)\//.test(part)){res.writeHead(404);return res.end();}
  if(part.endsWith('/'))part+='index.html';
  const file=path.resolve(root,'.'+part);if(!file.startsWith(root+path.sep)||!types[path.extname(file)]){res.writeHead(404);return res.end();}
  let body=fs.readFileSync(file);
  if(file.endsWith('.html')){
   body=body.toString().replace(/(<script[^>]+src="\/statistics-controls\.js[^>]*)(>)/,(_,tag,end)=>tag+(staging?' data-staging="true"':' data-preview="true"')+end);
   if(!staging)body=body.replace('<head>','<head><script>window.__JOBVOCABULARY_CAPTURE__=true;</script>');
   body=body.replace('<body','<body').replace(/(<body[^>]*>)/,'$1<p style="padding:8px 16px;margin:0;font-size:12px;background:#e9ece0;color:#153f2e">'+(staging?'QA: jobvocabulary-staging only. No production measurement.':'QA: UI preview. All measurement is blocked.')+'</p>');
  }
  res.writeHead(200,{'Content-Type':types[path.extname(file)],'Cache-Control':'no-store'});res.end(body);
 } catch {res.writeHead(404);res.end();}
});
server.listen(8775,'127.0.0.1',()=>console.log(staging?'Staging-only QA: http://127.0.0.1:8775':'No-measurement preview: http://127.0.0.1:8775'));
