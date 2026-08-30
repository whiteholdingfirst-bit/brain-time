/* =========================================================
   BRAIN TIME — motore di gioco
   Tre modi di giocare:
   - allenamento : nessun punto in palio, si sbaglia in pace;
   - gioca       : le risposte giuste danno punti, le sbagliate ne tolgono;
   - duello      : a staffetta, risponde prima uno poi l'altro e solo dopo
                   lo schermo si sdoppia e mostra a entrambi com'e' andata.
   ========================================================= */
(function (BT) {
  'use strict';

  var G = null;              // partita in corso
  var timerId = null;

  function streakMult(s) {
    if (s >= 8) return 2;
    if (s >= 5) return 1.5;
    if (s >= 3) return 1.2;
    return 1;
  }

  function emptyRun() {
    return { score: 0, correct: 0, answered: 0, skipped: 0, bestStreak: 0,
             coins: 0, persi: 0, byCat: {} };
  }

  /* secondi a disposizione: quelli del livello, allungati o accorciati
     dalla difficolta' scelta */
  function tempoDomanda(p) {
    return Math.max(10, Math.round(BT.LEVELS[p.level].time * G.diff.tempo));
  }

  /* in allenamento il punteggio non c'e': l'elemento non esiste */
  function aggiornaPunteggio(run) {
    var el = document.getElementById('g-score');
    if (el) el.textContent = run.score;
  }

  var KEYS = ['A', 'B', 'C', 'D'];

  BT.game = {

    /* ================= avvio ================= */
    start: function (cfg) {
      var d = BT.diff(cfg.diff || BT.store.settings().diff);
      if (BT.limite) BT.limite.avvia(cfg.players[0]);   /* limite dei 30 minuti */
      G = {
        mode: cfg.mode,                 // 'solo' | 'duel'
        tipo: cfg.tipo || 'gioca',      // 'allena' (niente punti) | 'gioca' (punti, con penalita')
        diff: d,
        extra: cfg.extra || null,       // dati liberi (usati dalle sfide a distanza)
        players: cfg.players,
        cats: cfg.cats,
        qLen: cfg.qLen || d.qLen,
        round: 0,
        turn: 0,
        runs: cfg.players.map(emptyRun),
        used: cfg.players.map(function () { return {}; }),
        streaks: cfg.players.map(function () { return 0; }),
        pending: [null, null],
        q: null,
        locked: false,
        secondChance: false,
        moltiplicatore: 1,      // 1 normale, 2 punti doppi, 3 punti tripli
        scudo: false,           // salva la serie da un errore
        congelato: false,       // timer fermo su questa domanda
        usedThisQ: {},
        tLeft: 0, tTotal: 0
      };
      BT.game.startRound();
    },

    startRound: function () {
      G.pending = [null, null];
      G.turn = 0;
      if (G.mode === 'duel') BT.game.showPass();
      else BT.game.loadQuestion();
    },

    /* ================= passaggio del dispositivo ================= */
    showPass: function () {
      var p = G.players[G.turn];
      document.getElementById('pass-name').innerHTML = BT.avatar(p.avatar) + ' ' + BT.esc(p.name);
      var avversario = G.players[1 - G.turn];
      var sub;
      if (G.round === 0 && G.turn === 0) {
        sub = 'Domanda 1 di ' + G.qLen + ', livello <b>' + BT.LEVELS[p.level].name + '</b>.<br>' +
              avversario.name + ' non deve guardare lo schermo!';
      } else if (G.turn === 0) {
        sub = 'Domanda ' + (G.round + 1) + ' di ' + G.qLen + '. Punteggio: <b>' +
              G.runs[0].score + '</b> a <b>' + G.runs[1].score + '</b>.';
      } else {
        sub = avversario.name + ' ha risposto. Ora tocca a te, con una domanda di livello <b>' +
              BT.LEVELS[p.level].name + '</b>.<br>Nessun suggerimento da fuori!';
      }
      document.getElementById('pass-sub').innerHTML = sub;
      BT.show('screen-pass');
    },

    beginTurn: function () { BT.game.loadQuestion(); },

    /* ================= domanda ================= */
    loadQuestion: function () {
      var p = G.players[G.turn];
      G.q = BT.bank.draw(G.cats, p.level, G.used[G.turn], G.diff.salto);
      G.locked = false;
      G.secondChance = false;
      G.moltiplicatore = 1;
      G.scudo = false;
      G.congelato = false;
      G.usedThisQ = {};
      G.tTotal = tempoDomanda(p);
      G.tLeft = G.tTotal;

      BT.game.render();
      BT.show('screen-game');
      startTimer();
    },

    render: function () {
      var p = G.players[G.turn], q = G.q, run = G.runs[G.turn];

      document.getElementById('screen-game').classList.toggle('senza-punti', G.tipo === 'allena');

      document.getElementById('g-player').innerHTML =
        '<span>' + BT.avatar(p.avatar) + '</span> ' + BT.esc(p.name);
      document.getElementById('g-progress').innerHTML =
        'Domanda ' + (G.round + 1) + ' / ' + G.qLen + ' &middot; ' + G.diff.ico;
      document.getElementById('g-score-wrap').innerHTML = G.tipo === 'allena'
        ? '<span class="g-allena">🎓 Allenamento</span>'
        : '<span id="g-score">' + run.score + '</span><small>pt</small>';

      var info = BT.catInfo(q.cat);
      var serie = G.streaks[G.turn];
      document.getElementById('q-cat').innerHTML =
        info.ico + ' ' + (q.tag || info.name) +
        (serie >= 3 ? ' &nbsp;·&nbsp; 🔥 serie x' + streakMult(serie) : '');

      var board = document.getElementById('q-board');
      if (q.board) {
        board.innerHTML = BT.renderBoard(q.board, q.turn);
        board.classList.add('show');
      } else {
        board.innerHTML = '';
        board.classList.remove('show');
      }

      document.getElementById('q-text').innerHTML = q.text;

      var box = document.getElementById('q-options');
      box.innerHTML = '';
      q.options.forEach(function (opt, i) {
        var b = document.createElement('button');
        b.className = 'opt';
        b.innerHTML = '<span class="opt-key">' + KEYS[i] + '</span><span>' + opt + '</span>';
        b.onclick = function () { BT.game.answer(i); };
        box.appendChild(b);
      });

      var fb = document.getElementById('q-feedback');
      fb.className = 'q-feedback';
      fb.innerHTML = '';

      renderPowerbar();
    },

    /* ================= risposta ================= */
    answer: function (i) {
      if (G.locked) return;
      var btns = document.querySelectorAll('#q-options .opt');
      var q = G.q, t = G.turn, run = G.runs[t];

      // seconda chance: la prima risposta sbagliata non conta
      if (i !== q.correct && G.secondChance && i >= 0) {
        G.secondChance = false;
        btns[i].classList.add('wrong', 'gone');
        btns[i].disabled = true;
        BT.sfx.play('sbagliato');
        BT.toast('Sbagliata! Ti resta la seconda chance ❤️');
        return;
      }

      G.locked = true;
      stopTimer();
      for (var k = 0; k < btns.length; k++) btns[k].disabled = true;

      var giusto = (i === q.correct);
      var punti = 0;

      if (!run.byCat[q.cat]) run.byCat[q.cat] = { a: 0, c: 0 };
      run.byCat[q.cat].a++;
      run.answered++;

      if (giusto) {
        G.streaks[t]++;
        if (G.streaks[t] > run.bestStreak) run.bestStreak = G.streaks[t];
        run.correct++;
        run.byCat[q.cat].c++;
        if (G.tipo !== 'allena') {
          var speed = Math.round(50 * (G.tLeft / G.tTotal));
          punti = Math.round((100 + speed) * streakMult(G.streaks[t]) * G.diff.bonus) * G.moltiplicatore;
          run.score += punti;
          run.coins += 2 + (G.streaks[t] >= 5 ? 1 : 0);
        }
      } else if (G.scudo) {
        G.scudo = false;                       // lo scudo assorbe l'errore: serie e punti salvi
        BT.toast('Scudo attivato: la serie resiste e non perdi punti! 🛡️');
      } else {
        G.streaks[t] = 0;
        if (G.tipo === 'gioca') {
          // si perdono punti, ma il punteggio della partita non scende sotto zero
          punti = -Math.min(G.diff.penalita, run.score);
          run.score += punti;
          run.persi += -punti;
        }
      }

      aggiornaPunteggio(run);

      var esito = { q: q, scelta: i, giusto: giusto, punti: punti, player: G.players[t] };

      if (G.mode === 'solo') {
        if (giusto) { btns[i].classList.add('right', 'pop'); BT.sfx.play('giusto'); }
        else {
          if (i >= 0) btns[i].classList.add('wrong', 'shake');
          if (btns[q.correct]) btns[q.correct].classList.add('right');
          BT.sfx.play('sbagliato');
        }
        showSoloFeedback(esito);
      } else {
        // duello: nessun indizio prima che abbiano risposto entrambi
        if (i >= 0) btns[i].classList.add('chosen');
        BT.sfx.play('click');
        G.pending[t] = esito;
        showRegistrata();
      }
    },

    timeout: function () {
      if (G.locked) return;
      BT.sfx.play('tempo');
      BT.toast('Tempo scaduto! ⏰');
      BT.game.answer(-1);
    },

    /* passa al giocatore successivo, o al confronto */
    afterAnswer: function () {
      if (G.turn === 0) { G.turn = 1; BT.game.showPass(); }
      else showReveal();
    },

    /* avanti dopo il feedback singolo o dopo il confronto */
    advance: function () {
      G.round++;
      if (G.round >= G.qLen) BT.game.finish();
      else BT.game.startRound();
    },

    skip: function () {
      if (G.locked) return;
      G.locked = true;
      stopTimer();
      var run = G.runs[G.turn];
      run.skipped++;
      if (G.mode === 'solo') BT.game.advance();
      else {
        G.pending[G.turn] = { q: G.q, scelta: -2, giusto: false, punti: 0, player: G.players[G.turn] };
        BT.game.afterAnswer();
      }
    },

    /* ================= uscire prima della fine =================
       Chi si ferma a meta' non perde quello che ha gia' guadagnato: la
       partita si chiude con le domande fatte fin li'. Il duello invece
       si annulla del tutto, perche' un confronto a meta' non vuol dire
       niente e falserebbe il punteggio di tutti e due. */
    esci: function () {
      if (!G) return;
      stopTimer();

      if (G.mode === 'duel') {
        G = null;
        BT.toast('Duello interrotto: nessun punteggio registrato.');
        BT.show('screen-menu');
        BT.renderMenu();
        return;
      }

      var fatte = G.runs[0].answered + G.runs[0].skipped;
      if (!fatte) {                       // uscito prima di rispondere: niente da salvare
        G = null;
        BT.show('screen-menu');
        BT.renderMenu();
        return;
      }

      G.qLen = fatte;                     // la partita finisce qui, con quello che ha fatto
      BT.game.finish();
    },

    /* ================= fine partita ================= */
    finish: function () {
      stopTimer();
      var pausa = BT.limite ? BT.limite.ferma(G.players) : null;
      if (pausa && pausa.appenaBloccato) setTimeout(function () {
        BT.toast("Pausa! Hai giocato " + BT.limite.MINUTI + " minuti. Si riprende fra " +
          BT.limite.ORE_PAUSA + " ore ⏳");
      }, 900);
      var out = [];
      var modo = G.mode, extra = G.extra, tipo = G.tipo, qLen = G.qLen, diff = G.diff;

      G.players.forEach(function (p, idx) {
        var run = G.runs[idx];
        run.tipo = tipo;
        run.diff = diff.id;
        run.qLen = qLen;
        if (run.correct === qLen && qLen > 0) {
          run.perfect = true;
          if (tipo !== 'allena') run.coins += 10;
        }
        /* l'allenamento non tocca nulla del profilo: niente punti, coppe o statistiche */
        var salita = (tipo === 'allena')
          ? { levelUp: false, from: 0, to: 0 }
          : BT.store.recordRun(p, run);
        /* ogni livello nuovo porta una cassa sorpresa */
        if (salita.levelUp) BT.store.aggiungiCassa(p);
        out.push({ p: p, run: run, levelUp: salita });
      });

      if (G.mode === 'duel') {
        var vincitore = out[0].run.score === out[1].run.score ? null : (out[0].run.score > out[1].run.score ? 0 : 1);
        out.forEach(function (o, idx) { BT.store.recordDuel(o.p, vincitore === idx); });
        BT.sfx.play(vincitore === null ? 'coppa' : 'vittoria');
        renderDuelResult(out, vincitore);
      } else {
        BT.sfx.play(out[0].levelUp.levelUp ? 'livello' : (out[0].run.perfect ? 'vittoria' : 'coppa'));
        if (tipo === 'allena') renderAllenamentoResult(out[0]);
        else renderSoloResult(out[0]);
      }

      BT.show('screen-result');
      G = null;

      // gancio usato dalla versione online per registrare le sfide a distanza
      if (typeof BT.onFinish === 'function') {
        try { BT.onFinish(modo, out, extra); } catch (e) {}
      }
    },

    /* ================= aiuti ================= */
    usePower: function (id) {
      if (!G || G.locked) return;
      var p = G.players[G.turn];
      if (G.usedThisQ[id]) return;
      if (!p.inventory[id]) { BT.toast('Non hai questo aiuto. Comprane al Negozio!'); return; }

      /* elimina n risposte sbagliate fra quelle ancora in gioco */
      function eliminaSbagliate(n) {
        var btns = document.querySelectorAll('#q-options .opt');
        var sbagliate = [];
        for (var i = 0; i < btns.length; i++) {
          if (i !== G.q.correct && !btns[i].classList.contains('gone')) sbagliate.push(i);
        }
        BT.shuffle(sbagliate).slice(0, n).forEach(function (j) {
          btns[j].classList.add('gone'); btns[j].disabled = true;
        });
      }

      if (id === 'fifty') {
        eliminaSbagliate(2);
        BT.toast('Due risposte eliminate ✂️');
      } else if (id === 'hint') {
        eliminaSbagliate(1);
        BT.toast('Una risposta sbagliata in meno 🔍');
      } else if (id === 'time') {
        G.tLeft += 15; if (G.tLeft > G.tTotal) G.tTotal = G.tLeft;
        BT.toast('+15 secondi ⏱️');
      } else if (id === 'freeze') {
        G.congelato = true;
        stopTimer();
        document.getElementById('timer-bar').classList.add('frozen');
        BT.toast('Tempo congelato: pensa con calma ❄️');
      } else if (id === 'skip') {
        BT.store.consume(p, id); G.usedThisQ[id] = true;
        BT.toast('Domanda saltata ⏭️');
        BT.game.skip();
        return;
      } else if (id === 'swap') {
        BT.store.consume(p, id);
        BT.sfx.play('click');
        BT.toast('Ecco un\'altra domanda 🔄');
        cambiaDomanda();
        return;
      } else if (id === 'double') {
        G.moltiplicatore = Math.max(G.moltiplicatore, 2);
        BT.toast('Punti doppi su questa domanda ✨');
      } else if (id === 'triple') {
        G.moltiplicatore = 3;
        BT.toast('Punti TRIPLI su questa domanda! 🌟');
      } else if (id === 'shield') {
        G.scudo = true;
        BT.toast('Scudo pronto: la serie è protetta 🛡️');
      } else if (id === 'second') {
        G.secondChance = true;
        BT.toast('Seconda chance attiva ❤️');
      }

      BT.sfx.play('click');
      BT.store.consume(p, id);
      G.usedThisQ[id] = true;
      renderPowerbar();
      BT.refreshTopbar();
    },

    current: function () { return G; }
  };

  /* sostituisce la domanda in corso mantenendo gli aiuti gia' attivati */
  function cambiaDomanda() {
    var p = G.players[G.turn];
    var molt = G.moltiplicatore, scudo = G.scudo, seconda = G.secondChance, usati = G.usedThisQ;
    G.q = BT.bank.draw(G.cats, p.level, G.used[G.turn], G.diff.salto);
    G.locked = false;
    G.congelato = false;
    G.moltiplicatore = molt;
    G.scudo = scudo;
    G.secondChance = seconda;
    G.usedThisQ = usati;
    G.usedThisQ.swap = true;
    G.tTotal = tempoDomanda(p);
    G.tLeft = G.tTotal;
    BT.game.render();
    startTimer();
  }

  /* ================= timer ================= */
  function startTimer() {
    stopTimer();
    updateTimerBar();
    timerId = setInterval(function () {
      G.tLeft -= 0.1;
      if (G.tLeft <= 0) { G.tLeft = 0; updateTimerBar(); stopTimer(); BT.game.timeout(); return; }
      updateTimerBar();
    }, 100);
  }
  function stopTimer() { if (timerId) { clearInterval(timerId); timerId = null; } }

  function updateTimerBar() {
    var bar = document.getElementById('timer-bar');
    var perc = Math.max(0, G.tLeft / G.tTotal * 100);
    bar.style.width = perc + '%';
    bar.className = 'timer-bar' + (perc < 20 ? ' danger' : perc < 45 ? ' warn' : '');
  }

  /* ================= barra aiuti ================= */
  function renderPowerbar() {
    var p = G.players[G.turn];
    var bar = document.getElementById('powerbar');
    bar.innerHTML = '';
    /* in allenamento non ci sono punti da difendere: gli aiuti restano nello zaino */
    if (G.tipo === 'allena') return;
    BT.POWERUPS.forEach(function (pu) {
      var n = p.inventory[pu.id] || 0;
      var b = document.createElement('button');
      b.className = 'pw';
      b.title = pu.desc;
      b.innerHTML = pu.ico + ' ' + pu.name + ' <span class="pw-n">' + n + '</span>';
      b.disabled = (n <= 0) || !!G.usedThisQ[pu.id] || G.locked;
      b.onclick = function () { BT.game.usePower(pu.id); };
      bar.appendChild(b);
    });
  }

  /* ================= feedback allenamento singolo ================= */
  function showSoloFeedback(e) {
    var fb = document.getElementById('q-feedback');
    var titolo = e.giusto
      ? BT.pick(['Esatto!', 'Bravissimo!', 'Perfetto!', 'Grande!', 'Centrato!'])
      : (G.tipo === 'allena'
          ? BT.pick(['Adesso lo sai', 'Capita: guarda qui', 'Impariamola insieme', 'Quasi!'])
          : BT.pick(['Non ci siamo', 'Sbagliata', 'Quasi!', 'Ritenta la prossima']));

    var badge = '';
    if (e.punti > 0) badge = ' <span class="fb-pt-su">+' + e.punti + ' pt</span>';
    else if (e.punti < 0) badge = ' <span class="fb-pt-giu">' + e.punti + ' pt</span>';

    var html = '<div class="fb-title">' + titolo + badge + '</div>';
    if (!e.giusto) html += '<div class="fb-exp"><b>Risposta giusta:</b> ' + e.q.options[e.q.correct] + '</div>';
    if (e.q.explain) html += '<div class="fb-exp">' + e.q.explain + '</div>';

    var ultima = (G.round + 1 >= G.qLen);
    html += '<button class="btn btn-primary btn-block fb-next" id="fb-next">' +
      (ultima ? 'Vedi i risultati' : 'Avanti') + '</button>';

    fb.innerHTML = html;
    fb.className = 'q-feedback show ' + (e.giusto ? 'fb-ok' : 'fb-no');
    document.getElementById('fb-next').onclick = function () { BT.game.advance(); };
    renderPowerbar();
    fb.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  /* ================= duello: risposta registrata ================= */
  function showRegistrata() {
    var fb = document.getElementById('q-feedback');
    var altro = G.players[1 - G.turn];
    var testo = G.turn === 0
      ? 'Adesso tocca a <b>' + BT.esc(altro.name) + '</b>. Scoprirete insieme com\'&egrave; andata.'
      : 'Avete risposto tutti e due: vediamo il confronto!';

    fb.innerHTML = '<div class="fb-title" style="color:var(--azzurro-700)">Risposta registrata 🔒</div>' +
      '<div class="fb-exp">' + testo + '</div>' +
      '<button class="btn btn-primary btn-block fb-next" id="fb-next">' +
      (G.turn === 0 ? 'Passa il dispositivo' : 'Vedi il confronto') + '</button>';
    fb.className = 'q-feedback show';
    document.getElementById('fb-next').onclick = function () { BT.game.afterAnswer(); };
    renderPowerbar();
    fb.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  /* ================= duello: schermo sdoppiato ================= */
  function showReveal() {
    var a = G.pending[0], b = G.pending[1];

    document.getElementById('reveal-title').innerHTML =
      'Domanda ' + (G.round + 1) + ' di ' + G.qLen + ' &mdash; com\'&egrave; andata';

    function col(e, idx) {
      var q = e.q, info = BT.catInfo(q.cat);
      var esito, cls;
      if (e.scelta === -2) { esito = 'Domanda saltata'; cls = 'sk'; }
      else if (e.giusto) { esito = 'Risposta giusta'; cls = 'ok'; }
      else if (e.scelta === -1) { esito = 'Tempo scaduto'; cls = 'no'; }
      else { esito = 'Risposta sbagliata'; cls = 'no'; }

      var h = '<div class="split-col ' + cls + '">' +
        '<div class="sc-head"><span class="sc-av">' + BT.avatar(e.player.avatar) + '</span>' +
          '<span class="sc-nm">' + BT.esc(e.player.name) + '</span>' +
          '<span class="sc-pt">' + (e.punti > 0 ? '+' + e.punti : (e.punti || 0)) + '</span></div>' +
        '<div class="sc-cat">' + info.ico + ' ' + (q.tag || info.name) + '</div>' +
        '<div class="sc-q">' + q.text + '</div>';

      if (q.board) h += '<div class="sc-board">' + BT.renderBoard(q.board, '') + '</div>';

      h += '<div class="sc-esito">' + esito + '</div>';
      if (e.scelta >= 0) {
        h += '<div class="sc-line"><b>Ha risposto:</b> ' + q.options[e.scelta] + '</div>';
      }
      if (!e.giusto) {
        h += '<div class="sc-line sc-right"><b>Giusta:</b> ' + q.options[q.correct] + '</div>';
      }
      if (q.explain) h += '<div class="sc-exp">' + q.explain + '</div>';
      h += '<div class="sc-tot">Totale: <b>' + G.runs[idx].score + '</b> punti</div>';
      return h + '</div>';
    }

    document.getElementById('reveal-split').innerHTML = col(a, 0) + col(b, 1);

    if (a.giusto && b.giusto) BT.sfx.play('coppa');
    else if (a.giusto || b.giusto) BT.sfx.play('giusto');
    else BT.sfx.play('sbagliato');

    var ultima = (G.round + 1 >= G.qLen);
    var btn = document.getElementById('reveal-next');
    btn.textContent = ultima ? 'Vedi chi ha vinto' : 'Prossima domanda';
    btn.onclick = function () { BT.game.advance(); };

    BT.show('screen-reveal');
  }

  /* ================= risultati ================= */

  /* se una cassa aspetta di essere aperta, il bottone compare qui */
  function bottoneCassa(p) {
    if (!p.casse || !p.casse.pronte) return '';
    var quante = p.casse.pronte > 1 ? p.casse.pronte + ' casse ti aspettano' : 'Hai trovato una cassa!';
    return '<button class="btn btn-gold btn-block" id="res-cassa">🎁 ' + quante + '</button>';
  }
  function collegaCassa(box, p) {
    var b = box.querySelector('#res-cassa');
    if (b) b.onclick = function () { BT.mostraCassa(p); };
  }

  function statBox(run, qLen) {
    var acc = run.answered ? Math.round(run.correct / run.answered * 100) : 0;
    return '<div class="res-stats">' +
      '<div class="res-stat"><b>' + run.correct + '/' + qLen + '</b><span>risposte giuste</span></div>' +
      '<div class="res-stat"><b>' + acc + '%</b><span>precisione</span></div>' +
      '<div class="res-stat"><b>' + run.bestStreak + '</b><span>serie migliore</span></div>' +
      '</div>';
  }

  function renderSoloResult(o) {
    var run = o.run, p = o.p;
    var acc = run.answered ? run.correct / run.answered : 0;
    var ico = run.perfect ? '🏆' : acc >= 0.7 ? '🎉' : acc >= 0.4 ? '💪' : '📚';
    var titolo = run.perfect ? 'Partita perfetta!' : acc >= 0.7 ? 'Bella prova!' : acc >= 0.4 ? 'Puoi fare di pi&ugrave;' : 'Serve allenamento';

    var html = '<div class="res-card">' +
      '<div class="res-ico">' + ico + '</div>' +
      '<div class="res-title">' + titolo + '</div>' +
      '<div class="res-sub">' + BT.esc(p.name) + ' &mdash; ' + run.score + ' punti</div>' +
      statBox(run, run.answered + run.skipped);

    if (run.persi > 0) {
      html += '<div class="res-persi">Hai perso <b>' + run.persi + ' punti</b> per le risposte sbagliate. ' +
        'Nell\'<b>Allenamento</b> puoi provare le stesse domande senza rischiare nulla.</div>';
    }

    html += '<div class="res-reward">+' + run.coins + ' coppe 🏆' +
        (run.perfect ? ' &nbsp;(bonus partita perfetta!)' : '') + '</div>';

    if (o.levelUp.levelUp) {
      html += '<div class="res-levelup">🚀 Sei salito al <b>livello ' + o.levelUp.to +
        '</b>: ' + BT.levelTitle(o.levelUp.to) + '!</div>';
    }

    html += '<div class="row-btns">' +
      '<button class="btn btn-ghost" id="res-menu">Torna al menu</button>' +
      '<button class="btn btn-primary" id="res-again">Gioca ancora</button>' +
      '</div>' + bottoneCassa(p) + '</div>';

    var box = document.getElementById('result-body');
    box.innerHTML = html;
    box.querySelector('#res-menu').onclick = function () { BT.show('screen-menu'); BT.renderMenu(); };
    box.querySelector('#res-again').onclick = function () { BT.startGioca(); };
    collegaCassa(box, p);
  }

  /* ================= risultato dell'allenamento ================= */
  function renderAllenamentoResult(o) {
    var run = o.run, p = o.p;
    var tot = run.answered + run.skipped;
    var acc = run.answered ? run.correct / run.answered : 0;
    var ico = acc >= 0.9 ? '🎓' : acc >= 0.6 ? '💪' : '📚';
    var titolo = acc >= 0.9 ? 'Allenamento perfetto!'
               : acc >= 0.6 ? 'Bell\'allenamento!'
               : 'Allenamento finito';

    var sbagliate = run.answered - run.correct;
    var commento = sbagliate === 0
      ? 'Nessun errore: sei pronto per la modalit&agrave; <b>Gioca</b>.'
      : 'Hai sbagliato ' + sbagliate + ' ' + BT.plural(sbagliate, 'domanda', 'domande') +
        ': qui non costa nulla, ed &egrave; proprio il punto.';

    var html = '<div class="res-card">' +
      '<div class="res-ico">' + ico + '</div>' +
      '<div class="res-title">' + titolo + '</div>' +
      '<div class="res-sub">' + BT.esc(p.name) + ' &mdash; nessun punto in palio</div>' +
      statBox(run, tot) +
      '<div class="res-allena">' + commento + '<br>' +
        'Punti cervello, coppe e statistiche restano come prima.</div>' +
      '<div class="row-btns">' +
        '<button class="btn btn-ghost" id="res-menu">Torna al menu</button>' +
        '<button class="btn btn-primary" id="res-again">Allenati ancora</button>' +
      '</div>' +
      '<button class="btn btn-gold btn-block" id="res-gioca">Adesso gioca sul serio 🏆</button>' +
      bottoneCassa(p) + '</div>';

    var box = document.getElementById('result-body');
    box.innerHTML = html;
    box.querySelector('#res-menu').onclick = function () { BT.show('screen-menu'); BT.renderMenu(); };
    box.querySelector('#res-again').onclick = function () { BT.startAllena(); };
    box.querySelector('#res-gioca').onclick = function () { BT.startGioca(); };
    collegaCassa(box, p);
  }

  function renderDuelResult(out, vincitore) {
    var a = out[0], b = out[1];
    var titolo = vincitore === null ? 'Pareggio!' : 'Vince ' + BT.esc(out[vincitore].p.name) + '!';
    var ico = vincitore === null ? '🤝' : '🏆';

    function side(o, win) {
      var acc = o.run.answered ? Math.round(o.run.correct / o.run.answered * 100) : 0;
      return '<div class="duel-side' + (win ? ' win' : '') + '">' +
        '<div class="duel-av">' + BT.avatar(o.p.avatar) + '</div>' +
        '<div class="duel-nm">' + BT.esc(o.p.name) + '</div>' +
        '<div class="duel-pt">' + o.run.score + '</div>' +
        '<div class="duel-acc">' + o.run.correct + ' giuste &middot; ' + acc + '%</div>' +
        '<div class="duel-acc">livello ' + BT.classeBreve(o.p) + '</div>' +
        '</div>';
    }

    var casse = out.filter(function (o) { return o.p.casse && o.p.casse.pronte; });

    var html = '<div class="res-card">' +
      '<div class="res-ico">' + ico + '</div>' +
      '<div class="res-title">' + titolo + '</div>' +
      '<div class="res-sub">Ognuno ha risposto a domande del proprio livello</div>' +
      '<div class="duel-board">' + side(a, vincitore === 0) +
        '<div class="duel-vs">VS</div>' + side(b, vincitore === 1) + '</div>' +
      '<div class="res-reward">Coppe: ' + BT.esc(a.p.name) + ' +' +
        (a.run.coins + (vincitore === 0 ? 10 : 0)) + ' &nbsp;·&nbsp; ' +
        BT.esc(b.p.name) + ' +' + (b.run.coins + (vincitore === 1 ? 10 : 0)) + ' 🏆</div>';

    out.forEach(function (o) {
      if (o.levelUp.levelUp) {
        html += '<div class="res-levelup">🚀 ' + BT.esc(o.p.name) + ' sale al livello ' +
          o.levelUp.to + ': ' + BT.levelTitle(o.levelUp.to) + '!</div>';
      }
    });

    html += '<div class="row-btns">' +
      '<button class="btn btn-ghost" id="res-menu">Torna al menu</button>' +
      '<button class="btn btn-primary" id="res-again">Rivincita</button>' +
      '</div>';

    casse.forEach(function (o) {
      html += '<button class="btn btn-gold btn-block cassa-di" data-id="' + o.p.id + '">🎁 ' +
        BT.esc(o.p.name) + ': apri la cassa</button>';
    });
    html += '</div>';

    var box = document.getElementById('result-body');
    box.innerHTML = html;
    box.querySelector('#res-menu').onclick = function () { BT.show('screen-menu'); BT.renderMenu(); };
    box.querySelector('#res-again').onclick = function () { BT.show('screen-duel-setup'); BT.renderDuelSetup(true); };
    box.querySelectorAll('.cassa-di').forEach(function (b) {
      b.onclick = function () { BT.mostraCassa(BT.store.get(b.dataset.id)); };
    });
  }

})(window.BT);
