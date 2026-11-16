#!/usr/bin/env sh
# Henter frekvenskilderne til data/.cache/ (ca. 40 MB, ikke i git).
set -e
cd "$(dirname "$0")"
mkdir -p .cache/rnc
cd .cache

for l in da en ru; do
  # OpenSubtitles 2018 (undertekster) – Hermit Dave, CC BY-SA 4.0
  curl -sfL -o "os_$l.txt" "https://raw.githubusercontent.com/hermitdave/FrequencyWords/master/content/2018/$l/${l}_50k.txt"
done
# wordfreq – Robyn Speer, blanding af Wikipedia, undertekster, nyheder, bøger, web, Twitter, Reddit (CC BY-SA 4.0)
curl -sfL -o wf_da.msgpack.gz https://raw.githubusercontent.com/rspeer/wordfreq/master/wordfreq/data/small_da.msgpack.gz
curl -sfL -o wf_en.msgpack.gz https://raw.githubusercontent.com/rspeer/wordfreq/master/wordfreq/data/large_en.msgpack.gz
curl -sfL -o wf_ru.msgpack.gz https://raw.githubusercontent.com/rspeer/wordfreq/master/wordfreq/data/large_ru.msgpack.gz
# Google Web Trillion Word Corpus – Peter Norvig
curl -sfL -o norvig_en.txt https://norvig.com/ngrams/count_1w.txt
# Russisk Nationalkorpus, lemma-frekvensordbog (Ljasjevskaja & Sharoff 2009)
curl -sfL -o rnc/Freq2011.zip http://dict.ruslang.ru/Freq2011.zip && (cd rnc && unzip -oq Freq2011.zip && rm Freq2011.zip)
# Leipzig Corpora Collection (CC BY 4.0) – kun ordlisterne
for f in dan_news_2022_100K dan_wikipedia_2021_100K eng_news_2023_100K eng_wikipedia_2016_100K rus_news_2023_100K rus_wikipedia_2021_100K; do
  curl -sfL -o lz.tgz "https://downloads.wortschatz-leipzig.de/corpora/$f.tar.gz"
  tar -xzf lz.tgz --wildcards "*-words.txt"
  rm lz.tgz
done
echo "OK"
