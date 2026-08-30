/* =========================================================
   BRAIN TIME — LINGUE STRANIERE
   Inglese, Tedesco, Spagnolo, Portoghese, Francese
   Tre livelli: 5a elementare, 2a media, adulti.
   Formato riga: [domanda, giusta, sbagliata, sbagliata, sbagliata, spiegazione]
   ========================================================= */
(function (BT) {
  'use strict';

  var TAG = {
    en: '🇬🇧 Inglese',
    de: '🇩🇪 Tedesco',
    es: '🇪🇸 Spagnolo',
    pt: '🇵🇹 Portoghese',
    fr: '🇫🇷 Francese'
  };

  /* ================= 5a ELEMENTARE ================= */
  var elem5 = {
    en: [
      ['Come si dice <b>cane</b> in inglese?', 'Dog', 'Cat', 'Horse', 'Bird', '"Dog" = cane. "Cat" = gatto.'],
      ['Che colore &egrave; <b>yellow</b>?', 'Giallo', 'Verde', 'Blu', 'Rosso', '"Yellow" = giallo.'],
      ['Come si dice <b>grazie</b> in inglese?', 'Thank you', 'Please', 'Sorry', 'Goodbye', '"Please" = per favore, "Sorry" = scusa.'],
      ['Quanto fa <b>seven</b>?', '7', '6', '9', '11', '"Seven" &egrave; il numero 7.'],
      ['Come si dice <b>scuola</b>?', 'School', 'House', 'Street', 'Garden', '"School" = scuola.'],
      ['Cosa significa <b>I am happy</b>?', 'Sono felice', 'Ho fame', 'Sono stanco', 'Sono triste', '"Happy" = felice.'],
      ['Qual &egrave; il plurale di <b>book</b>?', 'Books', 'Bookes', 'Bookies', 'Booken', 'In inglese di solito si aggiunge -s.'],
      ['Come si dice <b>mamma</b>?', 'Mother', 'Sister', 'Daughter', 'Aunt', '"Mother" = madre, "Sister" = sorella.'],
      ['Cosa significa <b>Good morning</b>?', 'Buongiorno', 'Buonanotte', 'Arrivederci', 'Buon appetito', 'Si usa al mattino.'],
      ['Come si dice <b>rosso</b>?', 'Red', 'Blue', 'Green', 'Black', '"Red" = rosso.'],
      ['Cosa significa <b>Where are you?</b>', 'Dove sei?', 'Chi sei?', 'Come stai?', 'Quando vieni?', '"Where" = dove.'],
      ['Come si dice <b>acqua</b>?', 'Water', 'Milk', 'Bread', 'Juice', '"Water" = acqua.']
    ],
    de: [
      ['Come si dice <b>gatto</b> in tedesco?', 'Die Katze', 'Der Hund', 'Das Pferd', 'Der Vogel', '"Katze" = gatto, "Hund" = cane.'],
      ['Cosa significa <b>Danke</b>?', 'Grazie', 'Per favore', 'Scusa', 'Ciao', '"Bitte" = per favore.'],
      ['Che colore &egrave; <b>blau</b>?', 'Blu', 'Bianco', 'Nero', 'Verde', '"Blau" = blu.'],
      ['Quanto fa <b>drei</b>?', '3', '2', '4', '10', '"Drei" &egrave; il numero 3.'],
      ['Come si dice <b>casa</b>?', 'Das Haus', 'Die Schule', 'Der Baum', 'Die Stadt', '"Haus" = casa.'],
      ['Cosa significa <b>Guten Tag</b>?', 'Buongiorno', 'Buonanotte', 'A domani', 'Buon appetito', 'Saluto formale di giorno.'],
      ['Come si dice <b>libro</b>?', 'Das Buch', 'Der Tisch', 'Die T&uuml;r', 'Das Fenster', '"Buch" = libro, "Tisch" = tavolo.'],
      ['Cosa significa <b>Ich bin</b>?', 'Io sono', 'Tu sei', 'Lui &egrave;', 'Noi siamo', '"Ich" = io, "bin" = sono.'],
      ['Come si dice <b>amico</b>?', 'Der Freund', 'Der Bruder', 'Der Lehrer', 'Der Vater', '"Freund" = amico, "Bruder" = fratello.'],
      ['Che colore &egrave; <b>rot</b>?', 'Rosso', 'Giallo', 'Verde', 'Grigio', '"Rot" = rosso.'],
      ['Cosa significa <b>Wie hei&szlig;t du?</b>', 'Come ti chiami?', 'Quanti anni hai?', 'Dove abiti?', 'Come stai?', '"Hei&szlig;en" = chiamarsi.'],
      ['Quanto fa <b>zehn</b>?', '10', '7', '9', '12', '"Zehn" &egrave; il numero 10.']
    ],
    es: [
      ['Come si dice <b>cane</b> in spagnolo?', 'El perro', 'El gato', 'El caballo', 'El p&aacute;jaro', '"Perro" = cane, "gato" = gatto.'],
      ['Cosa significa <b>Gracias</b>?', 'Grazie', 'Prego', 'Scusa', 'Ciao', '"Por favor" = per favore.'],
      ['Che colore &egrave; <b>verde</b>?', 'Verde', 'Blu', 'Rosso', 'Giallo', 'In spagnolo si scrive come in italiano.'],
      ['Quanto fa <b>cinco</b>?', '5', '4', '6', '15', '"Cinco" &egrave; il numero 5.'],
      ['Come si dice <b>scuola</b>?', 'La escuela', 'La casa', 'La calle', 'La tienda', '"Escuela" = scuola, "casa" = casa.'],
      ['Cosa significa <b>Buenos d&iacute;as</b>?', 'Buongiorno', 'Buonanotte', 'Arrivederci', 'Buon appetito', 'Saluto del mattino.'],
      ['Come si dice <b>acqua</b>?', 'El agua', 'La leche', 'El pan', 'El zumo', '"Agua" = acqua, "leche" = latte.'],
      ['Cosa significa <b>&iquest;C&oacute;mo est&aacute;s?</b>', 'Come stai?', 'Dove sei?', 'Chi sei?', 'Quanti anni hai?', '"C&oacute;mo" = come.'],
      ['Come si dice <b>amico</b>?', 'El amigo', 'El hermano', 'El maestro', 'El abuelo', '"Amigo" = amico, "hermano" = fratello.'],
      ['Che colore &egrave; <b>negro</b>?', 'Nero', 'Bianco', 'Marrone', 'Grigio', '"Negro" = nero, "blanco" = bianco.'],
      ['Cosa significa <b>Me llamo Diego</b>?', 'Mi chiamo Diego', 'Conosco Diego', 'Cerco Diego', 'Sono con Diego', '"Llamarse" = chiamarsi.'],
      ['Come si dice <b>libro</b>?', 'El libro', 'La mesa', 'La puerta', 'La ventana', '"Libro" = libro, "mesa" = tavolo.']
    ],
    pt: [
      ['Come si dice <b>gatto</b> in portoghese?', 'O gato', 'O c&atilde;o', 'O cavalo', 'O p&aacute;ssaro', '"Gato" = gatto, "c&atilde;o" = cane.'],
      ['Cosa significa <b>Obrigado</b>?', 'Grazie', 'Per favore', 'Scusa', 'Ciao', 'Le donne dicono "obrigada".'],
      ['Che colore &egrave; <b>azul</b>?', 'Blu', 'Verde', 'Rosso', 'Giallo', '"Azul" = blu.'],
      ['Quanto fa <b>quatro</b>?', '4', '3', '5', '14', '"Quatro" &egrave; il numero 4.'],
      ['Come si dice <b>casa</b>?', 'A casa', 'A escola', 'A rua', 'A loja', 'In portoghese si dice come in italiano.'],
      ['Cosa significa <b>Bom dia</b>?', 'Buongiorno', 'Buonanotte', 'Arrivederci', 'Buon appetito', '"Boa noite" = buonanotte.'],
      ['Come si dice <b>acqua</b>?', 'A &aacute;gua', 'O leite', 'O p&atilde;o', 'O sumo', '"&Aacute;gua" = acqua.'],
      ['Cosa significa <b>Como est&aacute;s?</b>', 'Come stai?', 'Dove sei?', 'Chi sei?', 'Quando vieni?', '"Como" = come.'],
      ['Come si dice <b>amico</b>?', 'O amigo', 'O irm&atilde;o', 'O professor', 'O av&ocirc;', '"Amigo" = amico, "irm&atilde;o" = fratello.'],
      ['Che colore &egrave; <b>branco</b>?', 'Bianco', 'Nero', 'Marrone', 'Grigio', '"Branco" = bianco, "preto" = nero.'],
      ['Cosa significa <b>Eu tenho dez anos</b>?', 'Ho dieci anni', 'Ho dieci fratelli', 'Sono le dieci', 'Costa dieci euro', '"Ter" = avere, "anos" = anni.'],
      ['Come si dice <b>libro</b>?', 'O livro', 'A mesa', 'A porta', 'A janela', '"Livro" = libro.']
    ],
    fr: [
      ['Come si dice <b>cane</b> in francese?', 'Le chien', 'Le chat', 'Le cheval', 'L\'oiseau', '"Chien" = cane, "chat" = gatto.'],
      ['Cosa significa <b>Merci</b>?', 'Grazie', 'Per favore', 'Scusa', 'Ciao', '"S\'il vous pla&icirc;t" = per favore.'],
      ['Che colore &egrave; <b>rouge</b>?', 'Rosso', 'Verde', 'Blu', 'Giallo', '"Rouge" = rosso.'],
      ['Quanto fa <b>huit</b>?', '8', '6', '9', '18', '"Huit" &egrave; il numero 8.'],
      ['Come si dice <b>scuola</b>?', 'L\'&eacute;cole', 'La maison', 'La rue', 'Le magasin', '"&Eacute;cole" = scuola, "maison" = casa.'],
      ['Cosa significa <b>Bonjour</b>?', 'Buongiorno', 'Buonanotte', 'Arrivederci', 'Buon appetito', '"Bonne nuit" = buonanotte.'],
      ['Come si dice <b>acqua</b>?', 'L\'eau', 'Le lait', 'Le pain', 'Le jus', '"Eau" = acqua, "lait" = latte.'],
      ['Cosa significa <b>Comment &ccedil;a va?</b>', 'Come va?', 'Dove vai?', 'Chi sei?', 'Che ore sono?', 'Espressione per chiedere come stai.'],
      ['Come si dice <b>amico</b>?', 'L\'ami', 'Le fr&egrave;re', 'Le ma&icirc;tre', 'Le p&egrave;re', '"Ami" = amico, "fr&egrave;re" = fratello.'],
      ['Che colore &egrave; <b>noir</b>?', 'Nero', 'Bianco', 'Grigio', 'Marrone', '"Noir" = nero, "blanc" = bianco.'],
      ['Cosa significa <b>Je m\'appelle Gabriele</b>?', 'Mi chiamo Gabriele', 'Chiamo Gabriele', 'Cerco Gabriele', 'Sono da Gabriele', '"S\'appeler" = chiamarsi.'],
      ['Come si dice <b>libro</b>?', 'Le livre', 'La table', 'La porte', 'La fen&ecirc;tre', '"Livre" = libro, "table" = tavolo.']
    ]
  };

  /* ================= 2a MEDIA ================= */
  var media2 = {
    en: [
      ['Qual &egrave; il passato di <b>to go</b>?', 'Went', 'Goed', 'Gone', 'Going', '"Go" &egrave; irregolare: go / went / gone.'],
      ['Completa: <b>She ___ to school every day.</b>', 'goes', 'go', 'going', 'gone', 'Terza persona singolare al present simple: +es.'],
      ['Cosa significa <b>I have been waiting for an hour</b>?', 'Sto aspettando da un\'ora', 'Ho aspettato ieri', 'Aspetter&ograve; un\'ora', 'Ho atteso un\'ora fa', 'Present perfect continuous: azione iniziata nel passato e ancora in corso.'],
      ['Qual &egrave; il comparativo di <b>good</b>?', 'Better', 'Gooder', 'More good', 'Best', 'Comparativo irregolare: good / better / best.'],
      ['Completa: <b>There ___ many books on the table.</b>', 'are', 'is', 'be', 'has', '"Books" &egrave; plurale, quindi "there are".'],
      ['Cosa significa <b>Actually</b>?', 'In realt&agrave;', 'Attualmente', 'Adesso', 'Di solito', 'Falso amico: "attualmente" si dice "currently".'],
      ['Completa: <b>If it rains, I ___ at home.</b>', 'will stay', 'stayed', 'would stay', 'stay would', 'Periodo ipotetico di primo tipo: if + present, will + base form.'],
      ['Qual &egrave; il plurale di <b>child</b>?', 'Children', 'Childs', 'Childrens', 'Childes', 'Plurale irregolare.'],
      ['Cosa significa <b>Can I borrow your pen?</b>', 'Posso prendere in prestito la tua penna?', 'Posso prestarti una penna?', 'Vuoi la mia penna?', 'Hai perso la penna?', '"To borrow" = prendere in prestito; "to lend" = prestare.'],
      ['Completa: <b>He is taller ___ me.</b>', 'than', 'that', 'then', 'as', 'Nel comparativo di maggioranza si usa "than".'],
      ['Cosa significa <b>She used to play tennis</b>?', 'Un tempo giocava a tennis', 'Sta giocando a tennis', 'Ha usato una racchetta', 'Giocher&agrave; a tennis', '"Used to" indica un\'abitudine passata.'],
      ['Qual &egrave; il participio passato di <b>to write</b>?', 'Written', 'Wrote', 'Writed', 'Writing', 'write / wrote / written.']
    ],
    de: [
      ['Qual &egrave; l\'articolo corretto: <b>___ M&auml;dchen</b> (la ragazza)?', 'Das', 'Die', 'Der', 'Den', '"M&auml;dchen" &egrave; neutro, perch&eacute; finisce in -chen.'],
      ['Completa: <b>Ich ___ nach Hause.</b> (io vado a casa)', 'gehe', 'gehst', 'geht', 'gehen', 'Prima persona singolare: ich gehe.'],
      ['Cosa significa <b>Ich habe Hunger</b>?', 'Ho fame', 'Ho sete', 'Ho freddo', 'Ho paura', '"Hunger" = fame, "Durst" = sete.'],
      ['Qual &egrave; il plurale di <b>das Buch</b>?', 'Die B&uuml;cher', 'Die Buchs', 'Die Buchen', 'Die B&uuml;che', 'Plurale con Umlaut e desinenza -er.'],
      ['Completa: <b>Wir ___ Deutsch.</b> (noi impariamo)', 'lernen', 'lernt', 'lernst', 'lerne', '"Wir" vuole la desinenza -en.'],
      ['Cosa significa <b>Wie sp&auml;t ist es?</b>', 'Che ore sono?', 'Quanto costa?', 'Dove sei?', 'Quanti anni hai?', 'Letteralmente "quanto &egrave; tardi".'],
      ['Quale preposizione regge il dativo?', 'Mit', 'F&uuml;r', 'Ohne', 'Durch', '"Mit" regge sempre il dativo; le altre reggono l\'accusativo.'],
      ['Cosa significa <b>Ich m&ouml;chte einen Kaffee</b>?', 'Vorrei un caff&egrave;', 'Non bevo caff&egrave;', 'Ho preso un caff&egrave;', 'Il caff&egrave; &egrave; caldo', '"M&ouml;chte" = vorrei.'],
      ['Completa: <b>Er ___ ein Auto.</b> (lui ha)', 'hat', 'habe', 'hast', 'haben', 'Er/sie/es hat.'],
      ['Cosa significa <b>gestern</b>?', 'Ieri', 'Oggi', 'Domani', 'Stasera', '"Heute" = oggi, "morgen" = domani.'],
      ['Come si dice <b>Mi piace il calcio</b>?', 'Ich mag Fu&szlig;ball', 'Ich bin Fu&szlig;ball', 'Ich habe Fu&szlig;ball', 'Ich spiele gern', '"M&ouml;gen" = piacere, apprezzare.'],
      ['Qual &egrave; il participio passato di <b>machen</b>?', 'Gemacht', 'Machte', 'Gemachen', 'Machen', 'Verbo debole: ge- + radice + -t.']
    ],
    es: [
      ['Completa: <b>Yo ___ espa&ntilde;ol.</b> (io parlo)', 'hablo', 'hablas', 'habla', 'hablamos', 'Prima persona: -o.'],
      ['Cosa significa <b>Tengo que estudiar</b>?', 'Devo studiare', 'Voglio studiare', 'Sto studiando', 'Ho studiato', '"Tener que" = dovere.'],
      ['Qual &egrave; la differenza fra <b>ser</b> e <b>estar</b>?', '"Ser" indica caratteristiche permanenti, "estar" stati temporanei', 'Sono identici', '"Ser" &egrave; passato, "estar" presente', '"Ser" per le cose, "estar" per le persone', 'Es: soy alto (sempre) / estoy cansado (adesso).'],
      ['Cosa significa <b>Ma&ntilde;ana</b>?', 'Domani (o mattina)', 'Ieri', 'Adesso', 'Notte', 'Vale sia "domani" sia "mattina".'],
      ['Completa: <b>Nosotros ___ al cine.</b> (noi andiamo)', 'vamos', 'voy', 'vais', 'van', 'Verbo "ir": voy, vas, va, vamos, vais, van.'],
      ['Cosa significa <b>Est&aacute; lloviendo</b>?', 'Sta piovendo', 'Ha piovuto', 'Piover&agrave;', 'Non piove', 'Gerundio: estar + -iendo.'],
      ['Qual &egrave; il passato di <b>comer</b> (io mangiai)?', 'Com&iacute;', 'Como', 'Comer&eacute;', 'Comiendo', 'Preterito indefinido, prima persona: com&iacute;.'],
      ['Attenzione al falso amico: <b>burro</b> in spagnolo significa...', 'Asino', 'Burro', 'Formaggio', 'Pane', 'Il burro si dice "mantequilla".'],
      ['Cosa significa <b>&iquest;Cu&aacute;nto cuesta?</b>', 'Quanto costa?', 'Quanti sono?', 'Dove si compra?', 'Che cos\'&egrave;?', '"Costar" = costare.'],
      ['Completa: <b>Ella ___ muy simp&aacute;tica.</b>', 'es', 'est&aacute;', 'ser', 'son', 'Caratteristica stabile: si usa "ser".'],
      ['Cosa significa <b>Hace calor</b>?', 'Fa caldo', 'Ho caldo', 'Fa freddo', '&Egrave; caldo il piatto', 'Espressione meteo con "hacer".'],
      ['Qual &egrave; il plurale di <b>el l&aacute;piz</b>?', 'Los l&aacute;pices', 'Los l&aacute;pizs', 'Los l&aacute;pizes', 'Los lapices', 'La z diventa c davanti a -es.']
    ],
    pt: [
      ['Completa: <b>Eu ___ portugu&ecirc;s.</b> (io parlo)', 'falo', 'falas', 'fala', 'falamos', 'Prima persona: -o.'],
      ['Cosa significa <b>Tenho que estudar</b>?', 'Devo studiare', 'Voglio studiare', 'Sto studiando', 'Ho studiato', '"Ter que" = dovere.'],
      ['Cosa significa <b>Amanh&atilde;</b>?', 'Domani', 'Ieri', 'Stamattina', 'Stasera', '"Ontem" = ieri, "hoje" = oggi.'],
      ['Completa: <b>N&oacute;s ___ ao cinema.</b> (noi andiamo)', 'vamos', 'vou', 'vais', 'v&atilde;o', 'Verbo "ir": vou, vais, vai, vamos, ides, v&atilde;o.'],
      ['Cosa significa <b>Est&aacute; a chover</b>? (portoghese europeo)', 'Sta piovendo', 'Ha piovuto', 'Piover&agrave;', 'C\'&egrave; il sole', 'In Brasile si dice "est&aacute; chovendo".'],
      ['Attenzione al falso amico: <b>esquisito</b> in portoghese significa...', 'Strano, bizzarro', 'Squisito', 'Elegante', 'Delizioso', 'Per "squisito" si dice "delicioso".'],
      ['Cosa significa <b>Quanto custa?</b>', 'Quanto costa?', 'Quanti sono?', 'Dove si trova?', 'Che cos\'&egrave;?', '"Custar" = costare.'],
      ['Qual &egrave; il plurale di <b>o animal</b>?', 'Os animais', 'Os animales', 'Os animals', 'Os animaus', 'Le parole in -al fanno il plurale in -ais.'],
      ['Cosa significa <b>Faz frio</b>?', 'Fa freddo', 'Ho freddo', 'Fa caldo', '&Egrave; freddo il piatto', 'Espressione meteo con "fazer".'],
      ['Completa: <b>Ela ___ muito simp&aacute;tica.</b>', '&eacute;', 'est&aacute;', 'ser', 's&atilde;o', 'Caratteristica stabile: verbo "ser".'],
      ['Cosa significa <b>Onde fica a esta&ccedil;&atilde;o?</b>', 'Dove si trova la stazione?', 'Quando parte il treno?', 'Quanto dista?', 'Come si arriva a casa?', '"Ficar" indica anche trovarsi.'],
      ['Qual &egrave; il participio passato di <b>fazer</b>?', 'Feito', 'Fazido', 'Fazeu', 'Fez', 'Participio irregolare: feito.']
    ],
    fr: [
      ['Completa: <b>Je ___ &agrave; l\'&eacute;cole.</b> (io vado)', 'vais', 'vas', 'va', 'allons', 'Verbo "aller": je vais, tu vas, il va.'],
      ['Qual &egrave; il femminile di <b>beau</b>?', 'Belle', 'Beaue', 'Beau', 'Bel', 'beau / belle.'],
      ['Cosa significa <b>J\'ai faim</b>?', 'Ho fame', 'Ho sete', 'Ho freddo', 'Ho paura', '"Faim" = fame, "soif" = sete.'],
      ['Completa il passato prossimo: <b>Il ___ mang&eacute;.</b>', 'a', 'est', 'ont', 'as', 'Con "manger" si usa l\'ausiliare "avoir": il a mang&eacute;.'],
      ['Cosa significa <b>Il fait froid</b>?', 'Fa freddo', 'Ho freddo', 'Fa caldo', '&Egrave; freddo il piatto', 'Espressione meteo con "faire".'],
      ['Qual &egrave; il plurale di <b>le journal</b>?', 'Les journaux', 'Les journals', 'Les journales', 'Les journeaux', 'Le parole in -al fanno il plurale in -aux.'],
      ['Cosa significa <b>Je voudrais un caf&eacute;</b>?', 'Vorrei un caff&egrave;', 'Bevo un caff&egrave;', 'Ho bevuto un caff&egrave;', 'Il caff&egrave; &egrave; buono', 'Condizionale di cortesia.'],
      ['Completa: <b>Nous ___ fran&ccedil;ais.</b> (noi parliamo)', 'parlons', 'parlez', 'parlent', 'parle', 'Prima persona plurale: -ons.'],
      ['Cosa significa <b>Combien &ccedil;a co&ucirc;te?</b>', 'Quanto costa?', 'Quanti sono?', 'Dove si compra?', 'Com\'&egrave;?', '"Combien" = quanto.'],
      ['Attenzione al falso amico: <b>librairie</b> in francese &egrave;...', 'La libreria (negozio di libri)', 'La biblioteca', 'Il libro', 'Lo scaffale', 'La biblioteca si dice "biblioth&egrave;que".'],
      ['Cosa significa <b>Hier</b>?', 'Ieri', 'Oggi', 'Domani', 'Stasera', '"Aujourd\'hui" = oggi, "demain" = domani.'],
      ['Completa: <b>Elle est plus grande ___ moi.</b>', 'que', 'de', 'comme', 'ainsi', 'Comparativo: plus... que.']
    ]
  };

  /* ================= ADULTI ================= */
  var adulti = {
    en: [
      ['Cosa significa il modo di dire <b>to bite the bullet</b>?', 'Farsi coraggio e affrontare qualcosa di spiacevole', 'Mordersi la lingua', 'Sparare a zero su qualcuno', 'Perdere la pazienza', 'Significa accettare una situazione dura senza lamentarsi.'],
      ['Completa: <b>If I ___ more time, I would travel more.</b>', 'had', 'have', 'would have', 'will have', 'Periodo ipotetico di secondo tipo: if + past simple.'],
      ['Cosa significa <b>eventually</b>?', 'Alla fine, prima o poi', 'Eventualmente', 'Forse', 'Immediatamente', 'Falso amico: "eventualmente" si dice "possibly".'],
      ['Qual &egrave; il significato di <b>to look forward to</b>?', 'Non vedere l\'ora di', 'Guardare avanti a s&eacute;', 'Rimandare', 'Prevedere il futuro', 'Regge sempre il gerundio: I look forward to hearing from you.'],
      ['Completa: <b>By the time we arrived, the film ___.</b>', 'had already started', 'has already started', 'already started', 'was already start', 'Past perfect per un\'azione anteriore a un\'altra passata.'],
      ['Cosa significa <b>a red herring</b>?', 'Una falsa pista', 'Un pesce raro', 'Un errore evidente', 'Un buon affare', 'Espressione usata anche nei gialli.'],
      ['Qual &egrave; l\'uso corretto?', 'I suggest that he go to the doctor', 'I suggest him to go to the doctor', 'I suggest he goes to doctor', 'I suggest to go him', 'Dopo "suggest that" si usa il congiuntivo (forma base).'],
      ['Cosa significa <b>to get the hang of something</b>?', 'Prenderci la mano', 'Appendere qualcosa', 'Abbandonare', 'Restare bloccati', 'Si usa per abilit&agrave; acquisite con la pratica.'],
      ['Completa: <b>She is used ___ early.</b>', 'to getting up', 'to get up', 'get up', 'getting up', '"Be used to" + gerundio = essere abituato a.'],
      ['Cosa significa <b>the bottom line</b>?', 'Il punto essenziale, il risultato finale', 'L\'ultima riga di un testo', 'Il livello pi&ugrave; basso', 'Il confine', 'Deriva dal linguaggio contabile.'],
      ['Qual &egrave; il significato di <b>notwithstanding</b>?', 'Nonostante', 'Non appena', 'Sebbene sia in piedi', 'Senza dubbio', 'Registro formale, sinonimo di "despite".'],
      ['Cosa significa <b>to cut corners</b>?', 'Fare le cose in fretta risparmiando su qualit&agrave; o regole', 'Tagliare gli angoli di un foglio', 'Prendere una scorciatoia in auto', 'Ridurre le spese in modo virtuoso', 'Ha una connotazione negativa.']
    ],
    de: [
      ['Quale caso regge la preposizione <b>wegen</b> nel tedesco standard?', 'Genitivo', 'Dativo', 'Accusativo', 'Nominativo', 'Wegen des Wetters (nel parlato si sente anche il dativo).'],
      ['Cosa significa <b>Das ist mir Wurst</b>?', 'Non me ne importa nulla', '&Egrave; la mia salsiccia', 'Ho fame', '&Egrave; troppo grasso', 'Modo di dire colloquiale.'],
      ['Completa: <b>Ich freue mich ___ das Wochenende.</b>', 'auf', 'an', 'f&uuml;r', '&uuml;ber', '"Sich freuen auf" = non vedere l\'ora (futuro); "&uuml;ber" per qualcosa di gi&agrave; avvenuto.'],
      ['Qual &egrave; il Konjunktiv II di <b>haben</b> (io avrei)?', 'Ich h&auml;tte', 'Ich habe', 'Ich hatte', 'Ich haben w&uuml;rde', 'Konjunktiv II: h&auml;tte.'],
      ['Cosa indica il verbo separabile <b>aufstehen</b>?', 'Alzarsi', 'Stare in piedi', 'Fermarsi', 'Salire', 'Ich stehe um sieben auf.'],
      ['Completa: <b>Wenn ich Zeit ___, w&uuml;rde ich kommen.</b>', 'h&auml;tte', 'habe', 'hatte', 'haben', 'Periodo ipotetico irreale: Konjunktiv II.'],
      ['Cosa significa <b>Die Daumen dr&uuml;cken</b>?', 'Fare gli auguri, incrociare le dita', 'Premere un pulsante', 'Stringere la mano', 'Perdere tempo', 'In tedesco si "premono i pollici" invece di incrociare le dita.'],
      ['Quale ordine &egrave; corretto in una frase secondaria con <b>weil</b>?', 'Ich bleibe zu Hause, weil ich krank bin', 'Ich bleibe zu Hause, weil ich bin krank', 'Weil ich bin krank, ich bleibe zu Hause', 'Ich bleibe, weil krank ich bin', 'Nella secondaria il verbo va in fondo.'],
      ['Cosa significa <b>der Feierabend</b>?', 'La fine della giornata lavorativa', 'La sera di festa', 'Il fine settimana', 'La vigilia', 'Non &egrave; una festa: &egrave; il momento in cui si stacca dal lavoro.'],
      ['Qual &egrave; il genitivo di <b>der Mann</b>?', 'Des Mannes', 'Dem Mann', 'Den Mann', 'Der Mann', 'Maschile singolare al genitivo: des + -es.'],
      ['Cosa significa <b>&uuml;bermorgen</b>?', 'Dopodomani', 'Domattina', 'L\'altro ieri', 'Stanotte', '"Vorgestern" = l\'altro ieri.'],
      ['Completa: <b>Er arbeitet, ___ er m&uuml;de ist.</b> (bench&eacute; sia stanco)', 'obwohl', 'weil', 'denn', 'dass', '"Obwohl" = bench&eacute;, nonostante.']
    ],
    es: [
      ['Cosa significa <b>Estar en las nubes</b>?', 'Essere distratto, con la testa fra le nuvole', 'Essere felice', 'Volare in aereo', 'Essere confuso dalla nebbia', 'Modo di dire molto comune.'],
      ['Completa il congiuntivo: <b>Espero que ___ bien.</b>', 'est&eacute;s', 'est&aacute;s', 'estar&aacute;s', 'estabas', 'Dopo "esperar que" si usa il subjuntivo.'],
      ['Qual &egrave; la differenza fra <b>por</b> e <b>para</b>?', '"Por" indica causa o mezzo, "para" scopo o destinazione', 'Sono equivalenti', '"Por" &egrave; formale, "para" informale', '"Por" per le persone, "para" per le cose', 'Gracias por todo / Este regalo es para ti.'],
      ['Cosa significa <b>Ponerse las pilas</b>?', 'Darsi una mossa, impegnarsi', 'Cambiare le batterie', 'Arrabbiarsi', 'Andarsene', 'Espressione colloquiale.'],
      ['Qual &egrave; il preterito indefinido di <b>hacer</b> (io feci)?', 'Hice', 'Hac&iacute;a', 'Har&eacute;', 'Hecho', 'Verbo irregolare: hice, hiciste, hizo.'],
      ['Cosa significa <b>Llevo dos a&ntilde;os trabajando aqu&iacute;</b>?', 'Lavoro qui da due anni', 'Ho lavorato qui due anni fa', 'Lavorer&ograve; qui per due anni', 'Ho portato via due anni di lavoro', '"Llevar + gerundio" indica durata.'],
      ['Falso amico: <b>embarazada</b> significa...', 'Incinta', 'Imbarazzata', 'Bloccata', 'Confusa', 'Per "imbarazzata" si dice "avergonzada".'],
      ['Completa: <b>Si tuviera dinero, ___ un coche.</b>', 'comprar&iacute;a', 'compro', 'comprar&eacute;', 'comprara', 'Periodo ipotetico irreale: imperfetto congiuntivo + condizionale.'],
      ['Cosa significa <b>Echar de menos</b>?', 'Sentire la mancanza di qualcuno', 'Buttare via', 'Sottrarre', 'Diminuire', 'Sinonimo di "extra&ntilde;ar".'],
      ['Qual &egrave; l\'imperativo negativo di <b>hablar</b> (tu)?', 'No hables', 'No hablas', 'No habla', 'No hablar', 'Al negativo si usa il subjuntivo.'],
      ['Cosa significa <b>De golpe</b>?', 'Improvvisamente', 'Con violenza', 'Di seguito', 'Per sbaglio', 'Sinonimo di "de repente".'],
      ['Qual &egrave; il gerundio di <b>dormir</b>?', 'Durmiendo', 'Dormiendo', 'Dormando', 'Dormido', 'Dittongo irregolare: o diventa u.']
    ],
    pt: [
      ['Cosa significa <b>Ficar de olho</b>?', 'Tenere d\'occhio', 'Restare senza vista', 'Chiudere un occhio', 'Guardare male qualcuno', 'Espressione molto usata in Brasile e Portogallo.'],
      ['Qual &egrave; il futuro do conjuntivo di <b>ser</b> (quando io sar&ograve;)?', 'Quando eu for', 'Quando eu serei', 'Quando eu sou', 'Quando eu seja', 'Il portoghese ha un futuro del congiuntivo, raro nelle altre lingue romanze.'],
      ['Falso amico: <b>propina</b> in portoghese europeo significa...', 'Tassa universitaria', 'Mancia', 'Multa', 'Regalo', 'In Brasile "propina" significa invece tangente.'],
      ['Cosa significa <b>Estou com saudades</b>?', 'Mi manchi / sento nostalgia', 'Sono stanco', 'Sono in ritardo', 'Sto bene', '"Saudade" &egrave; una parola tipicamente portoghese.'],
      ['Completa: <b>Se eu tivesse dinheiro, ___ uma casa.</b>', 'compraria', 'compro', 'comprarei', 'comprasse', 'Ipotetica irreale: imperfetto congiuntivo + condizionale.'],
      ['Cosa significa <b>Dar um jeito</b>?', 'Trovare una soluzione, arrangiarsi', 'Dare un ordine', 'Fare un giro', 'Rinunciare', 'Espressione tipicamente brasiliana.'],
      ['Qual &egrave; il participio irregolare di <b>ver</b>?', 'Visto', 'Vido', 'Vejo', 'Vendo', 'ver / vi / visto.'],
      ['Cosa significa <b>Estar a fim de</b>?', 'Avere voglia di', 'Essere alla fine', 'Essere in fondo', 'Essere contrario', 'Uso colloquiale brasiliano.'],
      ['Completa: <b>Espero que ele ___ bem.</b>', 'esteja', 'est&aacute;', 'estar&aacute;', 'estava', 'Dopo "espero que" si usa il congiuntivo.'],
      ['Cosa significa <b>Puxa vida!</b>?', 'Caspita! Accidenti!', 'Buona vita!', 'Tira forte!', 'Che noia!', 'Esclamazione di sorpresa.'],
      ['Qual &egrave; la differenza fra <b>muito</b> e <b>muitos</b>?', '"Muito" &egrave; invariabile come avverbio, "muitos" concorda come aggettivo plurale', 'Sono identici', '"Muito" &egrave; brasiliano, "muitos" europeo', '"Muitos" si usa solo al femminile', 'Muito obrigado / muitos livros.'],
      ['Cosa significa <b>Vou passar pela sua casa</b>?', 'Passer&ograve; da casa tua', 'Vado a vivere da te', 'Sto uscendo di casa', 'Cerco casa tua', '"Passar por" = passare da.']
    ],
    fr: [
      ['Cosa significa <b>Poser un lapin &agrave; quelqu\'un</b>?', 'Dare buca a qualcuno', 'Regalare un coniglio', 'Fare uno scherzo', 'Chiedere un favore', 'Modo di dire: mancare a un appuntamento.'],
      ['Completa il subjonctif: <b>Il faut que tu ___.</b> (venire)', 'viennes', 'viens', 'viendras', 'venais', 'Dopo "il faut que" si usa il congiuntivo.'],
      ['Qual &egrave; l\'accordo corretto?', 'Les fleurs que j\'ai achet&eacute;es', 'Les fleurs que j\'ai achet&eacute;', 'Les fleurs que j\'ai achet&eacute;s', 'Les fleurs que j\'ai achet&eacute;e', 'Con "avoir" il participio concorda con il complemento oggetto anticipato.'],
      ['Cosa significa <b>&Ccedil;a marche</b>?', 'Va bene, d\'accordo', 'Si cammina', '&Egrave; lontano', 'Non funziona', 'Espressione colloquiale di assenso.'],
      ['Falso amico: <b>actuellement</b> significa...', 'Attualmente', 'In realt&agrave;', 'Effettivamente', 'Finalmente', 'Per "in realt&agrave;" si dice "en fait".'],
      ['Completa: <b>Si j\'avais su, je ne ___ pas venu.</b>', 'serais', 'suis', 'serai', 'aurais', 'Condizionale passato con l\'ausiliare "&ecirc;tre".'],
      ['Cosa significa <b>Avoir le cafard</b>?', 'Essere gi&ugrave; di morale', 'Avere fame', 'Essere di fretta', 'Avere fortuna', 'Letteralmente "avere lo scarafaggio".'],
      ['Qual &egrave; il pronome corretto: <b>Je ___ parle.</b> (a lui)', 'lui', 'le', 'la', 'y', 'Complemento di termine: pronome "lui".'],
      ['Cosa significa <b>Tomber dans les pommes</b>?', 'Svenire', 'Cadere per terra', 'Fare una gaffe', 'Innamorarsi', 'Espressione idiomatica per lo svenimento.'],
      ['Qual &egrave; il plurale di <b>un &oelig;il</b>?', 'Des yeux', 'Des &oelig;ils', 'Des &oelig;ux', 'Des yeuls', 'Plurale completamente irregolare.'],
      ['Cosa significa <b>D\'ailleurs</b>?', 'Del resto, peraltro', 'Altrove', 'Ad esempio', 'Al contrario', 'Connettivo molto usato nello scritto.'],
      ['Completa: <b>Bien qu\'il ___ fatigu&eacute;, il travaille.</b>', 'soit', 'est', 'sera', '&eacute;tait', '"Bien que" regge il subjonctif.']
    ]
  };

  function build(pack) {
    var out = [];
    for (var code in pack) {
      /* jshint loopfunc:true */
      (function (code) {
        pack[code].forEach(function (row) {
          out.push(function () {
            var qq = BT.fromRow(row, 'lang');
            qq.tag = TAG[code];
            return qq;
          });
        });
      })(code);
    }
    return out;
  }

  BT.LANG = {
    elem5: build(elem5),
    media2: build(media2),
    adulti: build(adulti)
  };

})(window.BT);
