# L'archivio condiviso

`schema.sql` si incolla una volta sola nel pannello di Supabase, in **SQL Editor**.

## Prima di eseguirlo
Nel pannello, **Authentication → Sign In / Providers**, va acceso **Anonymous sign-ins**:
i bambini non hanno email, quindi ogni dispositivo diventa un utente anonimo. Il codice
d'invito serve a decidere in quale gruppo entra.

## Dopo averlo eseguito
Creare il primo gruppo (ultima riga del file, da scommentare) mettendoci **un codice
vostro**. Quel codice si dice a voce o in un messaggio: non va scritto nel gioco né nel
repository.

## Le chiavi
Nel pannello, **Project Settings → API**, ci sono due chiavi. Servono per cose diverse:

| Chiave | Dove va | Si può pubblicare? |
|---|---|---|
| `anon` / publishable | dentro il gioco | **Sì**, è fatta per stare nel browser — ma solo perché le regole di accesso (RLS) la tengono a bada |
| `service_role` / secret | **da nessuna parte** | **No, mai.** Scavalca tutte le regole: chi ce l'ha legge e cancella tutto |

La `service_role` non va nel gioco, non va su GitHub, e non va mandata a nessuno.

## Perché è fatto così
Senza le regole di accesso in fondo a `schema.sql`, la chiave pubblica diventerebbe una
chiave che apre tutto. Con quelle: si leggono i giocatori del proprio gruppo (serve la
classifica) e si modificano solo i propri. Il codice d'invito non è leggibile nemmeno da
chi è già dentro, se no lo si passa in giro e "su invito" non vuol più dire niente.
