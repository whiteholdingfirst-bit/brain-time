# BRAIN TIME — Specifica di Progetto

## 1. Visione

Brain Time è una piattaforma di gioco educativo nata da un'idea originale di **Diego**, pensata per essere usata insieme a suo fratello.

L'idea di partenza era "un robot che fa i compiti al posto mio". L'abbiamo evoluta in qualcosa di più potente e divertente: **un videogioco che ti aiuta a diventare più bravo**, non che lo fa al posto tuo. Rispondi bene, sali di livello, guadagni coppe, sfidi tuo fratello (o giochi da solo).

Obiettivo del gioco: allenare calcolo, pensiero strategico (scacchi), logica, lingue e cultura generale, in un contesto competitivo e divertente tra fratelli.

## 2. Nome e identità visiva

- **Nome:** Brain Time
- **Colore dominante:** azzurro
- **Sfondo/tema grafico:** a tema libri (books)

## 3. Meccaniche di gioco

- **Progressione a livelli:** rispondendo correttamente si sale di livello
- **Sistema coppe:** più sei forte (più rispondi bene, più vinci), più coppe accumuli
- **Economia coppe → aiuti:** le coppe si possono spendere per comprare aiuti/power-up in gioco
- **Classifica (leaderboard):** punteggio comparabile fra i due fratelli, per vedere chi è il più forte
- **Modalità di gioco:**
  - Singolo (allenamento libero)
  - Duello (sfida diretta tra due giocatori, sullo stesso dispositivo)
- **Modalità genitori (adulti):** i genitori possono giocare anch'loro in una modalità dedicata "adulta", ma **non possono suggerire le risposte** ai figli durante il loro turno

## 4. Livelli di difficoltà per età/classe

Il gioco deve avere una difficoltà differenziata, non un livello unico per tutti:

- **Fratello minore — 5ª elementare:** difficoltà calibrata sul programma di quinta elementare
- **Fratello maggiore — 2ª media:** difficoltà calibrata sul programma di seconda media
- **Modalità adulti (genitori):** livello più alto, per la modalità dedicata ai genitori

Il sistema deve poter riconoscere/selezionare il profilo giocatore e assegnare le domande al livello corretto, in modo che i due fratelli possano comunque confrontarsi in classifica pur partendo da basi diverse (es. tramite un sistema di punteggio normalizzato per livello, non domande identiche).

## 5. Categorie di gioco

1. **Matematica** — quiz con difficoltà crescente, a livelli
2. **Scacchi** — problemi/puzzle scacchistici (es. matto in una mossa, tattiche base) per allenare pensiero strategico
3. **Logica ed enigmi** — indovinelli, sequenze, pattern recognition
4. **Lingue straniere** — test linguistici in 5 lingue:
   - Inglese
   - Tedesco
   - Spagnolo
   - Portoghese
   - Francese
5. **Storia** — domande di cultura storica, dalla preistoria fino ai giorni nostri

Le categorie servono a diversificare il gioco e allenare "muscoli" cognitivi diversi (calcolo, strategia, pattern recognition, linguistico, memoria/cultura).

## 6. Requisiti tecnici (da definire in fase di sviluppo con Claude Code)

Non ancora specificati nel dettaglio dai requisiti raccolti — suggerimenti di partenza per Claude Code, da confermare:

- Piattaforma: applicazione web (accessibile da browser, desktop e mobile/tablet)
- Necessario un sistema di profili giocatore (almeno: due fratelli e la modalità genitori)
- Necessario storage per punteggi/coppe/livello per persistenza tra sessioni
- Necessario motore di generazione/pescaggio domande per ciascuna delle 5 categorie, con banca dati separata per livello (5ª elementare / 2ª media / adulti)
- Duello: da definire se in tempo reale (stesso dispositivo, a turni) o asincrono

## 7. Note per lo sviluppo

- Priorità all'esperienza di gioco (divertimento, senso di progressione) mantenendo il valore educativo reale — niente scorciatoie che permettano di "vincere" senza effettivamente rispondere
- Il tono e lo stile devono essere adatti a bambini/preadolescenti (10-12 anni)
