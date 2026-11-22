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
COURSE_CATALOG.groupLink = function(group, lang, catalogueUrl = `/${lang}/`) {
  const esc = (value) => String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  const i = this.groups.indexOf(group);
  return `<a class="category-entry" href="${esc(catalogueUrl+'#'+group.id)}"><svg class="category-icon" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${this.icons[group.id]}</svg><div><b>${esc(this.home[lang].groupNames[i])}</b><small>${esc(group.desc[lang])}</small></div></a>`;
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
COURSE_CATALOG.groups[0].packs.push('childcare','hotel','hospital','airport','bus','propertyservice','gardening','itsupport','office','salon','laundry','bakery','automotive','trucking','foodindustry','fish','harbour','removals','security','trades','medicaldanish','jobsearch','worklife');
COURSE_CATALOG.groups[1].packs.push('authorities','health','children','getaround','money','shopping','school','emergency','pregnancy','carowner','community','pets','traditions','wellbeing');
// One home per course. Shared by the public catalogue and the native course picker.
COURSE_CATALOG.subcategories = [
  {id:'service',group:'work',packs:['hotel','cleaning','laundry','propertyservice'],names:['Hotel, rengøring og ejendomme','Hotels, cleaning and property services','Отели, уборка и обслуживание зданий','Готелі, прибирання й обслуговування будівель','Hotele, sprzątanie i obsługa nieruchomości','Hoteluri, curățenie și administrarea clădirilor','Viešbučiai, valymas ir pastatų priežiūra','Хотели, почистване и поддръжка на сгради']},
  {id:'food',group:'work',packs:['restaurant','bakery','foodindustry','fish'],names:['Mad, køkken og fødevarer','Food, kitchens and food production','Кухня и производство продуктов','Кухня та виробництво харчових продуктів','Kuchnia i produkcja żywności','Bucătărie și producție alimentară','Virtuvė ir maisto gamyba','Кухня и производство на храни']},
  {id:'logistics',group:'work',packs:['warehouse','transport','trucking','bus','airport','harbour','removals'],names:['Transport, lager og logistik','Transport, warehousing and logistics','Транспорт, склад и логистика','Транспорт, склад і логістика','Transport, magazyn i logistyka','Transport, depozit și logistică','Transportas, sandėliavimas ir logistika','Транспорт, склад и логистика']},
  {id:'practical-trades',group:'work',packs:['construction','trades','automotive'],names:['Byggeri og autoværksted','Construction and vehicle workshops','Строительство и автомастерская','Будівництво й автомайстерня','Budownictwo i warsztat samochodowy','Construcții și atelier auto','Statyba ir autoservisas','Строителство и автосервиз']},
  {id:'green-work',group:'work',packs:['agriculture','gardening'],names:['Landbrug og grønne områder','Farming and landscaping','Сельское хозяйство и озеленение','Сільське господарство й озеленення','Rolnictwo i tereny zielone','Agricultură și spații verzi','Žemės ūkis ir želdynai','Земеделие и озеленяване']},
  {id:'care-work',group:'work',packs:['care','hospital','medicaldanish','childcare'],names:['Pleje, sundhed og børn','Care, healthcare and childcare','Уход, медицина и работа с детьми','Догляд, медицина й робота з дітьми','Opieka, zdrowie i praca z dziećmi','Îngrijire, sănătate și lucrul cu copiii','Slauga, sveikatos priežiūra ir darbas su vaikais','Грижи, здравеопазване и работа с деца']},
  {id:'office-it',group:'work',packs:['office','itsupport'],names:['Kontor og IT','Office work and IT','Офис и IT','Офіс та IT','Biuro i IT','Birou și IT','Biuras ir IT','Офис и ИТ']},
  {id:'shops-salons',group:'work',packs:['retail','salon'],names:['Butik og salon','Shops and salons','Магазины и салоны','Магазини й салони','Sklepy i salony','Magazine și saloane','Parduotuvės ir salonai','Магазини и салони']},
  {id:'security-work',group:'work',packs:['security'],names:['Vagt og sikkerhed','Security work','Охрана и безопасность','Охорона й безпека','Ochrona i bezpieczeństwo','Pază și securitate','Apsauga ir saugumas','Охрана и сигурност']},
  {id:'employment',group:'work',packs:['jobsearch','worklife'],names:['Jobsøgning og arbejdsliv','Finding a job and working life','Поиск работы и трудовая жизнь','Пошук роботи й трудове життя','Szukanie pracy i życie zawodowe','Căutarea unui loc de muncă și viața profesională','Darbo paieška ir profesinis gyvenimas','Търсене на работа и трудов живот']},
  {id:'daily-life',group:'everyday',packs:['essentials','shopping','money','authorities','school'],names:['Hverdag, penge og myndigheder','Daily life, money and public services','Быт, деньги и государственные службы','Побут, гроші й державні служби','Codzienność, pieniądze i urzędy','Viața de zi cu zi, bani și autorități','Kasdienybė, pinigai ir institucijos','Ежедневие, пари и институции']},
  {id:'getting-around',group:'everyday',packs:['getaround','driving','carowner'],names:['Transport og kørekort','Getting around and driving','Передвижение и водительские права','Пересування й водійські права','Transport i prawo jazdy','Deplasare și permis de conducere','Susisiekimas ir vairavimas','Придвижване и шофьорска книжка']},
  {id:'family-health',group:'everyday',packs:['health','children','pregnancy','pets','wellbeing','emergency'],names:['Sundhed, familie og hjælp','Health, family and getting help','Здоровье, семья и помощь','Здоров’я, сім’я та допомога','Zdrowie, rodzina i pomoc','Sănătate, familie și ajutor','Sveikata, šeima ir pagalba','Здраве, семейство и помощ']},
  {id:'leisure-culture',group:'everyday',packs:['community','traditions'],names:['Fritid, fællesskab og kultur','Leisure, community and culture','Досуг, общение и культура','Дозвілля, спільнота й культура','Czas wolny, wspólnota i kultura','Timp liber, comunitate și cultură','Laisvalaikis, bendruomenė ir kultūra','Свободно време, общност и култура']}
].map(({names,...category})=>({...category,name:Object.fromEntries(['da','en','ru','uk','pl','ro','lt','bg'].map((lang,index)=>[lang,names[index]]))}));
COURSE_CATALOG.sections = function(group) {
  const sections=this.subcategories.filter(category=>category.group===group.id);
  return sections.length?sections:[group];
};
COURSE_CATALOG.related = {
  cleaning:['hotel','propertyservice','hospital','worklife','essentials'],
  restaurant:['bakery','foodindustry','retail','hotel','worklife'],
  warehouse:['trucking','transport','foodindustry','airport','worklife'],
  construction:['trades','propertyservice','warehouse','worklife','jobsearch'],
  care:['health','hospital','childcare','worklife','essentials'],
  agriculture:['gardening','foodindustry','warehouse','restaurant','worklife','essentials'],
  retail:['shopping','restaurant','warehouse','salon','worklife','jobsearch'],
  transport:['trucking','bus','getaround','warehouse','driving'],
  childcare:['children','school','care','health','worklife'],
  hotel:['laundry','cleaning','restaurant','airport','worklife','jobsearch'],
  hospital:['medicaldanish','health','care','cleaning','emergency'],
  airport:['transport','warehouse','bus','hotel','worklife'],
  bus:['getaround','transport','driving','trucking','worklife'],
  propertyservice:['gardening','construction','cleaning','authorities','worklife','essentials'],
  laundry:['hotel','cleaning','hospital','warehouse','worklife'],
  gardening:['propertyservice','agriculture','trades','construction','worklife'],
  itsupport:['worklife','jobsearch','school','essentials','money'],
  office:['itsupport','worklife','jobsearch','retail','hotel','salon'],
  bakery:['restaurant','foodindustry','retail','worklife','jobsearch'],
  salon:['retail','office','cleaning','worklife','jobsearch'],
  automotive:['carowner','driving','trucking','transport','worklife'],
  trucking:['transport','warehouse','bus','driving','worklife'],
  foodindustry:['fish','restaurant','bakery','agriculture','warehouse'],
  fish:['foodindustry','harbour','warehouse','restaurant','worklife'],
  harbour:['fish','trucking','warehouse','security','worklife'],
  removals:['warehouse','transport','propertyservice','worklife','jobsearch'],
  security:['emergency','retail','airport','worklife','jobsearch'],
  trades:['construction','propertyservice','gardening','worklife','jobsearch'],
  medicaldanish:['hospital','health','care','pregnancy','worklife'],
  carowner:['automotive','driving','getaround','money','emergency'],
  community:['essentials','school','children','traditions','wellbeing'],
  pets:['community','shopping','getaround','essentials','money'],
  traditions:['community','children','school','essentials','shopping'],
  wellbeing:['health','community','worklife','emergency','essentials'],
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
COURSE_CATALOG.metadata = {
  da:{title:'JobVocabulary: Sprog til job og hverdag',description:'Lær ord og sætninger til job, transport og hverdag. Vælg mellem {courses} kurser og {languages} sprog, og træn i dit eget tempo.',locale:'da_DK',imageAlt:'Studiehjørne med bøger, notesbog og kaffe'},
  en:{title:'JobVocabulary: Languages for work and everyday life',description:'Learn words and phrases for work, transport and everyday life. Choose from {courses} courses and {languages} languages, then practise at your own pace.',locale:'en_GB',imageAlt:'Study corner with books, a notebook and coffee'},
  ru:{title:'JobVocabulary: Языки для работы и повседневной жизни',description:'Учите слова и фразы для работы, транспорта и повседневной жизни. Курсы: {courses}. Языки: {languages}. Практикуйтесь в своём темпе.',locale:'ru_RU',imageAlt:'Учебный уголок с книгами, блокнотом и кофе'},
  uk:{title:'JobVocabulary: Мови для роботи й повсякденного життя',description:'Вивчайте слова й фрази для роботи, транспорту та повсякденного життя. Курсів: {courses}. Мов: {languages}. Практикуйтеся у власному темпі.',locale:'uk_UA',imageAlt:'Місце для навчання з книжками, записником і кавою'},
  pl:{title:'JobVocabulary: Języki do pracy i codziennego życia',description:'Ucz się słów i zwrotów do pracy, podróży i codziennego życia. Kursy: {courses}. Języki: {languages}. Ćwicz we własnym tempie.',locale:'pl_PL',imageAlt:'Kącik do nauki z książkami, notesem i kawą'},
  ro:{title:'JobVocabulary: Limbi pentru muncă și viața de zi cu zi',description:'Învață cuvinte și expresii pentru muncă, transport și viața de zi cu zi. Cursuri: {courses}. Limbi: {languages}. Exersează în ritmul tău.',locale:'ro_RO',imageAlt:'Colț de studiu cu cărți, caiet și cafea'},
  lt:{title:'JobVocabulary: Kalbos darbui ir kasdienybei',description:'Mokykitės žodžių ir sakinių darbui, transportui bei kasdienybei. Kursų: {courses}. Kalbų: {languages}. Praktikuokite savo tempu.',locale:'lt_LT',imageAlt:'Mokymosi kampelis su knygomis, užrašine ir kava'},
  bg:{title:'JobVocabulary: Езици за работа и ежедневие',description:'Учи думи и изречения за работа, транспорт и ежедневие. Избери от {courses} курса и {languages} езика и упражнявай със собствено темпо.',locale:'bg_BG',imageAlt:'Кът за учене с книги, тетрадка и кафе'}
};
COURSE_CATALOG.siteMetadata = function(lang,courseCount) {
  const copy=this.metadata[Object.hasOwn(this.metadata,lang)?lang:'en'];
  return {...copy,description:copy.description.replace('{courses}',courseCount).replace('{languages}',Object.keys(this.metadata).length)};
};
