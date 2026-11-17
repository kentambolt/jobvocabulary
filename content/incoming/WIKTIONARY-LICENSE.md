# License and attribution: Wiktionary-derived word data

This notice covers `content/incoming/common-words.jsonl` and every export built from it. It does not
cover the rest of the repository: the app code, the illustrations and the original course data
(`packs/`, `words.js`, `data/concepts.js`) keep their own terms.

## Source

- **Work:** Wiktionary, the free dictionary (English edition), https://en.wiktionary.org/
- **Authors:** Wiktionary contributors. Each entry's page history on Wiktionary lists its contributors.
- **Extraction:** kaikki.org, using wiktextract. Tatu Ylonen (2022), *Wiktextract: Wiktionary as
  Machine-Readable Structured Data*, LREC 2022.
- **Snapshot:** `content/incoming/common-words.provenance.json` records the snapshot, the source URLs
  and the SHA-256 checksums.
- **Per-row source:** each row's `sourceUrl` points to the Wiktionary page whose translation table the
  row comes from.

## License

Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0),
https://creativecommons.org/licenses/by-sa/4.0/ (legal code:
https://creativecommons.org/licenses/by-sa/4.0/legalcode). Wiktionary text is also available under the GFDL.

The adapted data in `common-words.jsonl` is licensed under CC BY-SA 4.0. Any redistribution of it, or of
an adaptation of it, must:

- keep this attribution,
- link to the license,
- state the changes that were made, and
- be released under the same license.

## Changes made

The data was changed from the Wiktionary source as follows:

- **Selection:**
  - translation tables with Danish, Russian and Ukrainian were selected;
  - Danish lemmas were ranked by frequency;
  - translation tables were kept only when the English headword also appears in the Danish entry's glosses;
  - near-duplicate senses, specialist senses and senses that do not fit Danish usage were removed.
- **Normalisation:**
  - stress marks were removed from Russian and Ukrainian;
  - the Ukrainian apostrophe was normalised to ’;
  - one translation was chosen per language and sense.
- **Metadata:** grammatical gender and countability of Danish nouns were taken from the Danish Wiktionary entry.
- **Review edits:** an editorial review checked the translations against dictionaries. In some places it
  chose a different candidate from the same table, filled in a missing translation, or left a translation
  empty. Values that do not come from the Wiktionary table are marked in the project's internal review
  data.

## Separation from other data

These rows are kept as a separate data package. It is not decided whether a future combined dictionary
with the app's own data counts as an adaptation. That must be assessed before any publication.
