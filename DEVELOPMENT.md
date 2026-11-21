# Job Vocabulary

Static, browser-based vocabulary practice. The current content focuses on Danish
for work and everyday life, with Danish, English, Russian, Ukrainian, Polish and
Romanian interfaces and course translations. All six can be learning or helper
languages. Original corpus rankings remain for Danish, English and Russian;
the additional languages use the shared Danish concept sequence and do not show
invented frequency statistics.

## Build and check

Run these commands from the repository root after content or shared asset changes:

```sh
node data/build-locales.js
node data/build-packs.js
node data/build-lexicon.js
node data/build-pages.js
node --test tests/*.test.cjs
```

`build-packs.js` validates the eight-language course files and updates the small
`packs/index.js` manifest. Courses are loaded only when selected.

`build-pages.js` preserves published course paths in `data/course-urls.json`.
Correcting a translated title does not rename its URL. Keep retired paths reserved;
an intentional URL move requires a redirect plan, rather than deleting this registry.
The builder rejects path collisions and routes outside their language namespace.

Sitemap update dates are recorded in `data/page-updates.json`. Initial dates come
from Git history; actual content, structured-data, link or app changes advance the
date. Rebuilding unchanged pages or changing only a stylesheet/icon cache token
does not refresh it. Historical dates without evidence are omitted. Keep this
registry checked in so routine builds do not invent new modification dates.

`build-lexicon.js` creates `lexicon-v4.json` and its small version/count manifest.
The dictionary is loaded only for saved words or personal lists. Version 4 uses
one record per distinct eight-language meaning and numeric alias references.
The loader also accepts earlier versions:

```text
languages: [da, en, ru, uk, pl, ro, lt, bg]
entries: [id, da, en, ru, uk, pl, ro, lt, bg, isPhrase, pictureConceptId]
aliases: source item ID -> index in entries
```

`lexicon.json` remains a compatible four-language version-2 projection and
`lexicon-v3.json` retains its six-language layout for older tabs. Never change
the row layout at an existing URL. The new manifest selects `lexicon-v4.json`;
all record IDs and source aliases match between projections.

`build-core-translations.js` imports both completed core-language deliveries.
`import-course-languages.js` adds Lithuanian/Bulgarian to existing courses without
changing the previous six fields. Metadata lives in `data/course-labels-lt-bg.json`.
Use `import-new-courses.js` for explicitly selected new courses, then add their
language overlays before building. It refuses to replace existing courses.
The historical `import-course-content.js` is not a recurring synchronization job.
`import-dictionary-languages.js` extends the separately licensed common-word
collection at `dictionary/common-words-v2.json`; its old four-language URL stays
available for previous clients. Keep the CC collection separate from project data.

Keep the generated dictionary checked in: its previous aliases retain IDs when
translations are corrected. Identical records can share an entry; different
meanings must remain separate. Do not overwrite the dictionary with an unrelated
regenerated dataset, or change existing course IDs without an explicit migration.
If a Danish source phrase changes, map its retired source ID to the replacement
in `data/lexicon-migrations.json`; saved words will follow the corrected entry.
For a wording correction to an existing learning item, also retain its immutable
practice ID through `data/stable-word-ids.json`. The pack manifest carries that
mapping to the app; the dictionary accepts both source spellings. Never reuse an
old ID for a different concept. This preserves card history when displayed text
is corrected without rewriting the user's stored progress.
External additions towards a larger common-word dictionary require reviewed
translations, distinct meanings, source attribution and a compatible licence.
Candidates, translation reviews, provenance and common-word extraction tools
live in the private repository `kentambolt/jobvocabulary-private`. Content proposals
are reviewed there using AI; human approval is not a prerequisite. Only selected
app data and necessary public licence notices are copied into this repository.
The ignored `.private/jobvocabulary-private/` checkout is a local convenience, not an app
dependency. Keep reference inputs in the private repository tied to a public commit.
This repository is `kentambolt/jobvocabulary` (renamed from `trafficwords` on 2026-11-19).
A local private checkout must use the remote `kentambolt/jobvocabulary-private`: the old
private name `kentambolt/jobvocabulary` now points to this public repository.

`build-pages.js` writes the six language catalogues and course pages, updates the
sitemap and adds content hashes to shared asset URLs. Existing published course
paths are preserved. The shared category definitions live in `catalog.js`.

### Selected private content imports

The importers take an optional absolute private checkout/source path:

