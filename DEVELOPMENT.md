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
node --test tests/*.test.cjs
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
Candidates, translation reviews, provenance and common-word extraction tools
live in the private repository `kentambolt/jobvocabulary`. Content proposals
are reviewed there using AI; human approval is not a prerequisite. Only selected
app data and necessary public licence notices are copied into this repository.
The ignored `.private/jobvocabulary/` checkout is a local convenience, not an app
dependency. Keep reference inputs in the private repository tied to a public commit.

`build-pages.js` writes the four language catalogues and course pages, updates the
sitemap and adds content hashes to shared asset URLs. Existing published course
paths are preserved. The shared category definitions live in `catalog.js`.

## Personal vocabulary

`library.js` contains the storage-independent list model; `library-ui.js` contains
the dictionary search, save dialog and list screens. Shared words are saved by ID.
Only manually entered words store their own translations. A word can appear in
multiple lists without copying its dictionary data. Backups merge with existing
lists; a colliding custom-word ID never overwrites a locally edited word.
Lists can be renamed without changing their IDs. Personal vocabulary has its own
persisted language pair (`libraryPair`), list filtering and on-demand pronunciation.
Changing this pair does not change an active course until list practice is started.
Explicit pronunciation works even when automatic exercise audio is switched off.
`word-entry.js` handles exact meanings, optional Danish en/et/at prefixes, language
changes and custom edit drafts. Ambiguous meanings require an explicit choice;
known entries reuse their dictionary ID. Cancelling editing discards only the
draft. Backup imports compare language values independently of property order,
merge nonconflicting translations and reuse prior collision copies on reimport.

Settings, progress and personal vocabulary use browser localStorage under the
existing `topwords.v2` key. They are local to one browser and origin, with no
account or cloud synchronisation. A domain change does not automatically transfer
old localStorage. The personal vocabulary screen offers JSON export and import.

## Interaction

The shared visual identity uses a warm, light default palette, Lora headings and
DM Sans interface text. `catalog.js` shares translated home content and native SVG
icons with the static page builder. The desktop home hero uses the local 165 KB
`images/site/study-corner.jpg`; mobile omits the photo and expands the three-step
explanation only on request. See `design/EDITORIAL.md` for the image prompt.
Course topic filters use a native details disclosure with labelled checkboxes,
select-all/clear actions and an internally scrolling panel. Multiple choices keep
the panel open and retain focus/scroll; Escape, Done or an outside click closes it.
Topic filtering preserves the existing `cats` schema and card histories.

Correct answers advance immediately, with a persistent previous-answer receipt.
`learning-flow.js` selects new and struggling words ahead of a backlog of learned
words. While unfinished material exists, learned-word checks are capped at one
per six completed tasks. The review budget persists with progress and restarts
when difficulty/category scope changes. A wrong answer changes only its own card.
Completing the eligible pool automatically unlocks the next difficulty that adds
words, preserving the language pair, categories, course and exercise mode. Lists
have no automatic difficulty change. Existing word levels and IDs are preserved.
Incorrect answers require an explicit next action. Held keyboard keys cannot
answer several tasks; normal repeat behaviour remains available in text inputs.
Use 1–4 for multiple-choice answers and the keyboard for spelling tasks. Forms and
dialogs do not pass their keystrokes to the exercise underneath.
The header exposes audio and a labelled navigation menu. Exercise context pills,
review counts and new/review badges are omitted. One heart in the prompt opens
favourites, existing lists and new-list creation. The modal captures the source ID
before loading the dictionary and blocks exercise shortcuts while open.
`practice-options.js` normalises one or more selected task types (`settings.modes`)
and the optional `repeatLearned` setting (default true). Multi-mode practice rotates
after each completed task, storing its cursor in `state.modeTurns`; legacy settings
without `modes` retain their single `dir`. Each mode uses its existing progress key.
Combined progress and promotion require mastery in every selected mode. Disabling
learned repetitions still permits retries of incorrect or unfinished words. A fully
completed selection stops with an explicit option to enable repetitions. Options
are available before course/list practice and from the navigation menu.
Catalogue pages read the existing local settings through `practice-resume.js` to
offer direct resume and My words links without loading course or dictionary data.
Resume opens the app without a course-start fragment, preserving mode and filters.
Explicit language links hand `?ui=da|en|ru|uk` to the app; the hint is consumed and
stored separately from the course language pair. Selecting a known language in
setup updates the interface preference. A new user's course-start fragment stays
until practice begins, so refreshing setup retains the selected course. A ready
panel offers immediate start for preselected courses; full settings remain below.
Manual pronunciation in exercises works with automatic read-aloud switched off.
`course-preferences.js` remembers course choices by course/target/base. A temporary
personal-list session never overwrites those choices. Course links and the setup
course picker restore the selected course's own difficulty, direction and category
filter; unseen courses start at priority 1. List practice offers a direct return
to the last real course. Existing card IDs and learning histories are unchanged.

## Hosting and search

GitHub Pages publishes `main` at `https://jobvocabulary.com/`.
The Jekyll `_config.yml` excludes development data, design briefs, tests and
internal content from the published site. Do not add `.nojekyll` without replacing
these exclusions with an equally restrictive deployment build.
`www.jobvocabulary.com` uses GitHub's canonical-host redirect.
Simply.com provides permanent redirects for workvocabulary.com and trafficwords.com,
including their www variants; preserve the path and query string.

Public course pages use self-referencing HTTPS canonicals, reciprocal hreflang
links and stable URLs. Personal list states use fragment routes and are not
included in the public sitemap. Do not redirect visitors based on inferred language.
The driving course is language practice and supplements driving instruction.
