# Brain Time — note tecniche

> Se stai riprendendo il lavoro da un'altra sessione, leggi prima **`LAVORI-IN-CORSO.md`**:
> dice a che punto siamo, cosa e' stato deciso e cosa manca. Qui sotto c'e' il come, non il dove.

App di quiz educativo per due fratelli + modalità genitori.
Specifica originale in `brain-time-spec.md`, istruzioni per i giocatori in `README.md`.

**Dove sta il progetto:** `C:\Users\Utente\Documents\GitHub\brain-time`, ed e' un repository git
collegato a **https://github.com/whiteholdingfirst-bit/brain-time** (privato), come White-Brain.

> Prima stava in Google Drive (`G:\Il mio Drive\09 PROGETTI\CLAUDE CODE\brain-time`) e li' non puo'
> tornare: **su Drive git non funziona**. Il disco virtuale rifiuta i file di lock dei ref e ogni
> commit muore con `cannot lock ref 'HEAD': Invalid argument`. Il backup adesso e' GitHub.

Nessun percorso assoluto è scritto nel codice o negli script, quindi la cartella si può spostare:
`build.sh` e `prepara-pubblicazione.sh` si posizionano da soli. L'unico percorso assoluto è dentro
il collegamento sul desktop (`%USERPROFILE%\Desktop\Brain Time.lnk`), che punta alla cartella nuova.

**Fuori dal repository** (`.gitignore`): i file di prova `_test-*.html` e `_prova.html`, la cartella
`musica/` con i brani di famiglia, e soprattutto **`online/brain-time-online.html`** — è generato, e
dopo `prepara-pubblicazione.sh` contiene nomi, punteggi e le foto degli avatar dei ragazzi. Quei dati
non vanno su GitHub nemmeno in un repository privato. Si rigenera con `sh online/build.sh`.

**L'indirizzo della pagina online non sta MAI nel codice.** Il gioco locale lo legge da
`js/config-locale.js` (fuori dal repository) e, se manca, lo chiede una volta al giocatore e lo
tiene in `localStorage`. Prima era scritto dentro `js/app.js`: e' stato tolto il 30/08/2026,
prima di rendere pubblico il repository.

**La pagina online di famiglia** è sempre lo stesso artifact. L'indirizzo sta in
`pagina-online.txt`, **fuori dal repository** (`.gitignore`): questo repo è pubblico, e un
indirizzo resta un indirizzo anche quando la pagina dietro chiede di autenticarsi.
Va aggiornata sempre lì sopra, mai creata di nuovo, altrimenti nasce un secondo gioco con
un'altra classifica.

## Vincoli di progetto

- **Nessun build, nessuna dipendenza.** Si apre con doppio click su `index.html` (protocollo `file://`).
- Per questo motivo **niente ES modules** (`type="module"` è bloccato dalla CORS su `file://`):
  gli script sono classici e comunicano tramite l'oggetto globale `window.BT`.
- **Niente rete.** Unica risorsa esterna: il font Fredoka da Google Fonts, con fallback di sistema.
- Persistenza in `localStorage`, chiave `brain-time-v1`. Se il browser la blocca, il gioco funziona
  comunque in memoria e mostra un avviso (`BT.store.canSave()`).

## Ordine di caricamento

`util → sfx → foto → storage → data-* (math, logic, lang, history, culture, chess) → bank → game → app`
(definito in `index.html`, non cambiarlo).

## Modello dati

Un profilo giocatore:

```js
{ id, name, avatar, level,        // level: 'elem5' | 'media2' | 'adulti'
  xp, coins, answered, correct,
  bestRun, bestStreak, duelsWon, duelsPlayed,
  inventory: { fifty: 2, ... },   // aiuti acquistati
  byCat: { math: {a, c}, ... } }  // risposte/corrette per materia
```

## Come si aggiungono domande

Ogni categoria espone `BT.<NOME>[livello]` = **array di funzioni** che restituiscono un oggetto domanda.
Il livello è sempre uno fra `elem5`, `media2`, `adulti`.

**Domanda scritta** (logica, lingue, storia, regole di scacchi) — riga compatta:

```js
['Testo della domanda', 'risposta giusta', 'sbagliata', 'sbagliata', 'sbagliata', 'spiegazione']
```

passata a `BT.fromRow(riga, 'categoria')`. L'ordine delle opzioni viene mescolato a runtime.

**Domanda generata** (matematica, sequenze) — funzione che costruisce testo e distrattori e chiama
`BT.mc(testo, giusta, [sbagliate], { explain, cat })`. `BT.mc` ripulisce i duplicati e, se i distrattori
non bastano, ne genera di plausibili attorno al valore numerico corretto.

**Puzzle di scacchi** — `puzzle(fen, testo, giusta, [sbagliate], spiegazione, etichettaTurno)` in
`data-chess.js`. La scacchiera viene disegnata da `BT.renderBoard(fen)` (solo il campo *placement*
della FEN viene letto). Notazione italiana nelle risposte: R, D, T, A, C.

> ⚠️ Ogni puzzle nuovo va **verificato a mano**: che la mossa indicata sia davvero matto/vincente e —
> altrettanto importante — che **nessuna delle tre risposte sbagliate lo sia**. È l'errore più facile da fare.

Il testo delle domande è HTML: usare entità (`&egrave;`, `&times;`, `&sup2;`) e non caratteri accentati
diretti nelle stringhe JS, per coerenza con il resto del file.

## Punteggio

`punti = round((100 + bonusVelocità) × moltiplicatoreSerie) × (puntiDoppi ? 2 : 1)`
con `bonusVelocità = round(50 × tempoRimasto / tempoTotale)` e serie ×1,2 / ×1,5 / ×2 a 3 / 5 / 8 risposte.

Soglie di livello: `BT.xpForLevel(l) = 300 × (l-1) × l` → 600, 1800, 3600, 6000…

**Equità fra livelli:** ogni giocatore riceve domande del proprio livello e i punti valgono uguale.
La classifica offre anche l'*Indice Bravura* (`BT.store.skillIndex`), basato su precisione pesata per
volume di risposte, per confrontare giocatori di età diverse.

## Regola di prodotto da non violare

