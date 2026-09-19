/* =========================================================
   BRAIN TIME — il "succo": reazioni, coriandoli, numeri che salgono

   Serve a una cosa sola: far sentire il colpo. Una risposta giusta
   non deve essere un numero che cambia, deve essere una cosa che
   succede. E' la parte che decide se un gioco si riapre domani.

   Due regole che valgono per tutto quello che c'e' qui dentro:

   1. NON DEVE MAI ESSERE NECESSARIO.  Ogni effetto e' decorazione:
      se non parte, il gioco deve restare giusto lo stesso. Per questo
      i numeri vengono scritti SUBITO al valore finale e l'animazione
      li rincorre, mai il contrario. Nel pannello di anteprima (e in
      qualunque scheda in secondo piano) requestAnimationFrame non
      parte proprio: se il punteggio dipendesse dall'animazione, li'
      resterebbe fermo a zero.

   2. CHI HA CHIESTO DI NON ANIMARE, NON VIENE ANIMATO.
      prefers-reduced-motion non e' un capriccio: c'e' chi con le cose
      che si muovono sullo schermo sta male davvero. BT.juice.ok()
      risponde no, e tutto si riduce al risultato senza spettacolo.
   ========================================================= */
(function (BT) {
  'use strict';

  var J = {};
  BT.juice = J;

  /* ---------- si puo' animare? ---------- */
  var menoMoto = null;
  J.ok = function () {
    if (menoMoto === null) {
      try {
        menoMoto = window.matchMedia &&
          window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      } catch (e) { menoMoto = false; }
    }
    return !menoMoto;
  };

  /* dove sta un elemento sullo schermo, al centro */
  J.centro = function (el) {
    if (!el || !el.getBoundingClientRect) return null;
    var r = el.getBoundingClientRect();
    if (!r.width && !r.height) return null;
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  };

  /* =========================================================
     Il punteggio che sale contando

     Il valore finale viene scritto subito nell'elemento: se
     l'animazione non parte (scheda nascosta, moto ridotto) il numero
     e' comunque quello giusto. L'animazione lo sovrascrive mentre
     corre e lo rimette a posto alla fine.
     ========================================================= */
  J.conta = function (el, da, a, ms) {
    if (!el) return;
    el.textContent = a;                       /* prima il risultato, sempre */
    if (!J.ok() || da === a || !window.requestAnimationFrame) return;

    var durata = ms || Math.min(900, 260 + Math.abs(a - da) * 2);
    var t0 = 0;
    var giro = ++el.__contaGiro;              /* un conteggio nuovo annulla il vecchio */
    if (isNaN(giro)) giro = el.__contaGiro = 1;

    function passo(t) {
      if (el.__contaGiro !== giro) return;     /* superato da un conteggio piu' nuovo */
      if (!t0) t0 = t;
      var k = Math.min(1, (t - t0) / durata);
      /* frenata dolce: parte veloce e si posa, come un contachilometri */
      var e = 1 - Math.pow(1 - k, 3);
      el.textContent = Math.round(da + (a - da) * e);
      if (k < 1) requestAnimationFrame(passo);
      else el.textContent = a;
    }
    requestAnimationFrame(passo);
  };

  /* =========================================================
     Il numero che vola via ("+142")

     Parte da dove hai toccato e sale. E' l'unica cosa che collega
     il gesto al punteggio: senza, i punti compaiono in alto e non
     si capisce da dove arrivino.
     ========================================================= */
  J.volante = function (da, testo, classe) {
    if (!J.ok() || !da) return;
    var el = document.createElement('div');
    el.className = 'volante ' + (classe || '');
    el.textContent = testo;
    el.style.left = da.x + 'px';
    el.style.top = da.y + 'px';
    document.body.appendChild(el);
    setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 1200);
  };

  /* =========================================================
     Il lampo di esito

     Un velo verde o rosso su tutto lo schermo, brevissimo. Serve
     perche' su un telefono l'occhio sta sul dito, non sulla card:
     il colore lo prendi con la coda dell'occhio anche guardando altrove.
     Tenuto basso di proposito (vedi --velo-op nel CSS): deve farsi
     sentire, non accecare.
     ========================================================= */
  J.lampo = function (tipo) {
    if (!J.ok()) return;
    var el = document.createElement('div');
    el.className = 'velo velo-' + tipo;
    document.body.appendChild(el);
    setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 500);
  };

  /* =========================================================
     Coriandoli

     Un canvas solo, creato quando serve e buttato via quando le
     particelle sono finite: su un telefono un ciclo di disegno
     sempre acceso si sente sulla batteria.

     Il numero di particelle e' tagliato sugli schermi piccoli. Non
     e' pignoleria: 200 particelle su un telefono di qualche anno fa
     fanno scattare l'animazione, e un effetto che scatta e' peggio
     di nessun effetto.
     ========================================================= */
  var COLORI = ['#f5b826', '#2fbf71', '#2f95dd', '#e8544a', '#7a5cd6', '#ffffff'];
  var tela = null, ctx = null, pezzi = [], gira = false;

  function preparaTela() {
    if (tela) return;
    tela = document.createElement('canvas');
    tela.className = 'coriandoli-tela';
    ctx = tela.getContext('2d');
    document.body.appendChild(tela);
  }

  function misura() {
    var d = window.devicePixelRatio || 1;
    tela.width = Math.floor(innerWidth * d);
    tela.height = Math.floor(innerHeight * d);
    tela.style.width = innerWidth + 'px';
    tela.style.height = innerHeight + 'px';
    ctx.setTransform(d, 0, 0, d, 0, 0);
  }

  function ciclo() {
    if (!gira) return;
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    var vivi = 0;
    for (var i = 0; i < pezzi.length; i++) {
      var p = pezzi[i];
      if (p.vita <= 0) continue;
      vivi++;
      p.vx *= 0.99;
      p.vy += 0.24;                       /* gravita' */
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vr;
      p.vita--;
      if (p.y > innerHeight + 40) { p.vita = 0; continue; }
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.globalAlpha = Math.min(1, p.vita / 30);
      ctx.fillStyle = p.col;
      ctx.fillRect(-p.l / 2, -p.h / 2, p.l, p.h);
      ctx.restore();
    }
    if (vivi) requestAnimationFrame(ciclo);
    else spegni();
  }

  var reteDiSicurezza = null;

  function spegni() {
    gira = false;
    pezzi = [];
    if (reteDiSicurezza) { clearTimeout(reteDiSicurezza); reteDiSicurezza = null; }
    if (tela && tela.parentNode) tela.parentNode.removeChild(tela);
    tela = null; ctx = null;
  }

  /* da: {x,y} punto di partenza, oppure niente = dall'alto, a pioggia */
  J.coriandoli = function (quanti, da) {
    if (!J.ok() || !window.requestAnimationFrame) return;
    preparaTela();
    misura();

    var stretto = innerWidth < 520;
    var n = Math.min(stretto ? 70 : 140, quanti || 60);

    for (var i = 0; i < n; i++) {
      var ang, forza;
      if (da) {                            /* scoppio da un punto */
        ang = -Math.PI / 2 + (Math.random() - 0.5) * 2.1;
        forza = 5 + Math.random() * 9;
      } else {                             /* pioggia dall'alto */
        ang = Math.PI / 2 + (Math.random() - 0.5) * 0.7;
        forza = 1 + Math.random() * 3;
      }
      pezzi.push({
        x: da ? da.x : Math.random() * innerWidth,
        y: da ? da.y : -20 - Math.random() * innerHeight * 0.4,
        vx: Math.cos(ang) * forza,
        vy: Math.sin(ang) * forza,
        rot: Math.random() * Math.PI,
        vr: (Math.random() - 0.5) * 0.3,
        l: 6 + Math.random() * 7,
        h: 3 + Math.random() * 5,
        col: COLORI[(Math.random() * COLORI.length) | 0],
        vita: 90 + Math.random() * 90
      });
    }

    /* Rete di sicurezza: requestAnimationFrame si ferma quando la scheda
       va in secondo piano. Se il giocatore esce dall'app mentre i
       coriandoli volano, il ciclo non arriva mai alla fine e la tela
       resterebbe li' con sopra un fermo immagine. Dopo qualche secondo
       si toglie comunque. */
    if (reteDiSicurezza) clearTimeout(reteDiSicurezza);
    reteDiSicurezza = setTimeout(spegni, 7000);

    if (!gira) { gira = true; requestAnimationFrame(ciclo); }
  };

  /* =========================================================
     La serie (combo)

     Vive dentro la barra in cima alla domanda. Non sta nel markup:
     se lo mettessi in index.html andrebbe messo anche in
     index-online.html, e prima o poi le due copie divergerebbero.
     Lo costruisce qui chi lo usa, in un posto solo.
     ========================================================= */
  J.combo = function (n, mult) {
    var testa = document.querySelector('#screen-game .game-head');
    if (!testa) return;
    var el = document.getElementById('g-combo');

    if (n < 3) {                            /* sotto tre non c'e' serie da mostrare */
      if (el && el.parentNode) el.parentNode.removeChild(el);
      return;
    }
    if (!el) {
      el = document.createElement('div');
      el.id = 'g-combo';
      el.className = 'combo';
      var prog = document.getElementById('g-progress');
      if (prog && prog.parentNode === testa) testa.insertBefore(el, prog);
      else testa.appendChild(el);
    }
    /* tre gradini: a 3 si accende, a 5 scalda, a 8 brucia */
    el.className = 'combo combo-' + (n >= 8 ? 3 : n >= 5 ? 2 : 1);
    el.innerHTML = '<span class="combo-fuoco">&#128293;</span>' +
                   '<span class="combo-n">' + n + '</span>' +
                   '<span class="combo-x">&times;' + mult + '</span>';
    if (J.ok()) {
      el.classList.remove('combo-cresce');
      void el.offsetWidth;                  /* riavvia l'animazione */
      el.classList.add('combo-cresce');
    }
  };

  /* la finestra cambia misura mentre i coriandoli volano */
  window.addEventListener('resize', function () { if (tela) misura(); });

})(window.BT);
