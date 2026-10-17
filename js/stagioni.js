/* =========================================================
   BRAIN TIME — il gioco si veste secondo il calendario

   Richiesta: stagioni, feste, fine della scuola, compleanno.

   Questo file e' SOLO date: non tocca il DOM, non legge il
   profilo, non dipende da niente. Cosi' si puo' provare a
   tavolino su cent'anni di calendario, che e' esattamente quello
   che serve - un errore qui si vede una volta l'anno, per un
   giorno, e nessuno capisce perche'.

   ⚠️ I periodi si sovrappongono APPOSTA: Halloween sta dentro
   l'autunno, Natale dentro l'inverno, il Carnevale dentro
   l'inverno, Pasqua dentro la primavera. Non e' un errore da
   sistemare, e' il motivo per cui serve una PRIORITA':

       compleanno  >  festa  >  stagione

   Il compleanno vince su tutto, anche su Natale: e' l'unico
   giorno che parla di te e non del calendario.
   ========================================================= */
(function (BT) {
  'use strict';

  /* ---------------------------------------------------------
     PASQUA — algoritmo di Meeus/Jones/Butcher (calendario
     gregoriano). Serve per forza: da Pasqua dipendono sia la
     settimana di Pasqua sia il Carnevale, che non sono a data
     fissa. Scriverle fisse vuol dire averle sbagliate quasi
     tutti gli anni.
     --------------------------------------------------------- */
  function pasqua(anno) {
    var a = anno % 19,
        b = Math.floor(anno / 100),
        c = anno % 100,
        d = Math.floor(b / 4),
        e = b % 4,
        f = Math.floor((b + 8) / 25),
        g = Math.floor((b - f + 1) / 3),
        h = (19 * a + b - d - g + 15) % 30,
        i = Math.floor(c / 4),
        k = c % 4,
        l = (32 + 2 * e + 2 * i - h - k) % 7,
        m = Math.floor((a + 11 * h + 22 * l) / 451),
        giorni = h + l - 7 * m + 114;
    return new Date(anno, Math.floor(giorni / 31) - 1, (giorni % 31) + 1);
  }

  /* il secondo venerdi' di giugno: la fine della scuola */
  function secondoVenerdiDiGiugno(anno) {
    var primo = new Date(anno, 5, 1);
    /* 5 = venerdi'. Dal 1 giugno si va avanti fino al primo
       venerdi', poi una settimana ancora. */
    var g = 1 + ((5 - primo.getDay() + 7) % 7) + 7;
    return new Date(anno, 5, g);
  }

  /* --- confronti fatti su "mese e giorno", l'anno non conta ---
     Un periodo come l'inverno (1 dic → fine feb) scavalca il
     capodanno: in quel caso l'inizio e' piu' grande della fine e
     il dentro() si gira al contrario. */
  function md(mese, giorno) { return mese * 100 + giorno; }
  function mdDi(data) { return md(data.getMonth() + 1, data.getDate()); }

  function dentro(data, daM, daG, aM, aG) {
    var x = mdDi(data), da = md(daM, daG), a = md(aM, aG);
    return (da <= a) ? (x >= da && x <= a) : (x >= da || x <= a);
  }

  /* ---------------------------------------------------------
     LE VESTI. L'ordine dell'elenco E' la priorita': si prende la
     prima che risponde di si'. Le feste stanno prima delle
     stagioni, se no Halloween non si vedrebbe mai.
     --------------------------------------------------------- */
  var VESTI = [
    /* --- feste --- */
    /* 'coda' = fin dove arriva la parte dell'anno DOPO: serve a dare un
       nome all'occorrenza (il 3 gennaio sta ancora nel Natale del 2026,
       se no la domanda "la vuoi?" si rifarebbe il 1 gennaio). */
    { id: 'natale', nome: 'Natale', ico: '🎄', tipo: 'festa', coda: 1,
      quando: 'dal 20 dicembre al 6 gennaio',
      vale: function (d) { return dentro(d, 12, 20, 1, 6); } },

    { id: 'halloween', nome: 'Halloween', ico: '🎃', tipo: 'festa',
      quando: 'dal 20 ottobre al 1 novembre',
      vale: function (d) { return dentro(d, 10, 20, 11, 1); } },

    /* Il Carnevale si muove con la Pasqua: giovedi' grasso cade 52
       giorni prima, martedi' grasso 47. Nel 2026 e' a meta'
       febbraio, nel 2027 a inizio: nessuna data fissa li prende
       tutti e due. */
    { id: 'carnevale', nome: 'Carnevale', ico: '🎭', tipo: 'festa',
      quando: 'dal giovedi\' al martedi\' grasso',
      vale: function (d) {
        var p = pasqua(d.getFullYear());
        return fraGiorni(d, somma(p, -52), somma(p, -47));
      } },

    /* "La settimana di Pasqua": dalla Domenica delle Palme al
       Lunedi' dell'Angelo. Presa cosi' perche' e' la settimana che
       un ragazzo vive davvero - quella di vacanza. */
    { id: 'pasqua', nome: 'Pasqua', ico: '🐣', tipo: 'festa',
      quando: 'dalle Palme a Pasquetta',
      vale: function (d) {
        var p = pasqua(d.getFullYear());
        return fraGiorni(d, somma(p, -7), somma(p, 1));
      } },

    { id: 'primomaggio', nome: 'Festa dei lavoratori', ico: '🛠️', tipo: 'festa',
      quando: 'il 1 maggio',
      vale: function (d) { return mdDi(d) === md(5, 1); } },

    { id: 'duegiugno', nome: 'Festa della Repubblica', ico: '🇮🇹', tipo: 'festa',
      quando: 'il 2 giugno',
      vale: function (d) { return mdDi(d) === md(6, 2); } },

    { id: 'finescuola', nome: 'Fine della scuola', ico: '🎒', tipo: 'festa',
      quando: 'il secondo venerdi\' di giugno',
      vale: function (d) { return stessoGiorno(d, secondoVenerdiDiGiugno(d.getFullYear())); } },

    /* --- stagioni --- */
    { id: 'autunno', nome: 'Autunno', ico: '🍂', tipo: 'stagione',
      quando: 'dal 1 ottobre al 30 novembre',
      vale: function (d) { return dentro(d, 10, 1, 11, 30); } },

    /* Fine febbraio, non "28": negli anni bisestili il 29 esiste e
       resterebbe scoperto. Il confronto e' su mese+giorno, quindi
       mettere 29 non rompe niente negli anni normali - quel
       giorno semplicemente non arriva mai. */
    { id: 'inverno', nome: 'Inverno', ico: '❄️', tipo: 'stagione', coda: 2,
      quando: 'dal 1 dicembre a fine febbraio',
      vale: function (d) { return dentro(d, 12, 1, 2, 29); } },

    { id: 'primavera', nome: 'Primavera', ico: '🌸', tipo: 'stagione',
      /* Chiesto "dal 1 marzo al 30 maggio", ma l'estate comincia il 1
         giugno: cosi' il 31 maggio restava senza niente, un giorno solo
         in tutto l'anno. E' una svista, non una scelta - la primavera
         arriva a fine mese. */
      quando: 'dal 1 marzo al 31 maggio',
      vale: function (d) { return dentro(d, 3, 1, 5, 31); } },

    { id: 'estate', nome: 'Estate', ico: '🌞', tipo: 'stagione',
      quando: 'dal 1 giugno al 31 agosto',
      vale: function (d) { return dentro(d, 6, 1, 8, 31); } }
  ];

  /* il compleanno non sta nell'elenco: non e' un periodo del
     calendario, dipende da chi sta giocando */
  var COMPLEANNO = { id: 'compleanno', nome: 'Buon compleanno!', ico: '🎂',
                     tipo: 'compleanno', quando: 'il giorno del tuo compleanno' };

  function bisestile(a) { return (a % 4 === 0 && a % 100 !== 0) || a % 400 === 0; }

  function somma(data, giorni) {
    var d = new Date(data.getTime());
    d.setDate(d.getDate() + giorni);
    return d;
  }
  function stessoGiorno(a, b) {
    return a.getFullYear() === b.getFullYear() &&
           a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  }
  /* fra due date vere (con anno), estremi compresi */
  function fraGiorni(d, da, a) {
    var x = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
    return x >= new Date(da.getFullYear(), da.getMonth(), da.getDate()).getTime() &&
           x <= new Date(a.getFullYear(), a.getMonth(), a.getDate()).getTime();
  }

  BT.stagioni = {

    /* 'MM-GG' -> compleanno. Senza anno di proposito: per fare gli
       auguri il giorno basta, e un anno di nascita e' un dato
       personale in piu' che non serve a niente. */
    leggiNato: function (s) {
      if (typeof s !== 'string') return null;
      var p = s.split('-');
      if (p.length !== 2) return null;
      var m = parseInt(p[0], 10), g = parseInt(p[1], 10);
      if (!(m >= 1 && m <= 12) || !(g >= 1 && g <= 31)) return null;
      return { m: m, g: g };
    },

    scriviNato: function (m, g) {
      return ('0' + m).slice(-2) + '-' + ('0' + g).slice(-2);
    },

    /* GG/MM, come lo scrive un italiano */
    inParole: function (s) {
      var n = BT.stagioni.leggiNato(s);
      return n ? ('0' + n.g).slice(-2) + '/' + ('0' + n.m).slice(-2) : '';
    },

    pasquaDi: function (anno) { return pasqua(anno); },
    fineScuolaDi: function (anno) { return secondoVenerdiDiGiugno(anno); },

    /* =======================================================
       Il nome di QUESTA volta: 'halloween-2026'.

       Serve per ricordare la risposta alla domanda "la vuoi?"
       senza inchiodarla per sempre: un no vale per la festa di
       quest'anno, e l'anno prossimo si richiede.

       Il campo 'coda' esiste per questo: il 3 gennaio sta ancora
       dentro il Natale del 2026, e senza quel conto la domanda si
       ripresenterebbe il 1 gennaio in mezzo alle vacanze.
       ======================================================= */
    occorrenza: function (veste, data) {
      var d = data || new Date();
      var anno = d.getFullYear();
      if (veste.coda && (d.getMonth() + 1) <= veste.coda) anno -= 1;
      return veste.id + '-' + anno;
    },

    tutte: function () { return VESTI.concat([COMPLEANNO]); },

    di: function (id) {
      var t = null;
      BT.stagioni.tutte().forEach(function (v) { if (v.id === id) t = v; });
      return t;
    },

    /* =======================================================
       Il cuore: che veste tocca a questa data.
       'nato' e' la stringa 'MM-GG' del giocatore, se ce l'ha.
       Risponde null quando non c'e' niente - a settembre, per
       esempio, dove il gioco resta come l'hanno disegnato.
       ======================================================= */
    attiva: function (data, nato) {
      var d = data || new Date();

      var n = BT.stagioni.leggiNato(nato);
      if (n) {
        var m = n.m, g = n.g;
        /* Nato il 29 febbraio: tre anni su quattro quel giorno non
           esiste e gli auguri non arriverebbero mai. Come fa chi e'
           nato allora, si festeggia il 28. */
        if (m === 2 && g === 29 && !bisestile(d.getFullYear())) g = 28;
        if ((d.getMonth() + 1) === m && d.getDate() === g) return COMPLEANNO;
      }

      for (var i = 0; i < VESTI.length; i++) {
        if (VESTI[i].vale(d)) return VESTI[i];
      }
      return null;
    }
  };

})(window.BT);

