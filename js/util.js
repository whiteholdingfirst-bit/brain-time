/* =========================================================
   BRAIN TIME — utilita' generiche
   ========================================================= */
var BT = window.BT || {};

/* --- numeri casuali --- */
BT.rnd = function (min, max) {           // intero fra min e max inclusi
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
BT.pick = function (arr) {
  return arr[Math.floor(Math.random() * arr.length)];
};
BT.shuffle = function (arr) {
  var a = arr.slice();
  for (var i = a.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var t = a[i]; a[i] = a[j]; a[j] = t;
  }
  return a;
};

/* --- costruisce una domanda a risposta multipla ---
   correct     : risposta giusta (stringa o numero)
   distractors : array di risposte sbagliate (possono essere duplicate/uguali
                 alla giusta: vengono ripulite)
   opts        : { text, cat, explain, board, turn }
*/
BT.mc = function (text, correct, distractors, extra) {
  extra = extra || {};
  var right = String(correct);
  var seen = {};
  seen[right] = true;
  var wrong = [];
  for (var i = 0; i < distractors.length && wrong.length < 3; i++) {
    var d = String(distractors[i]);
    if (d === '' || d === 'NaN' || seen[d]) continue;
    seen[d] = true;
    wrong.push(d);
  }
  // se mancano distrattori validi ne inventa di plausibili
  var guard = 0;
  while (wrong.length < 3 && guard < 200) {
    guard++;
    var n = parseFloat(right);
    var cand;
    if (!isNaN(n) && isFinite(n)) {
      var delta = BT.rnd(1, Math.max(3, Math.round(Math.abs(n) * 0.25) || 3));
      cand = String(n + (Math.random() < 0.5 ? -delta : delta));
    } else {
      cand = right + ' ' + '?'.repeat(wrong.length + 1);
    }
    if (!seen[cand]) { seen[cand] = true; wrong.push(cand); }
  }

  var options = BT.shuffle([right].concat(wrong));
  return {
    text: text,
    options: options,
    correct: options.indexOf(right),
    explain: extra.explain || '',
    board: extra.board || null,
    turn: extra.turn || '',
    cat: extra.cat || ''
  };
};

/* --- converte una riga compatta [testo, giusta, w1, w2, w3, spiegazione] --- */
BT.fromRow = function (row, cat) {
  return BT.mc(row[0], row[1], [row[2], row[3], row[4]], {
    explain: row[5] || '', cat: cat
  });
};

/* --- distrattori numerici attorno a un valore --- */
BT.numNoise = function (n, spread) {
  spread = spread || Math.max(2, Math.round(Math.abs(n) * 0.2));
  var out = [];
  for (var i = 0; i < 8; i++) {
    var d = BT.rnd(1, spread) * (Math.random() < 0.5 ? -1 : 1);
    var v = n + d;
    if (v !== n) out.push(v);
  }
  return BT.shuffle(out);
};

/* --- formattazioni --- */
BT.plural = function (n, uno, tanti) { return n === 1 ? uno : tanti; };

BT.esc = function (s) {
  return String(s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
};

/* --- avatar: puo' essere un'emoji oppure una foto (data URI) --- */
BT.isFoto = function (a) {
  return typeof a === 'string' && a.indexOf('data:image') === 0;
};
BT.avatar = function (a) {
  if (BT.isFoto(a)) return '<img class="av-img" src="' + a + '" alt="">';
  return a || '🙂';
};

/* --- toast --- */
BT.toast = function (msg, ms) {
  var el = document.getElementById('toast');
  if (!el) return;
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(BT._toastT);
  BT._toastT = setTimeout(function () { el.classList.remove('show'); }, ms || 2200);
};

window.BT = BT;
