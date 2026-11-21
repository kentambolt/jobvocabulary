// Laver en statisk side pr. pakke på 6 sprog (til søgemaskiner), opdaterer linklisten på
// forsiden og sitemap.xml. Kør efter ændringer i pakkerne: node data/build-pages.js
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const crypto = require('crypto');
const catalog = require('../catalog');
const seo = require('./seo-pages');
const courseRoutes = require('./course-routes');
const {writeSitemap} = require('./build-sitemap');

const ROOT = path.join(__dirname, '..');
const SITE = 'https://jobvocabulary.com';
const LANGS = ['da', 'en', 'ru', 'uk', 'pl', 'ro', 'lt', 'bg'];
const LANG_NAME = { da: 'Dansk', en: 'English', ru: 'Русский', uk: 'Українська', pl: 'Polski', ro: 'Română', lt:'Lietuvių', bg:'Български' };
const ORDER = ['cleaning', 'restaurant', 'warehouse', 'construction', 'care', 'agriculture', 'retail', 'transport', 'essentials', 'driving'];

const T = {
  da: {
    title: (n) => `${n}: Lær de danske ord og sætninger | Job Vocabulary`,
    sub: 'Lær de danske ord og sætninger ét ad gangen',
    intro: (total, cats) => `${total} ord og sætninger i ${cats} emner, med oversættelse til engelsk, russisk, ukrainsk, polsk, rumænsk, litauisk og bulgarsk. Det vigtigste kommer først, og det du kan, kommer sjældnere igen.`,
    cta: 'Start med at øve gratis',
    howTitle: 'Sådan virker det',
    how: [
      'Du får ét ord eller én sætning ad gangen. Det vigtigste kommer først.',
      'Svarer du rigtigt, går der længere tid, før det kommer igen. Svarer du forkert, kommer det hurtigt igen.',
      'Kan du allerede noget, tager du en kort niveautest og springer det over, du kan.',
    ],
    topics: 'Emner', words: 'Nogle af de vigtigste ord', phrases: 'Nogle af de vigtigste sætninger',
    others: 'Andre emner', langs: 'Læs siden på', home: 'Forside', free: 'Gratis · uden login · virker på mobilen',
    n: (k) => `${k}`,
  },
  en: {
    title: (n) => `${n}: Learn the Danish words and phrases | Job Vocabulary`,
    sub: 'Learn the Danish words and phrases one at a time',
    intro: (total, cats) => `${total} words and phrases in ${cats} topics, translated into English, Russian, Ukrainian, Polish, Romanian, Lithuanian and Bulgarian. The most important come first, and what you know comes back less often.`,
    cta: 'Start practising for free',
    howTitle: 'How it works',
    how: [
      'You get one word or one sentence at a time. The most important come first.',
      'Answer correctly and it takes longer before it comes back. Answer wrong and it comes back soon.',
      'Already know some Danish? Take a short level test and skip what you know.',
    ],
    topics: 'Topics', words: 'Some of the most important words', phrases: 'Some of the most important phrases',
    others: 'Other topics', langs: 'Read this page in', home: 'Home', free: 'Free · no login · works on your phone',
  },
  ru: {
    title: (n) => `${n}: датские слова и фразы | Job Vocabulary`,
    sub: 'Учите датские слова и фразы по одной за раз',
    intro: (total, cats) => `${total} слов и фраз в ${cats} темах с переводами на русский, украинский, английский, польский, румынский, литовский и болгарский. Сначала самое важное, а то, что вы знаете, повторяется реже.`,
    cta: 'Начать учить бесплатно',
    howTitle: 'Как это работает',
    how: [
      'Вы получаете одно слово или одну фразу за раз. Сначала самое важное.',
      'Если ответите правильно, слово вернётся нескоро. Если ошибётесь, оно скоро вернётся.',
      'Уже знаете немного датский? Пройдите короткий тест уровня и пропустите то, что знаете.',
    ],
    topics: 'Темы', words: 'Самые важные слова', phrases: 'Самые важные фразы',
    others: 'Другие темы', langs: 'Эта страница на других языках', home: 'Главная', free: 'Бесплатно · без регистрации · работает на телефоне',
  },
  uk: {
    title: (n) => `${n}: данські слова і фрази | Job Vocabulary`,
    sub: 'Вивчайте данські слова і фрази по одній за раз',
    intro: (total, cats) => `${total} слів і фраз у ${cats} темах із перекладами українською, російською, англійською, польською, румунською, литовською та болгарською. Спочатку найважливіше, а те, що ви знаєте, повторюється рідше.`,
    cta: 'Почати вчити безкоштовно',
    howTitle: 'Як це працює',
    how: [
      'Ви отримуєте одне слово або одну фразу за раз. Спочатку найважливіше.',
      'Якщо відповісте правильно, слово повернеться нескоро. Якщо помилитеся, воно скоро повернеться.',
      'Вже трохи знаєте данську? Пройдіть короткий тест рівня і пропустіть те, що знаєте.',
    ],
    topics: 'Теми', words: 'Найважливіші слова', phrases: 'Найважливіші фрази',
    others: 'Інші теми', langs: 'Ця сторінка іншими мовами', home: 'Головна', free: 'Безкоштовно · без реєстрації · працює на телефоні',
  },
};