/* =========================================================
   LA PARTE CHE TOCCA LO SCHERMO

   Tenuta separata dal calcolo qui sopra apposta: le date si
   provano a tavolino, il vestito no. Sta nello stesso file, e non
   in app.js, per una ragione pratica: i markup sono due (locale e
   online) e le interfacce pure (app.js, app-online.js). Mettendolo
   li' sarebbero due copie, e prima o poi una delle due resterebbe
   indietro - e' gia' successo con altre cose.
   ========================================================= */
(function (BT) {
  'use strict';

  /* La scenografia (js/scena.js) ha preso il posto delle dieci emoji
     sparse ai bordi: un astro con l'alone, un orizzonte, e delle
     particelle che si muovono. Qui si chiama e basta - come sono
     fatte le scene sta tutto in quel file. */
  function chip(veste) {
    var vecchia = document.getElementById('skin-chip');
    if (vecchia) vecchia.remove();
    if (!veste) return;
    var hero = document.querySelector('.hero');
    if (!hero) return;
    var c = document.createElement('div');
    c.className = 'skin-chip';
    c.id = 'skin-chip';
    c.innerHTML = veste.ico + ' <b>' + veste.nome + '</b>';
    hero.appendChild(c);
  }

  BT.skin = {

    /* Quale veste tocca adesso, tenendo conto dell'interruttore
       nelle Impostazioni. Risponde null quando il gioco deve
       restare come l'hanno disegnato. */
    adesso: function (p, quando) {
      var s = (BT.store && BT.store.settings) ? BT.store.settings() : {};
      if (s.skin === false) return null;

      /* 1. La veste scelta a mano nel Negozio vince su tutto. Chi l'ha
            comprata l'ha comprata per metterla quando vuole: se poi il
            calendario gliela cambiasse, i soldi li avrebbe buttati. */
      if (p && p.veste) {
        var mia = BT.stagioni.di(p.veste);
        if (mia) return mia;
      }

      /* 2. Il calendario, se il giocatore non ha gia' detto di no a
            questa festa. Il no vale per l'occorrenza, non per sempre. */
      var d = quando || new Date();
      var v = BT.stagioni.attiva(d, p && p.nato);
      if (!v) return null;
      if (p && p.skinRisposte &&
          p.skinRisposte[BT.stagioni.occorrenza(v, d)] === false) return null;
      return v;
    },

    /* =======================================================
       La domanda da fare: "e' arrivato Halloween, lo vuoi?"

       Risponde null quando non c'e' niente da chiedere. Non si
       chiede mai:
       - se ha scelto una veste a mano (ha gia' deciso lui);
       - per il COMPLEANNO: gli auguri non si chiedono, si fanno.
       ======================================================= */
    daChiedere: function (p, quando) {
      if (!p) return null;
      var s = (BT.store && BT.store.settings) ? BT.store.settings() : {};
      if (s.skin === false || p.veste) return null;

      var d = quando || new Date();
      var v = BT.stagioni.attiva(d, p.nato);
      if (!v || v.id === 'compleanno') return null;

      var k = BT.stagioni.occorrenza(v, d);
      if (p.skinRisposte && p.skinRisposte[k] !== undefined) return null;
      return { veste: v, chiave: k };
    },

    /* La risposta vive nel PROFILO, non nel DOM: online ogni
       salvataggio ripubblica la pagina e il DOM sparisce. Stessa
       regola delle casse e dei traguardi. */
    rispondi: function (p, chiave, si) {
      if (!p || !chiave) return;
      BT.store.normalizza(p);
      p.skinRisposte[chiave] = !!si;

      /* Pulizia: una risposta per festa all'anno fa una dozzina di
         voci l'anno, e non servono quelle di tre Natali fa. Si tiene
         l'anno in corso e quello prima. */
      var limite = (new Date()).getFullYear() - 1;
      Object.keys(p.skinRisposte).forEach(function (k) {
        var anno = parseInt(k.split('-').pop(), 10);
        if (anno && anno < limite) delete p.skinRisposte[k];
      });
      BT.store.save();
    },

    /* ⚠️ Nel foglio di stile il blocco data-skin sta DOPO quello
       dei temi, e la specificita' e' la stessa: vince l'ultimo
       scritto, cioe' la veste. E' voluto - una festa dura pochi
       giorni e poi il tema comprato torna da solo - ma vuol dire
       che spostando quel blocco piu' in su le vesti smetterebbero
       di vedersi senza che nessun errore lo dica. */
    applica: function (p, quando) {
      var v = BT.skin.adesso(p, quando);
      if (v) document.body.dataset.skin = v.id;
      else delete document.body.dataset.skin;
      if (BT.scena) BT.scena.monta(v);
      chip(v);
      return v;
    }
  };

})(window.BT);

