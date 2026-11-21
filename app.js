'use strict';

// ---------------------------------------------------------------------------
// Læringsmodel
//
// memory-scheduler.js updates an individual FSRS-6 memory state after each answer.
// learning-flow.js mixes new, struggling and due learned words with a 70/20/10
// budget when all groups are available. Calendar time, cooldowns and session caps
// prevent fast answers from immediately triggering another review.
// Legacy levels remain the course-mastery score; IDs/counters are preserved.
//
// Rigtigt svar: L + 1. Forkert svar: L - 1 (dog mindst 0).
// Scoren er antal ord, hvor sidste svar var rigtigt og L >= learnedLevel.
//
// Hurtig start for dem, der allerede kan noget:
//  - Nye ord vises først som en opgave ("kender du det?") med en "Ved ikke"-knap.
//    Svarer man rigtigt, starter ordet på knownStartLevel i stedet for 0.
//  - Niveautest: blokke af ord længere og længere nede ad listen. Klarer man en blok,
//    regnes alle ord før den som kendte (placedLevel) og kommer spredt forbi til kontrol.
//  - Ord, der er sprunget over, er "til kontrol": svarer man forkert første gang de
//    kommer igen, starter de forfra (L = 0) i stedet for blot L - 1.
// ---------------------------------------------------------------------------
const CONFIG = {
  learnedLevel: 2,
  knownStartLevel: 3,
  placedLevel: 4,
  buildFromLevel: 2,
};
const PLACEMENT_BOUNDS = [10, 25, 50, 100, 175, 275, 400, 600];
const STORE = 'topwords.v2';
const TOP = 'top';

const UI = {
  da: {
    lang: { da: 'Dansk', en: 'Engelsk', ru: 'Russisk', uk: 'Ukrainsk' },
    title: 'Lær de ord, du har brug for. Ét ord ad gangen.',
    lead: 'Til hverdagen, til dit nye job eller til køreprøven. Det vigtigste først, og det du kan, kommer sjældnere igen.',
    how: ['Vælg sprog, og hvad du vil lære: de mest brugte ord, ord til et bestemt job eller køreprøven.', 'Du får ét ord eller én sætning ad gangen. Det vigtigste kommer først.', 'Svarer du rigtigt, går der længere tid, før det kommer igen. Svarer du forkert, kommer det hurtigt igen. Din score viser, hvor meget du kan.'],
    tagline: 'Gratis · uden login · virker på mobilen',
    settings: 'Indstillinger',
    setupTitle: 'Kom i gang',
    save: 'Gem og fortsæt',
    cancel: 'Annuller',
    loading: 'Henter …',
    loadFail: 'Kunne ikke hente indholdet. Tjek din internetforbindelse.',
    nativeShort: 'modersmål',
    switchDir: 'Skift retning',
    progress: '{n} af {m} lært',
    levelAdvanced: '{from} er gennemgået. Du fortsætter på {to}.',
    howTitle: 'Sådan virker det',
    explainSimple: 'Nye ord og ord, du kæmper med, kommer først. Kendte ord dukker op som spredte kontroller, mens du lærer nyt. En fejl påvirker kun det ord, du svarede på.',
    formula: 'Den præcise formel',
    learnQ: 'Hvilket sprog vil du lære?',
    baseQ: 'Hvilket sprog forstår du bedst?',
    nativeB: 'Det er mit modersmål',
    nativeS: 'Lær at læse med billeder',
    nativeSoon: 'Billeder er på vej',
    otherS: 'Vis oversættelser',
    whatQ: 'Hvad vil du lære?',
    topB: 'De mest brugte ord', topS: 'I rækkefølge efter hvor meget de bruges',
    catsQ: 'Emner',
    modeQ: 'Hvad vil du øve?',
    recB: 'Forstå', recS: 'Se {T}, vælg {B}',
    prodB: 'Find og byg', prodS: 'Se {B}. Vælg først oversættelsen på {T}. Senere bygger du svaret.', navigation: 'Navigation',
    recNB: 'Find billedet', recNS: 'Se ordet, vælg billedet',
    prodNB: 'Læs ordet', prodNS: 'Se billedet, vælg det rigtige ord',
    writeB: 'Skriv det', writeS: 'Se {B}. Stav ord og byg sætninger på {T}.',
    writeNB: 'Skriv ordet', writeNS: 'Se billedet, hør ordet og skriv det bogstav for bogstav',
    pathB: 'Hele forløbet', pathS: 'Find billedet, læs ordet og skriv det. Opgaverne bliver sværere, efterhånden som du lærer ordene.',
    picsB: 'Ord med billeder', picsS: 'Billeder i stedet for oversættelse · {n} ord',
    qWrite: 'Skriv det på {T}',
    qWriteN: 'Skriv ordet',
    hint: 'Hjælp mig',
    almost: 'Godt klaret! Ordet kommer snart igen, så du kan øve det.',
    diffQ: 'Sværhedsgrad',
    diff: ['', 'Let', 'Mellem', 'Svær'],
    packDiff: ['', 'Det vigtigste', 'Vigtigt', 'Alt'],
    nWords: '{n} ord',
    start: 'Start',
    sound: 'Læs højt',
    learned: 'ord lært',
    learnedPack: 'lært',
    newWord: 'Nyt ord',
    newQ: 'Nyt ord. Kender du det?',
    repeat: 'Gentagelse',
    check: 'Kontrol',
    next: 'Videre',
    correct: 'Rigtigt!',
    wrong: 'Ikke helt. Det rigtige svar er grønt.',
    wrongBuild: 'Ikke helt. Rigtigt svar:',
    dontKnow: 'Vis mig svaret',
    qRec: 'Hvad betyder ordet?',
    qProd: 'Hvad hedder det på {T}?',
    qRecP: 'Hvad betyder det?',
    qProdP: 'Hvordan siger man det på {T}?',
    qRecN: 'Hvilket billede passer til ordet?',
    qProdN: 'Hvilket ord passer til billedet?',
    qBuild: 'Byg det på {T}',
    checkBtn: 'Tjek',
    rank: 'Nr. {n} på listen',
    seen: '{n} mødt',
    due: '{n} klar til gentagelse',
    empty: 'Der er intet, der passer til de valgte indstillinger.',
    stats: 'Statistik',
    back: 'Tilbage',
    reset: 'Nulstil fremskridt',
    resetQ: 'Nulstil al fremskridt for denne kombination?',
    cols: ['#', 'Ord', 'Pr. mio.', 'Betydning', 'Niveau', 'Interval', 'Status', 'Forfald'],
    learnedS: 'lært', notYet: 'ikke endnu', wrongS: 'svaret forkert', checkS: 'til kontrol',
    tasks: 'opg.',
    noStats: 'Du har ikke mødt noget endnu.',
    explain:
      'Hvert ord har et niveau <code>L</code>. Næste gentagelse kommer efter <code>{tu}·{b}<sup>L</sup></code> opgaver ' +
      'og <code>{mu} min·{b}<sup>L</sup></code>. De to lægges sammen som <b>forfald</b>, og ordet er klar ved 100 %. ' +
      'Rigtigt svar: <code>L+1</code>. Forkert svar: <code>L−1</code>. Et ord tæller som lært fra niveau {ll}, hvis sidste svar var rigtigt.',
    placeTitle: 'Kan du allerede noget?',
    placeLead: 'Tag en kort test, så springer du over det, du allerede kan. Den tager et par minutter og bliver sværere og sværere.',
    placeStart: 'Tag testen',
    placeSkip: 'Start fra begyndelsen',
    placeBadge: 'Niveautest',
    placeDone: 'Du kan cirka de første {n} på listen.',
    placeDone2: 'Vi fortsætter derfra. Det du sprang over, dukker op en gang imellem som en hurtig kontrol.',
    placeNone: 'Vi starter fra begyndelsen, så du lærer det hele i den rigtige rækkefølge.',
    placeAgain: 'Test mit niveau',
  },
  en: {
    lang: { da: 'Danish', en: 'English', ru: 'Russian', uk: 'Ukrainian' },
    title: 'Learn the words you need, one word at a time',
    lead: 'For everyday life, your new job or the driving test. The most important first, and what you know comes back less often.',
    how: ['Choose your languages and what to learn: the most used words, words for a specific job, or the driving test.', 'You get one word or one sentence at a time. The most important come first.', 'Answer correctly and it takes longer before it comes back. Answer wrong and it comes back soon. Your score shows how much you know.'],
    tagline: 'Free · no login · works on your phone',
    settings: 'Settings',
    setupTitle: 'Get started',
    save: 'Save and continue',
    cancel: 'Cancel',
    loading: 'Loading …',
    loadFail: 'Could not load the content. Check your internet connection.',
    nativeShort: 'first language',
    switchDir: 'Switch direction',
    progress: '{n} of {m} learned',
    levelAdvanced: '{from} covered. You are now practising {to}.',
    howTitle: 'How it works',
    explainSimple: 'New words and words you find difficult come first. Familiar words appear as occasional checks while you learn new ones. A mistake affects only the word you answered.',
    formula: 'The exact formula',
    learnQ: 'Which language do you want to learn?',
    baseQ: 'Which language do you understand best?',
    nativeB: 'It is my first language',
    nativeS: 'Learn to read with pictures',
    nativeSoon: 'Pictures coming soon',
    otherS: 'Show translations',
    whatQ: 'What do you want to learn?',
    topB: 'The most used words', topS: 'In order of how often they are used',
    catsQ: 'Topics',
    modeQ: 'What do you want to practise?',
    recB: 'Understand', recS: 'See {T}, pick {B}',
    prodB: 'Find and build', prodS: 'See {B}. First choose the {T} translation, then build the answer as you improve.', navigation: 'Navigation',
    recNB: 'Find the picture', recNS: 'See the word, pick the picture',
    prodNB: 'Read the word', prodNS: 'See the picture, pick the right word',
    writeB: 'Write it', writeS: 'See {B}. Spell words and build sentences in {T}.',
    writeNB: 'Write the word', writeNS: 'See the picture, hear the word and write it letter by letter',
    pathB: 'The whole course', pathS: 'Find the picture, read the word and write it. Tasks get harder as you learn the words.',
    picsB: 'Words with pictures', picsS: 'Pictures instead of translations · {n} words',
    qWrite: 'Write it in {T}',
    qWriteN: 'Write the word',
    hint: 'Help me',
    almost: 'Well done! The word will come back soon so you can practise it.',
    diffQ: 'Difficulty',
    diff: ['', 'Easy', 'Medium', 'Hard'],
    packDiff: ['', 'Essentials', 'Important', 'Everything'],
    nWords: '{n} words',
    start: 'Start',
    sound: 'Read aloud',
    learned: 'words learned',
    learnedPack: 'learned',
    newWord: 'New word',
    newQ: 'New word. Do you know it?',
    repeat: 'Review',
    check: 'Check',
    next: 'Continue',
    correct: 'Correct!',
    wrong: 'Not quite. The right answer is green.',
    wrongBuild: 'Not quite. Correct answer:',
    dontKnow: "Show me the answer",
    qRec: 'What does the word mean?',
    qProd: 'What is it in {T}?',
    qRecP: 'What does it mean?',
    qProdP: 'How do you say it in {T}?',
    qRecN: 'Which picture matches the word?',
    qProdN: 'Which word matches the picture?',
    qBuild: 'Build it in {T}',
    checkBtn: 'Check',
    rank: 'No. {n} on the list',
    seen: '{n} seen',
    due: '{n} ready for review',
    empty: 'Nothing matches the chosen settings.',
    stats: 'Statistics',
    back: 'Back',
    reset: 'Reset progress',
    resetQ: 'Reset all progress for this combination?',
    cols: ['#', 'Word', 'Per mil.', 'Meaning', 'Level', 'Interval', 'Status', 'Due'],
    learnedS: 'learned', notYet: 'not yet', wrongS: 'answered wrong', checkS: 'to be checked',
    tasks: 'tasks',
    noStats: 'You have not met anything yet.',
    explain:
      'Each word has a level <code>L</code>. The next review comes after <code>{tu}·{b}<sup>L</sup></code> tasks ' +
      'and <code>{mu} min·{b}<sup>L</sup></code>. The two are added up as <b>due</b>, and the word is ready at 100 %. ' +
      'Correct: <code>L+1</code>. Wrong: <code>L−1</code>. A word counts as learned from level {ll} if the last answer was correct.',
    placeTitle: 'Do you already know some?',
    placeLead: 'Take a short test and skip what you already know. It takes a few minutes and gets harder as you go.',
    placeStart: 'Take the test',
    placeSkip: 'Start from the beginning',
    placeBadge: 'Level test',
    placeDone: 'You know roughly the first {n} on the list.',
    placeDone2: 'We continue from there. What you skipped will come up now and then as a quick check.',
    placeNone: 'We start from the beginning so you learn everything in the right order.',
    placeAgain: 'Test my level',
  },
  ru: {
    lang: { da: 'Датский', en: 'Английский', ru: 'Русский', uk: 'Украинский' },
    title: 'Учите нужные слова по одному за раз',
    lead: 'Для повседневной жизни, новой работы или экзамена по вождению. Сначала самое важное, а то, что вы знаете, повторяется реже.',
    how: ['Выберите языки и что учить: самые частые слова, слова для конкретной работы или экзамен по вождению.', 'Вы получаете одно слово или одну фразу за раз. Сначала самое важное.', 'Если ответите правильно, слово вернётся нескоро. Если ошибётесь, оно скоро вернётся. Счёт показывает, сколько вы знаете.'],
    tagline: 'Бесплатно · без регистрации · работает на телефоне',
    settings: 'Настройки',
    setupTitle: 'Начать обучение',
    save: 'Сохранить и продолжить',
    cancel: 'Отмена',
    loading: 'Загрузка …',
    loadFail: 'Не удалось загрузить. Проверьте подключение к интернету.',
    nativeShort: 'родной язык',
    switchDir: 'Сменить направление',
    progress: 'Выучено {n} из {m}',
    levelAdvanced: 'Вы познакомились со словами уровня «{from}». Теперь уровень «{to}».',
    howTitle: 'Как это работает',
    explainSimple: 'Сначала идут новые слова и слова, которые вызывают трудности. Знакомые слова появляются время от времени для проверки. Ошибка влияет только на слово, на которое вы отвечали.',
    formula: 'Точная формула',
    learnQ: 'Какой язык вы хотите учить?',
    baseQ: 'Какой язык вы понимаете лучше всего?',
    nativeB: 'Это мой родной язык',
    nativeS: 'Учимся читать с картинками',
    nativeSoon: 'Картинки скоро появятся',
    otherS: 'Показывать перевод',
    whatQ: 'Что вы хотите выучить?',
    topB: 'Самые частые слова', topS: 'В порядке частоты употребления',
    catsQ: 'Темы',
    modeQ: 'Что будем тренировать?',
    recB: 'Понимать', recS: 'Видите {T}, выбираете {B}',
    prodB: 'Выбрать и собрать', prodS: 'Видите {B}. Сначала выбирайте перевод на языке: {T}, затем собирайте ответ по мере прогресса.', navigation: 'Навигация',
    recNB: 'Найти картинку', recNS: 'Видите слово, выбираете картинку',
    prodNB: 'Прочитать слово', prodNS: 'Видите картинку, выбираете нужное слово',
    writeB: 'Написать', writeS: 'Перевод: {B}. Пишите слова по буквам и собирайте предложения: {T}.',
    writeNB: 'Написать слово', writeNS: 'Видите картинку, слышите слово и пишете его по буквам',
    pathB: 'Весь курс', pathS: 'Найти картинку, прочитать слово и написать его. Задания усложняются по мере изучения слов.',
    picsB: 'Слова с картинками', picsS: 'Картинки вместо перевода · {n} слов',
    qWrite: 'Напишите на языке: {T}',
    qWriteN: 'Напишите слово',
    hint: 'Подсказка',
    almost: 'Молодец! Слово скоро вернётся, чтобы вы могли его потренировать.',
    diffQ: 'Сложность',
    diff: ['', 'Лёгкая', 'Средняя', 'Сложная'],
    packDiff: ['', 'Самое важное', 'Важное', 'Всё'],
    nWords: 'слов: {n}',
    start: 'Начать',
    sound: 'Читать вслух',
    learned: 'слов выучено',
    learnedPack: 'выучено',
    newWord: 'Новое слово',
    newQ: 'Новое слово. Вы его знаете?',
    repeat: 'Повторение',
    check: 'Проверка',
    next: 'Дальше',
    correct: 'Правильно!',
    wrong: 'Не совсем. Правильный ответ выделен зелёным.',
    wrongBuild: 'Не совсем. Правильный ответ:',
    dontKnow: 'Покажите ответ',
    qRec: 'Что означает это слово?',
    qProd: 'Как это будет на языке: {T}?',
    qRecP: 'Что это значит?',
    qProdP: 'Как это сказать на языке: {T}?',
    qRecN: 'Какая картинка подходит к слову?',
    qProdN: 'Какое слово подходит к картинке?',
    qBuild: 'Соберите на языке: {T}',
    checkBtn: 'Проверить',
    rank: '№ {n} в списке',
    seen: 'встречено: {n}',
    due: 'к повторению: {n}',
    empty: 'Нет ничего для выбранных настроек.',
    stats: 'Статистика',
    back: 'Назад',
    reset: 'Сбросить прогресс',
    resetQ: 'Сбросить весь прогресс для этой комбинации?',
    cols: ['№', 'Слово', 'На млн', 'Значение', 'Уровень', 'Интервал', 'Статус', 'Срок'],
    learnedS: 'выучено', notYet: 'ещё нет', wrongS: 'ошибка', checkS: 'на проверке',
    tasks: 'зад.',
    noStats: 'Вы ещё ничего не встретили.',
    explain:
      'У каждого слова есть уровень <code>L</code>. Следующее повторение будет через <code>{tu}·{b}<sup>L</sup></code> заданий ' +
      'и <code>{mu} мин·{b}<sup>L</sup></code>; оба значения складываются в <b>срок</b>, и слово готово к повторению при 100 %. ' +
      'Верно: <code>L+1</code>. Неверно: <code>L−1</code>. Слово считается выученным с уровня {ll}, если последний ответ был верным.',
    placeTitle: 'Вы уже что-то знаете?',
    placeLead: 'Пройдите короткий тест и пропустите то, что уже знаете. Это займёт пару минут, задания постепенно усложняются.',
    placeStart: 'Пройти тест',
    placeSkip: 'Начать с начала',
    placeBadge: 'Тест уровня',
    placeDone: 'Вы знаете примерно первые {n} в списке.',
    placeDone2: 'Продолжим оттуда. Пропущенное будет иногда появляться для быстрой проверки.',
    placeNone: 'Начнём с начала, чтобы вы выучили всё в правильном порядке.',
    placeAgain: 'Проверить мой уровень',
  },
  uk: {
    lang: { da: 'Данська', en: 'Англійська', ru: 'Російська', uk: 'Українська' },
    title: 'Вивчайте потрібні слова по одному за раз',
    lead: 'Для щоденного життя, нової роботи чи іспиту з водіння. Спочатку найважливіше, а те, що ви знаєте, повторюється рідше.',
    how: ['Оберіть мови і що вчити: найуживаніші слова, слова для певної роботи або іспит з водіння.', 'Ви отримуєте одне слово або одну фразу за раз. Спочатку найважливіше.', 'Якщо відповісте правильно, слово повернеться нескоро. Якщо помилитеся, воно скоро повернеться. Рахунок показує, скільки ви знаєте.'],
    tagline: 'Безкоштовно · без реєстрації · працює на телефоні',
    settings: 'Налаштування',
    setupTitle: 'Почати навчання',
    save: 'Зберегти і продовжити',
    cancel: 'Скасувати',
    loading: 'Завантаження …',
    loadFail: 'Не вдалося завантажити. Перевірте підключення до інтернету.',
    nativeShort: 'рідна мова',
    switchDir: 'Змінити напрямок',
    progress: 'Вивчено {n} з {m}',
    levelAdvanced: 'Ви ознайомилися зі словами рівня «{from}». Тепер рівень «{to}».',
    howTitle: 'Як це працює',
    explainSimple: 'Спочатку йдуть нові слова та слова, які викликають труднощі. Знайомі слова час від часу з’являються для перевірки. Помилка впливає лише на слово, на яке ви відповідали.',
    formula: 'Точна формула',
    learnQ: 'Яку мову ви хочете вивчати?',
    baseQ: 'Яку мову ви розумієте найкраще?',
    nativeB: 'Це моя рідна мова',
    nativeS: 'Вчимося читати з картинками',
    nativeSoon: 'Картинки скоро з’являться',
    otherS: 'Показувати переклад',
    whatQ: 'Що ви хочете вивчити?',
    topB: 'Найуживаніші слова', topS: 'У порядку частоти вживання',
    catsQ: 'Теми',
    modeQ: 'Що будемо тренувати?',
    recB: 'Розуміти', recS: 'Бачите {T}, обираєте {B}',
    prodB: 'Вибрати й скласти', prodS: 'Бачите {B}. Спочатку вибирайте переклад мовою: {T}, а згодом складайте відповідь.', navigation: 'Навігація',
    recNB: 'Знайти картинку', recNS: 'Бачите слово, обираєте картинку',
    prodNB: 'Прочитати слово', prodNS: 'Бачите картинку, обираєте потрібне слово',
    writeB: 'Написати', writeS: 'Переклад: {B}. Пишіть слова по літерах і складайте речення: {T}.',
    writeNB: 'Написати слово', writeNS: 'Бачите картинку, чуєте слово і пишете його по літерах',
    pathB: 'Увесь курс', pathS: 'Знайти картинку, прочитати слово і написати його. Завдання ускладнюються в міру вивчення слів.',
    picsB: 'Слова з картинками', picsS: 'Картинки замість перекладу · {n} слів',
    qWrite: 'Напишіть мовою: {T}',
    qWriteN: 'Напишіть слово',
    hint: 'Підказка',
    almost: 'Молодець! Слово скоро повернеться, щоб ви могли його потренувати.',
    diffQ: 'Складність',
    diff: ['', 'Легка', 'Середня', 'Складна'],
    packDiff: ['', 'Найважливіше', 'Важливе', 'Усе'],
    nWords: 'слів: {n}',
    start: 'Почати',
    sound: 'Читати вголос',
    learned: 'слів вивчено',
    learnedPack: 'вивчено',
    newWord: 'Нове слово',
    newQ: 'Нове слово. Ви його знаєте?',
    repeat: 'Повторення',
    check: 'Перевірка',
    next: 'Далі',
    correct: 'Правильно!',
    wrong: 'Не зовсім. Правильну відповідь виділено зеленим.',
    wrongBuild: 'Не зовсім. Правильна відповідь:',
    dontKnow: 'Покажіть відповідь',
    qRec: 'Що означає це слово?',
    qProd: 'Як це буде мовою: {T}?',
    qRecP: 'Що це означає?',
    qProdP: 'Як це сказати мовою: {T}?',
    qRecN: 'Яка картинка підходить до слова?',
    qProdN: 'Яке слово підходить до картинки?',
    qBuild: 'Складіть мовою: {T}',
    checkBtn: 'Перевірити',
    rank: '№ {n} у списку',
    seen: 'зустрінуто: {n}',
    due: 'до повторення: {n}',
    empty: 'Немає нічого для вибраних налаштувань.',
    stats: 'Статистика',
    back: 'Назад',
    reset: 'Скинути прогрес',
    resetQ: 'Скинути весь прогрес для цієї комбінації?',
    cols: ['№', 'Слово', 'На млн', 'Значення', 'Рівень', 'Інтервал', 'Статус', 'Строк'],
    learnedS: 'вивчено', notYet: 'ще ні', wrongS: 'помилка', checkS: 'на перевірці',
    tasks: 'завд.',
    noStats: 'Ви ще нічого не зустріли.',
    explain:
      'Кожне слово має рівень <code>L</code>. Наступне повторення буде через <code>{tu}·{b}<sup>L</sup></code> завдань ' +
      'і <code>{mu} хв·{b}<sup>L</sup></code>; обидва значення додаються в <b>строк</b>, і слово готове до повторення при 100 %. ' +
      'Правильно: <code>L+1</code>. Неправильно: <code>L−1</code>. Слово вважається вивченим з рівня {ll}, якщо остання відповідь була правильною.',
    placeTitle: 'Ви вже щось знаєте?',
    placeLead: 'Пройдіть короткий тест і пропустіть те, що вже знаєте. Це займе кілька хвилин, завдання поступово ускладнюються.',
    placeStart: 'Пройти тест',
    placeSkip: 'Почати з початку',
    placeBadge: 'Тест рівня',
    placeDone: 'Ви знаєте приблизно перші {n} у списку.',
    placeDone2: 'Продовжимо звідти. Пропущене іноді з’являтиметься для швидкої перевірки.',
    placeNone: 'Почнемо з початку, щоб ви вивчили все в правильному порядку.',
    placeAgain: 'Перевірити мій рівень',
  },
};

