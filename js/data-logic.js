/* =========================================================
   BRAIN TIME — LOGICA ED ENIGMI
   Indovinelli, sequenze, riconoscimento di schemi.
   Mix di domande scritte e di sequenze generate al volo.
   ========================================================= */
(function (BT) {
  'use strict';

  var R = BT.rnd, P = BT.pick;

  /* ---------- generatori di sequenze ---------- */
  function seqAritmetica(min, max) {
    var a = R(1, 12), d = R(min, max), s = [], i;
    for (i = 0; i < 5; i++) s.push(a + d * i);
    var next = a + d * 5;
    return BT.mc('Completa la sequenza:<br><span class="mono">' + s.join('  ') + '  ?</span>',
      next, [next + d, next - 1, s[4] + d + 2],
      { cat: 'logic', explain: 'Ogni numero aumenta di ' + d + '. Dopo ' + s[4] + ' viene ' + next + '.' });
  }

  function seqAlternata() {
    var a = R(2, 9), b = R(2, 9), s = [], i;
    for (i = 0; i < 3; i++) { s.push(a + i * 3); s.push(b * (i + 1)); }
    var next = a + 3 * 3;
    return BT.mc('Attenzione, qui ci sono <b>due sequenze intrecciate</b>:<br><span class="mono">' +
      s.join('  ') + '  ?</span>', next, [b * 4, next + 3, s[5] + 3],
      { cat: 'logic', explain: 'I numeri in posizione dispari (' + s[0] + ', ' + s[2] + ', ' + s[4] +
        ') crescono di 3: il prossimo &egrave; ' + next + '.' });
  }

  function seqQuadrati() {
    var start = R(1, 5), s = [], i;
    for (i = 0; i < 5; i++) s.push((start + i) * (start + i));
    var n = start + 5, next = n * n;
    return BT.mc('Completa la sequenza:<br><span class="mono">' + s.join('  ') + '  ?</span>',
      next, [s[4] + 10, next + n, s[4] * 2],
      { cat: 'logic', explain: 'Sono i quadrati: ' + n + '&sup2; = ' + next + '.' });
  }

  function seqFibo() {
    var a = R(1, 4), b = R(2, 6), s = [a, b], i;
    for (i = 2; i < 6; i++) s.push(s[i - 1] + s[i - 2]);
    var next = s[5] + s[4];
    return BT.mc('Completa la sequenza:<br><span class="mono">' + s.join('  ') + '  ?</span>',
      next, [s[5] + 5, s[5] * 2, next + 3],
      { cat: 'logic', explain: 'Ogni numero &egrave; la somma dei due precedenti: ' + s[4] + ' + ' + s[5] + ' = ' + next + '.' });
  }

  function seqLettere() {
    var passo = P([1, 2, 3]);
    var start = R(0, 12);
    var A = 'ABCDEFGHILMNOPQRSTUVZ';
    var s = [], i;
    for (i = 0; i < 4; i++) s.push(A[(start + passo * i) % A.length]);
    var next = A[(start + passo * 4) % A.length];
    return BT.mc('Completa la serie di lettere:<br><span class="mono">' + s.join('  ') + '  ?</span>',
      next, [A[(start + passo * 4 + 1) % A.length], A[(start + passo * 4 + 2) % A.length], s[3]],
      { cat: 'logic', explain: 'Si avanza di ' + passo + ' ' + BT.plural(passo, 'lettera', 'lettere') +
        ' ogni volta (alfabeto italiano di 21 lettere).' });
  }

  function eta() {
    var figlio = R(6, 14), fattore = P([2, 3]);
    var padre = figlio * fattore;
    return BT.mc('Oggi un padre ha ' + padre + ' anni e il figlio ne ha ' + figlio +
      '. Fra quanti anni il padre avr&agrave; esattamente il doppio degli anni del figlio?',
      (padre - 2 * figlio), [figlio, padre - figlio, (padre - figlio) / 2],
      { cat: 'logic', explain: 'Dopo x anni: ' + padre + ' + x = 2 &times; (' + figlio + ' + x), da cui x = ' +
        (padre - 2 * figlio) + '.' });
  }

  /* ---------- indovinelli scritti ----------
     formato: [domanda, giusta, sbagliata, sbagliata, sbagliata, spiegazione] */

  var rowsElem5 = [
    ['Ho tante pagine ma non parlo, ho una copertina ma non ho freddo. Chi sono?', 'Un libro', 'Un armadio', 'Una porta', 'Un quaderno vuoto', 'Le pagine e la copertina sono di un libro.'],
    ['Pi&ugrave; ne togli e pi&ugrave; diventa grande. Che cos\'&egrave;?', 'Un buco', 'Una torta', 'Una montagna', 'Un palloncino', 'Togliendo terra, il buco si allarga.'],
    ['Cammina tutto il giorno ma resta sempre nello stesso posto. Che cos\'&egrave;?', 'Un orologio', 'Un albero', 'Una statua', 'Una sedia', 'Le lancette camminano senza spostarsi.'],
    ['Vola senza ali e piange senza occhi. Che cos\'&egrave;?', 'Una nuvola', 'Un aereo', 'Un aquilone', 'Il vento', 'La nuvola vola e "piange" pioggia.'],
    ['Sono in mezzo al mare ma non mi bagno mai. Che cosa sono?', 'La lettera "A"', 'Un\'isola', 'Un faro', 'Una barca', 'La parola "mare" ha la A in mezzo.'],
    ['Se hai 5 mele e ne dai via 2, quante mele hai?', '3 mele', '2 mele', '5 mele', '7 mele', 'Ne restano 5 - 2 = 3.'],
    ['In una stanza ci sono 4 angoli, in ogni angolo un gatto, davanti a ogni gatto altri 3 gatti. Quanti gatti ci sono?', '4 gatti', '12 gatti', '16 gatti', '8 gatti', 'Ogni gatto vede gli altri 3: i gatti totali restano 4.'],
    ['Quale mese ha 28 giorni?', 'Tutti i mesi', 'Solo febbraio', 'Febbraio e aprile', 'Nessuno', 'Tutti i mesi hanno almeno 28 giorni.'],
    ['Un contadino ha 17 pecore. Tutte tranne 9 scappano. Quante ne restano?', '9 pecore', '8 pecore', '17 pecore', '26 pecore', '"Tutte tranne 9" significa che ne restano proprio 9.'],
    ['Sono leggera come una piuma, ma nemmeno l\'uomo pi&ugrave; forte riesce a tenermi a lungo. Che cosa sono?', 'Il respiro', 'Una pietra', 'Una nuvola', 'Un\'idea', 'Nessuno riesce a trattenere il respiro a lungo.'],
    ['Un bambino nato il 29 febbraio: ogni quanti anni cade esattamente il giorno del suo compleanno?', 'Ogni 4 anni', 'Ogni anno', 'Ogni 2 anni', 'Ogni 10 anni', 'Il 29 febbraio esiste solo negli anni bisestili, uno ogni 4.'],
    ['Se un treno elettrico va verso nord, in che direzione va il fumo?', 'Non fa fumo: &egrave; elettrico', 'Verso sud', 'Verso nord', 'Verso l\'alto', 'Un treno elettrico non produce fumo.'],
    ['Sto sempre davanti a te ma non riesci mai a vedermi. Che cosa sono?', 'Il futuro', 'Lo specchio', 'L\'ombra', 'Il vento', 'Il futuro sta davanti ma non si vede.'],
    ['Ho la testa e la coda ma non ho il corpo. Che cosa sono?', 'Una moneta', 'Un serpente', 'Un aereo', 'Una cometa', 'La moneta ha testa e croce.'],
    ['Due papere davanti a due papere, due papere dietro a due papere, due papere in mezzo. Quante papere sono?', '4 papere', '6 papere', '8 papere', '2 papere', 'Bastano 4 papere in fila per soddisfare tutte le condizioni.'],
    ['Qual &egrave; l\'intruso: mela, pera, carota, banana?', 'Carota', 'Mela', 'Pera', 'Banana', 'La carota &egrave; una verdura, le altre sono frutta.'],
    ['Cosa diventa sempre pi&ugrave; bagnato mentre asciuga?', 'L\'asciugamano', 'Il sole', 'Il vento', 'La spugna del mare', 'Asciugando, l\'asciugamano si inzuppa.'],
    ['Se 3 gatti prendono 3 topi in 3 minuti, quanti gatti servono per prendere 100 topi in 100 minuti?', '3 gatti', '100 gatti', '33 gatti', '9 gatti', 'Ogni gatto prende un topo ogni 3 minuti: in 100 minuti 3 gatti ne prendono circa 100.'],
    ['Qual &egrave; il numero che, letto allo specchio, resta uguale a s&eacute; stesso fra questi?', '88', '69', '12', '45', '88 &egrave; simmetrico.'],
    ['Ha i denti ma non morde. Che cos\'&egrave;?', 'Un pettine', 'Un cane', 'Una sega elettrica', 'Un coccodrillo', 'Il pettine ha i denti ma non morde.']
  ];

  var rowsMedia2 = [
    ['Tre interruttori fuori da una stanza chiusa comandano 3 lampadine dentro. Puoi entrare una sola volta. Come capisci quale interruttore comanda quale lampadina?', 'Accendo il primo, aspetto, lo spengo, accendo il secondo ed entro: la lampadina calda &egrave; del primo', 'Accendo tutti e tre insieme', 'Entro e provo a caso', 'Non &egrave; possibile saperlo', 'Il calore della lampadina fa da "memoria" del primo interruttore.'],
    ['Un mattone pesa 1 kg pi&ugrave; mezzo mattone. Quanto pesa un mattone?', '2 kg', '1,5 kg', '1 kg', '3 kg', 'M = 1 + M/2, quindi M/2 = 1 e M = 2 kg.'],
    ['Una racchetta e una pallina costano 1,10 &euro; in totale. La racchetta costa 1 &euro; pi&ugrave; della pallina. Quanto costa la pallina?', '0,05 &euro;', '0,10 &euro;', '0,15 &euro;', '1,00 &euro;', 'Pallina 0,05 + racchetta 1,05 = 1,10 &euro;, con differenza di 1 &euro;.'],
    ['In uno stagno le ninfee raddoppiano ogni giorno e in 30 giorni lo coprono tutto. In quanti giorni ne coprono met&agrave;?', '29 giorni', '15 giorni', '20 giorni', '28 giorni', 'Se raddoppiano ogni giorno, il giorno prima erano met&agrave;.'],
    ['Hai una bilancia a due piatti e 9 monete: 8 identiche e 1 pi&ugrave; pesante. Quante pesate bastano per trovarla di sicuro?', '2 pesate', '3 pesate', '4 pesate', '1 pesata', 'Si dividono in 3 gruppi da 3: prima pesata trova il gruppo, seconda trova la moneta.'],
    ['Tutti i Bloop sono Razzie. Alcune Razzie sono Lazzie. Quale conclusione &egrave; certa?', 'Nessuna delle altre &egrave; certa', 'Tutti i Bloop sono Lazzie', 'Nessun Bloop &egrave; Lazzie', 'Tutte le Lazzie sono Bloop', 'Da "alcune" non si pu&ograve; dedurre nulla di certo sui Bloop.'],
    ['Un orologio batte 6 rintocchi in 5 secondi. Quanti secondi impiega per batterne 12?', '11 secondi', '10 secondi', '12 secondi', '6 secondi', 'Gli intervalli sono 5 per 6 rintocchi (1 sec ciascuno): per 12 rintocchi servono 11 intervalli.'],
    ['Qual &egrave; il prossimo numero: 1, 11, 21, 1211, 111221, ?', '312211', '1112221', '122111', '13112221', '&Egrave; la sequenza "look and say": si legge ad alta voce la riga precedente.'],
    ['Se ieri fosse domani, oggi sarebbe venerd&igrave;. Che giorno &egrave; oggi in realt&agrave;?', 'Domenica', 'Sabato', 'Luned&igrave;', 'Gioved&igrave;', 'Se ieri = domani fosse venerd&igrave;, oggi &egrave; due giorni prima: domenica.'],
    ['Un uomo guarda un ritratto e dice: "Non ho fratelli n&eacute; sorelle, ma il padre di quest\'uomo &egrave; il figlio di mio padre". Chi &egrave; nel ritratto?', 'Suo figlio', 'Lui stesso', 'Suo padre', 'Suo nipote', '"Il figlio di mio padre" &egrave; lui stesso: quindi &egrave; il padre dell\'uomo nel ritratto.'],
    ['Quanti quadrati (di ogni dimensione) ci sono in una scacchiera 3x3?', '14', '9', '10', '13', '9 quadrati 1x1 + 4 quadrati 2x2 + 1 quadrato 3x3 = 14.'],
    ['Hai 2 corde che bruciano ciascuna in 60 minuti, ma non in modo uniforme. Come misuri 45 minuti?', 'Accendo la prima da entrambi i lati e la seconda da un lato; quando la prima finisce (30 min) accendo l\'altro capo della seconda', 'Le taglio a met&agrave;', 'Accendo entrambe da un lato solo', 'Non &egrave; possibile', 'Prima corda da 2 lati = 30 min; poi la seconda, gi&agrave; a met&agrave;, accesa da 2 lati = altri 15 min.'],
    ['Un negozio vende un oggetto a 90 &euro; guadagnando il 50% sul costo. Quanto &egrave; costato al negozio?', '60 &euro;', '45 &euro;', '40 &euro;', '75 &euro;', 'Costo &times; 1,5 = 90, quindi costo = 60 &euro;.'],
    ['Qual &egrave; l\'intruso: triangolo, quadrato, cerchio, pentagono?', 'Cerchio', 'Triangolo', 'Quadrato', 'Pentagono', 'Il cerchio non ha lati n&eacute; vertici.'],
    ['Cinque macchine producono 5 pezzi in 5 minuti. Quanto impiegano 100 macchine a produrre 100 pezzi?', '5 minuti', '100 minuti', '20 minuti', '1 minuto', 'Ogni macchina impiega 5 minuti per un pezzo, quindi 100 macchine fanno 100 pezzi in 5 minuti.'],
    ['Quante volte compare la cifra 9 fra 1 e 100?', '20 volte', '10 volte', '19 volte', '11 volte', 'Dieci volte come unit&agrave; (9, 19, 29...), dieci volte come decina (90-99): in tutto 20.'],
    ['Se A &egrave; pi&ugrave; alto di B, e C &egrave; pi&ugrave; basso di B, chi &egrave; il pi&ugrave; alto?', 'A', 'B', 'C', 'Non si pu&ograve; sapere', 'A &gt; B &gt; C, quindi A &egrave; il pi&ugrave; alto.'],
    ['Quante volte al giorno le lancette di un orologio si sovrappongono?', '22 volte', '24 volte', '12 volte', '48 volte', 'Si sovrappongono 11 volte ogni 12 ore, quindi 22 in un giorno.'],
    ['Un secchio pieno d\'acqua pesa 10 kg, mezzo pieno ne pesa 6. Quanto pesa il secchio vuoto?', '2 kg', '3 kg', '4 kg', '5 kg', 'Mezza acqua pesa 4 kg, quindi l\'acqua piena pesa 8 kg e il secchio 2 kg.'],
    ['Qual &egrave; il numero successivo: 2, 6, 12, 20, 30, ?', '42', '40', '36', '44', 'Le differenze crescono di 2: +4, +6, +8, +10, +12.']
  ];

  var rowsAdulti = [
    ['Nel problema di Monty Hall (3 porte, 1 premio, il conduttore apre una porta vuota) conviene cambiare porta?', 'S&igrave;: cambiando si vince con probabilit&agrave; 2/3', 'No: &egrave; sempre 50 e 50', 'S&igrave;, ma la probabilit&agrave; diventa 3/4', 'No: cambiando si scende a 1/3', 'La porta iniziale resta 1/3, quindi l\'altra vale 2/3.'],
    ['Hai 12 monete, una sola &egrave; falsa (non sai se pi&ugrave; leggera o pi&ugrave; pesante). Quante pesate servono al minimo con una bilancia a bracci?', '3 pesate', '4 pesate', '2 pesate', '6 pesate', 'Con 3 pesate si distinguono fino a 27 casi: 12 monete x 2 possibilit&agrave; = 24, quindi bastano.'],
    ['In una stanza ci sono 23 persone. Qual &egrave; circa la probabilit&agrave; che due compiano gli anni lo stesso giorno?', 'Circa il 50%', 'Circa il 6%', 'Circa il 23%', 'Circa il 90%', '&Egrave; il "paradosso del compleanno": con 23 persone si supera il 50%.'],
    ['Un test &egrave; affidabile al 99% e la malattia colpisce 1 persona su 10.000. Se risulti positivo, qual &egrave; circa la probabilit&agrave; di essere malato?', 'Circa l\'1%', 'Circa il 99%', 'Circa il 50%', 'Circa il 90%', 'I falsi positivi (100 su 10.000) superano di molto il singolo vero positivo.'],
    ['Due treni distanti 200 km si avvicinano a 50 km/h ciascuno. Un\'ape vola avanti e indietro fra loro a 80 km/h. Quanti km percorre l\'ape prima dello scontro?', '160 km', '200 km', '100 km', '80 km', 'I treni si incontrano dopo 2 ore; l\'ape a 80 km/h percorre 160 km.'],
    ['Qual &egrave; il valore atteso del lancio di un dado a 6 facce?', '3,5', '3', '4', '3,25', '(1+2+3+4+5+6)/6 = 21/6 = 3,5.'],
    ['Hai 100 porte chiuse e passi 100 volte invertendo lo stato dei multipli del numero di passaggio. Quante porte restano aperte alla fine?', '10', '50', '25', '100', 'Restano aperte le porte con numero quadrato perfetto: 1, 4, 9... 100, cio&egrave; 10.'],
    ['Un prodotto aumenta del 25% e poi cala del 25%. Rispetto al prezzo iniziale ora costa:', 'Meno del prezzo iniziale (-6,25%)', 'Esattamente come prima', 'Di pi&ugrave; del prezzo iniziale', 'Il 25% in meno', '1,25 &times; 0,75 = 0,9375, cio&egrave; -6,25%.'],
    ['Tre persone pagano 30 &euro; per una stanza, l\'albergatore restituisce 5 &euro; ma il fattorino ne tiene 2. Dove finisce l\'euro mancante?', 'Non manca nulla: 27 pagati includono i 2 del fattorino', '&Egrave; un errore dell\'albergatore', 'Lo ha perso il fattorino', 'Manca davvero un euro', 'Il conto giusto &egrave; 25 + 2 = 27, non 27 + 2.'],
    ['Se una parola in codice usa uno spostamento di 3 lettere (cifrario di Cesare), come si scrive "CASA"?', 'FDVD (alfabeto inglese)', 'DBTB', 'ZXPX', 'CASA', 'Ogni lettera si sposta avanti di 3 posizioni.'],
    ['Qual &egrave; l\'errore logico in "se piove la strada &egrave; bagnata; la strada &egrave; bagnata, quindi piove"?', 'Affermazione del conseguente', 'Negazione della premessa', 'Sillogismo valido', 'Petizione di principio', 'La strada pu&ograve; essere bagnata per altri motivi.'],
    ['In un torneo a eliminazione diretta con 64 squadre, quante partite si giocano in totale?', '63', '64', '32', '127', 'Ogni partita elimina una squadra: servono 63 eliminazioni.'],
    ['Quanti modi ci sono di disporre in fila 5 libri diversi?', '120', '25', '60', '720', '5! = 5 x 4 x 3 x 2 x 1 = 120.'],
    ['Un\'urna ha 3 palline rosse e 2 nere. Ne peschi 2 senza rimettere. Qual &egrave; la probabilit&agrave; che siano entrambe rosse?', '3/10', '9/25', '1/2', '2/5', '(3/5) x (2/4) = 6/20 = 3/10.'],
    ['Qual &egrave; il numero successivo: 1, 2, 6, 24, 120, ?', '720', '600', '480', '840', 'Sono i fattoriali: il successivo &egrave; 6! = 720.'],
    ['Se tutti i corvi osservati sono neri, cosa permette di concludere il metodo scientifico?', 'Nulla di definitivo: l\'ipotesi resta falsificabile', 'Che tutti i corvi sono neri, con certezza', 'Che esistono corvi bianchi', 'Che i corvi non esistono', 'L\'induzione non d&agrave; certezza: basta un controesempio.'],
    ['Hai due clessidre da 7 e 11 minuti. Come misuri esattamente 15 minuti?', 'Avvio entrambe; a 7 giro la piccola; a 11 la grande finisce e giro subito la piccola che ha 4 min', 'Sommo 7 + 11 e tolgo 3', 'Uso solo quella da 11 e conto a mente', 'Non &egrave; possibile', 'La combinazione 11 + 4 d&agrave; esattamente 15 minuti.'],
    ['Quanti zeri finali ha il numero 100! (fattoriale di 100)?', '24', '20', '25', '10', 'Si contano i fattori 5: 20 + 4 = 24.'],
    ['Qual &egrave; la probabilit&agrave; che lanciando 2 dadi esca almeno un 6?', '11/36', '1/6', '1/3', '12/36 semplificato a 1/3', '1 - (5/6)&sup2; = 1 - 25/36 = 11/36.'],
    ['In logica, la negazione di "tutti gli studenti hanno superato l\'esame" &egrave;:', 'Almeno uno studente non ha superato l\'esame', 'Nessuno studente ha superato l\'esame', 'Tutti gli studenti hanno fallito', 'Alcuni studenti hanno superato l\'esame', 'La negazione di "per ogni" &egrave; "esiste almeno uno che non".']
  ];

  function makeFromRows(rows) {
    return rows.map(function (r) {
      return function () { return BT.fromRow(r, 'logic'); };
    });
  }

  BT.LOGIC = {
    elem5: makeFromRows(rowsElem5).concat([
      function () { return seqAritmetica(2, 5); },
      function () { return seqAritmetica(3, 9); },
      function () { return seqLettere(); }
    ]),
    media2: makeFromRows(rowsMedia2).concat([
      function () { return seqQuadrati(); },
      function () { return seqFibo(); },
      function () { return seqAlternata(); },
      function () { return seqLettere(); },
      function () { return eta(); }
    ]),
    adulti: makeFromRows(rowsAdulti).concat([
      function () { return seqFibo(); },
      function () { return seqAlternata(); },
      function () { return eta(); }
    ])
  };

})(window.BT);
