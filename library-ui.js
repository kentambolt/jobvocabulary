'use strict';
const LIBRARY_TEXT = {
  "da": {
    "title": "Mine ord",
    "favorites": "Favoritord",
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
    "saveFavorite": "Gem som favorit",
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
    "unfavorite": "Fjern fra favoritter",
    "custom": "Egne ord",
    "filter": "Søg i denne liste",
    "noMatches": "Ingen ord matcher din søgning.",
    "rename": "Omdøb liste",
    "duplicateName": "Du har allerede en liste med det navn.",
    "targetLanguage": "Jeg lærer",
    "baseLanguage": "Oversæt til",
    "listen": "Hør ordet",
    "missingTranslation": "Ingen oversættelse",
    "backup": "Sikkerhedskopi og flytning",
    "savePrevious": "Gem forrige ord",
    "backToCourse": "Tilbage til kurset",
    "chooseMeaning": "Ordet har flere betydninger. Vælg den rigtige.",
    "cancelEdit": "Annuller redigering",
    "unavailable": "Ordet er ikke tilgængeligt"
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
    "saveFavorite": "Save as a favourite",
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
    "unfavorite": "Remove from favourites",
    "custom": "Your own words",
    "filter": "Search this list",
    "noMatches": "No words match your search.",
    "rename": "Rename list",
    "duplicateName": "You already have a list with that name.",
    "targetLanguage": "I am learning",
    "baseLanguage": "Translate into",
    "listen": "Listen to the word",
    "missingTranslation": "No translation",
    "backup": "Backup and transfer",
    "savePrevious": "Save previous word",
    "backToCourse": "Back to the course",
    "chooseMeaning": "This word has several meanings. Choose one.",
    "cancelEdit": "Cancel editing",
    "unavailable": "This word is unavailable"
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
    "saveFavorite": "Добавить в избранное",
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
    "unfavorite": "Убрать из избранного",
    "custom": "Свои слова",
    "filter": "Поиск в этом списке",
    "noMatches": "Нет слов по вашему запросу.",
    "rename": "Переименовать список",
    "duplicateName": "Список с таким названием уже существует.",
    "targetLanguage": "Я изучаю",
    "baseLanguage": "Переводить на",
    "listen": "Послушать слово",
    "missingTranslation": "Нет перевода",
    "backup": "Резервная копия и перенос",
    "savePrevious": "Сохранить предыдущее слово",
    "backToCourse": "Вернуться к курсу",
    "chooseMeaning": "У слова несколько значений. Выберите нужное.",
    "cancelEdit": "Отменить редактирование",
    "unavailable": "Слово недоступно"
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
    "saveFavorite": "Додати до обраного",
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
    "unfavorite": "Прибрати з обраного",
    "custom": "Власні слова",
    "filter": "Пошук у цьому списку",
    "noMatches": "Немає слів за вашим запитом.",
    "rename": "Перейменувати список",
    "duplicateName": "Список із такою назвою вже існує.",
    "targetLanguage": "Я вивчаю",
    "baseLanguage": "Перекладати на",
    "listen": "Послухати слово",
    "missingTranslation": "Немає перекладу",
    "backup": "Резервна копія та перенесення",
    "savePrevious": "Зберегти попереднє слово",
    "backToCourse": "Повернутися до курсу",
    "chooseMeaning": "Слово має кілька значень. Виберіть потрібне.",
    "cancelEdit": "Скасувати редагування",
    "unavailable": "Слово недоступне"
  }
};
for (const [lang, locale] of Object.entries(typeof EXTRA_LOCALES === 'undefined' ? {} : EXTRA_LOCALES)) LIBRARY_TEXT[lang] = locale.library;
const lt = (key) => LIBRARY_TEXT[uiLang()][key];
let dictionaryData = null;
let dictionaryPromise = null;
let libraryActive = 'favorites';
let libraryVisible = 50;
let libraryFilter = '';
let librarySearch = '';
const dictionaryNorm = WordEntry.norm;
let ownWordDraft = null;
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
  container.querySelectorAll('[data-listen-word]').forEach((button) => button.onclick = () => speak(lexicalForm(ITEM[button.dataset.listenWord],button.dataset.listenLang), button.dataset.listenLang, true));
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
  if (!dictionaryPromise) dictionaryPromise = fetch(`${LEXICON_INDEX.file || 'lexicon.json'}?v=${LEXICON_INDEX.version}`).then((r) => {
    if (!r.ok) throw new Error('dictionary');
    return r.json();
  }).then(async (data) => {
    const languages = data.languages || ['da', 'en', 'ru', 'uk'];
    const supplements = await Promise.all((data.supplements || []).map(async source => {
      const response = await fetch(source.url);
      if (!response.ok) throw new Error('dictionary');
      return response.json();
    }));
    for (const supplement of supplements) {
      const offset = data.entries.length;
      for (const row of supplement.entries) data.entries.push([row[0],...languages.map(lang=>{const index=supplement.languages.indexOf(lang);return index<0?'':row[index+1];}),row[supplement.languages.length+1],row[supplement.languages.length+2]]);
      for (const [id,index] of Object.entries(supplement.aliases)) if (!(id in data.aliases)) data.aliases[id]=offset+index;
    }
    if (data.version >= 2) data.aliases = Object.fromEntries(Object.entries(data.aliases).map(([key, index]) => [key, data.entries[index][0]]));
    dictionaryData = data;
    const previousRefs = JSON.stringify([wordLibrary.data.favorites, wordLibrary.data.lists]);
    wordLibrary.remapReferences(canonicalWord);
    if (previousRefs !== JSON.stringify([wordLibrary.data.favorites, wordLibrary.data.lists])) saveState();
    for (const row of data.entries) ITEM[row[0]] = { id: row[0], words: Object.fromEntries(languages.map((lang, index) => [lang, row[index + 1]])), phrase: !!row[languages.length + 1], pos: 'dictionary', diff: 1, image: row[languages.length + 2] };
    registerOwnWords();
    return data;
  }).catch((error) => { dictionaryPromise = null; throw error; });
  return dictionaryPromise;
}
function listPool(id, pair) {
  return (wordLibrary.list(id)?.items || []).map((ref) => ITEM[canonicalWord(ref)]).filter((entry) => entry && entry.words[pair.target] && entry.words[pair.base]);
}
function startLibraryPractice(id, pair, options = {}) {
  if (!listPool(id, pair).length) return;
  saveState(); // Remember the actual course before entering temporary list practice.
  state.settings = { ...pair, ...options, pack: 'list:' + id, dir: options.dir || 'rec', diff: 3, cats: null };
  saveState(); current = null; placement = null; lastFeedback = null; levelNotice = null; go('play');
}
function dictionaryMatches(query, pair, limit = 20) {
  return WordEntry.search(Object.values(ITEM), query, pair, limit);
}
function saveToListDialog(sourceId) {
  clearTimeout(timer);
  const dialog = $('saveWordDialog');
  dialog.dataset.sourceId = sourceId;
  dialog.setAttribute('aria-label', lt('saveWord'));
  dialog.innerHTML = `<p role="status">${esc(t('loading'))}</p><button class="secondary" id="cancelWordLoad">${esc(t('cancel'))}</button>`;
  $('cancelWordLoad').onclick = () => dialog.close();
  dialog.showModal();
  loadDictionary().then(() => {
    if (!dialog.open || dialog.dataset.sourceId !== sourceId) return;
    const id = canonicalWord(sourceId);
    const favorite = wordLibrary.data.favorites.includes(id);
    dialog.innerHTML = `<form id="saveWordForm"><h2>${esc(lt('saveWord'))}</h2><button type="button" class="favorite-choice" id="dialogFavoriteBtn" aria-pressed="${favorite}">${favorite ? '♥ ' + esc(lt('unfavorite')) : '♡ ' + esc(lt('saveFavorite'))}</button><label for="wordListSelect">${esc(lt('choose'))}</label><select id="wordListSelect"><option value="">${esc(lt('choose'))}</option>${wordLibrary.data.lists.map((list) => `<option value="${esc(list.id)}">${esc(list.name)}</option>`).join('')}</select><label for="wordNewList">${esc(lt('newList'))}</label><input id="wordNewList" maxlength="60" autocomplete="off"><p id="saveWordMessage" role="status"></p><div class="row actions"><button type="button" class="secondary" id="cancelSaveWord">${esc(t('cancel'))}</button><button class="primary">${esc(lt('addTo'))}</button></div></form>`;
    $('cancelSaveWord').onclick = () => dialog.close();
    bindFavoriteButton($('dialogFavoriteBtn'), sourceId, $('saveWordMessage'), () => { dialog.close(); if (view === 'library') renderLibrary(); });
    $('saveWordForm').onsubmit = (event) => {
      event.preventDefault();
      const name = $('wordNewList').value.trim();
      const listId = name ? wordLibrary.createList(name).id : $('wordListSelect').value;
      if (!listId) { $('saveWordMessage').textContent = lt('choose'); $('wordListSelect').focus(); return; }
      wordLibrary.add(id, listId); saveState(); dialog.close(); refreshFavoriteButtons(sourceId);
      if (view === 'library') renderLibrary();
    };
    $('dialogFavoriteBtn').focus();
  }).catch(() => { if (dialog.open) { dialog.innerHTML = `<p role="status">${esc(t('loadFail'))}</p><button class="secondary" id="cancelWordLoad">${esc(t('cancel'))}</button>`; $('cancelWordLoad').onclick = () => dialog.close(); } });
}

