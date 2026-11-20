// Shared course navigation for the app and generated public pages.
var COURSE_CATALOG = {
  "groups": [
    {
      "id": "work",
      "name": {
        "da": "Job og arbejde",
        "en": "Jobs and work",
        "ru": "Работа и профессии",
        "uk": "Робота і професії"
      },
      "desc": {
        "da": "Ord og sætninger fra din arbejdsdag. Vælg dit fag, og øv det vigtigste først.",
        "en": "Words and phrases for your working day. Choose your field and learn the essentials first.",
        "ru": "Слова и фразы для рабочего дня. Выберите профессию и начните с самого важного.",
        "uk": "Слова і фрази для робочого дня. Виберіть професію та почніть із найважливішого."
      },
      "packs": [
        "cleaning",
        "restaurant",
        "warehouse",
        "construction",
        "care",
        "agriculture",
        "retail",
        "transport"
      ]
    },
    {
      "id": "everyday",
      "name": {
        "da": "Hverdag og transport",
        "en": "Everyday life and transport",
        "ru": "Повседневная жизнь и транспорт",
        "uk": "Повсякденне життя і транспорт"
      },
      "desc": {
        "da": "Transport, sundhed, familie og hverdagen i et nyt land.",
        "en": "Transport, healthcare, family and everyday life in a new country.",
        "ru": "Транспорт, здоровье, семья и повседневная жизнь в новой стране.",
        "uk": "Транспорт, здоров’я, сім’я та повсякденне життя в новій країні."
      },
      "packs": [
        "essentials",
        "driving"
      ]
    },
    {
      "id": "start",
      "name": {
        "da": "Kom godt i gang med sproget",
        "en": "Start with the language",
        "ru": "Первые шаги в языке",
        "uk": "Перші кроки в мові"
      },
      "desc": {
        "da": "Byg dit ordforråd op med de mest brugte ord eller enkle ord med billeder.",
        "en": "Build your vocabulary with common words or simple illustrated words.",
        "ru": "Расширяйте словарный запас с частотными словами или словами в картинках.",
        "uk": "Розширюйте словниковий запас із частотними словами або словами в малюнках."
      },
      "packs": [
        "top",
        "pics"
      ]
    }
  ],
  "labels": {
    "da": {
      "catalog": "Find dit kursus",
      "lead": "Lær sproget til din næste arbejdsdag",
      "intro": "Praktiske ord og sætninger til dit fag og hverdagen i et nyt land.",
      "search": "Søg efter job eller emne",
      "empty": "Ingen kurser matcher din søgning.",
      "topics": "emner",
      "units": "ord og sætninger",
      "open": "Se kursus",
      "practice": "Start øvelse",
      "note": "Kurserne nedenfor introducerer dansk med forklaringer på dit sprog. Du kan vælge sprogpar i øvelsen.",
      "general": "De mest brugte ord",
      "pictures": "Ord med billeder",
      "basic": "Ordforråd fra bunden, med de hyppigste ord først.",
      "pictureDesc": "195 tydelige illustrationer til at læse, forstå og skrive enkle ord.",
      "back": "Alle kurser",
      "safety": "Sprogtræning til køretimer og prøver. Supplerer undervisningen og erstatter ikke teori, køreskole eller gældende regler."
    },
    "en": {
      "catalog": "Find your course",
      "lead": "Learn the language for your next working day",
      "intro": "Practical words and phrases for your job and everyday life in a new country.",
      "search": "Search for a job or topic",
      "empty": "No courses match your search.",
      "topics": "topics",
      "units": "words and phrases",
      "open": "Explore course",
      "practice": "Start practising",
      "note": "These courses introduce Danish, with explanations in your language. You can select your language pair in the exercise.",
      "general": "The most common words",
      "pictures": "Words with pictures",
      "basic": "Build vocabulary from the ground up, with the most frequent words first.",
      "pictureDesc": "195 clear illustrations to practise reading, understanding and writing simple words.",
      "back": "All courses",
      "safety": "Language practice for driving lessons and tests. Supplements tuition and does not replace theory, a driving school or current regulations."
    },
    "ru": {
      "catalog": "Найдите свой курс",
      "lead": "Учите язык для будущей работы",
      "intro": "Практические слова и фразы для работы и повседневной жизни в новой стране.",
      "search": "Поиск по профессии или теме",
      "empty": "По вашему запросу курсов не найдено.",
      "topics": "тем",
      "units": "слов и фраз",
      "open": "О курсе",
      "practice": "Начать учить",
      "note": "Эти курсы знакомят с датским языком с объяснениями на вашем языке. В упражнении можно выбрать языковую пару.",
      "general": "Самые частотные слова",
      "pictures": "Слова в картинках",
      "basic": "Словарный запас с нуля: сначала самые частотные слова.",
      "pictureDesc": "195 иллюстраций для чтения, понимания и написания простых слов.",
      "back": "Все курсы",
      "safety": "Языковая практика для уроков и экзаменов по вождению. Дополняет обучение и не заменяет теорию, автошколу или действующие правила."
    },
    "uk": {
      "catalog": "Знайдіть свій курс",
      "lead": "Вивчайте мову для майбутньої роботи",
      "intro": "Практичні слова й фрази для роботи та щоденного життя в новій країні.",
      "search": "Пошук за професією або темою",
      "empty": "За вашим запитом курсів не знайдено.",
      "topics": "тем",
      "units": "слів і фраз",
      "open": "Про курс",
      "practice": "Почати вчити",
      "note": "Ці курси знайомлять із данською мовою з поясненнями вашою мовою. У вправі можна вибрати мовну пару.",
      "general": "Найуживаніші слова",
      "pictures": "Слова в малюнках",
      "basic": "Словниковий запас із нуля: спочатку найуживаніші слова.",
      "pictureDesc": "195 ілюстрацій для читання, розуміння та написання простих слів.",
      "back": "Усі курси",
      "safety": "Мовна практика для уроків та іспитів із водіння. Доповнює навчання й не замінює теорію, автошколу або чинні правила."
    }
  }
};
// Shared by the static home page builder and the translated application shell.
COURSE_CATALOG.icons = {
  work: '<rect x="3" y="7" width="26" height="21" rx="2"/><path d="M11 7V4h10v3M3 14c8 4 18 4 26 0M14 15v5h4v-5"/>',
  everyday: '<rect x="7" y="3" width="18" height="23" rx="4"/><path d="M10 7h12v9H10zM10 30l3-4m9 4-3-4"/><circle cx="12" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>',
  start: '<path d="M16 7C12 3 5 4 2 5v22c5-2 10-1 14 2 4-3 9-4 14-2V5c-3-1-10-2-14 2Zm0 0v22"/>'
};
COURSE_CATALOG.home = {
  da: { eyebrow: 'Sprog til arbejde og hverdag', start: 'Kom i gang gratis', watch: 'Se, hvordan det virker', free: 'Gratis', account: 'Ingen konto', mobile: 'Virker på mobil', howTitle: 'Sådan fungerer det', steps: ['Vælg dit sprog og emne', 'Lær ét ord eller én sætning ad gangen', 'Svar og se din fremgang med det samme'], groupNames: ['Job og arbejdsliv', 'Hverdag og transport', 'Byg dit sprog'], allTopics: 'Alle emner', selectedTopics: '{n} af {total} emner', pickTopics: 'Vælg emner', topicsHint: 'Vælg alle emner eller kun dem, du vil øve.', selectAll: 'Vælg alle', selectNone: 'Fravælg alle', done: 'Færdig' },
  en: { eyebrow: 'Language for work and everyday life', start: 'Get started free', watch: 'See how it works', free: 'Free', account: 'No account', mobile: 'Works on mobile', howTitle: 'How it works', steps: ['Choose your language and topic', 'Learn one word or phrase at a time', 'Answer and see your progress straight away'], groupNames: ['Jobs and working life', 'Everyday life and transport', 'Build your language'], allTopics: 'All topics', selectedTopics: '{n} of {total} topics', pickTopics: 'Choose topics', topicsHint: 'Choose all topics or just the ones you want to practise.', selectAll: 'Select all', selectNone: 'Clear selection', done: 'Done' },
  ru: { eyebrow: 'Язык для работы и повседневной жизни', start: 'Начать бесплатно', watch: 'Как это работает', free: 'Бесплатно', account: 'Без регистрации', mobile: 'На телефоне', howTitle: 'Как это работает', steps: ['Выберите язык и тему', 'Учите по одному слову или фразе', 'Отвечайте и сразу видите свой прогресс'], groupNames: ['Работа и профессии', 'Повседневная жизнь и транспорт', 'Расширяйте словарный запас'], allTopics: 'Все темы', selectedTopics: 'Выбрано тем: {n} из {total}', pickTopics: 'Выберите темы', topicsHint: 'Выберите все темы или только те, которые хотите изучать.', selectAll: 'Выбрать все', selectNone: 'Снять выбор', done: 'Готово' },
  uk: { eyebrow: 'Мова для роботи й повсякденного життя', start: 'Почати безкоштовно', watch: 'Як це працює', free: 'Безкоштовно', account: 'Без реєстрації', mobile: 'На телефоні', howTitle: 'Як це працює', steps: ['Виберіть мову й тему', 'Вчіть по одному слову чи фразі', 'Відповідайте й одразу бачте свій прогрес'], groupNames: ['Робота і професії', 'Повсякденне життя і транспорт', 'Розширюйте словниковий запас'], allTopics: 'Усі теми', selectedTopics: 'Вибрано тем: {n} із {total}', pickTopics: 'Виберіть теми', topicsHint: 'Виберіть усі теми або лише ті, які хочете вивчати.', selectAll: 'Вибрати всі', selectNone: 'Зняти вибір', done: 'Готово' }
};
COURSE_CATALOG.groupLink = function(group, lang) {
  const esc = (value) => String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  const i = this.groups.indexOf(group);
  return `<a class="category-entry" href="/${lang}/#${group.id}"><svg class="category-icon" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${this.icons[group.id]}</svg><div><b>${esc(this.home[lang].groupNames[i])}</b><small>${esc(group.desc[lang])}</small></div></a>`;
};
COURSE_CATALOG.benefitsHTML = function(lang) {
  const paths = ['<circle cx="12" cy="12" r="9"/><path d="m6 12 4 4 8-9"/>', '<circle cx="11" cy="7" r="3"/><path d="M3 21c0-5 3-8 8-8 3 0 5 1 6 3M4 20 21 3"/>', '<path d="m6 3 4 5-3 3c2 4 3 5 7 7l3-3 5 4c-2 6-7 4-12 0C5 15 1 7 6 3Z"/>'];
  return ['free', 'account', 'mobile'].map((key, i) => `<li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[i]}</svg>${this.home[lang][key]}</li>`).join('');
};
if (typeof module !== 'undefined') module.exports = COURSE_CATALOG;
const extraCatalogLocales = typeof EXTRA_LOCALES !== 'undefined' ? EXTRA_LOCALES : require('./locales');
for (const [lang, locale] of Object.entries(extraCatalogLocales)) {
  COURSE_CATALOG.labels[lang] = locale.catalog;
  COURSE_CATALOG.home[lang] = locale.home;
  COURSE_CATALOG.groups.forEach((group,index)=>{group.name[lang]=locale.groups[index].name;group.desc[lang]=locale.groups[index].desc;});
}
COURSE_CATALOG.groups[0].packs.push('childcare','hotel','hospital','airport','bus','propertyservice','trucking','foodindustry','jobsearch','worklife');
COURSE_CATALOG.groups[1].packs.push('authorities','health','children','getaround','money','shopping','school','emergency','pregnancy');
COURSE_CATALOG.related = {
  cleaning:['hotel','propertyservice','hospital','worklife','essentials'],
  restaurant:['foodindustry','retail','hotel','agriculture','worklife'],
  warehouse:['trucking','transport','foodindustry','airport','worklife'],
  construction:['propertyservice','warehouse','worklife','jobsearch','essentials'],
  care:['health','hospital','childcare','worklife','essentials'],
  agriculture:['foodindustry','warehouse','restaurant','worklife','essentials'],
  retail:['shopping','restaurant','warehouse','worklife','jobsearch'],
  transport:['trucking','bus','getaround','warehouse','driving'],
  childcare:['children','school','care','health','worklife'],
  hotel:['cleaning','restaurant','airport','worklife','jobsearch'],
  hospital:['health','care','cleaning','worklife','emergency'],
  airport:['transport','warehouse','bus','hotel','worklife'],
  bus:['getaround','transport','driving','trucking','worklife'],
  propertyservice:['construction','cleaning','authorities','worklife','essentials'],
  trucking:['transport','warehouse','bus','driving','worklife'],
  foodindustry:['restaurant','agriculture','warehouse','retail','worklife'],
  jobsearch:['worklife','school','hotel','warehouse','cleaning'],
  worklife:['jobsearch','school','money','authorities','essentials'],
  essentials:['school','getaround','shopping','money','worklife'],
  driving:['getaround','transport','bus','trucking','emergency'],
  authorities:['money','children','school','worklife','essentials'],
  health:['pregnancy','emergency','care','hospital','children'],
  children:['childcare','school','pregnancy','health','authorities'],
  getaround:['driving','bus','transport','emergency','essentials'],
  money:['authorities','shopping','worklife','jobsearch','essentials'],
  shopping:['money','retail','essentials','getaround','authorities'],
  school:['essentials','jobsearch','worklife','children','authorities'],
  emergency:['health','getaround','driving','authorities','worklife'],
  pregnancy:['health','children','authorities','worklife','essentials']
};
