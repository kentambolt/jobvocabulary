# Topwords – ordfrekvenser

Genereret af `data/build.js` den 2026-11-16. 386 begreber.

## Metode

- Ordene lærer man som **opslagsord** (fx *være*), så hvert ords frekvens er summen af dets bøjningsformer (*er, var, været*) i ordformslisterne. Formerne står i `data/concepts.js`. Former, der også betyder noget andet, tælles kun delvist (fx dansk *tog* = både "train" og "took").
- Russisk Nationalkorpus er allerede opgjort pr. opslagsord og bruges direkte.
- Kilderne kombineres som et **vægtet geometrisk gennemsnit**. Talesprog (undertekster) og blandede kilder vægtes højest, fordi appen handler om hverdagssprog; Wikipedia vægtes lavest.
- Ord, der ikke findes i nogen kilde (flerordsudtryk som *i dag*), får gennemsnittet af de andre sprogs estimat for samme begreb.

## Dansk

| Kilde | Vægt | Type | Enighed med samlet bud (Spearman) |
|---|---|---|---|
| OpenSubtitles 2018 | 2 | ordformer | 0.97 (383 ord) |
| wordfreq (blandede kilder) | 2 | ordformer | 0.99 (383 ord) |
| Leipzig nyheder 2022 | 1 | ordformer | 0.95 (373 ord) |
| Leipzig Wikipedia 2021 | 0.5 | ordformer | 0.90 (379 ord) |

### Top 60

| # | Ord | Pr. mio. | subs | wordfreq | news | wiki |
|---|---|---|---|---|---|---|
| 1 | være | 41759 | 1 | 1 | 2 | 3 |
| 2 | det | 26758 | 3 | 6 | 6 | 12 |
| 3 | i | 26523 | 9 | 2 | 1 | 1 |
| 4 | en | 25441 | 6 | 4 | 5 | 4 |
| 5 | og | 23267 | 10 | 3 | 4 | 2 |
| 6 | at | 20741 | 8 | 7 | 3 | 6 |
| 7 | have | 17158 | 7 | 8 | 9 | 17 |
| 8 | til | 14658 | 12 | 9 | 8 | 7 |
| 9 | af | 14528 | 25 | 5 | 10 | 5 |
| 10 | på | 13951 | 13 | 10 | 7 | 10 |
| 11 | ikke | 13539 | 5 | 12 | 16 | 20 |
| 12 | jeg | 11744 | 2 | 11 | 31 | 130 |
| 13 | for | 11725 | 18 | 13 | 12 | 15 |
| 14 | med | 11414 | 16 | 14 | 14 | 13 |
| 15 | der | 11059 | 20 | 17 | 11 | 16 |
| 16 | den | 10878 | 23 | 15 | 15 | 8 |
| 17 | de | 10423 | 22 | 18 | 13 | 14 |
| 18 | kan | 9240 | 14 | 19 | 19 | 21 |
| 19 | du | 8841 | 4 | 16 | 58 | 173 |
| 20 | han | 7410 | 21 | 24 | 22 | 18 |
| 21 | så | 7236 | 17 | 20 | 25 | 34 |
| 22 | som | 7058 | 37 | 21 | 17 | 11 |
| 23 | vi | 6290 | 11 | 22 | 27 | 125 |
| 24 | blive | 6189 | 40 | 26 | 18 | 9 |
| 25 | om | 5982 | 33 | 23 | 20 | 23 |
| 26 | skal | 5933 | 26 | 25 | 24 | 35 |
| 27 | men | 5658 | 31 | 27 | 23 | 24 |
| 28 | vil | 4995 | 24 | 31 | 29 | 51 |
| 29 | fra | 4623 | 56 | 28 | 21 | 19 |
| 30 | få | 4505 | 41 | 30 | 28 | 29 |
| 31 | god | 4242 | 34 | 29 | 41 | 55 |
| 32 | komme | 3765 | 29 | 39 | 36 | 44 |
| 33 | nu | 3314 | 35 | 36 | 37 | 86 |
| 34 | gøre | 3250 | 30 | 46 | 49 | 60 |
| 35 | hvor | 3245 | 49 | 33 | 35 | 31 |
| 36 | hvad | 3094 | 15 | 52 | 81 | 118 |
| 37 | se | 3064 | 38 | 34 | 48 | 80 |
| 38 | her | 3050 | 28 | 49 | 50 | 95 |
| 39 | hun | 2893 | 39 | 60 | 38 | 37 |
| 40 | gå | 2876 | 44 | 47 | 44 | 52 |
| 41 | ud | 2871 | 48 | 42 | 42 | 45 |
| 42 | når | 2738 | 58 | 37 | 40 | 38 |
| 43 | sige | 2690 | 43 | 63 | 26 | 110 |
| 44 | anden | 2606 | 66 | 41 | 32 | 27 |
| 45 | også | 2570 | 82 | 32 | 30 | 26 |
| 46 | hvis | 2519 | 50 | 40 | 56 | 84 |
| 47 | mig | 2458 | 19 | 44 | 124 | 230 |
| 48 | min | 2411 | 27 | 35 | 113 | 203 |
| 49 | efter | 2398 | 72 | 45 | 34 | 25 |
| 50 | denne | 2358 | 62 | 38 | 79 | 22 |
| 51 | noget | 2280 | 45 | 53 | 64 | 107 |
| 52 | alle | 2178 | 59 | 48 | 61 | 48 |
| 53 | tage | 2152 | 54 | 61 | 55 | 64 |
| 54 | eller | 2138 | 67 | 50 | 53 | 30 |
| 55 | op | 2104 | 60 | 55 | 46 | 57 |
| 56 | vide | 2008 | 55 | 62 | 71 | 58 |
| 57 | stor | 1956 | 101 | 51 | 39 | 28 |
| 58 | dem | 1906 | 52 | 66 | 70 | 75 |
| 59 | meget | 1840 | 68 | 54 | 59 | 61 |
| 60 | over | 1814 | 90 | 58 | 43 | 39 |

