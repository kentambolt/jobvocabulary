'use strict';
const LIBRARY_TEXT = {
  "da": {
    "title": "Mine ord",
    "favorites": "Gemte ord",
    "lists": "Mine lister",
    "newList": "Ny liste",
    "listName": "Listenavn",
    "create": "Opret liste",
    "search": "Søg i alle ord og sætninger",
    "addOwn": "Tilføj eget ord",
    "word": "Ord på det sprog, du lærer",
    "translation": "Oversættelse på dit sprog",
    "save": "Gem",
    "addTo": "Føj til liste",
    "remove": "Fjern fra listen",
    "practice": "Øv denne liste",
    "empty": "Listen er tom endnu. Gem et ord fra en øvelse, eller find et nedenfor.",
    "local": "Listerne gemmes kun i denne browser. Hent en sikkerhedskopi, hvis du vil passe på dem.",
    "export": "Hent sikkerhedskopi",
    "found": "Fundet i ordbogen",
    "notFound": "Ingen oversættelse fundet. Du kan tilføje din egen nedenfor.",
    "saveWord": "Gem ord",
    "saved": "Gemt",
    "choose": "Vælg liste",
    "delete": "Slet liste",
    "deleteQ": "Slet denne liste? Ordene bliver i dine andre lister.",
    "back": "Tilbage til øvelsen",
    "dictionaryCount": "ord og sætninger i den fælles ordbog",
    "nameError": "Skriv et listenavn.",
    "wordError": "Vælg to forskellige sprog, og udfyld begge ord.",
    "pairNote": "Du kan øve de ord, der har en oversættelse på begge valgte sprog.",
    "edit": "Rediger eget ord",
    "update": "Opdater",
    "noPair": "Ingen ord i listen har oversættelser på dette sprogpar.",
    "more": "Vis flere",
    "import": "Indlæs sikkerhedskopi",
    "imported": "Sikkerhedskopien er indlæst.",
    "importError": "Filen er ikke en gyldig sikkerhedskopi.",
    "chooseAnother": "Vælg en anden liste for at gemme ordet dér.",
    "unfavorite": "Fjern fra gemte ord",
    "custom": "Egne ord",
    "filter": "Søg i denne liste",
    "noMatches": "Ingen ord matcher din søgning.",
    "rename": "Omdøb liste",
    "duplicateName": "Du har allerede en liste med det navn.",
    "targetLanguage": "Jeg lærer",
    "baseLanguage": "Oversæt til",
    "listen": "Hør ordet",
    "backup": "Sikkerhedskopi og flytning"
  },
  "en": {
    "title": "My words",
    "favorites": "Saved words",
    "lists": "My lists",
    "newList": "New list",
    "listName": "List name",
    "create": "Create list",
    "search": "Search all words and phrases",
    "addOwn": "Add your own word",
    "word": "Word in the language you are learning",
    "translation": "Translation in your language",
    "save": "Save",
    "addTo": "Add to list",
    "remove": "Remove from list",
    "practice": "Practise this list",
    "empty": "This list is empty. Save a word from an exercise or find one below.",
    "local": "Lists are stored only in this browser. Download a backup to keep them safe.",
    "export": "Download backup",
    "found": "Found in the dictionary",
    "notFound": "No translation found. You can add your own below.",
    "saveWord": "Save word",
    "saved": "Saved",
    "choose": "Choose a list",
    "delete": "Delete list",
    "deleteQ": "Delete this list? Words remain in your other lists.",
    "back": "Back to practice",
    "dictionaryCount": "words and phrases in the shared dictionary",
    "nameError": "Enter a list name.",
    "wordError": "Choose two different languages and fill in both words.",
    "pairNote": "You can practise words with translations in both selected languages.",
    "edit": "Edit your own word",
    "update": "Update",
    "noPair": "No words in this list have translations for this language pair.",
    "more": "Show more",
    "import": "Import backup",
    "imported": "Your backup has been imported.",
    "importError": "This file is not a valid backup.",
    "chooseAnother": "Choose another list to save the word there.",
    "unfavorite": "Remove from saved words",
    "custom": "Your own words",
    "filter": "Search this list",
    "noMatches": "No words match your search.",
    "rename": "Rename list",
    "duplicateName": "You already have a list with that name.",
    "targetLanguage": "I am learning",
    "baseLanguage": "Translate into",
    "listen": "Listen to the word",
    "backup": "Backup and transfer"
  },
  "ru": {
    "title": "Мои слова",
    "favorites": "Сохранённые слова",
    "lists": "Мои списки",
    "newList": "Новый список",
    "listName": "Название списка",
    "create": "Создать список",
    "search": "Поиск по словам и фразам",
    "addOwn": "Добавить своё слово",
    "word": "Слово на изучаемом языке",
    "translation": "Перевод на вашем языке",
    "save": "Сохранить",
    "addTo": "Добавить в список",
    "remove": "Убрать из списка",
    "practice": "Учить этот список",
    "empty": "Список пока пуст. Сохраните слово из упражнения или найдите его ниже.",
    "local": "Списки хранятся только в этом браузере. Скачайте резервную копию.",
    "export": "Скачать резервную копию",
    "found": "Найдено в словаре",
    "notFound": "Перевод не найден. Добавьте свой ниже.",
    "saveWord": "Сохранить слово",
    "saved": "Сохранено",
    "choose": "Выберите список",
    "delete": "Удалить список",
    "deleteQ": "Удалить список? Слова останутся в других списках.",
    "back": "Вернуться к упражнениям",
    "dictionaryCount": "слов и фраз в общем словаре",
    "nameError": "Введите название списка.",
    "wordError": "Выберите два разных языка и заполните оба слова.",
    "pairNote": "Можно учить слова с переводом на оба выбранных языка.",
    "edit": "Изменить своё слово",
    "update": "Обновить",
    "noPair": "В списке нет слов с переводом для этой языковой пары.",
    "more": "Показать ещё",
    "import": "Загрузить резервную копию",
    "imported": "Резервная копия загружена.",
    "importError": "Это не файл резервной копии.",
    "chooseAnother": "Выберите другой список, чтобы сохранить слово в нём.",
    "unfavorite": "Убрать из сохранённых слов",
    "custom": "Свои слова",
    "filter": "Поиск в этом списке",
    "noMatches": "Нет слов по вашему запросу.",
    "rename": "Переименовать список",
    "duplicateName": "Список с таким названием уже существует.",
    "targetLanguage": "Я изучаю",
    "baseLanguage": "Переводить на",
    "listen": "Послушать слово",
    "backup": "Резервная копия и перенос"
  },
  "uk": {
    "title": "Мої слова",
    "favorites": "Збережені слова",
    "lists": "Мої списки",
    "newList": "Новий список",
    "listName": "Назва списку",
    "create": "Створити список",
    "search": "Пошук за словами й фразами",
    "addOwn": "Додати своє слово",
    "word": "Слово мовою, яку ви вивчаєте",
    "translation": "Переклад вашою мовою",
    "save": "Зберегти",
    "addTo": "Додати до списку",
    "remove": "Прибрати зі списку",
    "practice": "Вивчати цей список",
    "empty": "Список поки порожній. Збережіть слово з вправи або знайдіть його нижче.",
    "local": "Списки зберігаються лише в цьому браузері. Завантажте резервну копію.",
    "export": "Завантажити резервну копію",
    "found": "Знайдено у словнику",
    "notFound": "Переклад не знайдено. Додайте свій нижче.",
    "saveWord": "Зберегти слово",
    "saved": "Збережено",
    "choose": "Виберіть список",
    "delete": "Видалити список",
    "deleteQ": "Видалити список? Слова залишаться в інших списках.",
    "back": "Повернутися до вправ",
    "dictionaryCount": "слів і фраз у спільному словнику",
    "nameError": "Введіть назву списку.",
    "wordError": "Виберіть дві різні мови й заповніть обидва слова.",
    "pairNote": "Можна вивчати слова з перекладом обома вибраними мовами.",
    "edit": "Змінити своє слово",
    "update": "Оновити",
    "noPair": "У списку немає слів із перекладом для цієї мовної пари.",
    "more": "Показати ще",
    "import": "Імпортувати резервну копію",
    "imported": "Резервну копію імпортовано.",
    "importError": "Це не файл резервної копії.",
    "chooseAnother": "Виберіть інший список, щоб зберегти слово в ньому.",
    "unfavorite": "Прибрати зі збережених слів",
    "custom": "Власні слова",
    "filter": "Пошук у цьому списку",
    "noMatches": "Немає слів за вашим запитом.",
    "rename": "Перейменувати список",
    "duplicateName": "Список із такою назвою вже існує.",
    "targetLanguage": "Я вивчаю",
    "baseLanguage": "Перекладати на",
    "listen": "Послухати слово",
    "backup": "Резервна копія та перенесення"
  }
};
const lt = (key) => LIBRARY_TEXT[uiLang()][key];
let dictionaryData = null;
let dictionaryPromise = null;
let libraryActive = 'favorites';
let libraryVisible = 50;
let libraryFilter = '';
let librarySearch = '';
const dictionaryNorm = (s) => s.trim().toLocaleLowerCase().normalize('NFC');
function libraryPair() {
  const target = state.libraryPair?.target || state.settings?.target || 'da';
  const preferred = state.libraryPair?.base || state.settings?.base || uiLang();
  return { target, base: preferred === target ? (target === 'en' ? 'da' : 'en') : preferred };
}
function libraryFilteredItems() {
  const q = dictionaryNorm(libraryFilter);
  return (wordLibrary.list(libraryActive)?.items || []).filter((id) => !q || Object.values(ITEM[canonicalWord(id)]?.words || {}).some((word) => dictionaryNorm(word).includes(q)));
}
function libraryAudio(x, lang) {
  return x.words[lang] && 'speechSynthesis' in window ? `<button class="secondary library-audio" data-listen-word="${esc(x.id)}" data-listen-lang="${lang}" aria-label="${esc(lt('listen') + ': ' + x.words[lang])}">${SPEAK_SVG}</button>` : '';
}
function bindLibraryAudio(container) {
  container.querySelectorAll('[data-listen-word]').forEach((button) => button.onclick = () => speak(ITEM[button.dataset.listenWord].words[button.dataset.listenLang], button.dataset.listenLang, true));
}
function renameLibraryList() {
  const dialog = $('saveWordDialog');
  dialog.setAttribute('aria-label', lt('rename'));
  dialog.innerHTML = `<form id="renameListForm"><h2>${esc(lt('rename'))}</h2><label for="renameListName">${esc(lt('listName'))}</label><input id="renameListName" maxlength="60" required value="${esc(libraryTitle(libraryActive))}"><p id="renameListError" role="status"></p><div class="row actions"><button type="button" class="secondary" id="cancelRename">${esc(t('cancel'))}</button><button class="primary">${esc(lt('save'))}</button></div></form>`;
  $('cancelRename').onclick = () => dialog.close();
  $('renameListForm').onsubmit = (event) => {
    event.preventDefault();
    try { wordLibrary.renameList(libraryActive, $('renameListName').value); saveState(); dialog.close(); renderLibrary(); }
    catch (error) { $('renameListError').textContent = lt(error.message === 'duplicate' ? 'duplicateName' : 'nameError'); }
  };
  dialog.showModal(); $('renameListName').select();
}
function libraryTitle(id) { return id === 'favorites' ? lt('favorites') : wordLibrary.list(id)?.name || lt('title'); }
function canonicalWord(id) { return dictionaryData?.aliases[id] || id; }
function registerOwnWords() {
  for (const [id, entry] of Object.entries(wordLibrary.data.custom)) {
    if (entry?.words && typeof entry.words === 'object') ITEM[id] = { id, words: entry.words, phrase: !!entry.phrase, pos: 'custom', diff: 1 };
  }
}
function loadDictionary() {
  if (dictionaryData) return Promise.resolve(dictionaryData);
  if (!dictionaryPromise) dictionaryPromise = fetch(`lexicon.json?v=${LEXICON_INDEX.version}`).then((r) => {
    if (!r.ok) throw new Error('dictionary');
    return r.json();
  }).then((data) => {
    if (data.version === 2) data.aliases = Object.fromEntries(Object.entries(data.aliases).map(([key, index]) => [key, data.entries[index][0]]));
    dictionaryData = data;
    const previousRefs = JSON.stringify([wordLibrary.data.favorites, wordLibrary.data.lists]);
    wordLibrary.remapReferences(canonicalWord);
    if (previousRefs !== JSON.stringify([wordLibrary.data.favorites, wordLibrary.data.lists])) saveState();
    for (const [id, da, en, ru, uk, phrase, image] of data.entries) ITEM[id] = { id, words: { da, en, ru, uk }, phrase: !!phrase, pos: 'dictionary', diff: 1, image };
    registerOwnWords();
    return data;
  }).catch((error) => { dictionaryPromise = null; throw error; });
  return dictionaryPromise;
}
function listPool(id, pair) {
  return (wordLibrary.list(id)?.items || []).map((ref) => ITEM[canonicalWord(ref)]).filter((entry) => entry && entry.words[pair.target] && entry.words[pair.base]);
}
function dictionaryMatches(query, pair, limit = 20) {
  const q = dictionaryNorm(query);
  if (!q) return [];
  return Object.values(ITEM).filter((x) => (x.id.startsWith('lex:') || x.id.startsWith('user:')) && x.words[pair.target] && x.words[pair.base] && [x.words[pair.target], x.words[pair.base]].some((w) => dictionaryNorm(w).includes(q)))
    .sort((a, b) => Number(dictionaryNorm(b.words[pair.target]) === q || dictionaryNorm(b.words[pair.base]) === q) - Number(dictionaryNorm(a.words[pair.target]) === q || dictionaryNorm(a.words[pair.base]) === q))
    .slice(0, limit);
}
function saveToListDialog(sourceId) {
  clearTimeout(timer);
  loadDictionary().then(() => {
    const id = canonicalWord(sourceId);
    const dialog = $('saveWordDialog');
    dialog.setAttribute('aria-label', lt('addTo'));
    dialog.innerHTML = `<form method="dialog" id="saveWordForm"><h2>${esc(lt('addTo'))}</h2><label for="wordListSelect">${esc(lt('choose'))}</label><select id="wordListSelect"><option value="favorites">${esc(lt('favorites'))}</option>${wordLibrary.data.lists.map((list) => `<option value="${esc(list.id)}">${esc(list.name)}</option>`).join('')}</select><label for="wordNewList">${esc(lt('newList'))}</label><input id="wordNewList" maxlength="60" autocomplete="off"><div class="row actions"><button class="secondary" value="cancel">${esc(t('cancel'))}</button><button class="primary" id="saveToList" value="save">${esc(lt('save'))}</button></div><p id="saveWordMessage" role="status"></p></form>`;
    $('saveToList').onclick = (event) => {
      event.preventDefault();
      const name = $('wordNewList').value.trim();
      const listId = name ? wordLibrary.createList(name).id : $('wordListSelect').value;
      wordLibrary.add(id, listId); saveState(); dialog.close();
      const button = $('favoriteWordBtn');
      if (button) updateFavoriteButton(button, sourceId);
      if (view === 'library') renderLibrary();
    };
    dialog.showModal();
  }).catch(() => { const status = $('wordSaveStatus'); if (status) status.textContent = t('loadFail'); });
}
function updateFavoriteButton(button, sourceId) {
  const saved = wordLibrary.data.favorites.includes(canonicalWord(sourceId));
  button.setAttribute('aria-pressed', String(saved));
  button.textContent = saved ? `♥ ${lt('saved')}` : `♡ ${lt('saveWord')}`;
  button.title = saved ? lt('unfavorite') : lt('saveWord');
}
function wordSaveHTML(x) {
  const saved = wordLibrary.data.favorites.includes(canonicalWord(x.id));
  return `<div class="word-save"><button class="secondary" id="favoriteWordBtn" aria-pressed="${saved}">${saved ? `♥ ${esc(lt('saved'))}` : `♡ ${esc(lt('saveWord'))}`}</button><button class="secondary" id="wordListBtn">${esc(lt('addTo'))}</button><span id="wordSaveStatus" role="status"></span></div>`;
}
function bindWordSave(x) {
  $('favoriteWordBtn').onclick = async (event) => {
    const button = event.currentTarget;
    button.disabled = true;
    try { await loadDictionary(); wordLibrary.toggle(canonicalWord(x.id)); saveState(); updateFavoriteButton(button, x.id); }
    catch { $('wordSaveStatus').textContent = t('loadFail'); }
    finally { button.disabled = false; }
  };
  $('wordListBtn').onclick = () => saveToListDialog(x.id);
}
function renderSavedLibraryRows(pair) {
  const list = wordLibrary.list(libraryActive);
  const filtered = libraryFilteredItems();
  const row = (id) => {
    const x = ITEM[canonicalWord(id)];
    if (!x) return `<li class="library-word"><span>${esc(id)}</span><button class="secondary" data-remove-word="${esc(id)}">${esc(lt('remove'))}</button></li>`;
    return `<li class="library-word"><div><b lang="${pair.target}">${esc(x.words[pair.target] || '—')}</b><span lang="${pair.base}">${esc(x.words[pair.base] || '—')}</span></div><div class="library-row-actions">${libraryAudio(x, pair.target)}<button class="secondary" data-add-word="${esc(id)}">${esc(lt('addTo'))}</button>${id.startsWith('user:') ? `<button class="secondary" data-edit-word="${esc(id)}">${esc(lt('edit'))}</button>` : ''}<button class="secondary" data-remove-word="${esc(id)}">${esc(lt('remove'))}</button></div></li>`;
  };
  $('savedListResults').innerHTML = list.items.length ? filtered.length ? `<ul class="library-words">${filtered.slice(0, libraryVisible).map(row).join('')}</ul>${filtered.length > libraryVisible ? `<button class="secondary" id="moreLibraryWords">${esc(lt('more'))}</button>` : ''}` : `<p role="status">${esc(lt('noMatches'))}</p>` : `<p class="empty-list">${esc(lt('empty'))}</p>`;
  $('listFilterControl').hidden = !list.items.length;
  $('libraryListTitle').innerHTML = `${esc(libraryTitle(libraryActive))} <small>${list.items.length}</small>`;
  $('practiceList').disabled = !listPool(libraryActive, pair).length;
  $('app').querySelectorAll('[data-list-id]').forEach((button) => button.querySelector('small').textContent = wordLibrary.list(button.dataset.listId).items.length);
  bindLibraryAudio($('savedListResults'));
  $('app').querySelectorAll('[data-remove-word]').forEach((button) => button.onclick = () => { wordLibrary.remove(button.dataset.removeWord, libraryActive); saveState(); renderSavedLibraryRows(pair); renderDictionaryResults(pair); });
  $('app').querySelectorAll('[data-add-word]').forEach((button) => button.onclick = () => saveToListDialog(button.dataset.addWord));
  $('app').querySelectorAll('[data-edit-word]').forEach((button) => button.onclick = () => {
    const id = button.dataset.editWord; const entry = wordLibrary.data.custom[id];
    $('customWordDetails').open = true; $('customWordForm').dataset.editId = id;
    $('ownWord').value = entry.words[pair.target] || ''; $('ownTranslation').value = entry.words[pair.base] || ''; $('saveOwnWord').textContent = lt('update'); $('ownWord').focus();
  });
  if ($('moreLibraryWords')) $('moreLibraryWords').onclick = () => { libraryVisible += 50; renderSavedLibraryRows(pair); };
}
function renderLibrary() {
  if (!dictionaryData) {
    $('app').innerHTML = `<p role="status">${esc(t('loading'))}</p>`;
    loadDictionary().then(() => { if (view === 'library') renderLibrary(); }, () => {
      if (view === 'library') { $('app').innerHTML = `<p>${esc(t('loadFail'))}</p><button id="dictionaryRetry" class="primary">${esc(lt('title'))}</button>`; $('dictionaryRetry').onclick = renderLibrary; }
    });
    return;
  }
  if (!wordLibrary.list(libraryActive)) libraryActive = 'favorites';
  const pair = libraryPair();
  const list = wordLibrary.list(libraryActive);
  const options = (selected) => Object.keys(LANGS).map((lang) => `<option value="${lang}"${lang === selected ? ' selected' : ''}>${esc(LANGS[lang].name)}</option>`).join('');
  $('app').innerHTML = `<section class="library"><h1>${esc(lt('title'))}</h1><div class="library-pair"><div><label for="libraryTarget">${esc(lt('targetLanguage'))}</label><select id="libraryTarget">${options(pair.target)}</select></div><div><label for="libraryBase">${esc(lt('baseLanguage'))}</label><select id="libraryBase">${options(pair.base)}</select></div></div><p id="libraryMessage" role="status"></p>
    <nav class="list-tabs" aria-label="${esc(lt('lists'))}">${[{ id: 'favorites', name: lt('favorites'), items: wordLibrary.data.favorites }, ...wordLibrary.data.lists].map((entry) => `<button class="chip" data-list-id="${esc(entry.id)}" aria-pressed="${entry.id === libraryActive}">${esc(entry.name)} <small>${entry.items.length}</small></button>`).join('')}</nav>
    <form class="new-list-form" id="newListForm"><label for="newListName">${esc(lt('newList'))}</label><div class="row"><input id="newListName" maxlength="60" placeholder="${esc(lt('listName'))}" required><button class="secondary">${esc(lt('create'))}</button></div></form>
    <div class="library-title"><h2 id="libraryListTitle">${esc(libraryTitle(libraryActive))} <small>${list.items.length}</small></h2><button class="primary" id="practiceList"${listPool(libraryActive, pair).length ? '' : ' disabled'}>${esc(lt('practice'))}</button></div><p class="course-note">${esc(lt('pairNote'))}</p>
    <div id="listFilterControl"${list.items.length ? '' : ' hidden'}><label for="listFilter">${esc(lt('filter'))}</label><input id="listFilter" type="search" value="${esc(libraryFilter)}" autocomplete="off" aria-controls="savedListResults"></div>
    <div id="savedListResults"></div>
    ${libraryActive !== 'favorites' ? `<div class="list-management"><button class="secondary" id="renameLibraryList">${esc(lt('rename'))}</button><button class="text-button" id="deleteLibraryList">${esc(lt('delete'))}</button></div>` : ''}
    <section class="dictionary-search"><h2>${esc(lt('search'))}</h2><p class="course-note">${LEXICON_INDEX.entries.toLocaleString(uiLang())} ${esc(lt('dictionaryCount'))}</p><label for="librarySearch">${esc(lt('search'))}</label><input id="librarySearch" type="search" autocomplete="off" aria-controls="dictionaryResults"><div id="dictionaryResults" aria-live="polite"></div></section>
    <details class="custom-word" id="customWordDetails"><summary>${esc(lt('addOwn'))}</summary><form id="customWordForm"><label for="ownTarget">${esc(lt('word'))}</label><select id="ownTarget">${options(pair.target)}</select><input aria-label="${esc(lt('word'))}" id="ownWord" maxlength="300" required autocomplete="off"><label for="ownBase">${esc(lt('translation'))}</label><select id="ownBase">${options(pair.base)}</select><input aria-label="${esc(lt('translation'))}" id="ownTranslation" maxlength="300" required autocomplete="off"><p id="translationHint" role="status"></p><button class="primary" id="saveOwnWord">${esc(lt('save'))}</button></form></details>
    <details class="library-transfer"><summary>${esc(lt('backup'))}</summary><p class="course-note">${esc(lt('local'))}</p><div class="library-backup"><button class="secondary" id="exportLibrary">${esc(lt('export'))}</button><label class="secondary import-label">${esc(lt('import'))}<input type="file" id="importLibrary" accept="application/json,.json"></label></div></details>
    ${state.settings ? `<p><button class="secondary" id="libraryBack">${esc(lt('back'))}</button></p>` : ''}</section>`;
  $('app').querySelectorAll('[data-list-id]').forEach((button) => button.onclick = () => { libraryActive = button.dataset.listId; libraryVisible = 50; libraryFilter = ''; renderLibrary(); });
  for (const [id, field, other] of [['libraryTarget', 'target', 'base'], ['libraryBase', 'base', 'target']]) $(id).onchange = () => {
    const updated = { ...pair, [field]: $(id).value };
    if (updated[field] === updated[other]) updated[other] = pair[field];
    state.libraryPair = updated; saveState(); renderLibrary();
  };
  renderSavedLibraryRows(pair);
  if ($('renameLibraryList')) $('renameLibraryList').onclick = renameLibraryList;
  if ($('listFilter')) $('listFilter').oninput = (event) => {
    libraryFilter = event.target.value; libraryVisible = 50;
    renderSavedLibraryRows(pair);
  };
  $('newListForm').onsubmit = (event) => { event.preventDefault(); try { libraryActive = wordLibrary.createList($('newListName').value).id; saveState(); renderLibrary(); } catch { $('libraryMessage').textContent = lt('nameError'); } };
  $('practiceList').onclick = () => {
    const previous = state.settings || {};
    state.settings = { ...previous, ...pair, pack: 'list:' + libraryActive, dir: 'rec', diff: 3, cats: null };
    saveState(); current = null; placement = null; go('play');
  };
  if ($('deleteLibraryList')) $('deleteLibraryList').onclick = () => { if (confirm(lt('deleteQ'))) { wordLibrary.data.lists = wordLibrary.data.lists.filter((entry) => entry.id !== libraryActive); libraryActive = 'favorites'; saveState(); renderLibrary(); } };
  if ($('libraryBack')) $('libraryBack').onclick = () => go('play');
  $('librarySearch').value = librarySearch;
  renderDictionaryResults(pair);
  $('librarySearch').oninput = () => { librarySearch = $('librarySearch').value; renderDictionaryResults(pair); };
  $('ownWord').oninput = () => {
    const matches = dictionaryMatches($('ownWord').value, { target: $('ownTarget').value, base: $('ownBase').value }).filter((x) => dictionaryNorm(x.words[$('ownTarget').value]) === dictionaryNorm($('ownWord').value));
    if (matches.length === 1 && !$('customWordForm').dataset.editId) { $('ownTranslation').value = matches[0].words[$('ownBase').value]; $('translationHint').textContent = lt('found'); }
    else { if (!$('customWordForm').dataset.editId) $('ownTranslation').value = ''; $('translationHint').textContent = lt('notFound'); }
  };
  $('customWordForm').onsubmit = (event) => {
    event.preventDefault();
    const target = $('ownTarget').value, base = $('ownBase').value;
    const words = { [target]: $('ownWord').value.trim(), [base]: $('ownTranslation').value.trim() };
    if (target === base || !words[target] || !words[base]) { $('translationHint').textContent = lt('wordError'); return; }
    const existing = dictionaryMatches(words[target], { target, base }).find((entry) => dictionaryNorm(entry.words[target]) === dictionaryNorm(words[target]) && dictionaryNorm(entry.words[base]) === dictionaryNorm(words[base]));
    const editId = $('customWordForm').dataset.editId;
    let id;
    if (editId) { wordLibrary.data.custom[editId].words = { ...wordLibrary.data.custom[editId].words, ...words }; wordLibrary.data.custom[editId].phrase = Object.values(words).some((v) => /\s/.test(v)); id = editId; }
    else id = existing?.id || wordLibrary.addCustom(words);
    registerOwnWords(); wordLibrary.add(id, libraryActive); saveState(); renderLibrary();
  };
  $('exportLibrary').onclick = exportLibrary;
  $('importLibrary').onchange = importLibrary;
}
function renderDictionaryResults(pair) {
  const query = $('librarySearch').value;
  const results = query.trim() ? dictionaryMatches(query, pair) : [];
  $('dictionaryResults').innerHTML = results.length ? `<ul class="library-words">${results.map((x) => `<li class="library-word"><div><b lang="${pair.target}">${esc(x.words[pair.target])}</b><span lang="${pair.base}">${esc(x.words[pair.base])}</span></div><button class="secondary" data-dictionary-id="${esc(x.id)}"${wordLibrary.list(libraryActive).items.includes(x.id) ? ' disabled' : ''}>${esc(wordLibrary.list(libraryActive).items.includes(x.id) ? lt('saved') : lt('save'))}</button></li>`).join('')}</ul>` : query.trim() ? `<p>${esc(lt('notFound'))}</p>` : '';
  $('dictionaryResults').querySelectorAll('[data-dictionary-id]').forEach((button) => button.onclick = () => {
    wordLibrary.add(button.dataset.dictionaryId, libraryActive); saveState();
    button.disabled = true; button.textContent = lt('saved');
    renderSavedLibraryRows(pair);
  });
}
function exportLibrary() {
  const blob = new Blob([JSON.stringify({ format: 'jobvocabulary-library', version: 1, library: wordLibrary.data }, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'jobvocabulary-my-words.json'; a.click(); URL.revokeObjectURL(url);
}
async function importLibrary(event) {
  const file = event.target.files[0];
  if (!file) return;
  try {
    if (file.size > 5 * 1024 * 1024) throw new Error('size');
    const backup = JSON.parse(await file.text());
    wordLibrary.mergeBackup(backup); registerOwnWords(); saveState(); renderLibrary(); $('libraryMessage').textContent = lt('imported');
  } catch { $('libraryMessage').textContent = lt('importError'); }
}
