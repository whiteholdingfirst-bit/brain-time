/* =========================================================
   BRAIN TIME — service worker

   Serve a due cose: rendere il gioco installabile come app
   (icona sulla schermata, finestra senza barra) e farlo
   funzionare anche senza internet, come gia' fa quando si
   apre col doppio click.

   Strategia: prima la copia salvata, poi la rete. Il gioco
   non ha dati che arrivano da fuori, quindi la copia locale
   non "invecchia" mai in modo pericoloso.

   Quando si aggiorna il gioco va cambiata la VERSIONE qui
   sotto: e' quello che fa buttare via la copia vecchia.
   ========================================================= */
var VERSIONE = 'brain-time-2026-08-30';

var FILE = [
  './',
  './index.html',
  './manifest.json',
  './css/style.css',
  './icona.svg',
  './icone/icona-192.png',
  './icone/icona-512.png',
  './icone/icona-180.png',
  './js/util.js',
  './js/sfx.js',
  './js/foto.js',
  './js/storage.js',
  './js/data-math.js',
  './js/data-logic.js',
  './js/data-lang.js',
  './js/data-history.js',
  './js/data-culture.js',
  './js/data-chess.js',
  './js/data-curiosita.js',
  './js/bank.js',
  './js/game.js',
  './js/musica.js',
  './js/casse.js',
  './js/laby.js',
  './js/data-lingue.js',
  './js/lingue.js',
  './js/fusione.js',
  './js/limite.js',
  './js/app.js'
];
/* js/config-locale.js non e' nell'elenco di proposito: sta fuori dal
   repository, quindi online non esiste e farebbe fallire l'installazione. */

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(VERSIONE).then(function (c) {
      /* uno per uno: se un file manca, gli altri si salvano lo stesso */
      return Promise.all(FILE.map(function (f) {
        return c.add(f).catch(function () { return null; });
      }));
    }).then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (nomi) {
      return Promise.all(nomi.map(function (n) {
        if (n !== VERSIONE) return caches.delete(n);
        return null;
      }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (e) {
  var r = e.request;
  if (r.method !== 'GET') return;
  /* il font di Google va alla rete: se non c'e', il ripiego di sistema basta */
  if (new URL(r.url).origin !== self.location.origin) return;

  e.respondWith(
    caches.match(r).then(function (salvata) {
      if (salvata) return salvata;
      return fetch(r).then(function (risposta) {
        if (risposta && risposta.status === 200 && risposta.type === 'basic') {
          var copia = risposta.clone();
          caches.open(VERSIONE).then(function (c) { c.put(r, copia); });
        }
        return risposta;
      }).catch(function () {
        /* senza rete e senza copia: se e' una pagina, si torna al gioco */
        if (r.mode === 'navigate') return caches.match('./index.html');
        return new Response('', { status: 504, statusText: 'Non disponibile' });
      });
    })
  );
});
