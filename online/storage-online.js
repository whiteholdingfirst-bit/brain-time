/* =========================================================
   BRAIN TIME ONLINE — stato condiviso
   Sostituisce BT.store: i giocatori, i punteggi e le sfide
   vivono nella pagina pubblicata e sono uguali per tutti.
   Restano locali al dispositivo solo le preferenze
   (numero di domande, suoni) e "chi sono io".
   ========================================================= */
(function (BT) {
  'use strict';

  var CHIAVE_IO = 'brain-time-io';
  var CHIAVE_PREF = 'brain-time-pref';

  var S = { v: 1, players: [], sfide: [] };   // stato condiviso
  var pref = { diff: 'medio', sound: true, lingua: 'en' };
  var ioId = null;

  function leggiLocale(chiave, def) {
    try {
      var raw = localStorage.getItem(chiave);
      return raw ? JSON.parse(raw) : def;
    } catch (e) { return def; }
  }
  function scriviLocale(chiave, val) {
    try { localStorage.setItem(chiave, JSON.stringify(val)); } catch (e) {}
  }

  /* pubblicazione: viene richiamata dopo ogni modifica dello stato condiviso */
  var avvisa = function () {};
  function pubblica() {
    BT.online.salva(S, function (ok, motivo) { avvisa(ok, motivo); });
  }

  BT.storeOnline = {
    init: function (statoIniziale, callbackAvviso) {
      if (statoIniziale && Array.isArray(statoIniziale.players)) S = statoIniziale;
      if (!S.sfide) S.sfide = [];
      pref = leggiLocale(CHIAVE_PREF, pref) || pref;
      if (pref.sound === undefined) pref.sound = true;
      if (!pref.diff) pref.diff = 'medio';
      if (pref.musica === undefined) pref.musica = true;
      ioId = leggiLocale(CHIAVE_IO, null);
      avvisa = callbackAvviso || avvisa;
      return S;
    },
    stato: function () { return S; },
    io: function () { return ioId ? BT.store.get(ioId) : null; },
    setIo: function (id) { ioId = id; scriviLocale(CHIAVE_IO, id); },
    pubblica: pubblica
  };

  /* ---------------- API compatibile con il gioco locale ---------------- */
  BT.store = {
    load: function () { return S; },
    save: function () { pubblica(); },
    canSave: function () { return BT.online.attiva(); },

    all: function () { return S.players; },
    settings: function () { return pref; },
    salvaPref: function () { scriviLocale(CHIAVE_PREF, pref); },

    get: function (id) {
      for (var i = 0; i < S.players.length; i++) if (S.players[i].id === id) return S.players[i];
      return null;
    },

    create: function (name, avatar, anni) {
      var eta = parseInt(anni, 10) || 10;
      var p = {
        id: 'p' + (S.players.length + 1) + '-' + name.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 8),
        name: name, avatar: avatar,
        eta: eta,
        level: BT.livelloDaEta(eta),
        xp: 0, coins: 30, answered: 0, correct: 0,
        bestRun: 0, bestStreak: 0, duelsWon: 0, duelsPlayed: 0,
        inventory: {},
        sbloccati: { avatar: [], titolo: [], tema: [] },
        titolo: null,
        tema: 'azzurro',
        casse: { pronte: 0, moltiplicatore: 1, aperte: 0 },
        tempo: { usato: 0, ultimo: 0, bloccatoFino: 0 },
        scoperte: [],
        labirinto: { livello: 1, completati: 0, tempi: {} },
        byCat: {}
      };
      // evita id doppi
      var n = 2, base = p.id;
      while (BT.store.get(p.id)) { p.id = base + '-' + n; n++; }
      S.players.push(p);
      pubblica();
      return p;
    },

    /* Cambia i dati anagrafici di un giocatore che esiste gia'.
       I bambini crescono: l'eta' deve poter cambiare, e con lei il livello
       delle domande. Punti, coppe, sblocchi e statistiche non si toccano. */
    modifica: function (p, dati) {
      if (!p || !dati) return p;
      if (dati.name) p.name = dati.name;
      if (dati.avatar) p.avatar = dati.avatar;
      if (dati.eta) {
        p.eta = parseInt(dati.eta, 10) || p.eta;
        p.level = BT.livelloDaEta(p.eta);
        delete p.classe;                  /* il vecchio campo non serve piu' */
      }
      /* lo legge BT.fondi per capire quale copia porta la scelta piu' recente */
      p.aggiornatoIl = Date.now();
      pubblica();
      return p;
    },

    remove: function (id) {
      S.players = S.players.filter(function (p) { return p.id !== id; });
      S.sfide = S.sfide.filter(function (s) { return s.daId !== id && s.aId !== id; });
      if (ioId === id) BT.storeOnline.setIo(null);
      pubblica();
    },

    setLast: function (id) { BT.storeOnline.setIo(id); },
    last: function () { return BT.storeOnline.io(); },

    recordRun: function (p, run) {
      var prima = BT.levelFromXp(p.xp);
      p.xp += run.score;
      p.answered += run.answered;
      p.correct += run.correct;
      p.coins += run.coins;
      if (run.score > p.bestRun) p.bestRun = run.score;
      if (run.bestStreak > p.bestStreak) p.bestStreak = run.bestStreak;
      for (var cat in run.byCat) {
        if (!p.byCat[cat]) p.byCat[cat] = { a: 0, c: 0 };
        p.byCat[cat].a += run.byCat[cat].a;
        p.byCat[cat].c += run.byCat[cat].c;
      }
      var dopo = BT.levelFromXp(p.xp);
      pubblica();
      return { levelUp: dopo > prima, from: prima, to: dopo };
    },

    recordDuel: function (p, won) {
      p.duelsPlayed++;
      if (won) { p.duelsWon++; p.coins += 10; }
      pubblica();
    },

    buy: function (p, powerId) {
      var pu = null;
      BT.POWERUPS.forEach(function (x) { if (x.id === powerId) pu = x; });
      if (!pu || p.coins < pu.cost) return false;
      if (!BT.aiutoSbloccato(p, pu)) return false;    // non ancora disponibile
      p.coins -= pu.cost;
      p.inventory[powerId] = (p.inventory[powerId] || 0) + 1;
      pubblica();
      return true;
    },

    consume: function (p, powerId) {
      if (!p.inventory[powerId]) return false;
      p.inventory[powerId]--;
      if (p.inventory[powerId] <= 0) delete p.inventory[powerId];
      pubblica();
      return true;
    },

    skillIndex: function (p) {
      if (p.answered < 5) return 0;
      var acc = p.correct / p.answered;
      var volume = Math.min(1, p.answered / 60);
      return Math.round(acc * 1000 * (0.65 + 0.35 * volume));
    },

    /* --- sbloccabili permanenti (identici alla versione locale) --- */
    normalizza: function (p) {
      if (!p.sbloccati) p.sbloccati = { avatar: [], titolo: [], tema: [] };
      ['avatar', 'titolo', 'tema'].forEach(function (k) {
        if (!Array.isArray(p.sbloccati[k])) p.sbloccati[k] = [];
      });
      if (p.titolo === undefined) p.titolo = null;
      if (!p.tema) p.tema = 'azzurro';
      if (!p.casse) p.casse = { pronte: 0, moltiplicatore: 1, aperte: 0 };
      if (!Array.isArray(p.scoperte)) p.scoperte = [];
      if (!p.labirinto) p.labirinto = { livello: 1, completati: 0, tempi: {} };
      if (!p.labirinto.tempi) p.labirinto.tempi = {};
      if (!p.tempo) p.tempo = { usato: 0, ultimo: 0, bloccatoFino: 0 };

      return p;
    },

    /* --- casse sorpresa --- */
    aggiungiCassa: function (p) {
      BT.store.normalizza(p);
      p.casse.pronte++;
      pubblica();
      return p.casse;
    },
    rimandaCassa: function (p) {
      BT.store.normalizza(p);
      p.casse.moltiplicatore = Math.min(BT.RARITA_MAX || 7, p.casse.moltiplicatore + 1);
      pubblica();
      return p.casse;
    },
    apriCassa: function (p) {
      BT.store.normalizza(p);
      if (p.casse.pronte <= 0) return null;
      p.casse.pronte--;
      p.casse.aperte++;
      var molt = p.casse.moltiplicatore;
      p.casse.moltiplicatore = 1;
      pubblica();
      return molt;
    },
    segnaScoperta: function (p, id) {
      BT.store.normalizza(p);
      if (p.scoperte.indexOf(id) < 0) p.scoperte.push(id);
      pubblica();
    },

    /* --- labirinti --- */
    /* punti e coppe senza toccare le statistiche delle domande:
       lo usano i labirinti e "Impara una lingua" */
    premia: function (p, punti, coppe) {
      var prima = BT.levelFromXp(p.xp);
      p.xp += punti;
      p.coins += coppe;
      var dopo = BT.levelFromXp(p.xp);
      pubblica();
      return { levelUp: dopo > prima, from: prima, to: dopo };
    },
    premiaLabirinto: function (p, punti, coppe) { return BT.store.premia(p, punti, coppe); },
    /* sblocca il livello successivo senza registrare niente: lo usa il
       teletrasporto, che fa passare ma non conta come labirinto fatto */
    sbloccaLabirinto: function (p, livello) {
      BT.store.normalizza(p);
      if (livello >= p.labirinto.livello) p.labirinto.livello = livello + 1;
      pubblica();
    },

    salvaLabirinto: function (p, livello, secondi) {
      BT.store.normalizza(p);
      var prec = p.labirinto.tempi[livello];
      if (!prec || secondi < prec) p.labirinto.tempi[livello] = secondi;
      if (livello >= p.labirinto.livello) {
        p.labirinto.livello = livello + 1;
        p.labirinto.completati++;
      }
      pubblica();
    },

    haSbloccato: function (p, tipo, id) {
      BT.store.normalizza(p);
      return p.sbloccati[tipo].indexOf(id) >= 0;
    },

    sblocca: function (p, tipo, id) {
      BT.store.normalizza(p);
      var art = null;
      (BT.SBLOCCABILI[tipo] || []).forEach(function (x) { if (x.id === id) art = x; });
      if (!art || BT.store.haSbloccato(p, tipo, id)) return false;
      if (p.coins < art.cost) return false;
      p.coins -= art.cost;
      p.sbloccati[tipo].push(id);
      if (tipo === 'titolo') p.titolo = id;
      if (tipo === 'tema') p.tema = id;
      if (tipo === 'avatar') p.avatar = id;
      pubblica();
      return true;
    },

    usa: function (p, tipo, id) {
      BT.store.normalizza(p);
      if (tipo === 'titolo') p.titolo = (p.titolo === id ? null : id);
      else if (tipo === 'tema') p.tema = id;
      else if (tipo === 'avatar') p.avatar = id;
      pubblica();
    },

    exportJSON: function () {
      return JSON.stringify({ app: 'brain-time', version: 1, data: S }, null, 2);
    }
  };

  /* ---------------- sfide a distanza ---------------- */
  BT.sfide = {
    tutte: function () { return BT.storeOnline.stato().sfide; },

    perMe: function (io) {
      if (!io) return [];
      return BT.sfide.tutte().filter(function (s) {
        return s.stato === 'aperta' && s.aId === io.id;
      });
    },

    mieInviate: function (io) {
      if (!io) return [];
      return BT.sfide.tutte().filter(function (s) {
        return s.stato === 'aperta' && s.daId === io.id;
      });
    },

    concluse: function (io) {
      if (!io) return [];
      return BT.sfide.tutte().filter(function (s) {
        return s.stato === 'chiusa' && (s.daId === io.id || s.aId === io.id);
      }).slice(-10).reverse();
    },

    crea: function (da, a, cats, qLen, run, quando, diff) {
      var s = {
        id: 'sf' + quando,
        stato: 'aperta',
        quando: quando,
        daId: da.id, daNome: da.name, daAvatar: da.avatar, daLivello: da.level,
        aId: a.id, aNome: a.name, aAvatar: a.avatar, aLivello: a.level,
        cats: cats, qLen: qLen, diff: diff || 'medio',
        daPunti: run.score, daGiuste: run.correct
      };
      BT.storeOnline.stato().sfide.push(s);
      BT.storeOnline.pubblica();
      return s;
    },

    rispondi: function (s, run, quando) {
      s.aPunti = run.score;
      s.aGiuste = run.correct;
      s.chiusaIl = quando;
      s.stato = 'chiusa';
      s.vincitore = s.daPunti === s.aPunti ? null : (s.daPunti > s.aPunti ? s.daId : s.aId);
      BT.storeOnline.pubblica();
      return s;
    },

    annulla: function (s) {
      var lista = BT.storeOnline.stato().sfide;
      var i = lista.indexOf(s);
      if (i >= 0) lista.splice(i, 1);
      BT.storeOnline.pubblica();
    },

    trova: function (id) {
      var lista = BT.sfide.tutte();
      for (var i = 0; i < lista.length; i++) if (lista[i].id === id) return lista[i];
      return null;
    }
  };

})(window.BT);