const extraLocales = require('../locales');
for (const [lang, locale] of Object.entries(extraLocales)) T[lang] = { ...locale.page,
  title: name => locale.page.titleSuffix ? `${name}: ${locale.page.titleSuffix} | Job Vocabulary` : lang === 'pl' ? `${name}: duńskie słowa i zwroty | Job Vocabulary` : `${name}: cuvinte și expresii în daneză | Job Vocabulary`,
  intro: (total,topics) => locale.page.intro ? locale.page.intro.replace('{total}',total).replace('{topics}',topics) : lang === 'pl' ? `${total} słów i zwrotów w ${topics} tematach, z tłumaczeniem na polski. Najważniejsze są na początku, a znane słowa wracają rzadziej.` : `${total} cuvinte și expresii în ${topics} teme, cu traducere în română. Cele mai importante apar primele, iar cele cunoscute revin mai rar.`
};
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const slugify = (s) => s.toLowerCase().replace(/æ/g, 'ae').replace(/ø/g, 'oe').replace(/å/g, 'aa').replace(/ł/g, 'l')
  .normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

// --- indlæs pakker ---
const ctx = {};
vm.createContext(ctx);
for (const f of fs.readdirSync(path.join(ROOT, 'packs')).filter((f) => f.endsWith('.js') && f !== 'index.js')) {
  vm.runInContext(fs.readFileSync(path.join(ROOT, 'packs', f), 'utf8'), ctx);
}
vm.runInContext('this.P = PACKS;', ctx);
const courseOrder = catalog.groups.flatMap(group => group.packs);
const packs = Object.values(ctx.P).sort((a, b) => courseOrder.indexOf(a.id) - courseOrder.indexOf(b.id));
const knownPacks=new Set(packs.map(pack=>pack.id));
for(const pack of packs) {
  if(courseOrder.filter(id=>id===pack.id).length!==1) throw new Error('Course must belong to exactly one catalogue group: '+pack.id);
  const related=catalog.related[pack.id]||[];
  if(related.length>6 || new Set(related).size!==related.length || related.some(id=>id===pack.id||!knownPacks.has(id))) throw new Error('Invalid related courses: '+pack.id);
}
if(courseOrder.some(id=>!['top','pics'].includes(id)&&!knownPacks.has(id))) throw new Error('Catalogue references a missing course');

const routeFile=path.join(__dirname,'course-urls.json');
const routes=courseRoutes(packs,LANGS,fs.existsSync(routeFile)?JSON.parse(fs.readFileSync(routeFile,'utf8')):{},slugify);
const urlOf = (p,lang) => routes[p.id][lang];

// Prioritet 1 på skift mellem emnerne (samme rækkefølge som i appen).
function sample(p, type, n) {
  const queues = p.categories.filter((c) => c.type === type).map((c) => c.rows.filter((r) => r[0] === 1));
  const out = [];
  while (out.length < n && queues.some((q) => q.length)) for (const q of queues) if (q.length && out.length < n) out.push(q.shift());
  return out;
}

