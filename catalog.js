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
        "da": "Kom rundt, forstå tiden, og få styr på de små ting i et nyt land.",
        "en": "Get around, understand time and manage the small things in a new country.",
        "ru": "Транспорт, время и повседневные ситуации в новой стране.",
        "uk": "Транспорт, час і повсякденні ситуації в новій країні."
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
      "intro": "Praktiske ord og sætninger til dit fag – og til hverdagen i et nyt land. Begynd gratis, uden en konto.",
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
      "intro": "Practical words and phrases for your job – and everyday life in a new country. Start free, without an account.",
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
      "intro": "Практические слова и фразы для работы и повседневной жизни в новой стране. Бесплатно и без регистрации.",
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
      "intro": "Практичні слова й фрази для роботи та щоденного життя в новій країні. Безкоштовно й без реєстрації.",
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
if (typeof module !== 'undefined') module.exports = COURSE_CATALOG;
