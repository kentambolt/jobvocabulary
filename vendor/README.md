# ts-fsrs

`ts-fsrs-5.4.2.js` is the browser/Node UMD distribution from the MIT-licensed
`ts-fsrs@5.4.2` npm package. This version implements FSRS-6, supports the existing
buildless browser app and Node 22 test environment, and needs no remote runtime,
WASM download, new build pipeline or installation scripts.

- Source: https://github.com/open-spaced-repetition/ts-fsrs
- Package: https://registry.npmjs.org/ts-fsrs/-/ts-fsrs-5.4.2.tgz
- Package SHA-1: `7bd23da3d8a35368b813f4064eabe829a46f9901`
- License: `TS-FSRS-LICENSE.txt`

The application wrapper in `memory-scheduler.js` controls the retention target,
jitter, migration and compact local state. It updates individual card memory with
the library's default weights; it does not train personalised parameter weights.