Non deve esistere nessun modo di ottenere la risposta senza rispondere: niente pulsante "rivela",
niente aiuto che risponde al posto del giocatore. Gli aiuti riducono la difficoltà, non la sostituiscono.

## Come si prova

Nell'ambiente non ci sono Node né Python, quindi niente server locale né `node --check`.
Per collaudare in un browser headless conviene generare un file unico con tutto inline:

```bash
awk '/style\.css/ { print "<style>"; while ((getline l < "css/style.css") > 0) print l; print "</style>"; next }
     /script src=/ { match($0, /js\/[a-z-]+\.js/); f=substr($0, RSTART, RLENGTH);
       print "<script>"; while ((getline l < f) > 0) print l; close(f); print "</" "script>"; next }
     { print }' index.html > _test-bundle.html
```

e poi pilotarlo via JavaScript (`BT.game.start(...)`, click sulle opzioni, `#fb-next`).
Ricordarsi di **cancellare `_test-bundle.html`** a fine sessione: è un artefatto, non parte del gioco.
Attenzione: in quel contesto `localStorage` è disabilitato, quindi `canSave()` risulta `false` — è normale.

## Idee non ancora implementate

- Modalità a tempo o "sopravvivenza" (serie infinita finché non sbagli).
- Traguardi/medaglie da sbloccare.
- Ripasso mirato: ripescare le domande sbagliate in passato.
- Editor di domande per aggiungerne senza toccare il codice.

---

# Versione online (cartella `online/`)

Stessa base di codice: `online/` aggiunge solo il livello di sincronizzazione e la sua interfaccia.
Le domande, il motore di gioco, i suoni e il CSS sono condivisi con la versione locale.

| File | Ruolo |
|---|---|
| `index-online.html` | markup, con `<style>/*CSS*/</style>` come segnaposto e il blocco di stato |
| `style-online.css` | stili aggiuntivi (chip di stato, righe delle sfide, badge) |
| `sync.js` | cattura del documento e ripubblicazione via capability `artifact` |
| `storage-online.js` | sostituisce `BT.store`: lo stato vive nella pagina, non in localStorage |
| `app-online.js` | interfaccia, incluse le sfide a distanza |
| `build.sh` | unisce tutto in `brain-time-online.html` |
| `brain-time-online.html` | **generato** — è il file che si pubblica |

Build: `sh online/build.sh` dalla cartella `brain-time/`. Non modificare mai a mano
`brain-time-online.html`: viene rigenerato.

> ⛔ **Non ripubblicare mai il risultato nudo di `build.sh`.** Nasce con lo stato vuoto: sovrascriverebbe
> giocatori, punteggi e sfide accumulati dalle persone che stanno usando la pagina. Per aggiornare il
> codice online la procedura è sempre:
>
> 1. leggere l'artifact (strumento Artifact, `action: "read"`) — salva una copia completa su file;
> 2. `sh online/prepara-pubblicazione.sh <copia-scaricata.html>` — ricostruisce dai sorgenti e
>    ci trapianta dentro lo stato vero;
> 3. pubblicare sullo **stesso** url.
>
> Fra il passo 1 e il passo 3 chi gioca può salvare: quelle partite si perdono. È una finestra di pochi
> minuti, ma va scelto un momento in cui non stanno giocando.

Pubblicazione: strumento Artifact su `online/brain-time-online.html`, con
`capabilities: {artifact: {}, downloads: true}`. Ripubblicare **sempre sullo stesso URL**
(stesso `file_path` nella stessa conversazione, oppure passando `url`), altrimenti si crea
un secondo gioco con un'altra classifica.

## Come funziona lo stato condiviso

Non esiste un database: la capability `artifact` permette alla pagina di **ripubblicare sé stessa**.
Lo stato (giocatori, punteggi, sfide) sta in `<script id="bt-state" type="application/json">`.
Quando qualcuno gioca, `sync.js` ricostruisce il documento sostituendo solo quel blocco e chiama
`artifact.publish(html)`; gli altri dispositivi aperti si ricaricano sulla nuova versione.

Restano locali al dispositivo (localStorage) solo le preferenze e "chi sono io".

### Tre trappole, già risolte — non reintrodurle

1. **Il runtime del visualizzatore va tolto prima di ripubblicare.** La pagina servita contiene un
   blocco `<!-- frame-runtime -->…<!-- /frame-runtime -->` iniettato da claude.ai (con `<base href>`
   e script *inline*, non esterni). Se lo si ripubblica, se ne accumula una copia a ogni salvataggio.
   `documentoAggiornato()` lo rimuove, insieme agli script esterni, e normalizza `<html>` perché
   il tema viene riapplicato a ogni apertura.
2. **La cattura del documento deve avvenire prima di disegnare.** `BT.online.cattura()` è la prima
   riga di `init()`: cattura la pagina non ancora modificata. Spostarla dopo il rendering
   pubblicherebbe il DOM già manipolato.
3. **Mai un carattere U+2028 / U+2029 dentro una regex letterale.** Sono terminatori di riga per
   JavaScript e producono `Invalid regular expression: missing /` — errore silenzioso che uccide
   l'intero file. In `jsonSicuro()` si usa `new RegExp("\u2028", "g")`, con la sequenza di escape.

### Conflitti

Se due dispositivi pubblicano insieme, `publish()` rifiuta con `conflict`: è normale, **non si
riprova**. La vista perdente si ricarica da sola sulla versione vincente e la chip di stato lo dice.

## Il duello a staffetta

Il duello locale alterna i giocatori **a ogni domanda** e mostra l'esito solo quando hanno risposto
entrambi (`showRegistrata()` → `showReveal()`). Regola di prodotto: durante il duello la risposta
scelta riceve la classe neutra `.chosen`, mai `.right` / `.wrong`, altrimenti il secondo giocatore
capirebbe l'esito del primo.

Il ciclo di un round è: `startRound` → `showPass` → `loadQuestion` → `answer` → `showRegistrata`
→ `afterAnswer` → (turno 1) `showPass` … → `showReveal` → `advance`.

`BT.onFinish(modo, out, extra)` è il gancio usato dalla versione online per registrare le sfide:
`cfg.extra` viene passato invariato dal `start()` alla fine partita.

## Collaudo

Restano validi i limiti dell'ambiente (niente Node né Python). Per provare la versione online
serve simulare la capability: si inserisce prima degli script un finto `window.claude`

