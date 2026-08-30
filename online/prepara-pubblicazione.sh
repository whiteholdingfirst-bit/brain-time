#!/bin/sh
# =========================================================
# BRAIN TIME — preparazione di un aggiornamento online
#
# ATTENZIONE: la pagina pubblicata contiene i dati veri
# (giocatori, punteggi, sfide). Ripubblicare il file appena
# costruito li CANCELLEREBBE, perche' nasce con lo stato vuoto.
#
# Questo script ricostruisce il gioco dai sorgenti e ci
# trapianta dentro lo stato della versione online in corso.
#
# Uso:
#   1. leggere l'artifact con lo strumento Artifact (action: "read"):
#      salva una copia completa in un file locale
#   2. sh online/prepara-pubblicazione.sh <copia-scaricata.html>
#   3. pubblicare online/brain-time-online.html sullo STESSO url
# =========================================================
set -e
cd "$(dirname "$0")/.."

VIVO="$1"
if [ -z "$VIVO" ] || [ ! -f "$VIVO" ]; then
  echo "Serve il percorso della copia scaricata della pagina online."
  echo "Uso: sh online/prepara-pubblicazione.sh <copia-scaricata.html>"
  exit 1
fi

MARCA='<script id="bt-state" type="application/json">'

# lo stato vero: prima occorrenza del blocco nella pagina scaricata
STATO=$(grep -o "$MARCA[^<]*" "$VIVO" | head -1 | sed "s|$MARCA||")

if [ -z "$STATO" ]; then
  echo "Non ho trovato il blocco di stato nella copia scaricata: mi fermo."
  exit 1
fi

echo "$STATO" > online/.stato-vivo.json
GIOCATORI=$(echo "$STATO" | grep -o '"name":' | wc -l)
SFIDE=$(echo "$STATO" | grep -o '"stato":"aperta"' | wc -l)
echo "Stato recuperato: $GIOCATORI giocatori, $SFIDE sfide aperte."

# ricostruisce il gioco dai sorgenti
sh online/build.sh > /dev/null

# trapianta lo stato al posto di quello vuoto
awk -v marca="$MARCA" '
  index($0, marca) && !fatto {
    getline stato < "online/.stato-vivo.json";
    print marca stato "</" "script>";
    fatto = 1;
    next
  }
  { print }
' online/brain-time-online.html > online/.tmp.html

mv online/.tmp.html online/brain-time-online.html
rm -f online/.stato-vivo.json

echo "Pronto: online/brain-time-online.html contiene il codice nuovo e i dati veri."
echo "Pubblicalo sullo STESSO url, altrimenti nasce un secondo gioco."
