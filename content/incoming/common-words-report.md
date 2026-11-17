# Almindelige ord: datakilde, dækning og udestående kvalitetstjek

Dato: 2026-11-17. Gren: `content-review`, lavet ud fra `origin/main@7f2b714`. Leveret af Claude (AI), og ingen modersmålstaler har kigget det igennem endnu.

Denne leverance består af tre filer:

- `common-words.jsonl` er første parti på 279 betydninger fordelt på 183 danske opslagsord.
- `translation-review.json` indeholder forslag til rettelser i essentials og jobpakkerne. Pakkerne er ikke ændret; se det sidste afsnit.
- `data/build-common-words.js` og `data/fetch-wiktionary.sh` gør det muligt at genskabe udtrækket og lave de næste partier.

## 1. Datakilde og licens

**Valgt kilde: Wiktionary.** Jeg bruger den engelske udgave, sådan som kaikki.org har udtrukket den med wiktextract. Udtrækket er fra 2026-10-30 og bygger på et dump fra 2026-10-01.

- **Licens:** Wiktionary-tekst er CC BY-SA 4.0 og dobbeltlicenseret under GFDL. Hver række har `license` og en `sourceUrl`, der peger på den engelske side med oversættelsestabellen.
- **Share-alike:** En ordliste bygget på disse data skal selv udgives under CC BY-SA 4.0 med kildeangivelse ("Wiktionary contributors"). Det gælder også, hvis rækkerne senere flyttes ind i appen. Kent har godkendt valget af kilden, men den licensmæssige konsekvens for projektet bør chefen bekræfte.
- **Akademisk kreditering:** kaikki beder om en henvisning til Ylonen (2022), "Wiktextract", LREC.
- **Hvorfor Wiktionary:** Oversættelsestabellerne er delt op efter betydning. Hver tabel hører til én engelsk betydning og indeholder ofte dansk, russisk og ukrainsk på én gang. Derfor deler de fire sprog betydning, uden at vi selv skal parre dem.
- **Frekvens:** Rangeringen bruger de danske kilder, projektet allerede har (`data/sources.js`): OpenSubtitles, wordfreq og Leipzig. Licenserne for dem står i `data/fetch.sh`.

**Andre kilder, jeg overvejede:**

| Kilde | Licens | Hvorfor den ikke er valgt nu |
|---|---|---|
| DanNet (dansk wordnet) | CC BY-SA 4.0 | Har danske betydninger, men ingen russisk eller ukrainsk. Kan bruges senere til at tjekke danske betydninger. |
| Open English WordNet | CC BY 4.0 | Indeholder kun engelsk. |
| Open Multilingual Wordnet (ru/uk) | Varierer fra sprog til sprog | Russisk og ukrainsk er tyndt dækket, og licenserne er blandede. Ikke undersøgt i dybden. |
| Proprietære oversættelsestjenester og ordbøger | Proprietær | Udelukket af opgaven. Der er ikke hentet noget fra dem. |

## 2. Metode

1. **Danske opslagsord** tages fra den danske del af Wiktionary: 58.686 opslag, hvoraf ca. 15.000 har en målt frekvens. Bøjningsformer tælles med i lemmaets frekvens.
   - Former, der allerede er kerneord, tælles ikke med. Det fjerner støj som "er", "har" og "et" i Wiktionarys bøjningsfelter.
   - Bydeformer tælles ikke med, fordi de ofte er lig med et andet ord (fx digte → "digt").
   - Andre former, der deles af flere lemmaer, deles ligeligt mellem dem.
2. **Ord, appen allerede har, springes over.** Det gælder kernelistens 386 begreber og deres bøjningsformer. Eksisterende id'er er ikke ændret. Nye id'er har formen `cw-<dansk>-<ordklasse>-<hash af engelsk ord, ordklasse og betydning>`, er stabile mellem kørsler og kan ikke kollidere med kerne-id'er.
3. **Krydstjek af betydningen.** En oversættelsestabel bruges kun, hvis to ting holder:
   - Det engelske opslagsord står også i det danske opslags glosser, så Wiktionary er enig med sig selv i begge retninger.
   - Ordklassen passer.

   Tabeller uden betydningsangivelse springes over, og der tages højst 4 betydninger pr. lemma pr. parti.
