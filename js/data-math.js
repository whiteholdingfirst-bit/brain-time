/* =========================================================
   BRAIN TIME — MATEMATICA
   Domande generate al volo: non finiscono mai e non si ripetono
   sempre uguali. Difficolta' crescente per livello scolastico.
   ========================================================= */
(function (BT) {
  'use strict';

  var R = BT.rnd, N = BT.numNoise, P = BT.pick;
  function q(text, correct, wrong, explain) {
    return BT.mc(text, correct, wrong, { explain: explain, cat: 'math' });
  }
  function gcd(a, b) { while (b) { var t = b; b = a % b; a = t; } return a; }

  /* ============================================================
     5a ELEMENTARE
     ============================================================ */
  var elem5 = [

    // moltiplicazione a due cifre
    function () {
      var a = R(12, 49), b = R(3, 9);
      return q(a + ' &times; ' + b + ' = ?', a * b, N(a * b, 12),
        a + ' &times; ' + b + ' = ' + (a * b) + '. Trucco: ' + a + ' &times; ' + b +
        ' = (' + (a - a % 10) + ' &times; ' + b + ') + (' + (a % 10) + ' &times; ' + b + ').');
    },

    // divisione con resto
    function () {
      var d = R(3, 9), quo = R(6, 19), r = R(1, d - 1), n = d * quo + r;
      return q(n + ' : ' + d + ' = ? (con il resto)', quo + ' resto ' + r,
        [(quo + 1) + ' resto ' + r, quo + ' resto ' + ((r % (d - 1)) + 1), (quo - 1) + ' resto ' + r],
        d + ' &times; ' + quo + ' = ' + (d * quo) + ', e per arrivare a ' + n + ' avanza ' + r + '.');
    },

    // percentuale facile
    function () {
      var perc = P([10, 20, 25, 50, 75]), base = R(2, 40) * 20;
      var res = base * perc / 100;
      return q('Quanto fa il ' + perc + '% di ' + base + '?', res, N(res, Math.max(4, res / 3)),
        'Il ' + perc + '% vuol dire ' + perc + ' ogni 100: ' + base + ' : 100 &times; ' + perc + ' = ' + res + '.');
    },

    // area / perimetro rettangolo
    function () {
      var b = R(4, 18), h = R(3, 15);
      if (Math.random() < 0.5) {
        return q('Un rettangolo ha base ' + b + ' cm e altezza ' + h + ' cm. Qual &egrave; la sua <b>area</b>?',
          (b * h) + ' cm&sup2;', [(2 * (b + h)) + ' cm&sup2;', (b + h) + ' cm&sup2;', (b * h + 2) + ' cm&sup2;'],
          'Area del rettangolo = base &times; altezza = ' + b + ' &times; ' + h + ' = ' + (b * h) + ' cm&sup2;.');
      }
      return q('Un rettangolo ha base ' + b + ' cm e altezza ' + h + ' cm. Qual &egrave; il suo <b>perimetro</b>?',
        (2 * (b + h)) + ' cm', [(b * h) + ' cm', (b + h) + ' cm', (2 * b + h) + ' cm'],
        'Perimetro = (base + altezza) &times; 2 = (' + b + ' + ' + h + ') &times; 2 = ' + (2 * (b + h)) + ' cm.');
    },

    // frazione di un numero
    function () {
      var den = P([2, 3, 4, 5, 6, 8]), num = R(1, den - 1), tot = den * R(3, 15);
      var res = tot / den * num;
      return q('Quanto vale ' + num + '/' + den + ' di ' + tot + '?', res, N(res, Math.max(3, res / 2)),
        tot + ' : ' + den + ' = ' + (tot / den) + ', poi &times; ' + num + ' = ' + res + '.');
    },

    // espressione con parentesi
    function () {
      var a = R(4, 15), b = R(2, 9), c = R(2, 8);
      var res = (a + b) * c;
      return q('(' + a + ' + ' + b + ') &times; ' + c + ' = ?', res, [a + b * c, (a + b) + c, a * c + b],
        'Prima la parentesi: ' + a + ' + ' + b + ' = ' + (a + b) + '; poi &times; ' + c + ' = ' + res + '.');
    },

    // decimali
    function () {
      var a = R(15, 90) / 10, b = R(15, 90) / 10;
      var res = Math.round((a + b) * 10) / 10;
      return q(a.toString().replace('.', ',') + ' + ' + b.toString().replace('.', ',') + ' = ?',
        res.toString().replace('.', ','),
        [(res + 1).toFixed(1).replace('.', ','), (res - 0.9).toFixed(1).replace('.', ','), (res + 0.1).toFixed(1).replace('.', ',')],
        'Si incolonnano le virgole: ' + a + ' + ' + b + ' = ' + res + '.');
    },

    // equivalenze
    function () {
      var kind = P([
        { d: 'metri in centimetri', f: 100, u1: 'm', u2: 'cm' },
        { d: 'chilogrammi in grammi', f: 1000, u1: 'kg', u2: 'g' },
        { d: 'litri in millilitri', f: 1000, u1: 'l', u2: 'ml' },
        { d: 'chilometri in metri', f: 1000, u1: 'km', u2: 'm' }
      ]);
      var v = R(2, 25), res = v * kind.f;
      return q('Quanti ' + kind.u2 + ' sono ' + v + ' ' + kind.u1 + '?', res + ' ' + kind.u2,
        [(v * kind.f / 10) + ' ' + kind.u2, (v * kind.f * 10) + ' ' + kind.u2, (v + kind.f) + ' ' + kind.u2],
        '1 ' + kind.u1 + ' = ' + kind.f + ' ' + kind.u2 + ', quindi ' + v + ' &times; ' + kind.f + ' = ' + res + '.');
    },

    // problema con i soldi
    function () {
      var prezzo = R(2, 9) + R(0, 1) * 0.5, pezzi = R(3, 8), paga = P([20, 50]);
      var spesa = Math.round(prezzo * pezzi * 100) / 100;
      if (spesa > paga) { pezzi = 3; spesa = Math.round(prezzo * pezzi * 100) / 100; }
      var resto = Math.round((paga - spesa) * 100) / 100;
      return q('Un quaderno costa ' + prezzo.toFixed(2).replace('.', ',') + ' &euro;. Ne compri ' + pezzi +
        ' e paghi con ' + paga + ' &euro;. Quanto ti danno di resto?',
        resto.toFixed(2).replace('.', ',') + ' &euro;',
        [(resto + 1).toFixed(2).replace('.', ',') + ' &euro;', spesa.toFixed(2).replace('.', ',') + ' &euro;',
         (resto - 0.5).toFixed(2).replace('.', ',') + ' &euro;'],
        'Spesa: ' + prezzo.toFixed(2) + ' &times; ' + pezzi + ' = ' + spesa.toFixed(2) +
        ' &euro;. Resto: ' + paga + ' - ' + spesa.toFixed(2) + ' = ' + resto.toFixed(2) + ' &euro;.');
    },

    // multipli e divisori
    function () {
      var n = R(12, 60);
      var divisori = [];
      for (var i = 1; i <= n; i++) if (n % i === 0) divisori.push(i);
      var giusto = P(divisori.filter(function (d) { return d > 1 && d < n; }) .length ?
                     divisori.filter(function (d) { return d > 1 && d < n; }) : [1]);
      var sbagliati = [];
      for (var k = 2; k < n && sbagliati.length < 3; k++) if (n % k !== 0) sbagliati.push(k);
      return q('Quale di questi numeri &egrave; un <b>divisore</b> di ' + n + '?', giusto, BT.shuffle(sbagliati),
        n + ' : ' + giusto + ' = ' + (n / giusto) + ', divisione esatta senza resto.');
    },

    // media
    function () {
      var a = R(4, 10), b = R(4, 10), c = R(4, 10);
      var s = a + b + c;
      while (s % 3 !== 0) { c++; s = a + b + c; }
      var m = s / 3;
      return q('Qual &egrave; la media di ' + a + ', ' + b + ' e ' + c + '?', m, N(m, 4),
        'Somma: ' + a + '+' + b + '+' + c + ' = ' + s + '; diviso 3 fa ' + m + '.');
    },

    // frazioni stesso denominatore
    function () {
      var den = P([5, 6, 7, 8, 9, 10]), a = R(1, den - 2), b = R(1, den - a);
      return q(a + '/' + den + ' + ' + b + '/' + den + ' = ?', (a + b) + '/' + den,
        [(a + b) + '/' + (den * 2), (a * b) + '/' + den, (a + b + 1) + '/' + den],
        'Con lo stesso denominatore si sommano solo i numeratori: ' + a + ' + ' + b + ' = ' + (a + b) + '.');
    }
  ];

  /* ============================================================
     2a MEDIA
     ============================================================ */
  var media2 = [

    // potenze
    function () {
      var b = R(2, 12), e = P([2, 2, 3]);
      var res = Math.pow(b, e);
      return q(b + '<sup>' + e + '</sup> = ?', res, [b * e, res + b, Math.pow(b, e) - b],
        b + '<sup>' + e + '</sup> significa ' + Array(e + 1).join(b + '&times;').slice(0, -7) + ' = ' + res + '.');
    },

    // radice quadrata
    function () {
      var r = R(4, 20), n = r * r;
      return q('&radic;' + n + ' = ?', r, [n / 2, r + 1, r * 2],
        r + ' &times; ' + r + ' = ' + n + ', quindi la radice quadrata di ' + n + ' &egrave; ' + r + '.');
    },

    // numeri relativi
    function () {
      var a = R(-15, -2), b = R(3, 18), c = R(-9, 9);
      var res = a + b - c;
      return q('(' + a + ') + ' + b + ' - (' + (c < 0 ? '' : '+') + c + ') = ?', res, N(res, 8),
        'Meno per meno d&agrave; pi&ugrave;: ' + a + ' + ' + b + ' ' + (c < 0 ? '+ ' + (-c) : '- ' + c) + ' = ' + res + '.');
    },

    // equazione di primo grado
    function () {
      var x = R(2, 14), a = R(2, 9), b = R(1, 25);
      var tot = a * x + b;
      return q('Risolvi: ' + a + 'x + ' + b + ' = ' + tot + '. Quanto vale x?', x, N(x, 5),
        'Porto ' + b + ' a destra: ' + a + 'x = ' + (tot - b) + '. Divido per ' + a + ': x = ' + x + '.');
    },

    // proporzione
    function () {
      var k = R(2, 9), a = R(2, 9), b = a * k, c = R(2, 12);
      var d = c * k;
      return q(a + ' : ' + b + ' = ' + c + ' : x &nbsp;&nbsp; Quanto vale x?', d, N(d, 9),
        'Il rapporto &egrave; ' + a + ':' + b + ' = 1:' + k + ', quindi x = ' + c + ' &times; ' + k + ' = ' + d + '.');
    },

    // sconto percentuale
    function () {
      var prezzo = R(4, 30) * 10, sconto = P([10, 15, 20, 25, 30, 40]);
      var finale = prezzo - prezzo * sconto / 100;
      return q('Una maglietta costa ' + prezzo + ' &euro; e viene scontata del ' + sconto + '%. Quanto si paga?',
        finale + ' &euro;', [(prezzo - sconto) + ' &euro;', (prezzo * sconto / 100) + ' &euro;', (finale + 5) + ' &euro;'],
        'Sconto: ' + prezzo + ' &times; ' + sconto + ' / 100 = ' + (prezzo * sconto / 100) +
        ' &euro;. Prezzo finale: ' + prezzo + ' - ' + (prezzo * sconto / 100) + ' = ' + finale + ' &euro;.');
    },

    // Pitagora (terne)
    function () {
      var terne = [[3, 4, 5], [6, 8, 10], [5, 12, 13], [9, 12, 15], [8, 15, 17], [12, 16, 20], [7, 24, 25]];
      var t = P(terne);
      if (Math.random() < 0.6) {
        return q('Un triangolo rettangolo ha i cateti di ' + t[0] + ' cm e ' + t[1] + ' cm. Quanto misura l\'ipotenusa?',
          t[2] + ' cm', [(t[0] + t[1]) + ' cm', (t[2] + 2) + ' cm', (t[1] + 1) + ' cm'],
          'i&sup2; = ' + t[0] + '&sup2; + ' + t[1] + '&sup2; = ' + (t[0] * t[0]) + ' + ' + (t[1] * t[1]) +
          ' = ' + (t[2] * t[2]) + ', quindi i = ' + t[2] + ' cm.');
      }
      return q('Un triangolo rettangolo ha ipotenusa ' + t[2] + ' cm e un cateto di ' + t[1] + ' cm. Quanto misura l\'altro cateto?',
        t[0] + ' cm', [(t[2] - t[1]) + ' cm', (t[0] + 2) + ' cm', (t[1] - 2) + ' cm'],
        'c&sup2; = ' + t[2] + '&sup2; - ' + t[1] + '&sup2; = ' + (t[2] * t[2] - t[1] * t[1]) + ', quindi c = ' + t[0] + ' cm.');
    },

    // cerchio
    function () {
      var r = R(2, 12);
      if (Math.random() < 0.5) {
        var c = Math.round(2 * 3.14 * r * 100) / 100;
        return q('Un cerchio ha raggio ' + r + ' cm. Quanto misura la circonferenza? (usa &pi; = 3,14)',
          c.toString().replace('.', ',') + ' cm',
          [(3.14 * r).toFixed(2).replace('.', ',') + ' cm', (3.14 * r * r).toFixed(2).replace('.', ',') + ' cm', (2 * r) + ' cm'],
          'C = 2 &times; &pi; &times; r = 2 &times; 3,14 &times; ' + r + ' = ' + c + ' cm.');
      }
      var a = Math.round(3.14 * r * r * 100) / 100;
      return q('Un cerchio ha raggio ' + r + ' cm. Qual &egrave; la sua area? (usa &pi; = 3,14)',
        a.toString().replace('.', ',') + ' cm&sup2;',
        [(2 * 3.14 * r).toFixed(2).replace('.', ',') + ' cm&sup2;', (3.14 * r).toFixed(2).replace('.', ',') + ' cm&sup2;',
         (a + 10).toFixed(2).replace('.', ',') + ' cm&sup2;'],
        'A = &pi; &times; r&sup2; = 3,14 &times; ' + (r * r) + ' = ' + a + ' cm&sup2;.');
    },

    // frazioni con denominatori diversi
    function () {
      var d1 = P([2, 3, 4, 6]), d2 = P([3, 4, 5, 8]);
      if (d1 === d2) d2 = d1 + 1;
      var n1 = R(1, d1 - 1), n2 = R(1, d2 - 1);
      var num = n1 * d2 + n2 * d1, den = d1 * d2;
      var g = gcd(num, den);
      var res = (num / g) + '/' + (den / g);
      return q(n1 + '/' + d1 + ' + ' + n2 + '/' + d2 + ' = ? (ridotta ai minimi termini)', res,
        [(n1 + n2) + '/' + (d1 + d2), num + '/' + den + ' ', (n1 * n2) + '/' + den],
        'Denominatore comune ' + den + ': ' + (n1 * d2) + '/' + den + ' + ' + (n2 * d1) + '/' + den +
        ' = ' + num + '/' + den + ' = ' + res + '.');
    },

    // espressione con potenze
    function () {
      var a = R(2, 6), b = R(2, 9), c = R(2, 5);
      var res = a * a + b * c;
      return q(a + '<sup>2</sup> + ' + b + ' &times; ' + c + ' = ?', res, N(res, 10),
        'Prima la potenza (' + (a * a) + ') e la moltiplicazione (' + (b * c) + '), poi la somma: ' + res + '.');
    },

    // mcm / MCD
    function () {
      var a = R(4, 18), b = R(4, 18);
      var g = gcd(a, b), m = a * b / g;
      if (Math.random() < 0.5)
        return q('Qual &egrave; il <b>M.C.D.</b> fra ' + a + ' e ' + b + '?', g, [m, a, Math.abs(a - b) || 2],
          'Il massimo comune divisore di ' + a + ' e ' + b + ' &egrave; ' + g + '.');
      return q('Qual &egrave; il <b>m.c.m.</b> fra ' + a + ' e ' + b + '?', m, [g, a * b, a + b],
        'Il minimo comune multiplo di ' + a + ' e ' + b + ' &egrave; ' + m + '.');
    },

    // volume solido
    function () {
      var l = R(2, 9);
      return q('Un cubo ha lo spigolo di ' + l + ' cm. Qual &egrave; il suo volume?',
        (l * l * l) + ' cm&sup3;', [(l * l) + ' cm&sup3;', (l * 6) + ' cm&sup3;', (l * l * 6) + ' cm&sup3;'],
        'Volume del cubo = spigolo&sup3; = ' + l + ' &times; ' + l + ' &times; ' + l + ' = ' + (l * l * l) + ' cm&sup3;.');
    }
  ];

  /* ============================================================
     ADULTI (modalita' genitori)
     ============================================================ */
  var adulti = [

    // IVA e prezzi
    function () {
      var netto = R(20, 400) * 5;
      var lordo = Math.round(netto * 1.22 * 100) / 100;
      return q('Un servizio costa ' + netto + ' &euro; + IVA al 22%. Quanto si paga in totale?',
        lordo.toFixed(2).replace('.', ',') + ' &euro;',
        [(netto + 22).toFixed(2).replace('.', ',') + ' &euro;', (netto * 1.2).toFixed(2).replace('.', ',') + ' &euro;',
         (netto * 1.22 + 10).toFixed(2).replace('.', ',') + ' &euro;'],
        netto + ' &times; 1,22 = ' + lordo.toFixed(2) + ' &euro;.');
    },

    // sconto su sconto
    function () {
      var p = R(10, 60) * 10, s1 = P([20, 30, 40]), s2 = P([10, 20]);
      var fin = Math.round(p * (1 - s1 / 100) * (1 - s2 / 100) * 100) / 100;
      return q('Un prezzo di ' + p + ' &euro; subisce uno sconto del ' + s1 + '% e poi un ulteriore ' + s2 +
        '% sul nuovo prezzo. Quanto si paga?', fin.toFixed(2).replace('.', ',') + ' &euro;',
        [(p * (1 - (s1 + s2) / 100)).toFixed(2).replace('.', ',') + ' &euro;',
         (p - s1 - s2).toFixed(2).replace('.', ',') + ' &euro;',
         (fin + 12).toFixed(2).replace('.', ',') + ' &euro;'],
        'Gli sconti non si sommano: ' + p + ' &times; ' + (1 - s1 / 100).toFixed(2) + ' &times; ' +
        (1 - s2 / 100).toFixed(2) + ' = ' + fin.toFixed(2) + ' &euro;.');
    },

    // percentuale inversa
    function () {
      var finale = R(15, 90) * 10, sconto = P([10, 20, 25]);
      var iniziale = Math.round(finale / (1 - sconto / 100) * 100) / 100;
      return q('Dopo uno sconto del ' + sconto + '% un oggetto costa ' + finale +
        ' &euro;. Qual era il prezzo di partenza?', iniziale.toFixed(2).replace('.', ',') + ' &euro;',
        [(finale * (1 + sconto / 100)).toFixed(2).replace('.', ',') + ' &euro;',
         (finale + sconto).toFixed(2).replace('.', ',') + ' &euro;',
         (iniziale + 40).toFixed(2).replace('.', ',') + ' &euro;'],
        'Prezzo finale = iniziale &times; ' + (1 - sconto / 100).toFixed(2) + ', quindi iniziale = ' +
        finale + ' / ' + (1 - sconto / 100).toFixed(2) + ' = ' + iniziale.toFixed(2) + ' &euro;.');
    },

    // interesse composto
    function () {
      var cap = P([1000, 2000, 5000]), tasso = P([3, 4, 5]), anni = P([2, 3]);
      var fin = Math.round(cap * Math.pow(1 + tasso / 100, anni) * 100) / 100;
      return q(cap + ' &euro; investiti al ' + tasso + '% annuo composto. Quanto valgono dopo ' + anni + ' anni?',
        fin.toFixed(2).replace('.', ',') + ' &euro;',
        [(cap * (1 + tasso * anni / 100)).toFixed(2).replace('.', ',') + ' &euro;',
         (cap + tasso * anni).toFixed(2).replace('.', ',') + ' &euro;',
         (fin + 60).toFixed(2).replace('.', ',') + ' &euro;'],
        cap + ' &times; 1,0' + tasso + '<sup>' + anni + '</sup> = ' + fin.toFixed(2) + ' &euro;.');
    },

    // probabilita'
    function () {
      var tipo = P([
        { t: 'Lanciando due dadi, qual &egrave; la probabilit&agrave; che la somma faccia 7?', r: '1/6', w: ['1/12', '7/36', '1/9'], e: 'Ci sono 6 combinazioni favorevoli su 36 totali: 6/36 = 1/6.' },
        { t: 'Da un mazzo di 52 carte, qual &egrave; la probabilit&agrave; di pescare un asso?', r: '1/13', w: ['1/52', '4/52 diverso da 1/13', '1/4'], e: '4 assi su 52 carte: 4/52 = 1/13.' },
        { t: 'Lanciando 3 monete, qual &egrave; la probabilit&agrave; di ottenere 3 teste?', r: '1/8', w: ['1/3', '1/6', '3/8'], e: 'Ogni lancio ha probabilit&agrave; 1/2: (1/2)&sup3; = 1/8.' },
        { t: 'Lanciando un dado, qual &egrave; la probabilit&agrave; di ottenere un numero pari maggiore di 2?', r: '1/3', w: ['1/2', '1/6', '2/3'], e: 'I casi favorevoli sono 4 e 6: 2 su 6 = 1/3.' }
      ]);
      return q(tipo.t, tipo.r, tipo.w, tipo.e);
    },

    // sistema / equazione a due incognite
    function () {
      var x = R(2, 12), y = R(2, 12);
      var s = x + y, d = x - y;
      return q('Due numeri hanno somma ' + s + ' e differenza ' + d + '. Qual &egrave; il pi&ugrave; grande?',
        Math.max(x, y), N(Math.max(x, y), 5),
        'Numero maggiore = (somma + differenza) / 2 = (' + s + ' + ' + Math.abs(d) + ') / 2 = ' + Math.max(x, y) + '.');
    },

    // calcolo mentale veloce
    function () {
      var a = R(11, 39), b = R(11, 39);
      return q('Calcolo rapido: ' + a + ' &times; ' + b + ' = ?', a * b, N(a * b, 60),
        a + ' &times; ' + b + ' = ' + a + ' &times; ' + (b - b % 10) + ' + ' + a + ' &times; ' + (b % 10) +
        ' = ' + (a * (b - b % 10)) + ' + ' + (a * (b % 10)) + ' = ' + (a * b) + '.');
    },

    // successione
    function () {
      var start = R(2, 6), ratio = P([2, 3]);
      var seq = [start], i;
      for (i = 1; i < 5; i++) seq.push(seq[i - 1] * ratio);
      var next = seq[4] * ratio;
      return q('Completa la successione: ' + seq.join(', ') + ', ?', next,
        [seq[4] + ratio, next + start, seq[4] * 2 + 1],
        'Ogni termine &egrave; il precedente moltiplicato per ' + ratio + '.');
    },

    // geometria solida
    function () {
      var r = R(2, 8), h = R(4, 15);
      var v = Math.round(3.14 * r * r * h * 10) / 10;
      return q('Un cilindro ha raggio di base ' + r + ' cm e altezza ' + h + ' cm. Qual &egrave; il volume? (&pi; = 3,14)',
        v.toString().replace('.', ',') + ' cm&sup3;',
        [(3.14 * r * h).toFixed(1).replace('.', ',') + ' cm&sup3;', (2 * 3.14 * r * h).toFixed(1).replace('.', ',') + ' cm&sup3;',
         (v + 50).toFixed(1).replace('.', ',') + ' cm&sup3;'],
        'V = &pi; &times; r&sup2; &times; h = 3,14 &times; ' + (r * r) + ' &times; ' + h + ' = ' + v + ' cm&sup3;.');
    },

    // percentuale di variazione
    function () {
      var v1 = R(20, 90) * 10, v2 = v1 + v1 * P([10, 20, 25, 50]) / 100;
      var perc = Math.round((v2 - v1) / v1 * 100);
      return q('Un valore passa da ' + v1 + ' a ' + v2 + '. Di quanto &egrave; aumentato in percentuale?',
        perc + '%', [(v2 - v1) + '%', (perc + 10) + '%', Math.round(v2 / v1) + '%'],
        'Variazione = (' + v2 + ' - ' + v1 + ') / ' + v1 + ' &times; 100 = ' + perc + '%.');
    },

    // media ponderata
    function () {
      var voti = [R(4, 9), R(4, 9), R(4, 9), R(4, 9)];
      var somma = voti.reduce(function (a, b) { return a + b; }, 0);
      var media = Math.round(somma / 4 * 100) / 100;
      return q('I voti sono ' + voti.join(', ') + '. Qual &egrave; la media?',
        media.toString().replace('.', ','),
        [(media + 0.5).toFixed(2).replace('.', ','), somma.toString(), (media - 0.75).toFixed(2).replace('.', ',')],
        'Somma ' + somma + ' diviso 4 = ' + media + '.');
    },

    // problema di velocita'
    function () {
      var v = P([60, 80, 90, 100, 120]), t = P([1.5, 2, 2.5, 3]);
      var d = v * t;
      return q('Un\'auto viaggia a ' + v + ' km/h per ' + t.toString().replace('.', ',') +
        ' ore. Quanti km percorre?', d + ' km', [(v + t) + ' km', (v / t) + ' km', (d + 40) + ' km'],
        'Spazio = velocit&agrave; &times; tempo = ' + v + ' &times; ' + t + ' = ' + d + ' km.');
    }
  ];

  BT.MATH = { elem5: elem5, media2: media2, adulti: adulti };

})(window.BT);
