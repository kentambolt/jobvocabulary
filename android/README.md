# JobVocabulary Android

Trusted Web Activity around https://jobvocabulary.com/. Existing browser exercises, voice support and local progress remain on the web origin. Internet is required; no offline course availability is promised.

## Identity and current state

Proposed production package: com.jobvocabulary.app. Google Play reports it available, but it has not been reserved. QA uses com.jobvocabulary.app.qa. Target audience confirmed by the owner: 16–17 and 18+. Developer account: Kent Caspersen, ID 7174859766662181721. No release has been submitted.

Android 8/API 26 minimum, Android 16/API 36 target. Android Browser Helper 2.7.4. The launcher requires ManageDataLauncherActivity to be declared. Do not remove it. Native permissions: INTERNET only. The merged dependency manifest must also be checked for each release.

## Build

Use JDK 17, Android SDK 36 and Gradle 8.13. The wrapper pins the Gradle distribution checksum. Run android/build-qa.ps1 with explicit SdkPath and GradlePath. It builds assembleDebug, lintDebug and bundleRelease. Offline builds require an existing dependency cache. The script creates an isolated QA key, never a production key.

Production signing is configured only through JV_ANDROID_KEYSTORE, JV_ANDROID_STORE_PASSWORD, JV_ANDROID_KEY_ALIAS and JV_ANDROID_KEY_PASSWORD. Keep signing material outside Git. Without these values bundleRelease produces an unsigned AAB and is not upload-ready.

The web host excludes android/ through _config.yml. The web manifest and images/app are public application assets. Re-render the existing brand icons using android/tools/build-icons.ps1.

## Release gates

1. Owner confirms permanent package name and the declarations on Google's creation form.
2. Build a release-signed bundle with a separate upload key and retain an authorized private backup.
3. Upload to internal testing on the verified account. Obtain the Google Play APP SIGNING certificate, not the upload certificate.
4. Publish .well-known/assetlinks.json for the confirmed production package and Google certificate. Preserve any existing associations. Never disable origin verification to make a test pass.
5. Install the Google-signed APK. Test cold launch, reopen, course/deep links, Back navigation, audio, local saved words and upgrade without data loss. Confirm full-screen TWA rather than Custom Tab fallback.
6. Capture real Android screenshots. Complete truthful Data Safety, target audience, rating and store listing declarations. Submit only after the actual checks pass.

See play/readiness.json for evidence status. Local compilation is not startup, installation or Google-signed release testing.
