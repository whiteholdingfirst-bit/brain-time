/* =========================================================
   BRAIN TIME — foto del giocatore
   Permette di usare una propria foto come avatar, presa
   dalla fotocamera oppure dalla galleria del dispositivo.
   La foto viene ritagliata quadrata e ridotta a 160x160
   prima di essere salvata: resta leggera e non esce mai
   dal dispositivo (o, online, dalla pagina condivisa).
   ========================================================= */
(function (BT) {
  'use strict';

  var LATO = 160;
  var QUALITA = 0.82;
  var stream = null;

  /* ---------- ritaglio quadrato + riduzione ---------- */
  function riduci(sorgente, larghezza, altezza, ok) {
    var lato = Math.min(larghezza, altezza);
    var sx = (larghezza - lato) / 2;
    var sy = (altezza - lato) / 2;

    var c = document.createElement('canvas');
    c.width = LATO; c.height = LATO;
    var ctx = c.getContext('2d');
    ctx.drawImage(sorgente, sx, sy, lato, lato, 0, 0, LATO, LATO);
    try { ok(c.toDataURL('image/jpeg', QUALITA)); }
    catch (e) { ok(null); }
  }

  function daFile(file, ok, errore) {
    if (!file) { errore('Nessun file scelto.'); return; }
    if (file.size > 12 * 1024 * 1024) { errore('Immagine troppo grande (oltre 12 MB).'); return; }
    var r = new FileReader();
    r.onload = function () {
      var img = new Image();
      img.onload = function () { riduci(img, img.naturalWidth, img.naturalHeight, ok); };
      img.onerror = function () { errore('Non riesco a leggere questa immagine.'); };
      img.src = r.result;
    };
    r.onerror = function () { errore('Non riesco a leggere il file.'); };
    r.readAsDataURL(file);
  }

  /* ---------- input nascosto riutilizzabile ---------- */
  function apriSelettore(conFotocamera, ok, errore) {
    var input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    if (conFotocamera) input.setAttribute('capture', 'user');
    input.style.display = 'none';
    document.body.appendChild(input);
    input.onchange = function () {
      var f = input.files && input.files[0];
      document.body.removeChild(input);
      daFile(f, ok, errore);
    };
    input.click();
  }

  BT.foto = {

    /* galleria / file del computer */
    daGalleria: function (ok, errore) { apriSelettore(false, ok, errore); },

    /* ripiego per la fotocamera quando non c'e' accesso diretto:
       su telefono e tablet apre direttamente l'app fotocamera */
    daFotocameraDiSistema: function (ok, errore) { apriSelettore(true, ok, errore); },

    /* la fotocamera dal vivo e' disponibile? */
    fotocameraDisponibile: function () {
      return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia &&
                window.HTMLCanvasElement);
    },

    /* accende la fotocamera dentro l'elemento indicato.
       chiama pronto() se ci riesce, errore(msg) se no. */
    accendi: function (contenitore, pronto, errore) {
      if (!BT.foto.fotocameraDisponibile()) { errore('senza-supporto'); return; }

      navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false })
        .then(function (s) {
          stream = s;
          var video = document.createElement('video');
          video.setAttribute('playsinline', '');
          video.setAttribute('muted', '');
          video.muted = true;
          video.autoplay = true;
          video.className = 'cam-video';
          video.srcObject = s;
          contenitore.innerHTML = '';
          contenitore.appendChild(video);
          video.play().catch(function () {});
          pronto(video);
        })
        .catch(function (e) {
          var motivo = (e && (e.name === 'NotAllowedError' || e.name === 'SecurityError'))
            ? 'permesso-negato' : 'non-disponibile';
          errore(motivo);
        });
    },

    /* scatta il fotogramma corrente */
    scatta: function (video, ok) {
      if (!video || !video.videoWidth) { ok(null); return; }
      riduci(video, video.videoWidth, video.videoHeight, ok);
    },

    spegni: function () {
      if (stream) {
        stream.getTracks().forEach(function (t) { try { t.stop(); } catch (e) {} });
        stream = null;
      }
    }
  };

})(window.BT);