function updateFavoriteButton(button, sourceId) {
  if (button.dataset.wordHub) {
    const saved = wordIsSaved(sourceId);
    button.textContent = saved ? '♥' : '♡'; button.setAttribute('data-saved', String(saved)); button.title = lt('saveWord'); button.setAttribute('aria-label', lt('saveWord')); return;
  }
  const saved = wordLibrary.data.favorites.includes(canonicalWord(sourceId));
  button.setAttribute('aria-pressed', String(saved));
  button.textContent = button.dataset.previous ? (saved ? '♥' : '♡') : saved ? `♥ ${lt('saved')}` : `♡ ${lt('saveWord')}`;
  button.title = saved ? lt('unfavorite') : lt(button.dataset.previous ? 'savePrevious' : 'saveWord');
  if (button.dataset.wordLabel) button.setAttribute('aria-label', `${saved ? lt('unfavorite') : lt(button.dataset.previous ? 'savePrevious' : 'saveWord')}: ${button.dataset.wordLabel}`);
}
function refreshFavoriteButtons(sourceId) {
  document.querySelectorAll('[data-favorite-source]').forEach((candidate) => {
    if (canonicalWord(candidate.dataset.favoriteSource) === canonicalWord(sourceId)) updateFavoriteButton(candidate, sourceId);
  });
}
function wordIsSaved(sourceId) {
  const id = canonicalWord(sourceId);
  return wordLibrary.data.favorites.includes(id) || wordLibrary.data.lists.some((list) => list.items.includes(id));
}
function wordSaveHTML(x) {
  const saved = wordIsSaved(x.id);
  return `<button class="word-heart" id="favoriteWordBtn" data-favorite-source="${esc(x.id)}" data-word-hub="true" data-saved="${saved}" aria-haspopup="dialog" aria-label="${esc(lt('saveWord'))}" title="${esc(lt('saveWord'))}">${saved ? '♥' : '♡'}</button>`;
}
function promptActionsHTML(x, extra = '') { return `<div class="prompt-actions">${extra}${wordSaveHTML(x)}</div>`; }

