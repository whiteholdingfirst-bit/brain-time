# Come si passa Brain Time a qualcuno

**L'indirizzo e' uno solo:**

    https://whiteholdingfirst-bit.github.io/brain-time/

Si apre su computer, telefono e tablet, senza installare niente e senza registrarsi.

**La pagina che spiega come installarlo**, da mandare a chi non se la cava:

    https://whiteholdingfirst-bit.github.io/brain-time/installa.html

## I file qui dentro

| File | A cosa serve |
|---|---|
| `qr-brain-time-logo.png` | **quello da usare**: 1176x1176, col logo al centro |
| `qr-brain-time.png` | la versione senza logo, 984x984 |
| `qr-brain-time.svg` | senza logo, vettoriale: si ingrandisce quanto si vuole |
| `qr-matrice-h.txt` | i quadratini del codice **col logo** (correzione H, 41x41) |
| `qr-matrice.txt` | i quadratini della versione senza logo (correzione M, 33x33) |

Si ridisegnano con `strumenti/disegna-qr.ps1`, che prende la matrice e sputa il PNG.

## Il logo al centro non e' gratis

Un QR porta con se' una **correzione d'errore**: una parte dei quadratini serve a
ricostruire quelli rovinati o coperti. I livelli sono quattro; quello col logo usa il
piu' robusto, **H**, che regge fino al 30% del codice coperto. Il buco al centro e'
di 11 moduli su 41: **27% del lato, 7% dell'area**. C'e' margine, ed e' voluto.

> Se un domani si vuole il logo piu' grande: si puo', ma va **riletto** con un lettore
> di codici, e non a piena risoluzione &mdash; rimpicciolito. Un QR non smette di leggersi
> di colpo: comincia a non leggersi coi telefoni vecchi, da lontano, con poca luce, e
> tu non lo sai perche' chi non ci riesce non te lo viene a dire.

Questi due sono stati provati a **1176, 294 e 220 pixel** (fino a 4,5 pixel per quadratino):
rendono sempre l'indirizzo giusto.

> Attenzione alla **cornice bianca** attorno al codice, quattro quadretti per lato:
> e' parte del codice, non decorazione. Ritagliandola stretta molti telefoni si fermano.

## Che cosa NON si passa

La **pagina di famiglia** (l'artifact su claude.ai) non si condivide: contiene nomi, foto e
punteggi di chi gioca in casa. Il suo indirizzo non sta nel repository, e nemmeno il suo QR:
questo repo e' pubblico. Ai compagni si da' solo l'indirizzo pubblico qui sopra, che non
contiene nessun dato di nessuno.
