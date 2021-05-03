#!/usr/bin/env bash

export LC_ALL=C
export today=$(date "+%B %-d, %Y" | tr '[:lower:]' '[:upper:]')
feed_url="https://docs.google.com/spreadsheets/d/e/2PACX-1vTSnaAijtcX_o3LEEzjOLj6HtmScys344sF2_BaSZM780CPuC6nPFJVOgnwfz5bJ8BDvqKyajscvGbI/pub?gid=0&single=true&output=tsv&ts=$(date +%s)"
curl -sLo feed.tsv "${feed_url}"
sed -i '8,$d' ${feed}
echo "        <lastBuildDate>$(date)</lastBuildDate>" >> ${feed}
