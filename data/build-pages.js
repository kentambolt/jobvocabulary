// Laver en statisk side pr. pakke på 4 sprog (til søgemaskiner), opdaterer linklisten på
// forsiden og sitemap.xml. Kør efter ændringer i pakkerne: node data/build-pages.js
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');
const SITE = 'https://trafficwords.com';
const LANGS = ['da', 'en', 'ru', 'uk'];
const LANG_NAME = { da: 'Dansk', en: 'English', ru: 'Русский', uk: 'Українська' };
const ORDER = ['cleaning', 'restaurant', 'warehouse', 'construction', 'care', 'agriculture', 'retail', 'transport', 'driving'];

const T = {
  da: {
    title: (n) => `${n} – lær de danske ord og sætninger | Topwords`,
    sub: 'Lær de danske ord og sætninger – ét ad gangen',
    intro: (total, cats) => `${total} ord og sætninger i ${cats} emner, med oversættelse til engelsk, russisk og ukrainsk. Det vigtigste kommer først, og det du kan, kommer sjældnere igen.`,
    cta: 'Start med at øve – gratis',
    howTitle: 'Sådan virker det',
    how: [
      'Du får ét ord eller én sætning ad gangen – det vigtigste først.',
      'Svarer du rigtigt, går der længere tid, før det kommer igen. Svarer du forkert, kommer det hurtigt igen.',
      'Kan du allerede noget, tager du en kort niveautest og springer det over, du kan.',
    ],
    topics: 'Emner', words: 'Nogle af de vigtigste ord', phrases: 'Nogle af de vigtigste sætninger',
    others: 'Andre emner', langs: 'Læs siden på', home: 'Forside', free: 'Gratis · uden login · virker på mobilen',
    n: (k) => `${k}`,
  },
  en: {
    title: (n) => `${n} – learn the Danish words and phrases | Topwords`,
    sub: 'Learn the Danish words and phrases – one at a time',
    intro: (total, cats) => `${total} words and phrases in ${cats} topics, translated into English, Russian and Ukrainian. The most important come first, and what you know comes back less often.`,
    cta: 'Start practising – free',
    howTitle: 'How it works',
    how: [
      'You get one word or one sentence at a time – the most important first.',
      'Answer correctly and it takes longer before it comes back. Answer wrong and it comes back soon.',
      'Already know some Danish? Take a short level test and skip what you know.',
    ],
    topics: 'Topics', words: 'Some of the most important words', phrases: 'Some of the most important phrases',
    others: 'Other topics', langs: 'Read this page in', home: 'Home', free: 'Free · no login · works on your phone',
  },
  ru: {
    title: (n) => `${n}: датские слова и фразы | Topwords`,
    sub: 'Учите датские слова и фразы – по одной за раз',
    intro: (total, cats) => `${total} слов и фраз в ${cats} темах с переводом на русский, украинский и английский. Сначала самое важное, а то, что вы знаете, повторяется реже.`,
    cta: 'Начать учить – бесплатно',
    howTitle: 'Как это работает',
    how: [
      'Вы получаете одно слово или одну фразу за раз – сначала самое важное.',
      'Ответите правильно – слово вернётся нескоро. Ошибётесь – оно скоро вернётся.',
      'Уже знаете немного датский? Пройдите короткий тест уровня и пропустите то, что знаете.',
    ],
    topics: 'Темы', words: 'Самые важные слова', phrases: 'Самые важные фразы',
    others: 'Другие темы', langs: 'Эта страница на других языках', home: 'Главная', free: 'Бесплатно · без регистрации · работает на телефоне',
  },
  uk: {
    title: (n) => `${n}: данські слова і фрази | Topwords`,
    sub: 'Вивчайте данські слова і фрази – по одній за раз',
    intro: (total, cats) => `${total} слів і фраз у ${cats} темах з перекладом українською, російською та англійською. Спочатку найважливіше, а те, що ви знаєте, повторюється рідше.`,
    cta: 'Почати вчити – безкоштовно',
    howTitle: 'Як це працює',
    how: [
      'Ви отримуєте одне слово або одну фразу за раз – спочатку найважливіше.',
      'Відповісте правильно – слово повернеться нескоро. Помилитеся – воно скоро повернеться.',
      'Вже трохи знаєте данську? Пройдіть короткий тест рівня і пропустіть те, що знаєте.',
    ],
    topics: 'Теми', words: 'Найважливіші слова', phrases: 'Найважливіші фрази',
    others: 'Інші теми', langs: 'Ця сторінка іншими мовами', home: 'Головна', free: 'Безкоштовно · без реєстрації · працює на телефоні',
  },
};

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const slugify = (s) => s.toLowerCase().replace(/æ/g, 'ae').replace(/ø/g, 'oe').replace(/å/g, 'aa')
  .normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

