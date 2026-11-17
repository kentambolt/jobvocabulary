# Rapport: indholdsreview, parti 2

Dato: 2026-11-17. Gren: `content-review`, bygget på `origin/main@64f6a60`. Opfølgning på `content/reviews/pr-9-review.json`. Udført af Claude (AI). Ingen pakke, `app.js`, brugerflade eller DNS er ændret. Alle rettelser er forslag.

## Metode

- **Flere uafhængige AI-gennemgange.**
  - Sætningsrækker og `driving.js` er gennemgået i to retninger: gennemgang A læser fra dansk mod målsproget, gennemgang B fra ukrainsk/russisk mod dansk.
  - De 46 åbne betydninger, de 33 tvivlspunkter og de nye ord fik hver to uafhængige gennemgange.
  - Uenigheder er afgjort med ordbøger og fagkilder: DDO, СУМ/goroh, gramota, ПДР/ПДД, producent- og branchekilder samt retsinformation.dk og Færdselsstyrelsen.
- **Tomme felter.** Et felt står kun tomt, hvis betydningen ikke kan gengives forsvarligt.
- **Intet menneskeligt godkendelseskrav.** Status og usikkerhed registreres internt pr. sprog og betydning.

## Leverancer i `content/incoming/`

| Fil | Indhold |
|---|---|
| `common-words.jsonl` | 278 betydninger (183 lemmaer). Nye felter `gender` og `countability` for navneord. |
| `common-words.review.json` | Internt: pr. betydning og sprog status, sikkerhed, værdiens kilde (Wiktionary eller AI-review), afgørelse, usikkerhed og evidens. |
| `common-words.provenance.json` | Kildeversioner, checksums, scriptrevisioner og hvordan partiet genskabes. |
| `WIKTIONARY-LICENSE.md` | Licens, kildeangivelse og liste over ændringer for de Wiktionary-afledte data. |
| `translation-review.json` | De 103 forslag fra parti 1. Opdateret med reviewets afgørelser, tr-046 og de 33 tvivlspunkter. |
| `phrase-and-driving-review.json` | 155 punkter (151 forslag, 4 afviste) til sætninger og `driving.js`, inklusive 8 ID-migreringer. |
| `driving-facts.json` | Faktatjek af `driving.js`: 68 rækker med kilde, paragraf, lovversion og reviewdato. |

## Resultater

### Almindelige ord (`common-words.jsonl`)

**De 46 tidligere åbne betydninger** er genbehandlet med to uafhængige gennemgange. Kun *man* (ubestemt pronomen) står tomt på russisk og ukrainsk, fordi sprogene ikke har noget tilsvarende pronomen. Rettelser blandt andet:

| Ord | Før | Efter |
|---|---|---|
| *mene* | думать | считать / вважати |
| *måtte* (tilladelse) | мочь | можно / можна |
| *holde* (holde i en tilstand) | сохранять | держать / тримати |
| *tabe* (vægt) | худеть | сбрасывать / скидати |
| *heller* | также не | тоже не / теж не |
| *færdig* | законченный | готовый / готовий |
| *hente* | приносить | забирать / забирати |

**Alle 279 rækker fik en ekstra uafhængig gennemgang.** Den førte til 26 rettelser, bl.a.:

- *ret vinkel*: прямой / прямий
- *dele* (dele en mening): uk поділяти
- *forhold* (romantisk forhold): uk стосунки
- *endelig*: наконец / нарешті
- 7 rettelser af tællelighed

Én række er fjernet: *sidst* som tillægsord, fordi tillægsordet hedder *sidste*.

**Navneord:** Køn er sat ud fra Wiktionarys opslag for hver betydning og kontrolleret i den anden gennemgang. Tvivlstilfælde er slået op i DDO. Tællelighed er sat ud fra betydningen, og alle 95 navneord har nu begge felter.

**Værdiernes kilde:** 76 værdier kommer fra AI-review og ikke fra Wiktionary-tabellen. De er markeret som `valueSource: ai-review` i review-filen.

### Pakkerne

**`translation-review.json`** følger reviewets afgørelser:

- tr-044, tr-045 og tr-066 er anvendt på main.
- tr-101 er afvist: "телефона" beholdes, fordi det er apparatet, der menes.

**tr-046 (piskeris) er genundersøgt.** Anbefalingen er uk **"вінчик"**:

