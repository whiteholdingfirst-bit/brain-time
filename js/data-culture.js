/* =========================================================
   BRAIN TIME — CULTURA GENERALE
   Geografia, scienze, arte, musica, sport, tecnologia,
   corpo umano, natura. Tre livelli.
   Formato riga: [domanda, giusta, sbagliata, sbagliata, sbagliata, spiegazione]
   ========================================================= */
(function (BT) {
  'use strict';

  var elem5 = [
    ['Qual &egrave; il pianeta pi&ugrave; vicino al Sole?', 'Mercurio', 'Venere', 'Marte', 'La Terra', 'L\'ordine &egrave;: Mercurio, Venere, Terra, Marte.'],
    ['Qual &egrave; l\'oceano pi&ugrave; grande del mondo?', 'L\'oceano Pacifico', 'L\'oceano Atlantico', 'L\'oceano Indiano', 'Il mar Mediterraneo', 'Da solo copre circa un terzo della superficie terrestre.'],
    ['Qual &egrave; la capitale d\'Italia?', 'Roma', 'Milano', 'Napoli', 'Firenze', 'Roma &egrave; capitale dal 1871.'],
    ['Qual &egrave; il fiume pi&ugrave; lungo d\'Italia?', 'Il Po', 'L\'Adige', 'Il Tevere', 'L\'Arno', 'Il Po &egrave; lungo circa 650 km e attraversa la pianura padana.'],
    ['Qual &egrave; la montagna pi&ugrave; alta delle Alpi?', 'Il Monte Bianco', 'Il Cervino', 'Il Monte Rosa', 'Il Gran Sasso', 'Il Monte Bianco supera i 4.800 metri.'],
    ['Quanti sono i colori dell\'arcobaleno?', '7', '5', '6', '9', 'Rosso, arancione, giallo, verde, blu, indaco, violetto.'],
    ['Qual &egrave; l\'animale pi&ugrave; grande del mondo?', 'La balenottera azzurra', 'L\'elefante africano', 'Lo squalo bianco', 'La giraffa', 'Pu&ograve; superare i 30 metri di lunghezza.'],
    ['Quante zampe ha un ragno?', '8', '6', '10', '4', 'I ragni sono aracnidi: 8 zampe. Gli insetti ne hanno 6.'],
    ['Che cosa producono le api?', 'Il miele', 'Il latte', 'La seta', 'La lana', 'La seta la produce il baco da seta.'],
    ['Quale organo pompa il sangue nel corpo?', 'Il cuore', 'Il fegato', 'I polmoni', 'Lo stomaco', 'Il cuore batte circa 100.000 volte al giorno.'],
    ['Quanti giorni ha un anno non bisestile?', '365', '360', '366', '364', 'L\'anno bisestile ne ha 366.'],
    ['Quale strumento musicale ha i tasti bianchi e neri?', 'Il pianoforte', 'La chitarra', 'Il violino', 'La tromba', 'Un pianoforte ha 88 tasti.'],
    ['Chi ha dipinto la Gioconda?', 'Leonardo da Vinci', 'Michelangelo', 'Raffaello', 'Van Gogh', 'Il quadro &egrave; conservato al museo del Louvre, a Parigi.'],
    ['Qual &egrave; la capitale della Francia?', 'Parigi', 'Lione', 'Marsiglia', 'Nizza', 'A Parigi si trova la Torre Eiffel.'],
    ['Come si chiama il satellite naturale della Terra?', 'La Luna', 'Marte', 'Il Sole', 'Venere', 'La Luna gira intorno alla Terra in circa 27 giorni.'],
    ['Quale Paese ha la forma di uno stivale?', 'L\'Italia', 'La Spagna', 'La Grecia', 'Il Portogallo', 'La penisola italiana si allunga nel Mediterraneo.'],
    ['Quanti giocatori ha in campo una squadra di calcio?', '11', '10', '9', '12', 'Undici compreso il portiere.'],
    ['Che cosa misura il termometro?', 'La temperatura', 'Il peso', 'La lunghezza', 'Il tempo', 'La bilancia misura il peso, il metro la lunghezza.'],
    ['Qual &egrave; l\'animale pi&ugrave; veloce sulla terraferma?', 'Il ghepardo', 'Il leone', 'Il cavallo', 'Il levriero', 'Il ghepardo supera i 100 km/h in brevi scatti.'],
    ['In quale stagione cadono le foglie dagli alberi?', 'In autunno', 'In primavera', 'In estate', 'In inverno', 'Molti alberi perdono le foglie per resistere al freddo.'],
    ['Quale gas ci serve per respirare?', 'L\'ossigeno', 'L\'anidride carbonica', 'L\'elio', 'L\'azoto', 'Lo produciamo grazie alle piante.'],
    ['Come si chiama il mare che bagna l\'Italia?', 'Il mar Mediterraneo', 'Il mar Baltico', 'Il mar Rosso', 'L\'oceano Atlantico', 'L\'Italia &egrave; al centro del Mediterraneo.'],
    ['Quale pianeta viene chiamato "il pianeta rosso"?', 'Marte', 'Giove', 'Saturno', 'Venere', 'Il colore viene dalla ruggine presente nel suolo.'],
    ['Quanti minuti ci sono in un\'ora?', '60', '100', '30', '90', 'E in un minuto ci sono 60 secondi.'],
    ['Chi ha scritto le avventure di Pinocchio?', 'Carlo Collodi', 'Gianni Rodari', 'Italo Calvino', 'Edmondo De Amicis', 'Il libro &egrave; del 1883.'],
    ['Qual &egrave; il pi&ugrave; grande pianeta del sistema solare?', 'Giove', 'Saturno', 'La Terra', 'Nettuno', 'Giove &egrave; oltre 1.000 volte pi&ugrave; grande della Terra.'],
    ['Che cosa mangia un animale erbivoro?', 'Piante ed erba', 'Carne', 'Solo pesce', 'Solo insetti', 'I carnivori mangiano carne, gli onnivori un po\' di tutto.']
  ];

  var media2 = [
    ['Qual &egrave; la capitale dell\'Australia?', 'Canberra', 'Sydney', 'Melbourne', 'Brisbane', 'Canberra fu costruita apposta come capitale, per non scegliere fra Sydney e Melbourne.'],
    ['Qual &egrave; il pi&ugrave; grande deserto caldo del mondo?', 'Il Sahara', 'Il Gobi', 'L\'Atacama', 'Il Kalahari', 'Il Sahara copre gran parte del Nord Africa.'],
    ['Quale pianeta ha gli anelli pi&ugrave; visibili?', 'Saturno', 'Giove', 'Urano', 'Marte', 'Gli anelli sono fatti di ghiaccio e roccia.'],
    ['Qual &egrave; la formula chimica dell\'acqua?', 'H&#8322;O', 'CO&#8322;', 'O&#8322;', 'H&#8322;O&#8322;', 'Due atomi di idrogeno e uno di ossigeno.'],
    ['Chi ha formulato la teoria della relativit&agrave;?', 'Albert Einstein', 'Isaac Newton', 'Galileo Galilei', 'Niels Bohr', 'La relativit&agrave; ristretta &egrave; del 1905.'],
    ['Quale organo filtra il sangue producendo l\'urina?', 'I reni', 'Il fegato', 'La milza', 'Il pancreas', 'I reni filtrano circa 180 litri di sangue al giorno.'],
    ['Chi ha scritto la Divina Commedia?', 'Dante Alighieri', 'Francesco Petrarca', 'Giovanni Boccaccio', 'Ludovico Ariosto', '&Egrave; divisa in Inferno, Purgatorio e Paradiso.'],
    ['Qual &egrave; la moneta del Regno Unito?', 'La sterlina', 'L\'euro', 'Il dollaro', 'Il franco', 'Il Regno Unito non ha mai adottato l\'euro.'],
    ['Quale vulcano distrusse Pompei nel 79 d.C.?', 'Il Vesuvio', 'L\'Etna', 'Lo Stromboli', 'Il Vulcano', 'L\'eruzione seppell&igrave; la citt&agrave; sotto le ceneri, conservandola.'],
    ['Qual &egrave; l\'osso pi&ugrave; lungo del corpo umano?', 'Il femore', 'L\'omero', 'La tibia', 'La colonna vertebrale', 'Il femore &egrave; l\'osso della coscia.'],
    ['Chi ha scolpito il David conservato a Firenze?', 'Michelangelo', 'Donatello', 'Bernini', 'Canova', 'La statua &egrave; alta oltre 5 metri.'],
    ['Quanti giocatori ha in campo una squadra di pallavolo?', '6', '5', '7', '11', 'Nel basket sono 5.'],
    ['Qual &egrave; la capitale del Giappone?', 'Tokyo', 'Kyoto', 'Osaka', 'Seul', 'Seul &egrave; la capitale della Corea del Sud.'],
    ['Che cosa misura la scala Richter?', 'L\'energia liberata dai terremoti', 'La forza del vento', 'L\'altezza delle onde', 'La temperatura dell\'aria', 'Il vento si misura invece con la scala Beaufort.'],
    ['Qual &egrave; il gas pi&ugrave; abbondante nell\'aria che respiriamo?', 'L\'azoto', 'L\'ossigeno', 'L\'anidride carbonica', 'L\'idrogeno', 'L\'aria &egrave; circa 78% azoto e 21% ossigeno.'],
    ['Chi &egrave; riconosciuto in Italia come inventore del telefono?', 'Antonio Meucci', 'Guglielmo Marconi', 'Alessandro Volta', 'Galileo Ferraris', 'Marconi invent&ograve; invece la radio.'],
    ['Che cos\'&egrave; la fotosintesi?', 'Il processo con cui le piante producono nutrimento usando la luce', 'Il modo in cui le piante si riproducono', 'La caduta delle foglie in autunno', 'La crescita delle radici', 'Le piante assorbono anidride carbonica e liberano ossigeno.'],
    ['Quale strumento misura la pressione atmosferica?', 'Il barometro', 'Il termometro', 'L\'igrometro', 'L\'anemometro', 'L\'anemometro misura il vento, l\'igrometro l\'umidit&agrave;.'],
    ['Chi dipinse la volta della Cappella Sistina?', 'Michelangelo', 'Leonardo da Vinci', 'Raffaello', 'Botticelli', 'Ci lavor&ograve; dal 1508 al 1512.'],
    ['Qual &egrave; la capitale del Brasile?', 'Brasilia', 'Rio de Janeiro', 'San Paolo', 'Salvador', 'Brasilia fu inaugurata come capitale nel 1960.'],
    ['Quanti cromosomi ha una cellula umana?', '46', '23', '48', '24', '46 in tutto, cio&egrave; 23 coppie.'],
    ['Che cosa significa la sigla "www"?', 'World Wide Web', 'World Wireless Web', 'Web World Wide', 'Wide World Web', 'Fu inventato da Tim Berners-Lee nel 1989.'],
    ['Qual &egrave; l\'unit&agrave; di misura della forza?', 'Il newton', 'Il joule', 'Il watt', 'Il pascal', 'Il joule misura l\'energia, il watt la potenza.'],
    ['In quale continente si trova l\'Egitto?', 'In Africa', 'In Asia', 'In Europa', 'In Oceania', 'La penisola del Sinai si estende per&ograve; in Asia.'],
    ['Che cosa studia l\'astronomia?', 'I corpi celesti e l\'universo', 'Il clima e il tempo', 'Le rocce della Terra', 'Il comportamento degli animali', 'Il clima lo studia la meteorologia.'],
    ['Qual &egrave; il Paese pi&ugrave; popoloso del mondo?', 'L\'India', 'La Cina', 'Gli Stati Uniti', 'L\'Indonesia', 'L\'India ha superato la Cina nel 2023.'],
    ['Quale pittore olandese dipinse "Notte stellata"?', 'Vincent van Gogh', 'Rembrandt', 'Vermeer', 'Mondrian', 'La dipinse nel 1889.']
  ];

  var adulti = [
    ['Qual &egrave; la capitale del Canada?', 'Ottawa', 'Toronto', 'Montreal', 'Vancouver', 'Toronto &egrave; la citt&agrave; pi&ugrave; popolosa, ma non &egrave; la capitale.'],
    ['Chi ha scritto "Cent\'anni di solitudine"?', 'Gabriel Garc&iacute;a M&aacute;rquez', 'Jorge Luis Borges', 'Mario Vargas Llosa', 'Pablo Neruda', 'Romanzo del 1967, capolavoro del realismo magico.'],
    ['Quale elemento chimico ha simbolo Au?', 'L\'oro', 'L\'argento', 'Il rame', 'L\'alluminio', 'Dal latino "aurum". L\'argento &egrave; Ag.'],
    ['In che anno &egrave; stato presentato il primo iPhone?', '2007', '2005', '2010', '2003', 'Fu presentato da Steve Jobs nel gennaio 2007.'],
    ['Qual &egrave; il punto pi&ugrave; profondo degli oceani?', 'La Fossa delle Marianne', 'La Fossa di Giava', 'La Fossa delle Tonga', 'Il mar dei Sargassi', 'Supera gli 10.900 metri di profondit&agrave;.'],
    ['Chi ha diretto il film "Ladri di biciclette"?', 'Vittorio De Sica', 'Roberto Rossellini', 'Federico Fellini', 'Luchino Visconti', 'Del 1948, manifesto del neorealismo italiano.'],
    ['Che cosa indica il PIL di un Paese?', 'Il valore dei beni e servizi prodotti in un anno', 'Il debito dello Stato', 'Il reddito medio dei cittadini', 'Il numero di occupati', 'Prodotto Interno Lordo.'],
    ['Qual &egrave; approssimativamente la velocit&agrave; della luce nel vuoto?', '300.000 km/s', '300.000 km/h', '3.000 km/s', '30.000 km/s', 'Precisamente 299.792,458 km/s.'],
    ['Chi ha composto "Le quattro stagioni"?', 'Antonio Vivaldi', 'Johann Sebastian Bach', 'Wolfgang Amadeus Mozart', 'Giuseppe Verdi', 'Quattro concerti per violino pubblicati nel 1725.'],
    ['Che cosa misura un anno luce?', 'Una distanza', 'Un intervallo di tempo', 'Una velocit&agrave;', 'Una massa', '&Egrave; la distanza percorsa dalla luce in un anno: circa 9.460 miliardi di km.'],
    ['Chi scopr&igrave; la penicillina?', 'Alexander Fleming', 'Louis Pasteur', 'Robert Koch', 'Edward Jenner', 'Scoperta nel 1928, quasi per caso.'],
    ['Quale organo produce l\'insulina?', 'Il pancreas', 'Il fegato', 'La tiroide', 'Il rene', 'L\'insulina regola gli zuccheri nel sangue.'],
    ['Chi ha scritto "Il nome della rosa"?', 'Umberto Eco', 'Italo Calvino', 'Primo Levi', 'Alberto Moravia', 'Romanzo del 1980 ambientato in un monastero medievale.'],
    ['Quanti fusi orari attraversa la Russia?', '11', '9', '7', '13', '&Egrave; il Paese che ne attraversa di pi&ugrave; sul territorio continuo.'],
    ['Che cos\'&egrave; l\'inflazione?', 'L\'aumento generale e prolungato dei prezzi', 'La crescita del debito pubblico', 'L\'aumento della disoccupazione', 'La svalutazione della borsa', 'Riduce il potere d\'acquisto della moneta.'],
    ['Chi ha dipinto "Guernica"?', 'Pablo Picasso', 'Salvador Dal&iacute;', 'Joan Mir&oacute;', 'Henri Matisse', 'Dipinto nel 1937 dopo il bombardamento della citt&agrave; basca.'],
    ['Qual &egrave; l\'unit&agrave; di misura della potenza?', 'Il watt', 'Il newton', 'Il joule', 'L\'ampere', 'Un watt equivale a un joule al secondo.'],
    ['Che cosa significa la sigla ONU?', 'Organizzazione delle Nazioni Unite', 'Organismo Nazionale Unificato', 'Organizzazione Nord-Unione', 'Osservatorio delle Nazioni Unite', 'Fondata nel 1945, ha sede a New York.'],
    ['Quale metallo &egrave; liquido a temperatura ambiente?', 'Il mercurio', 'Il piombo', 'Lo stagno', 'Il sodio', 'Per questo veniva usato nei vecchi termometri.'],
    ['In che anno l\'euro &egrave; entrato in circolazione come banconote e monete?', '2002', '1999', '1995', '2004', 'Dal 1999 esisteva gi&agrave; come moneta contabile.'],
    ['Chi ha scritto il romanzo "1984"?', 'George Orwell', 'Aldous Huxley', 'Ray Bradbury', 'Franz Kafka', 'Pubblicato nel 1949, ha reso celebre il "Grande Fratello".'],
    ['Qual &egrave; la montagna pi&ugrave; alta del mondo?', 'L\'Everest', 'Il K2', 'Il Kilimangiaro', 'Il Monte Bianco', '8.849 metri, sulla catena dell\'Himalaya.'],
    ['Che cos\'&egrave; il DNA?', 'La molecola che contiene l\'informazione genetica', 'Una proteina del sangue', 'Un tipo di cellula', 'Un ormone della crescita', 'La sua struttura a doppia elica fu descritta nel 1953.'],
    ['Chi &egrave; considerato il fondatore della psicoanalisi?', 'Sigmund Freud', 'Carl Gustav Jung', 'Alfred Adler', 'Jean Piaget', 'Jung e Adler furono suoi allievi, poi in disaccordo con lui.'],
    ['Qual &egrave; la capitale della Turchia?', 'Ankara', 'Istanbul', 'Smirne', 'Bursa', 'Istanbul &egrave; la citt&agrave; pi&ugrave; grande, ma la capitale &egrave; Ankara dal 1923.'],
    ['Che cos\'&egrave; un algoritmo?', 'Una sequenza finita di istruzioni per risolvere un problema', 'Un linguaggio di programmazione', 'Un tipo di computer', 'Una formula matematica complessa', 'Anche una ricetta di cucina, in fondo, &egrave; un algoritmo.'],
    ['Quale artista italiano dipinse "La nascita di Venere"?', 'Sandro Botticelli', 'Tiziano', 'Caravaggio', 'Giotto', 'Conservata agli Uffizi di Firenze.'],
    ['Che cosa studia l\'epidemiologia?', 'La diffusione delle malattie nelle popolazioni', 'Le malattie della pelle', 'Il funzionamento del cervello', 'Le epidemie solo di origine virale', 'Studia frequenza, cause e distribuzione delle malattie.']
  ];

  function make(rows) {
    return rows.map(function (r) {
      return function () { return BT.fromRow(r, 'culture'); };
    });
  }

  BT.CULTURE = { elem5: make(elem5), media2: make(media2), adulti: make(adulti) };

})(window.BT);