```sh
node data/import-course-content.js .private/jobvocabulary-private
node data/import-dictionary-content.js .private/jobvocabulary-private
node data/build-core-translations.js .private/jobvocabulary-private/content/translations/core-pl-ro.json
```

Only selected learning rows are exported. Source checks, confidence, factual
reviews and generator input data remain private. Polish/Romanian course names and
topic labels are authored in `data/course-labels-pl-ro.json`; UI text lives in
`locales/pl.json` and `locales/ro.json` and is compiled to the small shared script.
Rebuild packs, lexicon and pages after importing. Existing Danish source IDs and
dictionary aliases must survive language expansion. Keep the language data overlay
at the end of `words.js` if regenerating its original four-language base rows.

The 540 Wiktionary-derived meanings remain in the separately distributed
`dictionary/common-words.json`, with attribution and CC BY-SA 4.0 terms linked from
the menu. They are joined to the project dictionary only in browser memory, not
redistributed as a relicensed project dataset. The 29 original supplementary senses
are imported separately; equal records may share an existing dictionary entry.
Missing language equivalents remain empty and are filtered out for that pair.

Country-example sentences such as “Jeg kommer fra Ukraine” remain literal examples
in every translation. Interface language never changes or infers nationality.
Before 2027 publication changes, recheck the 1813/region-specific wording against
current regional information; private fact reviews retain the source details.

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

Public interface and presentation copy avoids Unicode arrow glyphs and en/em
dashes. Learning sentences retain punctuation appropriate to their language.
Use natural interface sentences rather than decorative punctuation. Course cards are single
full-area links. The logo opens `#forside` without changing the current settings,
pending task or stored progress; the home menu offers a return to practice.
The root reserves a stable scrollbar gutter so opening dialogs preserves layout.

The shared visual identity uses a warm, light default palette, Lora headings and
DM Sans interface text. `catalog.js` shares translated home content and native SVG
icons with the static page builder. The desktop home hero uses the local 165 KB
`images/site/study-corner.jpg`; mobile omits the photo and shows the three-step
explanation directly. See `design/EDITORIAL.md` for the image prompt.
Course topic filters use a native details disclosure with labelled checkboxes,
select-all/clear actions and an internally scrolling panel. Multiple choices keep
the panel open and retain focus/scroll; Escape, Done or an outside click closes it.
Topic filtering preserves the existing `cats` schema and card histories.

Correct answers advance immediately, with a persistent previous-answer receipt.
`memory-scheduler.js` uses the locally vendored MIT-licensed ts-fsrs 5.4.2 (FSRS-6).
It applies Good/Again ratings to actual answers and keeps a per-card memory state.
The default model weights are fixed; no personalised parameter training or remote
service is used. Priority-1 words use 92% target retention, other words 90%. For the
general vocabulary priority reflects frequency; job courses use curated importance.
Intervals vary by up to 15%, with a maximum of 365 days. Faster task completion
does not make learned words due. The bounded recent log stores eight compact
timestamp/rating/evidence tuples; memory state summarises older answers. A storage
quota retry reduces optional logs to two entries, keeping the model and counters.

`learning-flow.js` shuffles 7/2/1 slots for new, struggling and learned-review
questions, borrowing available slots when a group is empty. No more than two
review questions in a row displace an available new word. New words are sampled
from a priority window of 20, advancing its first unseen word every tenth draw.
Every third draw within each review group takes its oldest due word to prevent
starvation. Other draws combine overdueness, difficulty and modest priority weight.

Failures receive an early corrective opportunity after 90 seconds. Unmastered
correct answers receive one after five minutes. Recency gating requires up to
eight other words or a two-minute pause. The shared course/language session caps
single-mode word appearances at three, allowing a little more for mixed modes.
It resets after a 30-minute break and persists across reloads. When nothing is
eligible, a ready screen gives the next opportunity and wakes when it is due;
it never fills the gap with unnecessary known-word repetitions.

Legacy IDs, levels and answer counters remain intact. Legacy memory is seeded
conservatively from counters/time, capped at 30 days, marked as estimated, and has
no fabricated log.
Actual placement answers are logged; inferred skipped words have zero observed
answers and are spread over days. Explicit reveals persist an exposure immediately
and Continue never counts it twice. A wrong answer changes only its own card.
Covering the whole eligible pool with at least 80% learned automatically unlocks
the next difficulty that adds words. Unseen words block promotion, and existing
weak cards remain in the expanded pool without changing their errors or schedule.
This preserves the language pair, categories, course and exercise mode. Lists
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
Combined learned counts require mastery in every selected mode. Promotion requires
coverage in every selected mode and at least 80% of words learned across them. Disabling
learned repetitions still permits retries of incorrect or unfinished words. A fully
completed selection stops with an explicit option to enable repetitions. Options
are available before course/list practice and from the navigation menu.
Writing mode uses letter tasks for eligible single words and word tiles for
multiword terms and sentences, including their first appearance. A first sentence
build creates a card only after an actual answer; revealing it records exposure.
Single-word spelling supports 1–32 letters and at most 36 total characters. Long
words wrap their letter cells inside the same 60 px response strip; whole answer
labels keep their existing unbroken-word layout. Keep the minimum letter size
and test bounded prefixes as well as real long words when changing the strip.