### Største uenigheder mellem kilderne

Ord hvor den højeste og laveste kilde er mere end en faktor 10 fra hinanden:

- **hej** (×443): subs 1362, wordfreq 276, news 4.1, wiki 3.1
- **nej** (×177): subs 4232, wordfreq 551, news 136, wiki 24
- **du** (×166): subs 38406, wordfreq 11763, news 1635, wiki 232
- **tak** (×110): subs 1886, wordfreq 815, news 65, wiki 17
- **ja** (×101): subs 4713, wordfreq 1262, news 163, wiki 47
- **jeg** (×91): subs 39488, wordfreq 14486, news 3548, wiki 435
- **din** (×88): subs 5457, wordfreq 2882, news 297, wiki 62
- **mig** (×86): subs 9501, wordfreq 2824, news 590, wiki 110
- **min** (×43): subs 6565, wordfreq 3362, news 663, wiki 154
- **gud** (×39): subs 597, wordfreq 129, news 15, wiki 111
- **os** (×31): subs 3101, wordfreq 1177, news 634, wiki 101
- **vi** (×28): subs 12641, wordfreq 7095, news 4602, wiki 445
- **hvad** (×20): subs 9991, wordfreq 2517, news 1120, wiki 496
- **bare** (×20): subs 3536, wordfreq 1910, news 712, wiki 180
- **baby** (×18): subs 119, wordfreq 96, news 6.5, wiki 23

Estimeret ud fra de andre sprog (*): i dag, i morgen, i går

## Engelsk

| Kilde | Vægt | Type | Enighed med samlet bud (Spearman) |
|---|---|---|---|
| OpenSubtitles 2018 | 2 | ordformer | 0.95 (385 ord) |
| wordfreq (blandede kilder) | 2 | ordformer | 1.00 (385 ord) |
| Google web (Norvig) | 1 | ordformer | 0.94 (385 ord) |
| Leipzig nyheder 2023 | 1 | ordformer | 0.97 (383 ord) |
| Leipzig Wikipedia 2016 | 0.5 | ordformer | 0.88 (385 ord) |

### Top 60

