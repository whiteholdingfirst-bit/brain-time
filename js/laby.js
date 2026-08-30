/* =========================================================
   BRAIN TIME — labirinti
   Livelli che crescono: il labirinto si allarga, il tempo si
   stringe. Generazione con "recursive backtracker": ogni
   labirinto ha una sola via fra due punti qualsiasi, quindi
   non esistono livelli impossibili.
   ========================================================= */
(function (BT) {
  'use strict';

  var L = null;          // partita in corso
  var timerId = null;
  var canvas = null, ctx = null;

  /* ---------------- misure del livello ---------------- */
  BT.laby = {};

  /* La misura del labirinto la decide il livello; la difficolta' scelta prima
     della partita allunga o accorcia il tempo. Le domande non hanno un grado
     di difficolta' proprio, ma qui il tempo ce l'ha, quindi la scelta conta
     davvero anche nei labirinti. */
  BT.laby.config = function (liv, diffId) {
    var n = Math.min(4 + Math.ceil(liv * 0.8), 18);        // 5, 6, 7 ... fino a 18
    var celle = n * n;
    var d = BT.diff(diffId || BT.store.settings().diff);
    /* tempo generoso all'inizio, sempre piu' stretto salendo */
    var base = celle * (2.2 - Math.min(1.2, liv * 0.05));
    return {
      livello: liv,
      cols: n,
      rows: n,
      diff: d,
      tempo: Math.max(20, Math.round(base * d.tempo))
    };
  };

  /* ---------------- generazione ----------------
     Ogni cella ha quattro muri; si scava un corridoio
     visitando i vicini a caso e tornando indietro nei
     vicoli ciechi.                                    */
  function genera(cols, rows) {
    var celle = [], i, x, y;
    for (i = 0; i < cols * rows; i++) celle.push({ n: true, e: true, s: true, w: true, vista: false });

    var idx = function (x, y) { return y * cols + x; };
    var pila = [{ x: 0, y: 0 }];
    celle[0].vista = true;
    var visitate = 1;

    while (visitate < cols * rows) {
      var cur = pila[pila.length - 1];
      var vicini = [];
      if (cur.y > 0 && !celle[idx(cur.x, cur.y - 1)].vista) vicini.push({ x: cur.x, y: cur.y - 1, mio: 'n', suo: 's' });
      if (cur.x < cols - 1 && !celle[idx(cur.x + 1, cur.y)].vista) vicini.push({ x: cur.x + 1, y: cur.y, mio: 'e', suo: 'w' });
      if (cur.y < rows - 1 && !celle[idx(cur.x, cur.y + 1)].vista) vicini.push({ x: cur.x, y: cur.y + 1, mio: 's', suo: 'n' });
      if (cur.x > 0 && !celle[idx(cur.x - 1, cur.y)].vista) vicini.push({ x: cur.x - 1, y: cur.y, mio: 'w', suo: 'e' });

      if (!vicini.length) { pila.pop(); continue; }

      var scelto = vicini[BT.rnd(0, vicini.length - 1)];
      celle[idx(cur.x, cur.y)][scelto.mio] = false;
      celle[idx(scelto.x, scelto.y)][scelto.suo] = false;
      celle[idx(scelto.x, scelto.y)].vista = true;
      visitate++;
      pila.push({ x: scelto.x, y: scelto.y });
    }
    return celle;
  }

  /* strada pi&ugrave; breve da una cella all'uscita (serve alla mappa e alla bussola) */
  function percorso(da) {
    var cols = L.cols, rows = L.rows;
    var idx = function (x, y) { return y * cols + x; };
    var prima = {}, coda = [{ x: da.x, y: da.y }], visto = {};
    visto[idx(da.x, da.y)] = true;

    while (coda.length) {
      var c = coda.shift();
      if (c.x === L.uscita.x && c.y === L.uscita.y) break;
      var cella = L.celle[idx(c.x, c.y)];
      var mosse = [];
      if (!cella.n) mosse.push({ x: c.x, y: c.y - 1 });
      if (!cella.e) mosse.push({ x: c.x + 1, y: c.y });
      if (!cella.s) mosse.push({ x: c.x, y: c.y + 1 });
      if (!cella.w) mosse.push({ x: c.x - 1, y: c.y });
      mosse.forEach(function (m) {
        var k = idx(m.x, m.y);
        if (visto[k]) return;
        visto[k] = true;
        prima[k] = c;
        coda.push(m);
      });
    }

    var strada = [], cur = { x: L.uscita.x, y: L.uscita.y };
    var guardia = 0;
    while (cur && guardia++ < 5000) {
      strada.unshift(cur);
      if (cur.x === da.x && cur.y === da.y) break;
      cur = prima[idx(cur.x, cur.y)];
    }
    return strada;
  }

  /* ---------------- colori presi dal tema in uso ---------------- */
  function colore(nome, ripiego) {
    var v = getComputedStyle(document.body).getPropertyValue(nome);
    return (v && v.trim()) || ripiego;
  }

  /* ---------------- disegno ---------------- */
  function disegna() {
    if (!ctx || !L) return;
    var lato = L.lato, cols = L.cols, rows = L.rows;
    var muro = colore('--azzurro-800', '#0f4c81');
    var fondo = colore('--carta', '#ffffff');
    var oro = colore('--oro', '#f5b826');
    var verde = colore('--verde', '#2fbf71');

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = fondo;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    /* la via d'uscita, quando un aiuto la rivela */
    if (L.mostraStrada && L.mostraStrada.length) {
      ctx.fillStyle = 'rgba(47,191,113,.28)';
      L.mostraStrada.forEach(function (c) {
        ctx.fillRect(c.x * lato + 3, c.y * lato + 3, lato - 6, lato - 6);
      });
    }

    /* partenza e arrivo */
    ctx.font = Math.round(lato * 0.62) + 'px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🏁', (L.uscita.x + 0.5) * lato, (L.uscita.y + 0.55) * lato);

    /* i muri */
    ctx.strokeStyle = muro;
    ctx.lineWidth = Math.max(2, Math.round(lato * 0.14));
    ctx.lineCap = 'round';
    ctx.beginPath();
    for (var y = 0; y < rows; y++) {
      for (var x = 0; x < cols; x++) {
        var c = L.celle[y * cols + x], px = x * lato, py = y * lato;
        if (c.n) { ctx.moveTo(px, py); ctx.lineTo(px + lato, py); }
        if (c.w) { ctx.moveTo(px, py); ctx.lineTo(px, py + lato); }
        if (x === cols - 1 && c.e) { ctx.moveTo(px + lato, py); ctx.lineTo(px + lato, py + lato); }
        if (y === rows - 1 && c.s) { ctx.moveTo(px, py + lato); ctx.lineTo(px + lato, py + lato); }
      }
    }
    ctx.stroke();

    /* la freccia della bussola */
    if (L.freccia) {
      ctx.fillStyle = oro;
      ctx.font = 'bold ' + Math.round(lato * 0.7) + 'px serif';
      ctx.fillText(L.freccia, (L.pos.x + 0.5) * lato, (L.pos.y + 0.5) * lato - lato * 0.7);
    }

    /* il giocatore */
    ctx.beginPath();
    ctx.fillStyle = verde;
    ctx.arc((L.pos.x + 0.5) * lato, (L.pos.y + 0.5) * lato, lato * 0.28, 0, Math.PI * 2);
    ctx.fill();
    ctx.lineWidth = Math.max(1.5, lato * 0.06);
    ctx.strokeStyle = muro;
    ctx.stroke();
  }

  /* ---------------- movimento ---------------- */
  function muovi(dir) {
    if (!L || L.finita) return;
    var c = L.celle[L.pos.y * L.cols + L.pos.x];
    var nuova = { x: L.pos.x, y: L.pos.y };
    if (dir === 'n' && !c.n) nuova.y--;
    else if (dir === 's' && !c.s) nuova.y++;
    else if (dir === 'e' && !c.e) nuova.x++;
    else if (dir === 'w' && !c.w) nuova.x--;
    else { BT.sfx.play('tempo'); return; }          // muro: piccolo tonfo

    L.pos = nuova;
    L.mosse++;
    L.freccia = null;
    BT.sfx.play('click');

    if (L.pos.x === L.uscita.x && L.pos.y === L.uscita.y) vinto();
    else disegna();
  }

  /* ---------------- tempo ---------------- */
  function avviaTimer() {
    fermaTimer();
    aggiornaBarra();
    timerId = setInterval(function () {
      L.tLeft -= 0.1;
      if (L.tLeft <= 0) { L.tLeft = 0; aggiornaBarra(); perso(); return; }
      aggiornaBarra();
    }, 100);
  }
  function fermaTimer() { if (timerId) { clearInterval(timerId); timerId = null; } }

  function aggiornaBarra() {
    var bar = document.getElementById('laby-timer');
    if (!bar) return;
    var perc = Math.max(0, L.tLeft / L.tTotal * 100);
    bar.style.width = perc + '%';
    bar.className = 'timer-bar' + (perc < 20 ? ' danger' : perc < 45 ? ' warn' : '');
    var t = document.getElementById('laby-secondi');
    if (t) t.textContent = Math.ceil(L.tLeft) + 's';
  }

  /* ---------------- esiti ---------------- */
  function vinto() {
    L.finita = true;
    fermaTimer();
    if (BT.limite) BT.limite.ferma(L.player);
    if (BT.musica) BT.musica.ferma();
    disegna();
    BT.sfx.play('vittoria');

    var impiegati = Math.round((L.tTotal - L.tLeft) * 10) / 10;
    var frazione = L.tLeft / L.tTotal;
    var stelle = frazione > 0.6 ? 3 : frazione > 0.3 ? 2 : 1;
    var primaVolta = L.livello >= L.player.labirinto.livello;

    /* Col teletrasporto si passa, ma a mani vuote: niente punti, niente
       coppe, niente stelle, niente tempo in classifica e nessuna cassa.
       Serve a saltare un labirinto troppo difficile, non a farsi i punti
       senza giocare: se desse premi, converrebbe usarlo sempre e i
       labirinti smetterebbero di voler dire qualcosa. */
    /* allenamento: si gioca e basta, il profilo non si tocca */
    if (L.allena) {
      BT.laby.mostraEsito({
        vinto: true, allena: true, stelle: stelle, secondi: impiegati, mosse: L.mosse,
        punti: 0, coppe: 0, livello: L.livello,
        salita: { levelUp: false }, primaVolta: false
      });
      return;
    }

    if (L.barato) {
      BT.store.sbloccaLabirinto(L.player, L.livello);
      BT.laby.mostraEsito({
        vinto: true, barato: true, stelle: 0, secondi: impiegati, mosse: L.mosse,
        punti: 0, coppe: 0, livello: L.livello,
        salita: { levelUp: false }, primaVolta: primaVolta
      });
      return;
    }

    var coppe = primaVolta ? 3 + L.livello + (stelle - 1) * 2 : 2;
    var punti = primaVolta ? 60 + 30 * L.livello + (stelle - 1) * 40 : Math.round((60 + 30 * L.livello) * 0.3);

    var salita = BT.store.premiaLabirinto(L.player, punti, coppe);
    BT.store.salvaLabirinto(L.player, L.livello, impiegati);

    /* La cassa e' legata al LIVELLO CERVELLO, non alla partita: finire un
       labirinto non basta, deve farti salire di livello. Vale in tutte le
       modalita' (qui e in game.js), cosi' la regola e' una sola. */
    if (salita.levelUp) BT.store.aggiungiCassa(L.player);

    BT.laby.mostraEsito({
      vinto: true, stelle: stelle, secondi: impiegati, mosse: L.mosse,
      punti: punti, coppe: coppe, livello: L.livello, salita: salita, primaVolta: primaVolta
    });
  }

  function perso() {
    L.finita = true;
    fermaTimer();
    if (BT.limite) BT.limite.ferma(L.player);
    if (BT.musica) BT.musica.ferma();
    BT.sfx.play('sbagliato');
    BT.laby.mostraEsito({ vinto: false, livello: L.livello });
  }

  /* ---------------- avvio di un livello ---------------- */
  BT.laby.gioca = function (player, livello, opzioni) {
    var cfg = BT.laby.config(livello);
    BT.store.normalizza(player);

    L = {
      player: player, livello: livello,
      cols: cfg.cols, rows: cfg.rows,
      celle: genera(cfg.cols, cfg.rows),
      pos: { x: 0, y: 0 },
      uscita: { x: cfg.cols - 1, y: cfg.rows - 1 },
      mosse: 0, finita: false,
      tTotal: cfg.tempo, tLeft: cfg.tempo,
      mostraStrada: null, freccia: null,
      bussolaRimaste: 0,
      /* in allenamento il labirinto non da' e non toglie niente,
         esattamente come il quiz di allenamento */
      allena: !!(opzioni && opzioni.allena)
    };

    BT.show('screen-laby');

    canvas = document.getElementById('laby-canvas');
    var box = canvas.parentNode;
    var largh = Math.min(box.clientWidth || 340, 420);
    L.lato = Math.floor((largh - 6) / cfg.cols);
    canvas.width = L.lato * cfg.cols + 4;
    canvas.height = L.lato * cfg.rows + 4;
    canvas.style.width = canvas.width + 'px';
    canvas.style.height = canvas.height + 'px';
    ctx = canvas.getContext('2d');
    ctx.setTransform(1, 0, 0, 1, 2, 2);

    document.getElementById('laby-livello').innerHTML =
      'Labirinto ' + livello + ' &middot; ' + cfg.cols + '&times;' + cfg.rows +
      ' &middot; ' + cfg.diff.ico + ' ' + cfg.diff.name;
    aggiornaAiuti();
    disegna();
    avviaTimer();
    if (BT.limite) BT.limite.avvia(player);
    if (BT.musica) BT.musica.avvia(livello);
  };

  /* ---------------- aiuti dedicati ---------------- */
  function aggiornaAiuti() {
    var box = document.getElementById('laby-aiuti');
    if (!box) return;
    box.innerHTML = '';
    ['bussola', 'mappa'].forEach(function (id) {
      var pu = null;
      BT.POWERUPS.forEach(function (x) { if (x.id === id) pu = x; });
      if (!pu) return;
      var n = L.player.inventory[id] || 0;
      var b = document.createElement('button');
      b.className = 'pw';
      b.title = pu.desc;
      b.innerHTML = pu.ico + ' ' + pu.name + ' <span class="pw-n">' + n + '</span>';
      b.disabled = n <= 0 || L.finita;
      b.onclick = function () { usaAiuto(id); };
      box.appendChild(b);
    });
  }

  function usaAiuto(id) {
    if (!L || L.finita) return;
    if (!L.player.inventory[id]) { BT.toast('Non hai questo aiuto. Comprane al Negozio!'); return; }
    BT.store.consume(L.player, id);

    if (id === 'mappa') {
      L.mostraStrada = percorso(L.pos);
      disegna();
      BT.toast('Ecco la via d\'uscita! 🗺️');
      setTimeout(function () { if (L) { L.mostraStrada = null; disegna(); } }, 2000);
    } else if (id === 'bussola') {
      L.bussolaRimaste = 3;
      mostraFreccia();
      BT.toast('La bussola ti guida per tre mosse 🧭');
    }
    aggiornaAiuti();
    BT.refreshTopbar();
  }

  /* La bussola: dall'alto indica un punto cardinale, in prima persona
     non servirebbe a niente, quindi diventa "gira di la'". */
  function mostraFreccia() {
    if (!L || L.finita || L.bussolaRimaste <= 0) return;
    var strada = percorso(L.pos);
    if (strada.length < 2) return;
    var p = strada[1];
    L.freccia = p.y < L.pos.y ? '⬆️' : p.y > L.pos.y ? '⬇️' : p.x > L.pos.x ? '➡️' : '⬅️';
    L.bussolaRimaste--;
    disegna();
    setTimeout(function () { if (L && !L.finita) { L.freccia = null; disegna(); } }, 900);
  }

  /* ---------------- comandi ---------------- */
  BT.laby.muovi = function (dir) {
    muovi(dir);
    if (L && !L.finita && L.bussolaRimaste > 0) setTimeout(mostraFreccia, 60);
  };
  /* Il codice segreto: scrivendo "tele" dentro un labirinto si finisce
     dritti all'uscita. Passa il livello, ma senza premi: vedi vinto(). */
  BT.laby.teletrasporto = function () {
    if (!L || L.finita) return false;
    L.barato = true;
    L.pos = { x: L.uscita.x, y: L.uscita.y };
    L.mosse++;
    BT.sfx.play('livello');
    vinto();
    return true;
  };

  BT.laby.abbandona = function () {
    fermaTimer();
    if (BT.limite && L) BT.limite.ferma(L.player);
    if (BT.musica) BT.musica.ferma();
    L = null;
  };
  BT.laby.inCorso = function () { return L && !L.finita; };
  BT.laby.stato = function () { return L; };            // utile per collaudare
  BT.laby.viaLibera = function () { return L ? percorso(L.pos) : []; };

  /* swipe sul labirinto */
  BT.laby.collegaGesti = function (el) {
    var x0 = 0, y0 = 0;
    el.addEventListener('touchstart', function (e) {
      var t = e.changedTouches[0]; x0 = t.clientX; y0 = t.clientY;
    }, { passive: true });
    el.addEventListener('touchend', function (e) {
      var t = e.changedTouches[0];
      var dx = t.clientX - x0, dy = t.clientY - y0;
      if (Math.abs(dx) < 18 && Math.abs(dy) < 18) return;
      if (Math.abs(dx) > Math.abs(dy)) BT.laby.muovi(dx > 0 ? 'e' : 'w');
      else BT.laby.muovi(dy > 0 ? 's' : 'n');
    }, { passive: true });
  };

})(window.BT);
