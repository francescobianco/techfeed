#!/usr/bin/env bash

curl -sLX PUT https://api.github.com/repos/francescobianco/techfeed/contents/$1 \
  -H "Accept: application/vnd.github.v3+json" \
  -H "Authorization: token ${{ secrets.GITHUB_TOKEN }}" \
  -d "{\"message\":\"Update $1\",\"content\":\"$(base64 -w0 $1)\",\"sha\":\"$(git ls-files -s $1 | cut -c8-47)\"}"
