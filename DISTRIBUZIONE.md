# Portare Brain Time sugli store

> Deciso il **17 ottobre 2026**: si vuole il gioco scaricabile dal Play Store e dall'App Store.
> Questo file e' il piano. Dice cosa serve, quanto costa, **chi fa cosa** e dove sono i blocchi.
> Si aggiorna man mano: e' il posto dove guardare riprendendo il lavoro.

Le due strade non si somigliano. Una e' lavoro; l'altra e' lavoro **piu' un rischio di rifiuto
che non dipende da noi**. Vanno guardate separate.

---

## 1. Google Play — si fa

Il gioco e' gia' una PWA (manifesto, service worker, funziona offline, sta su HTTPS). Si
impacchetta in una **TWA** (*Trusted Web Activity*): una app Android che e' un guscio attorno al
sito, senza barra dell'indirizzo, con la sua icona. Lo strumento e' `bubblewrap` (o PWABuilder).
Non si riscrive niente del gioco.

### I tre blocchi, in ordine di chi deve muoversi

**1. La radice del sito non esiste, e serve.**
La verifica che toglie la barra dell'indirizzo (*Digital Asset Links*) pretende un file
**alla radice del dominio**:

    https://whiteholdingfirst-bit.github.io/.well-known/assetlinks.json

Oggi quella radice risponde **404**: il gioco sta in `/brain-time/`, ma li' il file non vale.
Serve un secondo repository, pubblico, chiamato esattamente `whiteholdingfirst-bit.github.io`,
con dentro `.well-known/assetlinks.json` e un file vuoto `.nojekyll` (se no GitHub Pages ignora
le cartelle che iniziano col punto). E' gratis e si fa in cinque minuti.

> Senza quella verifica la app si apre **con la barra dell'indirizzo in cima**: sembra un
> browser, ed e' esattamente la cosa che stiamo cercando di evitare. Non e' un dettaglio
> estetico, e' il punto di tutta l'operazione.

> **Alternativa migliore, se si vuole spendere 10-15 € l'anno:** un dominio proprio
> (`braintime.it` o simili). Risolve lo stesso problema, da' finalmente il *link semplice da
> passare* che serviva da settimane, fa una figura seria nella scheda dello store, e se un
> domani il gioco si sposta da GitHub l'indirizzo non cambia. Il repository radice resta
> comunque la strada gratis.

**2. L'account sviluppatore Google Play.** 25 $ una volta sola, non annuali.
**Lo deve aprire l'utente**: chiede documento e verifica d'identita', e non e' una cosa che
possa fare io.

**3. I 12 tester per 14 giorni.** Per gli account personali nuovi Google chiede un **test chiuso
con almeno 12 persone per 14 giorni di fila** prima di poter pubblicare davvero. Da verificare al
momento dell'iscrizione, perche' Google cambia spesso queste regole. Con una classe i tester ci
sono gia': e' la parte che costa solo pazienza.

### Cosa serve alla scheda dello store

| Cosa | Stato |
|---|---|
| Informativa privacy a un indirizzo pubblico | ✅ `privacy.html` |
| Icona 512×512 | ✅ c'e' gia' |
| Icona *maskable* (con il bordo di sicurezza) | ⬜ da generare, se no Android la ritaglia male |
| Grafica in evidenza 1024×500 | ⬜ da disegnare |
| Almeno 2 schermate da telefono | ⬜ da catturare |
| Titolo, descrizione breve e lunga | ⬜ da scrivere |
| Questionario classificazione contenuti | ⬜ lo compila l'utente (nessuna violenza, nessun acquisto) |
| Modulo "Sicurezza dei dati" | ⬜ facile: non si raccoglie niente |
| Programma **Designed for Families** | ⬜ da decidere: dichiarare il pubblico "bambini" alza i requisiti |

### Chi fa cosa
- **Io:** il pacchetto TWA, `assetlinks.json`, l'icona maskable, la grafica, le schermate, tutti
  i testi della scheda, e i controlli tecnici.
- **L'utente:** aprire l'account, pagare i 25 $, creare il repository radice (o comprare il
  dominio), caricare il pacchetto e rispondere ai questionari. Quelle cose le puo' fare **solo
  chi possiede l'account**.

---

## 2. App Store — qui c'e' un muro, e non e' tecnico

### I costi
- **99 $ l'anno, per sempre.** Non si smette di pagare: se scade, la app sparisce dallo store.
- **Serve un Mac con Xcode** per compilare e inviare. Qui si lavora su Windows. Si puo' noleggiare
  un Mac a ore in cloud, ma e' un'altra cosa da pagare e da imparare.

### Il muro vero
La linea guida **4.2 "Minimum Functionality"** dice, in sostanza: *una app che e' solo un sito web
impacchettato viene rifiutata.* Brain Time oggi e' esattamente quello: un sito, molto curato, ma
un sito.

Non e' una possibilita' remota da mettere in conto: e' **la regola**, ed e' uno dei motivi di
rifiuto piu' comuni. Giocano a nostro favore il fatto che funziona davvero offline e che e' un
gioco completo, non una vetrina; gioca contro il fatto che dentro non c'e' niente di nativo.

Per passare servirebbe che la app facesse qualcosa che il sito **non** fa: notifiche vere,
Game Center per le classifiche, salvataggio su iCloud, widget. Cioe' non un impacchettamento:
un pezzo di lavoro nuovo, in un linguaggio diverso.

### In piu', se dichiariamo che e' per bambini
La **Kids Category** di Apple vieta le terze parti che raccolgono dati. Oggi il gioco scarica i
caratteri da Google Fonts: andrebbero **portati dentro** il progetto. E' una cosa giusta da fare
comunque — toglie l'ultima dipendenza da internet e rende l'informativa privacy un foglio
bianco — ma va fatta prima.

### La domanda da decidere
Con 99 $ l'anno e un Mac si **tenta**, sapendo che il primo invio probabilmente torna indietro.
L'alternativa onesta e' che su iPhone resti "Aggiungi a Home", che ormai funziona ed e' gratis.

---

## Ordine dei lavori proposto

1. **Togliere Google Fonts** (serve a tutti e due, e migliora il gioco comunque). — da fare
2. **Icona maskable + grafica + schermate + testi della scheda.** — da fare
3. **Repository radice** (o dominio) con `assetlinks.json`. — serve l'utente
4. **Account Google Play** e pacchetto TWA. — serve l'utente
5. **Test chiuso coi compagni di classe**, 14 giorni. — serve la classe
6. **Pubblicazione su Play.**
7. **App Store:** solo dopo aver deciso del punto 4.2 qui sopra.

> Nota su `manifest.json`: il campo `id` e' stato messo a `/brain-time/`, che e' **esattamente
> quello che il browser calcolava gia' da solo** partendo da `start_url`. Serve agli store per
> avere un'identita' esplicita, e messo cosi' **non cambia identita'** alle app gia' installate:
> chi ce l'ha gia' sulla Home non si accorge di niente. Se un domani si cambia indirizzo, quel
> campo va lasciato com'e', se no le installazioni esistenti diventano "un'altra app".