function page(p, lang) {
  const t = T[lang];
  const name = p.name[lang];
  const total = p.categories.reduce((s, c) => s + c.rows.length, 0);
  const url = SITE + urlOf(p, lang);
  const related = (catalog.related[p.id] || []).map(id=>packs.find(pack=>pack.id===id)).filter(Boolean);
  const cols = ['da',lang === 'da' ? 'en' : lang];
  const col = (l) => LANGS.indexOf(l) + 1;
  const table = (rows) => `<div class="table-wrap"><table><thead><tr>${cols.map((l) => `<th>${esc(LANG_NAME[l])}</th>`).join('')}</tr></thead><tbody>
${rows.map((r) => `<tr>${cols.map((l) => `<td lang="${l}"${l === 'da' ? ' class="da"' : ''}>${esc(r[col(l)])}</td>`).join('')}</tr>`).join('\n')}
</tbody></table></div>`;
  const desc = `${p.desc[lang].replace(/[.!?]$/, '')}. ${total} ${catalog.labels[lang].units}.`;
  return `<!doctype html>
<html lang="${lang}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#f7f4ee">
  <title>${esc(t.title(name))}</title>
  <meta name="description" content="${esc(desc)}">
  <link rel="canonical" href="${url}">
${LANGS.map((l) => `  <link rel="alternate" hreflang="${l}" href="${SITE + urlOf(p, l)}">`).join('\n')}
  <link rel="alternate" hreflang="x-default" href="${SITE + urlOf(p, 'da')}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="${url}">
  <meta property="og:title" content="${esc(t.title(name))}">
  <meta property="og:description" content="${esc(desc)}">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Lora:wght@400;500;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/style.css">
  <script type="application/ld+json">${JSON.stringify({
    '@context': 'https://schema.org', '@type': 'Course', '@id': url+'#course', url, name: t.title(name).replace(' | Job Vocabulary', ''), description: desc, inLanguage: [...new Set(['da',lang])],
    isAccessibleForFree: true, provider: { '@type': 'Organization', name: 'Job Vocabulary', url: SITE + '/' },
  })}</script>
</head>
<body class="page">
  <header class="top"><a class="brand" href="/?ui=${lang}#forside">Job<span>Vocabulary</span></a><a class="catalog-link" href="/${lang}/">${esc(catalog.labels[lang].back)}</a></header>
  <main>
    ${seo.breadcrumbs(SITE,[[t.home,'/'],[catalog.labels[lang].catalog,`/${lang}/`],[name,urlOf(p,lang)]],lang)}
    <h1>${esc(name)}</h1>
    <p class="lead">${esc(t.sub)}</p>
    <p>${esc(p.desc[lang])}. ${esc(t.intro(total, p.categories.length))}</p>
    <p><a class="primary cta" href="/?ui=${lang}#start=${p.id}${lang === 'da' ? '' : `&amp;base=${lang}`}">${esc(t.cta)}</a></p>
    <p class="tagline">${esc(t.free)}</p>
    ${p.id === 'driving' ? `<p class="course-note">${esc(catalog.labels[lang].safety)}</p>` : ''}
    ${seo.courseExtras(p.id,lang,SITE)}

    <h2>${esc(t.howTitle)}</h2>
    <ol class="how">${t.how.map((h) => `<li>${esc(h)}</li>`).join('')}</ol>

    <h2>${esc(t.topics)}</h2>
    <ul class="topics">${p.categories.map((c) => `<li>${esc(c.name[lang])} <small>${c.rows.length}</small></li>`).join('')}</ul>

    <h2>${esc(t.words)}</h2>
    ${table(sample(p, 'word', 24))}

    <h2>${esc(t.phrases)}</h2>
    ${table(sample(p, 'phrase', 12))}

    <p><a class="primary cta" href="/?ui=${lang}#start=${p.id}${lang === 'da' ? '' : `&amp;base=${lang}`}">${esc(t.cta)}</a></p>

    <h2>${esc(t.others)}</h2>
    <ul class="links">${related.map((o) => `<li><a href="${urlOf(o, lang)}">${esc(o.name[lang])}</a></li>`).join('')}</ul>

    <p class="langs">${esc(t.langs)}: ${LANGS.filter((l) => l !== lang).map((l) => `<a href="${urlOf(p, l)}" hreflang="${l}" lang="${l}">${esc(LANG_NAME[l])}</a>`).join(' · ')}</p>
    <p><a href="/${lang}/">${esc(catalog.labels[lang].back)}</a></p>
  </main>
</body>
</html>
`;
}

// --- skriv sider ---
const urls = [`${SITE}/`];
// Preserve published URLs and any hand-authored files; overwrite only generated pages.
for (const p of packs) {
  for (const lang of LANGS) {
    const rel = urlOf(p, lang);
    const dir = path.join(ROOT, rel);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'index.html'), page(p, lang).replace(/[ \t]+$/gm, ''));
    urls.push(SITE + rel);
  }
}

