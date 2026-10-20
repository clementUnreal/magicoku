#!/bin/sh
# Rebuild repo/public/index.html from sources. Usage: sh src/build.sh  (run from repo root)
set -e
cd "$(dirname "$0")/ld"
python3 build_ld.py
cd ..
cat pwa/hd.txt crimes-mignons.html pwa/tl.txt > ../repo/public/index.html
node -e "const s=require('fs').readFileSync('../repo/public/index.html','utf8');for(const m of s.matchAll(/<script>([\\s\\S]*?)<\\/script>/g))new Function(m[1])" || { echo "JS syntax error: NOT safe to deploy"; exit 1; }
echo "OK -> repo/public/index.html (remember to bump the cache name in repo/public/sw.js)"
