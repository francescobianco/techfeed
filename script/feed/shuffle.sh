#!/usr/bin/env bash

feed=feed/shuffle.xml
source script/feed.sh

IFS=$'\n'
for line in $(cat feed.tsv | sort -R | head -20); do
  author=$(echo "${line}" | cut -d$'\t' -f1)
  date=$(echo "${line}" | cut -d$'\t' -f2 | tr '[:lower:]' '[:upper:]')
  title=$(echo "${line}" | cut -d$'\t' -f3)
  link=$(echo "${line}" | cut -d$'\t' -f4 | tr -d '\r\n')
  echo "Video: ${title}"
  (
    echo "        <item>"
    echo "            <title>${author} - ${title}</title>"
    echo "            <link>${link}</link>"
    echo "            <guid>${link}</guid>"
    echo "            <pubDate>${date}</pubDate>"
    echo "            <description>${title}</description>"
    echo "        </item>"
  ) >> ${feed}
done

echo -e "    </channel>\n</rss>\n" >> ${feed}
