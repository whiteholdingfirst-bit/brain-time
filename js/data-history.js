/* =========================================================
   BRAIN TIME — STORIA
   Dalla preistoria ai giorni nostri, tre livelli.
   Formato riga: [domanda, giusta, sbagliata, sbagliata, sbagliata, spiegazione]
   ========================================================= */
(function (BT) {
  'use strict';

  var elem5 = [
    ['Come si chiama il periodo in cui l\'uomo non conosceva ancora la scrittura?', 'Preistoria', 'Medioevo', 'Antichit&agrave;', 'Rinascimento', 'La storia inizia con l\'invenzione della scrittura, circa 3.500 anni prima di Cristo.'],
    ['Quale scoperta cambi&ograve; la vita dell\'uomo preistorico permettendogli di cuocere il cibo e scaldarsi?', 'Il fuoco', 'La ruota', 'Il ferro', 'La scrittura', 'Il controllo del fuoco &egrave; una delle conquiste pi&ugrave; importanti della preistoria.'],
    ['Nel Neolitico l\'uomo impar&ograve; soprattutto a...', 'Coltivare la terra e allevare animali', 'Costruire automobili', 'Navigare in oceano', 'Fondere l\'acciaio', 'La rivoluzione neolitica trasform&ograve; i cacciatori in agricoltori.'],
    ['Dove nacque la civilt&agrave; degli antichi Egizi?', 'Lungo il fiume Nilo', 'Sulle Alpi', 'Lungo il Tevere', 'In Grecia', 'Il Nilo con le sue piene rendeva fertile la terra.'],
    ['A cosa servivano le piramidi egizie?', 'Erano tombe dei faraoni', 'Erano scuole', 'Erano mercati', 'Erano teatri', 'Custodivano il corpo e i tesori del faraone.'],
    ['Chi erano gli antichi Greci famosi per aver inventato la democrazia?', 'Gli Ateniesi', 'Gli Spartani', 'I Fenici', 'I Sumeri', 'Ad Atene i cittadini votavano nell\'assemblea.'],
    ['Secondo la leggenda, chi fond&ograve; Roma nel 753 a.C.?', 'Romolo', 'Remo', 'Cesare', 'Enea', 'Romolo uccise il fratello Remo e diede il nome alla citt&agrave;.'],
    ['Come si chiamavano i soldati dell\'esercito romano?', 'Legionari', 'Cavalieri', 'Gladiatori', 'Centauri', 'Erano organizzati in legioni.'],
    ['Chi era Giulio Cesare?', 'Un generale e politico romano', 'Un faraone egizio', 'Un re greco', 'Un navigatore portoghese', 'Fu ucciso nel 44 a.C. alle Idi di marzo.'],
    ['In quale anno cadde l\'Impero Romano d\'Occidente?', '476 d.C.', '1492', '1000 a.C.', '753 a.C.', 'La caduta segna la fine dell\'et&agrave; antica e l\'inizio del Medioevo.'],
    ['Nel Medioevo il castello serviva soprattutto a...', 'Difendere il territorio del signore', 'Ospitare i turisti', 'Coltivare il grano', 'Custodire le navi', 'Era la residenza fortificata del signore feudale.'],
    ['Chi lavorava la terra del signore nel sistema feudale?', 'I contadini (servi della gleba)', 'I cavalieri', 'I re', 'I mercanti', 'In cambio ricevevano protezione e una parte del raccolto.'],
    ['Chi arriv&ograve; in America nel 1492?', 'Cristoforo Colombo', 'Marco Polo', 'Amerigo Vespucci', 'Ferdinando Magellano', 'Part&igrave; dalla Spagna cercando una via per le Indie.'],
    ['Chi era Leonardo da Vinci?', 'Un artista e inventore del Rinascimento', 'Un imperatore romano', 'Un navigatore spagnolo', 'Un faraone', 'Dipinse la Gioconda e progett&ograve; macchine volanti.'],
    ['Chi invent&ograve; la stampa a caratteri mobili in Europa?', 'Johannes Gutenberg', 'Galileo Galilei', 'Cristoforo Colombo', 'Leonardo da Vinci', 'Intorno al 1450: i libri divennero molto pi&ugrave; diffusi.'],
    ['Chi &egrave; considerato l\'"eroe dei due mondi" dell\'Unit&agrave; d\'Italia?', 'Giuseppe Garibaldi', 'Camillo Benso di Cavour', 'Giuseppe Mazzini', 'Vittorio Emanuele II', 'Guid&ograve; la spedizione dei Mille nel 1860.'],
    ['In quale anno fu proclamato il Regno d\'Italia?', '1861', '1492', '1789', '1946', 'Il primo re fu Vittorio Emanuele II.'],
    ['Che cosa fu la Prima Guerra Mondiale?', 'Un conflitto combattuto dal 1914 al 1918', 'Una guerra del Medioevo', 'Una battaglia romana', 'Una guerra del 1500', 'L\'Italia entr&ograve; in guerra nel 1915.'],
    ['In che anno fin&igrave; la Seconda Guerra Mondiale?', '1945', '1918', '1939', '1961', 'Termin&ograve; con la sconfitta di Germania e Giappone.'],
    ['Che cosa si vot&ograve; in Italia il 2 giugno 1946?', 'Se mantenere la monarchia o diventare repubblica', 'Il nuovo re', 'L\'ingresso in guerra', 'Il presidente degli Stati Uniti', 'Vinse la Repubblica: &egrave; la Festa della Repubblica.'],
    ['Chi fu il primo uomo a mettere piede sulla Luna nel 1969?', 'Neil Armstrong', 'Yuri Gagarin', 'Buzz Aldrin', 'Christa McAuliffe', 'Yuri Gagarin fu invece il primo uomo nello spazio, nel 1961.'],
    ['Che cos\'era il Muro di Berlino, caduto nel 1989?', 'Un muro che divideva in due la citt&agrave; di Berlino', 'Un monumento romano', 'Una diga', 'Un castello medievale', 'La sua caduta simboleggia la fine della Guerra Fredda.'],
    ['Chi erano i Sumeri?', 'Un popolo della Mesopotamia che invent&ograve; la scrittura cuneiforme', 'Un popolo delle Ande', 'Gli abitanti di Sparta', 'Gli antichi abitanti di Roma', 'Vivevano fra i fiumi Tigri ed Eufrate.'],
    ['Quale animale usavano gli Egizi per arare i campi?', 'Il bue', 'Il cammello', 'L\'elefante', 'Il cavallo da corsa', 'I buoi trainavano gli aratri lungo il Nilo.'],
    ['Che cos\'&egrave; il Colosseo?', 'Un anfiteatro romano dove si tenevano i giochi', 'Un tempio greco', 'Una chiesa medievale', 'Un palazzo rinascimentale', 'Poteva ospitare decine di migliaia di spettatori.']
  ];

  var media2 = [
    ['Che cosa fu la rivoluzione neolitica?', 'Il passaggio da caccia e raccolta ad agricoltura e allevamento', 'L\'invenzione del motore', 'La scoperta dell\'America', 'La nascita delle citt&agrave; industriali', 'Circa 10.000 anni fa cambi&ograve; radicalmente il modo di vivere.'],
    ['Quale codice di leggi babilonese &egrave; famoso per la legge del taglione?', 'Il codice di Hammurabi', 'Le Dodici Tavole', 'La Magna Charta', 'Il codice civile', '"Occhio per occhio, dente per dente".'],
    ['Che cosa furono le guerre puniche?', 'I conflitti fra Roma e Cartagine', 'Le guerre fra Atene e Sparta', 'Le crociate in Terrasanta', 'Le guerre napoleoniche', 'Annibale attravers&ograve; le Alpi con gli elefanti.'],
    ['Chi fu il primo imperatore romano?', 'Ottaviano Augusto', 'Giulio Cesare', 'Nerone', 'Costantino', 'Ottenne il titolo di Augusto nel 27 a.C.'],
    ['Con quale editto Costantino concesse la libert&agrave; di culto ai cristiani?', 'Editto di Milano (313 d.C.)', 'Editto di Nantes', 'Editto di Worms', 'Editto di Costantinopoli', 'Segn&ograve; la fine delle persecuzioni.'],
    ['Chi fu incoronato imperatore del Sacro Romano Impero nell\'800?', 'Carlo Magno', 'Federico Barbarossa', 'Ottone I', 'Clodoveo', 'L\'incoronazione avvenne a Roma il giorno di Natale.'],
    ['Che cosa furono le crociate?', 'Spedizioni militari cristiane verso la Terrasanta', 'Guerre fra citt&agrave; italiane', 'Viaggi commerciali in Cina', 'Rivolte contadine', 'La prima part&igrave; nel 1096.'],
    ['Che cos\'era un Comune nel Medioevo italiano?', 'Una citt&agrave; che si governava da s&eacute;', 'Un villaggio di contadini', 'Un ordine religioso', 'Un tipo di castello', 'I Comuni si scontrarono con l\'imperatore a Legnano nel 1176.'],
    ['Che cosa fu la peste nera del 1348?', 'Un\'epidemia che uccise circa un terzo della popolazione europea', 'Una carestia in Egitto', 'Una guerra fra Francia e Inghilterra', 'Un terremoto in Italia', 'Boccaccio la descrive nel Decameron.'],
    ['Chi teorizz&ograve; che la Terra gira intorno al Sole nel 1543?', 'Niccol&ograve; Copernico', 'Galileo Galilei', 'Isaac Newton', 'Tolomeo', 'Galileo difese poi la teoria copernicana.'],
    ['Che cosa fu la Riforma protestante iniziata nel 1517?', 'La contestazione della Chiesa di Roma avviata da Martin Lutero', 'Una riforma dell\'esercito romano', 'Un cambiamento del calendario', 'Una riforma scolastica', 'Lutero affisse le 95 tesi a Wittenberg.'],
    ['In che anno inizi&ograve; la Rivoluzione francese?', '1789', '1776', '1815', '1848', 'Il 14 luglio 1789 fu presa la Bastiglia.'],
    ['Quali erano i tre principi della Rivoluzione francese?', 'Libert&agrave;, uguaglianza, fraternit&agrave;', 'Ordine, disciplina, lavoro', 'Fede, patria, famiglia', 'Pace, pane, terra', 'Sono ancora il motto della Repubblica francese.'],
    ['Che cosa fu la rivoluzione industriale?', 'Il passaggio dalla produzione artigianale a quella con le macchine', 'Una rivolta di operai francesi', 'La nascita delle corporazioni medievali', 'Una riforma agraria romana', 'Inizi&ograve; in Inghilterra nel Settecento con la macchina a vapore.'],
    ['Chi furono i protagonisti politici del Risorgimento italiano?', 'Cavour, Mazzini, Garibaldi', 'Cesare, Augusto, Nerone', 'Dante, Petrarca, Boccaccio', 'Marconi, Fermi, Meucci', 'Ciascuno con una visione diversa dell\'unit&agrave;.'],
    ['Quale evento fece scoppiare la Prima Guerra Mondiale nel 1914?', 'L\'attentato di Sarajevo all\'arciduca Francesco Ferdinando', 'L\'invasione della Polonia', 'La presa della Bastiglia', 'L\'affondamento del Titanic', 'Innesc&ograve; il sistema delle alleanze.'],
    ['Che cosa fu il fascismo?', 'Il regime autoritario guidato da Mussolini dal 1922 al 1943', 'Un partito francese dell\'Ottocento', 'Una corrente artistica', 'Un movimento religioso medievale', 'Aboli&igrave; le libert&agrave; politiche e la stampa libera.'],
    ['Che cosa fu la Shoah?', 'Lo sterminio degli ebrei d\'Europa durante la Seconda Guerra Mondiale', 'Una battaglia navale', 'Una carestia in India', 'Un trattato di pace', 'Il 27 gennaio &egrave; il Giorno della Memoria.'],
    ['Che cosa fu la Resistenza italiana?', 'La lotta partigiana contro nazisti e fascisti fra il 1943 e il 1945', 'Una rivolta contadina del Settecento', 'Uno sciopero degli operai nel 1900', 'Una campagna militare in Africa', 'Si celebra il 25 aprile.'],
    ['Che cosa fu la Guerra Fredda?', 'Il confronto fra Stati Uniti e Unione Sovietica dal 1947 al 1991', 'Una guerra combattuta in Antartide', 'Un conflitto medievale', 'Una guerra fra Italia e Austria', 'Non ci fu scontro diretto, ma tensione continua.'],
    ['Quale trattato del 1957 diede origine alla Comunit&agrave; Economica Europea?', 'I Trattati di Roma', 'Il Trattato di Versailles', 'Il Trattato di Maastricht', 'Il Congresso di Vienna', 'Maastricht (1992) trasform&ograve; poi la CEE in Unione Europea.'],
    ['Che cosa accadde in Italia nel 1948?', 'Entr&ograve; in vigore la Costituzione della Repubblica', 'Cadde la monarchia', 'Fin&igrave; la guerra', 'Nacque la CEE', 'La Costituzione fu approvata nel 1947 ed entr&ograve; in vigore il 1 gennaio 1948.'],
    ['Chi era Alessandro Magno?', 'Il re macedone che conquist&ograve; un immenso impero fino all\'India', 'Un imperatore romano', 'Un faraone egizio', 'Un condottiero cartaginese', 'Mor&igrave; a soli 32 anni nel 323 a.C.'],
    ['Che cosa fu il Rinascimento?', 'Il grande fiorire di arte e cultura fra Quattrocento e Cinquecento', 'Una guerra di religione', 'Un periodo di carestie', 'Una dinastia di re francesi', 'Firenze fu uno dei suoi centri principali.'],
    ['Quale civilt&agrave; precolombiana fu conquistata da Hern&aacute;n Cort&eacute;s?', 'Gli Aztechi', 'Gli Inca', 'I Maya', 'I Sioux', 'Pizarro conquist&ograve; invece gli Inca.']
  ];

  var adulti = [
    ['Quale evento segna convenzionalmente l\'inizio dell\'et&agrave; moderna?', 'La scoperta dell\'America (1492)', 'La caduta di Roma (476)', 'La Rivoluzione francese (1789)', 'La Prima Guerra Mondiale (1914)', 'Alcuni storici indicano anche la caduta di Costantinopoli, nel 1453.'],
    ['Che cosa stabil&igrave; la Pace di Westfalia del 1648?', 'Il principio della sovranit&agrave; degli Stati, chiudendo la Guerra dei Trent\'anni', 'La divisione dell\'Impero romano', 'L\'unificazione della Germania', 'La fine delle crociate', '&Egrave; considerata la nascita del moderno sistema degli Stati.'],
    ['Chi guid&ograve; il Congresso di Vienna del 1815?', 'Il cancelliere austriaco Metternich', 'Napoleone Bonaparte', 'Otto von Bismarck', 'Camillo Benso di Cavour', 'Ridisegn&ograve; l\'Europa dopo la sconfitta di Napoleone.'],
    ['Che cosa fu la Comune di Parigi del 1871?', 'Un governo rivoluzionario cittadino durato circa due mesi', 'Il primo parlamento francese', 'Un accordo commerciale', 'Una riforma agraria', 'Fu repressa nel sangue nella "settimana di sangue".'],
    ['Quale politica adott&ograve; Bismarck per unificare la Germania?', 'La Realpolitik, unendo diplomazia e guerre mirate', 'La non violenza', 'L\'isolamento economico', 'Il federalismo pacifico', 'Culmin&ograve; nella proclamazione dell\'Impero a Versailles nel 1871.'],
    ['Che cosa sanciva il Trattato di Versailles del 1919?', 'Le durissime condizioni imposte alla Germania sconfitta', 'La nascita dell\'ONU', 'La fine della Guerra Fredda', 'L\'unit&agrave; d\'Italia', 'Le riparazioni contribuirono all\'instabilit&agrave; degli anni Trenta.'],
    ['Che cosa fu il New Deal?', 'Il programma di riforme di Roosevelt contro la Grande Depressione', 'Un patto militare fra Francia e Inghilterra', 'La riforma agraria sovietica', 'Un trattato commerciale europeo', 'Avviato dal 1933 negli Stati Uniti.'],
    ['Che cosa fu il patto Molotov-Ribbentrop del 1939?', 'Il patto di non aggressione fra Germania nazista e Unione Sovietica', 'L\'alleanza fra Italia e Germania', 'Il trattato che chiuse la Prima Guerra Mondiale', 'L\'accordo di Monaco sui Sudeti', 'Conteneva un protocollo segreto per spartirsi la Polonia.'],
    ['Che cosa fu il Piano Marshall?', 'Il programma statunitense di aiuti economici per ricostruire l\'Europa', 'Un piano militare per invadere la Normandia', 'Un progetto di riarmo sovietico', 'Un accordo sul carbone e l\'acciaio', 'Avviato nel 1947-1948.'],
    ['In che anno cadde il Muro di Berlino?', '1989', '1991', '1985', '1993', 'L\'URSS si sciolse formalmente nel dicembre 1991.'],
    ['Che cos\'era la cortina di ferro?', 'La linea che divideva l\'Europa occidentale da quella sovietica', 'Una fortificazione medievale', 'Un sistema doganale europeo', 'Una linea difensiva della Prima Guerra Mondiale', 'Espressione resa celebre da Winston Churchill nel 1946.'],
    ['Che cosa fu la crisi dei missili di Cuba del 1962?', 'Il momento di massima tensione nucleare fra USA e URSS', 'Una rivolta interna cubana', 'Un embargo commerciale europeo', 'Una guerra civile in America Latina', 'Si risolse con il ritiro dei missili sovietici.'],
    ['Quale documento inglese del 1215 limit&ograve; per primo il potere del re?', 'La Magna Charta Libertatum', 'Il Bill of Rights', 'L\'Habeas Corpus Act', 'La Petition of Right', 'Considerata un antenato del costituzionalismo moderno.'],
    ['Che cosa fu il colonialismo dell\'Ottocento?', 'L\'espansione delle potenze europee su Africa e Asia', 'La colonizzazione delle Americhe nel Cinquecento', 'La migrazione verso gli Stati Uniti', 'Un movimento culturale', 'La Conferenza di Berlino del 1884-85 spart&igrave; l\'Africa.'],
    ['Che cosa furono gli anni di piombo in Italia?', 'Il periodo di terrorismo e violenza politica fra anni Settanta e Ottanta', 'La crisi economica del 1929', 'Il ventennio fascista', 'Il boom economico', 'Culminarono con il rapimento e l\'omicidio di Aldo Moro nel 1978.'],
    ['Che cosa fu il boom economico italiano?', 'La forte crescita industriale fra il 1958 e il 1963', 'La ripresa dopo la crisi del 2008', 'L\'industrializzazione dell\'Ottocento', 'Il periodo fascista', 'Trasform&ograve; l\'Italia in un Paese industriale.'],
    ['Chi fu Nelson Mandela?', 'Il leader sudafricano che guid&ograve; la fine dell\'apartheid', 'Un presidente statunitense', 'Un premier indiano', 'Un rivoluzionario cubano', 'Divenne presidente del Sudafrica nel 1994 dopo 27 anni di carcere.'],
    ['Che cosa fu la Rivoluzione d\'Ottobre del 1917?', 'La presa del potere dei bolscevichi in Russia', 'La caduta dello zar a febbraio', 'La rivoluzione cinese', 'La rivolta ungherese', 'Port&ograve; alla nascita dell\'Unione Sovietica.'],
    ['In quale anno &egrave; nata l\'ONU?', '1945', '1919', '1948', '1957', 'Nacque dopo la Seconda Guerra Mondiale per garantire la pace.'],
    ['Che cosa stabil&igrave; il Trattato di Maastricht del 1992?', 'La nascita dell\'Unione Europea e le basi della moneta unica', 'La fine della Guerra Fredda', 'L\'ingresso della Gran Bretagna nella CEE', 'La riunificazione tedesca', 'L\'euro entr&ograve; in circolazione nel 2002.'],
    ['Quale impero cadde nel 1453 con la presa di Costantinopoli?', 'L\'Impero bizantino', 'L\'Impero romano d\'Occidente', 'L\'Impero ottomano', 'Il Sacro Romano Impero', 'La citt&agrave; fu conquistata da Maometto II.'],
    ['Che cosa fu l\'Illuminismo?', 'Il movimento culturale settecentesco che poneva la ragione al centro', 'Una corrente pittorica del Seicento', 'Una riforma religiosa medievale', 'Una scuola filosofica greca', 'Voltaire, Rousseau e Diderot ne furono protagonisti.'],
    ['Che cosa accadde l\'11 settembre 2001?', 'Gli attentati alle Torri Gemelle e al Pentagono', 'La caduta del Muro di Berlino', 'L\'inizio della guerra del Golfo', 'La nascita dell\'euro', 'Segn&ograve; l\'inizio della "guerra al terrorismo".'],
    ['Chi fu Costantino il Grande?', 'L\'imperatore che leg&ograve; l\'Impero al cristianesimo e fond&ograve; Costantinopoli', 'Il primo imperatore romano', 'L\'ultimo imperatore d\'Occidente', 'Un imperatore bizantino del Mille', 'Regn&ograve; dal 306 al 337 d.C.'],
    ['Che cosa fu la Guerra dei Cent\'anni?', 'Il lungo conflitto fra Francia e Inghilterra dal 1337 al 1453', 'Una guerra fra Spagna e Portogallo', 'Un conflitto fra Comuni italiani', 'Una guerra di religione tedesca', 'Vi si distinse Giovanna d\'Arco.']
  ];

  function make(rows) {
    return rows.map(function (r) {
      return function () { return BT.fromRow(r, 'history'); };
    });
  }

  BT.HISTORY = { elem5: make(elem5), media2: make(media2), adulti: make(adulti) };

})(window.BT);