`node data/simulate-learning.cjs` reproduces the synthetic baseline comparisons
and one-year coverage checks in `data/reports/learning-simulation.json`. The report
is a software-behaviour check, not measured human learning effectiveness.
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

`data/seo-content.js` assembles the public editorial guides and course-specific
usage sections. `data/guides-{ru,uk,pl,ro,lt,bg}.js` supplies the original guide
translations; new complete guides can live in `data/guides/`. Course contexts in
`data/course-contexts-{da,en,ru,uk,pl,ro,lt,bg}.js` cover every course. Navigation
is defined in `data/guide-ui.js` for all eight languages. `data/seo-pages.js` renders static HTML,
reciprocal language links, visible breadcrumbs and Article/CollectionPage data.
`build-pages.js` adds these pages to the sitemap and links them from courses and
catalogues. The app exposes guides inside its existing menu. Keep the landing
page free of extra SEO blocks and keep course start links above editorial content.
`data/catalogue-copy.js` owns the compact course-finder headings, short mobile
category labels and concise translated search metadata. Its course count comes
from the published packs. Mobile language links use a native details dropdown;
desktop language links remain directly visible, including without JavaScript.

A guide can define `startTopics` using category keys from its first course.
Its primary link then starts those topics directly; the app validates keys against
the public manifest and retains the learner's existing cards and level choice.

`data/social-meta.js` selects relevant existing topic illustrations or generated
course images and writes static Open Graph metadata, image dimensions, locale and
translated alt descriptions. Every new course or guide needs an explicit image
mapping. Use an image that represents the subject, with no overlaid slogan or
generic logo. These images are metadata assets and are not added to the practice
screen. Keep project images in the repository rather than referencing a local
image-generation output path.

Text asset versions use `data/text-asset-version.js` to normalize Windows/Linux
line endings. Use that helper for shared scripts, styles, pack versions and JSON
cache URLs so a checkout does not invalidate otherwise unchanged content.
The app's external scripts use `defer`: they download in parallel and execute in
document order after parsing. Preserve dependency order and do not use `async`.

`WordEntry.search` groups display-equivalent noun records only when all eight
translations match, allowing an optional Danish en/et article. It prefers a record
already in the active list. This affects search and automatic lookup only; it does
not merge dictionary IDs, rewrite saved lists or transfer learning history.
Incomplete translations, different qualifiers and distinct meanings stay separate.

`data/build-lexicon.js` also generates `shared-word-groups.js`, a small index of
active practice IDs with identical translations in all eight languages and the
same word/phrase type. `course-knowledge.js` can reuse actual successful practice
from another course for the same language pair and task type. It preserves the
source schedule without inventing answers or copying review events. Existing
target cards always take precedence, and newer mistakes block older confidence.
Placement estimates alone never propagate. Personal lists and picture practice
remain separate. A course reset records a cutoff so old evidence cannot undo it.

Only add hreflang targets for translations that actually exist. Guide dates are
editorial dates, not build timestamps; update them only after meaningful changes.
Keep distinct search intents on distinct pages, with examples and relevant course
links. Do not generate combinations of jobs, cities and languages without useful
content. Do not add invented search volumes, credentials, reviews or ratings.

Run `node --test tests/seo-pages.test.cjs` after changing public page generation.
It validates sitemap destinations, unique titles/descriptions, canonical URLs,
structured JSON, reciprocal guide translations and internal navigation links.
Google Search Console uses the `jobvocabulary.com` Domain property. Preserve its
Google verification TXT record in Simply.com and the existing HTTPS sitemap URL.

`404.html` is GitHub Pages' custom missing-page response. `not-found.js` localizes
its recovery links from a supported UI hint, path prefix or browser language.
Keep the page out of the sitemap and never redirect unknown URLs to the home page.
Verify a genuinely missing public URL still returns HTTP 404 after deployment.
