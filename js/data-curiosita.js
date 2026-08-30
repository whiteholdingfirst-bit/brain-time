/* =========================================================
   BRAIN TIME — scoperte
   Quello che si trova dentro le casse sorpresa: trucchi per
   studiare, per fare i compiti, per riparare o orientarsi, e
   storie di come sono nate le cose.
   Formato: { id, ico, tipo, titolo, testo }
   ========================================================= */
(function (BT) {
  'use strict';

  BT.TIPI_SCOPERTA = [
    { id: 'studio',    nome: 'Trucchi per studiare',  ico: '📚' },
    { id: 'compiti',   nome: 'Trucchi per i compiti', ico: '✏️' },
    { id: 'riparare',  nome: 'Aggiustare le cose',    ico: '🔧' },
    { id: 'orientarsi',nome: 'Orientarsi',            ico: '🧭' },
    { id: 'nascita',   nome: 'Come &egrave; nato',    ico: '💡' },
    { id: 'sapevi',    nome: 'Sapevi che...',         ico: '🤯' }
  ];

  BT.CURIOSITA = [

    /* ---------------- trucchi per studiare ---------------- */
    { id: 's1', tipo: 'studio', ico: '⏱️', titolo: 'Studia a fette, non a fiumi',
      testo: 'Il cervello tiene bene l\'attenzione per circa <b>25 minuti</b>, poi cala. Studia 25 minuti, fermati 5, riparti. In due ore fatte cos&igrave; impari pi&ugrave; che in due ore filate.' },
    { id: 's2', tipo: 'studio', ico: '🗣️', titolo: 'Spiegalo al muro',
      testo: 'Se riesci a <b>spiegare a voce alta</b> quello che hai studiato, come se lo raccontassi a un bambino pi&ugrave; piccolo, allora lo sai davvero. Se ti inceppi, hai trovato il punto da ripassare.' },
    { id: 's3', tipo: 'studio', ico: '📅', titolo: 'Ripassa quando stai per dimenticare',
      testo: 'Ripassare la stessa cosa dopo <b>1 giorno, 3 giorni e 1 settimana</b> la incolla nella memoria molto meglio che rileggerla dieci volte di fila oggi.' },
    { id: 's4', tipo: 'studio', ico: '❓', titolo: 'Chiuditi il libro',
      testo: 'Rileggere &egrave; comodo ma inganna: sembra di sapere. <b>Chiudi il libro e prova a ripetere</b>: quello che ti manca lo scopri subito. &Egrave; lo stesso motivo per cui Brain Time ti fa domande invece di darti le risposte.' },
    { id: 's5', tipo: 'studio', ico: '🎨', titolo: 'Il palazzo della memoria',
      testo: 'Per ricordare una lista, immagina di appoggiare ogni cosa in una <b>stanza di casa tua</b>. Poi ripercorri la casa con la mente: gli oggetti tornano a galla da soli. Lo facevano gi&agrave; gli antichi Greci.' },
    { id: 's6', tipo: 'studio', ico: '😴', titolo: 'Si impara anche dormendo',
      testo: 'Mentre dormi il cervello riordina quello che hai studiato e lo sposta nella memoria lunga. Studiare tutta la notte prima della verifica &egrave; il modo pi&ugrave; sicuro per <b>ricordare meno</b>.' },
    { id: 's7', tipo: 'studio', ico: '✍️', titolo: 'Scrivere a mano batte copiare',
      testo: 'Riscrivere un concetto <b>con parole tue</b> obbliga il cervello a capirlo. Ricopiare uguale, invece, &egrave; come fotocopiare: la pagina esiste, ma tu non l\'hai letta.' },

    /* ---------------- trucchi per i compiti ---------------- */
    { id: 'c1', tipo: 'compiti', ico: '🐸', titolo: 'Mangia la rana',
      testo: 'Inizia sempre dal compito che ti pesa di pi&ugrave;. Finito quello, tutto il resto sembra una discesa. Se parti dal facile, il difficile ti aspetta quando sei gi&agrave; stanco.' },
    { id: 'c2', tipo: 'compiti', ico: '📝', titolo: 'La regola dei due minuti',
      testo: 'Se una cosa si fa in meno di <b>due minuti</b>, falla subito invece di segnartela. Il tempo speso a ricordarsela sarebbe pi&ugrave; di quello per farla.' },
    { id: 'c3', tipo: 'compiti', ico: '🎒', titolo: 'Prepara la sera prima',
      testo: 'Zaino e vestiti pronti la sera: al mattino il cervello &egrave; ancora mezzo addormentato e ogni decisione costa fatica. Meno decisioni, meno dimenticanze.' },
    { id: 'c4', tipo: 'compiti', ico: '📵', titolo: 'Il telefono in un\'altra stanza',
      testo: 'Non basta girarlo: se il telefono &egrave; sul tavolo il cervello continua a controllarlo di nascosto. In un\'altra stanza si studia in <b>meno tempo</b>, non di pi&ugrave;.' },
    { id: 'c5', tipo: 'compiti', ico: '🔍', titolo: 'Leggi prima la domanda',
      testo: 'Nei problemi e nelle comprensioni, leggi <b>prima la domanda</b> e poi il testo: sai gi&agrave; cosa cercare e non devi rileggere tre volte.' },
    { id: 'c6', tipo: 'compiti', ico: '➗', titolo: 'Controlla al contrario',
      testo: 'Finita una divisione, moltiplica il risultato per il divisore: deve tornare il numero di partenza. Vale per quasi tutta la matematica: <b>l\'operazione inversa &egrave; il tuo correttore</b>.' },

    /* ---------------- aggiustare le cose ---------------- */
    { id: 'r1', tipo: 'riparare', ico: '🔌', titolo: 'Spegni e riaccendi (davvero)',
      testo: 'Funziona perch&eacute; svuota la memoria temporanea, dove si accumulano gli errori. Per essere sicuro, <b>stacca la spina 30 secondi</b>: molti apparecchi restano accesi a met&agrave; anche da spenti.' },
    { id: 'r2', tipo: 'riparare', ico: '🚲', titolo: 'La catena della bici',
      testo: 'Se la catena salta, quasi sempre &egrave; <b>troppo lenta o troppo sporca</b>. Puliscila con uno straccio e mettici una goccia d\'olio su ogni maglia, poi gira i pedali all\'indietro.' },
    { id: 'r3', tipo: 'riparare', ico: '🪛', titolo: 'Destra per stringere',
      testo: '<b>Orario si stringe, antiorario si allenta</b>: vale per quasi tutte le viti del mondo. Se una vite non si muove, prima prova a stringerla un pelo: spesso si sblocca e poi esce.' },
    { id: 'r4', tipo: 'riparare', ico: '🧊', titolo: 'Il freddo restringe, il caldo allarga',
      testo: 'Tappo del barattolo bloccato? Passa il coperchio sotto <b>l\'acqua calda</b>: il metallo si allarga pi&ugrave; del vetro e si apre. Lo stesso trucco apre le cerniere metalliche inceppate.' },
    { id: 'r5', tipo: 'riparare', ico: '📱', titolo: 'Telefono bagnato: mai il phon',
      testo: 'Il calore rovina la batteria e spinge l\'acqua pi&ugrave; dentro. Spegnilo subito, asciugalo fuori e lascialo <b>due giorni in un posto asciutto</b>. Il riso non serve quasi a niente: &egrave; una leggenda.' },
    { id: 'r6', tipo: 'riparare', ico: '✏️', titolo: 'La gomma per i contatti',
      testo: 'Telecomando che non va? Spesso sono i contatti delle pile ossidati. Strofinali con una <b>gomma da matita</b>: torna a funzionare come nuovo.' },

    /* ---------------- orientarsi ---------------- */
    { id: 'o1', tipo: 'orientarsi', ico: '🌞', titolo: 'Il sole come bussola',
      testo: 'Il sole sorge <b>a est</b> e tramonta <b>a ovest</b>. A mezzogiorno, da noi, sta a sud: se gli dai le spalle, davanti a te &egrave; nord, a destra est, a sinistra ovest.' },
    { id: 'o2', tipo: 'orientarsi', ico: '⌚', titolo: 'Il nord con l\'orologio',
      testo: 'Con un orologio a lancette: punta la <b>lancetta delle ore verso il sole</b>. A met&agrave; strada fra quella lancetta e le 12 c\'&egrave; il sud.' },
    { id: 'o3', tipo: 'orientarsi', ico: '⭐', titolo: 'Trovare la Stella Polare',
      testo: 'Nel Grande Carro, prendi le due stelle in fondo al "secchio" e prolungale <b>cinque volte</b> verso l\'alto: arrivi alla Stella Polare. Quella indica sempre il nord.' },
    { id: 'o4', tipo: 'orientarsi', ico: '🌲', titolo: 'Il muschio non &egrave; una bussola',
      testo: 'Si dice che cresca a nord, ma in realt&agrave; cresce <b>dove c\'&egrave; pi&ugrave; umido</b>. Usalo come indizio, mai come prova: meglio il sole o le stelle.' },
    { id: 'o5', tipo: 'orientarsi', ico: '🗺️', titolo: 'La mappa si gira',
      testo: 'Quando leggi una mappa, <b>ruotala</b> finch&eacute; quello che hai davanti nella realt&agrave; sta davanti anche sul foglio. Il cervello smette subito di fare confusione fra destra e sinistra.' },

    /* ---------------- come è nato ---------------- */
    { id: 'n1', tipo: 'nascita', ico: '💻', titolo: 'Com\'&egrave; nato il computer',
      testo: 'Nel 1936 Alan Turing immagin&ograve; una macchina che leggesse istruzioni da un nastro. Nel 1946 arriv&ograve; <b>ENIAC</b>: 30 tonnellate, una stanza intera, e faceva meno conti di una calcolatrice da tasca di oggi.' },
    { id: 'n2', tipo: 'nascita', ico: '🖱️', titolo: 'Com\'&egrave; nato il mouse',
      testo: 'Lo invent&ograve; Douglas Engelbart nel 1964: una <b>scatoletta di legno</b> con due rotelle. Si chiam&ograve; "topo" per via del filo che sembrava una coda.' },
    { id: 'n3', tipo: 'nascita', ico: '🌐', titolo: 'Com\'&egrave; nato il web',
      testo: 'Nel 1989 Tim Berners-Lee, al CERN, voleva solo far scambiare documenti ai ricercatori. Regal&ograve; l\'invenzione al mondo senza brevettarla: per questo il web &egrave; <b>di tutti</b>.' },
    { id: 'n4', tipo: 'nascita', ico: '🍕', titolo: 'Com\'&egrave; nata la pizza margherita',
      testo: 'Nel 1889 il pizzaiolo Raffaele Esposito la prepar&ograve; per la regina Margherita: pomodoro, mozzarella e basilico, i <b>colori della bandiera</b> italiana.' },
    { id: 'n5', tipo: 'nascita', ico: '⚽', titolo: 'Com\'&egrave; nato il calcio moderno',
      testo: 'Le regole furono scritte a Londra nel <b>1863</b>. La cosa pi&ugrave; discussa? Se fosse lecito prendere la palla con le mani: chi disse di s&igrave; se ne and&ograve; e invent&ograve; il rugby.' },
    { id: 'n6', tipo: 'nascita', ico: '🍦', titolo: 'Com\'&egrave; nato il cono gelato',
      testo: 'Alla fiera di Saint Louis del 1904 un gelataio fin&igrave; le coppette. Il vicino di banco vendeva cialde: le arrotol&ograve; a cono e nacque il <b>gelato da passeggio</b>.' },
    { id: 'n7', tipo: 'nascita', ico: '📮', titolo: 'Com\'&egrave; nato il post-it',
      testo: 'Era una <b>colla mal riuscita</b>: troppo debole. Per anni sembr&ograve; un fallimento, finch&eacute; a qualcuno venne in mente di usarla per segnalibri che si staccano.' },
    { id: 'n8', tipo: 'nascita', ico: '🎮', titolo: 'Com\'&egrave; nato il videogioco',
      testo: 'Nel 1958 un fisico, per far divertire i visitatori del laboratorio, colleg&ograve; un oscilloscopio a due manopole: <b>Tennis for Two</b>, il nonno di Pong.' },
    { id: 'n9', tipo: 'nascita', ico: '✏️', titolo: 'Com\'&egrave; nata la gomma sulla matita',
      testo: 'Prima si usavano <b>briciole di pane</b> per cancellare. Poi si scopr&igrave; che il caucci&ugrave; funzionava meglio, e nel 1858 qualcuno pens&ograve; di attaccarne un pezzetto in cima alla matita.' },

    /* ---------------- sapevi che ---------------- */
    { id: 'x1', tipo: 'sapevi', ico: '🐙', titolo: 'Il polpo ha tre cuori',
      testo: 'Due spingono il sangue nelle branchie, uno nel resto del corpo. E il suo sangue &egrave; <b>blu</b>, non rosso, perch&eacute; usa il rame al posto del ferro.' },
    { id: 'x2', tipo: 'sapevi', ico: '🍯', titolo: 'Il miele non scade',
      testo: 'Nelle piramidi hanno trovato vasi di miele di <b>3000 anni fa</b> ancora commestibili: &egrave; cos&igrave; povero d\'acqua e acido che i batteri non ci sopravvivono.' },
    { id: 'x3', tipo: 'sapevi', ico: '🌍', titolo: 'Stai correndo adesso',
      testo: 'Anche fermo sulla sedia stai girando con la Terra a circa <b>1600 km/h</b> all\'equatore, e insieme al pianeta corri intorno al Sole a 107.000 km/h.' },
    { id: 'x4', tipo: 'sapevi', ico: '🧠', titolo: 'Il cervello consuma come una lampadina',
      testo: 'Pesa il <b>2%</b> del tuo corpo ma si mangia il <b>20%</b> dell\'energia: circa 20 watt, come una lampadina a basso consumo sempre accesa.' },
    { id: 'x5', tipo: 'sapevi', ico: '🦈', titolo: 'Gli squali sono pi&ugrave; antichi degli alberi',
      testo: 'Nuotano da circa <b>400 milioni</b> di anni. I primi alberi sono arrivati dopo, e i dinosauri molto dopo ancora.' },
    { id: 'x6', tipo: 'sapevi', ico: '🐌', titolo: 'La lumaca ha migliaia di denti',
      testo: 'Sulla lingua ha una specie di raspa, la <b>radula</b>, con pi&ugrave; di 10.000 dentini che grattano via il cibo.' },
    { id: 'x7', tipo: 'sapevi', ico: '🌙', titolo: 'La Luna si allontana',
      testo: 'Di circa <b>3,8 cm all\'anno</b>: la distanza di un dito. Fra milioni di anni le eclissi totali di Sole non esisteranno pi&ugrave;.' },
    { id: 'x8', tipo: 'sapevi', ico: '⚡', titolo: 'Il fulmine &egrave; pi&ugrave; caldo del Sole',
      testo: 'L\'aria attraversata da un fulmine arriva a <b>30.000 gradi</b>: cinque volte la superficie del Sole. Il tuono &egrave; quell\'aria che esplode.' },
    { id: 'x9', tipo: 'sapevi', ico: '🐝', titolo: 'Le api ballano per parlare',
      testo: 'Tornata all\'alveare, l\'ape fa una <b>danza a otto</b>: l\'angolo dice la direzione del cibo rispetto al sole, la durata dice quanto &egrave; lontano.' },
    { id: 'x10', tipo: 'sapevi', ico: '🦴', titolo: 'Sei nato con pi&ugrave; ossa di adesso',
      testo: 'Un neonato ne ha circa <b>300</b>, un adulto <b>206</b>: crescendo, molte si saldano fra loro. Il cranio ne unisce da solo una ventina.' },
    { id: 'x11', tipo: 'sapevi', ico: '🕰️', titolo: 'Le Piramidi e Cleopatra',
      testo: 'Cleopatra &egrave; vissuta pi&ugrave; vicina a noi che alla costruzione della <b>Grande Piramide</b>: fra lei e le piramidi passano pi&ugrave; anni che fra lei e lo smartphone.' },
    { id: 'x12', tipo: 'sapevi', ico: '💧', titolo: 'L\'acqua che bevi &egrave; antichissima',
      testo: 'L\'acqua non si crea e non si distrugge: quella nel tuo bicchiere &egrave; passata dalle nuvole, dai fiumi e forse anche da un <b>dinosauro</b>.' },
    { id: 'x13', tipo: 'sapevi', ico: '🎵', titolo: 'La musica ti fa venire i brividi',
      testo: 'Quando una canzone ti piace davvero, il cervello rilascia <b>dopamina</b>, la stessa sostanza del cibo buono e delle belle notizie.' },
    { id: 'x14', tipo: 'sapevi', ico: '🐧', titolo: 'I pinguini si regalano sassi',
      testo: 'Alcuni pinguini scelgono il <b>sasso pi&ugrave; liscio</b> che trovano e lo offrono al compagno: se lo accetta, costruiscono il nido insieme.' },
    { id: 'x15', tipo: 'sapevi', ico: '🖐️', titolo: 'Le impronte non sono solo sulle dita',
      testo: 'Anche la <b>lingua</b> ha un disegno unico per ogni persona. E i koala hanno impronte digitali cos&igrave; simili alle nostre da confondere la polizia.' }
  ];

  BT.scoperta = function (id) {
    for (var i = 0; i < BT.CURIOSITA.length; i++)
      if (BT.CURIOSITA[i].id === id) return BT.CURIOSITA[i];
    return null;
  };

  BT.tipoScoperta = function (id) {
    for (var i = 0; i < BT.TIPI_SCOPERTA.length; i++)
      if (BT.TIPI_SCOPERTA[i].id === id) return BT.TIPI_SCOPERTA[i];
    return { id: id, nome: id, ico: '💡' };
  };

})(window.BT);