| # | Ord | Pr. mio. | subs | wordfreq | web | news | wiki |
|---|---|---|---|---|---|---|---|
| 1 | the | 45912 | 4 | 1 | 1 | 1 | 1 |
| 2 | be | 32460 | 3 | 2 | 4 | 2 | 2 |
| 3 | to | 25328 | 5 | 3 | 5 | 3 | 6 |
| 4 | a | 24127 | 6 | 4 | 6 | 4 | 5 |
| 5 | and | 21718 | 8 | 5 | 3 | 5 | 4 |
| 6 | of | 20687 | 10 | 6 | 2 | 6 | 3 |
| 7 | in | 15729 | 12 | 7 | 7 | 7 | 7 |
| 8 | I | 10765 | 2 | 8 | 14 | 19 | 73 |
| 9 | that | 10329 | 9 | 9 | 11 | 10 | 11 |
| 10 | it | 9489 | 7 | 13 | 16 | 13 | 15 |
| 11 | have | 9366 | 13 | 11 | 12 | 8 | 9 |
| 12 | for | 9202 | 20 | 10 | 8 | 9 | 8 |
| 13 | you | 8979 | 1 | 12 | 15 | 25 | 138 |
| 14 | on | 7561 | 24 | 14 | 10 | 11 | 13 |
| 15 | this | 7486 | 17 | 15 | 9 | 15 | 14 |
| 16 | with | 6416 | 29 | 16 | 13 | 12 | 12 |
| 17 | do | 4791 | 11 | 20 | 23 | 28 | 34 |
| 18 | not | 4721 | 28 | 18 | 17 | 27 | 21 |
| 19 | he | 4650 | 18 | 19 | 45 | 17 | 19 |
| 20 | as | 4443 | 58 | 17 | 20 | 14 | 10 |
| 21 | can | 4252 | 23 | 23 | 26 | 23 | 24 |
| 22 | we | 3887 | 15 | 25 | 28 | 20 | 126 |
| 23 | but | 3724 | 31 | 21 | 37 | 21 | 27 |
| 24 | from | 3672 | 62 | 22 | 19 | 18 | 16 |
| 25 | all | 3408 | 32 | 28 | 22 | 40 | 31 |
| 26 | they | 3076 | 38 | 32 | 43 | 26 | 28 |
| 27 | get | 2984 | 19 | 30 | 41 | 41 | 144 |
| 28 | my | 2897 | 21 | 24 | 34 | 67 | 170 |
| 29 | your | 2859 | 25 | 27 | 21 | 66 | 238 |
| 30 | or | 2852 | 71 | 26 | 18 | 31 | 18 |
| 31 | what | 2851 | 14 | 42 | 47 | 58 | 112 |
| 32 | go | 2718 | 22 | 39 | 54 | 43 | 104 |
| 33 | one | 2652 | 52 | 34 | 38 | 36 | 29 |
| 34 | so | 2646 | 33 | 29 | 60 | 48 | 70 |
| 35 | his | 2633 | 63 | 31 | 61 | 22 | 17 |
| 36 | if | 2555 | 40 | 35 | 33 | 54 | 58 |
| 37 | no | 2503 | 27 | 48 | 39 | 76 | 55 |
| 38 | about | 2490 | 46 | 40 | 32 | 42 | 57 |
| 39 | say | 2461 | 50 | 45 | 66 | 16 | 89 |
| 40 | me | 2361 | 16 | 33 | 70 | 102 | 204 |
| 41 | there | 2323 | 35 | 52 | 56 | 52 | 39 |
| 42 | make | 2279 | 59 | 37 | 40 | 38 | 33 |
| 43 | up | 2269 | 48 | 41 | 46 | 46 | 74 |
| 44 | good | 2233 | 43 | 38 | 42 | 56 | 94 |
| 45 | out | 2212 | 44 | 43 | 53 | 49 | 69 |
| 46 | just | 2082 | 34 | 36 | 81 | 59 | 143 |
| 47 | know | 2053 | 26 | 59 | 85 | 78 | 65 |
| 48 | see | 2036 | 47 | 55 | 44 | 60 | 71 |
| 49 | other | 2022 | 80 | 47 | 29 | 39 | 23 |
| 50 | more | 2021 | 83 | 46 | 25 | 34 | 30 |
| 51 | who | 2018 | 60 | 49 | 64 | 30 | 47 |
| 52 | time | 1999 | 64 | 51 | 35 | 53 | 38 |
| 53 | when | 1963 | 65 | 44 | 62 | 44 | 36 |
| 54 | her | 1921 | 53 | 53 | 98 | 32 | 53 |
| 55 | she | 1899 | 39 | 57 | 114 | 33 | 83 |
| 56 | take | 1807 | 56 | 61 | 72 | 50 | 54 |
| 57 | come | 1678 | 37 | 71 | 108 | 62 | 99 |
| 58 | now | 1669 | 51 | 70 | 67 | 63 | 113 |
| 59 | their | 1651 | 113 | 50 | 51 | 24 | 26 |
| 60 | how | 1558 | 54 | 62 | 69 | 80 | 141 |

### Største uenigheder mellem kilderne

Ord hvor den højeste og laveste kilde er mere end en faktor 10 fra hinanden:

- **yes** (×259): subs 5023, wordfreq 572, web 315, news 129, wiki 19
- **you** (×106): subs 39784, wordfreq 9913, web 5094, news 3239, wiki 374
- **hello** (×106): subs 1003, wordfreq 158, web 171, news 11, wiki 9.4
- **your** (×58): subs 6566, wordfreq 3576, web 3541, news 1408, wiki 113
- **thanks** (×56): subs 1616, wordfreq 593, web 263, news 183, wiki 29
- **tomorrow** (×53): subs 344, wordfreq 109, web 36, news 41, wiki 6.5
- **me** (×49): subs 8907, wordfreq 3135, web 963, news 832, wiki 181
- **I** (×41): subs 37432, wordfreq 12770, web 5248, news 4479, wiki 904
- **sure** (×34): subs 980, wordfreq 486, web 188, news 240, wiki 29
- **yesterday** (×29): subs 116, wordfreq 84, web 59, news 63, wiki 4.0
- **my** (×29): subs 7061, wordfreq 3970, web 1851, news 1392, wiki 247
- **here** (×27): subs 4337, wordfreq 969, web 1088, news 483, wiki 158
- **really** (×25): subs 1623, wordfreq 969, web 276, news 608, wiki 66
- **why** (×24): subs 2381, wordfreq 883, web 326, news 394, wiki 99
- **however** (×23): subs 55, wordfreq 395, web 279, news 584, wiki 1255

Estimeret ud fra de andre sprog (*): ice cream

## Russisk

| Kilde | Vægt | Type | Enighed med samlet bud (Spearman) |
|---|---|---|---|
| OpenSubtitles 2018 | 2 | ordformer | 0.96 (377 ord) |
| wordfreq (blandede kilder) | 2 | ordformer | 0.99 (375 ord) |
| Russisk Nationalkorpus (lemmaer) | 2 | lemmaer | 0.96 (370 ord) |
| Leipzig nyheder 2023 | 1 | ordformer | 0.95 (367 ord) |
| Leipzig Wikipedia 2021 | 0.5 | ordformer | 0.88 (362 ord) |

### Top 60

