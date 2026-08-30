/* =========================================================
   BRAIN TIME — SCACCHI
   Puzzle tattici (matto in una mossa, forchette, inchiodature)
   e conoscenza delle regole. Notazione italiana:
   R = Re, D = Donna, T = Torre, A = Alfiere, C = Cavallo
   ========================================================= */
(function (BT) {
  'use strict';

  /* ---------- disegno della scacchiera da una stringa FEN ---------- */
  var GLYPH = {
    K: '♔', Q: '♕', R: '♖', B: '♗', N: '♘', P: '♙',
    k: '♚', q: '♛', r: '♜', b: '♝', n: '♞', p: '♟'
  };
  var FILES = 'abcdefgh';

  BT.renderBoard = function (fen, turnLabel) {
    var placement = fen.split(' ')[0];
    var ranks = placement.split('/');
    var html = '<div class="board">';
    for (var r = 0; r < 8; r++) {
      html += '<div class="board-row">';
      var row = ranks[r], file = 0;
      for (var i = 0; i < row.length; i++) {
        var ch = row[i];
        if (ch >= '1' && ch <= '8') {
          var empties = parseInt(ch, 10);
          for (var e = 0; e < empties; e++) { html += square(file, r, ''); file++; }
        } else {
          html += square(file, r, ch);
          file++;
        }
      }
      html += '</div>';
    }
    html += '</div>';
    if (turnLabel) html += '<div class="board-turn">' + turnLabel + '</div>';
    return html;

    function square(f, rk, piece) {
      var light = (f + rk) % 2 === 0;
      var coord = FILES[f] + (8 - rk);
      var g = piece ? GLYPH[piece] : '';
      var cls = piece ? (piece === piece.toUpperCase() ? 'pc-w' : 'pc-b') : '';
      return '<div class="sq ' + (light ? 'light' : 'dark') + '">' +
             (g ? '<span class="' + cls + '">' + g + '</span>' : '') +
             '<span class="coord">' + coord + '</span></div>';
    }
  };

  /* ---------- helper ---------- */
  function puzzle(fen, testo, giusta, sbagliate, spiega, turno) {
    return BT.mc(testo, giusta, sbagliate, {
      explain: spiega, cat: 'chess', board: fen, turn: turno || 'Muove il Bianco'
    });
  }
  function regola(row) { return BT.fromRow(row, 'chess'); }

  /* ============================================================
     5a ELEMENTARE — regole di base e matti facilissimi
     ============================================================ */
  var elem5 = [
    function () {
      return puzzle('6k1/5ppp/8/8/8/8/8/R5K1 w - - 0 1',
        'Il Bianco d&agrave; <b>matto in una mossa</b>. Quale?',
        'Ta8', ['Tb1', 'Rg2', 'Ta7'],
        'La Torre arriva in a8 e d&agrave; scacco lungo l\'ultima traversa. Il Re nero non pu&ograve; scappare: i suoi stessi pedoni (f7, g7, h7) gli bloccano la via di fuga. Si chiama <b>matto del corridoio</b>.');
    },
    function () {
      return puzzle('4k3/R7/8/8/8/8/8/1R5K w - - 0 1',
        'Due Torri contro il Re solo: il Bianco d&agrave; <b>matto in una mossa</b>. Quale?',
        'Tb8', ['Ta8', 'Tb7', 'Rh2'],
        'Tb8 d&agrave; scacco sull\'ottava traversa mentre la Torre in a7 controlla la settima: il Re nero non ha pi&ugrave; case libere. Con Ta8 invece la settima traversa resta libera e il Re scappa in e7.');
    },
    function () {
      return puzzle('8/8/8/8/4N3/8/8/8 w - - 0 1',
        'Il Cavallo bianco &egrave; in <b>e4</b>. In quale di queste case pu&ograve; arrivare?',
        'f6', ['e6', 'g4', 'd4'],
        'Il Cavallo si muove a "L": due case in una direzione e una di lato. Da e4 pu&ograve; andare in d6, f6, c5, g5, c3, g3, d2, f2.', 'Il Cavallo &egrave; in e4');
    },
    function () { return regola(['Come si muove l\'<b>Alfiere</b>?', 'Sempre in diagonale', 'Solo in avanti', 'A "L" come il Cavallo', 'In orizzontale e verticale', 'L\'Alfiere resta sempre sulle case dello stesso colore.']); },
    function () { return regola(['Quale pezzo pu&ograve; <b>saltare</b> sopra gli altri?', 'Il Cavallo', 'La Torre', 'L\'Alfiere', 'La Donna', 'Il Cavallo &egrave; l\'unico pezzo che scavalca.']); },
    function () { return regola(['Quante case ha una scacchiera?', '64', '32', '81', '100', '8 righe per 8 colonne = 64 case.']); },
    function () { return regola(['Con quale pezzo il Re fa l\'<b>arrocco</b>?', 'Con la Torre', 'Con la Donna', 'Con l\'Alfiere', 'Con il Cavallo', 'L\'arrocco &egrave; l\'unica mossa in cui si muovono due pezzi insieme.']); },
    function () { return regola(['Quanti pedoni ha ogni giocatore all\'inizio della partita?', '8', '6', '10', '16', 'Otto pedoni schierati su tutta la seconda traversa.']); },
    function () { return regola(['Che cosa succede quando un pedone arriva in fondo alla scacchiera?', 'Si trasforma in un altro pezzo, di solito la Donna', 'Torna indietro', 'Viene mangiato', 'Diventa Re', 'Si chiama <b>promozione</b>.']); },
    function () { return regola(['Che cos\'&egrave; lo <b>scacco matto</b>?', 'Il Re &egrave; sotto attacco e non ha modo di salvarsi', 'Il Re &egrave; sotto attacco ma pu&ograve; scappare', 'Non ci sono pi&ugrave; pezzi sulla scacchiera', 'Il Re non pu&ograve; muoversi ma non &egrave; sotto attacco', 'L\'ultimo caso &egrave; lo <b>stallo</b> e finisce in parit&agrave;.']); },
    function () { return regola(['Quale pezzo &egrave; il pi&ugrave; forte della scacchiera?', 'La Donna', 'La Torre', 'Il Re', 'Il Cavallo', 'La Donna unisce i movimenti di Torre e Alfiere.']); },
    function () { return regola(['Chi muove per primo in una partita di scacchi?', 'Il Bianco', 'Il Nero', 'Si tira a sorte ogni mossa', 'Chi ha vinto la partita prima', 'Il Bianco muove sempre per primo.']); }
  ];

  /* ============================================================
     2a MEDIA — tattica di base
     ============================================================ */
  var media2 = [
    function () {
      return puzzle('6k1/8/6K1/8/8/8/8/Q7 w - - 0 1',
        'Donna e Re contro Re solo: il Bianco d&agrave; <b>matto in una mossa</b>. Quale?',
        'Da8', ['Da7', 'Rf5', 'Dh8'],
        'Da8 d&agrave; scacco sull\'ottava traversa; le case g7, f7 e h7 sono gi&agrave; controllate dal Re bianco in g6. Dh8 invece &egrave; scacco ma il Re nero mangia semplicemente la Donna.');
    },
    function () {
      return puzzle('4k3/1q6/8/8/2N5/8/8/6K1 w - - 0 1',
        'Trova la <b>forchetta</b>: quale mossa attacca Re e Donna contemporaneamente?',
        'Cd6', ['Ce5', 'Ca5', 'Cb6'],
        'Da d6 il Cavallo d&agrave; scacco al Re in e8 e nello stesso momento attacca la Donna in b7. Il Nero deve parare lo scacco e il Bianco vince la Donna.');
    },
    function () {
      return puzzle('4k3/8/2n5/8/8/8/8/5BK1 w - - 0 1',
        'Quale mossa <b>inchioda</b> il Cavallo nero contro il suo Re?',
        'Ab5', ['Ac4', 'Ad3', 'Ah3'],
        'Con l\'Alfiere in b5 il Cavallo in c6 non pu&ograve; pi&ugrave; muoversi: se si sposta lascerebbe il Re in scacco. Questa &egrave; l\'<b>inchiodatura assoluta</b>.');
    },
    function () {
      return puzzle('4k3/8/4K3/8/8/8/8/R7 w - - 0 1',
        'Finale elementare: il Bianco d&agrave; <b>matto in una mossa</b>. Quale?',
        'Ta8', ['Ta7', 'Rf6', 'Te1'],
        'Ta8 d&agrave; scacco sull\'ottava traversa e il Re bianco in e6 toglie al Re nero tutte le case di fuga (d7, e7, f7). &Egrave; il matto classico con Re e Torre.');
    },
    function () {
      return puzzle('r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5Q2/PPPP1PPP/RNB1K1NR w KQkq - 0 1',
        'Il Nero ha appena sbagliato: il Bianco d&agrave; <b>matto in una mossa</b>. Quale?',
        'Dxf7', ['Axf7', 'Db3', 'Cc3'],
        'La Donna mangia in f7 dando scacco, e il Re non pu&ograve; catturarla perch&eacute; la casa &egrave; difesa dall\'Alfiere in c4. &Egrave; il famoso <b>matto del barbiere</b>. Con Axf7 invece il Re scappa in e7.');
    },
    function () { return regola(['Che cos\'&egrave; una <b>forchetta</b> negli scacchi?', 'Un pezzo che attacca due o pi&ugrave; pezzi avversari contemporaneamente', 'Un pedone che arriva in ottava', 'Uno scacco doppio del Re', 'Una mossa che sacrifica la Donna', 'Il Cavallo &egrave; il maestro delle forchette.']); },
    function () { return regola(['Che cos\'&egrave; lo <b>stallo</b>?', 'Il giocatore di turno non ha mosse legali ma non &egrave; sotto scacco: la partita &egrave; patta', 'Il Re viene catturato', 'Una mossa vietata', 'Il pareggio deciso dai giocatori', 'Chi sta vincendo deve stare attento a non stallare l\'avversario.']); },
    function () { return regola(['Quanto vale convenzionalmente la <b>Donna</b> in punti?', '9 punti', '5 punti', '3 punti', '12 punti', 'Pedone 1, Cavallo e Alfiere 3, Torre 5, Donna 9.']); },
    function () { return regola(['Quanto vale una <b>Torre</b> rispetto a un Alfiere?', 'Di pi&ugrave;: 5 punti contro 3', 'Di meno: 2 punti contro 3', 'Uguale', 'Dipende dal colore delle case', 'La differenza fra Torre e pezzo leggero si chiama "qualit&agrave;".']); },
    function () { return regola(['Che cos\'&egrave; la presa <b>en passant</b>?', 'Un pedone cattura un pedone avversario che ha appena fatto un doppio passo', 'Il Re cattura una Torre', 'Una cattura fatta durante l\'arrocco', 'La promozione del pedone', 'Va giocata subito, alla mossa immediatamente successiva.']); },
    function () { return regola(['Nell\'apertura conviene soprattutto...', 'Sviluppare i pezzi e controllare il centro', 'Muovere solo i pedoni sulle colonne laterali', 'Portare subito fuori la Donna', 'Muovere due volte lo stesso pezzo', 'Sviluppo, centro e sicurezza del Re sono i tre principi base.']); },
    function () { return regola(['Che cos\'&egrave; un\'<b>inchiodatura</b>?', 'Un pezzo non pu&ograve; muoversi perch&eacute; scoprirebbe il Re o un pezzo di valore', 'Un pezzo bloccato da un pedone', 'Una mossa che d&agrave; scacco', 'Il Re che non pu&ograve; arroccare', 'Se dietro c\'&egrave; il Re si chiama inchiodatura assoluta.']); }
  ];

  /* ============================================================
     ADULTI — tattica avanzata e finali
     ============================================================ */
  var adulti = [
    function () {
      return puzzle('5rk1/5ppp/8/6NQ/8/8/8/6K1 w - - 0 1',
        'Il Bianco d&agrave; <b>matto in una mossa</b>. Quale?',
        'Dxh7', ['Dxf7', 'Ce6', 'Dh6'],
        'Dxh7 &egrave; scacco e il Re non pu&ograve; catturare la Donna perch&eacute; la casa h7 &egrave; difesa dal Cavallo in g5. Tutte le altre case (f8, f7, g7, h8) sono occupate dai suoi pezzi o controllate: matto.');
    },
    function () {
      return puzzle('4k3/1q6/8/8/2N5/8/8/6K1 w - - 0 1',
        'Individua il tema tattico: qual &egrave; la mossa vincente?',
        'Cd6, forchetta su Re e Donna', ['Ce5, attacco al Re', 'Ca5, cambio di Donna', 'Cb6, doppio attacco sulla colonna b'],
        'Il Cavallo in d6 d&agrave; scacco e attacca la Donna: il Nero deve rispondere allo scacco e perde la Donna.');
    },
    function () {
      return puzzle('r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5Q2/PPPP1PPP/RNB1K1NR w KQkq - 0 1',
        'Il Bianco ha un matto in una mossa. Perch&eacute; <b>Axf7+</b> non funziona?',
        'Perch&eacute; dopo Axf7+ il Re scappa in e7', 'Perch&eacute; &egrave; una mossa illegale', 'Perch&eacute; l\'Alfiere &egrave; inchiodato', 'Perch&eacute; il Nero mangia con il Cavallo',
        'Dopo Axf7+ la casa e7 resta libera. Il matto &egrave; invece Dxf7#, perch&eacute; la Donna controlla anche e7 ed &egrave; difesa dall\'Alfiere.');
    },
    function () { return regola(['Con <b>Re e Alfiere</b> contro Re solo si pu&ograve; dare matto?', 'No, la partita &egrave; patta per materiale insufficiente', 'S&igrave;, in massimo 20 mosse', 'S&igrave;, ma solo se il Re avversario &egrave; nell\'angolo', 'S&igrave;, con l\'aiuto dei pedoni', 'Servono almeno due Alfieri, oppure Alfiere e Cavallo.']); },
    function () { return regola(['Che cos\'&egrave; la <b>regola del quadrato</b> nei finali di pedone?', 'Serve a capire a colpo d\'occhio se il Re riesce a fermare un pedone passato', 'Indica come muovere il Re nell\'angolo', 'Determina il valore dei pezzi', 'Regola la promozione del pedone', 'Se il Re entra nel quadrato del pedone, riesce a fermarlo.']); },
    function () { return regola(['Che cos\'&egrave; l\'<b>opposizione</b> nei finali di Re e pedone?', 'La posizione in cui i due Re si fronteggiano con una casa di mezzo e chi deve muovere &egrave; in svantaggio', 'Un attacco simultaneo su due pezzi', 'La difesa contro l\'arrocco', 'La regola che vieta il contatto fra i Re', 'Chi ha l\'opposizione controlla l\'avanzata del Re avversario.']); },
    function () { return regola(['Quale apertura nasce da 1.e4 c5?', 'La Difesa Siciliana', 'La Difesa Francese', 'La Partita Spagnola', 'Il Gambetto di Donna', 'La Francese &egrave; 1.e4 e6, la Spagnola 1.e4 e5 2.Cf3 Cc6 3.Ab5.']); },
    function () { return regola(['Che cos\'&egrave; il <b>matto affogato</b>?', 'Il Re viene mattato dal Cavallo perch&eacute; circondato dai suoi stessi pezzi', 'Il matto dato con due Torri', 'Il matto sull\'ultima traversa', 'Il matto in due mosse in apertura', 'Il tema classico &egrave; il matto di Filidor con sacrificio di Donna.']); },
    function () { return regola(['Dopo quante mosse senza catture n&eacute; mosse di pedone si pu&ograve; chiedere la patta?', '50 mosse', '30 mosse', '20 mosse', '100 mosse', '&Egrave; la regola delle 50 mosse; esiste anche la patta per triplice ripetizione.']); },
    function () { return regola(['Che cos\'&egrave; lo <b>zugzwang</b>?', 'La situazione in cui qualsiasi mossa peggiora la propria posizione', 'Un attacco doppio della Donna', 'Un sacrificio di qualit&agrave;', 'Il pedone bloccato in colonna', 'Termine tedesco: "costrizione a muovere". Decisivo nei finali.']); },
    function () { return regola(['Che cos\'&egrave; un <b>pedone passato</b>?', 'Un pedone che non ha pi&ugrave; pedoni avversari davanti n&eacute; sulle colonne adiacenti', 'Un pedone che ha fatto il doppio passo', 'Un pedone catturato en passant', 'Un pedone che ha superato la met&agrave; campo', 'Nei finali il pedone passato &egrave; spesso decisivo.']); },
    function () { return regola(['Che cos\'&egrave; un <b>attacco di scoperta</b>?', 'Un pezzo si sposta e libera la linea di attacco di un altro pezzo dietro di lui', 'Un attacco portato da due pedoni', 'La cattura della Donna avversaria', 'Un attacco al Re non arroccato', 'Se il pezzo che si sposta d&agrave; anche scacco si parla di scacco doppio.']); }
  ];

  BT.CHESS = { elem5: elem5, media2: media2, adulti: adulti };

})(window.BT);
