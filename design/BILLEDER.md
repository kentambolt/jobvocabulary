# Billeder til Topwords

Billederne bruges kun, når man lærer sit **modersmål**: typisk børn, der lærer at læse. Man ser et billede og vælger det rigtige ord, eller man ser et ord og vælger det rigtige billede blandt fire. Når man lærer et fremmedsprog, vises der ingen billeder, kun oversættelser.

Der er ingen emoji eller standardikoner i appen. Alle billeder skal laves til formålet.

## Hvad skal laves

**[billeder.csv](billeder.csv)** indeholder alle 195 motiver, sorteret efter prioritet. Kolonnerne er:

| Kolonne | Indhold |
|---|---|
| `fil` | Det præcise filnavn billedet skal have, fx `dog.webp` |
| `dansk` / `engelsk` / `russisk` / `ukrainsk` | Ordet billedet skal forestille |
| `motiv` | Beskrivelse på engelsk, som kan bruges direkte i en prompt |
| `prioritet` | `høj` = let-niveauet, som børn møder først |
| `status` | `findes` / `mangler`. Opdateres automatisk, når billederne er lagt ind |

Modersmåls-mode åbner, når der er mindst 8 billeder til et sprog. Start med `høj`.

## Stil

Alle billeder skal ligne hinanden. De skal ligne et sæt, ikke 195 tilfældige billeder.

- **Udtryk:** venlig, flad illustration med bløde former og få detaljer. Det skal være til børn, men ikke babyagtigt.
- **Ét motiv pr. billede,** centreret og tydeligt. Ingen forstyrrende baggrund.
- **Baggrund:** transparent eller helt ensfarvet lys (samme farve på alle). Billedet skal se godt ud på både lys og mørk baggrund.
- **Ingen tekst, bogstaver eller tal-cifre i billedet.** Ellers afslører billedet svaret. Tal vises som et antal ting (fx tre æbler), farver som en klat i farven.
- **Ingen forvekslinger.** Fire billeder står ved siden af hinanden, så de må ikke kunne forveksles. Disse par skal især kunne kendes fra hinanden:
  - *gå* og *løbe*
  - *mand* og *far*, *kvinde* og *mor*
  - *barn*, *dreng* og *pige*
  - *bedstefar* og *mand*
  - *hus* og *hjem*
  - *glad* og *grine*
  - *trist* og *græde*
  - *æble* (grønt) og tal-billederne (røde æbler)
- **Personer:** blandet hudfarve, hårfarve og alder. Ingen kendte figurer, ingen logoer, ingen mærkevarer.

Skriv gerne en fælles stil-prompt, der sættes foran hvert `motiv`. Eksempel:

> Flat vector illustration for a children's reading app, soft rounded shapes, friendly, limited warm colour palette, centred single subject, plain transparent background, no text, no letters, no numbers. Subject: *{motiv}*

## Format og levering

- **Kvadratisk,** mindst 512 × 512 px, gerne 1024 × 1024.
- **WebP** (helst), PNG eller JPG. Maks. ca. 150 kB pr. billede.
- **Filnavn** præcis som i kolonnen `fil`.
- **Læg filerne i** `images/words/` og kør `node data/build.js`. Så finder appen dem selv, og `billeder.csv` opdaterer status.

## Ikoner i brugerfladen (valgfrit)

Appen har tre små ikoner, jeg har tegnet som simple streger. Designeren må gerne erstatte dem med egne:

| Ikon | Bruges til | Fil |
|---|---|---|
| Statistik | Knap øverst til højre | `index.html` |
| Indstillinger | Knap øverst til højre | `index.html` |
| Højttaler | Læs ordet højt | `app.js` (`speakBtn`) |

Leveres som SVG med `currentColor`, så farven følger lyst og mørkt tema.
