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
    { id: 'natale', nome: 'Natale', ico: '🎄', tipo: 'festa',
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
    { id: 'inverno', nome: 'Inverno', ico: '❄️', tipo: 'stagione',
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

  /* Emoji, come gli avatar e per le stesse ragioni: si vedono
     ovunque, non pesano niente, non hanno padroni. */
  var ADDOBBI = {
    autunno:     ['🍂', '🍁', '🌰', '🍄', '🦔'],
    halloween:   ['🎃', '👻', '🕸️', '🦇', '🕷️'],
    inverno:     ['❄️', '⛄', '🧣', '🌨️', '🧊'],
    natale:      ['🎄', '🎁', '⭐', '🔔', '🦌'],
    carnevale:   ['🎭', '🎊', '🎉', '🤡', '🪅'],
    pasqua:      ['🐣', '🥚', '🐇', '🌷', '🍫'],
    primomaggio: ['🛠️', '🌹', '🎶', '👷', '⚙️'],
    duegiugno:   ['🇮🇹', '🎺', '✈️', '🏛️', '🎖️'],
    finescuola:  ['🎒', '📚', '🎉', '✏️', '🏖️'],
    estate:      ['🌞', '🏖️', '🍉', '🩴', '🐚'],
    compleanno:  ['🎂', '🎈', '🎁', '🎉', '🕯️']
  };

  /* Posizioni FISSE, non a caso: 'applica' gira a ogni cambio di
     giocatore e di tema, e degli addobbi che saltano da una parte
     all'altra a ogni passaggio sembrano un difetto. In percentuale,
     cosi' valgono su qualunque schermo; stanno ai bordi perche' in
     mezzo ci vanno le carte. [sinistra%, alto%, dimensione in rem] */
  var POSTI = [
    [3, 8, 2.1], [91, 14, 2.6], [7, 34, 1.7], [88, 44, 2.0],
    [2, 62, 2.4], [93, 70, 1.8], [12, 88, 2.2], [82, 92, 2.5],
    [48, 4, 1.6], [25, 96, 1.9]
  ];

  function addobba(veste) {
    var vecchio = document.getElementById('bg-skin');
    if (vecchio) vecchio.remove();
    if (!veste) return;
    var lista = ADDOBBI[veste.id];
    if (!lista || !lista.length) return;

    var box = document.createElement('div');
    box.className = 'bg-skin';
    box.id = 'bg-skin';
    box.setAttribute('aria-hidden', 'true');
    POSTI.forEach(function (p, i) {
      var s = document.createElement('span');
      s.textContent = lista[i % lista.length];
      s.style.left = p[0] + '%';
      s.style.top = p[1] + '%';
      s.style.fontSize = p[2] + 'rem';
      /* molto smorzati: devono farsi notare senza mettersi davanti
         alle domande, che sono il motivo per cui uno e' qui */
      s.style.opacity = (i % 2 ? 0.13 : 0.18);
      box.appendChild(s);
    });
    /* in fondo al body: lo sfondo sta a z-index 0 come .bg-books */
    document.body.appendChild(box);
  }

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
      return BT.stagioni.attiva(quando || new Date(), p && p.nato);
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
      addobba(v);
      chip(v);
      return v;
    }
  };

})(window.BT);