/* =========================================================
   LE VESTI AL NEGOZIO

   ⚠️ Qui c'e' una tensione da capire prima di toccare i prezzi.
   Il calendario le REGALA per la loro festa: a Halloween il gioco
   si veste da Halloween senza pagare niente. Allora che cosa si
   compra? **Il diritto di indossarla quando non e' la sua festa.**
   Halloween a giugno, il Natale a luglio.

   Se un domani sembrasse poco chiaro, la risposta non e' alzare i
   prezzi: e' scriverlo meglio nella nota del reparto. Far pagare
   una cosa che arriva gratis e non dirlo sarebbe una fregatura.

   Il compleanno NON si vende, e non e' una dimenticanza: non e' un
   costume, e' un augurio. Indossarlo un giorno a caso non vuol dire
   niente.

   Prezzi in scala coi temi (60-130): le quattro stagioni costano
   poco perche' durano mesi e le vedi comunque; le feste costano di
   piu' perche' durano pochi giorni.
   ========================================================= */
(function (BT) {
  'use strict';
  if (!BT.SBLOCCABILI) return;

  BT.SBLOCCABILI.veste = [
    { id: 'automatica', cost: 0, base: true, name: 'Automatica',
      desc: 'Segue il calendario: a ogni festa il gioco te la propone e decidi tu.',
      col1: '#31d8ff', col2: '#1b7fa8' },

    { id: 'autunno', cost: 60, name: 'Autunno 🍂',
      desc: 'Foglie e castagne. Arriva da sola il 1 ottobre.',
      col1: '#ff9a3d', col2: '#8f4408' },
    { id: 'inverno', cost: 60, name: 'Inverno ❄️',
      desc: 'Ghiaccio e neve. Arriva da sola il 1 dicembre.',
      col1: '#7fe3ff', col2: '#226d85' },
    { id: 'primavera', cost: 60, name: 'Primavera 🌸',
      desc: 'Fiori e prati. Arriva da sola il 1 marzo.',
      col1: '#ff8fd0', col2: '#9e2f74' },
    { id: 'estate', cost: 60, name: 'Estate 🌞',
      desc: 'Mare e sole. Arriva da sola il 1 giugno.',
      col1: '#2ee8d0', col2: '#096d62' },

    { id: 'primomaggio', cost: 70, name: 'Primo maggio 🛠️',
      desc: 'La festa dei lavoratori. Un giorno solo all\'anno.',
      col1: '#ff5a52', col2: '#8d1a15' },
    { id: 'duegiugno', cost: 70, name: 'Due giugno 🇮🇹',
      desc: 'Il tricolore della Repubblica. Un giorno solo all\'anno.',
      col1: '#5ce89a', col2: '#0c6b3d' },
    { id: 'finescuola', cost: 80, name: 'Fine della scuola 🎒',
      desc: 'Il secondo venerd&igrave; di giugno. Dura un giorno, ma che giorno.',
      col1: '#ffd93d', col2: '#8a6c00' },
    { id: 'carnevale', cost: 85, name: 'Carnevale 🎭',
      desc: 'Coriandoli e maschere. Sei giorni all\'anno, e cambiano ogni anno.',
      col1: '#ff4fd8', col2: '#8c1773' },
    { id: 'pasqua', cost: 85, name: 'Pasqua 🐣',
      desc: 'Pulcini e uova. Solo la settimana di Pasqua.',
      col1: '#ffd24d', col2: '#8a6500' },
    { id: 'halloween', cost: 90, name: 'Halloween 🎃',
      desc: 'Zucche e fantasmi. Dal 20 ottobre al 1 novembre.',
      col1: '#ff7a18', col2: '#7d3400' },
    { id: 'natale', cost: 110, name: 'Natale 🎄',
      desc: 'Rosso, verde e regali. Dal 20 dicembre al 6 gennaio.',
      col1: '#ff5a66', col2: '#8d1623' }
  ];

})(window.BT);
