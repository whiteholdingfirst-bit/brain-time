/* =========================================================
   BRAIN TIME — profili, salvataggio, economia coppe
   Tutti i dati restano sul dispositivo (localStorage).
   ========================================================= */
(function (BT) {
  'use strict';

  var KEY = 'brain-time-v1';

  /* ---------------- livelli scolastici ---------------- */
  BT.LEVELS = {
    elem5: {
      id: 'elem5', name: '5&ordf; elementare', short: '5&ordf; elem',
      desc: 'Domande sul programma di quinta elementare', time: 35
    },
    media2: {
      id: 'media2', name: '2&ordf; media', short: '2&ordf; media',
      desc: 'Domande sul programma di seconda media', time: 30
    },
    adulti: {
      id: 'adulti', name: 'Adulti (genitori)', short: 'Adulti',
      desc: 'Modalit&agrave; genitori: domande da grandi, decisamente pi&ugrave; toste', time: 26
    }
  };
  BT.LEVEL_ORDER = ['elem5', 'media2', 'adulti'];

  /* ---------------- avatar, divisi per famiglia ----------------
     Sono tutti emoji Unicode: si vedono ovunque, non pesano nulla
     e non hanno problemi di diritti. I personaggi dei cartoni animati
     famosi (e i loro nomi) sono marchi registrati e non si possono usare:
     qui ci sono gli archetipi (mago, ninja, supereroe, robot) e i mostri
     classici, che invece sono di pubblico dominio.                     */
  BT.AVATAR_GRUPPI = [
    { id: 'animali', nome: 'Animali', ico: '🦊', lista: [
      '🦊','🐺','🦁','🐯','🐆','🐅','🐴','🦄','🦓','🦌','🐮','🐷','🐗','🐭','🐹','🐰',
      '🐻','🐻‍❄️','🐨','🐼','🦥','🦦','🦔','🐿️','🦘','🐘','🦏','🦛','🦒','🐫','🦙','🐑',
      '🐐','🐕','🐩','🐈','🐈‍⬛','🐇','🐓','🦃','🦚','🦜','🦢','🦩','🕊️','🦅','🦉','🐦',
      '🐧','🦆','🐸','🐢','🦎','🐍','🐊','🦕','🦖','🐙','🦑','🦐','🦀','🐬','🐳','🐋',
      '🦈','🐠','🐟','🐡','🦭','🐝','🦋','🐌','🐞','🦗','🕷️','🦂','🦇','🐾' ] },

    { id: 'mostri', nome: 'Mostri', ico: '🧛', lista: [
      '🧛','🧟','🧌','👻','💀','☠️','🎃','👹','👺','👽','👾','🤖','🧞','🧙','🧝','🧜',
      '🧚','🐺','🦇','🕸️','🕯️','⚰️','🔮','🪄','🧪','🩸','🌕','🦴' ] },

    { id: 'personaggi', nome: 'Personaggi', ico: '🦸', lista: [
      '🦸','🦹','🥷','🕵️','🧑‍🚀','🧑‍🔬','🧑‍💻','🧑‍🎨','🧑‍🍳','🧑‍🎤','🧑‍🏫','🧑‍⚕️',
      '🧑‍🚒','👮','👷','🧑‍🌾','🧑‍🔧','🤠','🤴','👸','🫅','🥸','🤡','🎅','🧑‍✈️','💂',
      '🕺','💃','🧑‍🎓','🦺' ] },

    { id: 'sport', nome: 'Sport e giochi', ico: '⚽', lista: [
      '⚽','🏀','🏈','⚾','🎾','🏐','🏉','🥏','🎱','🏓','🏸','🥊','🥋','⛸️','🎿','🏂',
      '🛹','🛼','🚴','🏊','🤸','🤺','🏇','🧗','🏆','🥇','🎯','🎮','🕹️','♟️','🎲','🧩' ] },

    { id: 'mondo', nome: 'Mondo e spazio', ico: '🚀', lista: [
      '🚀','🛸','🛰️','🌍','🌙','⭐','🌟','✨','☄️','🪐','🌈','⚡','🔥','❄️','🌊','🌋',
      '🏔️','🌵','🌴','🍀','🌻','🌸','🍄','🌪️','☀️','🪐','🧭','🗺️' ] },

    { id: 'oggetti', nome: 'Cose che piacciono', ico: '🧠', lista: [
      '🧠','🎓','📚','✏️','🔬','🔭','🎸','🎹','🎺','🎻','🥁','🎧','🎬','📷','🚂','🚗',
      '🏎️','✈️','🚁','⛵','🚲','🛵','🍕','🍔','🌮','🍦','🍩','🍪','🎂','🍫','💎','🪙' ] }
  ];

  /* lista piatta: la usa chi non ha bisogno dei gruppi */
  BT.AVATARS = (function () {
    var t = [];
    BT.AVATAR_GRUPPI.forEach(function (g) { t = t.concat(g.lista); });
    return t;
  })();

  /* ---------------- eta' ----------------
     Al posto della classe si chiede l'eta': si capisce ovunque, non
     cambia a settembre e copre anche chi a scuola non ci va ancora.
     L'eta' sceglie da quale delle tre banche di domande si pesca.

     I gruppi servono solo a spezzare la fila di numeri in blocchi
     leggibili quando si crea il profilo.                            */
  BT.ETA_MIN = 3;
  BT.ETA_ADULTO = 18;      // 18 vuol dire "adulto", non diciotto anni esatti

  BT.GRUPPI_ETA = [
    { nome: 'Piccoli',   da: 3,  a: 7 },
    { nome: 'Elementari', da: 8,  a: 11 },
    { nome: 'Medie',     da: 12, a: 13 },
    { nome: 'Grandi',    da: 14, a: 17 },
    { nome: 'Adulti',    da: 18, a: 18 }
  ];

  /* Da quale banca peschiamo. Le banche sono tre e la piu' bassa e'
     tarata sulla quinta elementare: sotto gli otto anni le domande
     restano troppo difficili finche' non ne scriviamo una apposta. */
  BT.livelloDaEta = function (anni) {
    var n = parseInt(anni, 10);
    if (!n || n < BT.ETA_MIN) n = 10;
    if (n <= 11) return 'elem5';
    if (n <= 13) return 'media2';
    return 'adulti';
  };

  BT.nomeEta = function (anni) {
    var n = parseInt(anni, 10);
    if (n >= BT.ETA_ADULTO) return 'Adulto';
    return n + ' anni';
  };

  /* --- i profili vecchi hanno la classe, non l'eta': si converte --- */
  var ETA_DA_CLASSE = { e1: 6, e2: 7, e3: 8, e4: 9, e5: 10,
                        m1: 11, m2: 12, m3: 13, sup: 16, adulto: 18 };

  BT.etaDi = function (p) {
    if (p.eta) return p.eta;
    if (p.classe && ETA_DA_CLASSE[p.classe]) return ETA_DA_CLASSE[p.classe];
    return p.level === 'adulti' ? 18 : p.level === 'media2' ? 12 : 10;
  };

  /* usate in tutta l'interfaccia: mostrano l'eta', non piu' la classe */
  BT.nomeClasse = function (p) { return BT.nomeEta(BT.etaDi(p)); };
  BT.classeBreve = function (p) {
    var n = BT.etaDi(p);
    return n >= BT.ETA_ADULTO ? 'Adulto' : n + ' anni';
  };

  /* ---------------- livelli di difficolta' ----------------
     Il "salto" sposta la banca delle domande di un gradino
     rispetto alla classe del giocatore: in Facile si pescano
     domande della fascia sotto, in Difficile di quella sopra.
     Chi e' gia' agli estremi resta nella sua banca, ma cambiano
     tempo, numero di domande e valore dei punti.               */
  BT.DIFFICOLTA = [
    { id: 'facile', name: 'Facile', ico: '🟢', qLen: 6, salto: -1,
      tempo: 1.3, bonus: 1, penalita: 30,
      desc: '6 domande di livello basso, con pi&ugrave; tempo per pensare.' },
    { id: 'medio', name: 'Medio', ico: '🟡', qLen: 9, salto: 0,
      tempo: 1, bonus: 1.2, penalita: 50,
      desc: '9 domande del tuo livello, tempo normale.' },
    { id: 'difficile', name: 'Difficile', ico: '🔴', qLen: 15, salto: 1,
      tempo: 0.8, bonus: 1.5, penalita: 70,
      desc: '15 domande di livello alto, meno tempo: i punti per&ograve; valgono di pi&ugrave;.' }
  ];

  BT.diff = function (id) {
    for (var i = 0; i < BT.DIFFICOLTA.length; i++)
      if (BT.DIFFICOLTA[i].id === id) return BT.DIFFICOLTA[i];
    return BT.DIFFICOLTA[1];            // medio
  };

  /* livello della banca dopo il salto, senza uscire dai tre disponibili */
  BT.livelloDi = function (level, salto) {
    var i = BT.LEVEL_ORDER.indexOf(level);
    if (i < 0) i = 0;
    var j = Math.min(BT.LEVEL_ORDER.length - 1, Math.max(0, i + (salto || 0)));
    return BT.LEVEL_ORDER[j];
  };

  /* ---------------- aiuti acquistabili ----------------
     Non sono tutti disponibili da subito: si sbloccano salendo di
     livello cervello, oppure mettendo da parte abbastanza coppe.
     Basta una delle due condizioni.                                */
  BT.POWERUPS = [
    { id: 'hint',   ico: '🔍', name: 'Un aiutino',     cost: 8,  liv: 1, coppe: 0,
      desc: 'Elimina una risposta sbagliata. Il pi&ugrave; economico.' },
    { id: 'time',   ico: '⏱️', name: 'Tempo extra',    cost: 10, liv: 1, coppe: 0,
      desc: 'Aggiunge 15 secondi al timer.' },
    { id: 'skip',   ico: '⏭️', name: 'Salta domanda',  cost: 12, liv: 2, coppe: 60,
      desc: 'Passa alla prossima senza perdere la serie (0 punti).' },
    { id: 'fifty',  ico: '✂️', name: '50 / 50',        cost: 15, liv: 2, coppe: 70,
      desc: 'Elimina due risposte sbagliate.' },
    { id: 'swap',   ico: '🔄', name: 'Cambia domanda', cost: 14, liv: 3, coppe: 90,
      desc: 'Ne pesca un\'altra al posto di questa, col tempo pieno.' },
    { id: 'bussola',ico: '🧭', name: 'Bussola',        cost: 12, liv: 3, coppe: 90,
      desc: 'Nei labirinti: ti indica la direzione giusta per tre volte.' },
    { id: 'freeze', ico: '❄️', name: 'Congela il tempo', cost: 18, liv: 4, coppe: 120,
      desc: 'Ferma il timer: pensa quanto vuoi su questa domanda.' },
    { id: 'mappa',  ico: '🗺️', name: 'Mappa del labirinto', cost: 20, liv: 4, coppe: 120,
      desc: 'Nei labirinti: mostra la via d\'uscita per due secondi.' },
    { id: 'second', ico: '❤️', name: 'Seconda chance', cost: 20, liv: 5, coppe: 150,
      desc: 'Se sbagli, puoi riprovare una volta.' },
    { id: 'lampo',  ico: '⚡', name: 'Lampo',          cost: 22, liv: 5, coppe: 150,
      desc: 'Punti come se avessi risposto al volo, anche se ci pensi su.' },
    { id: 'shield', ico: '🛡️', name: 'Scudo della serie', cost: 22, liv: 6, coppe: 180,
      desc: 'Se sbagli, la serie non si azzera e non perdi punti.' },
    { id: 'double', ico: '✨', name: 'Punti doppi',    cost: 25, liv: 7, coppe: 220,
      desc: 'Raddoppia i punti della domanda in corso.' },
    { id: 'moneta', ico: '🪙', name: 'Pioggia di coppe', cost: 30, liv: 8, coppe: 260,
      desc: 'Raddoppia le coppe guadagnate in tutta la partita.' },
    { id: 'triple', ico: '🌟', name: 'Punti tripli',   cost: 45, liv: 9, coppe: 320,
      desc: 'Triplica i punti della domanda in corso.' }
  ];

  /* un aiuto e' comprabile se il giocatore ha il livello richiesto
     oppure se ha accumulato abbastanza coppe */
  BT.aiutoSbloccato = function (p, pu) {
    if (!pu) return false;
    if (!pu.liv || pu.liv <= 1) return true;
    if (BT.levelFromXp(p.xp) >= pu.liv) return true;
    return !!(pu.coppe && p.coins >= pu.coppe);
  };
  BT.comeSbloccare = function (pu) {
    if (!pu.coppe) return 'Si sblocca al livello ' + pu.liv;
    return 'Si sblocca al livello ' + pu.liv + ' oppure con ' + pu.coppe + ' coppe';
  };

  /* ---------------- sbloccabili permanenti ----------------
     Si comprano una volta sola e restano per sempre.        */
  BT.SBLOCCABILI = {
    avatar: [
      { id: '👑', cost: 55,  name: 'Corona',      desc: 'Per chi comanda la classifica.' },
      { id: '🐉', cost: 70,  name: 'Drago',       desc: 'Sputa fuoco sulle domande difficili.' },
      { id: '🧞', cost: 65,  name: 'Genio della lampada', desc: 'Tre desideri, zero suggerimenti.' },
      { id: '🛸', cost: 75,  name: 'Disco volante', desc: 'Intelligenza non proprio terrestre.' },
      { id: '🦹', cost: 65,  name: 'Super cattivo', desc: 'Il rivale perfetto per un supereroe.' },
      { id: '🎭', cost: 60,  name: 'Maschere',    desc: 'Non si sa mai chi sei davvero.' },
      { id: '🦾', cost: 80,  name: 'Braccio bionico', desc: 'Met&agrave; ragazzo, met&agrave; macchina.' },
      { id: '🧿', cost: 70,  name: 'Occhio portafortuna', desc: 'Tiene lontane le risposte sbagliate.' },
      { id: '🌌', cost: 95,  name: 'Via Lattea',  desc: 'Un intero universo come faccia.' },
      { id: '💎', cost: 120, name: 'Diamante',    desc: 'Il pi&ugrave; raro di tutti.' }
    ],
    titolo: [
      { id: 'fulmine',  cost: 40,  name: 'il Fulmine',          desc: 'Per chi risponde alla velocit&agrave; della luce.' },
      { id: 'acciaio',  cost: 60,  name: 'Cervello d\'Acciaio', desc: 'Non sbaglia quasi mai.' },
      { id: 'scacchi',  cost: 70,  name: 'Maestro degli Scacchi', desc: 'Vede il matto prima degli altri.' },
      { id: 'poliglot', cost: 70,  name: 'Poliglotta',          desc: 'Cinque lingue, nessuna paura.' },
      { id: 'leggenda', cost: 120, name: 'Leggenda Vivente',    desc: 'Il titolo pi&ugrave; costoso del gioco.' }
    ],
    tema: [
      /* --- i cinque colori base: gratis per tutti --- */
      { id: 'azzurro', cost: 0, base: true, name: 'Azzurro', desc: 'Il colore di casa di Brain Time.',
        col1: '#5d9fd0', col2: '#2f6ea8' },
      { id: 'rosso',   cost: 0, base: true, name: 'Rosso',   desc: 'Caldo e deciso, come un pallone da calcio.',
        col1: '#e06a63', col2: '#b0362f' },
      { id: 'verde',   cost: 0, base: true, name: 'Verde',   desc: 'Verde prato, riposante.',
        col1: '#5fb383', col2: '#2f7d55' },
      { id: 'blu',     cost: 0, base: true, name: 'Blu',     desc: 'Blu profondo da quaderno nuovo.',
        col1: '#4a6fc0', col2: '#26408a' },
      { id: 'lilla',   cost: 0, base: true, name: 'Lilla',   desc: 'Viola chiaro, un po\' magico.',
        col1: '#a37cd8', col2: '#7047ab' },

      /* --- i temi speciali: si comprano con le coppe o si trovano nelle casse --- */
      { id: 'oceano',   cost: 60,  name: 'Oceano',        desc: 'Sott\'acqua fra pesci e coralli.',
        col1: '#2aa9b8', col2: '#0b5e73' },
      { id: 'tramonto', cost: 65,  name: 'Tramonto',      desc: 'Il cielo che si accende alla fine della giornata.',
        col1: '#ff9a6b', col2: '#c85b7c' },
      { id: 'foresta',  cost: 65,  name: 'Foresta',       desc: 'Sottobosco, muschio e luce fra le foglie.',
        col1: '#6fbf8f', col2: '#26663f' },
      { id: 'deserto',  cost: 70,  name: 'Deserto',       desc: 'Dune dorate e sole a picco.',
        col1: '#e8b96a', col2: '#a9682e' },
      { id: 'ghiaccio', cost: 75,  name: 'Ghiaccio',      desc: 'Cristalli, neve e aria gelida.',
        col1: '#a9dcea', col2: '#5488a8' },
      { id: 'giungla',  cost: 80,  name: 'Giungla',       desc: 'Foglie enormi e versi di animali.',
        col1: '#4fae6a', col2: '#14512f' },
      { id: 'caramella',cost: 85,  name: 'Caramella',     desc: 'Rosa confetto e zucchero filato.',
        col1: '#ff9ec4', col2: '#c85f9b' },
      { id: 'notte',    cost: 90,  name: 'Notte',         desc: 'Sfondo scuro: riposa gli occhi la sera.',
        col1: '#132b42', col2: '#0a1a2a' },
      { id: 'vulcano',  cost: 100, name: 'Vulcano',       desc: 'Roccia nera e lava incandescente.',
        col1: '#8a2b1e', col2: '#2b0f0c' },
      { id: 'stellato', cost: 110, name: 'Cielo stellato', desc: 'Notte limpida piena di stelle.',
        col1: '#1b3b6f', col2: '#070d1f' },
      { id: 'galassia', cost: 130, name: 'Galassia',      desc: 'Nebulose viola ai confini dello spazio. Il pi&ugrave; raro.',
        col1: '#6a3fa0', col2: '#160b2e' }
    ]
  };

  /* gli avatar speciali non devono comparire anche fra quelli gratuiti */
  (function () {
    var speciali = BT.SBLOCCABILI.avatar.map(function (a) { return a.id; });
    BT.AVATAR_GRUPPI.forEach(function (g) {
      g.lista = g.lista.filter(function (e) { return speciali.indexOf(e) < 0; });
    });
    BT.AVATARS = [];
    BT.AVATAR_GRUPPI.forEach(function (g) { BT.AVATARS = BT.AVATARS.concat(g.lista); });
  })();

  BT.titolo = function (id) {
    var t = null;
    BT.SBLOCCABILI.titolo.forEach(function (x) { if (x.id === id) t = x; });
    return t;
  };

  BT.temaInfo = function (id) {
    var t = null;
    BT.SBLOCCABILI.tema.forEach(function (x) { if (x.id === id) t = x; });
    return t;
  };
  /* un tema base e' di tutti; gli altri vanno comprati o trovati in una cassa */
  BT.temaGratis = function (id) {
    var t = BT.temaInfo(id);
    return !!(t && (t.base || t.cost === 0));
  };

  /* ---------------- livelli cervello ---------------- */
  // soglia XP crescente: 0, 600, 1400, 2400, 3600, ...
  BT.xpForLevel = function (lvl) {
    if (lvl <= 1) return 0;
    return 300 * (lvl - 1) * lvl;      // 600, 1800, 3600...
  };
  BT.levelFromXp = function (xp) {
    var l = 1;
    while (BT.xpForLevel(l + 1) <= xp && l < 99) l++;
    return l;
  };
  BT.LEVEL_TITLES = ['Novellino', 'Curioso', 'Studente', 'Sveglio', 'Esperto',
                     'Stratega', 'Genio', 'Super Genio', 'Maestro', 'Leggenda'];
  BT.levelTitle = function (l) {
    return BT.LEVEL_TITLES[Math.min(l - 1, BT.LEVEL_TITLES.length - 1)];
  };

  /* ---------------- stato salvato ---------------- */
  var state = { players: [], lastPlayerId: null, settings: { diff: 'medio', sound: true, lingua: 'en' } };

  var storageOk = true;   // diventa false se il browser blocca il salvataggio

  function load() {
    try {
      localStorage.setItem(KEY + '-test', '1');
      localStorage.removeItem(KEY + '-test');
      var raw = localStorage.getItem(KEY);
      if (raw) {
        var p = JSON.parse(raw);
        if (p && Array.isArray(p.players)) state = p;
      }
    } catch (e) {
      storageOk = false;   // si gioca comunque, ma senza salvare i progressi
    }
    if (!state.settings) state.settings = {};
    if (!state.settings.diff) state.settings.diff = 'medio';
    if (state.settings.musica === undefined) state.settings.musica = true;
    if (state.settings.sound === undefined) state.settings.sound = true;
    return state;
  }

  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); }
    catch (e) { storageOk = false; }
  }

  BT.store = {
    load: load,
    save: save,
    canSave: function () { return storageOk; },
    all: function () { return state.players; },
    settings: function () { return state.settings; },

    get: function (id) {
      for (var i = 0; i < state.players.length; i++)
        if (state.players[i].id === id) return state.players[i];
      return null;
    },

    create: function (name, avatar, anni) {
      var eta = parseInt(anni, 10) || 10;
      var p = {
        id: 'p' + Date.now() + '' + BT.rnd(100, 999),
        name: name,
        avatar: avatar,        // emoji oppure foto (data URI)
        eta: eta,              // quanti anni ha: decide la banca delle domande
        level: BT.livelloDaEta(eta),      // elem5 | media2 | adulti
        xp: 0,                 // punti cervello totali
        coins: 30,             // coppe di partenza
        answered: 0,
        correct: 0,
        bestRun: 0,            // miglior punteggio in una partita
        bestStreak: 0,
        duelsWon: 0,
        duelsPlayed: 0,
        inventory: {},         // aiuti consumabili: { fifty:2, time:1, ... }
        sbloccati: { avatar: [], titolo: [], tema: [] },   // acquisti permanenti
        titolo: null,          // titolo esibito sotto il nome
        tema: 'azzurro',       // tema colore scelto
        casse: { pronte: 0, moltiplicatore: 1, aperte: 0 },   // sorprese di fine livello
        tempo: { usato: 0, ultimo: 0, bloccatoFino: 0 },      // limite dei 30 minuti
        scoperte: [],          // id delle curiosita' gia' trovate
        labirinto: { livello: 1, completati: 0, tempi: {} },
        byCat: {}              // { math:{a:10,c:7}, ... }
      };
      state.players.push(p);
      state.lastPlayerId = p.id;
      save();
      return p;
    },

    /* Cambia i dati anagrafici di un giocatore che esiste gia'.
       I bambini crescono: l'eta' deve poter cambiare, e con lei il livello
       delle domande. Punti, coppe, sblocchi e statistiche non si toccano. */
    modifica: function (p, dati) {
      if (!p || !dati) return p;
      if (dati.name) p.name = dati.name;
      if (dati.avatar) p.avatar = dati.avatar;
      if (dati.eta) {
        p.eta = parseInt(dati.eta, 10) || p.eta;
        p.level = BT.livelloDaEta(p.eta);
        delete p.classe;                  /* il vecchio campo non serve piu' */
      }
      /* lo legge BT.fondi per capire quale copia porta la scelta piu' recente */
      p.aggiornatoIl = Date.now();
      save();
      return p;
    },

    remove: function (id) {
      state.players = state.players.filter(function (p) { return p.id !== id; });
      if (state.lastPlayerId === id) state.lastPlayerId = null;
      save();
    },

    setLast: function (id) { state.lastPlayerId = id; save(); },
    last: function () { return BT.store.get(state.lastPlayerId); },

    /* --- registra il risultato di una partita --- */
    recordRun: function (p, run) {
      var before = BT.levelFromXp(p.xp);
      p.xp += run.score;
      p.answered += run.answered;
      p.correct += run.correct;
      p.coins += run.coins;
      if (run.score > p.bestRun) p.bestRun = run.score;
      if (run.bestStreak > p.bestStreak) p.bestStreak = run.bestStreak;

      for (var cat in run.byCat) {
        if (!p.byCat[cat]) p.byCat[cat] = { a: 0, c: 0 };
        p.byCat[cat].a += run.byCat[cat].a;
        p.byCat[cat].c += run.byCat[cat].c;
      }
      var after = BT.levelFromXp(p.xp);
      save();
      return { levelUp: after > before, from: before, to: after };
    },

    recordDuel: function (p, won) {
      p.duelsPlayed++;
      if (won) { p.duelsWon++; p.coins += 10; }
      save();
    },

    /* --- economia aiuti --- */
    buy: function (p, powerId) {
      var pu = null;
      for (var i = 0; i < BT.POWERUPS.length; i++)
        if (BT.POWERUPS[i].id === powerId) pu = BT.POWERUPS[i];
      if (!pu || p.coins < pu.cost) return false;
      if (!BT.aiutoSbloccato(p, pu)) return false;    // non ancora disponibile
      p.coins -= pu.cost;
      p.inventory[powerId] = (p.inventory[powerId] || 0) + 1;
      save();
      return true;
    },
    consume: function (p, powerId) {
      if (!p.inventory[powerId]) return false;
      p.inventory[powerId]--;
      if (p.inventory[powerId] <= 0) delete p.inventory[powerId];
      save();
      return true;
    },

    /* --- sbloccabili permanenti --- */
    /* i profili creati prima di questa versione non hanno i campi nuovi */
    normalizza: function (p) {
      if (!p.sbloccati) p.sbloccati = { avatar: [], titolo: [], tema: [] };
      ['avatar', 'titolo', 'tema'].forEach(function (k) {
        if (!Array.isArray(p.sbloccati[k])) p.sbloccati[k] = [];
      });
      if (p.titolo === undefined) p.titolo = null;
      if (!p.tema) p.tema = 'azzurro';
      if (!p.casse) p.casse = { pronte: 0, moltiplicatore: 1, aperte: 0 };
      if (!Array.isArray(p.scoperte)) p.scoperte = [];
      if (!p.labirinto) p.labirinto = { livello: 1, completati: 0, tempi: {} };
      if (!p.labirinto.tempi) p.labirinto.tempi = {};
      if (!p.tempo) p.tempo = { usato: 0, ultimo: 0, bloccatoFino: 0 };

      return p;
    },

    /* --- casse sorpresa di fine livello --- */
    aggiungiCassa: function (p) {
      BT.store.normalizza(p);
      p.casse.pronte++;
      save();
      return p.casse;
    },
    /* la tieni da parte: la prossima varra' il doppio (fino a x4) */
    rimandaCassa: function (p) {
      BT.store.normalizza(p);
      p.casse.moltiplicatore = Math.min(BT.RARITA_MAX || 7, p.casse.moltiplicatore + 1);
      save();
      return p.casse;
    },
    apriCassa: function (p) {
      BT.store.normalizza(p);
      if (p.casse.pronte <= 0) return null;
      p.casse.pronte--;
      p.casse.aperte++;
      var molt = p.casse.moltiplicatore;
      p.casse.moltiplicatore = 1;      // il bonus si consuma qui
      save();
      return molt;
    },
    segnaScoperta: function (p, id) {
      BT.store.normalizza(p);
      if (p.scoperte.indexOf(id) < 0) p.scoperte.push(id);
      save();
    },

    /* --- labirinti ---
       I labirinti danno punti e coppe ma non toccano le statistiche
       delle domande: precisione e materie restano quelle del quiz. */
    /* punti e coppe senza toccare le statistiche delle domande:
       lo usano i labirinti e "Impara una lingua" */
    premia: function (p, punti, coppe) {
      var prima = BT.levelFromXp(p.xp);
      p.xp += punti;
      p.coins += coppe;
      var dopo = BT.levelFromXp(p.xp);
      save();
      return { levelUp: dopo > prima, from: prima, to: dopo };
    },
    premiaLabirinto: function (p, punti, coppe) { return BT.store.premia(p, punti, coppe); },

    /* sblocca il livello successivo senza registrare niente: lo usa il
       teletrasporto, che fa passare ma non conta come labirinto fatto */
    sbloccaLabirinto: function (p, livello) {
      BT.store.normalizza(p);
      if (livello >= p.labirinto.livello) p.labirinto.livello = livello + 1;
      save();
    },

    salvaLabirinto: function (p, livello, secondi) {
      BT.store.normalizza(p);
      var prec = p.labirinto.tempi[livello];
      if (!prec || secondi < prec) p.labirinto.tempi[livello] = secondi;
      if (livello >= p.labirinto.livello) {
        p.labirinto.livello = livello + 1;
        p.labirinto.completati++;
      }
      save();
    },

    haSbloccato: function (p, tipo, id) {
      BT.store.normalizza(p);
      return p.sbloccati[tipo].indexOf(id) >= 0;
    },

    sblocca: function (p, tipo, id) {
      BT.store.normalizza(p);
      var lista = BT.SBLOCCABILI[tipo] || [];
      var art = null;
      lista.forEach(function (x) { if (x.id === id) art = x; });
      if (!art || BT.store.haSbloccato(p, tipo, id)) return false;
      if (p.coins < art.cost) return false;
      p.coins -= art.cost;
      p.sbloccati[tipo].push(id);
      /* appena comprato, viene messo subito in uso */
      if (tipo === 'titolo') p.titolo = id;
      if (tipo === 'tema') p.tema = id;
      if (tipo === 'avatar') p.avatar = id;
      save();
      return true;
    },

    usa: function (p, tipo, id) {
      BT.store.normalizza(p);
      if (tipo === 'titolo') p.titolo = (p.titolo === id ? null : id);
      else if (tipo === 'tema') p.tema = id;
      else if (tipo === 'avatar') p.avatar = id;
      save();
    },

    /* --- backup --- */
    exportJSON: function () {
      return JSON.stringify({ app: 'brain-time', version: 1, data: state }, null, 2);
    },
    importJSON: function (testo) {
      var p = JSON.parse(testo);
      var d = p && p.data ? p.data : p;
      if (!d || !Array.isArray(d.players)) throw new Error('File non valido');
      state = d;
      if (!state.settings) state.settings = { diff: 'medio', sound: true };
      save();
      return state.players.length;
    },

    /* --- indice bravura: precisione pesata, confrontabile fra livelli --- */
    skillIndex: function (p) {
      if (p.answered < 5) return 0;                       // troppo poche partite
      var acc = p.correct / p.answered;                   // 0..1
      var volume = Math.min(1, p.answered / 60);          // affidabilita'
      return Math.round(acc * 1000 * (0.65 + 0.35 * volume));
    }
  };

})(window.BT);
