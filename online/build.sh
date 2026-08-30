#!/bin/sh
# =========================================================
# BRAIN TIME — costruzione della versione online
# Unisce markup, CSS e JavaScript in un unico file
# (brain-time-online.html) pronto per essere pubblicato.
# Da lanciare dalla cartella brain-time/:  sh online/build.sh
# =========================================================
set -e
cd "$(dirname "$0")/.."

OUT="online/brain-time-online.html"

JS="js/util.js js/sfx.js js/foto.js online/sync.js js/storage.js online/storage-online.js \
js/data-math.js js/data-logic.js js/data-lang.js js/data-history.js js/data-culture.js \
js/data-chess.js js/data-curiosita.js js/bank.js js/game.js js/musica.js js/casse.js js/laby.js js/data-lingue.js js/lingue.js js/fusione.js js/limite.js \
online/app-online.js"

# 1) markup con il CSS al posto del segnaposto
awk '
  /<style>\/\*CSS\*\// {
    print "<style>";
    while ((getline l < "css/style.css") > 0) print l;
    close("css/style.css");
    while ((getline l < "online/style-online.css") > 0) print l;
    close("online/style-online.css");
    print "</style>";
    next
  }
  { print }
' online/index-online.html > "$OUT"

# 2) tutti gli script in linea, nell ordine giusto
for f in $JS; do
  echo "<script>" >> "$OUT"
  cat "$f" >> "$OUT"
  echo "</""script>" >> "$OUT"
done

echo "Creato $OUT ($(wc -c < "$OUT") byte, $(grep -c '^<script>' "$OUT") blocchi di script)"
