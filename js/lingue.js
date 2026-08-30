/* =========================================================
   BRAIN TIME — Impara una lingua
   Tre esercizi che si alternano:
   1) figura -> parola  (e ogni tanto al contrario)
   2) la parola giusta da mettere nel buco della frase
   3) rimettere in ordine le parole di una frase
   Niente timer: qui non si corre, si impara. I punti restano
   quelli del gioco, cosi' anche questa modalita' fa salire di
   livello cervello (e quindi porta le casse).
   ========================================================= */
(function (BT) {
  'use strict';

  var S = null;              // sessione in corso

  function mescola(a) {
    var v = a.slice(), i, j, t;
    for (i = v.length - 1; i > 0; i--) {
      j = BT.rnd(0, i); t = v[i]; v[i] = v[j]; v[j] = t;
    }
    return v;
  }

  function box() { return document.getElementById('lingua-box'); }

  /* ---------------- costruzione degli esercizi ---------------- */

  /* figura -> parola, oppure parola -> figura */
  function esFigura(lin, alContrario) {
    var scelte = mescola(BT.PAROLE).slice(0, 4);
    var giusta = scelte[BT.rnd(0, 3)];
    return {
      tipo: alContrario ? 'figura-al-contrario' : 'figura',
      etichetta: alContrario ? 'Qual &egrave; la figura?'
        : (lin === 'it' ? 'Come si chiama?' : 'Come si dice?'),
      giusta: giusta,
      opzioni: mescola(scelte),
      lingua: lin
    };
  }

  function esBuco(lin) {
    var righe = BT.FRASI_BUCO[lin] || [];
    if (!righe.length) return null;
    var r = righe[BT.rnd(0, righe.length - 1)];
    var opzioni = mescola([r[1]].concat(r[2]));
    return {
      tipo: 'buco', etichetta: 'Quale parola manca?',
      frase: r[0], giusta: r[1], opzioni: opzioni, traduzione: r[3], lingua: lin
    };
  }

  function esOrdine(lin) {
    var righe = BT.FRASI_ORDINE[lin] || [];
    if (!righe.length) return null;
    var r = righe[BT.rnd(0, righe.length - 1)];
    var parole = r[0].split(' ');
    var sparse = mescola(parole);
    /* se il caso ha rimesso tutto a posto da solo, si rimescola */
    if (sparse.join(' ') === r[0] && parole.length > 2) sparse = mescola(parole);
    return {
      tipo: 'ordine', etichetta: 'Rimetti in ordine la frase',
      frase: r[0], parole: parole, sparse: sparse, traduzione: r[1], lingua: lin
    };
  }

  var VERE = ['it', 'en', 'fr', 'de', 'es'];   // 'misto' non e' una lingua

  /* la scaletta della partita: tipi diversi, senza tre uguali di fila.
     In "misto" ogni esercizio pesca una lingua diversa. */
  function costruisci(scelta, quanti) {
    var lista = [], i;
    for (i = 0; i < quanti; i++) {
      var lin = scelta === 'misto' ? VERE[BT.rnd(0, VERE.length - 1)] : scelta;
      var dado = i % 4;
      var e = dado === 0 || dado === 1 ? esFigura(lin, i % 8 === 5)
            : dado === 2 ? esBuco(lin)
            : esOrdine(lin);
      lista.push(e || esFigura(lin, false));
    }
    return lista;
  }

  /* ---------------- disegno ---------------- */

  function testa() {
    /* in "misto" la bandiera e' quella dell'esercizio in corso, se no
       non si capirebbe in che lingua stai rispondendo */
    var mostra = S.lingua === 'misto' ? S.lista[S.i].lingua : S.lingua;
    return '<div class="lg-testa">' +
      '<span class="lg-bandiera">' + BT.lingua(mostra).ico + '</span>' +
      '<span class="lg-nome">' + BT.lingua(mostra).nome + '</span>' +
      '<span class="lg-conta">' + (S.i + 1) + ' / ' + S.lista.length + '</span>' +
      (S.tipo === 'allena' ? '<span class="lg-modo">allenamento</span>'
        : '<span class="lg-modo">' + S.punti + ' punti</span>') +
      '</div>';
  }

  function disegna() {
    var e = S.lista[S.i];
    var html = testa() + '<div class="card lg-card">' +
      '<div class="lg-eti">' + e.etichetta + '</div>';

    if (e.tipo === 'figura') {
      html += '<div class="lg-figura">' + e.giusta.ico + '</div>' +
        /* col target italiano il nome italiano sarebbe la risposta in chiaro */
        (e.lingua === 'it' ? '' : '<div class="lg-it">' + e.giusta.it + '</div>') +
        '<div class="lg-opzioni">' +
          e.opzioni.map(function (o, k) {
            return '<button class="opt lg-opt" data-k="' + k + '">' + o[e.lingua] + '</button>';
          }).join('') +
        '</div>';
    } else if (e.tipo === 'figura-al-contrario') {
      html += '<div class="lg-parolona">' + e.giusta[e.lingua] + '</div>' +
        '<div class="lg-opzioni lg-figure">' +
          e.opzioni.map(function (o, k) {
            return '<button class="opt lg-opt lg-solo-ico" data-k="' + k + '">' + o.ico + '</button>';
          }).join('') +
        '</div>';
    } else if (e.tipo === 'buco') {
      html += '<div class="lg-frase">' + e.frase.replace('___', '<span class="lg-buco">?</span>') + '</div>' +
        '<div class="lg-opzioni">' +
          e.opzioni.map(function (o, k) {
            return '<button class="opt lg-opt" data-k="' + k + '">' + o + '</button>';
          }).join('') +
        '</div>';
    } else {
      html += '<div class="lg-riga-risposta" id="lg-risposta"></div>' +
        '<div class="lg-pezzi" id="lg-pezzi"></div>' +
        '<div class="lg-trad">' + e.traduzione + '</div>' +
        '<button class="btn btn-primary btn-block" id="lg-controlla">Controlla</button>';
    }

    html += '</div>';
    box().innerHTML = html;

    if (e.tipo === 'ordine') collegaOrdine(e);
    else {
      box().querySelectorAll('.lg-opt').forEach(function (b) {
        b.onclick = function () { rispondi(e, parseInt(b.dataset.k, 10), b); };
      });
    }
  }

  /* trascinare su un telefono e' scomodo: qui si tocca la parola per
     metterla in fila, e si tocca di nuovo per rimandarla indietro */
  function collegaOrdine(e) {
    var scelte = [];
    var rigaEl = document.getElementById('lg-risposta');
    var pezziEl = document.getElementById('lg-pezzi');

    function ridisegna() {
      rigaEl.innerHTML = scelte.length
        ? scelte.map(function (p, k) { return '<button class="lg-pezzo scelto" data-s="' + k + '">' + p + '</button>'; }).join('')
        : '<span class="lg-vuoto">Tocca le parole nell&rsquo;ordine giusto</span>';
      pezziEl.innerHTML = e.sparse.map(function (p, k) {
        return scelte.indexOf(k) >= 0 ? '' :
          '<button class="lg-pezzo" data-p="' + k + '">' + p + '</button>';
      }).join('');

      pezziEl.querySelectorAll('.lg-pezzo').forEach(function (b) {
        b.onclick = function () { scelte.push(parseInt(b.dataset.p, 10)); ridisegna(); };
      });
      rigaEl.querySelectorAll('.lg-pezzo').forEach(function (b) {
        b.onclick = function () { scelte.splice(parseInt(b.dataset.s, 10), 1); ridisegna(); };
      });
    }
    /* dentro scelte ci sono gli indici, non le parole: due parole uguali
       nella stessa frase (i "the" inglesi) resterebbero indistinguibili */
    ridisegna();

    document.getElementById('lg-controlla').onclick = function () {
      var fatta = scelte.map(function (k) { return e.sparse[k]; }).join(' ');
      esito(e, fatta === e.frase, fatta);
    };
  }

  function rispondi(e, k, bottone) {
    var scelto = e.opzioni[k];
    var ok = e.tipo === 'buco' ? scelto === e.giusta : scelto === e.giusta;
    box().querySelectorAll('.lg-opt').forEach(function (b) { b.disabled = true; });
    bottone.classList.add(ok ? 'right' : 'wrong');
    esito(e, ok, null);
  }

  function esito(e, ok, fatta) {
    var d = BT.diff(S.diff);

    if (ok) {
      S.giuste++;
      S.serie++;
      var molt = S.serie >= 8 ? 2 : S.serie >= 5 ? 1.5 : S.serie >= 3 ? 1.2 : 1;
      var guadagno = Math.round(100 * molt * d.bonus);
      if (S.tipo === 'gioca') { S.punti += guadagno; S.coppe += 1; }
      BT.sfx.play('giusto');
    } else {
      S.serie = 0;
      if (S.tipo === 'gioca') S.punti = Math.max(0, S.punti - d.penalita);
      BT.sfx.play('sbagliato');
    }

    var soluzione =
      e.tipo === 'ordine' ? e.frase :
      e.tipo === 'buco' ? e.frase.replace('___', '<b>' + e.giusta + '</b>') :
      (e.lingua === 'it' ? e.giusta.it : e.giusta[e.lingua] + ' = ' + e.giusta.it);

    var spiega = e.traduzione ? '<div class="lg-trad">' + e.traduzione + '</div>' : '';

    box().insertAdjacentHTML('beforeend',
      '<div class="feedback ' + (ok ? 'ok' : 'no') + '">' +
        '<div class="fb-title">' + (ok ? 'Giusto! 🎉' : 'Non ci siamo') + '</div>' +
        '<div class="fb-text">' + soluzione + '</div>' + spiega +
        (S.tipo === 'gioca'
          ? '<div class="fb-points">' + (ok ? '+' : '') +
            (ok ? Math.round(100 * (S.serie >= 8 ? 2 : S.serie >= 5 ? 1.5 : S.serie >= 3 ? 1.2 : 1) * d.bonus)
                : '&minus;' + d.penalita) + ' punti</div>'
          : '') +
        '<button class="btn btn-primary btn-block" id="lg-avanti">' +
          (S.i + 1 >= S.lista.length ? 'Vedi il risultato' : 'Avanti') + '</button>' +
      '</div>');

    document.getElementById('lg-avanti').onclick = function () {
      S.i++;
      if (S.i >= S.lista.length) fine(); else disegna();
    };
  }

  function fine() {
    if (BT.limite) BT.limite.ferma(S.player);
    var salita = { levelUp: false };

    if (S.tipo === 'gioca' && (S.punti || S.coppe)) {
      salita = BT.store.premia(S.player, S.punti, S.coppe);
      /* stessa regola di tutto il resto: la cassa arriva col livello cervello */
      if (salita.levelUp) BT.store.aggiungiCassa(S.player);
    }
    BT.sfx.play(S.giuste === S.lista.length ? 'vittoria' : 'coppa');
    BT.lingue.mostraEsito({
      lingua: S.lingua, tipo: S.tipo, giuste: S.giuste, totali: S.lista.length,
      punti: S.punti, coppe: S.coppe, salita: salita
    });
    S = null;
  }

  /* ---------------- avvio ---------------- */
  BT.lingue = {
    start: function (cfg) {
      var d = BT.diff(cfg.diff || BT.store.settings().diff);
      BT.store.normalizza(cfg.player);
      if (BT.limite) BT.limite.avvia(cfg.player);

      S = {
        player: cfg.player,
        lingua: cfg.lingua || 'en',
        tipo: cfg.tipo || 'gioca',
        diff: d.id,
        lista: costruisci(cfg.lingua || 'en', d.qLen),
        i: 0, giuste: 0, punti: 0, coppe: 0, serie: 0
      };
      BT.show('screen-lingua');
      disegna();
    },

    abbandona: function () {
      if (S && BT.limite) BT.limite.ferma(S.player);
      S = null;
    },

    inCorso: function () { return !!S; },
    stato: function () { return S; }            // utile per collaudare
  };

  /* ---------------- quale lingua, stavolta? ----------------
     Non e' un'impostazione: si sceglie a ogni partita, perche' un
     giorno si ha voglia di inglese e un altro di tedesco. Quella
     nelle Impostazioni e' un'altra cosa: la lingua del gioco. */
  BT.lingue.scegli = function (poi) {
    var html = '<div class="card lg-card">' +
      '<h2 class="card-title">Che lingua vuoi imparare?</h2>' +
      '<p class="hint" style="margin-top:0">Cambia quando vuoi: si sceglie ogni volta.</p>' +
      '<div class="lg-scelta">' +
        BT.LINGUE.map(function (x) {
          return '<button class="cat-card lg-lingua" data-lg="' + x.id + '">' +
            '<span class="cat-ico">' + x.ico + '</span>' +
            '<span class="cat-name">' + x.nome + '</span>' +
            '<span class="cat-sub">' + x.sotto + '</span>' +
          '</button>';
        }).join('') +
      '</div></div>';

    var b = document.getElementById('lingua-box');
    b.innerHTML = html;
    BT.show('screen-lingua');
    b.querySelectorAll('.lg-lingua').forEach(function (t) {
      t.onclick = function () { BT.sfx.play('click'); poi(t.dataset.lg); };
    });
  };

})(window.BT);