const PRACTICE_TEXT = {
  da: { menu: 'Menu', closeMenu: 'Luk menu', taskOptions: 'Opgavetyper og repetition', modesHint: 'Vælg én opgavetype eller flere, som skifter mellem hinanden.', repeatLearned: 'Gentag lærte ord', repeatHint: 'Kendte ord kommer indimellem. Ord, du har svært ved, øves altid igen.', completeTitle: 'Du kan alle ordene i dette udvalg', completeHint: 'Vælg et nyt kursus, en anden opgavetype eller slå repetition til.', enableReview: 'Slå repetition til', libraryMenu: 'Mine ord og lister' },
  en: { menu: 'Menu', closeMenu: 'Close menu', taskOptions: 'Task types and review', modesHint: 'Choose one task type or several to alternate between.', repeatLearned: 'Review learned words', repeatHint: 'Familiar words appear occasionally. Words you find difficult are always practised again.', completeTitle: 'You know every word in this selection', completeHint: 'Choose a new course, another task type or enable review.', enableReview: 'Enable review', libraryMenu: 'My words and lists' },
  ru: { menu: 'Меню', closeMenu: 'Закрыть меню', taskOptions: 'Типы заданий и повторение', modesHint: 'Выберите один тип заданий или несколько для чередования.', repeatLearned: 'Повторять выученные слова', repeatHint: 'Знакомые слова будут появляться иногда. Сложные слова всегда повторяются.', completeTitle: 'Вы знаете все слова в этой подборке', completeHint: 'Выберите новый курс, другой тип заданий или включите повторение.', enableReview: 'Включить повторение', libraryMenu: 'Мои слова и списки' },
  uk: { menu: 'Меню', closeMenu: 'Закрити меню', taskOptions: 'Типи завдань і повторення', modesHint: 'Виберіть один тип завдань або кілька для чергування.', repeatLearned: 'Повторювати вивчені слова', repeatHint: 'Знайомі слова з’являтимуться іноді. Складні слова завжди повторюються.', completeTitle: 'Ви знаєте всі слова в цій добірці', completeHint: 'Виберіть новий курс, інший тип завдань або ввімкніть повторення.', enableReview: 'Увімкнути повторення', libraryMenu: 'Мої слова та списки' }
};
for (const [lang, text] of Object.entries(PRACTICE_TEXT)) Object.assign(UI[lang], text);
const MEMORY_TEXT = {
  da: { readyTitle: 'Godt arbejde. Tag gerne en pause.', readyHint: 'Der er ingen ord, der skal øves lige nu. Gentagelser bliver klar, når det er tid. Du kan også vælge et andet kursus eller ændre sværhedsgrad eller opgavetype.', nextReview: 'Næste mulighed for gentagelse', checkAgain: 'Tjek igen', formula: 'Sådan vælges ordene', explainSimple: 'Du får fortrinsvis nye ord. Svære ord kommer igen efter en pause. Når repetition er slået til, kontrolleres lærte ord med længere mellemrum. En fejl påvirker kun det ord, du svarede på. Når alle ord på et niveau er vist, og mindst 80 % er lært, fortsætter du automatisk. De resterende svære ord følger med.', explain: 'Dine svar og tiden mellem dem bestemmer pausen for hvert ord. Sikre ord får længere pauser, og hyppige ord kontrolleres lidt oftere. Når alle grupper er tilgængelige, er fordelingen cirka 70 % nye ord, 20 % svære ord og 10 % lærte ord. Rækkefølgen varierer, og der er et loft over gentagelser af samme ord i én session.' },
  en: { readyTitle: 'Good work. This is a good time for a break.', readyHint: 'No words need practice right now. Reviews become available when they are due. You can also choose another course, difficulty or task type.', nextReview: 'Next review opportunity', checkAgain: 'Check again', formula: 'How words are selected', explainSimple: 'Most tasks introduce new words. Difficult words return after a pause. When review is enabled, learned words are checked at longer intervals. A mistake affects only the word you answered. When every word at a level has been introduced and at least 80% are learned, you move on automatically. Remaining difficult words stay in your practice.', explain: 'Your answers and the time between them determine each word’s interval. Confident answers earn longer gaps, and common words are checked a little more often. When all groups are available, the mix is about 70% new words, 20% difficult words and 10% learned words. The order varies, with a limit on repetitions of one word per session.' },
  ru: { readyTitle: 'Хорошая работа. Можно сделать перерыв.', readyHint: 'Сейчас нет слов для повторения. Они появятся, когда придёт время. Можно выбрать другой курс, уровень сложности или тип заданий.', nextReview: 'Следующая возможность повторения', checkAgain: 'Проверить снова', formula: 'Как выбираются слова', explainSimple: 'Большинство заданий знакомит с новыми словами. Сложные слова возвращаются после паузы. Если повторение включено, выученные слова проверяются с большими интервалами. Ошибка влияет только на текущее слово. Когда все слова уровня уже показаны и выучено не менее 80%, вы автоматически переходите дальше. Остальные сложные слова остаются в тренировке.', explain: 'Ответы и время между ними определяют интервал для каждого слова. Уверенные ответы увеличивают паузу, а частые слова проверяются немного чаще. Когда доступны все группы, около 70% заданий посвящено новым словам, 20% сложным и 10% выученным. Порядок меняется, а число повторений одного слова за занятие ограничено.' },
  uk: { readyTitle: 'Гарна робота. Можна зробити перерву.', readyHint: 'Зараз немає слів для повторення. Вони з’являться, коли настане час. Можна вибрати інший курс, рівень складності або тип завдань.', nextReview: 'Наступна можливість повторення', checkAgain: 'Перевірити знову', formula: 'Як вибираються слова', explainSimple: 'Більшість завдань знайомить із новими словами. Складні слова повертаються після паузи. Якщо повторення ввімкнено, вивчені слова перевіряються з більшими інтервалами. Помилка впливає лише на поточне слово. Коли всі слова рівня вже показано й вивчено щонайменше 80%, ви автоматично переходите далі. Решта складних слів залишається в тренуванні.', explain: 'Відповіді й час між ними визначають інтервал для кожного слова. Упевнені відповіді збільшують паузу, а часті слова перевіряються трохи частіше. Коли доступні всі групи, близько 70% завдань присвячено новим словам, 20% складним і 10% вивченим. Порядок змінюється, а кількість повторень одного слова за заняття обмежена.' }
};
for (const [lang, text] of Object.entries(MEMORY_TEXT)) Object.assign(UI[lang], text);
for (const [lang, locale] of Object.entries(EXTRA_LOCALES)) UI[lang] = locale.ui;
const PROGRESS_TEXT = {
  da:['Fremskridt','Et ord er lært, når du kan det i alle valgte opgavetyper. Bjælken viser også de dele, du allerede har klaret.'],
  en:['Progress','A word is learned when you know it in every selected task type. The bar also includes the parts you have already mastered.'],
  ru:['Прогресс','Слово считается выученным после освоения всех выбранных типов заданий. Полоса учитывает и уже освоенные части.'],
  uk:['Прогрес','Слово вважається вивченим після опанування всіх вибраних типів завдань. Смужка враховує і вже опановані частини.'],
  pl:['Postępy','Słowo jest opanowane po poprawnych odpowiedziach we wszystkich wybranych typach zadań. Pasek uwzględnia też opanowane już części.'],
  ro:['Progres','Un cuvânt este învățat când îl cunoști în fiecare tip de exercițiu ales. Bara include și părțile pe care le stăpânești deja.'],
  lt:['Pažanga','Žodis laikomas išmoktu, kai jį moki visuose pasirinktuose užduočių tipuose. Juosta rodo ir jau išmoktas dalis.'],
  bg:['Напредък','Думата е научена, когато я знаеш във всички избрани видове задачи. Лентата отчита и вече усвоените части.'],
};
for(const [lang,[progressLabel,progressMixedHint]]of Object.entries(PROGRESS_TEXT))Object.assign(UI[lang],{progressLabel,progressMixedHint});
const languageNames = { da: ['Polsk','Rumænsk','Litauisk','Bulgarsk'], en: ['Polish','Romanian','Lithuanian','Bulgarian'], ru: ['Польский','Румынский','Литовский','Болгарский'], uk: ['Польська','Румунська','Литовська','Болгарська'], pl: ['polski','rumuński','litewski','bułgarski'], ro: ['poloneză','română','lituaniană','bulgară'] };
for (const [lang, [pl,ro,lt,bg]] of Object.entries(languageNames)) Object.assign(UI[lang].lang,{pl,ro,lt,bg});
for (const [lang,label] of Object.entries({da:'Licenser',en:'Licences',ru:'Лицензии',uk:'Ліцензії'})) UI[lang].licenses=label;

