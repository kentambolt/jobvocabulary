'use strict';
const fs = require('node:fs');
const path = require('node:path');
const { guides, contexts } = require('./seo-content');
const guideLabels = {da:'Guides',en:'Guides',ru:'Руководства на английском',uk:'Посібники англійською',pl:'Poradniki po angielsku',ro:'Ghiduri în engleză'};
const guideLang = lang => lang === 'da' ? 'da' : 'en';
const guideIndex = lang => `/${guideLang(lang)}/guides/`;
const guidePath = (guide, lang) => `/${lang}/guides/${guide[lang].slug}/`;
const esc = s => String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const jsonLD = object => `<script type="application/ld+json">${JSON.stringify(object).replace(/</g,'\\u003c')}</script>`;
function breadcrumbs(site, items) {
  return `<nav class="breadcrumbs" aria-label="Breadcrumb"><ol>${items.map(([name, href],i)=>`<li>${i===items.length-1?`<span aria-current="page">${esc(name)}</span>`:`<a href="${href}">${esc(name)}</a>`}</li>`).join('')}</ol></nav>${jsonLD({'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:items.map(([name,href],i)=>({'@type':'ListItem',position:i+1,name,item:site+href}))})}`;
}
function relatedGuides(pack,lang) { return ['da','en'].includes(lang) ? guides.filter(g=>g.courses.includes(pack)).slice(0,3) : []; }
function courseExtras(pack,lang,site) {
  const context=contexts[pack]?.[lang];
  const related=relatedGuides(pack,lang);
  return `${context?`<section class="course-context"><h2>${esc(context[0])}</h2><p>${esc(context[1])}</p><ul>${context[2].map(s=>`<li>${esc(s)}</li>`).join('')}</ul></section>`:''}${related.length?`<section class="related-guides"><h2>${lang==='da'?'Guides til din træning':'Guides for your practice'}</h2><ul class="links">${related.map(g=>`<li><a href="${guidePath(g,lang)}">${esc(g[lang].title)}</a></li>`).join('')}</ul></section>`:''}`;
}

