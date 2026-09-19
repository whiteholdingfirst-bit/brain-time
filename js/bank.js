/* =========================================================
   BRAIN TIME — banca domande
   Unisce le sei categorie e pesca la domanda giusta
   per il livello del giocatore, evitando ripetizioni.
   ========================================================= */
(function (BT) {
  'use strict';

  /* L'icona di una materia non e' piu' un'emoji ma un disegno. E'
     una stringa di markup, esattamente come prima lo era il carattere
     emoji: tutti i posti che facevano `ico + ' ' + nome` continuano a
     funzionare senza sapere che cosa e' cambiato.
     L'SVG prende misura dal testo che lo ospita (1em, vedi .ic nel
     CSS) e colore da chi lo contiene, quindi segue il tema da solo. */
  function ico(id) { return '<svg class="ic"><use href="#i-' + id + '"/></svg>'; }
  BT.icona = ico;

  BT.CATS = [
    { id: 'math',    ico: ico('numeri'),    name: 'Matematica', sub: 'Calcolo e problemi' },
    { id: 'chess',   ico: ico('scacchi'),   name: 'Scacchi',    sub: 'Tattica e strategia' },
    { id: 'logic',   ico: ico('logica'),    name: 'Logica',     sub: 'Enigmi e sequenze' },
    { id: 'lang',    ico: ico('globo'),     name: 'Lingue',     sub: '5 lingue straniere' },
    { id: 'history', ico: ico('colonna'),   name: 'Storia',     sub: 'Dalla preistoria a oggi' },
    { id: 'culture', ico: ico('scintilla'), name: 'Cultura generale', sub: 'Un po&rsquo; di tutto' }
  ];

  BT.catInfo = function (id) {
    for (var i = 0; i < BT.CATS.length; i++) if (BT.CATS[i].id === id) return BT.CATS[i];
    return { id: id, ico: '❓', name: id, sub: '' };
  };

  function pool(cat, level) {
    var src = { math: BT.MATH, chess: BT.CHESS, logic: BT.LOGIC, lang: BT.LANG,
                history: BT.HISTORY, culture: BT.CULTURE }[cat];
    if (!src) return [];
    return src[level] || src.media2 || [];
  }

  BT.bank = {
    /* quante domande diverse esistono per categoria/livello */
    size: function (cat, level) { return pool(cat, level).length; },

    /* Pesca una domanda.
         cats    : categorie ammesse (['math'] oppure tutte)
         level   : elem5 | media2 | adulti
         used    : domande gia' uscite in QUESTA partita
         salto   : -1 facile, 0 medio, +1 difficile (sposta la banca)
         recenti : domande viste nelle partite PRECEDENTI di questo
                   giocatore, con quanto tempo fa (0 = la piu' lontana)

       Il vecchio pescaggio tirava a caso e riprovava se usciva un doppione,
       ma ricordava solo la partita in corso: finita quella si ripartiva da
       zero, e due partite di fila davano spesso le stesse domande. Adesso
       ogni domanda ha un voto e si pesca fra quelle col voto migliore, cosi'
       un doppione non e' improbabile: e' impossibile finche' la banca non si
       esaurisce, e quando si esaurisce torna prima la piu' vecchia. */
    draw: function (cats, level, used, salto, recenti) {
      used = used || {};
      recenti = recenti || {};
      level = BT.livelloDi(level, salto);

      /* Voto di una domanda, piu' basso = da servire prima:
           -1   mai vista, oppure matematica (si rigenera con numeri nuovi
                ogni volta, quindi una domanda di matematica non invecchia)
            n   gia' vista, e n dice quanto tempo fa
         null   gia' uscita in questa partita: non si ripesca. */
      function voto(k, cat) {
        if (used[k]) return null;
        if (cat === 'math' || recenti[k] === undefined) return -1;
        return recenti[k];
      }

      /* Si sceglie prima la CATEGORIA e poi la domanda, non il contrario:
         pescando fra tutte le domande insieme, le materie con la banca piu'
         grande uscirebbero molto piu' spesso e il quiz misto non sarebbe
         piu' misto. Fra le categorie entrano solo quelle che hanno da
         offrire qualcosa di altrettanto buono. */
      var meglio = null, catsOk = [], liberiPer = {};
      for (var c = 0; c < cats.length; c++) {
        var cat = cats[c], p = pool(cat, level);
        for (var i = 0; i < p.length; i++) {
          var v = voto(cat + ':' + level + ':' + i, cat);
          if (v === null) continue;
          if (meglio === null || v < meglio) { meglio = v; catsOk = []; liberiPer = {}; }
          if (v > meglio) continue;
          if (!liberiPer[cat]) { liberiPer[cat] = []; catsOk.push(cat); }
          liberiPer[cat].push(i);
        }
      }

      var s = null;
      if (catsOk.length) {
        var scelta = BT.pick(catsOk);
        s = { cat: scelta, idx: BT.pick(liberiPer[scelta]) };
      } else {
        /* tutta la banca e' gia' uscita in questa partita: si ricomincia */
        var cat2 = BT.pick(cats);
        if (!pool(cat2, level).length) cat2 = 'math';
        s = { cat: cat2, idx: BT.rnd(0, Math.max(0, pool(cat2, level).length - 1)) };
      }

      /* il livello fa parte della chiave: cambiando difficolta' cambia la
         banca, e 'chess:3' di quinta non e' 'chess:3' di seconda media */
      var key = s.cat + ':' + level + ':' + s.idx;
      used[key] = true;

      var q = pool(s.cat, level)[s.idx]();
      q.cat = q.cat || s.cat;
      q.key = key;
      return q;
    },

    /* Quante domande diverse ci sono in tutto, per queste categorie e questo
       livello. Serve a dimensionare la memoria lunga: ricordarne piu' di
       quante ne esistano bloccherebbe tutto. */
    quante: function (cats, level) {
      var n = 0;
      for (var i = 0; i < cats.length; i++) n += pool(cats[i], level).length;
      return n;
    }
  };

})(window.BT);
