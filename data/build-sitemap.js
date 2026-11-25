'use strict';
const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
const {execFileSync}=require('node:child_process');

function pageDigest(html) {
  // A stylesheet/icon cache refresh alone is not a content update.
  // Consent scripts and privacy-navigation chrome do not update the lesson content.
  const learningContent=html.replace(/<!-- STATISTICS -->[\s\S]*?<!-- \/STATISTICS -->/g,'')
    .replace(/<footer class="statistics-footer">[\s\S]*?<\/footer>/g,'');
  const content=learningContent.replace(/<link\b(?=[^>]*\brel="(?:stylesheet|icon)")[^>]*>/g,tag=>tag.replace(/\?v=[^"\s]*/g,''))
    .replace(/\s+/g,' ').trim();
  return crypto.createHash('sha256').update(content).digest('hex');
}
function validDate(value) {
  if(!/^\d{4}-\d{2}-\d{2}$/.test(value||'')) return false;
  const date=new Date(value+'T00:00:00Z');
  return Number.isFinite(date.getTime())&&date.toISOString().slice(0,10)===value;
}
function updateRecord(previous,html,today,initialLastmod) {
  if(!validDate(today)) throw new Error('Invalid build date');
  const digest=pageDigest(html);
  const lastmod=previous?.digest===digest ? previous.lastmod||initialLastmod : previous ? today : initialLastmod;
  if(lastmod && (!validDate(lastmod)||lastmod>today)) throw new Error('Invalid sitemap date: '+lastmod);
  return {digest,...(lastmod?{lastmod}:{})};
}
function repositoryDates(root,roots) {
  const git=args=>execFileSync('git',['-c','core.quotepath=false',...args],{cwd:root,encoding:'utf8',maxBuffer:16*1024*1024,stdio:['pipe','pipe','pipe']});
  try {
    const log=git(['log','--first-parent','--format=%x1e%cs','--name-only','--',...roots]);
    const dates=new Map();let date;
    for(const line of log.split(/\r?\n/)) {
      if(line.startsWith('\x1e')) date=line.slice(1).trim();
      else if(line&&date&&!dates.has(line)) dates.set(line,date);
    }
    const dirty=new Set(git(['diff','--name-only','HEAD','--',...roots]).trim().split(/\r?\n/).filter(Boolean));
    return {available:true,dates,dirty,head:file=>git(['show','HEAD:'+file])};
  } catch {
    return {available:false,dates:new Map(),dirty:new Set()};
  }
}
function writeSitemap(root,site,urls) {
  const file=path.join(root,'data/page-updates.json');
  const previous=fs.existsSync(file)?JSON.parse(fs.readFileSync(file,'utf8')):{};
  const today=new Intl.DateTimeFormat('sv-SE',{timeZone:'Europe/Copenhagen'}).format(new Date());
  const items=urls.map(url=>{
    const parsed=new URL(url);
    if(parsed.origin!==new URL(site).origin || !/^\/(?:[a-z0-9-]+\/)*$/.test(parsed.pathname) || parsed.search || parsed.hash) throw new Error('Invalid sitemap URL: '+url);
    return {url,pathname:parsed.pathname,relative:parsed.pathname.slice(1)+'index.html'};
  });
  const needsHistory=items.some(item=>!previous[item.pathname]?.lastmod);
  const roots=[...new Set(items.map(item=>item.relative.split('/')[0]))];
  const history=needsHistory?repositoryDates(root,roots):null;
  const hadRegistry=Object.keys(previous).length>0;
  const records={};
  for(const item of items) {
    const html=fs.readFileSync(path.join(root,item.relative),'utf8');
    let initialLastmod;
    if(!previous[item.pathname]?.lastmod) {
      initialLastmod=history?.dates.get(item.relative);
      if(initialLastmod&&history.dirty.has(item.relative)) {
        if(pageDigest(history.head(item.relative))!==pageDigest(html)) initialLastmod=today;
      }
      if(!initialLastmod&&(history?.available||hadRegistry)) initialLastmod=today;
    }
    records[item.pathname]=updateRecord(previous[item.pathname],html,today,initialLastmod);
  }
  const esc=value=>value.replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[char]));
  fs.writeFileSync(path.join(root,'sitemap.xml'),`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${items.map(item=>`  <url><loc>${esc(item.url)}</loc>${records[item.pathname].lastmod?`<lastmod>${records[item.pathname].lastmod}</lastmod>`:''}</url>`).join('\n')}\n</urlset>\n`);
  fs.writeFileSync(file,JSON.stringify(Object.fromEntries(Object.entries(records).sort(([a],[b])=>a.localeCompare(b))),null,2)+'\n');
}
module.exports={pageDigest,updateRecord,writeSitemap};