function buildGuides({root,site,packs,urlOf}) {
  const pages=[],urls=[];
  const t={da:{home:'Forside',lead:'Sprog til arbejde og hverdag',title:'Guides til dansk på arbejde og i hverdagen',intro:'Praktiske eksempler og råd til at vælge de ord, du vil træne. Find en situation, du kender, og fortsæt direkte til et kursus.',examples:'Danske ord og sætninger i praksis',danish:'Dansk',english:'Engelsk',courses:'Fortsæt med et relevant kursus',related:'Læs også',start:'Start træningen',catalog:'Find dit kursus',back:'Alle guides',by:'JobVocabulary',note:'Eksemplerne er sprogtræning. Tilpas formuleringerne til din egen situation.'},en:{home:'Home',lead:'Language for work and everyday life',title:'Guides to Danish for work and everyday life',intro:'Practical examples to help you choose the words you want to practise. Start with a familiar situation, then continue directly to a course.',examples:'Danish words and phrases in practice',danish:'Danish',english:'English',courses:'Continue with a relevant course',related:'Read next',start:'Start practising',catalog:'Find your course',back:'All guides',by:'JobVocabulary',note:'These are language practice examples. Adapt the wording to your own situation.'}};
  function write(rel,html){const file=path.join(root,rel,'index.html');fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,html.replace(/[ \t]+$/gm,''));pages.push(file);urls.push(site+rel);}
  function head(lang,title,desc,rel,alternates,structured){return `<!doctype html>
<html lang="${lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="theme-color" content="#f7f4ee">
<title>${esc(title)} | Job Vocabulary</title><meta name="description" content="${esc(desc)}"><link rel="canonical" href="${site+rel}">
${['da','en'].map(l=>`<link rel="alternate" hreflang="${l}" href="${site+alternates(l)}">`).join('\n')}<link rel="alternate" hreflang="x-default" href="${site+alternates('en')}">
<meta property="og:type" content="${structured['@type']==='Article'?'article':'website'}"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(desc)}"><meta property="og:url" content="${site+rel}"><meta name="twitter:card" content="summary">
<link rel="icon" href="/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="/style.css"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Lora:wght@400;500;600&display=swap" rel="stylesheet">
${jsonLD({'@context':'https://schema.org',...structured})}</head><body class="page guide-page"><header class="top"><a class="brand" href="/?ui=${lang}#forside">Job<span>Vocabulary</span></a><a class="catalog-link" href="/${lang}/">${t[lang].catalog}</a></header>`;}
  for(const lang of ['da','en']) {
    const l=t[lang], index=guideIndex(lang);
    write(index,`${head(lang,l.title,l.intro,index,guideIndex,{'@type':'CollectionPage',name:l.title,url:site+index,inLanguage:lang,hasPart:guides.map(g=>({'@type':'Article',name:g[lang].title,url:site+guidePath(g,lang)}))})}<main>${breadcrumbs(site,[[l.home,'/'],[guideLabels[lang],index]])}<p class="eyebrow">${l.lead}</p><h1>${l.title}</h1><p class="lead">${l.intro}</p><div class="guide-grid">${guides.map(g=>`<article class="guide-card"><h2><a href="${guidePath(g,lang)}">${esc(g[lang].title)}</a></h2><p>${esc(g[lang].description)}</p></article>`).join('')}</div><p class="langs">${lang==='da'?'Read in English':'Læs på dansk'}: <a href="${guideIndex(lang==='da'?'en':'da')}" lang="${lang==='da'?'en':'da'}" hreflang="${lang==='da'?'en':'da'}">${lang==='da'?'English':'Dansk'}</a></p></main></body></html>`);
    for(const guide of guides) {
      const g=guide[lang],rel=guidePath(guide,lang),first=guide.courses[0];
      const start=`/?ui=${lang}#start=${first}${lang==='en'?'&amp;base=en':''}`;
      const related=guides.filter(o=>o!==guide).sort((a,b)=>b.courses.filter(id=>guide.courses.includes(id)).length-a.courses.filter(id=>guide.courses.includes(id)).length).slice(0,3);
      write(rel,`${head(lang,g.title,g.description,rel,l=>guidePath(guide,l),{'@type':'Article',headline:g.title,description:g.description,inLanguage:lang,url:site+rel,mainEntityOfPage:site+rel,datePublished:'2026-11-20',dateModified:'2026-11-20',author:{'@type':'Organization',name:'JobVocabulary',url:site+'/'},publisher:{'@type':'Organization',name:'JobVocabulary',url:site+'/'}})}<main><article>${breadcrumbs(site,[[l.home,'/'],[guideLabels[lang],index],[g.title,rel]])}<h1>${esc(g.title)}</h1><p class="lead">${esc(g.intro)}</p><p class="guide-byline">${l.by} · <time datetime="2026-11-20">20.11.2026</time></p><p><a class="primary cta" href="${start}">${l.start}</a></p>${g.sections.map(([heading,...paragraphs])=>`<section><h2>${esc(heading)}</h2>${paragraphs.map(p=>`<p>${esc(p)}</p>`).join('')}</section>`).join('')}${guide.examples.length?`<section><h2>${l.examples}</h2><div class="table-wrap"><table><thead><tr><th>${l.danish}</th><th>${l.english}</th></tr></thead><tbody>${guide.examples.map(([da,en])=>`<tr><td lang="da">${esc(da)}</td><td lang="en">${esc(en)}</td></tr>`).join('')}</tbody></table></div><p class="course-note">${l.note}</p></section>`:''}<section><h2>${l.courses}</h2><ul class="links">${guide.courses.map(id=>{const p=packs.find(p=>p.id===id);if(!p)throw Error('Unknown guide course: '+id);return `<li><a href="${urlOf(p,lang)}">${esc(p.name[lang])}</a></li>`;}).join('')}</ul></section><section><h2>${l.related}</h2><ul>${related.map(o=>`<li><a href="${guidePath(o,lang)}">${esc(o[lang].title)}</a></li>`).join('')}</ul></section></article><footer class="catalogue-footer"><a href="${index}">${l.back}</a> · <a href="/${lang}/">${l.catalog}</a> · <a href="${guidePath(guide,lang==='da'?'en':'da')}" hreflang="${lang==='da'?'en':'da'}" lang="${lang==='da'?'en':'da'}">${lang==='da'?'English':'Dansk'}</a></footer></main></body></html>`);
    }
  }
  return {pages,urls};
}
module.exports={buildGuides,breadcrumbs,jsonLD,courseExtras,guideLabels,guideIndex};
