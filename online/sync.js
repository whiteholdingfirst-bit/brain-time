/* =========================================================
   BRAIN TIME ONLINE — sincronizzazione
   La pagina pubblicata custodisce lo stato condiviso (giocatori,
   punteggi, sfide) dentro un blocco JSON. Quando qualcuno gioca,
   la pagina ripubblica se stessa con lo stato aggiornato e tutti
   gli altri dispositivi aperti si aggiornano da soli.
   ========================================================= */
(function (BT) {
  'use strict';

  var PRISTINE = null;      // copia del documento cosi' com'e' arrivato
  var api = null;           // namespace 'artifact', se disponibile
  var stato = 'attesa';     // attesa | online | offline
  var inCorso = false;      // pubblicazione in corso
  var daPubblicare = false;
  var timer = null;

  var MARCA_INIZIO = '<script id="bt-state" type="application/json">';
  var MARCA_FINE = '<' + '/script>';

  /* ---------- lettura dello stato incorporato ---------- */
  function leggiStato() {
    var el = document.getElementById('bt-state');
    if (!el) return null;
    try { return JSON.parse(el.textContent); } catch (e) { return null; }
  }

  /* ---------- JSON sicuro dentro un tag script ---------- */
  function jsonSicuro(obj) {
    return JSON.stringify(obj)
      .replace(/</g, '\\u003c')
      .replace(/>/g, '\\u003e')
      .replace(new RegExp("\u2028", "g"), "\\u2028")
      .replace(new RegExp("\u2029", "g"), "\\u2029");
  }

  /* ---------- ricostruisce il documento con il nuovo stato ---------- */
  function documentoAggiornato(nuovoStato) {
    if (!PRISTINE) return null;
    var i = PRISTINE.indexOf(MARCA_INIZIO);
    if (i < 0) return null;
    var j = PRISTINE.indexOf(MARCA_FINE, i);
    if (j < 0) return null;

    var html = PRISTINE.slice(0, i + MARCA_INIZIO.length) +
               jsonSicuro(nuovoStato) +
               PRISTINE.slice(j);

    // Il visualizzatore inserisce il proprio runtime dentro la pagina, delimitato
    // da due commenti. Va tolto prima di ripubblicare, altrimenti a ogni salvataggio
    // se ne accumulerebbe una copia in piu'.
    html = html.replace(/<!--\s*frame-runtime\s*-->[\s\S]*?<!--\s*\/frame-runtime\s*-->/gi, '');

    // via anche eventuali script esterni: i nostri sono tutti in linea
    html = html.replace(/<script\b[^>]*\bsrc\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)[^>]*>\s*<\/script>/gi, '');

    // il tema viene riapplicato dal visualizzatore a ogni apertura: non va congelato
    html = html.replace(/<html\b[^>]*>/i, '<html>');

    if (!/^\s*<!doctype/i.test(html)) html = '<!doctype html>\n' + html;
    return html;
  }

  BT.online = {

    /* copia del documento originale: va chiamata PRIMA di disegnare qualsiasi cosa */
    cattura: function () {
      try { PRISTINE = '<!doctype html>\n' + document.documentElement.outerHTML; }
      catch (e) { PRISTINE = null; }
      return leggiStato();
    },

    stato: function () { return stato; },
    attiva: function () { return stato === 'online'; },

    /* aggancia la capability; il risultato arriva sempre dopo il primo giro di script */
    avvia: function (quandoPronto) {
      if (!window.claude || typeof window.claude.use !== 'function') {
        stato = 'offline';
        quandoPronto(false);
        return;
      }
      window.claude.use('artifact').then(function (ns) {
        if (ns && typeof ns.publish === 'function') { api = ns; stato = 'online'; }
        else stato = 'offline';
        quandoPronto(stato === 'online');
      }).catch(function () {
        stato = 'offline';
        quandoPronto(false);
      });
    },

    /* pubblica lo stato: le modifiche ravvicinate vengono accorpate */
    salva: function (nuovoStato, quandoFatto) {
      if (!api || !PRISTINE) { if (quandoFatto) quandoFatto(false, 'non_disponibile'); return; }
      daPubblicare = true;
      clearTimeout(timer);
      timer = setTimeout(function () { esegui(nuovoStato, quandoFatto); }, 400);
    }
  };

  function esegui(nuovoStato, quandoFatto) {
    if (inCorso || !daPubblicare) return;
    var html = documentoAggiornato(nuovoStato);
    if (!html) { if (quandoFatto) quandoFatto(false, 'documento'); return; }

    inCorso = true;
    daPubblicare = false;
    api.publish(html).then(function () {
      inCorso = false;
      if (quandoFatto) quandoFatto(true);
    }).catch(function (err) {
      inCorso = false;
      var code = (err && (err.code || err.name)) || 'errore';
      // 'conflict' significa che qualcun altro ha pubblicato prima: la pagina
      // si ricarica da sola sulla versione vincente, non si riprova.
      if (quandoFatto) quandoFatto(false, code);
    });
  }

})(window.BT);
