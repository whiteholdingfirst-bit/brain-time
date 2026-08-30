/* =========================================================
   BRAIN TIME — casse sorpresa
   Ogni volta che sali di livello cervello ne arriva una.
   Puoi aprirla subito oppure tenerla da parte: ogni cassa
   rimandata vale un tocco in piu' sulla stella, e ogni tocco
   alza la rarita': Raro, Epico, Mitico, Leggendario.
   Dentro: aiuti, coppe, avatar rari, temi speciali e le
   "scoperte" (curiosita' e trucchi).
   ========================================================= */
(function (BT) {
  'use strict';

  BT.casse = {};

  /* ---------------- rarita' ----------------
     Sette gradini. Ogni cassa messa da parte vale un tocco in piu'
     sulla stella, e ogni tocco fa salire la rarita' di un gradino:
     nessuna fortuna di mezzo, la rarita' si guadagna aspettando.
     L'ultima non si annuncia: finche' non ci arrivi e' solo "???". */
  BT.RARITA = [
    null,
    /* Le coppe RADDOPPIANO a ogni rifiuto: e' la promessa fatta al
       giocatore ("se la rifiuti la prossima vale il doppio") e deve
       essere vera, non approssimata. */
    { id: 'raro',      nome: 'Rara',      ico: '⭐', premi: 1, coppe: [10, 20] },
    { id: 'superraro', nome: 'Superrara', ico: '🔷', premi: 2, coppe: [20, 40] },
    { id: 'epico',     nome: 'Epica',     ico: '🌟', premi: 3, coppe: [40, 80] },
    { id: 'mitico',    nome: 'Mitica',    ico: '💫', premi: 4, coppe: [80, 160], garantiti: 1 },
    { id: 'leggendario', nome: 'Leggendaria', ico: '✨', premi: 5, coppe: [160, 320], garantiti: 1 },
    { id: 'ultraleggendario', nome: 'Ultraleggendaria', ico: '🌈', premi: 6, coppe: [320, 640], garantiti: 2 },
    { id: 'segreto',   nome: 'Segreta',   ico: '🔮', premi: 7, coppe: [640, 1280],
      garantiti: 2, scoperte: 2, misteriosa: true }
  ];
  BT.RARITA_MAX = BT.RARITA.length - 1;

  BT.rarita = function (n) {
    return BT.RARITA[Math.min(BT.RARITA_MAX, Math.max(1, n || 1))];
  };
  function nonPosseduti(p, tipo) {
    return (BT.SBLOCCABILI[tipo] || []).filter(function (art) {
      if (art.cost === 0 || art.base) return false;
      return !BT.store.haSbloccato(p, tipo, art.id);
    });
  }

  function scoperteNuove(p) {
    return BT.CURIOSITA.filter(function (c) { return p.scoperte.indexOf(c.id) < 0; });
  }

  /* un aiuto a caso, con un occhio di riguardo per quelli che
     il giocatore non potrebbe ancora comprare: sono il premio piu' bello */
  function aiutoACaso(p) {
    var alti = BT.POWERUPS.filter(function (pu) { return !BT.aiutoSbloccato(p, pu); });
    var bassi = BT.POWERUPS.filter(function (pu) { return BT.aiutoSbloccato(p, pu); });
    if (alti.length && Math.random() < 0.45) return BT.pick(alti);
    return BT.pick(bassi.length ? bassi : BT.POWERUPS);
  }

  function premioCasuale(p, rar, forzaSpeciale) {
    var dado = Math.random();
    var avatarLiberi = nonPosseduti(p, 'avatar');
    var temiLiberi = nonPosseduti(p, 'tema');

    /* Mitico e Leggendario garantiscono una cosa da collezione:
       il primo premio diventa per forza un avatar o un tema. */
    if (forzaSpeciale && (avatarLiberi.length || temiLiberi.length)) {
      dado = avatarLiberi.length && (!temiLiberi.length || Math.random() < 0.5) ? 0.01 : 0.10;
    }

    /* avatar raro */
    if (dado < 0.08 && avatarLiberi.length) {
      var av = BT.pick(avatarLiberi);
      p.sbloccati.avatar.push(av.id);
      return { tipo: 'avatar', ico: av.id, titolo: 'Avatar raro: ' + av.name,
        testo: av.desc + '<br>Lo trovi nel <b>Negozio</b>, reparto Avatar, pronto da mettere.' };
    }
    /* tema speciale */
    if (dado < 0.17 && temiLiberi.length) {
      var te = BT.pick(temiLiberi);
      p.sbloccati.tema.push(te.id);
      return { tipo: 'tema', ico: '🎨', titolo: 'Tema speciale: ' + te.name,
        testo: te.desc + '<br>Lo attivi dal <b>Negozio</b>, reparto Temi.' };
    }
    /* coppe */
    if (dado < 0.42) {
      var coppe = BT.rnd(rar.coppe[0], rar.coppe[1]);
      p.coins += coppe;
      return { tipo: 'coppe', ico: '🏆', titolo: '+' + coppe + ' coppe',
        testo: 'Da spendere al Negozio in aiuti, avatar o temi.' };
    }
    /* aiuti */
    var pu = aiutoACaso(p);
    var quanti = BT.rnd(1, 3);
    p.inventory[pu.id] = (p.inventory[pu.id] || 0) + quanti;
    var extra = BT.aiutoSbloccato(p, pu) ? ''
      : '<br><b>&Egrave; un aiuto che non potresti ancora comprare:</b> ti arriva in regalo.';
    return { tipo: 'aiuto', ico: pu.ico, titolo: quanti + '&times; ' + pu.name,
      testo: pu.desc + extra };
  }

  /* --- apre la cassa e applica subito tutti i premi --- */
  BT.casse.apri = function (p) {
    BT.store.normalizza(p);
    var molt = BT.store.apriCassa(p);
    if (!molt) return null;

    var rar = BT.rarita(molt);
    var premi = [];

    /* le scoperte sono il cuore della cassa: una sempre, due nella Segreta */
    var quanteScoperte = rar.scoperte || 1;
    for (var s = 0; s < quanteScoperte; s++) {
      var nuove = scoperteNuove(p);
      if (!nuove.length) break;
      var c = BT.pick(nuove);
      BT.store.segnaScoperta(p, c.id);
      premi.push({ tipo: 'scoperta', ico: c.ico, titolo: c.titolo, testo: c.testo,
        etichetta: BT.tipoScoperta(c.tipo).nome, id: c.id });
    }

    for (var i = 0; i < rar.premi; i++) {
      premi.push(premioCasuale(p, rar, i < (rar.garantiti || 0)));
    }

    /* I premi restano scritti nel profilo finche' il giocatore non dice
       "ho letto". Serve perche' nella versione online ogni salvataggio
       ripubblica la pagina, e la pagina si ricarica: senza questo, l'elenco
       dei premi spariva da solo dopo un attimo, prima che si riuscisse a
       leggerlo. Cosi' invece torna su da solo dopo il ricaricamento. */
    p.cassaDaLeggere = { molt: molt, rarita: rar, premi: premi };

    BT.store.save();
    return p.cassaDaLeggere;
  };

  /* c'e' un elenco di premi ancora da leggere? */
  BT.casse.daLeggere = function (p) {
    BT.store.normalizza(p);
    return p.cassaDaLeggere || null;
  };

  /* il giocatore ha premuto "ho letto": si puo' togliere */
  BT.casse.letta = function (p) {
    if (!p.cassaDaLeggere) return;
    delete p.cassaDaLeggere;
    BT.store.save();
  };

  /* La cassa messa da parte. Anche questo messaggio resta scritto nel
     profilo finche' non lo chiude lui: prima si tornava al menu da soli
     e non si faceva in tempo a leggere quanto varra' la prossima. */
  BT.casse.rimanda = function (p) {
    BT.store.rimandaCassa(p);
    p.cassaRimandata = BT.rarita(p.casse.moltiplicatore);
    BT.store.save();
    return p.cassaRimandata;
  };
  BT.casse.rimandata = function (p) {
    BT.store.normalizza(p);
    return p.cassaRimandata || null;
  };
  BT.casse.rimandataLetta = function (p) {
    if (!p.cassaRimandata) return;
    delete p.cassaRimandata;
    BT.store.save();
  };
  /* quante scoperte ha trovato, sul totale */
  BT.casse.scoperte = function (p) {
    BT.store.normalizza(p);
    return { trovate: p.scoperte.length, totali: BT.CURIOSITA.length };
  };

})(window.BT);
