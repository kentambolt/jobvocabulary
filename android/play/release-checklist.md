# Google Play release checklist

Status: preparation only. Age decision confirmed: 16–17 and 18+. Free app created with package com.jobvocabulary.app after the owner explicitly approved the development-policy and US export declarations. Privacy-policy URL saved; version 1.0.1 is in internal testing. No public production release is claimed.

## Store material

DA and EN copy is in listing-*.json and passes the 30/80/4000 character limits. Icon is icon-512.png, derived from the existing brand. Feature graphic is feature-graphic-en.png, rendered from the existing wordmark and colours. Real Android screenshots are still required. Do not use a browser mockup as an Android screenshot. Any Console AI asset declaration must describe the actual production method; do not copy a different app's answers.

Category proposal: Education. No ads, payments, sign-in or account deletion flow. Support: contact@jobvocabulary.com. Website: https://jobvocabulary.com/. Privacy: https://jobvocabulary.com/en/privacy/ (and /da/privacy/).

## Privacy inventory for the actual Data Safety form

This is an evidence inventory, not a completed declaration.

- Native wrapper requests INTERNET and contains no analytics SDK, account, microphone, location or contact feature. Check the final merged manifest and dependency list before submission.
- The web origin stores settings, progress, favourites and lists in browser localStorage. No cloud sync. Shared browser data may survive wrapper uninstall; privacy instructions must explain browser site-data deletion.
- Traffic-update draft: one explicit, revocable statistics opt-in gates pageview/used/heartbeat and the existing three course events in both the web app and TWA. Systems uses IP and limited UA in internal Umami for pseudonymous visit/session estimates and browser/OS/device/approximate area. Systems journal: 30 days; Umami has no automatic expiry yet; encrypted backups: 14 days. No client visitor ID, raw URL/query/referrer or exercise content is sent. Data Safety must cover the actual web processing; do not claim no collection merely because the wrapper has no analytics SDK. Confirm the current Console form before public submission. This web update requires no new Android binary.
- The three aggregate events retain their existing contract: course_started, first_answer and ten_answers. Requests contain project and event, no word, answer, URL, user ID or personal list. IP is handled briefly for abuse protection; daily totals are retained for 90 days plus up to 14 days in backups. DNT/GPC are respected.
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

## Console read-only audit, 25 November 2026

Verified in the Kent Caspersen developer account (7174859766662181721), app 4973223720542746046: production is inactive, application draft, 4 of 11 setup tasks complete. Data Safety is still an incomplete task, not a submitted declaration of no collection. Privacy URL, access, ads and target audience are complete. The consented web traffic update must be included when Data Safety is completed before public Play submission. No form was changed or submitted during this audit; no Android binary release is part of the traffic update.
