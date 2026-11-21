'use strict';
var WordEntry = class WordEntry {
  static norm(value) { return typeof value === 'string' ? value.trim().toLocaleLowerCase().normalize('NFC') : ''; }
  static parts(entry,lang) {
    const text=entry.words?.[lang] || '';
    const match=!entry.phrase && text.match(/^(.*?)\s+\(([^()]+)\)$/u);
    return match ? {text:match[1],detail:match[2]} : {text,detail:''};
  }
  // EXERCISE_FORMS
  static exerciseForms = {"ro":{"acoperit(ă)":["acoperit","acoperită"],"alergic(ă)":["alergic","alergică"],"amețit(ă)":["amețit","amețită"],"angajat(ă)":["angajat","angajată"],"asigurat(ă)":["asigurat","asigurată"],"asimilat(ă)":["asimilat","asimilată"],"asistent(ă)":["asistent","asistentă"],"blocat(ă)":["blocat","blocată"],"bolnav(ă)":["bolnav","bolnavă"],"cetățean(ă)":["cetățean","cetățeană"],"chemat(ă)":["chemat","chemată"],"culcat(ă)":["culcat","culcată"],"disponibil(ă)":["disponibil","disponibilă"],"evaluat(ă)":["evaluat","evaluată"],"implicat(ă)":["implicat","implicată"],"inconștient(ă)":["inconștient","inconștientă"],"instruit(ă)":["instruit","instruită"],"liber(ă)":["liber","liberă"],"lovit(ă)":["lovit","lovită"],"meticulos(oasă)":["meticulos","meticuloasă"],"mulțumit(ă)":["mulțumit","mulțumită"],"nemulțumit(ă)":["nemulțumit","nemulțumită"],"nou(ă)":["nou","nouă"],"obligat(ă)":["obligat","obligată"],"obosit(ă)":["obosit","obosită"],"oprit(ă)":["oprit","oprită"],"plătit(ă)":["plătit","plătită"],"pregătit(ă)":["pregătit","pregătită"],"reținut(ă)":["reținut","reținută"],"rănit(ă)":["rănit","rănită"],"sigur(ă)":["sigur","sigură"],"singur(ă)":["singur","singură"],"străin(ă)":["străin","străină"],"supărat(ă)":["supărat","supărată"],"suspect(ă)":["suspect","suspectă"],"suspectat(ă)":["suspectat","suspectată"],"trist(ă)":["trist","tristă"],"vinovat(ă)":["vinovat","vinovată"],"încuiat(ă)":["încuiat","încuiată"],"încărcat(ă)":["încărcat","încărcată"],"îngrijorat(ă)":["îngrijorat","îngrijorată"],"înregistrat(ă)":["înregistrat","înregistrată"],"înșelat(ă)":["înșelat","înșelată"],"șef(ă)":["șef","șefă"],"șomer(ă)":["șomer","șomeră"]},"bg":{"алергичен(на)":["алергичен","алергична"],"безработен(а)":["безработен","безработна"],"безработен(на)":["безработен","безработна"],"бил(а)":["бил","била"],"болен(а)":["болен","болна"],"болен(на)":["болен","болна"],"вписан(а)":["вписан","вписана"],"готов(а)":["готов","готова"],"забравил(а)":["забравил","забравила"],"завършил(а)":["завършил","завършила"],"задължен(а)":["задължен","задължена"],"задържан(а)":["задържан","задържана"],"зает(а)":["зает","заета"],"заключен(а)":["заключен","заключена"],"записал(а)":["записал","записала"],"заподозрян(а)":["заподозрян","заподозряна"],"започнал(а)":["започнал","започнала"],"здрав(а)":["здрав","здрава"],"изгубил(а)":["изгубил","изгубила"],"искал(а)":["искал","искала"],"нает(а)":["нает","наета"],"написал(а)":["написал","написала"],"направил(а)":["направил","направила"],"нетърпелив(а)":["нетърпелив","нетърпелива"],"нов(а)":["нов","нова"],"определен(а)":["определен","определена"],"пипал(а)":["пипал","пипала"],"повръщал(а)":["повръщал","повръщала"],"получил(а)":["получил","получила"],"правил(а)":["правил","правила"],"пропуснал(а)":["пропуснал","пропуснала"],"работил(а)":["работил","работила"],"сам(а)":["сам","сама"],"санитар(ка)":["санитар","санитарка"],"свободен(а)":["свободен","свободна"],"сигурен(на)":["сигурен","сигурна"],"старателен(на)":["старателен","старателна"],"уморен(а)":["уморен","уморена"],"чекирал(а)":["чекирал","чекирала"],"чистач(ка)":["чистач","чистачка"],"ядосан(а)":["ядосан","ядосана"]},"ru":{"болел(а)":["болел","болела"],"был(а)":["был","была"],"видел(а)":["видел","видела"],"вставил(а)":["вставил","вставила"],"въехал(а)":["въехал","въехала"],"вызвал(а)":["вызвал","вызвала"],"готов(а)":["готов","готова"],"дал(а)":["дал","дала"],"делал(а)":["делал","делала"],"доставил(а)":["доставил","доставила"],"думал(а)":["думал","думала"],"ждал(а)":["ждал","ждала"],"заболел(а)":["заболел","заболела"],"забронировал(а)":["забронировал","забронировала"],"забыл(а)":["забыл","забыла"],"задокументировал(а)":["задокументировал","задокументировала"],"заказал(а)":["заказал","заказала"],"закончил(а)":["закончил","закончила"],"записал(а)":["записал","записала"],"зарегистрирован(а)":["зарегистрирован","зарегистрирована"],"захлопнул(а)":["захлопнул","захлопнула"],"здоров(а)":["здоров","здорова"],"измерил(а)":["измерил","измерила"],"купил(а)":["купил","купила"],"нажал(а)":["нажал","нажала"],"написал(а)":["написал","написала"],"начинал(а)":["начинал","начинала"],"новенький(ая)":["новенький","новенькая"],"обновил(а)":["обновил","обновила"],"обязан(а)":["обязан","обязана"],"оплатил(а)":["оплатил","оплатила"],"опоздал(а)":["опоздал","опоздала"],"оставил(а)":["оставил","оставила"],"откликнулся(лась)":["откликнулся","откликнулась"],"отметил(а)":["отметил","отметила"],"отправил(а)":["отправил","отправила"],"отработал(а)":["отработал","отработала"],"отсканировал(а)":["отсканировал","отсканировала"],"оформил(а)":["оформил","оформила"],"переехал(а)":["переехал","переехала"],"подтвердил(а)":["подтвердил","подтвердила"],"позвонил(а)":["позвонил","позвонила"],"положил(а)":["положил","положила"],"получил(а)":["получил","получила"],"поменял(а)":["поменял","поменяла"],"понял(а)":["понял","поняла"],"попал(а)":["попал","попала"],"порезал(а)":["порезал","порезала"],"порезался(лась)":["порезался","порезалась"],"потерял(а)":["потерял","потеряла"],"поцарапал(а)":["поцарапал","поцарапала"],"пробил(а)":["пробил","пробила"],"проверил(а)":["проверил","проверила"],"пропустил(а)":["пропустил","пропустила"],"просверлил(а)":["просверлил","просверлила"],"прошёл(а)":["прошёл","прошла"],"работал(а)":["работал","работала"],"рад(а)":["рад","рада"],"сам(а)":["сам","сама"],"сдал(а)":["сдал","сдала"],"сделал(а)":["сделал","сделала"],"сообщил(а)":["сообщил","сообщила"],"трогал(а)":["трогал","трогала"],"уверен(а)":["уверен","уверена"],"ударился(лась)":["ударился","ударилась"],"уронил(а)":["уронил","уронила"],"успел(а)":["успел","успела"],"устал(а)":["устал","устала"],"хотел(а)":["хотел","хотела"]},"uk":{"бачив(ла)":["бачив","бачила"],"був(ла)":["був","була"],"вдарився(лася)":["вдарився","вдарилася"],"викликав(ла)":["викликав","викликала"],"виміряв(ла)":["виміряв","виміряла"],"впевнений(а)":["впевнений","впевнена"],"впустив(ла)":["впустив","впустила"],"вставив(ла)":["вставив","вставила"],"встиг(ла)":["встиг","встигла"],"втомився(лася)":["втомився","втомилася"],"відгукнувся(лася)":["відгукнувся","відгукнулася"],"відмітив(ла)":["відмітив","відмітила"],"відпрацював(ла)":["відпрацював","відпрацювала"],"відсканував(ла)":["відсканував","відсканувала"],"в’їхав(ла)":["в’їхав","в’їхала"],"готовий(а)":["готовий","готова"],"дав(ла)":["дав","дала"],"доставив(ла)":["доставив","доставила"],"думав(ла)":["думав","думала"],"забронював(ла)":["забронював","забронювала"],"забув(ла)":["забув","забула"],"загубив(ла)":["загубив","загубила"],"задокументував(ла)":["задокументував","задокументувала"],"закінчив(ла)":["закінчив","закінчила"],"залишив(ла)":["залишив","залишила"],"замовив(ла)":["замовив","замовила"],"записав(ла)":["записав","записала"],"захворів(ла)":["захворів","захворіла"],"зачинив(ла)":["зачинив","зачинила"],"здобув(ла)":["здобув","здобула"],"здоровий(а)":["здоровий","здорова"],"знайшов(ла)":["знайшов","знайшла"],"зобов'язаний(а)":["зобов'язаний","зобов'язана"],"зобов’язаний(а)":["зобов’язаний","зобов’язана"],"зробив(ла)":["зробив","зробила"],"зрозумів(ла)":["зрозумів","зрозуміла"],"купив(ла)":["купив","купила"],"надіслав(ла)":["надіслав","надіслала"],"написав(ла)":["написав","написала"],"натиснув(ла)":["натиснув","натиснула"],"новенький(а)":["новенький","новенька"],"оновив(ла)":["оновив","оновила"],"оплатив(ла)":["оплатив","оплатила"],"отримав(ла)":["отримав","отримала"],"оформив(ла)":["оформив","оформила"],"перевірив(ла)":["перевірив","перевірила"],"переїхав(ла)":["переїхав","переїхала"],"повідомив(ла)":["повідомив","повідомила"],"подзвонив(ла)":["подзвонив","подзвонила"],"подряпав(ла)":["подряпав","подряпала"],"поклав(ла)":["поклав","поклала"],"поміняв(ла)":["поміняв","поміняла"],"порізав(ла)":["порізав","порізала"],"порізався(лася)":["порізався","порізалася"],"потрапив(ла)":["потрапив","потрапила"],"починав(ла)":["починав","починала"],"працював(ла)":["працював","працювала"],"пробив(ла)":["пробив","пробила"],"пройшов(ла)":["пройшов","пройшла"],"пропустив(ла)":["пропустив","пропустила"],"просвердлив(ла)":["просвердлив","просвердлила"],"підтвердив(ла)":["підтвердив","підтвердила"],"робив(ла)":["робив","робила"],"сам(а)":["сам","сама"],"склав(ла)":["склав","склала"],"хворів(ла)":["хворів","хворіла"],"хотів(ла)":["хотів","хотіла"],"чекав(ла)":["чекав","чекала"],"чіпав(ла)":["чіпав","чіпала"]},"pl":{"był(a)":["był","była"],"chciał(a)bym":["chciałbym","chciałabym"],"dostał(a)":["dostał","dostała"],"miał(a)":["miał","miała"],"pan(i)":["pan","pani"],"sam(a)":["sam","sama"],"spał(a)":["spał","spała"],"wprowadził(a)":["wprowadził","wprowadziła"],"wypił(a)":["wypił","wypiła"],"zajmował(a)":["zajmował","zajmowała"],"zamawiał(a)":["zamawiał","zamawiała"],"zauważył(a)":["zauważył","zauważyła"],"został(a)":["został","została"],"zrobił(a)":["zrobił","zrobiła"]}};
  // /EXERCISE_FORMS
  static form(text,lang,feminine=false) {
    if(!text.includes('(')&&!(lang==='pl'&&text.includes('/')))return text;
    if(lang==='pl') {
      text=text.replace(/zrobił Pan\/zrobiła Pani/g,feminine?'zrobiła Pani':'zrobił Pan');
      text=text.replace(/(^|[^\p{L}])(Panem\/Panią|Pana\/Panią|Pana\/Pani|Panu\/Pani|Pan\/Pani)(?=$|[^\p{L}])/giu,(_whole,prefix,pair)=>prefix+pair.split('/')[feminine?1:0]);
    }
    const forms=WordEntry.exerciseForms[lang];
    if(!forms)return text;
    return text.replace(/[\p{L}’']+\([\p{L}]+\)[\p{L}]*/gu,whole=>{
      const pair=forms[whole.toLowerCase().normalize('NFC')];
      if(!pair)return whole;
      const value=pair[feminine?1:0];
      if(whole===whole.toUpperCase())return value.toUpperCase();
      return whole[0]===whole[0].toUpperCase()?value[0].toUpperCase()+value.slice(1):value;
    });
  }
  static exerciseParts(entry,lang,feminine=false) {
    const parts=WordEntry.parts(entry,lang);
    return {...parts,text:WordEntry.form(parts.text,lang,feminine)};
  }
  static alternativeCache = new WeakMap();
  static alternatives(entry,lang) {
    const raw=entry.words?.[lang]||'';
    if(!raw.includes('(')&&!(lang==='pl'&&raw.includes('/')))return [];
    let fields=WordEntry.alternativeCache.get(entry);
    const cached=fields?.[lang];
    if(cached?.raw===raw&&cached.phrase===entry.phrase)return cached.values;
    const values=[...new Set([false,true].map(form=>WordEntry.norm(WordEntry.exerciseParts(entry,lang,form).text)))];
    if(!fields){fields={};WordEntry.alternativeCache.set(entry,fields);}
    fields[lang]={raw,phrase:entry.phrase,values};
    return values;
  }
  static exact(entry, lang, value) {
    const word = WordEntry.norm(entry.words?.[lang]);
    const query = WordEntry.norm(value);
    if (!word || !query) return false;
    if (word === query) return true;
    const form=WordEntry.norm(WordEntry.parts(entry,lang).text);
    if (form===query) return true;
    if(WordEntry.alternatives(entry,lang).includes(query))return true;
    return lang === 'da' && !entry.phrase && form.replace(/^(en|et|at)\s+(.+)$/, '$2') === query;
  }
  static equivalenceKey(entry) {
    // Presentation only: keep every stored ID and distinguish senses/qualifiers.
    // All eight translations must agree; a matching pair alone is not enough.
    const languages=['da','en','ru','uk','pl','ro','lt','bg'];
    if(!entry || entry.phrase || languages.some(lang=>!WordEntry.norm(entry.words?.[lang])))return null;
    return JSON.stringify(languages.map(lang=>{
      const value=WordEntry.norm(entry.words[lang]);
      return lang==='da'?value.replace(/^(en|et)\s+(.+)$/u,'$2'):value;
    }));
  }
  static search(entries, query, pair, limit = 20, preferredIds = []) {
    const q = WordEntry.norm(query);
    if (!q || limit <= 0) return [];
    const exact = (entry) => Number(WordEntry.exact(entry, pair.target, query) || WordEntry.exact(entry, pair.base, query));
    const preferred=new Set(preferredIds),saved=new Map();
    if(preferred.size)for(const entry of entries)if(preferred.has(entry?.id)){
      const key=WordEntry.equivalenceKey(entry);
      if(key&&!saved.has(key))saved.set(key,entry);
    }
    const matches=entries.filter((entry) => typeof entry?.id === 'string' && /^(lex:|user:)/.test(entry.id)
      && typeof entry.words?.[pair.target] === 'string' && entry.words[pair.target]
      && typeof entry.words?.[pair.base] === 'string' && entry.words[pair.base]
      && [pair.target, pair.base].some((lang) => WordEntry.norm(entry.words[lang]).includes(q)
        || WordEntry.alternatives(entry,lang).some(value=>value.includes(q))))
      .sort((a, b) => exact(b) - exact(a));
    const grouped=new Map();
    for(const entry of matches){
      const key=WordEntry.equivalenceKey(entry)||'id:'+entry.id;
      if(!grouped.has(key)){
        grouped.set(key,saved.get(key)||entry);
        if(grouped.size>=limit)break;
      }
    }
    return [...grouped.values()].slice(0,limit);
  }
  constructor(entries, pair, editing = null) {
    this.entries = entries;
    this.target = pair.target; this.base = pair.base;
    this.editing = editing;
    this.word = editing?.words?.[this.target] || '';
    this.translation = editing?.words?.[this.base] || '';
    this.selectedId = null; this.matches = []; this.hint = '';
  }
  lookup() {
    this.selectedId = null;
    this.matches = WordEntry.search(this.entries, this.word, this, Number.MAX_SAFE_INTEGER)
      .filter((entry) => WordEntry.exact(entry, this.target, this.word));
    if (this.matches.length === 1) {
      this.selectedId = this.matches[0].id;
      this.translation = this.matches[0].words[this.base];
      this.hint = 'found';
    } else {
      this.translation = '';
      this.hint = !this.word.trim() ? '' : this.matches.length ? 'chooseMeaning' : 'notFound';
    }
  }
  setWord(value) {
    this.word = value;
    if (!this.editing) this.lookup();
  }
  setTranslation(value) {
    this.translation = value;
    const selected = this.entries.find((entry) => entry.id === this.selectedId);
    if (selected && !WordEntry.exact(selected, this.base, value)) { this.selectedId = null; this.hint = ''; }
  }
  select(id) {
    const entry = this.matches.find((candidate) => candidate.id === id);
    if (!entry) return;
    this.selectedId = id;
    this.word = entry.words[this.target];
    this.translation = entry.words[this.base];
    this.matches = []; this.hint = 'found';
  }
  setLanguage(field, lang) {
    if (!['target', 'base'].includes(field) || !['da', 'en', 'ru', 'uk', 'pl', 'ro', 'lt', 'bg'].includes(lang)) return;
    const before = { target: this.target, base: this.base };
    const other = field === 'target' ? 'base' : 'target';
    this[field] = lang;
    if (this[field] === this[other]) this[other] = before[field];
    if (this.editing) {
      this.word = this.editing.words[this.target] || '';
      this.translation = this.editing.words[this.base] || '';
      this.matches = []; this.hint = ''; return;
    }
    const selected = this.entries.find((entry) => entry.id === this.selectedId);
    if (selected?.words[this.target] && selected.words[this.base]) {
      this.word = selected.words[this.target]; this.translation = selected.words[this.base];
      this.matches = []; this.hint = 'found'; return;
    }
    if (this.target !== before.target) this.word = '';
    this.lookup();
  }
  knownId() {
    const matches = WordEntry.search(this.entries, this.word, this, Number.MAX_SAFE_INTEGER, this.selectedId ? [this.selectedId] : [])
      .filter((entry) => WordEntry.exact(entry, this.target, this.word) && WordEntry.exact(entry, this.base, this.translation));
    return matches.find((entry) => entry.id === this.selectedId)?.id || (matches.length === 1 ? matches[0].id : null);
  }
};
if (typeof module !== 'undefined') module.exports = WordEntry;