- Ordbøgerne kender "віночок" som en lille krans eller en blomsterkrone, ikke som piskeris.
- Den akademiske ordbog СУМ-11 fører piskeriset under "віничок".
- "вінчик" er den udbredte nutidige form og svarer til ru "венчик".

**De 33 tvivlspunkter** er afgjort ved to uafhængige gennemgange og med kilder: 11 beholdes og 22 ændres, fx koben = лом-гвоздодёр / лом-цвяходер, at stemple ind = отмечать приход / відмічати прихід, sautere = быстро обжаривать og kimplante = сеянец / сіянець. Intet punkt står uafgjort.

**Sætninger og `driving.js`** gav 151 forslag. 11 af dem er egentlige fejl, bl.a.:

- uk "виставь" skal være "вистав".
- Sikkerhedsinstrukser mister deres "skal". Det gælder fx forflytning (det skal ske med to personer), at varm mad skal holdes over 65 °C, og høreværn.
- "задел" skal være "въехал" i en skadesanmeldelse.

**Faktatjekket af køreprøven** viste 2 forkerte og 8 misvisende rækker ud af 68 rækker med kontrollerbare fakta:

- **Motorvej:** Den generelle grænse er 130 km/t, jf. færdselsloven § 42, stk. 2. Pakken siger "normalt 110".
- **17-årige:** Siden 1. juli 2025 må de køre alene kl. 5–20.
- **Tolk:** Siden 1. januar 2025 kan teori- og køreprøven ikke tages med tolk.
- **Varslingslinje:** Det officielle ord er "varslingslinje", ikke "varsellinje".
- **For absolutte regler:** Højre vigepligt, overhaling ved fodgængerfelt og sikkerhedssele er formuleret strengere end loven.

0,2 promille for nye bilister er bekræftet (lov nr. 567 af 27. maj 2025). Pakkens kommentar henviser til lovforslaget L 165.

**Migreringer.** Otte forslag ændrer en dansk tekst og har derfor en migrering af ID'et (`from` → `to`), der kan lægges i `data/lexicon-migrations.json`.

## Licens og kildeangivelse

Reviewets licensafgørelse er fulgt:

- **Separat datapakke:** De Wiktionary-afledte data udgives som en separat datapakke under CC BY-SA 4.0 med egen licens- og kildeangivelse (`WIKTIONARY-LICENSE.md`). Licensen for resten af repoet er ikke ændret.
- **Sporbarhed:** Kilde og snapshot bevares gennem udtræk, review og eksport (`common-words.provenance.json`).
- **Kombineret ordbog:** Det er ikke afgjort, om en senere samlet ordbog bliver en bearbejdelse. Det skal vurderes før offentliggørelse.

## Download

`data/fetch-wiktionary.sh` er nu atomisk:

- **Fejl stopper kørslen:** `pipefail` bruges gennem hele kæden.
- **Cachen udskiftes først til sidst:** Alt skrives til en midlertidig mappe, gzip-filerne kontrolleres, hver linje skal kunne parses, og der kræves et minimumsantal betydninger. Først derefter udskiftes cachen.
- **Sporbar kørsel:** Kørslen skriver `provenance.json` med kilde-URL, Last-Modified, sha256 for input og output, snapshotdatoer, wiktextract-revision og scriptrevisioner.
- **Uændrede kilder kan kræves:** `--verify` stopper, hvis kilderne afviger fra det gennemgåede parti.

Afprøvet:

- **Ny kørsel:** gav identiske checksums med det gennemgåede parti.
- **Fejlet download:** efterlod cachen uændret og ingen midlertidige filer.

## Udestående

- **Næste parti** (rang 201–400): `node data/build-common-words.js 200 200`. Først køres `bash data/fetch-wiktionary.sh --verify`.
- **Manglende hovedbetydninger** skal tilføjes fra en anden kilde, bl.a.:
  - *selv*, *flere*, *vel*, *bag*, *slet ikke* og *sidste*
  - *kan lide*, *nummer* = number, *ret* = dish, *tæt* = close og *lov* = permission
- **Lovgrundlaget:** Faktatjekket bygger på LBK nr. 118 af 12. januar 2026. Senere ændringslove er ikke kontrolleret. Fakta bør tjekkes igen ved hver lovændring.
- **Offentlig synlighed:** Repoet er offentligt, og GitHub Pages udgiver hele `main`. Review- og kildeoplysningerne i `content/` er derfor offentligt tilgængelige. Skal de være interne, skal de flyttes ud af repoet eller udelukkes fra udgivelsen. Det skal besluttes.
