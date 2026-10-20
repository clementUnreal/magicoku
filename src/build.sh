#!/bin/sh
# Rebuild repo/public/index.html from sources. Usage: sh src/build.sh  (run from repo root)
set -e
cd "$(dirname "$0")/ld"
python3 build_ld.py
cd ..
cat pwa/hd.txt crimes-mignons.html pwa/tl.txt > ../repo/public/index.html
echo "OK -> repo/public/index.html (remember to bump the cache name in repo/public/sw.js)"
