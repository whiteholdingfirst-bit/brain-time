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
    ,

    /* ---------- aggiunte del 20/09/2026 ----------
       Motivo: 12 domande erano troppo poche. Una partita in Medio ne
       pesca 9, quindi Diego e Gabri si ritrovavano quasi sempre le
       stesse. Nessuna randomizzazione puo' inventare domande che non
       esistono: l'unica cura e' scriverne altre. */

    /* --- movimento dei pezzi, con la scacchiera sotto gli occhi --- */
    function () {
      return puzzle('8/8/8/8/8/8/8/1N6 w - - 0 1',
        'Il Cavallo bianco &egrave; in <b>b1</b>, dove parte a inizio partita. Dove pu&ograve; andare?',
        'c3', ['b3', 'c1', 'b2'],
        'Da b1 il Cavallo raggiunge solo <b>a3</b>, <b>c3</b> e <b>d2</b>. Il Cavallo non va mai dritto di una casa: fa sempre la "L".',
        'Il Cavallo &egrave; in b1');
    },
    function () {
      return puzzle('8/8/8/8/8/8/8/2B5 w - - 0 1',
        'L\'Alfiere bianco parte da <b>c1</b>, che &egrave; una casa scura. Dove si muover&agrave; per tutta la partita?',
        'Sempre e solo su case scure', ['Sempre e solo su case chiare', 'Su tutte le case', 'Prima sulle scure, poi sulle chiare'],
        'Muovendosi in diagonale l\'Alfiere non cambia mai colore di casa. Per questo ognuno ne ha due: uno per le chiare e uno per le scure.',
        'L\'Alfiere &egrave; in c1');
    },
    function () {
      return puzzle('8/8/8/8/3R4/8/8/8 w - - 0 1',
        'Una Torre da sola in <b>d4</b>: quante case tiene sotto controllo?',
        '14', ['8', '12', '16'],
        'Sette case sulla traversa e sette sulla colonna: 7 + 7 = <b>14</b>. La Torre ne controlla sempre 14, ovunque la metti. Il Cavallo invece cambia: al centro 8, in un angolo solo 2.',
        'La Torre &egrave; in d4');
    },

    /* --- come si muovono --- */
    function () { return regola(['Come si muove la <b>Torre</b>?', 'In orizzontale e in verticale, quante case vuole', 'Solo in diagonale', 'Una casa alla volta', 'A "L" come il Cavallo', 'Torre e Alfiere messi insieme fanno la Donna.']); },
    function () { return regola(['Come si muove il <b>Re</b>?', 'Una casa alla volta, in qualsiasi direzione', 'Quante case vuole, in diagonale', 'Due case alla volta', 'Solo in avanti', 'Il Re &egrave; lento, ma verso la fine della partita diventa un pezzo forte.']); },
    function () { return regola(['Come si muove la <b>Donna</b>?', 'Come la Torre e l\'Alfiere messi insieme', 'Solo in diagonale', 'A "L" come il Cavallo', 'Una casa alla volta', 'E per questo vale nove punti, pi&ugrave; di ogni altro pezzo.']); },
    function () { return regola(['Come <b>mangia</b> un pedone?', 'In diagonale, una casa avanti', 'Dritto davanti a s&eacute;', 'In tutte le direzioni', 'Non pu&ograve; mangiare', 'Il pedone &egrave; l\'unico pezzo che mangia in un modo diverso da come cammina.']); },
    function () { return regola(['Un pedone pu&ograve; tornare <b>indietro</b>?', 'No, mai', 'S&igrave;, una casa alla volta', 'S&igrave;, se &egrave; in pericolo', 'Solo per mangiare', 'Il pedone va solo avanti: ogni sua mossa &egrave; per sempre. Per questo si pensa due volte.']); },
    function () { return regola(['Quante case pu&ograve; fare un pedone alla sua <b>prima</b> mossa?', 'Una oppure due, come preferisci', 'Sempre due', 'Sempre una', 'Fino a quattro', 'Solo la prima volta: dopo, una alla volta.']); },
    function () { return regola(['Il <b>Cavallo</b> cambia colore di casa a ogni mossa?', 'S&igrave;, sempre: da chiara a scura e viceversa', 'No, resta sempre sullo stesso colore', 'Solo quando mangia', 'Dipende da dove parte', 'E\' un trucco utile: se adesso &egrave; su una casa chiara, dopo una mossa sar&agrave; per forza su una scura.']); },

    /* --- la scacchiera --- */
    function () { return regola(['Di che colore &egrave; la casa <b>a1</b>, quella in basso a sinistra?', 'Scura', 'Chiara', 'Dipende dalla scacchiera', 'Non ha colore', 'La regola per montarla &egrave;: <b>casa chiara a destra</b>. Quindi h1 &egrave; chiara e a1 scura.']); },
    function () { return regola(['Quante case <b>scure</b> ci sono su una scacchiera?', '32', '64', '16', '30', 'Met&agrave; e met&agrave;: 32 scure e 32 chiare.']); },
    function () { return regola(['Come si chiamano le file verticali, quelle con le lettere a, b, c...?', 'Colonne', 'Traverse', 'Diagonali', 'Corsie', 'Quelle orizzontali, con i numeri, si chiamano <b>traverse</b>.']); },
    function () { return regola(['Nel nome di una casa come <b>e4</b>, che cosa indica la lettera?', 'La colonna', 'La traversa', 'Il pezzo che ci sta sopra', 'Di chi &egrave; il turno', 'Prima la colonna (lettera), poi la traversa (numero): sempre in quest\'ordine.']); },

    /* --- i pezzi e quanto valgono --- */
    function () { return regola(['Quanti pezzi ci sono in tutto sulla scacchiera all\'<b>inizio</b>?', '32', '16', '64', '24', 'Sedici per parte: 8 pedoni, 2 Torri, 2 Cavalli, 2 Alfieri, la Donna e il Re.']); },
    function () { return regola(['Quanti <b>Alfieri</b> ha ogni giocatore all\'inizio?', '2', '1', '4', '8', 'Uno che cammina sulle case chiare e uno sulle scure.']); },
    function () { return regola(['Quanto vale un <b>Cavallo</b> in punti?', '3, esattamente come l\'Alfiere', '5', '1', '9', 'Pedone 1, Cavallo e Alfiere 3, Torre 5, Donna 9. Il Re non ha un prezzo: senza di lui la partita finisce.']); },
    function () { return regola(['Dove sta la <b>Donna bianca</b> all\'inizio della partita?', 'In d1, su una casa chiara', 'In e1, accanto al Re', 'In a1, nell\'angolo', 'In d8', 'Si ricorda cos&igrave;: <b>la Donna sul suo colore</b>. La bianca sulla casa chiara, la nera sulla scura.']); },

    /* --- scacco, matto, patta --- */
    function () { return regola(['Il tuo Re &egrave; sotto <b>scacco</b>: che cosa devi fare?', 'Rispondere subito: spostarlo, coprirlo, oppure mangiare chi lo attacca', 'Puoi anche ignorarlo e fare un\'altra mossa', 'Devi per forza spostare il Re', 'Devi per forza mangiare il pezzo che d&agrave; scacco', 'Sono le tre uniche risposte possibili, e una va giocata subito: non si rimanda.']); },
    function () { return regola(['Puoi fare una mossa che lascia il <b>tuo</b> Re sotto scacco?', 'No, &egrave; vietato', 'S&igrave;, ma perdi un punto', 'S&igrave;, se ti conviene', 'Una volta sola per partita', 'Una mossa che lascia il proprio Re in scacco semplicemente non esiste: &egrave; illegale.']); },
    function () { return regola(['I due <b>Re</b> possono finire uno accanto all\'altro?', 'No, mai: devono restare a distanza', 'S&igrave;, se sono in un angolo', 'S&igrave;, sempre', 'Solo alla fine della partita', 'Avvicinandosi si darebbero scacco a vicenda, e questo non &egrave; permesso.']); },
    function () { return regola(['Il <b>Re</b> viene mangiato, prima o poi?', 'No: la partita finisce prima, con il matto', 'S&igrave;, e chi lo mangia vince', 'S&igrave;, ma solo dalla Donna', 'S&igrave;, sempre alla fine', 'Il matto vuol dire proprio questo: il Re <i>sarebbe</i> preso alla mossa dopo e non c\'&egrave; modo di evitarlo. Si finisce l&igrave;.']); },
    function () { return regola(['Che cos\'&egrave; una <b>patta</b>?', 'La partita finisce in parit&agrave;: non vince nessuno dei due', 'Una vittoria del Bianco', 'Una mossa proibita', 'Il nome della prima mossa', 'Ci si arriva per stallo, per accordo fra i giocatori, o perch&eacute; non bastano i pezzi per dare matto.']); },

    /* --- pedoni, promozione, pezzo toccato --- */
    function () { return regola(['Un pedone che arriva in fondo pu&ograve; diventare <b>Re</b>?', 'No: pu&ograve; diventare Donna, Torre, Alfiere o Cavallo', 'S&igrave;, e cos&igrave; ne hai due', 'S&igrave;, ma solo se hai perso il tuo', 'No, resta pedone per sempre', 'Quasi sempre si sceglie la Donna, ma ogni tanto conviene il Cavallo: fa mosse che la Donna non sa fare.']); },
    function () { return regola(['Puoi avere <b>due Donne</b> nella stessa partita?', 'S&igrave;, facendo arrivare un pedone in fondo', 'No, mai', 'S&igrave;, ma solo mangiando quella avversaria', 'S&igrave;, solo nell\'ultima mossa', 'E in teoria anche nove, se tutti i pedoni arrivassero dall\'altra parte.']); },
    function () { return regola(['Hai <b>toccato</b> un tuo pezzo. Che cosa devi fare?', 'Muoverlo, se ha almeno una mossa possibile', 'Niente, puoi ancora cambiare idea', 'Passare il turno', 'Muovere un pezzo qualsiasi', 'E\' la regola del <b>pezzo toccato</b>. Se vuoi solo sistemare un pezzo storto, si avvisa prima dicendo "aggiusto".']); },
    function () { return regola(['Quale di questi pezzi <b>non</b> pu&ograve; mai tornare sui suoi passi?', 'Il pedone', 'La Torre', 'Il Cavallo', 'L\'Alfiere', 'Tutti gli altri possono tornare indietro; il pedone no, e infatti &egrave; il pezzo su cui si sbaglia di pi&ugrave;.']); }
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
    ,

    /* ---------- aggiunte del 20/09/2026 ----------
       Stesso motivo dell'elementare, ma qui era peggio: in Difficile si
       pesca dalla fascia sopra, quindi un quinta elementare che sceglie
       Difficile prende 15 domande da questa banca. Con 12 domande in
       tutto, tre erano ripetute per forza nella stessa partita. */

    /* --- temi tattici --- */
    function () { return regola(['Che cos\'&egrave; un\'<b>infilata</b> (o "spiedo")?', 'Un pezzo di valore &egrave; sotto attacco e spostandosi scopre un pezzo dietro di lui', 'Due pezzi attaccati insieme dallo stesso Cavallo', 'Un pedone che blocca una colonna', 'Un attacco al Re non arroccato', 'E\' l\'inchiodatura al contrario: davanti c\'&egrave; il pezzo che vale di pi&ugrave;.']); },
    function () { return regola(['Che cos\'&egrave; un <b>attacco doppio</b>?', 'Una mossa sola che crea due minacce insieme', 'Due scacchi di fila', 'Un attacco portato da due pedoni', 'La cattura di due pezzi nella stessa mossa', 'L\'avversario pu&ograve; parare una minaccia, non due.']); },
    function () { return regola(['Che cos\'&egrave; lo <b>scacco doppio</b>?', 'Due pezzi danno scacco nello stesso momento: si pu&ograve; solo spostare il Re', 'Due scacchi in due mosse diverse', 'Uno scacco a cui si risponde con un altro scacco', 'Lo scacco dato dalla Donna', 'Non si pu&ograve; n&eacute; coprire n&eacute; mangiare: due pezzi non si fermano con una mossa sola. Per questo &egrave; cos&igrave; potente.']); },
    function () { return regola(['Che cos\'&egrave; la <b>deviazione</b>?', 'Costringere un pezzo ad abbandonare un compito di difesa', 'Muovere un pezzo in diagonale', 'Cambiare piano a met&agrave; partita', 'Spostare il Re al centro', 'Spesso si ottiene con un sacrificio: il pezzo che difendeva &egrave; obbligato a mangiare e lascia scoperto quello che proteggeva.']); },

    /* --- la notazione --- */
    function () { return regola(['Che cosa vuol dire <b>O-O</b> nella notazione?', 'Arrocco corto, dalla parte del Re', 'Arrocco lungo, dalla parte della Donna', 'Patta', 'Cattura', 'L\'arrocco lungo si scrive <b>O-O-O</b>: tre "O" perch&eacute; il Re fa pi&ugrave; strada.']); },
    function () { return regola(['Che cosa indica il segno <b>+</b> dopo una mossa?', 'Scacco', 'Scacco matto', 'Una mossa molto buona', 'Una cattura', 'Il matto si scrive con <b>#</b>, e una mossa buona con un punto esclamativo.']); },
    function () { return regola(['Nella mossa <b>Txe5</b>, che cosa vuol dire la <b>x</b>?', 'Che la Torre mangia il pezzo che sta in e5', 'Che la mossa &egrave; sbagliata', 'Che &egrave; scacco', 'Che la Torre &egrave; inchiodata', 'La lettera iniziale dice il pezzo, la x la cattura, e poi la casa d\'arrivo.']); },

    /* --- arrocco: quando non si pu&ograve; --- */
    function () { return regola(['Si pu&ograve; arroccare mentre il proprio Re &egrave; sotto <b>scacco</b>?', 'No, mai', 'S&igrave;, anzi &egrave; il modo migliore per salvarsi', 'S&igrave;, ma solo l\'arrocco corto', 'S&igrave;, se la Torre non &egrave; attaccata', 'E nemmeno passando per una casa attaccata, n&eacute; finendo sotto scacco. Ma la Torre, quella, pu&ograve; essere attaccata: quello &egrave; permesso.']); },
    function () { return regola(['Il Re ha gi&agrave; mosso una volta ed &egrave; tornato indietro. Si pu&ograve; ancora arroccare?', 'No: se il Re ha mosso, l\'arrocco &egrave; perso per sempre', 'S&igrave;, basta che sia tornato al suo posto', 'S&igrave;, ma solo da una parte', 'S&igrave;, dopo dieci mosse', 'Vale anche per la Torre: quella che ha mosso non pu&ograve; pi&ugrave; arroccare, ma l\'altra s&igrave;.']); },

    /* --- patte e finali --- */
    function () { return regola(['Qual &egrave; il <b>matto pi&ugrave; veloce</b> possibile?', 'In due mosse', 'In quattro mosse', 'In dieci mosse', 'In una mossa', 'Si chiama <b>matto dei folli</b> e lo subisce il Bianco: 1.f3 e5 2.g4 Dh4 matto.']); },
    function () { return regola(['Re e <b>due Cavalli</b> contro Re solo: si riesce a dare matto per forza?', 'No, non si pu&ograve; forzare', 'S&igrave;, sempre', 'S&igrave;, in meno di dieci mosse', 'S&igrave;, ma solo nell\'angolo', 'Il matto esiste ma l\'avversario pu&ograve; sempre evitarlo. Con due Alfieri, oppure Alfiere e Cavallo, invece si vince.']); },
    function () { return regola(['Re contro Re e <b>un solo Alfiere</b>: come finisce?', 'Patta: non bastano i pezzi per dare matto', 'Vince chi ha l\'Alfiere', 'Vince chi muove per primo', 'Si continua finch&eacute; scade il tempo', 'Si chiama <b>materiale insufficiente</b>. Vale anche con un solo Cavallo.']); },
    function () { return regola(['Che cos\'&egrave; la <b>triplice ripetizione</b>?', 'La stessa identica posizione si ripete tre volte: si pu&ograve; chiedere patta', 'Tre scacchi di fila', 'Tre mosse uguali dello stesso pezzo', 'Ripetere tre volte l\'arrocco', 'E\' l\'ancora di salvezza di chi sta perdendo, e la trappola di chi vince e non sta attento.']); },
    function () { return regola(['Nei <b>finali</b>, dove conviene tenere il Re?', 'Al centro, attivo: diventa un pezzo forte', 'Nell\'angolo, al sicuro come sempre', 'Dietro ai pedoni, senza muoverlo', 'Vicino alla Torre avversaria', 'Con pochi pezzi in giro nessuno lo minaccia pi&ugrave;: tenerlo nascosto &egrave; un\'occasione buttata.']); },
    function () { return regola(['Dove va messa la <b>Torre</b> rispetto a un pedone passato?', 'Dietro al pedone', 'Davanti al pedone', 'Di fianco al pedone', 'Sulla colonna accanto', 'Vale per tutte e due: dietro al proprio pedone per spingerlo, dietro a quello avversario per fermarlo.']); },

    /* --- pedoni e struttura --- */
    function () { return regola(['Che cosa sono i <b>pedoni doppiati</b>?', 'Due pedoni dello stesso colore sulla stessa colonna', 'Due pedoni che avanzano insieme', 'Due pedoni che si difendono a vicenda', 'Due pedoni arrivati in fondo', 'Non possono difendersi fra loro e sono lenti: di solito sono una debolezza, ma in cambio aprono una colonna.']); },
    function () { return regola(['Che cos\'&egrave; la <b>sottopromozione</b>?', 'Promuovere un pedone in Torre, Alfiere o Cavallo invece che in Donna', 'Promuovere prima dell\'ottava traversa', 'Promuovere due pedoni insieme', 'Rinunciare a promuovere', 'Sembra assurdo scegliere meno della Donna, ma a volte il Cavallo d&agrave; scacco e la Donna no. E a volte la Donna darebbe stallo.']); },

    /* --- pezzi e valore --- */
    function () { return regola(['Che cos\'&egrave; la <b>coppia degli alfieri</b>?', 'Avere ancora tutti e due gli Alfieri quando l\'avversario no: &egrave; un piccolo vantaggio', 'Due Alfieri sulla stessa diagonale', 'Due Alfieri dello stesso colore di casa', 'Un\'apertura famosa', 'Insieme coprono tutte le case, chiare e scure. A scacchiera aperta valgono pi&ugrave; di Alfiere e Cavallo.']); },
    function () { return regola(['Un <b>Cavallo</b> messo in un angolo quante case controlla?', '2', '4', '8', '6', 'Da qui il detto: <b>"il Cavallo sul bordo &egrave; sempre sordo"</b>. Al centro ne controlla 8.']); },
    function () { return regola(['Quali sono le quattro case del <b>centro</b>?', 'd4, e4, d5, e5', 'a1, h1, a8, h8', 'c3, f3, c6, f6', 'd1, e1, d8, e8', 'Chi controlla il centro ha pi&ugrave; spazio e muove i pezzi pi&ugrave; in fretta da una parte all\'altra.']); },

    /* --- apertura --- */
    function () { return regola(['Perch&eacute; non conviene portare fuori la <b>Donna</b> nelle prime mosse?', 'Perch&eacute; l\'avversario la attacca sviluppando i suoi pezzi e guadagna tempo', 'Perch&eacute; &egrave; vietato dalle regole', 'Perch&eacute; la Donna vale poco all\'inizio', 'Perch&eacute; non pu&ograve; tornare indietro', 'Ogni volta che scappi dalla Donna perdi una mossa, e l\'avversario intanto costruisce.']); },
    function () { return regola(['Nell\'apertura, quante volte conviene muovere lo <b>stesso</b> pezzo?', 'Una sola, finch&eacute; non hai sviluppato gli altri', 'Il pi&ugrave; possibile', 'Tre volte, per metterlo al posto giusto', 'Non ha importanza', 'Ogni mossa in pi&ugrave; con lo stesso pezzo &egrave; una mossa in meno per svegliare gli altri.']); },
    function () { return regola(['Da che parte conviene arroccare, di solito?', 'Corto, perch&eacute; &egrave; pi&ugrave; veloce e il Re resta pi&ugrave; coperto', 'Lungo, perch&eacute; la Torre entra subito in gioco', 'Non importa, &egrave; uguale', 'Dalla parte dove l\'avversario ha meno pezzi', 'L\'arrocco lungo &egrave; una scelta pi&ugrave; aggressiva: mette la Torre al centro ma lascia il Re un po\' pi&ugrave; scoperto.']); }
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
