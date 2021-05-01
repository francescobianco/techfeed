#!/usr/bin/env bash

export LC_ALL=C
today=$(date "+%B %d, %Y" | tr '[:upper:]' '[:lower:]')
today="june 23, 2020"
tsv="https://docs.google.com/spreadsheets/d/e/2PACX-1vTSnaAijtcX_o3LEEzjOLj6HtmScys344sF2_BaSZM780CPuC6nPFJVOgnwfz5bJ8BDvqKyajscvGbI/pub?gid=0&single=true&output=tsv"
sed -i '9,$d' feed/inbox.xml
IFS=$'\n'
for line in $(curl -sL "${tsv}"); do
  author=$(echo "${line}" | cut -d$'\t' -f1)
  date=$(echo "${line}" | cut -d$'\t' -f2 | tr '[:upper:]' '[:lower:]')
  title=$(echo "${line}" | cut -d$'\t' -f3)
  link=$(echo "${line}" | cut -d$'\t' -f4 | tr -d '\r\n')
  if [[ "${date}" == "${today}"* ]];then
    (
      echo "        <item>"
      echo "            <title>${author} - ${title}</title>"
      echo "            <link>${link}</link>"
      echo "            <guid>${link}</guid>"
      echo "            <pubDate>${date}</pubDate>"
      echo "            <description>${title}</description>"
      echo "        </item>"
    ) >> feed/inbox.xml
  fi
done
echo -e "    </channel>\n</rss>\n" >> feed/inbox.xml
