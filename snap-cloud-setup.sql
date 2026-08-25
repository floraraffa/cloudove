-- Flying Messages: tablas para el proyecto Snap Cloud "Cloud Messages"
-- Pegar y ejecutar en el SQL Editor del dashboard de Supabase (una sola vez).

create table if not exists users (
  code text primary key,
  name text not null,
  lang text not null default 'es',
  created_at timestamptz default now()
);

create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  from_code text not null,
  from_name text,
  to_code text not null,
  text text not null,
  lang text not null default 'es',
  read boolean default false,
  created_at timestamptz default now()
);

-- Politicas abiertas para la hackathon (la anon key puede leer/escribir).
-- Para produccion se endurecen, pero para la demo esta bien asi.
alter table users enable row level security;
alter table messages enable row level security;

drop policy if exists "anon_all_users" on users;
create policy "anon_all_users" on users
  for all to anon using (true) with check (true);

drop policy if exists "anon_all_messages" on messages;
create policy "anon_all_messages" on messages
  for all to anon using (true) with check (true);

-- v2: cuentas por email (ejecutar una vez mas en el SQL Editor)
alter table users add column if not exists email text;
create unique index if not exists users_email_idx on users (lower(email));

-- v3: fotos adjuntas en los mensajes (ejecutar una vez en el SQL Editor)
alter table messages add column if not exists photo text;