```js
window.__pubs=[];
window.claude={use:function(n){return Promise.resolve(n==="artifact"
  ? {publish:function(h){window.__pubs.push(h);return Promise.resolve({ok:true});}} : null);}};
```

e si verifica che `window.__pubs` contenga un documento con lo stato aggiornato, senza
`frame-runtime` e senza `<base>`. Per riprodurre l'ambiente servito conviene avvolgere il file
generato in un `<head>` con un finto blocco `frame-runtime`, così si collauda anche la rimozione.
I file di prova (`_test-*.html`) vanno cancellati a fine sessione.

---

# Aggiornamento: caratteri, avatar-foto, cultura generale, classi

## Scala tipografica
Tutti i `font-size` in px di `css/style.css` sono stati moltiplicati per **1,2** e arrotondati
a mezzo pixel; i valori in `min()` della scacchiera sono stati alzati a mano. Per un'altra
scalata usare lo stesso approccio meccanico (awk sul pattern `font-size:<n>px`), non ritoccare
regola per regola.

## Avatar
`BT.AVATARS` ha 46 emoji. L'avatar di un profilo può essere **un'emoji oppure una foto**
(data URI JPEG). Non stampare mai `p.avatar` direttamente: usare sempre **`BT.avatar(p.avatar)`**,
che restituisce l'emoji o un `<img class="av-img">`. `BT.isFoto(a)` distingue i due casi.
La CSS `.av-img` si dimensiona in `em` (segue il contesto); nei contenitori quadrati
(`.pf-avatar`, `.pc-avatar`, `.foto-anteprima`) riempie il box.

## Foto (`js/foto.js`)
Tre strade, in ordine di preferenza:
1. `BT.foto.accendi(contenitore, pronto, errore)` — `getUserMedia` con anteprima video;
2. ripiego `BT.foto.daFotocameraDiSistema()` — `<input type="file" capture="user">`, che su
   telefono e tablet apre l'app fotocamera;
3. `BT.foto.daGalleria()` — `<input type="file">` semplice.

Ogni immagine passa da `riduci()`: ritaglio quadrato centrale + canvas 160×160 + JPEG q0.82
(circa 3 KB). Non alzare quel lato senza motivo: nella versione online ogni foto finisce
**dentro il documento pubblicato**, quindi pesa sulla dimensione della pagina.
`BT.foto.spegni()` va chiamata uscendo dalla schermata, altrimenti la webcam resta accesa.

## Classi scolastiche
`BT.CLASSI` mappa dieci classi (1ª elementare → Adulto) sui **tre** livelli di domande
esistenti. Il profilo salva sia `classe` sia `level` (derivato). I profili creati prima
di questa modifica hanno solo `level`: `BT.nomeClasse()` e `BT.classeBreve()` gestiscono
il ripiego, quindi non serve migrare per forza.

> Limite noto e dichiarato nel README: le banche sono tre. Chi sceglie 1ª–3ª elementare
> riceve le domande di livello elementare, tarate sulla quinta. Per coprirlo davvero
> servirebbe una quarta banca (`elem2`) in tutte e sei le categorie.

## Cultura generale
`js/data-culture.js`, stesso formato a righe delle altre categorie. Registrata in `BT.CATS`
e nella mappa `pool()` di `bank.js`. **Le categorie sono sei**: controllare che i testi non
dicano più "cinque materie" quando se ne aggiunge un'altra.

## Nota sul deploy online
Il controllo anti-sovrascrittura dell'artifact richiede, per ogni tentativo di pubblicazione
su una versione salvata dalla pagina stessa: (1) lettura integrale del file scaricato e
(2) contenuto diverso da quello già rifiutato, **nello stesso turno**. Il permesso di lettura
si consuma a ogni tentativo: se il publish fallisce, va rifatta tutta la lettura prima di
riprovare. Con file da ~4.000 righe è un'operazione costosa: conviene raggruppare più
modifiche in un unico deploy invece di pubblicare spesso.

---

# Negozio a reparti

`BT.POWERUPS` (10 consumabili) e `BT.SBLOCCABILI` (`avatar`, `titolo`, `tema`) in `storage.js`.
I consumabili stanno in `p.inventory`; gli sblocchi permanenti in `p.sbloccati.{avatar,titolo,tema}`,
con `p.titolo` e `p.tema` a indicare quello in uso.