| # | Ord | Pr. mio. | subs | wordfreq | rnc | news | wiki |
|---|---|---|---|---|---|---|---|
| 1 | в | 34111 | 5 | 1 | 2 | 1 | 1 |
| 2 | и | 28374 | 6 | 2 | 1 | 2 | 2 |
| 3 | не | 17634 | 2 | 4 | 3 | 6 | 7 |
| 4 | на | 15750 | 11 | 3 | 4 | 3 | 3 |
| 5 | что | 15133 | 4 | 6 | 6 | 4 | 9 |
| 6 | быть | 12983 | 8 | 7 | 7 | 7 | 5 |
| 7 | с | 12876 | 10 | 5 | 9 | 5 | 6 |
| 8 | этот | 9281 | 7 | 8 | 12 | 8 | 8 |
| 9 | я | 9207 | 1 | 9 | 5 | 36 | 86 |
| 10 | он | 6624 | 12 | 19 | 8 | 15 | 12 |
| 11 | но | 4906 | 18 | 16 | 14 | 16 | 19 |
| 12 | о | 4864 | 21 | 11 | 22 | 10 | 20 |
| 13 | весь | 4786 | 19 | 12 | 19 | 14 | 18 |
| 14 | из | 4490 | 37 | 10 | 17 | 12 | 10 |
| 15 | к | 4466 | 34 | 14 | 13 | 13 | 11 |
| 16 | меня | 4002 | 9 | 15 | – | 70 | 129 |
| 17 | как | 3967 | 29 | 20 | 10 | 22 | 25 |
| 18 | для | 3868 | 40 | 13 | 24 | 11 | 13 |
| 19 | ты | 3749 | 3 | 18 | 25 | 123 | 179 |
| 20 | ему | 3647 | 26 | 22 | – | 20 | 15 |
| 21 | мы | 3577 | 13 | 25 | 16 | 21 | 108 |
| 22 | год | 3555 | 73 | 17 | 20 | 9 | 4 |
| 23 | так | 3550 | 17 | 23 | 23 | 30 | 32 |
| 24 | мочь | 3345 | 16 | 27 | 26 | 18 | 31 |
| 25 | свой | 3324 | 43 | 21 | 18 | 17 | 14 |
| 26 | она | 3001 | 25 | 43 | 11 | 40 | 29 |
| 27 | они | 2863 | 32 | 41 | 15 | 26 | 33 |
| 28 | её | 2560 | 24 | 24 | 53 | 24 | 21 |
| 29 | всё | 2543 | 30 | 33 | 21 | 48 | 59 |
| 30 | ещё | 2372 | 38 | 26 | 32 | 34 | 49 |
| 31 | если | 2339 | 28 | 29 | 38 | 33 | 71 |
| 32 | один | 2321 | 52 | 32 | 27 | 28 | 24 |
| 33 | только | 2241 | 48 | 28 | 31 | 39 | 41 |
| 34 | его | 2241 | 49 | 37 | 30 | 42 | 23 |
| 35 | время | 2143 | 61 | 34 | 37 | 19 | 16 |
| 36 | когда | 2080 | 42 | 30 | 36 | 52 | 46 |
| 37 | или | 2031 | 59 | 38 | 34 | 25 | 28 |
| 38 | такой | 1945 | 53 | 39 | 29 | 41 | 67 |
| 39 | уже | 1924 | 56 | 36 | 35 | 32 | 57 |
| 40 | нет | 1868 | 15 | 50 | 46 | 73 | 119 |
| 41 | их | 1808 | 51 | 35 | 61 | 23 | 26 |
| 42 | нас | 1784 | 27 | 42 | – | 60 | 163 |
| 43 | сказать | 1751 | 31 | 61 | 33 | 47 | 164 |
| 44 | мой | 1686 | 22 | 40 | 42 | 124 | 167 |
| 45 | человек | 1597 | 86 | 44 | 28 | 46 | 35 |
| 46 | кто | 1571 | 44 | 31 | 48 | 84 | 127 |
| 47 | знать | 1565 | 20 | 68 | 43 | 114 | 155 |
| 48 | хотеть | 1541 | 23 | 52 | 64 | 78 | 122 |
| 49 | стать | 1471 | 93 | 46 | 44 | 29 | 22 |
| 50 | день | 1431 | 71 | 48 | 52 | 27 | 50 |
| 51 | наш | 1407 | 62 | 55 | 41 | 43 | 130 |
| 52 | да | 1407 | 14 | 67 | 45 | 152 | 235 |
| 53 | должен | 1401 | 39 | 62 | 68 | 53 | 65 |
| 54 | говорить | 1398 | 50 | 66 | 40 | 75 | 109 |
| 55 | делать | 1390 | 33 | 51 | 90 | 55 | 77 |
| 56 | очень | 1385 | 55 | 53 | 50 | 56 | 72 |
| 57 | другой | 1294 | 95 | 56 | 39 | 49 | 40 |
| 58 | люди | 1270 | 74 | 54 | – | 51 | 63 |
| 59 | где | 1268 | 65 | 58 | 57 | 66 | 47 |
| 60 | после | 1249 | 106 | 47 | 59 | 31 | 17 |

### Største uenigheder mellem kilderne

Ord hvor den højeste og laveste kilde er mere end en faktor 10 fra hinanden:

- **спасибо** (×359): subs 1891, wordfreq 418, rnc 121, news 73, wiki 5.3
- **привет** (×317): subs 1429, wordfreq 167, rnc 46, news 7.9, wiki 4.5
- **ты** (×210): subs 28716, wordfreq 4098, rnc 3171, news 391, wiki 137
- **твой** (×205): subs 2935, wordfreq 479, rnc 367, news 35, wiki 14
- **да** (×135): subs 7898, wordfreq 1151, rnc 1589, news 256, wiki 59
- **ничего** (×103): subs 1777, wordfreq 631, rnc 17, news 246, wiki 156
- **я** (×69): subs 35122, wordfreq 8535, rnc 12684, news 1651, wiki 508
- **завтра** (×64): subs 387, wordfreq 214, rnc 139, news 68, wiki 6.0
- **меня** (×60): subs 15327, wordfreq 4648, news 798, wiki 257
- **усталый** (×50): subs 112, wordfreq 55, rnc 23, news 13, wiki 2.3
- **думать** (×45): subs 3207, wordfreq 655, rnc 756, news 298, wiki 71
- **почему** (×39): subs 2043, wordfreq 743, rnc 507, news 260, wiki 53
- **испуганный** (×38): subs 189, wordfreq 71, rnc 11, news 5.0
- **мой** (×35): subs 5548, wordfreq 1903, rnc 1720, news 384, wiki 158
- **знать** (×34): subs 6370, wordfreq 1148, rnc 1718, news 421, wiki 186

