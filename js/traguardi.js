/* =========================================================
   BRAIN TIME — traguardi sui punti cervello

   I punti cervello facevano salire di livello, e il livello portava
   una cassa. Fin qui bene, ma fra un livello e l'altro passano
   migliaia di punti e in mezzo non succedeva niente.
   I traguardi riempiono quel vuoto: soglie fisse di punti totali,
   ognuna con un premio. Si raggiungono una volta sola, per sempre.

   ⚠️ I punti cervello NON si spendono, e non devono diventare una
   moneta. Sono il metro della classifica: se si potessero spendere,
   la classifica diventerebbe "chi ha speso di meno" e smetterebbe di
   voler dire qualcosa. Le coppe sono la moneta; i punti sono la
   storia di quanto hai giocato, e quella non si consuma.
   ========================================================= */
(function (BT) {
  'use strict';

  /* --- le soglie ---
     Sono spostate apposta rispetto ai livelli (600, 1800, 3600, 6000,
     9000, 12600...): se cadessero insieme, cassa e traguardo
     arriverebbero nello stesso momento e si darebbero fastidio.

     I premi crescono, ma quelli che contano davvero sono i titoli e
     gli avatar: quelli **non si comprano al Negozio**. Con 21.000
     coppe in tasca un premio in coppe non emoziona nessuno; una cosa
     che i soldi non danno, si'. */
  BT.TRAGUARDI = [
    { id: 'm1',  xp: 1000,   ico: 'scintilla', nome: 'Il primo mille',
      testo: 'Mille punti cervello. Da qui in poi &egrave; tutto guadagnato.',
      coppe: 30 },

    { id: 'm2',  xp: 2500,   ico: 'bersaglio', nome: 'Ci hai preso gusto',
      testo: 'Non era una partita e via: stai giocando sul serio.',
      coppe: 50, aiuto: { id: 'hint', n: 2 } },

    { id: 'm3',  xp: 5000,   ico: 'cassa', nome: 'Cinquemila',
      testo: 'Mezzo passo verso le cinque cifre. Ti sei meritato una cassa.',
      casse: 1 },

    { id: 'm4',  xp: 10000,  ico: 'podio', nome: 'Cinque cifre',
      testo: 'Il punteggio &egrave; diventato lungo. Questo titolo non si compra: si raggiunge.',
      coppe: 120, titolo: 'tenace' },

    { id: 'm5',  xp: 16000,  ico: 'razzo', nome: 'Non ti ferma nessuno',
      testo: 'A questo punto giocare &egrave; diventata un&rsquo;abitudine.',
      casse: 1, aiuto: { id: 'freeze', n: 3 } },

    { id: 'm6',  xp: 25000,  ico: 'globo', nome: 'Venticinquemila',
      testo: 'Un avatar che al Negozio non c&rsquo;&egrave; e non ci sar&agrave; mai.',
      coppe: 250, avatar: '🗿' },

    { id: 'm7',  xp: 40000,  ico: 'spade', nome: 'Quarantamila',
      testo: 'Quarantamila punti vogliono dire centinaia di domande.',
      casse: 1, titolo: 'maratoneta' },

    { id: 'm8',  xp: 60000,  ico: 'lampadina', nome: 'Sessantamila',
      testo: 'Tre aiuti fra i pi&ugrave; cari del gioco, in regalo.',
      coppe: 400, aiuto: { id: 'triple', n: 3 } },

    { id: 'm9',  xp: 80000,  ico: 'colonna', nome: 'Ottantamila',
      testo: 'Due casse insieme, e una stella cadente da mettere in faccia.',
      casse: 2, avatar: '🌠' },

    { id: 'm10', xp: 100000, ico: 'coppa', nome: 'Centomila',
      testo: 'Centomila punti cervello. Il titolo dice tutto da solo.',
      coppe: 1000, titolo: 'centomila' }
  ];

  /* 100000 -> 100.000: un numero lungo senza punti non si legge */
  BT.mille = function (n) {
    var s = String(n), out = '';
    while (s.length > 3) { out = '.' + s.slice(-3) + out; s = s.slice(0, -3); }
    return s + out;
  };

  BT.traguardo = function (id) {
    for (var i = 0; i < BT.TRAGUARDI.length; i++)
      if (BT.TRAGUARDI[i].id === id) return BT.TRAGUARDI[i];
    return null;
  };

  /* riga leggibile di che cosa da' un traguardo */
  BT.traguardi = {

    premioInParole: function (t) {
      var pezzi = [];
      if (t.coppe) pezzi.push('<b>' + t.coppe + '</b> coppe');
      if (t.casse) pezzi.push(t.casse === 1 ? 'una <b>cassa sorpresa</b>'
                                            : '<b>' + t.casse + ' casse sorpresa</b>');
      if (t.aiuto) {
        var pu = null;
        BT.POWERUPS.forEach(function (x) { if (x.id === t.aiuto.id) pu = x; });
        if (pu) pezzi.push('<b>' + t.aiuto.n + '&times; ' + pu.name + '</b>');
      }
      if (t.titolo) {
        var ti = BT.titolo(t.titolo);
        if (ti) pezzi.push('il titolo <b>' + ti.name + '</b>');
      }
      if (t.avatar) pezzi.push('l&rsquo;avatar <b>' + t.avatar + '</b>');
      return pezzi.join(' &middot; ');
    },

    raggiunto: function (p, t) {
      BT.store.normalizza(p);
      return p.traguardi.indexOf(t.id) >= 0;
    },

    /* il prossimo da prendere, con quanto manca */
    prossimo: function (p) {
      BT.store.normalizza(p);
      for (var i = 0; i < BT.TRAGUARDI.length; i++) {
        var t = BT.TRAGUARDI[i];
        if (p.traguardi.indexOf(t.id) < 0) {
          return { t: t, manca: Math.max(0, t.xp - p.xp) };
        }
      }
      return null;                      /* li ha presi tutti */
    },

    /* =========================================================
       Il controllo, da chiamare dopo ogni partita che da' punti.

       Assegna TUTTI i traguardi maturati, non solo il primo: chi
       gioca da prima che i traguardi esistessero ne sblocca diversi
       in un colpo, ed e' giusto cosi' - quei punti li ha fatti.

       Salva UNA volta sola alla fine: online ogni salvataggio
       ripubblica la pagina e la fa ricaricare, quindi dieci premi
       non devono voler dire dieci ricaricamenti.
       ========================================================= */
    controlla: function (p) {
      if (!p) return [];
      BT.store.normalizza(p);
      var nuovi = [];

      BT.TRAGUARDI.forEach(function (t) {
        if (p.xp < t.xp || p.traguardi.indexOf(t.id) >= 0) return;

        if (t.coppe) p.coins += t.coppe;
        if (t.casse) p.casse.pronte += t.casse;
        if (t.aiuto) p.inventory[t.aiuto.id] = (p.inventory[t.aiuto.id] || 0) + t.aiuto.n;
        /* titoli e avatar si aggiungono a mano, senza passare da
           store.sblocca: quello vuole le coppe e qui non si paga */
        if (t.titolo && p.sbloccati.titolo.indexOf(t.titolo) < 0) p.sbloccati.titolo.push(t.titolo);
        if (t.avatar && p.sbloccati.avatar.indexOf(t.avatar) < 0) p.sbloccati.avatar.push(t.avatar);

        p.traguardi.push(t.id);
        nuovi.push(t);
      });

      if (!nuovi.length) return [];

      /* Come per la cassa: il messaggio vive nel PROFILO, non nel DOM.
         Online il DOM sparisce a ogni salvataggio, quindi un annuncio
         lasciato solo a schermo si perderebbe prima di essere letto. */
      p.traguardoDaLeggere = nuovi.map(function (t) { return t.id; });
      BT.store.save();
      return nuovi;
    },

    daLeggere: function (p) {
      BT.store.normalizza(p);
      if (!p.traguardoDaLeggere || !p.traguardoDaLeggere.length) return null;
      return p.traguardoDaLeggere.map(BT.traguardo).filter(Boolean);
    },

    letto: function (p) {
      if (!p.traguardoDaLeggere) return;
      delete p.traguardoDaLeggere;
      BT.store.save();
    },

    /* quanti su quanti, per la schermata delle statistiche */
    conto: function (p) {
      BT.store.normalizza(p);
      return { presi: p.traguardi.length, totali: BT.TRAGUARDI.length };
    }
  };

  /* --- i titoli che si guadagnano e basta ---
     Hanno cost: null e un campo 'traguardo': il Negozio li mostra
     bloccati, con scritto che cosa serve per averli, e non li vende. */
  if (BT.SBLOCCABILI && BT.SBLOCCABILI.titolo) {
    BT.SBLOCCABILI.titolo.push(
      { id: 'tenace', cost: null, traguardo: 'm4', name: 'il Tenace',
        desc: 'Non si compra: arriva a 10.000 punti cervello.' },
      { id: 'maratoneta', cost: null, traguardo: 'm7', name: 'Maratoneta',
        desc: 'Non si compra: arriva a 40.000 punti cervello.' },
      { id: 'centomila', cost: null, traguardo: 'm10', name: 'Centomila',
        desc: 'Non si compra: arriva a 100.000 punti cervello.' }
    );
  }
  if (BT.SBLOCCABILI && BT.SBLOCCABILI.avatar) {
    BT.SBLOCCABILI.avatar.push(
      { id: '🗿', cost: null, traguardo: 'm6', name: 'Moai',
        desc: 'Non si compra: arriva a 25.000 punti cervello.' },
      { id: '🌠', cost: null, traguardo: 'm9', name: 'Stella cadente',
        desc: 'Non si compra: arriva a 80.000 punti cervello.' }
    );
  }

})(window.BT);