`BT.store.normalizza(p)` aggiunge i campi ai profili creati prima di questa versione: va chiamata
prima di leggerli (lo fa gia' `selectPlayer` e `renderShop`). `sblocca()` scala le coppe e mette
subito in uso l'articolo; `usa()` cambia solo quello in uso (sul titolo fa da interruttore).

## Temi
Un tema **ridefinisce solo variabili CSS** su `body[data-tema="..."]`. Per questo tutti i colori
del foglio di stile sono ora variabili: `--cielo-*`, `--mensola-*`, `--ok-bg`, `--no-bg`, `--info-bg`,
`--oro-bg/bordo/testo`, `--casa-chiara/scura`. **Non reintrodurre colori scritti a mano**: un tema
scuro li lascerebbe illeggibili. Il tema si applica con `applicaTema(player)` (niente attributo
quando è `azzurro`).

Il tema `azzurro` ha `cost: 0` ed è trattato come sempre posseduto (`art.cost === 0`), così si può
sempre tornare indietro dopo averne comprato un altro.

## Nuovi aiuti nel motore
`G.moltiplicatore` (1/2/3) ha sostituito `doubleOn`; `G.scudo` assorbe un errore senza azzerare la
serie; `G.congelato` ferma il timer; `cambiaDomanda()` ripesca una domanda conservando gli aiuti
gia' attivati e ricaricando il tempo pieno.

## Deploy del 28/08/2026 — cosa e' successo davvero

Il controllo anti-sovrascrittura ha rifiutato la pubblicazione **quattro volte** anche dopo la
lettura integrale del file scaricato (3926 righe) fatta subito prima del publish, senza altre
chiamate in mezzo. Sintomi visti, in ordine:

1. "non built on it" — dopo lettura completa a cavallo di piu' turni;
2. "identical content resent unchanged" — il payload rifiutato viene ricordato: per riprovare
   serve un contenuto **diverso** (qui e' stato aggiunto un commento HTML di build subito prima
   di `<div class="bg-books">`, presente sia nel sorgente sia nel file generato);
3. di nuovo "non built on it", con lettura integrale rifatta dopo un nuovo `Artifact read`.

Sbloccato solo con `force: true`, **dopo conferma esplicita dell'utente**. Era accettabile perche'
lo stato live dei giocatori, letto poco prima, era gia' trapiantato nel
file pubblicato: si sarebbero perse solo eventuali partite giocate dopo quell'ora.

> **Aggiornamento 30/08/2026 — autorizzazione permanente.** L'utente ha autorizzato una volta
> per tutte a **forzare** la pubblicazione, purche' si segua sempre questa sequenza:
> 1. `Artifact read` della pagina viva;
> 2. `sh online/prepara-pubblicazione.sh <copia-scaricata.html>`;
> 3. **verifica** che il blocco `bt-state` del file da pubblicare sia identico byte per byte a
>    quello vivo (`grep -o '<script id="bt-state"[^>]*>.*</script>'` sui due file, poi `cmp`);
> 4. `Artifact` con `force: true`.
>
> Il motivo per cui forzare e' accettabile: la rilettura integrale (8000+ righe) dura piu' a
> lungo di quanto ci mettano i ragazzi a giocare un'altra partita, quindi **fa perdere piu'
> punti di quanti ne salvi**. Il passo 3 non si salta mai: e' quello che rende sicura la forzatura.

> Regola pratica: non forzare mai di propria iniziativa. Prima si trapianta lo stato vero con
> `prepara-pubblicazione.sh`, si verifica che il blocco `bt-state` del file da pubblicare
> corrisponda a quello live, e solo allora si chiede all'utente il permesso di forzare.

---

# Modalita' Gioca / Allenamento e livelli di difficolta'

Idea di Diego: allenarsi senza rischio, e una modalita' identica ma "seria" dove i punti si
possono anche perdere.

## Le due modalita'
`BT.game.start({ tipo: 'allena' | 'gioca', ... })` — il duello passa sempre `gioca`.

| | Allenamento | Gioca |
|---|---|---|
| punti | nessuno | +punti se giusto, **−penalita' se sbagliato** |
| coppe | nessuna | come prima |
| profilo | **non tocca nulla**: niente xp, coppe, statistiche, record | `recordRun` normale |
| aiuti | barra nascosta (non servono, e non si consumano coppe) | tutti disponibili |

Due paletti voluti: il punteggio della partita **non scende sotto zero**
(`punti = -Math.min(penalita, run.score)`) e i punti cervello gia' guadagnati non calano mai,
perche' a fine partita si somma solo il risultato (≥ 0). Lo **scudo** ora salva anche dalla
penalita', non solo dalla serie.

L'allenamento non registra le statistiche di proposito: se allenarsi abbassasse la precisione
mostrata in classifica, nessuno si allenerebbe.

## Difficolta' (ha sostituito "domande per partita")
`BT.DIFFICOLTA` in `storage.js`: facile 6 / medio 9 / difficile 15 domande.
La scelta e' una preferenza locale del dispositivo (`settings.diff`), non del profilo.

Il campo **`salto`** sposta la banca di un gradino nella scala `BT.LEVEL_ORDER`
(`BT.livelloDi(level, salto)`, con clamp agli estremi): in Facile si pescano domande della
fascia sotto, in Difficile di quella sopra. `BT.bank.draw(cats, level, used, salto)`.
Gli altri campi: `tempo` (moltiplicatore dei secondi), `bonus` (moltiplicatore dei punti),
`penalita'` (punti persi per errore).

> Il "livello basso/medio/difficile" chiesto da Diego e' reso cosi' perche' le domande **non**
> hanno un grado di difficolta' proprio: sono catalogate solo per fascia scolastica. Per una
> difficolta' vera dentro la stessa fascia servirebbe etichettare a mano tutte le domande.

## Sfide a distanza
La sfida porta con se' `diff`: chi la raccoglie gioca stessa difficolta' e stesso numero di
domande, ma **al proprio livello**. Le sfide create prima di questa versione hanno solo `qLen`:
`accettaSfida` fa il ripiego (`diff: s.diff || 'medio'`).

> Nota sul deploy del 28/08 (secondo giro): se l'ultima versione online e' **quella pubblicata da
> qui** (nessuno ha giocato nel frattempo), la ripubblicazione passa liscia senza il rito della
> rilettura integrale. Il controllo scatta solo quando in mezzo c'e' un salvataggio fatto dalla
> pagina stessa. Conviene quindi pubblicare subito dopo aver letto l'artifact.

---

# Icona e collegamento sul desktop

`brain-time.ico` e `brain-time.png` (256x256) sono **generati**, non disegnati a mano: riprendono
la stessa geometria dell'SVG del logo che sta in `index.html` (le due pagine del libro, il dorso,
il cerchio dorato con il piu'), ridisegnata con GDI+ da PowerShell.

L'`.ico` contiene sei dimensioni: 16, 32, 48, 64 e 128 in formato DIB classico piu' il 256 come
PNG. Serve tutto: `System.Drawing` (e alcune viste vecchie di Explorer) non sanno leggere un ICO
che contenga **solo** il PNG, e l'icona resterebbe vuota. Se un giorno si rigenera, ricordarsi
delle voci DIB.

Il collegamento sul desktop (`%USERPROFILE%\Desktop\Brain Time.lnk`) punta direttamente a
`index.html`: si apre col browser predefinito, quindi continua a funzionare anche se un domani
Chrome o Edge non ci sono piu'. In alternativa si puo' farlo puntare al browser in modalita' app
(`chrome.exe --app="file:///.../index.html"`): finestra pulita senza barra degli indirizzi, ma
legato a quel browser.

> Il collegamento contiene il percorso assoluto: se la cartella si sposta di nuovo, va rifatto.

---

# Labirinti, casse, temi, avatar, musica

## Temi (16)
`BT.SBLOCCABILI.tema`: cinque **base** (`base: true`, costo 0: azzurro, rosso, verde, blu, lilla) e
undici **speciali** a pagamento. Ogni tema e' un blocco `body[data-tema="..."]` che ridefinisce solo
variabili CSS. Per i temi scuri (notte, vulcano, stellato, galassia) vanno ridefinite **anche**
`--carta`, `--carta-2`, `--inchiostro`, `--ok-bg`, `--no-bg`, `--oro-*`: se si dimenticano, il testo
scuro resta su carta scura ed e' illeggibile.

Lo sfondo predefinito e' stato scurito (`--cielo-*`) perche' i tasti bianchi si vedessero meglio.

## Avatar (224 liberi + 10 speciali)
`BT.AVATAR_GRUPPI`: sei famiglie (animali, mostri, personaggi, sport, mondo, oggetti).
Un blocco alla fine di `storage.js` **toglie dalle famiglie** gli avatar che si comprano al Negozio,
cosi' non compaiono in due posti. `BT.AVATARS` resta la lista piatta per compatibilita'.

> Niente personaggi di cartoni animati, film o videogiochi famosi: sono marchi registrati.
> I mostri classici (Dracula, Frankenstein, mummia, lupo mannaro) sono invece di pubblico dominio,
> e comunque qui sono resi con emoji Unicode, non con disegni.

## Aiuti a sblocco progressivo (14)
Ogni voce di `BT.POWERUPS` ha `liv` e `coppe`: si sblocca **al livello richiesto oppure** avendo
accumulato quelle coppe (`BT.aiutoSbloccato`). Il controllo e' anche dentro `store.buy`, non solo
nell'interfaccia. Due aiuti (`bussola`, `mappa`) servono solo nei labirinti.

## Labirinti (`js/laby.js`)
Generazione "recursive backtracker": labirinto perfetto, sempre risolvibile. `BT.laby.config(liv)`
da' misura e tempo; si cresce da 5x5 fino a 18x18. Il percorso piu' breve (BFS) serve alla mappa,
alla bussola e — utile a chi collauda — a `BT.laby.viaLibera()`.
Premi via `store.premiaLabirinto` (punti e coppe **senza** toccare le statistiche delle domande).
Il disegno prende i colori dal tema con `getComputedStyle`, quindi cambia col tema in uso.

## Casse sorpresa (`js/casse.js`)
Arrivano a ogni passaggio di livello cervello (`game.js` e `laby.js` chiamano `store.aggiungiCassa`).
Si **accetta** il premio oppure si **rifiuta**: rifiutando, `rimandaCassa` fa +1 sulla scala delle
rarita' (fino a 7) e le coppe **raddoppiano davvero** a ogni gradino (10-20 → 20-40 → 40-80 →
80-160 → 160-320 → 320-640 → 640-1280). La promessa fatta al giocatore e' "la prossima vale il
doppio", quindi dev'essere vera nei numeri, non solo a parole.

