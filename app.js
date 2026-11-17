'use strict';

// ---------------------------------------------------------------------------
// Læringsmodel
//
// Hvert ord/sætning (pr. sprogpar, emne og retning) har et niveau L. Intervallet til
// næste gentagelse er base^L – både i antal opgaver og i tid:
//
//   opgave-interval = taskUnit    * base^L      (fx 1, 2, 4, 8 ... opgaver)
//   tids-interval   = timeUnitMin * base^L      (fx 10 min, 20 min, 40 min ...)
//
//   forfald = opgaver siden sidst / opgave-interval + tid siden sidst / tids-interval
//
// Ordet er klar til gentagelse, når forfald >= 1. Det mest forfaldne vises først.
// Er intet forfaldent, kommer næste nye ord på listen.
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
  base: 2,
  taskUnit: 1,
  timeUnitMin: 10,
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
    title: 'Lær de ord, du har brug for – ét ord ad gangen',
    lead: 'Til hverdagen, til dit nye job eller til køreprøven. Det vigtigste først, og det du kan, kommer sjældnere igen.',
    how: ['Vælg sprog, og hvad du vil lære: de mest brugte ord, ord til et bestemt job eller køreprøven.', 'Du får ét ord eller én sætning ad gangen – det vigtigste først.', 'Svarer du rigtigt, går der længere tid, før det kommer igen. Svarer du forkert, kommer det hurtigt igen. Din score viser, hvor meget du kan.'],
    tagline: 'Gratis · uden login · virker på mobilen',
    settings: 'Indstillinger',
    save: 'Gem og fortsæt',
    cancel: 'Annuller',
    loading: 'Henter …',
    loadFail: 'Kunne ikke hente indholdet. Tjek din internetforbindelse.',
    nativeShort: 'modersmål',
    switchDir: 'Skift retning',
    progress: '{n} af {m} lært',
    howTitle: 'Sådan virker det',
    explainSimple: 'Hver gang du svarer rigtigt, går der dobbelt så lang tid, før ordet kommer igen – både målt i opgaver og i tid. Svarer du forkert, kommer det hurtigere igen. Et ord tæller som lært, når du har svaret rigtigt på det mindst to gange i træk.',
    formula: 'Den præcise formel',
    learnQ: 'Hvilket sprog vil du lære?',
    baseQ: 'Hvilket sprog forstår du bedst?',
    nativeB: 'Det er mit modersmål',
    nativeS: 'Lær at læse – med billeder',
    nativeSoon: 'Billeder er på vej',
    otherS: 'Vis oversættelser',
    whatQ: 'Hvad vil du lære?',
    topB: 'De mest brugte ord', topS: 'I rækkefølge efter hvor meget de bruges',
    catsQ: 'Emner',
    modeQ: 'Hvad vil du øve?',
    recB: 'Forstå', recS: 'Se {T}, vælg {B}',
    prodB: 'Sig det selv', prodS: 'Se {B}, find og byg det på {T}',
    recNB: 'Find billedet', recNS: 'Se ordet, vælg billedet',
    prodNB: 'Læs ordet', prodNS: 'Se billedet, vælg det rigtige ord',
    writeB: 'Skriv det', writeS: 'Se {B}, skriv det på {T} – bogstav for bogstav',
    writeNB: 'Skriv ordet', writeNS: 'Se billedet, hør ordet og skriv det – bogstav for bogstav',
    pathB: 'Hele forløbet', pathS: 'Find billedet, læs ordet og skriv det – lidt sværere for hvert ord, du kan',
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
    newQ: 'Nyt – kender du det?',
    repeat: 'Gentagelse',
    check: 'Kontrol',
    next: 'Videre',
    correct: 'Rigtigt!',
    wrong: 'Ikke helt – det rigtige svar er grønt',
    wrongBuild: 'Ikke helt. Rigtigt svar:',
    dontKnow: 'Ved ikke – vis mig',
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
      'og <code>{mu} min·{b}<sup>L</sup></code> – de to lægges sammen som <b>forfald</b>, og ordet er klar ved 100 %. ' +
      'Rigtigt svar: <code>L+1</code>. Forkert svar: <code>L−1</code>. Et ord tæller som lært fra niveau {ll}, hvis sidste svar var rigtigt.',
    placeTitle: 'Kan du allerede noget?',
    placeLead: 'Tag en kort test, så springer du over det, du allerede kan. Den tager et par minutter og bliver sværere og sværere.',
    placeStart: 'Tag testen',
    placeSkip: 'Start fra begyndelsen',
    placeBadge: 'Niveautest',
    placeDone: 'Du kan cirka de første {n} på listen.',
    placeDone2: 'Vi fortsætter derfra. Det du sprang over, dukker op en gang imellem som en hurtig kontrol.',
    placeNone: 'Vi starter fra begyndelsen – så lærer du det hele i den rigtige rækkefølge.',
    placeAgain: 'Test mit niveau',
  },
  en: {
    lang: { da: 'Danish', en: 'English', ru: 'Russian', uk: 'Ukrainian' },
    title: 'Learn the words you need – one word at a time',
    lead: 'For everyday life, your new job or the driving test. The most important first, and what you know comes back less often.',
    how: ['Choose your languages and what to learn: the most used words, words for a specific job, or the driving test.', 'You get one word or one sentence at a time – the most important first.', 'Answer correctly and it takes longer before it comes back. Answer wrong and it comes back soon. Your score shows how much you know.'],
    tagline: 'Free · no login · works on your phone',
    settings: 'Settings',
    save: 'Save and continue',
    cancel: 'Cancel',
    loading: 'Loading …',
    loadFail: 'Could not load the content. Check your internet connection.',
    nativeShort: 'first language',
    switchDir: 'Switch direction',
    progress: '{n} of {m} learned',
    howTitle: 'How it works',
    explainSimple: 'Every time you answer correctly, it takes twice as long before the word comes back – counted both in tasks and in time. Answer wrong and it comes back sooner. A word counts as learned when you have answered it correctly at least twice in a row.',
    formula: 'The exact formula',
    learnQ: 'Which language do you want to learn?',
    baseQ: 'Which language do you understand best?',
    nativeB: 'It is my first language',
    nativeS: 'Learn to read – with pictures',
    nativeSoon: 'Pictures coming soon',
    otherS: 'Show translations',
    whatQ: 'What do you want to learn?',
    topB: 'The most used words', topS: 'In order of how often they are used',
    catsQ: 'Topics',
    modeQ: 'What do you want to practise?',
    recB: 'Understand', recS: 'See {T}, pick {B}',
    prodB: 'Say it yourself', prodS: 'See {B}, find and build it in {T}',
    recNB: 'Find the picture', recNS: 'See the word, pick the picture',
    prodNB: 'Read the word', prodNS: 'See the picture, pick the right word',
    writeB: 'Write it', writeS: 'See {B}, write it in {T} – letter by letter',
    writeNB: 'Write the word', writeNS: 'See the picture, hear the word and write it – letter by letter',
    pathB: 'The whole course', pathS: 'Find the picture, read the word and write it – a bit harder for each word you know',
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
    newQ: 'New – do you know it?',
    repeat: 'Review',
    check: 'Check',
    next: 'Continue',
    correct: 'Correct!',
    wrong: 'Not quite – the right answer is green',
    wrongBuild: 'Not quite. Correct answer:',
    dontKnow: "Don't know – show me",
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
      'and <code>{mu} min·{b}<sup>L</sup></code> – the two are added up as <b>due</b>, and the word is ready at 100 %. ' +
      'Correct: <code>L+1</code>. Wrong: <code>L−1</code>. A word counts as learned from level {ll} if the last answer was correct.',
    placeTitle: 'Do you already know some?',
    placeLead: 'Take a short test and skip what you already know. It takes a few minutes and gets harder as you go.',
    placeStart: 'Take the test',
    placeSkip: 'Start from the beginning',
    placeBadge: 'Level test',
    placeDone: 'You know roughly the first {n} on the list.',
    placeDone2: 'We continue from there. What you skipped will come up now and then as a quick check.',
    placeNone: 'We start from the beginning – so you learn everything in the right order.',
    placeAgain: 'Test my level',
  },
  ru: {
    lang: { da: 'Датский', en: 'Английский', ru: 'Русский', uk: 'Украинский' },
    title: 'Учите нужные слова – по одному за раз',
    lead: 'Для повседневной жизни, новой работы или экзамена по вождению. Сначала самое важное, а то, что вы знаете, повторяется реже.',
    how: ['Выберите языки и что учить: самые частые слова, слова для конкретной работы или экзамен по вождению.', 'Вы получаете одно слово или одну фразу за раз – сначала самое важное.', 'Ответите правильно – слово вернётся нескоро. Ошибётесь – оно скоро вернётся. Счёт показывает, сколько вы знаете.'],
    tagline: 'Бесплатно · без регистрации · работает на телефоне',
    settings: 'Настройки',
    save: 'Сохранить и продолжить',
    cancel: 'Отмена',
    loading: 'Загрузка …',
    loadFail: 'Не удалось загрузить. Проверьте подключение к интернету.',
    nativeShort: 'родной язык',
    switchDir: 'Сменить направление',
    progress: 'Выучено {n} из {m}',
    howTitle: 'Как это работает',
    explainSimple: 'После каждого правильного ответа слово возвращается вдвое позже – и по числу заданий, и по времени. После ошибки оно возвращается быстрее. Слово считается выученным, если вы правильно ответили на него как минимум два раза подряд.',
    formula: 'Точная формула',
    learnQ: 'Какой язык вы хотите учить?',
    baseQ: 'Какой язык вы понимаете лучше всего?',
    nativeB: 'Это мой родной язык',
    nativeS: 'Учимся читать – с картинками',
    nativeSoon: 'Картинки скоро появятся',
    otherS: 'Показывать перевод',
    whatQ: 'Что вы хотите выучить?',
    topB: 'Самые частые слова', topS: 'В порядке частоты употребления',
    catsQ: 'Темы',
    modeQ: 'Что будем тренировать?',
    recB: 'Понимать', recS: 'Видите {T}, выбираете {B}',
    prodB: 'Сказать самому', prodS: 'Видите {B}, находите и собираете на языке: {T}',
    recNB: 'Найти картинку', recNS: 'Видите слово, выбираете картинку',
    prodNB: 'Прочитать слово', prodNS: 'Видите картинку, выбираете нужное слово',
    writeB: 'Написать', writeS: 'Видите {B}, пишете на языке: {T} – по буквам',
    writeNB: 'Написать слово', writeNS: 'Видите картинку, слышите слово и пишете его по буквам',
    pathB: 'Весь курс', pathS: 'Найти картинку, прочитать слово и написать его – с каждым выученным словом чуть сложнее',
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
    newQ: 'Новое – вы это знаете?',
    repeat: 'Повторение',
    check: 'Проверка',
    next: 'Дальше',
    correct: 'Правильно!',
    wrong: 'Не совсем – правильный ответ зелёный',
    wrongBuild: 'Не совсем. Правильный ответ:',
    dontKnow: 'Не знаю – покажите',
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
      'У каждого слова есть уровень <code>L</code>. Следующее повторение — через <code>{tu}·{b}<sup>L</sup></code> заданий ' +
      'и <code>{mu} мин·{b}<sup>L</sup></code>; оба значения складываются в <b>срок</b>, и слово готово к повторению при 100 %. ' +
      'Верно: <code>L+1</code>. Неверно: <code>L−1</code>. Слово считается выученным с уровня {ll}, если последний ответ был верным.',
    placeTitle: 'Вы уже что-то знаете?',
    placeLead: 'Пройдите короткий тест и пропустите то, что уже знаете. Это займёт пару минут, задания постепенно усложняются.',
    placeStart: 'Пройти тест',
    placeSkip: 'Начать с начала',
    placeBadge: 'Тест уровня',
    placeDone: 'Вы знаете примерно первые {n} в списке.',
    placeDone2: 'Продолжим оттуда. Пропущенное будет иногда появляться для быстрой проверки.',
    placeNone: 'Начнём с начала – так вы выучите всё в правильном порядке.',
    placeAgain: 'Проверить мой уровень',
  },
  uk: {
    lang: { da: 'Данська', en: 'Англійська', ru: 'Російська', uk: 'Українська' },
    title: 'Вивчайте потрібні слова – по одному за раз',
    lead: 'Для щоденного життя, нової роботи чи іспиту з водіння. Спочатку найважливіше, а те, що ви знаєте, повторюється рідше.',
    how: ['Оберіть мови і що вчити: найуживаніші слова, слова для певної роботи або іспит з водіння.', 'Ви отримуєте одне слово або одну фразу за раз – спочатку найважливіше.', 'Відповісте правильно – слово повернеться нескоро. Помилитеся – воно скоро повернеться. Рахунок показує, скільки ви знаєте.'],
    tagline: 'Безкоштовно · без реєстрації · працює на телефоні',
    settings: 'Налаштування',
    save: 'Зберегти і продовжити',
    cancel: 'Скасувати',
    loading: 'Завантаження …',
    loadFail: 'Не вдалося завантажити. Перевірте підключення до інтернету.',
    nativeShort: 'рідна мова',
    switchDir: 'Змінити напрямок',
    progress: 'Вивчено {n} з {m}',
    howTitle: 'Як це працює',
    explainSimple: 'Після кожної правильної відповіді слово повертається вдвічі пізніше – і за кількістю завдань, і за часом. Після помилки воно повертається швидше. Слово вважається вивченим, якщо ви правильно відповіли на нього щонайменше двічі поспіль.',
    formula: 'Точна формула',
    learnQ: 'Яку мову ви хочете вивчати?',
    baseQ: 'Яку мову ви розумієте найкраще?',
    nativeB: 'Це моя рідна мова',
    nativeS: 'Вчимося читати – з картинками',
    nativeSoon: 'Картинки скоро з’являться',
    otherS: 'Показувати переклад',
    whatQ: 'Що ви хочете вивчити?',
    topB: 'Найуживаніші слова', topS: 'У порядку частоти вживання',
    catsQ: 'Теми',
    modeQ: 'Що будемо тренувати?',
    recB: 'Розуміти', recS: 'Бачите {T}, обираєте {B}',
    prodB: 'Сказати самому', prodS: 'Бачите {B}, знаходите і складаєте мовою: {T}',
    recNB: 'Знайти картинку', recNS: 'Бачите слово, обираєте картинку',
    prodNB: 'Прочитати слово', prodNS: 'Бачите картинку, обираєте потрібне слово',
    writeB: 'Написати', writeS: 'Бачите {B}, пишете мовою: {T} – по літерах',
    writeNB: 'Написати слово', writeNS: 'Бачите картинку, чуєте слово і пишете його по літерах',
    pathB: 'Увесь курс', pathS: 'Знайти картинку, прочитати слово і написати його – з кожним вивченим словом трохи складніше',
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
    newQ: 'Нове – ви це знаєте?',
    repeat: 'Повторення',
    check: 'Перевірка',
    next: 'Далі',
    correct: 'Правильно!',
    wrong: 'Не зовсім – правильна відповідь зелена',
    wrongBuild: 'Не зовсім. Правильна відповідь:',
    dontKnow: 'Не знаю – покажіть',
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
      'Кожне слово має рівень <code>L</code>. Наступне повторення — через <code>{tu}·{b}<sup>L</sup></code> завдань ' +
      'і <code>{mu} хв·{b}<sup>L</sup></code>; обидва значення додаються в <b>строк</b>, і слово готове до повторення при 100 %. ' +
      'Правильно: <code>L+1</code>. Неправильно: <code>L−1</code>. Слово вважається вивченим з рівня {ll}, якщо остання відповідь була правильною.',
    placeTitle: 'Ви вже щось знаєте?',
    placeLead: 'Пройдіть короткий тест і пропустіть те, що вже знаєте. Це займе кілька хвилин, завдання поступово ускладнюються.',
    placeStart: 'Пройти тест',
    placeSkip: 'Почати з початку',
    placeBadge: 'Тест рівня',
    placeDone: 'Ви знаєте приблизно перші {n} у списку.',
    placeDone2: 'Продовжимо звідти. Пропущене іноді з’являтиметься для швидкої перевірки.',
    placeNone: 'Почнемо з початку – так ви вивчите все в правильному порядку.',
    placeAgain: 'Перевірити мій рівень',
  },
};

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
  const byCat = p.categories.map((cat) => cat.rows.map(([prio, da, en, ru, uk]) => ({
    id: `${p.id}:${da}`, words: { da, en, ru, uk }, pos: cat.key, cat: cat.key, diff: prio, phrase: cat.type === 'phrase',
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
let selectedCourseLink = false;
let lastFeedback = null;

// Direkte link fra en jobside: #start=<pakke>&base=<sprog>. Har man allerede valgt sprog,
// skiftes der bare emne; ellers åbnes opsætningen med emnet valgt på forhånd.
function applyCourseLink() {
  const m = location.hash.match(/^#start=([a-z]+)(?:&base=([a-z]{2}))?/);
  if (!m) return;
  history.replaceState(null, '', location.pathname + location.search);
  const [, pack, base] = m;
  if (![TOP, PICS].includes(pack) && !PACK_LIST.some((p) => p.id === pack)) return;
  selectedCourseLink = true;
  current = null;
  placement = null;
  lastFeedback = null;
  const s = state.settings;
  if (s && s.target === 'da' && s.base !== 'da') {
    state.settings = { ...s, base: base && LANGS[base] && base !== 'da' ? base : s.base, pack, cats: null, dir: pack === PICS ? 'path' : 'rec' };
    saveState();
    view = 'play';
  } else {
    draft = { target: 'da', base: base && LANGS[base] && base !== 'da' ? base : null, pack, dir: 'rec', diff: 1, cats: null };
    view = 'setup';
  }
}
applyCourseLink();
window.addEventListener('hashchange', () => {
  if (/^#start=/.test(location.hash)) { applyCourseLink(); render(); }
});

function viewFromHash() {
  const h = location.hash;
  if (h === '#mine-ord') return 'library';
  if (h === '#indstillinger' || !state.settings) return 'setup';
  if (h === '#statistik') return 'stats';
  return 'play';
}
// Navigation med rigtige URL'er, så browserens tilbage-knap virker.
function go(v) {
  if (v !== 'play') lastFeedback = null;
  const hash = v === 'setup' ? '#indstillinger' : v === 'stats' ? '#statistik' : v === 'library' ? '#mine-ord' : '';
  if (location.hash !== hash) history.pushState(null, '', location.pathname + location.search + hash);
  view = v;
  if (v === 'setup') draft = null;
  window.scrollTo(0, 0);
  render();
}
window.addEventListener('popstate', () => {
  placement = null;
  if (/^#start=/.test(location.hash)) { applyCourseLink(); render(); return; }
  view = viewFromHash();
  if (view === 'setup') draft = null;
  render();
});

function loadState() {
  let s = null;
  try { s = JSON.parse(localStorage.getItem(STORE)); } catch (e) { /* ingen lagring */ }
  if (!s || typeof s !== 'object') s = {};
  s.progress = s.progress || {};
  s.sound = s.sound !== false;
  s.library = s.library && typeof s.library === 'object' && !Array.isArray(s.library) ? s.library : {};
  return s;
}
function saveState() {
  try { localStorage.setItem(STORE, JSON.stringify(state)); } catch (e) { /* ignorer */ }
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
  return (state.settings && state.settings.base) || browserLang();
}
function t(key, vars) {
  const v = UI[uiLang()][key];
  return vars && typeof v === 'string' ? fill(v, vars) : v;
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
function ctx() {
  const s = state.settings;
  const native = s.base === s.target;
  const key = progKey(s);
  const prog = (state.progress[key] = state.progress[key] || { task: 0, cards: {}, lastId: null });
  return { s, native, pics: isPics(s), key, prog, pool: buildPool(s) };
}
const intervalFactor = (lvl) => Math.pow(CONFIG.base, lvl);
function dueness(card, prog, now) {
  const f = intervalFactor(card.lvl);
  return (prog.task - card.task) / (CONFIG.taskUnit * f) + (now - card.time) / (CONFIG.timeUnitMin * 60000 * f);
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
  const introduced = c.pool.filter((x) => c.prog.cards[x.id]);
  let best = null;
  let bestP = -Infinity;
  for (const x of introduced) {
    if (x.id === c.prog.lastId && introduced.length > 1) continue;
    const p = dueness(c.prog.cards[x.id], c.prog, now);
    if (p > bestP) { best = x; bestP = p; }
  }
  if (best && bestP >= 1) return reviewTask(c, best);
  const fresh = c.pool.find((x) => !c.prog.cards[x.id]);
  if (fresh) {
    // Børn (modersmål) ser altid ordet først. Andre prøver først, om de kender det.
    if (c.native) return { kind: 'intro', concept: fresh };
    if (c.s.dir === 'write' && writeSpec(c, fresh)) return { kind: 'write', concept: fresh, qdir: 'prod', isNew: true };
    return { kind: 'new', concept: fresh, qdir: c.s.dir === 'rec' || c.s.dir === 'path' ? 'rec' : 'prod' };
  }
  return best ? reviewTask(c, best) : null;
}

function newCard(c, lvl, ok, extra) {
  return { lvl, ok, right: ok ? 1 : 0, wrong: ok ? 0 : 1, task: c.prog.task, time: Date.now(), ...extra };
}

// Svarmuligheder vises i "betydnings"-sproget (eller som billede) ved rec, i målsproget ved prod.
function optionLabel(c, x, qdir) {
  if (qdir === 'rec') return c.pics ? x.id : x.words[c.s.base].toLowerCase();
  return x.words[c.s.target].toLowerCase();
}
function pickDistractors(c, concept, qdir, n = 3) {
  const answer = optionLabel(c, concept, qdir);
  const used = new Set([answer]);
  const picked = [];
  // Synonymer (fx "mug" og "skimmel") må ikke optræde som forkerte svar for hinanden.
  const sameMeaning = (x) => ['base', 'target'].some((k) => x.words[c.s[k]] && x.words[c.s[k]].toLowerCase() === concept.words[c.s[k]].toLowerCase());
  const candidates = isList(c.s) ? Object.values(ITEM).filter((x) => x.id.startsWith('lex:') && x.words[c.s.target] && x.words[c.s.base]) : c.pool;
  const cand = candidates.filter((x) => x.id !== concept.id && x.phrase === concept.phrase && !sameMeaning(x)
    && !(c.pics && confusable(x.id, concept.id)));
  const seen = (x) => !!c.prog.cards[x.id];
  const samePos = (x) => x.pos === concept.pos;
  const near = new Set(c.pool.slice(0, Math.max(40, c.pool.indexOf(concept) + 20)).map((x) => x.id));
  const tiers = [
    cand.filter((x) => seen(x) && samePos(x)),
    cand.filter((x) => !seen(x) && samePos(x) && near.has(x.id)),
    cand.filter((x) => seen(x)),
    cand.filter((x) => near.has(x.id)),
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
  const full = x.words[c.s.target];
  if (!x.phrase && c.s.target === 'da') {
    const m = full.match(/^(en|et|at)\s+(.+)$/);
    if (m) return { prefix: m[1], rest: m[2] };
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
    for (const w of shuffle(o.words[c.s.target].split(/\s+/).slice(1))) {
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
  }
  return alphabets[lang];
}
function writeSpec(c, x) {
  if (x.phrase) return null;
  const { prefix, rest } = splitPrefix(c, x);
  if (/\s/.test(rest.trim())) return null;
  const chars = Array.from(rest.trim());
  const n = chars.filter(isLetter).length;
  if (n < 2 || n > 14) return null;
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
function speak(text, lang) {
  if (!state.sound || !('speechSynthesis' in window)) return;
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
function speakTarget(x) { speak(x.words[state.settings.target], state.settings.target); }

// ---------- Rendering ----------
function render() {
  clearTimeout(timer);
  const ul = uiLang();
  document.documentElement.lang = ul;
  const inGame = !!state.settings && !['setup', 'library'].includes(view);
  $('score').hidden = !inGame;
  $('statsBtn').hidden = !inGame;
  $('setupBtn').hidden = !state.settings;
  $('soundBtn').hidden = !state.settings;
  $('soundBtn').classList.toggle('off', !state.sound);
  for (const [id, key] of [['statsBtn', 'stats'], ['setupBtn', 'settings'], ['soundBtn', 'sound']]) {
    $(id).title = t(key);
    $(id).setAttribute('aria-label', t(key));
  }
  $('soundBtn').setAttribute('aria-pressed', String(state.sound));
  $('libraryBtn').title = lt('title');
  $('libraryBtn').setAttribute('aria-label', lt('title'));
  const catalogLink = $('catalogLink');
  if (catalogLink) {
    catalogLink.href = `/${ul}/`;
    catalogLink.textContent = COURSE_CATALOG.labels[ul].catalog;
  }
  renderIntro(ul);
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
function renderIntro(ul) {
  const intro = $('intro');
  if (!intro) return;
  intro.hidden = !(view === 'setup' && !state.settings && !selectedCourseLink);
  if (intro.hidden || intro.dataset.lang === ul) return;
  intro.dataset.lang = ul;
  intro.querySelector('h1').textContent = t('title');
  intro.querySelector('.lead').textContent = t('lead');
  intro.querySelectorAll('.how li').forEach((li, i) => (li.textContent = t('how')[i]));
  intro.querySelector('.tagline').textContent = t('tagline');
  const labels = COURSE_CATALOG.labels[ul];
  intro.querySelector('h1').textContent = labels.lead;
  intro.querySelector('.lead').textContent = labels.intro;
  intro.querySelector('.jobs').innerHTML = COURSE_CATALOG.groups.map((group) =>
    `<a class="category-entry" href="/${ul}/#${group.id}"><b>${esc(group.name[ul])}</b><small>${esc(group.desc[ul])}</small><span aria-hidden="true">→</span></a>`).join('');
}

// ----- Øvelsestyper -----
// Billed-mode har også "Hele forløbet", der skifter opgavetype efterhånden som man kan ordet.
const dirsFor = (pics) => (pics ? ['path', 'rec', 'prod', 'write'] : ['rec', 'prod', 'write']);
const DIR_KEY = { path: 'path', rec: 'rec', prod: 'prod', write: 'write' };
function dirName(dir, pics) {
  return t(`${DIR_KEY[dir] || 'rec'}${pics && dir !== 'path' ? 'N' : ''}B`);
}
function dirSub(dir, pics, vars) {
  return t(`${DIR_KEY[dir] || 'rec'}${pics && dir !== 'path' ? 'N' : ''}S`, vars);
}

// ----- Kontekstlinje: hvad øver jeg lige nu – og skift hurtigt -----
function ctxBarHTML(c) {
  const ul = uiLang();
  const L = UI[ul].lang;
  const langTxt = c.native ? `${LANGS[c.s.target].name} · ${t('nativeShort')}` : `${LANGS[c.s.target].name} ← ${L[c.s.base]}`;
  const what = isList(c.s) ? libraryTitle(c.s.pack.slice(5)) : isPack(c.s) ? packOf(c.s).name[ul] : c.pics ? t('picsB') : t('topB');
  const dirTxt = dirName(c.s.dir, c.pics);
  const diffTxt = (isPack(c.s) ? t('packDiff') : t('diff'))[c.s.diff];
  return `<div class="ctxbar" role="toolbar">
    <button class="pill" data-ctx="setup" title="${esc(t('settings'))}">${esc(langTxt)}</button>
    <button class="pill" data-ctx="setup" title="${esc(t('settings'))}">${esc(what)}</button>
    <button class="pill toggle" data-ctx="dir" title="${esc(t('switchDir'))}">${esc(dirTxt)} <span aria-hidden="true">⇄</span></button>
    ${isList(c.s) ? '' : `<button class="pill toggle" data-ctx="diff" title="${esc(t('diffQ'))}">${esc(diffTxt)}</button>`}
  </div>`;
}
function bindCtxBar() {
  $('app').querySelectorAll('[data-ctx]').forEach((b) => (b.onclick = () => {
    const s = state.settings;
    if (b.dataset.ctx === 'setup') { go('setup'); return; }
    if (b.dataset.ctx === 'dir') {
      const dirs = dirsFor(isPics(s));
      s.dir = dirs[(dirs.indexOf(s.dir) + 1) % dirs.length];
    }
    if (b.dataset.ctx === 'diff') s.diff = s.diff % 3 + 1;
    saveState();
    current = null;
    placement = null;
    view = 'play';
    render();
  }));
}

// ----- Setup -----
function renderSetup() {
  if (!draft) draft = state.settings ? { pack: TOP, ...state.settings } : { target: null, base: null, pack: TOP, dir: 'rec', diff: 1 };
  const d = draft;
  const ul = uiLang();
  const L = UI[ul].lang;
  const targets = Object.keys(ORDER);
  const choice = (attrs, pressed, title, sub) =>
    `<button class="choice" ${attrs} aria-pressed="${pressed}"><b>${title}</b>${sub ? `<small>${esc(sub)}</small>` : ''}</button>`;

  let html = `<section class="setup">${state.settings ? `<h1>${esc(t('settings'))}</h1>` : ''}`;

  html += `<div class="step"><h2>${esc(t('learnQ'))}</h2><div class="choices">`;
  for (const l of targets) html += choice(`data-target="${l}"`, d.target === l, esc(LANGS[l].name));
  html += `</div></div>`;

  if (d.target) {
    html += `<div class="step"><h2>${esc(t('baseQ'))}</h2><div class="choices">`;
    const nPics = buildPool({ ...d, base: d.target, pack: TOP, diff: 3 }).length;
    if (nPics >= 8) html += choice(`data-base="${d.target}"`, d.base === d.target, esc(L[d.target]), t('nativeB') + ' · ' + t('nativeS'));
    else html += `<button class="choice" disabled aria-pressed="false"><b>${esc(L[d.target])}</b><small>${esc(t('nativeB'))} · ${esc(t('nativeSoon'))}</small></button>`;
    for (const l of Object.keys(LANGS).filter((l) => l !== d.target)) html += choice(`data-base="${l}"`, d.base === l, esc(L[l]), t('otherS'));
    html += `</div></div>`;
  }

  if (d.target && d.base) {
    const native = d.base === d.target;
    if (native) d.pack = TOP;
    const nPicWords = buildPool({ ...d, base: d.target, pack: TOP, diff: 3 }).length;
    if (d.pack === PICS && nPicWords < 8) d.pack = TOP;
    const pics = isPics(d);
    // "Hele forløbet" findes kun med billeder.
    if (!dirsFor(pics).includes(d.dir)) d.dir = pics ? 'path' : 'rec';
    if (!native) {
      const selectedPack = PACK_LIST.find((p) => p.id === d.pack);
      const selectedName = isList(d) ? libraryTitle(d.pack.slice(5)) : selectedPack ? selectedPack.name[ul] : d.pack === PICS ? t('picsB') : t('topB');
      html += `<div class="step course-picker"><h2>${esc(t('whatQ'))}</h2><details${!state.settings && !selectedCourseLink ? ' open' : ''}><summary>${esc(selectedName)} · ${esc(COURSE_CATALOG.labels[ul].catalog)}</summary>`;
      for (const group of COURSE_CATALOG.groups) {
        html += `<fieldset class="course-group"><legend>${esc(group.name[ul])}</legend><div class="choices">`;
        for (const id of group.packs) {
          if (id === TOP) html += choice(`data-pack="${TOP}"`, d.pack === TOP, esc(t('topB')), t('topS'));
          else if (id === PICS) {
            if (nPicWords >= 8) html += choice(`data-pack="${PICS}"`, d.pack === PICS, esc(t('picsB')), t('picsS', { n: nPicWords }));
          } else {
            const p = PACK_LIST.find((pack) => pack.id === id);
            if (p) html += choice(`data-pack="${p.id}"`, d.pack === p.id, esc(p.name[ul]), `${p.desc[ul]} · ${p.total}`);
          }
        }
        html += '</div></fieldset>';
      }
      html += '</details></div>';
    }
    const pack = isPack(d) ? packOf(d) : null;
    if (pack) {
      html += `<div class="step"><h2>${esc(t('catsQ'))}</h2><div class="chips">`;
      for (const cat of pack.categories) {
        const on = !d.cats || d.cats.includes(cat.key);
        const n = cat.n.slice(1, d.diff + 1).reduce((a, b) => a + b, 0);
        html += `<button class="chip" data-cat="${cat.key}" aria-pressed="${on}">${esc(cat.name[ul])} <small>${n}</small></button>`;
      }
      html += `</div></div>`;
    }

    const vars = { T: L[d.target].toLowerCase(), B: L[d.base].toLowerCase() };
    html += `<div class="step"><h2>${esc(t('modeQ'))}</h2><div class="choices">`;
    for (const dir of dirsFor(pics)) html += choice(`data-dir="${dir}"`, d.dir === dir, esc(dirName(dir, pics)), dirSub(dir, pics, vars));
    html += `</div></div>`;

    html += `<div class="step"><h2>${esc(t('diffQ'))}</h2><div class="choices">`;
    for (const lvl of [1, 2, 3]) {
      const n = countPool({ ...d, diff: lvl });
      html += choice(`data-diff="${lvl}"`, d.diff === lvl, esc((pack ? t('packDiff') : t('diff'))[lvl]), pack ? String(n) : t('nWords', { n }));
    }
    html += `</div></div>`;

    html += `<div class="row actions">
      ${state.settings ? `<button class="secondary" id="cancelBtn">${esc(t('cancel'))}</button>` : ''}
      <button class="primary" id="startBtn" ${countPool(d) ? '' : 'disabled'}>${esc(state.settings ? t('save') : t('start'))}</button>
      <label class="toggle"><input type="checkbox" id="soundChk" ${state.sound ? 'checked' : ''}> ${esc(t('sound'))}</label>
    </div>`;
  } else if (state.settings) {
    html += `<div class="row actions"><button class="secondary" id="cancelBtn">${esc(t('cancel'))}</button></div>`;
  }
  html += `</section>`;
  $('app').innerHTML = html;

  const on = (sel, fn) => $('app').querySelectorAll(sel).forEach((b) => (b.onclick = () => { fn(b); render(); }));
  on('[data-target]', (b) => { if (d.target !== b.dataset.target) { d.target = b.dataset.target; d.base = null; } });
  // Skifter man til eller fra billeder, vælges den naturlige øvelse (forløbet / forstå).
  const repick = (before) => { if (isPics(d) !== before) d.dir = isPics(d) ? 'path' : 'rec'; };
  on('[data-base]', (b) => { const before = !!d.base && isPics(d); d.base = b.dataset.base; repick(before); });
  on('[data-pack]', (b) => { const before = isPics(d); d.pack = b.dataset.pack; d.cats = null; repick(before); });
  on('[data-dir]', (b) => { d.dir = b.dataset.dir; });
  on('[data-diff]', (b) => { d.diff = Number(b.dataset.diff); });
  on('[data-cat]', (b) => {
    const all = packOf(d).categories.map((c) => c.key);
    const cur = new Set(d.cats || all);
    if (cur.has(b.dataset.cat)) cur.delete(b.dataset.cat); else cur.add(b.dataset.cat);
    d.cats = cur.size === all.length ? null : all.filter((k) => cur.has(k));
  });
  const cancel = $('cancelBtn');
  if (cancel) cancel.onclick = () => { draft = null; go('play'); };
  const start = $('startBtn');
  if (start) start.onclick = () => {
    state.sound = $('soundChk').checked;
    state.settings = { ...d };
    saveState();
    draft = null;
    current = null;
    placement = null;
    go('play');
  };
}

// ----- Play -----
function renderPlay() {
  const c = ctx();
  // Første gang: tilbyd niveautest, så man ikke skal terpe det, man allerede kan.
  if (!current && !c.native && !c.prog.offered && !Object.keys(c.prog.cards).length && c.pool.length >= 30) {
    view = 'offer';
    renderOffer();
    return;
  }
  if (!current) {
    const next = pickNext(c);
    if (!next) { $('app').innerHTML = `<p class="task-q">${esc(t('empty'))}</p>`; return; }
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
    return;
  }
  renderPlayView();
}

function meaningHTML(c, x) {
  if (c.pics) return picHTML(x);
  return `<span class="w${x.phrase ? ' long' : ''}" lang="${c.s.base}">${esc(x.words[c.s.base])}</span>`;
}
const picHTML = (x, cls = 'pic') => `<img class="${cls}" src="images/words/${encodeURI(IMG[x.id] || '')}" alt="" draggable="false" decoding="async">`;
const targetHTML = (c, x) => `<span class="w${x.phrase ? ' long' : ''}" lang="${c.s.target}">${esc(x.words[c.s.target])}</span>`;

function questionText(c, x, kind) {
  const L = UI[uiLang()].lang;
  const T = L[c.s.target].toLowerCase();
  if (kind === 'build') return t('qBuild', { T });
  if (kind === 'write') return c.pics ? t('qWriteN') : t('qWrite', { T });
  const rec = current.qdir === 'rec';
  if (c.pics) return rec ? t('qRecN') : t('qProdN');
  if (x.phrase) return rec ? t('qRecP') : t('qProdP', { T });
  return rec ? t('qRec') : t('qProd', { T });
}

// Mærkat øverst i opgaven. I forløbet viser den, hvilket trin man er på.
function badgeText(c, x) {
  const card = c.prog.cards[x.id];
  if (current.kind === 'new' || current.isNew) return t('newQ');
  if (card && card.verify) return t('check');
  if (c.s.dir === 'path') return current.kind === 'write' || current.kind === 'build' ? t('writeNB') : dirName(current.qdir, true);
  return t('repeat');
}

function metaHTML(c, x) {
  const now = Date.now();
  const introduced = c.pool.filter((p) => c.prog.cards[p.id]);
  const dueCount = introduced.filter((p) => dueness(c.prog.cards[p.id], c.prog, now) >= 1).length;
  const score = scoreOf(c.prog);
  void x;
  return `${ctxBarHTML(c)}<div class="meta"><span>${esc(t('progress', { n: score, m: c.pool.length }))}</span>
    <span>${esc(t('due', { n: dueCount }))}</span></div>
    <div class="progress"><div style="width:${Math.min(100, (score / Math.max(1, c.pool.length)) * 100)}%"></div></div>`;
}

function optionsHTML(c, x, answered) {
  const rec = current.qdir === 'rec';
  let html = `<div class="options${x.phrase ? ' wide' : ''}${rec && c.pics ? ' pics' : ''}">`;
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
    <div class="slots${state2}" style="--n:${n}" lang="${c.s.target}" aria-label="${esc(done ? x.words[c.s.target] : '')}">
      ${sp.prefix ? `<span class="prefix">${esc(sp.prefix)}</span>` : ''}${slots}</div>
    ${done ? '' : `<div class="keys" style="--cols:${w.cols}">${keys}</div>`}
    <div class="feedback" aria-live="polite">`;
  if (done) {
    html += w.answered === 'ok' ? `<div class="msg good">${esc(t('correct'))}</div>`
      : `<div class="msg almost">${esc(t('almost'))}</div><button class="primary" id="nextBtn">${esc(t('next'))} →</button>`;
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

function feedbackReceiptHTML() {
  return `<div class="answer-receipt" role="status" aria-live="polite" aria-atomic="true">${lastFeedback ? `<span aria-hidden="true">✓</span> ${esc(t('correct'))} · <span lang="${lastFeedback.lang}">${esc(lastFeedback.word)}</span>${lastFeedback.meaning ? ` — ${esc(lastFeedback.meaning)}` : ''}` : ''}</div>`;
}
function renderPlayView() {
  const c = ctx();
  const x = current.concept;
  const rec = current.qdir === 'rec';
  const speakBtn = `<button class="speak" id="speakBtn" aria-label="${esc(t('sound'))}">${SPEAK_SVG}</button>`;
  let html = metaHTML(c, x) + feedbackReceiptHTML();

  if (current.kind === 'intro') {
    html += `<div class="prompt${c.pics ? ' pics' : ''}"><span class="badge">${esc(t('newWord'))}</span>${speakBtn}
      ${c.pics ? picHTML(x) : ''}
      ${targetHTML(c, x)}
      ${c.pics ? '' : `<span class="sub">${esc(x.words[c.s.base])}</span>`}
    </div>
    <div class="feedback" aria-live="polite"><button class="primary" id="nextBtn">${esc(t('next'))} →</button></div>`;
  } else if (current.kind === 'write') {
    // Børn hører ordet (højttaler); ved oversættelse vises betydningen.
    html += `<div class="prompt write${c.pics ? ' pics' : ''}"><span class="badge">${esc(badgeText(c, x))}</span>${c.pics || current.answered ? speakBtn : ''}
      ${meaningHTML(c, x)}
    </div>${writeHTML(c, x)}`;
  } else if (current.kind === 'build') {
    const sp = current.spec;
    const built = current.picked.map((i) => current.tiles[i].tk);
    html += `<div class="prompt${c.pics ? ' pics' : ''}"><span class="badge">${esc(badgeText(c, x))}</span>
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
        : `<div class="msg bad">${esc(t('wrongBuild'))} <b>${esc(x.words[c.s.target])}</b></div><button class="primary" id="nextBtn">${esc(t('next'))} →</button>`;
    } else {
      html += `<div class="row center"><button class="secondary" id="dkBtn">${esc(t('dontKnow'))}</button>
        <button class="primary" id="checkBtn" ${current.picked.length ? '' : 'disabled'}>${esc(t('checkBtn'))}</button></div>`;
    }
    html += `</div>`;
  } else {
    html += `<div class="prompt${c.pics && !rec ? ' pics' : ''}"><span class="badge">${esc(badgeText(c, x))}</span>${speakBtn}
      ${rec ? targetHTML(c, x) : meaningHTML(c, x)}
    </div>
    <p class="task-q">${esc(questionText(c, x, current.kind))}</p>
    ${optionsHTML(c, x, current.answered)}
    <div class="feedback" aria-live="polite">`;
    if (current.answered) {
      const ok = current.answered === x.id;
      html += `<div class="msg ${ok ? 'good' : 'bad'}">${esc(ok ? t('correct') : t('wrong'))}</div>`;
      if (!ok) html += `<button class="primary" id="nextBtn">${esc(t('next'))} →</button>`;
    } else if (current.kind === 'new') {
      html += `<button class="secondary" id="dkBtn">${esc(t('dontKnow'))}</button>`;
    }
    html += `</div>`;
  }
  $('app').innerHTML = html + wordSaveHTML(x);
  bindCtxBar();
  bindWordSave(x);

  const sb = $('speakBtn');
  if (sb) sb.onclick = () => speakTarget(x);
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
  c.prog.lastId = x.id;
  saveState();
  const correct = current.answered === x.id || current.answered === 'ok';
  lastFeedback = correct ? { word: x.words[c.s.target], meaning: c.pics ? '' : x.words[c.s.base], lang: c.s.target } : null;
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
    current = { kind: 'intro', concept: x, answered: null };
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
  grade(c, x, correct);
  current.answered = correct ? 'ok' : 'bad';
  finishTask(c, x, before);
  if (correct) advance();
}

function advance() {
  clearTimeout(timer);
  if (view === 'place') { advancePlace(); return; }
  if (current && current.kind === 'intro') {
    const c = ctx();
    c.prog.cards[current.concept.id] = newCard(c, 0, false, { wrong: 0 });
    c.prog.task += 1;
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
  $('app').innerHTML = `${ctxBarHTML(c)}<section class="offer">
    <div class="prompt"><span class="w long">${esc(t('placeTitle'))}</span>
      <span class="sub">${esc(t('placeLead'))}</span></div>
    <div class="row center">
      <button class="secondary" id="skipBtn">${esc(t('placeSkip'))}</button>
      <button class="primary" id="placeBtn">${esc(t('placeStart'))}</button>
    </div></section>`;
  bindCtxBar();
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
  let html = `${ctxBarHTML(c)}<div class="meta"><span>${esc(t('placeBadge'))}</span><span>${esc(t('rank', { n: rankOf(c.s, x.id) }))}</span></div>
    <div class="progress"><div style="width:${Math.min(100, ((P.block + 1) / P.bounds.length) * 100)}%"></div></div>
    <div class="prompt"><span class="badge">${esc(t('placeBadge'))}</span>
      ${rec ? targetHTML(c, x) : meaningHTML(c, x)}</div>
    <p class="task-q">${esc(questionText(c, x, 'quiz'))}</p>
    ${optionsHTML(c, x, current.answered)}
    ${feedbackReceiptHTML()}
    <div class="feedback" aria-live="polite">${current.answered ? `<button class="primary" id="nextBtn">${esc(t('next'))} →</button>` : `<button class="secondary" id="dkBtn">${esc(t('dontKnow'))}</button>`}</div>`;
  $('app').innerHTML = html;
  bindCtxBar();
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
  lastFeedback = correct ? { word: current.concept.words[c.s.target], meaning: current.concept.words[c.s.base], lang: c.s.target } : null;
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
  let j = 0;
  for (const x of c.pool.slice(0, P.passedEnd)) {
    if (c.prog.cards[x.id] || P.wrong.includes(x.id)) continue;
    c.prog.cards[x.id] = {
      lvl: CONFIG.placedLevel, ok: true, verify: true, right: 0, wrong: 0,
      task: c.prog.task + j * 3, time: now + j * 8 * 60000,
    };
    j++;
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
    <div class="row center"><button class="primary" id="goBtn">${esc(t('next'))} →</button></div></section>`;
  $('goBtn').onclick = () => { placement = null; view = 'play'; current = null; render(); };
}

// ----- Stats -----
function fmtDuration(min) {
  const ul = uiLang();
  const dec = ul === 'en' ? '.' : ',';
  const H = { da: 't', en: 'h', ru: 'ч', uk: 'год' }[ul];
  const D = { da: 'd', en: 'd', ru: 'дн', uk: 'дн' }[ul];
  if (min < 60) return `${Math.round(min)} min`;
  if (min < 60 * 24) return `${(min / 60).toFixed(min < 600 ? 1 : 0).replace('.', dec)} ${H}`;
  return `${(min / 1440).toFixed(min < 14400 ? 1 : 0).replace('.', dec)} ${D}`;
}

function renderStats() {
  const c = ctx();
  const now = Date.now();
  const ids = Object.keys(c.prog.cards).filter((id) => ITEM[id] && c.pool.some((p) => p.id === id))
    .sort((a, b) => rankOf(c.s, a) - rankOf(c.s, b));
  const cols = t('cols');
  let html = `<section class="stats"><div class="row" style="justify-content:space-between">
      <h1>${esc(t('stats'))}</h1><button class="secondary" id="backBtn">← ${esc(t('back'))}</button></div>
    <div class="explain"><b>${esc(t('howTitle'))}</b><p>${esc(t('explainSimple'))}</p>
      <details><summary>${esc(t('formula'))}</summary><p>${fill(t('explain'), { tu: CONFIG.taskUnit, b: CONFIG.base, mu: CONFIG.timeUnitMin, ll: CONFIG.learnedLevel })}</p></details></div>`;

  if (!ids.length) {
    html += `<p class="task-q">${esc(t('noStats'))}</p>`;
  } else {
    html += `<div class="table-wrap"><table><thead><tr>${cols.map((h) => `<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>`;
    for (const id of ids) {
      const x = ITEM[id];
      const card = c.prog.cards[id];
      const f = intervalFactor(card.lvl);
      const p = dueness(card, c.prog, now);
      const status = card.verify ? `<span class="dot"></span>${esc(t('checkS'))}`
        : isLearned(card) ? `<span class="dot ok"></span>${esc(t('learnedS'))}`
        : card.wrong && !card.ok ? `<span class="dot no"></span>${esc(t('wrongS'))}`
        : `<span class="dot"></span>${esc(t('notYet'))}`;
      const meaning = c.pics ? picHTML(x, 'pic-sm') : esc(x.words[c.s.base]);
      const ipm = !isPack(c.s) && IPM[c.s.target] ? (IPM[c.s.target][id] || 0).toLocaleString(uiLang()) : '–';
      html += `<tr>
        <td class="num">${rankOf(c.s, id)}</td>
        <td class="wrap"><b>${esc(x.words[c.s.target])}</b></td>
        <td class="num">${ipm}</td>
        <td class="wrap">${meaning}</td>
        <td class="num">${card.lvl}</td>
        <td class="num">${CONFIG.taskUnit * f} ${esc(t('tasks'))} · ${fmtDuration(CONFIG.timeUnitMin * f)}</td>
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
    delete state.progress[c.key];
    saveState();
    current = null;
    go('play');
  };
}

// ---------- Global events ----------
$('homeBtn').onclick = (e) => { e.preventDefault(); go(state.settings ? 'play' : 'setup'); };
$('statsBtn').onclick = () => go(view === 'stats' ? 'play' : 'stats');
$('libraryBtn').onclick = () => go('library');
$('setupBtn').onclick = () => go('setup');
$('soundBtn').onclick = () => {
  state.sound = !state.sound;
  saveState();
  if (!state.sound && 'speechSynthesis' in window) speechSynthesis.cancel();
  $('soundBtn').classList.toggle('off', !state.sound);
  $('soundBtn').setAttribute('aria-pressed', String(state.sound));
};
document.addEventListener('keydown', (e) => {
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