// --- links på forsiden (mellem markørerne i index.html) ---
const indexPath = path.join(ROOT, 'index.html');
const homeDescription = `Lær ord og sætninger til job, transport og hverdag. Vælg mellem ${packs.length} kurser og ${LANGS.length} sprog, og træn i dit eget tempo.`;
const html = fs.readFileSync(indexPath, 'utf8')
  .replace(/(<meta name="description" content=")[^"]*(">)/,`$1${esc(homeDescription)}$2`)
  .replace(/(<meta property="og:description" content=")[^"]*(">)/,`$1${esc(homeDescription)}$2`)
  .replace(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g,(match,json)=>{
    const data=JSON.parse(json);
    if(data['@type']!=='WebApplication') return match;
    data.inLanguage=LANGS;
    data.description=homeDescription;
    return seo.jsonLD(data);
  });
const links = `<!-- JOBS -->\n    <nav class="jobs" aria-label="Emner">${catalog.groups.map((g) => catalog.groupLink(g, 'da')).join('')}</nav>\n    <!-- /JOBS -->`;
if (!/<!-- JOBS -->[\s\S]*<!-- \/JOBS -->/.test(html)) throw new Error('index.html mangler <!-- JOBS --> markører');
fs.writeFileSync(indexPath, html.replace(/<!-- JOBS -->[\s\S]*<!-- \/JOBS -->/, links));

// Public, indexable course catalogue in each interface language.
for (const lang of LANGS) {
  const l = catalog.labels[lang];
  const personal = {
    da: { resume: 'Fortsæt, hvor du slap', action: 'Fortsæt øvelsen', words: 'Mine ord', favorites: 'Gemte ord' },
    en: { resume: 'Pick up where you left off', action: 'Continue practising', words: 'My words', favorites: 'Saved words' },
    ru: { resume: 'Продолжите с того места, где остановились', action: 'Продолжить занятия', words: 'Мои слова', favorites: 'Сохранённые слова' },
    uk: { resume: 'Продовжте з того місця, де зупинилися', action: 'Продовжити навчання', words: 'Мої слова', favorites: 'Збережені слова' },
  }[lang] || extraLocales[lang].personal;
  const resumeNames = { ...Object.fromEntries(packs.map((p) => [p.id, p.name[lang]])), top: l.general, pics: l.pictures, favorites: personal.favorites };
  const card = (id) => {
    const p = packs.find((p) => p.id === id);
    const title = p ? p.name[lang] : id === 'top' ? l.general : l.pictures;
    const description = p ? p.desc[lang] : id === 'top' ? l.basic : l.pictureDesc;
    const href = p ? urlOf(p, lang) : `/?ui=${lang}#start=${id}${lang === 'da' ? '' : `&amp;base=${lang}`}`;
    return `<article class="course-card" data-course><a class="course-card-link" href="${href}" aria-labelledby="course-${id}-title"><h3 id="course-${id}-title">${esc(title)}</h3><p>${esc(description)}</p>${p ? `<p class="course-meta">${p.categories.reduce((sum, c) => sum + c.rows.length, 0)} ${esc(l.units)} · ${p.categories.length} ${esc(l.topics)}</p>` : ''}<span class="course-open" aria-hidden="true">${esc(p ? l.open : l.practice)}</span></a></article>`;
  };
  const canonical = `${SITE}/${lang}/`;
  const output = `<!doctype html>
<html lang="${lang}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#f7f4ee">
  <title>${esc(l.catalog)}: ${esc(l.lead)} | Job Vocabulary</title>
  <meta name="description" content="${esc(l.intro)}">
  <link rel="canonical" href="${canonical}">
${LANGS.map((other) => `  <link rel="alternate" hreflang="${other}" href="${SITE}/${other}/">`).join('\n')}
  <link rel="alternate" hreflang="x-default" href="${SITE}/en/">
  <meta property="og:type" content="website">
  <meta property="og:url" content="${canonical}">
  <meta property="og:title" content="${esc(l.catalog)} | Job Vocabulary">
  <meta property="og:description" content="${esc(l.intro)}">
  <link rel="stylesheet" href="/style.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Lora:wght@400;500;600&display=swap" rel="stylesheet">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <script src="/practice-resume.js" defer></script>
  <script src="/catalog-search.js" defer></script>
  ${seo.jsonLD({'@context':'https://schema.org','@type':'CollectionPage',url:canonical,name:l.lead,inLanguage:lang,mainEntity:{'@type':'ItemList',itemListElement:packs.map((p,i)=>({'@type':'ListItem',position:i+1,name:p.name[lang],url:SITE+urlOf(p,lang)}))}})}
</head>
<body class="page catalogue">
  <header class="top"><a class="brand" href="/?ui=${lang}#forside">Job<span>Vocabulary</span></a><nav class="language-nav" aria-label="${esc(T[lang].langs)}">${LANGS.map((other) => `<a href="/${other}/" lang="${other}" hreflang="${other}"${other === lang ? ' aria-current="page"' : ''}>${esc(LANG_NAME[other])}</a>`).join('')}</nav></header>
  <main>
    <section class="catalogue-hero"><p class="eyebrow">Job Vocabulary</p><h1>${esc(l.lead)}</h1><p class="lead">${esc(l.intro)}</p><p class="tagline">${esc(T[lang].free)}</p></section>
    <section class="resume-panel" id="resumePanel" data-names="${esc(JSON.stringify(resumeNames))}" data-nosnippet hidden><div><p class="eyebrow">${esc(personal.resume)}</p><h2 id="resumeCourse"></h2><p id="resumePair"></p></div><a class="primary cta" href="/?ui=${lang}">${esc(personal.action)}</a></section>
    <p class="catalogue-personal"><a href="/?ui=${lang}#mine-ord">♡ ${esc(personal.words)}</a></p>
    <nav class="category-nav" aria-label="${esc(l.catalog)}">${catalog.groups.map((g) => `<a href="#${g.id}">${esc(g.name[lang])}</a>`).join('')}</nav>
    <div class="catalogue-search"><label for="courseSearch">${esc(l.search)}</label><input id="courseSearch" type="search" autocomplete="off" placeholder="${esc(l.search)}" aria-controls="courseSections"></div>
    <p class="course-note">${esc(l.note)}</p>
    <p id="courseEmpty" role="status" hidden>${esc(l.empty)}</p>
    <div id="courseSections">${catalog.groups.map((g) => `<section class="catalogue-group" id="${g.id}" data-course-group><h2>${esc(g.name[lang])}</h2><p class="group-description">${esc(g.desc[lang])}</p><div class="course-grid">${g.packs.map(card).join('')}</div></section>`).join('')}</div>
    <footer class="catalogue-footer">Job Vocabulary · <a href="/?ui=${lang}#forside">${esc(T[lang].home)}</a> · <a href="${seo.guideIndex(lang)}">${esc(seo.guideLabels[lang])}</a></footer>
  </main>
</body>
</html>
`;
  fs.mkdirSync(path.join(ROOT, lang), { recursive: true });
  fs.writeFileSync(path.join(ROOT, lang, 'index.html'), output);
  urls.push(canonical);
}

const guideOutput = seo.buildGuides({root:ROOT,site:SITE,packs,urlOf});
urls.push(...guideOutput.urls);
// Refresh only changed shared assets after a deployment, retaining browser caching.
const assets = ['style.css', 'favicon.svg', 'app.js', 'locales.js', 'core-translations.js', 'practice-options.js', 'vendor/ts-fsrs-5.4.2.js', 'memory-scheduler.js', 'learning-flow.js', 'course-preferences.js', 'word-entry.js', 'words.js', 'packs/index.js', 'images/words/manifest.js', 'catalog.js', 'catalog-search.js', 'practice-resume.js', 'lexicon-index.js', 'library.js', 'library-ui.js'];
const versions = Object.fromEntries(assets.map((asset) => [asset, crypto.createHash('sha256').update(fs.readFileSync(path.join(ROOT, asset))).digest('hex').slice(0, 12)]));
const pages = [indexPath, path.join(ROOT,'dictionary/attribution.html'), ...guideOutput.pages, ...LANGS.flatMap((lang) => [path.join(ROOT, lang, 'index.html'), ...packs.map((p) => path.join(ROOT, urlOf(p, lang), 'index.html'))])];
for (const file of pages) {
  const html = fs.readFileSync(file, 'utf8').replace(/(href|src)="([^"#?]+)(?:\?v=[^"]*)?"/g, (match, attr, asset) => {
    const version = versions[asset.replace(/^\//, '')];
    return version ? `${attr}="${asset}?v=${version}"` : match;
  });
  fs.writeFileSync(file, html);
}
console.log(`${pages.length} sider skrevet, sitemap med ${urls.length} adresser`);
fs.writeFileSync(routeFile,JSON.stringify(routes,null,2)+'\n');
writeSitemap(ROOT,SITE,urls);
