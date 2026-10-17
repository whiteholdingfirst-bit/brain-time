/* =========================================================
   BRAIN TIME — la scenografia delle vesti

   Prima una veste era: quattro colori piu' dieci emoji ferme ai
   bordi. Richiesta: *"vogliamo skin piu' accattivanti con grafica
   avanzata"*. Giusta: un cambio di palette si nota, ma non fa
   sembrare il gioco un altro posto.

   Adesso ogni veste ha due strati in piu':

   1. UNA SCENA ferma (SVG): un astro che brilla, un alone, e un
      profilo all'orizzonte - colline, alberi, tetti, onde, dune.
      E' quello che trasforma "arancione" in "un pomeriggio
      d'autunno". Costa zero: si disegna una volta e sta li'.
   2. DELLE PARTICELLE che si muovono (canvas): foglie che cadono,
      neve, coriandoli, petali, bollicine, scintille.

   ⚠️ Niente immagini, e non per pigrizia: un PNG per undici vesti
   vuol dire megabyte da scaricare sul telefono di un compagno di
   classe, piu' i diritti d'uso da verificare. Qui e' tutto
   geometria: pesa qualche kilobyte e si ridimensiona da solo.

   Le tre regole, tutte e tre non negoziabili:
   - i colori si leggono dalle VARIABILI CSS della veste in corso,
     non si riscrivono qui: unico posto dove stanno i colori resta
     il foglio di stile;
   - la scena da sola deve bastare. Le particelle sono un di piu':
     con prefers-reduced-motion non vengono proprio create, e il
     gioco resta bello lo stesso;
   - il ciclo di animazione si ferma quando la scheda non si vede.
     Un telefono in tasca non deve disegnare foglie per nessuno.
   ========================================================= */
