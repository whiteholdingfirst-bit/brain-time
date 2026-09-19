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
- **Pagina di famiglia**: l'ultimo salvataggio è del **30 agosto**. Vuol dire che da allora nessuno
  ha giocato *lì sopra*. Non dice niente su chi ha giocato in locale o sulla pagina pubblica: quelle
  due tengono i punteggi nel browser e non lasciano traccia.
- **Domande**: due partite di fila non danno piu' le stesse domande (era il difetto piu'
  visibile: Diego e Gabri si ritrovavano lo stesso quiz). Ogni giocatore si porta dietro la
  memoria di quelle gia' viste.
- **Reazioni**: punteggio che sale contando, serie a tre gradini, coriandoli, lampo di esito
  (`js/juice.js`). È la prima metà del lavoro sulla grafica: quella che **si sente**.
- **Cassa Suprema**: in cima alla scala delle rarita' si scelgono tre stelle, e una su tre
  trasforma la cassa nella Suprema, il 50% in piu'.
- **Supabase**: l'account non risulta ancora fatto (nel progetto non c'è nessuna chiave). È il punto
  fermo su cui è rimasto tutto il resto.

---

## Cosa manca, in ordine

### 1. La grafica — **è la priorità adesso**
Obiettivo dichiarato il 19 settembre: non "funzionare", ma **essere un must-have fra i compagni
di classe di Diego**. È un obiettivo diverso da quello di partenza (un gioco per due fratelli) e
cambia le priorità: deve reggere il confronto con quello che i ragazzi hanno già sul telefono.

Due metà indipendenti, e si è deciso di fare prima la seconda perché si sente subito e non
vincola la prima:

- ✅ **Le reazioni — fatte il 19/09.** `js/juice.js`: punteggio che sale contando, serie a tre
  gradini, coriandoli, lampo di esito, numeri che volano via dal tasto toccato.
- ⬜ **La faccia — da fare.** Quello che non va, in ordine di peso:
  1. **tutto è la stessa card bianca** sul solito cielo azzurro — home, menu, domanda, negozio,
     risultato. Nessuna gerarchia, niente che dica "gioco" invece di "sito della scuola";
  2. **le emoji come unica grafica**: si vedono diverse su ogni telefono e sono il segnale più
     forte di una cosa fatta in fretta. Servono icone disegnate in SVG *dentro il codice*
     (nessun file, nessun problema di diritti, nitide a ogni dimensione), almeno per le sei
     materie, la cassa, la stella e il livello;
  3. **la scala tipografica è piatta**: tutto sta fra 15 e 25px, niente è grande davvero;
  4. **i 16 temi fanno sembrare il gioco configurabile, non disegnato.** Un must-have ha *una*
     faccia che si riconosce da lontano.

  Metodo concordato: prima **tre direzioni** (menu, domanda, risultato) costruite col markup
  vero, da guardare al telefono e sceglierne una; poi si implementa quella. Tutti i colori sono
  già variabili CSS, quindi la pelle si cambia senza riscrivere il gioco.

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

### 4. Una banca di domande per i piccoli
Sotto gli otto anni le domande restano quelle della quinta elementare, quindi troppo difficili
(il limite è dichiarato anche nell'interfaccia). Serve una quarta banca — colori, forme, contare,
versi degli animali — in tutte le categorie. È lavoro di contenuti, non di codice, e si può fare
**senza aspettare Supabase**.

### 5. La traduzione dell'interfaccia
Menu, pulsanti e messaggi in inglese, francese, tedesco e spagnolo: circa 400 frasi da estrarre e
ricablare. Le domande del quiz resterebbero in italiano, perché sono programma scolastico italiano.
La voce nelle Impostazioni arriverà **insieme** alla traduzione, non prima.

### 6. Riaccendere il limite dei 30 minuti
`ATTIVO = true` in `js/limite.js`, quando il gioco è considerato finito. Adesso è spento.

### 7. App Store e Google Play — **messo in attesa di proposito**
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
