/* =========================================================
   BRAIN TIME — musica dei labirinti
   Tre brani originali generati dal gioco stesso con la Web
   Audio API: nessun file da scaricare, funziona offline.

   Se in famiglia volete la vostra musica, basta mettere i
   file accanto al gioco, in una cartella "musica":
   musica/1.mp3, musica/2.mp3, musica/3.mp3 (o .m4a, .ogg).
   Se ci sono, il gioco suona quelli; se non ci sono, suona
   i brani generati. In questo modo ognuno usa la musica che
   ha gia' comprato, senza che il gioco distribuisca nulla.
   ========================================================= */
(function (BT) {
  'use strict';

  var ctx = null, master = null;
  var timer = null, prossimoPasso = 0, passo = 0;
  var traccia = null, acceso = false;
  /* la ricerca dei file e' asincrona: questo contatore evita che una
     risposta in ritardo faccia partire la musica quando si e' gia' usciti */
  var sessione = 0;
  var audioFile = null;                 // musica di famiglia, se presente
  var provatiFile = false, fileTrovati = [];

  /* ---------------- i tre brani ----------------
     Le note sono numeri MIDI; 0 vuol dire silenzio.
     Ogni brano dura 16 passi (due battute) e gira in tondo. */
  var TRACCE = [
    {
      nome: 'Corridoi', bpm: 112,
      basso: [45, 0, 45, 0, 40, 0, 41, 0, 45, 0, 45, 0, 43, 0, 41, 0],
      melodia: [69, 72, 74, 76, 74, 72, 69, 0, 67, 69, 72, 69, 67, 65, 64, 0],
      cassa: [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0],
      charleston: [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1]
    },
    {
      nome: 'Inseguimento', bpm: 132,
      basso: [38, 38, 0, 38, 45, 0, 43, 0, 38, 38, 0, 38, 41, 0, 40, 0],
      melodia: [74, 0, 77, 79, 0, 77, 74, 72, 74, 0, 81, 79, 0, 77, 74, 0],
      cassa: [1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0],
      charleston: [0, 1, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 0, 1]
    },
    {
      nome: 'Nel buio', bpm: 92,
      basso: [43, 0, 0, 0, 41, 0, 0, 0, 38, 0, 0, 0, 40, 0, 0, 0],
      melodia: [67, 0, 70, 0, 72, 0, 70, 0, 67, 0, 65, 0, 63, 0, 65, 0],
      cassa: [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0],
      charleston: [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0]
    }
  ];

  function freq(midi) { return 440 * Math.pow(2, (midi - 69) / 12); }

  function audio() {
    if (ctx) return ctx;
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    try {
      ctx = new AC();
      master = ctx.createGain();
      master.gain.value = 0;
      master.connect(ctx.destination);
    } catch (e) { ctx = null; }
    return ctx;
  }

  /* ---------------- strumenti ---------------- */
  function nota(midi, quando, durata, forma, volume) {
    var o = ctx.createOscillator(), g = ctx.createGain();
    o.type = forma;
    o.frequency.setValueAtTime(freq(midi), quando);
    g.gain.setValueAtTime(0.0001, quando);
    g.gain.exponentialRampToValueAtTime(volume, quando + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, quando + durata);
    o.connect(g); g.connect(master);
    o.start(quando); o.stop(quando + durata + 0.02);
  }

  function colpo(quando) {                       // cassa
    var o = ctx.createOscillator(), g = ctx.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(140, quando);
    o.frequency.exponentialRampToValueAtTime(48, quando + 0.11);
    g.gain.setValueAtTime(0.5, quando);
    g.gain.exponentialRampToValueAtTime(0.0001, quando + 0.16);
    o.connect(g); g.connect(master);
    o.start(quando); o.stop(quando + 0.18);
  }

  function tic(quando) {                         // charleston
    var lun = Math.floor(ctx.sampleRate * 0.03);
    var buf = ctx.createBuffer(1, lun, ctx.sampleRate);
    var d = buf.getChannelData(0);
    for (var i = 0; i < lun; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / lun);
    var s = ctx.createBufferSource(); s.buffer = buf;
    var f = ctx.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = 7000;
    var g = ctx.createGain(); g.gain.value = 0.12;
    s.connect(f); f.connect(g); g.connect(master);
    s.start(quando);
  }

  /* ---------------- sequencer ---------------- */
  function suonaPasso(n, quando) {
    var t = traccia;
    var i = n % 16;
    if (t.basso[i]) nota(t.basso[i], quando, 0.22, 'square', 0.16);
    if (t.melodia[i]) nota(t.melodia[i], quando, 0.18, 'triangle', 0.1);
    if (t.cassa[i]) colpo(quando);
    if (t.charleston[i]) tic(quando);
  }

  function motore() {
    if (!acceso || !ctx) return;
    var durataPasso = 30 / traccia.bpm;          // un passo = una croma
    while (prossimoPasso < ctx.currentTime + 0.25) {
      suonaPasso(passo, Math.max(prossimoPasso, ctx.currentTime));
      passo++;
      prossimoPasso += durataPasso;
    }
  }

  /* ---------------- musica di famiglia, se c'e' ---------------- */
  function cercaFile(quando) {
    if (provatiFile) { quando(fileTrovati); return; }
    provatiFile = true;
    var nomi = ['musica/1.mp3', 'musica/2.mp3', 'musica/3.mp3',
                'musica/1.m4a', 'musica/2.m4a', 'musica/1.ogg'];
    var restanti = nomi.length;
    nomi.forEach(function (n) {
      var a = new Audio();
      a.preload = 'metadata';
      a.oncanplay = function () { fileTrovati.push(n); fine(); };
      a.onloadedmetadata = function () { if (fileTrovati.indexOf(n) < 0) fileTrovati.push(n); fine(); };
      a.onerror = fine;
      a.src = n;
      function fine() { a.oncanplay = a.onerror = a.onloadedmetadata = null; if (--restanti === 0) quando(fileTrovati); }
    });
    /* se il browser non risponde entro un secondo, si va di musica generata */
    setTimeout(function () { if (restanti > 0) { restanti = 0; quando(fileTrovati); } }, 1000);
  }

  /* ---------------- comandi ---------------- */
  BT.musica = {
    /* c'e' un interruttore dedicato nelle impostazioni */
    attiva: function () {
      var s = BT.store.settings();
      return s.musica !== false;
    },

    avvia: function (semeLivello) {
      if (!BT.musica.attiva() || acceso) return;
      var scelta = TRACCE[(semeLivello || 0) % TRACCE.length];
      var mia = ++sessione;

      cercaFile(function (file) {
        if (!BT.musica.attiva() || mia !== sessione) return;   // uscito nel frattempo
        if (file.length) {
          /* musica di casa: si suona quella */
          audioFile = new Audio(file[(semeLivello || 0) % file.length]);
          audioFile.loop = true;
          audioFile.volume = 0.35;
          audioFile.play().catch(function () { audioFile = null; suonaGenerata(scelta); });
          acceso = true;
          return;
        }
        suonaGenerata(scelta);
      });
    },

    ferma: function () {
      acceso = false;
      sessione++;                       // annulla eventuali avvii ancora in volo
      if (timer) { clearInterval(timer); timer = null; }
      if (audioFile) { try { audioFile.pause(); } catch (e) {} audioFile = null; }
      if (master && ctx) {
        try {
          master.gain.cancelScheduledValues(ctx.currentTime);
          master.gain.setValueAtTime(master.gain.value, ctx.currentTime);
          master.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.35);
        } catch (e) {}
      }
    },

    /* nome del brano in corso, per mostrarlo nel gioco */
    brano: function () {
      if (audioFile) return 'la vostra musica';
      return traccia ? traccia.nome : '';
    },

    suona: function () { return acceso; }
  };

  function suonaGenerata(scelta) {
    var c = audio();
    if (!c) return;
    if (c.state === 'suspended') { try { c.resume(); } catch (e) {} }
    traccia = scelta;
    passo = 0;
    prossimoPasso = c.currentTime + 0.08;
    acceso = true;
    master.gain.cancelScheduledValues(c.currentTime);
    master.gain.setValueAtTime(0.0001, c.currentTime);
    master.gain.linearRampToValueAtTime(0.5, c.currentTime + 0.8);
    if (timer) clearInterval(timer);
    timer = setInterval(motore, 25);
  }

})(window.BT);