(function (BT) {
  'use strict';

  /* ---------------------------------------------------------
     Che cosa c'e' in ogni scena.

     astro   : sole/luna. [x%, y%, raggio in % della larghezza]
     orizzonte: che profilo disegnare in fondo
     parti   : le particelle - come si muovono e come sono fatte
     --------------------------------------------------------- */
  var SCENE = {
    autunno: {
      astro: [78, 20, 11], astroColore: 'neon-2', alone: .30,
      orizzonte: 'colline', strati: 2,
      parti: { moto: 'cade', forma: 'foglia', n: 16, vel: [14, 30], mis: [7, 14], gira: true }
    },
    halloween: {
      astro: [80, 16, 13], astroColore: 'neon', alone: .34,
      orizzonte: 'alberi', strati: 2,
      parti: { moto: 'vaga', forma: 'pipistrello', n: 9, vel: [26, 52], mis: [8, 15] }
    },
    inverno: {
      astro: [22, 17, 9], astroColore: 'neon-chiaro', alone: .26,
      orizzonte: 'montagne', strati: 2,
      parti: { moto: 'cade', forma: 'fiocco', n: 26, vel: [12, 26], mis: [3, 7] }
    },
    natale: {
      astro: [50, 12, 7], astroColore: 'neon-2', alone: .30,
      orizzonte: 'abeti', strati: 2,
      parti: { moto: 'cade', forma: 'fiocco', n: 22, vel: [10, 22], mis: [3, 7] }
    },
    carnevale: {
      astro: [72, 15, 10], astroColore: 'neon-2', alone: .34,
      orizzonte: 'tetti', strati: 1,
      parti: { moto: 'cade', forma: 'coriandolo', n: 24, vel: [22, 46], mis: [5, 10], gira: true, multicolore: true }
    },
    pasqua: {
      astro: [76, 19, 10], astroColore: 'neon', alone: .28,
      orizzonte: 'colline', strati: 2,
      parti: { moto: 'cade', forma: 'petalo', n: 18, vel: [12, 26], mis: [6, 11], gira: true }
    },
    primavera: {
      astro: [74, 18, 10], astroColore: 'neon', alone: .28,
      orizzonte: 'colline', strati: 2,
      parti: { moto: 'cade', forma: 'petalo', n: 20, vel: [11, 24], mis: [6, 12], gira: true }
    },
    primomaggio: {
      astro: [24, 16, 9], astroColore: 'neon-2', alone: .26,
      orizzonte: 'citta', strati: 2,
      parti: { moto: 'sale', forma: 'scintilla', n: 18, vel: [26, 54], mis: [2, 5] }
    },
    duegiugno: {
      astro: [50, 14, 8], astroColore: 'neon-chiaro', alone: .26,
      orizzonte: 'citta', strati: 2,
      parti: { moto: 'cade', forma: 'coriandolo', n: 18, vel: [20, 40], mis: [5, 9], gira: true, tricolore: true }
    },
    finescuola: {
      astro: [78, 17, 12], astroColore: 'neon', alone: .34,
      orizzonte: 'colline', strati: 2,
      parti: { moto: 'cade', forma: 'coriandolo', n: 22, vel: [24, 48], mis: [5, 10], gira: true, multicolore: true }
    },
    estate: {
      astro: [80, 15, 13], astroColore: 'neon-2', alone: .34,
      orizzonte: 'onde', strati: 2,
      parti: { moto: 'sale', forma: 'bolla', n: 14, vel: [16, 34], mis: [5, 13] }
    },
    compleanno: {
      astro: [50, 13, 9], astroColore: 'neon-2', alone: .34,
      orizzonte: 'tetti', strati: 1,
      parti: { moto: 'sale', forma: 'palloncino', n: 11, vel: [14, 30], mis: [11, 20], multicolore: true }
    }
  };

  /* Caso a caso serve un numero pseudo-casuale che pero' NON cambi
     fra un disegno e l'altro: una collina che si rimodella a ogni
     cambio di schermata sembra un difetto. Seme fisso. */
  function dado(seme) {
    var s = seme;
    return function () {
      s = (s * 1103515245 + 12345) % 2147483648;
      return s / 2147483648;
    };
  }

  function colore(nome, ripiego) {
    var v = getComputedStyle(document.body).getPropertyValue('--' + nome);
    return (v && v.trim()) || ripiego;
  }

  /* ---------------------------------------------------------
     I PROFILI ALL'ORIZZONTE
     Ognuno restituisce un path SVG su una griglia 0..1000 larga e
     0..200 alta, da appoggiare in fondo allo schermo.
     --------------------------------------------------------- */
  var ORIZZONTI = {
    colline: function (r, k) {
      var d = 'M0 200 L0 120', x = 0;
      while (x < 1000) {
        var w = (160 + r() * 180) * k, h = 50 + r() * 60;
        d += ' Q' + (x + w / 2) + ' ' + (120 - h) + ' ' + (x + w) + ' 120';
        x += w;
      }
      return d + ' L1000 200 Z';
    },
    montagne: function (r, k) {
      var d = 'M0 200 L0 140', x = 0;
      while (x < 1000) {
        var w = (120 + r() * 140) * k, h = 70 + r() * 70;
        d += ' L' + (x + w / 2) + ' ' + (140 - h) + ' L' + (x + w) + ' 140';
        x += w;
      }
      return d + ' L1000 200 Z';
    },
    alberi: function (r, k) {
      /* rami spogli: tronchi sottili con due forcelle */
      var d = 'M0 200 L0 160 L1000 160 L1000 200 Z', x = 20;
      while (x < 1000) {
        var h = 60 + r() * 70, w = (7 + r() * 5) * k;
        d += ' M' + x + ' 160 L' + (x + w / 2) + ' ' + (160 - h) + ' L' + (x + w) + ' 160 Z';
        d += ' M' + (x + w / 2) + ' ' + (160 - h * .6) + ' L' + (x - 16 * k) + ' ' + (160 - h * .95) +
             ' L' + (x + w / 2 - 2) + ' ' + (160 - h * .62) + ' Z';
        d += ' M' + (x + w / 2) + ' ' + (160 - h * .7) + ' L' + (x + w + 18 * k) + ' ' + (160 - h * 1.02) +
             ' L' + (x + w / 2 + 2) + ' ' + (160 - h * .72) + ' Z';
        x += (90 + r() * 90) * k;
      }
      return d;
    },
    abeti: function (r, k) {
      var d = 'M0 200 L0 165 L1000 165 L1000 200 Z', x = 10;
      while (x < 1000) {
        var h = 60 + r() * 75, w = (34 + r() * 26) * k;
        /* tre gradini: la forma dell'abete si legge subito */
        d += ' M' + x + ' 165 L' + (x + w / 2) + ' ' + (165 - h) + ' L' + (x + w) + ' 165 Z';
        d += ' M' + (x + w * .1) + ' ' + (165 - h * .42) + ' L' + (x + w / 2) + ' ' + (165 - h * .88) +
             ' L' + (x + w * .9) + ' ' + (165 - h * .42) + ' Z';
        x += w + (18 + r() * 40) * k;
      }
      return d;
    },
    tetti: function (r, k) {
      var d = 'M0 200 L0 150', x = 0;
      while (x < 1000) {
        var w = (70 + r() * 90) * k, h = 30 + r() * 70;
        d += ' L' + x + ' ' + (150 - h) + ' L' + (x + w) + ' ' + (150 - h);
        x += w;
      }
      return d + ' L1000 200 Z';
    },
    citta: function (r, k) {
      var d = 'M0 200 L0 150', x = 0;
      while (x < 1000) {
        var w = (46 + r() * 60) * k, h = 40 + r() * 95;
        d += ' L' + x + ' ' + (150 - h) + ' L' + (x + w) + ' ' + (150 - h);
        x += w + 6 * k;
      }
      return d + ' L1000 200 Z';
    },
    onde: function (r, k) {
      var d = 'M0 200 L0 150', x = 0;
      while (x < 1000) {
        var w = (90 + r() * 70) * k;
        d += ' Q' + (x + w / 4) + ' 132 ' + (x + w / 2) + ' 150' +
             ' Q' + (x + w * .75) + ' 168 ' + (x + w) + ' 150';
        x += w;
      }
      return d + ' L1000 200 Z';
    }
  };

  /* ---------------------------------------------------------
     LA SCENA FERMA (SVG)
     --------------------------------------------------------- */
  /* ⚠️ Due strati separati, e non uno solo, per una ragione precisa.

     La prima versione metteva tutto in un <svg viewBox="0 0 1000 1000"
     preserveAspectRatio="none">: su uno schermo di telefono (375x812)
     quel quadrato viene stirato in verticale, e **la luna diventa
     un'ellisse**. Si vedeva benissimo.

     - il CIELO (astro e alone) si fa con elementi normali e
       aspect-ratio:1, cosi' un cerchio resta un cerchio su qualunque
       schermo;
     - l'ORIZZONTE resta un SVG stirato di proposito, ancorato in
       fondo: delle colline piu' larghe o piu' strette sono ancora
       colline, e lo stiramento li' non si nota. */
  function costruisciScena(id, sc) {
    var neon = colore('neon', '#38e1ff');
    var neon2 = colore('neon-2', '#ff3d8b');
    var astroC = colore(sc.astroColore, neon);
    var cielo3 = colore('cielo-3', '#1a1140');
    var r = dado(id.length * 7919 + 13);
    var ax = sc.astro[0], ay = sc.astro[1], ar = sc.astro[2];

    /* --- l'alone e l'astro, in due elementi sovrapposti: cosi' il
           bordo resta netto dentro la luce --- */
    var s = '<div class="sc-alone" style="left:' + ax + '%;top:' + ay + '%;width:' + (ar * 8.4) +
            '%;background:radial-gradient(circle closest-side,' + astroC + ' 0%,' +
            astroC + '55 24%,transparent 70%);opacity:' + sc.alone + '"></div>';
    s += '<div class="sc-astro" style="left:' + ax + '%;top:' + ay + '%;width:' + (ar * 2) +
         '%;background:' + astroC + '"></div>';

    /* --- le stelle: qui lo stiramento non conta, sono punti --- */
    s += '<svg class="sc-stelle" viewBox="0 0 1000 1000" preserveAspectRatio="none" aria-hidden="true">';
    for (var i = 0; i < 30; i++) {
      var sx = r() * 1000, sy = r() * 560;
      if (Math.abs(sx - ax * 10) < ar * 18 && Math.abs(sy - ay * 10) < ar * 18) continue;
      s += '<circle cx="' + sx.toFixed(0) + '" cy="' + sy.toFixed(0) + '" r="' +
           (1.4 + r() * 2.2).toFixed(1) + '" fill="' + neon2 + '" opacity="' +
           (0.14 + r() * 0.34).toFixed(2) + '"/>';
    }
    s += '</svg>';

    /* --- l'orizzonte, in fondo. Due strati: quello dietro, piu'
           chiaro e piu' alto, da' profondita' con due righe --- */
    /* ⚠️ Lo schiacciamento va MISURATO, non indovinato.
       La fascia e' larga quanto lo schermo e alta min(34vh, 300px):
       il viewBox mappa 1000 unita' sulla larghezza e 200 sull'altezza,
       quindi un'unita' orizzontale e una verticale non valgono lo
       stesso. Su un telefono l'orizzontale e' schiacciata ~3,7 volte,
       su un computer ~1,1: senza compensare, i tronchi degli alberi
       diventano fili di un pixel sul telefono e sono giusti solo sul
       computer. 'k' rimette tutto in proporzione su tutti e due. */
    var hFascia = Math.min(alt * 0.34, 300) || 220;
    var k = Math.max(1, (hFascia / 200) / (Math.max(larg, 1) / 1000));

    var fai = ORIZZONTI[sc.orizzonte] || ORIZZONTI.colline;
    s += '<svg class="sc-terra" viewBox="0 0 1000 200" preserveAspectRatio="none" aria-hidden="true">';
    s += '<defs><linearGradient id="sc-g-' + id + '" x1="0" y1="0" x2="0" y2="1">' +
         '<stop offset="0" stop-color="' + cielo3 + '"/>' +
         '<stop offset="100%" stop-color="#000"/></linearGradient></defs>';
    if (sc.strati > 1) {
      s += '<g opacity=".34" transform="translate(0,-18)">' +
           '<path d="' + fai(dado(id.length * 104729 + 7), k) + '" fill="' + neon + '"/></g>';
    }
    s += '<path d="' + fai(dado(id.length * 7919 + 101), k) + '" fill="url(#sc-g-' + id + ')"/>';
    s += '</svg>';
    return s;
  }

  /* ---------------------------------------------------------
     LE PARTICELLE (canvas)
     --------------------------------------------------------- */
  var tela = null, ctx = null, pezzi = [], gira = false, cfg = null, tinte = [];
  var ultimo = 0;
  /* La misura in uso. NON si legge window.innerWidth ogni volta: va
     presa una volta e tenuta qui, perche' da piu' di un posto arriva
     zero. Nel pannello di anteprima innerWidth vale proprio 0, e una
     tela 0x0 non disegna niente senza dare nessun errore. */
  var larg = 0, alt = 0;

  function misura() {
    var box = document.getElementById('bt-scena');
    var r = box ? box.getBoundingClientRect() : null;
    larg = Math.round((r && r.width) || window.innerWidth ||
                      document.documentElement.clientWidth || 360);
    alt = Math.round((r && r.height) || window.innerHeight ||
                     document.documentElement.clientHeight || 640);
  }

  function dimensiona() {
    if (!tela) return;
    misura();
    var dpr = Math.min(window.devicePixelRatio || 1, 2);   /* oltre 2 non si vede e costa */
    tela.width = Math.round(larg * dpr);
    tela.height = Math.round(alt * dpr);
    tela.style.width = larg + 'px';
    tela.style.height = alt + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function nuovo(p, primaVolta) {
    p.x = Math.random() * larg;
    p.mis = cfg.mis[0] + Math.random() * (cfg.mis[1] - cfg.mis[0]);
    p.v = cfg.vel[0] + Math.random() * (cfg.vel[1] - cfg.vel[0]);
    p.a = Math.random() * Math.PI * 2;
    p.va = (Math.random() - 0.5) * 2;
    p.onda = 0.4 + Math.random() * 1.1;
    p.fase = Math.random() * Math.PI * 2;
    p.tinta = tinte[Math.floor(Math.random() * tinte.length)];
    p.op = 0.35 + Math.random() * 0.45;
    if (cfg.moto === 'sale') p.y = primaVolta ? Math.random() * alt : alt + p.mis * 2;
    else p.y = primaVolta ? Math.random() * alt : -p.mis * 2;
    return p;
  }

  function disegnaPezzo(p) {
    ctx.save();
    ctx.translate(p.x, p.y);
    if (cfg.gira) ctx.rotate(p.a);
    ctx.globalAlpha = p.op;
    ctx.fillStyle = p.tinta;
    var m = p.mis;

    switch (cfg.forma) {
      case 'fiocco':
        /* una stellina a sei punte: tre righe incrociate. Un cerchio
           sembrerebbe pioggia, non neve. */
        ctx.strokeStyle = p.tinta;
        ctx.lineWidth = Math.max(1, m / 5);
        ctx.lineCap = 'round';
        for (var k = 0; k < 3; k++) {
          var ang = k * Math.PI / 3;
          ctx.beginPath();
          ctx.moveTo(-Math.cos(ang) * m, -Math.sin(ang) * m);
          ctx.lineTo(Math.cos(ang) * m, Math.sin(ang) * m);
          ctx.stroke();
        }
        break;
      case 'foglia':
        ctx.beginPath();
        ctx.moveTo(0, -m);
        ctx.quadraticCurveTo(m, -m * .2, 0, m);
        ctx.quadraticCurveTo(-m, -m * .2, 0, -m);
        ctx.fill();
        break;
      case 'petalo':
        ctx.beginPath();
        ctx.ellipse(0, 0, m * .55, m, 0, 0, Math.PI * 2);
        ctx.fill();
        break;
      case 'coriandolo':
        ctx.fillRect(-m / 2, -m / 4, m, m / 2);
        break;
      case 'scintilla':
        ctx.beginPath();
        ctx.arc(0, 0, m * .5, 0, Math.PI * 2);
        ctx.fill();
        break;
      case 'bolla':
        ctx.strokeStyle = p.tinta;
        ctx.lineWidth = Math.max(1, m / 7);
        ctx.beginPath();
        ctx.arc(0, 0, m, 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = p.op * .25;
        ctx.fill();
        break;
      case 'pipistrello':
        /* due ali e un corpo: a questa misura basta e si riconosce */
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.quadraticCurveTo(-m * .6, -m * .8, -m * 1.4, -m * .1);
        ctx.quadraticCurveTo(-m * .7, m * .1, 0, m * .35);
        ctx.quadraticCurveTo(m * .7, m * .1, m * 1.4, -m * .1);
        ctx.quadraticCurveTo(m * .6, -m * .8, 0, 0);
        ctx.fill();
        break;
      case 'palloncino':
        ctx.beginPath();
        ctx.ellipse(0, 0, m * .62, m * .78, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = p.tinta;
        ctx.globalAlpha = p.op * .5;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, m * .78);
        ctx.quadraticCurveTo(m * .25, m * 1.5, 0, m * 2.1);
        ctx.stroke();
        break;
      default:
        ctx.beginPath();
        ctx.arc(0, 0, m * .5, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.restore();
  }

  function ciclo(ora) {
    if (!gira || !tela) return;
    /* dt in secondi, tagliato: tornando da una scheda in secondo
       piano il salto sarebbe enorme e le particelle sparirebbero
       tutte in un fotogramma */
    var dt = Math.min((ora - ultimo) / 1000, 0.05);
    ultimo = ora;
    ctx.clearRect(0, 0, larg, alt);

    for (var i = 0; i < pezzi.length; i++) {
      var p = pezzi[i];
      p.fase += dt * p.onda;
      if (cfg.moto === 'sale') {
        p.y -= p.v * dt;
        p.x += Math.sin(p.fase) * 14 * dt;
        if (p.y < -p.mis * 3) nuovo(p);
      } else if (cfg.moto === 'vaga') {
        p.x += p.v * dt;
        p.y += Math.sin(p.fase) * 26 * dt;
        if (p.x > larg + p.mis * 3) { nuovo(p); p.x = -p.mis * 3; p.y = Math.random() * alt * .6; }
      } else {
        p.y += p.v * dt;
        p.x += Math.sin(p.fase) * 22 * dt;
        if (p.y > alt + p.mis * 3) nuovo(p);
      }
      if (cfg.gira) p.a += p.va * dt;
      disegnaPezzo(p);
    }
    requestAnimationFrame(ciclo);
  }

  function avviaParticelle(sc) {
    cfg = sc.parti;
    if (!cfg) return;

    /* Quante: tagliate sugli schermi piccoli, che sono quelli dei
       telefoni scarsi. Un effetto che scatta e' peggio di nessun
       effetto - stessa regola di juice.js. */
    misura();
    var quante = cfg.n;
    if (larg < 520) quante = Math.round(quante * 0.55);
    else if (larg < 820) quante = Math.round(quante * 0.78);

    var neon = colore('neon', '#38e1ff');
    var chiaro = colore('neon-chiaro', '#8df0ff');
    var neon2 = colore('neon-2', '#ff3d8b');
    tinte = cfg.multicolore ? [neon, chiaro, neon2, colore('oro', '#ffc542')]
          : cfg.tricolore ? ['#5ce89a', '#ffffff', '#ff5a52']
          : [chiaro, neon];

    tela = document.createElement('canvas');
    tela.className = 'sc-tela';
    tela.setAttribute('aria-hidden', 'true');
    ctx = tela.getContext('2d');
    dimensiona();

    pezzi = [];
    for (var i = 0; i < quante; i++) pezzi.push(nuovo({}, true));
    return tela;
  }

  function ferma() {
    gira = false;
    if (tela && tela.parentNode) tela.parentNode.removeChild(tela);
    tela = null; ctx = null; pezzi = []; cfg = null;
  }

  /* Una scheda in secondo piano non deve disegnare niente: i
     fotogrammi non arrivano comunque, ma senza questo al ritorno il
     ciclo riparte da un tempo vecchissimo. */
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) { gira = false; }
    else if (tela && !gira) { gira = true; ultimo = 0; requestAnimationFrame(function (t) { ultimo = t; requestAnimationFrame(ciclo); }); }
  });

  var ridimensiona = null;
  window.addEventListener('resize', function () {
    if (!tela) return;
    clearTimeout(ridimensiona);
    ridimensiona = setTimeout(dimensiona, 180);
  });

  BT.scena = {

    /* Monta scena e particelle per la veste indicata; con null
       toglie tutto e il gioco torna com'e' disegnato di suo. */
    monta: function (veste) {
      var vecchia = document.getElementById('bt-scena');
      if (vecchia) vecchia.remove();
      ferma();
      if (!veste) return;

      var sc = SCENE[veste.id];
      if (!sc) return;

      var box = document.createElement('div');
      box.className = 'bt-scena';
      box.id = 'bt-scena';
      box.setAttribute('aria-hidden', 'true');
      /* Si attacca VUOTO e si misura, poi si disegna: sia la tela
         delle particelle sia la compensazione dello schiacciamento
         hanno bisogno delle misure vere, e un riquadro non ancora nel
         documento non ne ha. */
      document.body.appendChild(box);
      misura();
      box.innerHTML = costruisciScena(veste.id, sc);

      /* Le particelle sono il di piu': se il moto da' fastidio, la
         scena resta e nessuno si accorge che manca qualcosa. */
      if (BT.juice && BT.juice.ok() && window.requestAnimationFrame) {
        var t = avviaParticelle(sc);
        if (t) {
          box.appendChild(t);
          gira = true;
          requestAnimationFrame(function (ora) { ultimo = ora; requestAnimationFrame(ciclo); });
        }
      }
    }
  };

})(window.BT);
