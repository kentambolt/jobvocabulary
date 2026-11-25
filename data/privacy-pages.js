'use strict';
const fs=require('node:fs'),path=require('node:path');
const metrics=require('../traffic-metrics');
const stats=require('../statistics-copy');
const detail=require('./statistics-privacy-copy');
const copy={
  "da": {
    "title": "Privatliv og kontakt",
    "back": "Tilbage til appen",
    "local": "Dine fremskridt",
    "storage": "Dine indstillinger, fremskridt, favoritord og egne lister gemmes i din browser. Du kan selv eksportere dine ordlister. Appen sender ikke dine ordlister eller besvarelser til vores statistiksystem.",
    "speech": "Oplæsning bruger din browsers talefunktion. Browseren eller styresystemet kan benytte en onlinetjeneste til at danne stemmen.",
    "hosting": "Siden leveres med GitHub Pages. Ved levering af siden modtager hostingleverandøren almindelige forbindelsesoplysninger, herunder IP-adresse.",
    "contact": "Kontakt og dataansvarlig",
    "owner": "JobVocabulary drives af Munthe Systems ApS, som er dataansvarlig. Kontakt os om appen eller dine oplysninger:",
    "mail": "Mail håndteres gennem Zoho EU og videresendes til Gmail.",
    "rights": "Du kan kontakte os om indsigt, rettelse, sletning eller indsigelse mod behandling af dine personoplysninger. Du kan klage til Datatilsynet."
  },
  "en": {
    "title": "Privacy and contact",
    "back": "Back to the app",
    "local": "Your progress",
    "storage": "Your settings, progress, saved words and personal lists are stored in your browser. You can export your word lists yourself. The app does not send your word lists or answers to our statistics service.",
    "speech": "Read-aloud uses your browser’s speech function. Your browser or operating system may use an online service to generate the voice.",
    "hosting": "The site is served through GitHub Pages. The hosting provider receives ordinary connection information, including your IP address, when serving the site.",
    "contact": "Contact and data controller",
    "owner": "JobVocabulary is operated by Munthe Systems ApS, the data controller. Contact us about the app or your information:",
    "mail": "Email is handled through Zoho EU and forwarded to Gmail.",
    "rights": "You can contact us about access, correction, deletion or objection to processing of your personal data. You can complain to the Danish Data Protection Agency."
  },
  "ru": {
    "title": "Конфиденциальность и контакты",
    "back": "Вернуться в приложение",
    "local": "Ваш прогресс",
    "storage": "Ваши настройки, прогресс, избранные слова и личные списки сохраняются в браузере. Вы можете самостоятельно экспортировать списки слов. Приложение не отправляет ваши списки слов и ответы в нашу систему статистики.",
    "speech": "Озвучивание использует речевую функцию браузера. Браузер или операционная система могут обращаться к онлайн-сервису для создания голоса.",
    "hosting": "Сайт размещён на GitHub Pages. При загрузке сайта провайдер хостинга получает обычные сведения о соединении, включая IP-адрес.",
    "contact": "Контакты и оператор данных",
    "owner": "JobVocabulary управляется компанией Munthe Systems ApS, ответственной за обработку данных. Свяжитесь с нами по вопросам приложения или ваших данных:",
    "mail": "Почта обрабатывается через Zoho EU и пересылается в Gmail.",
    "rights": "Вы можете обратиться к нам по вопросам доступа, исправления, удаления данных или возражения против обработки ваших персональных данных. Вы можете подать жалобу в Datatilsynet, орган по защите данных Дании."
  },
  "uk": {
    "title": "Конфіденційність і контакти",
    "back": "Повернутися до застосунку",
    "local": "Ваш прогрес",
    "storage": "Ваші налаштування, прогрес, улюблені слова й особисті списки зберігаються у браузері. Ви можете самостійно експортувати списки слів. Застосунок не надсилає ваші списки слів і відповіді до нашої системи статистики.",
    "speech": "Озвучування використовує мовленнєву функцію браузера. Браузер або операційна система можуть звертатися до онлайн-сервісу для створення голосу.",
    "hosting": "Сайт розміщено на GitHub Pages. Під час завантаження сайту постачальник хостингу отримує звичайні відомості про з’єднання, зокрема IP-адресу.",
    "contact": "Контакти й відповідальний за обробку даних",
    "owner": "JobVocabulary працює під управлінням Munthe Systems ApS, відповідальної за обробку даних. Зверніться до нас щодо застосунку або ваших даних:",
    "mail": "Пошта обробляється через Zoho EU та пересилається до Gmail.",
    "rights": "Ви можете звернутися до нас щодо доступу, виправлення, видалення даних або заперечення проти обробки ваших персональних даних. Ви можете подати скаргу до Datatilsynet, органу із захисту даних Данії."
  },
  "pl": {
    "title": "Prywatność i kontakt",
    "back": "Wróć do aplikacji",
    "local": "Twoje postępy",
    "storage": "Twoje ustawienia, postępy, ulubione słowa i własne listy są zapisywane w przeglądarce. Możesz samodzielnie eksportować listy słów. Aplikacja nie wysyła Twoich list słów ani odpowiedzi do naszego systemu statystyk.",
    "speech": "Odczytywanie korzysta z funkcji mowy przeglądarki. Przeglądarka lub system operacyjny mogą korzystać z usługi online do generowania głosu.",
    "hosting": "Strona działa na GitHub Pages. Podczas dostarczania strony dostawca hostingu otrzymuje zwykłe informacje o połączeniu, w tym adres IP.",
    "contact": "Kontakt i administrator danych",
    "owner": "Operatorem JobVocabulary i administratorem danych jest Munthe Systems ApS. Skontaktuj się z nami w sprawie aplikacji lub swoich danych:",
    "mail": "Poczta jest obsługiwana przez Zoho EU i przekazywana do Gmaila.",
    "rights": "Możesz skontaktować się z nami w sprawie dostępu, sprostowania, usunięcia danych lub sprzeciwu wobec przetwarzania Twoich danych osobowych. Możesz złożyć skargę do Datatilsynet, duńskiego organu ochrony danych."
  },
  "ro": {
    "title": "Confidențialitate și contact",
    "back": "Înapoi la aplicație",
    "local": "Progresul tău",
    "storage": "Setările, progresul, cuvintele favorite și listele personale sunt păstrate în browser. Îți poți exporta singur listele de cuvinte. Aplicația nu trimite listele de cuvinte sau răspunsurile tale către serviciul nostru de statistici.",
    "speech": "Citirea cu voce tare folosește funcția vocală a browserului. Browserul sau sistemul de operare poate utiliza un serviciu online pentru generarea vocii.",
    "hosting": "Site-ul este găzduit prin GitHub Pages. La livrarea paginii, furnizorul de găzduire primește informații obișnuite despre conexiune, inclusiv adresa IP.",
    "contact": "Contact și operator de date",
    "owner": "JobVocabulary este administrat de Munthe Systems ApS, operatorul de date. Contactează-ne în legătură cu aplicația sau datele tale:",
    "mail": "E-mailul este gestionat prin Zoho EU și redirecționat către Gmail.",
    "rights": "Ne poți contacta pentru acces, rectificare, ștergere sau opoziție față de prelucrarea datelor tale personale. Poți depune o plângere la Datatilsynet, autoritatea daneză pentru protecția datelor."
  },
  "lt": {
    "title": "Privatumas ir kontaktai",
    "back": "Grįžti į programėlę",
    "local": "Jūsų pažanga",
    "storage": "Jūsų nustatymai, pažanga, mėgstami žodžiai ir asmeniniai sąrašai saugomi naršyklėje. Žodžių sąrašus galite eksportuoti patys. Programėlė nesiunčia jūsų žodžių sąrašų ar atsakymų mūsų statistikos sistemai.",
    "speech": "Skaitymui balsu naudojama naršyklės kalbos funkcija. Naršyklė ar operacinė sistema balsui generuoti gali naudoti internetinę paslaugą.",
    "hosting": "Svetainę pateikia GitHub Pages. Pateikdamas svetainę prieglobos teikėjas gauna įprastą ryšio informaciją, įskaitant IP adresą.",
    "contact": "Kontaktai ir duomenų valdytojas",
    "owner": "JobVocabulary valdo Munthe Systems ApS, duomenų valdytojas. Susisiekite su mumis dėl programėlės ar savo duomenų:",
    "mail": "El. paštas tvarkomas per Zoho EU ir persiunčiamas į Gmail.",
    "rights": "Galite kreiptis dėl prieigos prie savo asmens duomenų, jų ištaisymo, ištrynimo ar nesutikimo su jų tvarkymu. Galite pateikti skundą Danijos duomenų apsaugos institucijai Datatilsynet."
  },
  "bg": {
    "title": "Поверителност и контакт",
    "back": "Обратно към приложението",
    "local": "Вашият напредък",
    "storage": "Вашите настройки, напредък, любими думи и лични списъци се съхраняват в браузъра. Можете сами да експортирате списъците си с думи. Приложението не изпраща вашите списъци с думи или отговори към системата ни за статистика.",
    "speech": "Четенето на глас използва речевата функция на браузъра. Браузърът или операционната система може да използва онлайн услуга за създаване на гласа.",
    "hosting": "Сайтът се предоставя чрез GitHub Pages. При зареждане на сайта доставчикът на хостинг получава обичайни данни за връзката, включително IP адреса.",
    "contact": "Контакт и администратор на данни",
    "owner": "JobVocabulary се управлява от Munthe Systems ApS, администратор на данни. Свържете се с нас относно приложението или вашите данни:",
    "mail": "Имейлите се обработват чрез Zoho EU и се препращат към Gmail.",
    "rights": "Можете да се свържете с нас за достъп, корекция, изтриване или възражение срещу обработването на личните ви данни. Можете да подадете жалба до Datatilsynet, датския орган за защита на данните."
  }
};
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
function build(root){
 return Object.entries(copy).map(([lang,t])=>{
  const file=path.join(root,lang,'privacy','index.html');fs.mkdirSync(path.dirname(file),{recursive:true});
  const s=stats[lang],d=detail[lang];
  const statistics=metrics.enabled?['usage','technical','retention','choice','platform'].map(key=>'<p>'+esc(d[key])+'</p>').join(''):'<p>'+esc(s.off)+'</p>';
  fs.writeFileSync(file,`<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,follow"><title>${esc(t.title)} | JobVocabulary</title><link rel="stylesheet" href="/style.css"><link rel="icon" href="/favicon.svg"></head><body class="page"><header class="top"><a class="brand" href="/?ui=${lang}#forside">JobVocabulary</a><a href="/?ui=${lang}">${esc(t.back)}</a></header><main><h1>${esc(t.title)}</h1><section id="statisticsControls"><p>${esc(s.unknown)}</p></section><noscript><p>${esc(d.noscript)}</p></noscript><h2>${esc(t.local)}</h2><p>${esc(t.storage)}</p><h2>${esc(s.title)}</h2>${statistics}<p>${esc(t.speech)}</p><p>${esc(t.hosting)} <a href="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement">GitHub</a></p><h2>${esc(t.contact)}</h2><p>${esc(t.owner)} <a href="mailto:contact@jobvocabulary.com">contact@jobvocabulary.com</a></p><p>${esc(t.mail)}</p><p>${esc(t.rights)} <a href="https://www.datatilsynet.dk/">Datatilsynet</a></p></main></body></html>\n`);
  return file;
 });
}
module.exports={copy,build};
