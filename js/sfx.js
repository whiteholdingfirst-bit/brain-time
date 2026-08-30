/* =========================================================
   BRAIN TIME — effetti sonori
   Generati con la Web Audio API: nessun file audio da caricare,
   quindi funziona anche offline e non pesa nulla.
   ========================================================= */
(function (BT) {
  'use strict';

  var ctx = null;
  var on = true;

  function audio() {
    if (ctx) return ctx;
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    try { ctx = new AC(); } catch (e) { ctx = null; }
    return ctx;
  }

  /* una nota: freq in Hz, start e durata in secondi */
  function nota(freq, quando, durata, volume, forma) {
    var c = audio();
    if (!c) return;
    var osc = c.createOscillator();
    var gain = c.createGain();
    osc.type = forma || 'triangle';
    osc.frequency.setValueAtTime(freq, c.currentTime + quando);
    gain.gain.setValueAtTime(0.0001, c.currentTime + quando);
    gain.gain.exponentialRampToValueAtTime(volume, c.currentTime + quando + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + quando + durata);
    osc.connect(gain); gain.connect(c.destination);
    osc.start(c.currentTime + quando);
    osc.stop(c.currentTime + quando + durata + 0.02);
  }

  var SUONI = {
    giusto:  function () { nota(660, 0, .12, .18); nota(880, .09, .18, .18); },
    sbagliato: function () { nota(220, 0, .16, .16, 'sawtooth'); nota(160, .12, .22, .13, 'sawtooth'); },
    coppa:   function () { nota(1050, 0, .07, .12); nota(1400, .06, .1, .1); },
    livello: function () { [523, 659, 784, 1046].forEach(function (f, i) { nota(f, i * .09, .22, .16); }); },
    vittoria: function () { [523, 659, 784, 1046, 1318].forEach(function (f, i) { nota(f, i * .1, .3, .17); }); },
    tempo:   function () { nota(300, 0, .1, .12, 'square'); nota(240, .1, .18, .1, 'square'); },
    click:   function () { nota(520, 0, .05, .07); }
  };

  BT.sfx = {
    play: function (nome) {
      if (!on) return;
      var f = SUONI[nome];
      if (!f) return;
      var c = audio();
      if (c && c.state === 'suspended') { try { c.resume(); } catch (e) {} }
      try { f(); } catch (e) {}
    },
    setOn: function (v) { on = !!v; },
    isOn: function () { return on; }
  };

  /* la stella della cassa: piu' sale la rarita', piu' sale la nota */
  BT.sfx.stella = function (n) {
    if (!on) return;
    var c = audio();
    if (c && c.state === "suspended") { try { c.resume(); } catch (e) {} }
    var base = [0, 466, 523, 622, 698, 784, 880, 1046][Math.min(7, Math.max(1, n))];
    try {
      nota(base, 0, .12, .18);
      nota(base * 1.5, .07, .2, .15);
      if (n >= 4) nota(base * 2, .15, .3, .13);
      if (n >= 7) { nota(base * 2.5, .3, .4, .12); nota(base * 3, .45, .5, .1); }
    } catch (e) {}
  };

})(window.BT);
