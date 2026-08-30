-- =============================================================
--  BRAIN TIME — struttura dell'archivio condiviso (Supabase)
--
--  Si incolla nel pannello di Supabase, in "SQL Editor", e si
--  esegue una volta sola. Crea le tabelle e — soprattutto — le
--  regole di accesso: senza quelle, chiunque abbia la chiave
--  pubblica leggerebbe i dati di tutti.
--
--  L'impianto in tre righe:
--    - si entra solo con un CODICE D'INVITO, dato da un adulto;
--    - ogni dispositivo e' un utente anonimo (niente email, niente
--      password: i bambini non ne hanno, e non gliele chiediamo);
--    - si vedono i giocatori del proprio gruppo (serve la classifica),
--      ma si possono modificare solo i propri.
-- =============================================================

-- ---------- i gruppi: un gruppo = una compagnia di amici ----------
create table if not exists gruppi (
  id        uuid primary key default gen_random_uuid(),
  nome      text not null,
  codice    text not null unique,          -- il codice d'invito, lo da' un adulto
  creato_il timestamptz not null default now()
);

-- ---------- chi sta in quale gruppo ----------
-- Un "utente" qui e' un dispositivo che ha inserito il codice.
create table if not exists membri (
  utente     uuid not null references auth.users(id) on delete cascade,
  gruppo     uuid not null references gruppi(id) on delete cascade,
  entrato_il timestamptz not null default now(),
  primary key (utente, gruppo)
);

-- ---------- i giocatori ----------
-- Solo quello che serve a far funzionare il gioco. Niente cognome,
-- niente data di nascita, niente indirizzo, niente foto, niente
-- messaggi: nel gioco non si scrive.
create table if not exists giocatori (
  id             uuid primary key default gen_random_uuid(),
  gruppo         uuid not null references gruppi(id) on delete cascade,
  proprietario   uuid not null default auth.uid() references auth.users(id) on delete cascade,

  soprannome     text not null check (char_length(soprannome) between 1 and 14),
  eta            int  not null check (eta between 3 and 18),
  avatar         text not null default 'fox',
  livello        text not null default 'elem5',

  xp             int not null default 0  check (xp >= 0),
  coppe          int not null default 30 check (coppe >= 0),
  risposte       int not null default 0  check (risposte >= 0),
  giuste         int not null default 0  check (giuste >= 0),
  record_partita int not null default 0,
  record_serie   int not null default 0,
  duelli_vinti   int not null default 0,
  duelli_giocati int not null default 0,

  zaino          jsonb not null default '{}'::jsonb,   -- aiuti
  sbloccati      jsonb not null default '{}'::jsonb,   -- avatar, titoli, temi
  titolo         text,
  tema           text  not null default 'azzurro',
  casse          jsonb not null default '{}'::jsonb,
  scoperte       jsonb not null default '[]'::jsonb,
  labirinto      jsonb not null default '{}'::jsonb,
  per_materia    jsonb not null default '{}'::jsonb,

  aggiornato_il  timestamptz not null default now()
);

create index if not exists giocatori_per_gruppo on giocatori (gruppo);
create index if not exists giocatori_per_proprietario on giocatori (proprietario);

-- l'ora dell'ultima modifica la mette il database, non il telefono:
-- serve a BT.fondi() per capire quale copia e' la piu' recente
create or replace function tocca_aggiornato_il()
returns trigger language plpgsql as $$
begin
  new.aggiornato_il := now();
  return new;
end;
$$;

drop trigger if exists giocatori_aggiornato on giocatori;
create trigger giocatori_aggiornato before update on giocatori
  for each row execute function tocca_aggiornato_il();

-- =============================================================
--  REGOLE DI ACCESSO
--  Da qui in giu' e' la parte che protegge i dati dei bambini.
--  Se si disattiva una di queste righe, la chiave pubblica del
--  gioco diventa una chiave che apre tutto.
-- =============================================================

alter table gruppi    enable row level security;
alter table membri    enable row level security;
alter table giocatori enable row level security;

-- --- gruppi: nessuno li legge direttamente. ---
-- Il codice d'invito non deve essere leggibile nemmeno da chi e'
-- gia' dentro: se no lo si passa in giro e "su invito" non vuol
-- piu' dire niente. Chi entra usa la funzione qui sotto.
-- (Nessuna policy = nessun accesso, che e' quello che vogliamo.)

-- --- membri: ognuno vede solo le proprie iscrizioni ---
drop policy if exists "vedo le mie iscrizioni" on membri;
create policy "vedo le mie iscrizioni" on membri
  for select using (utente = auth.uid());

-- --- giocatori ---
-- si LEGGONO quelli del proprio gruppo: e' la classifica
drop policy if exists "leggo il mio gruppo" on giocatori;
create policy "leggo il mio gruppo" on giocatori
  for select using (
    exists (select 1 from membri m
            where m.gruppo = giocatori.gruppo and m.utente = auth.uid())
  );

-- si CREANO solo dentro un gruppo di cui si fa parte
drop policy if exists "creo i miei" on giocatori;
create policy "creo i miei" on giocatori
  for insert with check (
    proprietario = auth.uid()
    and exists (select 1 from membri m
                where m.gruppo = giocatori.gruppo and m.utente = auth.uid())
  );

-- si MODIFICANO e si CANCELLANO solo i propri
drop policy if exists "cambio i miei" on giocatori;
create policy "cambio i miei" on giocatori
  for update using (proprietario = auth.uid())
          with check (proprietario = auth.uid());

drop policy if exists "cancello i miei" on giocatori;
create policy "cancello i miei" on giocatori
  for delete using (proprietario = auth.uid());

-- =============================================================
--  ENTRARE CON IL CODICE
--  Funzione "security definer": puo' guardare la tabella gruppi
--  anche se il giocatore non la puo' leggere. E' l'unico modo per
--  verificare un codice senza mostrare l'elenco dei codici.
-- =============================================================
create or replace function entra_nel_gruppo(codice_invito text)
returns table (gruppo_id uuid, gruppo_nome text)
language plpgsql
security definer
set search_path = public
as $$
declare g gruppi%rowtype;
begin
  if auth.uid() is null then
    raise exception 'Serve una sessione';
  end if;

  select * into g from gruppi where codice = codice_invito;
  if not found then
    raise exception 'Codice non valido';
  end if;

  insert into membri (utente, gruppo) values (auth.uid(), g.id)
    on conflict do nothing;

  gruppo_id := g.id;
  gruppo_nome := g.nome;
  return next;
end;
$$;

revoke all on function entra_nel_gruppo(text) from public, anon;
grant execute on function entra_nel_gruppo(text) to authenticated;

-- =============================================================
--  PRIMO GRUPPO
--  Da fare a mano, una volta, cambiando il codice con uno vostro.
--  Il codice va detto a voce o in un messaggio ai genitori: non
--  va scritto nel gioco ne' nel repository.
-- =============================================================
-- insert into gruppi (nome, codice) values ('Amici di scuola', 'CAMBIA-QUESTO-CODICE');