// ---------- Data ----------
// Alle læringsenheder (ord fra hyppighedslisten + ord/sætninger fra branchepakker) slås op i ITEM.
const ITEM = {};
const PACK_ITEMS = {};
// Oversigt over branchepakker (packs/index.js). Selve pakken hentes først, når den vælges.
const PACK_LIST = typeof PACK_INDEX !== 'undefined' ? PACK_INDEX : [];
// Billeder til modersmåls-mode (images/words/manifest.js) – findes kun, når billederne er leveret.
const IMG = typeof IMAGES !== 'undefined' ? IMAGES : {};
for (const c of CONCEPTS) ITEM[c.id] = { ...c, phrase: false };
function registerPack(p) {
  const sourceIds = PACK_LIST.find(info => info.id === p.id)?.sourceIds || {};
  const byCat = p.categories.map((cat) => cat.rows.map(([prio, da, en, ru, uk, pl, ro, lt, bg]) => ({
    id: sourceIds[da] || `${p.id}:${da}`, words: { da, en, ru, uk, pl, ro, lt, bg }, pos: cat.key, cat: cat.key, diff: prio, phrase: cat.type === 'phrase',
  })));
  // Prioritet 1 først, på skift mellem kategorierne, derefter prioritet 2 osv.
  const ordered = [];
  for (const prio of [1, 2, 3]) {
    const queues = byCat.map((items) => items.filter((x) => x.diff === prio));
    while (queues.some((q) => q.length)) for (const q of queues) if (q.length) ordered.push(q.shift());
  }
  ordered.forEach((x) => (ITEM[x.id] = x));
  PACK_ITEMS[p.id] = ordered;
}
const packLoads = {};
function loadPack(id) {
  if (PACK_ITEMS[id]) return Promise.resolve();
  if (!packLoads[id]) {
    packLoads[id] = new Promise((resolve, reject) => {
      const info = PACK_LIST.find((p) => p.id === id);
      const el = document.createElement('script');
      el.src = `packs/${id}.js${info ? `?v=${info.v}` : ''}`;
      el.onload = () => { if (typeof PACKS !== 'undefined' && PACKS[id]) registerPack(PACKS[id]); resolve(); };
      el.onerror = () => { delete packLoads[id]; reject(new Error('pack ' + id)); };
      document.head.appendChild(el);
    });
  }
  return packLoads[id];
}
// Billed-mode: billeder i stedet for oversættelse. Altid ved modersmål, og som valg ("Ord med billeder")
// for dem, der lærer et fremmedsprog helt fra bunden.
const PICS = 'pics';
const isPics = (s) => s.base === s.target || s.pack === PICS;
const isList = (s) => typeof s.pack === 'string' && s.pack.startsWith('list:');
const isPack = (s) => !!s.pack && s.pack !== TOP && s.pack !== PICS && !isList(s);
// Billeder, der let kan forveksles, må ikke stå som svarmuligheder sammen.
const CONFUSE = [
  ['person', 'man', 'father', 'grandfather', 'friend', 'teacher'], ['person', 'woman', 'mother', 'grandmother'],
  ['child', 'baby', 'boy', 'girl'], ['people', 'family', 'friend'], ['house', 'home'], ['happy', 'laugh', 'love'],
  ['sad', 'cry'], ['road', 'street', 'city'], ['one', 'apple'], ['night', 'moon', 'star'], ['sea', 'beach', 'swim', 'whale'],
  ['rain', 'cloud', 'umbrella'], ['snow', 'cold'], ['fire', 'hot', 'light'], ['see', 'eye'], ['speak', 'mouth', 'sing', 'hello'],
  ['foot', 'leg', 'shoe'], ['face', 'head'], ['sit', 'chair'], ['sleep', 'bed', 'tired'], ['read', 'book'],
  ['write', 'pencil', 'letter'], ['play', 'toy', 'game', 'ball'], ['music', 'sing', 'dance'], ['shop', 'buy', 'money'],
];
const confusable = (a, b) => CONFUSE.some((g) => g.includes(a) && g.includes(b));
const packOf = (s) => PACK_LIST.find((p) => p.id === s.pack);
// Antal ord/sætninger for et valg – fra oversigten, så pakken ikke skal hentes for at vise tallet.
function countPool(s) {
  if (!isPack(s)) return buildPool(s).length;
  const p = packOf(s);
  if (!p) return 0;
  return p.categories.filter((c) => !s.cats || s.cats.includes(c.key))
    .reduce((sum, c) => sum + c.n.slice(1, s.diff + 1).reduce((a, b) => a + b, 0), 0);
}

// ---------- State ----------
const state = loadState();
const wordLibrary = new WordLibrary(state.library);
let view = viewFromHash();
let draft = null;
let current = null;
let timer = null;
let placement = null;
let pendingPlacement = false;
let selectedCourseLink = false;
let lastFeedback = null;
let levelNotice = null;

// Public language pages can hand their explicit interface choice to the app
// before a course/language pair exists. Consume this UI hint without changing progress.
function applyInterfaceLink() {
  const query = new URLSearchParams(location.search);
  const requested = query.get('ui');
  if (!requested || !Object.hasOwn(UI, requested)) return;
  state.uiLang = requested;
  saveState();
  query.delete('ui');
  const remaining = query.toString();
  history.replaceState(null, '', location.pathname + (remaining ? '?' + remaining : '') + location.hash);
}
applyInterfaceLink();

