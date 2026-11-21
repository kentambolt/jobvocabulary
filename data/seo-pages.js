'use strict';
const fs = require('node:fs');
const path = require('node:path');
const { guides, contexts } = require('./seo-content');
const {socialMetadata,guideImage}=require('./social-meta');
const guideUI = require('./guide-ui');
const guideLanguages = Object.keys(guideUI);
const guideLabels = Object.fromEntries(guideLanguages.map(lang => [lang, guideUI[lang].guides]));
const guideIndex = lang => `/${guideLanguages.includes(lang) ? lang : 'en'}/guides/`;
const guidePath = (guide, lang) => `/${lang}/guides/${guide[lang].slug}/`;
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const jsonLD = object => `<script type="application/ld+json">${JSON.stringify(object).replace(/</g,'\\u003c')}</script>`;

function breadcrumbs(site, items, lang = 'en') {
  return `<nav class="breadcrumbs" aria-label="${esc(guideUI[lang]?.breadcrumb || guideUI.en.breadcrumb)}"><ol>${items.map(([name, href],i) => `<li>${i === items.length-1 ? `<span aria-current="page">${esc(name)}</span>` : `<a href="${href==='/' ? `/?ui=${lang}#forside` : href}">${esc(name)}</a>`}</li>`).join('')}</ol></nav>${jsonLD({
    '@context':'https://schema.org', '@type':'BreadcrumbList',
    itemListElement:items.map(([name,href],i) => ({'@type':'ListItem',position:i+1,name,item:site+href})),
  })}`;
}

function courseExtras(pack, lang) {
  const context = contexts[pack]?.[lang];
  const related = guides.filter(g => g[lang] && g.courses.includes(pack))
    .sort((a,b) => Number(b.courses[0]===pack)-Number(a.courses[0]===pack)).slice(0,3);
  return `${context ? `<section class="course-context"><h2>${esc(context[0])}</h2><p>${esc(context[1])}</p><ul>${context[2].map(s => `<li>${esc(s)}</li>`).join('')}</ul></section>` : ''}${related.length ? `<section class="related-guides"><h2>${esc(guideUI[lang].practiceGuides)}</h2><ul class="links">${related.map(g => `<li><a href="${guidePath(g,lang)}">${esc(g[lang].title)}</a></li>`).join('')}</ul></section>` : ''}`;
}

function languageLinks(lang, href) {
  return `<nav class="guide-languages" aria-label="${esc(guideUI[lang].languages)}"><span>${esc(guideUI[lang].languages)}</span>${guideLanguages.map(other => other === lang ? `<span lang="${other}" aria-current="page">${esc(guideUI[other].name)}</span>` : `<a href="${href(other)}" lang="${other}" hreflang="${other}">${esc(guideUI[other].name)}</a>`).join('')}</nav>`;
}

function buildGuides({root, site, packs, urlOf}) {
  const pages = [], urls = [];
  function write(rel, html) {
    const file = path.join(root, rel, 'index.html');
    fs.mkdirSync(path.dirname(file), {recursive:true});
    fs.writeFileSync(file, html.replace(/[ \t]+$/gm, ''));
    pages.push(file);
    urls.push(site+rel);
  }
  function head(lang, title, desc, rel, alternates, structured, image='study') {
    return `<!doctype html>
<html lang="${lang}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#f7f4ee">
  <title>${esc(title)} | Job Vocabulary</title>
  <meta name="description" content="${esc(desc)}">
  <link rel="canonical" href="${site+rel}">
${guideLanguages.map(other => `  <link rel="alternate" hreflang="${other}" href="${site+alternates(other)}">`).join('\n')}
  <link rel="alternate" hreflang="x-default" href="${site+alternates('en')}">
  <meta property="og:type" content="${structured['@type'] === 'Article' ? 'article' : 'website'}">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(desc)}">
  <meta property="og:url" content="${site+rel}">
  ${socialMetadata(lang,image,site)}
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="/style.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Lora:wght@400;500;600&display=swap" rel="stylesheet">
  ${jsonLD({'@context':'https://schema.org',...structured})}