function bindFavoriteButton(button, sourceId, status, onSaved) {
  button.onclick = async (event) => {
    const button = event.currentTarget;
    button.disabled = true;
    if (status?.isConnected) status.textContent = '';
    try {
      await loadDictionary(); wordLibrary.toggle(canonicalWord(sourceId)); saveState();
      refreshFavoriteButtons(sourceId);
      if (onSaved) onSaved();
    }
    catch { if (status?.isConnected) status.textContent = t('loadFail'); }
    finally { button.disabled = false; }
  };
}
function bindWordSave(x) {
  if ($('favoriteWordBtn')) $('favoriteWordBtn').onclick = () => saveToListDialog(x.id);
}

function bindPreviousFavorite() {
  const previous = $('previousFavoriteBtn');
  if (previous) bindFavoriteButton(previous, previous.dataset.favoriteSource, $('receiptSaveStatus'));
}
function syncOwnWordForm() {
  const draft = ownWordDraft;
  for (const [id, value] of [['ownTarget', draft.target], ['ownBase', draft.base], ['ownWord', draft.word], ['ownTranslation', draft.translation]]) if ($(id).value !== value) $(id).value = value;
  $('translationHint').textContent = draft.hint ? lt(draft.hint) : '';
  $('saveOwnWord').textContent = lt(draft.editing ? 'update' : 'save');
  $('cancelOwnEdit').hidden = !draft.editing;
  $('ownWordMatches').innerHTML = draft.matches.length > 1 ? draft.matches.slice(0, 12).map((entry) => `<button class="secondary" type="button" data-own-match="${esc(entry.id)}"><b lang="${draft.target}">${esc(entry.words[draft.target])}</b><span lang="${draft.base}">${esc(entry.words[draft.base])}</span></button>`).join('') : '';
  $('ownWordMatches').querySelectorAll('[data-own-match]').forEach((button) => button.onclick = () => { ownWordDraft.select(button.dataset.ownMatch); syncOwnWordForm(); $('ownTranslation').focus(); });
}
function beginOwnWordEdit(id, pair) {
  const entry = wordLibrary.data.custom[id];
  if (!entry) return;
  ownWordDraft = new WordEntry(Object.values(ITEM), pair, { id, words: entry.words });
  $('customWordDetails').open = true;
  syncOwnWordForm(); $('ownWord').focus();
}
function bindOwnWordForm(pair) {
  ownWordDraft = new WordEntry(Object.values(ITEM), pair);
  $('ownWord').oninput = () => { ownWordDraft.setWord($('ownWord').value); syncOwnWordForm(); };
  $('ownTranslation').oninput = () => { ownWordDraft.setTranslation($('ownTranslation').value); syncOwnWordForm(); };
  for (const [id, field] of [['ownTarget', 'target'], ['ownBase', 'base']]) $(id).onchange = () => { ownWordDraft.setLanguage(field, $(id).value); syncOwnWordForm(); };
  $('cancelOwnEdit').onclick = () => { ownWordDraft = new WordEntry(Object.values(ITEM), ownWordDraft); syncOwnWordForm(); $('ownWord').focus(); };
  $('customWordForm').onsubmit = (event) => {
    event.preventDefault();
    const draft = ownWordDraft;
    draft.word = $('ownWord').value.trim(); draft.translation = $('ownTranslation').value.trim();
    const words = { [draft.target]: draft.word, [draft.base]: draft.translation };
    if (draft.target === draft.base || !draft.word || !draft.translation) { $('translationHint').textContent = lt('wordError'); return; }
    let id;
    if (draft.editing) {
      id = draft.editing.id;
      const entry = wordLibrary.data.custom[id];
      entry.words = { ...entry.words, ...words };
      entry.phrase = WordLibrary.isPhrase(entry.words);
    } else id = draft.knownId() || wordLibrary.addCustom(words);
    state.libraryPair = { target: draft.target, base: draft.base };
    registerOwnWords(); wordLibrary.add(id, libraryActive); saveState(); renderLibrary();
    $('customWordDetails').open = true; $('translationHint').textContent = lt('saved'); $('ownWord').focus();
  };
  syncOwnWordForm();
}
function renderSavedLibraryRows(pair) {
  const list = wordLibrary.list(libraryActive);
  const filtered = libraryFilteredItems();
  const row = (id) => {
    const x = ITEM[canonicalWord(id)];
    if (!x) return `<li class="library-word"><span>${esc(lt('unavailable'))}</span><button class="secondary" data-remove-word="${esc(id)}">${esc(lt('remove'))}</button></li>`;
    return `<li class="library-word"><div><b lang="${pair.target}">${esc(x.words[pair.target] || lt('missingTranslation'))}</b><span lang="${pair.base}">${esc(x.words[pair.base] || lt('missingTranslation'))}</span></div><div class="library-row-actions">${libraryAudio(x, pair.target)}<button class="secondary" data-add-word="${esc(id)}">${esc(lt('addTo'))}</button>${id.startsWith('user:') ? `<button class="secondary" data-edit-word="${esc(id)}">${esc(lt('edit'))}</button>` : ''}<button class="secondary" data-remove-word="${esc(id)}">${esc(lt('remove'))}</button></div></li>`;
  };
  $('savedListResults').innerHTML = list.items.length ? filtered.length ? `<ul class="library-words">${filtered.slice(0, libraryVisible).map(row).join('')}</ul>${filtered.length > libraryVisible ? `<button class="secondary" id="moreLibraryWords">${esc(lt('more'))}</button>` : ''}` : `<p role="status">${esc(lt('noMatches'))}</p>` : `<p class="empty-list">${esc(lt('empty'))}</p>`;
  $('listFilterControl').hidden = !list.items.length;
  $('libraryListTitle').innerHTML = `${esc(libraryTitle(libraryActive))} <small>${list.items.length}</small>`;
  $('practiceList').disabled = !listPool(libraryActive, pair).length;
  $('app').querySelectorAll('[data-list-id]').forEach((button) => button.querySelector('small').textContent = wordLibrary.list(button.dataset.listId).items.length);
  bindLibraryAudio($('savedListResults'));
  $('app').querySelectorAll('[data-remove-word]').forEach((button) => button.onclick = () => { wordLibrary.remove(button.dataset.removeWord, libraryActive); saveState(); renderSavedLibraryRows(pair); renderDictionaryResults(pair); });
  $('app').querySelectorAll('[data-add-word]').forEach((button) => button.onclick = () => saveToListDialog(button.dataset.addWord));
  $('app').querySelectorAll('[data-edit-word]').forEach((button) => button.onclick = () => beginOwnWordEdit(button.dataset.editWord, pair));
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
    <details class="custom-word" id="customWordDetails"><summary>${esc(lt('addOwn'))}</summary><form id="customWordForm"><label for="ownTarget">${esc(lt('word'))}</label><select id="ownTarget">${options(pair.target)}</select><input aria-label="${esc(lt('word'))}" id="ownWord" maxlength="300" required autocomplete="off"><label for="ownBase">${esc(lt('translation'))}</label><select id="ownBase">${options(pair.base)}</select><input aria-label="${esc(lt('translation'))}" id="ownTranslation" maxlength="300" required autocomplete="off"><p id="translationHint" role="status"></p><div id="ownWordMatches" class="word-choices"></div><div class="row own-word-actions"><button class="primary" id="saveOwnWord">${esc(lt('save'))}</button><button class="secondary" type="button" id="cancelOwnEdit" hidden>${esc(lt('cancelEdit'))}</button></div></form></details>
    <details class="library-transfer"><summary>${esc(lt('backup'))}</summary><p class="course-note">${esc(lt('local'))}</p><div class="library-backup"><button class="secondary" id="exportLibrary">${esc(lt('export'))}</button><label class="secondary import-label">${esc(lt('import'))}<input type="file" id="importLibrary" accept="application/json,.json"></label></div></details>
    ${state.settings ? `<p class="library-return"><button class="secondary" id="libraryBack">${esc(lt('back'))}</button>${isList(state.settings) && lastCourseSettings() ? `<button class="secondary" id="libraryCourseBack">${esc(lt('backToCourse'))}</button>` : ''}</p>` : ''}</section>`;
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
  $('practiceList').onclick = () => { const settings = state.settings?.pack === 'list:' + libraryActive ? { ...state.settings, ...pair } : { ...pair, pack: 'list:' + libraryActive, dir: 'rec', diff: 3, repeatLearned: state.settings?.repeatLearned !== false }; openTrainingOptions(settings, (chosen) => startLibraryPractice(libraryActive, pair, chosen), { start: true }); };
  if ($('deleteLibraryList')) $('deleteLibraryList').onclick = () => { if (confirm(lt('deleteQ'))) { wordLibrary.data.lists = wordLibrary.data.lists.filter((entry) => entry.id !== libraryActive); libraryActive = 'favorites'; saveState(); renderLibrary(); } };
  if ($('libraryBack')) $('libraryBack').onclick = () => go('play');
  if ($('libraryCourseBack')) $('libraryCourseBack').onclick = returnToCourse;
  $('librarySearch').value = librarySearch;
  renderDictionaryResults(pair);
  $('librarySearch').oninput = () => { librarySearch = $('librarySearch').value; renderDictionaryResults(pair); };
  bindOwnWordForm(pair);
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