// Direct course links teach Danish with the explicitly selected helper language.
// A complete pair starts immediately; an unspecified helper still opens setup.
function applyCourseLink() {
  if (!location.hash.startsWith('#start=')) return;
  const parameters = new URLSearchParams(location.hash.slice(1));
  const pack = parameters.get('start'), requestedBase = parameters.get('base'), requestedTarget=parameters.get('target');
  if(parameters.has('target')&&!Object.hasOwn(LANGS,requestedTarget))return;
  const target=requestedTarget||'da';
  const base = Object.hasOwn(LANGS,requestedBase) ? requestedBase : null;
  if (![TOP, PICS].includes(pack) && !PACK_LIST.some((p) => p.id === pack)) return;
  const availableTopics = PACK_LIST.find(p=>p.id===pack)?.categories.map(category=>category.key) || [];
  const topics = [...new Set((parameters.get('topics') || '').split(',').filter(topic=>availableTopics.includes(topic)))];
  selectedCourseLink = true;
  CoursePreferences.remember(state);
  if (base && Object.hasOwn(UI, base)) state.uiLang = base;
  current = null;
  placement = null;
  lastFeedback = null;
  const s = state.settings;
  const compatibleBase=value=>Object.hasOwn(LANGS,value)&&(value!==target||[TOP,PICS].includes(pack));
  const preferred=compatibleBase(base)?base:base===target?null:compatibleBase(s?.base)?s.base:null;
  if (preferred) {
    history.replaceState(null, '', location.pathname + location.search);
    state.settings = CoursePreferences.resolve(state, { pack, target, base: preferred });
    if (topics.length) state.settings.cats = topics;
    // A course page's start button already expresses the intent to practise.
    for (const dir of PracticeOptions.modes(state.settings)) ctx({ ...state.settings, dir }).prog.offered = true;
    saveState();
    view = 'play';
  } else {
    draft = { target, base: null, pack, dir: 'rec', diff: 1, cats: topics.length ? topics : null };
    saveState();
    view = 'setup';
  }
}
applyCourseLink();
window.addEventListener('hashchange', () => {
  if (/^#start=/.test(location.hash)) { applyCourseLink(); render(); }
});

function viewFromHash() {
  const h = location.hash;
  if (h === '#forside') return 'home';
  if (h === '#mine-ord') return 'library';
  if (h === '#indstillinger' || !state.settings) return 'setup';
  if (h === '#statistik') return 'stats';
  return 'play';
}
// Navigation med rigtige URL'er, så browserens tilbage-knap virker.
function go(v, { keepDraft = false } = {}) {
  if ($('appMenu')?.open) $('appMenu').close();
  if (v !== 'play' && v !== 'place') pendingPlacement = false;
  if (v === 'play' && placement && current?.kind === 'place') v = 'place';
  if (v !== 'play') { lastFeedback = null; levelNotice = null; }
  const hash = v === 'home' ? '#forside' : v === 'setup' ? '#indstillinger' : v === 'stats' ? '#statistik' : v === 'library' ? '#mine-ord' : '';
  if (location.hash !== hash) history.pushState(null, '', location.pathname + location.search + hash);
  view = v;
  if (v === 'setup' && !keepDraft) draft = null;
  window.scrollTo(0, 0);
  render();
}
window.addEventListener('popstate', () => {
  if (/^#start=/.test(location.hash)) { applyCourseLink(); render(); return; }
  view = viewFromHash();
  if (view === 'play' && placement && current?.kind === 'place') view = 'place';
  if (view === 'setup') draft = null;
  render();
});

function loadState() {
  let s = null;
  try { s = JSON.parse(localStorage.getItem(STORE)); } catch (e) { /* ingen lagring */ }
  if (!s || typeof s !== 'object' || Array.isArray(s)) s = {};
  s.progress = s.progress || {};
  s.sound = s.sound !== false;
  s.library = s.library && typeof s.library === 'object' && !Array.isArray(s.library) ? s.library : {};
  if (!Object.hasOwn(UI, s.uiLang)) delete s.uiLang;
  return s;
}
function saveState() {
  CoursePreferences.remember(state);
  try { localStorage.setItem(STORE, JSON.stringify(state)); } catch (error) {
    if (['QuotaExceededError', 'NS_ERROR_DOM_QUOTA_REACHED'].includes(error?.name) || [22, 1014].includes(error?.code)) {
      // Keep counters and FSRS state; only trim optional diagnostic history.
      for (const progress of Object.values(state.progress)) for (const card of Object.values(progress.cards || {})) if (Array.isArray(card.memory?.log)) card.memory.log = card.memory.log.slice(-2);
      try { localStorage.setItem(STORE, JSON.stringify(state)); } catch { /* storage unavailable */ }
    }
  }
}

function lastCourseSettings() {
  const saved = CoursePreferences.last(state);
  return saved && ([TOP, PICS].includes(saved.pack) || PACK_LIST.some((pack) => pack.id === saved.pack)) ? saved : null;
}
function returnToCourse() {
  const saved = lastCourseSettings();
  if (!saved) return;
  state.settings = saved;
  current = null; placement = null; lastFeedback = null; levelNotice = null; draft = null;
  saveState(); go('play');
}

// ---------- Helpers ----------
const $ = (id) => document.getElementById(id);
const esc = (s) => String(s).replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
const fill = (str, vars) => str.replace(/\{(\w+)\}/g, (_, k) => (k in vars ? vars[k] : `{${k}}`));
function browserLang() {
  const l = (navigator.language || 'da').toLowerCase().slice(0, 2);
  return UI[l] ? l : 'en';
}
// Appens sprog er altid det sprog, brugeren forstår bedst – aldrig det sprog, der skal læres.
function uiLang() {
  if (view === 'setup' && draft && draft.base) return draft.base;
  return state.uiLang || (state.settings && state.settings.base) || browserLang();
}
function t(key, vars) {
  const v = UI[uiLang()][key];
  return vars && typeof v === 'string' ? fill(v, vars) : v;
}
function exerciseLanguage(language) {
  const label=UI[uiLang()].lang[language] || '';
  return uiLang()==='en' ? label : label.toLowerCase();
}
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
const norm = (s) => s.toLowerCase().replace(/[.,!?;:«»"“”]/g, '').replace(/\s+/g, ' ').trim();

// ---------- Model ----------
function buildPool(s) {
  if (isList(s)) return listPool(s.pack.slice(5), s);
  if (isPack(s)) {
    return (PACK_ITEMS[s.pack] || []).filter((x) => x.diff <= s.diff && x.words[s.target] && x.words[s.base]
      && (!s.cats || s.cats.includes(x.cat)));
  }
  const pics = isPics(s);
  return ORDER[s.target].map((id) => ITEM[id])
    .filter((c) => c.diff <= s.diff && c.words[s.target] && (pics ? IMG[c.id] : c.words[s.base]));
}
function progKey(s) {
  if (isList(s)) return `${s.pack}|${s.target}|${s.base}|${s.dir}`;
  if (isPack(s)) return `${s.pack}|${s.target}|${s.base}|${s.dir}`;
  if (s.pack === PICS && s.base !== s.target) return `${PICS}|${s.target}|${s.base}|${s.dir}`;
  return `${s.target}|${s.base}|${s.dir}`;
}
function progressFor(s,pool) {
  const key = progKey(s);
  const prog = (state.progress[key] = state.progress[key] || { task: 0, cards: {}, lastId: null });
  const scope = JSON.stringify([s.diff, s.cats || null]);
  if (prog.reviewScope !== scope) {
    prog.reviewScope = scope;
    prog.lastLearnedReviewTask = prog.task;
  }
  if(typeof CourseKnowledge!=='undefined')CourseKnowledge.seed({state,settings:s,pool,progress:prog,learned:isLearned,progressKey:progKey,now:Date.now()});
  return prog;
}
function ctx(settings = state.settings) {
  const pool=buildPool(settings);
  return {s:settings,native:settings.base===settings.target,pics:isPics(settings),key:progKey(settings),prog:progressFor(settings,pool),pool};
}
function dueness(card, prog, now) {
  const at = MemoryScheduler.dueAt(card, isLearned(card), now);
  return Math.max(0, (now - (card.memory.last ?? card.time)) / Math.max(60000, at - (card.memory.last ?? card.time)));
}
function isLearned(card) { return card.ok && card.lvl >= CONFIG.learnedLevel; }
function scoreOf(prog) { return Object.keys(prog.cards).filter((id) => ITEM[id] && isLearned(prog.cards[id])).length; }
function rankOf(s, id) {
  const list = isList(s) ? buildPool(s).map((x) => x.id) : isPack(s) ? PACK_ITEMS[s.pack].map((x) => x.id) : ORDER[s.target];
  return list.indexOf(id) + 1;
}

// Opgavetype for et ord, der skal gentages.
//  rec:   se målsproget, vælg betydningen (billede eller oversættelse)
//  prod:  se betydningen, vælg ordet – fra niveau buildFromLevel skrives ordet selv
//  write: skriv ordet bogstav for bogstav (sætninger bygges af ordbrikker)
//  path:  billed-forløbet – find billedet (L0), læs ordet (L1), skriv ordet (L2+)
function reviewTask(c, x) {
  const card = c.prog.cards[x.id];
  const d = c.s.dir;
  const quiz = (qdir) => ({ kind: 'quiz', concept: x, qdir });
  const spell = () => (writeSpec(c, x) ? { kind: 'write', concept: x, qdir: 'prod' }
    : buildSpec(c, x) ? { kind: 'build', concept: x, qdir: 'prod' } : null);
  if (d === 'rec') return quiz('rec');
  if (d === 'path') {
    if (card.verify || card.lvl === 0) return quiz('rec');
    if (card.lvl === 1) return quiz('prod');
    return spell() || quiz('prod');
  }
  if (d === 'write') return spell() || quiz('prod');
  if (!card.verify && card.lvl >= CONFIG.buildFromLevel) return spell() || quiz('prod');
  return quiz('prod');
}
function pickNext(c) {
  const now = Date.now();
  const selected = LearningFlow.select(c.pool, c.prog, isLearned, now, { repeatLearned: c.s.repeatLearned !== false, session: MemoryScheduler.session(state, c.s, now), rng: Math.random });
  if (!selected) return null;
  if (selected.review) return { ...reviewTask(c, selected.word), maintenance: selected.maintenance };
  const fresh = selected.word;
  // Børn (modersmål) ser altid ordet først. Andre prøver først, om de kender det.
  if (c.native) return { kind: 'intro', concept: fresh };
  if (c.s.dir === 'write') {
    if (writeSpec(c, fresh)) return { kind: 'write', concept: fresh, qdir: 'prod', isNew: true };
    if (buildSpec(c, fresh)) return { kind: 'build', concept: fresh, qdir: 'prod', isNew: true };
  }
  return { kind: 'new', concept: fresh, qdir: c.s.dir === 'rec' || c.s.dir === 'path' ? 'rec' : 'prod' };
}

function newCard(c, lvl, ok, extra) {
  return { lvl, ok, right: ok ? 1 : 0, wrong: ok ? 0 : 1, task: c.prog.task, time: Date.now(), ...extra };
}

// Svarmuligheder vises i "betydnings"-sproget (eller som billede) ved rec, i målsproget ved prod.
function optionLabel(c, x, qdir) {
  if (qdir === 'rec') return c.pics ? x.id : lexicalForm(x,c.s.base).toLowerCase();
  return lexicalForm(x,c.s.target).toLowerCase();
}
// These terms overlap in ordinary use even when their translations are distinct.
// Keep their learning records separate, but never mark one as the other's wrong answer.
const OVERLAPPING_ANSWERS = [
  ['job','arbejde','stilling','ledig stilling'],
  ['chef','leder'],
  ['ansat','medarbejder','lønmodtager','arbejdstager'],
  ['program','app','applikation'],
  ['forklare','afklare'],
  ['møde','aftale'],
  ['stuepige','værelsesassistent'],
  ['klippe','trimme'],
  ['spade','skovl'],
  ['jord','muld'],
  ['vaskepulver','vaskemiddel'],
  ['etiket','vaskemærkning'],
  ['arbejdstøj','uniform'],
];
const answerSource = item => lexicalForm(item,'da').toLowerCase().replace(/^(en|et|at)\s+/,'');
function pickDistractors(c, concept, qdir, n = 3) {
  const answer = optionLabel(c, concept, qdir);
  const used = new Set([answer]);
  const picked = [];
  // Synonymer (fx "mug" og "skimmel") må ikke optræde som forkerte svar for hinanden.
  const sameMeaning = (x) => ['base', 'target'].some((k) => x.words[c.s[k]] && lexicalForm(x,c.s[k]).toLowerCase() === lexicalForm(concept,c.s[k]).toLowerCase());
  const source=answerSource(concept);
  const overlapping=OVERLAPPING_ANSWERS.find(group=>group.includes(source));
  const candidates = isList(c.s)
    ? Object.values(ITEM).filter((x) => x.id.startsWith('lex:') && x.words[c.s.target] && x.words[c.s.base])
    : isPack(c.s)
      ? (PACK_ITEMS[c.s.pack] || []).filter(x=>x.diff<=c.s.diff && x.words[c.s.target] && x.words[c.s.base])
      : c.pool;
  const cand = candidates.filter((x) => x.id !== concept.id && x.phrase === concept.phrase && !sameMeaning(x) && !(overlapping && overlapping.includes(answerSource(x)))
    && !(c.pics && confusable(x.id, concept.id)));
  const scope=new Set(c.pool.map(x=>x.id));
  const scoped=cand.filter(x=>scope.has(x.id));
  const seen = (x) => !!c.prog.cards[x.id];
  const samePos = (x) => x.pos === concept.pos;
  const near = new Set(c.pool.slice(0, Math.max(40, c.pool.indexOf(concept) + 20)).map((x) => x.id));
  // Keep personal-list fallbacks readable beside a short answer. Shuffle within
  // this band rather than always selecting the same nearest-length words.
  const answerLength = Array.from(answer).length;
  const readableFallback = isList(c.s) ? cand.filter((x) => {
    const length = Array.from(optionLabel(c, x, qdir)).length;
    return length >= Math.max(1, Math.floor(answerLength / 2))
      && length <= Math.max(answerLength + 6, Math.ceil(answerLength * 1.8));
  }) : [];
  const tiers = [
    scoped.filter((x) => seen(x) && samePos(x)),
    scoped.filter((x) => !seen(x) && samePos(x) && near.has(x.id)),
    scoped.filter((x) => seen(x)),
    scoped.filter((x) => near.has(x.id)),
    scoped,
    readableFallback,
    // A small selected topic may need other same-course words as wrong choices.
    // These are never added to the question pool or promoted above the chosen level.
    cand,
  ];
  for (const tier of tiers) {
    for (const x of shuffle([...tier])) {
      if (picked.length >= n) break;
      const label = optionLabel(c, x, qdir);
      if (used.has(label)) continue;
      // Billederne må heller ikke kunne forveksles med hinanden.
      if (c.pics && picked.some((p) => confusable(p.id, x.id))) continue;
      used.add(label);
      picked.push(x);
    }
    if (picked.length >= n) break;
  }
  return picked;
}
function makeOptions(c, x, qdir) { return shuffle([x, ...pickDistractors(c, x, qdir)]); }

// ----- Byg sætninger -----
// Sætninger (og flerordsudtryk) bygges af ordbrikker. Enkeltord skrives på bogstav-tastaturet.
function splitPrefix(c, x) {
  const full = lexicalForm(x,c.s.target);
  if (!x.phrase && c.s.target === 'da') {
    const m = full.match(/^(en|et|at)\s+(.+)$/);
    if (m) return { prefix: m[1], rest: m[2] };
  }
  if (!x.phrase && c.s.target === 'ro') {
    const match=full.match(/^(a|un|o)\s+(.+)$/);
    if(match) return {prefix:match[1],rest:match[2]};
  }
  return { prefix: '', rest: full };
}
function buildSpec(c, x) {
  const { prefix, rest } = splitPrefix(c, x);
  const words = rest.split(/\s+/).filter(Boolean);
  if (!x.phrase && words.length < 2) return null;
  const tokens = words.map((w) => w.replace(/[.,!?;:]+$/, '')).filter(Boolean);
  if (tokens.length < 2) return null;
  // Stort begyndelsesbogstav ville afsløre det første ord.
  if (x.phrase) tokens[0] = tokens[0].charAt(0).toLowerCase() + tokens[0].slice(1);
  return { mode: 'words', prefix, answer: tokens, sep: ' ' };
}
function makeTiles(c, x, spec) {
  const extra = [];
  const inAnswer = new Set(spec.answer.map((a) => a.toLowerCase()));
  const others = shuffle(c.pool.filter((o) => o.id !== x.id && o.phrase === x.phrase).slice(0, 80));
  for (const o of others) {
    for (const w of shuffle(lexicalForm(o,c.s.target).split(/\s+/).slice(1))) {
      const tok = w.replace(/[.,!?;:]+$/, '');
      if (tok && !inAnswer.has(tok.toLowerCase()) && !extra.includes(tok)) { extra.push(tok); break; }
    }
    if (extra.length >= 2) break;
  }
  return shuffle([...spec.answer, ...extra].map((tk, i) => ({ tk, i })));
}

// ----- Skriv ordet: bogstav-tastatur -----
// Tastaturet har ordets bogstaver plus nogle ekstra. Antallet af ekstra bogstaver følger sværhedsgraden,
// og tastaturet er altid et helt gitter: 2×2, 3×2, 3×3, 4×3, 4×4 eller 5×4.
// Let: fx "mor" eller "hund" på 2×2. Bogstaverne kan bruges flere gange (som et rigtigt tastatur).
const isLetter = (ch) => /\p{L}/u.test(ch);
const KEY_EXTRA = { 1: 0, 2: 3, 3: 7 };
const KEY_GRIDS = [[4, 2], [6, 3], [9, 3], [12, 4], [16, 4], [20, 5]];
// Bogstaver, der ligner hinanden – de bedste "forkerte" bogstaver.
const LOOKALIKE = {
  b: 'dp', d: 'bp', p: 'bdq', q: 'pg', m: 'nw', n: 'mu', u: 'nv', v: 'uw', w: 'vm', i: 'lj', l: 'it', j: 'i',
  e: 'aø', a: 'eo', o: 'øå', ø: 'oæ', å: 'ao', æ: 'ae', g: 'kq', k: 'g', t: 'df', f: 't', s: 'z', h: 'n', r: 'n',
  и: 'йн', й: 'и', ш: 'щ', щ: 'ш', е: 'ёэ', ё: 'е', э: 'е', п: 'н', н: 'пи', б: 'в', в: 'б', г: 'т', т: 'г',
  ь: 'ъ', ъ: 'ь', з: 'э', с: 'о', ч: 'у', і: 'ї', ї: 'і', є: 'е',
};
const alphabets = {};
function alphabetOf(lang) {
  if (!alphabets[lang]) {
    // Kun almindelige bogstaver (fx ikke "é" fra "idé") – et bogstav skal optræde i mindst 5 ord.
    const count = {};
    for (const id of ORDER[lang] || []) {
      const w = (ITEM[id] && ITEM[id].words[lang]) || '';
      for (const ch of new Set(Array.from(w.toLowerCase()).filter(isLetter))) count[ch] = (count[ch] || 0) + 1;
    }
    alphabets[lang] = Object.keys(count).filter((ch) => count[ch] >= 5);
    if (!alphabets[lang].length && ['pl','ro'].includes(lang)) alphabets[lang] = Array.from(lang === 'pl' ? 'aąbcćdeęfghijklłmnńoóprsśtuwyzźż' : 'aăâbcdefghiîjklmnopqrsștțuvwxyz');
  }
  return alphabets[lang];
}
function writeSpec(c, x) {
  if (x.phrase) return null;
  const { prefix, rest } = splitPrefix(c, x);
  if (/\s/.test(rest.trim())) return null;
  const chars = Array.from(rest.trim());
  const n = chars.filter(isLetter).length;
  if (n < 1 || n > 32 || chars.length > 36) return null;
  return { prefix, chars };
}
function makeKeys(c, spec) {
  const letters = Array.from(new Set(spec.chars.filter(isLetter).map((ch) => ch.toLowerCase())));
  const want = letters.length + (KEY_EXTRA[c.s.diff] || 0);
  const [size, cols] = KEY_GRIDS.find(([n]) => n >= want) || [letters.length, Math.ceil(Math.sqrt(letters.length))];
  const need = size - letters.length;
  const alphabet = alphabetOf(c.s.target);
  const extra = [];
  const add = (ch) => { if (extra.length < need && !letters.includes(ch) && !extra.includes(ch) && alphabet.includes(ch)) extra.push(ch); };
  // Op til halvdelen af de ekstra bogstaver ligner ordets egne, resten er tilfældige fra sprogets alfabet.
  for (const ch of shuffle(letters.flatMap((l) => Array.from(LOOKALIKE[l] || '')))) if (extra.length < Math.ceil(need / 2)) add(ch);
  for (const ch of shuffle([...alphabet])) add(ch);
  return { keys: shuffle([...letters, ...extra]), cols };
}
// Første plads fra pos, der skal udfyldes (tegn som bindestreg er udfyldt på forhånd).
function nextSlot(spec, pos) {
  while (pos < spec.chars.length && !isLetter(spec.chars[pos])) pos++;
  return pos;
}

// ---------- Speech ----------
function speak(text, lang, explicit = false) {
  if ((!state.sound && !explicit) || !('speechSynthesis' in window)) return;
  try {
    const u = new SpeechSynthesisUtterance(text);
    u.lang = LANGS[lang].tts;
    const voice = speechSynthesis.getVoices().find((v) => v.lang.replace('_', '-').toLowerCase().startsWith(lang));
    if (voice) u.voice = voice;
    u.rate = 0.9;
    speechSynthesis.cancel();
    speechSynthesis.speak(u);
  } catch (e) { /* ingen tale */ }
}
function speakTarget(x, explicit = false) { speak(lexicalForm(x,state.settings.target), state.settings.target, explicit); }

// ---------- Rendering ----------
function catalogueHref(lang,settings=state.settings) {
  const root=`/${lang}/`;
  if(!settings||!Object.hasOwn(LANGS,settings.target)||!Object.hasOwn(LANGS,settings.base))return root;
  return root+'?'+new URLSearchParams({target:settings.target,base:settings.base});
}
function renderSiteMetadata(lang) {
  const copy=COURSE_CATALOG.siteMetadata(lang,PACK_INDEX.length);
  document.title=copy.title;
  for(const [selector,value]of [
    ['meta[name="description"]',copy.description],
    ['meta[property="og:title"]',copy.title],
    ['meta[property="og:description"]',copy.description],
    ['meta[property="og:locale"]',copy.locale],
    ['meta[property="og:image:alt"]',copy.imageAlt],
    ['meta[name="twitter:image:alt"]',copy.imageAlt],
  ])document.querySelector(selector)?.setAttribute('content',value);
  const structured=document.querySelector('script[type="application/ld+json"]');
  if(structured)try {
    const data=JSON.parse(structured.textContent);
    if(data['@type']==='WebApplication'){
      data.name='JobVocabulary';data.description=copy.description;
      structured.textContent=JSON.stringify(data);
    }
  } catch { /* A metadata failure must not interrupt practice. */ }
}
function render() {
  clearTimeout(timer);
  const ul = uiLang();
  document.documentElement.lang = ul;
  renderSiteMetadata(ul);
  $('mainNav').setAttribute('aria-label', t('navigation'));
  const inGame = !!state.settings && !['home', 'setup', 'library'].includes(view);
  $('score').hidden = !inGame;
  $('statsBtn').hidden = !state.settings;
  $('setupBtn').hidden = !state.settings;
  $('soundBtn').hidden = false;
  $('modeBtn').hidden = !state.settings;
  $('resumeBtn').hidden = !(view === 'home' && state.settings);
  $('resumeBtn').textContent = lt('back');
  $('returnCourseBtn').hidden = !(state.settings && isList(state.settings) && lastCourseSettings());
  $('menuTitle').textContent = t('menu');
  $('menuBtn').setAttribute('aria-label', t('menu'));
  $('closeMenuBtn').setAttribute('aria-label', t('closeMenu'));
  $('licensesLink').textContent = t('licenses');
  const guidesLink = $('guidesLink');
  guidesLink.href = `/${ul}/guides/`;
  guidesLink.textContent = {da:'Guides',en:'Guides',ru:'Руководства',uk:'Посібники',pl:'Poradniki',ro:'Ghiduri',lt:'Mokymosi gidai',bg:'Ръководства'}[ul];
  $('modeBtn').textContent = t('taskOptions');
  $('returnCourseBtn').textContent = lt('backToCourse');
  $('soundBtn').classList.toggle('off', !state.sound);
  for (const [id, key] of [['statsBtn', 'stats'], ['setupBtn', 'settings'], ['soundBtn', 'sound']]) {
    $(id).title = t(key);
    $(id).setAttribute('aria-label', t(key));
  }
  $('soundBtn').setAttribute('aria-pressed', String(state.sound));
  $('libraryBtn').textContent = t('libraryMenu');
  $('statsBtn').textContent = t('stats');
  $('setupBtn').textContent = t('settings');
  $('libraryBtn').title = t('libraryMenu');
  $('libraryBtn').setAttribute('aria-label', t('libraryMenu'));
  const catalogLink = $('catalogLink');
  if (catalogLink) {
    catalogLink.href = catalogueHref(ul,view==='setup'&&draft?.target&&draft?.base?draft:state.settings);
    catalogLink.textContent = COURSE_CATALOG.labels[ul].catalog;
  }
  renderIntro(ul);
  if (view === 'home') { renderHomeStart(); return; }
  if (view === 'library') { renderLibrary(); return; }
  if (inGame && (isList(state.settings || {}) || wordLibrary.data.favorites.length) && !dictionaryData) {
    $('app').innerHTML = `<p role="status">${esc(t('loading'))}</p>`;
    loadDictionary().then(render, () => { $('app').innerHTML = `<p>${esc(t('loadFail'))}</p>`; });
    return;
  }
  // Branchepakken hentes først, når den skal bruges.
  if (inGame && isPack(state.settings) && !PACK_ITEMS[state.settings.pack]) {
    $('app').innerHTML = `<p class="task-q">${esc(t('loading'))}</p>`;
    loadPack(state.settings.pack).then(render, () => {
      $('app').innerHTML = `<p class="task-q">${esc(t('loadFail'))}</p>`;
    });
    return;
  }
  if (inGame) updateScore();
  if (view === 'setup') renderSetup();
  else if (view === 'stats') renderStats();
  else if (view === 'offer') renderOffer();
  else if (view === 'place') renderPlace();
  else if (view === 'placeDone') renderPlaceDone();
  else renderPlay();
}

function updateScore(delta) {
  const c = ctx();
  $('scoreNum').textContent = scoreOf(c.prog);
  $('scoreLabel').textContent = isPack(c.s) || isList(c.s) ? t('learnedPack') : t('learned');
  const d = $('scoreDelta');
  d.className = 'score-delta';
  if (delta) {
    d.textContent = delta > 0 ? `+${delta}` : `${delta}`;
    d.className = `score-delta ${delta > 0 ? 'up' : 'down'}`;
  } else d.textContent = '';
}

// ----- Introduktion (statisk i index.html for søgemaskiner, oversat her) -----
const compactLanding = window.matchMedia?.('(max-width: 760px)');
if (compactLanding) {
  const updateLandingHelp = () => { $('how-it-works').open = !compactLanding.matches; };
  updateLandingHelp();
  compactLanding.addEventListener('change', updateLandingHelp);
}
function renderIntro(ul) {
  const intro = $('intro');
  if (!intro) return;
  intro.hidden = !(view === 'home' || (view === 'setup' && !state.settings && !selectedCourseLink && !draft?.target));
  document.body?.classList?.toggle('landing', !intro.hidden);
  const catalogueUrl=catalogueHref(ul);
  if (intro.hidden || intro.dataset.lang === ul && intro.dataset.catalogue === catalogueUrl) return;
  intro.dataset.lang = ul;
  intro.dataset.catalogue = catalogueUrl;
  const home = COURSE_CATALOG.home[ul];
  intro.querySelectorAll('.how li').forEach((li, i) => (li.innerHTML = `<span class="step-number" aria-hidden="true">${i+1}</span><span>${esc(home.steps[i])}</span>`));
  $('homeEyebrow').textContent = home.eyebrow;
  $('howTitle').textContent = home.howTitle;
  $('landingNav').innerHTML = `<a href="${esc(catalogueUrl+'#work')}">${esc(home.groupNames[0])}</a><a href="${esc(catalogueUrl+'#everyday')}">${esc(home.groupNames[1])}</a><a href="#app" data-get-started>${esc(t('setupTitle'))}</a>`;
  document.querySelectorAll('[data-get-started]').forEach((link) => link.onclick = (event) => { event.preventDefault(); $('app').scrollIntoView({ block: 'start' }); $('app').querySelector('[data-target]')?.focus({ preventScroll: true }); });
  const labels = COURSE_CATALOG.labels[ul];
  $('landingNav').setAttribute('aria-label', t('catsQ'));
  intro.querySelector('.jobs').setAttribute('aria-label', t('catsQ'));
  intro.querySelector('h1').textContent = labels.lead;
  intro.querySelector('.lead').textContent = labels.intro;
  intro.querySelector('.jobs').innerHTML = COURSE_CATALOG.groups.map((group) => COURSE_CATALOG.groupLink(group, ul, catalogueUrl)).join('');
}

// ----- Øvelsestyper -----
// Billed-mode har også "Hele forløbet", der skifter opgavetype efterhånden som man kan ordet.
const DIR_KEY = { path: 'path', rec: 'rec', prod: 'prod', write: 'write' };
function dirName(dir, pics) {
  return t(`${DIR_KEY[dir] || 'rec'}${pics && dir !== 'path' ? 'N' : ''}B`);
}
function dirSub(dir, pics, vars) {
  return t(`${DIR_KEY[dir] || 'rec'}${pics && dir !== 'path' ? 'N' : ''}S`, vars);
}

// ----- Setup -----
function practiceChoicesHTML(settings, prefix) {
  const selected = PracticeOptions.modes(settings);
  const pics = isPics(settings);
  const vars = { T: exerciseLanguage(settings.target), B: exerciseLanguage(settings.base) };
  return `<fieldset class="mode-fieldset"><legend>${esc(t('modeQ'))}</legend><p class="course-note">${esc(t('modesHint'))}</p><div class="choices">${PracticeOptions.allowed(settings).map((mode) => `<button type="button" class="choice" data-mode="${mode}" aria-pressed="${selected.includes(mode)}"><b>${esc(dirName(mode, pics))}</b><small>${esc(dirSub(mode, pics, vars))}</small></button>`).join('')}</div>${selected.length>1 ? `<p class="course-note">${esc(t("progressMixedHint"))}</p>` : ""}</fieldset><label class="repeat-option" for="${prefix}repeatLearned"><input type="checkbox" id="${prefix}repeatLearned"${settings.repeatLearned !== false ? ' checked' : ''}><span><b>${esc(t('repeatLearned'))}</b><small>${esc(t('repeatHint'))}</small></span></label>`;
}
function openTrainingOptions(settings, apply, options = {}) {
  let choices = PracticeOptions.apply(settings);
  const dialog = $('trainingDialog');
  dialog.innerHTML = `<form id="trainingForm"><h2 id="trainingTitle">${esc(t('taskOptions'))}</h2>${practiceChoicesHTML(choices, 'dialog-')}<div class="row actions"><button type="button" class="secondary" id="cancelTraining">${esc(t('cancel'))}</button><button class="primary">${esc(t(options.start ? 'start' : 'save'))}</button></div></form>`;
  dialog.querySelectorAll('[data-mode]').forEach((button) => button.onclick = () => {
    choices = PracticeOptions.toggle(choices, button.dataset.mode);
    dialog.querySelectorAll('[data-mode]').forEach((item) => item.setAttribute('aria-pressed', String(choices.modes.includes(item.dataset.mode))));
  });
  $('cancelTraining').onclick = () => dialog.close();
  $('trainingForm').onsubmit = (event) => { event.preventDefault(); choices.repeatLearned = $('dialog-repeatLearned').checked; dialog.close(); apply(PracticeOptions.apply(choices)); };
  dialog.showModal();
}
function modeTurn(settings) {
  const count = state.modeTurns?.[PracticeOptions.key(settings)];
  return Number.isSafeInteger(count) && count >= 0 ? count : 0;
}
function setModeTurn(settings, count) {
  if (!state.modeTurns || typeof state.modeTurns !== 'object' || Array.isArray(state.modeTurns)) state.modeTurns = {};
  state.modeTurns[PracticeOptions.key(settings)] = count;
}
function completeModeTurn(settings) {
  if (PracticeOptions.modes(settings).length > 1) setModeTurn(settings, modeTurn(settings) + 1);
}
function combinedCards(settings, pool) {
  const modes = PracticeOptions.modes(settings);
  const progress=modes.map(dir=>progressFor({...settings,dir},pool));
  return Object.fromEntries(pool.map((word) => {
    const seen=progress.every(prog=>Object.hasOwn(prog.cards,word.id));
    const known = progress.every(prog=>prog.cards[word.id]&&isLearned(prog.cards[word.id]));
    return [word.id, { seen, ok: known, lvl: known ? CONFIG.learnedLevel : 0 }];
  }));
}
function practiceProgress(settings,pool) {
  const modes=PracticeOptions.modes(settings);
  const progress=modes.map(dir=>progressFor({...settings,dir},pool));
  let learnedWords=0,completedModes=0;
  for(const word of pool){
    const completed=progress.filter(prog=>prog.cards[word.id]&&isLearned(prog.cards[word.id])).length;
    completedModes+=completed;
    if(completed===modes.length)learnedWords++;
  }
  const totalModes=pool.length*modes.length;
  return {learnedWords,completedModes,totalModes,percent:totalModes?100*completedModes/totalModes:0,mixed:modes.length>1};
}
function renderPracticeComplete(c) {
  $('app').innerHTML = `<section class="practice-complete"><h1>${esc(t('completeTitle'))}</h1><p>${esc(t('completeHint'))}</p><div class="row actions"><a class="primary cta" href="/${uiLang()}/">${esc(COURSE_CATALOG.labels[uiLang()].catalog)}</a><button class="secondary" id="enableReview">${esc(t('enableReview'))}</button>${isList(c.s) && lastCourseSettings() ? `<button class="secondary" id="completeReturn">${esc(lt('backToCourse'))}</button>` : ''}</div></section>`;
  $('enableReview').onclick = () => { state.settings.repeatLearned = true; saveState(); current = null; renderPlay(); };
  if ($('completeReturn')) $('completeReturn').onclick = returnToCourse;
}
function renderPracticeWait(c, at) {
  const date = new Date(at).toLocaleString(uiLang(), { dateStyle: 'medium', timeStyle: 'short' });
  $('app').innerHTML = `<section class="practice-complete"><h1>${esc(t('readyTitle'))}</h1><p>${esc(t('readyHint'))}</p><p role="status">${esc(t('nextReview'))}: ${esc(date)}</p><div class="row actions"><a class="primary cta" href="/${uiLang()}/">${esc(COURSE_CATALOG.labels[uiLang()].catalog)}</a><button class="secondary" id="checkPractice">${esc(t('checkAgain'))}</button>${isList(c.s) && lastCourseSettings() ? `<button class="secondary" id="waitReturn">${esc(lt('backToCourse'))}</button>` : ''}</div></section>`;
  $('checkPractice').onclick = () => { current = null; renderPlay(); };
  if ($('waitReturn')) $('waitReturn').onclick = returnToCourse;
  saveState();
  clearTimeout(timer);
  // One asynchronous wake-up, capped below the browser's 32-bit timer limit.
  timer = setTimeout(() => { if (view === 'play' && !current) renderPlay(); }, Math.min(2147483000, Math.max(1000, at - Date.now())));
}
function languageName(lang, name) {
  const flags = {
    da: '<path fill="#c8102e" d="M0 0h30v20H0z"/><path stroke="#fff" stroke-width="3" d="M10 0v20M0 10h30"/>',
    en: '<path fill="#012169" d="M0 0h30v20H0z"/><path stroke="#fff" stroke-width="5" d="m0 0 30 20m0-20L0 20"/><path stroke="#c8102e" stroke-width="2" d="m0 0 30 20m0-20L0 20"/><path stroke="#fff" stroke-width="7" d="M15 0v20M0 10h30"/><path stroke="#c8102e" stroke-width="4" d="M15 0v20M0 10h30"/>',
    ru: '<path fill="#fff" d="M0 0h30v20H0z"/><path fill="#0039a6" d="M0 6.67h30v6.67H0z"/><path fill="#d52b1e" d="M0 13.33h30V20H0z"/>',
    uk: '<path fill="#0057b7" d="M0 0h30v10H0z"/><path fill="#ffd700" d="M0 10h30v10H0z"/>',
    pl: '<path fill="#fff" d="M0 0h30v10H0z"/><path fill="#dc143c" d="M0 10h30v10H0z"/>',
    ro: '<path fill="#002b7f" d="M0 0h10v20H0z"/><path fill="#fcd116" d="M10 0h10v20H10z"/><path fill="#ce1126" d="M20 0h10v20H20z"/>',
    lt: '<path fill="#fdb913" d="M0 0h30v6.67H0z"/><path fill="#006a44" d="M0 6.67h30v6.66H0z"/><path fill="#c1272d" d="M0 13.33h30V20H0z"/>',
    bg: '<path fill="#fff" d="M0 0h30v6.67H0z"/><path fill="#00966e" d="M0 6.67h30v6.66H0z"/><path fill="#d62612" d="M0 13.33h30V20H0z"/>',
  };
  return `<svg class="language-flag" viewBox="0 0 30 20" aria-hidden="true" focusable="false">${flags[lang] || ''}</svg><span>${esc(name)}</span>`;
}

function renderHomeStart() {
  const L = UI[uiLang()].lang;
  const shortQuestion = { da:'Vælg sprog',en:'Choose a language',ru:'Выберите язык',uk:'Виберіть мову',pl:'Wybierz język',ro:'Alege o limbă',lt:'Pasirink kalbą',bg:'Избери език' }[uiLang()];
  $('app').innerHTML = `<section class="setup"><p class="setup-kicker">${esc(t('setupTitle'))}</p><div class="step"><h2><span class="home-language-full">${esc(t('learnQ'))}</span><span class="home-language-short">${esc(shortQuestion)}</span></h2><div class="choices">${Object.keys(ORDER).map((lang) => `<button class="choice" data-target="${lang}"><b>${esc(LANGS[lang].name || L[lang])}</b></button>`).join('')}</div></div></section>`;
  $('app').querySelectorAll('[data-target]').forEach((button) => button.onclick = () => {
    selectedCourseLink = false;
    draft = { target: button.dataset.target, base: null, pack: TOP, dir: 'rec', diff: 1, cats: null };
    go('setup', { keepDraft: true });
  });
}
function renderSetup() {
  if (!draft) draft = state.settings ? { pack: TOP, ...state.settings } : { target: null, base: null, pack: TOP, dir: 'rec', diff: 1 };
  Object.assign(draft, PracticeOptions.apply(draft));
  const d = draft;
  const ul = uiLang();
  const L = UI[ul].lang;
  const targets = Object.keys(ORDER);
  const choice = (attrs, pressed, title, sub) =>
    `<button class="choice" ${attrs} aria-pressed="${pressed}"><b>${title}</b>${sub ? `<small>${esc(sub)}</small>` : ''}</button>`;

  const welcome = !state.settings && !selectedCourseLink && !d.target;
  let html = `<section class="setup">${welcome ? `<p class="setup-kicker">${esc(t('setupTitle'))}</p>` : `<div class="setup-heading"><h1>${esc(t(state.settings ? 'settings' : 'setupTitle'))}</h1>${state.settings ? `<button class="setup-cancel" id="cancelBtn">${esc(t('cancel'))}</button>` : ''}</div>`}`;
  if (d.target) html += `<details class="setup-selection"><summary><span>${esc(t('learnQ'))}</span><b>${esc(LANGS[d.target].name)}</b></summary>`;
  html += `<div class="step"><h2>${esc(t('learnQ'))}</h2><div class="choices language-choices">`;
  for (const l of targets) html += choice(`data-target="${l}"`, d.target === l, languageName(l, LANGS[l].name));
  html += `</div></div>`;
  if (d.target) html += '</details>';

  if (d.target) {
    if (d.base) html += `<details class="setup-selection"><summary><span>${esc(t('baseQ'))}</span><b>${esc(L[d.base])}</b></summary>`;
    html += `<div class="step"><h2>${esc(t('baseQ'))}</h2><div class="choices language-choices">`;
    const nPics = buildPool({ ...d, base: d.target, pack: TOP, diff: 3 }).length;
    if (nPics >= 8) html += choice(`data-base="${d.target}"`, d.base === d.target, languageName(d.target, L[d.target]));
    else html += `<button class="choice" disabled aria-pressed="false"><b>${languageName(d.target, L[d.target])}</b></button>`;
    for (const l of Object.keys(LANGS).filter((l) => l !== d.target)) html += choice(`data-base="${l}"`, d.base === l, languageName(l, L[l]));
    html += `</div></div>`;
    if (d.base) html += '</details>';
  }

  if (d.target && d.base) {
    const native = d.base === d.target;
    if (native) d.pack = TOP;
    if (d.pack === TOP && !countPool(d) && !native) d.pack = 'essentials';
    const nPicWords = buildPool({ ...d, base: d.target, pack: TOP, diff: 3 }).length;
    if (d.pack === PICS && nPicWords < 8) d.pack = TOP;
    const pics = isPics(d);
    if (!native) {
      const selectedPack = PACK_LIST.find((p) => p.id === d.pack);
      const selectedName = isList(d) ? libraryTitle(d.pack.slice(5)) : selectedPack ? selectedPack.name[ul] : d.pack === PICS ? t('picsB') : t('topB');
      html += `<div class="step course-picker"><h2><label for="courseSelect">${esc(t('whatQ'))}</label></h2><div class="course-select-wrap"><select id="courseSelect">`;
      if (isList(d)) html += `<option value="${esc(d.pack)}" selected>${esc(selectedName)}</option>`;
      const courseOption = (id, name) => `<option value="${id}"${d.pack === id ? ' selected' : ''}>${esc(name)}</option>`;
      for (const group of COURSE_CATALOG.groups) {
        html += `<optgroup label="${esc(group.name[ul])}">`;
        for (const id of group.packs) {
          if (id === TOP) { if (countPool({ ...d, pack: TOP })) html += courseOption(TOP, t('topB')); }
          else if (id === PICS) {
            if (nPicWords >= 8) html += courseOption(PICS, t('picsB'));
          } else {
            const p = PACK_LIST.find((pack) => pack.id === id);
            if (p) html += courseOption(p.id, p.name[ul]);
          }
        }
        html += '</optgroup>';
      }
      html += '</select></div></div>';
    }
    const pack = isPack(d) ? packOf(d) : null;
    if (pack) {
      const home = COURSE_CATALOG.home[ul];
      const selected = pack.categories.filter((cat) => !d.cats || d.cats.includes(cat.key)).length;
      const summary = selected === pack.categories.length ? `${home.allTopics} · ${selected}` : selected ? fill(home.selectedTopics, { n: selected, total: pack.categories.length }) : home.pickTopics;
      html += `<div class="step"><h2>${esc(t('catsQ'))}</h2><details class="topic-picker" id="topicPicker"><summary>${esc(summary)}</summary><div class="topic-panel" id="topicPanel"><p class="course-note">${esc(home.topicsHint)}</p><div class="topic-tools"><button type="button" class="secondary" id="selectAllTopics">${esc(home.selectAll)}</button><button type="button" class="secondary" id="clearTopics">${esc(home.selectNone)}</button></div><fieldset class="topic-checks"><legend class="sr-only">${esc(t('catsQ'))}</legend>`;
      for (const cat of pack.categories) {
        const on = !d.cats || d.cats.includes(cat.key);
        const n = cat.n.slice(1, d.diff + 1).reduce((a, b) => a + b, 0);
        html += `<label for="topic-${esc(cat.key)}"><input type="checkbox" data-cat="${esc(cat.key)}" id="topic-${esc(cat.key)}"${on ? ' checked' : ''}><span>${esc(cat.name[ul])}</span><small>${n}</small></label>`;
      }
      html += `</fieldset><button class="primary" type="button" id="closeTopics">${esc(home.done)}</button></div></details></div>`;
    }

    const optionTitles = { da: 'Sværhedsgrad og opgaver', en: 'Difficulty and tasks', ru: 'Сложность и задания', uk: 'Складність і завдання', ...Object.fromEntries(Object.entries(EXTRA_LOCALES).map(([lang,locale])=>[lang,locale.setupOptions])) };
    html += `<details class="setup-options" id="setupOptions"><summary><b>${esc(optionTitles[ul])}</b><small>${esc(t(pack ? 'packDiff' : 'diff')[d.diff])} · ${esc(PracticeOptions.modes(d).map(mode => dirName(mode, pics)).join(', '))}</small></summary><section class="step" id="practiceOptions">${practiceChoicesHTML(d, 'setup-')}</section>`;

    html += `<div class="step"><h2>${esc(t('diffQ'))}</h2><div class="choices">`;
    for (const lvl of [1, 2, 3]) {
      const n = countPool({ ...d, diff: lvl });
      html += choice(`data-diff="${lvl}"`, d.diff === lvl, esc((pack ? t('packDiff') : t('diff'))[lvl]), pack ? String(n) : t('nWords', { n }));
    }
    html += `</div></div>`;
    html += '</details>';

    const progress = state.progress[progKey(d)];
    const canTest = !native && PracticeOptions.modes(d).length === 1 && countPool(d) >= 30 && !Object.keys(progress?.cards || {}).length;
    html += `<div class="row actions setup-actions">
      <button class="primary" id="startBtn" ${countPool(d) ? '' : 'disabled'}>${esc(t(state.settings ? 'save' : canTest ? 'placeSkip' : 'start'))}</button>
      ${canTest ? `<button class="secondary" id="setupTestBtn">${esc(t('placeStart'))}</button>` : ''}
    </div>`;
  }
  html += `</section>`;
  $('app').innerHTML = html;

  const on = (sel, fn) => $('app').querySelectorAll(sel).forEach((b) => (b.onclick = () => {
    fn(b); render();
    if (sel === '[data-mode]' || sel === '[data-diff]') $('setupOptions').open = true;
    if (sel === '[data-base]' || sel === '[data-pack]') window.scrollTo(0, 0);
  }));
  on('[data-target]', (b) => { if (d.target !== b.dataset.target) { d.target = b.dataset.target; d.base = null; } });
  // Each course/language pair restores its own choices; a new scope starts gently.
  on('[data-base]', (b) => {
    if (d.base === b.dataset.base) return;
    d.base = b.dataset.base;
    if (d.base === d.target) d.pack = TOP;
    const saved = CoursePreferences.resolve(state, d);
    if (saved) Object.assign(d, saved, { modes: PracticeOptions.modes(saved), repeatLearned: saved.repeatLearned !== false });
  });
  if ($('courseSelect')) $('courseSelect').onchange = () => {
    const pack = $('courseSelect').value;
    if (d.pack === pack) return;
    const saved = CoursePreferences.resolve(state, { ...d, pack });
    if (saved) Object.assign(d, saved, { modes: PracticeOptions.modes(saved), repeatLearned: saved.repeatLearned !== false });
    render(); window.scrollTo(0, 0); $('courseSelect').focus({ preventScroll: true });
  };
  on('[data-mode]', (b) => Object.assign(d, PracticeOptions.toggle(d, b.dataset.mode)));
  if ($('setup-repeatLearned')) $('setup-repeatLearned').onchange = () => { d.repeatLearned = $('setup-repeatLearned').checked; };
  on('[data-diff]', (b) => { d.diff = Number(b.dataset.diff); });
  const refreshTopics = (change, focusId) => {
    const scroll = $('topicPanel').scrollTop;
    change(); render();
    $('topicPicker').open = true; $('topicPanel').scrollTop = scroll;
    if (focusId) $(focusId).focus({ preventScroll: true });
  };
  $('app').querySelectorAll('[data-cat]').forEach((b) => b.onchange = () => refreshTopics(() => {
    const all = packOf(d).categories.map((c) => c.key);
    const cur = new Set(d.cats || all);
    if (cur.has(b.dataset.cat)) cur.delete(b.dataset.cat); else cur.add(b.dataset.cat);
    d.cats = cur.size === all.length ? null : all.filter((k) => cur.has(k));
  }, b.id));
  if ($('selectAllTopics')) $('selectAllTopics').onclick = () => refreshTopics(() => { d.cats = null; }, 'selectAllTopics');
  if ($('clearTopics')) $('clearTopics').onclick = () => refreshTopics(() => { d.cats = []; }, 'clearTopics');
  if ($('closeTopics')) $('closeTopics').onclick = () => { $('topicPicker').open = false; $('topicPicker').querySelector('summary').focus(); };
  const cancel = $('cancelBtn');
  if (cancel) cancel.onclick = () => { draft = null; go('play'); };
  const startPractice = ({ test = false } = {}) => {
    state.settings = PracticeOptions.apply(d);
    state.uiLang = d.base;
    saveState();
    draft = null;
    current = null;
    placement = null;
    pendingPlacement = test;
    for (const dir of PracticeOptions.modes(state.settings)) ctx({ ...state.settings, dir }).prog.offered = true;
    saveState();
    if (/^#start=/.test(location.hash)) history.replaceState(null, '', location.pathname + location.search);
    go('play');
  };
  if ($('startBtn')) $('startBtn').onclick = startPractice;
  if ($('setupTestBtn')) $('setupTestBtn').onclick = () => startPractice({ test: true });
}

// ----- Play -----
function renderPlay() {
  if (current) { renderPlayView(); return; }
  const modes = PracticeOptions.modes(state.settings);
  const start = modeTurn(state.settings);
  state.settings.dir = modes[start % modes.length];
  let c = ctx();
  if (pendingPlacement) { pendingPlacement = false; startPlacement(); return; }
  if (!isList(c.s)) {
    const from = c.s.diff;
    let next;
    while ((next = LearningFlow.nextDifficulty(c.s.diff, c.pool, combinedCards(c.s, c.pool), (diff) => buildPool({ ...c.s, diff }), isLearned))) {
      c.s.diff = next.diff; c = ctx();
    }
    if (c.s.diff !== from) {
      const labels = t(isPack(c.s) ? 'packDiff' : 'diff');
      levelNotice = { key: c.key, diff: c.s.diff, task: c.prog.task, text: t('levelAdvanced', { from: labels[from], to: labels[c.s.diff] }) };
      saveState(); updateScore();
    }
  }
  if (modes.length === 1 && !c.native && !c.prog.offered && !Object.keys(c.prog.cards).length && c.pool.length >= 30) {
    view = 'offer'; renderOffer(); return;
  }
  let next = null;
  for (let offset = 0; offset < modes.length; offset++) {
    state.settings.dir = modes[(start + offset) % modes.length]; c = ctx();
    next = pickNext(c);
    if (next) { if (offset) setModeTurn(c.s, start + offset); break; }
  }
  if (!next) {
    if (c.pool.length) {
      const now = Date.now(), session = MemoryScheduler.session(state, c.s, now);
      const at = Math.min(...modes.map(dir => { const candidate = ctx({ ...c.s, dir }); return LearningFlow.nextAt(candidate.pool, candidate.prog, isLearned, now, { repeatLearned: c.s.repeatLearned !== false, session }); }));
      if (Number.isFinite(at)) renderPracticeWait(c, at); else renderPracticeComplete(c);
    }
    else { $('app').innerHTML = `<p class="task-q" role="status">${esc(t('empty'))}</p><button class="secondary" id="emptySetup">${esc(t('settings'))}</button>`; $('emptySetup').onclick = () => go('setup'); }
    return;
  }
    current = { ...next, answered: null };
    if (next.kind === 'quiz' || next.kind === 'new') current.options = makeOptions(c, next.concept, next.qdir);
    if (next.kind === 'build') {
      current.spec = buildSpec(c, next.concept);
      current.tiles = makeTiles(c, next.concept, current.spec);
      current.picked = [];
    }
    if (next.kind === 'write') startWrite(c, next.concept);
    renderPlayView();
    // Højt: nye ord, ord man skal forstå (ikke for børn, der skal læse selv), og ord der skal skrives ud fra et billede.
    if (next.kind === 'intro' || (next.qdir === 'rec' && next.kind !== 'write' && !c.native) || (next.kind === 'write' && c.pics)) speakTarget(next.concept);

}

function wordParts(x,language) {
  return WordEntry.parts(x,language);
}
function lexicalForm(x,language) { return wordParts(x,language).text; }
function wordHTML(x,language) {
  const parts=wordParts(x,language);
  return `<span class="w${x.phrase || parts.text.length>22 ? ' long' : ''}" lang="${language}">${esc(parts.text)}</span>`;
}
function meaningHTML(c, x) {
  if (c.pics) return picHTML(x);
  return wordHTML(x,c.s.base);
}
const picHTML = (x, cls = 'pic') => `<img class="${cls}" src="images/words/${encodeURI(IMG[x.id] || '')}" alt="" draggable="false" decoding="async">`;
const targetHTML = (c, x) => wordHTML(x,c.s.target);

function questionText(c, x, kind) {
  const T = exerciseLanguage(c.s.target);
  if (kind === 'build') return t('qBuild', { T });
  if (kind === 'write') return c.pics ? t('qWriteN') : t('qWrite', { T });
  const rec = current.qdir === 'rec';
  if (c.pics) return rec ? t('qRecN') : t('qProdN');
  if (x.phrase) return rec ? t('qRecP') : t('qProdP', { T });
  return rec ? t('qRec') : t('qProd', { T });
}

function metaHTML(c, x) {
  const progress=practiceProgress(c.s,c.pool);
  const score=progress.learnedWords;
  void x;
  const course = isList(c.s) ? libraryTitle(c.s.pack.slice(5)) : isPack(c.s) ? packOf(c.s).name[uiLang()] : t(isPics(c.s) ? 'picsB' : 'topB');
  const difficulty = isList(c.s) ? '' : t(isPack(c.s) ? 'packDiff' : 'diff')[c.s.diff];
  const label=t('progress', { n: score, m: c.pool.length });
  const hint=progress.mixed?t('progressMixedHint'):'';
  return `<div class="meta course-meta"><span class="course-name" title="${esc(course)}">${esc(course)}</span><span class="course-difficulty">${esc(difficulty)}</span><span class="course-progress"${hint?` title="${esc(hint)}"`:''}>${esc(label)}</span>
    </div>
    <div class="progress" role="progressbar" aria-label="${esc(t('progressLabel'))}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${+progress.percent.toFixed(1)}" aria-valuetext="${esc(label+(hint?' '+hint:''))}"><div style="width:${progress.percent}%"></div></div>`;
}

// Fit text inside fixed exercise slots without moving the following controls.
let practiceReadingCache = null;
function practiceReadingClass(c) {
  if (c.pics) return '';
  const source = isPack(c.s) ? PACK_ITEMS[c.s.pack] || [] : ITEM;
  const key = JSON.stringify([c.s.pack,c.s.target,c.s.base,c.s.cats || null,
    isList(c.s) ? c.pool.map(x=>[x.id,x.words[c.s.target],x.words[c.s.base]]) : null]);
  if (practiceReadingCache?.key === key && practiceReadingCache.source === source) return practiceReadingCache.value;
  // Plan for the whole chosen topic, including later levels, rather than the current question.
  const scope = isList(c.s) ? c.pool : buildPool({...c.s,diff:3});
  const types = new Set(scope.map(x=>x.phrase));
  const candidates = isPack(c.s) ? source.filter(x=>types.has(x.phrase)) : scope;
  let longest = 0;
  for (const item of candidates) for (const lang of [c.s.target,c.s.base]) {
    if (item.words[lang]) longest = Math.max(longest,lexicalForm(item,lang).length);
  }
  // A saved phrase can draw wrong choices from the shared dictionary.
  if (isList(c.s) && types.has(true)) longest = Math.max(longest,131);
  const value = longest > 130 ? ' reading-long' : longest > 80 ? ' reading-room' : longest > 35 && types.has(true) ? ' reading-space' : '';
  practiceReadingCache = {key,source,value};
  return value;
}

function fitAnswerText() {
  for (const prompt of $('app').querySelectorAll('.prompt, .revealed-meaning')) {
    const labels = [...prompt.querySelectorAll(':scope > .w, :scope > .sub')];
    labels.forEach(label => label.style.removeProperty('font-size'));
    if (!labels.length) continue;
    const style = getComputedStyle(prompt);
    const room = prompt.clientHeight - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom);
    const picture = prompt.querySelector(':scope > .pic');
    const fits = () => labels.every(label => label.scrollWidth <= label.clientWidth + 1)
      && labels.reduce((height, label) => height + label.getBoundingClientRect().height, 0)
        + (picture ? picture.getBoundingClientRect().height : 0)
        + parseFloat(style.gap) * (labels.length - (picture ? 0 : 1)) <= room + 1;
    const original = labels.map(label => parseFloat(getComputedStyle(label).fontSize));
    for (let scale = 1; !fits() && scale > 0.15; scale -= 0.025) {
      labels.forEach((label, i) => { label.style.fontSize = `${original[i] * scale}px`; });
    }
  }
  const groups = $('app').querySelectorAll('.options:not(.pics)');
  for (const group of groups) {
    const labels = [...group.querySelectorAll('.opt .w')];
    labels.forEach(label => label.style.removeProperty('font-size'));
    const fits = () => labels.every(label => {
      const button = label.closest('.opt');
      const buttonStyle = getComputedStyle(button);
      const key = button.querySelector('.key');
      const horizontal = buttonStyle.flexDirection === 'row';
      const available = button.clientHeight - parseFloat(buttonStyle.paddingTop) - parseFloat(buttonStyle.paddingBottom)
        - (!horizontal && key ? key.getBoundingClientRect().height + parseFloat(buttonStyle.gap) : 0);
      return label.scrollWidth <= label.clientWidth + 1 && label.getBoundingClientRect().height <= available + 1;
    });
    let size = Math.min(22, ...labels.map(label => parseFloat(getComputedStyle(label).fontSize)));
    labels.forEach(label => { label.style.fontSize = `${size}px`; });
    while (!fits() && size > 8) {
      size -= 0.5;
      labels.forEach(label => { label.style.fontSize = `${size}px`; });
    }
  }
}
window.addEventListener('resize', fitAnswerText);
if (document.fonts) document.fonts.ready.then(fitAnswerText);

function optionsHTML(c, x, answered) {
  const rec = current.qdir === 'rec';
  let html = `<div class="options${rec && c.pics ? ' pics' : ''}">`;
  current.options.forEach((o, i) => {
    let cls = 'opt';
    if (answered) {
      if (o.id === x.id) cls += ' good';
      else if (o.id === answered) cls += ' bad';
      else cls += ' dim';
    }
    html += `<button class="${cls}" data-i="${i}" ${answered ? 'disabled' : ''}>
      ${rec ? meaningHTML(c, o) : targetHTML(c, o)}
      <span class="key">${i + 1}</span></button>`;
  });
  return html + `</div>`;
}

const SPEAK_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4 6 8H3v8h3l5 4Z"/><path d="M15 8a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14"/></svg>';

// ----- Skriv ordet -----
function startWrite(c, x) {
  const spec = writeSpec(c, x);
  const { keys, cols } = makeKeys(c, spec);
  Object.assign(current, { spec, keys, cols, pos: nextSlot(spec, 0), mistakes: 0, misses: 0, wrongKeys: [], shake: null, hintKey: null });
}
function writeHTML(c, x) {
  const w = current;
  const mixed = PracticeOptions.modes(c.s).length > 1 || PracticeOptions.modes(c.s).includes('path');
  const keyCols = Math.max(2, Math.ceil(w.keys.length / 3));
  const sp = w.spec;
  const done = !!w.answered;
  const n = sp.chars.length + (sp.prefix ? sp.prefix.length + 1 : 0);
  const slots = sp.chars.map((ch, i) => {
    if (!isLetter(ch)) return `<span class="slot fixed">${esc(ch)}</span>`;
    if (i < w.pos || done) return `<span class="slot filled${i === w.just && !done ? ' just' : ''}">${esc(ch)}</span>`;
    return `<span class="slot${i === w.pos ? ' cur' : ''}"></span>`;
  }).join('');
  const state2 = done ? (w.answered === 'ok' ? ' good' : ' almost') : '';
  const keys = w.keys.map((k) => {
    let cls = 'kb';
    if (!done && w.wrongKeys.includes(k)) cls += ' bad';
    if (!done && w.shake === k) cls += ' shake';
    if (!done && w.hintKey === k) cls += ' hint';
    return `<button class="${cls}" data-key="${esc(k)}" ${done ? 'disabled' : ''} lang="${c.s.target}">${esc(k)}</button>`;
  }).join('');
  let html = `<p class="task-q">${esc(questionText(c, x, 'write'))}</p>
    <div class="slots${state2}" style="--n:${n}" lang="${c.s.target}" aria-label="${esc(done ? lexicalForm(x,c.s.target) : '')}">
      ${sp.prefix ? `<span class="prefix">${esc(sp.prefix)}</span>` : ''}${slots}</div>
    ${done && !mixed ? '' : `<div class="keys" style="--cols:${keyCols}">${keys}</div>`}
    <div class="feedback" aria-live="polite">`;
  if (done) {
    html += w.answered === 'ok' ? `<div class="msg good">${esc(t('correct'))}</div>`
      : `<div class="msg almost">${esc(t('almost'))}</div><button class="primary" id="nextBtn">${esc(t('next'))}</button>`;
  } else if (w.isNew) {
    html += `<button class="secondary" id="dkBtn">${esc(t('dontKnow'))}</button>`;
  } else {
    html += `<button class="secondary" id="hintBtn" ${w.hintKey ? 'disabled' : ''}>${esc(t('hint'))}</button>`;
  }
  return html + `</div>`;
}
function pressKey(k) {
  const w = current;
  if (!w || w.kind !== 'write' || w.answered) return;
  const expected = w.spec.chars[w.pos].toLowerCase();
  if (k === expected) {
    w.just = w.pos;
    w.pos = nextSlot(w.spec, w.pos + 1);
    Object.assign(w, { misses: 0, wrongKeys: [], shake: null, hintKey: null });
    if (w.pos >= w.spec.chars.length) { finishWrite(); return; }
  } else {
    if (w.wrongKeys.includes(k)) return;
    w.wrongKeys.push(k);
    w.shake = k;
    w.just = -1;
    w.mistakes++;
    w.misses++;
    // Efter to forkerte på samme plads viser vi det rigtige bogstav.
    if (w.misses >= 2) w.hintKey = expected;
  }
  renderPlayView();
}
function writeHint() {
  const w = current;
  if (!w || w.kind !== 'write' || w.answered || w.hintKey) return;
  w.hintKey = w.spec.chars[w.pos].toLowerCase();
  w.mistakes++;
  w.shake = null;
  w.just = -1;
  renderPlayView();
}
function finishWrite() {
  const c = ctx();
  const x = current.concept;
  const correct = current.mistakes === 0;
  const before = scoreOf(c.prog);
  if (current.isNew) {
    c.prog.cards[x.id] = correct ? newCard(c, CONFIG.knownStartLevel, true, { verify: true }) : newCard(c, 0, false);
  } else {
    grade(c, x, correct);
  }
  current.answered = correct ? 'ok' : 'almost';
  finishTask(c, x, before);
  if (correct) advance();
}

function feedbackReceiptHTML(c) {
  if (c && levelNotice?.key === c.key && levelNotice.diff === c.s.diff && c.prog.task - levelNotice.task < 3) return `<div class="answer-receipt level-notice" role="status" title="${esc(levelNotice.text)}">${esc(levelNotice.text)}</div>`;
  return lastFeedback ? `<div class="answer-receipt" role="status" aria-live="polite">✓ ${esc(t('correct'))} · <span lang="${lastFeedback.lang}">${esc(lastFeedback.word)}</span></div>` : '<div class="answer-receipt" aria-hidden="true"></div>';
}

function renderPlayView() {
  const c = ctx();
  const x = current.concept;
  const rec = current.qdir === 'rec';
  const speakBtn = `<button class="speak" id="speakBtn" aria-label="${esc(lt('listen'))}">${SPEAK_SVG}</button>`;
  let html = metaHTML(c, x) + feedbackReceiptHTML(c);

  if (current.kind === 'intro') {
    html += `<div class="prompt${c.pics ? ' pics' : ''}">${promptActionsHTML(x, speakBtn)}
      ${c.pics ? picHTML(x) : ''}
      ${targetHTML(c, x)}
    </div>
    ${c.pics ? '' : `<div class="revealed-meaning" lang="${c.s.base}"><span class="sub">${esc(lexicalForm(x,c.s.base))}</span></div>`}
    <div class="feedback" aria-live="polite"><button class="primary" id="nextBtn">${esc(t('next'))}</button></div>`;
  } else if (current.kind === 'write') {
    // Børn hører ordet (højttaler); ved oversættelse vises betydningen.
    html += `<div class="prompt write${c.pics ? ' pics' : ''}">${promptActionsHTML(x, c.pics || current.answered ? speakBtn : '')}
      ${meaningHTML(c, x)}
    </div>${writeHTML(c, x)}`;
  } else if (current.kind === 'build') {
    const sp = current.spec;
    const built = current.picked.map((i) => current.tiles[i].tk);
    html += `<div class="prompt${c.pics ? ' pics' : ''}">${promptActionsHTML(x)}
      ${meaningHTML(c, x)}
    </div>
    <p class="task-q">${esc(questionText(c, x, 'build'))}</p>
    <div class="build ${current.answered ? (current.answered === 'ok' ? 'good' : 'bad') : ''}">
      ${sp.prefix ? `<span class="prefix">${esc(sp.prefix)}</span>` : ''}
      <span class="built ${sp.mode}">${built.map((tk, k) => `<button class="tile in" data-k="${k}" ${current.answered ? 'disabled' : ''}>${esc(tk)}</button>`).join('')}</span>
    </div>
    <div class="tiles ${sp.mode}">${current.tiles.map((tl, i) => `<button class="tile" data-i="${i}" ${current.picked.includes(i) || current.answered ? 'disabled' : ''}>${esc(tl.tk)}</button>`).join('')}</div>
    <div class="feedback" aria-live="polite">`;
    if (current.answered) {
      const ok = current.answered === 'ok';
      html += ok ? `<div class="msg good">${esc(t('correct'))}</div>`
        : `<div class="msg bad">${esc(t('wrongBuild'))} <b>${esc(lexicalForm(x,c.s.target))}</b></div><button class="primary" id="nextBtn">${esc(t('next'))}</button>`;
    } else {
      html += `<div class="row center"><button class="secondary" id="dkBtn">${esc(t('dontKnow'))}</button>
        <button class="primary" id="checkBtn" ${current.picked.length ? '' : 'disabled'}>${esc(t('checkBtn'))}</button></div>`;
    }
    html += `</div>`;
  } else {
    html += `<div class="prompt${c.pics && !rec ? ' pics' : ''}">${promptActionsHTML(x, speakBtn)}
      ${rec ? targetHTML(c, x) : meaningHTML(c, x)}
    </div>
    <p class="task-q">${esc(questionText(c, x, current.kind))}</p>
    ${optionsHTML(c, x, current.answered)}
    <div class="feedback" aria-live="polite">`;
    if (current.answered) {
      const ok = current.answered === x.id;
      html += `<div class="msg ${ok ? 'good' : 'bad'}">${esc(ok ? t('correct') : t('wrong'))}</div>`;
      if (!ok) html += `<button class="primary" id="nextBtn">${esc(t('next'))}</button>`;
    } else if (current.kind === 'new') {
      html += `<button class="secondary" id="dkBtn">${esc(t('dontKnow'))}</button>`;
    }
    html += `</div>`;
  }
  $('app').innerHTML = `<div class="practice-stage${c.pics ? ' has-pictures' : ''}${practiceReadingClass(c)}">${html}</div>`;
  bindWordSave(x);
  fitAnswerText();

  const sb = $('speakBtn');
  if (sb) sb.onclick = () => speakTarget(x, true);
  const nextBtn = $('nextBtn');
  if (nextBtn) nextBtn.onclick = advance;
  const dk = $('dkBtn');
  if (dk) dk.onclick = dontKnow;
  const cb = $('checkBtn');
  if (cb) cb.onclick = checkBuild;
  const hb = $('hintBtn');
  if (hb) hb.onclick = writeHint;
  $('app').querySelectorAll('.opt').forEach((b) => (b.onclick = () => choose(Number(b.dataset.i))));
  $('app').querySelectorAll('.kb').forEach((b) => (b.onclick = () => pressKey(b.dataset.key)));
  $('app').querySelectorAll('.tiles .tile').forEach((b) => (b.onclick = () => { current.picked.push(Number(b.dataset.i)); renderPlayView(); }));
  $('app').querySelectorAll('.built .tile').forEach((b) => (b.onclick = () => { current.picked.splice(Number(b.dataset.k), 1); renderPlayView(); }));
}

// Registrér et svar på en kendt kortet og opdatér niveau.
function grade(c, x, correct) {
  const card = c.prog.cards[x.id];
  MemoryScheduler.ensure(card, Date.now());
  if (card.verify) {
    card.lvl = correct ? card.lvl + 1 : 0;
    card.verify = false;
  } else {
    card.lvl = correct ? card.lvl + 1 : Math.max(0, card.lvl - 1);
  }
  card.ok = correct;
  card[correct ? 'right' : 'wrong'] += 1;
  card.task = c.prog.task;
  card.time = Date.now();
}
function finishTask(c, x, before) {
  c.prog.task += 1;
  completeModeTurn(c.s);
  const correct = current.answered === x.id || current.answered === 'ok';
  const now = Date.now();
  MemoryScheduler.review(c.prog.cards[x.id], correct, now, { word: x, learned: isLearned(c.prog.cards[x.id]), evidence: current.kind === 'write' ? 2 : current.kind === 'build' ? 3 : 1, rng: Math.random });
  if(typeof CourseKnowledge!=='undefined')CourseKnowledge.mark(c.prog.cards[x.id],x.id);
  MemoryScheduler.record(MemoryScheduler.session(state, c.s, now), x.id, now);
  if (current.maintenance) c.prog.lastLearnedReviewTask = c.prog.task;
  c.prog.lastId = x.id;
  saveState();
  lastFeedback = correct ? { id: x.id, word: lexicalForm(x,c.s.target), meaning: c.pics ? '' : x.words[c.s.base], lang: c.s.target } : null;
  renderPlayView();
  updateScore(scoreOf(c.prog) - before);
  if (!correct) speakTarget(x);
}

function choose(i) {
  if (!current || current.answered) return;
  if (view === 'place') { choosePlace(i); return; }
  if (current.kind !== 'quiz' && current.kind !== 'new') return;
  const c = ctx();
  const x = current.concept;
  const correct = current.options[i].id === x.id;
  const before = scoreOf(c.prog);
  if (current.kind === 'new') {
    // Kendte man ordet uden at have set det, springes de første trin over.
    c.prog.cards[x.id] = correct
      ? newCard(c, CONFIG.knownStartLevel, true, { verify: true })
      : newCard(c, 0, false);
  } else {
    grade(c, x, correct);
  }
  current.answered = current.options[i].id;
  finishTask(c, x, before);
  if (correct) advance();
}

function dontKnow() {
  if (!current || current.answered) return;
  const c = ctx();
  const x = current.concept;
  if (current.kind === 'new' || current.isNew) {
    c.prog.cards[x.id] = newCard(c, 0, false, { wrong: 0 });
    MemoryScheduler.expose(c.prog.cards[x.id], Date.now());
    MemoryScheduler.record(MemoryScheduler.session(state, c.s, Date.now()), x.id, Date.now());
    c.prog.task += 1;
    c.prog.lastId = x.id;
    current = { kind: 'intro', concept: x, answered: null, exposureRecorded: true };
    saveState();
    renderPlayView();
    speakTarget(x);
    return;
  }
  if (current.kind === 'build') {
    const before = scoreOf(c.prog);
    grade(c, x, false);
    current.answered = 'bad';
    finishTask(c, x, before);
  }
}

function checkBuild() {
  if (!current || current.kind !== 'build' || current.answered) return;
  const c = ctx();
  const x = current.concept;
  const sp = current.spec;
  const built = current.picked.map((i) => current.tiles[i].tk).join(sp.sep);
  const correct = norm(built) === norm(sp.answer.join(sp.sep));
  const before = scoreOf(c.prog);
  if(current.isNew)c.prog.cards[x.id]=correct?newCard(c,CONFIG.knownStartLevel,true,{verify:true}):newCard(c,0,false);
  else grade(c, x, correct);
  current.answered = correct ? 'ok' : 'bad';
  finishTask(c, x, before);
  if (correct) advance();
}

function advance() {
  clearTimeout(timer);
  if (view === 'place') { advancePlace(); return; }
  if (current && current.kind === 'intro') {
    const c = ctx();
    if (!current.exposureRecorded) {
      c.prog.cards[current.concept.id] = newCard(c, 0, false, { wrong: 0 });
      MemoryScheduler.expose(c.prog.cards[current.concept.id], Date.now());
      MemoryScheduler.record(MemoryScheduler.session(state, c.s, Date.now()), current.concept.id, Date.now());
      c.prog.task += 1;
    }
    completeModeTurn(c.s);
    c.prog.lastId = current.concept.id;
    saveState();
  }
  current = null;
  renderPlay();
}

// ----- Niveautest -----
function renderOffer() {
  const c = ctx();
  c.prog.offered = true;
  saveState();
  $('app').innerHTML = `<section class="offer">
    <div class="prompt"><span class="w long">${esc(t('placeTitle'))}</span>
      <span class="sub">${esc(t('placeLead'))}</span></div>
    <div class="row center">
      <button class="secondary" id="skipBtn">${esc(t('placeSkip'))}</button>
      <button class="primary" id="placeBtn">${esc(t('placeStart'))}</button>
    </div></section>`;
  $('skipBtn').onclick = () => { view = 'play'; current = null; render(); };
  $('placeBtn').onclick = startPlacement;
}

function startPlacement() {
  const c = ctx();
  c.prog.offered = true;
  saveState();
  const bounds = [...new Set(PLACEMENT_BOUNDS.map((b) => Math.min(b, c.pool.length)))];
  placement = { key: c.key, bounds, block: 0, passedEnd: 0, right: [], wrong: [], asked: 0, total: 0 };
  nextPlacementBlock();
}
function nextPlacementBlock() {
  const c = ctx();
  const P = placement;
  while (P.block < P.bounds.length) {
    const from = P.block ? P.bounds[P.block - 1] : 0;
    const to = P.bounds[P.block];
    const cand = c.pool.slice(from, to).filter((x) => !c.prog.cards[x.id]);
    if (!cand.length) { P.passedEnd = to; P.block++; continue; }
    P.queue = shuffle(cand).slice(0, 4);
    P.blockSize = P.queue.length;
    P.blockRight = 0;
    current = null;
    view = 'place';
    render();
    return;
  }
  finishPlacement();
}
function renderPlace() {
  const c = ctx();
  const P = placement;
  if (!P || P.key !== c.key) { view = 'play'; render(); return; }
  if (!current) {
    const x = P.queue.shift();
    // Niveautesten er altid valgmuligheder: "forstå"-retningen, undtagen når man øver at sige/skrive selv.
    const qdir = c.s.dir === 'prod' || c.s.dir === 'write' ? 'prod' : 'rec';
    current = { kind: 'place', concept: x, qdir, options: makeOptions(c, x, qdir), answered: null };
    P.total++;
  }
  const x = current.concept;
  const rec = current.qdir === 'rec';
  let html = `<div class="meta"><span>${esc(t('placeBadge'))}</span><span>${esc(t('rank', { n: rankOf(c.s, x.id) }))}</span></div>
    <div class="progress"><div style="width:${Math.min(100, ((P.block + 1) / P.bounds.length) * 100)}%"></div></div>
    <div class="prompt">${promptActionsHTML(x)}
      ${rec ? targetHTML(c, x) : meaningHTML(c, x)}</div>
    <p class="task-q">${esc(questionText(c, x, 'quiz'))}</p>
    ${optionsHTML(c, x, current.answered)}
    ${feedbackReceiptHTML()}
    <div class="feedback" aria-live="polite">${current.answered ? `<button class="primary" id="nextBtn">${esc(t('next'))}</button>` : `<button class="secondary" id="dkBtn">${esc(t('dontKnow'))}</button>`}</div>`;
  $('app').innerHTML = `<div class="practice-stage${c.pics ? ' has-pictures' : ''}${practiceReadingClass(c)}">${html}</div>`;
  bindWordSave(x);
  fitAnswerText();
  $('app').querySelectorAll('.opt').forEach((b) => (b.onclick = () => choose(Number(b.dataset.i))));
  const dk = $('dkBtn');
  if (dk) dk.onclick = () => { if (!current.answered) { current.answered = '-'; placementAnswer(false); } };
  const next = $('nextBtn');
  if (next) next.onclick = advancePlace;
}
function choosePlace(i) {
  const correct = current.options[i].id === current.concept.id;
  current.answered = current.options[i].id;
  renderPlace();
  placementAnswer(correct);
}
function placementAnswer(correct) {
  const P = placement;
  (correct ? P.right : P.wrong).push(current.concept.id);
  if (correct) P.blockRight++;
  const c = ctx();
  const x = current.concept, now = Date.now();
  if (c.prog.cards[x.id]) grade(c, x, correct);
  else c.prog.cards[x.id] = newCard(c, correct ? CONFIG.knownStartLevel : 0, correct, { verify: correct });
  MemoryScheduler.review(c.prog.cards[x.id], correct, now, { word: x, learned: isLearned(c.prog.cards[x.id]), evidence: 4, rng: Math.random });
  if(typeof CourseKnowledge!=='undefined')CourseKnowledge.mark(c.prog.cards[x.id],x.id);
  MemoryScheduler.record(MemoryScheduler.session(state, c.s, now), x.id, now);
  saveState();
  lastFeedback = correct ? { id: current.concept.id, word: lexicalForm(current.concept,c.s.target), meaning: current.concept.words[c.s.base], lang: c.s.target } : null;
  if (correct) advancePlace(); else renderPlace();
}
function advancePlace() {
  clearTimeout(timer);
  const P = placement;
  current = null;
  if (P.queue.length) { renderPlace(); return; }
  // Blokken er bestået ved mindst 3 af 4 rigtige.
  if (P.blockRight >= Math.ceil(P.blockSize * 0.75)) {
    P.passedEnd = P.bounds[P.block];
    P.block++;
    nextPlacementBlock();
  } else {
    finishPlacement();
  }
}
function finishPlacement() {
  const c = ctx();
  const P = placement;
  const now = Date.now();
  for (const id of P.right) {
    if (!c.prog.cards[id]) c.prog.cards[id] = newCard(c, CONFIG.knownStartLevel, true, { verify: true });
  }
  // Alt før den sidst beståede blok regnes som kendt og spredes ud til kontrol.
  for (const x of c.pool.slice(0, P.passedEnd)) {
    if (c.prog.cards[x.id] || P.wrong.includes(x.id)) continue;
    c.prog.cards[x.id] = {
      lvl: CONFIG.placedLevel, ok: true, verify: true, right: 0, wrong: 0,
      task: c.prog.task, time: now,
    };
    MemoryScheduler.ensure(c.prog.cards[x.id], now).due = now + (1 + Math.random() * 6) * MemoryScheduler.DAY;
  }
  saveState();
  P.done = P.passedEnd;
  view = 'placeDone';
  current = null;
  render();
}
function renderPlaceDone() {
  const n = placement ? placement.done : 0;
  $('app').innerHTML = `<section class="offer"><div class="prompt">
    <span class="w long">${esc(n ? t('placeDone', { n }) : t('placeNone'))}</span>
    ${n ? `<span class="sub">${esc(t('placeDone2'))}</span>` : ''}</div>
    <div class="row center"><button class="primary" id="goBtn">${esc(t('next'))}</button></div></section>`;
  $('goBtn').onclick = () => { placement = null; view = 'play'; current = null; render(); };
}

// ----- Stats -----
function fmtDuration(min) {
  const ul = uiLang();
  const dec = ul === 'en' ? '.' : ',';
  const [M,H,D] = {
    da:['min','t','d'],en:['min','h','d'],ru:['мин','ч','дн'],uk:['хв','год','дн'],
    pl:['min','godz.','d'],ro:['min','h','z'],lt:['min','val.','d.'],bg:['мин','ч','дн'],
  }[ul];
  if (min < 60) return `${Math.round(min)} ${M}`;
  if (min < 60 * 24) return `${(min / 60).toFixed(min < 600 ? 1 : 0).replace('.', dec)} ${H}`;
  return `${(min / 1440).toFixed(min < 14400 ? 1 : 0).replace('.', dec)} ${D}`;
}

function renderStats() {
  const c = ctx();
  const now = Date.now();
  const ids = Object.keys(c.prog.cards).filter((id) => ITEM[id] && c.pool.some((p) => p.id === id))
    .sort((a, b) => rankOf(c.s, a) - rankOf(c.s, b));
  const showFrequency = c.s.pack === TOP && !!IPM[c.s.target];
  const cols = t('cols').filter((_,index)=>showFrequency||index!==2);
  let html = `<section class="stats"><div class="row" style="justify-content:space-between">
      <h1>${esc(t('stats'))}</h1><button class="secondary" id="backBtn">${esc(t('back'))}</button></div>
    <p class="course-note">${esc(dirName(c.s.dir, c.pics))}</p><div class="explain"><b>${esc(t('howTitle'))}</b><p>${esc(t('explainSimple'))}</p>
      <details><summary>${esc(t('formula'))}</summary><p>${esc(t('explain'))}</p></details></div>`;

  if (!ids.length) {
    html += `<p class="task-q">${esc(t('noStats'))}</p>`;
  } else {
    html += `<div class="table-wrap"><table><thead><tr>${cols.map((h) => `<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>`;
    for (const id of ids) {
      const x = ITEM[id];
      const card = c.prog.cards[id];
      const m = MemoryScheduler.ensure(card, now);
      const p = dueness(card, c.prog, now);
      const status = card.verify ? `<span class="dot"></span>${esc(t('checkS'))}`
        : isLearned(card) ? `<span class="dot ok"></span>${esc(t('learnedS'))}`
        : card.wrong && !card.ok ? `<span class="dot no"></span>${esc(t('wrongS'))}`
        : `<span class="dot"></span>${esc(t('notYet'))}`;
      const meaning = c.pics ? picHTML(x, 'pic-sm') : esc(lexicalForm(x,c.s.base));
      const ipm = !isPack(c.s) && IPM[c.s.target] ? (IPM[c.s.target][id] || 0).toLocaleString(uiLang()) : '';
      html += `<tr>
        <td class="num">${rankOf(c.s, id)}</td>
        <td class="wrap"><b>${esc(lexicalForm(x,c.s.target))}</b></td>
        ${showFrequency?`<td class="num">${ipm}</td>`:''}
        <td class="wrap">${meaning}</td>
        <td class="num">${card.lvl}</td>
        <td class="num">${fmtDuration(Math.max(0, MemoryScheduler.dueAt(card, isLearned(card), now) - (m.last ?? card.time)) / 60000)}</td>
        <td>${status}</td>
        <td class="num"><span class="bar ${p >= 1 ? 'due' : ''}"><div style="width:${Math.max(0, Math.min(100, p * 100))}%"></div></span> ${Math.max(0, Math.round(p * 100))} %</td>
      </tr>`;
    }
    html += `</tbody></table></div>`;
  }
  html += `<p class="row" style="margin-top:20px">
    ${c.native ? '' : `<button class="secondary" id="placeAgainBtn">${esc(t('placeAgain'))}</button>`}
    <button class="secondary" id="resetBtn">${esc(t('reset'))}</button></p></section>`;
  $('app').innerHTML = html;

  $('backBtn').onclick = () => go('play');
  const pa = $('placeAgainBtn');
  if (pa) pa.onclick = () => { go('play'); startPlacement(); };
  $('resetBtn').onclick = () => {
    if (!confirm(t('resetQ'))) return;
    state.progress[c.key]={task:0,cards:{},lastId:null,knowledgeResetAt:Date.now()};
    saveState();
    current = null;
    go('play');
  };
}

// ---------- Global events ----------
$('menuBtn').onclick = () => {
  // The full-width landing has no reserved gutter. Keep its content still when
  // a menu hides an actual scrollbar on a short or expanded landing page.
  const gutter = document.body?.classList?.contains('landing') ? Math.max(0, window.innerWidth - document.documentElement.clientWidth) : 0;
  document.body?.style?.setProperty('--menu-gutter', `${gutter}px`);
  $('appMenu').showModal();
};
$('closeMenuBtn').onclick = () => $('appMenu').close();
$('returnCourseBtn').onclick = returnToCourse;
$('modeBtn').onclick = () => { $('appMenu').close(); openTrainingOptions(state.settings, (chosen) => { state.settings = chosen; current = null; placement = null; lastFeedback = null; levelNotice = null; saveState(); go('play'); }); };
$('homeBtn').onclick = (e) => { e.preventDefault(); go('home'); };
$('resumeBtn').onclick = () => go('play');
$('statsBtn').onclick = () => go(view === 'stats' ? 'play' : 'stats');
$('libraryBtn').onclick = () => go('library');
$('setupBtn').onclick = () => go('setup');
function setSound(enabled) {
  state.sound = enabled;
  saveState();
  if (!state.sound && 'speechSynthesis' in window) speechSynthesis.cancel();
  $('soundBtn').classList.toggle('off', !state.sound);
  $('soundBtn').setAttribute('aria-pressed', String(state.sound));
  if ($('soundChk')) $('soundChk').checked = state.sound;
}
$('soundBtn').onclick = () => setSound(!state.sound);

document.addEventListener('pointerdown', (event) => {
  const picker = $('topicPicker');
  if (picker?.open && !picker.contains(event.target)) picker.open = false;
});
document.addEventListener('keydown', (e) => {
  if (document.querySelector('dialog[open]')) return;
  const picker = $('topicPicker');
  if (e.key === 'Escape' && picker?.open) { picker.open = false; picker.querySelector('summary').focus(); e.preventDefault(); return; }
  if (e.target.closest('input, textarea, select, dialog, [contenteditable="true"]')) return;
  if ((view !== 'play' && view !== 'place') || !current || e.ctrlKey || e.metaKey || e.altKey) return;
  if (e.repeat) { e.preventDefault(); return; }
  if ((e.key === 'Enter' || e.key === ' ') && e.target.closest('button, a')) return;
  if (current.options && !current.answered && /^[1-4]$/.test(e.key)) { choose(Number(e.key) - 1); e.preventDefault(); return; }
  // Skriv ordet: bogstaverne på det rigtige tastatur virker også.
  if (current.kind === 'write' && !current.answered && e.key.length === 1) {
    const k = e.key.toLowerCase();
    if (current.keys.includes(k)) { pressKey(k); e.preventDefault(); }
    return;
  }
  if (e.key === 'Enter' || e.key === ' ') {
    if ($('nextBtn')) { advance(); e.preventDefault(); } else if ($('checkBtn') && !$('checkBtn').disabled) { checkBuild(); e.preventDefault(); }
  }
  if (e.key === 'Backspace' && current.kind === 'build' && !current.answered && current.picked.length) {
    current.picked.pop();
    renderPlayView();
    e.preventDefault();
  }
});
if ('speechSynthesis' in window) speechSynthesis.getVoices();

render();
