# Lavori in corso — dove siamo arrivati

Questo file serve a **riprendere il lavoro da un'altra sessione**, su un altro computer o dal
telefono. Le note tecniche stanno in `CLAUDE.md`; qui c'è solo lo stato: cosa è stato deciso,
cosa è fatto, cosa manca e in che ordine.

Ultimo aggiornamento: **19 settembre 2026**. Ultimo lavoro sul codice: **19 settembre 2026**.

---

## Dove sta cosa

| | Dove | Chi può aggiornarlo |
|---|---|---|
| Codice e note | GitHub, `whiteholdingfirst-bit/brain-time` — **pubblico** | chiunque, da qualsiasi sessione |
| Gioco per tutti | https://whiteholdingfirst-bit.github.io/brain-time/ | si aggiorna da solo a ogni `git push` |
| Gioco in locale | `index.html`, si apre col doppio click | — |
| Pagina online di famiglia | un artifact di claude.ai (indirizzo in `pagina-online.txt`) | **solo dal computer di casa** |
| Punteggi | nella pagina di famiglia i punteggi sono condivisi; in locale e sulla pagina pubblica restano nel browser di chi gioca | — |

**La pubblicazione della pagina di famiglia si fa solo dal computer di casa**: richiede di leggere
la pagina viva e trapiantarci lo stato vero dei giocatori. Una sessione cloud non ci arriva.

---

## Regole di lavoro decise

1. **Un posto per volta.** Se si modifica dal cloud, chi lavora sul computer fa `pull` prima di
   toccare qualsiasi cosa.
2. **Online e offline sempre allineati.** Dopo ogni modifica al gioco si aggiornano tutte e due:
   `git push` (pagina pubblica) e la ripubblicazione dell'artifact (pagina di famiglia).
3. **Niente dati dei giocatori nel repository.** `online/brain-time-online.html` è generato e
   contiene nomi e punteggi: sta nel `.gitignore` e ci resta. Idem `js/config-locale.js` e
   `pagina-online.txt`.
4. **Nessuna scorciatoia sulle domande.** Non esiste e non deve esistere un modo di ottenere la
   risposta senza rispondere. Sui labirinti sì (il codice `tele`), ma passa senza premiare.
5. **Nel gioco non si scrive.** Niente chat, niente messaggi fra giocatori: deciso il 30/08.

---

## Stato al 19 settembre 2026

Tutto è salvo e allineato: nessuna modifica in sospeso, locale e GitHub sono allo stesso punto.

- **Gioco pubblico**: online e funzionante, installabile come app (icona, schermo intero, funziona
  senza internet).
- **Domande**: due partite di fila non danno piu' le stesse domande (era il difetto piu'
  visibile: Diego e Gabri si ritrovavano lo stesso quiz). Ogni giocatore si porta dietro la
  memoria di quelle gia' viste.
- **Grafica**: rifatta. Le reazioni (`js/juice.js`) e la faccia **arcade** - notte, neon, tasti
  con lo spessore della plastica, icone disegnate, 16 temi diventati "il tuo neon".
- **Cassa Suprema**: in cima alla scala delle rarita' si scelgono tre stelle, e una su tre
  trasforma la cassa nella Suprema, il 50% in piu'.
- ⚠️ **Pagina di famiglia: indietro rispetto al resto.** Ha le domande randomizzate e la cassa
  Suprema, non ancora le reazioni ne' la faccia arcade. Il controllo anti-sovrascrittura adesso
  rifiuta la forzatura quando qualcuno ha giocato li' sopra (e il 19/09 e' successo), e l'unica
  strada e' rileggere tutte le 8784 righe del file. Locale e pagina pubblica sono gia' aggiornati.
- **Supabase**: l'account non risulta ancora fatto (nel progetto non c'è nessuna chiave). È il punto
  fermo su cui è rimasto tutto il resto.
### 1. La grafica — ✅ **fatta il 19 settembre**
Obiettivo dichiarato: non "funzionare", ma **essere un must-have fra i compagni di classe di
Diego**. Due metà, tutte e due fatte:

- ✅ **Le reazioni** (`js/juice.js`): punteggio che sale contando, serie a tre gradini,
  coriandoli, lampo di esito, numeri che volano via dal tasto toccato.
- ✅ **La faccia: arcade.** Scelta fra tre direzioni guardate al telefono. Il mondo è un
  cabinato da sala giochi — notte, neon, tasti con lo spessore della plastica. Caratteri
  nuovi (Bungee per le insegne, Archivo per il testo), icone **disegnate** al posto delle
  emoji per le materie e le tessere, e i **16 temi diventati il tuo neon** invece di 16
  mondi diversi: nessun tema può più nascere illeggibile, e chi aveva comprato un tema ce
  l'ha ancora.