// --- indlæs pakker ---
const ctx = {};
vm.createContext(ctx);
for (const f of fs.readdirSync(path.join(ROOT, 'packs')).filter((f) => f.endsWith('.js') && f !== 'index.js')) {
  vm.runInContext(fs.readFileSync(path.join(ROOT, 'packs', f), 'utf8'), ctx);
}
vm.runInContext('this.P = PACKS;', ctx);
const packs = Object.values(ctx.P).sort((a, b) => ORDER.indexOf(a.id) - ORDER.indexOf(b.id));

const urlOf = (p, lang) => `/${lang}/${lang === 'da' || lang === 'en' ? slugify(p.name[lang]) : p.id}/`;

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
  const cols = lang === 'da' ? ['da', 'en', 'ru', 'uk'] : ['da', lang];
  const col = (l) => (l === 'da' ? 0 : l === 'en' ? 1 : l === 'ru' ? 2 : 3) + 1;
  const table = (rows) => `<div class="table-wrap"><table><thead><tr>${cols.map((l) => `<th>${esc(LANG_NAME[l])}</th>`).join('')}</tr></thead><tbody>
${rows.map((r) => `<tr>${cols.map((l) => `<td lang="${l}"${l === 'da' ? ' class="da"' : ''}>${esc(r[col(l)])}</td>`).join('')}</tr>`).join('\n')}
</tbody></table></div>`;
  const desc = `${p.desc[lang]}. ${t.intro(total, p.categories.length)}`;
  return `<!doctype html>
<html lang="${lang}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
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
  <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@500;700;800;900&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/style.css">
  <script type="application/ld+json">${JSON.stringify({
    '@context': 'https://schema.org', '@type': 'Course', name: t.title(name).replace(' | Topwords', ''), description: desc, inLanguage: lang,
    isAccessibleForFree: true, provider: { '@type': 'Organization', name: 'Topwords', url: SITE + '/' },
  })}</script>
</head>
<body class="page">
  <header class="top"><a class="brand" href="/">Top<span>words</span></a></header>
  <main>
    <h1>${esc(name)}</h1>
    <p class="lead">${esc(t.sub)}</p>
    <p>${esc(p.desc[lang])}. ${esc(t.intro(total, p.categories.length))}</p>
    <p><a class="primary cta" href="/#start=${p.id}${lang === 'da' ? '' : `&amp;base=${lang}`}">${esc(t.cta)}</a></p>
    <p class="tagline">${esc(t.free)}</p>

    <h2>${esc(t.howTitle)}</h2>
    <ol class="how">${t.how.map((h) => `<li>${esc(h)}</li>`).join('')}</ol>

    <h2>${esc(t.topics)}</h2>
    <ul class="topics">${p.categories.map((c) => `<li>${esc(c.name[lang])} <small>${c.rows.length}</small></li>`).join('')}</ul>

    <h2>${esc(t.words)}</h2>
    ${table(sample(p, 'word', 24))}

    <h2>${esc(t.phrases)}</h2>
    ${table(sample(p, 'phrase', 12))}

    <p><a class="primary cta" href="/#start=${p.id}${lang === 'da' ? '' : `&amp;base=${lang}`}">${esc(t.cta)}</a></p>

    <h2>${esc(t.others)}</h2>
    <ul class="links">${packs.filter((o) => o.id !== p.id).map((o) => `<li><a href="${urlOf(o, lang)}">${esc(o.name[lang])}</a></li>`).join('')}</ul>

    <p class="langs">${esc(t.langs)}: ${LANGS.filter((l) => l !== lang).map((l) => `<a href="${urlOf(p, l)}" hreflang="${l}" lang="${l}">${esc(LANG_NAME[l])}</a>`).join(' · ')}</p>
    <p><a href="/">${esc(t.home)}</a></p>
  </main>
</body>
</html>
`;
}

// --- skriv sider ---
const urls = [`${SITE}/`];
for (const lang of LANGS) {
  const dir = path.join(ROOT, lang);
  if (fs.existsSync(dir)) fs.rmSync(dir, { recursive: true });
}
for (const p of packs) {
  for (const lang of LANGS) {
    const rel = urlOf(p, lang);
    const dir = path.join(ROOT, rel);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'index.html'), page(p, lang));
    urls.push(SITE + rel);
  }
}

// --- links på forsiden (mellem markørerne i index.html) ---
const indexPath = path.join(ROOT, 'index.html');
const html = fs.readFileSync(indexPath, 'utf8');
const links = `<!-- JOBS -->\n    <nav class="jobs" aria-label="Emner">${packs.map((p) => `<a href="${urlOf(p, 'da')}">${esc(p.name.da)}</a>`).join(' ')}</nav>\n    <!-- /JOBS -->`;
if (!/<!-- JOBS -->[\s\S]*<!-- \/JOBS -->/.test(html)) throw new Error('index.html mangler <!-- JOBS --> markører');
fs.writeFileSync(indexPath, html.replace(/<!-- JOBS -->[\s\S]*<!-- \/JOBS -->/, links));

// --- sitemap ---
fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${u}</loc></url>`).join('\n')}
</urlset>
`);
console.log(`${packs.length * LANGS.length} sider skrevet, sitemap med ${urls.length} adresser`);
