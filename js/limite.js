/* =========================================================
   BRAIN TIME — limite di tempo
   Trenta minuti di gioco, poi tre ore di pausa. Il conto e'
   sul tempo passato dentro le partite (quiz, duelli, labirinti),
   non sul tempo con l'app aperta: leggere le Scoperte, guardare
   la classifica o scegliere un avatar non consuma niente.
   ========================================================= */
(function (BT) {
  'use strict';

  /* INTERRUTTORE GENERALE.
     Finche' il gioco e' in costruzione il limite e' spento: durante le
     prove bloccarsi ogni mezz'ora e' solo un intralcio. Si riaccende
     mettendo true, e torna tutto come prima senza altre modifiche. */
  var ATTIVO = false;

  var MINUTI = 30;                 // quanto si puo' giocare di fila
  var ORE_PAUSA = 3;               // quanto dura la pausa dopo
  var MS_MIN = 60 * 1000;
  var MS_ORA = 60 * MS_MIN;

  var inizioPartita = 0;           // solo in memoria: la partita in corso

  function ora() { return new Date().getTime(); }

  function campo(p) {
    if (!p.tempo) p.tempo = { usato: 0, ultimo: 0, bloccatoFino: 0 };
    return p.tempo;
  }

  /* Rimette a zero quando e' giusto farlo, e blocca quando serve.
     Due modi di "scontare" la pausa: aspettare che scada il blocco,
     oppure semplicemente non giocare per tre ore. */
  function aggiorna(p) {
    var t = campo(p), adesso = ora(), cambiato = false;

    if (t.bloccatoFino && adesso >= t.bloccatoFino) {
      t.bloccatoFino = 0; t.usato = 0; cambiato = true;
    }
    if (!t.bloccatoFino && t.ultimo && adesso - t.ultimo >= ORE_PAUSA * MS_ORA && t.usato) {
      t.usato = 0; cambiato = true;
    }
    return cambiato;
  }

  BT.limite = {
    MINUTI: MINUTI,
    ORE_PAUSA: ORE_PAUSA,

    spento: function () { return !ATTIVO; },

    stato: function (p) {
      if (!ATTIVO || !p) return { bloccato: false, restanoMin: MINUTI, usatiMin: 0, mancaMs: 0 };
      BT.store.normalizza(p);
      if (aggiorna(p)) BT.store.save();
      var t = campo(p), adesso = ora();
      var usati = t.usato + (inizioPartita ? adesso - inizioPartita : 0);
      return {
        bloccato: !!t.bloccatoFino && adesso < t.bloccatoFino,
        fineBlocco: t.bloccatoFino,
        mancaMs: t.bloccatoFino ? Math.max(0, t.bloccatoFino - adesso) : 0,
        usatiMin: Math.floor(usati / MS_MIN),
        restanoMin: Math.max(0, Math.ceil((MINUTI * MS_MIN - usati) / MS_MIN))
      };
    },

    puoiGiocare: function (p) { return !BT.limite.stato(p).bloccato; },

    /* una partita comincia */
    avvia: function (p) {
      if (!ATTIVO || !p) return;
      BT.limite.stato(p);              // fa scattare eventuali azzeramenti
      inizioPartita = ora();
    },

    /* Una partita finisce: si somma il tempo a chi ha giocato e, se e'
       finito, scatta la pausa. Chi e' gia' dentro una partita la finisce
       sempre: interromperla a meta' farebbe perdere i punti, e sarebbe una
       punizione, non una regola.
       Nel duello giocano in due sullo stesso dispositivo, quindi il tempo
       viene addebitato a tutti e due. */
    ferma: function (chi) {
      if (!ATTIVO || !chi || !inizioPartita) { inizioPartita = 0; return null; }
      var lista = [].concat(chi).filter(Boolean);
      var adesso = ora(), durata = adesso - inizioPartita;
      inizioPartita = 0;
      var appenaBloccato = false, fine = 0;

      lista.forEach(function (p) {
        BT.store.normalizza(p);
        var t = campo(p);
        t.usato += durata;
        t.ultimo = adesso;
        if (t.usato >= MINUTI * MS_MIN && !t.bloccatoFino) {
          t.bloccatoFino = adesso + ORE_PAUSA * MS_ORA;
          appenaBloccato = true;
        }
        if (t.bloccatoFino > fine) fine = t.bloccatoFino;
      });
      BT.store.save();
      return { appenaBloccato: appenaBloccato, fineBlocco: fine };
    },

    /* "1 ora e 12 minuti", per dire quanto manca senza far leggere un orario */
    attesa: function (ms) {
      var min = Math.ceil(ms / MS_MIN);
      var ore = Math.floor(min / 60);
      min = min % 60;
      if (ore && min) return ore + (ore === 1 ? ' ora e ' : ' ore e ') + min + ' minuti';
      if (ore) return ore === 1 ? 'un\'ora' : ore + ' ore';
      return min <= 1 ? 'un minuto' : min + ' minuti';
    },

    /* l'ora a cui si torna a giocare, per chi preferisce l'orologio */
    orario: function (ms) {
      var d = new Date(ms);
      var m = d.getMinutes();
      return d.getHours() + ':' + (m < 10 ? '0' + m : m);
    }
  };

})(window.BT);