Restano emoji gli **avatar** (sono la faccia del giocatore, non un'icona) e le decorazioni
di un momento. Il dettaglio di ogni scelta sta in `CLAUDE.md`, sezione «La faccia arcade».

### 2. L'archivio condiviso (Supabase) — **serve un passo tuo**
È il blocco che tiene ferme le cose 3 e 4. Da fare:

1. creare l'account su supabase.com, progetto in **Europa**, piano Free;
2. **Authentication → Sign In / Providers**, accendere **Anonymous sign-ins** (i bambini non hanno
   email: ogni dispositivo diventa un utente anonimo e il codice d'invito decide in che gruppo entra);
3. incollare `supabase/schema.sql` in **SQL Editor** ed eseguirlo (tabelle + regole di accesso);
4. creare il primo gruppo con un codice vostro (ultima riga del file, da scommentare);
5. da **Project Settings → API** passare **solo** il *Project URL* e la chiave **`anon`**.

⚠️ La chiave **`service_role` non va data a nessuno e non va da nessuna parte**: scavalca tutte le
regole di sicurezza.

Le decisioni di privacy sono già prese e scritte qui sotto. Il codice di sincronizzazione userà
`BT.fondi()` di `js/fusione.js`: ogni dispositivo tiene la sua copia, si gioca anche senza rete, e
al ritorno del collegamento i progressi si fondono.

### 3. Classifica e community
Dopo Supabase. Classifica fra amici invitati, **senza messaggi**.

### 4. Banche di domande da ingrossare
Gli **scacchi** sono stati portati da 12 a 39 (quinta) e 35 (seconda media) il 20/09: erano la
materia che ripeteva, ed e' la materia che Diego gioca. Restano magre **Logica** (23-25) e
**Storia** (25): con 15 domande pescate in Difficile si ripete ancora. Regola: la banca deve
stare almeno al doppio delle domande pescate.

### 5. Una banca di domande per i piccoli
Sotto gli otto anni le domande restano quelle della quinta elementare, quindi troppo difficili
(il limite è dichiarato anche nell'interfaccia). Serve una quarta banca — colori, forme, contare,
versi degli animali — in tutte le categorie. È lavoro di contenuti, non di codice, e si può fare
**senza aspettare Supabase**.

### 6. La traduzione dell'interfaccia
Menu, pulsanti e messaggi in inglese, francese, tedesco e spagnolo: circa 400 frasi da estrarre e
ricablare. Le domande del quiz resterebbero in italiano, perché sono programma scolastico italiano.
La voce nelle Impostazioni arriverà **insieme** alla traduzione, non prima.

### 7. Riaccendere il limite dei 30 minuti
`ATTIVO = true` in `js/limite.js`, quando il gioco è considerato finito. Adesso è spento.

### 8. App Store e Google Play — **messo in attesa di proposito**
Deciso il 30/08: si aspetta. Costano 99 $/anno (Apple) e 25 $ (Google), hanno revisioni
aggiuntive perché è un gioco per bambini, e ogni aggiornamento ripassa dalla revisione. L'app
installabile che c'è già copre il 90% della differenza.

---

## Decisioni prese il 30 agosto 2026 (privacy e app)

Valgono per tutto quello che verrà costruito dopo.

| Tema | Decisione |
|---|---|
| Messaggi fra giocatori | **Non si fanno.** Né testo libero né frasi fisse. Nel gioco non si scrive. |
| Foto | **Nessuna foto** per chi non è di famiglia. |
| Cancellarsi | **Fatto**: Impostazioni → *I tuoi dati* → «Cancella il mio profilo», con due conferme. |
| Nome | Soprannome, mai nome e cognome. |
| Età | Numero scelto da una lista, **mai** la data di nascita. |
| Accesso | Solo su invito. |
| Server | In Europa. |
| App | **PWA**, fatta. Negozi solo se il gioco si diffonde davvero. |

### Perché niente messaggi
Il testo libero fra minori apre a offese, esclusioni e contatti non controllati, e obbligherebbe a
moderare. La community è la **classifica condivisa**, non una chat.

### Cosa dire ai genitori
Il foglio pronto da mandare è in `README.md`, sezione «Per i genitori». Resta un punto su cui non
siamo d'accordo: la posizione è che, essendo su invito, non serva. L'osservazione contraria, già
fatta, è che l'invito va comunque mandato al genitore (un bambino di 8-10 anni non ha un telefono
suo), quindi il foglio **è** l'invito e non costa lavoro in più. Decisione finale: sua.