</head>
<body class="page guide-page">
  <header class="top"><a class="brand" href="/?ui=${lang}#forside">Job<span>Vocabulary</span></a><a class="catalog-link" href="/${lang}/">${esc(guideUI[lang].catalog)}</a></header>`;
  }
  for (const lang of guideLanguages) {
    const l = guideUI[lang], index = guideIndex(lang);
    write(index, `${head(lang,l.title,l.intro,index,guideIndex,{
      '@type':'CollectionPage',name:l.title,url:site+index,inLanguage:lang,
      hasPart:guides.map(g => ({'@type':'Article',name:g[lang].title,url:site+guidePath(g,lang)})),
    })}
  <main>
    ${breadcrumbs(site,[[l.home,'/'],[l.guides,index]],lang)}
    <p class="eyebrow">${esc(l.lead)}</p><h1>${esc(l.title)}</h1><p class="lead">${esc(l.intro)}</p>
    <div class="guide-grid">${guides.map(g => `<article class="guide-card"><a class="guide-card-link" href="${guidePath(g,lang)}" aria-labelledby="guide-${g.id}-title"><h2 id="guide-${g.id}-title">${esc(g[lang].title)}</h2><p>${esc(g[lang].description)}</p></a></article>`).join('')}</div>
    ${languageLinks(lang,guideIndex)}
  </main>
</body>
</html>`);
    for (const guide of guides) {
      const g = guide[lang], rel = guidePath(guide,lang), first = guide.courses[0];
      const published=g.datePublished||'2026-11-20',modified=g.dateModified||published;
      if (guide.startTopics && (!Array.isArray(guide.startTopics) || !guide.startTopics.length || guide.startTopics.some(topic=>!packs.find(pack=>pack.id===first)?.categories.some(category=>category.key===topic)))) throw Error('Unknown guide practice topic: '+guide.id);
      const start = `/?ui=${lang}#start=${first}${lang === 'da' ? '' : `&amp;base=${lang}`}${guide.startTopics ? `&amp;topics=${encodeURIComponent(guide.startTopics.join(','))}` : ''}`;
      const related = guides.filter(o => o !== guide).sort((a,b) => b.courses.filter(id => guide.courses.includes(id)).length-a.courses.filter(id => guide.courses.includes(id)).length).slice(0,3);
      const examples = guide.examples.map(([da,en],i) => [da, g.exampleTranslations?.[i] || en]);
      const translationLang = lang === 'da' ? 'en' : lang;
      write(rel, `${head(lang,g.title,g.description,rel,other => guidePath(guide,other),{
        '@type':'Article',headline:g.title,description:g.description,inLanguage:lang,url:site+rel,
        mainEntityOfPage:site+rel,datePublished:published,dateModified:modified,
        author:{'@type':'Organization',name:'JobVocabulary',url:site+'/'},
        publisher:{'@type':'Organization',name:'JobVocabulary',url:site+'/'},
      },guideImage(guide.id))}
  <main>
    <article>
      ${breadcrumbs(site,[[l.home,'/'],[l.guides,index],[g.title,rel]],lang)}
      <h1>${esc(g.title)}</h1><p class="lead">${esc(g.intro)}</p>
      <p class="guide-byline">JobVocabulary · <time datetime="${published}">${published.split('-').reverse().join('.')}</time></p>
      <p><a class="primary cta" href="${start}">${esc(l.start)}</a></p>
      ${g.sections.map(([heading,...paragraphs]) => `<section><h2>${esc(heading)}</h2>${paragraphs.map(p => `<p>${esc(p)}</p>`).join('')}</section>`).join('\n      ')}
      ${examples.length ? `<section><h2>${esc(l.examples)}</h2><div class="table-wrap"><table><thead><tr><th scope="col">${esc(l.danish)}</th><th scope="col">${esc(l.translation)}</th></tr></thead><tbody>${examples.map(([da,translated]) => `<tr><td lang="da">${esc(da)}</td><td lang="${translationLang}">${esc(translated)}</td></tr>`).join('')}</tbody></table></div><p class="course-note">${esc(l.note)}</p></section>` : ''}
      <section><h2>${esc(l.courses)}</h2><ul class="links">${guide.courses.map(id => {
        const p = packs.find(p => p.id === id);
        if (!p) throw Error('Unknown guide course: '+id);
        return `<li><a href="${urlOf(p,lang)}">${esc(p.name[lang])}</a></li>`;
      }).join('')}</ul></section>
      <section><h2>${esc(l.related)}</h2><ul>${related.map(o => `<li><a href="${guidePath(o,lang)}">${esc(o[lang].title)}</a></li>`).join('')}</ul></section>
    </article>
    <footer class="catalogue-footer"><a href="${index}">${esc(l.back)}</a> · <a href="/${lang}/">${esc(l.catalog)}</a>${languageLinks(lang,other => guidePath(guide,other))}</footer>
  </main>
</body>
</html>`);
    }
  }
  return {pages, urls};
}
module.exports = {buildGuides,breadcrumbs,jsonLD,courseExtras,guideLabels,guideIndex,guideLanguages};
