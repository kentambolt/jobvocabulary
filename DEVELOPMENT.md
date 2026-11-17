# Job Vocabulary

Static, browser-based vocabulary practice. The current content focuses on Danish
for work and everyday life, with Danish, English, Russian and Ukrainian interfaces
and translations. The existing general vocabulary also supports English and Russian.

## Build and check

Run these commands from the repository root after content or shared asset changes:

```sh
node data/build-packs.js
node data/build-lexicon.js
node data/build-pages.js
node --test tests/library.test.cjs
```

`build-packs.js` validates the four-language course files and updates the small
`packs/index.js` manifest. Courses are loaded only when selected.

`build-lexicon.js` creates `lexicon.json` and its small version/count manifest.
The dictionary is loaded only for saved words or personal lists. Version 2 uses
one record per distinct four-language meaning and numeric alias references:

```text
entries: [id, da, en, ru, uk, isPhrase, pictureConceptId]
aliases: source item ID -> index in entries
```

Keep the generated dictionary checked in: its previous aliases retain IDs when
translations are corrected. Identical records can share an entry; different
meanings must remain separate. Do not overwrite the dictionary with an unrelated
regenerated dataset, or change existing course IDs without an explicit migration.
If a Danish source phrase changes, map its retired source ID to the replacement
in `data/lexicon-migrations.json`; saved words will follow the corrected entry.
External additions towards a larger common-word dictionary require reviewed
translations, distinct meanings, source attribution and a compatible licence.
`content/incoming/` is for review proposals, not automatically published data.

`build-pages.js` writes the four language catalogues and course pages, updates the
sitemap and adds content hashes to shared asset URLs. Existing published course
paths are preserved. The shared category definitions live in `catalog.js`.

## Personal vocabulary

`library.js` contains the storage-independent list model; `library-ui.js` contains
the dictionary search, save dialog and list screens. Shared words are saved by ID.
Only manually entered words store their own translations. A word can appear in
multiple lists without copying its dictionary data. Backups merge with existing
lists; a colliding custom-word ID never overwrites a locally edited word.

Settings, progress and personal vocabulary use browser localStorage under the
existing `topwords.v2` key. They are local to one browser and origin, with no
account or cloud synchronisation. A domain change does not automatically transfer
old localStorage. The personal vocabulary screen offers JSON export and import.

## Interaction

Correct answers advance immediately, with a persistent previous-answer receipt.
Incorrect answers require an explicit next action. Held keyboard keys cannot
answer several tasks; normal repeat behaviour remains available in text inputs.
Use 1–4 for multiple-choice answers and the keyboard for spelling tasks. Forms and
dialogs do not pass their keystrokes to the exercise underneath.

## Hosting and search

GitHub Pages publishes `main` at `https://jobvocabulary.com/`.
`www.jobvocabulary.com` uses GitHub's canonical-host redirect.
Simply.com provides permanent redirects for workvocabulary.com and trafficwords.com,
including their www variants; preserve the path and query string.

Public course pages use self-referencing HTTPS canonicals, reciprocal hreflang
links and stable URLs. Personal list states use fragment routes and are not
included in the public sitemap. Do not redirect visitors based on inferred language.
The driving course is language practice and supplements driving instruction.
