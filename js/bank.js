/* =========================================================
   BRAIN TIME — banca domande
   Unisce le sei categorie e pesca la domanda giusta
   per il livello del giocatore, evitando ripetizioni.
   ========================================================= */
(function (BT) {
  'use strict';

  BT.CATS = [
    { id: 'math',    ico: '🔢', name: 'Matematica', sub: 'Calcolo e problemi' },
    { id: 'chess',   ico: '♟️', name: 'Scacchi',    sub: 'Tattica e strategia' },
    { id: 'logic',   ico: '🧩', name: 'Logica',     sub: 'Enigmi e sequenze' },
    { id: 'lang',    ico: '🌍', name: 'Lingue',     sub: '5 lingue straniere' },
    { id: 'history', ico: '🏛️', name: 'Storia',     sub: 'Dalla preistoria a oggi' },
    { id: 'culture', ico: '💡', name: 'Cultura generale', sub: 'Un po&rsquo; di tutto' }
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

    /* pesca una domanda:
       cats  : array di categorie ammesse (es. ['math'] oppure tutte)
       level : elem5 | media2 | adulti (livello del giocatore)
       used  : oggetto usato come memoria delle domande gia' uscite
       salto : -1 facile, 0 medio, +1 difficile (sposta la banca di un gradino) */
    draw: function (cats, level, used, salto) {
      used = used || {};
      level = BT.livelloDi(level, salto);
      var tentativi = 0, cat, idx, key;

      while (tentativi < 60) {
        tentativi++;
        cat = BT.pick(cats);
        var p = pool(cat, level);
        if (!p.length) continue;
        idx = BT.rnd(0, p.length - 1);
        key = cat + ':' + idx;
        // la matematica e' generata al volo: puo' ripetere lo schema con numeri nuovi
        if (used[key] && cat !== 'math') continue;
        used[key] = true;
        var q = p[idx]();
        q.cat = q.cat || cat;
        q.key = key;
        return q;
      }

      // ripiego: se tutte le domande sono gia' uscite, ricomincia
      cat = BT.pick(cats);
      var pp = pool(cat, level);
      if (!pp.length) { cat = 'math'; pp = pool('math', level); }
      idx = BT.rnd(0, pp.length - 1);
      var q2 = pp[idx]();
      q2.cat = q2.cat || cat;
      q2.key = cat + ':' + idx;
      return q2;
    }
  };

})(window.BT);
