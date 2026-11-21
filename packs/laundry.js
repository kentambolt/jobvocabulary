// Learning data. Internal reviews are held in the private content repository.
var PACKS = typeof PACKS !== 'undefined' ? PACKS : {};
PACKS.laundry = {
  "id": "laundry",
  "name": {
    "da": "Vaskeri og tekstilservice",
    "en": "Laundry and textile services",
    "ru": "Прачечная и обслуживание текстиля",
    "uk": "Пральня й обслуговування текстилю",
    "pl": "Pralnia i serwis tekstyliów",
    "ro": "Spălătorie și servicii textile",
    "lt": "Skalbykla ir tekstilės priežiūra",
    "bg": "Пералня и текстилни услуги"
  },
  "desc": {
    "da": "Ord og sætninger til sortering, vaskeri, linned og levering på arbejdet",
    "en": "Words and phrases for sorting, laundry, linen and deliveries at work",
    "ru": "Слова и фразы для сортировки, работы в прачечной, белья и доставки",
    "uk": "Слова й фрази для сортування, роботи в пральні, білизни й доставки",
    "pl": "Słowa i zwroty do sortowania, pracy w pralni, bielizny i dostaw",
    "ro": "Cuvinte și expresii pentru sortare, spălătorie, lenjerie și livrări",
    "lt": "Žodžiai ir sakiniai rūšiavimui, darbui skalbykloje, skalbiniams ir pristatymui",
    "bg": "Думи и изречения за сортиране, работа в пералня, бельо и доставки"
  },
  "categories": [
    {
      "key": "textiles",
      "type": "word",
      "name": {
        "da": "Linned og tekstiler",
        "en": "Linen and textiles",
        "ru": "Бельё и текстиль",
        "uk": "Білизна й текстиль",
        "pl": "Bielizna i tekstylia",
        "ro": "Lenjerie și textile",
        "lt": "Skalbiniai ir tekstilė",
        "bg": "Бельо и текстил"
      },
      "rows": [
        [
          1,
          "linned",
          "linen",
          "бельё",
          "білизна",
          "bielizna",
          "lenjerie",
          "baltiniai",
          "бельо"
        ],
        [
          1,
          "et lagen",
          "sheet",
          "простыня",
          "простирадло",
          "prześcieradło",
          "cearșaf",
          "paklodė",
          "чаршаф"
        ],
        [
          1,
          "et pudebetræk",
          "pillowcase",
          "наволочка",
          "наволочка",
          "poszewka",
          "față de pernă",
          "pagalvės užvalkalas",
          "калъфка за възглавница"
        ],
        [
          1,
          "et håndklæde",
          "towel",
          "полотенце",
          "рушник",
          "ręcznik",
          "prosop",
          "rankšluostis",
          "хавлиена кърпа"
        ],
        [
          1,
          "et badelagen",
          "bath sheet (large towel)",
          "большое банное полотенце",
          "великий банний рушник",
          "duży ręcznik kąpielowy",
          "prosop mare de baie",
          "didelis vonios rankšluostis",
          "голяма хавлиена кърпа"
        ],
        [
          1,
          "et dynebetræk",
          "duvet cover",
          "пододеяльник",
          "підковдра",
          "poszwa na kołdrę",
          "husă de pilotă",
          "antklodės užvalkalas",
          "плик за завивка"
        ],
        [
          1,
          "en dug",
          "tablecloth",
          "скатерть",
          "скатертина",
          "obrus",
          "față de masă",
          "staltiesė",
          "покривка за маса"
        ],
        [
          1,
          "en serviet",
          "napkin",
          "салфетка",
          "серветка",
          "serwetka",
          "șervet",
          "servetėlė",
          "салфетка"
        ],
        [
          1,
          "arbejdstøj",
          "workwear",
          "рабочая одежда",
          "робочий одяг",
          "odzież robocza",
          "haine de lucru",
          "darbo drabužiai",
          "работно облекло"
        ],
        [
          2,
          "en uniform",
          "uniform",
          "униформа",
          "уніформа",
          "mundur",
          "uniformă",
          "uniforma",
          "униформа"
        ],
        [
          2,
          "bomuld",
          "cotton",
          "хлопок",
          "бавовна",
          "bawełna",
          "bumbac",
          "medvilnė",
          "памук"
        ],
        [
          2,
          "polyester",
          "polyester",
          "полиэстер",
          "поліестер",
          "poliester",
          "poliester",
          "poliesteris",
          "полиестер"
        ]
      ]
    },
    {
      "key": "equipment",
      "type": "word",
      "name": {
        "da": "Maskiner og udstyr",
        "en": "Machines and equipment",
        "ru": "Машины и оборудование",
        "uk": "Машини й обладнання",
        "pl": "Maszyny i wyposażenie",
        "ro": "Mașini și echipamente",
        "lt": "Mašinos ir įranga",
        "bg": "Машини и оборудване"
      },
      "rows": [
        [
          1,
          "en vaskemaskine",
          "washing machine",
          "стиральная машина",
          "пральна машина",
          "pralka",
          "mașină de spălat rufe",
          "skalbimo mašina",
          "перална машина"
        ],
        [
          1,
          "en tørretumbler",
          "tumble dryer",
          "сушильная машина",
          "сушильна машина",
          "suszarka bębnowa",
          "mașină de uscat rufe",
          "džiovinimo mašina (džiovyklė)",
          "сушилня"
        ],
        [
          1,
          "et strygejern",
          "iron",
          "утюг",
          "праска",
          "żelazko",
          "fier de călcat",
          "lygintuvas",
          "ютия"
        ],
        [
          1,
          "et strygebræt",
          "ironing board",
          "гладильная доска",
          "прасувальна дошка",
          "deska do prasowania",
          "masă de călcat",
          "lyginimo lenta",
          "дъска за гладене"
        ],
        [
          1,
          "en linnedvogn",
          "linen trolley",
          "тележка для белья",
          "візок для білизни",
          "wózek na bieliznę",
          "cărucior pentru lenjerie",
          "baltinių vežimėlis",
          "количка за бельо"
        ],
        [
          1,
          "en vasketøjskurv",
          "laundry basket",
          "корзина для белья",
          "кошик для білизни",
          "kosz na pranie",
          "coș de rufe",
          "skalbinių krepšys",
          "кош за пране"
        ],
        [
          1,
          "en linnedsæk",
          "linen bag",
          "мешок для белья",
          "мішок для білизни",
          "worek na bieliznę",
          "sac pentru lenjerie",
          "maišas baltiniams",
          "чувал за бельо"
        ],
        [
          2,
          "et transportbånd",
          "conveyor belt",
          "конвейерная лента",
          "конвеєрна стрічка",
          "taśma transportowa",
          "bandă transportoare",
          "konvejerio juosta",
          "транспортна лента"
        ],
        [
          3,
          "en rulle (til linned)",
          "flatwork ironer",
          "гладильный каток",
          "прасувальний каландр",
          "magiel",
          "calandru de călcat",
          "skalbinių lyginimo volas",
          "гладачен каландър"
        ],
        [
          2,
          "et filter",
          "filter",
          "фильтр",
          "фільтр",
          "filtr",
          "filtru",
          "filtras",
          "филтър"
        ],
        [
          1,
          "en knap (på maskine)",
          "button (on a machine)",
          "кнопка",
          "кнопка",
          "przycisk",
          "buton",
          "mygtukas",
          "бутон"
        ],
        [
          2,
          "et display",
          "display screen",
          "дисплей",
          "дисплей",
          "wyświetlacz",
          "afișaj",
          "ekranėlis",
          "дисплей"
        ]
      ]
    },
    {
      "key": "sorting",
      "type": "word",
      "name": {
        "da": "Sortering og kvalitet",
        "en": "Sorting and quality",
        "ru": "Сортировка и качество",
        "uk": "Сортування та якість",
        "pl": "Sortowanie i jakość",
        "ro": "Sortare și calitate",
        "lt": "Rūšiavimas ir kokybė",
        "bg": "Сортиране и качество"
      },
      "rows": [
        [
          1,
          "rent linned",
          "clean linen",
          "чистое бельё",
          "чиста білизна",
          "czysta bielizna",
          "lenjerie curată",
          "švarūs baltiniai",
          "чисто бельо"
        ],
        [
          1,
          "snavset linned",
          "dirty linen",
          "грязное бельё",
          "брудна білизна",
          "brudna bielizna",
          "lenjerie murdară",
          "nešvarūs baltiniai",
          "мръсно бельо"
        ],
        [
          1,
          "en plet",
          "stain",
          "пятно",
          "пляма",
          "plama",
          "pată",
          "dėmė",
          "петно"
        ],
        [
          1,
          "et hul",
          "hole",
          "дыра",
          "дірка",
          "dziura",
          "gaură",
          "skylė",
          "дупка"
        ],
        [
          1,
          "en størrelse",
          "size",
          "размер",
          "розмір",
          "rozmiar",
          "mărime",
          "dydis",
          "размер"
        ],
        [
          1,
          "en farve",
          "colour",
          "цвет",
          "колір",
          "kolor",
          "culoare",
          "spalva",
          "цвят"
        ],
        [
          1,
          "en etiket",
          "label",
          "этикетка",
          "етикетка",
          "etykieta",
          "etichetă",
          "etiketė",
          "етикет"
        ],
        [
          2,
          "en vaskemærkning",
          "care label",
          "маркировка по уходу",
          "маркування з догляду",
          "oznaczenie sposobu prania",
          "marcaj de întreținere",
          "priežiūros ženklinimas",
          "обозначение за поддръжка"
        ],
        [
          1,
          "fugtig",
          "damp",
          "влажный",
          "вологий",
          "wilgotny",
          "umed",
          "drėgnas",
          "влажен"
        ],
        [
          1,
          "tør",
          "dry",
          "сухой",
          "сухий",
          "suchy",
          "uscat",
          "sausas",
          "сух"
        ],
        [
          2,
          "slidt",
          "worn",
          "изношенный",
          "зношений",
          "zużyty",
          "uzat",
          "nusidėvėjęs",
          "износен"
        ],
        [
          2,
          "beskadiget",
          "damaged",
          "повреждённый",
          "пошкоджений",
          "uszkodzony",
          "deteriorat",
          "pažeistas",
          "повреден"
        ]
      ]
    },
    {
      "key": "process",
      "type": "word",
      "name": {
        "da": "Vask og behandling",
        "en": "Washing and processing",
        "ru": "Стирка и обработка",
        "uk": "Прання й обробка",
        "pl": "Pranie i obróbka",
        "ro": "Spălare și prelucrare",
        "lt": "Skalbimas ir apdorojimas",
        "bg": "Пране и обработка"
      },
      "rows": [
        [
          1,
          "vaskepulver",
          "washing powder",
          "стиральный порошок",
          "пральний порошок",
          "proszek do prania",
          "detergent pudră pentru rufe",
          "skalbimo milteliai",
          "прах за пране"
        ],
        [
          1,
          "pletfjerner",
          "stain remover",
          "пятновыводитель",
          "плямовивідник",
          "odplamiacz",
          "soluție pentru scos pete",
          "dėmių valiklis",
          "петновадител"
        ],
        [
          1,
          "vaskemiddel",
          "laundry detergent",
          "средство для стирки",
          "засіб для прання",
          "środek do prania",
          "detergent de rufe",
          "skalbiklis",
          "перилен препарат"
        ],
        [
          3,
          "en dosering",
          "dosage",
          "дозировка",
          "дозування",
          "dawka",
          "dozaj",
          "dozė",
          "дозировка"
        ],
        [
          1,
          "et vaskeprogram",
          "wash programme",
          "программа стирки",
          "програма прання",
          "program prania",
          "program de spălare",
          "skalbimo programa",
          "програма за пране"
        ],
        [
          1,
          "en temperatur",
          "temperature",
          "температура",
          "температура",
          "temperatura",
          "temperatură",
          "temperatūra",
          "температура"
        ],
        [
          3,
          "centrifugering",
          "spin cycle",
          "отжим",
          "віджимання",
          "wirowanie",
          "centrifugare",
          "gręžimas",
          "центрофугиране"
        ],
        [
          1,
          "en ordre",
          "order (customer request)",
          "заказ",
          "замовлення",
          "zamówienie",
          "comandă (de la client)",
          "užsakymas",
          "поръчка"
        ],
        [
          1,
          "en levering",
          "delivery",
          "доставка",
          "доставка",
          "dostawa",
          "livrare",
          "pristatymas",
          "доставка"
        ],
        [
          2,
          "en følgeseddel",
          "delivery note",
          "сопроводительная накладная",
          "супровідна накладна",
          "dokument dostawy",
          "aviz de însoțire",
          "lydraštis",
          "стокова разписка"
        ],
        [
          1,
          "et antal",
          "quantity",
          "количество",
          "кількість",
          "liczba sztuk",
          "număr de bucăți",
          "kiekis",
          "брой"
        ],
        [
          2,
          "en vægt (måleredskab)",
          "weighing scale",
          "весы",
          "ваги",
          "waga (urządzenie)",
          "cântar",
          "svarstyklės",
          "везна"
        ]
      ]
    },
    {
      "key": "actions",
      "type": "word",
      "name": {
        "da": "Arbejdsord",
        "en": "Work verbs",
        "ru": "Действия",
        "uk": "Дії",
        "pl": "Czynności",
        "ro": "Acțiuni",
        "lt": "Veiksmai",
        "bg": "Действия"
      },
      "rows": [
        [
          1,
          "at vaske",
          "to wash",
          "мыть / стирать",
          "мити / прати",
          "myć / prać",
          "a spăla",
          "plauti / skalbti",
          "мия / пера"
        ],
        [
          1,
          "at folde",
          "to fold",
          "складывать",
          "складати",
          "składać",
          "a împături",
          "lankstyti",
          "сгъвам"
        ],
        [
          1,
          "at stryge",
          "to iron",
          "гладить",
          "прасувати",
          "prasować",
          "a călca",
          "lyginti",
          "гладя"
        ],
        [
          1,
          "at sortere linned",
          "to sort linen",
          "сортировать бельё",
          "сортувати білизну",
          "sortować bieliznę",
          "a sorta lenjeria",
          "rūšiuoti baltinius",
          "сортирам бельото"
        ],
        [
          1,
          "at tælle linned",
          "to count linen",
          "считать бельё",
          "рахувати білизну",
          "liczyć bieliznę",
          "a număra lenjeria",
          "skaičiuoti baltinius",
          "броя бельото"
        ],
        [
          1,
          "at fylde",
          "to fill",
          "наполнять",
          "наповнювати",
          "napełniać",
          "a umple",
          "pripildyti",
          "пълня"
        ],
        [
          1,
          "at tømme",
          "to empty",
          "опорожнять",
          "спорожнювати",
          "opróżniać",
          "a goli",
          "ištuštinti",
          "изпразвам"
        ],
        [
          1,
          "at tørre (vasketøj)",
          "to dry laundry",
          "сушить бельё",
          "сушити білизну",
          "suszyć pranie",
          "a usca rufele",
          "džiovinti skalbinius",
          "суша пране"
        ],
        [
          2,
          "at veje",
          "to weigh",
          "взвешивать",
          "зважувати",
          "ważyć",
          "a cântări",
          "sverti",
          "претеглям"
        ],
        [
          1,
          "at pakke",
          "to pack",
          "упаковывать",
          "пакувати",
          "pakować",
          "a împacheta",
          "pakuoti",
          "опаковам"
        ],
        [
          2,
          "at mærke (med etiket)",
          "to label",
          "маркировать этикеткой",
          "маркувати етикеткою",
          "oznaczać etykietą",
          "a eticheta",
          "ženklinti etikete",
          "поставям етикет"
        ],
        [
          2,
          "at kontrollere",
          "to check",
          "проверять",
          "перевіряти",
          "sprawdzać",
          "a verifica",
          "tikrinti",
          "проверявам"
        ]
      ]
    },
    {
      "key": "receiving",
      "type": "phrase",
      "name": {
        "da": "Modtagelse og sortering",
        "en": "Receiving and sorting",
        "ru": "Приём и сортировка",
        "uk": "Приймання й сортування",
        "pl": "Przyjmowanie i sortowanie",
        "ro": "Primire și sortare",
        "lt": "Priėmimas ir rūšiavimas",
        "bg": "Приемане и сортиране"
      },
      "rows": [
        [
          1,
          "Hvor skal denne sæk stå?",
          "Where should this sack go?",
          "Куда поставить этот мешок?",
          "Куди поставити цей мішок?",
          "Gdzie postawić ten worek?",
          "Unde trebuie pus acest sac?",
          "Kur padėti šį maišą?",
          "Къде да сложа този чувал?"
        ],
        [
          1,
          "Hvilken kunde kommer linnedet fra?",
          "Which customer is the linen from?",
          "От какого клиента это бельё?",
          "Від якого клієнта ця білизна?",
          "Od którego klienta jest ta bielizna?",
          "De la ce client este lenjeria?",
          "Iš kurio kliento šie skalbiniai?",
          "От кой клиент е бельото?"
        ],
        [
          1,
          "Skal farverne sorteres hver for sig?",
          "Should the colours be sorted separately?",
          "Нужно сортировать по цветам отдельно?",
          "Чи потрібно сортувати окремо за кольорами?",
          "Czy kolory trzeba sortować oddzielnie?",
          "Culorile trebuie sortate separat?",
          "Ar spalvas reikia rūšiuoti atskirai?",
          "Трябва ли цветовете да се сортират отделно?"
        ],
        [
          1,
          "Der mangler en etiket på sækken.",
          "The sack is missing a label.",
          "На мешке нет этикетки.",
          "На мішку немає етикетки.",
          "Na worku brakuje etykiety.",
          "Lipsește eticheta de pe sac.",
          "Ant maišo trūksta etiketės.",
          "На чувала липсва етикет."
        ],
        [
          2,
          "Vis mig, hvordan vi sorterer her.",
          "Show me how we sort things here.",
          "Покажите, как здесь сортируют.",
          "Покажіть, як тут сортують.",
          "Pokaż mi, jak tutaj sortujemy.",
          "Arată-mi cum sortăm aici.",
          "Parodyk, kaip čia rūšiuojame.",
          "Покажи ми как сортираме тук."
        ],
        [
          1,
          "Denne dug har en plet.",
          "This tablecloth has a stain.",
          "На этой скатерти пятно.",
          "На цій скатертині пляма.",
          "Ten obrus ma plamę.",
          "Această față de masă are o pată.",
          "Ant šios staltiesės yra dėmė.",
          "На тази покривка има петно."
        ],
        [
          2,
          "Jeg har fundet et hul i lagenet.",
          "I have found a hole in the sheet.",
          "В простыне обнаружилась дыра.",
          "У простирадлі виявилася дірка.",
          "W prześcieradle jest dziura.",
          "Am găsit o gaură în cearșaf.",
          "Paklodėje yra skylė.",
          "В чаршафа има дупка."
        ],
        [
          1,
          "Hvor lægger vi beskadigede tekstiler?",
          "Where do we put damaged textiles?",
          "Куда мы кладём повреждённый текстиль?",
          "Куди ми кладемо пошкоджений текстиль?",
          "Gdzie odkładamy uszkodzone tekstylia?",
          "Unde punem textilele deteriorate?",
          "Kur dedame pažeistą tekstilę?",
          "Къде слагаме повредения текстил?"
        ],
        [
          2,
          "Skal dette vaskes igen?",
          "Does this need washing again?",
          "Это нужно постирать ещё раз?",
          "Це потрібно випрати ще раз?",
          "Czy to trzeba wyprać ponownie?",
          "Acesta trebuie spălat din nou?",
          "Ar tai reikia išskalbti dar kartą?",
          "Трябва ли това да се изпере отново?"
        ],
        [
          1,
          "Hvor mange håndklæder er der?",
          "How many towels are there?",
          "Сколько здесь полотенец?",
          "Скільки тут рушників?",
          "Ile jest ręczników?",
          "Câte prosoape sunt?",
          "Kiek yra rankšluosčių?",
          "Колко кърпи има?"
        ],
        [
          2,
          "Antallet passer ikke med listen.",
          "The quantity does not match the list.",
          "Количество не совпадает со списком.",
          "Кількість не збігається зі списком.",
          "Liczba sztuk nie zgadza się z listą.",
          "Numărul de bucăți nu corespunde listei.",
          "Kiekis neatitinka sąrašo.",
          "Броят не съвпада със списъка."
        ],
        [
          1,
          "Hvilken størrelse er det?",
          "What size is it?",
          "Какой это размер?",
          "Який це розмір?",
          "Jaki to rozmiar?",
          "Ce mărime este?",
          "Koks tai dydis?",
          "Какъв е размерът?"
        ]
      ]
    },
    {
      "key": "machineUse",
      "type": "phrase",
      "name": {
        "da": "Spørgsmål om maskiner",
        "en": "Questions about machines",
        "ru": "Вопросы о машинах",
        "uk": "Запитання про машини",
        "pl": "Pytania o maszyny",
        "ro": "Întrebări despre mașini",
        "lt": "Klausimai apie mašinas",
        "bg": "Въпроси за машините"
      },
      "rows": [
        [
          1,
          "Hvilket program skal jeg vælge?",
          "Which programme should I select?",
          "Какую программу выбрать?",
          "Яку програму вибрати?",
          "Który program wybrać?",
          "Ce program trebuie să aleg?",
          "Kurią programą pasirinkti?",
          "Коя програма да избера?"
        ],
        [
          1,
          "Hvilken temperatur står der på mærket?",
          "What temperature does the label show?",
          "Какая температура указана на ярлыке?",
          "Яку температуру вказано на ярлику?",
          "Jaka temperatura jest podana na metce?",
          "Ce temperatură este indicată pe etichetă?",
          "Kokia temperatūra nurodyta etiketėje?",
          "Каква температура е посочена на етикета?"
        ],
        [
          2,
          "Hvor finder jeg doseringsvejledningen?",
          "Where can I find the dosing instructions?",
          "Где найти инструкцию по дозировке?",
          "Де знайти інструкцію з дозування?",
          "Gdzie znajdę instrukcję dozowania?",
          "Unde găsesc instrucțiunile de dozare?",
          "Kur rasti dozavimo instrukciją?",
          "Къде да намеря указанията за дозиране?"
        ],
        [
          1,
          "Maskinen kører stadig.",
          "The machine is still running.",
          "Машина ещё работает.",
          "Машина ще працює.",
          "Maszyna nadal pracuje.",
          "Mașina încă funcționează.",
          "Mašina dar veikia.",
          "Машината още работи."
        ],
        [
          1,
          "Vasketøjet er stadig fugtigt.",
          "The laundry is still damp.",
          "Бельё ещё влажное.",
          "Білизна ще волога.",
          "Pranie jest jeszcze wilgotne.",
          "Rufele sunt încă umede.",
          "Skalbiniai dar drėgni.",
          "Прането още е влажно."
        ],
        [
          1,
          "Tørretumbleren viser en fejl.",
          "The tumble dryer shows an error.",
          "На сушильной машине отображается ошибка.",
          "На сушильній машині відображається помилка.",
          "Suszarka pokazuje błąd.",
          "Uscătorul afișează o eroare.",
          "Džiovyklė rodo klaidą.",
          "Сушилнята показва грешка."
        ],
        [
          2,
          "Hvad betyder denne besked på displayet?",
          "What does this message on the display mean?",
          "Что означает это сообщение на дисплее?",
          "Що означає це повідомлення на дисплеї?",
          "Co oznacza ten komunikat na wyświetlaczu?",
          "Ce înseamnă acest mesaj de pe afișaj?",
          "Ką reiškia šis pranešimas ekrane?",
          "Какво означава това съобщение на дисплея?"
        ],
        [
          1,
          "Kan du vise mig startknappen?",
          "Can you show me the start button?",
          "Можете показать кнопку запуска?",
          "Можете показати кнопку запуску?",
          "Czy możesz pokazać mi przycisk start?",
          "Poți să-mi arăți butonul de pornire?",
          "Ar gali parodyti paleidimo mygtuką?",
          "Можеш ли да ми покажеш бутона за пускане?"
        ],
        [
          2,
          "Jeg kender ikke denne maskine endnu.",
          "I do not know this machine yet.",
          "Я ещё не умею работать с этой машиной.",
          "Я ще не вмію працювати з цією машиною.",
          "Nie znam jeszcze tej maszyny.",
          "Nu cunosc încă această mașină.",
          "Dar nemoku dirbti su šia mašina.",
          "Все още не познавам тази машина."
        ],
        [
          1,
          "Hvem skal jeg spørge om maskinen?",
          "Who should I ask about the machine?",
          "К кому обратиться с вопросом о машине?",
          "До кого звернутися із запитанням про машину?",
          "Kogo zapytać o maszynę?",
          "Pe cine trebuie să întreb despre mașină?",
          "Ko paklausti apie mašiną?",
          "Кого да попитам за машината?"
        ],
        [
          2,
          "Der kommer vand ud på gulvet.",
          "Water is leaking onto the floor.",
          "Вода вытекает на пол.",
          "Вода витікає на підлогу.",
          "Woda wycieka na podłogę.",
          "Curge apă pe podea.",
          "Vanduo teka ant grindų.",
          "Изтича вода на пода."
        ],
        [
          2,
          "Jeg følger arbejdspladsens vejledning.",
          "I follow the workplace instructions.",
          "Я следую инструкциям на рабочем месте.",
          "Я дотримуюся інструкцій на робочому місці.",
          "Stosuję się do instrukcji w miejscu pracy.",
          "Urmez instrucțiunile de la locul de muncă.",
          "Laikausi darbovietės instrukcijų.",
          "Следвам указанията на работното място."
        ]
      ]
    },
    {
      "key": "packing",
      "type": "phrase",
      "name": {
        "da": "Foldning og pakning",
        "en": "Folding and packing",
        "ru": "Складывание и упаковка",
        "uk": "Складання й пакування",
        "pl": "Składanie i pakowanie",
        "ro": "Împăturire și ambalare",
        "lt": "Lankstymas ir pakavimas",
        "bg": "Сгъване и опаковане"
      },
      "rows": [
        [
          1,
          "Hvordan skal håndklæderne foldes?",
          "How should the towels be folded?",
          "Как нужно складывать полотенца?",
          "Як потрібно складати рушники?",
          "Jak należy składać ręczniki?",
          "Cum trebuie împăturite prosoapele?",
          "Kaip reikia sulankstyti rankšluosčius?",
          "Как трябва да се сгъват кърпите?"
        ],
        [
          1,
          "Hvor mange skal der være i hver pakke?",
          "How many should be in each pack?",
          "Сколько штук должно быть в каждой упаковке?",
          "Скільки штук має бути в кожному пакунку?",
          "Ile sztuk powinno być w każdej paczce?",
          "Câte bucăți trebuie să fie în fiecare pachet?",
          "Kiek vienetų turi būti kiekvienoje pakuotėje?",
          "Колко броя трябва да има във всеки пакет?"
        ],
        [
          1,
          "Disse lagner er klar til pakning.",
          "These sheets are ready for packing.",
          "Эти простыни готовы к упаковке.",
          "Ці простирадла готові до пакування.",
          "Te prześcieradła są gotowe do pakowania.",
          "Aceste cearșafuri sunt gata de ambalat.",
          "Šios paklodės paruoštos pakuoti.",
          "Тези чаршафи са готови за опаковане."
        ],
        [
          2,
          "Kan du kontrollere foldningen?",
          "Can you check the folding?",
          "Можете проверить, правильно ли сложено?",
          "Можете перевірити, чи правильно складено?",
          "Czy możesz sprawdzić, czy jest dobrze złożone?",
          "Poți verifica dacă este împăturit corect?",
          "Ar gali patikrinti, ar gerai sulankstyta?",
          "Можеш ли да провериш дали е сгънато правилно?"
        ],
        [
          1,
          "Der skal ti håndklæder i pakken.",
          "There should be ten towels in the pack.",
          "В упаковке должно быть десять полотенец.",
          "У пакунку має бути десять рушників.",
          "W paczce powinno być dziesięć ręczników.",
          "În pachet trebuie să fie zece prosoape.",
          "Pakuotėje turi būti dešimt rankšluosčių.",
          "В пакета трябва да има десет кърпи."
        ],
        [
          1,
          "Etiketten skal vende udad.",
          "The label should face outwards.",
          "Этикетка должна быть снаружи.",
          "Етикетка має бути зовні.",
          "Etykieta powinna być skierowana na zewnątrz.",
          "Eticheta trebuie să fie orientată spre exterior.",
          "Etiketė turi būti nukreipta į išorę.",
          "Етикетът трябва да е обърнат навън."
        ],
        [
          1,
          "Jeg mangler poser til pakning.",
          "I need bags for packing.",
          "Мне нужны пакеты для упаковки.",
          "Мені потрібні пакети для пакування.",
          "Potrzebuję worków do pakowania.",
          "Am nevoie de pungi pentru ambalare.",
          "Man reikia pakavimo maišelių.",
          "Трябват ми торбички за опаковане."
        ],
        [
          2,
          "Denne pakke skal mærkes igen.",
          "This pack needs labelling again.",
          "На эту упаковку нужно заново наклеить этикетку.",
          "На цей пакунок потрібно наново наклеїти етикетку.",
          "Tę paczkę trzeba ponownie oznaczyć.",
          "Acest pachet trebuie etichetat din nou.",
          "Šią pakuotę reikia iš naujo paženklinti.",
          "Този пакет трябва да се етикетира отново."
        ],
        [
          2,
          "Kontrollér kundenavnet på etiketten.",
          "Check the customer name on the label.",
          "Проверьте имя клиента на этикетке.",
          "Перевірте ім’я клієнта на етикетці.",
          "Sprawdź nazwę klienta na etykiecie.",
          "Verifică numele clientului de pe etichetă.",
          "Patikrink kliento pavadinimą etiketėje.",
          "Провери името на клиента върху етикета."
        ],
        [
          1,
          "Hvor står de færdige pakker?",
          "Where are the finished packs?",
          "Где стоят готовые упаковки?",
          "Де стоять готові пакунки?",
          "Gdzie stoją gotowe paczki?",
          "Unde sunt pachetele gata?",
          "Kur padėtos paruoštos pakuotės?",
          "Къде са готовите пакети?"
        ],
        [
          2,
          "Skal dette linned stryges?",
          "Does this linen need ironing?",
          "Это бельё нужно гладить?",
          "Цю білизну потрібно прасувати?",
          "Czy tę bieliznę trzeba prasować?",
          "Această lenjerie trebuie călcată?",
          "Ar šiuos skalbinius reikia lyginti?",
          "Трябва ли това бельо да се глади?"
        ],
        [
          1,
          "Jeg er færdig med denne ordre.",
          "I have finished this order.",
          "Этот заказ готов.",
          "Це замовлення готове.",
          "To zamówienie jest gotowe.",
          "Am terminat această comandă.",
          "Šis užsakymas paruoštas.",
          "Тази поръчка е готова."
        ]
      ]
    },
    {
      "key": "teamwork",
      "type": "phrase",
      "name": {
        "da": "Levering og samarbejde",
        "en": "Delivery and teamwork",
        "ru": "Доставка и работа в команде",
        "uk": "Доставка й робота в команді",
        "pl": "Dostawa i współpraca",
        "ro": "Livrare și colaborare",
        "lt": "Pristatymas ir bendradarbiavimas",
        "bg": "Доставка и работа в екип"
      },
      "rows": [
        [
          1,
          "Hvilken vogn skal jeg bruge?",
          "Which trolley should I use?",
          "Какую тележку мне взять?",
          "Який візок мені взяти?",
          "Którego wózka mam użyć?",
          "Ce cărucior trebuie să folosesc?",
          "Kurį vežimėlį naudoti?",
          "Коя количка да използвам?"
        ],
        [
          1,
          "Hvornår skal ordren være klar?",
          "When does the order need to be ready?",
          "Когда заказ должен быть готов?",
          "Коли замовлення має бути готове?",
          "Kiedy zamówienie ma być gotowe?",
          "Când trebuie să fie gata comanda?",
          "Kada užsakymas turi būti paruoštas?",
          "Кога трябва да е готова поръчката?"
        ],
        [
          1,
          "Chaufføren kommer om en time.",
          "The driver is coming in an hour.",
          "Водитель приедет через час.",
          "Водій приїде через годину.",
          "Kierowca przyjedzie za godzinę.",
          "Șoferul vine peste o oră.",
          "Vairuotojas atvyks po valandos.",
          "Шофьорът ще дойде след един час."
        ],
        [
          1,
          "Vi mangler tre pudebetræk.",
          "We are three pillowcases short.",
          "Нам не хватает трёх наволочек.",
          "Нам бракує трьох наволочок.",
          "Brakuje nam trzech poszewek na poduszki.",
          "Ne lipsesc trei fețe de pernă.",
          "Mums trūksta trijų pagalvių užvalkalų.",
          "Липсват ни три калъфки за възглавници."
        ],
        [
          2,
          "Følgesedlen ligger oven på vognen.",
          "The delivery note is on top of the trolley.",
          "Накладная лежит сверху на тележке.",
          "Накладна лежить зверху на візку.",
          "Dokument dostawy leży na wózku.",
          "Avizul de însoțire este deasupra căruciorului.",
          "Lydraštis padėtas ant vežimėlio.",
          "Стоковата разписка е отгоре на количката."
        ],
        [
          1,
          "Kan du hjælpe mig med vognen?",
          "Can you help me with the trolley?",
          "Можете помочь мне с тележкой?",
          "Можете допомогти мені з візком?",
          "Czy możesz mi pomóc z wózkiem?",
          "Mă poți ajuta cu căruciorul?",
          "Ar gali padėti man su vežimėliu?",
          "Можеш ли да ми помогнеш с количката?"
        ],
        [
          2,
          "Hvem overtager min opgave?",
          "Who is taking over my task?",
          "Кто продолжит мою работу?",
          "Хто продовжить мою роботу?",
          "Kto przejmie moje zadanie?",
          "Cine preia sarcina mea?",
          "Kas perims mano užduotį?",
          "Кой поема моята задача?"
        ],
        [
          1,
          "Jeg har brug for at få det vist igen.",
          "I need to be shown again.",
          "Мне нужно, чтобы мне показали ещё раз.",
          "Мені потрібно, щоб мені показали ще раз.",
          "Potrzebuję, żeby mi to pokazano jeszcze raz.",
          "Am nevoie să mi se arate din nou.",
          "Man reikia, kad tai parodytų dar kartą.",
          "Трябва да ми го покажат отново."
        ],
        [
          1,
          "Hvilken ordre skal vi tage først?",
          "Which order should we do first?",
          "Какой заказ выполнить первым?",
          "Яке замовлення виконати першим?",
          "Które zamówienie mamy zrobić najpierw?",
          "Ce comandă facem prima?",
          "Kurį užsakymą vykdysime pirmiausia?",
          "Коя поръчка да изпълним първо?"
        ],
        [
          2,
          "Denne levering er forsinket.",
          "This delivery is delayed.",
          "Эта доставка задерживается.",
          "Ця доставка затримується.",
          "Ta dostawa jest opóźniona.",
          "Această livrare este întârziată.",
          "Šis pristatymas vėluoja.",
          "Тази доставка закъснява."
        ],
        [
          1,
          "Hvor skal den tomme vogn stå?",
          "Where should the empty trolley go?",
          "Куда поставить пустую тележку?",
          "Куди поставити порожній візок?",
          "Gdzie postawić pusty wózek?",
          "Unde trebuie pus căruciorul gol?",
          "Kur padėti tuščią vežimėlį?",
          "Къде да стои празната количка?"
        ],
        [
          2,
          "Er alt klar til afhentning?",
          "Is everything ready for collection?",
          "Всё готово к выдаче?",
          "Усе готове до видачі?",
          "Czy wszystko jest gotowe do odbioru?",
          "Este totul gata de preluare?",
          "Ar viskas paruošta atsiimti?",
          "Всичко ли е готово за получаване?"
        ]
      ]
    }
  ]
};
