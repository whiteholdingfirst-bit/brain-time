/* =========================================================
   BRAIN TIME — "mettilo sulla Home", dentro il gioco

   Prima c'era una pagina che spiegava come si fa. Riferito dopo
   averla data ai compagni di classe: *"fanno fatica a seguire le
   istruzioni e giocano dal browser"*.

   La lezione, e vale per tutto: delle istruzioni che nessuno legge
   non si riscrivono meglio, si **tolgono**. Su Android e su
   computer il browser sa installare da solo: serve un tasto, non un
   elenco di passi. Su iPhone un tasto non si puo' avere - Apple non
   lo permette - quindi restano due passi, ma disegnati e dentro il
   gioco, non su un'altra pagina.

   Tre regole che tengono in piedi tutto il file:

   1. NON SI VEDE SUBITO. Chiedere di installare a chi e' appena
      arrivato e' come chiedere il numero di telefono all'ingresso.
      La barra compare quando il giocatore ha gia' risposto a
      qualcosa, oppure alla seconda volta che apre il gioco.
   2. NON SI VEDE MAI DURANTE UNA PARTITA. Coprirebbe le risposte,
      e interrompere chi sta giocando per vendergli qualcosa e' il
      modo piu' veloce per farsi chiudere in faccia.
   3. SI PUO' DIRE DI NO, E IL NO DURA. Chi la scaccia non la rivede
      per due settimane. Senza questo diventa una zanzara.
   ========================================================= */
