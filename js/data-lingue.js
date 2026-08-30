/* =========================================================
   BRAIN TIME — vocabolario e frasi per "Impara una lingua"
   Quattro lingue a partire dall'italiano. Tutto in chiaro:
   per aggiungere parole basta allungare le righe.

   Una riga di PAROLE:  { ico, it, en, fr, de, es }
   Le figure sono emoji, non immagini: si vedono su qualsiasi
   dispositivo, non pesano nulla e non hanno problemi di diritti.

   In tedesco l'articolo fa parte della parola (der/die/das):
   impararla senza articolo non serve a niente.
   ========================================================= */
(function (BT) {
  'use strict';

  /* Le bandiere emoji su Windows diventano due lettere (GB, FR), quindi
     ogni lingua porta anche un'icona che si disegna dappertutto. */
  BT.LINGUE = [
    { id: 'it', nome: 'Italiano', bandiera: '🇮🇹', ico: '🍕', sotto: 'La tua lingua' },
    { id: 'en', nome: 'Inglese',  bandiera: '🇬🇧', ico: '🎩', sotto: 'English' },
    { id: 'fr', nome: 'Francese', bandiera: '🇫🇷', ico: '🥐', sotto: 'Fran&ccedil;ais' },
    { id: 'de', nome: 'Tedesco',  bandiera: '🇩🇪', ico: '🥨', sotto: 'Deutsch' },
    { id: 'es', nome: 'Spagnolo', bandiera: '🇪🇸', ico: '🌶️', sotto: 'Espa&ntilde;ol' },
    { id: 'misto', nome: 'Misto', bandiera: '🎲', ico: '🎲', sotto: 'Una lingua diversa a ogni domanda' }
  ];

  BT.lingua = function (id) {
    for (var i = 0; i < BT.LINGUE.length; i++) if (BT.LINGUE[i].id === id) return BT.LINGUE[i];
    return BT.LINGUE[0];
  };

  /* ---------------- parole con figura ---------------- */
  BT.PAROLE = [
    /* animali */
    { ico: '🐶', it: 'cane',      en: 'dog',      fr: 'chien',    de: 'der Hund',      es: 'perro' },
    { ico: '🐱', it: 'gatto',     en: 'cat',      fr: 'chat',     de: 'die Katze',     es: 'gato' },
    { ico: '🐭', it: 'topo',      en: 'mouse',    fr: 'souris',   de: 'die Maus',      es: 'ratón' },
    { ico: '🐴', it: 'cavallo',   en: 'horse',    fr: 'cheval',   de: 'das Pferd',     es: 'caballo' },
    { ico: '🐦', it: 'uccello',   en: 'bird',     fr: 'oiseau',   de: 'der Vogel',     es: 'pájaro' },
    { ico: '🐟', it: 'pesce',     en: 'fish',     fr: 'poisson',  de: 'der Fisch',     es: 'pez' },
    { ico: '🐝', it: 'ape',       en: 'bee',      fr: 'abeille',  de: 'die Biene',     es: 'abeja' },
    { ico: '🦊', it: 'volpe',     en: 'fox',      fr: 'renard',   de: 'der Fuchs',     es: 'zorro' },
    { ico: '🐻', it: 'orso',      en: 'bear',     fr: 'ours',     de: 'der Bär',       es: 'oso' },
    { ico: '🦁', it: 'leone',     en: 'lion',     fr: 'lion',     de: 'der Löwe',      es: 'león' },
    { ico: '🐘', it: 'elefante',  en: 'elephant', fr: 'éléphant', de: 'der Elefant',   es: 'elefante' },
    { ico: '🐑', it: 'pecora',    en: 'sheep',    fr: 'mouton',   de: 'das Schaf',     es: 'oveja' },

    /* da mangiare */
    { ico: '🍎', it: 'mela',      en: 'apple',    fr: 'pomme',    de: 'der Apfel',     es: 'manzana' },
    { ico: '🍌', it: 'banana',    en: 'banana',   fr: 'banane',   de: 'die Banane',    es: 'plátano' },
    { ico: '🍞', it: 'pane',      en: 'bread',    fr: 'pain',     de: 'das Brot',      es: 'pan' },
    { ico: '🧀', it: 'formaggio', en: 'cheese',   fr: 'fromage',  de: 'der Käse',      es: 'queso' },
    { ico: '🥚', it: 'uovo',      en: 'egg',      fr: 'œuf',      de: 'das Ei',        es: 'huevo' },
    { ico: '🥛', it: 'latte',     en: 'milk',     fr: 'lait',     de: 'die Milch',     es: 'leche' },
    { ico: '💧', it: 'acqua',     en: 'water',    fr: 'eau',      de: 'das Wasser',    es: 'agua' },
    { ico: '🍰', it: 'torta',     en: 'cake',     fr: 'gâteau',   de: 'der Kuchen',    es: 'pastel' },

    /* casa e cose */
    { ico: '🏠', it: 'casa',      en: 'house',    fr: 'maison',   de: 'das Haus',      es: 'casa' },
    { ico: '🏫', it: 'scuola',    en: 'school',   fr: 'école',    de: 'die Schule',    es: 'escuela' },
    { ico: '📖', it: 'libro',     en: 'book',     fr: 'livre',    de: 'das Buch',      es: 'libro' },
    { ico: '✏️', it: 'matita',    en: 'pencil',   fr: 'crayon',   de: 'der Bleistift', es: 'lápiz' },
    { ico: '🪑', it: 'sedia',     en: 'chair',    fr: 'chaise',   de: 'der Stuhl',     es: 'silla' },
    { ico: '🚪', it: 'porta',     en: 'door',     fr: 'porte',    de: 'die Tür',       es: 'puerta' },
    { ico: '🪟', it: 'finestra',  en: 'window',   fr: 'fenêtre',  de: 'das Fenster',   es: 'ventana' },
    { ico: '🛏️', it: 'letto',     en: 'bed',      fr: 'lit',      de: 'das Bett',      es: 'cama' },
    { ico: '🚗', it: 'macchina',  en: 'car',      fr: 'voiture',  de: 'das Auto',      es: 'coche' },
    { ico: '🚲', it: 'bicicletta',en: 'bicycle',  fr: 'vélo',     de: 'das Fahrrad',   es: 'bicicleta' },
    { ico: '⏰', it: 'orologio',  en: 'clock',    fr: 'horloge',  de: 'die Uhr',       es: 'reloj' },
    { ico: '🔑', it: 'chiave',    en: 'key',      fr: 'clé',      de: 'der Schlüssel', es: 'llave' },

    /* fuori */
    { ico: '☀️', it: 'sole',      en: 'sun',      fr: 'soleil',   de: 'die Sonne',     es: 'sol' },
    { ico: '🌙', it: 'luna',      en: 'moon',     fr: 'lune',     de: 'der Mond',      es: 'luna' },
    { ico: '⭐', it: 'stella',    en: 'star',     fr: 'étoile',   de: 'der Stern',     es: 'estrella' },
    { ico: '🌧️', it: 'pioggia',   en: 'rain',     fr: 'pluie',    de: 'der Regen',     es: 'lluvia' },
    { ico: '❄️', it: 'neve',      en: 'snow',     fr: 'neige',    de: 'der Schnee',    es: 'nieve' },
    { ico: '🌳', it: 'albero',    en: 'tree',     fr: 'arbre',    de: 'der Baum',      es: 'árbol' },
    { ico: '🌸', it: 'fiore',     en: 'flower',   fr: 'fleur',    de: 'die Blume',     es: 'flor' },
    { ico: '🔥', it: 'fuoco',     en: 'fire',     fr: 'feu',      de: 'das Feuer',     es: 'fuego' },
    { ico: '🌊', it: 'mare',      en: 'sea',      fr: 'mer',      de: 'das Meer',      es: 'mar' },
    { ico: '⛰️', it: 'montagna',  en: 'mountain', fr: 'montagne', de: 'der Berg',      es: 'montaña' },

    /* persone */
    { ico: '👨', it: 'uomo',      en: 'man',      fr: 'homme',    de: 'der Mann',      es: 'hombre' },
    { ico: '👩', it: 'donna',     en: 'woman',    fr: 'femme',    de: 'die Frau',      es: 'mujer' },
    { ico: '👶', it: 'bambino',   en: 'child',    fr: 'enfant',   de: 'das Kind',      es: 'niño' },
    { ico: '👁️', it: 'occhio',    en: 'eye',      fr: 'œil',      de: 'das Auge',      es: 'ojo' },
    { ico: '🦶', it: 'piede',     en: 'foot',     fr: 'pied',     de: 'der Fuß',       es: 'pie' },
    { ico: '❤️', it: 'cuore',     en: 'heart',    fr: 'cœur',     de: 'das Herz',      es: 'corazón' },

    /* colori */
    { ico: '🔴', it: 'rosso',     en: 'red',      fr: 'rouge',    de: 'rot',           es: 'rojo' },
    { ico: '🔵', it: 'blu',       en: 'blue',     fr: 'bleu',     de: 'blau',          es: 'azul' },
    { ico: '🟢', it: 'verde',     en: 'green',    fr: 'vert',     de: 'grün',          es: 'verde' },
    { ico: '🟡', it: 'giallo',    en: 'yellow',   fr: 'jaune',    de: 'gelb',          es: 'amarillo' },
    { ico: '⚫', it: 'nero',      en: 'black',    fr: 'noir',     de: 'schwarz',       es: 'negro' },
    { ico: '⚪', it: 'bianco',    en: 'white',    fr: 'blanc',    de: 'weiß',          es: 'blanco' }
  ];

  /* ---------------- frasi col buco ----------------
     [ frase con ___ , parola giusta, [tre sbagliate], traduzione ] */
  BT.FRASI_BUCO = {
    it: [
      ['Il gatto beve il ___.', 'latte', ['libro', 'cane', 'giardino'], 'Frase da completare.'],
      ['___ a scuola tutti i giorni.', 'Vado', ['Mangio', 'Dormo', 'Apro'], 'Il verbo giusto.'],
      ['Il sole &egrave; ___.', 'giallo', ['blu', 'nero', 'verde'], 'Il colore giusto.'],
      ['Mio fratello ___ un libro.', 'legge', ['beve', 'corre', 'canta'], 'Che cosa si fa con un libro.'],
      ['Il cane &egrave; in ___.', 'giardino', ['latte', 'luned&igrave;', 'pane'], 'Il posto giusto.'],
      ['Noi ___ a calcio la domenica.', 'giochiamo', ['beviamo', 'scriviamo', 'dormiamo'], 'Il verbo giusto.'],
      ['Per favore ___ la porta.', 'chiudi', ['bevi', 'dormi', 'ridi'], 'Che cosa si fa a una porta.'],
      ['Il libro &egrave; sul ___.', 'tavolo', ['pioggia', 'mare', 'neve'], 'Dove sta il libro.'],
      ['L&rsquo;inverno &egrave; molto ___.', 'freddo', ['dolce', 'veloce', 'alto'], 'Com&rsquo;&egrave; l&rsquo;inverno.'],
      ['Ho dieci ___.', 'anni', ['porte', 'mele', 'libri'], 'Quanti ne hai.'],
      ['Lei si ___ le mani.', 'lava', ['vola', 'canta', 'apre'], 'Che cosa si fa alle mani.'],
      ['L&rsquo;uccello &egrave; sull&rsquo;___.', 'albero', ['pane', 'sedia', 'acqua'], 'Dove sta l&rsquo;uccello.']
    ],
    en: [
      ['The cat drinks the ___.', 'milk', ['book', 'door', 'chair'], 'Il gatto beve il latte.'],
      ['I ___ to school every day.', 'go', ['eat', 'sleep', 'open'], 'Vado a scuola tutti i giorni.'],
      ['The sun is ___.', 'yellow', ['blue', 'black', 'green'], 'Il sole &egrave; giallo.'],
      ['My brother ___ a book.', 'reads', ['drinks', 'runs', 'sings'], 'Mio fratello legge un libro.'],
      ['The dog is in the ___.', 'garden', ['milk', 'monday', 'water'], 'Il cane &egrave; in giardino.'],
      ['We ___ football on Sunday.', 'play', ['drink', 'write', 'sleep'], 'Giochiamo a calcio la domenica.'],
      ['Please ___ the door.', 'close', ['drink', 'sleep', 'laugh'], 'Per favore chiudi la porta.'],
      ['The book is on the ___.', 'table', ['rain', 'cloud', 'milk'], 'Il libro &egrave; sul tavolo.'],
      ['Winter is very ___.', 'cold', ['sweet', 'loud', 'fast'], 'L&rsquo;inverno &egrave; molto freddo.'],
      ['I am ten ___ old.', 'years', ['doors', 'apples', 'rooms'], 'Ho dieci anni.'],
      ['She ___ her hands.', 'washes', ['flies', 'sings', 'opens'], 'Lei si lava le mani.'],
      ['The bird is on the ___.', 'tree', ['bread', 'shoe', 'spoon'], 'L&rsquo;uccello &egrave; sull&rsquo;albero.']
    ],
    fr: [
      ['Le chat boit le ___.', 'lait', ['livre', 'chien', 'jardin'], 'Il gatto beve il latte.'],
      ['Je ___ &agrave; l&rsquo;&eacute;cole.', 'vais', ['mange', 'dors', 'ouvre'], 'Vado a scuola.'],
      ['Le soleil est ___.', 'jaune', ['bleu', 'noir', 'vert'], 'Il sole &egrave; giallo.'],
      ['Mon fr&egrave;re ___ un livre.', 'lit', ['boit', 'court', 'chante'], 'Mio fratello legge un libro.'],
      ['Le chien est dans le ___.', 'jardin', ['lait', 'lundi', 'pain'], 'Il cane &egrave; in giardino.'],
      ['Nous ___ au football.', 'jouons', ['buvons', '&eacute;crivons', 'dormons'], 'Giochiamo a calcio.'],
      ['Ferme la ___, s&rsquo;il te pla&icirc;t.', 'porte', ['pomme', 'lune', 'main'], 'Chiudi la porta, per favore.'],
      ['Le livre est sur la ___.', 'table', ['pluie', 'mer', 'neige'], 'Il libro &egrave; sul tavolo.'],
      ['L&rsquo;hiver est tr&egrave;s ___.', 'froid', ['sucr&eacute;', 'rapide', 'grand'], 'L&rsquo;inverno &egrave; molto freddo.'],
      ['J&rsquo;ai dix ___.', 'ans', ['portes', 'pommes', 'livres'], 'Ho dieci anni.'],
      ['Elle ___ les mains.', 'lave', ['vole', 'chante', 'ouvre'], 'Lei si lava le mani.'],
      ['L&rsquo;oiseau est sur l&rsquo;___.', 'arbre', ['pain', 'chaise', 'eau'], 'L&rsquo;uccello &egrave; sull&rsquo;albero.']
    ],
    de: [
      ['Die Katze trinkt die ___.', 'Milch', ['T&uuml;r', 'Schule', 'Blume'], 'Il gatto beve il latte.'],
      ['Ich ___ in die Schule.', 'gehe', ['esse', 'schlafe', '&ouml;ffne'], 'Vado a scuola.'],
      ['Die Sonne ist ___.', 'gelb', ['blau', 'schwarz', 'gr&uuml;n'], 'Il sole &egrave; giallo.'],
      ['Mein Bruder ___ ein Buch.', 'liest', ['trinkt', 'l&auml;uft', 'singt'], 'Mio fratello legge un libro.'],
      ['Der Hund ist im ___.', 'Garten', ['Milch', 'Montag', 'Brot'], 'Il cane &egrave; in giardino.'],
      ['Wir ___ Fu&szlig;ball.', 'spielen', ['trinken', 'schreiben', 'schlafen'], 'Giochiamo a calcio.'],
      ['Bitte ___ die T&uuml;r.', 'schlie&szlig;e', ['trinke', 'schlafe', 'lache'], 'Per favore chiudi la porta.'],
      ['Das Buch ist auf dem ___.', 'Tisch', ['Regen', 'Meer', 'Schnee'], 'Il libro &egrave; sul tavolo.'],
      ['Der Winter ist sehr ___.', 'kalt', ['s&uuml;&szlig;', 'schnell', 'laut'], 'L&rsquo;inverno &egrave; molto freddo.'],
      ['Ich bin zehn ___ alt.', 'Jahre', ['T&uuml;ren', '&Auml;pfel', 'B&uuml;cher'], 'Ho dieci anni.'],
      ['Sie ___ die H&auml;nde.', 'w&auml;scht', ['fliegt', 'singt', '&ouml;ffnet'], 'Lei si lava le mani.'],
      ['Der Vogel ist auf dem ___.', 'Baum', ['Brot', 'Stuhl', 'Wasser'], 'L&rsquo;uccello &egrave; sull&rsquo;albero.']
    ],
    es: [
      ['El gato bebe la ___.', 'leche', ['puerta', 'escuela', 'flor'], 'Il gatto beve il latte.'],
      ['___ a la escuela cada d&iacute;a.', 'Voy', ['Como', 'Duermo', 'Abro'], 'Vado a scuola tutti i giorni.'],
      ['El sol es ___.', 'amarillo', ['azul', 'negro', 'verde'], 'Il sole &egrave; giallo.'],
      ['Mi hermano ___ un libro.', 'lee', ['bebe', 'corre', 'canta'], 'Mio fratello legge un libro.'],
      ['El perro est&aacute; en el ___.', 'jard&iacute;n', ['leche', 'lunes', 'pan'], 'Il cane &egrave; in giardino.'],
      ['Nosotros ___ al f&uacute;tbol.', 'jugamos', ['bebemos', 'escribimos', 'dormimos'], 'Giochiamo a calcio.'],
      ['Por favor, ___ la puerta.', 'cierra', ['bebe', 'duerme', 'r&iacute;e'], 'Per favore chiudi la porta.'],
      ['El libro est&aacute; en la ___.', 'mesa', ['lluvia', 'nieve', 'nube'], 'Il libro &egrave; sul tavolo.'],
      ['El invierno es muy ___.', 'fr&iacute;o', ['dulce', 'r&aacute;pido', 'alto'], 'L&rsquo;inverno &egrave; molto freddo.'],
      ['Tengo diez ___.', 'a&ntilde;os', ['puertas', 'manzanas', 'libros'], 'Ho dieci anni.'],
      ['Ella se ___ las manos.', 'lava', ['vuela', 'canta', 'abre'], 'Lei si lava le mani.'],
      ['El p&aacute;jaro est&aacute; en el ___.', '&aacute;rbol', ['pan', 'agua', 'zapato'], 'L&rsquo;uccello &egrave; sull&rsquo;albero.']
    ]
  };

  /* ---------------- frasi da rimettere in ordine ----------------
     [ frase giusta, traduzione ] — le parole vengono mescolate */
  BT.FRASI_ORDINE = {
    it: [
      ['Il gatto &egrave; sul tavolo', 'Rimetti in ordine le parole'],
      ['Vado a scuola tutti i giorni', 'Rimetti in ordine le parole'],
      ['Mio padre guida la macchina', 'Rimetti in ordine le parole'],
      ['Oggi il sole &egrave; molto caldo', 'Rimetti in ordine le parole'],
      ['Giochiamo insieme in giardino', 'Rimetti in ordine le parole'],
      ['Lei legge un libro la sera', 'Rimetti in ordine le parole'],
      ['Il cane corre nel parco', 'Rimetti in ordine le parole'],
      ['Bevo un bicchiere di latte', 'Rimetti in ordine le parole'],
      ['Mia sorella ha una bici rossa', 'Rimetti in ordine le parole'],
      ['Gli uccelli volano sopra il mare', 'Rimetti in ordine le parole']
    ],
    en: [
      ['The cat is on the table', 'Il gatto &egrave; sul tavolo'],
      ['I go to school every day', 'Vado a scuola tutti i giorni'],
      ['My father drives the car', 'Mio padre guida la macchina'],
      ['The sun is very hot today', 'Oggi il sole &egrave; molto caldo'],
      ['We play in the garden', 'Giochiamo in giardino'],
      ['She reads a book at night', 'Lei legge un libro la sera'],
      ['The dog runs in the park', 'Il cane corre nel parco'],
      ['I drink a glass of milk', 'Bevo un bicchiere di latte'],
      ['My sister has a red bike', 'Mia sorella ha una bici rossa'],
      ['Birds fly over the sea', 'Gli uccelli volano sopra il mare']
    ],
    fr: [
      ['Le chat est sur la table', 'Il gatto &egrave; sul tavolo'],
      ['Je vais &agrave; l&rsquo;&eacute;cole tous les jours', 'Vado a scuola tutti i giorni'],
      ['Mon p&egrave;re conduit la voiture', 'Mio padre guida la macchina'],
      ['Le soleil est tr&egrave;s chaud', 'Il sole &egrave; molto caldo'],
      ['Nous jouons dans le jardin', 'Giochiamo in giardino'],
      ['Elle lit un livre le soir', 'Lei legge un libro la sera'],
      ['Le chien court dans le parc', 'Il cane corre nel parco'],
      ['Je bois un verre de lait', 'Bevo un bicchiere di latte'],
      ['Ma s&oelig;ur a un v&eacute;lo rouge', 'Mia sorella ha una bici rossa'],
      ['Les oiseaux volent sur la mer', 'Gli uccelli volano sopra il mare']
    ],
    de: [
      ['Die Katze ist auf dem Tisch', 'Il gatto &egrave; sul tavolo'],
      ['Ich gehe jeden Tag in die Schule', 'Vado a scuola tutti i giorni'],
      ['Mein Vater f&auml;hrt das Auto', 'Mio padre guida la macchina'],
      ['Die Sonne ist heute sehr warm', 'Oggi il sole &egrave; molto caldo'],
      ['Wir spielen im Garten', 'Giochiamo in giardino'],
      ['Sie liest abends ein Buch', 'Lei legge un libro la sera'],
      ['Der Hund l&auml;uft im Park', 'Il cane corre nel parco'],
      ['Ich trinke ein Glas Milch', 'Bevo un bicchiere di latte'],
      ['Meine Schwester hat ein rotes Fahrrad', 'Mia sorella ha una bici rossa'],
      ['Die V&ouml;gel fliegen &uuml;ber das Meer', 'Gli uccelli volano sopra il mare']
    ],
    es: [
      ['El gato est&aacute; en la mesa', 'Il gatto &egrave; sul tavolo'],
      ['Voy a la escuela cada d&iacute;a', 'Vado a scuola tutti i giorni'],
      ['Mi padre conduce el coche', 'Mio padre guida la macchina'],
      ['Hoy el sol es muy caliente', 'Oggi il sole &egrave; molto caldo'],
      ['Jugamos en el jard&iacute;n', 'Giochiamo in giardino'],
      ['Ella lee un libro por la noche', 'Lei legge un libro la sera'],
      ['El perro corre en el parque', 'Il cane corre nel parco'],
      ['Bebo un vaso de leche', 'Bevo un bicchiere di latte'],
      ['Mi hermana tiene una bici roja', 'Mia sorella ha una bici rossa'],
      ['Los p&aacute;jaros vuelan sobre el mar', 'Gli uccelli volano sopra il mare']
    ]
  };

})(window.BT);