4. **Valg af ru/uk.**
   - Ord markeret som arkaiske, sjældne, slang og lignende vælges fra.
   - For verber foretrækkes uperfektivt aspekt, som i kernelisten.
   - Trykaccenter fjernes, men ё bevares.
   - Ukrainsk apostrof normaliseres til `’`, som pakkerne bruger.
5. **Gennemgang.** Jeg gennemgik alle 450 kandidater fra første parti én for én. Det kom der ud af:
   - **Behold:** 233 rækker (`ai-reviewed`).
   - **Behold, men tom ru/uk:** 46 rækker (`needs-native-review`).
     - Det gælder, hvor kilden manglede en oversættelse, eller hvor kildens ord var forkert i den danske betydning.
     - Usikre oversættelser er ikke udfyldt med gæt.
   - **Andet ord fra kilden:** 37 rækker.
     - Når kildens første forslag var dårligere, valgte jeg et af kildens egne alternativer, fx uk "частка" i stedet for "доля" for del/share.
     - Der er ikke indsat ord udefra, så `sourceUrl` dækker stadig hver værdi.
   - **Frasorteret:** 171 rækker.
     - 100 var næsten-dubletter: samme ord på alle fire sprog og kun en nuance til forskel. Forskellige betydninger med forskellige oversættelser er bevaret som separate rækker.
     - 31 var betydninger, der ikke passer til dansk brug, fx *mene* = "of a word: to signify".
     - 40 var fagbetydninger fra matematik, curling og kortspil og lignende.

## 3. Dækning

**Første parti:**

| | Antal |
|---|---|
| Lemmaer i partiet (rang 1–200 efter kernelisten) | 188 |
| Lemmaer med mindst én række efter gennemgang | 183 |
| Rækker (betydninger) | 279 |
| `ai-reviewed` (alle fire sprog udfyldt og tjekket) | 233 |
| `needs-native-review` | 46 (10 uden ru, 42 uden uk) |

**Hele kilden frem mod 10.000 ord** (`node data/build-common-words.js 20000`):

| Danske lemmaer, sorteret efter frekvens | Lemmaer med krydstjekket betydning | Betydninger (før gennemgang) | med ru | med uk | med begge |
|---|---|---|---|---|---|
| top 1.000 | 931 | 1.963 | 95 % | 76 % | 76 % |
| top 5.000 | 4.518 | 7.397 | 94 % | 73 % | 72 % |
| alle (ca. 10.200) | 9.154 | 12.935 | 91 % | 67 % | 67 % |

**Hvad tallene betyder:**

- Wiktionary kan alene give ca. 9.150 nye opslagsord. Med kernelistens 386 bliver det ca. 9.500. Det er tæt på målet på 10.000, men ikke helt.
- I første parti holdt 62 % af kandidaterne gennem gennemgangen. Overføres det til hele kilden, giver det ca. 8.000 betydningsrækker.
- Ukrainsk er flaskehalsen. Kun ca. 2 ud af 3 betydninger har ukrainsk i kilden, og blandt de mindre almindelige ord falder andelen yderligere.
- Rang 1–200 er nu brugt. Næste parti hentes med `node data/build-common-words.js 200 200`.

## 4. Udestående kvalitetstjek

1. **Ingen modersmålstaler har set rækkerne endnu.** `ai-reviewed` betyder, at Claude har tjekket rækken mod kilden og mod almindelig dansk brug. Før rækkerne går i appen, bør en dansk og en russisk/ukrainsk modersmålstaler gennemgå dem. Status-værdierne er:
   - `ai-reviewed`: alle fire felter er udfyldt og tjekket.
   - `needs-native-review`: et eller flere felter er bevidst tomme eller tvivlsomme.
2. **De 46 rækker med `needs-native-review`.** Disse har en særlig bemærkning:
   - *man* (pron.): russisk og ukrainsk har ikke et tilsvarende pronomen.
   - *lige* (blødgørende "kan du lige …").
   - *helt*: "вполне" betyder "temmelig".
   - *siden* (konj.): uk mangler "відтоді як".
   - *heller (ikke)*.
   - *flytte* (uk).
   - *skat* (kæleord, ru).
   - *hente*: "приносить" betyder "bringe", ikke "hente".
   - *grundet*: ingen ru/uk i kilden.