(function (BT) {
  'use strict';

  var CHIAVE = 'brain-time-installa';
  var GIORNI_SILENZIO = 14;
  var PRONTO = null;        // l'invito di Chrome, se e quando arriva
  var barra = null;
  /* quante volte si e' gia' affacciata da quando il gioco e' aperto.
     Due e' il tetto: una al menu e una a fine partita. Senza tetto
     ricomparirebbe a ogni ritorno al menu, cioe' continuamente. */
  var volte = 0;
  var TETTO_PER_SESSIONE = 2;

  /* --- memoria del dispositivo, non del profilo ---
     Chi ha gia' detto di no e' il telefono, non il giocatore: se
     Gabri la scaccia, non ha senso riproporla a Diego sullo stesso
     telefono. Sta fuori da BT.store apposta.
     Tutto in try/catch: in incognito localStorage esplode, e una
     barra pubblicitaria non puo' essere il motivo per cui il gioco
     non parte. */
  function leggi() {
    try { return JSON.parse(localStorage.getItem(CHIAVE)) || {}; }
    catch (e) { return {}; }
  }
  function scrivi(o) {
    try { localStorage.setItem(CHIAVE, JSON.stringify(o)); } catch (e) {}
  }

  /* --- che dispositivo e' --- */
  function iPhone() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) ||
           /* iPad recenti si spacciano per Mac: li tradisce il dito */
           (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  }
  function comeApp() {
    return window.navigator.standalone === true ||
           (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches);
  }

  /* Chrome ed Edge avvisano prima di mostrare la loro iconcina: se ci
     danno l'invito, ce lo teniamo da parte e lo useremo al momento
     buono. Il listener va registrato subito, non dentro init(): se
     l'evento arriva prima, e' perso per sempre. */
  window.addEventListener('beforeinstallprompt', function (e) {
    e.preventDefault();
    PRONTO = e;
  });

  window.addEventListener('appinstalled', function () {
    nascondi();
    scrivi({ fatto: true });
  });

  /* --- la freccia del tasto Condividi di iOS ---
     Disegnata, non descritta: "il quadrato con la freccia che esce"
     e' una frase che un bambino deve prima decifrare e poi cercare.
     Il disegno lo riconosce e basta. */
  function iconaCondividi() {
    return '<svg class="inst-ico" viewBox="0 0 24 24" aria-hidden="true">' +
      '<path d="M12 3v12M12 3l-3.5 3.5M12 3l3.5 3.5" fill="none" stroke="currentColor" ' +
        'stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<path d="M6 11H4.5v9h15v-9H18" fill="none" stroke="currentColor" ' +
        'stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>' +
      '</svg>';
  }

  function costruisci() {
    var el = document.createElement('div');
    el.className = 'inst-barra';
    el.id = 'inst-barra';

    var dentro;
    if (PRONTO) {
      /* Android e computer: un tasto, e il browser fa il resto */
      dentro = '<div class="inst-testo"><b class="inst-tit">Mettilo sulla Home</b>' +
          '<span>Si apre a schermo intero, anche senza internet.</span></div>' +
        '<button class="inst-si" id="inst-si">Aggiungi</button>';
    } else {
      /* iPhone: due passi, con la freccia disegnata */
      dentro = '<div class="inst-testo"><b class="inst-tit">Mettilo sulla Home</b>' +
          '<span>Tocca ' + iconaCondividi() + ' qui sotto, poi <b>Aggiungi a Home</b>.</span></div>';
    }

    el.innerHTML = dentro +
      '<button class="inst-no" id="inst-no" aria-label="No grazie">&times;</button>';
    document.body.appendChild(el);

    var si = el.querySelector('#inst-si');
    if (si) si.onclick = function () {
      if (!PRONTO) return;
      PRONTO.prompt();
      PRONTO.userChoice.then(function (scelta) {
        PRONTO = null;
        nascondi();
        if (scelta.outcome === 'accepted') {
          scrivi({ fatto: true });
        } else {
          /* ha detto no al browser, non a noi: stesso silenzio */
          scrivi({ rifiutatoIl: Date.now() });
        }
      });
    };

    el.querySelector('#inst-no').onclick = function () {
      nascondi();
      scrivi({ rifiutatoIl: Date.now() });
    };

    return el;
  }

  function nascondi() {
    if (barra) barra.classList.remove('su');
    document.body.classList.remove('con-inst');
    document.body.style.paddingBottom = '';
  }

  BT.installa = {

    /* Si chiama a ogni apertura del gioco: conta le visite, cosi'
       chi torna una seconda volta e' uno a cui il gioco e' piaciuto. */
    avvio: function () {
      if (comeApp()) { scrivi({ fatto: true }); return; }
      var m = leggi();
      if (m.fatto) return;
      m.visite = (m.visite || 0) + 1;
      scrivi(m);
    },

    /* Il momento buono: il menu o la schermata di fine partita.
       'haGiocato' e' vero quando il giocatore ha gia' risposto a
       qualcosa - chiedere prima non ha senso, non sa ancora se gli
       piace. */
    forse: function (haGiocato) {
      if (volte >= TETTO_PER_SESSIONE || comeApp()) return;

      var m = leggi();
      if (m.fatto) return;
      if (m.rifiutatoIl && Date.now() - m.rifiutatoIl < GIORNI_SILENZIO * 864e5) return;

      /* Su un computer senza invito del browser non c'e' niente da
         offrire: Firefox e Safari desktop non installano, e una barra
         che dice "fai da te" e' peggio del silenzio. Su iPhone invece
         l'invito non arriva mai ma i due passi esistono davvero. */
      if (!PRONTO && !iPhone()) return;

      if (!haGiocato && (m.visite || 0) < 2) return;

      /* Si ricostruisce ogni volta, non si riusa. Il motivo: l'invito
         di Chrome puo' arrivare **dopo** che la barra e' stata
         costruita (il browser lo manda quando gli pare, a volte
         secondi dopo il caricamento). Una barra costruita prima
         mostrerebbe per sempre i due passi di iPhone su un Android che
         nel frattempo saprebbe installare con un tasto solo. */
      if (barra) barra.remove();
      barra = costruisci();
      volte++;
      document.body.classList.add('con-inst');
      /* ⚠️ Serve far ricalcolare il layout prima di aggiungere la
         classe, se no la transizione non parte: l'elemento e' appena
         nato e il browser non ha ancora uno stato "da cui" muoversi.

         NON con requestAnimationFrame. In una scheda in secondo piano
         (e nel pannello di anteprima) i fotogrammi non arrivano mai, e
         la barra resterebbe fuori dallo schermo per sempre: non e'
         un'animazione mancata, e' il tasto che non si vede. Stessa
         regola di juice.js - niente di necessario dentro un frame.
         'void offsetWidth' e' sincrono e funziona sempre. */
      void barra.offsetWidth;
      barra.classList.add('su');

      /* Lo spazio da lasciare sotto non e' un numero fisso: dipende da
         quante righe va a capo il testo, che su uno schermo stretto
         sono tre e su uno largo una. Misurarlo e' una riga; indovinarlo
         vuol dire o uno scalino vuoto o l'ultimo tasto coperto. */
      document.body.style.paddingBottom = (barra.offsetHeight + 12) + 'px';
    },

    /* Durante una partita sparisce: coprirebbe le risposte.
       Il contatore NON si azzera: tornare al menu non deve ridare
       diritto a un'altra comparsa. */
    viaDalloSchermo: function () { nascondi(); },

    /* Il tasto "Mettilo sul telefono" e' una richiesta esplicita,
       quindi scavalca sia il silenzio dei quattordici giorni sia il
       tetto per sessione. Risponde false quando non ha niente da
       offrire (Firefox, Safari su Mac): li' il tasto deve lasciar
       andare il giocatore sulla pagina delle istruzioni. */
    subito: function () {
      if (comeApp()) return false;
      if (!PRONTO && !iPhone()) return false;
      volte = 0;
      scrivi({ visite: (leggi().visite || 0) });   /* dimentica il "no" */
      BT.installa.forse(true);
      return true;
    }
  };

})(window.BT);
