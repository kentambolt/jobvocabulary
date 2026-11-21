'use strict';

// Published paths are identities. A wording correction must not rename a URL.
function courseRoutes(packs,languages,previous,slugify) {
  if(!previous || typeof previous!=='object' || Array.isArray(previous)) throw new Error('Invalid course URL registry');
  const registry={};
  const reserved=new Map();
  const register=(id,lang,url)=>{
    if(!/^[a-z][a-z0-9-]*$/.test(id) || !/^[a-z]{2}$/.test(lang) || typeof url!=='string' || !new RegExp('^/'+lang+'/[a-z0-9]+(?:-[a-z0-9]+)*/$').test(url)) throw new Error('Invalid course URL: '+id+'/'+lang);
    const owner=id+':'+lang;
    if(reserved.has(url)&&reserved.get(url)!==owner) throw new Error('Course URL collision: '+url);
    reserved.set(url,owner);
    if(!Object.hasOwn(registry,id)) Object.defineProperty(registry,id,{value:{},enumerable:true});
    registry[id][lang]=url;
  };
  for(const [id,localized]of Object.entries(previous)) {
    if(!localized || typeof localized!=='object' || Array.isArray(localized)) throw new Error('Invalid localized URL registry');
    for(const [lang,url]of Object.entries(localized)) register(id,lang,url);
  }
  for(const pack of packs)for(const lang of languages) {
    if(Object.hasOwn(registry,pack.id)&&Object.hasOwn(registry[pack.id],lang)) continue;
    const slug=['da','en','pl','ro','lt'].includes(lang)?slugify(pack.name[lang]):pack.id;
    register(pack.id,lang,`/${lang}/${slug}/`);
  }
  return Object.fromEntries(Object.entries(registry).sort(([a],[b])=>a.localeCompare(b)).map(([id,localized])=>[id,Object.fromEntries(Object.entries(localized).sort(([a],[b])=>a.localeCompare(b)))]));
}

module.exports=courseRoutes;
