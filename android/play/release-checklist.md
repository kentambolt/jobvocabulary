# Google Play release checklist

Status: preparation only. Age decision confirmed: 16–17 and 18+. App/free selected on the creation form; no binding declarations accepted and no app created.

## Store material

DA and EN copy is in listing-*.json and passes the 30/80/4000 character limits. Icon is icon-512.png, derived from the existing brand. Feature graphic is feature-graphic-en.png, rendered from the existing wordmark and colours. Real Android screenshots are still required. Do not use a browser mockup as an Android screenshot. Any Console AI asset declaration must describe the actual production method; do not copy a different app's answers.

Category proposal: Education. No ads, payments, sign-in or account deletion flow. Support: contact@jobvocabulary.com. Website: https://jobvocabulary.com/. Privacy: https://jobvocabulary.com/en/privacy/ (and /da/privacy/).

## Privacy inventory for the actual Data Safety form

This is an evidence inventory, not a completed declaration.

- Native wrapper requests INTERNET and contains no analytics SDK, account, microphone, location or contact feature. Check the final merged manifest and dependency list before submission.
- The web origin stores settings, progress, favourites and lists in browser localStorage. No cloud sync. Shared browser data may survive wrapper uninstall; privacy instructions must explain browser site-data deletion.
- The website sends three aggregate events: course_started, first_answer and ten_answers. Requests contain project and event, no word, answer, URL, user ID or personal list. IP is handled briefly for abuse protection; daily totals are retained for 90 days plus up to 14 days in backups. DNT/GPC are respected.
- GitHub Pages receives network connection data including IP when serving the website. Do not claim the whole product has no data handling simply because the native wrapper has no SDK.
- Read-aloud uses browser speech synthesis. The browser/OS may use an online voice provider. Do not claim all speech is offline. Examine the actual Data Safety questions for this user-requested processing.
- No public user content or communication between learners. Educational medical/job/legal vocabulary is not a healthcare or advisory service.

Review official guidance against the exact Console questions: https://support.google.com/googleplay/android-developer/answer/10787469?hl=en

## Test evidence still required

- Fresh install / launch / reopen / deep link / Back and offline failure behavior.
- No AndroidRuntime crash. No claim of TWA verification on a fallback Custom Tab.
- Language and first exercise at phone and tablet sizes; audio availability and mute.
- Favourites, own lists, repeated sessions and update preserve browser progress.
- Google-signed APK after accepted internal upload and correct Digital Asset Links.
- Use the isolated QA emulator and suppress synthetic production analytics before online exercises. Never use another product's browser profile, test users, keys or review credentials.