3. **Manglende hovedbetydninger.** Wiktionarys krydstjek ramte ikke den almindeligste betydning for nogle ord, og de skal tilføjes fra en anden kilde eller i hånden:
   - **Ingen række overhovedet:** *selv* (sig selv; "selv om"), *flere* (flere = more/several), *vel* (formodning: "du kommer vel?"), *bag* (= behind), *slet* ("slet ikke").
   - **Mangler en betydning:**
     - *lide* (kan lide = like), *ret* (en ret = dish; adv. "ret godt"), *rejse* (rejse sig = rise)
     - *tæt* (= close), *nummer* (= number), *forhold* (forholdene = conditions), *lov* (få lov = permission)
     - *mål* (= measure), *stemme* (verbum = vote), *grund* (= plot of land), *masse* (en masse = a lot)
     - *tur* (= walk, trip), *fald* (i hvert fald), *række* (række hånden), *søge* (søge job = apply)
     - *skade* (= injury), *vis* (= certain), *jord* (Jorden = Earth)
4. **Rangeringen er omtrentlig.** Frekvensen er målt på ordformer, og homografer deles ligeligt. Derfor ligger nogle sjældne betydninger højt, fx *man* = "mane" og *bede* = "beet". Frekvensen bør kun bruges til at vælge partier, ikke som endelig sværhedsgrad.
5. **Danske navneord er uden artikel.** Wiktionary giver køn (common/neuter), men rækkerne har ingen "en/et". Pakkerne viser artiklen, og jeg foreslår også at tilføje den i essentials. Det skal besluttes, før rækkerne flettes ind.
6. **Overlap med pakkerne.** 40 af partiets opslagsord findes også i essentials eller en jobpakke (fx *minut*, *måned*, *aftale*, *køre*, *fejl*). Ofte er det en anden betydning eller form. Overlappet bør afklares, når listen flettes ind i appen.
7. **`sense` er en engelsk glose fra Wiktionary,** ikke en dansk forklaring. Hvis appen skal vise betydningen for brugeren, skal den oversættes eller omskrives.
8. **Aspekt i ru/uk.** Verber står i uperfektivt aspekt, hvor kilden markerer det. Hvor kilden ikke markerer aspekt, er det kildens første ord, og det bør tjekkes.

## 5. Oversættelsestjek af pakkerne (translation-review.json)

Omfanget var:

- Alle 84 rækker i `packs/essentials.js` fra `origin/codex/jobvocabulary@7dcae3a`.
- Alle 1.887 ord-rækker (fagtermer) i de otte jobpakker på `origin/main@7f2b714`.
- Sætningsrækkerne og køreprøve-pakken (`driving.js`) er **ikke** gennemgået.

Resultatet er 103 forslag: 5 fejl (error), 65 forbedringer (improvement) og 33 tvivlspunkter til en modersmålstaler (check). Ingen pakker er ændret.

**Hovedpunkter:**

- **Essentials** skriver danske navneord uden artikel, mens de otte jobpakker bruger artikel (20 forslag).
- **"venstre/højre"** bør være "til venstre/til højre", så det passer med ru "налево" og uk "ліворуч".
- **"aftale"** er oversat med "встреча/зустріч", der betyder møde. Det bør afklares, hvilken betydning der menes.
- **Fejl:**
  - ru/uk "саламандр" → "саламандра"
  - uk "віночок" → "вінчик"
  - uk "цегла" → "цеглина"
  - uk "тримач для телефона" → "телефону"
- **Amerikansk engelsk i britiske pakker:** extension cord, litter box, do the dishes, pallet jack, hand truck og washcloth.
- **"Sygemelding"** har tre forskellige engelske termer på tværs af pakkerne.
- **"stige"** betyder trappestige i nogle sprog og almindelig stige i andre.

Forslag med `proposed: null` er reelle problemer, men rettelsen skal komme fra en modersmålstaler.
