/* =========================================================
   BRAIN TIME ONLINE — interfaccia
   Come la versione locale, piu' le sfide a distanza:
   uno lancia la sfida, l'altro la raccoglie quando vuole,
   anche da un altro dispositivo.
   ========================================================= */
(function (BT) {
  'use strict';

  var player = null;
  var mode = 'solo';           // solo | duel | sfida | risposta
  var tipoPartita = 'gioca';   // allena (senza punti) | gioca (punti, con penalita')
  var duelSel = [null, null];
  var sfidaVerso = null;       // avversario scelto per la sfida a distanza
  var sfidaAperta = null;      // sfida che sto raccogliendo
  var np = { avatar: '🦊', eta: 10 };
  var npModifica = null;       // se valorizzato, la schermata profilo e' in modifica
  var history = [];
  var downloads = null;

  function ora() { return Date.now(); }
  function dataBreve(ms) {
    var d = new Date(ms);
    return ('0' + d.getDate()).slice(-2) + '/' + ('0' + (d.getMonth() + 1)).slice(-2) +
      ' alle ' + ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2);
  }

  /* ================= navigazione ================= */
  BT.show = function (id, noHistory) {
    var cur = document.querySelector('.screen.active');
    if (cur && !noHistory && cur.id !== id) history.push(cur.id);
    document.querySelectorAll('.screen').forEach(function (s) { s.classList.remove('active'); });
    var el = document.getElementById(id);
    if (el) el.classList.add('active');
    window.scrollTo(0, 0);

    var top = document.getElementById('topbar');
    if (id === 'screen-home') { top.classList.add('hidden'); history = []; }
    else top.classList.remove('hidden');

    document.getElementById('btn-back').style.visibility =
      (id === 'screen-game' || id === 'screen-pass') ? 'hidden' : 'visible';

    BT.refreshTopbar();
  };

  function goBack() {
    var prev = history.pop();
    if (!prev) prev = player ? 'screen-menu' : 'screen-home';
    if (prev === 'screen-game' || prev === 'screen-pass' ||
        prev === 'screen-result' || prev === 'screen-reveal')
      prev = player ? 'screen-menu' : 'screen-home';
    BT.show(prev, true);
    if (prev === 'screen-menu') BT.renderMenu();
    if (prev === 'screen-home') BT.renderHome();
    if (prev === 'screen-sfide') renderSfide();
  }

  BT.refreshTopbar = function () {
    var el = document.getElementById('topbar-player');
    if (!player) { el.innerHTML = ''; return; }
    var n = BT.sfide.perMe(player).length;
    el.innerHTML = (n ? '<span class="tp-bell" title="Sfide in arrivo">⚔️ ' + n + '</span>' : '') +
      '<span>' + BT.avatar(player.avatar) + '</span>' +
      '<span class="tp-coins">' + player.coins + ' 🏆</span>';
  };

  /* ================= stato della connessione ================= */
  function renderStatoSync(ok, motivo) {
    var el = document.getElementById('sync-chip');
    if (!el) return;
    var s = BT.online.stato();
    if (s === 'attesa') { el.className = 'sync-chip attesa'; el.textContent = 'Collegamento…'; return; }
    if (s === 'online') {
      if (motivo === 'conflict') {
        el.className = 'sync-chip warn';
        el.textContent = 'Qualcun altro ha salvato prima: ricarico…';
      } else if (ok === false) {
        el.className = 'sync-chip warn';
        el.textContent = 'Salvataggio non riuscito';
      } else {
        el.className = 'sync-chip ok';
        el.textContent = 'Condiviso ✓';
      }
    } else {
      el.className = 'sync-chip off';
      el.textContent = 'Solo su questo dispositivo';
    }
  }

  /* ================= home ================= */
  BT.renderHome = function () {
    var box = document.getElementById('profile-list');
    var list = BT.store.all();
    box.innerHTML = '';

    if (!list.length) {
      box.innerHTML = '<p class="empty-note">Nessun giocatore ancora. Creane uno per iniziare!</p>';
      return;
    }

    list.forEach(function (p) {
      var lvl = BT.levelFromXp(p.xp);
      var inArrivo = BT.sfide.perMe(p).length;
      var row = document.createElement('div');
      row.className = 'profile-row';
      row.innerHTML =
        '<div class="pf-avatar">' + BT.avatar(p.avatar) + '</div>' +
        '<div class="pf-info">' +
          '<div class="pf-name">' + BT.esc(p.name) +
            (inArrivo ? ' <span class="pf-badge">⚔️ ' + inArrivo + '</span>' : '') + '</div>' +
          '<div class="pf-meta">Livello ' + lvl + ' &middot; ' + BT.levelTitle(lvl) +
          ' &middot; ' + p.coins + ' 🏆</div>' +
        '</div>' +
        '<div class="pf-lvl">' + BT.classeBreve(p) + '</div>';
      row.onclick = function () { selectPlayer(p); };
      box.appendChild(row);
    });
  };

  function selectPlayer(p) {
    player = BT.store.normalizza(p);
    BT.store.setLast(p.id);
    applicaTema(p);
    BT.show('screen-menu');
    BT.renderMenu();
  }

  /* ================= nuovo profilo ================= */
  var camVideo = null;

  function chiudiFotocamera() {
    BT.foto.spegni();
    camVideo = null;
    document.getElementById('np-cam').classList.add('hidden');
    document.getElementById('np-cam-video').innerHTML = '';
  }

  var gruppoAvatar = 'animali';

  function aggiornaAnteprima() {
    document.getElementById('np-anteprima').innerHTML = BT.avatar(np.avatar);
    document.querySelectorAll('#np-avatars .av-btn').forEach(function (b) {
      b.classList.toggle('sel', b.dataset.emoji === np.avatar);
    });
  }

  /* le famiglie di avatar: animali, mostri, personaggi... */
  function renderAvatarTabs() {
    var tabs = document.getElementById('np-av-tabs');
    tabs.innerHTML = '';
    BT.AVATAR_GRUPPI.forEach(function (g) {
      var b = document.createElement('button');
      b.className = 'av-tab' + (g.id === gruppoAvatar ? ' active' : '');
      b.innerHTML = g.ico + ' ' + g.nome;
      b.onclick = function () { gruppoAvatar = g.id; renderAvatarTabs(); };
      tabs.appendChild(b);
    });

    var gruppo = BT.AVATAR_GRUPPI[0];
    BT.AVATAR_GRUPPI.forEach(function (g) { if (g.id === gruppoAvatar) gruppo = g; });

    var av = document.getElementById('np-avatars');
    av.innerHTML = '';
    gruppo.lista.forEach(function (a) {
      var b = document.createElement('button');
      b.className = 'av-btn' + (a === np.avatar ? ' sel' : '');
      b.dataset.emoji = a;
      b.textContent = a;
      b.onclick = function () { np.avatar = a; aggiornaAnteprima(); messaggioFoto(''); };
      av.appendChild(b);
    });

    document.getElementById('np-av-conta').innerHTML =
      gruppo.lista.length + ' personaggi in questa famiglia, ' + BT.AVATARS.length +
      ' in tutto. Altri ancora si sbloccano al Negozio o si trovano nelle casse.';
  }
  function messaggioFoto(t) { document.getElementById('np-foto-msg').innerHTML = t; }
  function impostaFoto(dati) {
    if (!dati) { messaggioFoto('Non sono riuscito a preparare l\'immagine.'); return; }
    np.avatar = dati;
    aggiornaAnteprima();
    messaggioFoto('Foto impostata! Puoi sempre cambiarla scegliendo un personaggio qui sotto.');
    BT.sfx.play('coppa');
  }

  /* --- quanti anni hai: i numeri, raggruppati per non fare una fila unica --- */
  function renderEta() {
    var box = document.getElementById('np-classi');
    box.innerHTML = '';
    BT.GRUPPI_ETA.forEach(function (g) {
      var titolo = document.createElement('div');
      titolo.className = 'gruppo-classe';
      titolo.innerHTML = g.nome;
      box.appendChild(titolo);

      var riga = document.createElement('div');
      riga.className = 'chip-row';
      for (var n = g.da; n <= g.a; n++) {
        (function (anni) {
          var b = document.createElement('button');
          b.className = 'chip';
          b.dataset.eta = anni;
          b.innerHTML = anni >= BT.ETA_ADULTO ? 'Adulto' : anni;
          b.onclick = function () { np.eta = anni; aggiornaEta(); };
          riga.appendChild(b);
        })(n);
      }
      box.appendChild(riga);
    });
    aggiornaEta();
  }

  function aggiornaEta() {
    document.querySelectorAll('#np-classi .chip').forEach(function (b) {
      b.classList.toggle('sel', parseInt(b.dataset.eta, 10) === np.eta);
    });
    var L = BT.LEVELS[BT.livelloDaEta(np.eta)];
    var avviso = np.eta < 8
      ? '<br><b>Attenzione:</b> sotto gli otto anni le domande sono ancora quelle della quinta ' +
        'elementare, quindi saranno difficili. Meglio giocare in <b>Facile</b> e in compagnia.'
      : '';
    document.getElementById('np-livello-info').innerHTML =
      (np.eta >= BT.ETA_ADULTO ? 'Da <b>adulto</b> ricevi ' : 'A <b>' + BT.nomeEta(np.eta) + '</b> ricevi ') +
      '<b>domande di livello ' + L.name + '</b>, ' +
      'con ' + L.time + ' secondi per rispondere.' + avviso;
  }


  /* La stessa schermata serve a creare un giocatore e a correggerne i dati:
     passandole un profilo entra in "modifica" e parte gia' compilata.
     L'eta' cambia perche' i bambini crescono, e con lei cambia il livello
     delle domande; punti, coppe e sblocchi non si toccano. */
  function renderNewProfile(esistente) {
    npModifica = esistente || null;
    np = esistente
      ? { avatar: esistente.avatar, eta: BT.etaDi(esistente) }
      : { avatar: '🦊', eta: 10 };
    document.getElementById('np-name').value = esistente ? esistente.name : '';
    chiudiFotocamera();
    messaggioFoto('');

    document.getElementById('np-titolo').textContent =
      esistente ? 'Modifica giocatore' : 'Nuovo giocatore';
    document.getElementById('np-create').textContent =
      esistente ? 'Salva le modifiche' : 'Crea giocatore';

    gruppoAvatar = BT.AVATAR_GRUPPI[0].id;
    renderAvatarTabs();

    renderEta();
    aggiornaAnteprima();

    document.getElementById('np-hint').innerHTML = esistente
      ? 'Punti, coppe e sblocchi restano come sono: cambiano solo questi dati. ' +
        'La modifica vale per tutti i dispositivi.'
      : (BT.online.attiva()
        ? 'Il giocatore viene creato per tutti: chi apre il link da un altro dispositivo lo trover&agrave;.'
        : 'Attenzione: al momento la pagina non riesce a condividere i dati, quindi questo giocatore rester&agrave; solo qui.');
  }

  /* ================= menu ================= */
  BT.renderMenu = function () {
    if (!player) return;
    var lvl = BT.levelFromXp(player.xp);
    var base = BT.xpForLevel(lvl), next = BT.xpForLevel(lvl + 1);
    var perc = Math.min(100, Math.round((player.xp - base) / (next - base) * 100));
    var acc = player.answered ? Math.round(player.correct / player.answered * 100) : 0;

    document.getElementById('menu-player-card').innerHTML =
      '<div class="pc-top">' +
        '<div class="pc-avatar">' + BT.avatar(player.avatar) + '</div>' +
        '<div><div class="pc-name">' + BT.esc(player.name) + '</div>' +
          (player.titolo && BT.titolo(player.titolo)
            ? '<div class="pc-titolo">' + BT.titolo(player.titolo).name + '</div>' : '') +
          '<div class="pc-lvl-txt">Livello ' + lvl + ' &middot; ' + BT.levelTitle(lvl) +
          ' &middot; ' + BT.nomeClasse(player) +
          ' <button class="pc-edit" id="pc-modifica" title="Cambia nome, faccia o et&agrave;">' +
          '&#9998; modifica</button></div></div>' +
        '<div class="pc-coins"><b>' + player.coins + '</b><span>coppe 🏆</span></div>' +
      '</div>' +
      '<div class="xp-wrap">' +
        '<div class="xp-line"><span>' + player.xp + ' punti cervello</span>' +
        '<span>prossimo livello: ' + next + '</span></div>' +
        '<div class="xp-bar"><div class="xp-fill" style="width:' + perc + '%"></div></div>' +
        '<div class="xp-line" style="margin-top:8px"><span>Precisione ' + acc + '%</span>' +
        '<span>Duelli vinti ' + player.duelsWon + '/' + player.duelsPlayed + '</span></div>' +
      '</div>';

    var n = BT.sfide.perMe(player).length;
    var badge = document.getElementById('tile-sfide-badge');
    if (badge) {
      badge.textContent = n ? n + ' in arrivo!' : 'Gioca a distanza';
      badge.parentNode.classList.toggle('urgente', n > 0);
    }

    /* etichette delle tessere che cambiano col giocatore */
    BT.store.normalizza(player);
    var sub = document.getElementById('tile-laby-sub');
    if (sub) sub.innerHTML = 'Sei al labirinto ' + player.labirinto.livello;
    var sco = document.getElementById('tile-scoperte-sub');
    if (sco) sco.innerHTML = player.scoperte.length + ' su ' + BT.CURIOSITA.length;

    /* la cassa in attesa si vede subito, in cima al menu */
    var vecchio = document.getElementById('menu-cassa');
    if (vecchio) vecchio.remove();
    if (player.casse.pronte) {
      var b = document.createElement('button');
      b.className = 'btn btn-gold btn-block';
      b.id = 'menu-cassa';
      b.innerHTML = '🎁 ' + (player.casse.pronte > 1
        ? 'Hai ' + player.casse.pronte + ' casse da aprire'
        : 'Hai una cassa da aprire') +
        (player.casse.moltiplicatore > 1 ? ' <span class="cassa-badge">' + etichettaRar(BT.rarita(player.casse.moltiplicatore), true).ico + ' ' + etichettaRar(BT.rarita(player.casse.moltiplicatore), true).nome + '</span>' : '');
      b.onclick = function () { BT.mostraCassa(player); };
      var card = document.getElementById('menu-player-card');
      card.parentNode.insertBefore(b, card.nextSibling);
    }

    var modif = document.getElementById('pc-modifica');
    if (modif) modif.onclick = function () {
      BT.show('screen-newprofile');
      renderNewProfile(player);
    };

    bannerTempo();
    BT.refreshTopbar();

    /* premi di una cassa aperta e mai letti: online ogni salvataggio
       ripubblica la pagina e la fa ricaricare, quindi l'elenco dei premi
       sparirebbe da solo. Cosi' invece torna su finche' non lo chiude lui. */
    var daLeggere = BT.casse.daLeggere(player);
    if (daLeggere) { mostraPremi(player, daLeggere); return; }
    var rimandata = BT.casse.rimandata(player);
    if (rimandata) mostraRimandata(player, rimandata);
  };

  /* Le preferenze del dispositivo (difficolta', suoni) non vanno pubblicate:
     un salvataggio ripubblica la pagina e la ricarica sotto le mani di chi
     sta giocando. Qui basta scriverle sul dispositivo. */
  function salvaPreferenze() {
    if (BT.store.salvaPref) BT.store.salvaPref();
    else BT.store.save();
  }

  /* Il livello di difficolta' si sceglie prima di ogni partita, non una volta
     per tutte: la voglia di faticare cambia di giorno in giorno. L'ultima
     scelta resta proposta per prima, ma la domanda si fa sempre. */
  function chiediDifficolta(sotto, poi) {
    var scelta = BT.diff(BT.store.settings().diff);
    var html = '<div class="card">' +
      '<h2 class="card-title">Quanto la vuoi difficile?</h2>' +
      '<p class="hint" style="margin-top:0">' + sotto + '</p>' +
      '<div class="diff-scelta">' +
        BT.DIFFICOLTA.map(function (d) {
          return '<button class="cat-card df-card' + (d.id === scelta.id ? ' sel' : '') +
            '" data-df="' + d.id + '">' +
            '<span class="cat-ico">' + d.ico + '</span>' +
            '<span class="cat-name">' + d.name + '</span>' +
            '<span class="cat-sub">' + d.desc + '</span>' +
          '</button>';
        }).join('') +
      '</div></div>';

    var box = document.getElementById('diff-box');
    box.innerHTML = html;
    BT.show('screen-diff');
    box.querySelectorAll('.df-card').forEach(function (b) {
      b.onclick = function () {
        BT.store.settings().diff = b.dataset.df;
        salvaPreferenze();
        BT.sfx.play('click');
        poi(b.dataset.df);
      };
    });
  }

  /* ================= che cosa faccio =================
     Una schermata sola: il quiz misto, le sei materie, e le due
     attivita' che non sono quiz (le lingue e i labirinti). Prima
     erano due passaggi, ma far scegliere due volte di fila e' una
     scala inutile: qui si vede tutto insieme. */
  function renderCategories() {
    var grid = document.getElementById('cat-grid');
    grid.innerHTML = '';

    function carta(classe, ico, nome, sotto, azione) {
      var b = document.createElement('button');
      b.className = 'cat-card' + (classe ? ' ' + classe : '');
      b.innerHTML = '<span class="cat-ico">' + ico + '</span>' +
        '<span class="cat-name">' + nome + '</span>' +
        '<span class="cat-sub">' + sotto + '</span>';
      b.onclick = azione;
      grid.appendChild(b);
      return b;
    }

    carta('cat-mix', '🎲', 'Quiz misto', 'Domande da tutte e sei le materie', function () {
      launch(BT.CATS.map(function (c) { return c.id; }));
    });

    BT.CATS.forEach(function (c) {
      carta('', c.ico, c.name, c.sub, function () { launch([c.id]); });
    });

    /* Nel duello si risponde a domande, quindi le altre due attivita'
       non hanno senso: non esiste un labirinto in due. */
    if (mode !== 'duel') {
      carta('cat-extra', '🌍', 'Impara una lingua', 'Parole e frasi, scegli tu la lingua', function () {
        BT.lingue.scegli(function (lin) {
          chiediDifficolta('Poi si comincia con ' + BT.lingua(lin).nome.toLowerCase() + '.',
            function (df) {
              BT.lingue.start({ player: player, tipo: tipoPartita, lingua: lin, diff: df });
            });
        });
      });
      carta('cat-extra', '🧩', 'Labirinti', 'Trova l&rsquo;uscita prima del tempo', function () {
        chiediDifficolta('Nei labirinti cambia il tempo che hai per trovare l&rsquo;uscita.',
          function () { apriLabirinti(); });
      });
    }

    /* --- livello di difficolta' --- */
    var scelta = BT.diff(BT.store.settings().diff);
    var seg = document.getElementById('diff-seg');
    seg.innerHTML = '';
    BT.DIFFICOLTA.forEach(function (d) {
      var b = document.createElement('button');
      b.className = 'seg-btn' + (d.id === scelta.id ? ' active' : '');
      b.innerHTML = d.ico + ' ' + d.name;
      b.onclick = function () {
        BT.store.settings().diff = d.id;
        salvaPreferenze();
        BT.sfx.play('click');
        renderCategories();
      };
      seg.appendChild(b);
    });

    var perTe = BT.LEVELS[BT.livelloDi(player.level, scelta.salto)].name;
    document.getElementById('diff-note').innerHTML =
      '<b>' + scelta.name + ':</b> ' + scelta.desc +
      '<br>Per te sono domande di livello <b>' + perTe + '</b>' +
      (mode === 'duel' ? ', per ciascuno dei due sfidanti al proprio livello' : '') + '.';

    var titolo = mode === 'duel' ? 'Materie del duello'
               : mode === 'sfida' ? 'Materie della sfida'
               : tipoPartita === 'allena' ? 'Materie dell\'allenamento'
               : 'Scegli la materia';
    document.getElementById('cat-title').textContent = titolo;

    var avviso = document.getElementById('cat-modo');
    if (mode === 'duel') {
      avviso.className = 'modo-box modo-gioca';
      avviso.innerHTML = '⚔️ <b>Duello:</b> ' + scelta.qLen + ' domande a testa, ' +
        'il dispositivo passa di mano a ogni domanda.';
    } else if (mode === 'sfida') {
      avviso.className = 'modo-box modo-gioca';
      avviso.innerHTML = '📨 <b>Sfida a distanza:</b> giochi ora il tuo turno con ' + scelta.qLen +
        ' domande. ' + BT.esc(sfidaVerso.name) + ' risponder&agrave; alle stesse materie e alla stessa ' +
        'difficolt&agrave;, al suo livello, quando apre il link.';
    } else if (tipoPartita === 'allena') {
      avviso.className = 'modo-box modo-allena';
      avviso.innerHTML = '🎓 <b>Allenamento:</b> nessun punto in palio. ' +
        'Se sbagli non perdi niente e vedi subito la risposta giusta con la spiegazione.';
    } else {
      avviso.className = 'modo-box modo-gioca';
      avviso.innerHTML = '🏆 <b>Gioca:</b> ogni risposta giusta vale punti, ' +
        'ogni sbagliata te ne toglie <b>' + scelta.penalita + '</b>. Il punteggio non scende sotto zero.';
    }
  }

  function launch(cats) {
    BT.sfx.play('click');
    var diff = BT.store.settings().diff;
    if (mode === 'duel') {
      BT.game.start({ mode: 'duel', tipo: 'gioca', players: [duelSel[0], duelSel[1]],
        cats: cats, diff: diff });
    } else if (mode === 'sfida') {
      BT.game.start({ mode: 'solo', tipo: 'gioca', players: [player], cats: cats, diff: diff,
        extra: { tipo: 'sfida-crea', versoId: sfidaVerso.id, cats: cats, diff: diff } });
    } else {
      BT.game.start({ mode: 'solo', tipo: tipoPartita, players: [player], cats: cats, diff: diff });
    }
  }

  BT.startAllena = function () {
    mode = 'solo'; tipoPartita = 'allena';
    BT.show('screen-category'); renderCategories();
  };
  BT.startGioca = function () {
    mode = 'solo'; tipoPartita = 'gioca';
    BT.show('screen-category'); renderCategories();
  };
  BT.startSolo = BT.startGioca;

  /* ================= duello locale ================= */
  BT.renderDuelSetup = function (azzera) {
    var list = BT.store.all();
    if (azzera) duelSel = [player, null];
    [0, 1].forEach(function (slot) {
      var box = document.getElementById('duel-p' + (slot + 1));
      box.innerHTML = '';
      list.forEach(function (p) {
        var b = document.createElement('button');
        b.className = 'chip' + (duelSel[slot] && duelSel[slot].id === p.id ? ' sel' : '');
        b.innerHTML = '<span>' + BT.avatar(p.avatar) + '</span>' + BT.esc(p.name) +
          ' <small style="opacity:.6">' + BT.classeBreve(p) + '</small>';
        b.disabled = duelSel[1 - slot] && duelSel[1 - slot].id === p.id;
        b.onclick = function () { duelSel[slot] = p; BT.renderDuelSetup(); };
        box.appendChild(b);
      });
    });
    document.getElementById('duel-next').disabled = !(duelSel[0] && duelSel[1]);
  };

  /* ================= sfide a distanza ================= */
  function renderSfide() {
    var inArrivo = BT.sfide.perMe(player);
    var inviate = BT.sfide.mieInviate(player);
    var chiuse = BT.sfide.concluse(player);
    var html = '';

    if (!BT.online.attiva()) {
      html += '<div class="warn-box" style="margin-bottom:14px">Questa pagina non riesce a salvare per tutti, ' +
        'quindi le sfide a distanza non partono. Il duello sullo stesso dispositivo funziona lo stesso.</div>';
    }

    html += '<div class="card"><h2 class="card-title">⚔️ Sfide in arrivo</h2>';
    if (!inArrivo.length) {
      html += '<p class="hint" style="margin:0">Nessuna sfida da raccogliere. Lanciane una tu!</p>';
    } else {
      inArrivo.forEach(function (s) {
        html += '<div class="sfida-row">' +
          '<div class="sf-av">' + s.daAvatar + '</div>' +
          '<div class="sf-info"><div class="sf-nome">' + BT.esc(s.daNome) + ' ti ha sfidato</div>' +
            '<div class="sf-meta">' + descriviCats(s.cats) + ' &middot; ' + s.qLen + ' domande &middot; ' +
            dataBreve(s.quando) + '</div>' +
            '<div class="sf-meta">Ha fatto <b>' + s.daPunti + ' punti</b> con ' + s.daGiuste + ' risposte giuste</div>' +
          '</div>' +
          '<button class="btn btn-primary sf-btn" data-accetta="' + s.id + '">Accetta</button>' +
          '</div>';
      });
    }
    html += '</div>';

    if (inviate.length) {
      html += '<div class="card"><h2 class="card-title">⏳ In attesa di risposta</h2>';
      inviate.forEach(function (s) {
        html += '<div class="sfida-row">' +
          '<div class="sf-av">' + s.aAvatar + '</div>' +
          '<div class="sf-info"><div class="sf-nome">Hai sfidato ' + BT.esc(s.aNome) + '</div>' +
            '<div class="sf-meta">' + descriviCats(s.cats) + ' &middot; ' + s.qLen + ' domande &middot; ' +
            'il tuo punteggio: <b>' + s.daPunti + '</b></div>' +
            '<div class="sf-meta">Lanciata il ' + dataBreve(s.quando) + '</div></div>' +
          '<button class="btn btn-ghost sf-btn" data-annulla="' + s.id + '">Annulla</button>' +
          '</div>';
      });
      html += '</div>';
    }

    if (chiuse.length) {
      html += '<div class="card"><h2 class="card-title">📜 Sfide concluse</h2>';
      chiuse.forEach(function (s) {
        var ioSono = s.daId === player.id ? 'da' : 'a';
        var mioPunt = ioSono === 'da' ? s.daPunti : s.aPunti;
        var suoPunt = ioSono === 'da' ? s.aPunti : s.daPunti;
        var altro = ioSono === 'da' ? s.aNome : s.daNome;
        var esito = s.vincitore === null ? 'Pareggio' : (s.vincitore === player.id ? 'Hai vinto' : 'Hai perso');
        var cls = s.vincitore === null ? '' : (s.vincitore === player.id ? 'vinta' : 'persa');
        html += '<div class="sfida-row ' + cls + '">' +
          '<div class="sf-av">' + (s.vincitore === null ? '🤝' : (s.vincitore === player.id ? '🏆' : '💪')) + '</div>' +
          '<div class="sf-info"><div class="sf-nome">' + esito + ' contro ' + BT.esc(altro) + '</div>' +
            '<div class="sf-meta">' + mioPunt + ' a ' + suoPunt + ' &middot; ' + descriviCats(s.cats) + '</div></div>' +
          '</div>';
      });
      html += '</div>';
    }

    html += '<button class="btn btn-primary btn-block" id="sfida-nuova">Lancia una nuova sfida</button>';

    var box = document.getElementById('sfide-body');
    box.innerHTML = html;

    box.querySelectorAll('[data-accetta]').forEach(function (b) {
      b.onclick = function () { accettaSfida(b.dataset.accetta); };
    });
    box.querySelectorAll('[data-annulla]').forEach(function (b) {
      b.onclick = function () {
        var s = BT.sfide.trova(b.dataset.annulla);
        if (s && confirm('Annullare la sfida a ' + s.aNome + '?')) { BT.sfide.annulla(s); renderSfide(); }
      };
    });
    document.getElementById('sfida-nuova').onclick = function () {
      if (BT.store.all().length < 2) { BT.toast('Serve almeno un altro giocatore da sfidare.'); return; }
      BT.show('screen-sfida-setup');
      renderSfidaSetup();
    };
  }

  function descriviCats(cats) {
    if (!cats || cats.length >= BT.CATS.length) return 'Mix completo';
    return cats.map(function (c) { return BT.catInfo(c).name; }).join(', ');
  }

  function renderSfidaSetup() {
    sfidaVerso = null;
    var box = document.getElementById('sfida-avversari');
    box.innerHTML = '';
    BT.store.all().forEach(function (p) {
      if (p.id === player.id) return;
      var b = document.createElement('button');
      b.className = 'chip';
      b.innerHTML = '<span>' + BT.avatar(p.avatar) + '</span>' + BT.esc(p.name) +
        ' <small style="opacity:.6">' + BT.classeBreve(p) + '</small>';
      b.onclick = function () {
        sfidaVerso = p;
        box.querySelectorAll('.chip').forEach(function (x) { x.classList.remove('sel'); });
        b.classList.add('sel');
        document.getElementById('sfida-next').disabled = false;
      };
      box.appendChild(b);
    });
    document.getElementById('sfida-next').disabled = true;
  }

  function accettaSfida(id) {
    var s = BT.sfide.trova(id);
    if (!s) { BT.toast('Sfida non pi&ugrave; disponibile.'); renderSfide(); return; }
    sfidaAperta = s;
    mode = 'risposta';
    /* stessa difficolta' di chi ha lanciato la sfida; le sfide vecchie hanno solo qLen */
    BT.game.start({
      mode: 'solo', tipo: 'gioca', players: [player], cats: s.cats,
      diff: s.diff || 'medio', qLen: s.diff ? 0 : s.qLen,
      extra: { tipo: 'sfida-risposta', sfidaId: s.id }
    });
  }

  /* chiamato dal motore alla fine di ogni partita */
  BT.onFinish = function (modo, out, extra) {
    if (!extra) { mode = 'solo'; return; }
    var run = out[0].run;

    if (extra.tipo === 'sfida-crea') {
      var avversario = BT.store.get(extra.versoId);
      if (!avversario) return;
      var s = BT.sfide.crea(player, avversario, extra.cats,
        run.qLen || BT.diff(extra.diff).qLen, run, ora(), extra.diff || run.diff);
      mostraEsitoSfida(
        '📨', 'Sfida lanciata!',
        'Hai fatto <b>' + run.score + ' punti</b>. Ora tocca a ' + BT.esc(avversario.name) +
        ': la trover&agrave; aprendo il link, anche da un altro dispositivo.',
        s);
    }

    if (extra.tipo === 'sfida-risposta') {
      var sf = BT.sfide.trova(extra.sfidaId);
      if (!sf || sf.stato === 'chiusa') return;
      BT.sfide.rispondi(sf, run, ora());
      var vinta = sf.vincitore === player.id;
      var pari = sf.vincitore === null;
      BT.store.recordDuel(player, vinta);
      var avv = BT.store.get(sf.daId);
      if (avv) BT.store.recordDuel(avv, sf.vincitore === sf.daId);
      BT.sfx.play(vinta ? 'vittoria' : 'coppa');
      mostraEsitoSfida(
        pari ? '🤝' : (vinta ? '🏆' : '💪'),
        pari ? 'Pareggio!' : (vinta ? 'Hai vinto la sfida!' : 'Ha vinto ' + BT.esc(sf.daNome)),
        '<b>' + BT.esc(sf.daNome) + '</b> ' + sf.daPunti + ' punti &nbsp;·&nbsp; <b>' +
        BT.esc(player.name) + '</b> ' + sf.aPunti + ' punti.<br>' +
        'Ognuno ha risposto a domande del proprio livello.',
        sf);
    }
    mode = 'solo';
  };

  function mostraEsitoSfida(ico, titolo, testo, s) {
    var box = document.getElementById('result-body');
    var extra = '<div class="res-card" style="margin-top:14px">' +
      '<div class="res-ico">' + ico + '</div>' +
      '<div class="res-title">' + titolo + '</div>' +
      '<div class="res-sub" style="margin-bottom:0">' + testo + '</div>' +
      '<div class="row-btns"><button class="btn btn-ghost" id="es-menu">Torna al menu</button>' +
      '<button class="btn btn-primary" id="es-sfide">Vedi le sfide</button></div></div>';
    box.insertAdjacentHTML('afterbegin', extra);
    box.querySelector('#es-menu').onclick = function () { BT.show('screen-menu'); BT.renderMenu(); };
    box.querySelector('#es-sfide').onclick = function () { BT.show('screen-sfide'); renderSfide(); };
  }

  /* ================= negozio ================= */
  var reparto = 'aiuti';

  var NOTE = {
    aiuti:  'Si consumano quando li usi: comprane quanti ne vuoi.',
    avatar: 'Una volta comprati restano tuoi per sempre e si aggiungono alla griglia degli avatar.',
    titolo: 'Il titolo compare sotto il tuo nome, nel menu e in classifica. Puoi cambiarlo quando vuoi.',
    tema:   'Cambia i colori di tutto il gioco. Anche questi restano sbloccati per sempre.'
  };

  function applicaTema(p) {
    var t = (p && p.tema) || 'azzurro';
    if (t === 'azzurro') delete document.body.dataset.tema;
    else document.body.dataset.tema = t;
  }

  function renderShop() {
    BT.store.normalizza(player);
    document.getElementById('shop-coins').textContent = player.coins;
    document.getElementById('shop-nota').innerHTML = NOTE[reparto];
    document.querySelectorAll('#shop-tabs .shop-tab').forEach(function (b) {
      b.classList.toggle('active', b.dataset.rep === reparto);
    });

    var box = document.getElementById('shop-list');
    box.innerHTML = '';

    if (reparto === 'aiuti') {
      BT.POWERUPS.forEach(function (pu) {
        var have = player.inventory[pu.id] || 0;
        var aperto = BT.aiutoSbloccato(player, pu);

        var item = document.createElement('div');
        item.className = 'shop-item' + (aperto ? '' : ' chiuso');
        item.innerHTML =
          '<div class="shop-ico">' + (aperto ? pu.ico : '🔒') + '</div>' +
          '<div class="shop-info"><div class="shop-name">' + pu.name + '</div>' +
            '<div class="shop-desc">' + pu.desc + '</div>' +
            (have ? '<div class="shop-own">Ne hai ' + have + '</div>' : '') +
            (aperto ? '' : '<div class="shop-lock">🔒 ' + BT.comeSbloccare(pu) + '</div>') + '</div>' +
          '<button class="shop-buy' + (aperto ? '' : ' bloccato') + '">' +
            (aperto ? pu.cost + ' 🏆' : 'liv. ' + pu.liv) + '</button>';

        var btn = item.querySelector('.shop-buy');
        btn.disabled = !aperto || player.coins < pu.cost;
        btn.onclick = function () {
          if (!aperto) { BT.toast(BT.comeSbloccare(pu)); return; }
          if (BT.store.buy(player, pu.id)) {
            BT.sfx.play('coppa'); BT.toast(pu.name + ' comprato!');
            renderShop(); BT.refreshTopbar();
          } else BT.toast('Coppe insufficienti. Gioca per guadagnarne!');
        };
        box.appendChild(item);
      });
      return;
    }

    BT.SBLOCCABILI[reparto].forEach(function (art) {
      var mio = art.cost === 0 || BT.store.haSbloccato(player, reparto, art.id);
      var inUso = (reparto === 'titolo' && player.titolo === art.id) ||
                  (reparto === 'tema' && player.tema === art.id) ||
                  (reparto === 'avatar' && player.avatar === art.id);

      var icona = reparto === 'tema'
        ? '<div class="anteprima-tema" style="background:linear-gradient(135deg,' +
            art.col1 + ',' + art.col2 + ')"></div>'
        : '<div class="shop-ico">' + (reparto === 'avatar' ? art.id : '🎖️') + '</div>';

      var item = document.createElement('div');
      item.className = 'shop-item' + (mio ? ' posseduto' : '');
      item.innerHTML = icona +
        '<div class="shop-info"><div class="shop-name">' + art.name + '</div>' +
          '<div class="shop-desc">' + art.desc + '</div>' +
          (inUso ? '<div class="shop-own">In uso adesso</div>' : '') + '</div>' +
        (mio ? '<button class="shop-usa">' + (inUso ? '✓ In uso' : 'Usa') + '</button>'
             : '<button class="shop-buy">' + art.cost + ' 🏆</button>');

      var compra = item.querySelector('.shop-buy');
      if (compra) {
        compra.disabled = player.coins < art.cost;
        compra.onclick = function () {
          if (BT.store.sblocca(player, reparto, art.id)) {
            BT.sfx.play('livello');
            BT.toast(art.name + ' sbloccato e messo in uso!');
            if (reparto === 'tema') applicaTema(player);
            renderShop(); BT.refreshTopbar();
          } else BT.toast('Coppe insufficienti. Gioca per guadagnarne!');
        };
      }
      var usa = item.querySelector('.shop-usa');
      if (usa) {
        usa.disabled = inUso && reparto !== 'titolo';
        usa.onclick = function () {
          BT.store.usa(player, reparto, art.id);
          if (reparto === 'tema') applicaTema(player);
          BT.sfx.play('click');
          renderShop(); BT.refreshTopbar();
        };
      }
      box.appendChild(item);
    });
  }

  /* ================= classifica ================= */
  var rankMode = 'brain';
  function renderRank() {
    var list = BT.store.all().slice();
    if (rankMode === 'brain') list.sort(function (a, b) { return b.xp - a.xp; });
    else list.sort(function (a, b) { return BT.store.skillIndex(b) - BT.store.skillIndex(a); });

    var box = document.getElementById('rank-list');
    box.innerHTML = '';
    if (!list.length) { box.innerHTML = '<p class="empty-note" style="color:#fff">Ancora nessun giocatore.</p>'; return; }

    list.forEach(function (p, i) {
      var lvl = BT.levelFromXp(p.xp);
      var acc = p.answered ? Math.round(p.correct / p.answered * 100) : 0;
      var val = rankMode === 'brain' ? p.xp : (BT.store.skillIndex(p) || '—');
      var medal = ['🥇', '🥈', '🥉'][i] || (i + 1);
      var row = document.createElement('div');
      row.className = 'rank-row' + (i === 0 ? ' first' : '') + (player && p.id === player.id ? ' io' : '');
      row.innerHTML = '<div class="rank-pos">' + medal + '</div>' +
        '<div class="rank-av">' + BT.avatar(p.avatar) + '</div>' +
        '<div class="rank-info"><div class="rank-nm">' + BT.esc(p.name) +
          ' <small style="opacity:.55">' + BT.classeBreve(p) + '</small>' +
          (p.titolo && BT.titolo(p.titolo)
            ? ' <span class="rank-titolo">' + BT.titolo(p.titolo).name + '</span>' : '') + '</div>' +
          '<div class="rank-meta">Liv. ' + lvl + ' &middot; precisione ' + acc + '% &middot; ' +
          p.answered + ' domande &middot; duelli vinti ' + p.duelsWon + '</div></div>' +
        '<div class="rank-val">' + val + '</div>';
      box.appendChild(row);
    });

    document.getElementById('rank-hint').innerHTML = rankMode === 'brain'
      ? 'I <b>Punti Cervello</b> premiano chi gioca tanto e risponde bene. La classifica &egrave; uguale su tutti i dispositivi.'
      : 'L\'<b>Indice Bravura</b> misura solo la precisione: confronta giocatori di livelli diversi. Servono almeno 5 domande.';
    document.querySelectorAll('#rank-seg .seg-btn').forEach(function (b) {
      b.classList.toggle('active', b.dataset.rank === rankMode);
    });
  }

  /* ================= statistiche ================= */
  function renderStats() {
    var acc = player.answered ? Math.round(player.correct / player.answered * 100) : 0;
    var html = '<div class="card"><h2 class="card-title">' + player.avatar + ' ' + BT.esc(player.name) + '</h2>' +
      '<div class="res-stats">' +
        '<div class="res-stat"><b>' + player.answered + '</b><span>domande giocate</span></div>' +
        '<div class="res-stat"><b>' + acc + '%</b><span>precisione</span></div>' +
        '<div class="res-stat"><b>' + player.bestRun + '</b><span>record in una partita</span></div></div>' +
      '<div class="res-stats" style="margin-bottom:0">' +
        '<div class="res-stat"><b>' + player.bestStreak + '</b><span>serie record</span></div>' +
        '<div class="res-stat"><b>' + player.duelsWon + '</b><span>duelli vinti</span></div>' +
        '<div class="res-stat"><b>' + player.coins + '</b><span>coppe</span></div></div></div>';

    html += '<div class="card"><h2 class="card-title">Materia per materia</h2>';
    var righe = BT.CATS.map(function (c) {
      var d = player.byCat[c.id] || { a: 0, c: 0 };
      return { c: c, a: d.a, ok: d.c, perc: d.a ? Math.round(d.c / d.a * 100) : -1 };
    });
    var giocate = righe.filter(function (r) { return r.a > 0; });

    if (!giocate.length) {
      html += '<p class="hint" style="margin:0">Gioca qualche partita e qui vedrai in quali materie sei pi&ugrave; forte.</p>';
    } else {
      righe.forEach(function (r) {
        var perc = r.perc < 0 ? 0 : r.perc;
        var col = r.perc < 0 ? 'var(--azzurro-100)' : r.perc >= 75 ? 'var(--verde)'
                : r.perc >= 50 ? 'var(--oro)' : 'var(--rosso)';
        html += '<div class="bar-row"><div class="bar-head"><span>' + r.c.ico + ' ' + r.c.name + '</span>' +
          '<span>' + (r.perc < 0 ? 'mai giocata' : r.ok + '/' + r.a + ' &middot; ' + r.perc + '%') + '</span></div>' +
          '<div class="bar-track"><div class="bar-fill" style="width:' + perc + '%;background:' + col + '"></div></div></div>';
      });
      var best = giocate.slice().sort(function (x, y) { return y.perc - x.perc; })[0];
      var worst = giocate.slice().sort(function (x, y) { return x.perc - y.perc; })[0];
      html += '<p class="hint">Punto di forza: <b>' + best.c.name + '</b>.' +
        (best.c.id !== worst.c.id ? ' Da allenare: <b>' + worst.c.name + '</b>.' : '') + '</p>';
    }
    document.getElementById('stats-body').innerHTML = html + '</div>';
  }

  /* ================= impostazioni ================= */
  function renderSettings() {
    var s = BT.store.settings();
    var b = document.getElementById('set-sound');
    b.textContent = s.sound ? 'Attivi' : 'Disattivati';
    b.className = 'btn ' + (s.sound ? 'btn-primary' : 'btn-ghost');

    var m = document.getElementById('set-musica');
    if (m) {
      var accesa = s.musica !== false;
      m.textContent = accesa ? 'Attiva' : 'Disattivata';
      m.className = 'btn ' + (accesa ? 'btn-primary' : 'btn-ghost');
    }

    document.getElementById('set-stato').innerHTML = BT.online.attiva()
      ? 'I punteggi e le sfide sono <b>condivisi</b>: chiunque apra il link vede gli stessi dati.'
      : 'In questo momento la pagina <b>non riesce a condividere</b> i dati. Puoi giocare, ma i risultati potrebbero non arrivare agli altri.';

    document.getElementById('set-export').style.display = downloads ? '' : 'none';
    var msg = document.getElementById('set-msg');
    if (msg) msg.textContent = '';
    renderDati();
  }

  /* ================= i tuoi dati =================
     Qui i dati sono condivisi: li vedono tutti quelli che aprono la pagina.
     Proprio per questo cancellarsi dev'essere facile quanto cominciare a
     giocare, e si deve poter leggere in chiaro che cosa il gioco sa di te. */
  function riepilogoDati(p) {
    return 'Di te il gioco tiene solo questo: il nome <b>' + BT.esc(p.name) + '</b>, ' +
      'la faccia che hai scelto, <b>' + BT.nomeClasse(p) + '</b>, i punti (' + p.xp + '), ' +
      'le coppe (' + p.coins + '), quante domande hai fatto e quante giuste, gli sblocchi ' +
      'del Negozio, le scoperte e i tempi dei labirinti.<br>' +
      'Niente cognome, niente indirizzo, nessun messaggio scritto: nel gioco non si scrive.<br>' +
      '<b>Qui i dati sono condivisi</b>: chi apre questa pagina vede il tuo nome e i tuoi punti ' +
      'in classifica.';
  }

  function renderDati() {
    var box = document.getElementById('set-dati');
    var btn = document.getElementById('set-cancellami');
    if (!box || !btn) return;
    box.innerHTML = player ? riepilogoDati(player) : 'Scegli prima un giocatore.';
    btn.disabled = !player;
    var m = document.getElementById('set-cancella-msg');
    if (m) m.textContent = '';
  }

  function cancellaProfilo() {
    if (!player) return;
    var nome = player.name;
    if (!confirm('Vuoi cancellare il profilo di ' + nome + '?\n\n' +
                 'Spariscono punti, coppe, sblocchi, scoperte e tempi dei labirinti, ' +
                 'e il nome esce dalla classifica per tutti.')) return;
    if (!confirm('Sicuro? È l\'ultima domanda.\nIl profilo di ' + nome +
                 ' viene cancellato per sempre, su tutti i dispositivi.')) return;
    BT.store.remove(player.id);        /* toglie anche le sfide che lo riguardano */
    player = null;
    applicaTema(null);
    BT.toast('Profilo di ' + nome + ' cancellato.');
    BT.show('screen-home');
    BT.renderHome();
  }

  function scaricaBackup() {
    if (!downloads) return;
    var d = new Date();
    var stamp = d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2);
    downloads.save({ filename: 'brain-time-backup-' + stamp + '.json', data: BT.store.exportJSON() })
      .then(function () { document.getElementById('set-msg').textContent = 'Backup salvato.'; })
      .catch(function () { document.getElementById('set-msg').textContent = 'Backup annullato o non riuscito.'; });
  }

  /* ================= labirinti ================= */
  function apriLabirinti() {
    BT.store.normalizza(player);
    var stato = player.labirinto;
    var massimo = Math.max(20, stato.livello + 4);

    document.getElementById('laby-intro').innerHTML =
      'Trova l\'uscita prima che scada il tempo. Ogni labirinto &egrave; un po\' pi&ugrave; grande del ' +
      'precedente: il primo &egrave; una passeggiata, il ventesimo no. Hai finito ' +
      '<b>' + stato.completati + '</b> ' + BT.plural(stato.completati, 'labirinto', 'labirinti') +
      '. Comandi: frecce della tastiera, i tasti qui sotto, oppure trascina il dito sullo schermo.';

    var lista = document.getElementById('laby-lista');
    lista.innerHTML = '';
    for (var i = 1; i <= massimo; i++) {
      (function (liv) {
        var fatto = !!stato.tempi[liv];
        var aperto = liv <= stato.livello;
        var b = document.createElement('button');
        b.className = 'laby-btn' + (!aperto ? ' chiuso' : liv === stato.livello ? ' prossimo' : fatto ? ' fatto' : '');
        b.innerHTML = '<b>' + (aperto ? liv : '🔒') + '</b>' +
          '<small>' + (fatto ? stato.tempi[liv] + 's' : aperto ? 'da fare' : 'chiuso') + '</small>';
        b.disabled = !aperto;
        b.onclick = function () { BT.laby.gioca(player, liv, { allena: tipoPartita === 'allena' }); };
        lista.appendChild(b);
      })(i);
    }
    BT.show('screen-laby-home');
  }

  BT.laby.mostraEsito = function (e) {
    var html;
    if (e.allena) {
      var st = '⭐'.repeat(e.stelle) + '☆'.repeat(3 - e.stelle);
      html = '<div class="res-card senza-punti">' +
        '<div class="res-ico">🏁</div>' +
        '<div class="res-title">Uscita trovata!</div>' +
        '<div class="res-sub">Labirinto ' + e.livello + ' &mdash; ' + st + '<br>' +
          '<b>Allenamento</b>: niente punti e niente coppe, ma adesso lo sai fare.</div>' +
        '<div class="res-stats">' +
          '<div class="res-stat"><b>' + e.secondi + 's</b><span>tempo</span></div>' +
          '<div class="res-stat"><b>' + e.mosse + '</b><span>mosse</span></div>' +
        '</div>' +
        '<div class="row-btns">' +
          '<button class="btn btn-ghost" id="lb-lista">Altri labirinti</button>' +
          '<button class="btn btn-primary" id="lb-avanti">Prossimo</button>' +
        '</div></div>';
    } else if (e.barato) {
      /* passato col teletrasporto: si vede subito che non e' una vittoria vera */
      html = '<div class="res-card">' +
        '<div class="res-ico">🌀</div>' +
        '<div class="res-title">Teletrasportato!</div>' +
        '<div class="res-sub">Sei sbucato all&rsquo;uscita del labirinto ' + e.livello + '. ' +
          'Il prossimo si apre, ma <b>niente punti e niente coppe</b>: il teletrasporto ' +
          'fa passare, non fa vincere.</div>' +
        '<div class="row-btns">' +
          '<button class="btn btn-ghost" id="lb-lista">Altri labirinti</button>' +
          '<button class="btn btn-primary" id="lb-avanti">Prossimo</button>' +
        '</div></div>';
    } else if (e.vinto) {
      var stelle = '⭐'.repeat(e.stelle) + '☆'.repeat(3 - e.stelle);
      html = '<div class="res-card">' +
        '<div class="res-ico">🏁</div>' +
        '<div class="res-title">Uscita trovata!</div>' +
        '<div class="res-sub">Labirinto ' + e.livello + ' &mdash; ' + stelle + '</div>' +
        '<div class="res-stats">' +
          '<div class="res-stat"><b>' + e.secondi + 's</b><span>tempo</span></div>' +
          '<div class="res-stat"><b>' + e.mosse + '</b><span>mosse</span></div>' +
          '<div class="res-stat"><b>+' + e.punti + '</b><span>punti</span></div>' +
        '</div>' +
        '<div class="res-reward">+' + e.coppe + ' coppe 🏆' +
          (e.primaVolta ? '' : ' &nbsp;(livello gi&agrave; fatto: premio ridotto)') + '</div>';
      if (e.salita.levelUp) {
        html += '<div class="res-levelup">🚀 Sei salito al <b>livello ' + e.salita.to +
          '</b>: ' + BT.levelTitle(e.salita.to) + '!</div>';
      }
      html += '<div class="row-btns">' +
          '<button class="btn btn-ghost" id="lb-lista">Altri labirinti</button>' +
          '<button class="btn btn-primary" id="lb-avanti">Prossimo</button>' +
        '</div>' +
        (player.casse && player.casse.pronte
          ? '<button class="btn btn-gold btn-block" id="lb-cassa">🎁 Hai trovato una cassa!</button>' : '') +
        '</div>';
    } else {
      html = '<div class="res-card">' +
        '<div class="res-ico">⏰</div>' +
        '<div class="res-title">Tempo scaduto</div>' +
        '<div class="res-sub">Il labirinto ' + e.livello + ' resta l&igrave;: puoi riprovare quante volte vuoi, ' +
          'non perdi niente.</div>' +
        '<div class="row-btns">' +
          '<button class="btn btn-ghost" id="lb-lista">Torna alla lista</button>' +
          '<button class="btn btn-primary" id="lb-riprova">Riprova</button>' +
        '</div></div>';
    }

    var box = document.getElementById('laby-esito');
    box.innerHTML = html;
    BT.show('screen-laby-fine');

    var b1 = box.querySelector('#lb-lista');
    if (b1) b1.onclick = function () { apriLabirinti(); };
    var b2 = box.querySelector('#lb-avanti');
    if (b2) b2.onclick = function () { BT.laby.gioca(player, e.livello + 1, { allena: tipoPartita === 'allena' }); };
    var b3 = box.querySelector('#lb-riprova');
    if (b3) b3.onclick = function () { BT.laby.gioca(player, e.livello, { allena: tipoPartita === 'allena' }); };
    var b4 = box.querySelector('#lb-cassa');
    if (b4) b4.onclick = function () { BT.mostraCassa(player); };
  };

  /* ================= esito di "Impara una lingua" ================= */
  BT.lingue.mostraEsito = function (e) {
    var lin = BT.lingua(e.lingua);
    var tutte = e.giuste === e.totali;
    var html = '<div class="res-card' + (e.tipo === 'allena' ? ' senza-punti' : '') + '">' +
      /* icona neutra: su Windows le bandiere emoji diventano due lettere */
      '<div class="res-ico">' + lin.ico + '</div>' +
      '<div class="res-title">' + (tutte ? 'Tutte giuste!' : 'Fine!') + '</div>' +
      '<div class="res-sub">' + lin.nome + ' &mdash; <b>' + e.giuste + '</b> su ' + e.totali +
        (e.tipo === 'allena' ? '<br><b>Allenamento</b>: niente punti, solo esercizio.' : '') +
      '</div>';

    if (e.tipo !== 'allena') {
      html += '<div class="res-stats">' +
          '<div class="res-stat"><b>+' + e.punti + '</b><span>punti</span></div>' +
          '<div class="res-stat"><b>+' + e.coppe + '</b><span>coppe</span></div>' +
        '</div>';
      if (e.salita && e.salita.levelUp) {
        html += '<div class="res-levelup">🚀 Sei salito al <b>livello ' + e.salita.to +
          '</b>: ' + BT.levelTitle(e.salita.to) + '!</div>';
      }
    }

    html += '<div class="row-btns">' +
        '<button class="btn btn-ghost" id="lg-menu">Torna al menu</button>' +
        '<button class="btn btn-primary" id="lg-ancora">Ancora</button>' +
      '</div>' +
      (player.casse && player.casse.pronte
        ? '<button class="btn btn-gold btn-block" id="lg-cassa">🎁 Hai trovato una cassa!</button>' : '') +
      '</div>';

    var box = document.getElementById('lingua-esito');
    box.innerHTML = html;
    BT.show('screen-lingua-fine');
    BT.refreshTopbar();

    box.querySelector('#lg-menu').onclick = function () { BT.show('screen-menu'); BT.renderMenu(); };
    box.querySelector('#lg-ancora').onclick = function () {
      BT.lingue.start({ player: player, tipo: e.tipo, lingua: e.lingua });
    };
    var c = box.querySelector('#lg-cassa');
    if (c) c.onclick = function () { BT.mostraCassa(player); };
  };

  /* ================= limite di tempo =================
     Trenta minuti di gioco, poi tre ore di pausa. Il controllo sta
     all'ingresso di ogni partita: chi e' gia' dentro la finisce. */
  function controllaLimite() {
    if (!BT.limite || BT.limite.puoiGiocare(player)) return true;
    mostraPausa();
    return false;
  }

  function mostraPausa() {
    var s = BT.limite.stato(player);
    document.getElementById('pausa-box').innerHTML =
      '<div class="res-card">' +
        '<div class="res-ico">⏳</div>' +
        '<div class="res-title">Pausa!</div>' +
        '<div class="res-sub">Hai giocato <b>' + BT.limite.MINUTI + ' minuti</b> di fila. ' +
          'Adesso si stacca: si riprende fra <b>' + BT.limite.attesa(s.mancaMs) + '</b>, ' +
          'cio&egrave; alle <b>' + BT.limite.orario(s.fineBlocco) + '</b>.</div>' +
        '<div class="res-reward">Intanto puoi guardare le tue <b>Scoperte</b>, la classifica ' +
          'o sistemare il Negozio: quelle non consumano tempo.</div>' +
        '<div class="row-btns">' +
          '<button class="btn btn-primary btn-block" id="pausa-ok">Va bene</button>' +
        '</div>' +
      '</div>';
    document.getElementById('pausa-ok').onclick = function () { BT.show('screen-menu'); BT.renderMenu(); };
    BT.show('screen-pausa');
  }

  /* la striscia nel menu che dice quanto tempo resta */
  function bannerTempo() {
    var vecchio = document.getElementById('menu-tempo');
    if (vecchio) vecchio.remove();
    if (!BT.limite || !player) return;
    if (BT.limite.spento && BT.limite.spento()) return;   /* limite spento: niente striscia */
    var s = BT.limite.stato(player);
    var d = document.createElement('div');
    d.id = 'menu-tempo';
    d.className = 'tempo-riga' + (s.bloccato ? ' fermo' : s.restanoMin <= 5 ? ' quasi' : '');
    d.innerHTML = s.bloccato
      ? '⏳ Pausa: si riprende fra <b>' + BT.limite.attesa(s.mancaMs) + '</b>'
      : '⏱️ Puoi ancora giocare <b>' + s.restanoMin + '</b> ' +
        BT.plural(s.restanoMin, 'minuto', 'minuti');
    var card = document.getElementById('menu-player-card');
    card.parentNode.insertBefore(d, card.nextSibling);
  }

  /* ================= casse sorpresa =================
     Tre momenti: la scelta (aprire o tenere da parte), la stella
     (un tocco per ogni cassa rimandata, e a ogni tocco la rarita'
     sale di un gradino) e infine i premi.
     L'ultimo gradino non si annuncia mai: prima di arrivarci e' "???". */
  function etichettaRar(r, svelata) {
    return (r.misteriosa && !svelata)
      ? { nome: '???', ico: '&#10068;', id: 'misteriosa' }
      : { nome: r.nome, ico: r.ico, id: r.id };
  }

  BT.mostraCassa = function (p) {
    p = p || player;
    BT.store.normalizza(p);
    var molt = p.casse.moltiplicatore;
    var rar = BT.rarita(molt);
    var alMassimo = molt >= BT.RARITA_MAX;
    var pross = etichettaRar(BT.rarita(molt + 1), false);
    var ora = etichettaRar(rar, true);

    var html = '<div class="cassa-box">' +
      '<div class="cassa-ico">🎁</div>' +
      '<div class="cassa-titolo">Una cassa sorpresa!</div>' +
      '<div class="cassa-molt"><span class="rar-tag rar-' + ora.id + '">' +
        ora.ico + ' ' + ora.nome + '</span> &middot; ' + molt +
        (molt === 1 ? ' tocco' : ' tocchi') + ' di stella</div>' +
      '<div class="cassa-testo">' +
        (alMassimo
          ? 'Sei arrivato in cima: pi&ugrave; in alto di cos&igrave; non si va. Prendila!'
          : 'Se la <b>rifiuti</b> la prossima vale il doppio: diventa <b>' + pross.nome +
            '</b> ' + pross.ico + ', con un tocco in pi&ugrave; sulla stella.') +
      '</div>' +
      '<div class="row-btns">' +
        (alMassimo ? '' : '<button class="btn btn-ghost" id="cassa-poi">Rifiuta &mdash; la prossima vale il doppio</button>') +
        '<button class="btn btn-gold" id="cassa-ora">Accetta il premio</button>' +
      '</div></div>';

    var box = document.getElementById('cassa-body');
    box.innerHTML = html;
    BT.show('screen-cassa');

    box.querySelector('#cassa-ora').onclick = function () { mostraStella(p, molt); };
    var poi = box.querySelector('#cassa-poi');
    if (poi) poi.onclick = function () {
      BT.sfx.play('click');
      mostraRimandata(p, BT.casse.rimanda(p));
    };
  };

  /* Cassa messa da parte: prima si tornava al menu da soli e la pagina si
     ricaricava pure (ogni salvataggio ripubblica), quindi non si faceva in
     tempo a leggere quanto varra' la prossima. Adesso si esce a comando. */
  function mostraRimandata(p, rar) {
    var d = etichettaRar(rar, false);
    var quanto = rar.misteriosa
      ? 'Non si sa che cosa contenga: si scopre solo arrivandoci.'
      : 'Dentro ci saranno <b>' + rar.premi + '</b> ' +
        BT.plural(rar.premi, 'premio', 'premi') + ' e da <b>' + rar.coppe[0] +
        '</b> a <b>' + rar.coppe[1] + '</b> coppe.';

    var box = document.getElementById('cassa-body');
    box.innerHTML = '<div class="cassa-box" data-rar="' + rar.id + '">' +
      '<div class="cassa-ico">⏳</div>' +
      '<div class="cassa-titolo">Cassa messa da parte</div>' +
      '<div class="cassa-molt"><span class="rar-tag rar-' + d.id + '">' +
        d.ico + ' ' + d.nome + '</span></div>' +
      '<div class="cassa-testo">La prossima vale <b>il doppio</b>. ' + quanto + '</div>' +
      '<div class="cassa-leggi">Nessuna fretta: si esce da qui solo col tasto.</div>' +
      '<button class="btn btn-gold btn-block" id="cassa-via">&#10004; Va bene</button>' +
      '</div>';
    BT.show('screen-cassa');

    box.querySelector('#cassa-via').onclick = function () {
      BT.casse.rimandataLetta(p);
      BT.show('screen-menu'); BT.renderMenu();
    };
  }

  /* la stella: ogni tocco un gradino di rarita', poi si apre da sola */
  function mostraStella(p, tocchi) {
    var livello = 0, finito = false;
    var box = document.getElementById('cassa-body');

    box.innerHTML = '<div class="cassa-box stella-box" id="stella-box">' +
      '<div class="stella-eti" id="stella-eti">Tocca la stella!</div>' +
      '<button class="stella" id="stella-tap" aria-label="Tocca la stella">⭐</button>' +
      '<div class="stella-rar" id="stella-rar">&nbsp;</div>' +
      '<div class="stella-punti" id="stella-punti"></div>' +
      '</div>';

    var eti = box.querySelector('#stella-eti');
    var rarEl = box.querySelector('#stella-rar');
    var punti = box.querySelector('#stella-punti');
    var stella = box.querySelector('#stella-tap');
    var cont = box.querySelector('#stella-box');

    function disegnaPunti() {
      var s = '';
      for (var i = 1; i <= tocchi; i++) {
        s += '<span class="pallino' + (i <= livello ? ' acceso' : '') + '"></span>';
      }
      punti.innerHTML = s;
    }
    disegnaPunti();

    stella.onclick = function () {
      if (finito) return;
      livello++;
      var r = BT.rarita(livello);
      cont.setAttribute('data-rar', r.id);
      rarEl.innerHTML = '<span class="rar-tag rar-' + r.id + '">' + r.ico + ' ' + r.nome + '</span>';
      stella.innerHTML = r.ico;
      stella.classList.remove('pulsa');
      void stella.offsetWidth;            // riavvia l'animazione
      stella.classList.add('pulsa');
      disegnaPunti();
      BT.sfx.stella(livello);

      if (livello >= tocchi) {
        finito = true;
        eti.innerHTML = r.misteriosa
          ? 'La cassa <b>Segreta</b>! Non capita spesso.'
          : 'Cassa <b>' + r.nome + '</b>!';
        stella.disabled = true;
        setTimeout(function () { apriCassa(p); }, r.misteriosa ? 1100 : 700);
      } else {
        var manca = tocchi - livello;
        eti.innerHTML = 'Ancora ' + manca + (manca === 1 ? ' tocco' : ' tocchi') + '!';
      }
    };
  }

  function apriCassa(p) {
    var esito = BT.casse.apri(p);
    if (!esito) { BT.show('screen-menu'); BT.renderMenu(); return; }
    BT.sfx.play('vittoria');
    mostraPremi(p, esito);
  }

  /* L'elenco dei premi non se ne va da solo e non ha nessun timer: resta
     finche' il giocatore non preme "Ho letto". Serve davvero, perche' qui
     ogni salvataggio ripubblica la pagina e la pagina si ricarica: i premi
     sono scritti nel profilo, quindi questa schermata ricompare da sola
     dopo il ricaricamento e sparisce solo a comando. */
  function mostraPremi(p, esito) {
    var rar = esito.rarita || BT.rarita(esito.molt);

    var html = '<div class="cassa-box" data-rar="' + rar.id + '">' +
      '<div class="cassa-ico">🎉</div>' +
      '<div class="cassa-titolo">Guarda cosa c\'era dentro</div>' +
      '<div class="cassa-molt"><span class="rar-tag rar-' + rar.id + '">' +
        rar.ico + ' Cassa ' + rar.nome + '</span></div>' +
      '</div>';

    esito.premi.forEach(function (pr) {
      html += '<div class="premio' + (pr.tipo === 'scoperta' ? ' scoperta' : '') + '">' +
        '<div class="premio-ico">' + pr.ico + '</div>' +
        '<div>' +
          (pr.etichetta ? '<div class="premio-eti">' + pr.etichetta + '</div>' : '') +
          '<div class="premio-nome">' + pr.titolo + '</div>' +
          '<div class="premio-testo">' + pr.testo + '</div>' +
        '</div></div>';
    });

    html += '<div class="cassa-leggi">Leggi con calma: questa schermata resta ' +
        'finch&eacute; non premi il tasto qui sotto.</div>' +
      '<button class="btn btn-gold btn-block" id="cassa-ok">&#10004; Ho letto, va bene</button>' +
      (p.casse.pronte
        ? '<button class="btn btn-ghost btn-block" id="cassa-altra">Apri la prossima 🎁</button>' : '');

    var box = document.getElementById('cassa-body');
    box.innerHTML = html;
    BT.show('screen-cassa');
    BT.refreshTopbar();

    box.querySelector('#cassa-ok').onclick = function () {
      BT.casse.letta(p);
      BT.show('screen-menu'); BT.renderMenu();
    };
    var altra = box.querySelector('#cassa-altra');
    if (altra) altra.onclick = function () { BT.casse.letta(p); BT.mostraCassa(p); };
  }

  /* ================= scoperte ================= */
  function renderScoperte() {
    BT.store.normalizza(player);
    var conto = BT.casse.scoperte(player);
    var html = '<div class="card"><h2 class="card-title">💡 ' + conto.trovate + ' su ' + conto.totali + '</h2>' +
      '<p class="hint" style="margin-top:0">Le scoperte si trovano dentro le <b>casse sorpresa</b>, ' +
      'che arrivano ogni volta che sali di livello. Sono trucchi per studiare, per aggiustare le cose, ' +
      'per orientarsi, e storie di come sono nate le invenzioni.</p></div>';

    if (!conto.trovate) {
      html += '<div class="card"><p class="hint" style="margin:0">Non ne hai ancora trovata nessuna. ' +
        'Gioca, sali di livello e apri la prima cassa!</p></div>';
    } else {
      BT.TIPI_SCOPERTA.forEach(function (t) {
        var mie = player.scoperte.map(BT.scoperta).filter(function (c) { return c && c.tipo === t.id; });
        if (!mie.length) return;
        html += '<div class="card"><h2 class="card-title">' + t.ico + ' ' + t.nome + '</h2>';
        mie.forEach(function (c) {
          html += '<div class="scoperta-riga">' +
            '<div class="sc-tit">' + c.ico + ' ' + c.titolo + '</div>' +
            '<div class="sc-txt">' + c.testo + '</div></div>';
        });
        html += '</div>';
      });
    }
    document.getElementById('scoperte-body').innerHTML = html;
    BT.show('screen-scoperte');
  }

  /* ================= avvio ================= */
  function init() {
    var statoIniziale = BT.online.cattura();      // PRIMA di disegnare qualsiasi cosa
    BT.storeOnline.init(statoIniziale, renderStatoSync);
    BT.sfx.setOn(BT.store.settings().sound !== false);

    document.getElementById('btn-back').onclick = goBack;

    document.getElementById('btn-new-profile').onclick = function () {
      BT.show('screen-newprofile'); renderNewProfile();
    };
    document.getElementById('np-cancel').onclick = function () { chiudiFotocamera(); goBack(); };
    document.getElementById('np-create').onclick = function () {
      var nome = document.getElementById('np-name').value.trim();
      if (!nome) { BT.toast('Scrivi un nome per il giocatore'); return; }
      chiudiFotocamera();
      if (npModifica) {
        var vecchia = BT.etaDi(npModifica);
        BT.store.modifica(npModifica, { name: nome, avatar: np.avatar, eta: np.eta });
        BT.toast(np.eta !== vecchia
          ? 'Fatto! Adesso le domande sono di livello ' + BT.LEVELS[npModifica.level].name + '.'
          : 'Modifiche salvate.');
        npModifica = null;
        selectPlayer(BT.store.get(player.id));
        return;
      }
      var p = BT.store.create(nome, np.avatar, np.eta);
      BT.toast('Benvenuto ' + nome + '! Hai 30 coppe di partenza 🏆');
      selectPlayer(p);
    };

    document.getElementById('np-galleria').onclick = function () {
      chiudiFotocamera();
      messaggioFoto('Sto aprendo le tue immagini&hellip;');
      BT.foto.daGalleria(impostaFoto, messaggioFoto);
    };
    document.getElementById('np-scatta').onclick = function () {
      messaggioFoto('');
      var pannello = document.getElementById('np-cam');
      pannello.classList.remove('hidden');
      BT.foto.accendi(
        document.getElementById('np-cam-video'),
        function (video) { camVideo = video; messaggioFoto('Mettiti in posa e premi <b>Scatta!</b>'); },
        function (motivo) {
          pannello.classList.add('hidden');
          if (motivo === 'permesso-negato') {
            messaggioFoto('Non hai dato il permesso di usare la fotocamera. ' +
              'Puoi comunque scegliere una foto dalla galleria.');
          } else {
            messaggioFoto('Apro la fotocamera del dispositivo&hellip;');
            BT.foto.daFotocameraDiSistema(impostaFoto, function () {
              messaggioFoto('La fotocamera non &egrave; disponibile qui. Prova con la galleria.');
            });
          }
        }
      );
    };
    document.getElementById('np-cam-annulla').onclick = function () { chiudiFotocamera(); messaggioFoto(''); };
    document.getElementById('np-cam-scatta').onclick = function () {
      BT.foto.scatta(camVideo, function (dati) { chiudiFotocamera(); impostaFoto(dati); });
    };

    document.getElementById('btn-rules').onclick = function () { BT.show('screen-rules'); };
    document.getElementById('btn-settings').onclick = function () {
      BT.show('screen-settings'); renderSettings();
    };
    document.getElementById('btn-change-player').onclick = function () {
      player = null; applicaTema(null); BT.show('screen-home'); BT.renderHome();
    };

    document.querySelectorAll('.tile').forEach(function (t) {
      t.onclick = function () {
        var go = t.dataset.go;
        if (go === 'gioca') { if (controllaLimite()) { mode = 'solo'; tipoPartita = 'gioca'; BT.show('screen-category'); renderCategories(); } }
        else if (go === 'allena') { if (controllaLimite()) { mode = 'solo'; tipoPartita = 'allena'; BT.show('screen-category'); renderCategories(); } }
        else if (go === 'scoperte') renderScoperte();
        else if (go === 'duel') {
          if (!controllaLimite()) return;
          if (BT.store.all().length < 2) { BT.toast('Per il duello servono almeno due giocatori.'); return; }
          mode = 'duel'; BT.show('screen-duel-setup'); BT.renderDuelSetup(true);
        }
        else if (go === 'sfide') { if (controllaLimite()) { BT.show('screen-sfide'); renderSfide(); } }
        else if (go === 'shop') { BT.show('screen-shop'); renderShop(); }
        else if (go === 'rank') { BT.show('screen-rank'); renderRank(); }
        else if (go === 'stats') { BT.show('screen-stats'); renderStats(); }
        else if (go === 'settings') { BT.show('screen-settings'); renderSettings(); }
      };
    });

    document.getElementById('duel-next').onclick = function () {
      if (!(duelSel[0] && duelSel[1])) return;
      BT.show('screen-category'); renderCategories();
    };
    document.getElementById('sfida-next').onclick = function () {
      if (!sfidaVerso) return;
      mode = 'sfida';
      BT.show('screen-category'); renderCategories();
    };
    document.getElementById('g-esci').onclick = function () {
      var G = BT.game.current();
      if (!G) { BT.show('screen-menu'); BT.renderMenu(); return; }
      var fatte = G.runs[0].answered + G.runs[0].skipped;
      /* qui il testo finisce dentro confirm(), non nel documento:
         niente entita' HTML, servono le lettere accentate vere */
      var avviso = G.mode === 'duel'
        ? 'Vuoi interrompere il duello? Non verrà registrato nessun punteggio.'
        : (G.tipo === 'allena' || !fatte
            ? 'Vuoi uscire dalla partita?'
            : 'Vuoi uscire? La partita si chiude qui e tieni i punti delle ' + fatte +
              ' domande già fatte.');
      if (confirm(avviso)) BT.game.esci();
    };

    document.getElementById('pass-go').onclick = function () { BT.game.beginTurn(); };

    document.querySelectorAll('#rank-seg .seg-btn').forEach(function (b) {
      b.onclick = function () { rankMode = b.dataset.rank; renderRank(); };
    });

    var bm = document.getElementById('set-musica');
    if (bm) bm.onclick = function () {
      var s = BT.store.settings();
      s.musica = (s.musica === false);
      BT.store.salvaPref();
      if (!s.musica) BT.musica.ferma();
      renderSettings();
    };

    document.getElementById('set-sound').onclick = function () {
      var s = BT.store.settings();
      s.sound = !s.sound;
      BT.store.salvaPref();
      BT.sfx.setOn(s.sound);
      if (s.sound) BT.sfx.play('coppa');
      renderSettings();
    };
    document.getElementById('set-cancellami').onclick = cancellaProfilo;
    document.getElementById('set-export').onclick = scaricaBackup;

    document.querySelectorAll('#shop-tabs .shop-tab').forEach(function (b) {
      b.onclick = function () { reparto = b.dataset.rep; renderShop(); };
    });

    /* --- labirinti: croce direzionale, dita e tastiera --- */
    document.querySelectorAll('.dpad button').forEach(function (b) {
      b.onclick = function () { BT.laby.muovi(b.dataset.dir); };
    });
    document.getElementById('lingua-esci').onclick = function () {
      BT.lingue.abbandona();
      BT.show('screen-menu'); BT.renderMenu();
    };
    document.getElementById('laby-esci').onclick = function () {
      BT.laby.abbandona();
      apriLabirinti();
    };
    BT.laby.collegaGesti(document.getElementById('laby-canvas'));

    /* --- il codice segreto del labirinto ---
       Si scrive "tele" mentre si gioca (nessuna di quelle lettere e' un
       tasto di movimento, quindi non si muove niente per sbaglio), oppure
       si toccano cinque volte il nome del livello: serve su tablet, dove
       la tastiera non c'e'. Fa passare il livello ma non da' premi. */
    var codice = '', tocchi = 0, ultimoTocco = 0;
    function teletrasporta() {
      if (!BT.laby.teletrasporto()) return;
      BT.toast('Teletrasporto! 🌀 Passi il livello, ma senza punti n&eacute; coppe.');
    }
    document.addEventListener('keydown', function (e) {
      if (!document.getElementById('screen-laby').classList.contains('active')) return;
      if (!e.key || e.key.length !== 1) return;
      codice = (codice + e.key.toLowerCase()).slice(-8);
      if (codice.indexOf('tele') >= 0) { codice = ''; teletrasporta(); }
    });
    document.getElementById('laby-livello').onclick = function () {
      var ora = new Date().getTime();
      tocchi = (ora - ultimoTocco < 900) ? tocchi + 1 : 1;
      ultimoTocco = ora;
      if (tocchi >= 5) { tocchi = 0; teletrasporta(); }
    };

    document.addEventListener('keydown', function (e) {
      if (!document.getElementById('screen-laby').classList.contains('active')) return;
      var dir = { ArrowUp: 'n', ArrowDown: 's', ArrowLeft: 'w', ArrowRight: 'e',
                  w: 'n', s: 's', a: 'w', d: 'e' }[e.key];
      if (!dir) return;
      e.preventDefault();
      BT.laby.muovi(dir);
    });

    document.addEventListener('keydown', function (e) {
      if (!document.getElementById('screen-game').classList.contains('active')) return;
      if (e.key >= '1' && e.key <= '4') {
        var btns = document.querySelectorAll('#q-options .opt');
        var i = parseInt(e.key, 10) - 1;
        if (btns[i] && !btns[i].disabled) btns[i].click();
      } else if (e.key === 'Enter') {
        var nx = document.getElementById('fb-next') || document.getElementById('reveal-next');
        if (nx) nx.click();
      }
    });

    BT.renderHome();
    BT.show('screen-home', true);

    /* Qui la pagina si ricarica da sola a ogni salvataggio (e' cosi' che i
       dati arrivano agli altri dispositivi). Ripartire ogni volta da "chi
       gioca?" faceva sembrare che il gioco ti buttasse fuori: se su questo
       dispositivo qualcuno aveva gia' scelto il suo nome, si torna dritti
       al suo menu. Si cambia sempre con "Cambia giocatore". */
    var io = BT.storeOnline.io();
    if (io) selectPlayer(io);

    renderStatoSync();

    // la capability arriva sempre dopo il primo giro di script
    BT.online.avvia(function (ok) {
      renderStatoSync(ok);
      BT.renderHome();
      if (player) BT.renderMenu();
      if (ok && window.claude && window.claude.use) {
        window.claude.use('downloads').then(function (ns) {
          downloads = ns || null;
          if (document.getElementById('screen-settings').classList.contains('active')) renderSettings();
        }).catch(function () {});
      }
      if (!ok) {
        BT.toast('Questa pagina non riesce a salvare per tutti: i risultati potrebbero restare solo qui.', 5000);
      }
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

})(window.BT);
