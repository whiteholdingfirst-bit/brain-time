/* =========================================================
   BRAIN TIME — fusione di due copie dello stesso giocatore

   Serve quando la stessa persona gioca su due dispositivi, o
   gioca senza rete e poi si ricollega: a quel punto esistono
   due versioni del suo profilo e vanno rimesse insieme senza
   che nessuno perda niente.

   La fortuna di questo gioco e' che i suoi dati crescono e
   basta, quindi non serve decidere "chi ha ragione":

     punti, coppe, risposte  -> si SOMMANO le partite nuove
     record, sblocchi        -> si tiene il MIGLIORE / l'UNIONE
     tempi dei labirinti     -> si tiene il PIU' BASSO
     scoperte, avatar, temi  -> si uniscono gli insiemi

   Per sommare solo le partite nuove serve una base comune:
   l'ultima versione che i due dispositivi avevano in comune.
   Senza base si fa la scelta prudente (il massimo), che non
   perde niente ma puo' non contare due partite fatte in
   parallelo: e' il compromesso giusto con dei bambini, meglio
   qualche punto in meno che un profilo azzerato.
   ========================================================= */
(function (BT) {
  'use strict';

  function num(v) { return typeof v === 'number' && isFinite(v) ? v : 0; }

  /* unione di due liste, senza doppioni e mantenendo l'ordine */
  function unisci(a, b) {
    var visti = {}, out = [];
    [].concat(a || [], b || []).forEach(function (x) {
      var k = String(x);
      if (visti[k]) return;
      visti[k] = true;
      out.push(x);
    });
    return out;
  }

  /* somma le partite nuove di ciascun lato rispetto alla base comune */
  function sommaDaBase(a, b, base) {
    if (base === undefined || base === null) return Math.max(num(a), num(b));
    var cresciutoA = Math.max(0, num(a) - num(base));
    var cresciutoB = Math.max(0, num(b) - num(base));
    return num(base) + cresciutoA + cresciutoB;
  }

  /* i tempi dei labirinti: per ogni livello vince il piu' veloce */
  function fondiTempi(a, b) {
    var out = {}, k;
    a = a || {}; b = b || {};
    for (k in a) out[k] = a[k];
    for (k in b) out[k] = (out[k] === undefined) ? b[k] : Math.min(out[k], b[k]);
    return out;
  }

  /* le statistiche per materia: risposte e giuste si sommano */
  function fondiCat(a, b, base) {
    var out = {}, k;
    a = a || {}; b = b || {}; base = base || {};
    unisci(Object.keys(a), Object.keys(b)).forEach(function (cat) {
      var x = a[cat] || { a: 0, c: 0 }, y = b[cat] || { a: 0, c: 0 }, z = base[cat];
      out[cat] = {
        a: sommaDaBase(x.a, y.a, z && z.a),
        c: sommaDaBase(x.c, y.c, z && z.c)
      };
    });
    return out;
  }

  /* gli aiuti nello zaino: si tiene il piu' alto, non la somma.
     Sommare regalerebbe aiuti a chi apre il gioco su due schermi. */
  function fondiInventario(a, b) {
    var out = {}, k;
    a = a || {}; b = b || {};
    for (k in a) out[k] = num(a[k]);
    for (k in b) out[k] = Math.max(num(out[k]), num(b[k]));
    return out;
  }

  /* --- la fusione vera e propria ---
     a e b sono due versioni dello stesso profilo (stesso id);
     base e' la versione che avevano in comune, se la conosciamo. */
  BT.fondi = function (a, b, base) {
    if (!a) return b;
    if (!b) return a;
    base = base || null;

    /* i dati anagrafici li tiene chi e' stato aggiornato per ultimo:
       se uno si e' cambiato nome o avatar, quella e' una scelta, non
       un progresso, e non ha senso "sommarla" */
    var recente = num(b.aggiornatoIl) >= num(a.aggiornatoIl) ? b : a;

    var out = {
      id: a.id,
      name: recente.name,
      avatar: recente.avatar,
      eta: recente.eta || a.eta || b.eta,
      level: recente.level || a.level,
      titolo: recente.titolo !== undefined ? recente.titolo : a.titolo,
      tema: recente.tema || a.tema,
      aggiornatoIl: Math.max(num(a.aggiornatoIl), num(b.aggiornatoIl)),

      /* progressi: si sommano le partite nuove dei due lati */
      xp:       sommaDaBase(a.xp, b.xp, base && base.xp),
      coins:    sommaDaBase(a.coins, b.coins, base && base.coins),
      answered: sommaDaBase(a.answered, b.answered, base && base.answered),
      correct:  sommaDaBase(a.correct, b.correct, base && base.correct),
      duelsPlayed: sommaDaBase(a.duelsPlayed, b.duelsPlayed, base && base.duelsPlayed),
      duelsWon:    sommaDaBase(a.duelsWon, b.duelsWon, base && base.duelsWon),

      /* record: vince il migliore, non la somma */
      bestRun:    Math.max(num(a.bestRun), num(b.bestRun)),
      bestStreak: Math.max(num(a.bestStreak), num(b.bestStreak)),

      inventory: fondiInventario(a.inventory, b.inventory),
      sbloccati: {
        avatar: unisci(a.sbloccati && a.sbloccati.avatar, b.sbloccati && b.sbloccati.avatar),
        titolo: unisci(a.sbloccati && a.sbloccati.titolo, b.sbloccati && b.sbloccati.titolo),
        tema:   unisci(a.sbloccati && a.sbloccati.tema,   b.sbloccati && b.sbloccati.tema)
      },
      scoperte: unisci(a.scoperte, b.scoperte),
      byCat: fondiCat(a.byCat, b.byCat, base && base.byCat),

      casse: {
        pronte: sommaDaBase(a.casse && a.casse.pronte, b.casse && b.casse.pronte,
                            base && base.casse && base.casse.pronte),
        aperte: sommaDaBase(a.casse && a.casse.aperte, b.casse && b.casse.aperte,
                            base && base.casse && base.casse.aperte),
        /* il moltiplicatore e' uno stato, non un progresso: si tiene il piu' alto */
        moltiplicatore: Math.max(1, num(a.casse && a.casse.moltiplicatore),
                                    num(b.casse && b.casse.moltiplicatore))
      },

      labirinto: {
        livello:    Math.max(1, num(a.labirinto && a.labirinto.livello),
                                num(b.labirinto && b.labirinto.livello)),
        completati: Math.max(num(a.labirinto && a.labirinto.completati),
                             num(b.labirinto && b.labirinto.completati)),
        tempi: fondiTempi(a.labirinto && a.labirinto.tempi, b.labirinto && b.labirinto.tempi)
      },

      /* il limite di tempo: vince il piu' severo dei due, se no si
         aggira giocando mezz'ora sul tablet e mezz'ora sul computer */
      tempo: {
        usato: Math.max(num(a.tempo && a.tempo.usato), num(b.tempo && b.tempo.usato)),
        ultimo: Math.max(num(a.tempo && a.tempo.ultimo), num(b.tempo && b.tempo.ultimo)),
        bloccatoFino: Math.max(num(a.tempo && a.tempo.bloccatoFino),
                               num(b.tempo && b.tempo.bloccatoFino))
      }
    };

    return out;
  };

  /* fonde due elenchi interi di giocatori */
  BT.fondiTutti = function (elencoA, elencoB, elencoBase) {
    var perId = {}, basePerId = {}, out = [];
    (elencoBase || []).forEach(function (p) { basePerId[p.id] = p; });
    (elencoA || []).forEach(function (p) { perId[p.id] = p; out.push(p.id); });
    (elencoB || []).forEach(function (p) {
      if (perId[p.id]) perId[p.id] = BT.fondi(perId[p.id], p, basePerId[p.id]);
      else { perId[p.id] = p; out.push(p.id); }
    });
    return out.map(function (id) { return perId[id]; });
  };

})(window.BT);