> Conseguenza da tenere d'occhio: la settima cassa da' da sola piu' coppe di quanto costi l'intero
> Negozio. E' voluto (bisogna rifiutare sei volte di fila), ma se un giorno sembrasse troppo, la
> leva e' la riga `coppe` di `BT.RARITA`, non la regola del raddoppio.

### La stella (idea di Diego, sul modello di Brawl Stars)
Il moltiplicatore e' il **numero di tocchi sulla stella**, e ogni tocco alza la rarita' di un
gradino. Sette gradini in `BT.RARITA` (`BT.rarita(n)`, clamp 1..`BT.RARITA_MAX`):

| n | rarita' | premi | garantiti | scoperte |
|---|---|---|---|---|
| 1 | Rara ⭐ | 1 | - | 1 |
| 2 | Superrara 🔷 | 2 | - | 1 |
| 3 | Epica 🌟 | 3 | - | 1 |
| 4 | Mitica 💫 | 4 | 1 | 1 |
| 5 | Leggendaria ✨ | 5 | 1 | 1 |
| 6 | Ultraleggendaria 🌈 | 6 | 2 | 1 |
| 7 | Segreta 🔮 | 7 | 2 | **2** |

Regola facile da ricordare e da spiegare a un bambino: **il numero del gradino e' il numero dei
premi**, piu' la scoperta. "Garantiti" sono i primi premi forzati a essere un avatar o un tema
(`forzaSpeciale` in `premioCasuale`, che trucca il dado solo se ne resta almeno uno da prendere:
quando la collezione e' completa il premio ripiega su coppe e aiuti senza rompersi).

Niente fortuna nella salita: la rarita' si guadagna aspettando, non tirando il dado. Con dei
bambini e' una scelta voluta - un "tocca e vedi se sale" sarebbe una slot machine.

**La settima non si annuncia.** `misteriosa: true` fa mostrare "??? ❔" ovunque si parli della
*prossima* cassa (`etichettaRar(r, svelata)` in `app.js`); il nome vero compare solo quando ci si
arriva davvero. Il tetto di `rimandaCassa` legge `BT.RARITA_MAX`, quindi per aggiungere un gradino
basta allungare la tabella: storage.js carica prima di casse.js, ma la funzione gira a runtime.

I nomi sono al femminile perche' accompagnano sempre la parola "cassa".
Colori in `css/style.css` (`--rar-*`), applicati con `data-rar` sul box e la classe `.rar-<id>`
sul chip. Il suono sale con la rarita': `BT.sfx.stella(n)`.

Dentro: sempre una **scoperta** (se ne restano), poi i premi fra aiuti, coppe, avatar rari e
temi speciali. Gli aiuti che il giocatore non potrebbe ancora comprare hanno una probabilita'
maggiore: e' il premio che fa piu' effetto.

## Scoperte (`js/data-curiosita.js`)
48 schede in sei categorie (studiare, compiti, riparare, orientarsi, come e' nato, sapevi che).
Si collezionano e si rileggono dalla tessera **Scoperte**.

## Musica dei labirinti (`js/musica.js`)
Tre brani **originali** generati con la Web Audio API (basso, melodia, cassa, charleston) con un
sequencer a lookahead di 250 ms. Nessun file, nessuna rete.

> Musica famosa: non si puo' includere (diritti d'autore). La strada prevista e' un'altra: se la
> famiglia mette i propri file in `musica/1.mp3` (o `.m4a`/`.ogg`) accanto al gioco, `cercaFile()`
> li trova e suona quelli. Cosi' ognuno usa la musica che possiede e il gioco non distribuisce nulla.
> Vale solo per la versione locale: nella pagina online quei file non esistono.

Trappola gia' risolta: la ricerca dei file e' asincrona e puo' rispondere **dopo** che il giocatore
e' uscito dal labirinto. Un contatore `sessione` invalida gli avvii in ritardo.

## Correzione: quando arriva la cassa

Prima versione sbagliata: la cassa arrivava solo salendo di **livello cervello**. Con la curva
`300*(l-1)*l` significa una cassa ogni migliaia di punti — Diego ne ha fatti nove di labirinti
senza vederne una. "Fine di un livello", nella richiesta, voleva dire **fine di un labirinto**.

Adesso in `laby.js`, dentro `vinto()`:
- `if (primaVolta) aggiungiCassa` — una per ogni labirinto nuovo (rigiocarlo non ne da' altre);
- `if (salita.levelUp) aggiungiCassa` — mancava del tutto: il passaggio di livello dentro un
  labirinto non dava niente, perche' quel pezzo stava solo in `game.js`.

**Recupero una tantum** in `normalizza()` (locale e online): al primo passaggio con la versione
nuova, `casse.pronte += labirinto.completati` e si mette `casse.recupero = true` perche' non si
ripeta. Cosi' chi aveva gia' giocato non resta a mani vuote, senza che nessuno tocchi i dati a mano.

### Regola definitiva della cassa (29/08/2026)

**Una cassa per ogni livello cervello guadagnato**, e basta. Non per partita, non per labirinto.
Un solo punto di verita' ripetuto in due posti, perche' le modalita' sono due:
`game.js finish()` e `laby.js vinto()`, entrambi `if (salita.levelUp) BT.store.aggiungiCassa(p)`.

Storia delle tre versioni, per non ripetere il giro:
1. solo `game.js` → chi giocava ai labirinti non vedeva mai una cassa (era un bug: il passaggio
   di livello dentro un labirinto non veniva premiato);
2. una per labirinto superato + recupero degli arretrati → troppo frequente, sembrava "una per partita";
3. **solo livello cervello, ovunque** ← questa.

Il recupero una-tantum degli arretrati e' stato tolto: le 9 casse gia' consegnate a Diego restano
sue, ma il codice non ne regala piu'.

Cadenza attesa con la curva `300*(l-1)*l`: una cassa ogni 1-2 partite di quiz in Difficile,
oppure ogni 5-6 labirinti. Se un giorno sembrasse troppo rara, la leva e' la curva dei livelli,
non la regola della cassa.

## Labirinto 3D: fatto e tolto (29/08/2026)

Su richiesta e' stata scritta e provata una vista in prima persona (ray casting su canvas) dal
livello 10, poi **tolta su richiesta dello stesso giorno**. Il labirinto e' tornato alla sola
mappa dall'alto. Se un giorno si volesse rifare, questi sono i punti delicati imparati allora:

- il campo visivo va largo (**90°**, non 60): con corridoi larghi una cella, appena sei davanti
  a un muro lo schermo diventa un rettangolo pieno e non si capisce piu' dove si e';
- i muri vanno bassi (**0.62**), se no coprono soffitto e pavimento e sparisce la profondita';
- serve per forza una **mappina** in un angolo, altrimenti il labirinto smette di essere un gioco
  di logica e diventa un girare a caso;
- i comandi diventano relativi (avanti / gira), quindi la croce direzionale va rietichettata;
- la bussola non puo' piu' indicare il nord: va tradotta in "avanti / gira / dietrofront".

Nessuna traccia e' rimasta nel codice: `laby.js` ha un solo disegnatore e `BT.laby.muovi(dir)`
assoluto, come prima.

## Il codice segreto del labirinto (29/08/2026)

Chiesto esplicitamente: un codice che teletrasporta all'uscita. Si scrive **`tele`** dentro un
labirinto (nessuna di quelle lettere e' un tasto di movimento: w/a/s/d lo sarebbero), oppure si
tocca **cinque volte il nome del livello** — su tablet non c'e' tastiera. Fuori dal labirinto non
fa niente.

**Passa ma non premia**, ed e' la parte importante: `L.barato` fa uscire `vinto()` da un ramo
separato che da' 0 punti, 0 coppe, 0 stelle, nessun tempo in classifica, nessuna cassa e non
incrementa `labirinto.completati`. Sblocca solo il livello successivo, via
`BT.store.sbloccaLabirinto` (nuovo, in tutti e due gli storage).

Il perche' del paletto: se il teletrasporto desse i premi, converrebbe usarlo **sempre** e i
labirinti smetterebbero di voler dire qualcosa — e i punti cervello, che comandano le casse e i
livelli, diventerebbero infiniti. Cosi' invece resta quello che serve davvero: una via d'uscita
da un labirinto troppo difficile.

> Resta valida la regola sulle domande: li' nessun codice, nessuna scorciatoia. Saltare un
> labirinto e' un problema di pazienza; saltare una domanda sarebbe barare sull'imparare.

# Limite di tempo e menu a due passi (29/08/2026)

## Trenta minuti, poi tre ore (`js/limite.js`)

Regola chiesta dal genitore: **30 minuti di gioco di fila, poi 3 ore di pausa.**

Si conta il tempo **dentro le partite** (quiz, duelli, labirinti), non il tempo con l'app aperta:
leggere le Scoperte, guardare la classifica o girare per il Negozio non consuma niente. E' una
scelta voluta — il limite serve a non stare incollati a giocare, non a impedire di guardare le
proprie cose.

Nel profilo: `tempo: { usato, ultimo, bloccatoFino }` (millisecondi). Due modi di scontare la
pausa: aspettare che scada `bloccatoFino`, **oppure** non giocare per tre ore (`aggiorna()`
azzera `usato` da solo). Cosi' non serve nessun timer di sistema e la regola tiene anche se il
gioco resta chiuso per giorni.

Ganci: `BT.limite.avvia()` in `game.js start()` e `laby.js gioca()`; `BT.limite.ferma()` in
`game.js finish()`, `laby.js vinto()/perso()/abbandona()`. Il controllo all'ingresso e'
`controllaLimite()` in `app.js`, davanti a Gioca / Allenamento / Duello / Sfide.

Due decisioni di prodotto dentro il codice:
- **chi e' dentro una partita la finisce sempre.** Interromperla a meta' farebbe perdere i punti
  guadagnati: sarebbe una punizione, non una regola;
- **nel duello il tempo si addebita a tutti e due** (`ferma` accetta anche un array): giocano in
  due sullo stesso dispositivo, sarebbe assurdo scalarlo a uno solo.

Online il campo vive nello stato condiviso, quindi il limite segue il giocatore anche cambiando
dispositivo: non si aggira riaprendo il gioco sul tablet.

I numeri stanno in cima a `limite.js` (`MINUTI`, `ORE_PAUSA`): due costanti, si cambiano li'.

## Il menu adesso ha due passi

Prima le tessere erano cinque modi di giocare messi in fila (Gioca, Allenamento, Labirinti,
Duello, Sfide). Adesso **Gioca e Allenamento sono modi, non attivita'**: si sceglie prima il modo,
poi che cosa fare (`apriAttivita()` → schermata `screen-attivita`).

- **Gioca → Quiz** oppure **Gioca → Labirinto** (con punti e coppe, come sempre);
- **Allenamento → Quiz** oppure **Allenamento → Labirinto**, e qui il labirinto non da' e non
  toglie niente: `L.allena` fa uscire `vinto()` prima di ogni chiamata allo store, esattamente
  come il quiz di allenamento.

La tessera **Labirinti** non esiste piu' nel menu. Il **Duello** e le **Sfide** restano tessere a
se': il duello sui labirinti non esiste (servirebbe una gara a due sullo stesso labirinto, che e'
un'altra cosa da scrivere).

> La tessera **Sfide** (sfide a distanza) c'e' **solo nella versione online**: ha bisogno della
> pagina condivisa per esistere. Nella versione locale ci sono Duello (stesso dispositivo) e basta.

# Impara una lingua (`js/data-lingue.js`, `js/lingue.js`)

Quarto modo di giocare, dentro Gioca e Allenamento come il quiz e il labirinto.
Lingue: inglese, francese, tedesco, spagnolo, sempre a partire dall'italiano.
La scelta e' una preferenza **del dispositivo** (`settings.lingua`), non del profilo: sul tablet
si puo' studiare francese e sul computer inglese senza litigare.

## I tre esercizi
1. **figura -> parola** (e una volta ogni otto al contrario, parola -> figura);
2. **la parola che manca** in una frase col buco;
3. **rimettere in ordine** le parole di una frase.

Il terzo si gioca **a tocchi, non a trascinamento**: si tocca la parola per metterla in fila e si
ritocca per rimandarla indietro. Trascinare su un telefono e' scomodo e su desktop richiederebbe
tutto un altro impianto. Dentro `scelte` ci sono gli **indici**, non le parole: due parole uguali
nella stessa frase (i tanti "the" inglesi) sarebbero altrimenti indistinguibili.

## Dati
`BT.PAROLE`: 54 righe `{ ico, it, en, fr, de, es }`. Le figure sono **emoji**, non immagini: si
vedono ovunque, non pesano niente e non hanno problemi di diritti — la stessa ragione degli avatar.
In tedesco l'articolo fa parte della parola (`der Hund`): impararla senza articolo non serve.
`BT.FRASI_BUCO` e `BT.FRASI_ORDINE`: 12 e 10 frasi per lingua, con la traduzione italiana che
compare come aiuto (nell'esercizio d'ordine) o come spiegazione (dopo la risposta).

> Le bandiere emoji su Windows non si disegnano: 🇬🇧 diventa "GB". Va bene nelle righe piccole
> (si legge lo stesso), ma nella card del risultato l'icona grande e' 🌍, se no si vedrebbe un
> "GB" gigante.

## Punti
Niente timer: qui non si corre. Giusto = 100 x serie x bonus della difficolta'; in Gioca lo
sbaglio toglie `penalita` (mai sotto zero) e ogni risposta giusta vale una coppa. In Allenamento
non si tocca niente, come sempre. A fine partita `BT.store.premia()` (nuovo, generalizza
`premiaLabirinto`) e la solita regola unica: **cassa solo se sali di livello cervello**.

# Una schermata sola per scegliere (29/08/2026)

Il menu a due passi ha vissuto poche ore: far scegliere due volte di fila (prima il modo, poi
l'attivita') e' una scala inutile. Adesso **Gioca** e **Allenamento** portano dritti a una
schermata con tutto dentro: Quiz misto, le sei materie, **Impara una lingua**, **Labirinti**,
piu' il selettore di difficolta' che era gia' li'.

`renderCategories()` costruisce le carte con un helper `carta()`. Le due attivita' che non sono
quiz compaiono **solo se `mode !== 'duel'`**: un labirinto in due non esiste, e la sfida a
distanza confronta punteggi di quiz.

## La lingua si sceglie ogni volta

Non e' piu' un'impostazione. `BT.lingue.scegli(callback)` disegna dentro `#lingua-box` sei carte
— italiano, inglese, francese, tedesco, spagnolo, **misto** — e solo dopo parte la partita.
Il motivo e' banale e giusto: un giorno si ha voglia di inglese e un altro di tedesco.

- **`misto`** non e' una lingua: `costruisci()` pesca una lingua vera per **ogni esercizio**, e la
  bandiera in alto mostra quella dell'esercizio in corso, se no non si capirebbe a che lingua si
  sta rispondendo.
- **`it` come lingua da imparare**: nell'esercizio figura → parola il nome italiano sotto la
  figura **non si mostra** (sarebbe la risposta in chiaro) e l'etichetta diventa "Come si chiama?".
  Aggiunte 12 frasi col buco e 10 da riordinare in italiano.
- Ogni lingua ha anche un `ico` oltre alla bandiera: su Windows 🇬🇧 diventa "GB", e a 60px in una
  card sarebbe brutto. Le bandiere restano nelle righe piccole.

Nelle Impostazioni la voce e' stata **tolta**: quella che ci andra' e' la lingua dell'interfaccia,
e arrivera' con la traduzione (non ancora fatta).

## La tessera "Sfida a distanza" nella versione locale

`data-go="online"` in `index.html` (solo locale). Non incornicia il gioco online: **claude.ai non
si lascia mettere in un iframe** da una pagina aperta come file, e' una regola del browser. Quindi
spiega dove si va e apre in una scheda nuova.

Va detto chiaro nella schermata, ed e' scritto li': le due versioni tengono **due elenchi
separati** di giocatori, perche' quella locale deve funzionare anche senza internet.

# Verso il gioco condiviso: la fusione dei profili (`js/fusione.js`)

Primo pezzo dell'impianto per giocare in tanti. E' indipendente da dove finiranno i dati, quindi
si puo' scrivere e collaudare adesso: qualunque backend si scelga, questa regola serve.

`BT.fondi(a, b, base)` rimette insieme due versioni dello stesso profilo — stessa persona su due
dispositivi, oppure una partita giocata senza rete. Funziona perche' i dati di questo gioco
**crescono e basta**, quindi non serve decidere chi ha ragione:

| dato | regola |
|---|---|
| xp, coppe, risposte, giuste, duelli | somma delle partite **nuove** rispetto alla base comune |
| bestRun, bestStreak | il migliore |
| avatar/titoli/temi sbloccati, scoperte | unione degli insiemi |
| tempi dei labirinti | il piu' basso, livello per livello |
| aiuti nello zaino | il **massimo**, non la somma (se no basta aprire due schermi per raddoppiarli) |
| nome, avatar, tema, titolo | di chi ha `aggiornatoIl` piu' recente: sono scelte, non progressi |
| limite dei 30 minuti | il piu' severo dei due, se no si aggira cambiando dispositivo |

**La base comune** e' l'ultima versione che i due lati avevano in comune: serve per sommare solo
il nuovo. Senza base la funzione prende il massimo: non perde niente, ma puo' non contare due
partite fatte davvero in parallelo. E' il compromesso giusto con dei bambini — meglio qualche
punto in meno che un profilo azzerato.

Provato con un caso vero: stessa base, +300 punti sul computer e +500 sul tablet -> 1800 (tutti
contati), le materie sommate, gli avatar uniti, il tempo del labirinto 1 sceso a quello piu'
veloce, gli aiuti non raddoppiati.

---

# Cassa, profilo modificabile, difficolta' a ogni partita (30/08/2026)

## La trappola del salvataggio che ricarica la pagina

Nella versione online **ogni `BT.store.save()` ripubblica il documento, e la pagina si
ricarica**: e' il funzionamento della capability `artifact`, non un difetto. La conseguenza
non era stata prevista: l'elenco dei premi della cassa spariva da solo dopo un attimo,
prima che si riuscisse a leggerlo.

Rimedio, valido anche in locale: `BT.casse.apri()` scrive i premi nel profilo
(`p.cassaDaLeggere`), `renderMenu()` li ripropone se ci sono, e `BT.casse.letta()` li
cancella solo quando il giocatore preme **"Ho letto, va bene"**. Nessun timer, nessuna
sparizione automatica: e' una richiesta esplicita, e va rispettata alla lettera.

> Corollario da ricordare: **le preferenze del dispositivo non vanno mai salvate con
> `store.save()`**. Difficolta' e suoni usano `salvaPreferenze()` (→ `store.salvaPref()`),
> se no cambiare difficolta' ripubblicava la pagina e la faceva ricaricare.

## Modificare un giocatore
`screen-newprofile` fa doppio servizio: `renderNewProfile(p)` con un profilo entra in
modifica, precompilata. Si arriva dal tasto **✎ modifica** sulla scheda del menu.
`BT.store.modifica(p, {name, avatar, eta})` (in tutti e due gli store) cambia solo
l'anagrafica: ricalcola `level` da `BT.livelloDaEta`, toglie il vecchio campo `classe`
e aggiorna `aggiornatoIl` per `BT.fondi`. Punti, coppe, sblocchi e statistiche non si toccano.

## Difficolta' prima di ogni partita
`chiediDifficolta(sotto, poi)` disegna in `#diff-box` (schermata `screen-diff`) e richiama
il callback con l'id scelto. Il quiz ce l'aveva gia' in fondo alla schermata delle materie;
adesso ce l'hanno anche **Impara una lingua** (dopo la scelta della lingua) e i **Labirinti**.

Nei labirinti la difficolta' agisce sul **tempo**: `BT.laby.config(liv, diff)` moltiplica i
secondi per `diff.tempo` (livello 1: 70s facile, 54s medio, 43s difficile). La misura del
labirinto resta decisa dal livello.

---

# Il ricaricamento che sembrava un'espulsione (30/08/2026)

Sintomo riferito: *"quando apro le casse il tempo non e' sufficiente per leggere; quando le
rifiuto mi espelle velocemente in home page"*.

Causa unica per tutti e due: online **ogni salvataggio ripubblica la pagina e la pagina si
ricarica**, e `init()` riparte sempre da `screen-home`. Quindi dopo ogni cassa il giocatore si
ritrovava davanti a "Chi gioca?", con l'impressione di essere stato buttato fuori.

Tre rimedi, tutti e tre necessari:

1. **`selectPlayer` automatico all'avvio** (solo online): se su quel dispositivo qualcuno aveva
   gia' scelto il suo nome (`BT.storeOnline.io()`, che vive in localStorage), si torna dritti al
   suo menu invece che alla home. Si cambia sempre con "Cambia giocatore".
2. **I premi restano finche' non si preme "Ho letto"** (`p.cassaDaLeggere`, gia' fatto prima).
3. **Anche il rifiuto ha la sua schermata** (`p.cassaRimandata` + `BT.casse.rimanda/rimandata/
   rimandataLetta`): dice quanto varra' la prossima, con premi e coppe, e si esce solo col tasto.

> Regola generale che ne esce: **online nessun messaggio importante puo' vivere solo nel DOM.**
> Se conta, va scritto nel profilo, perche' il DOM sparisce a ogni salvataggio. I `BT.toast()`
> vanno bene solo per le conferme che si possono perdere senza danno.

## Collaudo: attenzione al pannello di anteprima
Il pannello non ricarica davvero la pagina fra un `javascript_exec` e l'altro e `localStorage` e'
disabilitato (URL `data:`). Due conseguenze quando si collauda: lo stato si accumula fra una prova
e l'altra, e soprattutto **il giocatore da usare nei test e' `BT.storeOnline.io()`**, non uno creato
al volo con `store.create`: `renderMenu` lavora sulla variabile `player`, e con due oggetti diversi
i controlli sulle casse sembrano rotti quando non lo sono.
