# Adaptive-practice simulation

These are reproducible synthetic behaviour checks, not human retention results.
Run `node data/simulate-learning.cjs` to refresh the accompanying JSON report.

## First-session comparison

Scope: the first 120 actual easy Russian words. Each run answers 100 questions
at four seconds per question. Each profile runs with 30 fixed seeds. Outcomes are
fixed per word/attempt, independently of the scheduler's random draws. The old
scheduler is the verbatim snapshot from main commit `9036583`; its original level
updates, time/task formula and learned-review budget are retained by the simulator.

| Synthetic profile | Distinct words before | Distinct words after | Most appearances of one word after, averaged |
| --- | ---: | ---: | ---: |
| Always correct | 86.00 | 100.00 | 1.00 |
| Gradually learns words | 31.87 | 84.70 | 2.47 |
| Always fails a fixed subset | 9.00 | 85.20 | 3.00 |
| Starts with low recognition | 26.77 | 84.63 | 2.63 |

The poor-subset baseline demonstrates a starvation case in the old deterministic
priority order: two repeatedly failed words can prevent further introductions.
The new mix, time gates and per-session cap break that loop. Profiles model graded
answers; native-picture introductions and explicit answer reveals are covered by
separate integration tests.

## Longer-term checks

With up to 20 questions per day for 365 simulated days, all 120 words were both
introduced and shown again for each of the four profiles (seed 42). Sessions end
when nothing is eligible, rather than filling time with premature repetitions.

A separate model check gives every pattern the same answer dates: days 0, 1, 3,
8, 20, 60 and 120. With the first-priority retention target and neutral jitter,
seven correct answers produce a 245-day next model interval. Three correct out of
seven produce three days. Seven failures produce a one-day model interval plus a
short corrective opportunity after 90 seconds, subject to recency and session caps.
These are fixture-specific outputs, not universal promises for seven answers.

## Automated assertions

Tests cover the approximate 70/20/10 mix when all groups are available, varied
introduction order, complete longer-term coverage, bounds on per-session repeats,
clock-based eligibility, interval jitter, actual app grading, real versus inferred
placement observations, persisted answer reveals, waiting-screen/reload behaviour,
and non-destructive migration of existing counters. The tests also distinguish
seven quick successes from seven successes spread over time.
