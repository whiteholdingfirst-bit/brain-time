# Lavori in corso — dove siamo arrivati

Questo file serve a **riprendere il lavoro da un'altra sessione**, su un altro computer o dal
telefono. Le note tecniche stanno in `CLAUDE.md`; qui c'è solo lo stato: cosa è stato deciso,
cosa è fatto, cosa manca e in che ordine.

Ultimo aggiornamento: 30 agosto 2026.

---

## Dove sta cosa

| | Dove | Chi può aggiornarlo |
|---|---|---|
| Codice e note | GitHub, `whiteholdingfirst-bit/brain-time` | chiunque, da qualsiasi sessione |
| Gioco locale | `index.html`, si apre col doppio click | — |
| Pagina online di famiglia | un artifact di claude.ai (indirizzo in `pagina-online.txt`) | **solo dal computer di casa** |
| Punteggi dei giocatori | dentro la pagina online; in locale nel browser | — |

**La pubblicazione della pagina online si fa solo dal computer di casa.** Richiede di leggere la
pagina viva, trapiantarci lo stato vero dei giocatori e ripubblicare: una sessione cloud non ha
accesso a quella pagina. Vale anche per il collaudo, che si fa aprendo il gioco in un browser.

---

## Regole di lavoro decise

1. **Un posto per volta.** Se si modifica dal cloud, chi lavora sul computer fa `pull` prima di
   toccare qualsiasi cosa. Il doppio binario nasce solo scrivendo da due parti insieme.
2. **Online e offline sempre allineati.** Dopo ogni modifica al gioco, la pagina online va
   aggiornata. Se i ragazzi stanno giocando, il controllo anti-sovrascrittura obbliga a rileggere
   l'intera pagina prima di pubblicare: conviene pubblicare quando non stanno giocando.
3. **Niente dati dei giocatori nel repository.** Il file generato `online/brain-time-online.html`
   contiene nomi, punteggi e foto: sta nel `.gitignore` e ci resta.
4. **Nessuna scorciatoia sulle domande.** Non esiste e non deve esistere un modo di ottenere la
   risposta senza rispondere. Sui labirinti sì (il codice `tele`), ma passa senza premiare.

---

## Fatto oggi

- **La cassa si legge con calma.** L'elenco dei premi resta finché non premi **"Ho letto, va bene"**.
  Prima spariva da solo dopo un attimo: online ogni salvataggio ripubblica la pagina e la fa
  ricaricare. Ora i premi sono scritti nel profilo e la schermata torna su da sola.
- **Modifica del giocatore**: tasto **✎ modifica** sulla scheda del menu. Si cambiano nome, faccia
  ed **età**; l'età ricalcola il livello delle domande. Punti, coppe e sblocchi restano.
- **Difficoltà prima di ogni partita**, anche per *Impara una lingua* e per i **Labirinti**, dove
  agisce sul tempo (livello 1: 70s facile, 54s medio, 43s difficile).
- Corretto un guasto grosso della versione online: `tipo` invece di `tipoPartita` bloccava
  *Gioca*, *Allenamento*, *Impara una lingua* e i labirinti. Non succedeva niente cliccando.
- Casse sorpresa con la **stella a sette rarità**: rifiutando, il valore **raddoppia** davvero.
- **Una schermata sola** per scegliere cosa fare.
- **Impara una lingua**: la lingua si sceglie **a ogni partita** (ita/eng/fr/de/sp/misto).
- **Tasto per uscire** dalla partita: chi si ferma tiene i punti delle domande già fatte.
- **Età al posto della classe**, da 3 a 17 più Adulto.
- **Limite dei 30 minuti spento** finché il gioco è in costruzione (`ATTIVO` in `js/limite.js`).
- `js/fusione.js`: la regola che **rimette insieme due copie dello stesso giocatore**.

---

## Cosa manca, in ordine

### 1. Pubblicare il gioco su GitHub Pages
Due passaggi da fare a mano su GitHub: rendere **pubblico** il repository
(`Settings → Danger Zone → Change visibility`) e accendere **Pages**
(`Settings → Pages → Deploy from a branch → main → / (root)`).
`index.html` è già nella radice, quindi non c'è niente da spostare.
L'indirizzo sarà `https://whiteholdingfirst-bit.github.io/brain-time/`.

### 2. L'archivio condiviso (Supabase)
Perché il gioco possa girare fra amici servono un database vero e degli account. Decisioni già
prese:

- **Soprannome, non nome vero.** Il campo deve chiedere *"Come ti vuoi far chiamare?"* e proporre
  un soprannome, non un nome di battesimo.
- **Età sì**, perché serve a scegliere le domande — ma un numero da una lista, **mai** una data di
  nascita: "11 anni" non identifica nessuno, "nato il 4 marzo 2014" sì.
- **Niente foto** per chi non è di famiglia.
- **Si entra solo su invito**, non con una pagina aperta a chiunque.
- Server in **Europa**.
- Cosa si salva: soprannome, età, avatar, punti, coppe, risposte date e giuste, sblocchi, tempi dei
  labirinti, scoperte. Nient'altro.

La sincronizzazione userà `BT.fondi()` di `js/fusione.js`: ogni dispositivo tiene la sua copia,
si gioca anche senza rete, e al ritorno del collegamento i progressi si fondono.

### 3. Una banca di domande per i piccoli
Limite dichiarato anche nell'interfaccia: **sotto gli otto anni** le domande restano quelle della
quinta elementare, quindi troppo difficili. Serve una quarta banca (colori, forme, contare,
versi degli animali) in tutte le categorie. È lavoro di contenuti, non di codice.

### 4. La traduzione dell'interfaccia
Menu, pulsanti e messaggi in inglese, francese, tedesco e spagnolo — circa 400 frasi da estrarre e
ricablare. Le domande del quiz resterebbero in italiano: sono programma scolastico italiano.
La voce nelle Impostazioni arriverà **insieme** alla traduzione, non prima: un interruttore che non
fa niente è peggio che non averlo.
